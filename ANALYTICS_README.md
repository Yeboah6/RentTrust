# 🚀 RentTrust Super Admin Analytics Dashboard - Phase 1

## Overview

The Super Admin Analytics Dashboard provides **centralized visibility** into platform performance, agent activity, listings health, and marketplace trends.

**Core principles:**
- ✅ Read-only analytics (no mutations)
- ✅ Fast query performance (indexes + caching)
- ✅ Filterable data (date range support)
- ✅ Rental-first insights preserved
- ✅ Shared analytics engine (reusable logic)
- ✅ Scalable for future monetization

---

## 🏗 Architecture

### Route Structure
```
GET /super-admin/reports
```
- **Auth:** super_admin role
- **Response:** JSON
- **Filters:** `start_date`, `end_date` (YYYY-MM-DD)
- **Default range:** Last 30 days

### File Organization
```
app/
  Services/
    ReportService.php          ← Core analytics logic
  Http/Controllers/SuperAdmin/
    ReportController.php       ← API endpoint
routes/
  super_admin.php              ← Route definition
database/migrations/
  2026_04_30_000001_...        ← Performance indexes
```

---

## 📊 Metrics & Data Structure

### 1. Overview Stats (`overview`)
Platform-wide metrics:
```json
{
  "total_listings": 1254,
  "active_rentals": 892,
  "active_sales": 362,
  "total_agents": 148,
  "new_listings_7d": 47,
  "total_inquiries": 3421,
  "total_views": 52341
}
```
**Cached:** 60 seconds per date range

---

### 2. Listing Performance (`listing_performance`)
Engagement and market health:
```json
{
  "most_viewed": [
    {"id": "...", "title": "...", "views": 234, ...}
  ],
  "most_inquiries": [
    {"id": "...", "title": "...", "inquiries_count": 12, ...}
  ],
  "zero_engagement": [
    {"id": "...", "title": "...", "created_at": "..."}
  ],
  "avg_days_on_market": 42
}
```
**Filters:** Date range (sales only)

---

### 3. Agent Performance (`agent_performance`)
Agent productivity rankings:
```json
{
  "top_agents_by_listings": [
    {"id": "...", "name": "John Doe", "rentals_count": 15, ...}
  ],
  "top_agents_by_views": [
    {"id": "...", "name": "Jane Smith", "total_views": 5420, ...}
  ],
  "top_agents_by_inquiries": [
    {"id": "...", "name": "Bob Agent", "total_inquiries": 87, ...}
  ],
  "agents_hitting_limits": [
    {...}
  ]
}
```
**Uses:** ListingLimitService for limit detection

---

### 4. Plan Distribution (`plan_distribution`)
Agent subscription breakdown:
```json
{
  "free": 87,
  "pro": 52,
  "elite": 9
}
```
**Cached:** 1 hour

---

### 5. Rent vs Sale Analytics (`rent_vs_sale`)
Rental vs sale market comparison:
```json
{
  "rent_count": 892,
  "sale_count": 362,
  "rent_views": 31204,
  "sale_views": 21137,
  "rent_inquiries": 2104,
  "sale_inquiries": 1317
}
```
**Filters:** Date range

---

### 6. Location Insights (`location_insights`)
City-based market analysis:
```json
{
  "top_locations_by_listings": [
    {"city": "Lagos", "total": 145}
  ],
  "top_locations_by_demand": [
    {"city": "Lagos", "total_views": 3421}
  ],
  "top_locations_by_inquiries": [
    {"city": "Lagos", "total_inquiries": 234}
  ]
}
```
**Filters:** Date range

---

## 🔄 Data Flow

```
GET /super-admin/reports
    ↓
ReportController::index()
    ↓
ReportService::getDashboardData()
    ├→ getOverviewStats()          [CACHED 60s]
    ├→ getListingPerformance()     [FRESH]
    ├→ getAgentPerformance()       [FRESH]
    ├→ getPlanDistribution()       [CACHED 1h]
    ├→ getRentVsSaleStats()        [FRESH]
    └→ getLocationInsights()       [FRESH]
    ↓
Return JSON Response
```

---

## 🚀 Usage Examples

### Get Last 30 Days (Default)
```bash
curl "http://localhost:8000/super-admin/reports" \
  -H "Authorization: Bearer TOKEN"
```

### Get Specific Date Range
```bash
curl "http://localhost:8000/super-admin/reports?start_date=2026-04-01&end_date=2026-04-30" \
  -H "Authorization: Bearer TOKEN"
```

### Get Last 7 Days
```bash
curl "http://localhost:8000/super-admin/reports?start_date=2026-04-23&end_date=2026-04-30" \
  -H "Authorization: Bearer TOKEN"
```

### In Laravel Code
```php
use App\Services\ReportService;

$reportService = app(ReportService::class);

// Last 30 days
$data = $reportService->getDashboardData(new Request());

// Custom range
$request = Request::create('/', 'GET', [
    'start_date' => '2026-04-01',
    'end_date' => '2026-04-30',
]);
$data = $reportService->getDashboardData($request);

// Access specific metrics
$overview = $data['overview'];
$topAgents = $data['agent_performance']['top_agents_by_listings'];
```

---

## ⚡ Performance Optimization

### Indexes Created
Migration `2026_04_30_000001_add_analytics_performance_indexes.php` adds:

**Rentals table:**
- `idx_rentals_purpose_status` - Speed up purpose/status filtering
- `idx_rentals_created_at` - Speed up date range queries
- `idx_rentals_city` - Speed up location aggregation
- `idx_rentals_views` - Speed up top views queries
- `idx_rentals_is_sold` - Speed up sold status filtering
- `idx_rentals_user_purpose` - Speed up agent rental queries

**ListingInquiry table:**
- `idx_inquiries_rental_id` - Speed up inquiry joins
- `idx_inquiries_created_at` - Speed up inquiry date filtering

**Users table:**
- `idx_users_role` - Speed up agent filtering

**Subscriptions table:**
- `idx_subscriptions_user_status` - Speed up active subscription queries
- `idx_subscriptions_ends_at` - Speed up expiration queries

### Caching Strategy
```php
// Overview (frequently accessed, expensive)
Cache::remember('admin_report_overview_2026-04-01_2026-04-30', 60, ...)

// Plan distribution (rarely changes)
Cache::remember('admin_report_plan_distribution', 3600, ...)

// Others (fresh queries - fast due to indexes)
```

### Run Migration
```bash
php artisan migrate
```

---

## 🔒 Security

- ✅ Auth middleware: `auth`, `verified`
- ✅ Role middleware: `role:super_admin`
- ✅ Read-only operations (no mutations)
- ✅ All queries scoped appropriately

---

## 📈 Response Format

All responses return JSON with this structure:
```json
{
  "overview": {...},
  "listing_performance": {...},
  "agent_performance": {...},
  "plan_distribution": {...},
  "rent_vs_sale": {...},
  "location_insights": {...},
  "date_range": {
    "start": "2026-04-01",
    "end": "2026-04-30"
  }
}
```

---

## 🚫 Out of Scope (Phase 1)

❌ Revenue tracking  
❌ Payment analytics  
❌ Predictive AI insights  
❌ Graph-heavy dashboards  
❌ Export to CSV/PDF  
❌ Real-time streaming  

---

## 🚀 Future Extensions (Phase 2+)

### Phase 2: Enhanced Analytics
- Revenue analytics by plan/location
- Payment gateway performance breakdown
- Agent conversion tracking (Free → Pro → Elite)
- Featured listing ROI analysis
- Automated low-performance alerts

### Phase 3: Advanced Features
- Graph visualizations (charts.js, apex charts)
- CSV/PDF report export
- Scheduled report generation
- Email report delivery
- Anomaly detection

### Phase 4: Monetization
- Custom analytics for premium agents
- Market intelligence reports
- Benchmarking tools
- Predictive insights

---

## 🛠 Development Notes

### Adding New Metrics
1. Add method to `ReportService`
2. Call from `getDashboardData()`
3. Add to response array
4. Document in README

### Modifying Existing Metrics
1. Update method in `ReportService`
2. Test with various date ranges
3. Clear cache if needed: `php artisan cache:clear`
4. Update documentation

### Debugging Queries
```php
// Enable query logging
\DB::enableQueryLog();

$data = app(ReportService::class)->getDashboardData($request);

// See executed queries
dd(\DB::getQueryLog());
```

---

## 📝 Files Modified/Created

### Created:
- ✅ `app/Services/ReportService.php`
- ✅ `app/Http/Controllers/SuperAdmin/ReportController.php`
- ✅ `database/migrations/2026_04_30_000001_add_analytics_performance_indexes.php`

### Modified:
- ✅ `routes/super_admin.php` - Added report route

### Documentation:
- ✅ `api_test_analytics.md` - API usage guide
- ✅ `ANALYTICS_README.md` - This file

---

## ✅ Checklist for Production

- [ ] Run migration: `php artisan migrate`
- [ ] Test endpoint with various date ranges
- [ ] Verify cache is working
- [ ] Monitor query performance
- [ ] Test with large datasets
- [ ] Verify auth/role middleware works
- [ ] Set up monitoring/alerts for slow queries
- [ ] Document in admin UI

---

## 📞 Support

For issues or questions:
1. Check this README
2. Review API test examples in `api_test_analytics.md`
3. Check cache status: `php artisan tinker` → `Cache::get('admin_report_overview_...')`
4. Enable query logging for debugging

---

**Status:** ✅ Phase 1 Complete  
**Last Updated:** 2026-04-30  
**Version:** 1.0.0
