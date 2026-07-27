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
    home:    () => <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    pin:     () => <Ico d={["M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z","M15 11a3 3 0 11-6 0 3 3 0 016 0z"]} />,
    eye:     () => <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} />,
    bed:     () => <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" size="0.9rem" />,
    user:    () => <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    phone:   () => <Ico d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
    mail:    () => <Ico d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    tag:     () => <Ico d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />,
    flag:    () => <Ico d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />,
    alert:   () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    star:    () => <Ico d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" size="0.8rem" />,
    clock:   () => <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size="0.85rem" />,
    unlock:  () => <Ico d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />,
    chevL:   () => <Ico d="M15 19l-7-7 7-7" size="0.8rem" />,
    chevR:   () => <Ico d="M9 5l7 7-7 7" size="0.8rem" />,
    spinner: () => (
        <svg style={{ width: '1rem', height: '1rem', animation: 'lsSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
    active:    { label: 'Active',    bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 28%)', dot: 'hsl(152 60% 38%)', bar: 'hsl(152 55% 42%)' },
    pending:   { label: 'Pending',   bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 30%)',  dot: 'hsl(40 80% 44%)',  bar: 'hsl(40 80% 48%)' },
    sold:      { label: 'Sold',      bg: 'hsl(214 100% 95%)',color: 'hsl(214 80% 38%)', dot: 'hsl(214 80% 50%)', bar: 'hsl(214 80% 52%)' },
    rented:    { label: 'Rented',    bg: 'hsl(270 60% 95%)', color: 'hsl(270 55% 38%)', dot: 'hsl(270 55% 50%)', bar: 'hsl(270 55% 52%)' },
    rejected:  { label: 'Rejected',  bg: 'hsl(0 70% 95%)',   color: 'hsl(0 65% 40%)',   dot: 'hsl(0 65% 50%)',   bar: 'hsl(0 65% 52%)' },
    draft:     { label: 'Draft',     bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)', bar: 'hsl(220 15% 55%)' },
    expired:   { label: 'Expired',   bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)', bar: 'hsl(220 15% 55%)' },
    flagged:   { label: 'Flagged',   bg: 'hsl(0 80% 94%)',   color: 'hsl(0 70% 38%)',   dot: 'hsl(0 70% 50%)',   bar: 'hsl(0 70% 52%)' },
    suspended: { label: 'Suspended', bg: 'hsl(0 70% 95%)',   color: 'hsl(0 65% 40%)',   dot: 'hsl(0 65% 50%)',   bar: 'hsl(0 65% 52%)' },
};

const TYPE_LABEL = { sale: 'For Sale', rent: 'For Rent', short: 'Short Let', lease: 'Lease' };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return v; }
};

const fmtPrice = (listing) => {
    const cur = listing.currency ?? 'GH₵';
    const fmt = (v) => {
        const n = Number(v);
        if (!n && n !== 0) return null;
        if (n >= 1_000_000) return `${cur}${(n / 1_000_000).toFixed(2)}M`;
        if (n >= 1_000)     return `${cur}${n.toLocaleString()}`;
        return `${cur}${n}`;
    };

    const isSale = (listing.purpose ?? '').toLowerCase() === 'sale';

    if (isSale) {
        return fmt(listing.sale_price) ?? '—';
    }

    const min = fmt(listing.rent_min);
    const max = fmt(listing.rent_max);

    if (min && max && min !== max) return `${min} – ${max}`;
    return min ?? max ?? '—';
};

const avatarHue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

const normalise = (l) => {
    const isSale = l.purpose === 'sale';

    return {
        ...l,
    purpose:          l.purpose ?? l.listing_type ?? 'rent',
    sale_price:       l.sale_price ?? null,
    rent_min:         l.rent_min ?? null,
    rent_max:         l.rent_max ?? null,
    advance_duration: l.advance_duration ?? null,
    // Unified price for display (index table, KPIs)
    price:            isSale
                        ? (l.sale_price ?? l.price ?? 0)
                        : (l.rent_min   ?? l.price ?? 0),
    _id:           l.id,
    title:         l.title          ?? l.name           ?? 'Untitled',
    status_key:    (l.status        ?? 'pending').toLowerCase(),
    listing_type:  (l.listing_type  ?? l.type           ?? 'sale').toLowerCase(),
    property_type: (l.property_type ?? l.category       ?? ''),
    currency:      l.currency       ?? 'GH₵',
    location:      l.location       ?? l.city           ?? l.area ?? '—',
    address:       l.address        ?? '',
    description:   l.description    ?? '',
    agent_name:    l.agent?.name    ?? l.agent_name     ?? '—',
    agent_email:   l.agent?.email   ?? l.agent_email    ?? '',
    agent_phone:   l.agent?.phone   ?? l.agent_phone    ?? '',
    agent_id:      l.agent?.id      ?? l.agent_id       ?? null,
    views:         l.views          ?? l.views_count    ?? 0,
    inquiries:     l.inquiries      ?? l.inquiries_count ?? 0,
    images:        l.images         ?? l.media          ?? [],
    bedrooms:      l.bedrooms       ?? l.beds           ?? null,
    bathrooms:     l.bathrooms      ?? l.baths          ?? null,
    toilets:       l.toilets        ?? null,
    area_sqft:     l.area_sqft      ?? l.floor_area     ?? null,
    is_featured:   l.is_featured    ?? l.featured       ?? false,
    featured_at:           l.featured_at           ?? null,
    featured_expires_at:   l.featured_expires_at   ?? null,
    featured_priority:     l.featured_priority     ?? 0,
    times_featured:        l.times_featured        ?? 0,
    is_featured_queued:    l.is_featured_queued    ?? false,
    featured_queue_position: l.featured_queue_position ?? null,
    queued_at:             l.queued_at             ?? null,
    last_featured_at:      l.last_featured_at      ?? null,
    is_verified:   l.is_verified    ?? l.verified       ?? false,
    amenities:     l.amenities      ?? [],
    flagged_count: l.flagged_count  ?? l.reports_count  ?? 0,
    created_at:    l.created_at     ?? '',
    updated_at:    l.updated_at     ?? '',
    is_sold: l.is_sold ?? false,
    is_rented:     l.is_rented     ?? false,
    }
};

// ─── Atoms ────────────────────────────────────────────────────────────────────

const StatusBadge = ({ sk }) => {
    const c = STATUS_CFG[sk] ?? STATUS_CFG.draft;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.06em', backgroundColor: c.bg, color: c.color }}>
            <span style={{ width: '0.38rem', height: '0.38rem', borderRadius: '50%', backgroundColor: c.dot }} />
            {c.label.toUpperCase()}
        </span>
    );
};

const Toast = ({ toast }) => toast ? (
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'lsSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {toast.type === 'error' ? <Icons.x /> : <Icons.check />}
        {toast.msg}
    </div>
) : null;

// ─── Confirm modal ────────────────────────────────────────────────────────────

const ConfirmModal = ({ action, listing, onConfirm, onClose, processing }) => {
    const meta = {
        approve:  { label: 'Approve Listing',  body: `Approve "${listing.title}"? It will go live on the platform immediately.`,                                          icon: Icons.check,  accent: 'hsl(152 55% 33%)', accentBg: 'hsl(152 55% 92%)', confirmBg: 'hsl(152 55% 33%)', confirmLabel: 'Approve',  warn: null },
        suspend:  { label: 'Suspend Listing',  body: `Suspend "${listing.title}"? It will be hidden from the platform until reactivated.`,                                icon: Icons.ban,    accent: 'hsl(0 65% 44%)',   accentBg: 'hsl(0 70% 95%)',   confirmBg: 'hsl(0 65% 50%)', confirmLabel: 'Suspend',  warn: 'The listing will be immediately hidden from all users.' },
        reject:   { label: 'Reject Listing',   body: `Reject "${listing.title}"? The agent will be notified and the listing will not be published.`,                      icon: Icons.ban,    accent: 'hsl(0 65% 44%)',   accentBg: 'hsl(0 70% 95%)',   confirmBg: 'hsl(0 65% 50%)', confirmLabel: 'Reject',   warn: null },
        delete:   { label: 'Delete Listing',   body: `Permanently delete "${listing.title}"? This removes all associated data including inquiries and images.`,           icon: Icons.trash,  accent: 'hsl(0 65% 44%)',   accentBg: 'hsl(0 70% 95%)',   confirmBg: 'hsl(0 65% 50%)', confirmLabel: 'Delete',   warn: 'This action cannot be undone.' },
        activate: { label: 'Reactivate Listing', body: `Reactivate "${listing.title}"? It will be published and visible to users again.`,                                icon: Icons.unlock, accent: 'hsl(152 55% 33%)', accentBg: 'hsl(152 55% 92%)', confirmBg: 'hsl(152 55% 33%)', confirmLabel: 'Reactivate', warn: null },
    };
    const m = meta[action] ?? meta.reject;
    const ActionIcon = m.icon;

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.65)', backdropFilter: 'blur(5px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '420px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.15rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.32)', animation: 'lsModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ height: '4px', background: `linear-gradient(90deg, ${m.accent}, ${m.accent}88)` }} />
                <div style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.75rem', backgroundColor: m.accentBg, color: m.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ActionIcon />
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 0.1rem', fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>{m.label}</h3>
                                <p style={{ margin: 0, fontSize: '0.73rem', color: 'hsl(220 15% 50%)' }}>#{listing._id}</p>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 55%)', padding: '0.2rem', display: 'flex' }}><Icons.x /></button>
                    </div>

                    <p style={{ fontSize: '0.83rem', color: 'hsl(220 15% 35%)', lineHeight: 1.65, margin: '0 0 0.875rem' }}>{m.body}</p>

                    {m.warn && (
                        <div style={{ padding: '0.6rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 65% 88%)', fontSize: '0.75rem', color: 'hsl(0 55% 38%)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                            ⚠ {m.warn}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem' }}>
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

// ─── Image gallery ────────────────────────────────────────────────────────────

const Gallery = ({ images }) => {
    const [idx, setIdx] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    
    if (!images?.length) {
        return (
            <div style={{ aspectRatio: '16/9', borderRadius: '0.875rem', backgroundColor: 'hsl(220 15% 94%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'hsl(220 15% 58%)', border: '1px solid hsl(220 15% 89%)' }}>
                <Icons.home />
                <span style={{ fontSize: '0.78rem', fontWeight: '600' }}>No images uploaded</span>
            </div>
        );
    }
    
    const prevImage = () => setIdx(i => (i - 1 + images.length) % images.length);
    const nextImage = () => setIdx(i => (i + 1) % images.length);
    
    return (
        <div>
            {/* Main image */}
            <div style={{ position: 'relative', borderRadius: '0.875rem', overflow: 'hidden', aspectRatio: '16/9', backgroundColor: 'hsl(220 15% 10%)', marginBottom: '0.65rem' }}>
                <img 
                    src={`/storage/rental_images/${images[idx]}`} 
                    alt="" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => setLightboxOpen(true)}
                />
                <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', backgroundColor: 'hsl(220 25% 8% / 0.7)', backdropFilter: 'blur(6px)', color: 'white', fontSize: '0.72rem', fontWeight: '700', padding: '0.3rem 0.65rem', borderRadius: '999px' }}>
                    {idx + 1} / {images.length}
                </div>
                {images.length > 1 && (
                    <>
                        <button onClick={prevImage}
                            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '2.1rem', height: '2.1rem', borderRadius: '50%', border: 'none', backgroundColor: 'hsl(220 25% 8% / 0.6)', backdropFilter: 'blur(6px)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 8% / 0.88)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 8% / 0.6)'}>
                            <Icons.chevL />
                        </button>
                        <button onClick={nextImage}
                            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '2.1rem', height: '2.1rem', borderRadius: '50%', border: 'none', backgroundColor: 'hsl(220 25% 8% / 0.6)', backdropFilter: 'blur(6px)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 8% / 0.88)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 8% / 0.6)'}>
                            <Icons.chevR />
                        </button>
                    </>
                )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
                <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                    {images.map((src, i) => (
                        <button key={i} onClick={() => setIdx(i)}
                            style={{ flexShrink: 0, width: '4rem', height: '3rem', borderRadius: '0.45rem', overflow: 'hidden', border: `2px solid ${i === idx ? 'hsl(220 25% 22%)' : 'transparent'}`, cursor: 'pointer', padding: 0, transition: 'border-color 0.15s', opacity: i === idx ? 1 : 0.6 }}>
                            <img src={`/storage/rental_images/${src}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {lightboxOpen && (
                <Lightbox 
                    images={images}
                    currentIndex={idx}
                    onClose={() => setLightboxOpen(false)}
                    onPrev={() => setIdx(i => (i - 1 + images.length) % images.length)}
                    onNext={() => setIdx(i => (i + 1) % images.length)}
                />
            )}
        </div>
    );
};

// ─── Info row ─────────────────────────────────────────────────────────────────

const InfoRow = ({ label, value, mono }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', padding: '0.55rem 0', borderBottom: '1px solid hsl(220 15% 95%)' }}>
        <span style={{ fontSize: '0.76rem', color: 'hsl(220 15% 52%)', flexShrink: 0 }}>{label}</span>
        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'hsl(220 25% 18%)', textAlign: 'right', fontFamily: mono ? 'monospace' : 'inherit' }}>{value ?? '—'}</span>
    </div>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────

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

// ─── Lightbox ─────────────────────────────────────────────────────────────────

const Lightbox = ({ images, currentIndex, onClose, onPrev, onNext }) => {
    if (!images?.length) return null;
    
    return (
        <div 
            onClick={onClose}
            style={{ 
                position: 'fixed', 
                inset: 0, 
                zIndex: 100, 
                backgroundColor: 'hsl(220 25% 5% / 0.92)', 
                backdropFilter: 'blur(12px)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                animation: 'lsModalIn 0.2s cubic-bezier(0.16,1,0.3,1)'
            }}
        >
            {/* Close button */}
            <button 
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'hsl(220 25% 15% / 0.6)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 101,
                    transition: 'background-color 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15% / 0.85)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15% / 0.6)'}
            >
                <Icons.x />
            </button>

            {/* Previous button */}
            {images.length > 1 && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    style={{
                        position: 'absolute',
                        left: '1.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: 'hsl(220 25% 15% / 0.6)',
                        backdropFilter: 'blur(8px)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 101,
                        transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15% / 0.85)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15% / 0.6)'}
                >
                    <Ico d="M15 19l-7-7 7-7" size="1.2rem" />
                </button>
            )}

            {/* Next button */}
            {images.length > 1 && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    style={{
                        position: 'absolute',
                        right: '1.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: 'hsl(220 25% 15% / 0.6)',
                        backdropFilter: 'blur(8px)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 101,
                        transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15% / 0.85)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15% / 0.6)'}
                >
                    <Ico d="M9 5l7 7-7 7" size="1.2rem" />
                </button>
            )}

            {/* Image */}
            <img 
                src={`/storage/rental_images/${images[currentIndex]}`}
                alt=""
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: '90vw',
                    maxHeight: '85vh',
                    objectFit: 'contain',
                    borderRadius: '0.5rem',
                    boxShadow: '0 25px 80px hsl(0 0% 0% / 0.4)',
                }}
            />

            {/* Counter */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'hsl(220 25% 15% / 0.6)',
                backdropFilter: 'blur(8px)',
                color: 'white',
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: '600',
                letterSpacing: '0.05em'
            }}>
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const ListingShow = ({ listing: rawListing, property_types = [], regions = [] }) => {
    const listing = normalise(rawListing ?? {});
    const stCfg   = STATUS_CFG[listing.status_key] ?? STATUS_CFG.draft;

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
            approve:  { method: 'post',   url: `/super-admin/listings/${listing._id}/approve` },
            suspend:  { method: 'post',   url: `/super-admin/listings/${listing._id}/suspend` },
            reject:   { method: 'post',   url: `/super-admin/listings/${listing._id}/reject` },
            activate: { method: 'post',   url: `/super-admin/listings/${listing._id}/approve` },
            delete:   { method: 'delete', url: `/super-admin/listings/${listing._id}` },
        };
        const { method, url } = routes[action];
        router[method](url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                showToast(`Listing ${action}d successfully.`);
                setConfirmAction(null);
                if (action === 'delete') {
                    router.visit('/super-admin/listings');
                } else {
                    router.reload({ only: ['listing'] });
                }
            },
            onError:  () => showToast('Action failed. Please try again.', 'error'),
            onFinish: () => setActLoading(false),
        });
    };

    const isSuspended = listing.status_key === 'suspended';
    const isPending   = listing.status_key === 'pending';
    const isActive    = listing.status_key === 'active';
    const agentHue    = avatarHue(listing.agent_name);

    return (
        <>
        <Head>
            <title>RentTrustGh</title>
        </Head>
            <Toast toast={toast} />
            {confirmAction && (
                <ConfirmModal
                    action={confirmAction}
                    listing={listing}
                    onConfirm={() => doAction(confirmAction)}
                    onClose={() => setConfirmAction(null)}
                    processing={actLoading}
                />
            )}

            <div>
                {/* ── Page header ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link href="/super-admin/listings"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                            <Icons.back /> Back
                        </Link>
                        <div>
                            <h1 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.2rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{listing.title}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <StatusBadge sk={listing.status_key} />
                                <span style={{ fontSize: '0.72rem', color: 'hsl(220 15% 52%)' }}>#{listing._id} · Added {fmtDate(listing.created_at)}</span>
                                {listing.is_featured && <span style={{ fontSize: '0.62rem', fontWeight: '800', backgroundColor: 'hsl(40 90% 93%)', color: 'hsl(40 80% 30%)', padding: '0.1rem 0.4rem', borderRadius: '0.3rem' }}>⭐ FEATURED</span>}
                                {listing.is_verified && <span style={{ fontSize: '0.62rem', fontWeight: '800', backgroundColor: 'hsl(214 100% 95%)', color: 'hsl(214 80% 38%)', padding: '0.1rem 0.4rem', borderRadius: '0.3rem' }}>✓ VERIFIED</span>}
                                {listing.is_sold && <span style={{ fontSize: '0.62rem', fontWeight: '800', backgroundColor: 'hsl(0 70% 95%)', color: 'hsl(0 70% 45%)', padding: '0.1rem 0.4rem', borderRadius: '0.3rem' }}>SOLD</span>}
                                {listing.is_rented && <span style={{ fontSize: '0.62rem', fontWeight: '800', backgroundColor: 'hsl(214 100% 95%)', color: 'hsl(214 80% 38%)', padding: '0.1rem 0.4rem', borderRadius: '0.3rem' }}>RENTED</span>}
                            </div>
                        </div>
                    </div>

                    {/* Header actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {isPending && (
                            <>
                                <button onClick={() => setConfirmAction('approve')}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '0.6rem', border: 'none', backgroundColor: 'hsl(152 55% 33%)', color: 'white', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                    <Icons.check /> Approve
                                </button>
                                <button onClick={() => setConfirmAction('reject')}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '0.6rem', border: 'none', backgroundColor: 'hsl(0 65% 50%)', color: 'white', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                    <Icons.ban /> Reject
                                </button>
                            </>
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
                            <button onClick={() => setConfirmAction('activate')}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '0.6rem', border: 'none', backgroundColor: 'hsl(152 55% 33%)', color: 'white', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                <Icons.unlock /> Reactivate
                            </button>
                        )}
                        <Link href={`/super-admin/listings/${listing._id}/edit`}
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

                    {/* ═══ LEFT ═══════════════════════════════════════════════ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        {/* Gallery */}
                        <Card>
                            <CardHead title="Photos" sub={`${listing.images.length} image${listing.images.length !== 1 ? 's' : ''}`} />
                            <div style={{ padding: '1rem' }}>
                                <Gallery images={listing.images} />
                            </div>
                        </Card>

                        {/* Description */}
                        {listing.description && (
                            <Card>
                                <CardHead title="Description" />
                                <div style={{ padding: '1rem 1.125rem' }}>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'hsl(220 15% 30%)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{listing.description}</p>
                                </div>
                            </Card>
                        )}

                        {/* Property details */}
                        <Card>
                            <CardHead title="Property Details" />
                            <div style={{ padding: '0.25rem 1.125rem 0.75rem' }}>
                                <InfoRow label="Listing Type"   value={TYPE_LABEL[listing.purpose] ?? listing.listing_type} />
                                <InfoRow label="Property Type"  value={listing.property_type ? listing.property_type.charAt(0).toUpperCase() + listing.property_type.slice(1) : null} />
                                {listing.purpose === 'sale' ? (
                                    <InfoRow label="Sale Price" value={fmtPrice(listing)} />
                                ) : (
                                    <>
                                        <InfoRow label="Rent (min)"        value={`${listing.currency ?? 'GH₵'}${Number(listing.rent_min).toLocaleString()}`} />
                                        {listing.rent_max && listing.rent_max !== listing.rent_min &&
                                            <InfoRow label="Rent (max)"    value={`${listing.currency ?? 'GH₵'}${Number(listing.rent_max).toLocaleString()}`} />
                                        }
                                        {listing.advance_duration &&
                                            <InfoRow label="Advance"       value={`${listing.advance_duration} year${listing.advance_duration !== 1 ? 's' : ''}`} />
                                        }
                                    </>
                                )}
                                <InfoRow label="Location"       value={listing.location} />
                                {listing.address && <InfoRow label="Address" value={listing.address} />}
                                {listing.bedrooms  !== null && <InfoRow label="Bedrooms"  value={listing.bedrooms} />}
                                {listing.bathrooms !== null && <InfoRow label="Bathrooms" value={listing.bathrooms} />}
                                {listing.toilets   !== null && <InfoRow label="Toilets"   value={listing.toilets} />}
                                {listing.area_sqft !== null && <InfoRow label="Floor Area" value={`${listing.area_sqft} sqft`} />}
                            </div>
                        </Card>

                        {/* Amenities */}
                        {listing.amenities?.length > 0 && (
                            <Card>
                                <CardHead title="Amenities" sub={`${listing.amenities.length} included`} />
                                <div style={{ padding: '0.875rem 1.125rem', display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                                    {listing.amenities.map((am, i) => (
                                        <span key={i} style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(220 25% 28%)', backgroundColor: 'hsl(220 15% 95%)', border: '1px solid hsl(220 15% 89%)', padding: '0.25rem 0.65rem', borderRadius: '999px' }}>
                                            {am.icon ? `${am.icon} ` : ''}{am.name ?? am}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* ═══ RIGHT sidebar ═══════════════════════════════════════ */}
                    <div style={{ position: 'sticky', top: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* Engagement stats */}
                        <Card>
                            <CardHead title="Engagement" />
                            <div style={{ padding: '0.875rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                                {[
                                    { label: 'Views',     value: (listing.views ?? 0).toLocaleString(),  accent: 'hsl(214 80% 44%)',  bg: 'hsl(214 100% 96%)' },
                                    { label: 'Inquiries', value: listing.inquiries ?? 0,                  accent: 'hsl(152 55% 33%)',  bg: 'hsl(152 55% 94%)' },
                                    { label: 'Flagged',   value: listing.flagged_count ?? 0,              accent: listing.flagged_count > 0 ? 'hsl(0 65% 44%)' : 'hsl(220 15% 42%)', bg: listing.flagged_count > 0 ? 'hsl(0 70% 96%)' : 'hsl(220 15% 96%)' },
                                    { label: 'Images',    value: listing.images.length,                   accent: 'hsl(270 55% 44%)',  bg: 'hsl(270 60% 96%)' },
                                ].map(({ label, value, accent, bg }) => (
                                    <div key={label} style={{ backgroundColor: bg, borderRadius: '0.6rem', padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.35rem', fontWeight: '900', color: accent, lineHeight: 1 }}>{value}</div>
                                        <div style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)', marginTop: '0.2rem' }}>{label}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Agent */}
                        <Card>
                            <CardHead title="Agent" />
                            <div style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                                    <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', backgroundColor: `hsl(${agentHue} 50% 88%)`, color: `hsl(${agentHue} 50% 28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800', flexShrink: 0 }}>
                                        {listing.agent_name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'hsl(220 25% 14%)' }}>{listing.agent_name}</div>
                                        {listing.agent_email && <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 52%)' }}>{listing.agent_email}</div>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    {listing.agent_email && (
                                        <a href={`mailto:${listing.agent_email}`}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'hsl(214 80% 44%)', textDecoration: 'none', padding: '0.35rem 0.65rem', borderRadius: '0.45rem', backgroundColor: 'hsl(214 100% 97%)', border: '1px solid hsl(214 80% 90%)' }}>
                                            <Icons.mail /> {listing.agent_email}
                                        </a>
                                    )}
                                    {listing.agent_phone && (
                                        <a href={`tel:${listing.agent_phone}`}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'hsl(152 55% 32%)', textDecoration: 'none', padding: '0.35rem 0.65rem', borderRadius: '0.45rem', backgroundColor: 'hsl(152 55% 96%)', border: '1px solid hsl(152 55% 84%)' }}>
                                            <Icons.phone /> {listing.agent_phone}
                                        </a>
                                    )}
                                    {listing.agent_id && (
                                        <Link href={`/super-admin/agents/${listing.agent_id}`}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'hsl(220 25% 35%)', textDecoration: 'none', padding: '0.35rem 0.65rem', borderRadius: '0.45rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'hsl(220 15% 97%)' }}>
                                            <Icons.user /> View Agent Profile
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Meta */}
                        <Card>
                            <CardHead title="Record Info" />
                            <div style={{ padding: '0.25rem 1.125rem 0.75rem' }}>
                                <InfoRow label="Listing ID"  value={`#${listing._id}`} mono />
                                <InfoRow label="Status"      value={stCfg.label} />
                                <InfoRow label="Created"     value={fmtDate(listing.created_at)} />
                                <InfoRow label="Updated"     value={fmtDate(listing.updated_at)} />
                                {listing.flagged_count > 0 && <InfoRow label="Reports" value={`${listing.flagged_count} flag${listing.flagged_count !== 1 ? 's' : ''}`} />}
                            </div>
                        </Card>

                        {/* Quick actions */}
                        <Card>
                            <CardHead title="Quick Actions" />
                            <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {isPending && (
                                    <button onClick={() => setConfirmAction('approve')}
                                        style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(152 55% 80%)', backgroundColor: 'hsl(152 55% 96%)', color: 'hsl(152 55% 32%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                        <Icons.check /> Approve Listing
                                    </button>
                                )}
                                {isPending && (
                                    <button onClick={() => setConfirmAction('reject')}
                                        style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(0 65% 88%)', backgroundColor: 'hsl(0 65% 97%)', color: 'hsl(0 62% 46%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                        <Icons.ban /> Reject Listing
                                    </button>
                                )}
                                {isActive && (
                                    <button onClick={() => setConfirmAction('suspend')}
                                        style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(0 65% 88%)', backgroundColor: 'hsl(0 65% 97%)', color: 'hsl(0 62% 46%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                        <Icons.ban /> Suspend Listing
                                    </button>
                                )}
                                {isSuspended && (
                                    <button onClick={() => setConfirmAction('activate')}
                                        style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(152 55% 80%)', backgroundColor: 'hsl(152 55% 96%)', color: 'hsl(152 55% 32%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                        <Icons.unlock /> Reactivate Listing
                                    </button>
                                )}
                                <button onClick={() => setConfirmAction('delete')}
                                    style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(0 65% 88%)', backgroundColor: 'hsl(0 65% 97%)', color: 'hsl(0 62% 46%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                    <Icons.trash /> Delete Listing
                                </button>
                            </div>
                        </Card>

                        {listing.is_featured && (
                        <Card>
                            <CardHead title="Featured Info" sub="Featured listing details" />
                            <div style={{ padding: '0.25rem 1.125rem 0.75rem' }}>
                                {listing.featured_at && (
                                    <InfoRow label="Featured Since" value={fmtDate(listing.featured_at)} />
                                )}
                                {listing.featured_expires_at && (
                                    <InfoRow label="Expires" value={fmtDate(listing.featured_expires_at)} />
                                )}
                                <InfoRow label="Priority" value={listing.featured_priority} />
                                <InfoRow label="Times Featured" value={listing.times_featured} />
                                {listing.is_featured_queued && (
                                    <InfoRow label="Queued" value="Yes" />
                                )}
                                {listing.featured_queue_position && (
                                    <InfoRow label="Queue Position" value={listing.featured_queue_position} />
                                )}
                                {listing.queued_at && (
                                    <InfoRow label="Queued At" value={fmtDate(listing.queued_at)} />
                                )}
                                {listing.last_featured_at && (
                                    <InfoRow label="Last Featured" value={fmtDate(listing.last_featured_at)} />
                                )}
                            </div>
                        </Card>
                    )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes lsSpin    { to { transform: rotate(360deg); } }
                @keyframes lsSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes lsModalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
            `}</style>
        </>
    );
};

ListingShow.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default ListingShow;