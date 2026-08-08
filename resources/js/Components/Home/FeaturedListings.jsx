import React, { useState } from 'react';
import { Link } from "@inertiajs/react";
import { ArrowRight, MapPin, Shield, BedDouble, Bath, Home } from 'lucide-react';

const slugifyArea = (value) => {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
};

const parseImages = (images) => {
  try {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    if (typeof images === 'string') {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : Object.values(parsed);
    }
    if (typeof images === 'object') return Object.values(images);
    return [];
  } catch {
    return [];
  }
};

const resolveImageSrc = (value) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value) || value.startsWith('/')) return value;
  return `/storage/rental_images/${value}`;
};

const formatPrice = (price) => {
  const n = Number(price);
  if (!price || Number.isNaN(n)) return '—';
  return `GH₵${n.toLocaleString()}`;
};

// ---------------------------------------------------------------------------
// PropertyCard
// ---------------------------------------------------------------------------

const PropertyCard = ({
  id,
  title,
  area,
  city,
  rent_min,
  rent_max,
  sale_price,
  purpose,
  advance_duration,
  agent_name,
  status,
  bedrooms,
  bathrooms,
  images,
  slug,
}) => {
  const [isHovered, setIsHovered]   = useState(false);
  const [imageError, setImageError] = useState(false);

  const listingAreaSlug = slugifyArea(area);
  const listingSlug = slug || id;

  const isVerified  = status === 'verified';
  const imagesArray = parseImages(images);
  const firstImage  = imagesArray.length > 0 ? resolveImageSrc(imagesArray[0]) : null;
  const linkHref    = purpose === 'sale' ? `/buy/${listingAreaSlug}/${listingSlug}` : `/rent/${listingAreaSlug}/${listingSlug}`;
  // /rent/${listingAreaSlug}/${listingSlug}

  return (
    <Link
      href={linkHref}
      style={{
        display: 'block',
        textDecoration: 'none',
        borderRadius: '1rem',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        border: '1px solid hsl(40 20% 88%)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 12px 28px -6px rgba(20,40,50,0.14), 0 4px 10px -3px rgba(20,40,50,0.08)'
          : '0 2px 8px -2px rgba(20,40,50,0.08)',
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Image area ── */}
      <div style={{
        width: '100%',
        height: '190px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'hsl(40 30% 94%)',
        flexShrink: 0,
      }}>
        {firstImage && !imageError ? (
          <img
            src={firstImage}
            alt={title || 'Property'}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'transform 0.35s ease',
              transform: isHovered ? 'scale(1.06)' : 'scale(1)',
              display: 'block',
            }}
          />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            gap: '0.4rem',
          }}>
            <Home style={{ height: '2.2rem', width: '2.2rem', color: 'hsl(200 20% 72%)' }} />
            <span style={{ fontSize: '0.72rem', color: 'hsl(200 15% 60%)' }}>No photo</span>
          </div>
        )}

        {/* Extra images badge */}
        {imagesArray.length > 1 && !imageError && (
          <div style={{
            position: 'absolute',
            bottom: '0.5rem',
            right: '0.5rem',
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: '#fff',
            padding: '0.18rem 0.45rem',
            borderRadius: '0.35rem',
            fontSize: '0.68rem',
            fontWeight: '500',
          }}>
            +{imagesArray.length - 1}
          </div>
        )}

        {/* Purpose pill */}
        <div style={{
          position: 'absolute',
          bottom: '0.5rem',
          left: '0.5rem',
          backgroundColor: purpose === 'sale'
            ? 'rgba(20,100,90,0.9)'
            : 'rgba(30,60,160,0.88)',
          color: '#fff',
          padding: '0.18rem 0.5rem',
          borderRadius: '0.35rem',
          fontSize: '0.68rem',
          fontWeight: '700',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          {purpose === 'sale' ? 'For Sale' : 'To Let'}
        </div>
      </div>

      {/* ── Card body ── */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>

        {/* Title */}
        <h3 style={{
          margin: '0 0 0.3rem',
          fontSize: '0.95rem',
          fontWeight: '600',
          color: 'hsl(200 25% 14%)',
          lineHeight: '1.35',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {title || 'Untitled listing'}
        </h3>

        {/* Location */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem',
          marginBottom: '0.5rem',
        }}>
          <MapPin style={{ height: '0.78rem', width: '0.78rem', color: 'hsl(200 15% 52%)', flexShrink: 0 }} />
          <span style={{
            fontSize: '0.78rem',
            color: 'hsl(200 15% 52%)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {[area, city].filter(Boolean).join(', ') || 'Location not set'}
          </span>
        </div>

        {/* Bedrooms / Bathrooms */}
        {(bedrooms != null || bathrooms != null) && (
          <div style={{
            display: 'flex',
            gap: '0.7rem',
            marginBottom: '0.5rem',
          }}>
            {bedrooms != null && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.22rem', fontSize: '0.76rem', color: 'hsl(200 15% 46%)' }}>
                <BedDouble style={{ width: '0.82rem', height: '0.82rem' }} />
                {bedrooms} bed{Number(bedrooms) !== 1 ? 's' : ''}
              </span>
            )}
            {bathrooms != null && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.22rem', fontSize: '0.76rem', color: 'hsl(200 15% 46%)' }}>
                <Bath style={{ width: '0.82rem', height: '0.82rem' }} />
                {bathrooms} bath{Number(bathrooms) !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div style={{ marginBottom: '0.8rem' }}>
          <div style={{ fontSize: '1.08rem', fontWeight: '700', color: 'hsl(174 62% 26%)' }}>
            {purpose === 'sale'
              ? formatPrice(sale_price)
              : (rent_min && rent_max)
                ? `${formatPrice(rent_min)} – ${formatPrice(rent_max)}`
                : rent_min
                  ? `From ${formatPrice(rent_min)}`
                  : '—'}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'hsl(200 15% 56%)', marginTop: '0.1rem' }}>
            {purpose === 'sale'
              ? 'asking price'
              : advance_duration
                ? ` ${advance_duration} ${Number(advance_duration) === 1 ? 'month' : 'months'} advance`
                : 'per month'}
          </div>
        </div>

        {/* Footer: agent + verified badge */}
        <div style={{ borderTop: '1px solid hsl(40 18% 91%)', paddingTop: '0.7rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>

            {agent_name ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.32rem', minWidth: 0 }}>
                <div style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '50%',
                  backgroundColor: 'hsl(174 55% 32% / 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '0.58rem',
                  fontWeight: '700',
                  color: 'hsl(174 62% 26%)',
                }}>
                  {String(agent_name).charAt(0).toUpperCase()}
                </div>
                <span style={{
                  fontSize: '0.76rem',
                  color: 'hsl(200 15% 46%)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {agent_name}
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '0.76rem', color: 'hsl(200 15% 62%)' }}>No agent</span>
            )}

            {isVerified && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.18rem',
                padding: '0.16rem 0.45rem',
                borderRadius: '9999px',
                backgroundColor: 'hsl(152 55% 40% / 0.1)',
                color: 'hsl(152 55% 30%)',
                fontSize: '0.68rem',
                fontWeight: '600',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}>
                <Shield style={{ width: '0.62rem', height: '0.62rem' }} />
                Verified
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// ---------------------------------------------------------------------------
// SectionHeader
// ---------------------------------------------------------------------------

const SectionHeader = ({ title, subtitle, viewAllHref, viewAllLabel }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    gap: '1rem',
    flexWrap: 'wrap',
  }}>
    <div>
      <h2 style={{
        margin: '0 0 0.28rem',
        fontSize: 'clamp(1.35rem, 3vw, 1.75rem)',
        fontWeight: '700',
        color: 'hsl(200 25% 13%)',
        letterSpacing: '-0.02em',
        lineHeight: '1.2',
      }}>
        {title}
      </h2>
      <p style={{ margin: 0, fontSize: '0.88rem', color: 'hsl(200 14% 48%)' }}>
        {subtitle}
      </p>
    </div>
    <Link
      href={viewAllHref}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.32rem',
        padding: '0.48rem 0.95rem',
        borderRadius: '0.6rem',
        border: '1px solid hsl(174 55% 32% / 0.28)',
        color: 'hsl(174 62% 26%)',
        fontSize: '0.84rem',
        fontWeight: '500',
        textDecoration: 'none',
        transition: 'background-color 0.15s',
        whiteSpace: 'nowrap',
        backgroundColor: 'transparent',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'hsl(174 55% 32% / 0.06)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {viewAllLabel}
      <ArrowRight style={{ width: '0.88rem', height: '0.88rem' }} />
    </Link>
  </div>
);

// ---------------------------------------------------------------------------
// ListingGrid
// ---------------------------------------------------------------------------

const ListingGrid = ({ listings, purpose }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))',
    gap: '1.25rem',
  }}>
    {listings.map((listing) => (
      <PropertyCard
        key={`${purpose}-${listing.id}`}
        {...listing}
        purpose={purpose}
      />
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// VerifiedListings  (main export)
// ---------------------------------------------------------------------------

const VerifiedListings = ({ verifiedRentals, verifiedSales }) => {
  const rentals = (verifiedRentals && Array.isArray(verifiedRentals))
    ? verifiedRentals
    : Object.values(verifiedRentals ?? {}).filter(Boolean);

  const sales = (verifiedSales && Array.isArray(verifiedSales))
    ? verifiedSales
    : Object.values(verifiedSales ?? {}).filter(Boolean);

  const hasRentals = rentals.length > 0;
  const hasSales   = sales.length   > 0;

  if (!hasRentals && !hasSales) {
    return (
      <section style={{ padding: '4rem 0', backgroundColor: 'hsl(40 33% 98%)' }}>
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <Home style={{ width: '3rem', height: '3rem', color: 'hsl(200 20% 78%)', margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'hsl(200 14% 52%)', fontSize: '1rem', margin: 0 }}>
            No verified listings yet. Check back soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{`
        .verified-section,
        .verified-section * {
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
          box-sizing: border-box;
        }
      `}</style>

      <section className="verified-section" style={{ padding: '4rem 0', backgroundColor: 'hsl(40 33% 98%)' }}>
        <div className="container mx-auto px-4">

          {/* ── Verified Rentals ── */}
          {hasRentals && (
            <div style={{ marginBottom: hasSales ? '4rem' : 0 }}>
              <SectionHeader
                title="Verified Rentals"
                subtitle="Rental listings from verified agents"
                viewAllHref="/rent/listings"
                viewAllLabel="View all rentals"
              />
              <ListingGrid listings={rentals} purpose="rent" />
            </div>
          )}

          {/* ── Verified Sales ── */}
          {hasSales && (
            <div>
              <SectionHeader
                title="Verified Properties for Sale"
                subtitle="Sale listings from verified agents"
                viewAllHref="/buy/listings"
                viewAllLabel="View all for sale"
              />
              <ListingGrid listings={sales} purpose="sale" />
            </div>
          )}

        </div>
      </section>
    </>
  );
};

export default VerifiedListings;