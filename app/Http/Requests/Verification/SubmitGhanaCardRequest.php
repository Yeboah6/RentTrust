<?php

namespace App\Http\Requests\Verification;

use Illuminate\Foundation\Http\FormRequest;

class SubmitGhanaCardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // e.g. GHA-123456789-0 — 9 digits plus a trailing check character.
            'ghana_card_number' => ['required', 'string', 'regex:/^GHA-\d{9}-[0-9A-Za-z]$/'],
            'ghana_card_pin' => ['required', 'digits_between:4,8'],
        ];
    }

    public function messages(): array
    {
        return [
            'ghana_card_number.regex' => 'Enter a valid Ghana Card number, e.g. GHA-123456789-0.',
        ];
    }
}