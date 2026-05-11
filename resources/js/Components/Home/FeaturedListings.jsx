import React, { useState } from 'react';
import { Link } from "@inertiajs/react";
import { ArrowRight, MapPin, Shield, Sparkles, BedDouble, Bath } from 'lucide-react';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const parseImages = (images) => {
  try {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    if (typeof images === 'string') {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch {
    return [];
  }
};

/**
 * Resolve an image src: if the value already looks like an absolute URL or a
 * root-relative path (starts with / or http), use it as-is; otherwise prefix
 * the storage path.
 */
const resolveImageSrc = (value) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value) || value.startsWith('/')) return value;
  return `/storage/rental_images/${value}`;
};

const formatPrice = (price) =>
  `GH₵${Number(price).toLocaleString()}`;

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
  is_featured,
  bedrooms,
  bathrooms,
  images = [],
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imagesArray = parseImages(images);
  const firstImage  = imagesArray.length > 0 ? resolveImageSrc(imagesArray[0]) : null;
  const isVerified  = status === 'verified';
  const linkHref    = purpose === 'sale' ? `/buy/${id}` : `/rent/${id}`;

  return (
    <Link
      href={linkHref}
      style={{
        display: 'block',
        textDecoration: 'none',
        borderRadius: '1rem',
        overflow: 'hidden',
        backgroundColor: 'hsl(0 0% 100%)',
        border: is_featured
          ? '1.5px solid hsl(38 92% 55%)'
          : '1px solid hsl(40 20% 88%)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 12px 28px -6px hsl(200 25% 15% / 0.14), 0 4px 10px -3px hsl(200 25% 15% / 0.08)'
          : is_featured
          ? '0 2px 10px -2px hsl(38 92% 55% / 0.18)'
          : '0 2px 8px -2px hsl(200 25% 15% / 0.08)',
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Featured ribbon */}
      {is_featured && (
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          zIndex: 10,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.25rem 0.625rem',
          borderRadius: '9999px',
          backgroundColor: 'hsl(38 92% 50%)',
          color: 'hsl(28 90% 20%)',
          fontSize: '0.7rem',
          fontWeight: '600',
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
        }}>
          <Sparkles style={{ width: '0.7rem', height: '0.7rem' }} />
          Featured
        </div>
      )}

      {/* Image */}
      <div style={{
        width: '100%',
        height: '190px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'hsl(40 30% 94%)',
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
          }}>
            <MapPin style={{ height: '2.5rem', width: '2.5rem', color: 'hsl(200 25% 15% / 0.18)' }} />
            <span style={{ fontSize: '0.75rem', color: 'hsl(200 15% 55%)', marginTop: '0.5rem' }}>
              No image
            </span>
          </div>
        )}

        {/* Image count badge */}
        {imagesArray.length > 1 && !imageError && (
          <div style={{
            position: 'absolute',
            bottom: '0.5rem',
            right: '0.5rem',
            backgroundColor: 'rgba(0,0,0,0.65)',
            color: 'white',
            padding: '0.2rem 0.5rem',
            borderRadius: '0.375rem',
            fontSize: '0.7rem',
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
            ? 'hsl(174 50% 28% / 0.92)'
            : 'hsl(220 60% 38% / 0.92)',
          color: 'white',
          padding: '0.2rem 0.55rem',
          borderRadius: '0.375rem',
          fontSize: '0.7rem',
          fontWeight: '600',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          {purpose === 'sale' ? 'For Sale' : 'To Let'}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '1rem' }}>
        {/* Title */}
        <h3 style={{
          margin: '0 0 0.35rem',
          fontSize: '0.975rem',
          fontWeight: '600',
          color: 'hsl(200 25% 15%)',
          lineHeight: '1.35',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {title}
        </h3>

        {/* Location */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem',
          marginBottom: '0.65rem',
        }}>
          <MapPin style={{ height: '0.8rem', width: '0.8rem', color: 'hsl(200 15% 50%)', flexShrink: 0 }} />
          <span style={{
            fontSize: '0.8rem',
            color: 'hsl(200 15% 50%)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {[area, city].filter(Boolean).join(', ')}
          </span>
        </div>

        {/* Bed / Bath */}
        {(bedrooms != null || bathrooms != null) && (
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '0.65rem',
          }}>
            {bedrooms != null && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: 'hsl(200 15% 45%)' }}>
                <BedDouble style={{ width: '0.85rem', height: '0.85rem' }} />
                {bedrooms} bed{bedrooms !== 1 ? 's' : ''}
              </span>
            )}
            {bathrooms != null && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: 'hsl(200 15% 45%)' }}>
                <Bath style={{ width: '0.85rem', height: '0.85rem' }} />
                {bathrooms} bath{bathrooms !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div style={{ marginBottom: '0.85rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'hsl(174 62% 28%)' }}>
            {purpose === 'sale'
              ? formatPrice(sale_price)
              : `${formatPrice(rent_min)} – ${formatPrice(rent_max)}`}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'hsl(200 15% 55%)', marginTop: '0.1rem' }}>
            {purpose === 'sale'
              ? 'asking price'
              : `per month · ${advance_duration} ${Number(advance_duration) === 1 ? 'yr' : 'yrs'} advance`}
          </div>
        </div>

        {/* Footer: agent + verified */}
        <div style={{ borderTop: '1px solid hsl(40 20% 90%)', paddingTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            {agent_name ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 0 }}>
                <div style={{
                  width: '1.6rem',
                  height: '1.6rem',
                  borderRadius: '50%',
                  backgroundColor: 'hsl(174 62% 32% / 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '0.6rem',
                  fontWeight: '700',
                  color: 'hsl(174 62% 28%)',
                }}>
                  {agent_name.charAt(0).toUpperCase()}
                </div>
                <span style={{
                  fontSize: '0.78rem',
                  color: 'hsl(200 15% 45%)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {agent_name}
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '0.78rem', color: 'hsl(200 15% 60%)' }}>No agent</span>
            )}

            {isVerified && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                padding: '0.18rem 0.5rem',
                borderRadius: '9999px',
                backgroundColor: 'hsl(152 60% 40% / 0.1)',
                color: 'hsl(152 60% 32%)',
                fontSize: '0.7rem',
                fontWeight: '600',
                flexShrink: 0,
              }}>
                <Shield style={{ width: '0.65rem', height: '0.65rem' }} />
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
        margin: '0 0 0.3rem',
        fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
        fontWeight: '700',
        color: 'hsl(200 25% 13%)',
        letterSpacing: '-0.02em',
        lineHeight: '1.2',
      }}>
        {title}
      </h2>
      <p style={{ margin: 0, fontSize: '0.9rem', color: 'hsl(200 15% 48%)' }}>
        {subtitle}
      </p>
    </div>
    <Link
      href={viewAllHref}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.5rem 1rem',
        borderRadius: '0.625rem',
        border: '1px solid hsl(174 62% 32% / 0.3)',
        color: 'hsl(174 62% 28%)',
        fontSize: '0.85rem',
        fontWeight: '500',
        textDecoration: 'none',
        transition: 'background-color 0.15s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.06)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {viewAllLabel}
      <ArrowRight style={{ width: '0.9rem', height: '0.9rem' }} />
    </Link>
  </div>
);

// ---------------------------------------------------------------------------
// ListingGrid
// ---------------------------------------------------------------------------

const ListingGrid = ({ listings, purpose }) => (
  <div style={{
    display: 'grid',
    /*
     * Cap at 4 columns so cards don't become excessively wide on large screens.
     * minmax(220px, 1fr) alone would let 2 cards fill a 1400px container at
     * ~700px each; the repeat(auto-fill, ...) + max-width on the container
     * handles the rest, but an explicit clamp keeps things tighter.
     */
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))',
    maxWidth: '1200px', // aligns with container but prevents runaway widths
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
// FeaturedListings (main export)
// ---------------------------------------------------------------------------

const FeaturedListings = ({ featuredRentals = [], featuredSales = [] }) => {
  const hasRentals = featuredRentals?.length > 0;
  const hasSales   = featuredSales?.length  > 0;

  if (!hasRentals && !hasSales) {
    return (
      <section style={{ padding: '4rem 0', backgroundColor: 'hsl(40 33% 98%)' }}>
        <div className="container mx-auto px-4" style={{ textAlign: 'center' }}>
          <p style={{ color: 'hsl(200 15% 50%)', fontSize: '1rem' }}>
            No listings available yet. Check back soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        .featured-section * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
      `}</style>

      <section className="featured-section" style={{ padding: '4rem 0', backgroundColor: 'hsl(40 33% 98%)' }}>
        <div className="container mx-auto px-4">

          {/* Hero header */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}>
              <div>
                <h2 style={{
                  margin: '0 0 0.5rem',
                  fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
                  fontWeight: '700',
                  color: 'hsl(200 25% 13%)',
                  letterSpacing: '-0.03em',
                  lineHeight: '1.05',
                }}>
                  Featured Listings
                </h2>
                <p style={{
                  margin: 0,
                  fontSize: '1rem',
                  color: 'hsl(200 15% 48%)',
                  maxWidth: '40rem',
                }}>
                  Discover the best rental and sale properties on the platform, highlighted for their quality, value, and agent trust.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {hasRentals && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.65rem 1rem',
                    borderRadius: '9999px',
                    backgroundColor: 'hsl(174 62% 32% / 0.08)',
                    color: 'hsl(174 62% 32%)',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}>
                    {featuredRentals.length} Rentals
                  </span>
                )}
                {hasSales && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.65rem 1rem',
                    borderRadius: '9999px',
                    backgroundColor: 'hsl(38 92% 55% / 0.08)',
                    color: 'hsl(28 80% 40%)',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}>
                    {featuredSales.length} For Sale
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Rentals */}
          {hasRentals && (
            <div style={{ marginBottom: hasSales ? '4rem' : 0 }}>
              <SectionHeader
                title="Featured Rentals"
                subtitle="Recommended rental listings from verified agents"
                viewAllHref="/rent/listings"
                viewAllLabel="View all rentals"
              />
              <ListingGrid listings={featuredRentals} purpose="rent" />
            </div>
          )}

          {/* Sales */}
          {hasSales && (
            <div>
              <SectionHeader
                title="Featured Properties for Sale"
                subtitle="High-priority sale listings from top agents"
                viewAllHref="/buy/listings"
                viewAllLabel="View all for sale"
              />
              <ListingGrid listings={featuredSales} purpose="sale" />
            </div>
          )}

        </div>
      </section>
    </>
  );
};

export default FeaturedListings;