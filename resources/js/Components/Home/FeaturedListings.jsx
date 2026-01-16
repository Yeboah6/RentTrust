import React, { useState } from 'react';
import { Link } from "@inertiajs/react";
import { ArrowRight, MapPin, Star, CheckCircle2, Shield } from 'lucide-react';

const PropertyCard = ({ 
  id, 
  title, 
  area, 
  city, 
  rent_min, 
  rent_max, 
  advance_duration, 
  agent_name, 
  is_verified, 
  is_claimed, 
  // reviewCount, 
  // rating 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price) => `GH₵${price.toLocaleString()}`;

  return (
    <div
      className="border rounded-xl bg-white overflow-hidden transition-all duration-300 cursor-pointer"
      style={{ 
        borderColor: 'hsl(40 20% 88%)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 8px 20px -4px hsl(200 25% 15% / 0.12), 0 4px 8px -2px hsl(200 25% 15% / 0.08)'
          : '0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => alert(`View details for ${title}`)}
    >
      {/* Image placeholder */}
      <div 
        className="w-full h-48 flex items-center justify-center text-white font-semibold"
        style={{ 
          background: `linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)`
        }}
      >
        {title}
      </div>

      <div className="p-4">
        {/* Title and Location */}
        <h3 className="font-bold text-lg mb-2 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
          {title}
        </h3>
        <div className="flex items-center gap-1 mb-3" style={{ color: 'hsl(200 15% 45%)' }}>
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{area}, {city}</span>
        </div>

        {/* Price Range */}
        <div className="mb-3">
          <div className="text-sm mb-1" style={{ color: 'hsl(200 15% 45%)' }}>
            Monthly Rent
          </div>
          <div className="text-xl font-bold" style={{ color: 'hsl(174 62% 32%)' }}>
            {formatPrice(rent_min)} - {formatPrice(rent_max)}
          </div>
          <div className="text-xs" style={{ color: 'hsl(200 15% 45%)' }}>
            {advance_duration} {advance_duration === 1 ? 'year' : 'years'} advance
          </div>
        </div>

        {/* Agent Info */}
        {agent_name && (
          <div className="mb-3 pb-3 border-b" style={{ borderColor: 'hsl(40 20% 88%)' }}>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
                Agent: {agent_name}
              </span>
              {is_verified && (
                <div className="inline-flex items-center gap-1">
                  <Shield className="h-3 w-3" style={{ color: 'hsl(152 60% 40%)' }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current" style={{ color: 'hsl(38 92% 50%)' }} />
            <span className="font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>
              {/* {rating.toFixed(1)} */}
            </span>
            <span className="text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
              {/* ({reviewCount}) */}
            </span>
          </div>
          
          {/* Badges */}
          <div className="flex gap-2">
            {is_verified && (
              <span 
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: 'hsl(152 60% 40% / 0.1)',
                  color: 'hsl(152 60% 40%)'
                }}
              >
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedListings = ({ recentListings = [] }) => {
  // Show message if no listings available
  if (!recentListings || recentListings.length === 0) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          
          * {
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          }
        `}</style>

        <section className="py-16" style={{ backgroundColor: 'hsl(40 33% 98%)' }}>
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                No Listings Available
              </h2>
              <p style={{ color: 'hsl(200 15% 45%)' }}>
                Check back soon for new property listings
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
      `}</style>

      <section className="py-16" style={{ backgroundColor: 'hsl(40 33% 98%)' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                Recent Listings
              </h2>
              <p style={{ color: 'hsl(200 15% 45%)' }}>
                Browse the latest properties with transparent rent information
              </p>
            </div>
            <Link
              href="/listings"
              className="self-start md:self-auto inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors"
              style={{ 
                color: 'hsl(174 62% 32%)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              View All Listings
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentListings.map((listing) => (
              <PropertyCard key={listing.id} {...listing} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedListings;