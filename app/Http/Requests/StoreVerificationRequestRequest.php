<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVerificationRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'rental_id' => 'required|exists:rentals,id',
            'agent_id' => 'nullable|exists:users,id',
            'agent_name' => 'nullable|string|max:255',
            'request_type' => 'required|in:initial_verification,re_verification',
            'additional_notes' => 'nullable|string|max:1000',
            
            // Document fields
            'proof_docs' => 'nullable|array',
            'proof_docs.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx|max:10240',
            
            'ownership_documents' => 'nullable|array',
            'ownership_documents.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx|max:10240',
            
            'utility_bills' => 'nullable|array',
            'utility_bills.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx|max:10240',
            
            'terms_accepted' => 'required|accepted',
        ];
    }

    public function messages(): array
    {
        return [
            'rental_id.required' => 'Please select a rental property to verify.',
            'rental_id.exists' => 'The selected rental property does not exist.',
            'request_type.required' => 'Please select a verification type.',
            'request_type.in' => 'Invalid verification type selected.',
            'terms_accepted.required' => 'You must accept the terms and conditions.',
            'terms_accepted.accepted' => 'You must accept the terms and conditions.',
            'proof_docs.*.max' => 'Each proof document must not exceed 10MB.',
            'ownership_documents.*.max' => 'Each ownership document must not exceed 10MB.',
            'utility_bills.*.max' => 'Each utility bill must not exceed 10MB.',
            'additional_notes.max' => 'Additional notes must not exceed 1000 characters.',
        ];
    }

    /**
     * Custom validation to ensure at least one document is uploaded
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $hasDocuments = 
                $this->hasFile('proof_docs') || 
                $this->hasFile('ownership_documents') || 
                $this->hasFile('utility_bills');

            if (!$hasDocuments) {
                $validator->errors()->add(
                    'documents', 
                    'Please upload at least one document to verify your listing.'
                );
            }
        });
    }
}