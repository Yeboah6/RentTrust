import React, { useState, useRef, useMemo } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { useRefresh } from '@/Hooks/useRefresh';

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = ({ d, size = '1rem', sw = 1.8 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    search:   () => <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    eye:      () => <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} size="0.85rem" />,
    edit:     () => <Ico d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" size="0.85rem" />,
    trash:    () => <Ico d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" size="0.85rem" />,
    check:    () => <Ico d="M5 13l4 4L19 7" size="0.85rem" />,
    x:        () => <Ico d="M6 18L18 6M6 6l12 12" size="0.85rem" />,
    refresh:  () => <Ico d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" size="0.9rem" />,
    ban:      () => <Ico d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" size="0.85rem" />,
    userPlus: () => <Ico d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" size="0.85rem" />,
    users:    () => <Ico d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" size="1.15rem" />,
    building: () => <Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" size="1.15rem" />,
    star:     () => <Ico d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" size="1.15rem" />,
    shield:   () => <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" size="1.15rem" />,
    alert:    () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    impersonate: () => <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} size="0.8rem" />,
    mail:     () => <Ico d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" size="0.8rem" />,
    chevD:    () => <Ico d="M19 9l-7 7-7-7" size="0.8rem" />,
    chevU:    () => <Ico d="M5 15l7-7 7 7" size="0.8rem" />,
    chevL:    () => <Ico d="M15 19l-7-7 7-7" size="0.8rem" />,
    chevR:    () => <Ico d="M9 5l7 7-7 7" size="0.8rem" />,
    spinner:  () => (
        <svg style={{ width: '0.95rem', height: '0.95rem', animation: 'agSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
    active:   { label: 'Active',   bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 28%)', dot: 'hsl(152 60% 38%)' },
    pending:  { label: 'Pending',  bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 30%)',  dot: 'hsl(40 80% 44%)' },
    verified: { label: 'Verified', bg: 'hsl(214 100% 95%)',color: 'hsl(214 80% 38%)', dot: 'hsl(214 80% 50%)' },
    suspended:{ label: 'Suspended',bg: 'hsl(0 70% 95%)',   color: 'hsl(0 65% 40%)',   dot: 'hsl(0 65% 50%)' },
    rejected: { label: 'Rejected', bg: 'hsl(0 70% 95%)',   color: 'hsl(0 65% 40%)',   dot: 'hsl(0 65% 50%)' },
    inactive: { label: 'Inactive', bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)' },
};

const TIER_CFG = {
    premium:  { label: 'Premium',  bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 30%)',  dot: 'hsl(40 80% 44%)'  },
    standard: { label: 'Standard', bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)' },
    basic:    { label: 'Basic',    bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)' },
    pro:      { label: 'Pro',      bg: 'hsl(270 60% 95%)', color: 'hsl(270 55% 38%)', dot: 'hsl(270 55% 50%)' },
};

const STATUSES = ['all', 'active', 'pending', 'verified', 'suspended', 'rejected', 'inactive'];
const PAGE_SIZE = 12;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return v; }
};

const fmtRelative = (v) => {
    if (!v) return '—';
    try {
        const diff = Date.now() - new Date(v);
        if (diff < 60000)       return 'Just now';
        if (diff < 3600000)     return `${Math.floor(diff/60000)}m ago`;
        if (diff < 86400000)    return `${Math.floor(diff/3600000)}h ago`;
        if (diff < 2592000000)  return `${Math.floor(diff/86400000)}d ago`;
        return fmtDate(v);
    } catch { return v; }
};

const avatarHue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

const normalise = (a) => ({
    ...a,
    _id:           a.id,
    name:          a.name          ?? a.full_name      ?? '—',
    email:         a.email         ?? '',
    phone:         a.phone         ?? a.phone_number   ?? '',
    status_key:    (a.status       ?? 'pending').toLowerCase(),
    tier:          (a.tier         ?? a.plan           ?? a.subscription_type ?? 'standard').toLowerCase(),
    agency:        a.agency        ?? a.agency_name    ?? a.company           ?? '',
    license:       a.license       ?? a.license_number ?? a.rea_number        ?? '',
    location:      a.location      ?? a.city           ?? a.area              ?? '',
    listings_count:a.listings_count ?? a.total_listings ?? 0,
    active_listings: a.active_listings ?? 0,
    sold_count:    a.sold_count    ?? a.properties_sold ?? 0,
    rating:        a.rating        ?? a.average_rating ?? null,
    reviews_count: a.reviews_count ?? 0,
    is_verified:   a.is_verified   ?? a.verified       ?? false,
    is_featured:   a.is_featured   ?? a.featured       ?? false,
    avatar:        a.avatar        ?? a.profile_photo  ?? null,
    joined_at:     a.joined_at     ?? a.created_at     ?? '',
    last_active:   a.last_active   ?? a.last_login_at  ?? '',
    total_revenue: a.total_revenue ?? null,
});

// ─── Atoms ────────────────────────────────────────────────────────────────────

const StatusBadge = ({ sk }) => {
    const cfg = STATUS_CFG[sk] ?? STATUS_CFG.inactive;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.52rem', borderRadius: '999px', fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.06em', backgroundColor: cfg.bg, color: cfg.color, whiteSpace: 'nowrap' }}>
            <span style={{ width: '0.33rem', height: '0.33rem', borderRadius: '50%', backgroundColor: cfg.dot, flexShrink: 0 }} />
            {cfg.label.toUpperCase()}
        </span>
    );
};

const TierBadge = ({ tier }) => {
    const cfg = TIER_CFG[(tier ?? '').toLowerCase()] ?? TIER_CFG.standard;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.18rem 0.48rem', borderRadius: '999px', fontSize: '0.6rem', fontWeight: '800', letterSpacing: '0.07em', backgroundColor: cfg.bg, color: cfg.color, whiteSpace: 'nowrap' }}>
            {tier?.toLowerCase() === 'premium' || tier?.toLowerCase() === 'pro' ? '⭐ ' : ''}
            {cfg.label.toUpperCase()}
        </span>
    );
};

const Kpi = ({ label, value, sub, accent, iconBg, iconColor, icon }) => (
    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
        <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.65rem', backgroundColor: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
        <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: accent, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'hsl(220 25% 22%)', marginTop: '0.1rem' }}>{label}</div>
            {sub && <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 55%)', marginTop: '0.05rem' }}>{sub}</div>}
        </div>
    </div>
);

const Toast = ({ toast }) => toast ? (
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'agSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {toast.type === 'error' ? <Icons.x /> : <Icons.check />}
        {toast.msg}
    </div>
) : null;

// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination = ({ page, total, onChange }) => {
    if (total <= 1) return null;
    const pages = [];
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || Math.abs(i - page) <= 1) pages.push(i);
        else if (pages[pages.length - 1] !== '…') pages.push('…');
    }
    const btn = (content, onClick, active, disabled) => (
        <button onClick={onClick} disabled={disabled}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '2rem', height: '2rem', padding: '0 0.4rem', borderRadius: '0.45rem', border: `1px solid ${active ? 'hsl(220 25% 22%)' : 'hsl(220 15% 88%)'}`, backgroundColor: active ? 'hsl(220 25% 15%)' : 'white', color: active ? 'white' : disabled ? 'hsl(220 15% 65%)' : 'hsl(220 25% 28%)', fontSize: '0.8rem', fontWeight: active ? '700' : '500', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.15s', fontFamily: 'inherit' }}>
            {content}
        </button>
    );
    return (
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            {btn(<Icons.chevL />, () => onChange(page - 1), false, page === 1)}
            {pages.map((p, i) => p === '…'
                ? <span key={`e${i}`} style={{ fontSize: '0.8rem', color: 'hsl(220 15% 55%)', padding: '0 0.2rem' }}>…</span>
                : btn(p, () => onChange(p), p === page, false)
            )}
            {btn(<Icons.chevR />, () => onChange(page + 1), false, page === total)}
        </div>
    );
};

// ─── Action modal ─────────────────────────────────────────────────────────────

const ActionModal = ({ agent, action, onConfirm, onClose, processing }) => {
    const hue = avatarHue(agent.name);

    const meta = {
        verify:    { label: 'Verify Agent',     accentBg: 'hsl(214 100% 95%)', accent: 'hsl(214 80% 40%)', confirmBg: 'hsl(214 80% 42%)', confirmLabel: 'Verify',    icon: Icons.shield,   body: `Verify ${agent.name}'s account. This grants them the verified badge and increases listing trust.` },
        suspend:   { label: 'Suspend Agent',    accentBg: 'hsl(0 70% 95%)',   accent: 'hsl(0 65% 40%)',   confirmBg: 'hsl(0 65% 50%)',   confirmLabel: 'Suspend',   icon: Icons.ban,      body: `Suspend ${agent.name}'s account. They will lose access to the platform immediately.` },
        reactivate:{ label: 'Reactivate Agent', accentBg: 'hsl(152 55% 92%)', accent: 'hsl(152 55% 30%)', confirmBg: 'hsl(152 55% 33%)', confirmLabel: 'Reactivate',icon: Icons.check,    body: `Reactivate ${agent.name}'s account. They will regain full platform access.` },
        delete:    { label: 'Delete Agent',     accentBg: 'hsl(0 70% 95%)',   accent: 'hsl(0 65% 40%)',   confirmBg: 'hsl(0 65% 50%)',   confirmLabel: 'Delete',    icon: Icons.trash,    body: `Permanently delete ${agent.name}? This removes all their listings, data, and cannot be undone.` },
    };
    const m = meta[action] ?? meta.suspend;
    const ActionIcon = m.icon;

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.6)', backdropFilter: 'blur(5px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '420px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.15rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.28)', animation: 'agModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ height: '4px', background: `linear-gradient(90deg, ${m.accent}, ${m.accent}88)` }} />
                <div style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                        <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.75rem', backgroundColor: m.accentBg, color: m.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ActionIcon /></div>
                        <div>
                            <h3 style={{ margin: '0 0 0.1rem', fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>{m.label}</h3>
                            <p style={{ margin: 0, fontSize: '0.73rem', color: 'hsl(220 15% 50%)' }}>This will update the agent's account status</p>
                        </div>
                    </div>

                    {/* Agent preview */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem', borderRadius: '0.75rem', backgroundColor: 'hsl(220 15% 97%)', border: '1px solid hsl(220 15% 91%)', marginBottom: '1.1rem' }}>
                        {agent.avatar ? (
                            <img src={agent.avatar} alt="" style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                        ) : (
                            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 32%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '800', flexShrink: 0 }}>
                                {agent.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                            </div>
                        )}
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'hsl(220 25% 15%)', marginBottom: '0.15rem' }}>{agent.name}</div>
                            <div style={{ fontSize: '0.73rem', color: 'hsl(220 15% 52%)', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <StatusBadge sk={agent.status_key} />
                                {agent.agency && <span>{agent.agency}</span>}
                            </div>
                        </div>
                    </div>

                    <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: 'hsl(220 15% 38%)', lineHeight: 1.6 }}>{m.body}</p>

                    {action === 'delete' && (
                        <div style={{ padding: '0.65rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(0 70% 96%)', border: '1px solid hsl(0 65% 88%)', fontSize: '0.76rem', color: 'hsl(0 65% 40%)', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', lineHeight: 1.5 }}>
                            <span style={{ display: 'flex', flexShrink: 0, marginTop: '0.05rem' }}><Icons.alert /></span>
                            This agent has <strong>{agent.listings_count} listing{agent.listings_count !== 1 ? 's' : ''}</strong>. Deleting their account will also remove all associated data.
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                        <button onClick={onConfirm} disabled={processing}
                            style={{ flex: 2, padding: '0.625rem', borderRadius: '0.6rem', border: 'none', backgroundColor: processing ? 'hsl(220 15% 70%)' : m.confirmBg, color: 'white', fontSize: '0.85rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit' }}>
                            {processing ? <><Icons.spinner />{m.confirmLabel}…</> : <><ActionIcon /> {m.confirmLabel}</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Agent card ───────────────────────────────────────────────────────────────

const AgentCard = ({ agent: a, index, onAction }) => {
    const [hov, setHov] = useState(false);
    const hue    = avatarHue(a.name);
    const stCfg  = STATUS_CFG[a.status_key] ?? STATUS_CFG.inactive;

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ backgroundColor: 'white', border: `1.5px solid ${hov ? stCfg.dot : 'hsl(220 15% 91%)'}`, borderRadius: '1rem', overflow: 'hidden', transition: 'all 0.22s ease', transform: hov ? 'translateY(-3px)' : 'none', boxShadow: hov ? '0 16px 40px hsl(220 20% 15% / 0.1)' : '0 1px 4px hsl(220 20% 15% / 0.05)', display: 'flex', flexDirection: 'column', animation: `agCardIn 0.35s ease ${Math.min(index, 15) * 0.04}s both` }}>

            {/* Status bar */}
            <div style={{ height: '3px', background: `linear-gradient(90deg, ${stCfg.dot}, ${stCfg.dot}55)` }} />

            <div style={{ padding: '1.1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {/* Avatar + name */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        {a.avatar ? (
                            <img src={a.avatar} alt="" style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${stCfg.bg}` }} />
                        ) : (
                            <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '900', border: `2px solid ${stCfg.bg}` }}>
                                {a.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                            </div>
                        )}
                        {a.is_verified && (
                            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '1.05rem', height: '1.05rem', borderRadius: '50%', backgroundColor: 'hsl(214 80% 50%)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg style={{ width: '0.5rem', height: '0.5rem' }} fill="white" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            </div>
                        )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                            <h3 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'hsl(220 25% 13%)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</h3>
                            {a.is_featured && <span style={{ fontSize: '0.58rem', backgroundColor: 'hsl(40 90% 93%)', color: 'hsl(40 80% 30%)', padding: '0.05rem 0.3rem', borderRadius: '0.2rem', fontWeight: '800', letterSpacing: '0.04em' }}>⭐</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <StatusBadge sk={a.status_key} />
                            <TierBadge tier={a.tier} />
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32rem' }}>
                    <div style={{ fontSize: '0.73rem', color: 'hsl(220 15% 45%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>✉ {a.email || '—'}</div>
                    {a.phone && <div style={{ fontSize: '0.73rem', color: 'hsl(220 15% 45%)' }}>📞 {a.phone}</div>}
                    {a.agency && <div style={{ fontSize: '0.73rem', color: 'hsl(220 15% 45%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🏢 {a.agency}</div>}
                    {a.location && <div style={{ fontSize: '0.73rem', color: 'hsl(220 15% 45%)' }}>📍 {a.location}</div>}
                    {a.license && <div style={{ fontSize: '0.7rem', color: 'hsl(214 80% 44%)', fontFamily: 'monospace', backgroundColor: 'hsl(214 100% 96%)', padding: '0.08rem 0.35rem', borderRadius: '0.3rem', display: 'inline-block' }}>#{a.license}</div>}
                </div>

                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    {[
                        { v: a.listings_count, l: 'Listings' },
                        { v: a.sold_count,     l: 'Sold/Rented' },
                        { v: a.rating ? `${Number(a.rating).toFixed(1)}★` : '—', l: 'Rating' },
                    ].map(({ v, l }) => (
                        <div key={l} style={{ textAlign: 'center', padding: '0.5rem 0.25rem', borderRadius: '0.5rem', backgroundColor: 'hsl(220 15% 97.5%)', border: '1px solid hsl(220 15% 93%)' }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: '900', color: 'hsl(220 25% 14%)', lineHeight: 1 }}>{v ?? '—'}</div>
                            <div style={{ fontSize: '0.6rem', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'hsl(220 15% 55%)', marginTop: '0.15rem' }}>{l}</div>
                        </div>
                    ))}
                </div>

                {/* Last active */}
                <div style={{ fontSize: '0.68rem', color: 'hsl(220 15% 55%)' }}>
                    Joined {fmtDate(a.joined_at)}
                    {a.last_active && <span> · Active {fmtRelative(a.last_active)}</span>}
                </div>
            </div>

            {/* Actions */}
            <div style={{ padding: '0.65rem 1rem', borderTop: '1px solid hsl(220 15% 95%)', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <Link href={`/super-admin/agents/${a._id}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '1.9rem', height: '1.9rem', borderRadius: '0.45rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', textDecoration: 'none', transition: 'all 0.15s', flexShrink: 0 }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsl(220 15% 95%)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; }}>
                    <Icons.eye />
                </Link>
                <Link href={`/super-admin/agents/${a._id}/edit`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '1.9rem', height: '1.9rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(214 100% 95%)', color: 'hsl(214 80% 42%)', textDecoration: 'none', transition: 'filter 0.15s', flexShrink: 0 }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.edit />
                </Link>

                {a.status_key === 'pending' && (
                    <button onClick={() => onAction(a, 'verify')}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', height: '1.9rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(214 100% 95%)', color: 'hsl(214 80% 40%)', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                        <Icons.shield /> Verify
                    </button>
                )}

                {(a.status_key === 'active' || a.status_key === 'verified') && (
                    <button onClick={() => onAction(a, 'suspend')}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', height: '1.9rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 46%)', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                        <Icons.ban /> Suspend
                    </button>
                )}

                {a.status_key === 'suspended' && (
                    <button onClick={() => onAction(a, 'reactivate')}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', height: '1.9rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(152 55% 92%)', color: 'hsl(152 55% 30%)', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                        <Icons.check /> Reactivate
                    </button>
                )}

                <button onClick={() => onAction(a, 'delete')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '1.9rem', height: '1.9rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 48%)', cursor: 'pointer', transition: 'filter 0.15s', fontFamily: 'inherit', marginLeft: 'auto', flexShrink: 0 }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.trash />
                </button>
            </div>
        </div>
    );
};

// ─── Agent row (list view) ────────────────────────────────────────────────────

const AgentRow = ({ agent: a, index, onAction }) => {
    const [hov, setHov] = useState(false);
    const hue = avatarHue(a.name);

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ position: 'relative', display: 'grid', gridTemplateColumns: '3rem minmax(0,1fr) 11rem 8rem 9rem 9rem 7rem', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', borderBottom: '1px solid hsl(220 15% 95%)', backgroundColor: hov ? 'hsl(220 20% 98.5%)' : 'white', transition: 'background-color 0.12s', animation: `agRowIn 0.3s ease ${Math.min(index, 15) * 0.025}s both` }}>

            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
                {a.avatar ? (
                    <img src={a.avatar} alt="" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '800' }}>
                        {a.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </div>
                )}
                {a.is_verified && (
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '0.85rem', height: '0.85rem', borderRadius: '50%', backgroundColor: 'hsl(214 80% 50%)', border: '1.5px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg style={{ width: '0.42rem', height: '0.42rem' }} fill="white" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                )}
            </div>

            {/* Name + email */}
            <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.18rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'hsl(220 25% 14%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
                    {a.is_featured && <span style={{ fontSize: '0.58rem', backgroundColor: 'hsl(40 90% 93%)', color: 'hsl(40 80% 30%)', padding: '0.05rem 0.28rem', borderRadius: '0.2rem', fontWeight: '800' }}>⭐</span>}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 52%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.email}</div>
                {a.agency && <div style={{ fontSize: '0.68rem', color: 'hsl(220 15% 58%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🏢 {a.agency}</div>}
            </div>

            {/* Location + license */}
            <div>
                {a.location && <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'hsl(220 25% 22%)', marginBottom: '0.1rem' }}>{a.location}</div>}
                {a.license && <div style={{ fontSize: '0.66rem', color: 'hsl(214 80% 44%)', fontFamily: 'monospace', backgroundColor: 'hsl(214 100% 96%)', padding: '0.05rem 0.28rem', borderRadius: '0.25rem', display: 'inline-block' }}>#{a.license}</div>}
            </div>

            {/* Status + tier */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <StatusBadge sk={a.status_key} />
                <TierBadge tier={a.tier} />
            </div>

            {/* Listings */}
            <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>{a.listings_count}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'hsl(220 15% 55%)' }}>listings</div>
                {a.sold_count > 0 && <div style={{ fontSize: '0.66rem', color: 'hsl(152 55% 32%)' }}>{a.sold_count} sold</div>}
            </div>

            {/* Rating */}
            <div>
                {a.rating ? (
                    <>
                        <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>{Number(a.rating).toFixed(1)} <span style={{ fontSize: '0.7rem', color: 'hsl(40 80% 44%)' }}>★</span></div>
                        <div style={{ fontSize: '0.65rem', color: 'hsl(220 15% 55%)' }}>{a.reviews_count} review{a.reviews_count !== 1 ? 's' : ''}</div>
                    </>
                ) : <span style={{ fontSize: '0.73rem', color: 'hsl(220 15% 60%)', fontStyle: 'italic' }}>No rating</span>}
            </div>

            {/* Joined */}
            <div>
                <div style={{ fontSize: '0.73rem', fontWeight: '600', color: 'hsl(220 25% 22%)' }}>{fmtDate(a.joined_at)}</div>
                {a.last_active && <div style={{ fontSize: '0.65rem', color: 'hsl(220 15% 55%)' }}>Active {fmtRelative(a.last_active)}</div>}
            </div>

            {/* Actions — absolutely positioned, takes no grid space */}
            <div style={{
                position: 'absolute', right: '1.25rem', top: '50%',
                transform: hov ? 'translateY(-50%)' : 'translateY(-50%) translateX(4px)',
                display: 'flex', gap: '0.3rem', alignItems: 'center',
                opacity: hov ? 1 : 0,
                transition: 'opacity 0.15s ease, transform 0.15s ease',
                pointerEvents: hov ? 'auto' : 'none',
            }}>
                <Link href={`/super-admin/agents/${a._id}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', textDecoration: 'none', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsl(220 15% 95%)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; }}>
                    <Icons.eye />
                </Link>
                <Link href={`/super-admin/agents/${a._id}/edit`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(214 100% 95%)', color: 'hsl(214 80% 42%)', textDecoration: 'none', transition: 'filter 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.edit />
                </Link>
                {a.status_key === 'pending' && (
                    <button onClick={() => onAction(a, 'verify')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.38rem 0.55rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(214 100% 95%)', color: 'hsl(214 80% 40%)', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                        <Icons.shield /> Verify
                    </button>
                )}
                {(a.status_key === 'active' || a.status_key === 'verified') && (
                    <button onClick={() => onAction(a, 'suspend')}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 48%)', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                        <Icons.ban />
                    </button>
                )}
                {a.status_key === 'suspended' && (
                    <button onClick={() => onAction(a, 'reactivate')}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(152 55% 92%)', color: 'hsl(152 55% 30%)', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                        <Icons.check />
                    </button>
                )}
                <button onClick={() => onAction(a, 'delete')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 48%)', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.trash />
                </button>
            </div>
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const AgentsIndex = ({ agents: rawAgents = [], listings_count }) => {
    const agents = useMemo(() => rawAgents.map(normalise), [rawAgents]);

    const [search,     setSearch]     = useState('');
    const [status,     setStatus]     = useState('all');
    const [tierFilter, setTierFilter] = useState('all');
    const [sortCol,    setSortCol]    = useState('joined_at');
    const [sortDir,    setSortDir]    = useState('desc');
    const [viewMode,   setViewMode]   = useState('grid');
    const [page,       setPage]       = useState(1);
    const [modal,      setModal]      = useState(null);
    const [processing, setProcessing] = useState(false);
    const [toast,      setToast]      = useState(null);
    const [refreshing,   refresh]   = useRefresh(['agents', 'listings_count']);
    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const allTiers = useMemo(() => [...new Set(agents.map(a => a.tier).filter(Boolean))].sort(), [agents]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return agents
            .filter(a => {
                const okQ  = !q || a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || (a.agency ?? '').toLowerCase().includes(q) || (a.location ?? '').toLowerCase().includes(q) || (a.license ?? '').toLowerCase().includes(q);
                const okSt = status     === 'all' || a.status_key === status;
                const okTr = tierFilter === 'all' || a.tier       === tierFilter;
                return okQ && okSt && okTr;
            })
            .sort((a, b) => {
                let av = a[sortCol], bv = b[sortCol];
                if (['joined_at','last_active'].includes(sortCol)) { av = new Date(av || 0); bv = new Date(bv || 0); }
                if (['listings_count','sold_count','rating'].includes(sortCol)) { av = Number(av || 0); bv = Number(bv || 0); }
                if (typeof av === 'string') av = av.toLowerCase();
                if (typeof bv === 'string') bv = bv.toLowerCase();
                return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
            });
    }, [agents, search, status, tierFilter, sortCol, sortDir]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleAction = (agent, action) => setModal({ agent, action });

    const confirmAction = () => {
        const { agent, action } = modal;
        setProcessing(true);
        const routeMap = {
            verify:     `/super-admin/agents/${agent._id}/verify`,
            suspend:    `/super-admin/agents/${agent._id}/suspend`,
            reactivate: `/super-admin/agents/${agent._id}/reactivate`,
            delete:     `/super-admin/agents/${agent._id}`,
        };
        const method = action === 'delete' ? 'delete' : 'post';
        router[method](routeMap[action], {}, {
            preserveScroll: true,
            onSuccess: () => {
                showToast(`Agent "${agent.name}" ${action}d.`);
                setModal(null);
                router.reload({ only: ['agents'] });
            },
            onError:  () => showToast('Action failed.', 'error'),
            onFinish: () => setProcessing(false),
        });
    };

    // KPIs
    const activeCount   = agents.filter(a => a.status_key === 'active' || a.status_key === 'verified').length;
    const pendingCount  = agents.filter(a => a.status_key === 'pending').length;
    const verifiedCount = agents.filter(a => a.is_verified).length;
    const totalListings = listings_count;

    const SortBtn = ({ col, label }) => {
        const active = sortCol === col;
        return (
            <button onClick={() => { if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortCol(col); setSortDir('desc'); } setPage(1); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: active ? 'hsl(220 25% 20%)' : 'hsl(220 15% 48%)', padding: 0, fontFamily: 'inherit' }}>
                {label}{active ? (sortDir === 'asc' ? <Icons.chevU /> : <Icons.chevD />) : <Icons.chevD />}
            </button>
        );
    };

    const hasFilters = search || status !== 'all' || tierFilter !== 'all';

    return (
        <>
            <Toast toast={toast} />
            {modal && (
                <ActionModal
                    agent={modal.agent}
                    action={modal.action}
                    onConfirm={confirmAction}
                    onClose={() => setModal(null)}
                    processing={processing}
                />
            )}

            <div>
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.22rem', letterSpacing: '-0.02em' }}>Agents</h1>
                        <p style={{ fontSize: '0.82rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                            {agents.length.toLocaleString()} total · {activeCount} active · {pendingCount} pending verification
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.65rem', flexShrink: 0 }}>
                        <button onClick={refresh} disabled={refreshing}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 28%)', fontWeight: '600', fontSize: '0.83rem', cursor: refreshing ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => { if (!refreshing) e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'; }}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                            {refreshing ? <><Icons.spinner /> Refreshing…</> : <><Icons.refresh /> Refresh</>}
                        </button>
                        <Link href="/super-admin/agents/create"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.625rem 1.2rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 25% 15%)', color: 'white', fontWeight: '700', fontSize: '0.875rem', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'}>
                            + Add Agent
                        </Link>
                    </div>
                </div>

                {/* ── KPI strip ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <Kpi label="Total Agents"    value={agents.length.toLocaleString()}    sub="Registered"          accent="hsl(220 25% 15%)"  iconBg="hsl(220 20% 93%)"   iconColor="hsl(220 25% 30%)" icon={<Icons.users />} />
                    <Kpi label="Active"          value={activeCount.toLocaleString()}       sub="Active & verified"   accent="hsl(152 55% 33%)"  iconBg="hsl(152 55% 92%)"  iconColor="hsl(152 55% 35%)" icon={<Icons.check />} />
                    <Kpi label="Pending Review"  value={pendingCount.toLocaleString()}      sub="Awaiting verification" accent="hsl(40 80% 36%)" iconBg="hsl(40 90% 93%)"   iconColor="hsl(40 80% 36%)"  icon={<Icons.shield />} />
                    <Kpi label="Total Listings"  value={totalListings.toLocaleString()}     sub="Across all agents"   accent="hsl(214 80% 46%)"  iconBg="hsl(214 100% 95%)" iconColor="hsl(214 80% 46%)" icon={<Icons.building />} />
                </div>

                {/* ── Toolbar ── */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '0.875rem 1.1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {/* Search */}
                        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 0 }}>
                            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)', pointerEvents: 'none', display: 'flex' }}><Icons.search /></span>
                            <input type="text" placeholder="Search name, email, agency, license…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                                style={{ width: '100%', padding: '0.52rem 0.75rem 0.52rem 2.25rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.55rem', fontSize: '0.855rem', color: 'hsl(220 25% 18%)', backgroundColor: 'hsl(220 15% 98.5%)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                                onFocus={e => e.target.style.borderColor = 'hsl(220 60% 60%)'}
                                onBlur={e => e.target.style.borderColor = 'hsl(220 15% 88%)'} />
                        </div>

                        {/* Sort (list view only) */}
                        {viewMode === 'list' && (
                            <select value={`${sortCol}:${sortDir}`} onChange={e => { const [c, d] = e.target.value.split(':'); setSortCol(c); setSortDir(d); setPage(1); }}
                                style={{ padding: '0.52rem 0.875rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.55rem', fontSize: '0.82rem', backgroundColor: 'white', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', color: 'hsl(220 25% 22%)' }}>
                                <option value="joined_at:desc">Newest first</option>
                                <option value="joined_at:asc">Oldest first</option>
                                <option value="name:asc">Name A–Z</option>
                                <option value="listings_count:desc">Most listings</option>
                                <option value="rating:desc">Highest rated</option>
                                <option value="sold_count:desc">Most sold</option>
                            </select>
                        )}

                        {/* Tier filter */}
                        {allTiers.length > 1 && (
                            <select value={tierFilter} onChange={e => { setTierFilter(e.target.value); setPage(1); }}
                                style={{ padding: '0.52rem 0.875rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.55rem', fontSize: '0.82rem', backgroundColor: 'white', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', color: 'hsl(220 25% 22%)' }}>
                                <option value="all">All Tiers</option>
                                {allTiers.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                            </select>
                        )}

                        {hasFilters && (
                            <button onClick={() => { setSearch(''); setStatus('all'); setTierFilter('all'); setPage(1); }}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.7rem', borderRadius: '999px', border: '1px solid hsl(220 15% 86%)', backgroundColor: 'hsl(220 15% 96%)', color: 'hsl(220 15% 44%)', fontSize: '0.73rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                                <Icons.x /> Clear
                            </button>
                        )}

                        {/* View toggle */}
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.2rem', backgroundColor: 'hsl(220 15% 96%)', borderRadius: '0.5rem', padding: '0.2rem', flexShrink: 0 }}>
                            {[['grid', '⊞'], ['list', '☰']].map(([v, label]) => (
                                <button key={v} onClick={() => { setViewMode(v); setPage(1); }}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem 0.6rem', borderRadius: '0.35rem', border: 'none', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.15s', backgroundColor: viewMode === v ? 'white' : 'transparent', color: viewMode === v ? 'hsl(220 25% 18%)' : 'hsl(220 15% 55%)', boxShadow: viewMode === v ? '0 1px 3px hsl(220 20% 15% / 0.1)' : 'none' }}>
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status pills */}
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {STATUSES.map(s => {
                            const a   = status === s;
                            const cfg = STATUS_CFG[s];
                            return (
                                <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                                    style={{ padding: '0.3rem 0.65rem', borderRadius: '999px', border: `1.5px solid ${a ? (cfg?.dot ?? 'hsl(220 25% 22%)') : 'hsl(220 15% 88%)'}`, fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', backgroundColor: a ? (cfg?.bg ?? 'hsl(220 25% 15%)') : 'transparent', color: a ? (cfg?.color ?? 'white') : 'hsl(220 15% 48%)' }}>
                                    {s === 'all' ? `All (${agents.length})` : `${cfg?.label ?? s} (${agents.filter(ag => ag.status_key === s).length})`}
                                </button>
                            );
                        })}
                        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'hsl(220 15% 52%)' }}>{filtered.length.toLocaleString()} result{filtered.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                {/* ── Content ── */}
                {paginated.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px dashed hsl(220 15% 86%)' }}>
                        <div style={{ fontSize: '2.75rem', marginBottom: '0.875rem' }}>🏢</div>
                        <p style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: '700', color: 'hsl(220 25% 22%)' }}>{search ? 'No agents found' : 'No agents yet'}</p>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'hsl(220 15% 55%)' }}>{search ? 'Try a different search or filter.' : 'Agents who register on the platform will appear here.'}</p>
                    </div>

                ) : viewMode === 'grid' ? (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                            {paginated.map((a, i) => <AgentCard key={a._id} agent={a} index={i} onAction={handleAction} />)}
                        </div>
                        <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(220 15% 50%)' }}>Page <strong>{page}</strong> of <strong>{totalPages}</strong></p>
                            <Pagination page={page} total={totalPages} onChange={setPage} />
                        </div>
                    </>

                ) : (
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '3rem minmax(0,1fr) 11rem 8rem 9rem 9rem 7rem auto', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1.25rem', backgroundColor: 'hsl(220 15% 97.5%)', borderBottom: '1px solid hsl(220 15% 92%)' }}>
                            <div />
                            <div><SortBtn col="name"           label="Agent" /></div>
                            <div><SortBtn col="location"       label="Location" /></div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Status</div>
                            <div><SortBtn col="listings_count" label="Listings" /></div>
                            <div><SortBtn col="rating"         label="Rating" /></div>
                            <div><SortBtn col="joined_at"      label="Joined" /></div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Actions</div>
                        </div>
                        {paginated.map((a, i) => <AgentRow key={a._id} agent={a} index={i} onAction={handleAction} />)}
                        <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'hsl(220 15% 98.5%)' }}>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(220 15% 50%)' }}>Page <strong style={{ color: 'hsl(220 25% 22%)' }}>{page}</strong> of <strong style={{ color: 'hsl(220 25% 22%)' }}>{totalPages}</strong> · {filtered.length.toLocaleString()} result{filtered.length !== 1 ? 's' : ''}</p>
                            <Pagination page={page} total={totalPages} onChange={setPage} />
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes agSpin    { to { transform: rotate(360deg); } }
                @keyframes agSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes agModalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes agCardIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
                @keyframes agRowIn   { from { opacity:0; transform:translateX(-4px); } to { opacity:1; transform:translateX(0); } }
            `}</style>
        </>
    );
};

AgentsIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default AgentsIndex;