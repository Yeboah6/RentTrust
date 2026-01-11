import React, { useState } from 'react';
import { Search, MapPin, Shield, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { icon: MapPin, value: "50+", label: "Areas Covered" },
    { icon: Shield, value: "200+", label: "Verified Agents" },
    { icon: TrendingUp, value: "5,000+", label: "Rent Prices Shared" },
  ];

  const popularAreas = ["East Legon", "Spintex", "Osu", "Tema", "Achimota"];

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    alert(`Searching for properties in: ${searchQuery || 'all areas'}`);
  };

  const handleAreaClick = (area) => {
    setSearchQuery(area);
    console.log('Selected area:', area);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        
        .gradient-hero {
          background: linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .dot-pattern {
          background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+');
        }
      `}</style>

      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 dot-pattern opacity-50" />

        <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 animate-fadeInUp backdrop-blur-sm"
              style={{ 
                backgroundColor: 'hsl(0 0% 100% / 0.1)',
                border: '1px solid hsl(0 0% 100% / 0.2)'
              }}
            >
              <Shield className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                Trusted by 10,000+ Ghanaians
              </span>
            </div>

            {/* Headline */}
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight animate-fadeInUp"
              style={{ animationDelay: '0.1s', textWrap: 'balance' }}
            >
              Know the Real Rent Before You Pay
            </h1>

            <p 
              className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto animate-fadeInUp"
              style={{ animationDelay: '0.2s' }}
            >
              See real rent prices, verified agents, and honest tenant reviews across Ghana. 
              Make informed decisions before you commit.
            </p>

            {/* Search Bar */}
            <div 
              className="bg-white rounded-xl p-2 shadow-lg max-w-xl mx-auto mb-8 animate-fadeInUp"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <MapPin 
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none" 
                    style={{ color: 'hsl(200 15% 45%)' }}
                  />
                  <input
                    type="text"
                    placeholder="Enter area or city (e.g., East Legon, Kumasi)"
                    className="w-full pl-10 h-12 border-0 rounded-lg px-4 focus:outline-none focus:ring-2 transition-all"
                    style={{ 
                      backgroundColor: 'hsl(40 30% 94%)',
                      '--tw-ring-color': 'hsl(174 62% 32%)'
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="h-12 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
                  style={{ 
                    background: 'linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(30 90% 45%) 100%)',
                    color: 'hsl(200 25% 10%)'
                  }}
                >
                  <Search className="h-5 w-5" />
                  Search
                </button>
              </div>
            </div>

            {/* Popular Areas */}
            <div 
              className="flex flex-wrap justify-center gap-2 mb-12 animate-fadeInUp"
              style={{ animationDelay: '0.4s' }}
            >
              <span className="text-sm text-white/60">Popular:</span>
              {popularAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => handleAreaClick(area)}
                  className="px-3 py-1 text-sm text-white rounded-full transition-all duration-200"
                  style={{ backgroundColor: 'hsl(0 0% 100% / 0.1)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(0 0% 100% / 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(0 0% 100% / 0.1)'}
                >
                  {area}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div 
              className="grid grid-cols-3 gap-4 max-w-md mx-auto animate-fadeInUp"
              style={{ animationDelay: '0.5s' }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-5 w-5 text-white/60" />
                  </div>
                  <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                  <div className="text-xs text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div 
          className="relative py-3"
          style={{ 
            backgroundColor: 'hsl(38 92% 50% / 0.1)',
            borderTop: '1px solid hsl(38 92% 50% / 0.2)'
          }}
        >
          <div className="container mx-auto px-4">
            <p 
              className="text-center text-sm font-medium"
              style={{ color: 'hsl(200 25% 10%)' }}
            >
              ⚠️ Always inspect a property in person before paying any money
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;