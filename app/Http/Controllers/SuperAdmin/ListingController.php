<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rental;
use App\Models\PropertyType;
use App\Models\Amenity;
use App\Models\User;
use App\Models\AdminAuditLog;
use App\Models\Location;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Mail\ListingUpdatedMail;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ListingController extends Controller
{
    public function index()
    {
        $listings = Rental::latest()
            ->withCount(['views', 'inquiries', 'reviews'])
            ->get();
    
        $metrics = [
            'total'        => $listings->count(),
            'active'       => $listings->where('status', 'approved')->count(),
            'pending'      => $listings->where('status', 'pending')->count(),
            'flagged'      => 0, // replace with your flagged logic
            // Sale-specific
            'sale_total'   => $listings->where('purpose', 'sale')->count(),
            'sale_active'  => $listings->where('purpose', 'sale')->where('status', 'approved')->count(),
            'sale_sold'    => $listings->where('purpose', 'sale')->where('is_sold', true)->count(),
            // Rent-specific
            'rent_total'   => $listings->where('purpose', 'rent')->count(),
            'rent_active'  => $listings->where('purpose', 'rent')->where('status', 'approved')->count(),
        ];
    
        return inertia('SuperAdmin/Listings/Index', [
            'listings' => $listings,
            'metrics'  => $metrics,
        ]);
    }

    public function verification(Request $request)
    {
        $filter = $request->query('filter', 'all');

        $query = \App\Models\VerificationRequest::with(['rental', 'agent'])
            ->orderBy('created_at', 'desc');

        if (in_array($filter, ['pending', 'approved', 'rejected'], true)) {
            $query->where('status', $filter);
        }

        $verificationRequests = $query->paginate(20)->appends(['filter' => $filter]);

        // Append documents to each request
        $verificationRequests->getCollection()->transform(function ($request) {
            $request->documents = $request->documents;
            return $request;
        });

        $metrics = [
            'total' => \App\Models\VerificationRequest::count(),
            'pending' => \App\Models\VerificationRequest::where('status', 'pending')->count(),
            'approved' => \App\Models\VerificationRequest::where('status', 'approved')->count(),
            'rejected' => \App\Models\VerificationRequest::where('status', 'rejected')->count(),
        ];

        return Inertia::render('SuperAdmin/Listings/Verification', [
            'listings' => $verificationRequests,
            'metrics'  => $metrics,
            'filter'   => $filter,
        ]);
    }

    // ─── Approve Verification ──────────────────────────────────────────────────

    public function approveVerification(\App\Models\VerificationRequest $verification_request)
    {
        if ($verification_request->status === 'approved') {
            return back()->with('error', 'This verification request is already approved.');
        }

        $oldStatus = $verification_request->status;
        $verification_request->update([
            'status' => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        // Update the associated rental's verification status
        if ($verification_request->rental) {
            $verification_request->rental->update([
                'is_verified' => true,
                'verification_status' => 'verified',
                'verified_at' => now(),
            ]);
        }

        // Audit log
        $listingTitle = $verification_request->rental ? $verification_request->rental->title : 'Unknown Listing';
        $agentName = $verification_request->agent ? $verification_request->agent->name : 'Unknown Agent';
        \App\Models\AdminAuditLog::record('verification', "Verification request approved: {$listingTitle}", [
            'affected_user' => $agentName,
            'affected_id' => $verification_request->id,
            'notes' => "Status changed from {$oldStatus} to approved",
            'properties' => [
                'old_status' => $oldStatus,
                'new_status' => 'approved',
                'verification_request_id' => $verification_request->id,
                'rental_id' => $verification_request->rental_id,
            ],
        ]);

        Log::info('SuperAdmin approved verification request', [
            'verification_request_id' => $verification_request->id,
            'rental_id' => $verification_request->rental_id,
            'admin_id' => auth()->id(),
        ]);

        return back()->with('success', "Verification request for \"{$listingTitle}\" approved successfully.");
    }

    // ─── Reject Verification ───────────────────────────────────────────────────

    public function rejectVerification(Request $request, \App\Models\VerificationRequest $verification_request)
    {
        $request->validate([
            'rejection_reason' => ['nullable', 'string', 'max:1000'],
        ]);

        if ($verification_request->status === 'rejected') {
            return back()->with('error', 'This verification request is already rejected.');
        }

        $oldStatus = $verification_request->status;
        $verification_request->update([
            'status' => 'rejected',
            'rejection_reason' => $request->input('rejection_reason'),
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        // Update the associated rental's verification status
        if ($verification_request->rental) {
            $verification_request->rental->update([
                'verification_status' => 'rejected',
                'verification_rejection_reason' => $request->input('rejection_reason'),
            ]);
        }

        // Audit log
        $listingTitle = $verification_request->rental ? $verification_request->rental->title : 'Unknown Listing';
        $agentName = $verification_request->agent ? $verification_request->agent->name : 'Unknown Agent';
        \App\Models\AdminAuditLog::record('verification', "Verification request rejected: {$listingTitle}", [
            'affected_user' => $agentName,
            'affected_id' => $verification_request->id,
            'notes' => "Status changed from {$oldStatus} to rejected",
            'properties' => [
                'old_status' => $oldStatus,
                'new_status' => 'rejected',
                'rejection_reason' => $request->input('rejection_reason'),
                'verification_request_id' => $verification_request->id,
                'rental_id' => $verification_request->rental_id,
            ],
        ]);

        Log::info('SuperAdmin rejected verification request', [
            'verification_request_id' => $verification_request->id,
            'rental_id' => $verification_request->rental_id,
            'reason' => $request->input('rejection_reason'),
            'admin_id' => auth()->id(),
        ]);

        return back()->with('success', "Verification request for \"{$listingTitle}\" has been rejected.");
    }

    // ─── Create ───────────────────────────────────────────────────────────────

    public function create()
    {
        $regions = Location::where('type', 'region')
            ->orWhere('type', 'city')
            ->where('is_active', true)
            ->orderBy('name')
            ->select('id', 'name', 'slug')
            ->with([
                'children' => fn ($q) => $q
                    ->where('is_active', true)
                    ->orderBy('name')
                    ->select('id', 'parent_id', 'name', 'slug', 'type'),
            ])
            ->get();

        return Inertia::render('SuperAdmin/Listings/ListingCreate', [
            'agents'         => User::select('id', 'name', 'company as agency', 'phone', 'email')
                                    ->where('role', 'agent')
                                   ->orderBy('name')->get(),
            'amenities'      => Amenity::active()
                                   ->select('id', 'name', 'icon', 'category')
                                   ->orderBy('category')->orderBy('name')->get(),
            'property_types' => PropertyType::orderBy('sort_order')
                                   ->orderBy('name')
                                   ->select('id', 'name', 'icon', 'slug')
                                   ->get(),
            'regions'        => $regions,
        ]);
    }

    // ─── Store ────────────────────────────────────────────────────────────────
 
    public function store(Request $request)
{
    // ── Determine purpose ─────────────────────────────────────────────────────
    $purpose = $request->input('purpose', 'rent');
    if (!in_array($purpose, ['rent', 'sale', 'short', 'lease'])) {
        return redirect()->back()
            ->with('error', 'Invalid listing purpose.')
            ->withInput();
    }
 
    // ── Decode amenities — frontend may send a JSON string or array ───────────
    $amenities = $request->amenities;
    if (is_string($amenities)) {
        $decoded   = json_decode($amenities, true);
        $amenities = is_array($decoded) ? $decoded : [];
    } elseif (!is_array($amenities)) {
        $amenities = [];
    }
 
    // ── Validation rules ──────────────────────────────────────────────────────
    $rules = [
        'title'        => 'required|string|max:255',
        'propertyType' => 'nullable|string|max:100',
        'city'         => 'required|string|max:100',
        'area'         => 'required|string|max:255',
        'address'      => 'nullable|string|max:500',
        'bedrooms'     => 'nullable|integer|min:0',
        'bathrooms'    => 'nullable|integer|min:0',
        'description'  => 'nullable|string',
        'agentName'    => 'nullable|string|max:255',
        'agentPhone'   => 'nullable|string|max:20',
        'agentEmail'   => 'nullable|email|max:255',
        'amenities'    => 'nullable',
        'is_featured'  => 'boolean',
        'is_verified'  => 'boolean',
        'status'       => 'required|in:active,pending,draft',
        'images.*'     => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
    ];
 
    // Purpose-specific price rules — mirrors agent store exactly
    if ($purpose === 'rent' || $purpose === 'short' || $purpose === 'lease') {
        $rules['rentMin']         = 'required|numeric|min:0';
        $rules['rentMax']         = 'required|numeric|min:0|gte:rentMin';
        $rules['advanceDuration'] = 'nullable|integer|min:1';
        $rules['salePrice']       = 'prohibited';
    } else {
        $rules['salePrice']       = 'required|numeric|min:0';
        $rules['rentMin']         = 'prohibited';
        $rules['rentMax']         = 'prohibited';
        $rules['advanceDuration'] = 'prohibited';
    }
 
    $messages = [
        'title.required'       => 'Property title is required.',
        'city.required'        => 'City is required.',
        'area.required'        => 'Area is required.',
        'rentMin.required'     => 'Minimum rent is required for rental listings.',
        'rentMin.numeric'      => 'Minimum rent must be a valid number.',
        'rentMax.required'     => 'Maximum rent is required.',
        'rentMax.gte'          => 'Maximum rent must be at least equal to minimum rent.',
        'salePrice.required'   => 'Sale price is required for sale listings.',
        'salePrice.numeric'    => 'Sale price must be a valid number.',
        'images.*.image'       => 'Each file must be a valid image.',
        'images.*.mimes'       => 'Images must be JPEG, PNG, JPG, GIF, or WebP.',
        'images.*.max'         => 'Each image must not exceed 5MB.',
    ];
 
    $validator = Validator::make($request->all(), $rules, $messages);
 
    if ($validator->fails()) {
        return redirect()->back()
            ->withErrors($validator)
            ->withInput();
    }
 
    try {
        // ── Handle image uploads — same pattern as agent store ─────────────────
        $filePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                if ($file && $file->isValid()) {
                    $fileName = 'rental_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $file->storeAs('rental_images', $fileName, 'public');
                    $filePaths[] = $fileName;   // store filename only, matches agent store
                }
            }
        }
 
        // ── Build listing data ────────────────────────────────────────────────
        $listingData = [
            'rental_id'    => Rental::generateUUID(),
            'user_id'      => auth()->id(),
            'purpose'      => $purpose,
            'title'        => $request->title,
            'property_type'=> $request->propertyType,
            'city'         => $request->city,
            'area'         => $request->area,
            'address'      => $request->address,
            'bedrooms'     => $request->bedrooms,
            'bathrooms'    => $request->bathrooms ?? 0,
            'amenities'    => $amenities,
            'description'  => $request->description,
            'agent_name'   => $request->agentName,
            'agent_phone'  => $request->agentPhone,
            'agent_email'  => $request->agentEmail,
            'is_featured'  => $request->boolean('is_featured', false),
            'is_verified'  => $request->boolean('is_verified', false),
            'status'       => $request->input('status', 'pending'),
            'images'       => $filePaths,
        ];
 
        // Purpose-specific price fields
        if ($purpose === 'sale') {
            $listingData['sale_price']       = $request->salePrice;
            $listingData['rent_min']         = null;
            $listingData['rent_max']         = null;
            $listingData['advance_duration'] = null;
        } else {
            $listingData['rent_min']         = $request->rentMin;
            $listingData['rent_max']         = $request->rentMax;
            $listingData['advance_duration'] = $request->advanceDuration;
            $listingData['sale_price']       = null;
        }
 
        $listing = Rental::create($listingData);
 
        Log::info('SuperAdmin created listing', [
            'listing_id' => $listing->id,
            'admin_id'   => auth()->id(),
        ]);
 
        return redirect()
            ->route('super-admin.listings.show', $listing)
            ->with('success', "Listing \"{$listing->title}\" created successfully.");
 
    } catch (\Exception $e) {
        Log::error('SuperAdmin failed to create listing: ' . $e->getMessage());
 
        return redirect()->back()
            ->with('error', 'Failed to create listing. Please try again.')
            ->withInput();
    }
}

    // ─── Show ─────────────────────────────────────────────────────────────────
 
    public function show(Rental $listing)
    {
        $listing->load([
            'user:id,name,email,phone,avatar,company',
        ]);
        $listing->loadCount(['inquiries', 'reports as flagged_count', 'views']);

        $regions = Location::where('type', 'region')
            ->orWhere('type', 'city')
            ->where('is_active', true)
            ->orderBy('name')
            ->select('id', 'name', 'slug')
            ->with([
                'children' => fn ($q) => $q
                    ->where('is_active', true)
                    ->orderBy('name')
                    ->select('id', 'parent_id', 'name', 'slug', 'type'),
            ])
            ->get();

        return Inertia::render('SuperAdmin/Listings/ListingShow', [
            'listing'        => $listing,
            'property_types' => PropertyType::active()->select('id', 'name', 'slug')->orderBy('name')->get(),
            'regions'        => $regions,
        ]);
    }

    // ─── Edit ─────────────────────────────────────────────────────────────────

    public function edit(Rental $listing)
{
    $listing->load(['user:id,name,email,company']);
    $listing->loadCount(['inquiries', 'reports as flagged_count', 'views']); // ← add views

    $regions = Location::where('type', 'region')
        ->orWhere('type', 'city')
        ->where('is_active', true)
        ->orderBy('name')
        ->select('id', 'name', 'slug')
        ->with([
            'children' => fn ($q) => $q
                ->where('is_active', true)
                ->orderBy('name')
                ->select('id', 'parent_id', 'name', 'slug', 'type'),
        ])
        ->get();

    return Inertia::render('SuperAdmin/Listings/ListingEdit', [
        'listing'        => $this->formatListing($listing, $regions), // ← pass regions
        'agents'         => User::select('id', 'name', 'company as agency')->orderBy('name')->get(),
        'amenities'      => Amenity::active()->select('id', 'name', 'icon', 'category')->orderBy('name')->get(),
        'property_types' => PropertyType::active()->select('id', 'name', 'slug')->orderBy('name')->get(),
        'regions'        => $regions,
    ]);
}

    // ─── Update ───────────────────────────────────────────────────────────────
 
    public function update(Request $request, Rental $listing)
    {
        Log::info('SuperAdmin listing update request', [
            'listing_id'            => $listing->id,
            'has_new_images'        => $request->hasFile('newImages'),
            'existing_images_count' => count($request->input('existingImages', [])),
            'removed_images_count'  => count($request->input('removedImages', [])),
        ]);
    
        // ── Amenities — decode if sent as JSON string ─────────────────────────────
        $amenities = $request->amenities;
        if (is_array($amenities)) {
            $amenities = json_encode($amenities);
        }
        $request->merge(['amenities' => $amenities]);
    
        // ── Purpose + isSale ──────────────────────────────────────────────────────
        $purpose = $request->input('purpose', $listing->purpose ?? 'rent');
        $isSale  = $purpose === 'sale';
    
        // ── Status map — DB only accepts 'pending', 'approved', 'rejected' ────────
        $statusMap = [
            'active'   => 'approved',
            'approved' => 'approved',
            'pending'  => 'pending',
            'rejected' => 'rejected',
            'rented'   => 'rented',
            'sold'     => 'sold'
        ];
        $dbStatus = $statusMap[$request->input('status', 'pending')] ?? 'pending';
    
        // ── Purpose map — DB only accepts 'rent', 'sale' ──────────────────────────
        $purposeMap = [
            'sale'  => 'sale',
            'rent'  => 'rent',
            'short' => 'rent',
            'lease' => 'rent',
        ];
        $dbPurpose = $purposeMap[$purpose] ?? 'rent';
    
        // ── Validation rules ──────────────────────────────────────────────────────
        $rules = [
            'title'            => 'required|string|max:255',
            'propertyType'     => 'nullable|string|max:100',
            'area'             => 'required|string|max:255',
            'city'             => 'required|string|max:255',
            'address'          => 'nullable|string|max:500',
            'bedrooms'         => 'nullable|integer|min:0',
            'bathrooms'        => 'nullable|integer|min:0',
            'description'      => 'nullable|string',
            'agentName'        => 'nullable|string|max:255',
            'agentPhone'       => 'nullable|string|max:20',
            'agentEmail'       => 'nullable|email|max:255',
            'amenities'        => 'nullable',
            'status'           => 'nullable|string',
            'is_featured'      => 'nullable|boolean',
            'is_verified'      => 'nullable|boolean',
            'newImages.*'      => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'existingImages'   => 'nullable|array',
            'existingImages.*' => 'string',
            'removedImages'    => 'nullable|array',
            'removedImages.*'  => 'string',
        ];
    
        // Purpose-specific price rules — same as agent store
        if ($isSale) {
            $rules['salePrice']       = 'required|numeric|min:0';
            $rules['rentMin']         = 'prohibited';
            $rules['rentMax']         = 'prohibited';
            $rules['advanceDuration'] = 'prohibited';
        } else {
            $rules['rentMin']         = 'required|numeric|min:0';
            $rules['rentMax']         = 'required|numeric|min:0|gte:rentMin';
            $rules['advanceDuration'] = 'nullable|integer|min:1|max:5';
            $rules['salePrice']       = 'prohibited';
        }
    
        $validator = Validator::make($request->all(), $rules, [
            'rentMax.gte'        => 'Maximum rent must be ≥ minimum rent.',
            'newImages.*.max'    => 'Each image must not exceed 5 MB.',
            'newImages.*.mimes'  => 'Images must be jpeg, png, jpg, gif, or webp.',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors'  => $validator->errors(),
            ], 422);
        }
    
        try {
            // ── Image handling — identical to agent update() ───────────────────────
            $currentImages  = $this->parseImages($listing->images);
            $existingImages = $request->input('existingImages', []);
            $removedImages  = $request->input('removedImages',  []);
    
            // Delete removed images from storage
            foreach ($removedImages as $imagePath) {
                $bare = basename($imagePath);
                if (in_array($bare, $currentImages, true)) {
                    Storage::disk('public')->delete("rental_images/{$bare}");
                }
            }
    
            // Upload new images
            $newImagePaths = [];
            $uploadErrors  = [];
    
            if ($request->hasFile('newImages')) {
                $imageIndex = 0;
                foreach ($request->file('newImages') as $image) {
                    try {
                        if (!$image->isValid()) {
                            $uploadErrors[] = "Image " . ($imageIndex + 1) . " is invalid or corrupted.";
                            $imageIndex++;
                            continue;
                        }
    
                        $fileName = 'rental_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                        $path     = $image->storeAs('rental_images', $fileName, 'public');
    
                        if ($path) {
                            $newImagePaths[] = $fileName;
                        } else {
                            $uploadErrors[] = "Image " . ($imageIndex + 1) . " could not be saved.";
                        }
                    } catch (\Exception $e) {
                        $uploadErrors[] = "Image " . ($imageIndex + 1) . " failed: " . $e->getMessage();
                        Log::error('SuperAdmin image upload failed', [
                            'listing_id'  => $listing->id,
                            'image_index' => $imageIndex,
                            'error'       => $e->getMessage(),
                        ]);
                    }
                    $imageIndex++;
                }
    
                if (!empty($uploadErrors)) {
                    return response()->json([
                        'message' => 'Some images failed to upload.',
                        'errors'  => ['newImages' => implode(' ', $uploadErrors)],
                    ], 422);
                }
            }
    
            // Merge existing + new, cap at 6, normalise to bare filenames
            $finalImages = array_slice(
                array_merge(
                    array_map('basename', $existingImages),
                    $newImagePaths
                ),
                0, 6
            );
    
            // Guard: never allow empty — images column is NOT NULL
            if (empty($finalImages)) {
                $finalImages = $currentImages;
            }
    
            Log::info('SuperAdmin image processing complete', [
                'listing_id'     => $listing->id,
                'kept_existing'  => count($existingImages),
                'uploaded_new'   => count($newImagePaths),
                'deleted'        => count($removedImages),
                'final_total'    => count($finalImages),
            ]);
    
            // ── Decode amenities ──────────────────────────────────────────────────
            $amenitiesArray = [];
            if (!empty($amenities)) {
                $decoded = json_decode($amenities, true);
                if (is_array($decoded)) {
                    $amenitiesArray = $decoded;
                }
            }
    
            // ── Update listing ────────────────────────────────────────────────────
            $listing->update([
                'title'            => $request->title,
                'property_type'    => $request->propertyType,
                'area'             => $request->area,
                'city'             => $request->city,
                'address'          => $request->address,
                'bedrooms'         => $request->bedrooms,
                'bathrooms'        => $request->bathrooms ?? 0,
                'amenities'        => $amenitiesArray,
                'description'      => $request->description,
                'agent_name'       => $request->input('agentName')  ?: $listing->agent_name,
                'agent_phone'      => $request->input('agentPhone') ?: $listing->agent_phone,
                'agent_email'      => $request->input('agentEmail') ?: $listing->agent_email,
                'images'           => $finalImages,
                // Super admin extras — mapped to DB-safe values
                'status'           => $dbStatus,
                'purpose'          => $dbPurpose,
                'is_featured'      => filter_var($request->input('is_featured', false), FILTER_VALIDATE_BOOLEAN),
                'is_verified'      => filter_var($request->input('is_verified', false), FILTER_VALIDATE_BOOLEAN),
                // Pricing
                'sale_price'       => $isSale  ? $request->salePrice  : null,
                'rent_min'         => !$isSale ? $request->rentMin     : null,
                'rent_max'         => !$isSale ? $request->rentMax     : null,
                'advance_duration' => !$isSale ? $request->advanceDuration : null,
                'updated_at'       => now(),
            ]);
    
            Log::info('SuperAdmin listing updated successfully', [
                'listing_id' => $listing->id,
                'title'      => $listing->title,
                'status'     => $dbStatus,
                'purpose'    => $dbPurpose,
            ]);
    
            $agentEmail = $request->input('agentEmail') ?: $listing->agent_email;
            $emailSent  = false;
    
            if (filter_var($agentEmail, FILTER_VALIDATE_EMAIL)) {
                try {
                    Mail::to($agentEmail)->send(new ListingUpdatedMail($listing->fresh()));
                    $emailSent = true;
            
                    Log::info('Agent notification email sent', [
                        'listing_id'  => $listing->id,
                        'agent_email' => $agentEmail,
                    ]);
                } catch (\Exception $e) {
                    Log::warning('Agent notification email failed', [
                        'listing_id'  => $listing->id,
                        'agent_email' => $agentEmail,
                        'error'       => $e->getMessage(),
                    ]);
                }
            }
    
            return response()->json([
                'message' => 'Listing updated successfully.',
                'listing' => $this->formatListing($listing->fresh()),
                'emailSent' => $emailSent,
    
            ]);
    
        } catch (\Exception $e) {
            Log::error('SuperAdmin listing update failed', [
                'listing_id' => $listing->id,
                'error'      => $e->getMessage(),
                'trace'      => $e->getTraceAsString(),
            ]);
    
            return response()->json([
                'message' => 'Failed to update listing. Please try again.',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    // ─── Approve ──────────────────────────────────────────────────────────────
 
    public function approve(Rental $listing)
    {
        if ($listing->status === 'approved') {
            return back()->with('error', 'Listing is already approved.');
        }
 
        $oldStatus = $listing->status;
        $listing->update([
            'status'      => 'approved',
            'verified_at' => now(),
        ]);
 
        // Audit log
        AdminAuditLog::record('listing', "Listing approved: {$listing->title}", [
            'affected_user' => $listing->user->name ?? 'Unknown',
            'affected_id' => $listing->id,
            'notes' => "Listing '{$listing->title}' status changed from {$oldStatus} to approved",
            'properties' => ['old_status' => $oldStatus, 'new_status' => 'approved', 'listing_id' => $listing->id],
        ]);
 
        // Notify agent
        // $listing->agent?->notify(new ListingApproved($listing));
 
        Log::info('SuperAdmin approved listing', [
            'listing_id' => $listing->id,
            'admin_id'   => auth()->id(),
        ]);
 
        return back()->with('success', "Listing \"{$listing->title}\" approved successfully.");
    }

    // ─── Reject ───────────────────────────────────────────────────────────────
 
    public function reject(Request $request, Rental $listing)
    {
        $request->validate([
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);
 
        $oldStatus = $listing->status;
        $listing->update([
            'status'          => 'rejected',
            'rejection_reason' => $request->input('reason'),
            'rejected_at'     => now(),
            'rejected_by'     => auth()->id(),
        ]);
 
        // Audit log
        AdminAuditLog::record('listing', "Listing rejected: {$listing->title}", [
            'affected_user' => $listing->user->name ?? 'Unknown',
            'affected_id' => $listing->id,
            'notes' => "Listing '{$listing->title}' rejected. Reason: {$request->input('reason')}",
            'properties' => ['old_status' => $oldStatus, 'new_status' => 'rejected', 'reason' => $request->input('reason'), 'listing_id' => $listing->id],
        ]);
 
        // Notify agent
        // $listing->agent?->notify(new ListingRejected($listing, $request->reason));
 
        Log::info('SuperAdmin rejected listing', [
            'listing_id' => $listing->id,
            'admin_id'   => auth()->id(),
            'reason'     => $request->input('reason'),
        ]);
 
        return back()->with('success', "Listing \"{$listing->title}\" has been rejected.");
    }

    // ─── Suspend ──────────────────────────────────────────────────────────────
 
    public function suspend(Request $request, Rental $listing)
    {
        // $request->validate([
        //     'reason' => ['nullable', 'string', 'max:1000'],
        // ]);
 
        if ($listing->status === 'suspended') {
            return back()->with('error', 'Listing is already suspended.');
        }
 
        $oldStatus = $listing->status;
        $listing->update([
            'status'       => 'suspended',
            'verified_at' => now(),
           // 'suspended_by' => auth()->id(),
        ]);
 
        // Audit log
        AdminAuditLog::record('listing', "Listing suspended: {$listing->title}", [
            'affected_user' => $listing->user->name ?? 'Unknown',
            'affected_id' => $listing->id,
            'notes' => "Listing '{$listing->title}' status changed from {$oldStatus} to suspended",
            'properties' => ['old_status' => $oldStatus, 'new_status' => 'suspended', 'listing_id' => $listing->id],
        ]);
 
        // Notify agent
        // $listing->agent?->notify(new ListingSuspended($listing, $request->reason));
 
        Log::info('SuperAdmin suspended listing', [
            'listing_id' => $listing->id,
            'admin_id'   => auth()->id(),
        ]);
 
        return back()->with('success', "Listing \"{$listing->title}\" has been suspended.");
    }

    // ─── Delete ───────────────────────────────────────────────────────────────
 
    public function destroy(Rental $listing)
    {
        $title = $listing->title;
 
        DB::transaction(function () use ($listing) {
            // Delete images from storage
            if (!empty($listing->images)) {
                foreach ($listing->images as $imagePath) {
                    $path = ltrim(parse_url($imagePath, PHP_URL_PATH), '/');
                    if (Storage::disk('public')->exists($path)) {
                        Storage::disk('public')->delete($path);
                    }
                }
            }
 
            // Detach pivot relations
            // if (method_exists($listing, 'amenities')) {
            //     $listing->amenities()->detach();
            // }
 
            // Cascade delete child records
            $listing->inquiries()->delete();
            $listing->reports()->delete();
 
            $listing->delete();
        });
 
        Log::info('SuperAdmin deleted listing', [
            'listing_title' => $title,
            'admin_id'      => auth()->id(),
        ]);
 
        return redirect()
            ->route('super-admin.listings.index')
            ->with('success', "Listing \"{$title}\" has been permanently deleted.");
    }

    // ─── Private helpers ──────────────────────────────────────────────────────
 
    private function formatListing(Rental $listing, $regions = null): array
    {
        // ── Resolve property_type to slug so frontend <FSelect> matches ──────────
        // DB may store name ("Apartment") or slug ("apartment") — normalise to slug
        $rawPropType    = $listing->property_type ?? '';
        $propertyTypeSlug = \App\Models\PropertyType::where('name', $rawPropType)
                                ->orWhere('slug', $rawPropType)
                                ->value('slug') ?? \Illuminate\Support\Str::slug($rawPropType);
    
        // ── Resolve city string → matched region/child name for the select ────────
        // The select options are region.name and child.name strings.
        // We store city in the DB — find the matching location name if regions passed.
        $cityValue = $listing->city ?? $listing->location ?? '';
        if ($regions && $cityValue) {
            $matched = null;
            foreach ($regions as $region) {
                if (strcasecmp($region->name, $cityValue) === 0) {
                    $matched = $region->name;
                    break;
                }
                foreach ($region->children ?? [] as $child) {
                    if (strcasecmp($child->name, $cityValue) === 0) {
                        $matched = $child->name;
                        break 2;
                    }
                }
            }
            $cityValue = $matched ?? $cityValue; // fall back to raw value if no match
        }
    
        return [
            'id'               => $listing->id,
            'title'            => $listing->title,
            'description'      => $listing->description,
            'purpose'          => $listing->purpose,
            'listing_type'     => $listing->purpose,
            'property_type'    => $propertyTypeSlug,          // ← normalised to slug
            'sale_price'       => $listing->sale_price,
            'rent_min'         => $listing->rent_min,
            'rent_max'         => $listing->rent_max,
            'advance_duration' => $listing->advance_duration,
            'currency'         => $listing->currency ?? 'GH₵',
            'status'           => $listing->status,
            'city'             => $cityValue,                 // ← matched to select option
            'area'             => $listing->area,
            'location'         => $cityValue,                 // ← same resolved value
            'address'          => $listing->address,
            'bedrooms'         => $listing->bedrooms,
            'bathrooms'        => $listing->bathrooms,
            'is_featured'      => (bool) $listing->is_featured,
            'is_verified'      => (bool) $listing->is_verified,
            'is_sold'          => (bool) ($listing->is_sold ?? false),
            'views_count'      => $listing->views_count ?? 0, // ← now populated via loadCount
            'inquiries_count'  => $listing->inquiries_count ?? 0,
            'flagged_count'    => $listing->flagged_count ?? 0,
            'images'           => $this->resolveImages($listing),
            'amenities'        => is_array($listing->amenities) ? $listing->amenities : [],
            'agent_id'         => $listing->user_id,
            'agent_name'       => $listing->agent_name ?? $listing->user?->name,
            'agent_phone'      => $listing->agent_phone,
            'agent_email'      => $listing->agent_email,
            'created_at'       => $listing->created_at?->toISOString(),
            'updated_at'       => $listing->updated_at?->toISOString(),
        ];
    }

    private function resolveImages(Rental $listing): array
    {
        $raw = $listing->images ?? $listing->media ?? [];
    
        if (is_string($raw)) {
            $decoded = json_decode($raw, true);
            $raw     = is_array($decoded) ? $decoded : [];
        }
    
        return collect($raw)->map(function ($img) {
            $path = is_array($img) ? ($img['path'] ?? $img['url'] ?? '') : (string) $img;
            if (!$path) return null;
    
            // Already a full URL
            if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                return $path;
            }
            
            // Has a folder prefix — e.g. "rental_images/file.jpg" or "listings/file.jpg"
            if (str_contains($path, '/')) {
                return Storage::disk('public')->url($path);
            }
            
            // Bare filename — agent store saves without folder prefix
            return Storage::disk('public')->url("rental_images/{$path}");
        })->filter()->values()->toArray();
    }

    // ─── Helper ───────────────────────────────────────────────────────────────────
 
    private function parseImages(mixed $raw): array
    {
        if (!$raw) return [];
        if (is_string($raw)) {
            $decoded = json_decode($raw, true);
            $raw     = is_array($decoded) ? $decoded : [];
        }
        if (!is_array($raw)) return [];
    
        return collect($raw)->map(function ($img) {
            $path = is_array($img) ? ($img['path'] ?? $img['url'] ?? '') : (string) $img;
            return basename($path); // always return just the filename
        })->filter()->values()->toArray();
    }
}
