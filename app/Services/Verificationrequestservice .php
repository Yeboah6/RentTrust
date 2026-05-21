<?php

namespace App\Services;

use App\Models\VerificationRequest;
use App\Models\Rental;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;
use Ramsey\Uuid\Uuid;

class VerificationRequestService
{
    /**
     * Create a new verification request with documents
     */
    public function createVerificationRequest(array $data, array $files = []): VerificationRequest
    {
        return DB::transaction(function () use ($data, $files) {
            $verificationRequest = VerificationRequest::create([
                'verification_request_id' => Uuid::uuid4()->toString(),
                'rental_id' => $data['rental_id'],
                'agent_id' => auth()->id(),
                'user_id' => auth()->id(),
                'agent_name' => auth()->user()->fullName ?? auth()->user()->name,
                'request_type' => $data['request_type'] ?? 'initial_verification',
                'status' => 'pending',
                'additional_notes' => $data['additional_notes'] ?? null,
                'proof_documents' => json_encode([]),
                'ownership_documents' => json_encode([]),
                'license_documents' => json_encode([]),
                'utility_bills' => json_encode([]),
                'submitted_at' => now(),
            ]);

            // Process and store files
            if (!empty($files)) {
                $this->storeDocuments($verificationRequest, $files);
            }

            return $verificationRequest;
        });
    }

    /**
     * Store documents for a verification request
     */
    public function storeDocuments(VerificationRequest $verificationRequest, array $files): void
    {
        $documentMapping = [
            'proof_docs' => 'proof_documents',
            'ownership_documents' => 'ownership_documents',
            'license_documents' => 'license_documents',
            'utility_bills' => 'utility_bills',
        ];

        foreach ($documentMapping as $inputKey => $dbField) {
            if (!empty($files[$inputKey])) {
                $storedDocs = $this->processFileGroup($files[$inputKey], $verificationRequest, $inputKey);
                $verificationRequest->update([
                    $dbField => json_encode($storedDocs),
                ]);
            }
        }
    }

    /**
     * Process a group of files and return document metadata
     */
    private function processFileGroup(array $fileGroup, VerificationRequest $verificationRequest, string $docType): array
    {
        $storedDocs = [];
        $basePath = "verification_requests/{$verificationRequest->verification_request_id}/{$docType}";

        foreach ($fileGroup as $file) {
            if ($file instanceof UploadedFile) {
                $originalName = $file->getClientOriginalName();
                $mimeType = $file->getMimeType();
                
                // Store file
                $filePath = $file->storeAs(
                    $basePath,
                    time() . '_' . $originalName,
                    'public'
                );

                $storedDocs[] = [
                    'original_name' => $originalName,
                    'filename' => basename($filePath),
                    'path' => $filePath,
                    'url' => Storage::disk('public')->url($filePath),
                    'mime_type' => $mimeType,
                    'size' => $file->getSize(),
                    'uploaded_at' => now()->toIso8601String(),
                ];
            }
        }

        return $storedDocs;
    }

    /**
     * Approve a verification request
     */
    public function approveVerificationRequest(VerificationRequest $verificationRequest, string $adminNotes = null): void
    {
        if ($verificationRequest->status !== 'pending') {
            throw new \DomainException('Only pending verification requests can be approved.');
        }

        DB::transaction(function () use ($verificationRequest, $adminNotes) {
            $verificationRequest->update([
                'status' => 'approved',
                'reviewed_at' => now(),
                'reviewed_by' => auth()->id(),
                'admin_notes' => $adminNotes,
            ]);

            // Update rental status if needed
            $rental = $verificationRequest->rental;
            if ($rental && $rental->is_verified === false) {
                $rental->update([
                    'is_verified' => true,
                    'verified_at' => now(),
                ]);
            }

            // Dispatch event for notifications
            event(new \App\Events\VerificationRequestApproved($verificationRequest));
        });
    }

    /**
     * Reject a verification request
     */
    public function rejectVerificationRequest(
        VerificationRequest $verificationRequest,
        string $rejectionReason = null,
        string $adminNotes = null
    ): void {
        if ($verificationRequest->status !== 'pending') {
            throw new \DomainException('Only pending verification requests can be rejected.');
        }

        DB::transaction(function () use ($verificationRequest, $rejectionReason, $adminNotes) {
            $verificationRequest->update([
                'status' => 'rejected',
                'reviewed_at' => now(),
                'reviewed_by' => auth()->id(),
                'rejection_reason' => $rejectionReason,
                'admin_notes' => $adminNotes,
            ]);

            // Dispatch event for notifications
            event(new \App\Events\VerificationRequestRejected($verificationRequest));
        });
    }

    /**
     * Delete documents for a verification request
     */
    public function deleteVerificationDocuments(VerificationRequest $verificationRequest): void
    {
        $basePath = "verification_requests/{$verificationRequest->verification_request_id}";
        
        if (Storage::disk('public')->exists($basePath)) {
            Storage::disk('public')->deleteDirectory($basePath);
        }
    }

    /**
     * Get verification request with all related data
     */
    public function getVerificationRequestWithDetails(VerificationRequest $verificationRequest): array
    {
        return [
            'id' => $verificationRequest->id,
            'verification_request_id' => $verificationRequest->verification_request_id,
            'rental_id' => $verificationRequest->rental_id,
            'agent_id' => $verificationRequest->agent_id,
            'agent_name' => $verificationRequest->agent_name,
            'request_type' => $verificationRequest->request_type,
            'status' => $verificationRequest->status,
            'rental' => $verificationRequest->rental ? [
                'id' => $verificationRequest->rental->id,
                'title' => $verificationRequest->rental->title,
                'property_type' => $verificationRequest->rental->property_type,
                'purpose' => $verificationRequest->rental->purpose,
                'area' => $verificationRequest->rental->area,
                'city' => $verificationRequest->rental->city,
                'sale_price' => $verificationRequest->rental->sale_price,
                'rent_min' => $verificationRequest->rental->rent_min,
                'bedrooms' => $verificationRequest->rental->bedrooms,
                'bathrooms' => $verificationRequest->rental->bathrooms,
                'views_count' => $verificationRequest->rental->views_count,
                'inquiries_count' => $verificationRequest->rental->inquiries_count,
                'images' => $verificationRequest->rental->images,
                'agent_name' => $verificationRequest->rental->agent_name,
            ] : null,
            'agent' => $verificationRequest->agent ? [
                'id' => $verificationRequest->agent->id,
                'name' => $verificationRequest->agent->name,
                'email' => $verificationRequest->agent->email,
            ] : null,
            'proof_documents' => $this->normalizeDocuments($verificationRequest->proof_documents),
            'ownership_documents' => $this->normalizeDocuments($verificationRequest->ownership_documents),
            'license_documents' => $this->normalizeDocuments($verificationRequest->license_documents),
            'utility_bills' => $this->normalizeDocuments($verificationRequest->utility_bills),
            'additional_notes' => $verificationRequest->additional_notes,
            'admin_notes' => $verificationRequest->admin_notes,
            'rejection_reason' => $verificationRequest->rejection_reason,
            'submitted_at' => $verificationRequest->submitted_at?->toIso8601String(),
            'reviewed_at' => $verificationRequest->reviewed_at?->toIso8601String(),
            'created_at' => $verificationRequest->created_at?->toIso8601String(),
        ];
    }

    /**
     * Normalize documents to ensure proper structure
     */
    private function normalizeDocuments($documents): array
    {
        if (!$documents) {
            return [];
        }

        if (is_string($documents)) {
            $documents = json_decode($documents, true) ?? [];
        }

        return array_filter(array_map(function ($doc) {
            if (!is_array($doc)) {
                return null;
            }

            return [
                'original_name' => $doc['original_name'] ?? $doc['filename'] ?? 'Document',
                'url' => $doc['url'] ?? null,
                'path' => $doc['path'] ?? null,
            ];
        }, $documents), fn($doc) => $doc !== null && !empty($doc['url']));
    }
}