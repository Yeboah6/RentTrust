<?php

namespace App\Services;

use App\Models\User;
use App\Models\Rental;
use App\Models\Subscription;
use Illuminate\Database\Eloquent\Collection;

class ListingLimitService
{
    private const RENTAL_SLOT_STATUSES = ['available', 'inactive', 'rented'];
    private const SALE_SLOT_STATUSES   = ['available', 'inactive', 'sold'];

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

    private function scopeOwnedBy($query, User $user)
    {
        return $query->where(function ($q) use ($user) {
            $q->where('user_id', $user->id)
              ->orWhere('agent_id', $user->id);
        });
    }

    /**
     * Count rental listings that currently occupy a plan slot for this user
     */
    public function countActiveRentals(User $user): int
    {
        return $this->scopeOwnedBy(Rental::query(), $user)
            ->where('purpose', 'rent')
            ->whereIn('status', self::RENTAL_SLOT_STATUSES)
            ->count();
    }

    /**
     * Count sale listings that currently occupy a plan slot for this user
     */
    public function countActiveSales(User $user): int
    {
        return $this->scopeOwnedBy(Rental::query(), $user)
            ->where('purpose', 'sale')
            ->whereIn('status', self::SALE_SLOT_STATUSES)
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

    public function getLimitStatus(User $user): array
    {
        $plan = $this->getUserPlan($user);

        $rentalLimit = $this->getRentalLimit($user);
        $saleLimit   = $this->getSaleLimit($user);

        $activeRentals = $this->countActiveRentals($user);
        $activeSales   = $this->countActiveSales($user);

        return [
            'plan' => $plan ?? 'free',

            'rentals' => [
                'active'     => $activeRentals,
                'limit'      => $rentalLimit,  // null = unlimited
                'remaining'  => $rentalLimit !== null ? max(0, $rentalLimit - $activeRentals) : null,
                'can_create' => $rentalLimit === null || $activeRentals < $rentalLimit,
            ],

            'sales' => [
                'active'     => $activeSales,
                'limit'      => $saleLimit,
                'remaining'  => $saleLimit !== null ? max(0, $saleLimit - $activeSales) : null,
                'can_create' => $saleLimit === null || $activeSales < $saleLimit,
            ],
        ];
    }
}