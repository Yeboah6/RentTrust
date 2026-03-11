<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rental;

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
}
