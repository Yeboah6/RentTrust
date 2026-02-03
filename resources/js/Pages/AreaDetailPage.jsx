import React from 'react';
import { Link } from '@inertiajs/react';
import { MapPin, Home, TrendingUp, TrendingDown, ArrowLeft, Building, DollarSign, Calendar } from 'lucide-react';
import Header from "../Components/Layouts/Header";
import Footer from "../Components/Layouts/Footer";

const PropertyCard = ({ property }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link
      href={`/rentals/${property.id}`}
      className="block overflow-hidden border rounded-xl bg-white transition-all duration-300"
      style={{
        borderColor: 'hsl(40 20% 88%)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 8px 20px -4px hsl(200 25% 15% / 0.12), 0 4px 8px -2px hsl(200 25% 15% / 0.08)'
          : '0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)',
        textDecoration: 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Property Image */}
      <div 
        className="h-48 bg-cover bg-center"
        style={{
          backgroundImage: property.image 
            ? `url(${property.image})` 
            : 'linear-gradient(135deg, hsl(174 62% 32% / 0.2) 0%, hsl(174 62% 32% / 0.05) 100%)'
        }}
      >
        {!property.image && (
          <div className="h-full flex items-center justify-center">
            <Building className="h-12 w-12" style={{ color: 'hsl(200 25% 15% / 0.2)' }} />
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4">
        <h3 className="font-semibold tracking-tight mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
          {property.property_type || 'Property'}
        </h3>
        
        <div className="space-y-2 text-sm mb-3">
          <div className="flex items-center gap-2" style={{ color: 'hsl(200 15% 45%)' }}>
            <MapPin className="h-4 w-4" />
            <span>{property.area}</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: 'hsl(200 15% 45%)' }}>
            <Home className="h-4 w-4" />
            <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs mb-1" style={{ color: 'hsl(200 15% 45%)' }}>Rent Range</p>
            <p className="font-bold" style={{ color: 'hsl(174 62% 32%)' }}>
              GH₵{property.rent_min.toLocaleString()} - GH₵{property.rent_max.toLocaleString()}
            </p>
          </div>
          {property.created_at && (
            <div className="text-xs" style={{ color: 'hsl(200 15% 45%)' }}>
              <Calendar className="h-3 w-3 inline mr-1" />
              {new Date(property.created_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

const AreaDetailPage = ({ area, city, properties }) => {
  const isPositiveTrend = area.trend.startsWith('+');
  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1);

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
          {/* Breadcrumb & Header */}
          <div className="bg-white border-b py-6" style={{ borderColor: 'hsl(40 20% 88%)' }}>
            <div className="container mx-auto px-4">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
                <Link href="/" className="hover:underline">Home</Link>
                <span>/</span>
                <Link href="/areas" className="hover:underline">Areas</Link>
                <span>/</span>
                <Link href={`/areas?city=${city}`} className="hover:underline">{cityLabel}</Link>
                <span>/</span>
                <span style={{ color: 'hsl(200 25% 15%)' }}>{area.name}</span>
              </div>

              {/* Area Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                    {area.name}
                  </h1>
                  <div className="flex items-center gap-2" style={{ color: 'hsl(200 15% 45%)' }}>
                    <MapPin className="h-4 w-4" />
                    <span>{cityLabel}, Ghana</span>
                  </div>
                </div>

                <Link
                  href="/areas"
                  className="self-start md:self-auto inline-flex items-center px-4 py-2 rounded-lg font-medium border transition-colors"
                  style={{ 
                    color: 'hsl(174 62% 32%)',
                    borderColor: 'hsl(40 20% 88%)',
                    backgroundColor: 'white'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Areas
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {/* Average Rent */}
              <div className="bg-white rounded-lg p-6 border" style={{ borderColor: 'hsl(40 20% 88%)' }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: 'hsl(200 15% 45%)' }}>
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Average Rent</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: 'hsl(174 62% 32%)' }}>
                  GH₵{area.avgRent.toLocaleString()}
                </p>
                <p className="text-xs mt-1" style={{ color: 'hsl(200 15% 45%)' }}>per month</p>
              </div>

              {/* Total Listings */}
              <div className="bg-white rounded-lg p-6 border" style={{ borderColor: 'hsl(40 20% 88%)' }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: 'hsl(200 15% 45%)' }}>
                  <Home className="h-4 w-4" />
                  <span className="text-sm">Total Listings</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: 'hsl(200 25% 15%)' }}>
                  {area.listingCount}
                </p>
                <p className="text-xs mt-1" style={{ color: 'hsl(200 15% 45%)' }}>available properties</p>
              </div>

              {/* Price Trend */}
              <div className="bg-white rounded-lg p-6 border" style={{ borderColor: 'hsl(40 20% 88%)' }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: 'hsl(200 15% 45%)' }}>
                  {isPositiveTrend ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-sm">Price Trend</span>
                </div>
                <p 
                  className="text-2xl font-bold"
                  style={{ color: isPositiveTrend ? 'hsl(152 60% 40%)' : 'hsl(0 72% 51%)' }}
                >
                  {area.trend}
                </p>
                <p className="text-xs mt-1" style={{ color: 'hsl(200 15% 45%)' }}>last 30 days</p>
              </div>

              {/* Min-Max Range */}
              <div className="bg-white rounded-lg p-6 border" style={{ borderColor: 'hsl(40 20% 88%)' }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: 'hsl(200 15% 45%)' }}>
                  <Building className="h-4 w-4" />
                  <span className="text-sm">Price Range</span>
                </div>
                <p className="text-lg font-bold" style={{ color: 'hsl(200 25% 15%)' }}>
                  GH₵{area.minRent?.toLocaleString() || 0} - {area.maxRent?.toLocaleString() || 0}
                </p>
                <p className="text-xs mt-1" style={{ color: 'hsl(200 15% 45%)' }}>min - max</p>
              </div>
            </div>

            {/* Properties Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                Available Properties in {area.name}
              </h2>
            </div>

            {properties && properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border" style={{ borderColor: 'hsl(40 20% 88%)' }}>
                <Home className="h-12 w-12 mx-auto mb-4" style={{ color: 'hsl(200 15% 45% / 0.5)' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                  No properties available
                </h3>
                <p style={{ color: 'hsl(200 15% 45%)' }}>
                  Check back later for new listings in {area.name}
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

export default AreaDetailPage;