<?php

namespace App\Services;

use App\Models\User;

class FeatureGateService
{
    public function can(User $user, string $feature): bool
    {
        $plan = $this->activePlan($user);

        return match ($feature) {
            'verified_badge'   => $plan?->verified_badge ?? false,
            'priority_ranking' => $plan?->priority_ranking ?? false,
            'analytics_access' => $plan?->analytics_access ?? false,
            'unlimited_listings' => is_null($plan?->listing_limit),
            default => false,
        };
    }

    public function remaining(User $user, string $resource): int|string
    {
        $plan = $this->activePlan($user);

        return match ($resource) {
            'listings' => $this->remainingListings($user, $plan),
            'boosts'   => $this->remainingBoosts($user, $plan),
            'leads'    => $this->remainingLeads($user, $plan),
            default    => 0,
        };
    }

    public function check(User $user, string $resource, int $needed = 1): array
    {
        $plan = $this->activePlan($user);

        if (! $plan) {
            return ['allowed' => false, 'reason' => 'No active subscription'];
        }

        $remaining = $this->remaining($user, $resource);

        if ($remaining !== 'unlimited' && $remaining < $needed) {
            return [
                'allowed' => false,
                'reason'  => "You have reached your {$resource} limit. Upgrade your plan to continue.",
                'upgrade' => true,
            ];
        }

        return ['allowed' => true];
    }

    private function activePlan(User $user): ?\App\Models\Plan
    {
        $subscription = $user->subscription;

        if (! $subscription || ! $subscription->isActive()) {
            return null;
        }

        return $subscription->plan;
    }

    private function remainingListings(User $user, ?\App\Models\Plan $plan): int|string
    {
        if (! $plan) {
            return 0;
        }

        if (is_null($plan->listing_limit)) {
            return 'unlimited';
        }

        $used = $user->listings()->count();
        return max(0, $plan->listing_limit - $used);
    }

    private function remainingBoosts(User $user, ?\App\Models\Plan $plan): int|string
    {
        if (! $plan || $plan->boost_limit === 0) {
            return 0;
        }

        $startOfMonth = now()->startOfMonth();
        $used = $user->listings()
            ->where('is_boosted', true)
            ->where('boosted_at', '>=', $startOfMonth)
            ->count();

        return max(0, $plan->boost_limit - $used);
    }

    private function remainingLeads(User $user, ?\App\Models\Plan $plan): int|string
    {
        if (! $plan) {
            return 0;
        }

        $startOfMonth = now()->startOfMonth();
        $used = $user->leads()->where('created_at', '>=', $startOfMonth)->count();

        return max(0, $plan->lead_limit - $used);
    }

    public function summary(User $user): array
    {
        $plan = $this->activePlan($user);

        return [
            'plan'            => $plan?->name ?? 'None',
            'listings'        => $this->remainingListings($user, $plan),
            'boosts'          => $this->remainingBoosts($user, $plan),
            'leads'           => $this->remainingLeads($user, $plan),
            'verified_badge'  => $plan?->verified_badge ?? false,
            'priority_ranking'=> $plan?->priority_ranking ?? false,
            'analytics_access'=> $plan?->analytics_access ?? false,
        ];
    }
}