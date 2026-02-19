<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InitializePaymentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'payable_type' => 'required|string|in:subscription,listing_boost,lead_credit',
            'payable_id' => 'required|integer',
            'provider' => 'nullable|string|in:paystack,flutterwave',
            'payment_method' => 'required|string|in:mtn,vodafone,airteltigo',
            'phone_number' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'plan_id' => 'nullable|integer|exists:plans,id',
            'description' => 'nullable|string|max:255'
        ];
    }

    public function messages()
    {
        return [
            'phone_number.required' => 'Mobile money number is required',
            'payment_method.required' => 'Please select a mobile money provider',
            'payment_method.in' => 'Invalid mobile money provider selected',
            'amount.min' => 'Amount must be at least GHS 1'
        ];
    }

    protected function prepareForValidation()
    {
        // Clean phone number
        if ($this->has('phone_number')) {
            $this->merge([
                'phone_number' => preg_replace('/[^0-9]/', '', $this->phone_number)
            ]);
        }
    }
}