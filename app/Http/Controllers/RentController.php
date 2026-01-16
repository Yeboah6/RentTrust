<?php

namespace App\Http\Controllers;

use App\Models\Rental;
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
            return response()->json([
                'message' => 'Unauthorized. Please login as an agent.'
            ], 401);
        }

        $amenities = $request->amenities;
        // If amenities is an array, encode it to JSON
        if (is_array($amenities)) {
            $amenities = json_encode($amenities);
        }

        // Replace amenities in request with JSON string
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
            'amenities' => 'nullable|string', // JSON string from frontend
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
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
            // For Inertia, we need to return a redirect back with errors
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
           // Decode amenities JSON string to array for storage
            $amenitiesArray = [];
            if (!empty($amenities)) {
                $decoded = json_decode($amenities, true);
                if (is_array($decoded)) {
                    $amenitiesArray = $decoded;
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
            ]);

            // Handle image uploads if present
        if ($request->hasFile('images')) {
            $displayOrder = 0;
            
            foreach ($request->file('images') as $image) {
                if ($image->isValid()) {
                    // Generate unique filename
                    $filename = 'rental_' . $rentalListing->id . '_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    
                    // Store image in storage/app/public/rental_images
                    $path = $image->storeAs('rental_images', $filename, 'public');
                    
                    // Get full URL for the image
                    $url = Storage::disk('public')->url($path);
                    
                    // Create image record in database
                    RentalImage::create([
                        'rental_id' => $rentalListing->id,
                        'image_path' => $path,
                        'image_url' => $url,
                        'is_primary' => ($displayOrder === 0),
                        'display_order' => $displayOrder,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    
                    $displayOrder++;
                }
            }
        }
        // Success response
        return redirect()->back()
            ->with('success', 'Rental listing created successfully! It will be reviewed and activated soon.');

        } catch (\Exception $e) {
            \Log::error('Failed to create rental listing: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to create rental listing. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Rent $rent)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Rent $rent)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rent $rent)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rent $rent)
    {
        //
    }

    public function listings() {
        $listings = Rental::all();
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

    public function propertyDetail() {
        return inertia('PropertyDetailsPage');
    }

    public function reportListings() {
        return inertia('ReportListingDialog');
    }

    public function addRentals() {
        return inertia('AddRentals');
    }

    // public function storeAddRentals(Request $request) {
    //     dd($request);
    // }

    public function reviewForms() {
        return inertia('ReviewForm');
    }
}
