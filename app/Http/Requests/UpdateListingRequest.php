<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function failedValidation(Validator $validator): void
    {
        if ($this->expectsJson()) {
            throw new HttpResponseException(
                response()->json(['errors' => $validator->errors()], 422)
            );
        }

        throw new HttpResponseException(
            back()->withErrors($validator)->withInput()->with('error', 'Please correct the errors below.')
        );
    }

    protected function prepareForValidation(): void
    {
        $amenities = $this->amenities;
        if (is_array($amenities)) {
            $amenities = json_encode($amenities);
        }

        $this->merge(['amenities' => $amenities]);
    }

    public function rules(): array
    {
        $rental = $this->route('rent');
        $purpose = $this->input('purpose', $rental?->purpose ?? 'rent');

        $rules = [
            'title'            => 'required|string|max:255',
            'propertyType'     => 'required|string',
            'area'             => 'required|string|max:255',
            'city'             => 'required|string|max:255',
            'address'          => 'nullable|string',
            'bedrooms'         => 'required|integer|min:0',
            'bathrooms'        => 'nullable|integer|min:0',
            'description'      => 'nullable|string',
            'agentName'        => 'required|string|max:255',
            'agentPhone'       => 'required|string|max:20',
            'agentEmail'       => 'required|email|max:255',
            'newImages.*'      => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'existingImages'   => 'nullable|array',
            'existingImages.*' => 'string',
            'removedImages'    => 'nullable|array',
            'removedImages.*'  => 'string',
            'is_sold'          => 'nullable|in:0,1',
            'is_rented'        => 'nullable|in:0,1',
            'status'           => 'nullable',
            'amenities' => 'nullable|string',
        ];

        if ($purpose === 'rent') {
            $rules['rentMin']         = 'required|numeric|min:0';
            $rules['rentMax']         = 'required|numeric|min:0|gte:rentMin';
            $rules['advanceDuration'] = 'required|integer|min:1|max:9';
            $rules['salePrice']       = 'prohibited';
        } else {
            $rules['salePrice']       = 'required|numeric|min:0';
            $rules['rentMin']         = 'prohibited';
            $rules['rentMax']         = 'prohibited';
            $rules['advanceDuration'] = 'prohibited';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'rentMax.gte'        => 'Maximum rent must be greater than or equal to minimum rent',
            'newImages.*.max'    => 'Each image must not exceed 5MB',
            'newImages.*.mimes'  => 'Images must be jpeg, png, webp, jpg, or gif format',
        ];
    }
}