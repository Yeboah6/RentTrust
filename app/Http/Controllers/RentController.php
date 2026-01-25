<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use App\Models\Review;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;


class RentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $recentListings = Rental::latest()->get();
        // dd($recentListings);
        return inertia('Home', [
            'recentListings' => $recentListings
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Get authenticated agent
        $agent = Auth::guard('agent')->user();

        if (!$agent) {
            return redirect()->back()
                ->with('error', 'Unauthorized. Please login as an agent.');
        }

        // Prepare amenities - handle both array and JSON
       $amenities = $request->amenities;
        // If amenities is an array, encode it to JSON
        if (is_array($amenities)) {
            $amenities = json_encode($amenities);
        }

        $request->merge(['amenities' => $amenities]);

        // Validate required fields
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'propertyType' => 'required|string|max:50',
            'city' => 'required|string|max:100',
            'area' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'rentMin' => 'required|numeric|min:0',
            'rentMax' => 'required|numeric|min:0|gte:rentMin',
            'advanceDuration' => 'required|in:1,2,3,4,5',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'agentName' => 'required|string|max:255',
            'agentPhone' => 'required|string|max:20',
            'agentEmail' => 'required|email|max:255',
            'amenities' => 'nullable|string',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ], [
            'title.required' => 'Property title is required',
            'propertyType.required' => 'Property type is required',
            'city.required' => 'City is required',
            'area.required' => 'Area/Neighborhood is required',
            'rentMin.required' => 'Minimum rent is required',
            'rentMin.numeric' => 'Minimum rent must be a valid number',
            'rentMax.required' => 'Maximum rent is required',
            'rentMax.numeric' => 'Maximum rent must be a valid number',
            'rentMax.gte' => 'Maximum rent must be greater than or equal to minimum rent',
            'bedrooms.required' => 'Number of bedrooms is required',
            'bedrooms.integer' => 'Bedrooms must be a whole number',
            'agentName.required' => 'Your name is required',
            'agentPhone.required' => 'Phone number is required',
            'agentPhone.max' => 'Phone number is too long',
            'agentEmail.required' => 'Email address is required',
            'agentEmail.email' => 'Please provide a valid email address',
            'images.*.image' => 'Each image must be a valid image file',
            'images.*.mimes' => 'Images must be in JPEG, PNG, JPG, or GIF format',
            'images.*.max' => 'Each image must not exceed 5MB',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            // Decode amenities for storage
            $amenitiesArray = [];
            if (!empty($amenities)) {
                $decoded = json_decode($amenities, true);
                if (is_array($decoded)) {
                    $amenitiesArray = $decoded;
                }
            }

            $filePaths = [];

            // Handle multiple file uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    if ($file->isValid()) {
                        $fileName = 'rental_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                        $path = $file->storeAs('rental_images', $fileName, 'public');
                        $filePaths[] = $fileName;
                    }
                }
            }

            // Create rental listing
            $rentalListing = Rental::create([
                'agent_id' => $agent->id,
                'title' => $request->title,
                'property_type' => $request->propertyType,
                'city' => $request->city,
                'area' => $request->area,
                'address' => $request->address,
                'rent_min' => $request->rentMin,
                'rent_max' => $request->rentMax,
                'advance_duration' => $request->advanceDuration,
                'bedrooms' => $request->bedrooms,
                'bathrooms' => $request->bathrooms ?? 0,
                'amenities' => $amenitiesArray,
                'description' => $request->description,
                'agent_name' => $request->agentName,
                'agent_phone' => $request->agentPhone,
                'agent_email' => $request->agentEmail,
                'status' => 'pending',
                'images' => $filePaths ?? []
            ]);

            return redirect()->back()
                ->with('success', 'Rental listing created successfully! It will be reviewed and activated soon.');

        } catch (\Exception $e) {
            \Log::error('Failed to create rental listing: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to create rental listing. Please try again.')
                ->withInput();
        }
    }

    public function reportListing(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required',
            'description' => 'required|max:255',
            'report_type' => 'required|string|max:255',
            'name' => 'string|max:255',
            'evidence.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120'
        ]);

        $filePaths = [];

        // Handle multiple file uploads
        if ($request->hasFile('evidence')) {
            foreach ($request->file('evidence') as $file) {
                if ($file->isValid()) {
                    $fileName = 'report_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('report_files', $fileName, 'public');
                    $filePaths[] = $fileName;
                }
            }
        }

        // IMPORTANT: Check if name is in validated data
        $name = $validated['name'] ?? 'Anonymous';

        $report = Report::create([
            'rental_id' => $validated['property_id'],
            'report_description' => $validated['description'],
            'report_type' => $validated['report_type'], 
            'full_name' => $name,
            'evidence' => !empty($filePaths) ? json_encode($filePaths) : '[]' // Never NULL
        ]);

        return redirect()->back()->with('success', 'Report submitted successfully. Thank you for your feedback.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Rental $rent)
    {
        $reviews = Review::where('rental_id', $rent->id)
        ->orderBy('created_at', 'desc')
        ->get();
        
        return inertia('PropertyDetailsPage', ['rental' => $rent, 'reviews' => $reviews]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Rental $rent)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rental $rent)
    {
        dd($request);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rental $rent)
    {
        //
    }

    public function listings() {
        $listings = Rental::all()->map(function ($listing) {
            return [
                'id' => $listing->id,
                'title' => $listing->title,
                'property_type' => $listing->property_type,
                'city' => $listing->city,
                'area' => $listing->area,
                'address' => $listing->address,
                'rent_min' => $listing->rent_min,
                'rent_max' => $listing->rent_max,
                'advance_duration' => $listing->advance_duration,
                'bedrooms' => $listing->bedrooms,
                'bathrooms' => $listing->bathrooms,
                'amenities' => $listing->amenities,
                'description' => $listing->description,
                'agent_name' => $listing->agent_name,
                'agent_phone' => $listing->agent_phone,
                'agent_email' => $listing->agent_email,
                'is_claimed' => $listing->is_claimed ?? false,
                'is_verified' => $listing->is_verified ?? false,
                'status' => $listing->status,
                // Parse images to array
                'images' => $listing->images ? 
                    (is_string($listing->images) ? json_decode($listing->images, true) : $listing->images) 
                    : [],
                // Parse amenities to array
                'amenities' => $listing->amenities ? 
                    (is_string($listing->amenities) ? json_decode($listing->amenities, true) : $listing->amenities) 
                    : [],
                'review_count' => $listing->review_count ?? 0,
                'rating' => $listing->rating ?? 0,
                'created_at' => $listing->created_at,
                'updated_at' => $listing->updated_at,
            ];
        });
        
        return inertia('ListingsPage', ['listings' => $listings]);
    }

    public function area() {
        return inertia('AreasPage');
    }

    public function calculate() {
        return inertia('CalculatorPage');
    }

    public function claimListings() {
        return inertia('ClaimListingPage');
    }

    public function reviews() {
        return inertia('ReviewsPage');
    }

    public function reportListings() {
        return inertia('ReportListingDialog');
    }

    public function addRentals() {
        return inertia('AddRentals');
    }

   
    public function storeReviewForms(Request $request) {
        $validated = $request->validate([
            'overall_rating' => 'required|integer|min:1|max:5',
            'landlord_responsive' => 'nullable|boolean',
            'property_matched_description' => 'nullable|boolean',
            'fair_pricing' => 'nullable|boolean',
            'good_communication' => 'nullable|boolean',
            'comments' => 'nullable|string|max:255',
            'full_name' => 'required|string|max:255',
            'rental_id' => 'required|exists:rentals,id'
        ], [
            'overall_rating.required' => 'Please provide an overall rating.',
            'overall_rating.integer' => 'Rating must be a whole number.',
            'overall_rating.min' => 'Rating must be at least 1 star.',
            'overall_rating.max' => 'Rating cannot be more than 5 stars.',
            'full_name.required' => 'Your name is required.',
            'rental_id.required' => 'Rental property is required.',
            'rental_id.exists' => 'The selected rental property does not exist.'
        ]);

        try {
            // Convert checkbox values to boolean (they come as 'on' or null)
            $checkboxFields = [
                'landlord_responsive',
                'property_matched_description', 
                'fair_pricing',
                'good_communication'
            ];

            foreach ($checkboxFields as $field) {
                $validated[$field] = $request->has($field) ? true : false;
            }

            // Create the review
            $review = Review::create([
                'rental_id' => $validated['rental_id'],
                'overall_rating' => $validated['overall_rating'],
                'landlord_responsive' => $validated['landlord_responsive'] ?? false,
                'property_matched_description' => $validated['property_matched_description'] ?? false,
                'fair_pricing' => $validated['fair_pricing'] ?? false,
                'good_communication' => $validated['good_communication'] ?? false,
                'comments' => $validated['comments'] ?? null,
                'full_name' => $validated['full_name'],
            ]);

            // Success response
            return redirect()->back()
                ->with('success', 'Thank you for your review! Your feedback has been submitted.');

        } catch (\Exception $e) {
            \Log::error('Failed to store review: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to submit review. Please try again.')
                ->withInput();
        }
    }

    public function response(Request $request) {
        $validated = $request->validate([
            "review_id" => "required|exists:reviews,id",
            "response" => "required|string|max:1000",
            "response_person" => "required|string|max:255"
        ]);
    
        Review::where('id', $validated['review_id'])->update([
            'response' => $validated['response'],
            'response_person' => $validated['response_person']
        ]);
    
        return redirect()->back()->with('success', 'Response submitted successfully');
    }

}
