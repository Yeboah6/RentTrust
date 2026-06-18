import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = '1rem', sw = 1.8 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    credit:     <Ico d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
    search:     <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    user:       <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    calendar:   <Ico d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    mail:       <Ico d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    check:      <Ico d="M5 13l4 4L19 7" />,
    x:          <Ico d="M6 18L18 6M6 6l12 12" />,
    clock:      <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    shield:     <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    star:       <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    trending:   <Ico d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    dollar:     <Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    chevronLeft:  <Ico d="M15 19l-7-7 7-7" />,
    chevronRight: <Ico d="M9 5l7 7-7 7" />,
    empty:      <Ico d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" size="2.5rem" sw={1.2} />,
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const config = {
        active:    { bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 35%)', icon: Icons.check, label: 'Active' },
        pending:   { bg: 'hsl(38 92% 93%)',   color: 'hsl(38 92% 40%)',  icon: Icons.clock, label: 'Pending' },
        cancelled: { bg: 'hsl(0 72% 93%)',    color: 'hsl(0 72% 45%)',   icon: Icons.x,     label: 'Cancelled' },
        expired:   { bg: 'hsl(220 15% 93%)',  color: 'hsl(220 15% 45%)', icon: Icons.clock, label: 'Expired' },
        grace:     { bg: 'hsl(38 92% 93%)',   color: 'hsl(38 92% 40%)',  icon: Icons.clock, label: 'Grace Period' },
    };
    const cfg = config[status] || config.pending;
    
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

// ─── Plan Badge ───────────────────────────────────────────────────────────────
const PlanBadge = ({ plan }) => {
    const config = {
        pro:       { bg: 'hsl(271 50% 93%)',  color: 'hsl(271 60% 45%)' },
        verified:  { bg: 'hsl(214 60% 93%)',  color: 'hsl(214 70% 42%)' },
        elite:     { bg: 'hsl(38 92% 93%)',   color: 'hsl(38 92% 40%)' },
        free:      { bg: 'hsl(220 15% 93%)',  color: 'hsl(220 25% 45%)' },
    };
    const cfg = config[plan] || config.free;
    
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.2rem 0.6rem', borderRadius: 999,
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
            backgroundColor: cfg.bg, color: cfg.color,
        }}>
            {Icons.star} {plan?.charAt(0).toUpperCase() + plan?.slice(1) || 'Free'}
        </span>
    );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.25rem', padding: '1rem 0',
        }}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '2rem', height: '2rem', borderRadius: '0.375rem',
                    border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                    color: currentPage === 1 ? 'hsl(220 15% 70%)' : 'hsl(220 25% 35%)',
                    cursor: currentPage === 1 ? 'default' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1,
                    transition: 'all 0.12s',
                }}
            >
                {Icons.chevronLeft}
            </button>

            {start > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '2rem', height: '2rem', borderRadius: '0.375rem',
                            border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                            color: 'hsl(220 25% 35%)', fontSize: '0.75rem', fontWeight: 600,
                            cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        1
                    </button>
                    {start > 2 && (
                        <span style={{ color: 'hsl(220 15% 60%)', fontSize: '0.75rem', padding: '0 0.25rem' }}>
                            ...
                        </span>
                    )}
                </>
            )}

            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '2rem', height: '2rem', borderRadius: '0.375rem',
                        border: page === currentPage ? 'none' : '1px solid hsl(220 15% 88%)',
                        backgroundColor: page === currentPage ? 'hsl(174 62% 32%)' : 'white',
                        color: page === currentPage ? 'white' : 'hsl(220 25% 35%)',
                        fontSize: '0.75rem', fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => {
                        if (page !== currentPage) {
                            e.currentTarget.style.backgroundColor = 'hsl(220 15% 95%)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (page !== currentPage) {
                            e.currentTarget.style.backgroundColor = 'white';
                        }
                    }}
                >
                    {page}
                </button>
            ))}

            {end < totalPages && (
                <>
                    {end < totalPages - 1 && (
                        <span style={{ color: 'hsl(220 15% 60%)', fontSize: '0.75rem', padding: '0 0.25rem' }}>
                            ...
                        </span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '2rem', height: '2rem', borderRadius: '0.375rem',
                            border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                            color: 'hsl(220 25% 35%)', fontSize: '0.75rem', fontWeight: 600,
                            cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '2rem', height: '2rem', borderRadius: '0.375rem',
                    border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                    color: currentPage === totalPages ? 'hsl(220 15% 70%)' : 'hsl(220 25% 35%)',
                    cursor: currentPage === totalPages ? 'default' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    transition: 'all 0.12s',
                }}
            >
                {Icons.chevronRight}
            </button>
        </div>
    );
};

const ITEMS_PER_PAGE = 9;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const initial = (name) => (name || 'A').charAt(0).toUpperCase();
const hue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
const fmtDate = (v) => {
    if (!v) return '—';
    return new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
const fmtCurrency = (amount, currency = 'GHS') => {
    return `${currency === 'GHS' ? 'GH₵' : '$'}${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// ─── Single Subscription Card ────────────────────────────────────────────────
const SubscriptionCard = ({ agent, onViewDetails, onUpgrade }) => {
    const sub = agent.subscription;
    const hasActiveSub = sub && sub.status === 'active';
    const isFree = !agent.package || agent.package === 'free';

    return (
        <div style={{
            backgroundColor: 'white',
            border: '1px solid hsl(220 15% 91%)',
            borderRadius: '0.875rem',
            overflow: 'hidden',
            boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)',
            display: 'flex', flexDirection: 'column',
            transition: 'box-shadow 0.15s',
        }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px hsl(220 20% 15% / 0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px hsl(220 20% 15% / 0.04)'}
        >
            {/* Plan colour strip */}
            <div style={{ 
                height: 3, 
                backgroundColor: isFree ? 'hsl(220 15% 60%)' 
                    : hasActiveSub ? 'hsl(152 60% 40%)' 
                    : 'hsl(38 92% 50%)',
                opacity: 0.7 
            }} />

            {/* Card body */}
            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                
                {/* Agent header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <div style={{
                        width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', flexShrink: 0,
                        backgroundColor: `hsl(${hue(agent.name)} 45% 90%)`,
                        color: `hsl(${hue(agent.name)} 45% 30%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.9rem', fontWeight: 800,
                    }}>
                        {initial(agent.name)}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                            <h3 style={{ 
                                margin: 0, fontSize: '0.82rem', fontWeight: 700, 
                                color: 'hsl(220 25% 12%)', overflow: 'hidden', 
                                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                                {agent.name}
                            </h3>
                            <PlanBadge plan={agent.package || 'free'} />
                        </div>
                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.68rem', color: 'hsl(220 15% 50%)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            {Icons.mail} {agent.email}
                        </p>
                    </div>
                </div>

                {/* Subscription details */}
                {sub ? (
                    <div style={{
                        padding: '0.75rem',
                        backgroundColor: 'hsl(220 15% 97%)',
                        borderRadius: '0.5rem',
                        border: '1px solid hsl(220 15% 93%)',
                        display: 'flex', flexDirection: 'column', gap: '0.5rem',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.68rem', color: 'hsl(220 15% 50%)', fontWeight: 600 }}>
                                Plan
                            </span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'hsl(220 25% 15%)' }}>
                                {sub.plan_name || 'Unknown'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.68rem', color: 'hsl(220 15% 50%)', fontWeight: 600 }}>
                                Status
                            </span>
                            <StatusBadge status={sub.status} />
                        </div>
                        {sub.starts_at && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.68rem', color: 'hsl(220 15% 50%)', fontWeight: 600 }}>
                                    Started
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'hsl(220 25% 15%)', fontWeight: 600 }}>
                                    {fmtDate(sub.starts_at)}
                                </span>
                            </div>
                        )}
                        {sub.ends_at && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.68rem', color: 'hsl(220 15% 50%)', fontWeight: 600 }}>
                                    Expires
                                </span>
                                <span style={{ 
                                    fontSize: '0.7rem', fontWeight: 600,
                                    color: sub.days_left !== null && sub.days_left <= 7 ? 'hsl(0 72% 48%)' : 'hsl(220 25% 15%)',
                                }}>
                                    {fmtDate(sub.ends_at)}
                                    {sub.days_left !== null && (
                                        <span style={{ marginLeft: '0.35rem', fontSize: '0.65rem' }}>
                                            ({sub.days_left}d left)
                                        </span>
                                    )}
                                </span>
                            </div>
                        )}
                        {sub.plan_price > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.68rem', color: 'hsl(220 15% 50%)', fontWeight: 600 }}>
                                    Price
                                </span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'hsl(174 62% 32%)' }}>
                                    {fmtCurrency(sub.plan_price, 'GHS')}/mo
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{
                        padding: '0.75rem',
                        backgroundColor: 'hsl(40 33% 97%)',
                        borderRadius: '0.5rem',
                        border: '1px solid hsl(40 25% 90%)',
                        textAlign: 'center',
                    }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(220 15% 50%)', fontWeight: 600 }}>
                            No active subscription
                        </p>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.68rem', color: 'hsl(220 15% 55%)' }}>
                            Free plan
                        </p>
                    </div>
                )}

                {/* Features list */}
                {sub && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {sub.verified_badge && (
                            <span style={{ 
                                padding: '0.15rem 0.4rem', fontSize: '0.62rem', fontWeight: 700,
                                backgroundColor: 'hsl(152 60% 93%)', color: 'hsl(152 60% 35%)',
                                borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: '0.15rem',
                            }}>
                                {Icons.shield} Verified
                            </span>
                        )}
                        {sub.priority_ranking && (
                            <span style={{ 
                                padding: '0.15rem 0.4rem', fontSize: '0.62rem', fontWeight: 700,
                                backgroundColor: 'hsl(38 92% 93%)', color: 'hsl(38 92% 40%)',
                                borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: '0.15rem',
                            }}>
                                {Icons.trending} Priority
                            </span>
                        )}
                        {sub.analytics_access && (
                            <span style={{ 
                                padding: '0.15rem 0.4rem', fontSize: '0.62rem', fontWeight: 700,
                                backgroundColor: 'hsl(214 60% 93%)', color: 'hsl(214 70% 42%)',
                                borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: '0.15rem',
                            }}>
                                {Icons.trending} Analytics
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Footer actions */}
            <div style={{ 
                borderTop: '1px solid hsl(220 15% 93%)', 
                padding: '0.6rem 1rem', 
                backgroundColor: 'hsl(220 15% 98.5%)',
                display: 'flex', gap: '0.4rem', flexWrap: 'wrap',
            }}>
                <button
                    onClick={() => onViewDetails?.(agent)}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                        padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                        border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                        color: 'hsl(174 62% 30%)', fontSize: '0.7rem', fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(174 62% 40%)'; e.currentTarget.style.backgroundColor = 'hsl(174 40% 97%)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'; e.currentTarget.style.backgroundColor = 'white'; }}
                >
                    {Icons.user} View Agent
                </button>
                <button
                    onClick={() => onUpgrade?.(agent)}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                        padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                        border: 'none', backgroundColor: 'hsl(271 60% 50%)',
                        color: 'white', fontSize: '0.7rem', fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                        marginLeft: 'auto',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(271 60% 45%)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(271 60% 50%)'}
                >
                    {Icons.trending} Upgrade
                </button>
            </div>
        </div>
    );
};

// ─── Subscriptions Tab Module ─────────────────────────────────────────────────
const SubscriptionsTab = ({ agents = [], onViewAgent, onUpgrade }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [planFilter, setPlanFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    
    const filteredAgents = useMemo(() => {
        return agents.filter(agent => {
            const q = searchTerm.toLowerCase();
            const matchesSearch = !q || [
                agent.name,
                agent.email,
                agent.package,
                agent.subscription?.plan_name,
                agent.subscription?.status,
            ].filter(Boolean).some(value => value?.toString().toLowerCase().includes(q));
            
            const matchesPlan = planFilter === 'all' || (agent.package || 'free') === planFilter;
            return matchesSearch && matchesPlan;
        });
    }, [agents, searchTerm, planFilter]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePlanFilterChange = (e) => {
        setPlanFilter(e.target.value);
        setCurrentPage(1);
    };

    const total = agents.length;
    const filteredTotal = filteredAgents.length;
    const activeSubs = agents.filter(a => a.subscription?.status === 'active').length;
    const freePlan = agents.filter(a => !a.package || a.package === 'free').length;
    const proPlan = agents.filter(a => a.package === 'pro').length;
    const gracePeriod = agents.filter(a => a.subscription?.status === 'grace').length;

    // Pagination
    const totalPages = Math.ceil(filteredTotal / ITEMS_PER_PAGE);
    const paginatedAgents = filteredAgents.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Section heading + stats */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 3, height: '1.2rem', borderRadius: 999, backgroundColor: 'hsl(271 60% 50%)', flexShrink: 0 }} />
                    <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'hsl(220 25% 12%)', letterSpacing: '-0.01em' }}>
                        Agent Subscriptions
                    </h2>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.18rem 0.6rem', borderRadius: 999, backgroundColor: 'hsl(220 15% 93%)', color: 'hsl(220 25% 35%)' }}>
                        {total}
                    </span>
                </div>

                {/* Stats pills */}
                {total > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {[
                            { label: 'Active',   val: activeSubs,  icon: Icons.check,    bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 35%)' },
                            { label: 'Pro',      val: proPlan,     icon: Icons.star,     bg: 'hsl(271 50% 93%)',  color: 'hsl(271 60% 45%)' },
                            { label: 'Free',     val: freePlan,    icon: Icons.dollar,   bg: 'hsl(220 15% 93%)',  color: 'hsl(220 25% 45%)' },
                            { label: 'Grace',    val: gracePeriod, icon: Icons.clock,    bg: 'hsl(38 92% 93%)',   color: 'hsl(38 92% 40%)' },
                        ].filter(t => t.val > 0).map(t => (
                            <span key={t.label} style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '0.28rem',
                                padding: '0.2rem 0.6rem', borderRadius: 999,
                                fontSize: '0.68rem', fontWeight: 700,
                                backgroundColor: t.bg, color: t.color,
                            }}>
                                {t.icon}{t.val} {t.label}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Search + Filter */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1 1 260px' }}>
                    <div style={{ 
                        position: 'absolute', left: '0.75rem', top: '50%', 
                        transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)',
                        display: 'flex',
                    }}>
                        {Icons.search}
                    </div>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by agent name, email, plan..."
                        style={{
                            width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem',
                            borderRadius: '0.625rem',
                            border: '1px solid hsl(220 15% 88%)',
                            backgroundColor: 'white',
                            fontSize: '0.8rem', color: 'hsl(220 25% 15%)',
                            fontFamily: 'inherit',
                            outline: 'none',
                            transition: 'border-color 0.15s',
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = 'hsl(271 60% 50%)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'}
                    />
                </div>
                <select
                    value={planFilter}
                    onChange={handlePlanFilterChange}
                    style={{
                        padding: '0.65rem 1rem', borderRadius: '0.625rem',
                        border: '1px solid hsl(220 15% 88%)',
                        backgroundColor: 'white',
                        fontSize: '0.8rem', color: 'hsl(220 25% 15%)',
                        fontFamily: 'inherit', minWidth: '150px',
                        outline: 'none', cursor: 'pointer',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'hsl(271 60% 50%)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'}
                >
                    <option value="all">All plans</option>
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="elite">Elite</option>
                </select>
            </div>

            {/* Results info */}
            {filteredTotal > 0 && (
                <div style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: '0.72rem', color: 'hsl(220 15% 50%)', fontWeight: 500,
                }}>
                    <span>
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredTotal)} of {filteredTotal} agent{filteredTotal !== 1 ? 's' : ''}
                    </span>
                </div>
            )}

            {/* Grid or empty state */}
            {filteredTotal > 0 ? (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.875rem',
                    }}>
                        {paginatedAgents.map(agent => (
                            <SubscriptionCard
                                key={agent.id}
                                agent={agent}
                                onViewDetails={onViewAgent}
                                onUpgrade={onUpgrade}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            ) : (
                <div style={{
                    backgroundColor: 'white', 
                    border: '1px solid hsl(220 15% 91%)',
                    borderRadius: '0.875rem', 
                    padding: '3rem', 
                    textAlign: 'center',
                    boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)',
                }}>
                    <div style={{ 
                        color: 'hsl(220 15% 68%)', 
                        margin: '0 auto 1rem', 
                        display: 'flex', 
                        justifyContent: 'center' 
                    }}>
                        {Icons.empty}
                    </div>
                    <h3 style={{ 
                        fontSize: '0.95rem', fontWeight: 800, 
                        color: 'hsl(220 25% 15%)', margin: '0 0 0.35rem' 
                    }}>
                        {searchTerm || planFilter !== 'all' ? 'No Agents Found' : 'No Agents Yet'}
                    </h3>
                    <p style={{ color: 'hsl(220 15% 52%)', fontSize: '0.82rem', margin: 0 }}>
                        {searchTerm || planFilter !== 'all'
                            ? 'No agents match your search criteria.'
                            : 'There are no agents on the platform yet.'}
                    </p>
                </div>
            )}

            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default SubscriptionsTab;