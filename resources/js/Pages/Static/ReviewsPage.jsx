import { useState, useMemo, useEffect } from "react";
import Header from '../../Components/Layouts/Header';
import Footer from '../../Components/Layouts/Footer';
import AppReview from '../../Components/Modules/AppReview';
import { User } from 'lucide-react';
import { usePage, Head } from '@inertiajs/react';

// Icons
const Star = ({ style }) => (
  <svg style={style} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Flag = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
);

const MessageSquare = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const Phone = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const Layers = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5" />
  </svg>
);

const ChevronLeft = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ITEMS_PER_PAGE = 9;

// ── One accent per content type, so "All" reads at a glance ──
const TYPE_STYLES = {
  all: {
    key: 'all', label: 'All Feedback', icon: Layers,
    accent: 'hsl(200 25% 22%)', accentSoft: 'hsl(200 25% 22% / 0.08)', accentBorder: 'hsl(200 25% 22% / 0.25)',
  },
  rent: {
    key: 'rent', label: 'Rent Reviews', icon: MessageSquare, tag: 'Rent Review',
    accent: 'hsl(174 62% 32%)', accentSoft: 'hsl(174 62% 32% / 0.08)', accentBorder: 'hsl(174 62% 32% / 0.25)',
  },
  report: {
    key: 'report', label: 'Reports', icon: Flag, tag: 'Report',
    accent: 'hsl(14 78% 52%)', accentSoft: 'hsl(14 78% 52% / 0.08)', accentBorder: 'hsl(14 78% 52% / 0.25)',
  },
  app: {
    key: 'app', label: 'App Reviews', icon: Phone, tag: 'App Review',
    accent: 'hsl(243 60% 58%)', accentSoft: 'hsl(243 60% 58% / 0.08)', accentBorder: 'hsl(243 60% 58% / 0.25)',
  },
};

const Pagination = ({ currentPage, totalItems, onPageChange, accent }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
      pageNumbers.push(p);
    } else if (pageNumbers[pageNumbers.length - 1] !== '…') {
      pageNumbers.push('…');
    }
  }

  const btnBase = {
    minWidth: '2.25rem',
    minHeight: '2.25rem',
    borderRadius: '0.5rem',
    border: '1.5px solid hsl(40 20% 88%)',
    backgroundColor: 'white',
    color: 'hsl(200 25% 20%)',
    fontSize: '0.8125rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
    touchAction: 'manipulation',
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
      marginTop: 'clamp(1.5rem, 4vw, 2rem)', flexWrap: 'wrap',
    }}>
      <button
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{ ...btnBase, padding: '0 0.75rem', gap: '0.25rem', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
      >
        <ChevronLeft style={{ width: '0.9rem', height: '0.9rem' }} />
        <span className="pagination-label">Prev</span>
      </button>

      {pageNumbers.map((p, i) =>
        p === '…' ? (
          <span key={`e-${i}`} style={{ padding: '0 0.25rem', color: 'hsl(200 15% 55%)', fontSize: '0.8125rem' }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            style={{
              ...btnBase,
              backgroundColor: p === currentPage ? accent : 'white',
              borderColor: p === currentPage ? accent : 'hsl(40 20% 88%)',
              color: p === currentPage ? 'white' : 'hsl(200 25% 20%)',
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{ ...btnBase, padding: '0 0.75rem', gap: '0.25rem', opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
      >
        <span className="pagination-label">Next</span>
        <ChevronRight style={{ width: '0.9rem', height: '0.9rem' }} />
      </button>
    </div>
  );
};

const renderStars = (rating, color) => {
  const ratingValue = Math.floor(rating || 0);
  return Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={i}
      style={{
        height: '0.9rem', width: '0.9rem',
        color: i < ratingValue ? color : 'hsl(40 15% 85%)',
        fill: i < ratingValue ? color : 'none',
      }}
    />
  ));
};

const reportStatusStyle = (status) => {
  const normalized = (status || 'pending').toLowerCase();
  const styles = {
    pending:   { label: 'Pending',   bg: 'hsl(40 30% 94%)',   color: 'hsl(200 25% 15%)' },
    reviewing: { label: 'Reviewing', bg: 'hsl(214 100% 95%)', color: 'hsl(214 100% 40%)' },
    resolved:  { label: 'Resolved',  bg: 'hsl(152 60% 95%)',  color: 'hsl(152 60% 40%)' },
    dismissed: { label: 'Dismissed', bg: 'hsl(0 0% 95%)',     color: 'hsl(0 0% 45%)' },
  };
  return styles[normalized] ?? styles.pending;
};

// ── One card renderer, three flavours: rent review / app review / report ──
const FeedbackCard = ({ type, item }) => {
  const styles = TYPE_STYLES[type];
  const dateLabel = new Date(item.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div
      className="feedback-card"
      style={{
        backgroundColor: 'white',
        border: '1px solid hsl(40 20% 88%)',
        borderTop: `3px solid ${styles.accent}`,
        borderRadius: '0.875rem',
        padding: 'clamp(1rem, 3vw, 1.25rem)',
        boxShadow: '0 2px 14px hsl(200 25% 15% / 0.05)',
        breakInside: 'avoid',
        marginBottom: 'clamp(0.875rem, 2.5vw, 1.125rem)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: '0.6875rem', fontWeight: '700', letterSpacing: '0.04em', textTransform: 'uppercase',
          color: styles.accent, backgroundColor: styles.accentSoft, padding: '0.1875rem 0.5rem', borderRadius: '9999px',
        }}>
          {styles.tag}
        </span>
        {type === 'report' ? (
          (() => {
            const s = reportStatusStyle(item.status);
            return (
              <span style={{ fontSize: '0.6875rem', fontWeight: '600', padding: '0.1875rem 0.5rem', borderRadius: '9999px', backgroundColor: s.bg, color: s.color }}>
                {s.label}
              </span>
            );
          })()
        ) : (
          <div style={{ display: 'flex' }}>{renderStars(item.overall_rating, styles.accent)}</div>
        )}
      </div>

      {type === 'report' ? (
        <>
          <p style={{ fontWeight: '600', fontSize: '0.9rem', color: 'hsl(200 25% 15%)', marginBottom: '0.375rem' }}>
            {item.title}
          </p>
          <p style={{ color: 'hsl(200 15% 45%)', lineHeight: '1.6', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
            "{item.report_description}"
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '2rem', height: '2rem', borderRadius: '50%', flexShrink: 0,
              backgroundColor: styles.accentSoft, color: styles.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Flag style={{ width: '1rem', height: '1rem' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: '500', color: 'hsl(200 25% 15%)' }}>{item.report_type}</p>
              <p style={{ fontSize: '0.6875rem', color: 'hsl(200 15% 45%)' }}>{dateLabel}</p>
            </div>
          </div>
        </>
      ) : (
        <>
          {item.comments && (
            <p style={{ color: 'hsl(200 15% 45%)', lineHeight: '1.6', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
              "{item.comments}"
            </p>
          )}

          {type === 'rent' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
              {[
                { key: 'landlord_responsive', label: 'Responsive' },
                { key: 'property_matched_description', label: 'Matched listing' },
                { key: 'fair_pricing', label: 'Fair pricing' },
                { key: 'good_communication', label: 'Good comms' },
              ].filter(chip => item[chip.key] !== null).map(chip => (
                <span key={chip.key} style={{
                  fontSize: '0.6875rem', fontWeight: '500',
                  padding: '0.1875rem 0.5rem', borderRadius: '9999px',
                  backgroundColor: item[chip.key] ? 'hsl(152 60% 95%)' : 'hsl(0 0% 95%)',
                  color: item[chip.key] ? 'hsl(152 60% 34%)' : 'hsl(0 0% 45%)',
                }}>
                  {item[chip.key] ? '✓' : '✕'} {chip.label}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '2rem', height: '2rem', borderRadius: '50%', flexShrink: 0,
              backgroundColor: styles.accentSoft, color: styles.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '0.8125rem',
            }}>
              {item.full_name ? <User size={15} /> : 'T'}
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: '500', color: 'hsl(200 25% 15%)' }}>{item.full_name}</p>
              <p style={{ fontSize: '0.6875rem', color: 'hsl(200 15% 45%)' }}>{dateLabel}</p>
            </div>
          </div>

          {item.response && (
            <div style={{
              marginTop: '0.75rem', padding: '0.625rem 0.75rem',
              backgroundColor: 'hsl(40 30% 96%)', borderLeft: `2px solid ${styles.accentBorder}`,
              borderRadius: '0 0.5rem 0.5rem 0',
            }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: '600', color: styles.accent, marginBottom: '0.125rem' }}>
                Agent Response {item.response_person ? `· ${item.response_person}` : ''}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>{item.response}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ReviewsSection = ({ reviews, reports, appReviews }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [page, setPage] = useState(1);
  const { auth } = usePage().props;

  const combined = useMemo(() => {
    const items = [
      ...reviews.map(r => ({ type: 'rent', item: r })),
      ...reports.map(r => ({ type: 'report', item: r })),
      ...appReviews.map(r => ({ type: 'app', item: r })),
    ];
    return items.sort((a, b) => new Date(b.item.created_at) - new Date(a.item.created_at));
  }, [reviews, reports, appReviews]);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return combined;
    return combined.filter(c => c.type === activeTab);
  }, [combined, activeTab]);

  useEffect(() => { setPage(1); }, [activeTab]);

  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + (r.overall_rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  const tabs = [
    { ...TYPE_STYLES.all, count: combined.length },
    { ...TYPE_STYLES.rent, count: reviews.length },
    { ...TYPE_STYLES.report, count: reports.length },
    { ...TYPE_STYLES.app, count: appReviews.length },
  ];

  const activeStyles = TYPE_STYLES[activeTab];

  return (
    <>
        <Head>
          <title>Reviews & Property Reports | RentTrustGh</title>
          <meta
              name="description"
              content="Read genuine tenant reviews, landlord reviews, property reports, and app reviews on RentTrustGh. Make informed rental decisions using trusted community feedback across Ghana."
          />
          <meta
              name="keywords"
              content="RentTrustGh reviews, tenant reviews Ghana, landlord reviews Ghana, property reviews Ghana, rental reviews Ghana, property reports Ghana, agent reviews Ghana, app reviews RentTrustGh"
          />
          <meta name="robots" content="index,follow,max-image-preview:large" />
          <meta name="googlebot" content="index,follow" />
          <link rel="canonical" href="https://renttrustgh.com/reviews" />

          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="RentTrustGh" />
          <meta property="og:locale" content="en_GH" />
          <meta property="og:title" content="Reviews & Property Reports | RentTrustGh" />
          <meta
              property="og:description"
              content="Browse verified tenant reviews, landlord feedback, property reports, and platform reviews to make confident rental decisions."
          />
          <meta property="og:url" content="https://renttrustgh.com/reviews" />
          <meta property="og:image" content="https://renttrustgh.com/images/seo/reviews-og.jpg" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Reviews & Property Reports | RentTrustGh" />
          <meta
              name="twitter:description"
              content="Explore trusted tenant reviews, landlord ratings, property reports, and app reviews on RentTrustGh."
          />
          <meta name="twitter:image" content="https://renttrustgh.com/images/seo/reviews-og.jpg" />

          <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "CollectionPage",
                      "name": "Reviews & Property Reports",
                      "url": "https://renttrustgh.com/reviews",
                      "description": "Browse tenant reviews, landlord reviews, property reports, and platform reviews on RentTrustGh.",
                      "isPartOf": { "@type": "WebSite", "name": "RentTrustGh", "url": "https://renttrustgh.com" },
                      "publisher": {
                          "@type": "Organization", "name": "RentTrustGh", "url": "https://renttrustgh.com",
                          "logo": { "@type": "ImageObject", "url": "https://renttrustgh.com/images/rent-trust.png" }
                      }
                  })
              }}
          />
          <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "BreadcrumbList",
                      "itemListElement": [
                          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://renttrustgh.com" },
                          { "@type": "ListItem", "position": 2, "name": "Reviews", "item": "https://renttrustgh.com/reviews" }
                      ]
                  })
              }}
          />
      </Head>

      <style>{`
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; box-sizing: border-box; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        .reviews-hero { animation: fadeIn 0.6s ease both; }
        .reviews-card { animation: fadeUp 0.6s ease 0.1s both; }

        .tab-button { min-height: 44px; -webkit-tap-highlight-color: transparent; touch-action: manipulation; flex-shrink: 0; }
        .action-button { min-height: 44px; touch-action: manipulation; }

        .tabs-container {
          display: flex; overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch;
          scrollbar-width: none; gap: 0.375rem; padding: clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 2vw, 1.25rem);
          background-color: hsl(40 30% 96%); border-bottom: 1px solid hsl(40 20% 88%);
        }
        .tabs-container::-webkit-scrollbar { display: none; }

        .tabs-container .tab-button {
          flex: 0 0 auto; padding: 0.5rem 0.875rem; border-radius: 9999px;
          border: 1.5px solid transparent; background: white; cursor: pointer;
          display: flex; align-items: center; gap: 0.375rem; font-weight: 600;
          color: hsl(200 15% 45%); transition: all 0.2s; white-space: nowrap; font-size: 0.8125rem;
        }
        .tabs-container .tab-button:active { transform: scale(0.96); }

        .feedback-grid {
          columns: 1; column-gap: clamp(0.875rem, 2.5vw, 1.125rem);
        }
        @media (min-width: 640px) { .feedback-grid { columns: 2; } }
        @media (min-width: 1024px) { .feedback-grid { columns: 3; } }

        .pagination-label { display: inline; }

        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center; z-index: 50; padding: clamp(0.5rem, 2vw, 1rem);
        }
        .modal-content {
          background: white; border-radius: clamp(0.75rem, 2vw, 1rem); max-height: 90vh; overflow: auto;
          width: 100%; max-width: 95%; position: relative;
        }
        @media (min-width: 640px) { .modal-content { max-width: 90%; } }
        @media (min-width: 1024px) { .modal-content { max-width: 60%; } }

        @media (max-width: 768px) {
          input, textarea { font-size: 16px !important; }
          .hero-mosaic { display: none !important; }
        }
        @media (max-width: 400px) {
          .pagination-label { display: none; }
          .tab-button { font-size: 0.75rem !important; padding: 0.4rem 0.6rem !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1 }}>
          {/* ── Hero Banner — mosaic background, same system as ContactPage ── */}
          {/* <div className="reviews-hero" style={{ position: 'relative', overflow: 'hidden', minHeight: '360px', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, hsl(174 62% 22%) 0%, hsl(174 55% 32%) 60%, hsl(174 45% 38%) 100%)', zIndex: 0 }} />

            <div className="hero-mosaic" style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: '56%', zIndex: 1,
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: '4px',
            }}>
              <div style={{ gridRow: '1 / 3', background: 'hsl(174 25% 22%)', overflow: 'hidden' }}>
                <img src="/images/download 3.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
              </div>
              <div style={{ background: 'hsl(200 30% 18%)', overflow: 'hidden' }}>
                <img src="/images/download 4.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
              </div>
              <div style={{ background: 'hsl(174 35% 16%)', overflow: 'hidden' }}>
                <img src="/images/download 5.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
              </div>
              <div style={{ gridColumn: '2 / 4', background: 'hsl(30 25% 18%)', overflow: 'hidden' }}>
                <img src="/images/download 1.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
              </div>
              <div style={{ background: 'hsl(220 30% 16%)', overflow: 'hidden' }}>
                <img src="/images/download 2.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
              </div>
              <div style={{ background: 'hsl(174 20% 14%)', overflow: 'hidden' }}>
                <img src="/images/download 3.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
              </div>
              <div style={{ background: 'hsl(15 25% 16%)', overflow: 'hidden' }}>
                <img src="/images/download 4.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
              </div>
            </div>

            <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.06, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            <div style={{ position: 'absolute', right: '-4rem', top: '-4rem', width: '20rem', height: '20rem', borderRadius: '50%', background: 'radial-gradient(circle, hsl(38 92% 50% / 0.18) 0%, transparent 70%)', zIndex: 2, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to right, hsl(174 60% 22% / 0.98) 0%, hsl(174 58% 22% / 0.88) 38%, hsl(174 55% 22% / 0.45) 70%, hsl(174 55% 22% / 0.15) 100%)' }} />

            <div style={{ position: 'relative', zIndex: 3, padding: 'clamp(2.5rem, 7vw, 4.5rem) clamp(1rem, 4vw, 2.5rem)', maxWidth: '560px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: '600', marginBottom: '1.25rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'hsl(38 92% 60%)', animation: 'pulse 2s ease infinite', flexShrink: 0 }} />
                {combined.length} pieces of community feedback
              </div>
              <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                Real reviews,<br />
                <span style={{ color: 'hsl(40 90% 70%)' }}>real trust.</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)', lineHeight: '1.6', maxWidth: '420px', marginBottom: avgRating ? '1.5rem' : 0 }}>
                Tenant experiences, property reports, and platform feedback from renters across Ghana — unfiltered, and rated by the people who lived it.
              </p>
              {avgRating && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{ display: 'flex' }}>{renderStars(Math.round(avgRating), 'hsl(38 92% 60%)')}</div>
                  <span style={{ color: 'white', fontWeight: '700', fontSize: '1rem' }}>{avgRating}</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8125rem' }}>average from {reviews.length} tenant review{reviews.length === 1 ? '' : 's'}</span>
                </div>
              )}
            </div>
          </div> */}

          {/* ── Main Content ── */}
          <div style={{ padding: 'clamp(2rem, 6vw, 4rem) clamp(0.75rem, 3vw, 1rem)' }}>
            <div style={{ maxWidth: '78rem', margin: '0 auto' }}>
              <div className="reviews-card" style={{
                backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '1.25rem',
                boxShadow: '0 4px 32px hsl(200 25% 15% / 0.07)', overflow: 'hidden',
              }}>
                {/* Tabs — each pill wears its type's color when active */}
                <div className="tabs-container">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        className="tab-button"
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                          backgroundColor: isActive ? tab.accent : 'white',
                          borderColor: isActive ? tab.accent : 'hsl(40 20% 88%)',
                          color: isActive ? 'white' : 'hsl(200 15% 45%)',
                        }}
                      >
                        <Icon style={{ height: '1rem', width: '1rem' }} />
                        <span>{tab.label}</span>
                        <span style={{
                          backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'hsl(40 25% 92%)',
                          color: isActive ? 'white' : 'hsl(200 25% 25%)',
                          padding: '0.0625rem 0.4375rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: '700',
                        }}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Header */}
                <div style={{
                  padding: 'clamp(1rem, 3vw, 1.5rem)', borderBottom: '1px solid hsl(40 20% 88%)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'clamp(0.5rem, 2vw, 1rem)',
                }}>
                  <div>
                    <h3 style={{ fontSize: 'clamp(1.125rem, 4vw, 1.25rem)', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.25rem', lineHeight: '1.2' }}>
                      {activeStyles.label}
                    </h3>
                    <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)' }}>
                      {filtered.length} item{filtered.length === 1 ? '' : 's'}{activeTab === 'all' ? ' across every category' : ''}
                    </p>
                  </div>
                  <button
                    className="action-button"
                    onClick={() => {
                      if (!auth?.agent && !auth?.super && !auth?.tenant) {
                        window.location.href = '/sign-up';
                      } else {
                        setShowReviewForm(true);
                      }
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                      color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '500', cursor: 'pointer',
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', whiteSpace: 'nowrap', minHeight: '44px', touchAction: 'manipulation',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Write App Review
                  </button>
                </div>

                {/* Card wall */}
                <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
                  {paged.length === 0 ? (
                    <p style={{ color: 'hsl(200 15% 45%)', fontSize: '0.875rem', textAlign: 'center', padding: '2.5rem 0' }}>
                      Nothing here yet.
                    </p>
                  ) : (
                    <div className="feedback-grid">
                      {paged.map(({ type, item }) => (
                        <FeedbackCard key={`${type}-${item.id}`} type={type} item={item} />
                      ))}
                    </div>
                  )}

                  <Pagination currentPage={page} totalItems={filtered.length} onPageChange={setPage} accent={activeStyles.accent} />
                </div>
              </div>
            </div>
          </div>
        </main>

        {showReviewForm && (
          <div className="modal-overlay" onClick={() => setShowReviewForm(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <AppReview setShowReviewForm={setShowReviewForm} auth={auth} />
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default ReviewsSection;