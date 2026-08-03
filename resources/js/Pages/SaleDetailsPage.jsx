import { useState, useEffect, useRef } from "react";
import Header from '../Components/Layouts/Header';
import Footer from '../Components/Layouts/Footer';
import SEO from '../Components/SEO';
import JsonLd from '../Components/JsonLd';
import { Link, usePage, useForm } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, BedDouble, Bath } from 'lucide-react';
import ReportListingDialog from "../Components/Modules/ReportListingDialog";
import ReviewForm from "../Components/Modules/ReviewForm";
import InquiryModal from "../Components/Modules/InquiryForm";
import AgentProfileModal from '../Components/Modules/AgentProfileModal';

// ─── Icon Components ───────────────────────────────────────────────────────────

const MapPin = ({ style }) => (
    <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const Calendar = ({ style }) => (
    <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const Shield = ({ style }) => (
    <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const AlertTriangle = ({ style }) => (
    <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const User = ({ style }) => (
    <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) => `GH₵${Number(n || 0).toLocaleString()}`;
const hue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

const parseImages = (imagesData) => {
    if (!imagesData) return [];
    if (Array.isArray(imagesData)) return imagesData;
    if (typeof imagesData === 'string') {
        try {
            const parsed = JSON.parse(imagesData);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
    return [];
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const buildSaleAreaSchema = (area, city, seo) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  'name': seo?.title || `${area.name} Properties for Sale`,
  'description': seo?.description || `Explore homes for sale in ${area.name}, ${city}.`,
  'url': seo?.canonical || (typeof window !== 'undefined' ? window.location.href : ''),
  'breadcrumb': {
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${typeof window !== 'undefined' ? window.location.origin : ''}/` },
      { '@type': 'ListItem', 'position': 2, 'name': 'Buy', 'item': `${typeof window !== 'undefined' ? window.location.origin : ''}/buy` },
      { '@type': 'ListItem', 'position': 3, 'name': area.name, 'item': seo?.canonical || '' }
    ]
  }
});

export default function SaleDetailsPage({ rental, reviews, days_on_market, seo }) {
    const { auth } = usePage().props;
    const areaSchema = buildSaleAreaSchema(seo);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showImageModal,    setShowImageModal]     = useState(false);
    const [showReport,        setShowReport]         = useState(false);
    const [showReview,        setShowReview]         = useState(false);
    const [showAgent,         setShowAgent]          = useState(false);
    const [showInquiry,       setShowInquiry]        = useState(false);
    const [toast,             setToast]              = useState(null);

    const images    = parseImages(rental.images);
    const amenities = typeof rental.amenities === 'string' ? JSON.parse(rental.amenities || '[]') : (rental.amenities ?? []);

    const showToast = (title, description, variant = 'success') => {
        setToast({ title, description, variant });
        setTimeout(() => setToast(null), 4000);
    };

    const authRedirect = (fn) => {
        if (!auth?.agent && !auth?.super && !auth?.tenant) {
            window.location.href = '/sign-up';
        } else {
            fn();
        }
    };

    const hasTrackedView = useRef(false);

    useEffect(() => {
        if (hasTrackedView.current || !rental?.id) {
            return;
        }

        hasTrackedView.current = true;
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (token) {
            fetch(`/api/listings/${rental.id}/track-view`, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': token },
            }).catch(() => {});
        }
    }, [rental?.id]);

    const handlePrevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
    };

    const handleNextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
    };

    const renderStars = (rating) => {
        const ratingValue = Math.floor(rating || 0);
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                style={{
                    height: 'clamp(0.875rem, 2.5vw, 1rem)',
                    width: 'clamp(0.875rem, 2.5vw, 1rem)',
                    color: i < ratingValue ? 'hsl(38 92% 50%)' : 'hsl(200 15% 45%)',
                    fill: i < ratingValue ? 'hsl(38 92% 50%)' : 'none',
                }}
            />
        ));
    };

    return (
        <>
        <SEO {...seo} />
            <JsonLd schema={areaSchema} />
            <style>{`
                * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
                h1, h2, h3, h4, h5, h6 { font-weight: 600; }

                @keyframes slideIn {
                    from { transform: translateX(400px); opacity: 0; }
                    to   { transform: translateX(0);     opacity: 1; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                @media (max-width: 768px) {
                    .carousel-button { width: clamp(2.5rem, 10vw, 3rem) !important; height: clamp(2.5rem, 10vw, 3rem) !important; }
                    .property-details-grid { grid-template-columns: 1fr !important; }
                    .modal-content { max-width: 95% !important; margin: 0.5rem; }
                    .feature-grid  { grid-template-columns: 1fr !important; }
                    .action-button { min-height: 44px; -webkit-tap-highlight-color: transparent; }
                }

                @media (max-width: 480px) {
                    .hero-image    { height: clamp(10rem, 50vw, 16rem) !important; }
                    .verified-badge { font-size: 0.75rem !important; padding: 0.25rem 0.5rem !important; }
                    .image-counter  { font-size: 0.6875rem !important; padding: 0.1875rem 0.375rem !important; }
                }

                @media (max-width: 768px) {
                    input[type="text"], input[type="email"], textarea { font-size: 16px !important; }
                }

                @media (max-height: 600px) and (orientation: landscape) {
                    .hero-image { height: 12rem !important; }
                }

                @media (min-width: 1024px) {
                    .property-details-grid { display: grid; grid-template-columns: 1fr 400px; gap: 2rem; }
                    .main-content { order: 1; }
                    .sidebar      { order: 2; }
                }

                @media (max-width: 1023px) {
                    .property-details-grid { display: flex; flex-direction: column; gap: 1.5rem; }
                    .main-content { order: 1; }
                    .sidebar      { order: 2; }
                }

                /* Image modal improvements */
                .image-modal {
                    animation: fadeIn 0.2s ease-out;
                }

                .image-modal img {
                    /* Prevent iOS zoom on double-tap */
                    -webkit-user-select: none;
                    user-select: none;
                    -webkit-touch-callout: none;
                    /* Enable smoother scrolling on iOS */
                    -webkit-user-drag: none;
                }
            `}</style>

            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
                <Header />

                <main style={{ flex: 1 }}>

                    {/* ── HERO IMAGE CAROUSEL ──────────────────────────────── */}
                    <div className="hero-image" style={{ position: 'relative', height: 'clamp(12rem, 40vw, 20rem)', background: 'linear-gradient(135deg, hsl(38 92% 50% / 0.2) 0%, hsl(38 92% 50% / 0.05) 100%)' }}>
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', backgroundColor: 'hsl(40 30% 94%)' }}>

                            {images.length > 0 ? (
                                <img
                                    src={`/storage/rental_images/${images[currentImageIndex]}`}
                                    alt={`Property image ${currentImageIndex + 1}`}
                                    onClick={() => setShowImageModal(true)}
                                    style={{ display: 'block', width: '100%', height: '100%', minWidth: '100%', minHeight: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'opacity 0.3s ease-in-out', cursor: 'zoom-in' }}
                                />
                            ) : (
                                <MapPin style={{ height: 'clamp(3rem, 10vw, 4rem)', width: 'clamp(3rem, 10vw, 4rem)', color: 'hsl(200 25% 15% / 0.2)' }} />
                            )}

                            {/* Carousel controls */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        className="carousel-button"
                                        onClick={handlePrevImage}
                                        style={{ position: 'absolute', left: 'clamp(0.5rem, 2vw, 1rem)', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 'clamp(2.5rem, 8vw, 3rem)', height: 'clamp(2.5rem, 8vw, 3rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 10, transition: 'all 0.2s', touchAction: 'manipulation' }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,1)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
                                    >
                                        <ChevronLeft size={20} style={{ color: '#374151' }} />
                                    </button>

                                    <button
                                        className="carousel-button"
                                        onClick={handleNextImage}
                                        style={{ position: 'absolute', right: 'clamp(0.5rem, 2vw, 1rem)', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 'clamp(2.5rem, 8vw, 3rem)', height: 'clamp(2.5rem, 8vw, 3rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 10, transition: 'all 0.2s', touchAction: 'manipulation' }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,1)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
                                    >
                                        <ChevronRight size={20} style={{ color: '#374151' }} />
                                    </button>

                                    {/* Dot indicators */}
                                    <div style={{ position: 'absolute', bottom: 'clamp(0.5rem, 2vw, 0.75rem)', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 'clamp(0.25rem, 1vw, 0.375rem)', padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 2vw, 0.625rem)', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '9999px', zIndex: 10 }}>
                                        {images.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                style={{ width: index === currentImageIndex ? '1.375rem' : 'clamp(0.3125rem, 1vw, 0.375rem)', height: 'clamp(0.3125rem, 1vw, 0.375rem)', borderRadius: '9999px', border: 'none', backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.25s', padding: 0 }}
                                            />
                                        ))}
                                    </div>

                                    {/* Image counter */}
                                    <div className="image-counter" style={{ position: 'absolute', top: 'clamp(0.5rem, 2vw, 0.75rem)', right: 'clamp(0.5rem, 2vw, 0.75rem)', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.375rem, 2vw, 0.5rem)', borderRadius: '0.375rem', fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)', fontWeight: '500', zIndex: 10 }}>
                                        {currentImageIndex + 1} / {images.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Verified badge */}
                        {rental.is_verified && (
                            <div style={{ position: 'absolute', top: 'clamp(0.75rem, 3vw, 1rem)', left: 'clamp(0.75rem, 3vw, 1rem)' }}>
                                <span className="verified-badge" style={{ display: 'inline-flex', alignItems: 'center', padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontWeight: '500', backgroundColor: 'hsl(152 60% 40%)', color: 'white', borderRadius: '9999px', gap: '0.375rem' }}>
                                    <Shield style={{ height: 'clamp(0.75rem, 2vw, 0.875rem)', width: 'clamp(0.75rem, 2vw, 0.875rem)' }} />
                                    Verified
                                </span>
                            </div>
                        )}
                    </div>

                    {/* ── PAGE BODY ─────────────────────────────────────────── */}
                    <div className="container mx-auto" style={{ padding: 'clamp(1rem, 3vw, 2rem) clamp(0.75rem, 3vw, 1rem)' }}>
                        <div className="property-details-grid">

                            {/* ═══ MAIN COLUMN ════════════════════════════════ */}
                            <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>

                                {/* Title & Location */}
                                <div>
                                    <h1 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1.25rem, 5vw, 2rem)', fontWeight: '700', marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)', lineHeight: '1.2' }}>
                                        {rental.title || 'Property Listing'}
                                    </h1>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.8125rem, 2.5vw, 1rem)' }}>
                                        <MapPin style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)', flexShrink: 0 }} />
                                        {[rental.area, rental.city].filter(Boolean).join(', ')}
                                    </div>
                                </div>

                                {/* Price & Features */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        <span style={{ color: 'hsl(38 92% 50%)', fontSize: 'clamp(1.25rem, 5vw, 2rem)', fontWeight: '700' }}>
                                            {fmt(rental.sale_price)}
                                        </span>
                                        <span style={{ fontSize: '0.78rem', color: 'hsl(200 15% 52%)', fontWeight: '600' }}>For Sale</span>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {rental.property_type && (
                                                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'hsl(40 30% 94%)', color: 'hsl(200 25% 28%)', border: '1px solid hsl(40 20% 86%)' }}>
                                                    {rental.property_type.charAt(0).toUpperCase() + rental.property_type.slice(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                            <BedDouble style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)', flexShrink: 0, color: 'hsl(38 92% 50%)' }} />
                                            {rental.bedrooms ?? '—'} Bedrooms
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                            <Bath style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)', flexShrink: 0, color: 'hsl(38 92% 50%)' }} />
                                            {rental.bathrooms ?? '—'} Bathrooms
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                            <Calendar style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)', flexShrink: 0, color: 'hsl(38 92% 50%)' }} />
                                            {days_on_market ?? 0} days on market
                                        </div>
                                    </div>
                                </div>

                                {/* Warning strip */}
                                <div style={{ backgroundColor: 'hsl(38 92% 50% / 0.1)', border: '1px solid hsl(38 92% 50% / 0.2)', borderRadius: '0.75rem', padding: 'clamp(0.75rem, 3vw, 1rem)', display: 'flex', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                                    <AlertTriangle style={{ height: 'clamp(1rem, 3vw, 1.25rem)', width: 'clamp(1rem, 3vw, 1.25rem)', color: 'hsl(38 92% 50%)', flexShrink: 0 }} />
                                    <p style={{ fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: 'hsl(200 25% 15%)', fontWeight: '500', lineHeight: '1.5' }}>
                                        Always inspect the property in person and engage a licensed solicitor before making any payment or signing documents.
                                    </p>
                                </div>

                                {/* Description */}
                                <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
                                    <h3 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
                                        Description
                                    </h3>
                                    <p style={{ color: 'hsl(200 15% 45%)', lineHeight: '1.6', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                                        {rental.description || 'No description has been provided for this property.'}
                                    </p>
                                </div>

                                {/* Amenities */}
                                {amenities.length > 0 && (
                                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
                                        <h3 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
                                            Amenities ({amenities.length})
                                        </h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(0.375rem, 1.5vw, 0.5rem)' }}>
                                            {amenities.map((amenity, i) => (
                                                <span key={i} style={{ padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', backgroundColor: 'hsl(38 92% 50% / 0.1)', color: 'hsl(38 85% 40%)', border: '1px solid hsl(38 92% 50% / 0.2)', borderRadius: '9999px' }}>
                                                    ✓ {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Reviews */}
                                <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
                                    <h3 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
                                        Reviews ({reviews?.length ?? 0})
                                    </h3>

                                    {reviews?.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                                            {reviews.map((review, i) => {
                                                const h = hue(review.full_name ?? 'U');
                                                return (
                                                    <div key={i} style={{ padding: 'clamp(0.75rem, 3vw, 1rem)', backgroundColor: 'hsl(40 30% 97%)', borderRadius: '0.5rem', border: '1px solid hsl(40 20% 90%)' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                                                                <div style={{ width: 'clamp(2rem, 8vw, 2.5rem)', height: 'clamp(2rem, 8vw, 2.5rem)', borderRadius: '50%', backgroundColor: `hsl(${h} 50% 88%)`, color: `hsl(${h} 50% 28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', fontWeight: '800', flexShrink: 0 }}>
                                                                    {(review.full_name ?? 'U').charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p style={{ fontWeight: '700', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: 'hsl(200 25% 15%)' }}>
                                                                        {review.full_name || 'Anonymous'}
                                                                    </p>
                                                                    <p style={{ fontSize: '0.7rem', color: 'hsl(200 15% 55%)' }}>
                                                                        {review.created_at ? new Date(review.created_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex' }}>{renderStars(review.overall_rating)}</div>
                                                        </div>

                                                        {/* Review attribute chips */}
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(0.375rem, 1.5vw, 0.5rem)', marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                                                            {review.landlord_responsive          === 1 && <span style={{ padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.4375rem, 2vw, 0.625rem)', fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)', backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', borderRadius: '9999px', border: '1px solid hsl(152 60% 85%)', fontWeight: '700' }}>✓ Responsive Landlord</span>}
                                                            {review.property_matched_description === 1 && <span style={{ padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.4375rem, 2vw, 0.625rem)', fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)', backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', borderRadius: '9999px', border: '1px solid hsl(152 60% 85%)', fontWeight: '700' }}>✓ Accurate Description</span>}
                                                            {review.fair_pricing                 === 1 && <span style={{ padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.4375rem, 2vw, 0.625rem)', fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)', backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', borderRadius: '9999px', border: '1px solid hsl(152 60% 85%)', fontWeight: '700' }}>✓ Fair Pricing</span>}
                                                            {review.good_communication           === 1 && <span style={{ padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.4375rem, 2vw, 0.625rem)', fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)', backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', borderRadius: '9999px', border: '1px solid hsl(152 60% 85%)', fontWeight: '700' }}>✓ Good Communication</span>}
                                                        </div>

                                                        {review.comments && (
                                                            <p style={{ fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)', lineHeight: '1.5' }}>
                                                                {review.comments}
                                                            </p>
                                                        )}

                                                        {review.response && (
                                                            <div style={{ marginTop: 'clamp(0.5rem, 2vw, 0.75rem)', padding: 'clamp(0.5rem, 2vw, 0.75rem)', backgroundColor: 'white', borderLeft: '3px solid hsl(38 92% 50%)', borderRadius: '0.25rem' }}>
                                                                <p style={{ fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)', fontWeight: '700', color: 'hsl(38 92% 50%)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                                    Response · {review.response_person || 'Agent'}
                                                                </p>
                                                                <p style={{ fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: 'hsl(200 15% 44%)', lineHeight: '1.6' }}>
                                                                    {review.response}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                                            <p style={{ color: 'hsl(200 15% 52%)', fontSize: '0.875rem' }}>No reviews yet. Be the first to review this property.</p>
                                            <button
                                                className="action-button"
                                                onClick={() => authRedirect(() => setShowReview(true))}
                                                style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.1rem', borderRadius: '0.625rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s', border: '1.5px solid hsl(40 20% 88%)', background: 'white', color: 'hsl(38 92% 50%)' }}
                                            >
                                                Write a Review
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ═══ SIDEBAR ════════════════════════════════════ */}
                            <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>

                                {/* Sale Details card */}
                                <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem' }}>
                                    <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', borderBottom: '1px solid hsl(40 20% 88%)' }}>
                                        <h3 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600' }}>Sale Details</h3>
                                    </div>
                                    <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>

                                        {/* Price highlight */}
                                        <div style={{ padding: 'clamp(0.75rem, 2vw, 1rem)', backgroundColor: 'hsl(38 92% 50% / 0.08)', border: '1px solid hsl(38 92% 50% / 0.2)', borderRadius: '0.625rem', textAlign: 'center' }}>
                                            <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.8125rem)', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>Sale Price</p>
                                            <p style={{ fontSize: 'clamp(1.1rem, 4vw, 1.35rem)', fontWeight: '700', color: 'hsl(38 92% 50%)' }}>
                                                {fmt(rental.sale_price)}
                                            </p>
                                        </div>

                                        {/* Detail rows */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'hsl(200 15% 45%)' }}>Property Type</span>
                                                <span style={{ fontWeight: '500', color: 'hsl(200 25% 15%)' }}>{rental.property_type || '—'}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'hsl(200 15% 45%)' }}>Bedrooms</span>
                                                <span style={{ fontWeight: '500', color: 'hsl(200 25% 15%)' }}>{rental.bedrooms ?? '—'}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'hsl(200 15% 45%)' }}>Bathrooms</span>
                                                <span style={{ fontWeight: '500', color: 'hsl(200 25% 15%)' }}>{rental.bathrooms ?? '—'}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'hsl(200 15% 45%)' }}>Days on Market</span>
                                                <span style={{ fontWeight: '500', color: 'hsl(200 25% 15%)' }}>{days_on_market ?? 0}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: 'hsl(200 15% 45%)' }}>Location</span>
                                                <span style={{ fontWeight: '500', color: 'hsl(200 25% 15%)', textAlign: 'right' }}>{[rental.area, rental.city].filter(Boolean).join(', ')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Agent card */}
                                {rental.user && (
                                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem' }}>
                                        <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', borderBottom: '1px solid hsl(40 20% 88%)' }}>
                                            <h3 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <User style={{ height: 'clamp(1rem, 3vw, 1.25rem)', width: 'clamp(1rem, 3vw, 1.25rem)' }} />
                                                Agent
                                            </h3>
                                        </div>
                                        <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                                                <div style={{ width: 'clamp(2.5rem, 8vw, 3rem)', height: 'clamp(2.5rem, 8vw, 3rem)', borderRadius: '50%', backgroundColor: `hsl(${hue(rental.user.name ?? 'A')} 50% 88%)`, color: `hsl(${hue(rental.user.name ?? 'A')} 50% 28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontWeight: '800', flexShrink: 0 }}>
                                                    {(rental.user.name ?? 'A').charAt(0).toUpperCase()}
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', fontWeight: '700', color: 'hsl(200 25% 15%)', wordBreak: 'break-word' }}>
                                                        {rental.user.name}
                                                        {rental.user.verification_status === 'verified' && (
                                                            <Shield style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)', color: 'hsl(152 60% 40%)', flexShrink: 0 }} />
                                                        )}
                                                    </p>
                                                    <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)' }}>
                                                        {rental.user.company || 'Independent Agent'}
                                                    </p>
                                                </div>
                                            </div>

                                            {rental.user.average_rating > 0 && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    <div style={{ display: 'flex' }}>{renderStars(rental.user.average_rating)}</div>
                                                    <span style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)' }}>
                                                        {rental.user.average_rating?.toFixed(1)} ({rental.user.total_reviews ?? 0} reviews)
                                                    </span>
                                                </div>
                                            )}

                                            <button
                                                className="action-button"
                                                onClick={() => setShowAgent(true)}
                                                style={{ width: '100%', padding: 'clamp(0.625rem, 2vw, 0.75rem)', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', backgroundColor: 'white', color: 'hsl(38 92% 50%)', fontWeight: '500', cursor: 'pointer', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', touchAction: 'manipulation' }}
                                            >
                                                View Profile
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* CTA buttons */}
                                <button
                                    className="action-button"
                                    onClick={() => authRedirect(() => setShowInquiry(true))}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: 'clamp(0.75rem, 2vw, 0.875rem)', border: 'none', borderRadius: '0.625rem', backgroundColor: 'hsl(38 92% 50%)', background: 'linear-gradient(135deg, hsl(38 92% 50%), hsl(38 85% 45%))', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: 'clamp(0.875rem, 2vw, 0.9rem)', touchAction: 'manipulation', transition: 'all 0.18s' }}
                                    onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}
                                >
                                    <MessageSquare style={{ height: 'clamp(1rem, 3vw, 1.1rem)', width: 'clamp(1rem, 3vw, 1.1rem)' }} />
                                    Send Inquiry
                                </button>

                                <button
                                    className="action-button"
                                    onClick={() => authRedirect(() => setShowReview(true))}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: 'clamp(0.625rem, 2vw, 0.75rem)', border: '1.5px solid hsl(40 20% 88%)', borderRadius: '0.625rem', backgroundColor: 'white', color: 'hsl(38 92% 50%)', fontWeight: '600', cursor: 'pointer', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', touchAction: 'manipulation' }}
                                >
                                    <MessageSquare style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />
                                    Write a Review
                                </button>

                                <button
                                    className="action-button"
                                    onClick={() => authRedirect(() => setShowReport(true))}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: 'clamp(0.625rem, 2vw, 0.75rem)', border: '1.5px solid hsl(0 72% 51% / 0.4)', borderRadius: '0.625rem', backgroundColor: 'hsl(0 72% 51% / 0.05)', color: 'hsl(0 65% 44%)', fontWeight: '600', cursor: 'pointer', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', touchAction: 'manipulation' }}
                                >
                                    <Flag style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />
                                    Report Listing
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Image Modal - Improved for mobile zoom */}
                {showImageModal && (
                    <div
                        className="image-modal"
                        onClick={() => setShowImageModal(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 1000,
                            backgroundColor: 'rgba(0,0,0,0.95)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 'clamp(0.5rem, 2vw, 1rem)',
                            WebkitUserSelect: 'none',
                            userSelect: 'none',
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: 'min(90vw, 95vh)',
                                height: 'auto',
                                maxHeight: '90vh',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Close button - optimized for touch */}
                            <button
                                onClick={() => setShowImageModal(false)}
                                style={{
                                    position: 'absolute',
                                    top: 'clamp(0.5rem, 2vw, 1rem)',
                                    right: 'clamp(0.5rem, 2vw, 1rem)',
                                    background: 'rgba(255,255,255,0.15)',
                                    backdropFilter: 'blur(4px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '9999px',
                                    width: 'clamp(2.5rem, 8vw, 3rem)',
                                    height: 'clamp(2.5rem, 8vw, 3rem)',
                                    color: 'white',
                                    fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                                    cursor: 'pointer',
                                    zIndex: 10,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    touchAction: 'manipulation',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                            >
                                ×
                            </button>

                            {/* Image container with proper aspect ratio */}
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                            }}>
                                <img
                                    src={`/storage/rental_images/${images[currentImageIndex]}`}
                                    alt={`Property image ${currentImageIndex + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        backgroundColor: 'transparent',
                                        maxHeight: '90vh',
                                        maxWidth: '90vw',
                                        WebkitTouchCallout: 'none',
                                        WebkitUserSelect: 'none',
                                        userSelect: 'none',
                                    }}
                                    draggable={false}
                                />
                            </div>

                            {/* Navigation arrows - hidden on very small screens */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        style={{
                                            position: 'absolute',
                                            left: 'clamp(0.5rem, 2vw, 1rem)',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            backgroundColor: 'rgba(255,255,255,0.15)',
                                            backdropFilter: 'blur(4px)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '9999px',
                                            width: 'clamp(2.5rem, 6vw, 3rem)',
                                            height: 'clamp(2.5rem, 6vw, 3rem)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            zIndex: 10,
                                            color: 'white',
                                            transition: 'all 0.2s',
                                            touchAction: 'manipulation',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
                                    >
                                        <ChevronLeft size={24} />
                                    </button>

                                    <button
                                        onClick={handleNextImage}
                                        style={{
                                            position: 'absolute',
                                            right: 'clamp(0.5rem, 2vw, 1rem)',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            backgroundColor: 'rgba(255,255,255,0.15)',
                                            backdropFilter: 'blur(4px)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '9999px',
                                            width: 'clamp(2.5rem, 6vw, 3rem)',
                                            height: 'clamp(2.5rem, 6vw, 3rem)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            zIndex: 10,
                                            color: 'white',
                                            transition: 'all 0.2s',
                                            touchAction: 'manipulation',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
                                    >
                                        <ChevronRight size={24} />
                                    </button>

                                    {/* Image counter */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 'clamp(0.5rem, 2vw, 1rem)',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        backgroundColor: 'rgba(0,0,0,0.6)',
                                        backdropFilter: 'blur(4px)',
                                        color: 'white',
                                        padding: 'clamp(0.5rem, 1vw, 0.75rem) clamp(0.75rem, 2vw, 1rem)',
                                        borderRadius: '9999px',
                                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                        fontWeight: '600',
                                        zIndex: 10,
                                        border: '1px solid rgba(255,255,255,0.2)',
                                    }}>
                                        {currentImageIndex + 1} / {images.length}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <Footer />

                {/* ── MODALS ───────────────────────────────────────────────── */}

                {/* Agent profile */}
                <AgentProfileModal agent={rental.user} rentalId={rental.id} isOpen={showAgent} onClose={() => setShowAgent(false)} auth={auth} />

                {/* Report */}
                {showReport && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 'clamp(0.5rem, 2vw, 1rem)' }}>
                        <div className="modal-content" style={{ backgroundColor: 'white', borderRadius: 'clamp(0.75rem, 2vw, 1rem)', maxHeight: '90vh', overflow: 'auto', maxWidth: 'clamp(90%, 95vw, 60%)', width: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
                            <ReportListingDialog setShowAddListingModal={setShowReport} rental={rental} auth={auth} />
                        </div>
                    </div>
                )}

                {/* Review */}
                {showReview && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 'clamp(0.5rem, 2vw, 1rem)' }}>
                        <div className="modal-content" style={{ backgroundColor: 'white', borderRadius: 'clamp(0.75rem, 2vw, 1rem)', maxHeight: '90vh', overflow: 'auto', maxWidth: 'clamp(90%, 95vw, 60%)', width: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
                            <ReviewForm setShowAddReviewForm={setShowReview} rental={rental} auth={auth} />
                        </div>
                    </div>
                )}

                {/* Inquiry */}
                {showInquiry && (
                    <InquiryModal rental={rental} onClose={() => setShowInquiry(false)} />
                )}

                {/* Toast */}
                {toast && (
                    <div style={{ position: 'fixed', top: 'clamp(0.5rem, 2vw, 1rem)', right: 'clamp(0.5rem, 2vw, 1rem)', backgroundColor: toast.variant === 'error' ? '#ef4444' : '#10b981', color: 'white', padding: 'clamp(0.75rem, 2vw, 1rem)', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', zIndex: 9999, maxWidth: '400px', animation: 'slideIn 0.3s ease-out', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)' }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{toast.title}</div>
                        <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>{toast.description}</div>
                    </div>
                )}
            </div>
        </>
    );
}