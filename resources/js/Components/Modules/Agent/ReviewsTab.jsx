import { useState } from 'react';
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
    message:    <Ico d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    check:      <Ico d="M5 13l4 4L19 7" />,
    eye:        <Ico d={['M15 12a3 3 0 11-6 0 3 3 0 016 0z','M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z']} />,
    send:       <Ico d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />,
    empty:      <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" size="2.5rem" sw={1.2} />,
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
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ));
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const initial = (name) => (name || 'A').charAt(0).toUpperCase();
const hue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
const fmtDate = (v) => {
    if (!v) return '—';
    return new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// ─── Review Card ──────────────────────────────────────────────────────────────
const ReviewCard = ({ review, onRespond, respondingTo, responseText, setResponseText, onSubmitResponse, onCancelResponse, processing, onView }) => {
    const hasAttributes = review.landlord_responsive || review.property_matched_description || review.fair_pricing || review.good_communication;
    const isResponding = respondingTo === review.id;

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
            {/* Rating strip */}
            <div style={{ 
                height: 3, 
                backgroundColor: (review.overall_rating >= 4) ? 'hsl(152 60% 40%)' 
                    : (review.overall_rating >= 3) ? 'hsl(38 92% 50%)' 
                    : 'hsl(0 72% 48%)',
                opacity: 0.7 
            }} />

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
                    Property #{review.rental_id || 'Unknown'}
                </div>

                {/* Attribute pills */}
                {hasAttributes && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {review.landlord_responsive == 1 && (
                            <span style={{ padding: '0.18rem 0.45rem', fontSize: '0.63rem', fontWeight: 700, backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', borderRadius: 999, border: '1px solid hsl(152 60% 85%)' }}>
                                ✓ Responsive
                            </span>
                        )}
                        {review.property_matched_description == 1 && (
                            <span style={{ padding: '0.18rem 0.45rem', fontSize: '0.63rem', fontWeight: 700, backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', borderRadius: 999, border: '1px solid hsl(152 60% 85%)' }}>
                                ✓ Accurate
                            </span>
                        )}
                        {review.fair_pricing == 1 && (
                            <span style={{ padding: '0.18rem 0.45rem', fontSize: '0.63rem', fontWeight: 700, backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', borderRadius: 999, border: '1px solid hsl(152 60% 85%)' }}>
                                ✓ Fair Price
                            </span>
                        )}
                        {review.good_communication == 1 && (
                            <span style={{ padding: '0.18rem 0.45rem', fontSize: '0.63rem', fontWeight: 700, backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', borderRadius: 999, border: '1px solid hsl(152 60% 85%)' }}>
                                ✓ Good Comm
                            </span>
                        )}
                    </div>
                )}

                {/* Comment */}
                {review.comments && (
                    <div style={{ 
                        padding: '0.75rem', backgroundColor: 'hsl(40 33% 97%)', 
                        borderRadius: '0.5rem', border: '1px solid hsl(40 25% 90%)',
                        borderLeft: '3px solid hsl(174 62% 32% / 0.3)',
                    }}>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(220 20% 30%)', lineHeight: 1.55, fontStyle: 'italic' }}>
                            "{review.comments}"
                        </p>
                    </div>
                )}

                {/* Agent response */}
                {review.response && (
                    <div style={{
                        padding: '0.75rem', backgroundColor: 'hsl(174 40% 97%)',
                        borderRadius: '0.5rem', border: '1px solid hsl(174 40% 88%)',
                        borderLeft: '3px solid hsl(174 62% 40%)',
                    }}>
                        <p style={{ margin: '0 0 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: 'hsl(174 62% 32%)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            Your Response{review.response_name ? ` by ${review.response_name}` : ''}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(220 25% 15%)', lineHeight: 1.55 }}>
                            {review.response}
                        </p>
                    </div>
                )}

                {/* Response form */}
                {isResponding && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <textarea 
                            placeholder="Write your response to this review..." 
                            value={responseText} 
                            onChange={(e) => setResponseText(e.target.value)} 
                            rows={3} 
                            style={{ 
                                width: '100%', padding: '0.65rem', 
                                border: '1px solid hsl(220 15% 88%)', borderRadius: '0.5rem', 
                                fontSize: '0.78rem', outline: 'none', fontFamily: 'inherit', 
                                resize: 'vertical',
                            }}
                        />
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button 
                                onClick={() => onSubmitResponse(review.id)}
                                disabled={processing}
                                style={{
                                    flex: 1, padding: '0.4rem', borderRadius: '0.4rem',
                                    border: 'none', backgroundColor: processing ? 'hsl(220 15% 70%)' : 'hsl(174 62% 32%)',
                                    color: 'white', fontSize: '0.72rem', fontWeight: 700,
                                    cursor: processing ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                                }}
                            >
                                {processing ? 'Submitting...' : 'Submit'}
                            </button>
                            <button 
                                onClick={onCancelResponse}
                                disabled={processing}
                                style={{
                                    flex: 1, padding: '0.4rem', borderRadius: '0.4rem',
                                    border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                                    color: 'hsl(220 25% 35%)', fontSize: '0.72rem', fontWeight: 700,
                                    cursor: processing ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer actions */}
            <div style={{ 
                borderTop: '1px solid hsl(220 15% 93%)', 
                padding: '0.6rem 1rem', 
                backgroundColor: 'hsl(220 15% 98.5%)',
                display: 'flex', gap: '0.4rem',
            }}>
                {/* View Property button */}
                <button
                    onClick={() => onView?.(review)}
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

                {/* Respond button (only if no response yet) */}
                {!review.response && !isResponding && (
                    <button
                        onClick={() => onRespond(review.id)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                            padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                            border: '1px solid hsl(174 62% 40%)', backgroundColor: 'white',
                            color: 'hsl(174 62% 30%)', fontSize: '0.7rem', fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                            marginLeft: 'auto',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(174 62% 30%)'; e.currentTarget.style.backgroundColor = 'hsl(174 40% 95%)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(174 62% 40%)'; e.currentTarget.style.backgroundColor = 'white'; }}
                    >
                        {Icons.message} Respond
                    </button>
                )}
            </div>
        </div>
    );
};

// ─── Reviews Tab Module ───────────────────────────────────────────────────────
const ReviewsTab = ({ 
    reviews = [], 
    respondingTo, 
    setRespondingTo,
    responseText, 
    setResponseText,
    onSubmitResponse,
    processing,
    onView,
    properties = [],
}) => {
    const total = reviews.length;
    const avgRating = total > 0 
        ? (reviews.reduce((sum, r) => sum + (Number(r.overall_rating) || 0), 0) / total).toFixed(1) 
        : '0.0';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Header + stats */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 3, height: '1.2rem', borderRadius: 999, backgroundColor: 'hsl(38 92% 50%)', flexShrink: 0 }} />
                    <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'hsl(220 25% 12%)' }}>
                        Tenant Reviews
                    </h2>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.18rem 0.6rem', borderRadius: 999, backgroundColor: 'hsl(220 15% 93%)', color: 'hsl(220 25% 35%)' }}>
                        {total}
                    </span>
                </div>

                {total > 0 && (
                    <span style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.2rem 0.6rem', borderRadius: 999,
                        fontSize: '0.68rem', fontWeight: 700,
                        backgroundColor: 'hsl(38 92% 95%)', color: 'hsl(38 92% 40%)',
                        border: '1px solid hsl(38 92% 80%)',
                    }}>
                        {Icons.star} {avgRating} avg
                    </span>
                )}
            </div>

            {/* Grid or empty */}
            {total > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.875rem',
                }}>
                    {reviews.map(review => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            onRespond={setRespondingTo}
                            respondingTo={respondingTo}
                            responseText={responseText}
                            setResponseText={setResponseText}
                            onSubmitResponse={onSubmitResponse}
                            onCancelResponse={() => { setRespondingTo(null); setResponseText(''); }}
                            processing={processing}
                            onView={onView}
                        />
                    ))}
                </div>
            ) : (
                <div style={{
                    backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)',
                    borderRadius: '0.875rem', padding: '3rem', textAlign: 'center',
                    boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)',
                }}>
                    <div style={{ color: 'hsl(220 15% 68%)', margin: '0 auto 1rem', display: 'flex', justifyContent: 'center' }}>
                        {Icons.empty}
                    </div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'hsl(220 25% 15%)', margin: '0 0 0.35rem' }}>
                        No Reviews Yet
                    </h3>
                    <p style={{ color: 'hsl(220 15% 52%)', fontSize: '0.82rem', margin: 0 }}>
                        You haven't received any reviews from tenants yet.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReviewsTab;