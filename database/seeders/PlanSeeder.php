<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Free',
                'description' => 'Perfect for getting started with basic listing features',
                'slug' => 'free',
                'price' => 0,
                'currency' => 'GHS',
                'interval' => 'monthly',
                'listing_limit' => 5,
                'rental_limit' => 3,
                'sale_limit' => 2,
                'boost_limit' => 0,
                'lead_limit' => 10,
                'featured_limit' => 1,
                'featured_duration_days' => 3,
                'verified_badge' => false,
                'priority_ranking' => false,
                'analytics_access' => false,
                'features' => [
                    'Submit listings to the platform',
                    'Limited visibility in search results',
                    'Basic listing management',
                    'Standard support',
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Pro',
                'description' => 'Advanced features for serious property professionals',
                'slug' => 'pro',
                'price' => 50,
                'currency' => 'GHS',
                'interval' => 'monthly',
                'listing_limit' => 50,
                'rental_limit' => 25,
                'sale_limit' => 25,
                'boost_limit' => 5,
                'lead_limit' => 100,
                'featured_limit' => 5,
                'featured_duration_days' => 14,
                'verified_badge' => true,
                'priority_ranking' => true,
                'analytics_access' => true,
                'features' => [
                    'Unlimited listings',
                    'Priority search ranking',
                    'Advanced analytics',
                    'Verified badge',
                    'Premium support',
                    'Lead management',
                ],
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Elite',
                'description' => 'Maximum exposure and premium features for top performers',
                'slug' => 'elite',
                'price' => 100,
                'currency' => 'GHS',
                'interval' => 'monthly',
                'listing_limit' => 200,
                'rental_limit' => 100,
                'sale_limit' => 100,
                'boost_limit' => 20,
                'lead_limit' => 500,
                'featured_limit' => 10,
                'featured_duration_days' => 30,
                'verified_badge' => true,
                'priority_ranking' => true,
                'analytics_access' => true,
                'features' => [
                    'Everything in Pro',
                    'Maximum featured listings',
                    'Extended feature duration',
                    'Priority customer support',
                    'White-label options',
                    'API access',
                ],
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $planData) {
            Plan::updateOrCreate(
                ['slug' => $planData['slug']],
                $planData
            );
        }
    }
}
