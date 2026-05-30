import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { MapPin, Home, TrendingUp, TrendingDown, ChevronLeft, Building, DollarSign, Calendar, ChevronRight, BedDouble, Bath } from 'lucide-react';
import Header from "../Components/Layouts/Header";
import Footer from "../Components/Layouts/Footer";
import SEO from '../Components/SEO';
import JsonLd from '../Components/JsonLd';

// ─── Icon Components ───────────────────────────────────────────────────────────

const Shield = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

// ─── Property Card Component ───────────────────────────────────────────────────

const slugifyArea = (value) => {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
};

const PropertyCard = ({ property }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Parse images
  let imagesArray = [];
  try {
    if (property.images) {
      imagesArray = typeof property.images === 'string' ? JSON.parse(property.images) : property.images;
      if (!Array.isArray(imagesArray)) {
        imagesArray = [];
      }
    }
  } catch (e) {
    console.error('Error parsing images:', e);
    imagesArray = [];
  }

  const firstImage = imagesArray.length > 0 ? imagesArray[0] : property.image;

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => prev === 0 ? imagesArray.length - 1 : prev - 1);
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => prev === imagesArray.length - 1 ? 0 : prev + 1);
  };

  const areaSlug = slugifyArea(property.area);
  const listingSlug = property.slug || property.id;

  return (
    <Link
      href={`/buy/${areaSlug}/${listingSlug}`}
      className="block overflow-hidden rounded-lg bg-white transition-all duration-300"
      style={{
        border: '1px solid hsl(40 20% 88%)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 12px 24px -6px rgba(0, 0, 0, 0.12)'
          : '0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        textDecoration: 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div
        style={{
          width: '100%',
          height: 'clamp(10rem, 35vw, 14rem)',
          backgroundColor: 'hsl(174 62% 32% / 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {firstImage && !imageError ? (
          <img
            src={`/storage/rental_images/${imagesArray[currentImageIndex] || firstImage}`}
            alt={`${property.property_type || 'Property'} image`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'transform 0.3s ease-in-out',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)'
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            flexDirection: 'column'
          }}>
            <MapPin style={{ height: 'clamp(2.5rem, 8vw, 3rem)', width: 'clamp(2.5rem, 8vw, 3rem)', color: 'hsl(200 25% 15% / 0.15)' }} />
            <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)', marginTop: '0.5rem' }}>
              No image
            </div>
          </div>
        )}

        {/* Carousel Controls */}
        {imagesArray.length > 1 && !imageError && (
          <>
            <button
              onClick={handlePrevImage}
              style={{
                position: 'absolute',
                left: 'clamp(0.5rem, 2vw, 0.75rem)',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: 'clamp(2rem, 8vw, 2.5rem)',
                height: 'clamp(2rem, 8vw, 2.5rem)',
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

            <button
              onClick={handleNextImage}
              style={{
                position: 'absolute',
                right: 'clamp(0.5rem, 2vw, 0.75rem)',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: 'clamp(2rem, 8vw, 2.5rem)',
                height: 'clamp(2rem, 8vw, 2.5rem)',
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
              {imagesArray.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: index === currentImageIndex ? 'clamp(0.75rem, 2vw, 1rem)' : 'clamp(0.25rem, 1vw, 0.375rem)',
                    height: 'clamp(0.25rem, 1vw, 0.375rem)',
                    borderRadius: '50%',
                    backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </div>

            {/* Image Counter */}
            <div style={{
              position: 'absolute',
              top: 'clamp(0.5rem, 2vw, 0.75rem)',
              right: 'clamp(0.5rem, 2vw, 0.75rem)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: 'clamp(0.125rem, 0.5vw, 0.25rem) clamp(0.375rem, 1.5vw, 0.5rem)',
              borderRadius: '0.375rem',
              fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
              fontWeight: '500',
              zIndex: 10
            }}>
              {currentImageIndex + 1} / {imagesArray.length}
            </div>
          </>
        )}

        {property.is_verified && (
          <div style={{ position: 'absolute', top: 'clamp(0.5rem, 2vw, 0.75rem)', left: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)', fontSize: 'clamp(0.7rem, 2vw, 0.825rem)', fontWeight: '600', backgroundColor: 'hsl(152 60% 40%)', color: 'white', borderRadius: '9999px', gap: '0.375rem', backdropFilter: 'blur(8px)' }}>
              <Shield style={{ height: 'clamp(0.7rem, 2vw, 0.825rem)', width: 'clamp(0.7rem, 2vw, 0.825rem)' }} />
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: 'clamp(1rem, 3vw, 1.25rem)', display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
        
        {/* Type */}
        <h3 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(0.975rem, 2.5vw, 1.1rem)', fontWeight: '700', lineHeight: '1.3', margin: 0, textTransform: 'capitalize' }}>
          {property.property_type || 'Property'}
        </h3>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.8rem, 2vw, 0.875rem)' }}>
          <MapPin style={{ height: 'clamp(0.8rem, 2vw, 0.875rem)', width: 'clamp(0.8rem, 2vw, 0.875rem)', flexShrink: 0 }} />
          {property.area}
        </div>

        {/* Features */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.75rem)', fontSize: 'clamp(0.8rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem', color: 'hsl(200 15% 45%)', fontSize: '0.875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.22rem', fontSize: '0.76rem', color: 'hsl(200 15% 46%)' }}>
                <BedDouble style={{ width: '0.82rem', height: '0.82rem' }} />
                {property.bedrooms ?? 0} bed{property.bedrooms === 1 ? '' : 's'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.22rem', fontSize: '0.76rem', color: 'hsl(200 15% 46%)' }}>
                <Bath style={{ width: '0.82rem', height: '0.82rem' }} />
                {property.bathrooms ?? 0} bath{property.bathrooms === 1 ? '' : 's'}
              </span>
              {property.property_type && (
                <span style={{ fontWeight: '600' }}>{String(property.property_type).replace(/\b\w/g, c => c.toUpperCase())}</span>
              )}
            </div>
        </div>

        {/* Price */}
        <div style={{ padding: 'clamp(0.625rem, 2vw, 0.75rem)', backgroundColor: 'hsl(174 62% 32% / 0.07)', border: '1px solid hsl(174 62% 32% / 0.15)', borderRadius: '0.5rem', textAlign: 'center', marginTop: 'clamp(0.25rem, 1vw, 0.5rem)' }}>
          <p style={{ fontSize: 'clamp(0.7rem, 2vw, 0.775rem)', color: 'hsl(200 15% 45%)', margin: 0, marginBottom: '0.125rem' }}>Sale Price</p>
          <p style={{ fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', fontWeight: '800', color: 'hsl(174 62% 28%)', margin: 0 }}>
            GH₵{property.sale_price?.toLocaleString() || 'N/A'}
          </p>
        </div>

        {/* Date */}
        {property.created_at && (
          <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)', display: 'flex', alignItems: 'center', gap: '0.375rem', paddingTop: 'clamp(0.5rem, 2vw, 0.75rem)', borderTop: '1px solid hsl(40 20% 90%)' }}>
            <Calendar style={{ height: 'clamp(0.75rem, 2vw, 0.875rem)', width: 'clamp(0.75rem, 2vw, 0.875rem)' }} />
            Listed {new Date(property.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        )}
      </div>
    </Link>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

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

const SalesDetailPage = ({ area, city, properties, seo }) => {
  const isPositiveTrend = area.trend?.startsWith('+') || false;
  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1);
  const areaSchema = buildSaleAreaSchema(area, cityLabel, seo);

  return (
    <>
      <SEO {...seo} />
      <JsonLd schema={areaSchema} />
      <style>{`
        * {
          font-family: system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        h1, h2, h3, h4, h5, h6 {
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .stat-card {
          animation: slideDown 0.4s ease-out;
        }

        .property-card {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1 }}>
          
          {/* Breadcrumb & Header Section */}
          <div style={{ backgroundColor: 'white', borderBottom: '1px solid hsl(40 20% 88%)', paddingTop: 'clamp(1.25rem, 3vw, 1.75rem)', paddingBottom: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
            <div className="container mx-auto" style={{ padding: '0 clamp(0.75rem, 3vw, 1rem)' }}>
              
              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'clamp(1rem, 2vw, 1.25rem)', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', flexWrap: 'wrap' }}>
                <Link href="/buy" style={{ color: 'hsl(174 62% 32%)', textDecoration: 'none', fontWeight: '500', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>
                  Browse
                </Link>
                <span style={{ color: 'hsl(200 15% 45%)' }}>/</span>
                <Link href="/buy/areas" style={{ color: 'hsl(174 62% 32%)', textDecoration: 'none', fontWeight: '500', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>
                  Areas
                </Link>
                <span style={{ color: 'hsl(200 15% 45%)' }}>/</span>
                <Link href={`/buy/areas?city=${city}`} style={{ color: 'hsl(174 62% 32%)', textDecoration: 'none', fontWeight: '500', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>
                  {cityLabel}
                </Link>
                <span style={{ color: 'hsl(200 15% 45%)' }}>/</span>
                <span style={{ color: 'hsl(200 25% 15%)', fontWeight: '600' }}>{area.name}</span>
              </div>

              {/* Header with Title & Back Button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vw, 1.25rem)' }}>
                <div>
                  <h1 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: '700', lineHeight: '1.2', margin: 0, marginBottom: '0.5rem' }}>
                    {area.name}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
                    <MapPin style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />
                    {cityLabel}, Ghana
                  </div>
                </div>

                <Link
                  href="/buy/areas"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1rem, 2vw, 1.25rem)',
                    border: '1px solid hsl(40 20% 88%)',
                    borderRadius: '0.75rem',
                    backgroundColor: 'white',
                    color: 'hsl(174 62% 32%)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                    transition: 'all 0.2s',
                    width: 'fit-content'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)'; e.currentTarget.style.borderColor = 'hsl(174 62% 32%)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = 'hsl(40 20% 88%)'; }}
                >
                  <ChevronLeft style={{ height: 'clamp(1rem, 2.5vw, 1.125rem)', width: 'clamp(1rem, 2.5vw, 1.125rem)' }} />
                  Back to Areas
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="container mx-auto" style={{ padding: 'clamp(1.5rem, 4vw, 2rem) clamp(0.75rem, 3vw, 1rem)' }}>
            
            {/* Stats Grid */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'clamp(1rem, 2vw, 1.25rem)', marginBottom: 'clamp(2rem, 4vw, 2.5rem)' }}>
              
              {/* Average Sale Price */}
              <div className="stat-card" style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid hsl(40 20% 88%)', padding: 'clamp(1.25rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.8rem, 2vw, 0.875rem)', fontWeight: '500' }}>
                  <DollarSign style={{ height: 'clamp(1rem, 2.5vw, 1.125rem)', width: 'clamp(1rem, 2.5vw, 1.125rem)' }} />
                  Average Sale Price
                </div>
                <p style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: '800', color: 'hsl(174 62% 28%)', margin: 0 }}>
                  GH₵{area.avgPrice?.toLocaleString() || '—'}
                </p>
                <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)', margin: 0 }}>per property</p>
              </div>

              {/* Total Listings */}
              <div className="stat-card" style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid hsl(40 20% 88%)', padding: 'clamp(1.25rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.8rem, 2vw, 0.875rem)', fontWeight: '500' }}>
                  <Home style={{ height: 'clamp(1rem, 2.5vw, 1.125rem)', width: 'clamp(1rem, 2.5vw, 1.125rem)' }} />
                  Total Listings
                </div>
                <p style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: '800', color: 'hsl(200 25% 15%)', margin: 0 }}>
                  {area.listingCount || 0}
                </p>
                <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)', margin: 0 }}>available properties</p>
              </div>

              {/* Price Trend */}
              <div className="stat-card" style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid hsl(40 20% 88%)', padding: 'clamp(1.25rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.8rem, 2vw, 0.875rem)', fontWeight: '500' }}>
                  {isPositiveTrend ? (
                    <TrendingUp style={{ height: 'clamp(1rem, 2.5vw, 1.125rem)', width: 'clamp(1rem, 2.5vw, 1.125rem)' }} />
                  ) : (
                    <TrendingDown style={{ height: 'clamp(1rem, 2.5vw, 1.125rem)', width: 'clamp(1rem, 2.5vw, 1.125rem)' }} />
                  )}
                  Price Trend
                </div>
                <p
                  style={{
                    fontSize: 'clamp(1.5rem, 4vw, 1.875rem)',
                    fontWeight: '800',
                    color: isPositiveTrend ? 'hsl(152 60% 40%)' : 'hsl(0 65% 44%)',
                    margin: 0
                  }}
                >
                  {area.trend || '—'}
                </p>
                <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)', margin: 0 }}>last 30 days</p>
              </div>

              {/* Price Range */}
              <div className="stat-card" style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid hsl(40 20% 88%)', padding: 'clamp(1.25rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.8rem, 2vw, 0.875rem)', fontWeight: '500' }}>
                  <Building style={{ height: 'clamp(1rem, 2.5vw, 1.125rem)', width: 'clamp(1rem, 2.5vw, 1.125rem)' }} />
                  Price Range
                </div>
                <p style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: '700', color: 'hsl(200 25% 15%)', margin: 0, lineHeight: '1.2' }}>
                  GH₵{area.minPrice?.toLocaleString() || 0} – GH₵{area.maxPrice?.toLocaleString() || 0}
                </p>
                <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)', margin: 0 }}>min – max</p>
              </div>
            </div>

            {/* Properties Section */}
            <div>
              <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
                <h2 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1.375rem, 4vw, 1.75rem)', fontWeight: '700', lineHeight: '1.2', margin: 0, marginBottom: '0.5rem' }}>
                  Available Properties for Sale
                </h2>
                <p style={{ color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', margin: 0 }}>
                  Explore {properties?.length || 0} listing{properties?.length === 1 ? '' : 's'} in {area.name}
                </p>
              </div>

              {properties && properties.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(250px, 60vw, 320px), 1fr))', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                  {properties.map((property) => (
                    <div key={property.id} className="property-card">
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid hsl(40 20% 88%)', padding: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center' }}>
                  <Home style={{ height: 'clamp(2.5rem, 8vw, 3.5rem)', width: 'clamp(2.5rem, 8vw, 3.5rem)', color: 'hsl(200 15% 45% / 0.4)', margin: '0 auto 1rem' }} />
                  <h3 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1.125rem, 3vw, 1.375rem)', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                    No Properties Available
                  </h3>
                  <p style={{ color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.875rem, 2vw, 1rem)', margin: 0 }}>
                    Check back later for new listings in {area.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SalesDetailPage;