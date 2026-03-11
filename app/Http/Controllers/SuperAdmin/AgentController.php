<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Rental;

class AgentController extends Controller
{
    public function index()
    {
        $agents = User::where('role', 'agent')
            ->withCount([
                'rentals as listings_count',
                'rentals as active_listings' => fn($q) => $q->where('status', 'approved')->where('is_sold', false),
                'rentals as sold_count'      => fn($q) => $q->where('is_sold', true),
                'reviews as reviews_count',
            ])
            ->withAvg('reviews as rating', 'overall_rating')
            ->with(['subscription.plan'])   // for tier/package
            ->addSelect([
                'users.*',
                // last time any of their listings was viewed as a proxy for last_active
                // swap for sessions/login table if you track that separately
            ])
            ->get()
            ->map(function (User $user) {
                return [
                    'id'              => $user->id,
                    'name'            => $user->name,
                    'email'           => $user->email,
                    'phone'           => $user->phone,
                    'status'          => $user->status ?? 'pending',
                    'agency'          => $user->company,
                    'bio'             => $user->bio,
                    'avatar'          => null,                          // add profile photo column if needed
                    'is_verified'     => in_array($user->status, ['verified', 'active']),
                    'is_featured'     => false,                         // add featured flag to users table if needed
                    'tier'            => $user->subscription?->plan?->slug
                                         ?? $user->package
                                         ?? 'standard',
                    'license'         => null,                          // add rea_number column if needed
                    'location'        => null,                          // add city/area column if needed
                    'listings_count'  => $user->listings_count  ?? 0,
                    'active_listings' => $user->active_listings ?? 0,
                    'sold_count'      => $user->sold_count      ?? 0,
                    'rating'          => $user->rating          ? round($user->rating, 1) : null,
                    'reviews_count'   => $user->reviews_count   ?? 0,
                    'total_revenue'   => null,                          // add if you track commissions
                    'joined_at'       => $user->created_at,
                    'last_active'     => $user->updated_at,            // swap for last_login_at if tracked
                ];
            });

        $listings_count = Rental::count();

        return inertia('SuperAdmin/Agents/Index', [
            'agents'         => $agents,
            'listings_count' => $listings_count,
        ]);
    }
}
