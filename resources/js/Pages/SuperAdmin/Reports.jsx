import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = ({ d, size = '1rem', sw = 1.8 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    home:     () => <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    agent:    () => <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    eye:      () => <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} />,
    chat:     () => <Ico d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />,
    pin:      () => <Ico d={["M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z","M15 11a3 3 0 11-6 0 3 3 0 016 0z"]} />,
    chart:    () => <Ico d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    alert:    () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    calendar: () => <Ico d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    refresh:  () => <Ico d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" size="0.9rem" />,
    x:        () => <Ico d="M6 18L18 6M6 6l12 12" size="0.85rem" />,
    trending: () => <Ico d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    star:     () => <Ico d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return v; }
};

const fmtNum = (v) => v != null ? Number(v).toLocaleString() : '—';

// ─── Atoms ────────────────────────────────────────────────────────────────────

const Card = ({ children, style: s }) => (
    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', overflow: 'hidden', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)', ...s }}>
        {children}
    </div>
);

const CardHead = ({ title, sub, accent }) => (
    <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid hsl(220 15% 94%)', backgroundColor: 'hsl(220 15% 98.5%)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {accent && <div style={{ width: '3px', height: '1.1rem', borderRadius: '999px', backgroundColor: accent, flexShrink: 0 }} />}
        <div>
            <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: '800', letterSpacing: '0.03em', color: 'hsl(220 25% 20%)' }}>{title}</p>
            {sub && <p style={{ margin: '0.1rem 0 0', fontSize: '0.68rem', color: 'hsl(220 15% 52%)' }}>{sub}</p>}
        </div>
    </div>
);

// ─── KPI Card ─────────────────────────────────────────────────────────────────

const Kpi = ({ label, value, sub, accent, iconBg, iconColor, icon: Icon, bar }) => (
    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', overflow: 'hidden', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)', display: 'flex', flexDirection: 'column' }}>
        {bar && <div style={{ height: '3px', background: `linear-gradient(90deg, ${bar}, ${bar}44)` }} />}
        <div style={{ padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', flex: 1 }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.65rem', backgroundColor: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon />
            </div>
            <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '1.45rem', fontWeight: '900', color: accent, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
                <div style={{ fontSize: '0.76rem', fontWeight: '700', color: 'hsl(220 25% 22%)', marginTop: '0.12rem' }}>{label}</div>
                {sub && <div style={{ fontSize: '0.67rem', color: 'hsl(220 15% 55%)', marginTop: '0.05rem' }}>{sub}</div>}
            </div>
        </div>
    </div>
);

// ─── Section header ───────────────────────────────────────────────────────────

const SectionHead = ({ title, accent }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.875rem' }}>
        <div style={{ width: '3px', height: '1.2rem', borderRadius: '999px', backgroundColor: accent, flexShrink: 0 }} />
        <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '900', color: 'hsl(220 25% 14%)', letterSpacing: '-0.01em' }}>{title}</h2>
    </div>
);

// ─── Agent performance row ────────────────────────────────────────────────────

const AgentPerfRow = ({ agent, rank, valueKey, valueSub, accentColor }) => {
    const value = agent[valueKey];
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.7rem 1.25rem', borderBottom: '1px solid hsl(220 15% 96%)', transition: 'background-color 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 98.5%)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <div style={{ width: '1.5rem', textAlign: 'center', fontSize: '0.7rem', fontWeight: '900', color: rank <= 3 ? accentColor : 'hsl(220 15% 60%)', flexShrink: 0 }}>
                {rank <= 3 ? ['🥇','🥈','🥉'][rank - 1] : `#${rank}`}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'hsl(220 25% 14%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.name}</div>
                <div style={{ fontSize: '0.68rem', color: 'hsl(220 15% 55%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.email || agent.company || '—'}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '900', color: accentColor }}>{fmtNum(value)}</div>
                <div style={{ fontSize: '0.62rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'hsl(220 15% 55%)' }}>{valueSub}</div>
            </div>
        </div>
    );
};

// ─── Location row ─────────────────────────────────────────────────────────────

const LocationRow = ({ location, rank, value, valueSub, accentColor, max }) => {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
        <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid hsl(220 15% 96%)', transition: 'background-color 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 98.5%)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: '900', color: rank <= 3 ? accentColor : 'hsl(220 15% 58%)', width: '1.4rem', flexShrink: 0, textAlign: 'center' }}>
                    {rank <= 3 ? ['🥇','🥈','🥉'][rank - 1] : `#${rank}`}
                </div>
                <div style={{ flex: 1, fontSize: '0.82rem', fontWeight: '700', color: 'hsl(220 25% 14%)' }}>{location}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: '900', color: accentColor }}>{fmtNum(value)}</div>
                <div style={{ fontSize: '0.62rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'hsl(220 15% 55%)', width: '3.5rem', textAlign: 'right' }}>{valueSub}</div>
            </div>
            <div style={{ marginLeft: '2.15rem', height: '3px', borderRadius: '999px', backgroundColor: 'hsl(220 15% 93%)' }}>
                <div style={{ height: '100%', borderRadius: '999px', backgroundColor: accentColor, width: `${pct}%`, transition: 'width 0.6s ease', opacity: 0.7 }} />
            </div>
        </div>
    );
};

// ─── Listing table row ────────────────────────────────────────────────────────

const ListingTableRow = ({ listing, valueKey, valueSub }) => {
    const isRent = listing.purpose === 'rent';
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 5rem 9rem 5.5rem', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1.25rem', borderBottom: '1px solid hsl(220 15% 96%)', transition: 'background-color 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 98.5%)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: '700', color: 'hsl(220 25% 14%)' }}>{listing.title}</div>
            <div>
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.6rem', fontWeight: '800', letterSpacing: '0.06em', backgroundColor: isRent ? 'hsl(152 60% 93%)' : 'hsl(214 100% 95%)', color: isRent ? 'hsl(152 60% 28%)' : 'hsl(214 80% 38%)' }}>
                    {isRent ? 'RENT' : 'SALE'}
                </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'hsl(220 15% 50%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing.area || '—'}</div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: '900', color: 'hsl(220 25% 14%)' }}>{fmtNum(listing[valueKey])}</div>
                <div style={{ fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'hsl(220 15% 55%)' }}>{valueSub}</div>
            </div>
        </div>
    );
};

// ─── Empty state ──────────────────────────────────────────────────────────────

const Empty = ({ emoji = '📊', msg = 'No data available' }) => (
    <div style={{ padding: '2.5rem', textAlign: 'center', color: 'hsl(220 15% 58%)' }}>
        <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{emoji}</div>
        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '600' }}>{msg}</p>
    </div>
);

// ─── Table header ─────────────────────────────────────────────────────────────

const TableHead = ({ cols }) => (
    <div style={{ display: 'grid', gridTemplateColumns: cols.map(c => c.width).join(' '), alignItems: 'center', gap: '0.75rem', padding: '0.55rem 1.25rem', backgroundColor: 'hsl(220 15% 97.5%)', borderBottom: '1px solid hsl(220 15% 92%)' }}>
        {cols.map(c => (
            <div key={c.label} style={{ fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)', textAlign: c.right ? 'right' : 'left' }}>{c.label}</div>
        ))}
    </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const Reports = ({ analytics, filters }) => {
    const [dateRange, setDateRange] = useState({
        start_date: filters?.start_date || '',
        end_date:   filters?.end_date   || '',
    });

    const handleFilter = () => {
        const params = {};
        if (dateRange.start_date) params.start_date = dateRange.start_date;
        if (dateRange.end_date)   params.end_date   = dateRange.end_date;
        router.get(route('super-admin.reports.index'), params);
    };

    const handleReset = () => {
        setDateRange({ start_date: '', end_date: '' });
        router.get(route('super-admin.reports.index'));
    };

    const ov  = analytics?.overview            ?? {};
    const rvs = analytics?.rent_vs_sale        ?? {};
    const pd  = analytics?.plan_distribution   ?? {};
    const ap  = analytics?.agent_performance   ?? {};
    const li  = analytics?.location_insights   ?? {};
    const lp  = analytics?.listing_performance ?? {};
    const dr  = analytics?.date_range          ?? {};
    const avl = analytics?.agent_vs_listing    ?? {};

    const topByListings = ap.top_agents_by_listings ?? [];
    const topByViews    = ap.top_agents_by_views    ?? [];
    const topLocByList  = li.top_locations_by_listings ?? [];
    const topLocByDem   = li.top_locations_by_demand   ?? [];
    const mostViewed    = lp.most_viewed    ?? [];
    const mostInquiries = lp.most_inquiries ?? [];
    const zeroEngage    = lp.zero_engagement ?? [];

    const maxLocListings = Math.max(...topLocByList.map(l => l.total ?? 0), 1);
    const maxLocViews    = Math.max(...topLocByDem.map(l => l.total_views ?? 0), 1);

    const hasFilters = dateRange.start_date || dateRange.end_date;

    return (
        <>
        <Head>
            <title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
        </Head>
            <div>
                {/* ── Page header ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.22rem', letterSpacing: '-0.02em' }}>Analytics</h1>
                        <p style={{ fontSize: '0.82rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                            {dr.start && dr.end ? `${dr.start} — ${dr.end}` : 'All time · Real-time platform insights'}
                        </p>
                    </div>

                    {/* Date filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.38rem 0.75rem', borderRadius: '0.55rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 15% 42%)' }}>
                            <Icons.calendar />
                            <input type="date" value={dateRange.start_date} onChange={e => setDateRange(p => ({ ...p, start_date: e.target.value }))}
                                style={{ border: 'none', outline: 'none', fontSize: '0.8rem', fontFamily: 'inherit', color: 'hsl(220 25% 22%)', backgroundColor: 'transparent', width: '8rem', cursor: 'pointer' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'hsl(220 15% 55%)' }}>to</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.38rem 0.75rem', borderRadius: '0.55rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 15% 42%)' }}>
                            <Icons.calendar />
                            <input type="date" value={dateRange.end_date} onChange={e => setDateRange(p => ({ ...p, end_date: e.target.value }))}
                                style={{ border: 'none', outline: 'none', fontSize: '0.8rem', fontFamily: 'inherit', color: 'hsl(220 25% 22%)', backgroundColor: 'transparent', width: '8rem', cursor: 'pointer' }} />
                        </div>
                        <button onClick={handleFilter}
                            style={{ padding: '0.5rem 1rem', borderRadius: '0.55rem', border: 'none', backgroundColor: 'hsl(220 25% 15%)', color: 'white', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'}>
                            Apply
                        </button>
                        {hasFilters && (
                            <button onClick={handleReset}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.5rem 0.75rem', borderRadius: '0.55rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 15% 44%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                                <Icons.x /> Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Accent bar ── */}
                <div style={{ height: '4px', borderRadius: '999px', background: 'linear-gradient(90deg, hsl(214 80% 50%), hsl(152 55% 42%), hsl(40 80% 48%))', marginBottom: '1.5rem', opacity: 0.5 }} />

                {/* ═══════════════════════════════════════════════════════════
                    OVERVIEW
                ══════════════════════════════════════════════════════════════ */}
                <div style={{ marginBottom: '1.75rem' }}>
                    <SectionHead title="Overview" accent="hsl(214 80% 50%)" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.875rem' }}>
                        <Kpi 
                            label="Total Listings"   
                            value={fmtNum(ov.total_listings)}   
                            sub={`${fmtNum(ov.active_rentals)} rental · ${fmtNum(ov.active_sales)} sale`} 
                            accent="hsl(220 25% 15%)"  iconBg="hsl(220 20% 93%)"   iconColor="hsl(220 25% 30%)" icon={Icons.home}    bar="hsl(220 25% 30%)" />
                        <Kpi 
                            label="Active Rentals"   
                            value={fmtNum(ov.active_rentals)}   
                            accent="hsl(152 55% 33%)"  iconBg="hsl(152 55% 92%)"  iconColor="hsl(152 55% 35%)" icon={Icons.home}    bar="hsl(152 55% 42%)" />
                        <Kpi 
                            label="Active Sales"     
                            value={fmtNum(ov.active_sales)}     
                            accent="hsl(40 80% 36%)"   iconBg="hsl(40 90% 93%)"   iconColor="hsl(40 80% 40%)"  icon={Icons.home}    bar="hsl(40 80% 48%)" />
                        <Kpi 
                            label="Total Agents"     
                            value={fmtNum(ov.total_agents)}     
                            accent="hsl(270 55% 40%)"  iconBg="hsl(270 60% 95%)"  iconColor="hsl(270 55% 45%)" icon={Icons.agent}   bar="hsl(270 55% 50%)" />
                        <Kpi 
                            label="Total Views"      
                            value={fmtNum(ov.total_views)}      
                            accent="hsl(214 80% 44%)"  iconBg="hsl(214 100% 95%)" iconColor="hsl(214 80% 48%)" icon={Icons.eye}     bar="hsl(214 80% 52%)" />
                        <Kpi 
                            label="Total Inquiries"  
                            value={fmtNum(ov.total_inquiries)}  
                            accent="hsl(200 65% 36%)"  iconBg="hsl(200 60% 93%)"  iconColor="hsl(200 60% 40%)" icon={Icons.chat}    bar="hsl(200 65% 44%)" />
                        <Kpi
                            label="Total Verifications"
                            value={fmtNum(ov.total_verifications)}
                            sub={`${fmtNum(avl.agent?.approved)} agents · ${fmtNum(avl.listing?.approved)} listings`}
                            accent="hsl(220 25% 15%)" iconBg="hsl(220 20% 93%)" iconColor="hsl(220 25% 30%)" icon={Icons.home} bar="hsl(220 25% 30%)"
                        />
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    RENT VS SALE
                ══════════════════════════════════════════════════════════════ */}
                <div style={{ marginBottom: '1.75rem' }}>
                    <SectionHead title="Rent vs Sale" accent="hsl(152 55% 42%)" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                        {/* Rent column */}
                        <Card>
                            <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid hsl(220 15% 94%)', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'hsl(152 55% 98%)' }}>
                                <div style={{ width: '3px', height: '1rem', borderRadius: '999px', backgroundColor: 'hsl(152 55% 42%)' }} />
                                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800', color: 'hsl(152 55% 28%)' }}>Rentals</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
                                {[
                                    { label: 'Listings', value: fmtNum(rvs.rent_count) },
                                    { label: 'Views',    value: fmtNum(rvs.rent_views) },
                                    { label: 'Inquiries',value: fmtNum(rvs.rent_inquiries) },
                                ].map(({ label, value }, i, arr) => (
                                    <div key={label} style={{ padding: '1rem', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid hsl(220 15% 93%)' : 'none' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: '900', color: 'hsl(152 55% 33%)', lineHeight: 1 }}>{value}</div>
                                        <div style={{ fontSize: '0.63rem', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', marginTop: '0.25rem' }}>{label}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Sale column */}
                        <Card>
                            <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid hsl(220 15% 94%)', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'hsl(214 80% 98%)' }}>
                                <div style={{ width: '3px', height: '1rem', borderRadius: '999px', backgroundColor: 'hsl(214 80% 50%)' }} />
                                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800', color: 'hsl(214 80% 32%)' }}>Sales</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
                                {[
                                    { label: 'Listings', value: fmtNum(rvs.sale_count) },
                                    { label: 'Views',    value: fmtNum(rvs.sale_views) },
                                    { label: 'Inquiries',value: fmtNum(rvs.sale_inquiries) },
                                ].map(({ label, value }, i, arr) => (
                                    <div key={label} style={{ padding: '1rem', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid hsl(220 15% 93%)' : 'none' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: '900', color: 'hsl(214 80% 44%)', lineHeight: 1 }}>{value}</div>
                                        <div style={{ fontSize: '0.63rem', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', marginTop: '0.25rem' }}>{label}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    VERIFICATIONS
                ══════════════════════════════════════════════════════════════ */}
                <div style={{ marginBottom: '1.75rem' }}>
                    <SectionHead title="Agent vs Listing Verification" accent="hsl(152 55% 42%)" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                        {/* Rent column */}
                        <Card>
                            <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid hsl(220 15% 94%)', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'hsl(152 55% 98%)' }}>
                                <div style={{ width: '3px', height: '1rem', borderRadius: '999px', backgroundColor: 'hsl(152 55% 42%)' }} />
                                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800', color: 'hsl(152 55% 28%)' }}>Agent</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
                                {[
                                    { label: 'Approved', value: fmtNum(avl.agent?.approved) },
                                    { label: 'Pending',  value: fmtNum(avl.agent?.pending) },
                                    { label: 'Rejected', value: fmtNum(avl.agent?.rejected) },
                                ].map(({ label, value }, i, arr) => (
                                    <div key={label} style={{ padding: '1rem', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid hsl(220 15% 93%)' : 'none' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: '900', color: 'hsl(152 55% 33%)', lineHeight: 1 }}>{value}</div>
                                        <div style={{ fontSize: '0.63rem', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', marginTop: '0.25rem' }}>{label}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Sale column */}
                        <Card>
                            <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid hsl(220 15% 94%)', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'hsl(214 80% 98%)' }}>
                                <div style={{ width: '3px', height: '1rem', borderRadius: '999px', backgroundColor: 'hsl(214 80% 50%)' }} />
                                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800', color: 'hsl(214 80% 32%)' }}>Listing</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
                                {[
                                    { label: 'Approved', value: fmtNum(avl.listing?.approved) },
                                    { label: 'Pending',  value: fmtNum(avl.listing?.pending) },
                                    { label: 'Rejected', value: fmtNum(avl.listing?.rejected) },
                                ].map(({ label, value }, i, arr) => (
                                    <div key={label} style={{ padding: '1rem', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid hsl(220 15% 93%)' : 'none' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: '900', color: 'hsl(214 80% 44%)', lineHeight: 1 }}>{value}</div>
                                        <div style={{ fontSize: '0.63rem', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', marginTop: '0.25rem' }}>{label}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    PLAN DISTRIBUTION
                ══════════════════════════════════════════════════════════════ */}
                <div style={{ marginBottom: '1.75rem' }}>
                    <SectionHead title="Agent Plan Distribution" accent="hsl(270 55% 50%)" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.875rem' }}>
                        <Kpi label="Free Plan"  value={fmtNum(pd.free)}  accent="hsl(220 25% 30%)"  iconBg="hsl(220 15% 93%)"  iconColor="hsl(220 25% 40%)"  icon={Icons.agent} bar="hsl(220 25% 50%)" />
                        <Kpi label="Pro Plan"   value={fmtNum(pd.pro)}   accent="hsl(270 55% 40%)"  iconBg="hsl(270 60% 95%)"  iconColor="hsl(270 55% 45%)"  icon={Icons.agent} bar="hsl(270 55% 50%)" />
                        <Kpi label="Elite Plan" value={fmtNum(pd.elite)} accent="hsl(40 80% 36%)"   iconBg="hsl(40 90% 93%)"   iconColor="hsl(40 80% 40%)"   icon={Icons.star}  bar="hsl(40 80% 48%)" />
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    TOP AGENTS
                ══════════════════════════════════════════════════════════════ */}
                <div style={{ marginBottom: '1.75rem' }}>
                    <SectionHead title="Agent Performance" accent="hsl(40 80% 48%)" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                        <Card>
                            <CardHead title="Top Agents by Listings" accent="hsl(214 80% 50%)" />
                            {topByListings.length > 0
                                ? topByListings.map((a, i) => (
                                    <AgentPerfRow key={i} agent={a} rank={i + 1} valueKey="rentals_count" valueSub="listings" accentColor="hsl(214 80% 44%)" />
                                ))
                                : <Empty emoji="🏢" msg="No agent data" />
                            }
                        </Card>

                        <Card>
                            <CardHead title="Top Agents by Views" accent="hsl(152 55% 42%)" />
                            {topByViews.length > 0
                                ? topByViews.map((a, i) => (
                                    <AgentPerfRow key={i} agent={a} rank={i + 1} valueKey="total_views" valueSub="views" accentColor="hsl(152 55% 33%)" />
                                ))
                                : <Empty emoji="👁" msg="No view data" />
                            }
                        </Card>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    LOCATION INSIGHTS
                ══════════════════════════════════════════════════════════════ */}
                <div style={{ marginBottom: '1.75rem' }}>
                    <SectionHead title="Location Insights" accent="hsl(200 65% 44%)" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                        <Card>
                            <CardHead title="Top Locations by Listings" accent="hsl(214 80% 50%)" />
                            {topLocByList.length > 0
                                ? topLocByList.map((l, i) => (
                                    <LocationRow key={i} location={l.area} rank={i + 1} value={l.total ?? 0} valueSub="listings" accentColor="hsl(214 80% 44%)" max={maxLocListings} />
                                ))
                                : <Empty emoji="📍" msg="No location data" />
                            }
                        </Card>

                        <Card>
                            <CardHead title="Top Locations by Demand" accent="hsl(270 55% 50%)" />
                            {topLocByDem.length > 0
                                ? topLocByDem.map((l, i) => (
                                    <LocationRow key={i} location={l.area} rank={i + 1} value={l.total_views ?? 0} valueSub="views" accentColor="hsl(270 55% 44%)" max={maxLocViews} />
                                ))
                                : <Empty emoji="📍" msg="No demand data" />
                            }
                        </Card>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    LISTING PERFORMANCE
                ══════════════════════════════════════════════════════════════ */}
                <div style={{ marginBottom: '1.75rem' }}>
                    <SectionHead title="Listing Performance" accent="hsl(152 55% 42%)" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                        <Card>
                            <CardHead title="Most Viewed Listings" accent="hsl(214 80% 50%)" />
                            <TableHead cols={[
                                { label: 'Listing',   width: 'minmax(0,1fr)' },
                                { label: 'Type',      width: '5rem' },
                                { label: 'Location',  width: '9rem' },
                                { label: 'Views',     width: '5.5rem', right: true },
                            ]} />
                            {mostViewed.length > 0
                                ? mostViewed.map((l, i) => <ListingTableRow key={i} listing={l} valueKey="views" valueSub="views" />)
                                : <Empty emoji="👁" msg="No view data" />
                            }
                        </Card>

                        <Card>
                            <CardHead title="Most Inquiries" accent="hsl(200 65% 44%)" />
                            <TableHead cols={[
                                { label: 'Listing',    width: 'minmax(0,1fr)' },
                                { label: 'Type',       width: '5rem' },
                                { label: 'Location',   width: '9rem' },
                                { label: 'Inquiries',  width: '5.5rem', right: true },
                            ]} />
                            {mostInquiries.length > 0
                                ? mostInquiries.map((l, i) => <ListingTableRow key={i} listing={l} valueKey="inquiries_count" valueSub="inquiries" />)
                                : <Empty emoji="💬" msg="No inquiry data" />
                            }
                        </Card>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    ZERO ENGAGEMENT
                ══════════════════════════════════════════════════════════════ */}
                {zeroEngage.length > 0 && (
                    <div style={{ marginBottom: '1.75rem' }}>
                        <SectionHead title="Zero Engagement" accent="hsl(40 80% 48%)" />
                        <Card>
                            <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid hsl(220 15% 94%)', backgroundColor: 'hsl(40 80% 98%)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <Icons.alert />
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800', color: 'hsl(40 80% 28%)' }}>Listings with no views or inquiries</p>
                                    <p style={{ margin: '0.1rem 0 0', fontSize: '0.68rem', color: 'hsl(40 60% 44%)' }}>These may need attention or removal</p>
                                </div>
                            </div>
                            <TableHead cols={[
                                { label: 'Listing',  width: 'minmax(0,1fr)' },
                                { label: 'Location', width: '10rem' },
                                { label: 'Created',  width: '8rem', right: true },
                            ]} />
                            {zeroEngage.slice(0, 10).map((l, i) => (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 10rem 8rem', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1.25rem', borderBottom: '1px solid hsl(220 15% 96%)', transition: 'background-color 0.12s' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 98.5%)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: '700', color: 'hsl(220 25% 14%)' }}>{l.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'hsl(220 15% 50%)' }}>{l.area || '—'}</div>
                                    <div style={{ fontSize: '0.73rem', fontWeight: '600', color: 'hsl(220 25% 35%)', textAlign: 'right' }}>{fmtDate(l.created_at)}</div>
                                </div>
                            ))}
                            {zeroEngage.length > 10 && (
                                <div style={{ padding: '0.75rem 1.25rem', textAlign: 'center', fontSize: '0.75rem', color: 'hsl(220 15% 52%)', fontWeight: '600', borderTop: '1px solid hsl(220 15% 94%)' }}>
                                    + {zeroEngage.length - 10} more listings
                                </div>
                            )}
                        </Card>
                    </div>
                )}
            </div>

            <style>{`
                input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
            `}</style>
        </>
    );
};

Reports.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default Reports;