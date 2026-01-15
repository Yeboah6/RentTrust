<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class RentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Home');
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
        // Validate the request
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'propertyType' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'area' => 'required|string|max:100',
            'address' => 'nullable|string|max:500',
            'monthlyRent' => 'required|numeric|min:0',
            'advanceDuration' => 'required|integer|min:1|max:5',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'amenities' => 'nullable|string',
            'description' => 'nullable|string|max:2000',
            'agentName' => 'required|string|max:255',
            'agentPhone' => 'required|string|max:20',
            'agentEmail' => 'required|email|max:255',
            'images.*' => 'nullable|file|mimes:jpeg,png,jpg,svg|max:5120', // 5MB max per image
        ]);

        // Get the authenticated agent
        $agent = Auth::guard('agent')->user();
        
        if (!$agent) {
            return redirect()->back()->with('error', 'You must be logged in as an agent to add rentals.');
        }

        // Handle multiple image uploads
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->storeAs('rentals', 'public');
                $imagePaths[] = $path;
            }
        }

        // Map camelCase form fields to snake_case database columns
        $rentalData = new Rental();

        $rentalData = [
            'agentId' => $agent->id,
            'title' => $validated['title'],
            'propertyType' => $validated['propertyType'],
            'city' => $validated['city'],
            'area' => $validated['area'],
            'address' => $validated['address'] ?? null,
            'monthlyRent' => $validated['monthlyRent'],
            'advanceDuration' => $validated['advanceDuration'],
            'bedrooms' => $validated['bedrooms'],
            'bathrooms' => $validated['bathrooms'] ?? 0,
            'amenities' => $validated['amenities'] ?? '[]',
            'description' => $validated['description'] ?? null,
            'agentName' => $validated['agentName'],
            'agentPhone' => $validated['agentPhone'],
            'agentEmail' => $validated['agentEmail'],
            'images' => json_encode($imagePaths),
        ];

        // Create the rental listing
        $rental = Rental::create($rentalData);

        return redirect()->back()->with('success', 'Rental listing added successfully!');
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
        return inertia('ListingsPage');
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

    public function superAdmin() {
        return inertia('Dashboards/SuperAdmin');
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
