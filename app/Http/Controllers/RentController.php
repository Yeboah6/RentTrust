<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Models\Rental;
use App\Models\Report;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class RentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $recentListings = Rental::latest()->limit(4)->get();

        // Get areas grouped by city with proper structure
        $areas = Rental::select('city', 'area', 'rent_min', 'rent_max', 'created_at')
            ->get()
            ->groupBy('city')
            ->map(function ($cityAreas, $cityName) {
                return $cityAreas->groupBy('area')->map(function ($areaRentals) {
                    $avgRent = $areaRentals->avg(function ($rental) {
                        return ($rental->rent_min + $rental->rent_max) / 2;
                    });

                    $trend = $this->calculateRealTrend($areaRentals);

                    return [
                        'name' => $areaRentals->first()->area,
                        'listingCount' => $areaRentals->count(),
                        'avgRent' => round($avgRent),
                        'trend' => $trend,
                    ];
                });
            });

        return inertia('Home', [
            'recentListings' => $recentListings,
            'areas' => $areas,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    // public function create()
    // {
    //     //
    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Get authenticated agent
        $agent = Auth::guard('agent')->user();

        if (! $agent) {
            return redirect()->back()
                ->with('error', 'Unauthorized. Please login as an agent.');
        }

        $amenities = $request->amenities;
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
            if (! empty($amenities)) {
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
                        $fileName = 'rental_'.time().'_'.uniqid().'.'.$file->getClientOriginalExtension();
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
                'is_verified' => 'unverified',
                'images' => $filePaths ?? [],
            ]);

            return redirect()->back()
                ->with('success', 'Rental listing created successfully! It will be reviewed and activated soon.');

        } catch (\Exception $e) {
            Log::error('Failed to create rental listing: '.$e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to create rental listing. Please try again.')
                ->withInput();
        }
    }

    public function reportListing(Request $request)
    {
        // If the reporter did not provide a name, try to use the authenticated user's full name
        $agentUser = Auth::guard('agent')->user();
        $tenantUser = Auth::guard('tenant')->user();
        $superUser = Auth::guard('super')->user();
        if ((! $request->has('name') || trim($request->input('name')) === '') && ($agentUser || $tenantUser || $superUser)) {
            $name = $agentUser->fullName ?? $tenantUser->fullName ?? $superUser->fullName ?? null;
            if ($name) {
                $request->merge(['name' => $name]);
            }
        }

        $validated = $request->validate([
            'property_id' => 'required',
            'description' => 'required|max:255',
            'report_type' => 'required|string|max:255',
            'name' => 'string|max:255',
            'evidence.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $filePaths = [];

        // Handle multiple file uploads
        if ($request->hasFile('evidence')) {
            foreach ($request->file('evidence') as $file) {
                if ($file->isValid()) {
                    $fileName = 'report_'.time().'_'.uniqid().'.'.$file->getClientOriginalExtension();
                    $path = $file->storeAs('report_files', $fileName, 'public');
                    $filePaths[] = $fileName;
                }
            }
        }

        $name = $validated['name'] ?? 'Anonymous';

        $report = Report::create([
            'rental_id' => $validated['property_id'],
            'report_description' => $validated['description'],
            'report_type' => $validated['report_type'],
            'full_name' => $name,
            'evidence' => ! empty($filePaths) ? json_encode($filePaths) : '[]',
            'status' => 'pending',
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
    // public function edit(Rental $rent)
    // {
    //     //
    // }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rental $rent)
    {
        // Log the incoming request for debugging
        Log::info('Rental update request', [
            'rental_id' => $rent->id,
            'has_new_images' => $request->hasFile('newImages'),
            'existing_images_count' => count($request->input('existingImages', [])),
            'removed_images_count' => count($request->input('removedImages', []))
        ]);

        $amenities = $request->amenities;
        if (is_array($amenities)) {
            $amenities = json_encode($amenities);
        }

        $request->merge(['amenities' => $amenities]);

        // Validation rules
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'propertyType' => 'required|string',
            'area' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'address' => 'nullable|string',
            'rentMin' => 'required|numeric|min:0',
            'rentMax' => 'required|numeric|min:0|gte:rentMin',
            'advanceDuration' => 'required|integer|min:1|max:5',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'agentName' => 'required|string|max:255',
            'agentPhone' => 'required|string|max:20',
            'agentEmail' => 'required|email|max:255',
            'newImages.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            'existingImages' => 'nullable|array',
            'existingImages.*' => 'string',
            'removedImages' => 'nullable|array',
            'removedImages.*' => 'string',
        ], [
            'rentMax.gte' => 'Maximum rent must be greater than or equal to minimum rent',
            'newImages.*.max' => 'Each image must not exceed 5MB',
            'newImages.*.mimes' => 'Images must be jpeg, png, jpg, or gif format',
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput()
                ->with('error', 'Please correct the errors below.');
        }

        try {
            // Parse existing rental images
            $currentImages = $this->parseImages($rent->images);
            
            // Get images to keep (existing images)
            $existingImages = $request->input('existingImages', []);
            
            // Get images to remove
            $removedImages = $request->input('removedImages', []);
            
            // Delete removed images from storage
            foreach ($removedImages as $imagePath) {
                if (in_array($imagePath, $currentImages)) {
                    $this->deleteImage($imagePath);
                }
            }

            $amenitiesArray = [];
            if (! empty($amenities)) {
                $decoded = json_decode($amenities, true);
                if (is_array($decoded)) {
                    $amenitiesArray = $decoded;
                }
            }
            
            // Handle new image uploads
            $newImagePaths = [];
            if ($request->hasFile('newImages')) {
                foreach ($request->file('newImages') as $image) {
                    try {
                        // Generate unique filename
                        $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                        
                        // Store in public/storage/rental_images
                        $path = $image->storeAs('rental_images', $filename, 'public');
                        
                        if ($path) {
                            $newImagePaths[] = $filename; // Store just the filename
                        }
                    } catch (\Exception $e) {
                        Log::error('Image upload failed', [
                            'error' => $e->getMessage(),
                            'rental_id' => $rent->id
                        ]);
                    }
                }
            }
            
            // Combine existing and new images
            $finalImages = array_merge($existingImages, $newImagePaths);
            
            // Ensure we don't exceed 6 images
            $finalImages = array_slice($finalImages, 0, 6);
            
            Log::info('Image processing complete', [
                'rental_id' => $rent->id,
                'kept_existing' => count($existingImages),
                'uploaded_new' => count($newImagePaths),
                'deleted' => count($removedImages),
                'final_total' => count($finalImages)
            ]);
            
            // Update rental data
            $rent->update([
                'title' => $request->title,
                'property_type' => $request->propertyType,
                'area' => $request->area,
                'city' => $request->city,
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
                'images' => json_encode($finalImages),
                'updated_at' => now(),
            ]);
            
            Log::info('Rental updated successfully', [
                'rental_id' => $rent->id,
                'title' => $rent->title
            ]);
            
            return redirect()
                ->back()
                ->with('success', 'Rental listing updated successfully!');
                
        } catch (\Exception $e) {
            Log::error('Rental update failed', [
                'rental_id' => $rent->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()
                ->withInput()
                ->with('error', 'Failed to update listing. Please try again.');
        }
    }

    /**
     * Parse images from database (handles both string and array formats)
     */
    private function parseImages($imagesData)
    {
        if (!$imagesData) {
            return [];
        }
        
        try {
            // If it's already an array, return it
            if (is_array($imagesData)) {
                return $imagesData;
            }
            
            // If it's a string, parse it as JSON
            if (is_string($imagesData)) {
                $parsed = json_decode($imagesData, true);
                return is_array($parsed) ? $parsed : [];
            }
            
            return [];
        } catch (\Exception $e) {
            Log::error('Error parsing images', [
                'error' => $e->getMessage(),
                'data' => $imagesData
            ]);
            return [];
        }
    }

    /**
     * Delete an image from storage
     */
    private function deleteImage($imagePath)
    {
        try {
            // Handle different path formats
            $fullPath = 'rental_images/' . basename($imagePath);
            
            if (Storage::disk('public')->exists($fullPath)) {
                Storage::disk('public')->delete($fullPath);
                Log::info('Image deleted', ['path' => $fullPath]);
                return true;
            }
            
            Log::warning('Image not found for deletion', ['path' => $fullPath]);
            return false;
            
        } catch (\Exception $e) {
            Log::error('Failed to delete image', [
                'path' => $imagePath,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rental $rent)
    {
        //
    }

    public function listings()
    {
        // Initial load: show 8 listings
        $listings = Rental::latest()
            ->paginate(8);

        return inertia('ListingsPage', [
            'listings' => $listings
        ]);
    }

    public function getMoreListings(Request $request)
    {
        $page = $request->query('page', 2);
        $perPage = 8; // MUST match the perPage in listings() method
        
        if (!is_numeric($page) || $page < 2) {
            return response()->json([
                'error' => 'Invalid page number',
                'listings' => [],
                'has_more' => false,
            ], 400);
        }

        try {
            // Same perPage as initial load - Laravel handles offset correctly
            $listings = Rental::latest()->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'listings' => $listings->items(),
                'has_more' => $listings->hasMorePages(),
                'current_page' => $listings->currentPage(),
                'total' => $listings->total(),
                'per_page' => $listings->perPage(),
            ]);

        } catch (\Exception $e) {
            \Log::error('Failed to fetch more listings', [
                'error' => $e->getMessage(),
                'page' => $page,
            ]);

            return response()->json([
                'error' => 'Failed to fetch listings',
                'message' => config('app.debug') ? $e->getMessage() : 'Server error',
                'listings' => [],
                'has_more' => false,
            ], 500);
        }
    }

    public function getAllListings(Request $request)
    {
        $page = $request->query('page', 1);
        $perPage = $page == 1 ? 8 : 4; // 8 items on first page, 4 on subsequent pages

        $listings = Rental::latest()
            ->paginate($perPage);

        // If this is an AJAX request (for "Load More"), return JSON
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'listings' => $listings->items(),
                'has_more' => $listings->hasMorePages(),
                'next_page' => $listings->hasMorePages() ? $listings->currentPage() + 1 : null,
                'current_page' => $listings->currentPage(),
                'total' => $listings->total(),
            ]);
        }

        // Otherwise return Inertia page (for initial page load)
        return inertia('ListingsPage', [
            'listings' => $listings
        ]);
    }

    public function areas()
    {
        // Get areas grouped by city with proper structure
        $areas = Rental::select('city', 'area', 'rent_min', 'rent_max', 'created_at')
            ->get()
            ->groupBy('city')
            ->map(function ($cityAreas, $cityName) {
                return $cityAreas->groupBy('area')->map(function ($areaRentals) {
                    $avgRent = $areaRentals->avg(function ($rental) {
                        return ($rental->rent_min + $rental->rent_max) / 2;
                    });

                    $minRent = $areaRentals->min('rent_min');
                    $maxRent = $areaRentals->max('rent_max');

                    return [
                        'name' => $areaRentals->first()->area,
                        'listingCount' => $areaRentals->count(),
                        'avgRent' => round($avgRent),
                        'minRent' => $minRent,
                        'maxRent' => $maxRent,
                        'trend' => $this->calculateTrend($areaRentals),
                    ];
                });
            });

        return inertia('AreasPage', ['areas' => $areas]);
    }

    public function calculate()
    {
        return inertia('CalculatorPage');
    }

    public function claimListings()
    {
        return inertia('ClaimListingPage');
    }

    public function reviews()
    {
        $reviews = Review::where('review_type', 'rent')->get();
        $reports = DB::table('reports')
            ->join('rentals', 'reports.rental_id', '=', 'rentals.id')
            ->get();

        $appReviews = Review::where('review_type', 'app')->get();

        return inertia('ReviewsPage',
            [
                'reviews' => $reviews,
                'reports' => $reports,
                'appReviews' => $appReviews,
            ]);
    }

    public function addRentals()
    {
        return inertia('AddRentals');
    }

    public function storeReviewForms(Request $request)
    {
        // If the reviewer did not provide a full_name, attempt to populate it from the authenticated user
        $agentUser = Auth::guard('agent')->user();
        $tenantUser = Auth::guard('tenant')->user();
        $superUser = Auth::guard('super')->user();
        if ((! $request->has('full_name') || trim($request->input('full_name')) === '') && ($agentUser || $tenantUser || $superUser)) {
            $name = $agentUser->fullName ?? $tenantUser->fullName ?? $superUser->fullName ?? null;
            if ($name) {
                $request->merge(['full_name' => $name]);
            }
        }

        $validated = $request->validate([
            'overall_rating' => 'required|integer|min:1|max:5',
            'landlord_responsive' => 'nullable|boolean',
            'property_matched_description' => 'nullable|boolean',
            'fair_pricing' => 'nullable|boolean',
            'good_communication' => 'nullable|boolean',
            'comments' => 'nullable|string|max:255',
            'full_name' => 'required|string|max:255',
            'rental_id' => 'required|exists:rentals,id',
        ], [
            'overall_rating.required' => 'Please provide an overall rating.',
            'overall_rating.integer' => 'Rating must be a whole number.',
            'overall_rating.min' => 'Rating must be at least 1 star.',
            'overall_rating.max' => 'Rating cannot be more than 5 stars.',
            'full_name.required' => 'Your name is required.',
            'rental_id.required' => 'Rental property is required.',
            'rental_id.exists' => 'The selected rental property does not exist.',
        ]);

        try {
            // Convert checkbox values to boolean (they come as 'on' or null)
            $checkboxFields = [
                'landlord_responsive',
                'property_matched_description',
                'fair_pricing',
                'good_communication',
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
            Log::error('Failed to store review: '.$e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to submit review. Please try again.')
                ->withInput();
        }
    }

    public function response(Request $request)
    {
        $validated = $request->validate([
            'review_id' => 'required|exists:reviews,id',
            'response' => 'required|string|max:1000',
            'response_person' => 'required|string|max:255',
        ]);

        Review::where('id', $validated['review_id'])->update([
            'response' => $validated['response'],
            'response_person' => $validated['response_person'],
        ]);

        return redirect()->back()->with('success', 'Response submitted successfully');
    }

    public function updateReportStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,investigating,resolved,dismissed',
        ]);

        $report = Report::findOrFail($id);
        $report->update([
            'status' => $validated['status'],
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Report status updated successfully');
    }

    public function storeReviewApp(Request $request)
    {
        $agentUser = Auth::guard('agent')->user();
        $tenantUser = Auth::guard('tenant')->user();
        $superUser = Auth::guard('super')->user();
        if ((! $request->has('name') || trim($request->input('name')) === '') && ($agentUser || $tenantUser || $superUser)) {
            $name = $agentUser->fullName ?? $tenantUser->fullName ?? $superUser->fullName ?? null;
            if ($name) {
                $request->merge(['name' => $name]);
            }
        }

        $validated = $request->validate([
            'overall_rating' => 'required|integer|min:1|max:5',
            'name' => 'required|string|max:255',
            'comment' => 'nullable|string|max:255',
        ]);

        Review::create([
            'review_type' => 'app',
            'overall_rating' => $validated['overall_rating'],
            'full_name' => $validated['name'],
            'comments' => $validated['comment'],
        ]);

        return redirect()->back()->with('success', 'Rview added successfully');
    }

    /**
     * Calculate real trend based on rental price changes over time
     */
    private function calculateRealTrend($areaRentals)
    {
        // If we have less than 2 rentals, we can't calculate a trend
        if ($areaRentals->count() < 2) {
            return '+0%';
        }

        // Split rentals into recent (last 30 days) and older
        $thirtyDaysAgo = now()->subDays(30);

        $recentRentals = $areaRentals->filter(function ($rental) use ($thirtyDaysAgo) {
            return $rental->created_at >= $thirtyDaysAgo;
        });

        $olderRentals = $areaRentals->filter(function ($rental) use ($thirtyDaysAgo) {
            return $rental->created_at < $thirtyDaysAgo;
        });

        // If we don't have both recent and older data, return 0%
        if ($recentRentals->isEmpty() || $olderRentals->isEmpty()) {
            return '+0%';
        }

        // Calculate average rents for both periods
        $recentAvg = $recentRentals->avg(function ($rental) {
            return ($rental->rent_min + $rental->rent_max) / 2;
        });

        $olderAvg = $olderRentals->avg(function ($rental) {
            return ($rental->rent_min + $rental->rent_max) / 2;
        });

        // Calculate percentage change
        if ($olderAvg == 0) {
            return '+0%';
        }

        $percentageChange = (($recentAvg - $olderAvg) / $olderAvg) * 100;
        $percentageChange = round($percentageChange);

        // Format the trend string
        if ($percentageChange > 0) {
            return "+{$percentageChange}%";
        } elseif ($percentageChange < 0) {
            return "{$percentageChange}%";
        } else {
            return '+0%';
        }
    }

    /**
     * Alternative: Simple random trend (if you don't want real calculation yet)
     */
    private function calculateSimpleTrend($areaRentals)
    {
        $trends = ['+12%', '+8%', '+5%', '-3%', '+15%', '+10%', '+2%'];

        return $trends[array_rand($trends)];
    }

    public function showArea($city, $area)
    {
        // Decode the area name from URL (replace hyphens with spaces)
        $areaName = str_replace('-', ' ', $area);
        $cityName = str_replace('-', ' ', $city);

        // Get all rentals for this specific area
        $properties = Rental::where('city', 'like', $cityName)
            ->where('area', 'like', $areaName)
            ->latest()
            ->get();

        if ($properties->isEmpty()) {
            abort(404, 'Area not found');
        }

        // Calculate area statistics
        $avgRent = $properties->avg(function ($rental) {
            return ($rental->rent_min + $rental->rent_max) / 2;
        });

        $areaData = [
            'name' => $properties->first()->area,
            'listingCount' => $properties->count(),
            'avgRent' => round($avgRent),
            'minRent' => $properties->min('rent_min'),
            'maxRent' => $properties->max('rent_max'),
            'trend' => $this->calculateTrend($properties),
        ];

        return inertia('AreaDetailPage', [
            'area' => $areaData,
            'city' => $cityName,
            'properties' => $properties,
        ]);
    }

    /**
     * Search areas by name or city
     */
    public function searchAreas(Request $request)
    {
        $query = $request->input('q', '');

        $areas = Rental::select('city', 'area', 'rent_min', 'rent_max')
            ->when($query, function ($q) use ($query) {
                $q->where('area', 'like', "%{$query}%")
                    ->orWhere('city', 'like', "%{$query}%");
            })
            ->get()
            ->groupBy('city')
            ->map(function ($cityAreas, $cityName) {
                return $cityAreas->groupBy('area')->map(function ($areaRentals) {
                    $avgRent = $areaRentals->avg(function ($rental) {
                        return ($rental->rent_min + $rental->rent_max) / 2;
                    });

                    return [
                        'name' => $areaRentals->first()->area,
                        'city' => $areaRentals->first()->city,
                        'listingCount' => $areaRentals->count(),
                        'avgRent' => round($avgRent),
                        'trend' => $this->calculateTrend($areaRentals),
                    ];
                })->values();
            });

        return response()->json($areas);
    }

    /**
     * Get areas by city
     */
    public function getAreasByCity($city)
    {
        $cityName = str_replace('-', ' ', $city);

        $areas = Rental::select('area', 'rent_min', 'rent_max', 'created_at')
            ->where('city', 'like', $cityName)
            ->get()
            ->groupBy('area')
            ->map(function ($areaRentals) {
                $avgRent = $areaRentals->avg(function ($rental) {
                    return ($rental->rent_min + $rental->rent_max) / 2;
                });

                return [
                    'name' => $areaRentals->first()->area,
                    'listingCount' => $areaRentals->count(),
                    'avgRent' => round($avgRent),
                    'minRent' => $areaRentals->min('rent_min'),
                    'maxRent' => $areaRentals->max('rent_max'),
                    'trend' => $this->calculateTrend($areaRentals),
                ];
            })
            ->values();

        return response()->json($areas);
    }

    /**
     * Calculate trend for an area based on recent vs older rentals
     */
    private function calculateTrend($areaRentals)
    {
        if ($areaRentals->count() < 2) {
            return '+0%';
        }

        $thirtyDaysAgo = now()->subDays(30);

        $recentRentals = $areaRentals->filter(function ($rental) use ($thirtyDaysAgo) {
            return $rental->created_at >= $thirtyDaysAgo;
        });

        $olderRentals = $areaRentals->filter(function ($rental) use ($thirtyDaysAgo) {
            return $rental->created_at < $thirtyDaysAgo;
        });

        if ($recentRentals->isEmpty() || $olderRentals->isEmpty()) {
            return '+0%';
        }

        $recentAvg = $recentRentals->avg(function ($rental) {
            return ($rental->rent_min + $rental->rent_max) / 2;
        });

        $olderAvg = $olderRentals->avg(function ($rental) {
            return ($rental->rent_min + $rental->rent_max) / 2;
        });

        if ($olderAvg == 0) {
            return '+0%';
        }

        $percentageChange = (($recentAvg - $olderAvg) / $olderAvg) * 100;
        $percentageChange = round($percentageChange);

        if ($percentageChange > 0) {
            return "+{$percentageChange}%";
        } elseif ($percentageChange < 0) {
            return "{$percentageChange}%";
        } else {
            return '+0%';
        }
    }
}
