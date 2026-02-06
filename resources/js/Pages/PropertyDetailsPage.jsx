import { useState } from "react";
import Header from '../Components/Layouts/Header';
import Footer from '../Components/Layouts/Footer';
import { Link, usePage } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReportListingDialog from "../Components/Modules/ReportListingDialog";
import ReviewForm from "../Components/Modules/ReviewForm";
import AgentProfileModal from '../Components/Modules/AgentProfileModal';

// Icon components
const MapPin = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
  </svg>
);

const Bed = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const Bath = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

const PropertyDetailsPage = ({ rental, reviews }) => {
  const { auth } = usePage().props;
  const formatCurrency = (amount) => `GH₵${amount?.toLocaleString() || '0'}`;
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [showAgentProfile, setShowAgentProfile] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? rental.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === rental.images.length - 1 ? 0 : prev + 1
    );
  };

  // Parse amenities if it's a string
  const amenities = typeof rental.amenities === 'string'
    ? JSON.parse(rental.amenities)
    : (rental.amenities || []);

  // Calculate costs
  const totalUpfront = (rental.rent_max || 0) * (rental.advance_months || 0);
  const agentFee = (rental.rent_max || 0) * ((rental.agent?.fee_percentage || 0) / 100);
  const estimatedTotal = totalUpfront + agentFee;

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        h1, h2, h3, h4, h5, h6 {
          font-weight: 600;
        }

        /* Mobile touch optimization */
        @media (max-width: 768px) {
          .carousel-button {
            width: clamp(2.5rem, 10vw, 3rem) !important;
            height: clamp(2.5rem, 10vw, 3rem) !important;
          }

          .property-details-grid {
            grid-template-columns: 1fr !important;
          }

          .modal-content {
            max-width: 95% !important;
            margin: 0.5rem;
          }

          .feature-grid {
            grid-template-columns: 1fr !important;
          }

          .action-button {
            min-height: 44px;
            -webkit-tap-highlight-color: transparent;
          }
        }

        /* Extra small devices */
        @media (max-width: 480px) {
          .hero-image {
            height: clamp(10rem, 50vw, 16rem) !important;
          }

          .verified-badge {
            font-size: 0.75rem !important;
            padding: 0.25rem 0.5rem !important;
          }

          .image-counter {
            font-size: 0.6875rem !important;
            padding: 0.1875rem 0.375rem !important;
          }
        }

        /* Prevent zoom on input focus for iOS */
        @media (max-width: 768px) {
          input[type="text"],
          input[type="email"],
          textarea {
            font-size: 16px !important;
          }
        }

        /* Landscape mobile */
        @media (max-height: 600px) and (orientation: landscape) {
          .hero-image {
            height: 12rem !important;
          }
        }

        /* Desktop grid */
        @media (min-width: 1024px) {
          .property-details-grid {
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 2rem;
          }

          .main-content {
            order: 1;
          }

          .sidebar {
            order: 2;
          }
        }

        /* Tablet and mobile - stack layout */
        @media (max-width: 1023px) {
          .property-details-grid {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .main-content {
            order: 1;
          }

          .sidebar {
            order: 2;
          }
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1 }}>
          {/* Hero Image */}
          <div className="hero-image" style={{ position: 'relative', height: 'clamp(12rem, 40vw, 20rem)', background: 'linear-gradient(135deg, hsl(174 62% 32% / 0.2) 0%, hsl(174 62% 32% / 0.05) 100%)' }}>
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: 'hsl(40 30% 94%)'
            }}>
              {/* Image */}
              {rental.images && rental.images.length > 0 ? (
                <img
                  src={`/storage/rental_images/${rental.images[currentImageIndex]}`}
                  alt={`Property image ${currentImageIndex + 1}`}
                  style={{
                    height: '100%',
                    // width: '50%',
                    objectFit: 'cover',
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                />
              ) : (
                <MapPin style={{ height: 'clamp(3rem, 10vw, 4rem)', width: 'clamp(3rem, 10vw, 4rem)', color: 'hsl(200 25% 15% / 0.2)' }} />
              )}

              {/* Carousel Controls - Only show if there are multiple images */}
              {rental.images && rental.images.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    className="carousel-button"
                    onClick={handlePrevImage}
                    style={{
                      position: 'absolute',
                      left: 'clamp(0.5rem, 2vw, 1rem)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: 'clamp(2.5rem, 8vw, 3rem)',
                      height: 'clamp(2.5rem, 8vw, 3rem)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      zIndex: 10,
                      transition: 'all 0.2s',
                      touchAction: 'manipulation'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    }}
                  >
                    <ChevronLeft size={20} style={{ color: '#374151' }} />
                  </button>

                  {/* Next Button */}
                  <button
                    className="carousel-button"
                    onClick={handleNextImage}
                    style={{
                      position: 'absolute',
                      right: 'clamp(0.5rem, 2vw, 1rem)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: 'clamp(2.5rem, 8vw, 3rem)',
                      height: 'clamp(2.5rem, 8vw, 3rem)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      zIndex: 10,
                      transition: 'all 0.2s',
                      touchAction: 'manipulation'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    }}
                  >
                    <ChevronRight size={20} style={{ color: '#374151' }} />
                  </button>

                  {/* Dot Indicators */}
                  <div style={{
                    position: 'absolute',
                    bottom: 'clamp(0.5rem, 2vw, 0.75rem)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 'clamp(0.25rem, 1vw, 0.375rem)',
                    padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 2vw, 0.625rem)',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '9999px',
                    zIndex: 10
                  }}>
                    {rental.images.map((_, index) => (
                      <div
                        key={index}
                        style={{
                          width: 'clamp(0.3125rem, 1vw, 0.375rem)',
                          height: 'clamp(0.3125rem, 1vw, 0.375rem)',
                          borderRadius: '50%',
                          backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                          transition: 'all 0.2s'
                        }}
                      />
                    ))}
                  </div>

                  {/* Image Counter Badge */}
                  <div className="image-counter" style={{
                    position: 'absolute',
                    top: 'clamp(0.5rem, 2vw, 0.75rem)',
                    right: 'clamp(0.5rem, 2vw, 0.75rem)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.375rem, 2vw, 0.5rem)',
                    borderRadius: '0.375rem',
                    fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                    fontWeight: '500',
                    zIndex: 10
                  }}>
                    {currentImageIndex + 1} / {rental.images.length}
                  </div>
                </>
              )}
            </div>
            {rental.listing_status === "verified" && (
              <div style={{ position: 'absolute', top: 'clamp(0.75rem, 3vw, 1rem)', left: 'clamp(0.75rem, 3vw, 1rem)' }}>
                <span className="verified-badge" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  fontWeight: '500',
                  backgroundColor: 'hsl(152 60% 40%)',
                  color: 'white',
                  borderRadius: '9999px',
                  gap: '0.375rem'
                }}>
                  <Shield style={{ height: 'clamp(0.75rem, 2vw, 0.875rem)', width: 'clamp(0.75rem, 2vw, 0.875rem)' }} />
                  Verified
                </span>
              </div>
            )}
          </div>

          <div className="container mx-auto" style={{ 
            padding: 'clamp(1rem, 3vw, 2rem) clamp(0.75rem, 3vw, 1rem)'
          }}>
            <div className="property-details-grid">
              {/* Main Content */}
              <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                {/* Title & Location */}
                <div>
                  <h1 style={{ 
                    color: 'hsl(200 25% 15%)',
                    fontSize: 'clamp(1.25rem, 5vw, 2rem)',
                    fontWeight: '700',
                    marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)',
                    lineHeight: '1.2'
                  }}>
                    {rental.title || 'Property Title'}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.8125rem, 2.5vw, 1rem)' }}>
                    <MapPin style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)', flexShrink: 0 }} />
                    {rental.address}, {rental.city}
                  </div>
                </div>

                {/* Price & Features */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                  <div>
                    <span style={{ 
                      color: 'hsl(174 62% 32%)',
                      fontSize: 'clamp(1.25rem, 5vw, 2rem)',
                      fontWeight: '700'
                    }}>
                      {formatCurrency(rental.rent_min)} - {formatCurrency(rental.rent_max)}
                    </span>
                    <span style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)', marginLeft: '0.5rem' }}>/month</span>
                  </div>
                  <div className="feature-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                    gap: 'clamp(0.75rem, 2vw, 1rem)', 
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', 
                    color: 'hsl(200 15% 45%)' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Bed style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)', flexShrink: 0 }} />
                      {rental.bedrooms} Beds
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Bath style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)', flexShrink: 0 }} />
                      {rental.bathrooms} Baths
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Calendar style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)', flexShrink: 0 }} />
                      {rental.advance_duration} months advance
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div style={{
                  backgroundColor: 'hsl(38 92% 50% / 0.1)',
                  border: '1px solid hsl(38 92% 50% / 0.2)',
                  borderRadius: '0.75rem',
                  padding: 'clamp(0.75rem, 3vw, 1rem)',
                  display: 'flex',
                  gap: 'clamp(0.5rem, 2vw, 0.75rem)'
                }}>
                  <AlertTriangle style={{ height: 'clamp(1rem, 3vw, 1.25rem)', width: 'clamp(1rem, 3vw, 1.25rem)', color: 'hsl(38 92% 50%)', flexShrink: 0 }} />
                  <p style={{ fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: 'hsl(200 25% 15%)', fontWeight: '500', lineHeight: '1.5' }}>
                    Always inspect the property in person before making any payment.
                  </p>
                </div>

                {/* Description */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
                  <h3 style={{ 
                    color: 'hsl(200 25% 15%)',
                    fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                    fontWeight: '600',
                    marginBottom: 'clamp(0.75rem, 2vw, 1rem)'
                  }}>Description</h3>
                  <p style={{ color: 'hsl(200 15% 45%)', lineHeight: '1.6', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                    {rental.description || 'No description available.'}
                  </p>
                </div>

                {/* Amenities */}
                {amenities.length > 0 && (
                  <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
                    <h3 style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                      fontWeight: '600',
                      marginBottom: 'clamp(0.75rem, 2vw, 1rem)'
                    }}>Amenities</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(0.375rem, 1.5vw, 0.5rem)' }}>
                      {amenities.map((amenity, i) => (
                        <span key={i} style={{
                          padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
                          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                          backgroundColor: 'hsl(40 30% 94%)',
                          color: 'hsl(200 25% 15%)',
                          borderRadius: '9999px'
                        }}>
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews */}
                {reviews && reviews.length > 0 && (
                  <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
                    <h3 style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                      fontWeight: '600',
                      marginBottom: 'clamp(0.75rem, 2vw, 1rem)'
                    }}>
                      Reviews ({reviews.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                      {reviews.map((review, i) => (
                        <div key={i} style={{
                          padding: 'clamp(0.75rem, 3vw, 1rem)',
                          backgroundColor: 'hsl(40 30% 97%)',
                          borderRadius: '0.5rem',
                          border: '1px solid hsl(40 20% 90%)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                              <div style={{
                                width: 'clamp(2rem, 8vw, 2.5rem)',
                                height: 'clamp(2rem, 8vw, 2.5rem)',
                                borderRadius: '50%',
                                backgroundColor: 'hsl(174 62% 32% / 0.1)',
                                color: 'hsl(174 62% 32%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                                fontWeight: '600'
                              }}>
                                {review.full_name?.[0] || 'U'}
                              </div>
                              <div>
                                <p style={{ fontWeight: '500', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: 'hsl(200 25% 15%)' }}>
                                  {review.full_name || 'Anonymous'}
                                </p>
                              </div>
                            </div>
                            <div style={{ display: 'flex' }}>
                              {renderStars(review.overall_rating)}
                            </div>
                          </div>

                          {/* Review Attributes */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(0.375rem, 1.5vw, 0.5rem)', marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                            {review.landlord_responsive === 1 && (
                              <span style={{
                                padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.4375rem, 2vw, 0.625rem)',
                                fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                                backgroundColor: 'hsl(152 60% 95%)',
                                color: 'hsl(152 60% 35%)',
                                borderRadius: '9999px',
                                border: '1px solid hsl(152 60% 85%)'
                              }}>
                                ✓ Responsive Landlord
                              </span>
                            )}
                            {review.property_matched_description === 1 && (
                              <span style={{
                                padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.4375rem, 2vw, 0.625rem)',
                                fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                                backgroundColor: 'hsl(152 60% 95%)',
                                color: 'hsl(152 60% 35%)',
                                borderRadius: '9999px',
                                border: '1px solid hsl(152 60% 85%)'
                              }}>
                                ✓ Accurate Description
                              </span>
                            )}
                            {review.fair_pricing === 1 && (
                              <span style={{
                                padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.4375rem, 2vw, 0.625rem)',
                                fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                                backgroundColor: 'hsl(152 60% 95%)',
                                color: 'hsl(152 60% 35%)',
                                borderRadius: '9999px',
                                border: '1px solid hsl(152 60% 85%)'
                              }}>
                                ✓ Fair Pricing
                              </span>
                            )}
                            {review.good_communication === 1 && (
                              <span style={{
                                padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.4375rem, 2vw, 0.625rem)',
                                fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                                backgroundColor: 'hsl(152 60% 95%)',
                                color: 'hsl(152 60% 35%)',
                                borderRadius: '9999px',
                                border: '1px solid hsl(152 60% 85%)'
                              }}>
                                ✓ Good Communication
                              </span>
                            )}
                          </div>

                          {/* Comment */}
                          {review.comments && (
                            <p style={{ fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)', lineHeight: '1.5' }}>
                              {review.comments}
                            </p>
                          )}

                          {/* Response */}
                          {review.response && (
                            <div style={{
                              marginTop: 'clamp(0.5rem, 2vw, 0.75rem)',
                              padding: 'clamp(0.5rem, 2vw, 0.75rem)',
                              backgroundColor: 'hsl(210 20% 98%)',
                              borderLeft: '3px solid hsl(174 62% 32%)',
                              borderRadius: '0.25rem'
                            }}>
                              <p style={{ fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.25rem' }}>
                                Response from {review.response_person || 'Property Owner'}
                              </p>
                              <p style={{ fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)', lineHeight: '1.5' }}>
                                {review.response}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                {/* Cost Summary */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem' }}>
                  <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', borderBottom: '1px solid hsl(40 20% 88%)' }}>
                    <h3 style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                      fontWeight: '600'
                    }}>Total Upfront Cost</h3>
                  </div>
                  <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'hsl(200 15% 45%)' }}>Monthly Rent (max)</span>
                        <span>{formatCurrency(rental.rent_max)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'hsl(200 15% 45%)' }}>Advance ({rental.advance_months} months)</span>
                        <span>{formatCurrency(totalUpfront)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'hsl(200 15% 45%)' }}>Agent Fee ({rental.agent?.fee_percentage || 0}%)</span>
                        <span>{formatCurrency(agentFee)}</span>
                      </div>
                      <div style={{ height: '1px', backgroundColor: 'hsl(40 20% 88%)', margin: '0.5rem 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}>
                        <span className="font-bold">Estimated Total</span>
                        <span className="font-bold" style={{ color: 'hsl(174 62% 32%)' }}>{formatCurrency(estimatedTotal)}</span>
                      </div>
                    </div>
                    <button className="action-button" style={{
                      width: '100%',
                      padding: 'clamp(0.625rem, 2vw, 0.75rem)',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.5rem',
                      backgroundColor: 'white',
                      color: 'hsl(174 62% 32%)',
                      fontWeight: '500',
                      cursor: 'pointer',
                      fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                      touchAction: 'manipulation'
                    }}>
                      Use Rent Calculator
                    </button>
                  </div>
                </div>

                {/* Agent Card */}
                {rental.agent && (
                  <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem' }}>
                    <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', borderBottom: '1px solid hsl(40 20% 88%)' }}>
                      <h3 style={{ 
                        color: 'hsl(200 25% 15%)',
                        fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                        fontWeight: '600',
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem' 
                      }}>
                        <User style={{ height: 'clamp(1rem, 3vw, 1.25rem)', width: 'clamp(1rem, 3vw, 1.25rem)' }} />
                        Agent/Landlord
                      </h3>
                    </div>
                    <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                        <div style={{
                          width: 'clamp(2.5rem, 8vw, 3rem)',
                          height: 'clamp(2.5rem, 8vw, 3rem)',
                          borderRadius: '50%',
                          backgroundColor: 'hsl(174 62% 32% / 0.1)',
                          color: 'hsl(174 62% 32%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                          fontWeight: '600'
                        }}>
                          {rental.agent.fullName?.[0] || 'A'}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p className="font-medium" style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                            wordBreak: 'break-word'
                          }}>
                            {rental.agent.fullName}
                            {rental.agent.verification_status === 'verified' && (
                              <Shield style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)', color: 'hsl(152 60% 40%)', flexShrink: 0 }} />
                            )}
                          </p>
                          <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)' }}>
                            {rental.agent.company || 'Independent Agent'}
                          </p>
                        </div>
                      </div>
                      {rental.agent.average_rating && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex' }}>{renderStars(rental.agent.average_rating)}</div>
                          <span style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)' }}>
                            ({rental.agent.total_reviews || 0} reviews)
                          </span>
                        </div>
                      )}
                      <p style={{ fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)' }}>
                        Agent Fee: <span className="font-medium">{rental.agent.fee || 0}%</span>
                      </p>
                      <button 
                        className="action-button"
                        onClick={() => setShowAgentProfile(true)}
                        style={{
                          width: '100%',
                          padding: 'clamp(0.625rem, 2vw, 0.75rem)',
                          border: '1px solid hsl(40 20% 88%)',
                          borderRadius: '0.5rem',
                          backgroundColor: 'white',
                          color: 'hsl(174 62% 32%)',
                          fontWeight: '500',
                          cursor: 'pointer',
                          fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                          touchAction: 'manipulation'
                        }}>
                        View Profile
                      </button>
                    </div>
                  </div>
                )}

                {/* Report and Review Buttons */}
                <button
                  className="action-button"
                  onClick={() => {
                    if (!auth?.agent && !auth?.super && !auth?.tenant) {
                      window.location.href = '/sign-up';
                    } else {
                      setShowAddListingModal(true);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: 'clamp(0.625rem, 2vw, 0.75rem)',
                    border: '1px solid hsl(0 72% 51%)',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    color: 'hsl(0 72% 51%)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                    touchAction: 'manipulation'
                  }}>
                  <Flag style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />
                  Report Listing
                </button>
                <button
                  className="action-button"
                  onClick={() => {
                    if (!auth?.agent && !auth?.super && !auth?.tenant) {
                      window.location.href = '/sign-up';
                    } else {
                      setShowAddReviewForm(true);
                    }
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: 'clamp(0.625rem, 2vw, 0.75rem)',
                    border: '1px solid hsl(40 20% 88%)',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    color: 'hsl(174 62% 32%)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                    touchAction: 'manipulation'
                  }}>
                  <MessageSquare style={{ height: 'clamp(1rem, 3vw, 1.25rem)', width: 'clamp(1rem, 3vw, 1.25rem)' }} />
                  Write Review
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer />

        {/* Agent Profile Modal */}
        <AgentProfileModal 
          agent={rental.agent} 
          isOpen={showAgentProfile} 
          onClose={() => setShowAgentProfile(false)}
          auth={auth}
        />

        {/* Add Listing Modal */}
        {showAddListingModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: 'clamp(0.5rem, 2vw, 1rem)'
          }}>
            <div className="modal-content" style={{
              backgroundColor: 'white',
              borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
              maxHeight: '90vh',
              overflow: 'auto',
              maxWidth: 'clamp(90%, 95vw, 60%)',
              width: '100%',
              position: 'relative'
            }}>
              <ReportListingDialog setShowAddListingModal={setShowAddListingModal} rental={rental} auth={auth} />
            </div>
          </div>
        )}
        {/* Add ReviewForm Modal */}
        {showAddReviewForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: 'clamp(0.5rem, 2vw, 1rem)'
          }}>
            <div className="modal-content" style={{
              backgroundColor: 'white',
              borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
              maxHeight: '90vh',
              overflow: 'auto',
              maxWidth: 'clamp(90%, 95vw, 60%)',
              width: '100%',
              position: 'relative'
            }}>
              <ReviewForm setShowAddReviewForm={setShowAddReviewForm} rental={rental} auth={auth} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PropertyDetailsPage;