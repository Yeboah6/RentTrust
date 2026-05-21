<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminVerificationActionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->isSuperAdmin();
    }

    public function rules(): array
    {
        return [
            'admin_notes' => 'nullable|string|max:2000',
            'rejection_reason' => 'nullable|string|max:1000|required_if:action,reject',
        ];
    }

    public function messages(): array
    {
        return [
            'rejection_reason.required_if' => 'Please provide a reason for rejection.',
            'rejection_reason.max' => 'Rejection reason must not exceed 1000 characters.',
            'admin_notes.max' => 'Admin notes must not exceed 2000 characters.',
        ];
    }
}