import { useState } from 'react';

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
    trending:   <Ico d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    star:       <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    check:      <Ico d="M5 13l4 4L19 7" />,
    clock:      <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    alert:      <Ico d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    arrow:      <Ico d="M5 12h14M12 5l7 7-7 7" />,
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const config = {
        approved:  { bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 35%)', icon: Icons.check, label: 'Approved' },
        verified:  { bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 35%)', icon: Icons.check, label: 'Verified' },
        active:    { bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 35%)', icon: Icons.check, label: 'Active' },
        pending:   { bg: 'hsl(38 92% 93%)',  color: 'hsl(38 92% 40%)',  icon: Icons.clock, label: 'Pending' },
        rejected:  { bg: 'hsl(0 72% 93%)',   color: 'hsl(0 72% 45%)',   icon: Icons.alert, label: 'Rejected' },
        rented:    { bg: 'hsl(271 60% 93%)', color: 'hsl(271 60% 40%)',  icon: Icons.check, label: 'Rented' },
        sold:      { bg: 'hsl(220 15% 93%)', color: 'hsl(220 25% 35%)',  icon: Icons.check, label: 'Sold' },
        inactive:  { bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 45%)',  icon: Icons.alert, label: 'Inactive' },
        unverified:{ bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 45%)',  icon: Icons.alert, label: 'Unverified' },
    };
    const cfg = config[status] || config.unverified;
    
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.18rem 0.55rem', borderRadius: 999,
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
            backgroundColor: cfg.bg, color: cfg.color, flexShrink: 0,
        }}>
            {cfg.icon}{cfg.label}
        </span>
    );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, value, label, trend }) => (
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
            backgroundColor: 'hsl(174 62% 32% / 0.1)',
            color: 'hsl(174 62% 32%)',
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
        {trend && (
            <p style={{ fontSize: '0.7rem', color: 'hsl(152 60% 40%)', marginTop: '0.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                {Icons.trending} {trend}
            </p>
        )}
    </div>
);

// ─── Recent Listing Card ──────────────────────────────────────────────────────
const RecentListingCard = ({ property, getStatusBadge, onViewAll }) => (
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: 'hsl(220 25% 12%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {property.title}
            </h3>
            {getStatusBadge(property.effective_listing_status)}
        </div>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.7rem', color: 'hsl(220 15% 50%)' }}>
            {property.address}, {property.city}
        </p>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: 'hsl(220 15% 48%)', fontWeight: 500 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {Icons.eye} {property.views || 0}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {Icons.users} {property.inquiries || 0}
            </span>
        </div>
    </div>
);

// ─── Limit Card ───────────────────────────────────────────────────────────────
const LimitCard = ({ icon, label, active, limit, remaining, canCreate, color }) => (
    <div style={{
        padding: '1rem',
        backgroundColor: 'hsl(220 15% 97%)',
        borderRadius: '0.5rem',
        border: '1px solid hsl(220 15% 91%)',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ color: color || 'hsl(174 62% 32%)', display: 'flex' }}>{icon}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'hsl(220 25% 12%)' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'hsl(220 25% 12%)' }}>
                {active}{limit ? ` / ${limit}` : ''}
            </span>
            {limit && (
                <span style={{ 
                    fontSize: '0.7rem', fontWeight: 600,
                    color: canCreate ? 'hsl(152 60% 40%)' : 'hsl(0 72% 48%)',
                }}>
                    {remaining === null ? 'Unlimited' : `${remaining} left`}
                </span>
            )}
        </div>
    </div>
);

// ─── Overview Tab Module ──────────────────────────────────────────────────────
const OverviewTab = ({ 
    properties = [], 
    totalViews = 0, 
    totalInquiries = 0, 
    conversionRate = 0,
    limitStatus = null,
    getStatusBadge,
    onViewAllListings,
}) => {
    const recentListings = properties.slice(0, 3);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <style>{`
                .overview-stats-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                .overview-limits-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                .overview-recent-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 0.875rem;
                }

                @media (min-width: 640px) {
                    .overview-stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .overview-limits-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .overview-recent-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (min-width: 1024px) {
                    .overview-stats-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                    .overview-recent-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
            `}</style>

            {/* Stats Grid */}
            <div className="overview-stats-grid">
                <StatCard 
                    icon={Icons.home} 
                    value={properties.length} 
                    label="Active Listings" 
                />
                <StatCard 
                    icon={Icons.eye} 
                    value={totalViews.toLocaleString()} 
                    label="Total Views" 
                />
                <StatCard 
                    icon={Icons.users} 
                    value={totalInquiries.toLocaleString()} 
                    label="Total Inquiries" 
                />
                <StatCard 
                    icon={Icons.trending} 
                    value={`${conversionRate}%`} 
                    label="Conversion Rate" 
                />
            </div>

            {/* Plan Limits Section */}
            {limitStatus && (
                <div style={{
                    backgroundColor: 'white',
                    border: '1px solid hsl(220 15% 91%)',
                    borderRadius: '0.875rem',
                    padding: '1.25rem',
                    boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 3, height: '1rem', borderRadius: 999, backgroundColor: 'hsl(174 62% 32%)' }} />
                            <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'hsl(220 25% 12%)' }}>
                                Plan Limits
                            </h2>
                        </div>
                        <span style={{ 
                            fontSize: '0.72rem', fontWeight: 700, color: 'hsl(220 15% 45%)',
                            backgroundColor: 'hsl(220 15% 93%)', padding: '0.25rem 0.6rem',
                            borderRadius: 999,
                        }}>
                            {typeof limitStatus?.plan === 'string' ? limitStatus.plan : (limitStatus?.plan?.name || 'Free')}
                        </span>
                    </div>

                    <div className="overview-limits-grid">
                        <LimitCard 
                            icon={Icons.home}
                            label="Rental Listings"
                            active={limitStatus?.rentals?.active ?? 0}
                            limit={limitStatus?.rentals?.limit}
                            remaining={limitStatus?.rentals?.remaining}
                            canCreate={limitStatus?.rentals?.can_create}
                            color="hsl(174 62% 32%)"
                        />
                        <LimitCard 
                            icon={<Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                            label="Sale Listings"
                            active={limitStatus?.sales?.active ?? 0}
                            limit={limitStatus?.sales?.limit}
                            remaining={limitStatus?.sales?.remaining}
                            canCreate={limitStatus?.sales?.can_create}
                            color="hsl(38 92% 50%)"
                        />
                    </div>
                    {(!limitStatus?.rentals?.can_create || !limitStatus?.sales?.can_create) && (
                        <div style={{ 
                            marginTop: '1rem', padding: '0.75rem',
                            backgroundColor: 'hsl(38 92% 95%)', border: '1px solid hsl(38 92% 85%)',
                            borderRadius: '0.5rem',
                        }}>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(38 92% 35%)', fontWeight: 600 }}>
                                You've reached your plan limits. Upgrade your plan to add more listings.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Recent Listings */}
            <div style={{
                backgroundColor: 'white',
                border: '1px solid hsl(220 15% 91%)',
                borderRadius: '0.875rem',
                padding: '1.25rem',
                boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 3, height: '1rem', borderRadius: 999, backgroundColor: 'hsl(174 62% 32%)' }} />
                        <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'hsl(220 25% 12%)' }}>
                            Recent Listings
                        </h2>
                    </div>
                    <button 
                        onClick={onViewAllListings}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                            border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                            color: 'hsl(174 62% 30%)', fontSize: '0.72rem', fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(174 62% 40%)'; e.currentTarget.style.backgroundColor = 'hsl(174 40% 97%)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'; e.currentTarget.style.backgroundColor = 'white'; }}
                    >
                        View all {Icons.arrow}
                    </button>
                </div>
                
                {recentListings.length > 0 ? (
                    <div className="overview-recent-grid">
                        {recentListings.map(property => (
                            <RecentListingCard 
                                key={property.id}
                                property={property}
                                getStatusBadge={getStatusBadge}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'hsl(220 15% 52%)', fontSize: '0.82rem' }}>
                        No listings yet. Add your first property to get started!
                    </div>
                )}
            </div>
        </div>
    );
};

export default OverviewTab;