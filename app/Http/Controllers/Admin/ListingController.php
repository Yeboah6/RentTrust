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
    public function toggleApprovalStatus(Rental $rent)
    {
        try {
            $oldStatus = $rent->status;
            $newStatus = $rent->status === 'pending' ? 'approved' : 'pending';
            $rent->update(['status' => $newStatus]);

            // Audit log
            AdminAuditLog::record('listing', "Listing {$newStatus}: {$rent->title}", [
                'affected_user' => $rent->user->name ?? 'Unknown',
                'affected_id' => $rent->id,
                'notes' => "Listing '{$rent->title}' status changed from {$oldStatus} to {$newStatus}",
                'properties' => ['old_status' => $oldStatus, 'new_status' => $newStatus, 'listing_id' => $rent->id],
            ]);

            $message = $newStatus === 'approved'
                ? "Listing '{$rent->title}' has been approved."
                : "Listing '{$rent->title}' has been reverted to pending.";

            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            Log::error('Failed to toggle listing approval status', [
                'rental_id' => $rent->id,
                'error' => $e->getMessage()
            ]);

            return redirect()->back()->with('error', 'Failed to update listing status. Please try again.');
        }
    }

    public function approveListingVerification(Request $request, ListingVerification $listingVerification)
    {
        $validated = $request->validate([
            'admin_notes' => 'nullable|string',
        ]);

        $listingVerification->update([
            'status' => 'approved',
            'admin_notes' => $validated['admin_notes'] ?: $listingVerification->admin_notes,
            'reviewed_at' => now(),
            'reviewed_by' => Auth::user()->name,
        ]);

        $listingVerification->listing?->update([
            'is_verified' => true,
            'verification_status' => 'verified',
            'verified_at' => now(),
        ]);

        return back()->with('success', 'Listing verification approved.');
    }

    public function rejectListingVerification(Request $request, ListingVerification $listingVerification)
    {
        $validated = $request->validate([
            'rejection_reason' => 'nullable|string',
        ]);

        $listingVerification->update([
            'status' => 'rejected',
            'admin_notes' => $validated['rejection_reason'] ?: $listingVerification->rejection_reason,
            'reviewed_at' => now(),
            'reviewed_by' => Auth::user()->name,
        ]);

        $listingVerification->listing?->update([
            'verification_status' => 'rejected',
            'verification_rejected_at' => now(),
            'verification_rejection_reason' => $validated['rejection_reason'],
        ]);

        return back()->with('success', 'Listing verification rejected.');
    }
}
