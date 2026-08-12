import { useState, useEffect } from "react";
import Header from '../Components/Layouts/Header';
import Footer from '../Components/Layouts/Footer';
import AppReview from '../Components/Modules/AppReview';
import { User } from 'lucide-react';
import { usePage, Head } from '@inertiajs/react';

// Icons
const MessageSquare = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const Star = ({ style }) => (
  <svg style={style} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CheckCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Flag = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
);

const Phone = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
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

const ITEMS_PER_PAGE = 5;

// ── Pagination control, styled to match the site's teal accent system ──
const Pagination = ({ currentPage, totalItems, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const windowSize = 1;
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= windowSize) {
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.375rem',
      marginTop: 'clamp(1.5rem, 4vw, 2rem)',
      paddingTop: 'clamp(1.25rem, 3vw, 1.5rem)',
      borderTop: '1px solid hsl(40 20% 88%)',
      flexWrap: 'wrap',
    }}>
      <button
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{
          ...btnBase,
          padding: '0 0.75rem',
          gap: '0.25rem',
          opacity: currentPage === 1 ? 0.4 : 1,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
        }}
      >
        <ChevronLeft style={{ width: '0.9rem', height: '0.9rem' }} />
        <span className="pagination-label">Prev</span>
      </button>

      {pageNumbers.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} style={{ padding: '0 0.25rem', color: 'hsl(200 15% 55%)', fontSize: '0.8125rem' }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            style={{
              ...btnBase,
              backgroundColor: p === currentPage ? 'hsl(174 62% 32%)' : 'white',
              borderColor: p === currentPage ? 'hsl(174 62% 32%)' : 'hsl(40 20% 88%)',
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
        style={{
          ...btnBase,
          padding: '0 0.75rem',
          gap: '0.25rem',
          opacity: currentPage === totalPages ? 0.4 : 1,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
        }}
      >
        <span className="pagination-label">Next</span>
        <ChevronRight style={{ width: '0.9rem', height: '0.9rem' }} />
      </button>
    </div>
  );
};

const ReviewsSection = ({ reviews, reports, appReviews }) => {
  const [activeTab, setActiveTab] = useState("rent");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { auth } = usePage().props;

  const [rentPage, setRentPage] = useState(1);
  const [reportsPage, setReportsPage] = useState(1);
  const [appPage, setAppPage] = useState(1);

  // Reset to page 1 whenever the underlying data set changes size
  useEffect(() => { setRentPage(1); }, [reviews.length]);
  useEffect(() => { setReportsPage(1); }, [reports.length]);
  useEffect(() => { setAppPage(1); }, [appReviews.length]);

  const paginate = (list, page) => list.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const pagedReviews = paginate(reviews, rentPage);
  const pagedReports = paginate(reports, reportsPage);
  const pagedAppReviews = paginate(appReviews, appPage);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + (r.overall_rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  const renderStars = (rating) => {
    const ratingValue = Math.floor(rating || 0);
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        style={{
          height: 'clamp(0.875rem, 2.5vw, 1rem)',
          width: 'clamp(0.875rem, 2.5vw, 1rem)',
          color: i < ratingValue ? 'hsl(38 92% 50%)' : 'hsl(200 15% 45%)',
          fill: i < ratingValue ? 'hsl(38 92% 50%)' : 'none'
        }}
      />
    ));
  };

  const reviewCheckItems = [
    { key: "landlord_responsive", label: "Landlord was responsive" },
    { key: "property_matched_description", label: "Property matched description" },
    { key: "fair_pricing", label: "Fair pricing" },
    { key: "good_communication", label: "Good communication" },
  ];

  const tabs = [
    { id: "rent", label: "Rent Reviews", icon: MessageSquare, count: reviews.length },
    { id: "reports", label: "Reports", icon: Flag, count: reports.length },
    { id: "app", label: "App Reviews", icon: Phone, count: appReviews.length }
  ];

  const renderReportStatusBadge = (status) => {
    const normalized = (status || 'pending').toLowerCase();
    const styles = {
      pending:    { label: 'Pending',    bg: 'hsl(40 30% 94%)',    color: 'hsl(200 25% 15%)', border: 'hsl(40 20% 88%)' },
      reviewing:  { label: 'Reviewing',  bg: 'hsl(214 100% 95%)',  color: 'hsl(214 100% 40%)', border: 'hsl(214 100% 80%)' },
      resolved:   { label: 'Resolved',   bg: 'hsl(152 60% 95%)',  color: 'hsl(152 60% 40%)', border: 'hsl(152 60% 80%)' },
      dismissed:  { label: 'Dismissed',  bg: 'hsl(0 0% 95%)',     color: 'hsl(0 0% 45%)',    border: 'hsl(0 0% 80%)' },
    };
    const s = styles[normalized] ?? styles.pending;
    return (
      <span style={{
        padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.75rem)',
        borderRadius: '9999px',
        fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
        fontWeight: '500',
        backgroundColor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: 'nowrap'
      }}>
        {s.label}
      </span>
    );
  };

  return (
    <>
        <Head>
          <title>Reviews & Property Reports | RentTrustGh</title>

          {/* Primary Meta */}
          <meta
              name="description"
              content="Read genuine tenant reviews, landlord reviews, property reports, and app reviews on RentTrustGh. Make informed rental decisions using trusted community feedback across Ghana."
          />

          <meta
              name="keywords"
              content="RentTrustGh reviews, tenant reviews Ghana, landlord reviews Ghana, property reviews Ghana, rental reviews Ghana, property reports Ghana, agent reviews Ghana, app reviews RentTrustGh"
          />

          <meta
              name="robots"
              content="index,follow,max-image-preview:large"
          />

          <meta
              name="googlebot"
              content="index,follow"
          />

          {/* Canonical */}
          <link
              rel="canonical"
              href="https://renttrustgh.com/reviews"
          />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="RentTrustGh" />
          <meta property="og:locale" content="en_GH" />

          <meta
              property="og:title"
              content="Reviews & Property Reports | RentTrustGh"
          />

          <meta
              property="og:description"
              content="Browse verified tenant reviews, landlord feedback, property reports, and platform reviews to make confident rental decisions."
          />

          <meta
              property="og:url"
              content="https://renttrustgh.com/reviews"
          />

          <meta
              property="og:image"
              content="https://renttrustgh.com/images/seo/reviews-og.jpg"
          />

          {/* Twitter */}
          <meta
              name="twitter:card"
              content="summary_large_image"
          />

          <meta
              name="twitter:title"
              content="Reviews & Property Reports | RentTrustGh"
          />

          <meta
              name="twitter:description"
              content="Explore trusted tenant reviews, landlord ratings, property reports, and app reviews on RentTrustGh."
          />

          <meta
              name="twitter:image"
              content="https://renttrustgh.com/images/seo/reviews-og.jpg"
          />

          {/* Structured Data */}
          <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "CollectionPage",
                      "name": "Reviews & Property Reports",
                      "url": "https://renttrustgh.com/reviews",
                      "description": "Browse tenant reviews, landlord reviews, property reports, and platform reviews on RentTrustGh.",
                      "isPartOf": {
                          "@type": "WebSite",
                          "name": "RentTrustGh",
                          "url": "https://renttrustgh.com"
                      },
                      "publisher": {
                          "@type": "Organization",
                          "name": "RentTrustGh",
                          "url": "https://renttrustgh.com",
                          "logo": {
                              "@type": "ImageObject",
                              "url": "https://renttrustgh.com/images/rent-trust.png"
                          }
                      }
                  })
              }}
          />

          {/* Breadcrumb Schema */}
          <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "BreadcrumbList",
                      "itemListElement": [
                          {
                              "@type": "ListItem",
                              "position": 1,
                              "name": "Home",
                              "item": "https://renttrustgh.com"
                          },
                          {
                              "@type": "ListItem",
                              "position": 2,
                              "name": "Reviews",
                              "item": "https://renttrustgh.com/reviews"
                          }
                      ]
                  })
              }}
          />
      </Head>
      <style>{`
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .reviews-hero { animation: fadeIn 0.6s ease both; }
        .reviews-card { animation: fadeUp 0.6s ease 0.1s both; }

        /* ── Mobile-first touch optimisation ── */
        .tab-button {
          min-height: 44px;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          flex-shrink: 0;
        }

        .action-button {
          min-height: 44px;
          touch-action: manipulation;
        }

        /* ── Tabs container: horizontal scroll on small screens ── */
        .tabs-container {
          display: flex;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Firefox */
          gap: 0.25rem;
          border-bottom: 2px solid hsl(40 20% 88%);
          background-color: hsl(40 30% 96%);
          padding: 0.25rem 0.5rem;
        }
        .tabs-container::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }

        .tabs-container .tab-button {
          flex: 0 0 auto;
          padding: clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 2vw, 1.25rem);
          border: none;
          background: transparent;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: clamp(0.25rem, 1vw, 0.5rem);
          font-weight: 500;
          color: hsl(200 15% 45%);
          transition: all 0.2s;
          white-space: nowrap;
          font-size: clamp(0.75rem, 2vw, 0.875rem);
        }
        .tabs-container .tab-button.active {
          font-weight: 600;
          color: hsl(174 62% 32%);
          border-bottom-color: hsl(174 62% 32%);
          background: white;
        }
        .tabs-container .tab-button:active {
          transform: scale(0.96);
        }

        /* ── Check items grid ── */
        .check-items-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(0.375rem, 1.5vw, 0.5rem);
          font-size: clamp(0.75rem, 2vw, 0.875rem);
        }
        @media (min-width: 400px) {
          .check-items-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 640px) {
          .check-items-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }

        /* ── Review items ── */
        .review-item {
          display: flex;
          gap: clamp(0.75rem, 2vw, 1rem);
        }
        @media (max-width: 480px) {
          .review-item {
            flex-direction: column;
            gap: 0.75rem;
          }
        }

        /* ── Modal ── */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: clamp(0.5rem, 2vw, 1rem);
        }
        .modal-content {
          background: white;
          border-radius: clamp(0.75rem, 2vw, 1rem);
          max-height: 90vh;
          overflow: auto;
          width: 100%;
          max-width: 95%;
          position: relative;
        }
        @media (min-width: 640px) {
          .modal-content {
            max-width: 90%;
          }
        }
        @media (min-width: 1024px) {
          .modal-content {
            max-width: 60%;
          }
        }

        .pagination-label {
          display: inline;
        }

        /* ── Very small screens ── */
        @media (max-width: 400px) {
          .review-item {
            gap: 0.5rem;
          }
          .check-items-grid {
            gap: 0.25rem;
          }
          .tabs-container {
            padding: 0.25rem 0.25rem;
          }
          .tab-button {
            font-size: 0.7rem !important;
            padding: 0.4rem 0.6rem !important;
          }
          .count-badge {
            font-size: 0.6rem !important;
            padding: 0.1rem 0.3rem !important;
          }
          .pagination-label {
            display: none;
          }
          .hero-mosaic {
            display: none !important;
          }
        }

        /* ── Prevent zoom on input focus (iOS) ── */
        @media (max-width: 768px) {
          input, textarea {
            font-size: 16px !important;
          }
        }

        @media (max-width: 768px) {
          .hero-mosaic { display: none !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1 }}>
          {/* ── Hero Banner — mosaic background, same system as ContactPage ── */}
          <div className="reviews-hero" style={{ position: 'relative', overflow: 'hidden', minHeight: '360px', display: 'flex', alignItems: 'center' }}>

            {/* Base gradient */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, hsl(174 62% 22%) 0%, hsl(174 55% 32%) 60%, hsl(174 45% 38%) 100%)', zIndex: 0 }} />

            {/* Property mosaic — right side */}
            <div className="hero-mosaic" style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: '56%', zIndex: 1,
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(3, 1fr)', gap: '4px',
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

            {/* Dot grid overlay */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.06, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

            {/* Glow accent */}
            <div style={{ position: 'absolute', right: '-4rem', top: '-4rem', width: '20rem', height: '20rem', borderRadius: '50%', background: 'radial-gradient(circle, hsl(38 92% 50% / 0.18) 0%, transparent 70%)', zIndex: 2, pointerEvents: 'none' }} />

            {/* Gradient fade — content side */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to right, hsl(174 60% 22% / 0.98) 0%, hsl(174 58% 22% / 0.88) 38%, hsl(174 55% 22% / 0.45) 70%, hsl(174 55% 22% / 0.15) 100%)' }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 3, padding: 'clamp(2.5rem, 7vw, 4.5rem) clamp(1rem, 4vw, 2.5rem)', maxWidth: '560px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: '600', marginBottom: '1.25rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'hsl(38 92% 60%)', animation: 'pulse 2s ease infinite', flexShrink: 0 }} />
                {reviews.length + reports.length + appReviews.length} pieces of community feedback
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
                  <div style={{ display: 'flex' }}>{renderStars(Math.round(avgRating))}</div>
                  <span style={{ color: 'white', fontWeight: '700', fontSize: '1rem' }}>{avgRating}</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8125rem' }}>average from {reviews.length} tenant review{reviews.length === 1 ? '' : 's'}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Main Content ── */}
          <div style={{
            padding: 'clamp(2rem, 6vw, 4rem) clamp(0.75rem, 3vw, 1rem)',
          }}>
            <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
              <div className="reviews-card" style={{
                backgroundColor: 'white',
                border: '1px solid hsl(40 20% 88%)',
                borderRadius: '1.25rem',
                boxShadow: '0 4px 32px hsl(200 25% 15% / 0.07)',
                overflow: 'hidden'
              }}>
                {/* Tabs Navigation - horizontal scrollable */}
                <div className="tabs-container">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        className={`tab-button ${isActive ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Icon className="tab-icon" style={{
                          height: 'clamp(1rem, 3vw, 1.25rem)',
                          width: 'clamp(1rem, 3vw, 1.25rem)'
                        }} />
                        <span>{tab.label}</span>
                        <span className="count-badge" style={{
                          backgroundColor: isActive ? 'hsl(174 62% 32%)' : 'hsl(200 15% 45%)',
                          color: 'white',
                          padding: 'clamp(0.125rem, 1vw, 0.125rem) clamp(0.375rem, 2vw, 0.5rem)',
                          borderRadius: '9999px',
                          fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                          fontWeight: '600'
                        }}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Header */}
                <div style={{
                  padding: 'clamp(1rem, 3vw, 1.5rem)',
                  borderBottom: '1px solid hsl(40 20% 88%)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 'clamp(0.5rem, 2vw, 1rem)'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: 'clamp(1.125rem, 4vw, 1.25rem)',
                      fontWeight: '600',
                      color: 'hsl(200 25% 15%)',
                      marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)',
                      lineHeight: '1.2'
                    }}>
                      {activeTab === "rent" && "Tenant & Landlord Reviews"}
                      {activeTab === "reports" && "Property Reports"}
                      {activeTab === "app" && "Platform Reviews"}
                    </h3>
                    <p style={{
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      color: 'hsl(200 15% 45%)'
                    }}>
                      {activeTab === "rent" && `${reviews.length} reviews from tenants`}
                      {activeTab === "reports" && `${reports.length} reports submitted`}
                      {activeTab === "app" && `${appReviews.length} reviews of our platform`}
                    </p>
                  </div>
                  {activeTab === "app" && (
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
                        padding: 'clamp(0.5rem, 2vw, 0.5rem) clamp(0.75rem, 3vw, 1rem)',
                        background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                        fontWeight: '500',
                        cursor: 'pointer',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        whiteSpace: 'nowrap',
                        minHeight: '44px',
                        touchAction: 'manipulation'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      Write App Review
                    </button>
                  )}
                </div>

                {/* Content */}
                <div style={{
                  padding: 'clamp(1rem, 3vw, 1.5rem)'
                }}>
                  {/* Rent Reviews Tab */}
                  {activeTab === "rent" && (
                    <>
                      {pagedReviews.length === 0 && (
                        <p style={{ color: 'hsl(200 15% 45%)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
                          No tenant reviews yet.
                        </p>
                      )}
                      {pagedReviews.map((review, reviewIndex) => (
                        <div key={review.id}>
                          <div className="review-item" style={{
                            marginBottom: reviewIndex < pagedReviews.length - 1 ? 'clamp(1rem, 3vw, 1.5rem)' : 0
                          }}>
                            <div style={{
                              width: 'clamp(2.5rem, 8vw, 2.5rem)',
                              height: 'clamp(2.5rem, 8vw, 2.5rem)',
                              borderRadius: '50%',
                              backgroundColor: 'hsl(174 62% 32% / 0.1)',
                              color: 'hsl(174 62% 32%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                              fontWeight: '600',
                              flexShrink: 0
                            }}>
                              {review.full_name ? <User size={20} /> : 'T'}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'clamp(0.25rem, 1vw, 0.5rem)',
                                marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)',
                                flexWrap: 'wrap'
                              }}>
                                <span style={{
                                  fontWeight: '500',
                                  color: 'hsl(200 25% 15%)',
                                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                                }}>
                                  {review.full_name}
                                </span>
                                <div style={{ display: 'flex' }}>
                                  {renderStars(review.overall_rating)}
                                </div>
                              </div>

                              <p style={{
                                fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                                color: 'hsl(200 15% 45%)',
                                marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)'
                              }}>
                                {new Date(review.created_at).toLocaleDateString('en-GB', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>

                              <div className="check-items-grid">
                                {reviewCheckItems.map((item) => {
                                  const value = review[item.key];
                                  if (value === null) return null;
                                  return (
                                    <div
                                      key={item.key}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'clamp(0.25rem, 1vw, 0.375rem)',
                                        color: value ? 'hsl(152 60% 40%)' : 'hsl(200 15% 45%)'
                                      }}
                                    >
                                      {value ? (
                                        <CheckCircle style={{
                                          height: 'clamp(0.75rem, 2vw, 0.875rem)',
                                          width: 'clamp(0.75rem, 2vw, 0.875rem)'
                                        }} />
                                      ) : (
                                        <XCircle style={{
                                          height: 'clamp(0.75rem, 2vw, 0.875rem)',
                                          width: 'clamp(0.75rem, 2vw, 0.875rem)'
                                        }} />
                                      )}
                                      {item.label}
                                    </div>
                                  );
                                })}
                              </div>

                              {review.comments && (
                                <p style={{
                                  color: 'hsl(200 15% 45%)',
                                  lineHeight: '1.6',
                                  marginTop: 'clamp(0.5rem, 2vw, 0.75rem)',
                                  marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)',
                                  fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
                                }}>
                                  "{review.comments}"
                                </p>
                              )}

                              {review.response && (
                                <div style={{
                                  marginTop: 'clamp(0.75rem, 2vw, 1rem)',
                                  paddingLeft: 'clamp(0.75rem, 2vw, 1rem)',
                                  borderLeft: '2px solid hsl(174 62% 32% / 0.2)',
                                  backgroundColor: 'hsl(40 30% 94%)',
                                  padding: 'clamp(0.5rem, 2vw, 0.75rem)',
                                  borderRadius: '0 clamp(0.375rem, 2vw, 0.5rem) clamp(0.375rem, 2vw, 0.5rem) 0'
                                }}>
                                  <p style={{
                                    fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                                    fontWeight: '500',
                                    color: 'hsl(174 62% 32%)',
                                    marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)'
                                  }}>
                                    Agent Response
                                  </p>
                                  <span style={{
                                    color: 'hsl(200 25% 15%)',
                                    fontSize: 'clamp(0.875rem, 1.5vw, .5rem)'
                                  }}>
                                    {review.response_person}
                                  </span>
                                  <p style={{
                                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                    color: 'hsl(200 15% 45%)'
                                  }}>
                                    {review.response}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {reviewIndex < pagedReviews.length - 1 && (
                            <div style={{
                              height: '1px',
                              backgroundColor: 'hsl(40 20% 88%)',
                              margin: 'clamp(1rem, 3vw, 1.5rem) 0'
                            }} />
                          )}
                        </div>
                      ))}
                      <Pagination currentPage={rentPage} totalItems={reviews.length} onPageChange={setRentPage} />
                    </>
                  )}

                  {/* Reports Tab */}
                  {activeTab === "reports" && (
                    <>
                      {pagedReports.length === 0 && (
                        <p style={{ color: 'hsl(200 15% 45%)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
                          No reports have been submitted.
                        </p>
                      )}
                      {pagedReports.map((report, reportIndex) => (
                        <div key={report.id}>
                          <div style={{
                            marginBottom: reportIndex < pagedReports.length - 1 ? 'clamp(1rem, 3vw, 1.5rem)' : 0
                          }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'start',
                              marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)',
                              flexWrap: 'wrap',
                              gap: 'clamp(0.25rem, 1vw, 0.5rem)'
                            }}>
                              <div>
                                <h4 style={{
                                  fontWeight: '600',
                                  color: 'hsl(200 25% 15%)',
                                  marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)',
                                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                                }}>
                                  {report.report_type}
                                </h4>
                                <p style={{
                                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                  color: 'hsl(174 62% 32%)',
                                  fontWeight: '500'
                                }}>
                                  {report.title}
                                </p>
                              </div>
                              {renderReportStatusBadge(report.status)}
                            </div>
                            <p style={{
                              color: 'hsl(200 15% 45%)',
                              lineHeight: '1.6',
                              marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)',
                              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
                            }}>
                              {report.report_description}
                            </p>
                            <p style={{
                              fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                              color: 'hsl(200 15% 45%)'
                            }}>
                              Reported on {new Date(report.created_at).toLocaleDateString('en-GB', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>

                          {reportIndex < pagedReports.length - 1 && (
                            <div style={{
                              height: '1px',
                              backgroundColor: 'hsl(40 20% 88%)',
                              margin: 'clamp(1rem, 3vw, 1.5rem) 0'
                            }} />
                          )}
                        </div>
                      ))}
                      <Pagination currentPage={reportsPage} totalItems={reports.length} onPageChange={setReportsPage} />
                    </>
                  )}

                  {/* App Reviews Tab */}
                  {activeTab === "app" && (
                    <>
                      {pagedAppReviews.length === 0 && (
                        <p style={{ color: 'hsl(200 15% 45%)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
                          No platform reviews yet.
                        </p>
                      )}
                      {pagedAppReviews.map((review, reviewIndex) => (
                        <div key={review.id}>
                          <div className="review-item" style={{
                            marginBottom: reviewIndex < pagedAppReviews.length - 1 ? 'clamp(1rem, 3vw, 1.5rem)' : 0
                          }}>
                            <div style={{
                              width: 'clamp(2.5rem, 8vw, 2.5rem)',
                              height: 'clamp(2.5rem, 8vw, 2.5rem)',
                              borderRadius: '50%',
                              backgroundColor: 'hsl(174 62% 32% / 0.1)',
                              color: 'hsl(174 62% 32%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                              fontWeight: '600',
                              flexShrink: 0
                            }}>
                              {review.full_name ? <User size={20} /> : "T"}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'clamp(0.25rem, 1vw, 0.5rem)',
                                marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)',
                                flexWrap: 'wrap'
                              }}>
                                <span style={{
                                  fontWeight: '500',
                                  color: 'hsl(200 25% 15%)',
                                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                                }}>
                                  {review.full_name}
                                </span>
                                <div style={{ display: 'flex' }}>
                                  {renderStars(review.overall_rating)}
                                </div>
                              </div>

                              <p style={{
                                fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                                color: 'hsl(200 15% 45%)',
                                marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)'
                              }}>
                                {new Date(review.created_at).toLocaleDateString('en-GB', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>

                              <p style={{
                                color: 'hsl(200 15% 45%)',
                                lineHeight: '1.6',
                                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
                              }}>
                                {review.comments}
                              </p>
                            </div>
                          </div>

                          {reviewIndex < pagedAppReviews.length - 1 && (
                            <div style={{
                              height: '1px',
                              backgroundColor: 'hsl(40 20% 88%)',
                              margin: 'clamp(1rem, 3vw, 1.5rem) 0'
                            }} />
                          )}
                        </div>
                      ))}
                      <Pagination currentPage={appPage} totalItems={appReviews.length} onPageChange={setAppPage} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* App Review Modal */}
        {activeTab === "app" && showReviewForm && (
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