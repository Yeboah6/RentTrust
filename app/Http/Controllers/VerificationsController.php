<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Rental;
use App\Models\VerificationRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class VerificationsController extends Controller
{
    public function verifyAgent(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:verified,rejected,request_info',
        ]);

        $verify = User::findOrFail($id);
        $verify->update([
            'status' => $validated['status'],
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Agent status updated successfully');
    }

    public function suspendAgent(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:suspended,unverified',
        ]);

        $agent = User::findOrFail($id);
        $agent->update([
            'status' => $validated['status'],
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Agent status updated successfully');
    }

    public function store(Request $request)
    {
        Log::info('Verification request received', [
            'user_id' => Auth::id(),
            'rental_id' => $request->rental_id,
            'request_type' => $request->request_type
        ]);

        // Validation
        $validator = Validator::make($request->all(), [
            'rental_id' => 'required|exists:rentals,id',
            'request_type' => 'required|in:initial_verification,re_verification',
            'additional_notes' => 'nullable|string|max:1000',
            'agent_id' => 'required',
            'agent_name' => 'required|string|max:255',
            
            // File validations - updated field names to match frontend
            'proof_docs.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
            'ownership_documents.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240', // Changed from ownership_docs
            'utility_bills.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
        ], [
            'rental_id.required' => 'Please select a rental property',
            'rental_id.exists' => 'The selected rental property does not exist',
            'proof_docs.*.max' => 'Each proof document must not exceed 10MB',
            'ownership_documents.*.max' => 'Each property photo must not exceed 10MB',
            'utility_bills.*.max' => 'Each utility bill must not exceed 10MB',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Check if rental exists
            $rental = Rental::findOrFail($request->rental_id);
            
            // Check if user is authorized (owner or assigned agent)
            $isOwner = $rental->user_id == Auth::id();
            $isAgent = $rental->agent_id == $request->agent_id;
            
            if (!$isOwner && !$isAgent) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to verify this property'
                ], 403);
            }

            // Check for existing pending request
            $existingRequest = VerificationRequest::where('rental_id', $request->rental_id)
                ->where('status', 'pending')
                ->first();

            if ($existingRequest) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'A verification request for this property is already pending review'
                ], 409);
            }

            // Process and store uploaded files
            $uploadedFiles = [
                'proof_documents' => $this->handleFileUploads($request, 'proof_docs', 'verification_docs/proof'),
                'ownership_documents' => $this->handleFileUploads($request, 'ownership_documents', 'verification_docs/property_photos'), // Changed
                'utility_bills' => $this->handleFileUploads($request, 'utility_bills', 'verification_docs/utility_bills'),
            ];

            // Count total documents
            $totalDocuments = array_sum(array_map('count', $uploadedFiles));

            if ($totalDocuments === 0) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Please upload at least one document'
                ], 422);
            }

            // Create verification request
            $verificationRequest = VerificationRequest::create([
                'rental_id' => $request->rental_id,
                'agent_id' => $request->agent_id,
                'agent_name' => $request->agent_name,
                'request_type' => $request->request_type,
                'status' => 'pending',
                'proof_documents' => json_encode($uploadedFiles['proof_documents']),
                'ownership_documents' => json_encode($uploadedFiles['ownership_documents']), // Changed
                'utility_bills' => json_encode($uploadedFiles['utility_bills']),
                'additional_notes' => $request->additional_notes,
                'submitted_at' => now(),
                'user_id' => Auth::id(), // Store the user who submitted
            ]);

            // Update rental status to indicate verification is pending
            $rental->update([
                'verification_status' => 'pending',
                'verification_requested_at' => now()
            ]);

            DB::commit();

            Log::info('Verification request created successfully', [
                'request_id' => $verificationRequest->id,
                'rental_id' => $rental->id,
                'total_documents' => $totalDocuments
            ]);

            // TODO: Send notification email to admin
            // TODO: Send confirmation email to agent

            return redirect()->back()
                ->with('success', 'Rental listing created successfully! It will be reviewed and activated soon.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Verification request submission failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'rental_id' => $request->rental_id
            ]);

            return redirect()->back()
                ->with('error', 'Failed to create rental listing. Please try again.')
                ->withInput();
        }
    }

    private function handleFileUploads(Request $request, $fieldName, $storagePath)
    {
        $uploadedFiles = [];

        if ($request->hasFile($fieldName)) {
            foreach ($request->file($fieldName) as $file) {
                try {
                    // Generate unique filename
                    $filename = time() . '_' . uniqid() . '_' . preg_replace('/[^A-Za-z0-9\.]/', '_', $file->getClientOriginalName());
                    
                    // Store file
                    $path = $file->storeAs($storagePath, $filename, 'public');
                    
                    if ($path) {
                        $uploadedFiles[] = [
                            'filename' => $filename,
                            'original_name' => $file->getClientOriginalName(),
                            'path' => $path,
                            'url' => Storage::disk('public')->url($path),
                            'size' => $file->getSize(),
                            'mime_type' => $file->getMimeType(),
                            'uploaded_at' => now()->toDateTimeString()
                        ];
                    }
                } catch (\Exception $e) {
                    Log::error('File upload failed', [
                        'field' => $fieldName,
                        'filename' => $file->getClientOriginalName(),
                        'error' => $e->getMessage()
                    ]);
                    // Continue with other files
                }
            }
        }

        return $uploadedFiles;
    }

    public function index(Request $request)
    {
        try {
            $query = VerificationRequest::query();
            
            // Check if user is admin
            if (Auth::user()->is_admin ?? false) {
                // Admin can see all requests
                $requests = $query->with(['rental:id,title,area,city', 'user:id,name,email'])
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);
            } else {
                // Regular users/agents only see their own requests
                $requests = $query->where('agent_id', Auth::id())
                    ->orWhere('user_id', Auth::id())
                    ->with('rental:id,title,area,city')
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);
            }

            return response()->json([
                'success' => true,
                'data' => $requests
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch verification requests', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to load verification requests'
            ], 500);
        }
    }

    /**
     * Get a specific verification request
     */
    public function show($id)
    {
        try {
            $request = VerificationRequest::with(['rental', 'user:id,name,email'])->findOrFail($id);

            // Check authorization
            $isOwner = $request->agent_id == Auth::id() || $request->user_id == Auth::id();
            $isAdmin = Auth::user()->is_admin ?? false;
            
            if (!$isOwner && !$isAdmin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access'
                ], 403);
            }

            // Parse JSON fields
            $request->proof_documents = json_decode($request->proof_documents, true) ?? [];
            $request->ownership_documents = json_decode($request->ownership_documents, true) ?? []; // Changed
            $request->utility_bills = json_decode($request->utility_bills, true) ?? [];

            // Add full URLs for files
            foreach (['proof_documents', 'ownership_documents', 'utility_bills'] as $field) {
                if (is_array($request->$field)) {
                    foreach ($request->$field as &$file) {
                        if (isset($file['path']) && !isset($file['url'])) {
                            $file['url'] = Storage::disk('public')->url($file['path']);
                        }
                    }
                }
            }

            return response()->json([
                'success' => true,
                'data' => $request
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch verification request', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Verification request not found'
            ], 404);
        }
    }

    /**
     * Update verification request status (Admin only)
     */
    public function updateStatus(Request $request, $id)
    {
        // Check if user is admin
        if (!(Auth::guard('super')->check())) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,rejected,pending',
            'admin_notes' => 'nullable|string|max:1000',
            'rejection_reason' => 'required_if:status,rejected|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $verificationRequest = VerificationRequest::findOrFail($id);
            
            $verificationRequest->update([
                'status' => $request->status,
                'admin_notes' => $request->admin_notes,
                'rejection_reason' => $request->rejection_reason,
                'reviewed_at' => now(),
                'reviewed_by' => Auth::id()
            ]);

            // Update rental verification status
            $rental = Rental::find($verificationRequest->rental_id);
            if ($rental) {
                if ($request->status === 'approved') {
                    $rental->update([
                        'verification_status' => 'verified',
                        'status' => 'approved',
                        'verified_at' => now(),
                        'is_verified' => true
                    ]);
                } elseif ($request->status === 'rejected') {
                    $rental->update([
                        'verification_status' => 'rejected',
                        'status' => 'rejected',
                        'verification_rejected_at' => now(),
                        'verification_rejection_reason' => $request->rejection_reason
                    ]);
                } else {
                    // If status changed back to pending
                    $rental->update([
                        'verification_status' => 'pending',
                        'status' => 'pending',
                    ]);
                }

            DB::commit();

            Log::info('Verification request status updated', [
                'request_id' => $id,
                'new_status' => $request->status,
                'reviewed_by' => Auth::id()
            ]);

            }

            // TODO: Send notification email to agent

            // return response()->json([
            //     'success' => true,
            //     'message' => "Verification request {$request->status} successfully",
            //     'data' => $verificationRequest
            // ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to update verification status', [
                'error' => $e->getMessage(),
                'request_id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update verification status'
            ], 500);
        }
    }

    /**
     * Delete/Cancel a verification request
     */
    public function destroy($id)
    {
        try {
            $verificationRequest = VerificationRequest::findOrFail($id);

            // Check authorization
            $isOwner = $verificationRequest->agent_id == Auth::id() || $verificationRequest->user_id == Auth::id();
            $isAdmin = Auth::user()->is_admin ?? false;
            
            if (!$isOwner && !$isAdmin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access'
                ], 403);
            }

            // Regular users can only cancel pending requests
            if (!$isAdmin && $verificationRequest->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending requests can be cancelled'
                ], 400);
            }

            DB::beginTransaction();

            // Delete associated files
            $this->deleteRequestFiles($verificationRequest);

            // Update rental status if pending
            if ($verificationRequest->status === 'pending') {
                $rental = Rental::find($verificationRequest->rental_id);
                if ($rental && $rental->verification_status === 'pending') {
                    $rental->update([
                        'verification_status' => null,
                        'verification_requested_at' => null
                    ]);
                }
            }

            $verificationRequest->delete();

            DB::commit();

            Log::info('Verification request deleted', [
                'request_id' => $id,
                'deleted_by' => Auth::id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Verification request deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to delete verification request', [
                'error' => $e->getMessage(),
                'request_id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete verification request'
            ], 500);
        }
    }

    /**
     * Delete files associated with a verification request
     */
    private function deleteRequestFiles($verificationRequest)
    {
        $fileFields = ['proof_documents', 'ownership_documents', 'utility_bills']; // Updated fields

        foreach ($fileFields as $field) {
            $files = json_decode($verificationRequest->$field, true) ?? [];
            
            foreach ($files as $file) {
                if (isset($file['path']) && Storage::disk('public')->exists($file['path'])) {
                    try {
                        Storage::disk('public')->delete($file['path']);
                    } catch (\Exception $e) {
                        Log::warning('Failed to delete file', [
                            'path' => $file['path'],
                            'error' => $e->getMessage()
                        ]);
                    }
                }
            }
        }
    }

    /**
     * Get verification requests for a specific rental
     */
    public function getRentalRequests($rentalId)
    {
        try {
            $rental = Rental::findOrFail($rentalId);
            
            // Check authorization
            $isOwner = $rental->user_id == Auth::id();
            $isAgent = $rental->agent_id == Auth::id();
            $isAdmin = Auth::user()->is_admin ?? false;
            
            if (!$isOwner && !$isAgent && !$isAdmin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access'
                ], 403);
            }

            $requests = VerificationRequest::where('rental_id', $rentalId)
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $requests
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch rental verification requests', [
                'rental_id' => $rentalId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to load verification requests'
            ], 500);
        }
    }
}