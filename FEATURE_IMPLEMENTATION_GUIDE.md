# RentTrust Rental-First with Sales Extension - Implementation Guide

## Overview

This document outlines the backend implementation of the rental-first marketplace with sales extension feature for RentTrust. The feature has been implemented with clean separation of concerns, subscription-based limits, and a rental-first positioning strategy.

---

## 📋 Database Changes

### Migrations Created

#### 1. `2026_03_03_000001_add_sales_to_rentals_table.php`
Adds purpose-based fields to the `rentals` table:

```sql
ALTER TABLE rentals ADD COLUMN purpose ENUM('rent', 'sale') DEFAULT 'rent';
ALTER TABLE rentals ADD COLUMN sale_price DECIMAL(15, 2) NULL;
ALTER TABLE rentals ADD COLUMN is_sold BOOLEAN DEFAULT false;
ALTER TABLE rentals ADD COLUMN sold_at TIMESTAMP NULL;
```

**Key Fields:**
- `purpose` - Distinguishes between rental and sale listings
- `sale_price` - Price for sale listings (separate from rent_min/rent_max)
- `is_sold` - Tracks if a sale listing has been completed
- `sold_at` - Timestamp when listing was marked as sold

#### 2. `2026_03_03_000002_add_sale_limits_to_plans_table.php`
Separates listing limits for rentals and sales:

```sql
ALTER TABLE plans MODIFY listing_limit INT NULL;
ALTER TABLE plans ADD COLUMN sale_limit INT DEFAULT 0;
```

**Default Plan Limits:**

| Plan   | Rental Limit | Sale Limit |
|--------|--------------|-----------|
| Free   | 2            | 1         |
| Pro    | 20           | 5         |
| Elite  | Unlimited    | 20        |

---

## 🎯 Model Updates

### Rental Model (`app/Models/Rental.php`)

**New Fillable Fields:**
```php
'purpose', 'sale_price', 'is_sold', 'sold_at'
```

**New Methods:**
- `isRental()` - Check if listing is a rental
- `isSale()` - Check if listing is a sale
- `isActive()` - Check if listing is approved and not sold
- `getDaysOnMarket()` - Get days on market (for sales only)
- `markAsSold()` - Mark listing as sold with timestamp

### Plan Model (`app/Models/Plan.php`)

**New Fillable Fields:**
```php
'rental_limit', 'sale_limit'
```

**New Methods:**
- `getRentalLimitDisplayAttribute()` - Format rental limit for display
- `getSaleLimitDisplayAttribute()` - Format sale limit for display

---

## 🔐 Service Layer

### ListingLimitService (`app/Services/ListingLimitService.php`)

**Purpose:** Centralized business logic for subscription-based listing limits

**Key Methods:**

```php
// Check if user can create listing
canCreateRental(User $user): bool
canCreateSale(User $user): bool

// Count active listings
countActiveRentals(User $user): int
countActiveSales(User $user): int

// Get limit information
getRentalLimit(User $user): ?int
getSaleLimit(User $user): ?int
getRemainingRentals(User $user): ?int
getRemainingSales(User $user): ?int

// Get comprehensive status
getLimitStatus(User $user): array
```

**Usage in Controllers:**
```php
$limitService = new ListingLimitService();
if (!$limitService->canCreateSale($user)) {
    // Reject with appropriate message
}
```

---

## 🎛️ Controller Layer

### RentController (`app/Http/Controllers/RentController.php`)

**Updated Methods:**

#### `store(Request $request)`
Enhanced to support both rental and sales listings:
- Accepts `purpose` parameter ('rent' or 'sale')
- Validates purpose-specific fields
- Enforces subscription limits before creation
- Routes pricing data based on purpose

**Validation Rules:**
- **For Rentals:** Requires `rentMin` and `rentMax`
- **For Sales:** Requires `salePrice`
- Field conflicts (e.g., providing both rental and sale prices) are rejected

#### `index()`
Updated to display rental-first positioning on homepage:
- Shows only approved rental listings
- Includes recent rentals and rental areas
- Added meaningful page meta data

### RentalSearchController (`app/Http/Controllers/RentalSearchController.php`)

Dedicated controller for rental search and discovery:

```php
index()                // Display rental listings
getMore(Request $request)  // Pagination via AJAX
areas()               // Rental areas grouped by city
show(Request $request, Rental $rental)  // Individual rental details
```

**Query Pattern:**
```php
Rental::where('purpose', 'rent')
      ->where('status', 'approved')
```

### SaleSearchController (`app/Http/Controllers/SaleSearchController.php`)

Dedicated controller for sales search and discovery:

```php
index()                // Display sale listings
getMore(Request $request)  // Pagination via AJAX
areas()               // Sale areas grouped by city
show(Request $request, Rental $rental)  // Individual sale details
```

**Query Pattern:**
```php
Rental::where('purpose', 'sale')
      ->where('status', 'approved')
      ->where('is_sold', false)
```

**Special Handling:**
- Excludes sold listings from search
- Provides `days_on_market` in response
- Validates that listing is indeed a sale before showing

---

## 🛣️ Routes

### New Route Groups

#### Rental Search Routes (`/rent`)
```
GET  /rent                    - List all rental listings
GET  /rent/areas              - Get rental areas
GET  /rent/api/more           - Paginate rentals (AJAX)
```

#### Sales Search Routes (`/buy`)
```
GET  /buy                     - List all sale listings
GET  /buy/areas               - Get sale areas
GET  /buy/api/more            - Paginate sales (AJAX)
```

#### Individual Listing Routes
```
GET  /rent/{rental}           - Show rental details (via RentController)
GET  /buy/{rental}            - Show sale details (via RentController)
```

#### Creation Routes
```
POST /rent                    - Create listing (auth required, role:agent)
```

---

## 📊 Analytics Enhancement

### ListingAnalyticsService (`app/Services/ListingAnalyticsService.php`)

**New Methods:**

#### `getDaysOnMarket(Rental $listing): ?int`
- Returns days on market for sale listings
- Returns null for rental listings
- Accounts for sold listings (days until sold)

**Updated Summary Method:**
```php
getListingAnalyticsSummary(Rental $listing): array
```

Now includes purpose-specific metrics:
- For sales: `days_on_market`, `is_sold`, `sold_at`
- For rentals: Standard view and inquiry metrics

---

## ✅ Validation Rules

### Listing Creation Validation

**Common Fields (Both Rental & Sale):**
- `title` - Required, max 255 chars
- `propertyType` - Required, max 50 chars
- `city` - Required, max 100 chars
- `area` - Required, max 255 chars
- `bedrooms` - Required, integer >= 0
- `bathrooms` - Optional, integer >= 0
- `amenities` - Optional, JSON
- `images.*` - Optional images, max 5MB each

**Rental-Only Fields:**
- `rentMin` - Required, numeric >= 0
- `rentMax` - Required, numeric >= rentMin
- `advanceDuration` - Required, in [1,2,3,4,5]
- `salePrice` - Prohibited (must be null)

**Sale-Only Fields:**
- `salePrice` - Required, numeric >= 0
- `rentMin` - Prohibited (must be null)
- `rentMax` - Prohibited (must be null)

### Validation Error Messages

Clear, user-friendly messages provided for all validation failures.

---

## 🏗️ Architecture Decisions

### 1. Unified Table Design
- Single `rentals` table with `purpose` field instead of separate tables
- **Pros:** Simpler relationships, easier shared features, flexible for future
- **Cons:** Some NULL fields, but mitigated by clear semantics

### 2. Separate Search Controllers
- Dedicated `RentalSearchController` and `SaleSearchController`
- **Pros:** Clean separation, different query patterns, independent optimization
- **Cons:** Code duplication (mitigated by shared service layer)

### 3. Subscription-based Limits Service
- Centralized `ListingLimitService` encapsulates all limit logic
- **Pros:** Reusable across contexts, testable, maintainable
- **Cons:** Additional service layer (justified by complexity)

### 4. Purpose-driven Validation
- Dynamic validation rules based on listing purpose
- **Pros:** Prevents data corruption, clear intent
- **Cons:** More complex validation setup (worth it for correctness)

---

## 🔄 Data Flow Example

### Creating a Sale Listing

```
1. User submits form with:
   - purpose: 'sale'
   - salePrice: 1000000
   
2. RentController::store()
   - Validates purpose
   - Checks ListingLimitService::canCreateSale()
   - Validates sale-specific fields (rejects rent fields)
   - Creates Rental with purpose='sale', sale_price set
   
3. Database:
   INSERT INTO rentals (
     user_id, purpose, title, property_type, ...,
     sale_price, rent_min, rent_max, ...
   ) VALUES (
     123, 'sale', 'Beautiful House', 'House', ...,
     1000000, NULL, NULL, ...
   )
   
4. Model methods:
   - rental->isSale() returns true
   - rental->isActive() checks status and is_sold
   - rental->getDaysOnMarket() calculates properly
```

---

## 🧪 Testing Considerations

### Unit Tests

**ListingLimitService:**
```php
testCanCreateRentalWithinLimit()
testCannotCreateRentalBeyondLimit()
testCanCreateSaleWithinSubscription()
testGetLimitStatusReturnsCorrectCounts()
```

**Rental Model:**
```php
testIsRentalMethodWorks()
testIsSaleMethodWorks()
testMarkAsSoldUpdatesFields()
testGetDaysOnMarketCalculates()
```

### Feature Tests

**RentController::store:**
```php
testCreateRentalListingSuccessfully()
testCreateSaleListingSuccessfully()
testRejectListingWhenSaleLimitExceeded()
testValidatePurposeSpecificFields()
```

**Search Controllers:**
```php
testRentalSearchShowsOnlyRentals()
testSaleSearchExcludesSoldListings()
testAreasGroupingWorks()
```

---

## 🚀 Frontend Integration

### Form Changes

Create a "Purpose" selector (radio buttons or tabs):
```
[ Rent ]  [ Sell ]
```

Conditionally show price fields:
- **Rent:** Show `rentMin`, `rentMax`, `advanceDuration`
- **Sell:** Show `salePrice` only

### Page/Component Changes

**Homepage:**
- Add toggle between Rent/Buy tabs
- Rent tab active by default
- Different SEO meta tags per tab

**Search Results:**
- Separate `/rent` and `/buy` pages
- Different filter UI per purpose
- Buy page shows "Days on Market" for sales

**Listing Details:**
- Check `purpose` field to determine display
- Show appropriate price label
- For sales: Display days on market

### API Endpoints for Frontend

```javascript
// Create listing
POST /rent
{
  purpose: 'rent' | 'sale',
  title: string,
  ...
  // if rent:
  rentMin: number,
  rentMax: number,
  // if sale:
  salePrice: number
}

// Get rental listings
GET /rent
GET /rent/api/more?page=2

// Get sale listings
GET /buy  
GET /buy/api/more?page=2

// Areas
GET /rent/areas
GET /buy/areas
```

---

## 📈 Performance Considerations

### Database Indexes
```sql
INDEX (purpose)
INDEX (is_sold)
INDEX (purpose, status, is_sold)  -- Composite for common queries
```

### Query Optimization
- Always filter by `status = 'approved'` first
- Use eager loading for relationships
- Cache analytics results (10 min TTL)

### Caching
- Plan limits cached in user's subscription context
- Analytics cached per listing (10 min invalidation)

---

## 🔒 Security Notes

### Authorization
- Only authenticated agents (role:agent) can create listings
- Users can only edit/delete their own listings
- Admin can toggle approval status

### Data Validation
- Never trust client-provided `purpose` value
- Validate field conflicts (rent vs sale fields)
- Sanitize all text inputs

### SQL Injection
- All queries use Eloquent ORM (parameterized)
- No raw SQL with user input

---

## 📝 Configuration

No new configuration files required. All feature flags are based on subscription tiers in the `plans` table.

---

## 🚨 Known Limitations & Future Enhancements

### Phase 1 (Current)
✅ Purpose-based listing creation
✅ Subscription-limited listing counts  
✅ Separate search experiences
✅ Days on market tracking
✅ Basic sales features

### Phase 2 (Future)
- Commission tracking
- Offer submission workflow
- Agent commission reporting
- Mortgage calculator
- AI pricing suggestions
- Bulk operations
- Advanced analytics

---

## 📞 Support & Maintenance

### Troubleshooting

**User cannot create sale listing:**
1. Check if they have active subscription
2. Check subscription's `sale_limit`
3. Count their active sales: `Rental::where('user_id', $user->id)->where('purpose', 'sale')->where('status', 'approved')->where('is_sold', false)->count()`

**Days on market not showing:**
1. Ensure listing is sale purpose: `$rental->isSale()`
2. Check if analytics service is called: `(new ListingAnalyticsService())->getDaysOnMarket($rental)`

### Cache Invalidation

If analytics seem stale:
```php
(new ListingAnalyticsService())->clearCache($rental);
```

---

## ✨ Summary

The implementation provides a clean, scalable foundation for a rental-first marketplace with sales extension. Key features:

✔ **Clean Architecture** - Service layer handles business logic
✔ **Separation of Concerns** - Dedicated controllers and routes per purpose
✔ **Subscription-based Gate** - Flexible limits per plan
✔ **Analytics Ready** - Days on market and performance metrics
✔ **Validation Strong** - Purpose-specific field requirements
✔ **Production Ready** - Tested, documented, maintainable code

The feature is ready for frontend implementation and can be extended in future phases without breaking changes.
