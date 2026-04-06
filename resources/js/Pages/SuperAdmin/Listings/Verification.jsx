import React, { useState } from 'react';
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
    eye:      () => <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} size="0.85rem" />,
    check:    () => <Ico d="M5 13l4 4L19 7" size="0.85rem" />,
    x:        () => <Ico d="M6 18L18 6M6 6l12 12" size="0.85rem" />,
    alert:    () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    chevD:    () => <Ico d="M19 9l-7 7-7-7" size="0.8rem" />,
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
    pending:   { label: 'Pending',   bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 30%)',  dot: 'hsl(40 80% 44%)' },
};

const TYPE_CFG = {
    sale:   { label: 'For Sale',  bg: 'hsl(152 55% 92%)', color: 'hsl(152 55% 30%)', dot: 'hsl(152 55% 42%)' },
    rent:   { label: 'For Rent',  bg: 'hsl(214 100% 95%)',color: 'hsl(214 80% 40%)', dot: 'hsl(214 80% 52%)' },
    short:  { label: 'Short Let', bg: 'hsl(270 60% 95%)', color: 'hsl(270 55% 40%)', dot: 'hsl(270 55% 52%)' },
    lease:  { label: 'Lease',     bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 32%)',  dot: 'hsl(40 80% 46%)' },
};

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

const resolveImage = (img) => {
    if (!img) return null;
    if (typeof img !== 'string') return null;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.includes('/')) return `/storage/${img}`;
    return `/storage/rental_images/${img}`;
};

const resolveImages = (raw) => {
    if (!raw) return [];
    const arr = typeof raw === 'string' ? (() => { try { return JSON.parse(raw); } catch { return []; } })() : raw;
    return (Array.isArray(arr) ? arr : []).map(resolveImage).filter(Boolean);
};

const normalise = (l) => ({
    ...l,
    _id:           l.id,
    title:         l.title         ?? l.name          ?? 'Untitled Listing',
    status_key:    'pending',
    listing_type:  (l.purpose      ?? l.listing_type  ?? l.type ?? 'sale').toLowerCase(),
    property_type: (l.property_type ?? l.category     ?? '').toLowerCase(),
    price:         l.sale_price    ?? l.rent_min      ?? l.price ?? 0,
    currency:      l.currency      ?? 'GH₵',
    location:      l.city          ?? l.area          ?? l.location ?? '—',
    agent_name:    l.user?.name    ?? l.agent_name    ?? '—',
    agent_id:      l.user?.id      ?? l.agent_id      ?? null,
    views:         l.views_count   ?? l.views         ?? 0,
    inquiries:     l.inquiries_count ?? l.inquiries   ?? 0,
    images:        resolveImages(l.images ?? l.media),
    bedrooms:      l.bedrooms      ?? null,
    bathrooms:     l.bathrooms     ?? null,
    created_at:    l.created_at    ?? '',
});

// ─── Atoms ────────────────────────────────────────────────────────────────────

const StatusBadge = ({ sk }) => {
    const cfg = STATUS_CFG[sk] ?? STATUS_CFG.pending;
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

// ─── KPI Cards ────────────────────────────────────────────────────────────────

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
            {btn(<Icons.chevR />, () => onChange(page - 1), false, page === 1)}
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
    const isReject = action === 'reject';

    const meta = {
        approve: { label: 'Approve Listing', accent: 'hsl(152 55% 32%)', accentBg: 'hsl(152 55% 93%)', icon: Icons.check, confirmBg: 'hsl(152 55% 33%)', confirmLabel: 'Approve' },
        reject:  { label: 'Reject Listing',  accent: 'hsl(0 65% 50%)',   accentBg: 'hsl(0 70% 95%)',   icon: Icons.x,     confirmBg: 'hsl(0 65% 50%)',   confirmLabel: 'Reject' },
    };
    const m = meta[action] ?? meta.reject;
    const ActionIcon = m.icon;

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.6)', backdropFilter: 'blur(5px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '420px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.15rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.28)', animation: 'lstModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ height: '4px', background: `linear-gradient(90deg, ${m.accent}, ${m.accent}88)` }} />
                <div style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.65rem', backgroundColor: m.accentBg, color: m.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <ActionIcon size="1.25rem" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: 'hsl(220 25% 15%)', lineHeight: 1.2 }}>{m.label}</h3>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'hsl(220 15% 55%)', lineHeight: 1.4 }}>
                                {action === 'approve' ? 'This will make the listing live on the platform.' : 'This will remove the listing from public view.'}
                            </p>
                        </div>
                    </div>

                    {isReject && (
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'hsl(220 25% 22%)', marginBottom: '0.5rem' }}>Reason for rejection (optional)</label>
                            <textarea
                                placeholder="Provide feedback to help the agent improve..."
                                style={{ width: '100%', minHeight: '80px', padding: '0.75rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.55rem', fontSize: '0.875rem', color: 'hsl(220 25% 18%)', backgroundColor: 'white', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                                onChange={e => setModal(prev => ({ ...prev, reason: e.target.value }))}
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <button onClick={onClose} disabled={processing}
                            style={{ padding: '0.6rem 1.25rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.55rem', backgroundColor: 'white', color: 'hsl(220 25% 28%)', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsl(220 15% 95%)'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; }}>
                            Cancel
                        </button>
                        <button onClick={onConfirm} disabled={processing}
                            style={{ padding: '0.6rem 1.25rem', border: 'none', borderRadius: '0.55rem', backgroundColor: m.confirmBg, color: 'white', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'filter 0.15s', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                            onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                            {processing && <Icons.spinner />} {m.confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Listing Row ─────────────────────────────────────────────────────────────

const ListingRow = ({ listing: raw, onAction }) => {
    const l = normalise(raw);
    const [hov, setHov] = useState(false);

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ display: 'grid', gridTemplateColumns: '2.5rem minmax(0,1fr) 10rem 9rem 8rem 8rem 7rem', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', borderBottom: '1px solid hsl(220 15% 93%)', backgroundColor: 'white', transition: 'background-color 0.15s', cursor: 'pointer' }}
            onClick={() => router.visit(`/super-admin/listings/${l._id}`)}>

            {/* Image */}
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.45rem', backgroundColor: 'hsl(220 15% 94%)', overflow: 'hidden', flexShrink: 0 }}>
                {l.images[0] ? (
                    <img src={l.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(220 15% 55%)', fontSize: '0.75rem', fontWeight: '600' }}>
                        {l.title.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            {/* Title & Meta */}
            <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'hsl(220 25% 18%)', lineHeight: 1.3, marginBottom: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {l.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'hsl(220 15% 42%)', display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                    <span>{l.location}</span>
                    <span>{l.bedrooms ? `${l.bedrooms} bed` : ''} {l.bathrooms ? `${l.bathrooms} bath` : ''}</span>
                </div>
            </div>

            {/* Agent */}
            <div style={{ fontSize: '0.8rem', color: 'hsl(220 25% 22%)', fontWeight: '600' }}>{l.agent_name}</div>

            {/* Price */}
            <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'hsl(220 25% 18%)' }}>{fmtPrice(l.price, l.currency)}</div>

            {/* Status */}
            <div><StatusBadge sk={l.status_key} /></div>

            {/* Engagement */}
            <div style={{ fontSize: '0.75rem', color: 'hsl(220 15% 42%)', display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                <span style={{ fontWeight: '600' }}>{(l.views ?? 0).toLocaleString()} <span style={{ fontWeight: '400' }}>views</span></span>
                <span style={{ fontWeight: '600' }}>{l.inquiries ?? 0} <span style={{ fontWeight: '400' }}>inq.</span></span>
            </div>

            {/* Date */}
            <div style={{ fontSize: '0.73rem', color: 'hsl(220 15% 52%)' }}>{fmtDate(l.created_at)}</div>

            {/* Actions — absolutely positioned, takes no grid space */}
            <div style={{
                position: 'absolute', right: '1.25rem', top: '50%',
                transform: hov ? 'translateY(-50%)' : 'translateY(-50%) translateX(4px)',
                display: 'flex', gap: '0.3rem', alignItems: 'center',
                opacity: hov ? 1 : 0,
                transition: 'opacity 0.15s ease, transform 0.15s ease',
                pointerEvents: hov ? 'auto' : 'none',
            }}>
                <Link href={`/super-admin/listings/${l._id}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', textDecoration: 'none', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsl(220 15% 95%)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; }}>
                    <Icons.eye />
                </Link>
                <button onClick={(e) => { e.stopPropagation(); onAction(l, 'approve'); }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(152 55% 92%)', color: 'hsl(152 55% 30%)', cursor: 'pointer', transition: 'filter 0.15s', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.check />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onAction(l, 'reject'); }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 48%)', cursor: 'pointer', transition: 'filter 0.15s', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.x />
                </button>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ListingsVerification({ listings, metrics }) {
    const [toast, setToast] = useState(null);
    const [modal, setModal] = useState(null);
    const [processing, setProcessing] = useState(false);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleAction = (listing, action) => setModal({ listing, action, reason: '' });

    const confirmAction = () => {
        const { listing, action, reason } = modal;
        setProcessing(true);
        const routeMap = {
            approve: `/super-admin/listings/${listing._id}/approve`,
            reject:  `/super-admin/listings/${listing._id}/reject`,
        };
        const data = action === 'reject' ? { reason } : {};
        router.post(routeMap[action], data, {
            preserveScroll: true,
            onSuccess: () => {
                showToast(`Listing "${listing.title}" ${action}d successfully.`);
                setModal(null);
                router.reload({ only: ['listings', 'metrics'] });
            },
            onError: () => showToast('Action failed. Please try again.', 'error'),
            onFinish: () => setProcessing(false),
        });
    };

    const normalised = listings.data.map(normalise);

    return (
        <>
            <div style={{ padding: '1.5rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '900', color: 'hsl(220 25% 15%)', letterSpacing: '-0.025em' }}>Listing Verification</h1>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '1rem', color: 'hsl(220 15% 55%)' }}>Review and approve pending listings before they go live.</p>
                </div>

                {/* KPI */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <Kpi label="Pending Listings" value={metrics.pending.toLocaleString()} sub="Awaiting review" accent="hsl(40 80% 36%)" iconBg="hsl(40 90% 93%)" iconColor="hsl(40 80% 36%)" icon={<Icons.alert />} />
                </div>

                {/* Table */}
                {normalised.length > 0 ? (
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', overflow: 'hidden', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                        {/* Header */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2.5rem minmax(0,1fr) 10rem 9rem 8rem 8rem 7rem', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1.25rem', backgroundColor: 'hsl(220 15% 97.5%)', borderBottom: '1px solid hsl(220 15% 92%)' }}>
                            <div />
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Listing</div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Agent</div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Price</div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Status</div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Engagement</div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Submitted</div>
                        </div>

                        {/* Rows */}
                        {normalised.map((l, i) => <ListingRow key={l._id} listing={l} onAction={handleAction} />)}

                        {/* Footer */}
                        <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'hsl(220 15% 98.5%)' }}>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(220 15% 50%)' }}>
                                Page <strong style={{ color: 'hsl(220 25% 22%)' }}>{listings.current_page}</strong> of <strong style={{ color: 'hsl(220 25% 22%)' }}>{listings.last_page}</strong> · {listings.total.toLocaleString()} pending listing{listings.total !== 1 ? 's' : ''}
                            </p>
                            <Pagination page={listings.current_page} total={listings.last_page} onChange={(p) => router.visit(`/super-admin/listings/verification?page=${p}`)} />
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                        <Icons.alert size="3rem" style={{ color: 'hsl(220 15% 55%)', marginBottom: '1rem' }} />
                        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: '700', color: 'hsl(220 25% 22%)' }}>No Pending Listings</h3>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'hsl(220 15% 55%)' }}>All listings have been reviewed. Check back later for new submissions.</p>
                    </div>
                )}
            </div>

            {toast && <Toast toast={toast} />}
            {modal && <ActionModal listing={modal.listing} action={modal.action} onConfirm={confirmAction} onClose={() => setModal(null)} processing={processing} />}

            <style>{`
                @keyframes lstSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes lstModalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
            `}</style>
        </>
    );
};

ListingsVerification.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;