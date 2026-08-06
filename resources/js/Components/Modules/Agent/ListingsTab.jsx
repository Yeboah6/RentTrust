import { useState, useMemo } from 'react';

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
    plus:       <Ico d="M12 4v16m8-8H4" />,
    search:     <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    eye:        <Ico d={['M15 12a3 3 0 11-6 0 3 3 0 016 0z','M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z']} />,
    edit:       <Ico d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />,
    check:      <Ico d="M5 13l4 4L19 7" />,
    clock:      <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    alert:      <Ico d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    mapPin:     <Ico d={['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z','M15 11a3 3 0 11-6 0 3 3 0 016 0z']} size="0.78rem" />,
    dollar:     <Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    verify:     <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    sparkles:   <Ico d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
    x:          <Ico d="M6 18L18 6M6 6l12 12" size="0.8rem" />,
    tag:        <Ico d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />,
    chevronLeft:  <Ico d="M15 19l-7-7 7-7" />,
    chevronRight: <Ico d="M9 5l7 7-7 7" />,
    empty:      <Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" size="2.5rem" sw={1.2} />,
};

// ─── Availability Badge ─────────────────────────────────────────────────────────
// Reflects `rentals.status` (active/inactive/rented/sold) — i.e. whether the
// property is currently on the market. Nothing to do with agent verification.
const AVAILABILITY_CFG = {
    active:   { bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 35%)', icon: Icons.check, label: 'Active' },
    inactive: { bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 45%)', icon: Icons.alert, label: 'Inactive' },
    rented:   { bg: 'hsl(271 60% 93%)', color: 'hsl(271 60% 40%)', icon: Icons.check, label: 'Rented' },
    sold:     { bg: 'hsl(220 15% 93%)', color: 'hsl(220 25% 35%)', icon: Icons.check, label: 'Sold' },
};
const AVAILABILITY_STATUSES = ['all', 'active', 'inactive', 'rented', 'sold'];

const AvailabilityBadge = ({ status }) => {
    const cfg = AVAILABILITY_CFG[status] || AVAILABILITY_CFG.inactive;
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

// ─── Verification Badge ──────────────────────────────────────────────────────
const VERIFICATION_CFG = {
    approved:   { bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 35%)', icon: Icons.check, label: 'Approved' },
    pending:    { bg: 'hsl(38 92% 93%)',  color: 'hsl(38 92% 40%)',  icon: Icons.clock, label: 'Pending Review' },
    rejected:   { bg: 'hsl(0 72% 93%)',   color: 'hsl(0 72% 45%)',   icon: Icons.alert, label: 'Rejected' },
    unverified: { bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 45%)', icon: Icons.alert, label: 'Unverified' },
};
const VERIFICATION_STATUSES = ['all', 'pending', 'approved', 'rejected', 'unverified'];

const VerificationBadge = ({ status }) => {
    const cfg = VERIFICATION_CFG[status] || VERIFICATION_CFG.unverified;
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

// ─── Featured Badge ───────────────────────────────────────────────────────────
const FeaturedBadge = () => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
        padding: '0.18rem 0.55rem', borderRadius: 999,
        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
        backgroundColor: 'hsl(38 92% 50% / 0.12)',
        color: 'hsl(38 92% 35%)',
        border: '1px solid hsl(38 92% 50% / 0.3)',
        flexShrink: 0,
    }}>
        {Icons.sparkles}
        Featured
    </span>
);

const SoldBadge = () => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
        padding: '0.18rem 0.55rem', borderRadius: 999,
        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
        backgroundColor: 'hsl(0 70% 45% / 0.12)',
        color: 'hsl(0 70% 45%)',
        border: '1px solid hsl(0 70% 45% / 0.3)',
        flexShrink: 0,
    }}>
        {Icons.tag} Sold
    </span>
);

const RentedBadge = () => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
        padding: '0.18rem 0.55rem', borderRadius: 999,
        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
        backgroundColor: 'hsl(0 70% 45% / 0.12)',
        color: 'hsl(0 70% 45%)',
        border: '1px solid hsl(0 70% 45% / 0.3)',
        flexShrink: 0,
    }}>
        {Icons.tag} Rented
    </span>
);

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
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.375rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: currentPage === 1 ? 'hsl(220 15% 70%)' : 'hsl(220 25% 35%)', cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, transition: 'all 0.12s' }}>
                {Icons.chevronLeft}
            </button>

            {start > 1 && (
                <>
                    <button onClick={() => onPageChange(1)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.375rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>1</button>
                    {start > 2 && <span style={{ color: 'hsl(220 15% 60%)', fontSize: '0.75rem', padding: '0 0.25rem' }}>...</span>}
                </>
            )}

            {pages.map(page => (
                <button key={page} onClick={() => onPageChange(page)}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.375rem', border: page === currentPage ? 'none' : '1px solid hsl(220 15% 88%)', backgroundColor: page === currentPage ? 'hsl(174 62% 32%)' : 'white', color: page === currentPage ? 'white' : 'hsl(220 25% 35%)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s' }}
                    onMouseEnter={e => { if (page !== currentPage) e.currentTarget.style.backgroundColor = 'hsl(220 15% 95%)'; }}
                    onMouseLeave={e => { if (page !== currentPage) e.currentTarget.style.backgroundColor = 'white'; }}
                >{page}</button>
            ))}

            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <span style={{ color: 'hsl(220 15% 60%)', fontSize: '0.75rem', padding: '0 0.25rem' }}>...</span>}
                    <button onClick={() => onPageChange(totalPages)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.375rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{totalPages}</button>
                </>
            )}

            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.375rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: currentPage === totalPages ? 'hsl(220 15% 70%)' : 'hsl(220 25% 35%)', cursor: currentPage === totalPages ? 'default' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, transition: 'all 0.12s' }}>
                {Icons.chevronRight}
            </button>
        </div>
    );
};

const ITEMS_PER_PAGE = 9;

const toBool = (v) => v === true || v === 1 || v === '1';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtPrice = (property) => {
    if (property.purpose === 'sale') {
        return {
            text: `GH₵${Math.round(property.sale_price || 0).toLocaleString()}`,
            color: 'hsl(38 92% 45%)'
        };
    }
    return {
        text: `GH₵${Math.round(property.rent_min || 0).toLocaleString()} – GH₵${Math.round(property.rent_max || 0).toLocaleString()}`,
        sub: '/ month',
        color: 'hsl(174 62% 32%)'
    };
};

const buildLatestVerificationMap = (records = []) => {
    const map = new Map();
    records.forEach((record) => {
        const existing = map.get(record.listing_id);
        if (!existing || new Date(record.created_at) > new Date(existing.created_at)) {
            map.set(record.listing_id, record);
        }
    });
    return map;
};

// ─── Feature state logic ──────────────────────────────────────────────────────
const getFeatureState = (property) => {
    const isFeatured = toBool(property.is_featured);
    const isQueued = toBool(property.is_featured_queued);
    const timesFeatured = property.times_featured ?? 0;
    const maxFeatured = property.max_times_featured ?? 3;
    const featuredAt = property.featured_at;
    const featuredEndsAt = property.featured_ends_at;
    const now = new Date();

    if (isFeatured && featuredAt) {
        const endDate = featuredEndsAt
            ? new Date(featuredEndsAt)
            : new Date(new Date(featuredAt).getTime() + 48 * 60 * 60 * 1000);
        if (now < endDate) {
            const hoursLeft = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60)));
            return {
                canRequest: false,
                label: `Featured (${hoursLeft}h left)`,
                disabled: true,
                tooltip: `Listing is featured for another ${hoursLeft} hours`,
                icon: Icons.clock,
            };
        }
    }

    if (isQueued) {
        return {
            canRequest: false,
            label: `In Queue #${property.featured_queue_position ?? '?'}`,
            disabled: true,
            tooltip: 'Your listing is waiting to be featured',
            icon: Icons.clock,
        };
    }

    if (timesFeatured >= maxFeatured) {
        return {
            canRequest: false,
            label: 'Max Featured',
            disabled: true,
            tooltip: `Already featured ${maxFeatured} times`,
            icon: Icons.sparkles,
        };
    }

    return {
        canRequest: true,
        label: 'Request Feature',
        disabled: false,
        tooltip: 'Get more visibility! Featured listings appear at the top for 48 hours.',
        icon: Icons.sparkles,
    };
};

// ─── Feature Confirmation Modal ───────────────────────────────────────────────
const FeatureConfirmModal = ({ property, onClose, onConfirm, loading }) => {
    if (!property) return null;

    const featureEnds = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const slotsInfo = "If slots are full, your listing will be queued and featured when a slot opens.";

    return (
        <div onClick={onClose} style={{
            position: 'fixed', inset: 0, zIndex: 100,
            backgroundColor: 'hsla(222, 28%, 8%, 0.65)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div onClick={e => e.stopPropagation()} style={{
                width: '100%', maxWidth: '420px', margin: '1rem',
                backgroundColor: 'white', borderRadius: '1rem', overflow: 'hidden',
                boxShadow: '0 20px 60px hsla(220, 28%, 6%, 0.3)',
                animation: 'leModalIn 0.2s ease'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.25rem 1.5rem', borderBottom: '1px solid hsl(220 15% 90%)',
                    display: 'flex', alignItems: 'center', gap: '0.75rem'
                }}>
                    <span style={{ color: 'hsl(38 92% 45%)', fontSize: '1.5rem' }}>⭐</span>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'hsl(220 25% 15%)' }}>
                            Request Featured Listing
                        </h3>
                        <p style={{ margin: '0.1rem 0 0', fontSize: '0.78rem', color: 'hsl(220 15% 45%)' }}>
                            for {property.title}
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{
                        display: 'flex', flexDirection: 'column', gap: '0.75rem',
                        fontSize: '0.82rem', color: 'hsl(220 15% 35%)', lineHeight: 1.6
                    }}>
                        <p style={{ margin: 0 }}>
                            Featured listings are highlighted in search results and the featured section.
                            They stay at the top for <strong>48 hours</strong> and receive more visibility.
                        </p>
                        <div style={{
                            backgroundColor: 'hsl(38 92% 50% / 0.08)',
                            border: '1px solid hsl(38 92% 50% / 0.2)',
                            padding: '0.75rem', borderRadius: '0.5rem',
                            display: 'flex', alignItems: 'flex-start', gap: '0.5rem'
                        }}>
                            <span style={{ marginTop: '0.15rem' }}>ℹ️</span>
                            <span>{slotsInfo}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(220 15% 50%)' }}>
                            Feature period: now → {featureEnds.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '1rem 1.5rem', borderTop: '1px solid hsl(220 15% 90%)',
                    display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'
                }}>
                    <button onClick={onClose} disabled={loading}
                        style={{
                            padding: '0.5rem 1rem', borderRadius: '0.5rem',
                            border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                            color: 'hsl(220 25% 30%)', fontSize: '0.8rem', fontWeight: 600,
                            cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit'
                        }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={loading}
                        style={{
                            padding: '0.5rem 1rem', borderRadius: '0.5rem',
                            border: 'none', backgroundColor: loading ? 'hsl(220 25% 55%)' : 'hsl(38 92% 45%)',
                            color: 'white', fontSize: '0.8rem', fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                            display: 'flex', alignItems: 'center', gap: '0.35rem'
                        }}>
                        {loading ? (
                            <><span style={{ display: 'inline-block', width: '0.9rem', height: '0.9rem', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> Requesting…</>
                        ) : (
                            <>⭐ Confirm Request</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Listing Card ─────────────────────────────────────────────────────────────
const ListingCard = ({ property, onView, onEdit, onVerify, getVerificationButtonText, isVerificationButtonDisabled, onFeatureRequest }) => {
    const price = fmtPrice(property);
    const isFeatured = toBool(property.is_featured);
    const isSold = toBool(property.is_sold);
    const featureState = getFeatureState(property);
    const [featureModal, setFeatureModal] = useState(null);
    const [requesting, setRequesting] = useState(false);

    const handleConfirmFeature = async () => {
        if (!featureModal) return;
        setRequesting(true);
        try {
            await onFeatureRequest?.(featureModal);
        } finally {
            setRequesting(false);
            setFeatureModal(null);
        }
    };

    return (
        <>
            <div style={{
                backgroundColor: 'white',
                border: isFeatured ? '1px solid hsl(38 92% 50% / 0.4)' : '1px solid hsl(220 15% 91%)',
                borderRadius: '0.875rem',
                overflow: 'hidden',
                boxShadow: isFeatured
                    ? '0 2px 12px hsl(38 92% 50% / 0.1), 0 1px 3px hsl(220 20% 15% / 0.04)'
                    : '0 1px 3px hsl(220 20% 15% / 0.04)',
                display: 'flex', flexDirection: 'column',
                transition: 'box-shadow 0.15s, border-color 0.15s',
            }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = isFeatured
                    ? '0 4px 20px hsl(38 92% 50% / 0.18), 0 4px 14px hsl(220 20% 15% / 0.08)'
                    : '0 4px 14px hsl(220 20% 15% / 0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = isFeatured
                    ? '0 2px 12px hsl(38 92% 50% / 0.1), 0 1px 3px hsl(220 20% 15% / 0.04)'
                    : '0 1px 3px hsl(220 20% 15% / 0.04)'}
            >
                {/* Status strip */}
                <div style={{
                    height: 3,
                    background: isFeatured
                        ? 'linear-gradient(90deg, hsl(38 92% 50%), hsl(28 90% 45%))'
                        : property.effective_listing_status === 'active'
                            ? 'hsl(152 60% 40%)'
                            : property.verification_request_status === 'pending'
                                ? 'hsl(38 92% 50%)'
                                : 'hsl(220 15% 60%)',
                    opacity: isFeatured ? 1 : 0.7,
                }} />

                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '0.5rem' }}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                                <h3 style={{
                                    margin: 0, fontSize: '0.85rem', fontWeight: 700,
                                    color: 'hsl(220 25% 12%)', letterSpacing: '-0.01em',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                    {property.title || 'Untitled Property'}
                                </h3>
                                <AvailabilityBadge status={property.effective_listing_status} />
                                <VerificationBadge status={property.verification_request_status || 'unverified'} />
                                {isFeatured && <FeaturedBadge />} {isSold && <SoldBadge />}
                            </div>
                            <p style={{ margin: '0 0 0.35rem', fontSize: '0.7rem', color: 'hsl(220 15% 50%)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                {Icons.mapPin} {property.address}, {property.city}
                            </p>
                        </div>
                    </div>

                    <div style={{
                        padding: '0.65rem 0.75rem',
                        backgroundColor: isFeatured ? 'hsl(38 92% 50% / 0.04)' : 'hsl(220 15% 97%)',
                        borderRadius: '0.5rem',
                        border: isFeatured ? '1px solid hsl(38 92% 50% / 0.15)' : '1px solid hsl(220 15% 93%)',
                        display: 'flex', alignItems: 'baseline', gap: '0.25rem',
                    }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: price.color }}>{price.text}</span>
                        {price.sub && <span style={{ fontSize: '0.68rem', color: 'hsl(220 15% 50%)', fontWeight: 600 }}>{price.sub}</span>}
                    </div>
                </div>

                <div style={{ borderTop: '1px solid hsl(220 15% 93%)', padding: '0.6rem 1rem', backgroundColor: 'hsl(220 15% 98.5%)', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button onClick={() => onView(property)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.7rem', borderRadius: '0.4rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(174 62% 30%)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {Icons.eye} View
                    </button>
                    <button onClick={() => onEdit(property)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.7rem', borderRadius: '0.4rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {Icons.edit} Edit
                    </button>

                    <button onClick={() => !isVerificationButtonDisabled(property.effective_listing_status, property.verification_status) && onVerify(property)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.7rem', borderRadius: '0.4rem', border: '1px solid hsl(38 92% 70%)', backgroundColor: 'white', color: 'hsl(38 92% 40%)', fontSize: '0.7rem', fontWeight: 700, cursor: isVerificationButtonDisabled(property.effective_listing_status, property.verification_status) ? 'default' : 'pointer', fontFamily: 'inherit', opacity: isVerificationButtonDisabled(property.effective_listing_status, property.verification_status) ? 0.5 : 1, marginLeft: 'auto' }}>
                        {Icons.verify} {getVerificationButtonText(property.effective_listing_status, property.verification_status)}
                    </button>
                </div>
            </div>

            {/* Render confirmation modal */}
            {featureModal && (
                <FeatureConfirmModal
                    property={featureModal}
                    onClose={() => setFeatureModal(null)}
                    onConfirm={handleConfirmFeature}
                    loading={requesting}
                />
            )}
        </>
    );
};

// ─── Main Listings Tab ────────────────────────────────────────────────────────
const ListingsTab = ({
    properties = [],
    onAddListing,
    onView,
    onEdit,
    onVerify,
    onFeatureRequest,
    verificationData = [],
    getVerificationButtonText,
    isVerificationButtonDisabled,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const [verificationFilter, setVerificationFilter] = useState('all');
    const [featuredFilter, setFeaturedFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const latestVerificationByListing = useMemo(
        () => buildLatestVerificationMap(verificationData),
        [verificationData]
    );

    const liveProperties = useMemo(() => {
        return properties.map((property) => {
            const record = latestVerificationByListing.get(property.id);
            if (!record) return property;
            return {
                ...property,
                verification_request_status: record.status,
                verification_status: record.status === 'approved' ? 'verified' : record.status,
            };
        });
    }, [properties, latestVerificationByListing]);

    const filteredProperties = useMemo(() => {
        return liveProperties.filter(property => {
            const matchesSearch = !searchTerm.trim() || (
                (property.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (property.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (property.city || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
            const matchesAvailability = availabilityFilter === 'all' || property.effective_listing_status === availabilityFilter;
            const matchesVerification = verificationFilter === 'all' || (property.verification_request_status || 'unverified') === verificationFilter;
            const matchesFeatured = featuredFilter === 'all' ||
                (featuredFilter === 'featured' ? toBool(property.is_featured) : !toBool(property.is_featured));
            return matchesSearch && matchesAvailability && matchesVerification && matchesFeatured;
        });
    }, [liveProperties, searchTerm, availabilityFilter, verificationFilter, featuredFilter]);

    const rentals = filteredProperties.filter(p => p.purpose !== 'sale');
    const sales = filteredProperties.filter(p => p.purpose === 'sale');

    const rentalTotalPages = Math.ceil(rentals.length / ITEMS_PER_PAGE);
    const paginatedRentals = rentals.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const salesTotalPages = Math.ceil(sales.length / ITEMS_PER_PAGE);
    const paginatedSales = sales.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const maxTotalPages = Math.max(rentalTotalPages, salesTotalPages, 1);
    const safePage = Math.min(currentPage, maxTotalPages);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleAvailabilityChange = (e) => {
        setAvailabilityFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleVerificationChange = (e) => {
        setVerificationFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleFeaturedChange = (e) => {
        setFeaturedFilter(e.target.value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setAvailabilityFilter('all');
        setVerificationFilter('all');
        setFeaturedFilter('all');
        setCurrentPage(1);
    };

    const hasFilters = searchTerm.trim() !== '' || availabilityFilter !== 'all' || verificationFilter !== 'all' || featuredFilter !== 'all';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 3, height: '1.2rem', borderRadius: 999, backgroundColor: 'hsl(174 62% 32%)', flexShrink: 0 }} />
                    <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'hsl(220 25% 12%)' }}>
                        Your Listings
                    </h2>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.18rem 0.6rem', borderRadius: 999, backgroundColor: 'hsl(220 15% 93%)', color: 'hsl(220 25% 35%)' }}>
                        {properties.length}
                    </span>
                </div>
                <button onClick={onAddListing} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', backgroundColor: 'hsl(174 62% 32%)', color: 'white', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background-color 0.15s', whiteSpace: 'nowrap' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(174 62% 28%)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)'}>
                    {Icons.plus} Add Listing
                </button>
            </div>

            {/* Search & Filter */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: '1 1 260px' }}>
                    <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)', display: 'flex' }}>
                        {Icons.search}
                    </div>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by title, address, city..."
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

                <select
                    value={availabilityFilter}
                    onChange={handleAvailabilityChange}
                    style={{
                        padding: '0.65rem 1rem', borderRadius: '0.625rem',
                        border: '1px solid hsl(220 15% 88%)',
                        backgroundColor: 'white',
                        fontSize: '0.8rem', color: 'hsl(220 25% 15%)',
                        fontFamily: 'inherit', minWidth: '150px',
                        outline: 'none', cursor: 'pointer',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'hsl(174 62% 40%)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'}
                >
                    {AVAILABILITY_STATUSES.map(s => (
                        <option key={s} value={s}>{s === 'all' ? 'All availability' : AVAILABILITY_CFG[s].label}</option>
                    ))}
                </select>

                <select
                    value={verificationFilter}
                    onChange={handleVerificationChange}
                    style={{
                        padding: '0.65rem 1rem', borderRadius: '0.625rem',
                        border: '1px solid hsl(220 15% 88%)',
                        backgroundColor: 'white',
                        fontSize: '0.8rem', color: 'hsl(220 25% 15%)',
                        fontFamily: 'inherit', minWidth: '160px',
                        outline: 'none', cursor: 'pointer',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'hsl(174 62% 40%)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'}
                >
                    {VERIFICATION_STATUSES.map(s => (
                        <option key={s} value={s}>{s === 'all' ? 'All verification' : VERIFICATION_CFG[s].label}</option>
                    ))}
                </select>

                <select
                    value={featuredFilter}
                    onChange={handleFeaturedChange}
                    style={{
                        padding: '0.65rem 1rem', borderRadius: '0.625rem',
                        border: '1px solid hsl(220 15% 88%)',
                        backgroundColor: 'white',
                        fontSize: '0.8rem', color: 'hsl(220 25% 15%)',
                        fontFamily: 'inherit', minWidth: '140px',
                        outline: 'none', cursor: 'pointer',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'hsl(174 62% 40%)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'}
                >
                    <option value="all">All</option>
                    <option value="featured">Featured</option>
                    <option value="not-featured">Not Featured</option>
                </select>

                {hasFilters && (
                    <button onClick={clearFilters}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.7rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 86%)', backgroundColor: 'hsl(220 15% 96%)', color: 'hsl(220 15% 44%)', fontSize: '0.73rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                        {Icons.x} Clear
                    </button>
                )}
            </div>

            {/* Rental Listings */}
            {rentals.length > 0 && (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem', padding: '0.5rem 0.75rem', backgroundColor: 'hsl(174 62% 32% / 0.07)', borderRadius: '0.5rem', border: '1px solid hsl(174 50% 80%)' }}>
                        <span>🏠</span>
                        <h3 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: 'hsl(174 55% 28%)' }}>Rental Listings</h3>
                        <span style={{ marginLeft: 'auto', fontSize: '0.68rem', fontWeight: 700, color: 'hsl(174 55% 28%)', backgroundColor: 'white', padding: '0.1rem 0.5rem', borderRadius: 999, border: '1px solid hsl(174 50% 80%)' }}>{rentals.length}</span>
                    </div>
                    {rentals.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'hsl(220 15% 50%)', fontWeight: 500, marginBottom: '0.5rem' }}>
                            <span>Showing {((safePage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(safePage * ITEMS_PER_PAGE, rentals.length)} of {rentals.length} rentals</span>
                        </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
                        {paginatedRentals.map(property => (
                            <ListingCard
                                key={property.id}
                                property={property}
                                onView={onView}
                                onEdit={onEdit}
                                onVerify={onVerify}
                                onFeatureRequest={onFeatureRequest}
                                getVerificationButtonText={getVerificationButtonText}
                                isVerificationButtonDisabled={isVerificationButtonDisabled}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Sale Listings */}
            {sales.length > 0 && (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem', padding: '0.5rem 0.75rem', backgroundColor: 'hsl(38 92% 50% / 0.07)', borderRadius: '0.5rem', border: '1px solid hsl(38 80% 78%)' }}>
                        <span>🏷️</span>
                        <h3 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: 'hsl(36 75% 30%)' }}>Sale Listings</h3>
                        <span style={{ marginLeft: 'auto', fontSize: '0.68rem', fontWeight: 700, color: 'hsl(36 75% 30%)', backgroundColor: 'white', padding: '0.1rem 0.5rem', borderRadius: 999, border: '1px solid hsl(38 80% 78%)' }}>{sales.length}</span>
                    </div>
                    {sales.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'hsl(220 15% 50%)', fontWeight: 500, marginBottom: '0.5rem' }}>
                            <span>Showing {((safePage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(safePage * ITEMS_PER_PAGE, sales.length)} of {sales.length} sales</span>
                        </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
                        {paginatedSales.map(property => (
                            <ListingCard
                                key={property.id}
                                property={property}
                                onView={onView}
                                onEdit={onEdit}
                                onVerify={onVerify}
                                onFeatureRequest={onFeatureRequest}
                                getVerificationButtonText={getVerificationButtonText}
                                isVerificationButtonDisabled={isVerificationButtonDisabled}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Pagination */}
            {filteredProperties.length > 0 && (
                <Pagination currentPage={safePage} totalPages={maxTotalPages} onPageChange={setCurrentPage} />
            )}

            {/* Empty state */}
            {properties.length === 0 ? (
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                    <div style={{ color: 'hsl(220 15% 68%)', margin: '0 auto 1rem', display: 'flex', justifyContent: 'center' }}>{Icons.empty}</div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'hsl(220 25% 15%)', margin: '0 0 0.35rem' }}>No Listings Yet</h3>
                    <p style={{ color: 'hsl(220 15% 52%)', fontSize: '0.82rem', margin: '0 0 1.25rem' }}>Add your first property to get started!</p>
                    <button onClick={onAddListing} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.55rem 1.1rem', borderRadius: '0.5rem', border: 'none', backgroundColor: 'hsl(174 62% 32%)', color: 'white', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {Icons.plus} Add First Listing
                    </button>
                </div>
            ) : filteredProperties.length === 0 && hasFilters ? (
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                    <div style={{ color: 'hsl(220 15% 68%)', margin: '0 auto 1rem', display: 'flex', justifyContent: 'center' }}>{Icons.empty}</div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'hsl(220 25% 15%)', margin: '0 0 0.35rem' }}>No Listings Match Filters</h3>
                    <p style={{ color: 'hsl(220 15% 52%)', fontSize: '0.82rem', margin: 0 }}>
                        Try adjusting your search or status filter.
                    </p>
                </div>
            ) : null}

            {/* Animations */}
            <style>{`
                @keyframes leModalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(5px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ListingsTab;