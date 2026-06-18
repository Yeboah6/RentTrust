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
    eye:        <Ico d={['M15 12a3 3 0 11-6 0 3 3 0 016 0z','M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z']} />,
    search:     <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    property:   <Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    mapPin:     <Ico d={['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z','M15 11a3 3 0 11-6 0 3 3 0 016 0z']} size="0.78rem" />,
    trending:   <Ico d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    chevronLeft:  <Ico d="M15 19l-7-7 7-7" />,
    chevronRight: <Ico d="M9 5l7 7-7 7" />,
    empty:      <Ico d={['M15 12a3 3 0 11-6 0 3 3 0 016 0z','M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z']} size="2.5rem" sw={1.2} />,
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

const ITEMS_PER_PAGE = 9;

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
            {/* Views colour strip */}
            <div style={{ 
                height: 3, 
                backgroundColor: viewsCount > 100 ? 'hsl(152 60% 40%)' 
                    : viewsCount > 50 ? 'hsl(174 62% 40%)' 
                    : viewsCount > 10 ? 'hsl(38 92% 50%)' 
                    : 'hsl(220 15% 60%)',
                opacity: 0.7 
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
                            <StatusBadge status={property.status} />
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

// ─── Views Tab Module ─────────────────────────────────────────────────────────
const ViewsTab = ({ views = [], totalViews = 0, onViewDetails }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    const filteredAndSortedViews = useMemo(() => {
        const filtered = views.filter(property => {
            if (!searchTerm.trim()) return true;
            const q = searchTerm.toLowerCase();
            return (
                property.title?.toLowerCase().includes(q) ||
                property.address?.toLowerCase().includes(q) ||
                property.city?.toLowerCase().includes(q) ||
                property.status?.toLowerCase().includes(q)
            );
        });
        // Sort by views (highest first)
        return [...filtered].sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0));
    }, [views, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const total = views.length;
    const filteredTotal = filteredAndSortedViews.length;
    const popularCount = views.filter(p => (Number(p.views) || 0) > 50).length;
    const trendingCount = views.filter(p => (Number(p.views) || 0) > 100).length;

    // Pagination
    const totalPages = Math.ceil(filteredTotal / ITEMS_PER_PAGE);
    const paginatedViews = filteredAndSortedViews.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Section heading + stats */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 3, height: '1.2rem', borderRadius: 999, backgroundColor: 'hsl(174 62% 32%)', flexShrink: 0 }} />
                    <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'hsl(220 25% 12%)', letterSpacing: '-0.01em' }}>
                        Property Views
                    </h2>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.18rem 0.6rem', borderRadius: 999, backgroundColor: 'hsl(220 15% 93%)', color: 'hsl(220 25% 35%)' }}>
                        {total}
                    </span>
                </div>

                {/* Stats pills */}
                {total > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ 
                            display: 'inline-flex', alignItems: 'center', gap: '0.28rem',
                            padding: '0.2rem 0.6rem', borderRadius: 999,
                            fontSize: '0.68rem', fontWeight: 700,
                            backgroundColor: 'hsl(174 40% 95%)', color: 'hsl(174 62% 32%)',
                            border: '1px solid hsl(174 40% 85%)',
                        }}>
                            {Icons.eye} {totalViews?.toLocaleString() || 0} total
                        </span>
                        {trendingCount > 0 && (
                            <span style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '0.28rem',
                                padding: '0.2rem 0.6rem', borderRadius: 999,
                                fontSize: '0.68rem', fontWeight: 700,
                                backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)',
                                border: '1px solid hsl(152 60% 85%)',
                            }}>
                                {Icons.trending} {trendingCount} trending
                            </span>
                        )}
                        {popularCount > 0 && (
                            <span style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '0.28rem',
                                padding: '0.2rem 0.6rem', borderRadius: 999,
                                fontSize: '0.68rem', fontWeight: 700,
                                backgroundColor: 'hsl(38 92% 95%)', color: 'hsl(38 92% 40%)',
                                border: '1px solid hsl(38 92% 80%)',
                            }}>
                                ★ {popularCount} popular
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Search bar */}
            {total > 0 && (
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
                        onChange={handleSearchChange}
                        placeholder="Search properties by title, location..."
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
            )}

            {/* Results info */}
            {filteredTotal > 0 && (
                <div style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: '0.72rem', color: 'hsl(220 15% 50%)', fontWeight: 500,
                }}>
                    <span>
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredTotal)} of {filteredTotal} propert{filteredTotal !== 1 ? 'ies' : 'y'}
                    </span>
                </div>
            )}

            {/* Grid or empty state */}
            {filteredTotal > 0 ? (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.875rem',
                    }}>
                        {paginatedViews.map(property => (
                            <ViewCard
                                key={property.id}
                                property={property}
                                onViewDetails={onViewDetails}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
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
                        {searchTerm ? 'No Properties Found' : 'No Views Yet'}
                    </h3>
                    <p style={{ color: 'hsl(220 15% 52%)', fontSize: '0.82rem', margin: 0 }}>
                        {searchTerm 
                            ? `No properties match "${searchTerm}". Try a different search.` 
                            : 'No listings have been viewed yet.'}
                    </p>
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

export default ViewsTab;