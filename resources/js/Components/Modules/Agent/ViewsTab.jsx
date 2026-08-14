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
    mapPin:     <Ico d={['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z','M15 11a3 3 0 11-6 0 3 3 0 016 0z']} size="0.78rem" />,
    trending:   <Ico d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    check:      <Ico d="M5 13l4 4L19 7" />,
    clock:      <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    alert:      <Ico d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    chevronLeft:  <Ico d="M15 19l-7-7 7-7" />,
    chevronRight: <Ico d="M9 5l7 7-7 7" />,
    empty:      <Ico d={['M15 12a3 3 0 11-6 0 3 3 0 016 0z','M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z']} size="2.5rem" sw={1.2} />,
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const config = {
        approved:  { bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 35%)', label: 'Approved' },
        verified:  { bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 35%)', label: 'Verified' },
        active:    { bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 35%)', label: 'Active' },
        pending:   { bg: 'hsl(38 92% 93%)',  color: 'hsl(38 92% 40%)',  label: 'Pending' },
        rejected:  { bg: 'hsl(0 72% 93%)',   color: 'hsl(0 72% 45%)',   label: 'Rejected' },
        rented:    { bg: 'hsl(271 60% 93%)', color: 'hsl(271 60% 40%)',  label: 'Rented' },
        sold:      { bg: 'hsl(220 15% 93%)', color: 'hsl(220 25% 35%)',  label: 'Sold' },
        inactive:  { bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 45%)',  label: 'Inactive' },
        unverified:{ bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 45%)',  label: 'Unverified' },
    };
    const cfg = config[status] || config.unverified;
    return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.18rem 0.55rem', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em', backgroundColor: cfg.bg, color: cfg.color, flexShrink: 0 }}>{cfg.label}</span>;
};

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pages = [], maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '1rem 0', flexWrap: 'wrap' }}>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.375rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: currentPage === 1 ? 'hsl(220 15% 70%)' : 'hsl(220 25% 35%)', cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}>{Icons.chevronLeft}</button>
            {start > 1 && <><button onClick={() => onPageChange(1)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.375rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>1</button>{start > 2 && <span style={{ color: 'hsl(220 15% 60%)', fontSize: '0.75rem', padding: '0 0.25rem' }}>...</span>}</>}
            {pages.map(page => <button key={page} onClick={() => onPageChange(page)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.375rem', border: page === currentPage ? 'none' : '1px solid hsl(220 15% 88%)', backgroundColor: page === currentPage ? 'hsl(174 62% 32%)' : 'white', color: page === currentPage ? 'white' : 'hsl(220 25% 35%)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }} onMouseEnter={e => { if (page !== currentPage) e.currentTarget.style.backgroundColor = 'hsl(220 15% 95%)'; }} onMouseLeave={e => { if (page !== currentPage) e.currentTarget.style.backgroundColor = 'white'; }}>{page}</button>)}
            {end < totalPages && <>{end < totalPages - 1 && <span style={{ color: 'hsl(220 15% 60%)', fontSize: '0.75rem', padding: '0 0.25rem' }}>...</span>}<button onClick={() => onPageChange(totalPages)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.375rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{totalPages}</button></>}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.375rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: currentPage === totalPages ? 'hsl(220 15% 70%)' : 'hsl(220 25% 35%)', cursor: currentPage === totalPages ? 'default' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}>{Icons.chevronRight}</button>
        </div>
    );
};

const ITEMS_PER_PAGE = 9;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtPrice = (property) => {
    if (property.purpose === 'sale') return { text: `GH₵${Math.round(property.sale_price || 0).toLocaleString()}`, color: 'hsl(38 92% 45%)' };
    return { text: `GH₵${Math.round(property.rent_min || 0).toLocaleString()} – GH₵${Math.round(property.rent_max || 0).toLocaleString()}`, sub: '/ yr', color: 'hsl(174 62% 32%)' };
};

// ─── View Card ────────────────────────────────────────────────────────────────
const ViewCard = ({ property, onView }) => {
    const price = fmtPrice(property);
    const viewsCount = Number(property.views) || 0;
    return (
        <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', overflow: 'hidden', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px hsl(220 20% 15% / 0.08)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px hsl(220 20% 15% / 0.04)'}>
            <div style={{ height: 3, backgroundColor: viewsCount > 100 ? 'hsl(152 60% 40%)' : viewsCount > 50 ? 'hsl(174 62% 40%)' : viewsCount > 10 ? 'hsl(38 92% 50%)' : 'hsl(220 15% 60%)', opacity: 0.7 }} />
            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '0.5rem' }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <h3 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: 'hsl(220 25% 12%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{property.title}</h3>
                            <StatusBadge status={property.effective_listing_status} />
                        </div>
                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.68rem', color: 'hsl(220 15% 50%)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>{Icons.mapPin} {property.address}, {property.city}</p>
                    </div>
                </div>
                <div style={{ padding: '0.6rem 0.7rem', backgroundColor: 'hsl(220 15% 97%)', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 93%)', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: price.color }}>{price.text}</span>
                    {price.sub && <span style={{ fontSize: '0.65rem', color: 'hsl(220 15% 50%)', fontWeight: 600 }}>{price.sub}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.65rem', backgroundColor: 'hsl(174 40% 96%)', borderRadius: '0.5rem', border: '1px solid hsl(174 40% 88%)' }}>
                    <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: 'hsl(174 62% 32% / 0.1)', color: 'hsl(174 62% 32%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{Icons.eye}</div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'hsl(174 62% 28%)' }}>{viewsCount.toLocaleString()}</p>
                        <p style={{ margin: '0.05rem 0 0', fontSize: '0.6rem', color: 'hsl(174 62% 35%)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Total View{viewsCount !== 1 ? 's' : ''}</p>
                    </div>
                    {viewsCount > 50 && <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'hsl(152 60% 35%)', fontSize: '0.63rem', fontWeight: 700 }}>{Icons.trending} Popular</div>}
                </div>
            </div>
            <div style={{ borderTop: '1px solid hsl(220 15% 93%)', padding: '0.6rem 1rem', backgroundColor: 'hsl(220 15% 98.5%)' }}>
                <button onClick={() => onView(property)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.7rem', borderRadius: '0.4rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(174 62% 30%)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(174 62% 40%)'; e.currentTarget.style.backgroundColor = 'hsl(174 40% 97%)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'; e.currentTarget.style.backgroundColor = 'white'; }}>
                    {Icons.eye} View Details
                </button>
            </div>
        </div>
    );
};

// ─── Views Tab Module ─────────────────────────────────────────────────────────
const ViewsTab = ({ properties = [], onView }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const viewedProperties = useMemo(() => 
        properties.filter(p => (Number(p.views) || 0) > 0).sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0)),
    [properties]);
    
    const totalViews = useMemo(() => viewedProperties.reduce((sum, p) => sum + (Number(p.views) || 0), 0), [viewedProperties]);
    const popularCount = useMemo(() => viewedProperties.filter(p => (Number(p.views) || 0) > 50).length, [viewedProperties]);
    const filteredTotal = viewedProperties.length;

    const totalPages = Math.ceil(filteredTotal / ITEMS_PER_PAGE);
    const paginatedViews = viewedProperties.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <style>{`
                /* Responsive grid */
                .views-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 0.875rem;
                }
                @media (min-width: 640px) {
                    .views-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (min-width: 1024px) {
                    .views-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
                /* Header responsiveness */
                .views-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                }
                @media (max-width: 640px) {
                    .views-header {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .views-header > div:last-child {
                        justify-content: flex-end;
                    }
                }
            `}</style>

            <div className="views-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 3, height: '1.2rem', borderRadius: 999, backgroundColor: 'hsl(174 62% 32%)', flexShrink: 0 }} />
                    <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'hsl(220 25% 12%)' }}>Property Views</h2>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.18rem 0.6rem', borderRadius: 999, backgroundColor: 'hsl(220 15% 93%)', color: 'hsl(220 25% 35%)' }}>{viewedProperties.length}</span>
                </div>
                {viewedProperties.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700, backgroundColor: 'hsl(174 40% 95%)', color: 'hsl(174 62% 32%)', border: '1px solid hsl(174 40% 85%)' }}>{Icons.eye} {totalViews.toLocaleString()} total</span>
                        {popularCount > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700, backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', border: '1px solid hsl(152 60% 85%)' }}>{Icons.trending} {popularCount} popular</span>}
                    </div>
                )}
            </div>

            {filteredTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'hsl(220 15% 50%)', fontWeight: 500, flexWrap: 'wrap', gap: '0.25rem' }}>
                    <span>Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredTotal)} of {filteredTotal} propert{filteredTotal !== 1 ? 'ies' : 'y'}</span>
                </div>
            )}

            {viewedProperties.length > 0 ? (
                <>
                    <div className="views-grid">
                        {paginatedViews.map(property => <ViewCard key={property.id} property={property} onView={onView} />)}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
            ) : (
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                    <div style={{ color: 'hsl(220 15% 68%)', margin: '0 auto 1rem', display: 'flex', justifyContent: 'center' }}>{Icons.empty}</div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'hsl(220 25% 15%)', margin: '0 0 0.35rem' }}>No Views Yet</h3>
                    <p style={{ color: 'hsl(220 15% 52%)', fontSize: '0.82rem', margin: 0 }}>Only listings with at least one view are shown here.</p>
                </div>
            )}
        </div>
    );
};

export default ViewsTab;