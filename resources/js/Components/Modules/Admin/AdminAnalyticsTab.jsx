import { useMemo, useState } from 'react';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = '1rem', sw = 1.8 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    home:       <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    eye:        <Ico d={['M15 12a3 3 0 11-6 0 3 3 0 016 0z','M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z']} />,
    users:      <Ico d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    star:       <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    check:      <Ico d="M5 13l4 4L19 7" />,
    clock:      <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    dollar:     <Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    download:   <Ico d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
    flag:       <Ico d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />,
    shield:     <Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, value, label, accent = 'hsl(220 25% 15%)', bg = 'hsl(220 15% 93%)' }) => (
    <div style={{
        backgroundColor: 'white',
        border: '1px solid hsl(220 15% 91%)',
        borderRadius: '0.875rem',
        padding: '1.25rem',
        boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)',
        transition: 'box-shadow 0.15s',
    }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px hsl(220 20% 15% / 0.08)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px hsl(220 20% 15% / 0.04)'}
    >
        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', backgroundColor: bg, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.875rem' }}>
            {icon}
        </div>
        <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'hsl(220 25% 12%)', margin: 0, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: '0.78rem', color: 'hsl(220 15% 50%)', margin: '0.25rem 0 0', fontWeight: 500 }}>{label}</p>
    </div>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtPrice = (p) => {
    if (p.purpose === 'sale') return `GH₵${Number(p.sale_price || 0).toLocaleString()}`;
    return `GH₵${Number(p.rent_min || 0).toLocaleString()} – GH₵${Number(p.rent_max || 0).toLocaleString()}`;
};

// ─── Analytics Tab Module ─────────────────────────────────────────────────────
const AdminAnalyticsTab = ({
    rentals = [],
    agentData = [],
    views = [],
    totalViews = 0,
    inquiries = [],
    reviews = [],
    subscriptions = 0,
    totalVerifications = 0
}) => {
    // Compute views per rental from aggregated views array
    const viewsMap = useMemo(() => {
        const map = {};
        views.forEach(v => { map[v.id] = v.views; });
        return map;
    }, [views]);

    // Count inquiries per rental
    const inquiriesMap = useMemo(() => {
        const map = {};
        inquiries.forEach(inq => {
            const rid = inq.rental?.id;
            if (rid) map[rid] = (map[rid] ?? 0) + 1;
        });
        return map;
    }, [inquiries]);

    // Count reviews per rental
    const reviewsMap = useMemo(() => {
        const map = {};
        reviews.forEach(rev => {
            const rid = rev.rental_id;
            if (rid) map[rid] = (map[rid] ?? 0) + 1;
        });
        return map;
    }, [reviews]);

    const enrichedRentals = useMemo(() => rentals.map(r => ({
        ...r,
        views: viewsMap[r.id] ?? 0,
        inquiries: inquiriesMap[r.id] ?? 0,
        reviews: reviewsMap[r.id] ?? 0,
    })), [rentals, viewsMap, inquiriesMap, reviewsMap]);

    // Summary stats
    const totalListings = rentals.length;
    const activeListings = rentals.filter(r => ['approved','verified','active'].includes(r.status?.toLowerCase())).length;
    const pendingListings = rentals.filter(r => r.status === 'pending').length;
    const totalAgents = agentData.length;
    const activeAgents = agentData.filter(a => a.status !== 'suspended').length;
    const featuredListings = rentals.filter(r => r.is_featured == 1).length;
    const totalInquiries = inquiries.length;
    const totalReviews = reviews.length;

    // Top 10 most viewed listings
    const topByViews = useMemo(() =>
        [...enrichedRentals].sort((a, b) => b.views - a.views).slice(0, 10),
    [enrichedRentals]);

    // ─── CSV Download ─────────────────────────────────────────────────────────
    const downloadCSV = () => {
        const headers = [
            'Title', 'Type', 'Purpose', 'City', 'Area', 'Status',
            'Price', 'Bedrooms', 'Bathrooms', 'Views', 'Inquiries', 'Reviews',
            'Agent', 'Created At'
        ];

        const rows = enrichedRentals.map(r => [
            r.title,
            r.property_type,
            r.purpose,
            r.city,
            r.area,
            r.status,
            fmtPrice(r),
            r.bedrooms ?? '',
            r.bathrooms ?? '',
            r.views,
            r.inquiries,
            r.reviews,
            r.agent_name ?? '',
            r.created_at ? new Date(r.created_at).toLocaleDateString() : '',
        ]);

        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'rental_analytics_report.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <style>{`
                .analytics-grid-4 {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 0.875rem;
                }
                .analytics-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 0.875rem;
                }

                @media (min-width: 640px) {
                    .analytics-grid-4 {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .analytics-grid-2 {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (min-width: 1024px) {
                    .analytics-grid-4 {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }

                /* Table scroll container for mobile */
                .table-scroll {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                }
                .analytics-table {
                    min-width: 600px;
                }
                @media (max-width: 640px) {
                    .table-scroll {
                        border-radius: 0.5rem;
                    }
                    .analytics-table {
                        font-size: 0.75rem;
                    }
                }
            `}</style>

            {/* Header with download */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 3, height: '1.2rem', borderRadius: 999, backgroundColor: 'hsl(200 65% 36%)', flexShrink: 0 }} />
                    <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'hsl(220 25% 12%)', letterSpacing: '-0.01em' }}>
                        Analytics & Reports
                    </h2>
                </div>
                <button
                    onClick={downloadCSV}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                        padding: '0.5rem 1rem', borderRadius: '0.5rem',
                        border: 'none', backgroundColor: 'hsl(220 25% 15%)',
                        color: 'white', fontSize: '0.75rem', fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'background-color 0.15s',
                        whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'}
                >
                    {Icons.download} Download Report
                </button>
            </div>

            {/* Overview Stats Grid */}
            <div className="analytics-grid-4">
                <StatCard icon={Icons.home}    value={totalListings.toLocaleString()} label="Total Listings" />
                <StatCard icon={Icons.check}   value={activeListings.toLocaleString()} label="Active Listings" accent="hsl(152 60% 35%)" bg="hsl(152 60% 93%)" />
                <StatCard icon={Icons.clock}   value={pendingListings.toLocaleString()} label="Pending Review" accent="hsl(38 92% 40%)" bg="hsl(38 92% 93%)" />
                <StatCard icon={Icons.shield}    value={totalVerifications.toLocaleString()} label="Verifications" accent="hsl(40 80% 36%)" bg="hsl(40 90% 93%)" />
            </div>

            <div className="analytics-grid-4">
                <StatCard icon={Icons.users}   value={totalAgents.toLocaleString()}   label="Total Agents" />
                <StatCard icon={Icons.eye}     value={totalViews.toLocaleString()}    label="Total Views" accent="hsl(200 65% 36%)" bg="hsl(200 60% 93%)" />
                <StatCard icon={Icons.star}    value={totalInquiries.toLocaleString()} label="Total Inquiries" accent="hsl(270 55% 40%)" bg="hsl(270 60% 95%)" />
                <StatCard icon={Icons.star}    value={totalReviews.toLocaleString()}   label="Total Reviews" accent="hsl(38 92% 40%)" bg="hsl(38 92% 93%)" />
            </div>

            {/* Paid Subscribers */}
            <div className="analytics-grid-2">
                <StatCard icon={Icons.dollar}  value={subscriptions.toLocaleString()} label="Paid Subscribers" accent="hsl(160 60% 35%)" bg="hsl(160 60% 93%)" />
                <StatCard icon={Icons.users}   value={activeAgents.toLocaleString()}  label="Active Agents" accent="hsl(152 60% 35%)" bg="hsl(152 60% 93%)" />
            </div>

            {/* Top 10 Most Viewed Listings */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ width: 3, height: '1rem', borderRadius: 999, backgroundColor: 'hsl(200 65% 36%)' }} />
                    <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'hsl(220 25% 12%)' }}>Top 10 Most Viewed Listings</h2>
                </div>
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', overflow: 'hidden', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                    <div className="table-scroll">
                        <table className="analytics-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid hsl(220 15% 93%)', backgroundColor: 'hsl(220 15% 98.5%)' }}>
                                    <th style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 700, color: 'hsl(220 15% 45%)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>#</th>
                                    <th style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 700, color: 'hsl(220 15% 45%)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Listing</th>
                                    <th style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 700, color: 'hsl(220 15% 45%)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Type</th>
                                    <th style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 700, color: 'hsl(220 15% 45%)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Price</th>
                                    <th style={{ padding: '0.65rem 1rem', textAlign: 'center', fontWeight: 700, color: 'hsl(220 15% 45%)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Views</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topByViews.map((r, i) => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid hsl(220 15% 94%)' }}>
                                        <td style={{ padding: '0.65rem 1rem', color: 'hsl(220 15% 50%)' }}>{i + 1}</td>
                                        <td style={{ padding: '0.65rem 1rem', fontWeight: 600, color: 'hsl(220 25% 15%)', maxWidth: '12rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</td>
                                        <td style={{ padding: '0.65rem 1rem', textTransform: 'capitalize', color: 'hsl(220 15% 50%)' }}>{r.purpose}</td>
                                        <td style={{ padding: '0.65rem 1rem', fontWeight: 600, color: 'hsl(220 25% 15%)' }}>{fmtPrice(r)}</td>
                                        <td style={{ padding: '0.65rem 1rem', textAlign: 'center', fontWeight: 700, color: 'hsl(200 65% 36%)' }}>{r.views.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalyticsTab;