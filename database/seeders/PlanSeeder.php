<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'plan_id' => Str::uuid(),
                'name' => 'Free',
                'description' => 'Perfect for getting started with basic listing features',
                'slug' => 'free',
                'price' => 0,
                'currency' => 'GHS',
                'interval' => 'monthly',
                'features' => [
                    'Submit listings to the platform',
                    'Limited visibility in search results',
                    'Basic listing management',
                    'Standard support',
                ],
                'listing_limit' => 5,
                'rental_limit' => 3,
                'sale_limit' => 2,
                'priority_ranking' => false,
                'analytics_access' => false,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'plan_id' => Str::uuid(),
                'name' => 'Pro',
                'description' => 'Advanced features for serious property professionals',
                'slug' => 'pro',
                'price' => 149,
                'currency' => 'GHS',
                'interval' => 'monthly',
                'features' => [
                    'Unlimited listings',
                    'Priority search ranking',
                    'Advanced analytics',
                    'Premium support',
                ],
                'listing_limit' => 30,
                'rental_limit' => 15,
                'sale_limit' => 15,
                'priority_ranking' => true,
                'analytics_access' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'plan_id' => Str::uuid(),
                'name' => 'Elite',
                'description' => 'Maximum exposure and premium features for top performers',
                'slug' => 'elite',
                'price' => 199,
                'currency' => 'GHS',
                'interval' => 'monthly',
                'features' => [
                    'Everything in Pro',
                    'Priority customer support',
                ],
                'listing_limit' => 60,
                'rental_limit' => 30,
                'sale_limit' => 30,
                'priority_ranking' => true,
                'analytics_access' => true,
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
