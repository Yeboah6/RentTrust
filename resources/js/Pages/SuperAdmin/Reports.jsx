import React, { useState, useMemo } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import AdminKpiCard from '@/Components/Modules/AdminKpiCard';

const CalendarIcon = ({ style }) => (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ChartIcon = ({ style }) => (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const HomeIcon = ({ style }) => (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const AgentIcon = ({ style }) => (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const EyeIcon = ({ style }) => (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const ChatIcon = ({ style }) => (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
);

const MapPinIcon = ({ style }) => (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const Reports = ({ analytics, filters }) => {
    const [dateRange, setDateRange] = useState({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({ ...prev, [name]: value }));
    };

    const handleFilter = () => {
        const params = {};
        if (dateRange.start_date) params.start_date = dateRange.start_date;
        if (dateRange.end_date) params.end_date = dateRange.end_date;
        
        router.get(route('super-admin.reports.index'), params);
    };

    const handleReset = () => {
        setDateRange({ start_date: '', end_date: '' });
        router.get(route('super-admin.reports.index'));
    };

    // Overview KPIs
    const overviewKpis = [
        {
            icon: HomeIcon,
            iconBg: 'hsl(214 100% 95%)',
            iconColor: 'hsl(214 80% 50%)',
            badge: 'TOTAL',
            value: analytics.overview.total_listings?.toLocaleString() ?? '—',
            label: 'Total Listings',
            subValue: `${analytics.overview.active_rentals ?? 0} rental · ${analytics.overview.active_sales ?? 0} sale`,
        },
        {
            icon: HomeIcon,
            iconBg: 'hsl(152 60% 93%)',
            iconColor: 'hsl(152 60% 35%)',
            badge: 'RENTAL',
            value: analytics.overview.active_rentals?.toLocaleString() ?? '—',
            label: 'Active Rentals',
        },
        {
            icon: HomeIcon,
            iconBg: 'hsl(40 90% 93%)',
            iconColor: 'hsl(40 80% 40%)',
            badge: 'SALES',
            value: analytics.overview.active_sales?.toLocaleString() ?? '—',
            label: 'Active Sales',
        },
        {
            icon: AgentIcon,
            iconBg: 'hsl(270 60% 95%)',
            iconColor: 'hsl(270 60% 50%)',
            badge: 'AGENTS',
            value: analytics.overview.total_agents?.toLocaleString() ?? '—',
            label: 'Total Agents',
        },
        {
            icon: EyeIcon,
            iconBg: 'hsl(200 60% 93%)',
            iconColor: 'hsl(200 60% 40%)',
            badge: 'VIEWS',
            value: analytics.overview.total_views?.toLocaleString() ?? '—',
            label: 'Total Views',
        },
        {
            icon: ChatIcon,
            iconBg: 'hsl(200 60% 93%)',
            iconColor: 'hsl(200 60% 40%)',
            badge: 'INQUIRIES',
            value: analytics.overview.total_inquiries?.toLocaleString() ?? '—',
            label: 'Total Inquiries',
        },
    ];

    const rentVsSaleKpis = [
        {
            icon: HomeIcon,
            iconBg: 'hsl(152 60% 93%)',
            iconColor: 'hsl(152 60% 35%)',
            badge: 'LISTINGS',
            value: analytics.rent_vs_sale.rent_count?.toLocaleString() ?? '—',
            label: 'Rental Listings',
        },
        {
            icon: HomeIcon,
            iconBg: 'hsl(40 90% 93%)',
            iconColor: 'hsl(40 80% 40%)',
            badge: 'LISTINGS',
            value: analytics.rent_vs_sale.sale_count?.toLocaleString() ?? '—',
            label: 'Sale Listings',
        },
        {
            icon: EyeIcon,
            iconBg: 'hsl(152 60% 93%)',
            iconColor: 'hsl(152 60% 35%)',
            badge: 'VIEWS',
            value: analytics.rent_vs_sale.rent_views?.toLocaleString() ?? '—',
            label: 'Rental Views',
        },
        {
            icon: EyeIcon,
            iconBg: 'hsl(40 90% 93%)',
            iconColor: 'hsl(40 80% 40%)',
            badge: 'VIEWS',
            value: analytics.rent_vs_sale.sale_views?.toLocaleString() ?? '—',
            label: 'Sale Views',
        },
        {
            icon: ChatIcon,
            iconBg: 'hsl(152 60% 93%)',
            iconColor: 'hsl(152 60% 35%)',
            badge: 'INQUIRIES',
            value: analytics.rent_vs_sale.rent_inquiries?.toLocaleString() ?? '—',
            label: 'Rental Inquiries',
        },
        {
            icon: ChatIcon,
            iconBg: 'hsl(40 90% 93%)',
            iconColor: 'hsl(40 80% 40%)',
            badge: 'INQUIRIES',
            value: analytics.rent_vs_sale.sale_inquiries?.toLocaleString() ?? '—',
            label: 'Sale Inquiries',
        },
    ];

    const planKpis = [
        {
            icon: AgentIcon,
            iconBg: 'hsl(240 100% 93%)',
            iconColor: 'hsl(240 100% 50%)',
            badge: 'PLAN',
            value: analytics.plan_distribution.free?.toLocaleString() ?? '—',
            label: 'Free Plan Agents',
        },
        {
            icon: AgentIcon,
            iconBg: 'hsl(280 100% 93%)',
            iconColor: 'hsl(280 100% 50%)',
            badge: 'PLAN',
            value: analytics.plan_distribution.pro?.toLocaleString() ?? '—',
            label: 'Pro Plan Agents',
        },
        {
            icon: AgentIcon,
            iconBg: 'hsl(20 100% 93%)',
            iconColor: 'hsl(20 100% 50%)',
            badge: 'PLAN',
            value: analytics.plan_distribution.elite?.toLocaleString() ?? '—',
            label: 'Elite Plan Agents',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-600 mt-1">Real-time platform analytics and insights</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">
                        {analytics.date_range.start} to {analytics.date_range.end}
                    </p>
                </div>
            </div>

            {/* Date Range Filter */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                            type="date"
                            name="start_date"
                            value={dateRange.start_date}
                            onChange={handleDateChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                            type="date"
                            name="end_date"
                            value={dateRange.end_date}
                            onChange={handleDateChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={handleFilter}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Filter
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Overview Section */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '1.25rem',
                    }}
                >
                    {overviewKpis.map((kpi, index) => (
                        <AdminKpiCard key={index} {...kpi} />
                    ))}
                </div>
            </div>

            {/* Rent vs Sale Comparison */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Rent vs Sale Comparison</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '1.25rem',
                    }}
                >
                    {rentVsSaleKpis.map((kpi, index) => (
                        <AdminKpiCard key={index} {...kpi} />
                    ))}
                </div>
            </div>

            {/* Plan Distribution */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Agent Plan Distribution</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '1.25rem',
                    }}
                >
                    {planKpis.map((kpi, index) => (
                        <AdminKpiCard key={index} {...kpi} />
                    ))}
                </div>
            </div>

            {/* Top Agents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Agents by Listings */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">Top Agents by Listings</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {analytics.agent_performance.top_agents_by_listings?.length > 0 ? (
                            analytics.agent_performance.top_agents_by_listings.map((agent, idx) => (
                                <div key={idx} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{agent.name}</p>
                                            <p className="text-sm text-gray-500">{agent.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-blue-600">{agent.rentals_count}</p>
                                            <p className="text-xs text-gray-500">listings</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center text-gray-500">
                                No data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Agents by Views */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">Top Agents by Views</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {analytics.agent_performance.top_agents_by_views?.length > 0 ? (
                            analytics.agent_performance.top_agents_by_views.map((agent, idx) => (
                                <div key={idx} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{agent.name}</p>
                                            <p className="text-sm text-gray-500">{agent.company || 'No company'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-green-600">{agent.total_views?.toLocaleString() ?? 0}</p>
                                            <p className="text-xs text-gray-500">views</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center text-gray-500">
                                No data available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Locations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Locations by Listings */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">Top Locations by Listings</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {analytics.location_insights.top_locations_by_listings?.length > 0 ? (
                            analytics.location_insights.top_locations_by_listings.map((location, idx) => (
                                <div key={idx} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl font-bold text-gray-300">#{idx + 1}</div>
                                            <div>
                                                <p className="font-medium text-gray-900">{location.city}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-blue-600">{location.total}</p>
                                            <p className="text-xs text-gray-500">listings</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center text-gray-500">
                                No data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Locations by Demand */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">Top Locations by Demand</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {analytics.location_insights.top_locations_by_demand?.length > 0 ? (
                            analytics.location_insights.top_locations_by_demand.map((location, idx) => (
                                <div key={idx} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl font-bold text-gray-300">#{idx + 1}</div>
                                            <div>
                                                <p className="font-medium text-gray-900">{location.city}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-purple-600">{location.total_views?.toLocaleString() ?? 0}</p>
                                            <p className="text-xs text-gray-500">views</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center text-gray-500">
                                No data available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Most Viewed Listings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">Most Viewed Listings</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {analytics.listing_performance.most_viewed?.length > 0 ? (
                                analytics.listing_performance.most_viewed.map((listing, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 truncate max-w-xs">{listing.title}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                listing.purpose === 'rent' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {listing.purpose === 'rent' ? 'Rent' : 'Sale'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{listing.city}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900">{listing.views?.toLocaleString() ?? 0}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Most Inquiries */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">Most Inquiries</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Inquiries</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {analytics.listing_performance.most_inquiries?.length > 0 ? (
                                analytics.listing_performance.most_inquiries.map((listing, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 truncate max-w-xs">{listing.title}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                listing.purpose === 'rent' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {listing.purpose === 'rent' ? 'Rent' : 'Sale'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{listing.city}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900">{listing.inquiries_count ?? 0}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Zero Engagement Listings */}
            {analytics.listing_performance.zero_engagement?.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
                        <h3 className="text-lg font-semibold text-gray-900">⚠️ Zero Engagement Listings</h3>
                        <p className="text-sm text-gray-600 mt-1">Listings with no views and no inquiries</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {analytics.listing_performance.zero_engagement.slice(0, 10).map((listing, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 truncate max-w-xs">{listing.title}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{listing.city}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(listing.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

Reports.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default Reports;
