<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Rental;
use App\Models\VerificationRequest;
use App\Notifications\VerificationApprovedNotification;
use App\Notifications\VerificationRejectedNotification;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\AdminAuditLog;
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
        $oldStatus = $verify->status;
        $verify->update([
            'status' => $validated['status'],
            'updated_at' => now(),
        ]);

        // Audit log
        AdminAuditLog::record('verification', "Agent verification status changed to {$validated['status']}", [
            'affected_user' => $verify->name,
            'affected_id' => $verify->id,
            'notes' => "Status changed from {$oldStatus} to {$validated['status']}",
            'properties' => ['old_status' => $oldStatus, 'new_status' => $validated['status']],
        ]);

        return redirect()->back()->with('success', 'Agent status updated successfully');
    }

    public function suspendAgent(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:suspended,unverified',
        ]);

        $agent = User::findOrFail($id);
        $oldStatus = $agent->status;
        $agent->update([
            'status' => $validated['status'],
            'updated_at' => now(),
        ]);

        // Audit log
        AdminAuditLog::record('suspension', "Agent suspended: {$agent->name}", [
            'affected_user' => $agent->name,
            'affected_id' => $agent->id,
            'notes' => "Agent status changed from {$oldStatus} to {$validated['status']}",
            'properties' => ['old_status' => $oldStatus, 'new_status' => $validated['status']],
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
            'rental_id' => ['required', function ($attribute, $value, $fail) {
                if (!Rental::where('rental_id', $value)->orWhere('id', $value)->exists()) {
                    $fail('The selected rental property does not exist');
                }
            }],
            'request_type' => 'required|in:initial_verification,re_verification',
            'additional_notes' => 'nullable|string|max:1000',
            'agent_id' => 'required|exists:users,id',
            'agent_name' => 'required|string|max:255',

            // File validations - all now optional but at least one required
            'proof_docs' => 'nullable|array',
            'proof_docs.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
            'ownership_documents' => 'nullable|array',
            'ownership_documents.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
            'license_documents' => 'nullable|array',
            'license_documents.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
            'utility_bills' => 'nullable|array',
            'utility_bills.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
        ], [
            'rental_id.required' => 'Please select a rental property',
            'rental_id.exists' => 'The selected rental property does not exist',
            'agent_id.required' => 'Agent ID is required',
            'agent_id.exists' => 'The selected agent does not exist',
            'proof_docs.*.max' => 'Each proof document must not exceed 10MB',
            'ownership_documents.*.max' => 'Each property photo must not exceed 10MB',
            'license_documents.*.max' => 'Each license document must not exceed 10MB',
            'utility_bills.*.max' => 'Each utility bill must not exceed 10MB',
        ]);

        // Custom validation: ensure at least one document is uploaded
        $validator->after(function ($validator) use ($request) {
            $hasProofDocs = $request->hasFile('proof_docs') && count($request->file('proof_docs', [])) > 0;
            $hasOwnershipDocs = $request->hasFile('ownership_documents') && count($request->file('ownership_documents', [])) > 0;
            $hasLicenseDocs = $request->hasFile('license_documents') && count($request->file('license_documents', [])) > 0;
            $hasUtilityBills = $request->hasFile('utility_bills') && count($request->file('utility_bills', [])) > 0;

            if (!$hasProofDocs && !$hasOwnershipDocs && !$hasLicenseDocs && !$hasUtilityBills) {
                $validator->errors()->add('documents', 'Please upload at least one document to verify your listing');
            }
        });

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            DB::beginTransaction();

            // Check if rental exists
            $rental = Rental::where('rental_id', $request->rental_id)
                ->orWhere('id', $request->rental_id)
                ->firstOrFail();

            // Verify agent exists
            $agent = User::findOrFail($request->agent_id);

            // Check if user is authorized (owner or assigned agent)
            $isOwner = $rental->user_id == Auth::id();
            $isAgent = Auth::id() == $request->agent_id;
            $isAdmin = Auth::user() && Auth::user()->role === 'super_admin';

            if (!$isOwner && !$isAgent && !$isAdmin) {
                DB::rollBack();
                return redirect()->back()
                    ->with('error', 'You do not have permission to verify this property');
            }

            // Check for existing pending request
            $existingRequest = VerificationRequest::where('rental_id', $rental->id)
                ->where('status', 'pending')
                ->first();

            if ($existingRequest) {
                DB::rollBack();
                return redirect()->back()
                    ->with('error', 'A verification request for this property is already pending review');
            }

            // Check if rental is already verified
            if ($rental->is_verified && $request->request_type === 'initial_verification') {
                DB::rollBack();
                return redirect()->back()
                    ->with('error', 'This property is already verified. Use re-verification for updates');
            }

            // Process and store uploaded files
            $uploadedFiles = [
                'proof_documents' => $this->handleFileUploads($request, 'proof_docs', 'verification_docs/proof'),
                'ownership_documents' => $this->handleFileUploads($request, 'ownership_documents', 'verification_docs/property_photos'),
                'license_documents' => $this->handleFileUploads($request, 'license_documents', 'verification_docs/licenses'),
                'utility_bills' => $this->handleFileUploads($request, 'utility_bills', 'verification_docs/utility_bills'),
            ];

            // Count total documents
            $totalDocuments = array_sum(array_map('count', $uploadedFiles));

            if ($totalDocuments === 0) {
                DB::rollBack();
                return redirect()->back()
                    ->with('error', 'Please upload at least one document');
            }

            // Create verification request
            $verificationRequest = VerificationRequest::create([
                'verification_request_id' => VerificationRequest::generateUUID(),
                'rental_id' => $rental->id,
                'agent_id' => $request->agent_id,
                'agent_name' => $request->agent_name,
                'request_type' => $request->request_type,
                'status' => 'pending',
                'proof_documents' => json_encode($uploadedFiles['proof_documents']),
                'ownership_documents' => json_encode($uploadedFiles['ownership_documents']),
                'license_documents' => json_encode($uploadedFiles['license_documents']),
                'utility_bills' => json_encode($uploadedFiles['utility_bills']),
                'additional_notes' => $request->additional_notes,
                'submitted_at' => now(),
                'user_id' => Auth::id(),
            ]);

            // Auto-approve for trusted agents (3+ successful verifications)
            $successfulVerifications = VerificationRequest::where('agent_id', $request->agent_id)
                ->where('status', 'approved')
                ->count();

            if ($successfulVerifications >= 3) {
                // Auto-approve the request
                $verificationRequest->update([
                    'status' => 'approved',
                    'admin_notes' => 'Auto-approved: Trusted agent with proven verification history',
                    'reviewed_at' => now(),
                    'reviewed_by' => 1, // System user ID
                ]);

                // Update rental to verified status
                $rental->update([
                    'verification_status' => 'verified',
                    'is_verified' => true,
                    'verified_at' => now(),
                    'status' => 'approved',
                    'verification_rejected_at' => null,
                    'verification_rejection_reason' => null
                ]);

                // Audit log for auto-approval
                AdminAuditLog::record('verification', "Listing verification auto-approved: {$rental->title}", [
                    'affected_user' => $rental->user->name ?? 'Unknown',
                    'affected_id' => $rental->id,
                    'notes' => "Auto-approved for trusted agent {$request->agent_name} with {$successfulVerifications} previous successful verifications",
                    'properties' => ['status' => 'auto_approved', 'listing_id' => $rental->id, 'verification_request_id' => $verificationRequest->verification_request_id],
                ]);

                Log::info('Verification auto-approved for trusted agent', [
                    'rental_id' => $rental->rental_id,
                    'agent_id' => $request->agent_id,
                    'successful_verifications' => $successfulVerifications,
                    'verification_request_id' => $verificationRequest->verification_request_id
                ]);
            } else {
                // Update rental status to indicate verification is pending
                $rental->update([
                    'verification_status' => 'pending',
                    'verification_requested_at' => now(),
                    'verification_rejected_at' => null,
                    'verification_rejection_reason' => null
                ]);
            }

            DB::commit();

            Log::info('Verification request created successfully', [
                'request_id' => $verificationRequest->verification_request_id,
                'rental_id' => $rental->rental_id,
                'agent_id' => $request->agent_id,
                'request_type' => $request->request_type,
                'total_documents' => $totalDocuments,
                'submitted_by' => Auth::id()
            ]);

            // Return appropriate success message
            $successMessage = $verificationRequest->status === 'approved'
                ? 'Verification request auto-approved! Your listing is now verified and published.'
                : 'Verification request submitted successfully! It will be reviewed soon.';

            return redirect()->back()
                ->with('success', $successMessage);

        } catch (\Exception $e) {
            DB::rollBack();

            // Clean up uploaded files when the request fails after file storage
            if (!empty($uploadedFiles ?? [])) {
                $this->cleanupUploadedFiles($uploadedFiles);
            }

            Log::error('Verification request submission failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'rental_id' => $request->rental_id
            ]);

            return redirect()->back()
                ->with('error', 'Failed to submit verification request. Please try again.');
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

    private function cleanupUploadedFiles(array $uploadedFiles): void
    {
        foreach ($uploadedFiles as $category => $files) {
            if (!is_array($files)) continue;

            foreach ($files as $file) {
                if (isset($file['path']) && Storage::disk('public')->exists($file['path'])) {
                    try {
                        Storage::disk('public')->delete($file['path']);
                    } catch (\Exception $e) {
                        Log::warning('Failed to delete orphaned verification upload', [
                            'path' => $file['path'],
                            'error' => $e->getMessage()
                        ]);
                    }
                }
            }
        }
    }

    public function index(Request $request)
    {
        try {
            $query = VerificationRequest::query();

            // Check if user is admin
            if (Auth::check() && Auth::user()->role === 'super_admin') {
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

    public function show($id)
    {
        try {
            $request = VerificationRequest::with(['rental', 'user:id,name,email'])->findOrFail($id);

            // Check authorization
            $isOwner = $request->agent_id == Auth::id() || $request->user_id == Auth::id();
            $isAdmin = Auth::check() && Auth::user()->role === 'super_admin';
            
            if (!$isOwner && !$isAdmin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access'
                ], 403);
            }

            // Parse JSON fields
            $request->proof_documents = json_decode($request->proof_documents, true) ?? [];
            $request->ownership_documents = json_decode($request->ownership_documents, true) ?? [];
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

    public function updateStatus(Request $request, $id)
    {
        // ──── Authorization Check ────
        if (!Auth::check() || !in_array(Auth::user()->role, ['admin', 'super_admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }
 
        // ──── Input Validation ────
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
 
            // ──── Fetch and Lock Record ────
            $verificationRequest = VerificationRequest::findOrFail($id);
            
            // ──── Idempotency Check: Prevent duplicate processing ────
            if ($verificationRequest->status !== 'pending') {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Verification already reviewed by another admin. Please refresh and try again.',
                    'current_status' => $verificationRequest->status
                ], 409);
            }
 
            $oldStatus = $verificationRequest->status;
 
            // ──── Sanitize Input ────
            $adminNotes = $request->admin_notes 
                ? strip_tags($request->admin_notes) 
                : null;
            
            $rejectionReason = $request->status === 'rejected' && $request->rejection_reason
                ? strip_tags($request->rejection_reason)
                : null;
 
            // ──── Log Technical Details (for debugging) ────
            Log::info('Admin updating verification request status', [
                'request_id' => $verificationRequest->verification_request_id,
                'old_status' => $oldStatus,
                'new_status' => $request->status,
                'admin_id' => Auth::id()
            ]);
 
            // ──── Update Verification Request ────
            $verificationRequest->update([
                'status' => $request->status,
                'admin_notes' => $adminNotes,
                'rejection_reason' => $rejectionReason,
                'reviewed_at' => now(),
                'reviewed_by' => Auth::id()
            ]);
 
            // ──── Fetch and Update Related Rental ────
            $rental = Rental::findOrFail($verificationRequest->rental_id);
            
            // ──── Process Based on Status ────
            if ($request->status === 'approved') {
                $this->handleApproval($rental, $verificationRequest);
            } elseif ($request->status === 'rejected') {
                $this->handleRejection($rental, $verificationRequest, $rejectionReason);
            } else {
                $this->handlePending($rental, $verificationRequest);
            }
 
            DB::commit();
 
            // ──── Send Notifications ────
            try {
                $this->sendNotifications($rental, $request->status, $rejectionReason);
            } catch (\Exception $e) {
                // Log notification failure but don't fail the entire request
                Log::warning('Failed to send verification notification', [
                    'rental_id' => $rental->id,
                    'status' => $request->status,
                    'error' => $e->getMessage()
                ]);
            }
 
            return response()->json([
                'success' => true,
                'message' => "Verification request {$request->status} successfully",
                'data' => $verificationRequest->refresh()
            ]);
 
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            Log::warning('Verification request not found', ['id' => $id, 'admin_id' => Auth::id()]);
            
            return response()->json([
                'success' => false,
                'message' => 'Verification request not found'
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
 
            // ──── Environment-aware logging ────
            $logData = [
                'error' => $e->getMessage(),
                'request_id' => $id,
                'admin_id' => Auth::id()
            ];
            
            // Only log full trace in non-production or if needed for debugging
            if (!app()->environment('production')) {
                $logData['trace'] = $e->getTraceAsString();
            }
            
            Log::error('Failed to update verification status', $logData);
 
            return response()->json([
                'success' => false,
                'message' => 'Failed to update verification status'
            ], 500);
        }
    }

    /**
     * Handle approval workflow
     */
    private function handleApproval(Rental $rental, VerificationRequest $verificationRequest)
    {
        $rental->update([
            'verification_status' => 'verified',
            'is_verified' => true,
            'verified_at' => now(),
            'status' => 'approved',
            'verification_rejected_at' => null,
            'verification_rejection_reason' => null
        ]);
        
        // ──── Audit Log with Structured Data ────
        $this->recordAuditLog(
            'verification_approved',
            "Listing verification approved: {$rental->title}",
            [
                'affected_user' => $rental->user->name ?? 'Unknown',
                'affected_id' => $rental->id,
                'verification_request_id' => $verificationRequest->verification_request_id,
                'status' => 'approved',
                'listing_id' => $rental->id
            ]
        );
        
        Log::info('Rental verification approved', [
            'rental_id' => $rental->id,
            'verification_request_id' => $verificationRequest->verification_request_id
        ]);
    }

    /**
     * Handle rejection workflow
     */
    private function handleRejection(Rental $rental, VerificationRequest $verificationRequest, $rejectionReason)
    {
        $rental->update([
            'verification_status' => 'rejected',
            'is_verified' => false,
            'verification_rejected_at' => now(),
            'verification_rejection_reason' => $rejectionReason,
            'status' => 'rejected'
        ]);
        
        // ──── Audit Log with Structured Data ────
        $this->recordAuditLog(
            'verification_rejected',
            "Listing verification rejected: {$rental->title}",
            [
                'affected_user' => $rental->user->name ?? 'Unknown',
                'affected_id' => $rental->id,
                'verification_request_id' => $verificationRequest->verification_request_id,
                'status' => 'rejected',
                'reason' => $rejectionReason,
                'listing_id' => $rental->id
            ]
        );
        
        Log::warning('Rental verification rejected', [
            'rental_id' => $rental->id,
            'reason' => $rejectionReason,
            'verification_request_id' => $verificationRequest->verification_request_id
        ]);
    }
 
    /**
     * Handle pending status revert
     */
    private function handlePending(Rental $rental, VerificationRequest $verificationRequest)
    {
        $rental->update([
            'verification_status' => 'pending',
            'status' => 'pending',
            'verified_at' => null
        ]);
        
        // ──── Audit Log with Structured Data ────
        $this->recordAuditLog(
            'verification_reverted',
            "Listing verification reverted to pending: {$rental->title}",
            [
                'affected_user' => $rental->user->name ?? 'Unknown',
                'affected_id' => $rental->id,
                'verification_request_id' => $verificationRequest->verification_request_id,
                'status' => 'pending',
                'listing_id' => $rental->id
            ]
        );
    }
 
    /**
     * Record audit log with proper error handling
     */
    private function recordAuditLog($action, $description, $properties)
    {
        try {
            // Ensure transaction is active
            if (DB::transactionLevel() === 0) {
                DB::beginTransaction();
            }
            
            AdminAuditLog::create([
                'action' => $action,
                'description' => $description,
                'admin_id' => Auth::id(),
                'affected_user' => $properties['affected_user'] ?? null,
                'affected_id' => $properties['affected_id'] ?? null,
                'properties' => $properties,
                'ip_address' => request()->ip(),
                'user_agent' => request()->header('User-Agent'),
                'created_at' => now()
            ]);
        } catch (\Exception $e) {
            // Don't let audit log failure break the main transaction
            Log::error('Failed to record audit log', [
                'error' => $e->getMessage(),
                'action' => $action
            ]);
            throw $e; // Re-throw so main transaction is rolled back
        }
    }
 
    /**
     * Send appropriate notifications to agent/user
     */
    private function sendNotifications(Rental $rental, $status, $rejectionReason = null)
    {
        $agent = $rental->agent;
        
        if (!$agent) {
            Log::warning('No agent found for rental', ['rental_id' => $rental->id]);
            return;
        }
 
        if ($status === 'approved') {
            $agent->notify(new VerificationApprovedNotification($rental));
        } elseif ($status === 'rejected') {
            $agent->notify(new VerificationRejectedNotification($rental, $rejectionReason));
        }
    }

    public function destroy($id)
    {
        try {
            $verificationRequest = VerificationRequest::findOrFail($id);

            // Check authorization
            $isOwner = $verificationRequest->agent_id == Auth::id() || $verificationRequest->user_id == Auth::id();
            $isAdmin = Auth::check() && Auth::user()->role === 'super_admin';
            
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

    private function deleteRequestFiles($verificationRequest)
    {
        $fileFields = ['proof_documents', 'ownership_documents', 'utility_bills'];

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

    public function getRentalRequests($rentalId)
    {
        try {
            $rental = Rental::findOrFail($rentalId);

            // Check authorization
            $isOwner = $rental->user_id == Auth::id();
            $isAgent = isset($rental->agent_id) && $rental->agent_id == Auth::id();
            $isAdmin = Auth::check() && Auth::user()->role === 'super_admin';
            
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

    /**
     * Get verification status description
     */
    private function getStatusDescription($status)
    {
        $descriptions = [
            'pending' => 'Awaiting admin review',
            'approved' => 'Property verified',
            'rejected' => 'Verification failed - resubmit required',
        ];

        return $descriptions[$status] ?? $status;
    }

    /**
     * Check if a rental can be verified
     */
    private function canRentalBeVerified(Rental $rental, $requestType = 'initial_verification')
    {
        $errors = [];

        // Check if rental has required fields
        if (empty($rental->title)) {
            $errors[] = 'Rental must have a title';
        }
        if (empty($rental->address)) {
            $errors[] = 'Rental must have an address';
        }
        if (empty($rental->images)) {
            $errors[] = 'Rental must have at least one image';
        }

        // Check initial verification requirements
        if ($requestType === 'initial_verification' && $rental->is_verified) {
            $errors[] = 'This property is already verified';
        }

        return [
            'can_verify' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Get document statistics for a verification request
     */
    private function getDocumentStats(VerificationRequest $request)
    {
        $documents = $request->getAllDocuments();
        $stats = [];

        foreach ($documents as $type => $docs) {
            $stats[$type] = [
                'count' => count($docs),
                'total_size' => array_sum(array_column($docs, 'size', )),
            ];
        }

        return $stats;
    }
}