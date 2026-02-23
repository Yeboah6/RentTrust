<?php
// app/Http/Requests/InitializePaymentRequest.php

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
            'payable_type' => 'required|string|in:subscription',
            'payable_id' => 'required|integer',
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|string|in:mtn,vodafone,airteltigo',
            'phone_number' => 'required|string|size:10', // With leading 0: 024XXXXXXX
            'provider' => 'nullable|string|in:paystack,flutterwave'
        ];
    }

    public function messages()
    {
        return [
            'payable_type.required' => 'Payment type is required',
            'payable_type.in' => 'Invalid payment type',
            'payable_id.required' => 'Payment item ID is required',
            'phone_number.required' => 'Mobile money number is required',
            'phone_number.size' => 'Phone number must be 10 digits (including leading 0)',
            'payment_method.required' => 'Please select a mobile money provider',
            'payment_method.in' => 'Invalid mobile money provider selected',
            'amount.required' => 'Amount is required',
            'amount.min' => 'Amount must be at least GHS 1'
        ];
    }

    protected function prepareForValidation()
    {
        // Clean phone number - ensure it has leading 0
        if ($this->has('phone_number')) {
            $phone = preg_replace('/[^0-9]/', '', $this->phone_number);
            
            // If it's 9 digits, add leading 0
            if (strlen($phone) === 9) {
                $phone = '0' . $phone;
            }
            
            $this->merge([
                'phone_number' => $phone
            ]);
        }
    }
}