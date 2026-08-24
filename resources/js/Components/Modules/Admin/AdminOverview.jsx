import { useMemo } from 'react';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = '1rem', sw = 1.8 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    home:     <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    eye:      <Ico d={['M15 12a3 3 0 11-6 0 3 3 0 016 0z', 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z']} />,
    users:    <Ico d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    trending: <Ico d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    check:    <Ico d="M5 13l4 4L19 7" />,
    clock:    <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    alert:    <Ico d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    arrow:    <Ico d="M5 12h14M12 5l7 7-7 7" />,
    flag:     <Ico d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />,
    shield:   <Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    currency: <Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    star:     <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
};

const MessageSquare = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
    catch { return v; }
};

const statusKey = (r) => {
    const raw = (r?.effective_listing_status ?? r?.status ?? 'pending').toString().toLowerCase();
    return raw === 'approved' ? 'available' : raw;
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const config = {
        approved:   { bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 35%)', icon: Icons.check, label: 'Approved' },
        verified:   { bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 35%)', icon: Icons.check, label: 'Verified' },
        available:     { bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 35%)', icon: Icons.check, label: 'Available' },
        resolved:   { bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 35%)', icon: Icons.check, label: 'Resolved' },
        pending:    { bg: 'hsl(38 92% 93%)',  color: 'hsl(38 92% 40%)',  icon: Icons.clock, label: 'Pending' },
        rejected:   { bg: 'hsl(0 72% 93%)',   color: 'hsl(0 72% 45%)',   icon: Icons.alert, label: 'Rejected' },
        dismissed:  { bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 45%)', icon: Icons.alert, label: 'Dismissed' },
        rented:     { bg: 'hsl(271 60% 93%)', color: 'hsl(271 60% 40%)', icon: Icons.check, label: 'Rented' },
        sold:       { bg: 'hsl(220 15% 93%)', color: 'hsl(220 25% 35%)', icon: Icons.check, label: 'Sold' },
        suspended:  { bg: 'hsl(0 72% 93%)',   color: 'hsl(0 72% 45%)',   icon: Icons.alert, label: 'Suspended' },
        inactive:   { bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 45%)', icon: Icons.alert, label: 'Inactive' },
        unverified: { bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 45%)', icon: Icons.alert, label: 'Unverified' },
    };
    const cfg = config[(status ?? '').toString().toLowerCase()] || config.unverified;

    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.18rem 0.55rem', borderRadius: 999,
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
            backgroundColor: cfg.bg, color: cfg.color, flexShrink: 0, whiteSpace: 'nowrap',
        }}>
            {cfg.icon}{cfg.label}
        </span>
    );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, value, label, accent = 'hsl(220 25% 15%)', accentBg = 'hsl(220 20% 93%)' }) => (
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
        <div style={{
            width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem',
            backgroundColor: accentBg, color: accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '0.875rem',
        }}>
            {icon}
        </div>
        <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'hsl(220 25% 12%)', margin: 0, lineHeight: 1 }}>
            {value}
        </p>
        <p style={{ fontSize: '0.78rem', color: 'hsl(220 15% 50%)', margin: '0.25rem 0 0', fontWeight: 500 }}>
            {label}
        </p>
    </div>
);

// ─── Attention Card ───────────────────────────────────────────────────────────
const AttentionCard = ({ icon, count, label, accent, accentBg, onClick }) => (
    <button
        onClick={onClick}
        disabled={!onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: '0.875rem',
            padding: '1rem 1.1rem', borderRadius: '0.75rem',
            border: '1px solid hsl(220 15% 91%)', backgroundColor: 'white',
            cursor: onClick ? 'pointer' : 'default', textAlign: 'left',
            fontFamily: 'inherit', width: '100%', transition: 'box-shadow 0.15s, border-color 0.15s',
            minHeight: '60px',
        }}
        onMouseEnter={e => { if (!onClick) return; e.currentTarget.style.boxShadow = '0 4px 14px hsl(220 20% 15% / 0.08)'; e.currentTarget.style.borderColor = accent; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'hsl(220 15% 91%)'; }}
    >
        <div style={{
            width: '2.4rem', height: '2.4rem', borderRadius: '0.6rem', flexShrink: 0,
            backgroundColor: accentBg, color: accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'hsl(220 25% 12%)', lineHeight: 1 }}>{count}</p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.76rem', color: 'hsl(220 15% 50%)', fontWeight: 600 }}>{label}</p>
        </div>
        {onClick && <span style={{ color: accent, display: 'flex', flexShrink: 0 }}>{Icons.arrow}</span>}
    </button>
);

// ─── View-all link button ────────────────────────────────────────────────────
const ViewAllButton = ({ onClick, children = 'View all' }) => (
    <button
        onClick={onClick}
        style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
            border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
            color: 'hsl(220 25% 25%)', fontSize: '0.72rem', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
            whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(220 25% 40%)'; e.currentTarget.style.backgroundColor = 'hsl(220 15% 97%)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'; e.currentTarget.style.backgroundColor = 'white'; }}
    >
        {children} {Icons.arrow}
    </button>
);

// ─── Recent Listing Card ──────────────────────────────────────────────────────
const RecentListingCard = ({ listing }) => (
    <div style={{
        padding: '0.875rem',
        backgroundColor: 'hsl(220 15% 97%)',
        borderRadius: '0.625rem',
        border: '1px solid hsl(220 15% 91%)',
        transition: 'box-shadow 0.15s',
    }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px hsl(220 20% 15% / 0.06)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: 'hsl(220 25% 12%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {listing.title}
            </h3>
            <StatusBadge status={listing.status} />
        </div>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.7rem', color: 'hsl(220 15% 50%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {[listing.address, listing.city].filter(Boolean).join(', ') || '—'}
        </p>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: 'hsl(220 15% 48%)', fontWeight: 500 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>{Icons.eye} {listing.views || 0}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>{Icons.users} {listing.inquiries || 0}</span>
        </div>
    </div>
);

// ─── Verification Request Row ─────────────────────────────────────────────────
const VerificationRow = ({ v, kind = 'listing' }) => {
    const primary = kind === 'agent'
        ? (v.agent_name ?? v.agent?.name ?? v.name ?? 'Unknown agent')
        : (v.rental?.title ?? v.property_title ?? 'Untitled Listing');

    const secondary = kind === 'agent'
        ? (v.email ?? v.agent?.email ?? '—')
        : (v.agent?.name ?? v.agent_name ?? 'Unknown agent');

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.7rem 0', borderBottom: '1px solid hsl(220 15% 93%)',
            flexWrap: 'wrap',
        }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: 'hsl(220 25% 14%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {primary}
                </p>
                <p style={{ margin: '0.1rem 0 0', fontSize: '0.7rem', color: 'hsl(220 15% 52%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {secondary} · {fmtDate(v.created_at)}
                </p>
            </div>
            <StatusBadge status={v.status} />
        </div>
    );
};


const AdminOverview = ({
    rentals = [],
    agentData = [],
    reports = [],
    reviews = [],
    inquiries = [],
    views = [],
    viewCount = 0,
    verifications = [],
    listingVerifications=[],
    agentVerifications=[],
    subsCount = 0,
    totalPendingVerifications = 0,
    onViewAllListings,
    onViewAllReports,
    onViewAllVerifications,
}) => {
    const viewsByRental = useMemo(
        () => Object.fromEntries(views.map(v => [v.id, v.views])),
        [views]
    );

    const inquiriesByRental = useMemo(() => {
        const map = {};
        inquiries.forEach(inq => {
            const rid = inq.rental?.id;
            if (rid != null) map[rid] = (map[rid] ?? 0) + 1;
        });
        return map;
    }, [inquiries]);

    const stats = useMemo(() => ({
        totalListings:   rentals.length,
        activeListings:  rentals.filter(r => ['available', 'verified', 'approved'].includes(statusKey(r))).length,
        pendingListings:  rentals.filter(r => ['inactive', 'sold', 'rented'].includes(statusKey(r))).length,
        totalAgents:     agentData.length,
        activeAgents:    agentData.filter(a => a.status !== 'suspended').length,
        pendingVerifs:   totalPendingVerifications,
        openReports:     reports.filter(r => !['resolved', 'dismissed'].includes((r.status ?? 'pending').toLowerCase())).length,
        totalInquiries:  inquiries.length,
        totalReviews:    reviews.length,
    }), [rentals, agentData, verifications, agentVerifications, listingVerifications, reports, inquiries, reviews]);

    const recentListings = useMemo(() => (
        [...rentals]
            .sort((a, b) => new Date(b.created_at ?? 0) - new Date(a.created_at ?? 0))
            .slice(0, 4)
            .map(r => ({
                id: r.id,
                title: r.title ?? 'Untitled Listing',
                address: r.address,
                city: r.city,
                status: statusKey(r),
                views: viewsByRental[r.id] ?? 0,
                inquiries: inquiriesByRental[r.id] ?? 0,
            }))
    ), [rentals, viewsByRental, inquiriesByRental]);

    const recentListingVerifications = useMemo(() => (
        [...listingVerifications]
            .sort((a, b) => new Date(b.created_at ?? 0) - new Date(a.created_at ?? 0))
            .slice(0, 5)
    ), [listingVerifications]);

    const recentAgentVerifications = useMemo(() => (
        [...agentVerifications]
            .sort((a, b) => new Date(b.created_at ?? 0) - new Date(a.created_at ?? 0))
            .slice(0, 5)
    ), [agentVerifications]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <style>{`
                /* Responsive grids */
                .ao-grid-stats-primary,
                .ao-grid-stats-secondary {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                .ao-grid-attention {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 0.875rem;
                }
                .ao-grid-recent-listings {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 0.875rem;
                }
                .ao-grid-verifications {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }

                @media (min-width: 640px) {
                    .ao-grid-stats-primary,
                    .ao-grid-stats-secondary {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .ao-grid-attention {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .ao-grid-recent-listings {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (min-width: 1024px) {
                    .ao-grid-stats-primary,
                    .ao-grid-stats-secondary {
                        grid-template-columns: repeat(4, 1fr);
                    }
                    .ao-grid-attention {
                        grid-template-columns: repeat(3, 1fr);
                    }
                    .ao-grid-recent-listings {
                        grid-template-columns: repeat(4, 1fr);
                    }
                    .ao-grid-verifications {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                /* Verification section specific improvements */
                .verification-section {
                    transition: all 0.2s ease;
                }
                .verification-section:hover {
                    box-shadow: 0 4px 14px hsl(220 20% 15% / 0.08);
                }
                .verification-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.5rem;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                .verification-title {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    min-width: 0;
                }
                .verification-title h2 {
                    font-size: clamp(0.8rem, 2vw, 0.9rem);
                    font-weight: 800;
                    color: hsl(220 25% 12%);
                    margin: 0;
                    line-height: 1.3;
                }
                .verification-list {
                    margin-top: 0.5rem;
                }
                .verification-row {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.7rem 0;
                    border-bottom: 1px solid hsl(220 15% 93%);
                    flex-wrap: wrap;
                }
                .verification-row:last-child {
                    border-bottom: none;
                }
                .verification-row-content {
                    flex: 1;
                    min-width: 150px;
                }
                .verification-row-title {
                    margin: 0;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: hsl(220 25% 14%);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .verification-row-subtitle {
                    margin: 0.1rem 0 0;
                    font-size: 0.7rem;
                    color: hsl(220 15% 52%);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                @media (max-width: 640px) {
                    .verification-header {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .verification-header .view-all-btn {
                        align-self: flex-start;
                    }
                }
            `}</style>

            {/* Platform totals */}
            <div className="ao-grid-stats-primary">
                <StatCard icon={Icons.home}     value={stats.totalListings.toLocaleString()} label="Total Listings" />
                <StatCard icon={Icons.users}    value={stats.totalAgents.toLocaleString()}   label="Total Agents" />
                <StatCard icon={Icons.eye}      value={viewCount}          label="Total Views" />
                <StatCard icon={Icons.trending} value={stats.totalInquiries.toLocaleString()} label="Total Inquiries" />
            </div>

            {/* Health / business metrics */}
            <div className="ao-grid-stats-secondary">
                <StatCard icon={Icons.check}    value={stats.activeListings.toLocaleString()} label="Active Listings"  accent="hsl(152 60% 35%)" accentBg="hsl(152 60% 93%)" />
                <StatCard icon={Icons.check}    value={stats.activeAgents.toLocaleString()}    label="Active Agents"    accent="hsl(152 60% 35%)" accentBg="hsl(152 60% 93%)" />
                <StatCard icon={Icons.currency} value={subsCount}         label="Paid Subscribers" accent="hsl(38 92% 40%)"  accentBg="hsl(38 92% 93%)" />
                <StatCard icon={Icons.star}     value={stats.totalReviews.toLocaleString()}    label="Total Reviews" />
            </div>

            {/* Needs Attention */}
            <div style={{
                backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem',
                padding: '1.25rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ width: 3, height: '1rem', borderRadius: 999, backgroundColor: 'hsl(0 72% 50%)' }} />
                    <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'hsl(220 25% 12%)' }}>Needs Attention</h2>
                </div>
                <div className="ao-grid-attention">
                    <AttentionCard
                        icon={Icons.clock} count={stats.pendingListings} label="Inactive, Sold & Rented Listings"
                        accent="hsl(38 92% 40%)" accentBg="hsl(38 92% 93%)" onClick={onViewAllListings}
                    />
                    <AttentionCard
                        icon={Icons.shield} count={stats.pendingVerifs} label="Verification Requests Pending"
                        accent="hsl(214 80% 45%)" accentBg="hsl(214 100% 95%)" onClick={onViewAllVerifications}
                    />
                    <AttentionCard
                        icon={Icons.flag} count={stats.openReports} label="Open Reports"
                        accent="hsl(0 72% 50%)" accentBg="hsl(0 72% 95%)" onClick={onViewAllReports}
                    />
                </div>
            </div>

            {/* Recent Listings */}
            <div style={{
                backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem',
                padding: '1.25rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 3, height: '1rem', borderRadius: 999, backgroundColor: 'hsl(220 25% 15%)' }} />
                        <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'hsl(220 25% 12%)' }}>Recent Listings</h2>
                    </div>
                    <ViewAllButton onClick={onViewAllListings} />
                </div>

                {recentListings.length > 0 ? (
                    <div className="ao-grid-recent-listings">
                        {recentListings.map(listing => <RecentListingCard key={listing.id} listing={listing} />)}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'hsl(220 15% 52%)', fontSize: '0.82rem' }}>
                        No listings on the platform yet.
                    </div>
                )}
            </div>

            {/* Recent Verification Requests */}
            <div className="ao-grid-verifications">
                        
                {/* Agent Verifications — teal */}
                <div className="verification-section" style={{
                    backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem',
                    padding: '1.25rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)',
                }}>
                    <div className="verification-header">
                        <div className="verification-title">
                            <div style={{ width: 3, height: '1rem', borderRadius: 999, backgroundColor: 'hsl(174 62% 32%)', flexShrink: 0 }} />
                            <h2>Agent Verification Requests</h2>
                        </div>
                        <ViewAllButton onClick={onViewAllVerifications} />
                    </div>
            
                    {recentAgentVerifications.length > 0 ? (
                        <div className="verification-list">
                            {recentAgentVerifications.map(v => (
                                <div key={v.id} className="verification-row">
                                    <div className="verification-row-content">
                                        <p className="verification-row-title">
                                            {v.agent_name ?? v.agent?.name ?? v.name ?? 'Unknown agent'}
                                        </p>
                                        <p className="verification-row-subtitle">
                                            {v.email ?? v.agent?.email ?? '—'} · {fmtDate(v.created_at)}
                                        </p>
                                    </div>
                                    <StatusBadge status={v.status} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'hsl(220 15% 52%)', fontSize: '0.82rem' }}>
                            No agent verification requests yet.
                        </div>
                    )}
                </div>
                
                {/* Listing Verifications — amber */}
                <div className="verification-section" style={{
                    backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem',
                    padding: '1.25rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)',
                }}>
                    <div className="verification-header">
                        <div className="verification-title">
                            <div style={{ width: 3, height: '1rem', borderRadius: 999, backgroundColor: 'hsl(38 92% 50%)', flexShrink: 0 }} />
                            <h2>Listing Verification Requests</h2>
                        </div>
                        <ViewAllButton onClick={onViewAllVerifications} />
                    </div>
            
                    {recentListingVerifications.length > 0 ? (
                        <div className="verification-list">
                            {recentListingVerifications.map(v => (
                                <div key={v.id} className="verification-row">
                                    <div className="verification-row-content">
                                        <p className="verification-row-title">
                                            {v.rental?.title ?? v.property_title ?? 'Untitled Listing'}
                                        </p>
                                        <p className="verification-row-subtitle">
                                            {v.agent?.name ?? v.agent_name ?? 'Unknown agent'} · {fmtDate(v.created_at)}
                                        </p>
                                    </div>
                                    <StatusBadge status={v.status} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'hsl(220 15% 52%)', fontSize: '0.82rem' }}>
                            No listing verification requests yet.
                        </div>
                    )}
                </div>
                
            </div>

        </div>
    );
};

export default AdminOverview;