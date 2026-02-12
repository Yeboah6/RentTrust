import React, { useState } from 'react';
import { Link } from "@inertiajs/react";
import { ArrowRight, MapPin, Home, TrendingUp, TrendingDown } from 'lucide-react';

const AreaCard = ({ area }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getGradientColor = (color) => {
    const gradients = {
      primary: 'linear-gradient(135deg, hsl(174 62% 32% / 0.2) 0%, hsl(174 62% 32% / 0.05) 100%)',
      accent: 'linear-gradient(135deg, hsl(38 92% 50% / 0.2) 0%, hsl(38 92% 50% / 0.05) 100%)',
      success: 'linear-gradient(135deg, hsl(152 60% 40% / 0.2) 0%, hsl(152 60% 40% / 0.05) 100%)',
    };
    return gradients[color];
  };

  const isPositiveTrend = area.trend.startsWith('+');

  return (
    <div
      className="overflow-hidden cursor-pointer border rounded-xl bg-white transition-all duration-300"
      style={{
        borderColor: 'hsl(40 20% 88%)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 8px 20px -4px hsl(200 25% 15% / 0.12), 0 4px 8px -2px hsl(200 25% 15% / 0.08)'
          : '0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.location.href = `/areas/${area.city.toLowerCase()}/${area.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div 
        className="h-24 flex items-center justify-center"
        style={{ background: getGradientColor(area.color) }}
      >
        <MapPin 
          className="h-8 w-8 transition-transform duration-300" 
          style={{ 
            color: 'hsl(200 25% 15% / 0.2)',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }} 
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
              {area.name}
            </h3>
            <p className="text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
              {area.city}
            </p>
          </div>
          <div 
            className="flex items-center gap-1 text-sm font-medium"
            style={{ color: isPositiveTrend ? 'hsl(152 60% 40%)' : 'hsl(0 72% 51%)' }}
          >
            {isPositiveTrend ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {area.trend}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1" style={{ color: 'hsl(200 15% 45%)' }}>
            <Home className="h-4 w-4" />
            <span>{area.listingCount} listings</span>
          </div>
          <div className="font-semibold" style={{ color: 'hsl(174 62% 32%)' }}>
            ~GH₵{area.avgRent.toLocaleString()}/mo
          </div>
        </div>
      </div>
    </div>
  );
};

const PopularAreas = ({ areas: areasByCity }) => {
  // Flatten grouped areas and add city name, then sort by listingCount and get top 6
  const flattenedAreas = areasByCity ? 
    Object.entries(areasByCity).flatMap(([city, cityAreas]) => 
      Object.values(cityAreas).map(area => ({
        ...area,
        city: city.charAt(0).toUpperCase() + city.slice(1),
        color: ['primary', 'accent', 'success'][Math.floor(Math.random() * 3)]
      }))
    ).sort((a, b) => b.listingCount - a.listingCount)
    .slice(0, 6)
  : [];

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
                Popular Areas
              </h2>
              <p style={{ color: 'hsl(200 15% 45%)' }}>
                Explore rent prices and reviews in these popular neighborhoods
              </p>
            </div>
            <Link
              href="/areas"
              className="self-start md:self-auto inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors"
              style={{ 
                color: 'hsl(174 62% 32%)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              View All Areas
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flattenedAreas.map((area, idx) => (
              <AreaCard key={`${area.city}-${area.name}-${idx}`} area={area} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PopularAreas;