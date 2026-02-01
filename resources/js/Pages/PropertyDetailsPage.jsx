import { useState } from "react";
import Header from '../Components/Layouts/Header';
import Footer from '../Components/Layouts/Footer';
import { Link, usePage } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReportListingDialog from "./ReportListingDialog";
import ReviewForm from "./ReviewForm";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = (e) => {
    e.stopPropagation(); // Prevent card click when clicking arrow
    setCurrentImageIndex((prev) =>
      prev === 0 ? rental.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation(); // Prevent card click when clicking arrow
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
          height: '1rem',
          width: '1rem',
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
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1 }}>
          {/* Hero Image */}
          <div style={{ position: 'relative', height: '20rem', background: 'linear-gradient(135deg, hsl(174 62% 32% / 0.2) 0%, hsl(174 62% 32% / 0.05) 100%)' }}>
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
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                />
              ) : (
                <MapPin style={{ height: '4rem', width: '4rem', color: 'hsl(200 25% 15% / 0.2)' }} />
              )}

              {/* Carousel Controls - Only show if there are multiple images */}
              {rental.images && rental.images.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevImage}
                    style={{
                      position: 'absolute',
                      left: '0.5rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      zIndex: 10,
                      transition: 'all 0.2s'
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
                    onClick={handleNextImage}
                    style={{
                      position: 'absolute',
                      right: '0.5rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      zIndex: 10,
                      transition: 'all 0.2s'
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
                    bottom: '0.75rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '0.375rem',
                    padding: '0.375rem 0.625rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '9999px',
                    zIndex: 10
                  }}>
                    {rental.images.map((_, index) => (
                      <div
                        key={index}
                        style={{
                          width: '0.375rem',
                          height: '0.375rem',
                          borderRadius: '50%',
                          backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                          transition: 'all 0.2s'
                        }}
                      />
                    ))}
                  </div>

                  {/* Image Counter Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    zIndex: 10
                  }}>
                    {currentImageIndex + 1} / {rental.images.length}
                  </div>
                </>
              )}
            </div>
            {rental.listing_status === "verified" && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  backgroundColor: 'hsl(152 60% 40%)',
                  color: 'white',
                  borderRadius: '9999px',
                  gap: '0.375rem'
                }}>
                  <Shield style={{ height: '0.875rem', width: '0.875rem' }} />
                  Verified
                </span>
              </div>
            )}
          </div>

          <div className="container mx-auto px-4 py-8">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Title & Location */}
                  <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                      {rental.title || 'Property Title'}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(200 15% 45%)' }}>
                      <MapPin style={{ height: '1rem', width: '1rem' }} />
                      {rental.address}, {rental.city}
                    </div>
                  </div>

                  {/* Price & Features */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                    <div>
                      <span className="text-2xl font-bold" style={{ color: 'hsl(174 62% 32%)' }}>
                        {formatCurrency(rental.rent_min)} - {formatCurrency(rental.rent_max)}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginLeft: '0.5rem' }}>/month</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Bed style={{ height: '1rem', width: '1rem' }} />
                        {rental.bedrooms} Beds
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Bath style={{ height: '1rem', width: '1rem' }} />
                        {rental.bathrooms} Baths
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar style={{ height: '1rem', width: '1rem' }} />
                        {rental.advance_duration} months advance
                      </div>
                    </div>
                  </div>

                  {/* Warning */}
                  <div style={{
                    backgroundColor: 'hsl(38 92% 50% / 0.1)',
                    border: '1px solid hsl(38 92% 50% / 0.2)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    display: 'flex',
                    gap: '0.75rem'
                  }}>
                    <AlertTriangle style={{ height: '1.25rem', width: '1.25rem', color: 'hsl(38 92% 50%)', flexShrink: 0 }} />
                    <p style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)', fontWeight: '500' }}>
                      Always inspect the property in person before making any payment.
                    </p>
                  </div>

                  {/* Description */}
                  <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                    <h3 className="text-lg font-semibold mb-3" style={{ color: 'hsl(200 25% 15%)' }}>Description</h3>
                    <p style={{ color: 'hsl(200 15% 45%)', lineHeight: '1.6' }}>
                      {rental.description || 'No description available.'}
                    </p>
                  </div>

                  {/* Amenities */}
                  {amenities.length > 0 && (
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: 'hsl(200 25% 15%)' }}>Amenities</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {amenities.map((amenity, i) => (
                          <span key={i} style={{
                            padding: '0.375rem 0.75rem',
                            fontSize: '0.875rem',
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
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                      <h3 className="text-lg font-semibold mb-4" style={{ color: 'hsl(200 25% 15%)' }}>
                        Reviews ({reviews.length})
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {reviews.map((review, i) => (
                          <div key={i} style={{
                            padding: '1rem',
                            backgroundColor: 'hsl(40 30% 97%)',
                            borderRadius: '0.5rem',
                            border: '1px solid hsl(40 20% 90%)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                  width: '2.5rem',
                                  height: '2.5rem',
                                  borderRadius: '50%',
                                  backgroundColor: 'hsl(174 62% 32% / 0.1)',
                                  color: 'hsl(174 62% 32%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '1rem',
                                  fontWeight: '600'
                                }}>
                                  {review.full_name?.[0] || 'U'}
                                </div>
                                <div>
                                  <p style={{ fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                                    {review.full_name || 'Anonymous'}
                                  </p>
                                </div>
                              </div>
                              <div style={{ display: 'flex' }}>
                                {renderStars(review.overall_rating)}
                              </div>
                            </div>

                            {/* Review Attributes */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                              {review.landlord_responsive === 1 && (
                                <span style={{
                                  padding: '0.25rem 0.625rem',
                                  fontSize: '0.75rem',
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
                                  padding: '0.25rem 0.625rem',
                                  fontSize: '0.75rem',
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
                                  padding: '0.25rem 0.625rem',
                                  fontSize: '0.75rem',
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
                                  padding: '0.25rem 0.625rem',
                                  fontSize: '0.75rem',
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
                              <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', lineHeight: '1.5' }}>
                                {review.comments}
                              </p>
                            )}

                            {/* Response */}
                            {review.response && (
                              <div style={{
                                marginTop: '0.75rem',
                                padding: '0.75rem',
                                backgroundColor: 'hsl(210 20% 98%)',
                                borderLeft: '3px solid hsl(174 62% 32%)',
                                borderRadius: '0.25rem'
                              }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.25rem' }}>
                                  Response from {review.response_person || 'Property Owner'}
                                </p>
                                <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', lineHeight: '1.5' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Cost Summary */}
                  <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid hsl(40 20% 88%)' }}>
                      <h3 className="text-lg font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>Total Upfront Cost</h3>
                    </div>
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem' }}>
                          <span className="font-bold">Estimated Total</span>
                          <span className="font-bold" style={{ color: 'hsl(174 62% 32%)' }}>{formatCurrency(estimatedTotal)}</span>
                        </div>
                      </div>
                      <button style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid hsl(40 20% 88%)',
                        borderRadius: '0.5rem',
                        backgroundColor: 'white',
                        color: 'hsl(174 62% 32%)',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}>
                        Use Rent Calculator
                      </button>
                    </div>
                  </div>

                  {/* Agent Card */}
                  {rental.agent && (
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem' }}>
                      <div style={{ padding: '1.5rem', borderBottom: '1px solid hsl(40 20% 88%)' }}>
                        <h3 className="text-lg font-semibold" style={{ color: 'hsl(200 25% 15%)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <User style={{ height: '1.25rem', width: '1.25rem' }} />
                          Agent/Landlord
                        </h3>
                      </div>
                      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '50%',
                            backgroundColor: 'hsl(174 62% 32% / 0.1)',
                            color: 'hsl(174 62% 32%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.25rem',
                            fontWeight: '600'
                          }}>
                            {rental.agent.fullName?.[0] || 'A'}
                          </div>
                          <div>
                            <p className="font-medium" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {rental.agent.fullName}
                              {rental.agent.verification_status === 'verified' && (
                                <Shield style={{ height: '1rem', width: '1rem', color: 'hsl(152 60% 40%)' }} />
                              )}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                              {rental.agent.company || 'Independent Agent'}
                            </p>
                          </div>
                        </div>
                        {rental.agent.average_rating && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ display: 'flex' }}>{renderStars(rental.agent.average_rating)}</div>
                            <span style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                              ({rental.agent.total_reviews || 0} reviews)
                            </span>
                          </div>
                        )}
                        <p style={{ fontSize: '0.875rem' }}>
                          Agent Fee: <span className="font-medium">{rental.agent.fee || 0}%</span>
                        </p>
                        <button style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid hsl(40 20% 88%)',
                          borderRadius: '0.5rem',
                          backgroundColor: 'white',
                          color: 'hsl(174 62% 32%)',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>
                          View Profile
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Report and Review Buttons */}
                  <button
                    onClick={() => {
                      if (!auth?.agent && !auth?.super && !auth?.tenant) {
                        window.location.href = '/sign-up';
                      } else {
                        setShowAddListingModal(true);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid hsl(0 72% 51%)',
                      borderRadius: '0.5rem',
                      backgroundColor: 'white',
                      color: 'hsl(0 72% 51%)',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}>
                    <Flag style={{ height: '1rem', width: '1rem' }} />
                    Report Listing
                  </button>
                  <button
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
                      padding: '0.75rem',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.5rem',
                      backgroundColor: 'white',
                      color: 'hsl(174 62% 32%)',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                    <MessageSquare style={{ height: '1.25rem', width: '1.25rem' }} />
                    Write Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />

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
            padding: '1rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              maxHeight: '90vh',
              overflow: 'auto',
              maxWidth: '60%',
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
            padding: '1rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              maxHeight: '90vh',
              overflow: 'auto',
              maxWidth: '60%',
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