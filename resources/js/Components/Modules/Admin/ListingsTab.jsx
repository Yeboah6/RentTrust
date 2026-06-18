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
    undo:       <Ico d="M3 10h10a8 8 0 018 8v2M3 10l6 6M3 10l6-6" />,
    trash:      <Ico d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    mapPin:     <Ico d={['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z','M15 11a3 3 0 11-6 0 3 3 0 016 0z']} size="0.78rem" />,
    user:       <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" size="0.78rem" />,
    tag:        <Ico d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />,
    bed:        <Ico d="M2 4v16M2 8h20M2 8l2-4h16l2 4M6 12v4m4-4v4m4-4v4m4-4v4M2 20h20" size="0.78rem" />,
    bath:       <Ico d="M4 4v5a3 3 0 003 3h0M9 12v5a3 3 0 01-3 3M5 4h14M5 4l1-2h12l1 2M7 12h10v5a3 3 0 01-3 3h0a3 3 0 01-3-3v-5z" size="0.78rem" />,
    chevronLeft:  <Ico d="M15 19l-7-7 7-7" />,
    chevronRight: <Ico d="M9 5l7 7-7 7" />,
    empty:      <Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" size="2.5rem" sw={1.2} />,
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const config = {
        approved:   { bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 35%)', icon: Icons.check, label: 'Approved' },
        pending:    { bg: 'hsl(38 92% 93%)',   color: 'hsl(38 92% 40%)',  icon: Icons.check, label: 'Pending' },
        unverified: { bg: 'hsl(220 15% 93%)',  color: 'hsl(220 15% 45%)', icon: Icons.check, label: 'Unverified' },
        suspended:  { bg: 'hsl(0 72% 93%)',    color: 'hsl(0 72% 45%)',   icon: Icons.check, label: 'Suspended' },
        rejected:   { bg: 'hsl(0 72% 93%)',    color: 'hsl(0 72% 45%)',   icon: Icons.check, label: 'Rejected' },
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtPrice = (property) => {
    const isRent = property.purpose === 'rent';
    if (isRent) {
        const min = property.rent_min?.toLocaleString() ?? '—';
        const max = property.rent_max?.toLocaleString() ?? '—';
        return { text: `GH₵${min} – GH₵${max}`, sub: '/ month', color: 'hsl(174 55% 28%)' };
    }
    return { 
        text: `GH₵${property.sale_price?.toLocaleString() ?? '—'}`, 
        sub: '', 
        color: 'hsl(36 75% 30%)' 
    };
};

const ITEMS_PER_PAGE = 9;

// ─── Single Listing Card ──────────────────────────────────────────────────────
const ListingCard = ({ property, onView, onEdit, onApproveToggle, onDelete }) => {
    const price = fmtPrice(property);
    const isApproved = property.status === 'approved';
    const isFeatured = toBool(property.is_featured);

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
            {/* Status strip - gold for featured */}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
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

                {/* Agent info */}
                {property.agent_name && (
                    <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                        fontSize: '0.68rem', color: 'hsl(220 15% 48%)',
                    }}>
                        {Icons.user}
                        <span style={{ fontWeight: 600, color: 'hsl(220 25% 25%)' }}>
                            {property.agent_name}
                        </span>
                    </div>
                )}

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
                        <span style={{ 
                            display: 'flex', alignItems: 'center', gap: '0.2rem',
                            textTransform: 'capitalize',
                        }}>
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
                <button onClick={() => onApproveToggle?.(property)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                    padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                    border: 'none',
                    backgroundColor: isApproved ? 'hsl(271 60% 50%)' : 'hsl(152 60% 40%)',
                    color: 'white', fontSize: '0.7rem', fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                    {isApproved ? <>{Icons.undo} Revert</> : <>{Icons.check} Approve</>}
                </button>
                <button onClick={() => onDelete?.(property)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                    padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                    border: '1px solid hsl(0 72% 70%)', backgroundColor: 'white',
                    color: 'hsl(0 72% 48%)', fontSize: '0.7rem', fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                    marginLeft: 'auto',
                }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(0 72% 50%)'; e.currentTarget.style.backgroundColor = 'hsl(0 72% 97%)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(0 72% 70%)'; e.currentTarget.style.backgroundColor = 'white'; }}
                >
                    {Icons.trash} Delete
                </button>
            </div>
        </div>
    );
};

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ title, emoji, count, accentColor, accentBg, borderColor }) => (
    <div style={{ 
        display: 'flex', alignItems: 'center', gap: '0.55rem', 
        padding: '0.5rem 0.875rem', borderRadius: '0.5rem', 
        backgroundColor: accentBg, border: `1px solid ${borderColor}`,
        marginBottom: '0.5rem',
    }}>
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{emoji}</span>
        <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: accentColor }}>
            {title}
        </h3>
        <span style={{ 
            marginLeft: 'auto', fontSize: '0.7rem', fontWeight: 700, 
            color: accentColor, backgroundColor: 'white', 
            border: `1px solid ${borderColor}`, padding: '0.1rem 0.5rem', 
            borderRadius: '999px' 
        }}>
            {count}
        </span>
    </div>
);

// ─── Listings Tab Module ──────────────────────────────────────────────────────
const ListingsTab = ({ 
    listings = [], 
    onAddListing,
    onView, 
    onEdit, 
    onApproveToggle, 
    onDelete 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    
    const filteredListings = useMemo(() => {
        return listings.filter(property => {
            const q = searchTerm.toLowerCase();
            const matchesSearch = !q || [
                property.title,
                property.address,
                property.city,
                property.agent_name,
                property.status,
                property.purpose,
            ].filter(Boolean).some(value => value?.toString().toLowerCase().includes(q));
            
            const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [listings, searchTerm, statusFilter]);

    // Reset page when filters change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const total = listings.length;
    const filteredTotal = filteredListings.length;
    const rentals = filteredListings.filter(p => p.purpose === 'rent');
    const sales = filteredListings.filter(p => p.purpose === 'sale');
    
    const approved = listings.filter(p => p.status === 'approved').length;
    const pending = listings.filter(p => p.status === 'pending').length;
    const suspended = listings.filter(p => p.status === 'suspended').length;

    // Pagination logic
    const totalPages = Math.ceil(filteredTotal / ITEMS_PER_PAGE);
    const paginatedListings = filteredListings.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    const paginatedRentals = paginatedListings.filter(p => p.purpose === 'rent');
    const paginatedSales = paginatedListings.filter(p => p.purpose === 'sale');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Section heading + actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 3, height: '1.2rem', borderRadius: 999, backgroundColor: 'hsl(174 62% 32%)', flexShrink: 0 }} />
                    <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'hsl(220 25% 12%)', letterSpacing: '-0.01em' }}>
                        Platform Listings
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
                                { label: 'Approved',  val: approved,  color: 'hsl(152 60% 40%)', bg: 'hsl(152 60% 93%)' },
                                { label: 'Pending',   val: pending,   color: 'hsl(38 92% 40%)',  bg: 'hsl(38 92% 93%)' },
                                { label: 'Suspended', val: suspended, color: 'hsl(0 72% 45%)',   bg: 'hsl(0 72% 93%)' },
                            ].filter(t => t.val > 0).map(t => (
                                <span key={t.label} style={{ 
                                    display: 'inline-flex', alignItems: 'center', gap: '0.28rem',
                                    padding: '0.2rem 0.6rem', borderRadius: 999,
                                    fontSize: '0.68rem', fontWeight: 700,
                                    backgroundColor: t.bg, color: t.color,
                                }}>
                                    {t.val} {t.label}
                                </span>
                            ))}
                        </div>
                    )}
                    
                    <button
                        onClick={onAddListing}
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
                        {Icons.plus} Add Listing
                    </button>
                </div>
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
                        placeholder="Search listings by title, location, agent..."
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
                    value={statusFilter}
                    onChange={handleStatusChange}
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
                    <option value="all">All statuses</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="unverified">Unverified</option>
                    <option value="suspended">Suspended</option>
                </select>
            </div>

            {/* Results info */}
            {filteredTotal > 0 && (
                <div style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: '0.72rem', color: 'hsl(220 15% 50%)', fontWeight: 500,
                }}>
                    <span>
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredTotal)} of {filteredTotal} listing{filteredTotal !== 1 ? 's' : ''}
                    </span>
                </div>
            )}

            {/* Grid or empty state */}
            {filteredTotal > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Rental listings section */}
                    {paginatedRentals.length > 0 && (
                        <div>
                            <SectionHeader 
                                title="Rental Listings" 
                                emoji="🏠" 
                                count={rentals.length} 
                                accentColor="hsl(174 55% 28%)" 
                                accentBg="hsl(174 62% 32% / 0.07)" 
                                borderColor="hsl(174 50% 80%)" 
                            />
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '0.875rem',
                            }}>
                                {paginatedRentals.map(property => (
                                    <ListingCard
                                        key={property.id}
                                        property={property}
                                        onView={onView}
                                        onEdit={onEdit}
                                        onApproveToggle={onApproveToggle}
                                        onDelete={onDelete}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sale listings section */}
                    {paginatedSales.length > 0 && (
                        <div>
                            <SectionHeader 
                                title="Sale Listings" 
                                emoji="🏷️" 
                                count={sales.length} 
                                accentColor="hsl(36 75% 30%)" 
                                accentBg="hsl(38 92% 50% / 0.07)" 
                                borderColor="hsl(38 80% 78%)" 
                            />
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '0.875rem',
                            }}>
                                {paginatedSales.map(property => (
                                    <ListingCard
                                        key={property.id}
                                        property={property}
                                        onView={onView}
                                        onEdit={onEdit}
                                        onApproveToggle={onApproveToggle}
                                        onDelete={onDelete}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
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
                        {searchTerm || statusFilter !== 'all' ? 'No Listings Found' : 'No Listings Yet'}
                    </h3>
                    <p style={{ color: 'hsl(220 15% 52%)', fontSize: '0.82rem', margin: '0 0 1.25rem' }}>
                        {searchTerm || statusFilter !== 'all'
                            ? 'No listings match your search criteria. Try different filters.'
                            : 'Add the first listing to get started.'}
                    </p>
                    {!searchTerm && statusFilter === 'all' && (
                        <button
                            onClick={onAddListing}
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
                            {Icons.plus} Add First Listing
                        </button>
                    )}
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

export default ListingsTab;