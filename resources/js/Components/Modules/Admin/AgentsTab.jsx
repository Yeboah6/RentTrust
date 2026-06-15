import { useState } from 'react';
import { Home, Gift } from 'lucide-react';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = '1rem', sw = 1.8 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    user:       <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    mail:       <Ico d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    phone:      <Ico d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
    building:   <Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    mapPin:     <Ico d={['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z','M15 11a3 3 0 11-6 0 3 3 0 016 0z']} />,
    calendar:   <Ico d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    clock:      <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    shield:     <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    star:       <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    search:     <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    users:      <Ico d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    plus:       <Ico d="M12 4v16m8-8H4" />,
    edit:       <Ico d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />,
    eye:        <Ico d={['M15 12a3 3 0 11-6 0 3 3 0 016 0z','M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z']} />,
    upgrade:    <Ico d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    suspend:    <Ico d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />,
    check:      <Ico d="M5 13l4 4L19 7" />,
    empty:      <Ico d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" size="2.5rem" sw={1.2} />,
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const config = {
        verified:   { bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 35%)',  icon: Icons.shield, label: 'Verified' },
        pending:    { bg: 'hsl(38 92% 93%)',   color: 'hsl(38 92% 40%)',   icon: Icons.clock,  label: 'Pending' },
        unverified: { bg: 'hsl(220 15% 93%)',  color: 'hsl(220 15% 45%)',  icon: Icons.clock,  label: 'Unverified' },
        suspended:  { bg: 'hsl(0 72% 93%)',    color: 'hsl(0 72% 45%)',    icon: Icons.suspend, label: 'Suspended' },
    };
    const cfg = config[status] || config.unverified;
    
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.28rem',
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
    if (!plan) return null;
    
    const config = {
        free:      { bg: 'hsl(220 15% 93%)',  color: 'hsl(220 25% 45%)' },
        basic:     { bg: 'hsl(174 40% 93%)',  color: 'hsl(174 62% 35%)' },
        premium:   { bg: 'hsl(271 50% 93%)',  color: 'hsl(271 60% 45%)' },
        enterprise:{ bg: 'hsl(214 60% 93%)',  color: 'hsl(214 70% 42%)' },
    };
    const cfg = config[plan] || config.free;
    
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.2rem 0.6rem', borderRadius: 999,
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
            backgroundColor: cfg.bg, color: cfg.color, flexShrink: 0,
        }}>
            <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" size="0.65rem" />
            {plan.charAt(0).toUpperCase() + plan.slice(1)}
        </span>
    );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const initial = (name) => (name || 'A').charAt(0).toUpperCase();
const hue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
const fmtDate = (v) => {
    if (!v) return '—';
    return new Date(v).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ─── Single Agent Card ────────────────────────────────────────────────────────
const AgentCard = ({ agent, onViewDetails, onEdit, onVerify, onSuspend, onUpgrade, onResendInvite }) => {
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
            {/* Status colour strip */}
            <div style={{ 
                height: 3, 
                backgroundColor: agent.status === 'verified' ? 'hsl(152 60% 40%)' 
                    : agent.status === 'suspended' ? 'hsl(0 72% 48%)' 
                    : 'hsl(38 92% 50%)',
                opacity: 0.7 
            }} />

            {/* Card body */}
            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                
                {/* Agent header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{
                        width: '2.75rem', height: '2.75rem', borderRadius: '0.625rem', flexShrink: 0,
                        backgroundColor: `hsl(${hue(agent.name)} 45% 90%)`,
                        color: `hsl(${hue(agent.name)} 45% 30%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem', fontWeight: 800,
                    }}>
                        {initial(agent.name)}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                            <h3 style={{ 
                                margin: 0, fontSize: '0.85rem', fontWeight: 800, 
                                color: 'hsl(220 25% 12%)', letterSpacing: '-0.01em',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                                {agent.name}
                            </h3>
                            <StatusBadge status={agent.status} />
                        </div>
                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.72rem', color: 'hsl(220 15% 50%)', display: 'flex', alignItems: 'center', gap: '0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {Icons.mail}{agent.email}
                        </p>
                    </div>
                    <PlanBadge plan={agent.package || 'free'} />
                </div>

                {/* Divider */}
                <div style={{ height: 1, backgroundColor: 'hsl(220 15% 94%)' }} />

                {/* Agent details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.72rem', color: 'hsl(220 15% 50%)' }}>
                    {agent.company && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {Icons.building}
                            <span>{agent.company}</span>
                        </div>
                    )}
                    {agent.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {Icons.mapPin}
                            <span>{agent.location}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {Icons.calendar}
                        <span>Joined {fmtDate(agent.created_at)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {Icons.clock}
                        <span>
                            {agent.last_active 
                                ? `Active ${fmtDate(agent.last_active)}` 
                                : 'Not active yet'}
                        </span>
                    </div>
                </div>

                {/* Stats row */}
                <div style={{ 
                    display: 'flex', gap: '0.75rem', padding: '0.5rem 0.65rem',
                    backgroundColor: 'hsl(220 15% 97%)', borderRadius: '0.5rem',
                    border: '1px solid hsl(220 15% 93%)',
                }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'hsl(220 25% 15%)' }}>
                            {agent.rentals_count ?? agent.total_listings ?? 0}
                        </p>
                        <p style={{ margin: '0.1rem 0 0', fontSize: '0.62rem', color: 'hsl(220 15% 52%)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                            Listings
                        </p>
                    </div>
                    <div style={{ width: 1, backgroundColor: 'hsl(220 15% 91%)', flexShrink: 0 }} />
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'hsl(220 25% 15%)' }}>
                            {agent.total_reviews ?? 0}
                        </p>
                        <p style={{ margin: '0.1rem 0 0', fontSize: '0.62rem', color: 'hsl(220 15% 52%)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                            Reviews
                        </p>
                    </div>
                </div>
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
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                        border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                        color: 'hsl(174 62% 30%)', fontSize: '0.7rem', fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(174 62% 40%)'; e.currentTarget.style.backgroundColor = 'hsl(174 40% 97%)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'; e.currentTarget.style.backgroundColor = 'white'; }}
                >
                    {Icons.eye} View
                </button>

                <button
                    onClick={() => onEdit?.(agent)}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                        border: '1px solid hsl(214 80% 75%)', backgroundColor: 'white',
                        color: 'hsl(214 80% 48%)', fontSize: '0.7rem', fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(214 80% 55%)'; e.currentTarget.style.backgroundColor = 'hsl(214 100% 97%)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(214 80% 75%)'; e.currentTarget.style.backgroundColor = 'white'; }}
                >
                    {Icons.edit} Edit
                </button>

                {/* {agent.status === 'pending' && ( */}
                    <button
                        onClick={() => onResendInvite?.(agent)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                            border: '1px solid hsl(38 92% 70%)', backgroundColor: 'white',
                            color: 'hsl(38 92% 40%)', fontSize: '0.7rem', fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(38 92% 50%)'; e.currentTarget.style.backgroundColor = 'hsl(38 92% 97%)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(38 92% 70%)'; e.currentTarget.style.backgroundColor = 'white'; }}
                    >
                        {Icons.mail} Invite
                    </button>
                {/* // )} */}

                {(agent.status === 'unverified' || agent.status === 'pending') && (
                    <button
                        onClick={() => onVerify?.(agent.id)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                            border: 'none', backgroundColor: 'hsl(152 60% 40%)',
                            color: 'white', fontSize: '0.7rem', fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsl(152 60% 35%)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'hsl(152 60% 40%)'; }}
                    >
                        {Icons.check} Verify
                    </button>
                )}

                {agent.status === 'verified' && (
                    <button
                        onClick={() => onSuspend?.(agent.id)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                            border: '1px solid hsl(0 72% 70%)', backgroundColor: 'white',
                            color: 'hsl(0 72% 48%)', fontSize: '0.7rem', fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(0 72% 50%)'; e.currentTarget.style.backgroundColor = 'hsl(0 72% 97%)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(0 72% 70%)'; e.currentTarget.style.backgroundColor = 'white'; }}
                    >
                        {Icons.suspend} Suspend
                    </button>
                )}

                {agent.status === 'suspended' && (
                    <button
                        onClick={() => onSuspend?.(agent.id)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                            border: 'none', backgroundColor: 'hsl(152 60% 40%)',
                            color: 'white', fontSize: '0.7rem', fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsl(152 60% 35%)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'hsl(152 60% 40%)'; }}
                    >
                        {Icons.check} Unsuspend
                    </button>
                )}

                {onUpgrade && (
                    <button
                        onClick={() => onUpgrade?.(agent)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                            border: '1px solid hsl(271 60% 70%)', backgroundColor: 'white',
                            color: 'hsl(271 60% 45%)', fontSize: '0.7rem', fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(271 60% 50%)'; e.currentTarget.style.backgroundColor = 'hsl(271 60% 97%)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(271 60% 70%)'; e.currentTarget.style.backgroundColor = 'white'; }}
                    >
                        {Icons.upgrade} Upgrade
                    </button>
                )}
            </div>
        </div>
    );
};

// ─── Agents Tab Module ─────────────────────────────────────────────────────────
const AgentsTab = ({ 
    agents = [], 
    onAddAgent,
    onViewDetails,
    onEdit,
    onVerify,
    onSuspend,
    onUpgrade,
    onResendInvite,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredAgents = agents.filter(agent => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
            agent.name?.toLowerCase().includes(q) ||
            agent.email?.toLowerCase().includes(q) ||
            agent.company?.toLowerCase().includes(q) ||
            agent.status?.toLowerCase().includes(q)
        );
    });

    const total    = agents.length;
    const verified = agents.filter(a => a.status === 'verified').length;
    const pending  = agents.filter(a => a.status === 'pending').length;
    const suspended = agents.filter(a => a.status === 'suspended').length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Section heading + actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 3, height: '1.2rem', borderRadius: 999, backgroundColor: 'hsl(174 62% 32%)', flexShrink: 0 }} />
                    <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'hsl(220 25% 12%)', letterSpacing: '-0.01em' }}>
                        Platform Agents
                    </h2>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.18rem 0.6rem', borderRadius: 999, backgroundColor: 'hsl(220 15% 93%)', color: 'hsl(220 25% 35%)' }}>
                        {total}
                    </span>
                </div>

                {/* Status pills + Add button */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {total > 0 && (
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {[
                                { label: 'Verified',  val: verified,  ...StatusBadge({ status: 'verified' }) },
                                { label: 'Pending',   val: pending,   ...StatusBadge({ status: 'pending' }) },
                                { label: 'Suspended', val: suspended, ...StatusBadge({ status: 'suspended' }) },
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
                    
                    <button
                        onClick={onAddAgent}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                            padding: '0.5rem 1rem', borderRadius: '0.5rem',
                            border: 'none', backgroundColor: 'hsl(174 62% 32%)',
                            color: 'white', fontSize: '0.75rem', fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'inherit',
                            transition: 'background-color 0.15s',
                            whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(174 62% 28%)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)'}
                    >
                        {Icons.plus} Add Agent
                    </button>
                </div>
            </div>

            {/* Search bar */}
            <div style={{ position: 'relative' }}>
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search agents by name, email, company..."
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
                    onFocus={e => e.currentTarget.style.borderColor = 'hsl(174 62% 40%)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'}
                />
            </div>

            {/* Grid or empty state */}
            {filteredAgents.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.875rem',
                }}>
                    {filteredAgents.map(agent => (
                        <AgentCard
                            key={agent.id}
                            agent={agent}
                            onViewDetails={onViewDetails}
                            onEdit={onEdit}
                            onVerify={onVerify}
                            onSuspend={onSuspend}
                            onUpgrade={onUpgrade}
                            onResendInvite={onResendInvite}
                        />
                    ))}
                </div>
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
                        {searchTerm ? 'No Agents Found' : 'No Agents Yet'}
                    </h3>
                    <p style={{ color: 'hsl(220 15% 52%)', fontSize: '0.82rem', margin: '0 0 1.25rem' }}>
                        {searchTerm 
                            ? `No agents match "${searchTerm}". Try a different search.` 
                            : 'There are no agents on the platform yet. Add your first agent to get started.'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={onAddAgent}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                padding: '0.55rem 1.1rem', borderRadius: '0.5rem',
                                border: 'none', backgroundColor: 'hsl(174 62% 32%)',
                                color: 'white', fontSize: '0.78rem', fontWeight: 700,
                                cursor: 'pointer', fontFamily: 'inherit',
                                transition: 'background-color 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(174 62% 28%)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)'}
                        >
                            {Icons.plus} Add First Agent
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AgentsTab;