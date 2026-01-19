<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use App\Models\RentalImage;
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
            'images' => !empty($filePaths) ? json_encode($filePaths) : '[]'
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
        'name' => 'required|string|max:255',
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
        return inertia('PropertyDetailsPage', ['rental' => $rent]);
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rental $rent)
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

    // public function propertyDetail() {
    //     return inertia('PropertyDetailsPage');
    // }

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
