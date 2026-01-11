import React, { useState } from 'react';
import { ArrowRight, MapPin, Star, CheckCircle2, Shield } from 'lucide-react';

// Sample data
const sampleListings = [
  {
    id: "1",
    title: "2 Bedroom Self-Contained",
    area: "East Legon",
    city: "Accra",
    rentMin: 1500,
    rentMax: 2000,
    advanceDuration: 2,
    agentName: "Kofi Mensah",
    isVerified: true,
    isClaimed: true,
    reviewCount: 12,
    rating: 4.5,
  },
  {
    id: "2",
    title: "1 Bedroom Apartment",
    area: "Spintex",
    city: "Accra",
    rentMin: 800,
    rentMax: 1200,
    advanceDuration: 1,
    agentName: "Ama Serwaa",
    isVerified: true,
    isClaimed: true,
    reviewCount: 8,
    rating: 4.2,
  },
  {
    id: "3",
    title: "3 Bedroom House",
    area: "Tema Community 25",
    city: "Tema",
    rentMin: 2500,
    rentMax: 3500,
    advanceDuration: 2,
    agentName: null,
    isVerified: false,
    isClaimed: false,
    reviewCount: 3,
    rating: 3.8,
  },
  {
    id: "4",
    title: "Chamber and Hall",
    area: "Achimota",
    city: "Accra",
    rentMin: 500,
    rentMax: 700,
    advanceDuration: 1,
    agentName: "Emmanuel Boateng",
    isVerified: false,
    isClaimed: true,
    reviewCount: 5,
    rating: 4.0,
  },
];

const PropertyCard = ({ 
  id, 
  title, 
  area, 
  city, 
  rentMin, 
  rentMax, 
  advanceDuration, 
  agentName, 
  isVerified, 
  isClaimed, 
  reviewCount, 
  rating 
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
            {formatPrice(rentMin)} - {formatPrice(rentMax)}
          </div>
          <div className="text-xs" style={{ color: 'hsl(200 15% 45%)' }}>
            {advanceDuration} {advanceDuration === 1 ? 'year' : 'years'} advance
          </div>
        </div>

        {/* Agent Info */}
        {agentName && (
          <div className="mb-3 pb-3 border-b" style={{ borderColor: 'hsl(40 20% 88%)' }}>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
                Agent: {agentName}
              </span>
              {isVerified && (
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
              {rating.toFixed(1)}
            </span>
            <span className="text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
              ({reviewCount})
            </span>
          </div>
          
          {/* Badges */}
          <div className="flex gap-2">
            {isVerified && (
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

const FeaturedListings = () => {
  const handleViewAll = () => {
    console.log('View all listings clicked');
    alert('Navigating to all listings...');
  };

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
            <button
              onClick={handleViewAll}
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
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleListings.map((listing) => (
              <PropertyCard key={listing.id} {...listing} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedListings;