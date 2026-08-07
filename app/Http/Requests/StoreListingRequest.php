<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Auth;

class StoreListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    protected function failedAuthorization(): void
    {
        throw new HttpResponseException(
            redirect()->back()->with('error', 'Unauthorized. Please login to create a listing.')
        );
    }

    public function rules(): array
    {
        $purpose = $this->input('purpose', 'rent');

        $rules = [
            'purpose'         => 'required|in:rent,sale',
            'title'           => 'required|string|max:255',
            'propertyType'    => 'required|string|max:50',
            'city'            => 'required|string|max:100',
            'area'            => 'required|string|max:255',
            'address'         => 'nullable|string|max:500',
            'bedrooms'        => 'required|integer|min:0',
            'bathrooms'       => 'nullable|integer|min:0',
            'description'     => 'nullable|string',
            'agentName'       => 'required|string|max:255',
            'agentPhone'      => 'required|string|max:20',
            'agentEmail'      => 'required|email|max:255',
            'amenities'       => 'nullable|string',
            'images.*'        => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ];

        if ($purpose === 'sale') {
            $rules['salePrice']       = 'required|numeric|min:0';
            $rules['rentMin']         = 'prohibited';
            $rules['rentMax']         = 'prohibited';
            $rules['advanceDuration'] = 'prohibited';
        } else {
            $rules['rentMin']         = 'required|numeric|min:0';
            $rules['rentMax']         = 'required|numeric|min:0|gte:rentMin';
            $rules['advanceDuration'] = 'required|in:1,2,3,4,5';
            $rules['salePrice']       = 'prohibited';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'purpose.in'             => 'Invalid listing purpose.',
            'title.required'         => 'Property title is required',
            'propertyType.required'  => 'Property type is required',
            'city.required'          => 'City is required',
            'area.required'          => 'Area/Neighborhood is required',
            'rentMin.required'       => 'Minimum rent is required',
            'rentMin.numeric'        => 'Minimum rent must be a valid number',
            'rentMax.required'       => 'Maximum rent is required',
            'rentMax.numeric'        => 'Maximum rent must be a valid number',
            'rentMax.gte'            => 'Maximum rent must be greater than or equal to minimum rent',
            'salePrice.required'     => 'Sale price is required',
            'salePrice.numeric'      => 'Sale price must be a valid number',
            'bedrooms.required'      => 'Number of bedrooms is required',
            'bedrooms.integer'       => 'Bedrooms must be a whole number',
            'agentName.required'     => 'Your name is required',
            'agentPhone.required'    => 'Phone number is required',
            'agentPhone.max'         => 'Phone number is too long',
            'agentEmail.required'    => 'Email address is required',
            'agentEmail.email'       => 'Please provide a valid email address',
            'images.*.image'         => 'Each file must be a valid image',
            'images.*.mimes'         => 'Images must be in JPEG, PNG, WEBP, JPG, or GIF format',
            'images.*.max'           => 'Each image must not exceed 5MB',
        ];
    }
}