import React, { useState, useRef } from 'react';
import { Link, router, Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = ({ d, size = '1rem', sw = 1.9 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    back:    () => <Ico d="M15 19l-7-7 7-7" size="0.9rem" />,
    edit:    () => <Ico d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />,
    check:   () => <Ico d="M5 13l4 4L19 7" size="0.85rem" />,
    x:       () => <Ico d="M6 18L18 6M6 6l12 12" />,
    ban:     () => <Ico d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />,
    trash:   () => <Ico d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    unlock:  () => <Ico d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />,
    shield:  () => <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    mail:    () => <Ico d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    phone:   () => <Ico d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
    building:() => <Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    pin:     () => <Ico d={["M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z","M15 11a3 3 0 11-6 0 3 3 0 016 0z"]} />,
    star:    () => <Ico d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" size="0.85rem" />,
    home:    () => <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    alert:   () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    clock:   () => <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size="0.85rem" />,
    tag:     () => <Ico d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" size="0.85rem" />,
    spinner: () => (
        <svg style={{ width: '1rem', height: '1rem', animation: 'agsSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
    active:    { label: 'Active',    bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 28%)', dot: 'hsl(152 60% 38%)', bar: 'hsl(152 55% 42%)' },
    pending:   { label: 'Pending',   bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 30%)',  dot: 'hsl(40 80% 44%)',  bar: 'hsl(40 80% 48%)' },
    verified:  { label: 'Verified',  bg: 'hsl(214 100% 95%)',color: 'hsl(214 80% 38%)', dot: 'hsl(214 80% 50%)', bar: 'hsl(214 80% 52%)' },
    suspended: { label: 'Suspended', bg: 'hsl(0 70% 95%)',   color: 'hsl(0 65% 40%)',   dot: 'hsl(0 65% 50%)',   bar: 'hsl(0 65% 52%)' },
    rejected:  { label: 'Rejected',  bg: 'hsl(0 70% 95%)',   color: 'hsl(0 65% 40%)',   dot: 'hsl(0 65% 50%)',   bar: 'hsl(0 65% 52%)' },
    inactive:  { label: 'Inactive',  bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)', bar: 'hsl(220 15% 55%)' },
};

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
        if (diff < 60000)      return 'Just now';
        if (diff < 3600000)    return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000)   return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 2592000000) return `${Math.floor(diff / 86400000)}d ago`;
        return fmtDate(v);
    } catch { return v; }
};

const resolveImage = (img) => {
    if (!img) return null;

    let path = null;
    if (typeof img === 'string') {
        path = img;
    } else if (Array.isArray(img)) {
        path = img[0] ?? null;
    } else if (typeof img === 'object' && img !== null) {
        path = img.path ?? img.url ?? null;
    }

    if (!path || typeof path !== 'string') return null;
    path = path.trim();
    if (!path) return null;

    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/storage/')) return path;
    if (path.startsWith('storage/')) return `/${path}`;
    if (path.includes('/')) return `/storage/${path}`;
    return `/storage/rental_images/${path}`;
};

const avatarHue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

const normalise = (a) => ({
    ...a,
    _id:            a.id,
    name:           a.name           ?? a.full_name       ?? '—',
    email:          a.email          ?? '',
    phone:          a.phone          ?? a.phone_number    ?? '',
    status_key:     (a.status        ?? 'pending').toLowerCase(),
    company:         a.company           ?? '',
    location:       a.location        ?? '',
    bio:            a.bio            ?? a.about           ?? '',
    active_listings:a.active_listings ?? 0,
    sold_count:     a.sold_count     ?? a.properties_sold ?? 0,
    rating:         a.rating         ?? a.average_rating  ?? null,
    reviews_count:  a.reviews_count  ?? 0,
    avatar:         a.avatar         ?? a.profile_photo   ?? null,
    joined_at:      a.joined_at      ?? a.created_at      ?? '',
    last_active:    a.last_active    ?? a.last_login_at   ?? '',
    listings:       a.listings       ?? [],
});

// ─── Atoms ────────────────────────────────────────────────────────────────────

const StatusBadge = ({ sk }) => {
    const c = STATUS_CFG[sk] ?? STATUS_CFG.inactive;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.06em', backgroundColor: c.bg, color: c.color }}>
            <span style={{ width: '0.38rem', height: '0.38rem', borderRadius: '50%', backgroundColor: c.dot }} />
            {c.label.toUpperCase()}
        </span>
    );
};

// const TierBadge = ({ tier }) => {
//     const c = TIER_CFG[(tier ?? '').toLowerCase()] ?? TIER_CFG.standard;
//     return (
//         <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.18rem 0.52rem', borderRadius: '999px', fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.07em', backgroundColor: c.bg, color: c.color }}>
//             {(tier === 'premium' || tier === 'pro') ? '⭐ ' : ''}{c.label.toUpperCase()}
//         </span>
//     );
// };

const Toast = ({ toast }) => toast ? (
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'agsSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {toast.type === 'error' ? <Icons.x /> : <Icons.check />}
        {toast.msg}
    </div>
) : null;

// ─── Confirm modal ────────────────────────────────────────────────────────────

const ConfirmModal = ({ action, agent, onConfirm, onClose, processing }) => {
    const meta = {
        verify:     { label: 'Verify Agent',      body: `Verify ${agent.name}? They will receive a verified badge and increased platform trust.`,                    accent: 'hsl(214 80% 42%)', accentBg: 'hsl(214 100% 95%)', confirmBg: 'hsl(214 80% 42%)', confirmLabel: 'Verify',     icon: Icons.shield },
        suspend:    { label: 'Suspend Agent',     body: `Suspend ${agent.name}? They will immediately lose access to the platform and their listings will be hidden.`, accent: 'hsl(0 65% 44%)',   accentBg: 'hsl(0 70% 95%)',   confirmBg: 'hsl(0 65% 50%)', confirmLabel: 'Suspend',    icon: Icons.ban,    warn: 'Their active listings will also be hidden.' },
        reactivate: { label: 'Reactivate Agent',  body: `Reactivate ${agent.name}? They will regain full platform access and their listings will be restored.`,       accent: 'hsl(152 55% 33%)', accentBg: 'hsl(152 55% 92%)', confirmBg: 'hsl(152 55% 33%)', confirmLabel: 'Reactivate', icon: Icons.unlock },
        delete:     { label: 'Delete Agent',      body: `Permanently delete ${agent.name}? This removes their account, all listings, and cannot be undone.`,          accent: 'hsl(0 65% 44%)',   accentBg: 'hsl(0 70% 95%)',   confirmBg: 'hsl(0 65% 50%)', confirmLabel: 'Delete',     icon: Icons.trash,  warn: 'This action cannot be undone.' },
    };
    const m = meta[action] ?? meta.suspend;
    const ActionIcon = m.icon;
    const hue = avatarHue(agent.name);

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.65)', backdropFilter: 'blur(5px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '420px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.15rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.32)', animation: 'agsModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ height: '4px', background: `linear-gradient(90deg, ${m.accent}, ${m.accent}88)` }} />
                <div style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.75rem', backgroundColor: m.accentBg, color: m.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ActionIcon /></div>
                            <div>
                                <h3 style={{ margin: '0 0 0.1rem', fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>{m.label}</h3>
                                <p style={{ margin: 0, fontSize: '0.73rem', color: 'hsl(220 15% 50%)' }}>#{agent._id}</p>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 55%)', padding: '0.2rem', display: 'flex' }}><Icons.x /></button>
                    </div>

                    {/* Agent preview */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 15% 97%)', border: '1px solid hsl(220 15% 91%)', marginBottom: '1rem' }}>
                        {agent.avatar
                            ? <img src={agent.avatar} alt="" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                            : <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 32%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: '800', flexShrink: 0 }}>
                                {agent.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                              </div>
                        }
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'hsl(220 25% 14%)' }}>{agent.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 52%)', display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.15rem' }}>
                                <StatusBadge sk={agent.status_key} />
                                {agent.company && <span>{agent.company}</span>}
                            </div>
                        </div>
                    </div>

                    <p style={{ margin: '0 0 0.875rem', fontSize: '0.83rem', color: 'hsl(220 15% 35%)', lineHeight: 1.65 }}>{m.body}</p>

                    {m.warn && (
                        <div style={{ padding: '0.6rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 65% 88%)', fontSize: '0.75rem', color: 'hsl(0 55% 38%)', marginBottom: '1.25rem' }}>
                            ⚠ {m.warn}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                        <button onClick={onConfirm} disabled={processing}
                            style={{ flex: 2, padding: '0.625rem', borderRadius: '0.6rem', border: 'none', backgroundColor: processing ? 'hsl(220 25% 55%)' : m.confirmBg, color: 'white', fontSize: '0.85rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit' }}>
                            {processing ? <><Icons.spinner />{m.confirmLabel}…</> : <><ActionIcon /> {m.confirmLabel}</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Shared atoms ─────────────────────────────────────────────────────────────

const Card = ({ children, style: s }) => (
    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', overflow: 'hidden', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)', ...s }}>
        {children}
    </div>
);

const CardHead = ({ title, sub }) => (
    <div style={{ padding: '0.75rem 1.125rem', borderBottom: '1px solid hsl(220 15% 94%)', backgroundColor: 'hsl(220 15% 98.5%)' }}>
        <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.03em', color: 'hsl(220 25% 20%)' }}>{title}</p>
        {sub && <p style={{ margin: '0.1rem 0 0', fontSize: '0.68rem', color: 'hsl(220 15% 52%)' }}>{sub}</p>}
    </div>
);

const InfoRow = ({ label, value, mono, accent }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', padding: '0.52rem 0', borderBottom: '1px solid hsl(220 15% 95%)' }}>
        <span style={{ fontSize: '0.76rem', color: 'hsl(220 15% 52%)', flexShrink: 0 }}>{label}</span>
        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: accent ?? 'hsl(220 25% 18%)', textAlign: 'right', fontFamily: mono ? 'monospace' : 'inherit' }}>{value ?? '—'}</span>
    </div>
);

// ─── Star Rating ──────────────────────────────────────────────────────────────

const StarRating = ({ rating, size = '0.85rem' }) => {
    const full  = Math.floor(rating);
    const half  = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    const Star = ({ type }) => {
        const id = `sg-${type}-${Math.random().toString(36).slice(2, 6)}`;
        return (
            <svg style={{ width: size, height: size, flexShrink: 0, display: 'block' }} viewBox="0 0 24 24" fill="none">
                {type === 'half' && (
                    <defs>
                        <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
                            <stop offset="50%" stopColor="hsl(40 90% 50%)" />
                            <stop offset="50%" stopColor="hsl(220 15% 86%)" />
                        </linearGradient>
                    </defs>
                )}
                <path
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    fill={
                        type === 'full'  ? 'hsl(40 90% 50%)' :
                        type === 'half'  ? `url(#${id})`     :
                                           'hsl(220 15% 88%)'
                    }
                    stroke={type === 'empty' ? 'hsl(220 15% 80%)' : 'none'}
                    strokeWidth="0.5"
                />
            </svg>
        );
    };

    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
            {Array.from({ length: full  }, (_, i) => <Star key={`f${i}`} type="full"  />)}
            {half                                  && <Star key="h"       type="half"  />}
            {Array.from({ length: empty }, (_, i) => <Star key={`e${i}`} type="empty" />)}
        </span>
    );
};

// ─── Recent listing row ───────────────────────────────────────────────────────

const ListingRow = ({ listing: l }) => {
    const STATUS_MINI = {
        active:   { bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 28%)' },
        pending:  { bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 30%)' },
        sold:     { bg: 'hsl(214 100% 95%)',color: 'hsl(214 80% 38%)' },
        rented:   { bg: 'hsl(270 60% 95%)', color: 'hsl(270 55% 38%)' },
        rejected: { bg: 'hsl(0 70% 95%)',   color: 'hsl(0 65% 40%)' },
        suspended:{ bg: 'hsl(0 70% 95%)',   color: 'hsl(0 65% 40%)' },
        draft:    { bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 38%)' },
    };
    const sk  = (l.status ?? 'draft').toLowerCase();
    const cfg = STATUS_MINI[sk] ?? STATUS_MINI.draft;
    const fmtPrice = (l) => {
        const cur = l.currency ?? 'GH₵';
        const val = l.sale_price ?? l.rent_min ?? l.price ?? 0;
        const n   = Number(val);
        if (n >= 1_000_000) return `${cur}${(n/1_000_000).toFixed(1)}M`;
        if (n >= 1_000)     return `${cur}${n.toLocaleString()}`;
        return `${cur}${n}`;
    };
    const imageUrl = resolveImage(l.images?.[0]);
    return (
        <Link href={`/super-admin/listings/${l.id}`}
            style={{ display: 'grid', gridTemplateColumns: '2rem minmax(0,1fr) 7rem 6rem', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1.125rem', borderBottom: '1px solid hsl(220 15% 96%)', textDecoration: 'none', transition: 'background-color 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 98.5%)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <div style={{ width: '2rem', height: '2rem', borderRadius: '0.4rem', backgroundColor: 'hsl(220 15% 91%)', overflow: 'hidden', flexShrink: 0 }}>
                {imageUrl && <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'hsl(220 25% 15%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title ?? 'Untitled'}</div>
                <div style={{ fontSize: '0.68rem', color: 'hsl(220 15% 55%)' }}>{l.location ?? l.city ?? '—'}</div>
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'hsl(220 25% 20%)' }}>{fmtPrice(l)}</div>
            <span style={{ fontSize: '0.6rem', fontWeight: '800', letterSpacing: '0.06em', padding: '0.18rem 0.45rem', borderRadius: '999px', backgroundColor: cfg.bg, color: cfg.color, justifySelf: 'end' }}>
                {sk.toUpperCase()}
            </span>
        </Link>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const AgentShow = ({ agent: rawAgent}) => {
    const agent   = normalise(rawAgent ?? {});
    const rawListings = agent?.listings ?? [];
    const stCfg   = STATUS_CFG[agent.status_key] ?? STATUS_CFG.inactive;
    const hue     = avatarHue(agent.name);

    const [confirmAction, setConfirmAction] = useState(null);
    const [actLoading,    setActLoading]    = useState(false);
    const [toast,         setToast]         = useState(null);
    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const doAction = (action) => {
        setActLoading(true);
        const routes = {
            verify:     { method: 'post',   url: `/super-admin/agents/${agent._id}/verify` },
            suspend:    { method: 'post',   url: `/super-admin/agents/${agent._id}/suspend` },
            reactivate: { method: 'post',   url: `/super-admin/agents/${agent._id}/reactivate` },
            delete:     { method: 'delete', url: `/super-admin/agents/${agent._id}` },
        };
        const { method, url } = routes[action];
        router[method](url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                if (action === 'delete') {
                    router.visit('/super-admin/agents');
                } else {
                    showToast(`Agent ${action}d successfully.`);
                    setConfirmAction(null);
                    router.reload({ only: ['agent'] });
                }
            },
            onError:  () => showToast('Action failed. Please try again.', 'error'),
            onFinish: () => setActLoading(false),
        });
    };

    const isPending   = agent.status_key === 'pending';
    const isActive    = agent.status_key === 'verified';
    const isSuspended = agent.status_key === 'suspended';

    return (
        <>
        <Head>
            <title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
        </Head>
            <Toast toast={toast} />
            {confirmAction && (
                <ConfirmModal
                    action={confirmAction}
                    agent={agent}
                    onConfirm={() => doAction(confirmAction)}
                    onClose={() => setConfirmAction(null)}
                    processing={actLoading}
                />
            )}

            <div>
                {/* ── Page header ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link href="/super-admin/agents"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                            <Icons.back /> Back
                        </Link>
                        <div>
                            <h1 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.2rem', letterSpacing: '-0.02em' }}>{agent.name}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <StatusBadge sk={agent.status_key} />
                                <span style={{ fontSize: '0.72rem', color: 'hsl(220 15% 52%)' }}>#{agent._id} · Joined {fmtDate(agent.joined_at)}</span>
                                {agent.last_active && (
                                    <span style={{ fontSize: '0.72rem', color: 'hsl(214 60% 45%)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Icons.clock style={{ width: '0.8rem', height: '0.8rem' }} />
                                        Last active {fmtRelative(agent.last_active)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Header action buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {isPending && (
                            <button onClick={() => setConfirmAction('verify')}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '0.6rem', border: 'none', backgroundColor: 'hsl(214 80% 44%)', color: 'white', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                <Icons.shield /> Verify
                            </button>
                        )}
                        {isActive && (
                            <button onClick={() => setConfirmAction('suspend')}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '0.6rem', border: '1px solid hsl(0 65% 84%)', backgroundColor: 'hsl(0 65% 97%)', color: 'hsl(0 65% 44%)', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                <Icons.ban /> Suspend
                            </button>
                        )}
                        {isSuspended && (
                            <button onClick={() => setConfirmAction('reactivate')}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '0.6rem', border: 'none', backgroundColor: 'hsl(152 55% 33%)', color: 'white', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                <Icons.unlock /> Reactivate
                            </button>
                        )}
                        <Link href={`/super-admin/agents/${agent._id}/edit`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 86%)', backgroundColor: 'white', color: 'hsl(220 25% 28%)', fontSize: '0.82rem', fontWeight: '700', textDecoration: 'none', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                            <Icons.edit /> Edit
                        </Link>
                    </div>
                </div>

                {/* ── Status accent bar ── */}
                <div style={{ height: '4px', borderRadius: '999px', background: `linear-gradient(90deg, ${stCfg.bar}, ${stCfg.bar}44)`, marginBottom: '1.5rem' }} />

                {/* ── Two-column layout ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem', alignItems: 'start' }}>

                    {/* ═══ LEFT ════════════════════════════════════════════════ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        {/* Profile hero */}
                        <Card>
                            <div style={{ background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))', padding: '1.5rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.07) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                    {/* Avatar */}
                                    <div style={{ position: 'relative', flexShrink: 0 }}>
                                        {agent.avatar
                                            ? <img src={agent.avatar} alt="" style={{ width: '4rem', height: '4rem', borderRadius: '50%', objectFit: 'cover', border: '3px solid hsl(220 30% 30%)', boxShadow: '0 4px 16px hsl(220 28% 6% / 0.4)' }} />
                                            : <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: `hsl(${hue} 50% 50%)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: '900', border: '3px solid hsl(220 30% 30%)', boxShadow: '0 4px 16px hsl(220 28% 6% / 0.4)' }}>
                                                {agent.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                                              </div>
                                        }
                                        {agent.status === 'verified' && (
                                            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '1.3rem', height: '1.3rem', borderRadius: '50%', backgroundColor: 'hsl(214 80% 50%)', border: '2.5px solid hsl(222 30% 14%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <svg style={{ width: '0.6rem', height: '0.6rem' }} fill="white" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </div>
                                        )}
                                    </div>
                                    {/* Name + meta */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h2 style={{ margin: '0 0 0.3rem', fontSize: '1.2rem', fontWeight: '900', color: 'white', letterSpacing: '-0.02em' }}>{agent.name}</h2>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                                            {agent.company && <span style={{ fontSize: '0.75rem', color: 'hsl(220 20% 68%)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Icons.building /> {agent.company}</span>}
                                            {agent.location && <span style={{ fontSize: '0.75rem', color: 'hsl(220 20% 68%)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Icons.pin /> {agent.location}</span>}
                                        </div>
                                        {/* {agent.license && (
                                            <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'hsl(214 80% 70%)', backgroundColor: 'hsl(220 25% 22%)', padding: '0.18rem 0.5rem', borderRadius: '0.3rem' }}>#{agent.license}</span>
                                        )} */}
                                    </div>
                                </div>
                            </div>

                            {/* Stats strip */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid hsl(220 15% 93%)' }}>
                                {[
                                    { label: 'Listings',    value: (rawListings || []).length,          accent: 'hsl(220 25% 15%)', isRating: false },
                                    { label: 'Active',      value: agent.active_listings ?? 0,         accent: 'hsl(152 55% 33%)', isRating: false },
                                    { label: 'Sold/Rented', value: agent.sold_count ?? 0,              accent: 'hsl(214 80% 44%)', isRating: false },
                                    { label: 'Rating',      value: agent.rating ? agent.rating : null, accent: 'hsl(40 80% 40%)',  isRating: true },
                                ].map(({ label, value, accent, isRating }, i, arr) => (
                                    <div key={label} style={{ padding: '1rem', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid hsl(220 15% 93%)' : 'none' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: accent, lineHeight: 1, marginBottom: isRating && value ? '0.25rem' : 0 }}>
                                            {isRating ? (
                                                value ? <StarRating rating={Number(value)} size="1.2rem" /> : '—'
                                            ) : (
                                                value
                                            )}
                                        </div>
                                        {!isRating && (
                                            <div style={{ fontSize: '0.64rem', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', marginTop: '0.25rem' }}>{label}</div>
                                        )}
                                        {isRating && value && (
                                            <div style={{ fontSize: '0.64rem', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', marginTop: '0.25rem' }}>
                                                {Number(value).toFixed(1)} ★
                                            </div>
                                        )}
                                        {isRating && !value && (
                                            <div style={{ fontSize: '0.64rem', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', marginTop: '0.25rem' }}>{label}</div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Contact details */}
                            <div style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                                {agent.email && (
                                    <a href={`mailto:${agent.email}`}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.4rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(214 100% 97%)', border: '1px solid hsl(214 80% 88%)', color: 'hsl(214 80% 44%)', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', transition: 'filter 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                        <Icons.mail /> {agent.email}
                                    </a>
                                )}
                                {agent.phone && (
                                    <a href={`tel:${agent.phone}`}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.4rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(152 55% 96%)', border: '1px solid hsl(152 55% 84%)', color: 'hsl(152 55% 32%)', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', transition: 'filter 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                        <Icons.phone /> {agent.phone}
                                    </a>
                                )}
                            </div>
                        </Card>

                        {/* Bio */}
                        {agent.bio && (
                            <Card>
                                <CardHead title="About" />
                                <div style={{ padding: '1rem 1.125rem' }}>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'hsl(220 15% 30%)', lineHeight: 1.75 }}>{agent.bio}</p>
                                </div>
                            </Card>
                        )}

                        {/* Recent listings */}
                        <Card>
                            <CardHead title="Listings" sub={`Showing all ${rawListings.length} listing${rawListings.length !== 1 ? 's' : ''}`} />
                            {agent.listings?.length > 0 ? (
                                <>
                                    {/* Image gallery for first few listings */}
                                    {agent.listings.length > 0 && (
                                        <div style={{ padding: '1rem 1.125rem', borderBottom: '1px solid hsl(220 15% 94%)' }}>
                                            <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)' }}>Recent Listing Images</p>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.5rem' }}>
                                                {agent.listings.slice(0, 6).map((l, index) => {
                                                    const imageUrl = resolveImage(l.images?.[0]);
                                                    return imageUrl ? (
                                                        <div key={`img-${l.id}-${index}`} style={{ position: 'relative', aspectRatio: '1', borderRadius: '0.4rem', overflow: 'hidden', backgroundColor: 'hsl(220 15% 95%)' }}>
                                                            <img
                                                                src={imageUrl}
                                                                alt={l.title ?? 'Listing'}
                                                                style={{ width: '100%', objectFit: 'cover', transition: 'transform 0.2s' }}
                                                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                                            />
                                                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '0.3rem 0.4rem' }}>
                                                                <div style={{ fontSize: '0.6rem', fontWeight: '700', color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                                                                    {l.title ? l.title.slice(0, 15) + (l.title.length > 15 ? '…' : '') : 'Untitled'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : null;
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Listing details */}
                                    {rawListings.map(l => <ListingRow key={l.id} listing={l} />)}
                                    {rawListings.length > rawListings.length && (
                                        <div style={{ padding: '0.75rem 1.125rem', textAlign: 'center' }}>
                                            <Link href={`/super-admin/listings?agent=${agent._id}`}
                                                style={{ fontSize: '0.78rem', fontWeight: '600', color: 'hsl(214 80% 44%)', textDecoration: 'none' }}>
                                                View all {rawListings.length} listings →
                                            </Link>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{ padding: '2.5rem', textAlign: 'center', color: 'hsl(220 15% 58%)' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏠</div>
                                    <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: '600' }}>No listings yet</p>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* ═══ RIGHT sidebar ═══════════════════════════════════════ */}
                    <div style={{ position: 'sticky', top: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* Record info */}
                        <Card>
                            <CardHead title="Account Info" />
                            <div style={{ padding: '0.25rem 1.125rem 0.75rem' }}>
                                <InfoRow label="Agent ID"    value={`#${agent._id}`}           mono />
                                <InfoRow label="Status"      value={stCfg.label} />
                                {/* <InfoRow label="Tier"        value={agent.tier ? agent.tier.charAt(0).toUpperCase() + agent.tier.slice(1) : '—'} /> */}
                                <InfoRow label="Company"     value={agent.company}              mono />
                                <InfoRow label="Joined"      value={fmtDate(agent.joined_at)} />
                                <InfoRow label="Last Active" value={fmtRelative(agent.last_active)} />
                                {agent.reviews_count > 0 && (
                                    <InfoRow label="Reviews" value={`${agent.reviews_count} review${agent.reviews_count !== 1 ? 's' : ''}`} />
                                )}
                            </div>
                        </Card>

                        {/* Quick actions */}
                        <Card>
                            <CardHead title="Quick Actions" />
                            <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {isPending && (
                                    <button onClick={() => setConfirmAction('verify')}
                                        style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(214 80% 86%)', backgroundColor: 'hsl(214 100% 97%)', color: 'hsl(214 80% 44%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                        <Icons.shield /> Verify Agent
                                    </button>
                                )}
                                {isActive && (
                                    <button onClick={() => setConfirmAction('suspend')}
                                        style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(0 65% 88%)', backgroundColor: 'hsl(0 65% 97%)', color: 'hsl(0 62% 46%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                        <Icons.ban /> Suspend Agent
                                    </button>
                                )}
                                {isSuspended && (
                                    <button onClick={() => setConfirmAction('reactivate')}
                                        style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(152 55% 80%)', backgroundColor: 'hsl(152 55% 96%)', color: 'hsl(152 55% 32%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                        <Icons.unlock /> Reactivate Agent
                                    </button>
                                )}
                                <button onClick={() => setConfirmAction('delete')}
                                    style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(0 65% 88%)', backgroundColor: 'hsl(0 65% 97%)', color: 'hsl(0 62% 46%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                    <Icons.trash /> Delete Agent
                                </button>
                            </div>
                        </Card>

                        {/* Last active */}
                        {agent.last_active && (
                            <Card>
                                <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'hsl(214 100% 96%)', border: '1px solid hsl(214 80% 88%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icons.clock style={{ width: '1.2rem', height: '1.2rem', color: 'hsl(214 80% 48%)' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: '0 0 0.15rem', fontSize: '0.8rem', fontWeight: '700', color: 'hsl(214 60% 35%)' }}>Last Active</p>
                                        <p style={{ margin: '0 0 0.1rem', fontSize: '0.75rem', color: 'hsl(214 50% 50%)', fontWeight: '600' }}>{fmtRelative(agent.last_active)}</p>
                                        <p style={{ margin: 0, fontSize: '0.68rem', color: 'hsl(220 15% 55%)' }}>{fmtDate(agent.last_active)}</p>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes agsSpin    { to { transform: rotate(360deg); } }
                @keyframes agsSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes agsModalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
            `}</style>
        </>
    );
};

AgentShow.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default AgentShow;