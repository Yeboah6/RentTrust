import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Search, MapPin, Home, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import Header from "../Components/Layouts/Header";
import Footer from "../Components/Layouts/Footer";

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
      onClick={() => window.location.href = `/rent/areas/${cityName.toLowerCase()}/${area.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div 
        className="h-16 sm:h-20 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, hsl(174 62% 32% / 0.2) 0%, hsl(174 62% 32% / 0.05) 100%)' }}
      >
        <MapPin className="h-5 sm:h-6 w-5 sm:w-6" style={{ color: 'hsl(200 25% 15% / 0.2)' }} />
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold tracking-tight text-sm" style={{ color: 'hsl(200 25% 15%)' }}>
              {area.name}
            </h3>
            <p className="text-xs sm:text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
              {cityName}
            </p>
          </div>
          <div 
            className="flex items-center gap-1 text-xs sm:text-sm font-medium ml-2"
            style={{ color: isPositiveTrend ? 'hsl(152 60% 40%)' : 'hsl(0 72% 51%)', flexShrink: 0 }}
          >
            {isPositiveTrend ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {area.trend}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs sm:text-sm mb-3">
          <div className="flex items-center gap-1" style={{ color: 'hsl(200 15% 45%)' }}>
            <Home className="h-3.5 w-3.5" />
            <span>{area.listingCount} listings</span>
          </div>
          <div className="font-semibold text-xs" style={{ color: 'hsl(174 62% 32%)' }}>
            ~GH₵{area.avgRent.toLocaleString()}/mo
          </div>
        </div>
        <button 
          className="w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-lg transition-colors"
          style={{ 
            backgroundColor: isHovered ? 'hsl(40 30% 94%)' : 'transparent',
            color: 'hsl(174 62% 32%)'
          }}
        >
          View Properties
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

const AreasPage = ({ areas: areasByCity }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get available cities from the data
  const availableCities = areasByCity ? Object.keys(areasByCity) : [];
  const [selectedCity, setSelectedCity] = useState(availableCities[0] || "accra");

  // City labels mapping
  const cityLabels = {
    'accra': 'Accra',
    'kumasi': 'Kumasi',
    'tema': 'Tema',
    'tamale': 'Tamale',
    'takoradi': 'Takoradi',
    'cape coast': 'Cape Coast',
    'sunyani': 'Sunyani',
    'ho': 'Ho',
  };

  // Get cities that exist in the data
  const cities = availableCities.map(cityKey => ({
    value: cityKey,
    label: cityLabels[cityKey] || cityKey.charAt(0).toUpperCase() + cityKey.slice(1)
  }));

  // Get areas for selected city - handle both object and array structures
  const getAreasForCity = (cityKey) => {
    if (!areasByCity || !areasByCity[cityKey]) return [];
    
    const cityData = areasByCity[cityKey];
    
    // If it's already an array, return it
    if (Array.isArray(cityData)) return cityData;
    
    // If it's an object, convert to array
    return Object.values(cityData);
  };

  const areas = getAreasForCity(selectedCity);
  
  // Filter areas based on search query
  const filteredAreas = areas.filter((area) =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cityLabel = cities.find(c => c.value === selectedCity)?.label || 'Accra';

  // Calculate statistics
  const totalListings = filteredAreas.reduce((sum, area) => sum + area.listingCount, 0);
  const avgCityRent = filteredAreas.length > 0
    ? Math.round(filteredAreas.reduce((sum, area) => sum + area.avgRent, 0) / filteredAreas.length)
    : 0;

  return (
    <>
        <Head>
          <title>Browse Rental Areas & Neighborhoods in Ghana | RentTrustGh</title>

          {/* Primary Meta */}
          <meta
              name="description"
              content="Explore rental areas and neighborhoods across Ghana. Compare average rents, available listings, and property trends in Accra, Tema, Kumasi, Tamale, Takoradi, Cape Coast, Ho, Sunyani, and more."
          />

          <meta
              name="keywords"
              content="areas in Ghana, rental areas Ghana, neighborhoods Ghana, Accra neighborhoods, Kumasi rental areas, Tema property, average rent Ghana, property locations Ghana, RentTrustGh areas"
          />

          <meta
              name="robots"
              content="index,follow,max-image-preview:large"
          />

          <meta
              name="googlebot"
              content="index,follow"
          />

          {/* Canonical */}
          <link
              rel="canonical"
              href="https://renttrustgh.com/rent/areas"
          />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="RentTrustGh" />
          <meta property="og:locale" content="en_GH" />

          <meta
              property="og:title"
              content="Browse Rental Areas & Neighborhoods in Ghana | RentTrustGh"
          />

          <meta
              property="og:description"
              content="Compare neighborhoods, average rent prices, listing availability, and property trends across Ghana."
          />

          <meta
              property="og:url"
              content="https://renttrustgh.com/rent/areas"
          />

          <meta
              property="og:image"
              content="https://renttrustgh.com/images/seo/areas-og.jpg"
          />

          {/* Twitter */}
          <meta
              name="twitter:card"
              content="summary_large_image"
          />

          <meta
              name="twitter:title"
              content="Browse Rental Areas & Neighborhoods in Ghana | RentTrustGh"
          />

          <meta
              name="twitter:description"
              content="Explore Ghana's rental neighborhoods, compare average rents, and discover available properties by area."
          />

          <meta
              name="twitter:image"
              content="https://renttrustgh.com/images/seo/areas-og.jpg"
          />

          {/* Structured Data */}
          <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "CollectionPage",
                      "name": "Rental Areas in Ghana",
                      "url": "https://renttrustgh.com/rent/areas",
                      "description": "Browse rental neighborhoods, compare average rents, and discover available properties across Ghana.",
                      "isPartOf": {
                          "@type": "WebSite",
                          "name": "RentTrustGh",
                          "url": "https://renttrustgh.com"
                      },
                      "publisher": {
                          "@type": "Organization",
                          "name": "RentTrustGh",
                          "url": "https://renttrustgh.com",
                          "logo": {
                              "@type": "ImageObject",
                              "url": "https://renttrustgh.com/images/rent-trust.png"
                          }
                      }
                  })
              }}
          />

          {/* Breadcrumb Schema */}
          <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "BreadcrumbList",
                      "itemListElement": [
                          {
                              "@type": "ListItem",
                              "position": 1,
                              "name": "Home",
                              "item": "https://renttrustgh.com"
                          },
                          {
                              "@type": "ListItem",
                              "position": 2,
                              "name": "Rental Areas",
                              "item": "https://renttrustgh.com/rent/areas"
                          }
                      ]
                  })
              }}
          />
      </Head>
      <style>{`
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
      `}</style>

      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main className="flex-1">
          {/* Page Header */}
          <div className="bg-white border-b py-4 sm:py-8" style={{ borderColor: 'hsl(40 20% 88%)' }}>
            <div className="container mx-auto px-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                Browse Areas
              </h1>
              <p className="mb-6 text-sm sm:text-base" style={{ color: 'hsl(200 15% 45%)' }}>
                Explore rent prices and insights across different neighborhoods in Ghana
              </p>

              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none" style={{ color: 'hsl(200 15% 45%)' }} />
                <input
                  type="text"
                  placeholder="Search for an area..."
                  className="w-full pl-10 h-10 sm:h-12 border rounded-lg px-4 focus:outline-none focus:ring-2 transition-all text-sm sm:text-base"
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
          <div className="container mx-auto px-4 py-4 sm:py-8">
            {/* City Tabs */}
            {cities.length > 1 && (
              <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                {cities.map((city) => (
                  <button
                    key={city.value}
                    onClick={() => setSelectedCity(city.value)}
                    className="px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-all"
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
            )}

            {/* City Statistics */}
            {filteredAreas.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="bg-white rounded-lg p-3 sm:p-4 border" style={{ borderColor: 'hsl(40 20% 88%)' }}>
                  <p className="text-xs sm:text-sm mb-1" style={{ color: 'hsl(200 15% 45%)' }}>Total Areas</p>
                  <p className="text-xl sm:text-2xl font-bold" style={{ color: 'hsl(200 25% 15%)' }}>
                    {filteredAreas.length}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 sm:p-4 border" style={{ borderColor: 'hsl(40 20% 88%)' }}>
                  <p className="text-xs sm:text-sm mb-1" style={{ color: 'hsl(200 15% 45%)' }}>Total Listings</p>
                  <p className="text-xl sm:text-2xl font-bold" style={{ color: 'hsl(200 25% 15%)' }}>
                    {totalListings.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border" style={{ borderColor: 'hsl(40 20% 88%)' }}>
                  <p className="text-sm mb-1" style={{ color: 'hsl(200 15% 45%)' }}>Avg. Rent in {cityLabel}</p>
                  <p className="text-2xl font-bold" style={{ color: 'hsl(174 62% 32%)' }}>
                    GH₵{avgCityRent.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Areas Grid */}
            {filteredAreas.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredAreas.map((area, idx) => (
                  <AreaCard key={`${area.name}-${idx}`} area={area} cityName={cityLabel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 mx-auto mb-4" style={{ color: 'hsl(200 15% 45% / 0.5)' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                  No areas found
                </h3>
                <p style={{ color: 'hsl(200 15% 45%)' }}>
                  {searchQuery 
                    ? "Try adjusting your search or select a different city" 
                    : "No areas available in this city yet"}
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