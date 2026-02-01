import React, { useState } from 'react';
import { Search, MapPin, Home, TrendingUp, TrendingDown, ChevronRight, Menu, X, User } from 'lucide-react';
import Header from "../Components/Layouts/Header";
import Footer from "../Components/Layouts/Footer";

const areasByCity = {
  accra: [
    { name: "East Legon", listingCount: 45, avgRent: 2500, trend: "+5%" },
    { name: "Spintex", listingCount: 67, avgRent: 1200, trend: "+3%" },
    { name: "Osu", listingCount: 32, avgRent: 1800, trend: "-2%" },
    { name: "Achimota", listingCount: 54, avgRent: 700, trend: "+2%" },
    { name: "Cantonments", listingCount: 18, avgRent: 3500, trend: "+8%" },
    { name: "Airport Residential", listingCount: 22, avgRent: 3000, trend: "+4%" },
    { name: "Dansoman", listingCount: 41, avgRent: 500, trend: "+1%" },
    { name: "Madina", listingCount: 58, avgRent: 600, trend: "+3%" },
  ],
  kumasi: [
    { name: "Adum", listingCount: 23, avgRent: 600, trend: "+4%" },
    { name: "Ahodwo", listingCount: 19, avgRent: 1200, trend: "+6%" },
    { name: "Nhyiaeso", listingCount: 15, avgRent: 800, trend: "+2%" },
    { name: "Bantama", listingCount: 28, avgRent: 450, trend: "+1%" },
  ],
  tema: [
    { name: "Community 25", listingCount: 28, avgRent: 900, trend: "+8%" },
    { name: "Community 1", listingCount: 12, avgRent: 600, trend: "+2%" },
    { name: "Community 12", listingCount: 16, avgRent: 750, trend: "+5%" },
  ],
  tamale: [
    { name: "Jisonayili", listingCount: 8, avgRent: 400, trend: "+3%" },
    { name: "Lamashegu", listingCount: 11, avgRent: 350, trend: "+2%" },
  ],
};

  <Header />

const AreaCard = ({ area, cityName }) => {
  const [isHovered, setIsHovered] = useState(false);
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
      onClick={() => alert(`View details for ${area.name}, ${cityName}`)}
    >
      <div 
        className="h-20 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, hsl(174 62% 32% / 0.2) 0%, hsl(174 62% 32% / 0.05) 100%)' }}
      >
        <MapPin className="h-6 w-6" style={{ color: 'hsl(200 25% 15% / 0.2)' }} />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
            {area.name}
          </h3>
          <div 
            className="flex items-center gap-1 text-sm font-medium"
            style={{ color: isPositiveTrend ? 'hsl(152 60% 40%)' : 'hsl(0 72% 51%)' }}
          >
            {isPositiveTrend ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {area.trend}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-1" style={{ color: 'hsl(200 15% 45%)' }}>
            <Home className="h-4 w-4" />
            <span>{area.listingCount} listings</span>
          </div>
          <div className="font-semibold" style={{ color: 'hsl(174 62% 32%)' }}>
            ~GH₵{area.avgRent.toLocaleString()}/mo
          </div>
        </div>
        <button 
          className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors"
          style={{ 
            backgroundColor: isHovered ? 'hsl(40 30% 94%)' : 'transparent',
            color: 'hsl(174 62% 32%)'
          }}
        >
          View Area Details
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const AreasPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("accra");

  const cities = [
    { value: "accra", label: "Accra" },
    { value: "kumasi", label: "Kumasi" },
    { value: "tema", label: "Tema" },
    { value: "tamale", label: "Tamale" },
  ];

  const areas = areasByCity[selectedCity] || [];
  const filteredAreas = areas.filter((area) =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cityLabel = cities.find(c => c.value === selectedCity)?.label || 'Accra';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
      `}</style>

      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main className="flex-1">
          {/* Page Header */}
          <div className="bg-white border-b py-8" style={{ borderColor: 'hsl(40 20% 88%)' }}>
            <div className="container mx-auto px-4">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                Browse Areas
              </h1>
              <p className="mb-6" style={{ color: 'hsl(200 15% 45%)' }}>
                Explore rent prices and insights across different neighborhoods in Ghana
              </p>

              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none" style={{ color: 'hsl(200 15% 45%)' }} />
                <input
                  type="text"
                  placeholder="Search for an area..."
                  className="w-full pl-10 h-12 border rounded-lg px-4 focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    borderColor: 'hsl(40 20% 88%)',
                    '--tw-ring-color': 'hsl(174 62% 32%)'
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* City Tabs & Areas */}
          <div className="container mx-auto px-4 py-8">
            {/* City Tabs */}
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              {cities.map((city) => (
                <button
                  key={city.value}
                  onClick={() => setSelectedCity(city.value)}
                  className="px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all"
                  style={{
                    backgroundColor: selectedCity === city.value ? 'hsl(174 62% 32%)' : 'hsl(0 0% 100%)',
                    color: selectedCity === city.value ? 'hsl(0 0% 100%)' : 'hsl(200 25% 15%)',
                    border: selectedCity === city.value ? 'none' : '1px solid hsl(40 20% 88%)'
                  }}
                >
                  {city.label}
                </button>
              ))}
            </div>

            {/* Areas Grid */}
            {filteredAreas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAreas.map((area) => (
                  <AreaCard key={area.name} area={area} cityName={cityLabel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 mx-auto mb-4" style={{ color: 'hsl(200 15% 45% / 0.5)' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                  No areas found
                </h3>
                <p style={{ color: 'hsl(200 15% 45%)' }}>
                  Try adjusting your search or select a different city
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AreasPage;