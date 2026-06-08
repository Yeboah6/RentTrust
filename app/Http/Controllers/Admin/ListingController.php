<?php

namespace App\Http\Controllers\Admin;

use App\Models\Rental;
use App\Models\AdminAuditLog;
use Illuminate\Support\Facades\Log;
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
}
