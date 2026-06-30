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
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class VerificationsController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Verification request received', [
            'user_id'     => Auth::id(),
            'rental_id'   => $request->rental_id,
            'request_type'=> $request->request_type
        ]);
    
        // ---------- Validation ----------
        $validator = Validator::make($request->all(), [
            'rental_id' => ['required', function ($attribute, $value, $fail) {
                if (!Rental::where('rental_id', $value)->orWhere('id', $value)->exists()) {
                    $fail('The selected rental property does not exist');
                }
            }],
            'request_type'      => 'required|in:initial_verification,re_verification',
            'additional_notes'  => 'nullable|string|max:1000',
            'agent_id'          => 'required|exists:users,id',
            'agent_name'        => 'required|string|max:255',
            'proof_docs'        => 'nullable|array',
            'proof_docs.*'      => 'file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
            'ownership_documents' => 'nullable|array',
            'ownership_documents.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
            'license_documents' => 'nullable|array',
            'license_documents.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
            'utility_bills'     => 'nullable|array',
            'utility_bills.*'   => 'file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
        ]);
    
        // At least one document required
        $validator->after(function ($validator) use ($request) {
            $hasFile = false;
            foreach (['proof_docs', 'ownership_documents', 'license_documents', 'utility_bills'] as $field) {
                if ($request->hasFile($field) && count($request->file($field, [])) > 0) {
                    $hasFile = true;
                    break;
                }
            }
            if (!$hasFile) {
                $validator->errors()->add('documents', 'Please upload at least one document');
            }
        });
    
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }
    
        // ---------- Authorisation ----------
        $rental = Rental::where('rental_id', $request->rental_id)->orWhere('id', $request->rental_id)->firstOrFail();
        $agent  = User::findOrFail($request->agent_id);
    
        $isOwner = $rental->user_id == Auth::id();
        $isAgent = Auth::id() == $request->agent_id;
        $isAdmin = Auth::user() && Auth::user()->role === 'super_admin';
    
        if (!$isOwner && !$isAgent && !$isAdmin) {
            return redirect()->back()->with('error', 'You do not have permission to verify this property');
        }
    
        // Duplicate pending request
        if (VerificationRequest::where('rental_id', $rental->id)->where('status', 'pending')->exists()) {
            return redirect()->back()->with('error', 'A verification request is already pending for this property');
        }
    
        // Already verified with initial_verification
        if ($rental->is_verified && $request->request_type === 'initial_verification') {
            return redirect()->back()->with('error', 'This property is already verified. Use re-verification for updates');
        }
    
        // ---------- File upload ----------
        DB::beginTransaction();
        $uploadedPaths = [];
    
        try {
            $fileData = [
                'proof_documents'     => [],
                'ownership_documents' => [],
                'license_documents'   => [],
                'utility_bills'      => []
            ];
    
            $fieldMap = [
                'proof_docs'           => 'proof_documents',
                'ownership_documents'  => 'ownership_documents',
                'license_documents'    => 'license_documents',
                'utility_bills'       => 'utility_bills'
            ];
    
            foreach ($fieldMap as $inputName => $dbColumn) {
                if ($request->hasFile($inputName)) {
                    foreach ($request->file($inputName) as $file) {
                        $filename = time() . '_' . uniqid() . '_' . preg_replace('/[^A-Za-z0-9\.]/', '_', $file->getClientOriginalName());
                        $path = $file->storeAs("verification_docs/{$dbColumn}", $filename, 'public');
                        $fileData[$dbColumn][] = [
                            'filename'      => $filename,
                            'original_name' => $file->getClientOriginalName(),
                            'path'          => $path,
                            'url'           => Storage::disk('public')->url($path),
                            'size'          => $file->getSize(),
                            'mime_type'     => $file->getMimeType(),
                            'uploaded_at'   => now()->toDateTimeString()
                        ];
                        $uploadedPaths[] = $path;
                    }
                }
            }
    
            if (array_sum(array_map('count', $fileData)) === 0) {
                DB::rollBack();
                return redirect()->back()->with('error', 'Please upload at least one document');
            }
    
            // ---------- Store verification request (status = pending) ----------
            $verificationRequest = VerificationRequest::create([
                'verification_request_id' => VerificationRequest::generateUUID(),
                'rental_id'               => $rental->id,
                'agent_id'                => $request->agent_id,
                'agent_name'              => $request->agent_name,
                'request_type'            => $request->request_type,
                'status'                  => 'pending',
                'proof_documents'         => json_encode($fileData['proof_documents']),
                'ownership_documents'     => json_encode($fileData['ownership_documents']),
                'license_documents'       => json_encode($fileData['license_documents']),
                'utility_bills'           => json_encode($fileData['utility_bills']),
                'additional_notes'        => $request->additional_notes,
                'submitted_at'            => now(),
                'user_id'                 => Auth::id(),
            ]);
    
            // ---------- Update rental status to pending ----------
            $rental->update([
                'status'           => 'pending',
                // 'verification_requested_at'     => now(),
                'verification_rejected_at'      => null,
                'verification_rejection_reason' => null
            ]);
    
            DB::commit();
    
            Log::info('Verification request stored', [
                'request_id' => $verificationRequest->verification_request_id,
                'rental_id'  => $rental->rental_id,
                'submitted_by' => Auth::id()
            ]);
    
            return redirect()->back()->with('success', 'Verification request submitted successfully! It will be reviewed soon.');
    
        } catch (\Exception $e) {
            DB::rollBack();
    
            // Clean up any stored files
            foreach ($uploadedPaths as $path) {
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }
    
            Log::error('Verification request failed', [
                'error' => $e->getMessage(),
                'rental_id' => $request->rental_id
            ]);
    
            return redirect()->back()->with('error', 'Failed to submit verification request. Please try again.');
        }
    }

    public function verificationStatus(Rental $id): JsonResponse
    {
        if (!$id) {
            return response()->json(['status' => 'none'], 404);
        }

        $verification = VerificationRequest::withoutGlobalScopes()
            ->where('rental_id', $id)          // or $id->id depending on your parameter name
            ->whereIn('status', ['pending', 'approved'])
            ->latest()
            ->first();

        return response()->json([
            'status' => $verification
        ]);
    }


    // Super Admin Verification
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