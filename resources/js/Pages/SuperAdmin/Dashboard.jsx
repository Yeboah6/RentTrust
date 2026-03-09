import React from 'react';
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

const Dashboard = ({ platform, saas }) => {
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
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>
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