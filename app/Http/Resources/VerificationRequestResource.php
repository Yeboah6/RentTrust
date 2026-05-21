<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VerificationRequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'verification_request_id' => $this->verification_request_id,
            'rental_id' => $this->rental_id,
            'agent_id' => $this->agent_id,
            'agent_name' => $this->agent_name,
            'request_type' => $this->request_type,
            'status' => $this->status,
            'rental' => [
                'id' => $this->rental?->id,
                'title' => $this->rental?->title,
                'property_type' => $this->rental?->property_type,
                'purpose' => $this->rental?->purpose,
                'area' => $this->rental?->area,
                'city' => $this->rental?->city,
                'sale_price' => $this->rental?->sale_price,
                'rent_min' => $this->rental?->rent_min,
                'bedrooms' => $this->rental?->bedrooms,
                'bathrooms' => $this->rental?->bathrooms,
                'views_count' => $this->rental?->views_count,
                'inquiries_count' => $this->rental?->inquiries_count,
                'images' => $this->rental?->images,
                'agent_name' => $this->rental?->agent_name,
            ],
            'agent' => [
                'id' => $this->agent?->id,
                'name' => $this->agent?->name,
                'email' => $this->agent?->email,
            ],
            'proof_documents' => $this->normalizeDocuments($this->proof_documents),
            'ownership_documents' => $this->normalizeDocuments($this->ownership_documents),
            'license_documents' => $this->normalizeDocuments($this->license_documents),
            'utility_bills' => $this->normalizeDocuments($this->utility_bills),
            'additional_notes' => $this->additional_notes,
            'admin_notes' => $this->admin_notes,
            'rejection_reason' => $this->rejection_reason,
            'submitted_at' => $this->submitted_at?->toIso8601String(),
            'reviewed_at' => $this->reviewed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }

    /**
     * Normalize documents array
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