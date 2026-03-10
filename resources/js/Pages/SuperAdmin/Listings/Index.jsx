import React, { useState, useRef, useMemo } from 'react';
import { Link, router } from '@inertiajs/react';
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
    search:   () => <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    eye:      () => <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} size="0.85rem" />,
    edit:     () => <Ico d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" size="0.85rem" />,
    trash:    () => <Ico d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" size="0.85rem" />,
    check:    () => <Ico d="M5 13l4 4L19 7" size="0.85rem" />,
    x:        () => <Ico d="M6 18L18 6M6 6l12 12" size="0.85rem" />,
    ban:      () => <Ico d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" size="0.85rem" />,
    flag:     () => <Ico d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" size="0.85rem" />,
    home:     () => <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" size="1.15rem" />,
    building: () => <Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" size="1.15rem" />,
    pin:      () => <Ico d={["M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z","M15 11a3 3 0 11-6 0 3 3 0 016 0z"]} size="1.15rem" />,
    currency: () => <Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size="1.15rem" />,
    alert:    () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    chevD:    () => <Ico d="M19 9l-7 7-7-7" size="0.8rem" />,
    chevU:    () => <Ico d="M5 15l7-7 7 7" size="0.8rem" />,
    chevL:    () => <Ico d="M15 19l-7-7 7-7" size="0.8rem" />,
    chevR:    () => <Ico d="M9 5l7 7-7 7" size="0.8rem" />,
    spinner:  () => (
        <svg style={{ width: '0.95rem', height: '0.95rem', animation: 'lstSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
    active:    { label: 'Active',    bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 28%)', dot: 'hsl(152 60% 38%)' },
    pending:   { label: 'Pending',   bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 30%)',  dot: 'hsl(40 80% 44%)' },
    sold:      { label: 'Sold',      bg: 'hsl(214 100% 95%)',color: 'hsl(214 80% 38%)', dot: 'hsl(214 80% 50%)' },
    rented:    { label: 'Rented',    bg: 'hsl(270 60% 95%)', color: 'hsl(270 55% 38%)', dot: 'hsl(270 55% 50%)' },
    rejected:  { label: 'Rejected',  bg: 'hsl(0 70% 95%)',   color: 'hsl(0 65% 40%)',   dot: 'hsl(0 65% 50%)' },
    draft:     { label: 'Draft',     bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)' },
    expired:   { label: 'Expired',   bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)' },
    flagged:   { label: 'Flagged',   bg: 'hsl(0 80% 94%)',   color: 'hsl(0 70% 38%)',   dot: 'hsl(0 70% 50%)' },
    suspended: { label: 'Suspended', bg: 'hsl(0 70% 95%)',   color: 'hsl(0 65% 40%)',   dot: 'hsl(0 65% 50%)' },
};

const TYPE_CFG = {
    sale:   { label: 'For Sale',  bg: 'hsl(152 55% 92%)', color: 'hsl(152 55% 30%)', dot: 'hsl(152 55% 42%)' },
    rent:   { label: 'For Rent',  bg: 'hsl(214 100% 95%)',color: 'hsl(214 80% 40%)', dot: 'hsl(214 80% 52%)' },
    short:  { label: 'Short Let', bg: 'hsl(270 60% 95%)', color: 'hsl(270 55% 40%)', dot: 'hsl(270 55% 52%)' },
    lease:  { label: 'Lease',     bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 32%)',  dot: 'hsl(40 80% 46%)' },
};

const PROPERTY_TYPES = ['apartment','house','land','commercial','office','shop','warehouse','villa','studio'];

const SORT_COLS = ['title', 'price', 'created_at', 'views'];
const PAGE_SIZE = 12;
const STATUSES  = ['all','active','pending','sold','rented','draft','flagged','rejected','expired'];
const LISTING_TYPES = ['all','sale','rent','short','lease'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return v; }
};

const fmtPrice = (v, currency = 'GH₵') => {
    if (!v && v !== 0) return '—';
    const n = Number(v);
    if (n >= 1_000_000) return `${currency}${(n/1_000_000).toFixed(1)}M`;
    if (n >= 1_000)     return `${currency}${(n/1_000).toFixed(0)}K`;
    return `${currency}${n.toLocaleString()}`;
};

const avatarHue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

const normalise = (l) => ({
    ...l,
    _id:           l.id,
    title:         l.title         ?? l.name          ?? 'Untitled Listing',
    status_key:    (l.status       ?? 'pending').toLowerCase(),
    listing_type:  (l.listing_type ?? l.type          ?? 'sale').toLowerCase(),
    property_type: (l.property_type ?? l.category     ?? '').toLowerCase(),
    price:         l.price         ?? l.amount        ?? 0,
    currency:      l.currency      ?? 'GH₵',
    location:      l.location      ?? l.city          ?? l.area ?? '—',
    agent_name:    l.agent?.name   ?? l.agent_name    ?? '—',
    agent_id:      l.agent?.id     ?? l.agent_id      ?? null,
    views:         l.views         ?? l.views_count   ?? 0,
    inquiries:     l.inquiries     ?? l.inquiries_count ?? 0,
    images:        l.images        ?? l.media         ?? [],
    bedrooms:      l.bedrooms      ?? l.beds          ?? null,
    bathrooms:     l.bathrooms     ?? l.baths         ?? null,
    area_sqft:     l.area_sqft     ?? l.floor_area    ?? null,
    is_featured:   l.is_featured   ?? l.featured      ?? false,
    is_verified:   l.is_verified   ?? l.verified      ?? false,
    created_at:    l.created_at    ?? '',
    flagged_count: l.flagged_count ?? l.reports_count ?? 0,
});

// ─── Atoms ────────────────────────────────────────────────────────────────────

const StatusBadge = ({ sk }) => {
    const cfg = STATUS_CFG[sk] ?? STATUS_CFG.draft;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.52rem', borderRadius: '999px', fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.06em', backgroundColor: cfg.bg, color: cfg.color, whiteSpace: 'nowrap' }}>
            <span style={{ width: '0.33rem', height: '0.33rem', borderRadius: '50%', backgroundColor: cfg.dot, flexShrink: 0 }} />
            {cfg.label.toUpperCase()}
        </span>
    );
};

const TypeBadge = ({ lt }) => {
    const cfg = TYPE_CFG[(lt ?? '').toLowerCase()] ?? TYPE_CFG.sale;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.18rem 0.48rem', borderRadius: '999px', fontSize: '0.6rem', fontWeight: '800', letterSpacing: '0.07em', backgroundColor: cfg.bg, color: cfg.color, whiteSpace: 'nowrap' }}>
            <span style={{ width: '0.3rem', height: '0.3rem', borderRadius: '50%', backgroundColor: cfg.dot }} />
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
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'lstSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

// ─── Action confirm modal ─────────────────────────────────────────────────────

const ActionModal = ({ listing, action, onConfirm, onClose, processing }) => {
    const isDelete   = action === 'delete';
    const isFeatured = action === 'feature';
    const isApprove  = action === 'approve';
    const isReject   = action === 'reject';
    const isSuspend  = action === 'suspend';

    const meta = {
        delete:  { label: 'Delete Listing',      accent: 'hsl(0 65% 50%)',   accentBg: 'hsl(0 70% 95%)',   icon: Icons.trash,   confirmBg: 'hsl(0 65% 50%)',   confirmLabel: 'Delete' },
        feature: { label: listing?.is_featured ? 'Remove Featured' : 'Mark as Featured', accent: 'hsl(40 80% 36%)', accentBg: 'hsl(40 90% 94%)', icon: Icons.check, confirmBg: 'hsl(40 80% 40%)', confirmLabel: listing?.is_featured ? 'Remove' : 'Feature It' },
        approve: { label: 'Approve Listing',     accent: 'hsl(152 55% 32%)', accentBg: 'hsl(152 55% 93%)', icon: Icons.check,   confirmBg: 'hsl(152 55% 33%)', confirmLabel: 'Approve' },
        reject:  { label: 'Reject Listing',      accent: 'hsl(0 65% 50%)',   accentBg: 'hsl(0 70% 95%)',   icon: Icons.ban,     confirmBg: 'hsl(0 65% 50%)',   confirmLabel: 'Reject' },
        suspend: { label: 'Suspend Listing',     accent: 'hsl(0 65% 50%)',   accentBg: 'hsl(0 70% 95%)',   icon: Icons.ban,     confirmBg: 'hsl(0 65% 50%)',   confirmLabel: 'Suspend' },
    };
    const m = meta[action] ?? meta.reject;
    const ActionIcon = m.icon;

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.6)', backdropFilter: 'blur(5px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '420px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.15rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.28)', animation: 'lstModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ height: '4px', background: `linear-gradient(90deg, ${m.accent}, ${m.accent}88)` }} />
                <div style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
                        <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.75rem', backgroundColor: m.accentBg, color: m.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ActionIcon /></div>
                        <div>
                            <h3 style={{ margin: '0 0 0.1rem', fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>{m.label}</h3>
                            <p style={{ margin: 0, fontSize: '0.73rem', color: 'hsl(220 15% 50%)' }}>This action will update the listing status</p>
                        </div>
                    </div>

                    {/* Listing preview */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.875rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 15% 97%)', border: '1px solid hsl(220 15% 91%)', marginBottom: '1.1rem' }}>
                        <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.55rem', backgroundColor: 'hsl(220 15% 90%)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(220 15% 55%)' }}>
                            {listing?.images?.[0] ? <img src={listing.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icons.home />}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'hsl(220 25% 15%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing?.title}</div>
                            <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 52%)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem', flexWrap: 'wrap' }}>
                                <StatusBadge sk={listing?.status_key} />
                                <span>{listing?.location}</span>
                            </div>
                        </div>
                    </div>

                    {isDelete && (
                        <div style={{ padding: '0.65rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(0 70% 96%)', border: '1px solid hsl(0 65% 88%)', fontSize: '0.76rem', color: 'hsl(0 65% 40%)', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', lineHeight: 1.5 }}>
                            <span style={{ display: 'flex', flexShrink: 0, marginTop: '0.05rem' }}><Icons.alert /></span>
                            This will permanently delete the listing and all associated data. This cannot be undone.
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.5rem' }}>
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

// ─── Listing row ──────────────────────────────────────────────────────────────

const ListingRow = ({ listing: l, index, onAction }) => {
    const [hov, setHov] = useState(false);
    const cfg     = STATUS_CFG[l.status_key] ?? STATUS_CFG.draft;
    const typeCfg = TYPE_CFG[(l.listing_type ?? '').toLowerCase()] ?? TYPE_CFG.sale;

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ display: 'grid', gridTemplateColumns: '2.5rem minmax(0,1fr) 10rem 9rem 8rem 8rem 7rem auto', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', borderBottom: '1px solid hsl(220 15% 95%)', backgroundColor: hov ? 'hsl(220 20% 98.5%)' : 'white', transition: 'background-color 0.12s', animation: `lstRowIn 0.3s ease ${Math.min(index, 15) * 0.025}s both` }}>

            {/* Thumbnail */}
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', backgroundColor: 'hsl(220 15% 91%)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(220 15% 55%)' }}>
                {l.images?.[0]
                    ? <img src={l.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <Icons.home />}
            </div>

            {/* Title + meta */}
            <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.22rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.865rem', fontWeight: '700', color: 'hsl(220 25% 14%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '18rem' }}>{l.title}</span>
                    {l.is_featured && <span style={{ fontSize: '0.6rem', fontWeight: '800', backgroundColor: 'hsl(40 90% 93%)', color: 'hsl(40 80% 30%)', padding: '0.08rem 0.35rem', borderRadius: '0.25rem', letterSpacing: '0.05em' }}>⭐ FEAT</span>}
                    {l.is_verified && <span style={{ fontSize: '0.6rem', fontWeight: '800', backgroundColor: 'hsl(214 100% 95%)', color: 'hsl(214 80% 38%)', padding: '0.08rem 0.35rem', borderRadius: '0.25rem', letterSpacing: '0.05em' }}>✓ VER</span>}
                    {l.flagged_count > 0 && <span style={{ fontSize: '0.6rem', fontWeight: '800', backgroundColor: 'hsl(0 80% 95%)', color: 'hsl(0 70% 40%)', padding: '0.08rem 0.35rem', borderRadius: '0.25rem', letterSpacing: '0.05em' }}>🚩 {l.flagged_count}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', color: 'hsl(220 15% 50%)' }}>📍 {l.location}</span>
                    {l.property_type && <span style={{ fontSize: '0.66rem', color: 'hsl(220 15% 60%)', textTransform: 'capitalize' }}>· {l.property_type}</span>}
                    {l.bedrooms && <span style={{ fontSize: '0.66rem', color: 'hsl(220 15% 60%)' }}>· {l.bedrooms}bd</span>}
                    {l.bathrooms && <span style={{ fontSize: '0.66rem', color: 'hsl(220 15% 60%)' }}>{l.bathrooms}ba</span>}
                </div>
            </div>

            {/* Agent */}
            <div style={{ minWidth: 0 }}>
                {l.agent_id ? (
                    <Link href={`/super-admin/agents/${l.agent_id}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', textDecoration: 'none' }}>
                        <div style={{ width: '1.65rem', height: '1.65rem', borderRadius: '50%', backgroundColor: `hsl(${avatarHue(l.agent_name)} 50% 88%)`, color: `hsl(${avatarHue(l.agent_name)} 50% 32%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: '800', flexShrink: 0 }}>
                            {l.agent_name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'hsl(214 80% 44%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.agent_name}</span>
                    </Link>
                ) : (
                    <span style={{ fontSize: '0.75rem', color: 'hsl(220 15% 55%)', fontStyle: 'italic' }}>Unassigned</span>
                )}
            </div>

            {/* Price */}
            <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'hsl(220 25% 15%)' }}>{fmtPrice(l.price, l.currency)}</div>
                <TypeBadge lt={l.listing_type} />
            </div>

            {/* Status */}
            <div><StatusBadge sk={l.status_key} /></div>

            {/* Stats */}
            <div>
                <div style={{ fontSize: '0.75rem', color: 'hsl(220 15% 42%)', display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                    <span style={{ fontWeight: '600' }}>{(l.views ?? 0).toLocaleString()} <span style={{ fontWeight: '400' }}>views</span></span>
                    <span style={{ fontWeight: '600' }}>{l.inquiries ?? 0} <span style={{ fontWeight: '400' }}>inq.</span></span>
                </div>
            </div>

            {/* Date */}
            <div style={{ fontSize: '0.73rem', color: 'hsl(220 15% 52%)' }}>{fmtDate(l.created_at)}</div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                <Link href={`/super-admin/listings/${l._id}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', textDecoration: 'none', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsl(220 15% 95%)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; }}>
                    <Icons.eye />
                </Link>
                <Link href={`/super-admin/listings/${l._id}/edit`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(214 100% 95%)', color: 'hsl(214 80% 42%)', textDecoration: 'none', transition: 'filter 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.edit />
                </Link>
                {/* Contextual action */}
                {l.status_key === 'pending' && (
                    <button onClick={() => onAction(l, 'approve')}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(152 55% 92%)', color: 'hsl(152 55% 30%)', cursor: 'pointer', transition: 'filter 0.15s', fontFamily: 'inherit' }}
                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                        <Icons.check />
                    </button>
                )}
                {(l.status_key === 'pending' || l.status_key === 'active') && (
                    <button onClick={() => onAction(l, l.status_key === 'pending' ? 'reject' : 'suspend')}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 48%)', cursor: 'pointer', transition: 'filter 0.15s', fontFamily: 'inherit' }}
                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                        <Icons.ban />
                    </button>
                )}
                <button onClick={() => onAction(l, 'delete')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 48%)', cursor: 'pointer', transition: 'filter 0.15s', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.trash />
                </button>
            </div>
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const ListingsIndex = ({ listings: rawListings = [], property_types: propTypes = [] }) => {
    const listings    = useMemo(() => rawListings.map(normalise), [rawListings]);

    const [search,      setSearch]      = useState('');
    const [status,      setStatus]      = useState('all');
    const [lstType,     setLstType]     = useState('all');
    const [propType,    setPropType]    = useState('all');
    const [sortCol,     setSortCol]     = useState('created_at');
    const [sortDir,     setSortDir]     = useState('desc');
    const [page,        setPage]        = useState(1);
    const [modal,       setModal]       = useState(null); // { listing, action }
    const [processing,  setProcessing]  = useState(false);
    const [toast,       setToast]       = useState(null);
    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const toggleSort = (col) => {
        if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortCol(col); setSortDir('desc'); }
        setPage(1);
    };

    const allPropTypes = useMemo(() => {
        const from = listings.map(l => l.property_type).filter(Boolean);
        return [...new Set([...propTypes, ...from])].sort();
    }, [listings, propTypes]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return listings
            .filter(l => {
                const okQ    = !q || l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q) || l.agent_name.toLowerCase().includes(q);
                const okSt   = status   === 'all' || l.status_key    === status;
                const okLt   = lstType  === 'all' || l.listing_type  === lstType;
                const okPt   = propType === 'all' || l.property_type === propType;
                return okQ && okSt && okLt && okPt;
            })
            .sort((a, b) => {
                let av = a[sortCol], bv = b[sortCol];
                if (sortCol === 'created_at') { av = new Date(av); bv = new Date(bv); }
                if (sortCol === 'price' || sortCol === 'views') { av = Number(av); bv = Number(bv); }
                if (typeof av === 'string') av = av.toLowerCase();
                if (typeof bv === 'string') bv = bv.toLowerCase();
                return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
            });
    }, [listings, search, status, lstType, propType, sortCol, sortDir]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleAction = (listing, action) => setModal({ listing, action });

    const confirmAction = () => {
        const { listing, action } = modal;
        setProcessing(true);

        const routeMap = {
            approve: `/super-admin/listings/${listing._id}/approve`,
            reject:  `/super-admin/listings/${listing._id}/reject`,
            suspend: `/super-admin/listings/${listing._id}/suspend`,
            delete:  `/super-admin/listings/${listing._id}`,
        };

        const method = action === 'delete' ? 'delete' : 'post';

        router[method](routeMap[action], {}, {
            preserveScroll: true,
            onSuccess: () => {
                showToast(`Listing "${listing.title}" ${action}d successfully.`);
                setModal(null);
                router.reload({ only: ['listings'] });
            },
            onError: () => showToast('Action failed. Please try again.', 'error'),
            onFinish: () => setProcessing(false),
        });
    };

    // KPIs
    const activeCount  = listings.filter(l => l.status_key === 'active').length;
    const pendingCount = listings.filter(l => l.status_key === 'pending').length;
    const flaggedCount = listings.filter(l => l.flagged_count > 0).length;
    const totalRevenue = listings.filter(l => l.status_key === 'sold' || l.status_key === 'rented').length;

    const SortTh = ({ col, label }) => {
        const active = sortCol === col;
        return (
            <button onClick={() => toggleSort(col)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: active ? 'hsl(220 25% 20%)' : 'hsl(220 15% 48%)', padding: 0, fontFamily: 'inherit' }}>
                {label}
                {active ? (sortDir === 'asc' ? <Icons.chevU /> : <Icons.chevD />) : <Icons.chevD />}
            </button>
        );
    };

    const hasFilters = search || status !== 'all' || lstType !== 'all' || propType !== 'all';

    return (
        <>
            <Toast toast={toast} />
            {modal && (
                <ActionModal
                    listing={modal.listing}
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
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.22rem', letterSpacing: '-0.02em' }}>Listings</h1>
                        <p style={{ fontSize: '0.82rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                            {listings.length.toLocaleString()} total · {activeCount} active · {pendingCount} pending review
                        </p>
                    </div>
                    <Link href="/super-admin/listings/create"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.625rem 1.2rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 25% 15%)', color: 'white', fontWeight: '700', fontSize: '0.875rem', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'}>
                        + Add Listing
                    </Link>
                </div>

                {/* ── KPI strip ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <Kpi label="Total Listings"  value={listings.length.toLocaleString()} sub="All records"        accent="hsl(220 25% 15%)"  iconBg="hsl(220 20% 93%)"   iconColor="hsl(220 25% 30%)" icon={<Icons.building />} />
                    <Kpi label="Active"          value={activeCount.toLocaleString()}      sub="Live on platform"  accent="hsl(152 55% 33%)"  iconBg="hsl(152 55% 92%)"  iconColor="hsl(152 55% 35%)" icon={<Icons.check />} />
                    <Kpi label="Pending Review"  value={pendingCount.toLocaleString()}     sub="Awaiting approval" accent="hsl(40 80% 36%)"   iconBg="hsl(40 90% 93%)"   iconColor="hsl(40 80% 36%)"  icon={<Icons.alert />} />
                    <Kpi label="Flagged"         value={flaggedCount.toLocaleString()}     sub="Need attention"    accent="hsl(0 65% 44%)"    iconBg="hsl(0 70% 95%)"    iconColor="hsl(0 65% 44%)"   icon={<Icons.flag />} />
                </div>

                {/* ── Toolbar ── */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '0.875rem 1.1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {/* Search */}
                        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 0 }}>
                            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)', pointerEvents: 'none', display: 'flex' }}><Icons.search /></span>
                            <input type="text" placeholder="Search title, location, agent…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                                style={{ width: '100%', padding: '0.52rem 0.75rem 0.52rem 2.25rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.55rem', fontSize: '0.855rem', color: 'hsl(220 25% 18%)', backgroundColor: 'hsl(220 15% 98.5%)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
                                onFocus={e => e.target.style.borderColor = 'hsl(220 60% 60%)'}
                                onBlur={e => e.target.style.borderColor = 'hsl(220 15% 88%)'} />
                        </div>

                        {/* Property type dropdown */}
                        {allPropTypes.length > 0 && (
                            <select value={propType} onChange={e => { setPropType(e.target.value); setPage(1); }}
                                style={{ padding: '0.52rem 0.875rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.55rem', fontSize: '0.82rem', color: 'hsl(220 25% 22%)', backgroundColor: 'white', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
                                <option value="all">All Property Types</option>
                                {allPropTypes.map(pt => <option key={pt} value={pt} style={{ textTransform: 'capitalize' }}>{pt.charAt(0).toUpperCase() + pt.slice(1)}</option>)}
                            </select>
                        )}

                        {hasFilters && (
                            <button onClick={() => { setSearch(''); setStatus('all'); setLstType('all'); setPropType('all'); setPage(1); }}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.7rem', borderRadius: '999px', border: '1px solid hsl(220 15% 86%)', backgroundColor: 'hsl(220 15% 96%)', color: 'hsl(220 15% 44%)', fontSize: '0.73rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                                <Icons.x /> Clear
                            </button>
                        )}

                        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'hsl(220 15% 52%)', whiteSpace: 'nowrap' }}>{filtered.length.toLocaleString()} result{filtered.length !== 1 ? 's' : ''}</span>
                    </div>

                    {/* Pill filters — status */}
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'hsl(220 15% 52%)', marginRight: '0.2rem' }}>Status:</span>
                        {STATUSES.map(s => {
                            const a   = status === s;
                            const cfg = STATUS_CFG[s];
                            return <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                                style={{ padding: '0.3rem 0.65rem', borderRadius: '999px', border: `1.5px solid ${a ? (cfg?.dot ?? 'hsl(220 25% 20%)') : 'hsl(220 15% 88%)'}`, fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', backgroundColor: a ? (cfg?.bg ?? 'hsl(220 25% 15%)') : 'transparent', color: a ? (cfg?.color ?? 'white') : 'hsl(220 15% 48%)' }}>
                                {s === 'all' ? 'All' : (cfg?.label ?? s)}
                            </button>;
                        })}
                    </div>

                    {/* Pill filters — listing type */}
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'hsl(220 15% 52%)', marginRight: '0.2rem' }}>Type:</span>
                        {LISTING_TYPES.map(t => {
                            const a   = lstType === t;
                            const cfg = TYPE_CFG[t];
                            return <button key={t} onClick={() => { setLstType(t); setPage(1); }}
                                style={{ padding: '0.3rem 0.65rem', borderRadius: '999px', border: `1.5px solid ${a ? (cfg?.dot ?? 'hsl(220 25% 20%)') : 'hsl(220 15% 88%)'}`, fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', backgroundColor: a ? (cfg?.bg ?? 'hsl(220 25% 15%)') : 'transparent', color: a ? (cfg?.color ?? 'white') : 'hsl(220 15% 48%)' }}>
                                {t === 'all' ? 'All Types' : (cfg?.label ?? t)}
                            </button>;
                        })}
                    </div>
                </div>

                {/* ── Table ── */}
                {paginated.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px dashed hsl(220 15% 86%)' }}>
                        <div style={{ fontSize: '2.75rem', marginBottom: '0.875rem' }}>🏠</div>
                        <p style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: '700', color: 'hsl(220 25% 22%)' }}>{search ? 'No listings found' : 'No listings yet'}</p>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'hsl(220 15% 55%)' }}>{search ? 'Try adjusting your search or filters.' : 'Listings submitted by agents will appear here.'}</p>
                    </div>
                ) : (
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>
                        {/* Header */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2.5rem minmax(0,1fr) 10rem 9rem 8rem 8rem 7rem auto', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1.25rem', backgroundColor: 'hsl(220 15% 97.5%)', borderBottom: '1px solid hsl(220 15% 92%)' }}>
                            <div />
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}><SortTh col="title" label="Listing" /></div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Agent</div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}><SortTh col="price" label="Price" /></div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Status</div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}><SortTh col="views" label="Engagement" /></div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}><SortTh col="created_at" label="Added" /></div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Actions</div>
                        </div>

                        {/* Rows */}
                        {paginated.map((l, i) => <ListingRow key={l._id} listing={l} index={i} onAction={handleAction} />)}

                        {/* Footer */}
                        <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'hsl(220 15% 98.5%)' }}>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(220 15% 50%)' }}>
                                Page <strong style={{ color: 'hsl(220 25% 22%)' }}>{page}</strong> of <strong style={{ color: 'hsl(220 25% 22%)' }}>{totalPages}</strong> · {filtered.length.toLocaleString()} result{filtered.length !== 1 ? 's' : ''}
                            </p>
                            <Pagination page={page} total={totalPages} onChange={setPage} />
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes lstSpin    { to { transform: rotate(360deg); } }
                @keyframes lstSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes lstModalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes lstRowIn   { from { opacity:0; transform:translateX(-4px); } to { opacity:1; transform:translateX(0); } }
            `}</style>
        </>
    );
};

ListingsIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default ListingsIndex;