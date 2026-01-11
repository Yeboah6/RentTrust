import React, { useState } from 'react';
import { ArrowRight, MapPin, Home, TrendingUp, TrendingDown } from 'lucide-react';

const areas = [
  {
    name: "East Legon",
    city: "Accra",
    listingCount: 45,
    avgRent: 2500,
    trend: "+5%",
    color: "primary",
  },
  {
    name: "Spintex",
    city: "Accra",
    listingCount: 67,
    avgRent: 1200,
    trend: "+3%",
    color: "accent",
  },
  {
    name: "Osu",
    city: "Accra",
    listingCount: 32,
    avgRent: 1800,
    trend: "-2%",
    color: "success",
  },
  {
    name: "Tema Community 25",
    city: "Tema",
    listingCount: 28,
    avgRent: 900,
    trend: "+8%",
    color: "primary",
  },
  {
    name: "Achimota",
    city: "Accra",
    listingCount: 54,
    avgRent: 700,
    trend: "+2%",
    color: "accent",
  },
  {
    name: "Adum",
    city: "Kumasi",
    listingCount: 23,
    avgRent: 600,
    trend: "+4%",
    color: "success",
  },
];

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
      onClick={() => alert(`View properties in ${area.name}, ${area.city}`)}
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

const PopularAreas = () => {
  const handleViewAll = () => {
    console.log('View all areas clicked');
    alert('Navigating to all areas...');
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
                Popular Areas
              </h2>
              <p style={{ color: 'hsl(200 15% 45%)' }}>
                Explore rent prices and reviews in these popular neighborhoods
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
              View All Areas
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.map((area) => (
              <AreaCard key={area.name} area={area} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PopularAreas;