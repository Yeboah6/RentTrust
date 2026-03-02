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

    /**
     * Check if user can view basic listing analytics.
     * Available to: Pro, Elite
     */
    public function canViewAnalytics(User $user): bool
    {
        $plan = $this->activePlan($user);

        return $plan?->analytics_access ?? false;
    }

    /**
     * Check if user can view advanced analytics (7-day, 30-day trends, conversion rate, performance score).
     * Available to: Pro, Elite
     */
    public function canViewAdvancedAnalytics(User $user): bool
    {
        $plan = $this->activePlan($user);

        return $plan?->analytics_access ?? false;
    }

    /**
     * Check if user can view premium analytics (30-day trends, performance comparisons).
     * Available to: Elite only
     */
    public function canViewPremiumAnalytics(User $user): bool
    {
        $plan = $this->activePlan($user);

        // Only Elite plan (highest tier) gets premium analytics
        // Assuming plan slug 'elite' for Elite tier
        return $plan && strtolower($plan->slug) === 'elite';
    }

    /**
     * Get analytics features available for the user's plan.
     */
    public function getAnalyticsFeatures(User $user): array
    {
        $plan = $this->activePlan($user);

        if (!$plan) {
            return [
                'can_view_total_views' => false,
                'can_view_total_inquiries' => false,
                'can_view_7_day_stats' => false,
                'can_view_30_day_stats' => false,
                'can_see_conversion_rate' => false,
                'can_see_performance_score' => false,
                'can_see_inquiry_breakdown' => false,
            ];
        }

        $planSlug = strtolower($plan->slug);
        $isElite = $planSlug === 'elite';
        $isPro = $planSlug === 'pro' || $isElite;
        $hasTierAccess = $plan->analytics_access;

        return [
            // Free plan: Limited visibility (partial)
            'can_view_total_views' => $hasTierAccess,
            'can_view_total_inquiries' => $hasTierAccess,
            // Pro plan and above
            'can_view_7_day_stats' => $isPro,
            'can_see_conversion_rate' => $isPro,
            'can_see_performance_score' => $isPro,
            'can_see_inquiry_breakdown' => $isPro,
            // Elite plan only
            'can_view_30_day_stats' => $isElite,
        ];
    }
}
