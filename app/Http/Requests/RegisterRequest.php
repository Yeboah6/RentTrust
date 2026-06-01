<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'min:2', 'max:100'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone'    => ['nullable', 'string', 'min:9', 'max:20', 'unique:users,phone'],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->uncompromised(),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'           => 'Please enter your full name.',
            'name.min'                => 'Name must be at least 2 characters.',
            'email.required'          => 'Please enter your email address.',
            'email.email'             => 'Please enter a valid email address.',
            'email.unique'            => 'This email is already registered.',
            'phone.min'               => 'Please enter a valid phone number.',
            'password.required'       => 'Please create a password.',
            'password.confirmed'      => 'Passwords do not match.',
            'password.min'            => 'Password must be at least 8 characters.',
        ];
    }
}
