<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rental;
use App\Models\PropertyType;
use App\Models\Amenity;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
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

    // ─── Show ─────────────────────────────────────────────────────────────────
 
    public function show(Rental $listing)
    {
        $listing->load([
            'user:id,name,email,phone,avatar,company',
        ]);
        $listing->loadCount(['inquiries', 'reports as flagged_count', 'views']);
 
        return Inertia::render('SuperAdmin/Listings/ListingShow', [
            'listing' => $listing,
        ]);
    }

    // ─── Edit ─────────────────────────────────────────────────────────────────
 
    public function edit(Rental $listing)
    {
        $listing->load([
            'user:id,name,email,company',
            // 'amenities:id,name,icon',
        ]);
        $listing->loadCount(['inquiries', 'reports as flagged_count']);
 
        return Inertia::render('SuperAdmin/Listings/ListingEdit', [
            'listing'        => $this->formatListing($listing),
            'agents'         => User::select('id', 'name', 'company as agency')->orderBy('name')->get(),
            'amenity_suggestions' => ['Swimming Pool', 'Gym', 'Parking', 'Security', 'Generator', 'Water Supply', 'Balcony', 'Garden'],
            'property_types' => PropertyType::active()->pluck('name'),
        ]);
    }

    // ─── Update ───────────────────────────────────────────────────────────────
 
    public function update(Request $request, Rental $listing)
    {
        $validated = $request->validate([
            'title'         => ['required', 'string', 'max:255'],
            'description'   => ['nullable', 'string', 'max:5000'],
            'listing_type'  => ['required', Rule::in(['sale', 'rent', 'short', 'lease'])],
            'property_type' => ['nullable', 'string', 'max:100'],
            'sale_price'       => ['required_if:purpose,sale',  'nullable', 'numeric', 'min:0'],
            'rent_min'         => ['required_if:purpose,rent',  'nullable', 'numeric', 'min:0'],
            'rent_max'         => ['nullable', 'numeric', 'min:0', 'gte:rent_min'],
            'advance_duration' => ['nullable', 'integer', 'min:1'],
            'currency'      => ['required', 'string', 'max:10'],
            'location'      => ['required', 'string', 'max:255'],
            'address'       => ['nullable', 'string', 'max:500'],
            'bedrooms'      => ['nullable', 'integer', 'min:0'],
            'bathrooms'     => ['nullable', 'integer', 'min:0'],
            'toilets'       => ['nullable', 'integer', 'min:0'],
            'area_sqft'     => ['nullable', 'numeric', 'min:0'],
            'is_featured'   => ['boolean'],
            'is_verified'   => ['boolean'],
            'status'        => ['required', Rule::in(['active', 'pending', 'sold', 'rented', 'rejected', 'draft', 'expired', 'flagged', 'suspended'])],
            'agent_id'      => ['nullable', 'exists:agents,id'],
            'amenity_ids'   => ['nullable', 'array'],
            'amenity_ids.*' => ['exists:amenities,id'],
        ]);
 
        DB::transaction(function () use ($listing, $validated) {
            $amenityIds = $validated['amenity_ids'] ?? [];
            unset($validated['amenity_ids']);
 
            $listing->update($validated);
 
            if (isset($listing->amenities)) {
                $listing->amenities()->sync($amenityIds);
            }
        });
 
        return redirect()
            ->route('super-admin.listings.show', $listing)
            ->with('success', 'Listing updated successfully.');
    }

    // ─── Approve ──────────────────────────────────────────────────────────────
 
    public function approve(Rental $listing)
    {
        if ($listing->status === 'approved') {
            return back()->with('error', 'Listing is already approved.');
        }
 
        $listing->update([
            'status'      => 'approved',
            'verified_at' => now(),
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
 
        $listing->update([
            'status'          => 'rejected',
            'rejection_reason' => $request->input('reason'),
            'rejected_at'     => now(),
            'rejected_by'     => auth()->id(),
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
 
        if ($listing->status === 'approved' || $listing->status === 'pending') {
            return back()->with('error', 'Listing is already suspended.');
        }
 
        $listing->update([
            'status'       => 'suspended',
            'verified_at' => now(),
           // 'suspended_by' => auth()->id(),
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
 
    private function formatListing(Rental $listing): array
    {
        $isSale = $listing->purpose === 'sale' || $listing->isSale();

        return [
            'id'            => $listing->id,
            'title'         => $listing->title,
            'description'   => $listing->description,
            'listing_type'  => $listing->listing_type,
            'property_type' => $listing->property_type,
            'price'            => $isSale
                                ? $listing->sale_price
                                : $listing->rent_min,
            'sale_price'       => $listing->sale_price,
            'rent_min'         => $listing->rent_min,
            'rent_max'         => $listing->rent_max, 
            'advance_duration' => $listing->advance_duration,                   
            'currency'      => $listing->currency ?? 'GH₵',
            'status'        => $listing->status,
            'location'      => $listing->location ?? $listing->city ?? $listing->area,
            'address'       => $listing->address,
            'bedrooms'      => $listing->bedrooms,
            'bathrooms'     => $listing->bathrooms,
            'toilets'       => $listing->toilets,
            'area_sqft'     => $listing->area_sqft ?? $listing->floor_area,
            'is_featured'   => (bool) $listing->is_featured,
            'is_verified'   => (bool) $listing->is_verified,
            'views'         => $listing->views ?? $listing->views_count ?? 0,
            'inquiries'     => $listing->inquiries_count ?? 0,
            'flagged_count' => $listing->flagged_count ?? 0,
            'images'        => $this->resolveImages($listing),
            'amenities' => collect($listing->amenities ?? [])->map(fn ($a) =>
                                is_array($a) ? $a : ['name' => $a, 'icon' => null]
                            )->toArray(),
            'agent'         => $listing->relationLoaded('agent') && $listing->agent ? [
                'id'     => $listing->agent->id,
                'name'   => $listing->agent->name,
                'email'  => $listing->agent->email,
                'phone'  => $listing->agent->phone,
                'avatar' => $listing->agent->avatar
                    ? asset('storage/' . $listing->agent->avatar)
                    : null,
            ] : null,
            'agent_id'      => $listing->agent_id,
            'created_at'    => $listing->created_at?->toISOString(),
            'updated_at'    => $listing->updated_at?->toISOString(),
        ];
    }
 
    private function resolveImages(Rental $listing): array
    {
        $raw = $listing->images ?? $listing->media ?? [];
 
        if (is_string($raw)) {
            $decoded = json_decode($raw, true);
            $raw = is_array($decoded) ? $decoded : [];
        }
 
        return collect($raw)->map(function ($img) {
            if (is_string($img) && str_starts_with($img, 'http')) {
                return $img;
            }
            $path = is_array($img) ? ($img['path'] ?? $img['url'] ?? '') : $img;
            return $path ? asset('storage/' . ltrim($path, '/')) : null;
        })->filter()->values()->toArray();
    }
}
