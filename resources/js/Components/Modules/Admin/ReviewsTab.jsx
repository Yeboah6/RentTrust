import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = '1rem', sw = 1.8 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    star:       <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    user:       <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    calendar:   <Ico d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    eye:        <Ico d={['M15 12a3 3 0 11-6 0 3 3 0 016 0z','M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z']} />,
    search:     <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    trash:      <Ico d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    message:    <Ico d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    check:      <Ico d="M5 13l4 4L19 7" />,
    chevronLeft:  <Ico d="M15 19l-7-7 7-7" />,
    chevronRight: <Ico d="M9 5l7 7-7 7" />,
    empty:      <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" size="2.5rem" sw={1.2} />,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const initial = (name) => (name || 'A').charAt(0).toUpperCase();
const hue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
const fmtDate = (v) => {
    if (!v) return '—';
    return new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// ─── Star Rating ──────────────────────────────────────────────────────────────
const StarRating = ({ rating }) => {
    const numericRating = Number(rating) || 0;
    return Array.from({ length: 5 }).map((_, i) => (
        <svg 
            key={i}
            style={{ 
                height: '0.8rem', width: '0.8rem',
                color: i < Math.floor(numericRating) ? 'hsl(38 92% 50%)' : 'hsl(220 15% 80%)',
                fill: i < Math.floor(numericRating) ? 'hsl(38 92% 50%)' : 'none',
            }} 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ));
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

// ─── Single Review Card ───────────────────────────────────────────────────────
const ReviewCard = ({ review, properties, onViewProperty, onDelete }) => {
    const hasAttributes = review.landlord_responsive || review.property_matched_description || review.fair_pricing || review.good_communication;

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
            {/* Rating colour strip */}
            <div style={{ 
                height: 3, 
                backgroundColor: (review.overall_rating >= 4) ? 'hsl(152 60% 40%)' 
                    : (review.overall_rating >= 3) ? 'hsl(38 92% 50%)' 
                    : 'hsl(0 72% 48%)',
                opacity: 0.7 
            }} />

            {/* Card body */}
            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                
                {/* Reviewer header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                        <div style={{
                            width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem', flexShrink: 0,
                            backgroundColor: `hsl(${hue(review.full_name)} 45% 90%)`,
                            color: `hsl(${hue(review.full_name)} 45% 30%)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', fontWeight: 800,
                        }}>
                            {initial(review.full_name)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: 'hsl(220 25% 12%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {review.full_name || 'Anonymous'}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                                <div style={{ display: 'flex', gap: '0.1rem' }}>
                                    <StarRating rating={review.overall_rating} />
                                </div>
                                <span style={{ fontSize: '0.65rem', color: 'hsl(220 15% 55%)', fontWeight: 600 }}>
                                    {review.overall_rating ? Number(review.overall_rating).toFixed(1) : '—'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'hsl(220 15% 60%)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {fmtDate(review.created_at)}
                    </span>
                </div>

                {/* Property reference */}
                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    fontSize: '0.68rem', color: 'hsl(220 15% 50%)',
                    padding: '0.3rem 0.5rem', backgroundColor: 'hsl(220 15% 97%)',
                    borderRadius: '0.375rem',
                }}>
                    <Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" size="0.7rem" />
                    Property #{review.rental_id}
                    {review.review_type && (
                        <span style={{ 
                            padding: '0.1rem 0.35rem', borderRadius: 999,
                            fontSize: '0.6rem', fontWeight: 700,
                            backgroundColor: 'hsl(174 40% 93%)', color: 'hsl(174 62% 32%)',
                            textTransform: 'capitalize',
                        }}>
                            {review.review_type}
                        </span>
                    )}
                </div>

                {/* Divider */}
                <div style={{ height: 1, backgroundColor: 'hsl(220 15% 94%)' }} />

                {/* Attribute pills */}
                {hasAttributes && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {review.landlord_responsive == 1 && (
                            <span style={{ 
                                padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: 700,
                                backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)',
                                borderRadius: 999, border: '1px solid hsl(152 60% 85%)',
                                display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                            }}>
                                {Icons.check} Responsive
                            </span>
                        )}
                        {review.property_matched_description == 1 && (
                            <span style={{ 
                                padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: 700,
                                backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)',
                                borderRadius: 999, border: '1px solid hsl(152 60% 85%)',
                                display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                            }}>
                                {Icons.check} Accurate
                            </span>
                        )}
                        {review.fair_pricing == 1 && (
                            <span style={{ 
                                padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: 700,
                                backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)',
                                borderRadius: 999, border: '1px solid hsl(152 60% 85%)',
                                display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                            }}>
                                {Icons.check} Fair Price
                            </span>
                        )}
                        {review.good_communication == 1 && (
                            <span style={{ 
                                padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: 700,
                                backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)',
                                borderRadius: 999, border: '1px solid hsl(152 60% 85%)',
                                display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                            }}>
                                {Icons.check} Communication
                            </span>
                        )}
                    </div>
                )}

                {/* Comment */}
                {review.comments && (
                    <div style={{ 
                        padding: '0.75rem', 
                        backgroundColor: 'hsl(40 33% 97%)', 
                        borderRadius: '0.5rem',
                        border: '1px solid hsl(40 25% 90%)',
                        borderLeft: '3px solid hsl(174 62% 32% / 0.3)',
                    }}>
                        <p style={{ 
                            margin: 0, fontSize: '0.78rem', color: 'hsl(220 20% 30%)', 
                            lineHeight: 1.55, fontStyle: 'italic' 
                        }}>
                            "{review.comments}"
                        </p>
                    </div>
                )}

                {/* Agent response */}
                {review.response && (
                    <div style={{
                        padding: '0.75rem',
                        backgroundColor: 'hsl(174 40% 97%)',
                        borderRadius: '0.5rem',
                        border: '1px solid hsl(174 40% 88%)',
                        borderLeft: '3px solid hsl(174 62% 40%)',
                    }}>
                        <p style={{ 
                            margin: '0 0 0.25rem', fontSize: '0.65rem', fontWeight: 700, 
                            color: 'hsl(174 62% 32%)', letterSpacing: '0.04em', textTransform: 'uppercase' 
                        }}>
                            {Icons.message} Response{review.response_person ? ` by ${review.response_person}` : ''}
                        </p>
                        <p style={{ 
                            margin: 0, fontSize: '0.78rem', color: 'hsl(220 25% 15%)', 
                            lineHeight: 1.55 
                        }}>
                            {review.response}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer actions */}
            <div style={{ 
                borderTop: '1px solid hsl(220 15% 93%)', 
                padding: '0.6rem 1rem', 
                backgroundColor: 'hsl(220 15% 98.5%)',
                display: 'flex', gap: '0.4rem', flexWrap: 'wrap',
            }}>
                {review.review_type === 'rent' && (
                    <button
                        onClick={() => {
                            const property = properties?.find(p => p.id === review.rental_id);
                            if (property) onViewProperty?.(property);
                        }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                            padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                            border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                            color: 'hsl(174 62% 30%)', fontSize: '0.7rem', fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(174 62% 40%)'; e.currentTarget.style.backgroundColor = 'hsl(174 40% 97%)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'; e.currentTarget.style.backgroundColor = 'white'; }}
                    >
                        {Icons.eye} View Property
                    </button>
                )}
                
                <button
                    onClick={() => {
                        if (confirm('Delete this review? This cannot be undone.')) {
                            onDelete?.(review.id);
                        }
                    }}
                    style={{
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

// ─── Reviews Tab Module ───────────────────────────────────────────────────────
const ReviewsTab = ({ reviews = [], properties = [], onViewProperty, showToast }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all'); // new: app/rent filter
    const [currentPage, setCurrentPage] = useState(1);
    
    // Get unique review types and their counts
    const { reviewTypes, typeCounts } = useMemo(() => {
        const types = [...new Set(reviews.map(r => r.review_type).filter(Boolean))];
        const counts = {};
        types.forEach(t => { counts[t] = reviews.filter(r => r.review_type === t).length; });
        counts['all'] = reviews.length;
        return { reviewTypes: types, typeCounts: counts };
    }, [reviews]);

    const filteredReviews = useMemo(() => {
        return reviews.filter(review => {
            const q = searchTerm.toLowerCase();
            const matchesSearch = !q || [
                review.full_name,
                review.comments,
                review.review_type,
                review.rental_id?.toString(),
                review.response,
            ].filter(Boolean).some(value => value?.toString().toLowerCase().includes(q));
            
            const matchesRating = ratingFilter === 'all' || String(review.overall_rating) === ratingFilter;
            const matchesType = typeFilter === 'all' || review.review_type === typeFilter;
            return matchesSearch && matchesRating && matchesType;
        });
    }, [reviews, searchTerm, ratingFilter, typeFilter]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleRatingFilterChange = (e) => {
        setRatingFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleTypeFilterChange = (e) => {
        setTypeFilter(e.target.value);
        setCurrentPage(1);
    };

    const total = reviews.length;
    const filteredTotal = filteredReviews.length;
    const avgRating = total > 0 
        ? (reviews.reduce((sum, r) => sum + (Number(r.overall_rating) || 0), 0) / total).toFixed(1) 
        : '0.0';
    
    const ratingCounts = {
        5: reviews.filter(r => Math.floor(Number(r.overall_rating) || 0) === 5).length,
        4: reviews.filter(r => Math.floor(Number(r.overall_rating) || 0) === 4).length,
        3: reviews.filter(r => Math.floor(Number(r.overall_rating) || 0) === 3).length,
        2: reviews.filter(r => Math.floor(Number(r.overall_rating) || 0) === 2).length,
        1: reviews.filter(r => Math.floor(Number(r.overall_rating) || 0) === 1).length,
    };

    // Pagination
    const totalPages = Math.ceil(filteredTotal / ITEMS_PER_PAGE);
    const paginatedReviews = filteredReviews.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleDelete = (reviewId) => {
        router.delete(`/admin/reviews/${reviewId}`, {
            onSuccess: () => showToast?.('Review Deleted', 'Removed successfully.'),
            onError: () => showToast?.('Delete Failed', 'Please try again.', 'error'),
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Section heading + stats */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 3, height: '1.2rem', borderRadius: 999, backgroundColor: 'hsl(38 92% 50%)', flexShrink: 0 }} />
                    <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'hsl(220 25% 12%)', letterSpacing: '-0.01em' }}>
                        Platform Reviews
                    </h2>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.18rem 0.6rem', borderRadius: 999, backgroundColor: 'hsl(220 15% 93%)', color: 'hsl(220 25% 35%)' }}>
                        {total}
                    </span>
                </div>

                {/* Rating summary pills + review type counts */}
                {total > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ 
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            padding: '0.2rem 0.6rem', borderRadius: 999,
                            fontSize: '0.68rem', fontWeight: 700,
                            backgroundColor: 'hsl(38 92% 95%)', color: 'hsl(38 92% 40%)',
                            border: '1px solid hsl(38 92% 80%)',
                        }}>
                            {Icons.star} {avgRating} avg
                        </span>
                        {/* Review type counts */}
                        {reviewTypes.map(type => (
                            typeCounts[type] > 0 && (
                                <span key={type} style={{ 
                                    display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                                    padding: '0.2rem 0.5rem', borderRadius: 999,
                                    fontSize: '0.65rem', fontWeight: 700,
                                    backgroundColor: 'hsl(174 40% 93%)', color: 'hsl(174 62% 32%)',
                                    border: '1px solid hsl(174 40% 85%)',
                                }}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)} {typeCounts[type]}
                                </span>
                            )
                        ))}
                        {[5, 4, 3, 2, 1].map(rating => 
                            ratingCounts[rating] > 0 && (
                                <span key={rating} style={{ 
                                    display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                                    padding: '0.2rem 0.5rem', borderRadius: 999,
                                    fontSize: '0.65rem', fontWeight: 700,
                                    backgroundColor: 'hsl(40 30% 94%)', color: 'hsl(220 25% 35%)',
                                    border: '1px solid hsl(40 20% 88%)',
                                }}>
                                    {'★'.repeat(rating)}{'☆'.repeat(5 - rating)} {ratingCounts[rating]}
                                </span>
                            )
                        )}
                    </div>
                )}
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
                        placeholder="Search reviews by guest, property, comment..."
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
                        onFocus={e => e.currentTarget.style.borderColor = 'hsl(38 92% 50%)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'}
                    />
                </div>
                <select
                    value={typeFilter}
                    onChange={handleTypeFilterChange}
                    style={{
                        padding: '0.65rem 1rem', borderRadius: '0.625rem',
                        border: '1px solid hsl(220 15% 88%)',
                        backgroundColor: 'white',
                        fontSize: '0.8rem', color: 'hsl(220 25% 15%)',
                        fontFamily: 'inherit', minWidth: '130px',
                        outline: 'none', cursor: 'pointer',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'hsl(38 92% 50%)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'}
                >
                    <option value="all">All Types</option>
                    {reviewTypes.map(type => (
                        <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)} ({typeCounts[type]})
                        </option>
                    ))}
                </select>
                <select
                    value={ratingFilter}
                    onChange={handleRatingFilterChange}
                    style={{
                        padding: '0.65rem 1rem', borderRadius: '0.625rem',
                        border: '1px solid hsl(220 15% 88%)',
                        backgroundColor: 'white',
                        fontSize: '0.8rem', color: 'hsl(220 25% 15%)',
                        fontFamily: 'inherit', minWidth: '150px',
                        outline: 'none', cursor: 'pointer',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'hsl(38 92% 50%)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'}
                >
                    <option value="all">All ratings</option>
                    <option value="5">★★★★★ (5 stars)</option>
                    <option value="4">★★★★☆ (4 stars)</option>
                    <option value="3">★★★☆☆ (3 stars)</option>
                    <option value="2">★★☆☆☆ (2 stars)</option>
                    <option value="1">★☆☆☆☆ (1 star)</option>
                </select>
            </div>

            {/* Results info */}
            {filteredTotal > 0 && (
                <div style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: '0.72rem', color: 'hsl(220 15% 50%)', fontWeight: 500,
                }}>
                    <span>
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredTotal)} of {filteredTotal} review{filteredTotal !== 1 ? 's' : ''}
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
                        {paginatedReviews.map(review => (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                properties={properties}
                                onViewProperty={onViewProperty}
                                onDelete={handleDelete}
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
                        {searchTerm || ratingFilter !== 'all' || typeFilter !== 'all' ? 'No Reviews Found' : 'No Reviews Yet'}
                    </h3>
                    <p style={{ color: 'hsl(220 15% 52%)', fontSize: '0.82rem', margin: 0 }}>
                        {searchTerm || ratingFilter !== 'all' || typeFilter !== 'all'
                            ? 'No reviews match your search criteria. Try different filters.'
                            : 'There are no reviews on the platform yet.'}
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

export default ReviewsTab;