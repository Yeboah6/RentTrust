import React, { useState, useEffect } from 'react';
import { Home, MapPin, DollarSign, Calendar, User, Phone, Mail, Bed, Bath, CheckCircle2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePage } from '@inertiajs/react';

const ViewRentals = ({ rental, setShowViewModal }) => {
  const { auth } = usePage().props;
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Parse amenities if they're stored as JSON string
  let parsedAmenities = [];
  try {
    if (rental.amenities) {
      parsedAmenities = typeof rental.amenities === 'string'
        ? JSON.parse(rental.amenities)
        : rental.amenities;
    }
  } catch (e) {
    console.error('Error parsing amenities:', e);
    parsedAmenities = [];
  }

  // Handle images
  const images = rental.images || [];

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        setLightboxIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        setLightboxIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, images.length]);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goToPrev = (e) => {
    e.stopPropagation();
    setLightboxIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setLightboxIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <style>{`
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes lightboxIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-overlay {
          animation: lightboxIn 0.2s ease;
        }

        /* Mobile touch optimization */
        @media (max-width: 768px) {
          .modal-content {
            max-height: 85vh !important;
            margin: 0.5rem !important;
            max-width: 95% !important;
          }

          .image-grid {
            grid-template-columns: 1fr !important;
          }

          .details-grid {
            grid-template-columns: 1fr !important;
          }

          .action-button {
            min-height: 44px;
            -webkit-tap-highlight-color: transparent;
          }

          .amenities-container {
            flex-wrap: wrap !important;
          }

          .modal-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.5rem !important;
          }

          .close-button {
            position: absolute !important;
            top: 0.75rem !important;
            right: 0.75rem !important;
          }
        }

        /* Extra small devices (≤400px) */
        @media (max-width: 400px) {
          .modal-content {
            max-height: 92vh !important;
            margin: 0.25rem !important;
            border-radius: 0.5rem !important;
          }

          .section-padding {
            padding: clamp(0.5rem, 2vw, 0.75rem) !important;
          }

          .text-xl {
            font-size: 1rem !important;
          }

          .text-2xl {
            font-size: 1.25rem !important;
          }

          .modal-header {
            padding: 0.75rem !important;
          }

          .modal-body {
            padding: 0.75rem !important;
          }

          .details-grid {
            gap: 0.5rem !important;
          }

          .amenities-container span {
            padding: 0.25rem 0.5rem !important;
            font-size: 0.75rem !important;
          }
        }

        /* Landscape mobile */
        @media (max-height: 600px) and (orientation: landscape) {
          .modal-content {
            max-height: 80vh !important;
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

        /* Tablet */
        @media (min-width: 481px) and (max-width: 768px) {
          .image-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          .details-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        /* Desktop */
        @media (min-width: 769px) {
          .image-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }

          .details-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        /* Large desktop */
        @media (min-width: 1024px) {
          .modal-content {
            max-width: 56rem !important;
          }
        }
      `}</style>

      {/* Modal Overlay */}
      <div
        className="modal-overlay"
        onClick={() => setShowViewModal && setShowViewModal(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(0.5rem, 2vw, 1rem)',
          zIndex: 50,
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
            maxHeight: '90vh',
            overflowY: 'auto',
            maxWidth: 'clamp(90%, 95vw, 56rem)',
            width: '100%'
          }}
        >
          {/* Header */}
          <div className="modal-header" style={{
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            borderBottom: '1px solid hsl(40 20% 88%)',
            padding: 'clamp(1rem, 3vw, 1.5rem)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'clamp(0.5rem, 2vw, 1rem)',
            zIndex: 10
          }}>
            <div>
              <h2 style={{
                color: 'hsl(200 25% 15%)',
                fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                fontWeight: '700',
                lineHeight: '1.2',
                marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)'
              }}>
                {rental.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.75rem)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.25rem, 1vw, 0.375rem)' }}>
                  <MapPin style={{
                    height: 'clamp(0.875rem, 2.5vw, 1rem)',
                    width: 'clamp(0.875rem, 2.5vw, 1rem)',
                    color: 'hsl(200 15% 45%)'
                  }} />
                  <span style={{ fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)' }}>
                    {rental.area}, {rental.city}
                  </span>
                </div>
                <span style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  backgroundColor: rental.purpose === 'sale' ? 'hsl(38 92% 50% / 0.15)' : 'hsl(174 62% 32% / 0.12)',
                  color: rental.purpose === 'sale' ? 'hsl(38 85% 40%)' : 'hsl(174 62% 32%)',
                  border: `1px solid ${rental.purpose === 'sale' ? 'hsl(38 92% 50% / 0.3)' : 'hsl(174 62% 32% / 0.25)'}`,
                }}>
                  {rental.purpose === 'sale' ? '🏷️ For Sale' : '🏠 For Rent'}
                </span>
              </div>
            </div>
            <button
              className="close-button action-button"
              onClick={() => setShowViewModal && setShowViewModal(false)}
              style={{
                padding: 'clamp(0.375rem, 1.5vw, 0.5rem)',
                borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
                minHeight: '44px',
                minWidth: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X style={{
                height: 'clamp(1.25rem, 4vw, 1.5rem)',
                width: 'clamp(1.25rem, 4vw, 1.5rem)',
                color: 'hsl(200 15% 45%)'
              }} />
            </button>
          </div>

          {/* Content */}
          <div className="modal-body" style={{
            padding: 'clamp(1rem, 3vw, 1.5rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(1rem, 3vw, 1.5rem)'
          }}>
            {/* Images Gallery */}
            {images.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                <h3 style={{
                  color: 'hsl(200 25% 15%)',
                  fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                  fontWeight: '600'
                }}>
                  Property Images
                </h3>
                <div className="image-grid" style={{
                  display: 'grid',
                  gap: 'clamp(0.5rem, 2vw, 0.75rem)'
                }}>
                  {images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => openLightbox(index)}
                      style={{
                        aspectRatio: '1 / 1',
                        backgroundColor: 'hsl(40 30% 94%)',
                        borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                    >
                      <img
                        src={`/storage/rental_images/${image}`}
                        alt={`Property ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Details Section */}
            <div className="section-padding" style={{
              backgroundColor: 'hsl(40 30% 94%)',
              borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
              padding: 'clamp(1rem, 3vw, 1.25rem)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(0.5rem, 2vw, 0.75rem)',
                marginBottom: 'clamp(0.75rem, 2vw, 1rem)'
              }}>
                <Home style={{
                  height: 'clamp(1rem, 3vw, 1.25rem)',
                  width: 'clamp(1rem, 3vw, 1.25rem)',
                  color: 'hsl(174 62% 32%)'
                }} />
                <h3 style={{
                  color: 'hsl(200 25% 15%)',
                  fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                  fontWeight: '600'
                }}>
                  Property Details
                </h3>
              </div>

              <div className="details-grid" style={{
                display: 'grid',
                gap: 'clamp(0.75rem, 2vw, 1rem)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                  <div>
                    <span style={{
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      fontWeight: '500',
                      color: 'hsl(200 15% 45%)',
                      display: 'block',
                      marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)'
                    }}>
                      Property Type
                    </span>
                    <span style={{
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                      color: 'hsl(200 25% 15%)',
                      textTransform: 'capitalize'
                    }}>
                      {rental.property_type}
                    </span>
                  </div>

                  <div>
                    <span style={{
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      fontWeight: '500',
                      color: 'hsl(200 15% 45%)',
                      display: 'block',
                      marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)'
                    }}>
                      Location
                    </span>
                    <span style={{
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                      color: 'hsl(200 25% 15%)'
                    }}>
                      {rental.area}, {rental.city}
                    </span>
                  </div>

                  {rental.address && (
                    <div>
                      <span style={{
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        fontWeight: '500',
                        color: 'hsl(200 15% 45%)',
                        display: 'block',
                        marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)'
                      }}>
                        Full Address
                      </span>
                      <span style={{
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                        color: 'hsl(200 25% 15%)'
                      }}>
                        {rental.address}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                    <Bed style={{
                      height: 'clamp(1rem, 3vw, 1.25rem)',
                      width: 'clamp(1rem, 3vw, 1.25rem)',
                      color: 'hsl(174 62% 32%)'
                    }} />
                    <div>
                      <span style={{
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        fontWeight: '500',
                        color: 'hsl(200 15% 45%)',
                        display: 'block'
                      }}>
                        Bedrooms
                      </span>
                      <span style={{
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                        fontWeight: '600',
                        color: 'hsl(200 25% 15%)'
                      }}>
                        {rental.bedrooms}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                    <Bath style={{
                      height: 'clamp(1rem, 3vw, 1.25rem)',
                      width: 'clamp(1rem, 3vw, 1.25rem)',
                      color: 'hsl(174 62% 32%)'
                    }} />
                    <div>
                      <span style={{
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        fontWeight: '500',
                        color: 'hsl(200 15% 45%)',
                        display: 'block'
                      }}>
                        Bathrooms
                      </span>
                      <span style={{
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                        fontWeight: '600',
                        color: 'hsl(200 25% 15%)'
                      }}>
                        {rental.bathrooms || '0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="section-padding" style={{
              backgroundColor: rental.purpose === 'sale' ? 'hsl(38 92% 50% / 0.08)' : 'hsl(174 62% 32% / 0.1)',
              border: `2px solid ${rental.purpose === 'sale' ? 'hsl(38 92% 50% / 0.3)' : 'hsl(174 62% 32% / 0.3)'}`,
              borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
              padding: 'clamp(1rem, 3vw, 1.25rem)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(0.5rem, 2vw, 0.75rem)',
                marginBottom: 'clamp(0.75rem, 2vw, 1rem)'
              }}>
                <DollarSign style={{
                  height: 'clamp(1rem, 3vw, 1.25rem)',
                  width: 'clamp(1rem, 3vw, 1.25rem)',
                  color: rental.purpose === 'sale' ? 'hsl(38 92% 50%)' : 'hsl(174 62% 32%)'
                }} />
                <h3 style={{
                  color: 'hsl(200 25% 15%)',
                  fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                  fontWeight: '600'
                }}>
                  Pricing Information
                </h3>
                {/* Purpose badge */}
                <span style={{
                  marginLeft: 'auto',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  backgroundColor: rental.purpose === 'sale' ? 'hsl(38 92% 50%)' : 'hsl(174 62% 32%)',
                  color: 'white'
                }}>
                  {rental.purpose === 'sale' ? '🏷️ For Sale' : '🏠 For Rent'}
                </span>
              </div>

              {rental.purpose === 'sale' ? (
                <div>
                  <span style={{
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    fontWeight: '500',
                    color: 'hsl(200 15% 45%)',
                    display: 'block',
                    marginBottom: 'clamp(0.25rem, 1vw, 0.375rem)'
                  }}>
                    Sale Price
                  </span>
                  <span style={{
                    fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                    fontWeight: '700',
                    color: 'hsl(38 92% 50%)'
                  }}>
                    GH₵{Number(rental.sale_price || 0).toLocaleString()}
                  </span>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                  <div>
                    <span style={{
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      fontWeight: '500',
                      color: 'hsl(200 15% 45%)',
                      display: 'block',
                      marginBottom: 'clamp(0.25rem, 1vw, 0.375rem)'
                    }}>
                      Annual Rent Range
                    </span>
                    <span style={{
                      fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                      fontWeight: '700',
                      color: 'hsl(174 62% 32%)'
                    }}>
                      GH₵{Number(rental.rent_min || 0).toLocaleString()} – GH₵{Number(rental.rent_max || 0).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                    <Calendar style={{
                      height: 'clamp(1rem, 3vw, 1.25rem)',
                      width: 'clamp(1rem, 3vw, 1.25rem)',
                      color: 'hsl(174 62% 32%)'
                    }} />
                    <div>
                      <span style={{
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        fontWeight: '500',
                        color: 'hsl(200 15% 45%)',
                        display: 'block'
                      }}>
                        Advance Payment
                      </span>
                      <span style={{
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                        fontWeight: '600',
                        color: 'hsl(200 25% 15%)'
                      }}>
                        {rental.advance_duration} {Number(rental.advance_duration) === 1 ? 'Month' : 'Months'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Amenities Section */}
            {parsedAmenities.length > 0 && (
              <div className="section-padding" style={{
                backgroundColor: 'hsl(40 30% 94%)',
                borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
                padding: 'clamp(1rem, 3vw, 1.25rem)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(0.5rem, 2vw, 0.75rem)',
                  marginBottom: 'clamp(0.75rem, 2vw, 1rem)'
                }}>
                  <CheckCircle2 style={{
                    height: 'clamp(1rem, 3vw, 1.25rem)',
                    width: 'clamp(1rem, 3vw, 1.25rem)',
                    color: 'hsl(174 62% 32%)'
                  }} />
                  <h3 style={{
                    color: 'hsl(200 25% 15%)',
                    fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                    fontWeight: '600'
                  }}>
                    Amenities
                  </h3>
                </div>
                <div className="amenities-container" style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'clamp(0.375rem, 1.5vw, 0.5rem)'
                }}>
                  {parsedAmenities.map((amenity, index) => (
                    <span
                      key={index}
                      style={{
                        padding: 'clamp(0.375rem, 1.5vw, 0.5rem) clamp(0.75rem, 2vw, 1rem)',
                        borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                        fontWeight: '500',
                        backgroundColor: 'hsl(174 62% 32% / 0.1)',
                        color: 'hsl(174 62% 32%)',
                        border: '1px solid hsl(174 62% 32% / 0.2)'
                      }}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description Section */}
            {rental.description && (
              <div className="section-padding" style={{
                backgroundColor: 'hsl(40 30% 94%)',
                borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
                padding: 'clamp(1rem, 3vw, 1.25rem)'
              }}>
                <h3 style={{
                  color: 'hsl(200 25% 15%)',
                  fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                  fontWeight: '600',
                  marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)'
                }}>
                  Description
                </h3>
                <p style={{
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  lineHeight: '1.6',
                  color: 'hsl(200 15% 45%)',
                  whiteSpace: 'pre-line'
                }}>
                  {rental.description}
                </p>
              </div>
            )}

            {/* Contact Information Section */}
            <div className="section-padding" style={{
              backgroundColor: 'hsl(152 60% 40% / 0.1)',
              border: '2px solid hsl(152 60% 40% / 0.2)',
              borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
              padding: 'clamp(1rem, 3vw, 1.25rem)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(0.5rem, 2vw, 0.75rem)',
                marginBottom: 'clamp(0.75rem, 2vw, 1rem)'
              }}>
                <User style={{
                  height: 'clamp(1rem, 3vw, 1.25rem)',
                  width: 'clamp(1rem, 3vw, 1.25rem)',
                  color: 'hsl(152 60% 40%)'
                }} />
                <h3 style={{
                  color: 'hsl(200 25% 15%)',
                  fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                  fontWeight: '600'
                }}>
                  Contact Agent
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                  <User style={{
                    height: 'clamp(1rem, 3vw, 1.25rem)',
                    width: 'clamp(1rem, 3vw, 1.25rem)',
                    color: 'hsl(200 15% 45%)'
                  }} />
                  <div>
                    <span style={{
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      fontWeight: '500',
                      color: 'hsl(200 15% 45%)',
                      display: 'block'
                    }}>
                      Agent Name
                    </span>
                    <span style={{
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                      fontWeight: '600',
                      color: 'hsl(200 25% 15%)'
                    }}>
                      {rental.agent_name || rental.agentName}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                  <Phone style={{
                    height: 'clamp(1rem, 3vw, 1.25rem)',
                    width: 'clamp(1rem, 3vw, 1.25rem)',
                    color: 'hsl(200 15% 45%)'
                  }} />
                  <div>
                    <span style={{
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      fontWeight: '500',
                      color: 'hsl(200 15% 45%)',
                      display: 'block'
                    }}>
                      Phone Number
                    </span>
                    <a
                      href={`tel:${rental.agent_phone || rental.agentPhone}`}
                      style={{
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                        fontWeight: '600',
                        color: 'hsl(174 62% 32%)',
                        textDecoration: 'none'
                      }}
                    >
                      {rental.agent_phone || rental.agentPhone}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                  <Mail style={{
                    height: 'clamp(1rem, 3vw, 1.25rem)',
                    width: 'clamp(1rem, 3vw, 1.25rem)',
                    color: 'hsl(200 15% 45%)'
                  }} />
                  <div>
                    <span style={{
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      fontWeight: '500',
                      color: 'hsl(200 15% 45%)',
                      display: 'block'
                    }}>
                      Email Address
                    </span>
                    <a
                      href={`mailto:${rental.agent_email || rental.agentEmail}`}
                      style={{
                        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                        fontWeight: '600',
                        color: 'hsl(174 62% 32%)',
                        textDecoration: 'none'
                      }}
                    >
                      {rental.agent_email || rental.agentEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{
              display: 'flex',
              gap: 'clamp(0.75rem, 2vw, 1rem)',
              paddingTop: 'clamp(0.75rem, 2vw, 1rem)',
              borderTop: '1px solid hsl(40 20% 88%)',
              flexDirection: 'column',
              alignItems: 'stretch'
            }}>
              <button
                onClick={() => setShowViewModal && setShowViewModal(false)}
                className="action-button"
                style={{
                  padding: 'clamp(0.625rem, 2vw, 0.75rem)',
                  borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                  border: '1px solid hsl(40 20% 88%)',
                  color: 'hsl(200 25% 15%)',
                  backgroundColor: 'white',
                  fontWeight: '600',
                  fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minHeight: '44px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(40 30% 96%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                Close
              </button>
              {auth?.super && (
                <a
                  href={`tel:${rental.agent_phone || rental.agentPhone}`}
                  className="action-button"
                  style={{
                    padding: 'clamp(0.625rem, 2vw, 0.75rem)',
                    borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                    backgroundColor: 'hsl(174 62% 32%)',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(174 50% 25%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)';
                  }}
                >
                  Call Agent
                </a>
              )}
            </div>

            {/* Featured Listing Info (admin only) */}
            {auth?.super && rental.is_featured && (
              <div className="section-padding" style={{
                backgroundColor: 'hsl(38 92% 50% / 0.06)',
                border: '2px solid hsl(38 92% 50% / 0.25)',
                borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
                padding: 'clamp(1rem, 3vw, 1.25rem)'
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.75rem)',
                  marginBottom: 'clamp(0.75rem, 2vw, 1rem)'
                }}>
                  {/* small star icon */}
                  <svg style={{ width: '1rem', height: '1rem', color: 'hsl(38 92% 50%)' }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  <h3 style={{ color: 'hsl(38 92% 40%)', fontSize: 'clamp(1rem,3vw,1.125rem)', fontWeight: '600' }}>
                    Featured Listing
                  </h3>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.6rem',
                  fontSize: '0.8rem',
                  color: 'hsl(200 25% 15%)'
                }}>
                  {rental.featured_at && (
                    <div>
                      <span style={{ fontWeight: '500', color: 'hsl(200 15% 45%)', display: 'block' }}>Featured Since</span>
                      <span>{new Date(rental.featured_at).toLocaleDateString()}</span>
                    </div>
                  )}
                  {rental.featured_expires_at && (
                    <div>
                      <span style={{ fontWeight: '500', color: 'hsl(200 15% 45%)', display: 'block' }}>Expires</span>
                      <span>{new Date(rental.featured_expires_at).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div>
                    <span style={{ fontWeight: '500', color: 'hsl(200 15% 45%)', display: 'block' }}>Priority</span>
                    <span>{rental.featured_priority ?? 0}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: '500', color: 'hsl(200 15% 45%)', display: 'block' }}>Times Featured</span>
                    <span>{rental.times_featured ?? 0}</span>
                  </div>
                  {rental.is_featured_queued && (
                    <div>
                      <span style={{ fontWeight: '500', color: 'hsl(200 15% 45%)', display: 'block' }}>Queued</span>
                      <span style={{ color: 'hsl(38 92% 40%)' }}>Yes</span>
                    </div>
                  )}
                  {rental.featured_queue_position && (
                    <div>
                      <span style={{ fontWeight: '500', color: 'hsl(200 15% 45%)', display: 'block' }}>Queue Position</span>
                      <span>{rental.featured_queue_position}</span>
                    </div>
                  )}
                  {rental.queued_at && (
                    <div>
                      <span style={{ fontWeight: '500', color: 'hsl(200 15% 45%)', display: 'block' }}>Queued At</span>
                      <span>{new Date(rental.queued_at).toLocaleDateString()}</span>
                    </div>
                  )}
                  {rental.last_featured_at && (
                    <div>
                      <span style={{ fontWeight: '500', color: 'hsl(200 15% 45%)', display: 'block' }}>Last Featured</span>
                      <span>{new Date(rental.last_featured_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            padding: 'clamp(0.75rem, 2vw, 1.5rem)'
          }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: 'clamp(1rem, 3vw, 1.5rem)',
              right: 'clamp(1rem, 3vw, 1.5rem)',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '2.75rem',
              height: '2.75rem',
              minWidth: '44px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'background 0.2s',
              touchAction: 'manipulation'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <X size={20} />
          </button>

          {/* Left arrow */}
          {images.length > 1 && (
            <button
              onClick={goToPrev}
              style={{
                position: 'absolute',
                left: 'clamp(0.75rem, 2vw, 1.5rem)',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '2.75rem',
                height: '2.75rem',
                minWidth: '44px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'background 0.2s',
                touchAction: 'manipulation'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Right arrow */}
          {images.length > 1 && (
            <button
              onClick={goToNext}
              style={{
                position: 'absolute',
                right: 'clamp(0.75rem, 2vw, 1.5rem)',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '2.75rem',
                height: '2.75rem',
                minWidth: '44px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'background 0.2s',
                touchAction: 'manipulation'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Image */}
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={`/storage/rental_images/${images[lightboxIndex]}`}
              alt={`Property ${lightboxIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: '0.5rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
              }}
            />
          </div>

          {/* Counter */}
          {images.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: 'clamp(1rem, 3vw, 1.5rem)',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
              fontWeight: '600',
              background: 'rgba(0,0,0,0.5)',
              padding: '0.3rem 0.8rem',
              borderRadius: '999px'
            }}>
              {lightboxIndex + 1} / {images.length}
            </div>
          )}

          {/* Title */}
          <div style={{
            position: 'absolute',
            bottom: 'clamp(1rem, 3vw, 1.5rem)',
            left: 'clamp(1rem, 3vw, 1.5rem)',
            color: 'white',
            fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
            fontWeight: '600',
            textShadow: '0 1px 4px rgba(0,0,0,0.6)',
            maxWidth: '50vw',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {rental.title}
          </div>
        </div>
      )}
    </>
  );
};

export default ViewRentals;