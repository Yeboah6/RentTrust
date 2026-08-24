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
    eye:        <Ico d={['M15 12a3 3 0 11-6 0 3 3 0 016 0z','M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z']} />,
    edit:       <Ico d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />,
    check:      <Ico d="M5 13l4 4L19 7" />,
    clock:      <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    alert:      <Ico d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    mapPin:     <Ico d={['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z','M15 11a3 3 0 11-6 0 3 3 0 016 0z']} size="0.78rem" />,
    tag:        <Ico d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />,
    bed:        <Ico d="M2 4v16M2 8h20M2 8l2-4h16l2 4M6 12v4m4-4v4m4-4v4m4-4v4M2 20h20" size="0.78rem" />,
    bath:       <Ico d="M4 4v5a3 3 0 003 3h0M9 12v5a3 3 0 01-3 3M5 4h14M5 4l1-2h12l1 2M7 12h10v5a3 3 0 01-3 3h0a3 3 0 01-3-3v-5z" size="0.78rem" />,
    shield:     <Ico d="M9 12l2 2 4-4m5.6-4.02A11.95 11.95 0 0112 2.94a11.95 11.95 0 01-8.6 3.04A12 12 0 003 9c0 5.6 3.8 10.3 9 11.6C17.2 19.3 21 14.6 21 9c0-1.04-.13-2.05-.4-3.02z" />,
    trash:      <Ico d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
};

// ─── Availability Badge (rentals.status: available/inactive/rented/sold/pending) ─
const AVAILABILITY_CFG = {
    available:    { color: 'hsl(152 60% 35%)', icon: Icons.check, label: 'Available' },
    pending:   { color: 'hsl(38 92% 40%)',  icon: Icons.clock, label: 'Pending' },
    inactive:  { color: 'hsl(220 15% 45%)', icon: Icons.alert, label: 'Inactive' },
    rented:    { color: 'hsl(271 60% 40%)', icon: Icons.check, label: 'Rented' },
    sold:      { color: 'hsl(220 25% 35%)', icon: Icons.check, label: 'Sold' },
    unverified:{ color: 'hsl(220 15% 45%)', icon: Icons.alert, label: 'Unverified' },
};

const AvailabilityBadge = ({ status }) => {
    const cfg = AVAILABILITY_CFG[status] || AVAILABILITY_CFG.unverified;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.18rem 0.55rem', borderRadius: 999,
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
            backgroundColor: 'white', color: cfg.color, flexShrink: 0,
            boxShadow: '0 1px 3px hsl(220 20% 15% / 0.12)',
        }}>
            {cfg.icon}{cfg.label}
        </span>
    );
};

// ─── Verification Badge (agent_verifications / listing_verifications state) ──
const VERIFICATION_CFG = {
    approved:   { color: 'hsl(152 60% 35%)', icon: Icons.check, label: 'Verified' },
    pending:    { color: 'hsl(38 92% 40%)',  icon: Icons.clock, label: 'Pending Review' },
    rejected:   { color: 'hsl(0 72% 45%)',   icon: Icons.alert, label: 'Rejected' },
    unverified: { color: 'hsl(220 15% 45%)', icon: Icons.shield, label: 'Unverified' },
};

const VerificationBadge = ({ status }) => {
    const cfg = VERIFICATION_CFG[status] || VERIFICATION_CFG.unverified;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.18rem 0.55rem', borderRadius: 999,
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
            backgroundColor: 'white', color: cfg.color, flexShrink: 0,
            boxShadow: '0 1px 3px hsl(220 20% 15% / 0.12)',
        }}>
            {cfg.icon}{cfg.label}
        </span>
    );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtPrice = (property) => {
    if (property.purpose === 'sale') {
        return { text: `GH₵${Math.round(property.sale_price || 0).toLocaleString()}`, color: 'hsl(36 75% 30%)' };
    }
    return {
        text: `GH₵${Math.round(property.rent_min || 0).toLocaleString()} – GH₵${Math.round(property.rent_max || 0).toLocaleString()}`,
        sub: '/ month',
        color: 'hsl(174 55% 28%)',
    };
};

const verifyButtonLabel = (status) => {
    if (status === 'approved') return 'Verified';
    if (status === 'pending') return 'Pending';
    if (status === 'rejected') return 'Resubmit';
    return 'Verify';
};

const isVerifyDisabled = (status) => status === 'approved' || status === 'pending';

// ─── Listing Card ─────────────────────────────────────────────────────────────
const ListingCard = ({ property, onView, onEdit, onVerify, onDelete }) => {
    const [hovered, setHovered] = useState(false);
    const price = fmtPrice(property);

    const statusStripColor = (AVAILABILITY_CFG[property.listing_status] || AVAILABILITY_CFG.unverified).color;
    const verifyDisabled = isVerifyDisabled(property.verification_status);
    const verifyColor = (VERIFICATION_CFG[property.verification_status] || VERIFICATION_CFG.unverified).color;

    return (
        <div
            style={{
                backgroundColor: 'white',
                border: '1px solid',
                borderColor: hovered ? 'hsl(220 15% 82%)' : 'hsl(220 15% 91%)',
                borderRadius: '0.875rem',
                overflow: 'hidden',
                boxShadow: hovered ? '0 4px 14px hsl(220 20% 15% / 0.08)' : '0 1px 3px hsl(220 20% 15% / 0.04)',
                display: 'flex', flexDirection: 'column',
                transition: 'box-shadow 0.15s, border-color 0.15s',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Status strip */}
            <div style={{ height: 3, backgroundColor: statusStripColor, opacity: 0.85 }} />

            {/* Card body */}
            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                {/* Header: title + badges */}
                <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <h3 style={{
                            margin: 0, fontSize: '0.85rem', fontWeight: 700,
                            color: 'hsl(220 25% 12%)', letterSpacing: '-0.01em',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                            {property.title || 'Untitled Property'}
                        </h3>
                        <AvailabilityBadge status={property.listing_status} />
                        <VerificationBadge status={property.verification_status} />
                    </div>
                    <p style={{
                        margin: '0.15rem 0 0', fontSize: '0.7rem', color: 'hsl(220 15% 50%)',
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                        {Icons.mapPin}
                        {[property.address, property.city].filter(Boolean).join(', ') || 'No location'}
                    </p>
                </div>

                {/* Property details */}
                <div style={{
                    display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
                    fontSize: '0.68rem', color: 'hsl(220 15% 50%)',
                }}>
                    {property.bedrooms != null && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            {Icons.bed} {property.bedrooms} Beds
                        </span>
                    )}
                    {property.bathrooms != null && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            {Icons.bath} {property.bathrooms} Baths
                        </span>
                    )}
                    {property.property_type && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', textTransform: 'capitalize' }}>
                            {Icons.tag} {property.property_type}
                        </span>
                    )}
                </div>

                {/* Price display */}
                <div style={{
                    padding: '0.65rem 0.75rem',
                    backgroundColor: 'hsl(220 15% 97%)',
                    borderRadius: '0.5rem',
                    border: '1px solid hsl(220 15% 93%)',
                    display: 'flex', alignItems: 'baseline', gap: '0.25rem',
                }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: price.color }}>
                        {price.text}
                    </span>
                    {price.sub && (
                        <span style={{ fontSize: '0.68rem', color: 'hsl(220 15% 50%)', fontWeight: 600 }}>
                            {price.sub}
                        </span>
                    )}
                </div>
            </div>

            {/* Footer actions */}
            <div style={{
                borderTop: '1px solid hsl(220 15% 93%)',
                padding: '0.6rem 1rem',
                backgroundColor: 'hsl(220 15% 98.5%)',
                display: 'flex', gap: '0.4rem', flexWrap: 'wrap',
            }}>
                <button onClick={() => onView?.(property)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
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
                <button onClick={() => onEdit?.(property)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                    padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                    border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                    color: 'hsl(220 25% 35%)', fontSize: '0.7rem', fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(220 15% 55%)'; e.currentTarget.style.backgroundColor = 'hsl(220 15% 95%)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'; e.currentTarget.style.backgroundColor = 'white'; }}
                >
                    {Icons.edit} Edit
                </button>
                <button onClick={() => onDelete?.(property)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                    padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                    border: '1px solid hsl(0 72% 70%)', backgroundColor: 'white',
                    color: 'hsl(0 72% 48%)', fontSize: '0.7rem', fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(0 72% 50%)'; e.currentTarget.style.backgroundColor = 'hsl(0 72% 97%)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(0 72% 70%)'; e.currentTarget.style.backgroundColor = 'white'; }}
                >
                    {Icons.trash} Delete
                </button>
                <button
                    onClick={() => !verifyDisabled && onVerify?.(property)}
                    disabled={verifyDisabled}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                        padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                        border: `1px solid ${verifyColor}`, backgroundColor: 'white',
                        color: verifyColor, fontSize: '0.7rem', fontWeight: 700,
                        cursor: verifyDisabled ? 'default' : 'pointer',
                        opacity: verifyDisabled ? 0.6 : 1,
                        fontFamily: 'inherit', transition: 'all 0.12s',
                        marginLeft: 'auto',
                    }}
                    onMouseEnter={e => { if (!verifyDisabled) e.currentTarget.style.backgroundColor = 'hsl(220 15% 97%)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; }}
                >
                    {Icons.shield} {verifyButtonLabel(property.verification_status)}
                </button>
            </div>
        </div>
    );
};

export default ListingCard;