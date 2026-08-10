<?php

namespace App\Http\Controllers\Admin;

use App\Models\Rental;
use App\Models\AdminAuditLog;
use App\Models\ListingVerification;
use Illuminate\Support\Facades\{Log, Auth};
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    public function approveListingVerification(Request $request, ListingVerification $listingVerification)
    {
        $validated = $request->validate([
            'admin_notes' => 'nullable|string',
        ]);

        $listing = $listingVerification->listing;
        $oldStatus = $listingVerification->status;
        $newStatus = 'approved';

        $listingVerification->update([
            'status' => $newStatus,
            'admin_notes' => $validated['admin_notes'] ?: $listingVerification->admin_notes,
            'reviewed_at' => now(),
            'reviewed_by' => Auth::user()->name,
        ]);

        $listing?->update([
            'is_verified' => true,
            'verification_status' => 'verified',
            'verified_at' => now(),
        ]);

        AdminAuditLog::record('listing', "Listing {$newStatus}: " . ($listing->title ?? 'Untitled listing'), [
            'affected_user' => $listing?->user?->name ?? 'Unknown',
            'affected_id' => $listing?->id,
            'notes' => "Listing verification status changed from {$oldStatus} to {$newStatus}",
            'properties' => ['old_status' => $oldStatus, 'new_status' => $newStatus, 'listing_id' => $listing?->id],
        ]);

        return back()->with('success', 'Listing verification approved.');
    }

    public function rejectListingVerification(Request $request, ListingVerification $listingVerification)
    {
        $validated = $request->validate([
            'rejection_reason' => 'nullable|string',
        ]);

        $listing = $listingVerification->listing;
        $oldStatus = $listingVerification->status;
        $newStatus = 'rejected';

        $listingVerification->update([
            'status' => $newStatus,
            'admin_notes' => $validated['rejection_reason'] ?: $listingVerification->admin_notes,
            'reviewed_at' => now(),
            'reviewed_by' => Auth::user()->name,
        ]);

        $listing?->update([
            'verification_status' => 'rejected',
            'verification_rejected_at' => now(),
            'verification_rejection_reason' => $validated['rejection_reason'],
        ]);

        AdminAuditLog::record('listing', "Listing {$newStatus}: " . ($listing->title ?? 'Untitled listing'), [
            'affected_user' => $listing?->user?->name ?? 'Unknown',
            'affected_id' => $listing?->id,
            'notes' => "Listing verification status changed from {$oldStatus} to {$newStatus}",
            'properties' => ['old_status' => $oldStatus, 'new_status' => $newStatus, 'listing_id' => $listing?->id],
        ]);

        return back()->with('success', 'Listing verification rejected.');
    }
}