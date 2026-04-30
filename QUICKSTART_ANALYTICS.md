# ⚡ Quick Start - Super Admin Analytics Dashboard

## 🚀 Installation & Deployment

### Step 1: Run Migrations
```bash
php artisan migrate
```
This creates all performance indexes needed for analytics queries.

### Step 2: Clear Cache (if upgrading)
```bash
php artisan cache:clear
```

### Step 3: Test the Endpoint
```bash
# Get last 30 days analytics
curl -X GET "http://localhost:8000/super-admin/reports" \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN" \
  -H "Accept: application/json"
```

---

## 📊 Common Usage Patterns

### Dashboard Overview
```bash
# Last 30 days (default)
GET /super-admin/reports
```

### This Month
```bash
GET /super-admin/reports?start_date=2026-04-01&end_date=2026-04-30
```

### Last Week
```bash
GET /super-admin/reports?start_date=2026-04-23&end_date=2026-04-30
```

### Custom Date Range
```bash
GET /super-admin/reports?start_date=2026-01-01&end_date=2026-04-30
```

---

## 🎯 What Data You Get

### Overview (Platform-wide stats)
- Total listings, active rentals, active sales
- Total agents, new listings (7d), total inquiries
- Total views across platform

### Listing Performance
- Top 10 most viewed listings
- Top 10 listings by inquiries
- Listings with zero engagement
- Average days on market for sales

### Agent Performance
- Top agents by listing count
- Top agents by total views
- Top agents by inquiries received
- Agents hitting plan limits

### Plan Distribution
- Count of agents on free plan
- Count of agents on pro plan
- Count of agents on elite plan

### Rent vs Sale Analysis
- Rental vs sale listing split
- Views comparison (rent vs sale)
- Inquiries comparison (rent vs sale)

### Location Insights
- Top cities by listing count
- Top cities by demand (views)
- Top cities by inquiries

---

## 🔧 Integration Examples

### In a Blade Template
```blade
@php
    $analytics = app(\App\Services\ReportService::class)
        ->getDashboardData(request());
@endphp

<div class="analytics-dashboard">
    <!-- Overview Cards -->
    <div class="cards">
        <card title="Total Listings" value="{{ $analytics['overview']['total_listings'] }}" />
        <card title="Active Rentals" value="{{ $analytics['overview']['active_rentals'] }}" />
        <card title="Active Sales" value="{{ $analytics['overview']['active_sales'] }}" />
        <card title="Total Agents" value="{{ $analytics['overview']['total_agents'] }}" />
    </div>

    <!-- Rent vs Sale -->
    <div class="rent-vs-sale">
        <p>Rentals: {{ $analytics['rent_vs_sale']['rent_count'] }}</p>
        <p>Sales: {{ $analytics['rent_vs_sale']['sale_count'] }}</p>
    </div>

    <!-- Top Agents -->
    <table>
        @foreach($analytics['agent_performance']['top_agents_by_listings'] as $agent)
            <tr>
                <td>{{ $agent->name }}</td>
                <td>{{ $agent->rentals_count }}</td>
            </tr>
        @endforeach
    </table>
</div>
```

### In API Response
```php
// AdminController or similar
public function dashboard()
{
    return response()->json([
        'analytics' => app(ReportService::class)->getDashboardData(request()),
        'user' => auth()->user(),
    ]);
}
```

### In a Service
```php
class DashboardService
{
    public function build()
    {
        $analytics = app(ReportService::class)->getDashboardData(request());
        
        return [
            'kpis' => $analytics['overview'],
            'trends' => $analytics['rent_vs_sale'],
            'top_performers' => $analytics['agent_performance'],
        ];
    }
}
```

---

## 📈 Performance Tips

### For Large Datasets
1. Use more specific date ranges (avoid querying all time)
2. Cache responses if fetching in loops:
   ```php
   $data = Cache::remember('my_analytics', 300, fn() => 
       app(ReportService::class)->getDashboardData($request)
   );
   ```

3. Add pagination to top lists in UI (they return top 10-20)

### Monitor Query Performance
```bash
# In tinker
php artisan tinker

# Enable logging
DB::enableQueryLog();

# Fetch analytics
$data = app(\App\Services\ReportService::class)->getDashboardData(request());

# See queries
DB::getQueryLog() |> dd();
```

---

## 🧪 Testing Queries

### Raw Queries
```bash
# Via SQL
SELECT COUNT(*) FROM rentals WHERE purpose = 'rent' AND status = 'approved';

# Via Artisan tinker
php artisan tinker
> Rental::where('purpose', 'rent')->where('status', 'approved')->count()
```

### API Testing with Postman
1. Create GET request: `http://localhost:8000/super-admin/reports`
2. Headers:
   - `Authorization: Bearer TOKEN`
   - `Accept: application/json`
3. Params:
   - `start_date`: 2026-04-01
   - `end_date`: 2026-04-30
4. Send!

---

## 🐛 Troubleshooting

### "401 Unauthorized"
- Ensure user has `super_admin` role
- Token is valid and not expired
- User is verified

### "500 Internal Server Error"
- Check Laravel logs: `storage/logs/laravel.log`
- Run migrations: `php artisan migrate`
- Clear cache: `php artisan cache:clear`

### Slow Queries
- Run migration to add indexes: `php artisan migrate`
- Check if cache is working: `php artisan tinker` → `Cache::get('admin_report_overview_...')`
- Reduce date range in queries

### No Data Returned
- Verify there's actual data in tables
- Check date range (might be querying before data was created)
- Verify relationships are set up correctly

---

## 📝 Next Steps

1. ✅ Run migration
2. ✅ Test endpoint with curl/Postman
3. ✅ Build admin UI dashboard
4. ✅ Add to monitoring/alerts
5. 🚀 Plan Phase 2 enhancements

---

## 📚 Documentation

- **ANALYTICS_README.md** - Full feature documentation
- **api_test_analytics.md** - API usage examples
- **ReportService.php** - Well-commented source code
- **ReportController.php** - Controller logic

---

## ✅ Deployed Successfully!

Your analytics dashboard is now **production-ready**:
- ✅ Core service (ReportService)
- ✅ API endpoint (ReportController)
- ✅ Optimized queries (performance indexes)
- ✅ Caching strategy
- ✅ Date filtering support
- ✅ Auth/role protection

**Ready to:**
- Build UI dashboard
- Integrate with admin panel
- Set up reports
- Monitor platform health

**Time to dive in! 🚀**
