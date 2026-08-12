<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Rental;
use App\Models\Review;
use App\Models\Plan;
use App\Models\ListingView;
use App\Models\ListingInquiry;
use App\Models\AdminAuditLog;
use App\Models\NewsletterSubscriber;
use App\Services\Seo\SeoService;
use Illuminate\Http\Request;
use App\Services\ListingLimitService;
use App\Http\Requests\StoreListingRequest;
use App\Http\Requests\UpdateListingRequest;
use App\Jobs\NotifySubscribersOfNewListing;
use Illuminate\Support\Facades\{Auth, DB, Mail, Log, Storage};

class RentController extends Controller
{
    /**
     * Display homepage with featured listings
     */

    public function index()
    {
        // ── Verified listings (agent must have status = 'verified') ───────────
        $verifiedRentals = Rental::where('purpose', 'rent')
            ->where('is_rented', false)
            ->where('verification_status', 'verified')
            ->with('agent:id,name')
            ->select('id', 'title', 'area', 'city', 'rent_min', 'rent_max', 'advance_duration','slug',
                     'status', 'bedrooms', 'bathrooms', 'images', 'agent_id', 'created_at')
            ->latest()
            ->take(4)
            ->get()
            ->map(fn ($r) => [
                'id'               => $r->id,
                'title'            => $r->title,
                'area'             => $r->area,
                'city'             => $r->city,
                'rent_min'         => $r->rent_min,
                'rent_max'         => $r->rent_max,
                'advance_duration' => $r->advance_duration,
                'agent_name'       => $r->agent->name ?? null,
                'status'           => $r->status,
                'bedrooms'         => $r->bedrooms,
                'bathrooms'        => $r->bathrooms,
                'images'           => $r->images,
                'slug'             => $r->slug,
            ])
            ->values()
            ->all();

        $verifiedSales = Rental::where('purpose', 'sale')
            ->where('is_sold', false)
            ->where('verification_status', 'verified')
            ->with('agent:id,name')
            ->select('id', 'title', 'area', 'city', 'sale_price', 'slug',
                     'status', 'bedrooms', 'bathrooms', 'images', 'agent_id', 'created_at')
            ->latest()
            ->take(4)
            ->get()
            ->map(fn ($r) => [
                'id'         => $r->id,
                'title'      => $r->title,
                'area'       => $r->area,
                'city'       => $r->city,
                'sale_price' => $r->sale_price,
                'agent_name' => $r->agent->name ?? null,
                'status'     => $r->status,
                'bedrooms'   => $r->bedrooms,
                'bathrooms'  => $r->bathrooms,
                'images'     => $r->images,
                'slug'       => $r->slug,
            ])
            ->values()
            ->all();

        // ── Area market data ─────────────────────────────────────────────────
        $sixMonthsAgo = now()->subMonths(6);
    
        $rawRentals = Rental::where('purpose', 'rent')
            ->where('created_at', '>', $sixMonthsAgo)
            ->select('city', 'area', 'rent_min', 'rent_max', 'created_at')
            ->get();
    
        $rentalAreas = $rawRentals
            ->groupBy('city')
            ->map(fn ($cityRows) => $cityRows
                ->groupBy('area')
                ->map(fn ($areaRows) => [
                    'name'         => $areaRows->first()->area,
                    'listingCount' => $areaRows->count(),
                    'avgRent'      => (int) round($areaRows->avg(fn ($r) => ($r->rent_min + $r->rent_max) / 2)),
                    'trend'        => $this->calculateRealTrend($areaRows),
                ])
                ->values()
                ->all()
            )
            ->toArray();
    
        $saleAreas = Rental::where('purpose', 'sale')
            ->where('is_sold', false)
            ->where('created_at', '>', $sixMonthsAgo)
            ->select('city', 'area', DB::raw('COUNT(*) as listing_count, ROUND(AVG(sale_price)) as avg_price'))
            ->groupBy('city', 'area')
            ->orderBy('city')
            ->get()
            ->groupBy('city')
            ->map(fn ($areas) => $areas->map(fn ($row) => [
                'name'         => $row->area,
                'listingCount' => $row->listing_count,
                'avgPrice'     => (int) $row->avg_price,
            ])->values()->all())
            ->toArray();
    
        // ── Stats ────────────────────────────────────────────────────────────
        return inertia('Home', [
            'verifiedRentals'     => $verifiedRentals,
            'verifiedSales'       => $verifiedSales,
            'rentalAreas'         => $rentalAreas,
            'saleAreas'           => $saleAreas,
            'totalAreas'          => Rental::distinct()->count('area'),
            'totalVerifiedAgents' => User::where('status', 'verified')->where('role', 'agent')->count(),
            'totalListings'       => Rental::count(),
            'users'               => User::count(),
        ]);
    }

    public function about()
    {
        $totalListings = Rental::count();
        $totalVerifiedAgents = User::where('status', 'verified')->where('role', 'agent')->count();
        $totalAreas = Rental::distinct('area')->count('area');
        $platformRating = Review::avg('overall_rating');

        return inertia('Static/About', [
            'totalListings' => $totalListings,
            'totalVerifiedAgents' => $totalVerifiedAgents,
            'totalAreas' => $totalAreas,
            'platformRating' => $platformRating ? round($platformRating, 1) : null,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreListingRequest $request)
    {
        $user = Auth::user();
        $validated = $request->validated();
        $purpose = $validated['purpose'];
 
        $limitService = new ListingLimitService();
 
        if ($purpose === 'rent' && !$limitService->canCreateRental($user)) {
            $status = $limitService->getLimitStatus($user);
            $remaining = $status['rentals']['limit'] ?? 0;
            return redirect()->back()
                ->with('toast', [
                    'type'    => 'error',
                    'title'   => 'Rental Limit Reached',
                    'message' => "Your {$status['plan']} plan allows {$remaining} rental listing(s). Upgrade to add more.",
                ])
                ->withInput();
        }
 
        if ($purpose === 'sale' && !$limitService->canCreateSale($user)) {
            $status = $limitService->getLimitStatus($user);
            $remaining = $status['sales']['limit'] ?? 0;
            return redirect()->back()
                ->with('toast', [
                    'type'    => 'error',
                    'title'   => 'Sale Limit Reached',
                    'message' => "Your {$status['plan']} plan allows {$remaining} sale listing(s). Upgrade to add more.",
                ])
                ->withInput();
        }
 
        $amenities = $request->amenities;
        if (is_string($amenities)) {
            $decoded = json_decode($amenities, true);
            $amenities = is_array($decoded) ? $decoded : [];
        } elseif (!is_array($amenities)) {
            $amenities = [];
        }
 
        try {
            $filePaths = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    if ($file && $file->isValid()) {
                        $fileName = 'rental_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                        $file->storeAs('rental_images', $fileName, 'public');
                        $filePaths[] = $fileName;
                    }
                }
            }
 
            $listingData = [
                'rental_id'           => Rental::generateUUID(),
                'user_id'             => $user->id,
                'purpose'             => $purpose,
                'title'               => $request->title,
                'property_type'       => $request->propertyType,
                'city'                => $request->city,
                'area'                => $request->area,
                'address'             => $request->address,
                'bedrooms'            => $request->bedrooms,
                'bathrooms'           => $request->bathrooms ?? 0,
                'amenities'           => $amenities,
                'description'         => $request->description,
                'agent_name'          => $request->agentName,
                'agent_phone'         => $request->agentPhone,
                'agent_email'         => $request->agentEmail,
                'status'              => 'active',
                'is_verified'         => false,
                'images'              => $filePaths,
            ];
 
            // Add purpose-specific data
            if ($purpose === 'rent') {
                $listingData['rent_min'] = $request->rentMin;
                $listingData['rent_max'] = $request->rentMax;
                $listingData['advance_duration']  = $request->advanceDuration;
                $listingData['sale_price'] = null;
            } else {
                $listingData['sale_price'] = $request->salePrice;
                $listingData['rent_min'] = null;
                $listingData['rent_max'] = null;
                $listingData['advance_duration']  = null;
            }
 
            // Create listing
            $rental = Rental::create($listingData);
 
            if ($user->role === 'admin') {
                AdminAuditLog::record('listing', 'Listing created', [
                    'affected_user' => $user->name,
                    'affected_id' => $rental->id,
                    'notes' => "Admin created a new {$purpose} listing.",
                    'properties' => [
                        'title' => $rental->title,
                        'purpose' => $rental->purpose,
                        'city' => $rental->city,
                        'area' => $rental->area,
                    ],
                ]);
            }
 
            NotifySubscribersOfNewListing::dispatch($rental);
 
            $typeLabel = $purpose === 'rent' ? 'Rental' : 'Sale';
            return redirect()->back()
                ->with('success', "{$typeLabel} listing created successfully! It will be reviewed and activated soon.");
 
        } catch (\Exception $e) {
            Log::error('Failed to create listing: ' . $e->getMessage());
 
            return redirect()->back()
                ->with('error', 'Failed to create listing. Please try again.')
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Rental $rent)
    {
        // record view if not already counted in past 24h
        try {
            $ip = $request->ip();
            $userId = Auth::id();
            if (!ListingView::hasViewInWindow($rent->id, $ip, $userId)) {
                ListingView::create([
                    'listing_view_id' => ListingView::generateUUID(),
                    'rental_id'  => $rent->id,
                    'user_id'    => $userId,
                    'ip'         => $ip,
                    'user_agent' => $request->userAgent(),
                    'referrer'   => $request->headers->get('referer'),
                ]);
            }
        } catch (\Exception $e) {
            Log::warning('Failed to track listing view: ' . $e->getMessage());
        }

        $userIds = collect([$rent->agent_id, $rent->user_id])->filter()->unique();

        $users = User::whereIn('id', $userIds)
            ->select('id', 'name', 'email', 'phone', 'company', 'bio', 'status', 'fee', 'role')
            ->get()
            ->keyBy('id');

        $agent = $users->get($rent->agent_id) ?? $users->get($rent->user_id);

        $reviews = Review::where('rental_id', $rent->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('PropertyDetailsPage', [
            'rental' => $rent,
            'agent' => $agent,
            'reviews' => $reviews,
            'seo' => app(SeoService::class)->propertyMeta($rent),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateListingRequest $request, Rental $rent)
    {
        Log::info('Rental update request', [
            'rental_id' => $rent->id,
            'has_new_images' => $request->hasFile('newImages'),
            'existing_images_count' => count($request->input('existingImages', [])),
            'removed_images_count' => count($request->input('removedImages', []))
        ]);

        $validated = $request->validated();
        $purpose = $request->input('purpose', $rent->purpose);

        try {
            $currentImages = $this->parseImages($rent->images);

            $existingImages = $request->input('existingImages', []);

            $removedImages = $request->input('removedImages', []);

            foreach ($removedImages as $imagePath) {
                if (in_array($imagePath, $currentImages)) {
                    $this->deleteImage($imagePath);
                }
            }

            $amenitiesArray = [];
            if (! empty($validated['amenities'])) {
                $decoded = json_decode($validated['amenities'], true);
                if (is_array($decoded)) {
                    $amenitiesArray = $decoded;
                }
            }

            // Handle new image uploads
            $newImagePaths = [];
            $uploadErrors = [];

            if ($request->hasFile('newImages')) {
                $imageIndex = 0;
                foreach ($request->file('newImages') as $image) {
                    try {
                        // Validate file before upload
                        if (!$image->isValid()) {
                            $uploadErrors[] = "Image " . ($imageIndex + 1) . " is invalid or corrupted.";
                            $imageIndex++;
                            continue;
                        }

                        // Generate unique filename
                        $fileName = 'rental_'.time().'_'.uniqid().'.'.$image->getClientOriginalExtension();

                        // Store in public/storage/rental_images
                        $path = $image->storeAs('rental_images', $fileName, 'public');

                        if ($path) {
                            $newImagePaths[] = $fileName; // Store just the filename
                        } else {
                            $uploadErrors[] = "Image " . ($imageIndex + 1) . " could not be saved to storage.";
                        }
                    }
                    catch (\Exception $e) {
                        $uploadErrors[] = "Image " . ($imageIndex + 1) . " failed: " . $e->getMessage();
                        Log::error('Image upload failed', [
                            'error' => $e->getMessage(),
                            'rental_id' => $rent->id,
                            'image_index' => $imageIndex
                        ]);
                    }
                    $imageIndex++;
                }

                // If there were upload errors, return early with error message
                if (!empty($uploadErrors)) {
                    return back()
                        ->withErrors(['newImages' => implode(' ', $uploadErrors)])
                        ->withInput()
                        ->with('error', 'Some images failed to upload. ' . implode(' ', $uploadErrors));
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

            // Prepare update payload
            $isSold = $request->boolean('is_sold');
            $isRented = $request->boolean('is_rented');

            $updateData = [
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
                'images' => $finalImages,
                'updated_at' => now(),
                'status' => $request->has('status') ? $request->status : $rent->status,
                'is_sold' => $isSold,
                'is_rented' => $isRented,
            ];

            if ($request->has('status')) {
                // Admin path: explicit status control
                $updateData['status'] = $request->status;

                if ($request->status === 'active' && $rent->status !== 'active') {
                    $updateData['is_sold'] = false;
                    $updateData['is_rented'] = false;
                    $updateData['sold_at'] = null;
                    $updateData['rented_at'] = null;
                }
            } else {
                // Agent path: derive status from availability flags
                $updateData['status'] = $isSold ? 'sold' : ($isRented ? 'rented' : 'active');
            }

            if ($isSold) {
                $updateData['sold_at'] = $rent->is_sold ? $rent->sold_at : now();
            } else {
                $updateData['sold_at'] = null;
            }

            if ($isRented) {
                $updateData['rented_at'] = $rent->is_rented ? $rent->rented_at : now();
            } else {
                $updateData['rented_at'] = null;
            }

            $rent->update($updateData);

            Log::info('Rental updated successfully', [
                'rental_id' => $rent->id,
                'title' => $rent->title
            ]);

            if (Auth::user()?->role === 'admin') {
                AdminAuditLog::record('listing', 'Listing Updated', [
                    'affected_user' => $rent->user?->name,
                    'affected_id' => $rent->id,
                    'notes' => "Admin updated a {$purpose} listing.",
                    'properties' => [
                        'listing_title' => $rent->title,
                        'listing_city' => $rent->city,
                        'listing_area' => $rent->area,
                    ],
                ]);
            }

            return response()->json([
                'message' => 'Rental listing updated successfully!',
                'rental'  => $rent,
            ]);


        } catch (\Exception $e) {
            Log::error('Rental update failed', [
                'rental_id' => $rent->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to update listing. Please try again.',
            ], 500);
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
        try {
            // Delete associated images from storage
            if (!empty($rent->images)) {
                $images = is_array($rent->images) ? $rent->images : json_decode($rent->images, true);
                if (is_array($images)) {
                    foreach ($images as $imagePath) {
                        $this->deleteImage($imagePath);
                    }
                }
            }

            $rentalTitle = $rent->title;
            $affectedUser = $rent->user?->name ?? 'Unknown';
            $rent->delete();

            if (Auth::user()?->role === 'admin') {
                AdminAuditLog::record('listing', 'Listing deleted', [
                    'affected_user' => $affectedUser,
                    'affected_id' => $rent->id,
                    'notes' => "Admin deleted listing '{$rentalTitle}'.",
                    'properties' => [
                        'title' => $rentalTitle,
                        'city' => $rent->city,
                        'area' => $rent->area,
                    ],
                ]);
            }

            return redirect()->back()->with('success', "Listing '{$rentalTitle}' has been deleted successfully.");
        } catch (\Exception $e) {
            Log::error('Failed to delete rental listing', [
                'rental_id' => $rent->id,
                'error' => $e->getMessage()
            ]);

            return redirect()->back()->with('error', 'Failed to delete listing. Please try again.');
        }
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
     * Ajax endpoint that explicitly tracks a view (useful when the page is cached or rendered as SPA)
     */
    public function trackView(Request $request, Rental $rent)
    {
        $ip = $request->ip();
        $userId = Auth::id();
        if (! ListingView::hasViewInWindow($rent->id, $ip, $userId)) {
            ListingView::create([
                'listing_view_id' => ListingView::generateUUID(),
                'rental_id'  => $rent->id,
                'user_id'    => $userId,
                'ip'         => $ip,
                'user_agent' => $request->userAgent(),
                'referrer'   => $request->headers->get('referer'),
            ]);
        }

        return response()->json(['tracked' => true]);
    }

    /**
     * Record an inquiry event tied to a listing.
     */
    public function trackInquiry(Request $request, Rental $rent)
    {
        $data = $request->validate([
            'type'    => ['required', 'in:' . implode(',', ListingInquiry::validTypes())],
            'message' => 'required|string|max:1000',
        ]);

        $inquiry = ListingInquiry::create([
            'listing_inquiry_id' => ListingInquiry::generateUUID(),
            'rental_id' => $rent->id,
            'user_id'   => Auth::id(),
            'type'      => $data['type'],
            'message'   => $data['message'],
            'ip'        => $request->ip(),
        ]);

        // Notify the agent about the new inquiry
        $emailSent = false;

        $agent = User::whereIn('id', collect([$rent->agent_id, $rent->user_id])->filter()->unique())
            ->select('id', 'name', 'email', 'phone', 'company', 'bio', 'status', 'fee', 'role')
            ->get()
            ->keyBy('id')
            ->first(fn ($u, $id) => $id === $rent->agent_id) 
            ?? null;

        $agentId = $rent->agent_id ?? $rent->user_id;
        $agent = $agentId ? User::find($agentId) : null;
 
        $tenant = Auth::user();
        $typeLabel = ucfirst($data['type']);

        if ($agent && filter_var($agent->email, FILTER_VALIDATE_EMAIL)) {
            $dashboardUrl = url('/agent-dashboard/');

            $body = <<<TEXT
            Hi {$agent->name},

            You've received a new inquiry on RentTrustGH.

            Property   : {$rent->title}
            Inquiry    : {$typeLabel}

            From       : {$tenant->name}
            Email      : {$tenant->email}
            Phone      : {$tenant->phone}

            Message
            -------
            {$data['message']}

            Reply from your dashboard:
            {$dashboardUrl}

            — RentTrustGH
            TEXT;

            try {
                Mail::raw($body, function ($message) use ($agent, $rent, $typeLabel) {
                    $message->to($agent->email, $agent->name)
                            ->subject("New {$typeLabel} inquiry: {$rent->title}");
                });

                $emailSent = true;

                Log::info('Inquiry notification email sent', [
                    'rental_id'   => $rent->id,
                    'inquiry_id'  => $inquiry->listing_inquiry_id,
                    'agent_email' => $agent->email,
                ]);
            } catch (\Throwable $e) {
                Log::warning('Failed to send inquiry notification email', [
                    'error'       => $e->getMessage(),
                    'rental_id'   => $rent->id,
                    'inquiry_id'  => $inquiry->listing_inquiry_id,
                    'agent_email' => $agent->email ?? 'missing',
                ]);
            }
        } else {
            Log::info('Inquiry notification email skipped – no valid agent email', [
                'rental_id'  => $rent->id,
                'inquiry_id' => $inquiry->listing_inquiry_id,
                'has_agent'  => (bool) $agent,
            ]);
        }

        return redirect()->back()->with([
            'success' => true,
            'message' => 'Your inquiry has been sent to the agent. They will contact you soon.'
        ]);
    }

    public function areas() {
        $sixMonthsAgo = now()->subMonths(6);
        $areas = Rental::select('city', 'area', 'rent_min', 'rent_max', 'created_at')
            ->where('created_at', '>', $sixMonthsAgo)
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

    private function buildFeaturesList(Plan $plan): array
    {
        $rentalDesc = $plan->rental_limit === null
        ? 'Unlimited rental listings'
        : "{$plan->rental_limit} rental listings";

        $saleDesc = $plan->sale_limit === null
        ? 'Unlimited sale listings'
        : "{$plan->sale_limit} sale listings";

        // Dynamic features computed from DB column values
        $computed = array_values(array_filter([
        $plan->boost_limit > 0  ? "{$plan->boost_limit} listing boosts/month" : null,
        $plan->lead_limit > 0   ? "{$plan->lead_limit} lead contacts/month"   : null,
        $plan->verified_badge   ? 'Verified landlord badge'                    : null,
        $plan->priority_ranking ? 'Priority search ranking'                    : null,
        $plan->analytics_access ? 'Analytics dashboard access'                 : null,
        ]));
    
        // Features stored in the JSON column — cast to array in the model
        $fromDb = is_array($plan->features) ? $plan->features : [];
    
        // Merge: DB features first, then append any computed ones not already listed
        $merged = $fromDb;
        foreach ($computed as $item) {
        if (!in_array($item, $merged, true)) {
            $merged[] = $item;
        }
        }
    
        // Always inject the accurate rental/sale line from DB limits
        array_unshift($merged, $rentalDesc, $saleDesc);
    
        // De-duplicate while preserving order
        return array_values(array_unique($merged));
    }

    public function pricing()
    {
        $plans = Plan::active()->get()->map(function (Plan $plan) {
            return [
                'id'            => $plan->id,
                'name'          => $plan->name,
                'slug'          => $plan->slug,
                'description'   => $plan->description,
                'price'         => (float) $plan->price,
                'currency'      => $plan->currency ?? 'GHS',
                'interval'      => $plan->interval,
                'features'      => $this->buildFeaturesList($plan), 
                'is_popular'    => $plan->slug === 'pro',           
                'is_free'       => $plan->isFree(),
                'cta_text'      => $plan->isFree() ? 'Get Started Free' : "Choose {$plan->name}",
                'listing_limit' => $plan->listing_limit,
                'rental_limit'  => $plan->rental_limit,
                'sale_limit'    => $plan->sale_limit,
                'boost_limit'   => $plan->boost_limit,
                'lead_limit'    => $plan->lead_limit,
                'priority_ranking' => $plan->priority_ranking,
                'analytics_access' => $plan->analytics_access,
                'sort_order'    => $plan->sort_order,
            ];
        });

        return inertia('Static/PricingPage', [
            'plans' => $plans,
        ]);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);
 
        $subscriber = NewsletterSubscriber::where('email', $request->email)->first();
 
        if ($subscriber) {
            if ($subscriber->unsubscribed_at) {
                $subscriber->update(['unsubscribed_at' => null]);
            }
        } else {
            $subscriber = NewsletterSubscriber::create(['email' => $request->email]);
 
            Mail::raw(
                "Thanks for subscribing to RentTrustGh!\n\nYou'll now get an email whenever new verified listings go live.\n\nIf this wasn't you, just ignore this email.",
                function ($message) use ($request) {
                    $message->to($request->email)
                        ->subject('Welcome to RentTrustGh listings updates');
                }
            );
        }
 
        return back();
    }

}