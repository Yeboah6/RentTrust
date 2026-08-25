<?php

namespace App\Http\Requests\Verification;

use Illuminate\Foundation\Http\FormRequest;

class SubmitBiometricRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'selfie' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:8192'],
            'liveness_check' => ['nullable', 'string', 'max:50'],
        ];
    }
}