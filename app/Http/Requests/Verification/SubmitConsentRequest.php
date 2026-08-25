<?php

namespace App\Http\Requests\Verification;

use Illuminate\Foundation\Http\FormRequest;

class SubmitConsentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'consents' => ['required', 'array'],
            'consents.nia_data_share' => ['required', 'accepted'],
            'consents.verification_terms' => ['required', 'accepted'],
        ];
    }
}