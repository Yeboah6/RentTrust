# 🧭 Adding Analytics Link to Navigation

Here are examples for adding the Reports page link to your admin navigation.

---

## Option 1: Add to SuperAdminLayout Sidebar

**File:** `resources/js/Layouts/SuperAdminLayout.jsx`

Find your navigation links section and add:

```jsx
import { Link } from '@inertiajs/react';

// In your navigation menu/sidebar:
<Link 
    href={route('super-admin.reports.index')}
    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
        route().current('super-admin.reports.index')
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
    }`}
>
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
    <span>Analytics</span>
</Link>
```

---

## Option 2: Add to a Navigation Array

If you have a navigation configuration array:

```jsx
const adminNavigation = [
    {
        label: 'Dashboard',
        href: route('super-admin.dashboard'),
        icon: 'dashboard',
    },
    {
        label: 'Analytics',
        href: route('super-admin.reports.index'),
        icon: 'chart',
    },
    {
        label: 'Plans',
        href: route('super-admin.plans.index'),
        icon: 'package',
    },
    // ... other items
];
```

Then map through it:

```jsx
{adminNavigation.map((item) => (
    <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
            route().current(item.href)
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
        }`}
    >
        <span>{item.label}</span>
    </Link>
))}
```

---

## Option 3: Add to Dashboard Navigation

**File:** `resources/js/Pages/SuperAdmin/Dashboard.jsx`

Add a quick link card:

```jsx
// In the Dashboard component, after the admin profile card:

<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <Link
        href={route('super-admin.reports.index')}
        className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white hover:shadow-lg transition-shadow"
    >
        <div className="flex items-center gap-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div>
                <h3 className="font-bold text-lg">Analytics</h3>
                <p className="text-blue-100 text-sm">View platform insights</p>
            </div>
        </div>
    </Link>

    {/* Add more quick links as needed */}
</div>
```

---

## Option 4: Top Navigation Bar

Add to your top navigation/header:

```jsx
<div className="flex items-center gap-2">
    <Link
        href={route('super-admin.reports.index')}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
    >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Analytics
    </Link>
</div>
```

---

## Option 5: Breadcrumb Navigation

When inside another page, show breadcrumb:

```jsx
<nav className="flex gap-2 text-sm text-gray-600 mb-6">
    <Link href={route('super-admin.dashboard')} className="hover:text-gray-900">
        Dashboard
    </Link>
    <span>/</span>
    <Link href={route('super-admin.reports.index')} className="text-blue-600 font-medium">
        Analytics
    </Link>
</nav>
```

---

## Direct URL Access

Users can also directly navigate to:

```
http://localhost:8000/super-admin/reports
```

---

## Testing the Link

1. Add the link to your navigation
2. Reload the page
3. Click the "Analytics" link
4. Should navigate to `/super-admin/reports`
5. Dashboard should load with all metrics

---

## Icon Suggestions

### Chart Bar (Used Above)
```jsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
</svg>
```

### Trending Up
```jsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8L7 17" />
</svg>
```

### Dashboard/Squares
```jsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v12m6-12v12M3 9h18" />
</svg>
```

---

## Complete Example: SuperAdminLayout Navigation

Here's a complete example showing where to add the link:

```jsx
// resources/js/Layouts/SuperAdminLayout.jsx

import { Link } from '@inertiajs/react';

export default function SuperAdminLayout({ children }) {
    const navItems = [
        { label: 'Dashboard', href: 'super-admin.dashboard', icon: 'dashboard' },
        { label: 'Analytics', href: 'super-admin.reports.index', icon: 'chart' },
        { label: 'Agents', href: 'super-admin.agents.index', icon: 'users' },
        { label: 'Listings', href: 'super-admin.listings.index', icon: 'home' },
        { label: 'Plans', href: 'super-admin.plans.index', icon: 'package' },
        // ... more items
    ];

    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white">
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={route(item.href)}
                            className={`block px-4 py-2 rounded-lg transition-colors ${
                                route().current(item.href)
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
```

---

## Styling Tips

### Active Link (Current Page)
```jsx
route().current('super-admin.reports.index') // Returns true if on Reports page
```

### Highlight Color
Use any of your brand colors:
- Blue: `bg-blue-600 text-white`
- Indigo: `bg-indigo-600 text-white`
- Purple: `bg-purple-600 text-white`

### Hover States
```jsx
className="hover:bg-gray-100 transition-colors duration-200"
```

---

## Mobile Menu

For mobile navigation:

```jsx
{/* Mobile Menu Toggle */}
<button
    onClick={() => setMenuOpen(!menuOpen)}
    className="md:hidden p-2 rounded-lg hover:bg-gray-100"
>
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
</button>

{/* Mobile Menu */}
{menuOpen && (
    <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg">
        {navItems.map((item) => (
            <Link
                key={item.href}
                href={route(item.href)}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 border-b"
            >
                {item.label}
            </Link>
        ))}
    </div>
)}
```

---

**That's it!** Pick the option that best fits your layout and add the link. The Reports page will be fully accessible! 🚀
