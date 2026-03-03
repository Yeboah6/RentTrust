<?php

namespace App\Services;

use App\Models\User;
use App\Models\Rental;
use App\Models\Subscription;
use Illuminate\Database\Eloquent\Collection;

class ListingLimitService
{
    /**
     * Get the active subscription for a user
     */
    public function getActiveSubscription(User $user): ?Subscription
    {
        return $user->subscriptions()
            ->where('status', 'active')
            ->where('ends_at', '>', now())
            ->latest('created_at')
            ->first();
    }

    /**
     * Get the plan for a user (active subscription or free)
     */
    public function getUserPlan(User $user)
    {
        $subscription = $this->getActiveSubscription($user);
        
        if ($subscription) {
            return $subscription->plan;
        }

        // Default to free plan
        return \App\Models\Plan::where('slug', 'free')->first();
    }

    /**
     * Count active rental listings for a user
     */
    public function countActiveRentals(User $user): int
    {
        return Rental::where('user_id', $user->id)
            ->where('purpose', 'rent')
            ->where('status', 'approved')
            ->where('is_sold', false)
            ->count();
    }

    /**
     * Count active sale listings for a user
     */
    public function countActiveSales(User $user): int
    {
        return Rental::where('user_id', $user->id)
            ->where('purpose', 'sale')
            ->where('status', 'approved')
            ->where('is_sold', false)
            ->count();
    }

    /**
     * Check if user can create a rental listing
     */
    public function canCreateRental(User $user): bool
    {
        $plan = $this->getUserPlan($user);
        
        // If no limit (unlimited)
        if (is_null($plan->rental_limit)) {
            return true;
        }

        return $this->countActiveRentals($user) < $plan->rental_limit;
    }

    /**
     * Check if user can create a sale listing
     */
    public function canCreateSale(User $user): bool
    {
        $plan = $this->getUserPlan($user);
        
        // If no limit (unlimited)
        if (is_null($plan->sale_limit)) {
            return true;
        }

        return $this->countActiveSales($user) < $plan->sale_limit;
    }

    /**
     * Get rental limit for user
     */
    public function getRentalLimit(User $user): ?int
    {
        return $this->getUserPlan($user)->rental_limit;
    }

    /**
     * Get sale limit for user
     */
    public function getSaleLimit(User $user): ?int
    {
        return $this->getUserPlan($user)->sale_limit;
    }

    /**
     * Get remaining rental listings count for user
     */
    public function getRemainingRentals(User $user): ?int
    {
        $limit = $this->getRentalLimit($user);
        
        if (is_null($limit)) {
            return null; // unlimited
        }

        $active = $this->countActiveRentals($user);
        return max(0, $limit - $active);
    }

    /**
     * Get remaining sale listings count for user
     */
    public function getRemainingSales(User $user): ?int
    {
        $limit = $this->getSaleLimit($user);
        
        if (is_null($limit)) {
            return null; // unlimited
        }

        $active = $this->countActiveSales($user);
        return max(0, $limit - $active);
    }

    /**
     * Get limit status for user (for UI display)
     */
    public function getLimitStatus(User $user): array
    {
        $plan = $this->getUserPlan($user);

        return [
            'plan' => $plan->name,
            'plan_slug' => $plan->slug,
            'rentals' => [
                'limit' => $plan->rental_limit,
                'active' => $this->countActiveRentals($user),
                'remaining' => $this->getRemainingRentals($user),
                'can_create' => $this->canCreateRental($user),
            ],
            'sales' => [
                'limit' => $plan->sale_limit,
                'active' => $this->countActiveSales($user),
                'remaining' => $this->getRemainingSales($user),
                'can_create' => $this->canCreateSale($user),
            ],
        ];
    }
}
