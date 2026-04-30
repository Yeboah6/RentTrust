#!/usr/bin/env php
<?php

/**
 * RentTrust Super Admin Analytics API
 * 
 * Endpoint: GET /super-admin/reports
 * Auth: super_admin role required
 * Content-Type: application/json
 * 
 * USAGE EXAMPLES:
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 1. GET ALL ANALYTICS (Default 30 days)
// ═══════════════════════════════════════════════════════════════════════════════

/*
curl -X GET "http://localhost:8000/super-admin/reports" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
*/

// Response includes:
// {
//   "overview": {
//     "total_listings": 1254,
//     "active_rentals": 892,
//     "active_sales": 362,
//     "total_agents": 148,
//     "new_listings_7d": 47,
//     "total_inquiries": 3421,
//     "total_views": 52341
//   },
//   "listing_performance": {
//     "most_viewed": [...],
//     "most_inquiries": [...],
//     "zero_engagement": [...],
//     "avg_days_on_market": 42
//   },
//   "agent_performance": {
//     "top_agents_by_listings": [...],
//     "top_agents_by_views": [...],
//     "top_agents_by_inquiries": [...],
//     "agents_hitting_limits": [...]
//   },
//   "plan_distribution": {
//     "free": 87,
//     "pro": 52,
//     "elite": 9
//   },
//   "rent_vs_sale": {
//     "rent_count": 892,
//     "sale_count": 362,
//     "rent_views": 31204,
//     "sale_views": 21137,
//     "rent_inquiries": 2104,
//     "sale_inquiries": 1317
//   },
//   "location_insights": {
//     "top_locations_by_listings": [...],
//     "top_locations_by_demand": [...],
//     "top_locations_by_inquiries": [...]
//   },
//   "date_range": {
//     "start": "2026-03-31",
//     "end": "2026-04-30"
//   }
// }


// ═══════════════════════════════════════════════════════════════════════════════
// 2. GET ANALYTICS FOR SPECIFIC DATE RANGE
// ═══════════════════════════════════════════════════════════════════════════════

/*
curl -X GET "http://localhost:8000/super-admin/reports?start_date=2026-01-01&end_date=2026-04-30" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
*/

// ═══════════════════════════════════════════════════════════════════════════════
// 3. GET ANALYTICS FOR CURRENT MONTH
// ═══════════════════════════════════════════════════════════════════════════════

/*
curl -X GET "http://localhost:8000/super-admin/reports?start_date=2026-04-01&end_date=2026-04-30" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
*/

// ═══════════════════════════════════════════════════════════════════════════════
// 4. GET ANALYTICS FOR LAST 7 DAYS
// ═══════════════════════════════════════════════════════════════════════════════

/*
curl -X GET "http://localhost:8000/super-admin/reports?start_date=2026-04-23&end_date=2026-04-30" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
*/

// ═══════════════════════════════════════════════════════════════════════════════
// 5. PHP/Laravel Integration Example
// ═══════════════════════════════════════════════════════════════════════════════

/*
use App\Services\ReportService;
use Carbon\Carbon;

// Get data directly from service
$reportService = app(ReportService::class);

// Last 30 days (default)
$data = $reportService->getDashboardData(new Request());

// Custom date range
$request = Request::create('/', 'GET', [
    'start_date' => '2026-04-01',
    'end_date' => '2026-04-30',
]);
$data = $reportService->getDashboardData($request);

// Access specific metrics
$overviewStats = $data['overview'];
$listingPerformance = $data['listing_performance'];
$agentPerformance = $data['agent_performance'];
$planDistribution = $data['plan_distribution'];
$rentVsSale = $data['rent_vs_sale'];
$locationInsights = $data['location_insights'];
*/

// ═══════════════════════════════════════════════════════════════════════════════
// 6. RESPONSE STRUCTURE DETAILS
// ═══════════════════════════════════════════════════════════════════════════════

/*

OVERVIEW METRICS (global stats):
├── total_listings: Total number of listings on platform
├── active_rentals: Active rental listings
├── active_sales: Active sale listings
├── total_agents: Total registered agents
├── new_listings_7d: Listings created in last 7 days
├── total_inquiries: Total inquiries across all listings
└── total_views: Total views across all listings

LISTING PERFORMANCE:
├── most_viewed: Top 10 most viewed listings
├── most_inquiries: Top 10 listings with most inquiries
├── zero_engagement: Listings with 0 views and 0 inquiries
└── avg_days_on_market: Average days until sale for sale listings

AGENT PERFORMANCE:
├── top_agents_by_listings: Top 10 agents by number of listings
├── top_agents_by_views: Top 10 agents by total listing views
├── top_agents_by_inquiries: Top 10 agents by total inquiries received
└── agents_hitting_limits: Agents near/at plan listing limits

PLAN DISTRIBUTION:
├── free: Count of agents on free plan
├── pro: Count of agents on pro plan
└── elite: Count of agents on elite plan

RENT VS SALE:
├── rent_count: Number of rental listings
├── sale_count: Number of sale listings
├── rent_views: Total views on rental listings
├── sale_views: Total views on sale listings
├── rent_inquiries: Total inquiries on rental listings
└── sale_inquiries: Total inquiries on sale listings

LOCATION INSIGHTS:
├── top_locations_by_listings: Top 10 cities by listing count
├── top_locations_by_demand: Top 10 cities by total views
└── top_locations_by_inquiries: Top 10 cities by total inquiries

*/

// ═══════════════════════════════════════════════════════════════════════════════
// 7. CACHING BEHAVIOR
// ═══════════════════════════════════════════════════════════════════════════════

/*

Overview metrics are cached for 60 seconds:
- Cache key format: admin_report_overview_{START_DATE}_{END_DATE}
- Helps reduce database load on frequently accessed endpoint

Plan distribution is cached for 1 hour:
- Cache key: admin_report_plan_distribution
- Updates hourly

Other metrics are computed fresh on each request:
- Listing performance
- Agent performance
- Rent vs sale stats
- Location insights

To clear cache manually:
  php artisan cache:clear
*/

// ═══════════════════════════════════════════════════════════════════════════════
// 8. PERFORMANCE OPTIMIZATION NOTES
// ═══════════════════════════════════════════════════════════════════════════════

/*

For optimal performance, ensure these database indexes exist:

ALTER TABLE rentals ADD INDEX idx_purpose_status (purpose, status);
ALTER TABLE rentals ADD INDEX idx_created_at (created_at);
ALTER TABLE rentals ADD INDEX idx_city (city);
ALTER TABLE rentals ADD INDEX idx_views (views);
ALTER TABLE rentals ADD INDEX idx_is_sold (is_sold);
ALTER TABLE listing_inquiries ADD INDEX idx_rental_id (rental_id);
ALTER TABLE listing_inquiries ADD INDEX idx_created_at (created_at);
ALTER TABLE users ADD INDEX idx_role (role);
ALTER TABLE subscriptions ADD INDEX idx_user_id_status (user_id, status);

Create these using Laravel migration:
php artisan make:migration add_analytics_indexes
*/

// ═══════════════════════════════════════════════════════════════════════════════
// 9. COMMON QUERIES FOR ADMINS
// ═══════════════════════════════════════════════════════════════════════════════

/*

Monthly Overview:
GET /super-admin/reports?start_date=2026-04-01&end_date=2026-04-30

Weekly Overview:
GET /super-admin/reports?start_date=2026-04-23&end_date=2026-04-30

Today Only:
GET /super-admin/reports?start_date=2026-04-30&end_date=2026-04-30

Year-to-Date:
GET /super-admin/reports?start_date=2026-01-01&end_date=2026-04-30

Last 90 Days:
GET /super-admin/reports?start_date=2026-01-31&end_date=2026-04-30
*/

// ═══════════════════════════════════════════════════════════════════════════════
// 10. NEXT PHASE FEATURES (NOT YET IMPLEMENTED)
// ═══════════════════════════════════════════════════════════════════════════════

/*

Future enhancements:
✘ Revenue analytics
✘ Payment gateway breakdown
✘ Agent conversion tracking (Free → Pro)
✘ Featured listing ROI
✘ Automated alerts (low performance)
✘ Graph visualizations
✘ CSV/PDF export
✘ Predictive insights
✘ Anomaly detection
*/
