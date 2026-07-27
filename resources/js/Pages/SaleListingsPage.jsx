import { useState, useRef, useEffect } from "react";
import { Link, Head } from "@inertiajs/react";
import Header from "../Components/Layouts/Header";
import Footer from "../Components/Layouts/Footer";
import { ChevronLeft, ChevronRight, BedDouble, Bath, Search as SearchIcon, MapPin as MapPinIcon, ChevronDown } from "lucide-react";

// ─── Icon Components ───────────────────────────────────────────────────────────

const MapPin = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Star = ({ style }) => (
  <svg style={style} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Shield = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) => `GH₵${Number(n || 0).toLocaleString()}`;
const hue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

const parseImages = (imagesData) => {
  if (!imagesData) return [];
  if (Array.isArray(imagesData)) return imagesData;
  if (typeof imagesData === 'string') {
    try {
      const parsed = JSON.parse(imagesData);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

// ─── Dropdown Component ────────────────────────────────────────────────────────

const Dropdown = ({ value, options, onChange, placeholder, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {label && (
        <label style={{ display: 'block', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.375rem' }}>
          {label}
        </label>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          height: 'clamp(2.5rem, 10vw, 3rem)',
          border: '1px solid hsl(40 20% 88%)',
          borderRadius: '0.75rem',
          paddingLeft: '1rem',
          paddingRight: '2.5rem',
          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
          outline: 'none',
          backgroundColor: 'white',
          color: 'hsl(200 25% 15%)',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          transition: 'border-color 0.2s',
          fontWeight: '500'
        }}
        onMouseEnter={(e) => !isOpen && (e.currentTarget.style.borderColor = 'hsl(174 62% 32%)')}
        onMouseLeave={(e) => !isOpen && (e.currentTarget.style.borderColor = 'hsl(40 20% 88%)')}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <ChevronDown 
          style={{ 
            position: 'absolute',
            right: '0.75rem',
            height: 'clamp(1rem, 3vw, 1.25rem)',
            width: 'clamp(1rem, 3vw, 1.25rem)',
            color: '#627884',
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            pointerEvents: 'none'
          }} 
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid hsl(40 20% 88%)',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            zIndex: 50,
            overflow: 'hidden',
            maxHeight: '250px',
            overflowY: 'auto'
          }}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: 'clamp(0.5rem, 2vw, 0.75rem) 1rem',
                border: 'none',
                backgroundColor: option.value === value ? '#1f847a' : 'white',
                color: option.value === value ? 'white' : 'hsl(200 25% 15%)',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                fontWeight: option.value === value ? '600' : '400',
                transition: 'background-color 0.15s',
                borderTop: index > 0 ? '1px solid hsl(40 20% 92%)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (option.value !== value) {
                  e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)';
                }
              }}
              onMouseLeave={(e) => {
                if (option.value !== value) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Property Card Component ───────────────────────────────────────────────────

const PropertyCard = ({ listing }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const imagesArray = parseImages(listing.images);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => prev === 0 ? imagesArray.length - 1 : prev - 1);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => prev === imagesArray.length - 1 ? 0 : prev + 1);
  };

  return (
    <div
      style={{
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid hsl(40 20% 88%)',
        borderRadius: '0.875rem',
        backgroundColor: 'white',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 12px 24px -6px rgba(0, 0, 0, 0.12)'
          : '0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Carousel */}
      <div style={{ 
        height: 'clamp(10rem, 35vw, 14rem)',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'hsl(174 62% 32% / 0.05)'
      }}>
        {imagesArray.length > 0 ? (
          <img 
            src={`/storage/rental_images/${imagesArray[currentImageIndex]}`}
            alt={`${listing.title} image ${currentImageIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'transform 0.3s ease-in-out',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)'
            }}
          />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            flexDirection: 'column'
          }}>
            <MapPin style={{ height: 'clamp(2.5rem, 8vw, 3rem)', width: 'clamp(2.5rem, 8vw, 3rem)', color: 'hsl(200 25% 15% / 0.15)' }} />
            <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)', marginTop: '0.5rem' }}>
              No image
            </div>
          </div>
        )}

        {/* Carousel Controls */}
        {imagesArray.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              style={{
                position: 'absolute',
                left: 'clamp(0.5rem, 2vw, 0.75rem)',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: 'clamp(2rem, 8vw, 2.5rem)',
                height: 'clamp(2rem, 8vw, 2.5rem)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                zIndex: 10,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronLeft size={20} style={{ color: '#374151' }} />
            </button>

            <button
              onClick={handleNextImage}
              style={{
                position: 'absolute',
                right: 'clamp(0.5rem, 2vw, 0.75rem)',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: 'clamp(2rem, 8vw, 2.5rem)',
                height: 'clamp(2rem, 8vw, 2.5rem)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                zIndex: 10,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronRight size={20} style={{ color: '#374151' }} />
            </button>

            {/* Dot Indicators */}
            <div style={{
              position: 'absolute',
              bottom: 'clamp(0.5rem, 2vw, 0.75rem)',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 'clamp(0.25rem, 1vw, 0.375rem)',
              padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 2vw, 0.625rem)',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '9999px',
              zIndex: 10
            }}>
              {imagesArray.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: index === currentImageIndex ? 'clamp(0.75rem, 2vw, 1rem)' : 'clamp(0.25rem, 1vw, 0.375rem)',
                    height: 'clamp(0.25rem, 1vw, 0.375rem)',
                    borderRadius: '50%',
                    backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>

            {/* Image Counter */}
            <div style={{
              position: 'absolute',
              top: 'clamp(0.5rem, 2vw, 0.75rem)',
              right: 'clamp(0.5rem, 2vw, 0.75rem)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: 'clamp(0.125rem, 0.5vw, 0.25rem) clamp(0.375rem, 1.5vw, 0.5rem)',
              borderRadius: '0.375rem',
              fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
              fontWeight: '500',
              zIndex: 10
            }}>
              {currentImageIndex + 1} / {imagesArray.length}
            </div>
          </>
        )}

        {/* Verified Badge */}
        {listing.isVerified && (
          <div style={{ position: 'absolute', top: 'clamp(0.5rem, 2vw, 0.75rem)', left: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', padding: 'clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)', fontSize: 'clamp(0.7rem, 2vw, 0.825rem)', fontWeight: '600', backgroundColor: 'hsl(152 60% 40%)', color: 'white', borderRadius: '9999px', gap: '0.375rem', backdropFilter: 'blur(8px)' }}>
              <Shield style={{ height: 'clamp(0.7rem, 2vw, 0.825rem)', width: 'clamp(0.7rem, 2vw, 0.825rem)' }} />
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: 'clamp(1rem, 3vw, 1.25rem)', display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
        
        {/* Title */}
        <h3 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(0.975rem, 2.5vw, 1.1rem)', fontWeight: '700', lineHeight: '1.3', margin: 0 }}>
          {listing.title}
        </h3>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.8rem, 2vw, 0.875rem)' }}>
          <MapPin style={{ height: 'clamp(0.8rem, 2vw, 0.875rem)', width: 'clamp(0.8rem, 2vw, 0.875rem)', flexShrink: 0 }} />
          {listing.area}, {listing.city}
        </div>

        {/* Features */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.75rem)', flexWrap: 'wrap', fontSize: 'clamp(0.8rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <BedDouble style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)', color: 'hsl(174 62% 36%)' }} />
            {listing.bedrooms ?? '—'} bed{listing.bedrooms === 1 ? '' : 's'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Bath style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)', color: 'hsl(174 62% 36%)' }} />
            {listing.bathrooms ?? '—'} bath{listing.bathrooms === 1 ? '' : 's'}
          </div>
          {listing.property_type && (
            <span style={{ fontWeight: '600', color: 'hsl(174 62% 32%)' }}>
              {String(listing.property_type).replace(/\b\w/g, c => c.toUpperCase())}
            </span>
          )}
        </div>

        {/* Price */}
        <div style={{ padding: 'clamp(0.625rem, 2vw, 0.75rem)', backgroundColor: 'hsl(174 62% 32% / 0.07)', border: '1px solid hsl(174 62% 32% / 0.15)', borderRadius: '0.5rem', textAlign: 'center', marginTop: 'clamp(0.25rem, 1vw, 0.5rem)' }}>
          <p style={{ fontSize: 'clamp(0.7rem, 2vw, 0.775rem)', color: 'hsl(200 15% 45%)', margin: 0, marginBottom: '0.125rem' }}>Sale Price</p>
          <p style={{ fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', fontWeight: '800', color: 'hsl(174 62% 28%)', margin: 0 }}>
            {fmt(listing.salePrice)}
          </p>
        </div>

        {/* Agent & Reviews */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'clamp(0.5rem, 2vw, 0.75rem)', borderTop: '1px solid hsl(40 20% 90%)', fontSize: 'clamp(0.8rem, 2vw, 0.875rem)' }}>
          {listing.agentName && (
            <span style={{ color: 'hsl(200 15% 45%)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {listing.agentName}
            </span>
          )}
          {listing.reviewCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto', paddingLeft: '0.5rem' }}>
              <Star style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)', color: 'hsl(38 92% 50%)', fill: 'hsl(38 92% 50%)' }} />
              <span style={{ fontWeight: '600', color: 'hsl(200 25% 15%)' }}>
                {listing.rating}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const SaleListingsPage = ({ listings: initialListingsData = {}, filters = {} }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [cityOptions, setCityOptions] = useState([{ value: "", label: "All Regions" }]);
  const [areaOptions, setAreaOptions] = useState([{ value: "", label: "All Areas" }]);

  // Initialize listings
  useEffect(() => {
    const data = initialListingsData.data || initialListingsData;
    if (data && Array.isArray(data)) {
      const formattedInitialListings = formatListings(data);
      setListings(formattedInitialListings);
      setCurrentPage(initialListingsData.current_page || 1);
      setHasMore(
        initialListingsData.has_more !== false &&
        (initialListingsData.next_page_url || initialListingsData.current_page < initialListingsData.last_page)
      );
    }

    if (filters.city) setSelectedCity(filters.city.toLowerCase());
    if (filters.area) setSelectedArea(filters.area.replace(/-/g, ' '));
  }, [initialListingsData, filters]);

  // Load cities
  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await fetch('/buy/api/cities');
        if (!response.ok) throw new Error('Failed to fetch cities');
        const data = await response.json();
        const options = [
          { value: '', label: 'All Regions' },
          ...data.cities.map((city) => ({ value: city.toLowerCase(), label: city }))
        ];
        setCityOptions(options);
      } catch (error) {
        console.error('Failed to load cities:', error);
      }
    };
    loadCities();
  }, []);

  // Load areas
  useEffect(() => {
    const loadAreas = async () => {
      try {
        const response = await fetch('/buy/api/areas');
        if (!response.ok) throw new Error('Failed to fetch areas');
        const data = await response.json();
        const options = [
          { value: '', label: 'All Areas' },
          ...data.areas.map((area) => ({ value: area.toLowerCase(), label: area }))
        ];
        setAreaOptions(options);
      } catch (error) {
        console.error('Failed to load areas:', error);
      }
    };
    loadAreas();
  }, []);

  const formatListings = (dbListings) => {
    return dbListings.map(listing => ({
      id: listing.id,
      title: listing.title || `${listing.bedrooms} Bedroom ${listing.property_type}`,
      area: listing.area || listing.location || 'Unknown',
      city: listing.city || "Accra",
      salePrice: parseFloat(listing.sale_price) || 0,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      property_type: listing.property_type,
      agentName: listing.agent_name || null,
      status: listing.status || 'pending',
      isVerified: Boolean(listing.is_verified),
      reviewCount: parseInt(listing.review_count) || 0,
      rating: parseFloat(listing.rating) || 0,
      images: listing.images || [],
      created_at: listing.created_at
    }));
  };

  const loadMoreListings = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetch(`/buy/api/more?page=${nextPage}`);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.listings && Array.isArray(data.listings) && data.listings.length > 0) {
        const formattedNewListings = formatListings(data.listings);
        setListings(prev => [...prev, ...formattedNewListings]);
        setCurrentPage(data.current_page || nextPage);
        setHasMore(data.has_more);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more listings:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" }
  ];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || listing.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesArea = !selectedArea || listing.area.toLowerCase() === selectedArea.toLowerCase();
    return matchesSearch && matchesCity && matchesArea;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.salePrice - b.salePrice;
      case "price-high":
        return b.salePrice - a.salePrice;
      case "rating":
        return b.rating - a.rating;
      case "recent":
      default:
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    }
  });

  return (
    <>
        <Head>
          <title>Houses & Property for Sale in Ghana | RentTrustGh</title>

          {/* Primary Meta */}
          <meta
              name="description"
              content="Browse verified houses, apartments, land, offices, shops, and commercial properties for sale across Ghana. Compare prices, locations, amenities, and trusted agents on RentTrustGh."
          />

          <meta
              name="keywords"
              content="houses for sale Ghana, property for sale Ghana, apartments for sale Ghana, land for sale Ghana, commercial property Ghana, offices for sale Ghana, real estate Ghana, Accra houses for sale, Kumasi property, Tema property"
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
              href="https://renttrustgh.com/buy"
          />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="RentTrustGh" />
          <meta property="og:locale" content="en_GH" />

          <meta
              property="og:title"
              content="Houses & Property for Sale in Ghana | RentTrustGh"
          />

          <meta
              property="og:description"
              content="Discover verified houses, apartments, land, offices, and commercial properties for sale throughout Ghana."
          />

          <meta
              property="og:url"
              content="https://renttrustgh.com/buy"
          />

          <meta
              property="og:image"
              content="https://renttrustgh.com/images/seo/buy-properties-og.jpg"
          />

          {/* Twitter */}
          <meta
              name="twitter:card"
              content="summary_large_image"
          />

          <meta
              name="twitter:title"
              content="Houses & Property for Sale in Ghana | RentTrustGh"
          />

          <meta
              name="twitter:description"
              content="Browse verified houses, apartments, land, offices, and commercial property listings for sale across Ghana."
          />

          <meta
              name="twitter:image"
              content="https://renttrustgh.com/images/seo/buy-properties-og.jpg"
          />

          {/* Structured Data */}
          <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "CollectionPage",
                      "name": "Properties for Sale in Ghana",
                      "url": "https://renttrustgh.com/buy",
                      "description":
                          "Browse verified houses, apartments, land, offices, shops, and commercial properties available for sale across Ghana.",
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
                              "name": "Properties for Sale",
                              "item": "https://renttrustgh.com/buy"
                          }
                      ]
                  })
              }}
          />
      </Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        h1, h2, h3, h4, h5, h6 {
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .search-grid {
            grid-template-columns: 1fr !important;
          }
          .filter-section {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        @media (max-width: 480px) {
          .filter-section {
            grid-template-columns: 1fr !important;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .listing-card {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1 }}>
          
          {/* Search & Filter Header */}
          <div style={{ backgroundColor: 'white', borderBottom: '1px solid hsl(40 20% 88%)', paddingTop: 'clamp(1.5rem, 4vw, 2rem)', paddingBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
            <div className="container mx-auto" style={{ padding: '0 clamp(0.75rem, 3vw, 1rem)' }}>
              
              {/* Heading */}
              <div style={{ marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
                <h1 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: '700', lineHeight: '1.2', margin: 0, marginBottom: '0.5rem' }}>
                  Find Properties for Sale
                </h1>
                <p style={{ color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', margin: 0 }}>
                  Browse verified listings across Ghana
                </p>
              </div>

              {/* Search Input */}
              <div style={{ marginBottom: 'clamp(1.25rem, 3vw, 1.5rem)', position: 'relative' }}>
                <SearchIcon style={{ position: 'absolute', left: 'clamp(0.75rem, 2vw, 1rem)', top: '50%', transform: 'translateY(-50%)', height: 'clamp(1.1rem, 2.5vw, 1.25rem)', width: 'clamp(1.1rem, 2.5vw, 1.25rem)', color: 'hsl(200 15% 45%)' }} />
                <input
                  type="text"
                  placeholder="Search by area, city, or property type..."
                  style={{
                    width: '100%',
                    paddingLeft: 'clamp(2.5rem, 5vw, 3rem)',
                    height: 'clamp(2.75rem, 10vw, 3.25rem)',
                    border: '1px solid hsl(40 20% 88%)',
                    borderRadius: '0.75rem',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                    outline: 'none',
                    backgroundColor: 'white',
                    color: 'hsl(200 25% 15%)',
                    transition: 'border-color 0.2s',
                    fontWeight: '500'
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'hsl(174 62% 32%)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'hsl(40 20% 88%)'}
                />
              </div>

              {/* Filters */}
              <div className="search-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                <Dropdown
                  value={selectedCity}
                  options={cityOptions}
                  onChange={setSelectedCity}
                  placeholder="All Regions"
                  label="Region"
                />

                <Dropdown
                  value={selectedArea}
                  options={areaOptions}
                  onChange={setSelectedArea}
                  placeholder="All Areas"
                  label="Area"
                />

                <Dropdown
                  value={sortBy}
                  options={sortOptions}
                  onChange={setSortBy}
                  placeholder="Sort by"
                  label="Sort"
                />

                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button
                    style={{
                      width: '100%',
                      height: 'clamp(2.5rem, 10vw, 3rem)',
                      background: 'linear-gradient(135deg, hsl(174 62% 28%), hsl(174 55% 36%))',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s',
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <SearchIcon style={{ height: 'clamp(1rem, 2.5vw, 1.1rem)', width: 'clamp(1rem, 2.5vw, 1.1rem)' }} />
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="container mx-auto" style={{ padding: 'clamp(1.5rem, 4vw, 2rem) clamp(0.75rem, 3vw, 1rem)', flex: 1 }}>
            
            {/* Results Count */}
            <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', fontWeight: '600', margin: 0 }}>
                  {sortedListings.length} {sortedListings.length === 1 ? 'Property' : 'Properties'} Available
                </p>
                {(searchQuery || selectedCity || selectedArea) && (
                  <p style={{ color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', margin: '0.25rem 0 0 0' }}>
                    Based on your filters
                  </p>
                )}
              </div>
            </div>

            {/* Listings Grid */}
            {sortedListings.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(250px, 60vw, 320px), 1fr))', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                {sortedListings.map((listing) => (
                  <Link 
                    key={listing.id} 
                    href={`/buy/${listing.id}`}
                    className="listing-card"
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <PropertyCard listing={listing} />
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 'clamp(2rem, 5vw, 4rem) 1rem' }}>
                <MapPin style={{ height: 'clamp(2.5rem, 8vw, 3.5rem)', width: 'clamp(2.5rem, 8vw, 3.5rem)', color: 'hsl(200 15% 45% / 0.4)', margin: '0 auto 1rem', display: 'block' }} />
                <h3 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1.1rem, 3vw, 1.35rem)', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                  No Properties Found
                </h3>
                <p style={{ color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.875rem, 2vw, 1rem)', margin: 0 }}>
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}

            {/* Load More Button */}
            {hasMore && sortedListings.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
                <button
                  style={{
                    padding: 'clamp(0.75rem, 2vw, 0.875rem) clamp(1.5rem, 4vw, 2rem)',
                    border: '1px solid hsl(40 20% 88%)',
                    borderRadius: '0.75rem',
                    backgroundColor: isLoading ? 'hsl(40 20% 88%)' : 'white',
                    color: isLoading ? 'hsl(200 15% 45%)' : 'hsl(174 62% 32%)',
                    fontWeight: '600',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: isLoading ? 0.6 : 1,
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                  }}
                  onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)')}
                  onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = 'white')}
                  onClick={loadMoreListings}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading Properties...' : 'Load More Properties'}
                </button>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SaleListingsPage;