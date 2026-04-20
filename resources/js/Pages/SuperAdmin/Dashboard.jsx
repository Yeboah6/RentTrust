import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import AdminKpiCard from '@/Components/Modules/AdminKpiCard';

const HomeIcon = ({ style }) => (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const KeyIcon = ({ style }) => (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
);

const TagIcon = ({ style }) => (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 8V5a2 2 0 012-2z" />
    </svg>
);

const AgentIcon = ({ style }) => (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const UsersIcon = ({ style }) => (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const InquiryIcon = ({ style }) => (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
);

const SubscriptionIcon = ({ style }) => (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);

const RevenueIcon = ({ style }) => (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const EyeIcon = ({ style }) => (
    <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PropertyTypesIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);
const LocationsIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const AmenitiesIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const Dashboard = ({ platform, saas }) => {
    const { auth } = usePage().props;
    const superAdminData = auth?.super;
    const rentals = platform?.rental_listings || [];
    const reports = platform?.reports || [];

    const mockSuperAdmin = {
        name: superAdminData?.name || "Super Admin",
        role: superAdminData?.role,
        status: "verified",
        avatar_url: null,
        total_agents: platform.total_agents || 0,
        total_listings: rentals?.length || platform.total_listings || 0,
        total_reports: reports?.length || 0
    };

    const kpis = [
        {
            icon: HomeIcon,
            iconBg: 'hsl(214 100% 95%)',
            iconColor: 'hsl(214 80% 50%)',
            badge: 'LISTINGS',
            value: platform.total_listings?.toLocaleString() ?? '—',
            label: 'Total Listings',
            subValue: `${platform.rental_listings ?? 0} rental · ${platform.sale_listings ?? 0} sale`,
        },
        {
            icon: KeyIcon,
            iconBg: 'hsl(152 60% 93%)',
            iconColor: 'hsl(152 60% 35%)',
            badge: 'RENTALS',
            value: platform.rental_listings?.toLocaleString() ?? '—',
            label: 'Rental Listings',
        },
        {
            icon: TagIcon,
            iconBg: 'hsl(40 90% 93%)',
            iconColor: 'hsl(40 80% 40%)',
            badge: 'SALES',
            value: platform.sale_listings?.toLocaleString() ?? '—',
            label: 'Sale Listings',
        },
        {
            icon: AgentIcon,
            iconBg: 'hsl(270 60% 95%)',
            iconColor: 'hsl(270 60% 50%)',
            badge: 'ADMINS',
            value: platform.total_admins?.toLocaleString() ?? '—',
            label: 'Total Admins',
        },
        {
            icon: AgentIcon,
            iconBg: 'hsl(270 60% 95%)',
            iconColor: 'hsl(270 60% 50%)',
            badge: 'AGENTS',
            value: platform.total_agents?.toLocaleString() ?? '—',
            label: 'Total Agents',
        },
        {
            icon: UsersIcon,
            iconBg: 'hsl(340 70% 94%)',
            iconColor: 'hsl(340 70% 50%)',
            badge: 'USERS',
            value: platform.total_users?.toLocaleString() ?? '—',
            label: 'Total Users',
        },
        {
            icon: EyeIcon,
            iconBg: 'hsl(200 60% 93%)',
            iconColor: 'hsl(200 60% 40%)',
            badge: 'VIEWS',
            value: platform.total_views?.toLocaleString() ?? '—',
            label: 'Total Views',
        },
        {
            icon: InquiryIcon,
            iconBg: 'hsl(200 60% 93%)',
            iconColor: 'hsl(200 60% 40%)',
            badge: 'INQUIRIES',
            value: platform.total_inquiries?.toLocaleString() ?? '—',
            label: 'Total Inquiries',
        },
        {
            icon: SubscriptionIcon,
            iconBg: 'hsl(152 60% 93%)',
            iconColor: 'hsl(152 60% 35%)',
            badge: 'PLANS',
            value: platform.total_plans?.toLocaleString() ?? '—',
            label: 'Active Plans',
        },
        {
            icon: SubscriptionIcon,
            iconBg: 'hsl(152 60% 93%)',
            iconColor: 'hsl(152 60% 35%)',
            badge: 'SUBSCRIPTIONS',
            value: saas.active_subscriptions?.toLocaleString() ?? '—',
            label: 'Active Subscriptions',
        },
        {
            icon: RevenueIcon,
            iconBg: 'hsl(40 90% 93%)',
            iconColor: 'hsl(40 80% 40%)',
            badge: 'REVENUE',
            value: saas.mrr ?? '—',
            label: 'Monthly Recurring Revenue',
        },
        {
            icon: PropertyTypesIcon,
            iconBg: 'hsl(40 90% 93%)',
            iconColor: 'hsl(40 80% 40%)',
            badge: 'PROPERTY TYPES',
            value: platform.total_property_types ?? '—',
            label: 'Total Property Types',
        },
        {
            icon: LocationsIcon,
            iconBg: 'hsl(40 90% 93%)',
            iconColor: 'hsl(40 80% 40%)',
            badge: 'LOCATIONS',
            value: platform.total_locations ?? '—',
            label: 'Total Locations',
        },
        {
            icon: AmenitiesIcon,
            iconBg: 'hsl(40 90% 93%)',
            iconColor: 'hsl(40 80% 40%)',
            badge: 'Amenities',
            value: platform.total_amenities ?? '—',
            label: 'Total Amenities',
        },
        {
            icon: RevenueIcon,
            iconBg: 'hsl(40 90% 93%)',
            iconColor: 'hsl(40 80% 40%)',
            badge: 'REPORTS',
            value: platform.total_reports ?? '—',
            label: 'Total Reports',
        },
        {
            icon: InquiryIcon,
            iconBg: 'hsl(214 100% 95%)',
            iconColor: 'hsl(214 80% 50%)',
            badge: 'REVIEWS',
            value: platform.total_reviews?.toLocaleString() ?? '—',
            label: 'Total Reviews',
            subValue: `${platform.total_app_reviews ?? 0} app · ${platform.total_rent_reviews ?? 0} listing`,
        },
        {
            icon: SubscriptionIcon,
            iconBg: 'hsl(152 60% 93%)',
            iconColor: 'hsl(152 60% 35%)',
            badge: 'VERIFICATIONS',
            value: platform.total_verifications?.toLocaleString() ?? '—',
            label: 'Total Verifications',
        },
    ];

    return (
        <div>
            {/* Admin Profile Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
                <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        {mockSuperAdmin.avatar_url ? (
                            <img 
                                src={mockSuperAdmin.avatar_url} 
                                alt={mockSuperAdmin.name}
                                className="h-16 w-16 rounded-full object-cover border-2 border-blue-500"
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-white shadow-sm">
                                {mockSuperAdmin.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Admin Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-gray-900">{mockSuperAdmin.name}</h2>
                            {mockSuperAdmin.status === 'verified' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Verified
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{mockSuperAdmin.role === "super_admin" ? 'Super Admin' : 'Platform Administrator'}</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                        <Link 
                        href={'/super-admin/profile'}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                            View Profile
                        </Link>
                        <Link 
                        href={'/super-admin/settings'}
                            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                            Settings
                        </Link>
                    </div>
                </div>
            </div>

            {/* Dashboard Title */}
            
            {/* KPI Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '1.25rem',
                }}
            >
                {kpis.map((kpi, index) => (
                    <AdminKpiCard key={index} {...kpi} />
                ))}
            </div>
        </div>
    );
};

Dashboard.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default Dashboard;