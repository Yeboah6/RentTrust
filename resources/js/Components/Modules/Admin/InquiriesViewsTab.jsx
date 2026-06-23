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
    whatsapp: <Ico d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    phone:    <Ico d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
    form:     <Ico d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    pin:      <Ico d={['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z','M15 11a3 3 0 11-6 0 3 3 0 016 0z']} size="0.78rem" />,
    msg:      <Ico d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" size="0.78rem" />,
    chevDown: <Ico d="M19 9l-7 7-7-7" size="0.78rem" />,
    eye:      <Ico d={['M15 12a3 3 0 11-6 0 3 3 0 016 0z','M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z']} size="0.78rem" />,
    chevronLeft:  <Ico d="M15 19l-7-7 7-7" />,
    chevronRight: <Ico d="M9 5l7 7-7 7" />,
    inbox:    <Ico d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" size="2.5rem" sw={1.2} />,
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const config = {
        approved:   { bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 35%)', label: 'Approved' },
        pending:    { bg: 'hsl(38 92% 93%)',   color: 'hsl(38 92% 40%)',  label: 'Pending' },
        unverified: { bg: 'hsl(220 15% 93%)',  color: 'hsl(220 15% 45%)', label: 'Unverified' },
        suspended:  { bg: 'hsl(0 72% 93%)',    color: 'hsl(0 72% 45%)',   label: 'Suspended' },
        rejected:   { bg: 'hsl(0 72% 93%)',    color: 'hsl(0 72% 45%)',   label: 'Rejected' },
    };
    const cfg = config[status] || config.pending;
    
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.18rem 0.55rem', borderRadius: 999,
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
            backgroundColor: cfg.bg, color: cfg.color, flexShrink: 0,
        }}>
            {cfg.label}
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

const toBool = (v) => v === true || v === 1 || v === '1';

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
    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '1rem 0' }}>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.375rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: currentPage === 1 ? 'hsl(220 15% 70%)' : 'hsl(220 25% 35%)', cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}>{Icons.chevronLeft}</button>

            {start > 1 && (
                <>
                    <button onClick={() => onPageChange(1)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.375rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>1</button>
                    {start > 2 && <span style={{ color: 'hsl(220 15% 60%)', fontSize: '0.75rem', padding: '0 0.25rem' }}>...</span>}
                </>
            )}

            {pages.map(page => (
                <button key={page} onClick={() => onPageChange(page)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.375rem', border: page === currentPage ? 'none' : '1px solid hsl(220 15% 88%)', backgroundColor: page === currentPage ? 'hsl(174 62% 32%)' : 'white', color: page === currentPage ? 'white' : 'hsl(220 25% 35%)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>{page}</button>
            ))}

            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <span style={{ color: 'hsl(220 15% 60%)', fontSize: '0.75rem', padding: '0 0.25rem' }}>...</span>}
                    <button onClick={() => onPageChange(totalPages)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.375rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>{totalPages}</button>
                </>
            )}

            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.375rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: currentPage === totalPages ? 'hsl(220 15% 70%)' : 'hsl(220 25% 35%)', cursor: currentPage === totalPages ? 'default' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}>{Icons.chevronRight}</button>
        </div>
    );
};

const ITEMS_PER_PAGE = 9;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (v) => {
    if (!v) return '—';
    return new Date(v).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' });
};
const initial = (name) => (name || 'G').charAt(0).toUpperCase();

const TYPE_CFG = {
    whatsapp: { label: 'WhatsApp', icon: Icons.whatsapp, color: 'hsl(142 55% 33%)', bg: 'hsl(142 55% 93%)' },
    phone:    { label: 'Phone',    icon: Icons.phone,    color: 'hsl(214 80% 48%)', bg: 'hsl(214 100% 95%)' },
    form:     { label: 'Form',     icon: Icons.form,     color: 'hsl(270 55% 42%)', bg: 'hsl(270 60% 95%)' },
};

// ─── Single inquiry card ──────────────────────────────────────────────────────
const InquiryCard = ({ inquiry, rentals, onViewProperty }) => {
    const [open, setOpen] = useState(false);

    const rental  = rentals?.find(r => r.id === inquiry.rental_id);
    const title   = rental?.title   || `Property #${inquiry.rental_id}`;
    const city    = rental?.city    || 'Unknown';
    const address = rental?.address || '';
    const isGuest = !inquiry.user?.name;
    const type    = TYPE_CFG[inquiry.type] || TYPE_CFG.form;

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
            {/* Type colour strip */}
            <div style={{ height: 3, backgroundColor: type.color, opacity: 0.7 }} />

            {/* Card body */}
            <div style={{ padding: '0.9rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                {/* Property + type badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 800, color: 'hsl(220 25% 12%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
                            {title}
                        </p>
                        <p style={{ margin: '0.18rem 0 0', fontSize: '0.7rem', color: 'hsl(220 15% 52%)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            {Icons.pin}{city}{address ? ` · ${address}` : ''}
                        </p>
                    </div>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.28rem', flexShrink: 0,
                        padding: '0.2rem 0.55rem', borderRadius: 999,
                        fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.04em',
                        backgroundColor: type.bg, color: type.color,
                    }}>
                        {type.icon}{type.label}
                    </span>
                </div>

                {/* Divider */}
                <div style={{ height: 1, backgroundColor: 'hsl(220 15% 94%)' }} />

                {/* Tenant row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                        width: '2rem', height: '2rem', borderRadius: '50%', flexShrink: 0,
                        backgroundColor: isGuest ? 'hsl(40 90% 93%)' : 'hsl(174 40% 92%)',
                        color: isGuest ? 'hsl(40 80% 36%)' : 'hsl(174 62% 30%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 800,
                    }}>
                        {initial(inquiry.user?.name)}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: 'hsl(220 25% 14%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {inquiry.user?.name || 'Anonymous Tenant'}
                            </p>
                            {isGuest && (
                                <span style={{ fontSize: '0.58rem', fontWeight: 800, padding: '0.1rem 0.35rem', borderRadius: 999, backgroundColor: 'hsl(40 90% 93%)', color: 'hsl(40 80% 36%)', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>GUEST</span>
                            )}
                        </div>
                        <p style={{ margin: '0.1rem 0 0', fontSize: '0.68rem', color: 'hsl(220 15% 52%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {inquiry.user?.email || 'No email'} {inquiry.user?.phone ? `· ${inquiry.user.phone}` : ''}
                        </p>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'hsl(220 15% 60%)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {fmtDate(inquiry.created_at)}
                    </span>
                </div>

                {/* Message accordion */}
                {inquiry.message && (
                    <div style={{ borderTop: '1px solid hsl(220 15% 94%)', marginTop: 'auto' }}>
                        <button
                            onClick={() => setOpen(o => !o)}
                            style={{
                                width: '100%', padding: '0.5rem 0 0',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                            }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', fontWeight: 700, color: 'hsl(220 15% 48%)' }}>
                                {Icons.msg} Message
                            </span>
                            <span style={{ color: 'hsl(220 15% 60%)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'flex' }}>
                                {Icons.chevDown}
                            </span>
                        </button>
                        {open && (
                            <div style={{
                                marginTop: '0.5rem', padding: '0.65rem 0.75rem',
                                backgroundColor: 'hsl(40 33% 98%)', borderRadius: '0.5rem',
                                border: '1px solid hsl(40 25% 90%)',
                                animation: 'slideDown 0.18s ease',
                            }}>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(220 20% 30%)', lineHeight: 1.55, fontStyle: 'italic' }}>
                                    "{inquiry.message}"
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer action */}
            <div style={{ borderTop: '1px solid hsl(220 15% 93%)', padding: '0.6rem 1rem', backgroundColor: 'hsl(220 15% 98.5%)' }}>
                <button
                    onClick={() => onViewProperty?.(rental)}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.3rem 0.7rem', borderRadius: '0.4rem',
                        border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                        color: 'hsl(174 62% 30%)', fontSize: '0.72rem', fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(174 62% 40%)'; e.currentTarget.style.backgroundColor = 'hsl(174 40% 97%)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'; e.currentTarget.style.backgroundColor = 'white'; }}
                >
                    {Icons.eye} View Property
                </button>
            </div>
        </div>
    );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtPrice = (property) => {
    const isRent = property.purpose === 'rent';
    if (isRent) {
        const min = property.rent_min?.toLocaleString() ?? '—';
        const max = property.rent_max?.toLocaleString() ?? '—';
        return { text: `GH₵${min} – GH₵${max}`, sub: '/ yr' };
    }
    return { text: `GH₵${property.sale_price?.toLocaleString() ?? '—'}`, sub: '' };
};

// ─── Single View Card ─────────────────────────────────────────────────────────
const ViewCard = ({ property, onViewDetails }) => {
    const price = fmtPrice(property);
    const priceColor = property.purpose === 'rent' ? 'hsl(174 55% 28%)' : 'hsl(36 75% 30%)';
    const viewsCount = Number(property.views) || 0;
    const isFeatured = toBool(property.is_featured);

    console.log(isFeatured);
    
    return (
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
            {/* Views colour strip */}
            <div style={{ 
                height: 3, 
                background: isFeatured 
                    ? 'linear-gradient(90deg, hsl(38 92% 50%), hsl(28 90% 45%))' 
                    : property.effective_listing_status === 'approved' 
                        ? 'hsl(152 60% 40%)' 
                        : property.effective_listing_status === 'pending' 
                            ? 'hsl(38 92% 50%)' 
                            : 'hsl(220 15% 60%)',
                opacity: isFeatured ? 1 : 0.7,
            }} />

            {/* Card body */}
            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                
                {/* Property header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <h3 style={{ 
                                margin: 0, fontSize: '0.85rem', fontWeight: 700, 
                                color: 'hsl(220 25% 12%)', letterSpacing: '-0.01em',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                                {property.title || 'Untitled Property'}
                            </h3>
                             <StatusBadge status={property.status} /> {isFeatured && <FeaturedBadge />}
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
                </div>

                {/* Price display */}
                <div style={{
                    padding: '0.65rem 0.75rem',
                    backgroundColor: 'hsl(220 15% 97%)',
                    borderRadius: '0.5rem',
                    border: '1px solid hsl(220 15% 93%)',
                    display: 'flex', alignItems: 'baseline', gap: '0.25rem',
                }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: priceColor }}>
                        {price.text}
                    </span>
                    {price.sub && (
                        <span style={{ fontSize: '0.7rem', color: 'hsl(220 15% 50%)', fontWeight: 600 }}>
                            {price.sub}
                        </span>
                    )}
                </div>

                {/* Divider */}
                <div style={{ height: 1, backgroundColor: 'hsl(220 15% 94%)' }} />

                {/* Views count with icon */}
                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.5rem 0.65rem',
                    backgroundColor: 'hsl(174 40% 96%)',
                    borderRadius: '0.5rem',
                    border: '1px solid hsl(174 40% 88%)',
                }}>
                    <div style={{
                        width: '2rem', height: '2rem', borderRadius: '0.5rem',
                        backgroundColor: 'hsl(174 62% 32% / 0.1)',
                        color: 'hsl(174 62% 32%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        {Icons.eye}
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'hsl(174 62% 28%)' }}>
                            {viewsCount.toLocaleString()}
                        </p>
                        <p style={{ margin: '0.05rem 0 0', fontSize: '0.62rem', color: 'hsl(174 62% 35%)', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                            Total View{viewsCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                    {viewsCount > 50 && (
                        <div style={{ 
                            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.2rem',
                            color: 'hsl(152 60% 35%)', fontSize: '0.65rem', fontWeight: 700,
                        }}>
                            {Icons.trending}
                            Popular
                        </div>
                    )}
                </div>
            </div>

            {/* Footer action */}
            <div style={{ 
                borderTop: '1px solid hsl(220 15% 93%)', 
                padding: '0.6rem 1rem', 
                backgroundColor: 'hsl(220 15% 98.5%)',
            }}>
                <button
                    onClick={() => onViewDetails?.(property)}
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
                    {Icons.eye} View Details
                </button>
            </div>
        </div>
    );
};


// ─── Views sub-section (extracted from original ViewsTab) ─────────────────────
const ViewsSection = ({ views, totalViews, onViewDetails }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = useMemo(() => {
        if (!searchTerm.trim()) return [...views].sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0));
        const q = searchTerm.toLowerCase();
        return views.filter(p =>
            p.title?.toLowerCase().includes(q) ||
            p.address?.toLowerCase().includes(q) ||
            p.city?.toLowerCase().includes(q) ||
            p.status?.toLowerCase().includes(q)
        ).sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0));
    }, [views, searchTerm]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)' }}>{Icons.search}</div>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        placeholder="Search views by title, location..."
                        style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '0.625rem', border: '1px solid hsl(220 15% 88%)', fontSize: '0.8rem', fontFamily: 'inherit' }}
                    />
                </div>
                <span style={{ fontSize: '0.72rem', color: 'hsl(220 15% 50%)', marginLeft: '1rem' }}>Total: {totalViews.toLocaleString()} views</span>
            </div>

            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>{Icons.empty}<p>No views found</p></div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
                        {paginated.map(p => <ViewCard key={p.id} property={p} onViewDetails={onViewDetails} />)}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
            )}
        </div>
    );
};

// ─── Inquiries sub-section (extracted from original InquiriesTab) ──────────────
const InquiriesSection = ({ inquiries, rentals, onViewProperty }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(inquiries.length / ITEMS_PER_PAGE);
    const paginated = inquiries.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {inquiries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>{Icons.inbox}<p>No inquiries yet</p></div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
                        {paginated.map(inq => (
                            <InquiryCard key={inq.id} inquiry={inq} rentals={rentals} onViewProperty={onViewProperty} />
                        ))}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
            )}
        </div>
    );
};

// ─── Combined Tab ─────────────────────────────────────────────────────────────
const InquiriesViewsTab = ({ inquiries = [], views = [], totalViews = 0, rentals = [], onViewProperty }) => {
    const [activeSection, setActiveSection] = useState('views'); // 'views' | 'inquiries'

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Section switcher */}
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid hsl(220 15% 92%)', paddingBottom: '0.5rem' }}>
                <button
                    onClick={() => setActiveSection('views')}
                    style={{
                        padding: '0.5rem 1.25rem',
                        borderRadius: '0.5rem 0.5rem 0 0',
                        border: 'none',
                        backgroundColor: activeSection === 'views' ? 'hsl(174 62% 32%)' : 'transparent',
                        color: activeSection === 'views' ? 'white' : 'hsl(220 15% 50%)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        fontFamily: 'inherit',
                    }}
                >
                    📈 Views ({views.length})
                </button>
                <button
                    onClick={() => setActiveSection('inquiries')}
                    style={{
                        padding: '0.5rem 1.25rem',
                        borderRadius: '0.5rem 0.5rem 0 0',
                        border: 'none',
                        backgroundColor: activeSection === 'inquiries' ? 'hsl(174 62% 32%)' : 'transparent',
                        color: activeSection === 'inquiries' ? 'white' : 'hsl(220 15% 50%)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        fontFamily: 'inherit',
                    }}
                >
                    💬 Inquiries ({inquiries.length})
                </button>
            </div>

            {/* InquiriesViewsTab.jsx:260
 Uncaught ReferenceError: fmtPrice is not defined
    at ViewCard ( */}

            {activeSection === 'views' ? (
                <ViewsSection views={views} totalViews={totalViews} onViewDetails={onViewProperty} />
            ) : (
                <InquiriesSection inquiries={inquiries} rentals={rentals} onViewProperty={onViewProperty} />
            )}
        </div>
    );
};

export default InquiriesViewsTab;