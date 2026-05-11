import { useState, useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import Header from "../Components/Layouts/Header";
import Footer from "../Components/Layouts/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Icon components
const Search = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MapPin = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Clock = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Star = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CheckCircle2 = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Calendar = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ChevronDown = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const Dropdown = ({ value, options, onChange, placeholder }) => {
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          height: '3rem',
          border: '1px solid hsl(40 20% 88%)',
          borderRadius: '0.75rem',
          paddingLeft: '1rem',
          paddingRight: '2.5rem',
          fontSize: '1rem',
          outline: 'none',
          backgroundColor: 'white',
          color: 'hsl(200 25% 15%)',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          transition: 'border-color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'hsl(174 62% 32%)'}
        onMouseLeave={(e) => !isOpen && (e.currentTarget.style.borderColor = 'hsl(40 20% 88%)')}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <ChevronDown 
          style={{ 
            position: 'absolute',
            right: '0.75rem',
            height: '1.25rem',
            width: '1.25rem',
            color: 'hsl(200 15% 45%)',
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
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
            boxShadow: '0 8px 20px -4px hsl(200 25% 15% / 0.12)',
            zIndex: 50,
            overflow: 'hidden'
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
                padding: '0.75rem 1rem',
                border: 'none',
                backgroundColor: option.value === value ? 'hsl(38 92% 50%)' : 'white',
                color: option.value === value ? 'white' : 'hsl(200 25% 15%)',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: option.value === value ? '500' : '400',
                transition: 'background-color 0.15s',
                borderTop: index > 0 ? '1px solid hsl(40 20% 92%)' : 'none',
                borderRadius: '10px'
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

// Parse images from database (handles both string and array formats)
const parseImages = (imagesData) => {
  if (!imagesData) return [];
  
  try {
    // If it's already an array, return it
    if (Array.isArray(imagesData)) return imagesData;
    
    // If it's a string, parse it as JSON
    if (typeof imagesData === 'string') {
      const parsed = JSON.parse(imagesData);
      return Array.isArray(parsed) ? parsed : [];
    }
    
    return [];
  } catch (e) {
    console.error('Error parsing images:', e);
    return [];
  }
};

const getStatusBadge = (status) => {
  const normalized = String(status || 'pending').toLowerCase();

  const meta = {
    approved: {
      label: 'Approved',
      bg: 'hsl(174 62% 32% / 0.1)',
      color: 'hsl(174 62% 32%)',
      icon: 'check',
    },
    pending: {
      label: 'Pending',
      bg: '#efece7',
      color: '#627884',
      icon: 'clock',
    },
    rejected: {
      label: 'Rejected',
      bg: 'hsl(0 65% 51% / 0.1)',
      color: 'hsl(0 65% 51%)',
      icon: 'clock',
    },
  };

  return meta[normalized] || {
    label: String(status || 'Unknown').replace(/^(.)/, (m) => m.toUpperCase()),
    bg: 'hsl(40 20% 88%)',
    color: 'hsl(200 15% 45%)',
    icon: 'clock',
  };
};

const PropertyCard = ({ listing }) => {
  <style dangerouslySetInnerHTML={{__html: `
    @media (max-width: 768px) {
      .property-card-content { display: flex; flex-direction: column; }
      .details-section { order: 1; }
      .reviews-section { order: 2; }
      .agent-section { order: 3; }
    }
    @media (min-width: 769px) {
      .property-card-content { display: block; }
    }
  `}} />
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Parse images from listing
  const imagesArray = parseImages(listing.images);

  const handlePrevImage = (e) => {
    e.stopPropagation(); // Prevent card click when clicking arrow
    setCurrentImageIndex((prev) => 
      prev === 0 ? imagesArray.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation(); // Prevent card click when clicking arrow
    setCurrentImageIndex((prev) => 
      prev === imagesArray.length - 1 ? 0 : prev + 1
    );
  };

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
    >
      {/* Image Carousel Section */}
      <div style={{ 
        height: '12rem',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'hsl(174 62% 32% / 0.05)'
      }}>
        {/* Image */}
        {imagesArray.length > 0 ? (
          <img 
            src={`/storage/rental_images/${imagesArray[currentImageIndex]}`}
            alt={`${listing.title || 'Property'} image ${currentImageIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'transform 0.3s ease-in-out',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
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
            <MapPin style={{ height: '3rem', width: '3rem', color: 'hsl(200 25% 15% / 0.2)' }} />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              No image available
            </div>
          </div>
        )}

        {/* Carousel Controls - Only show if there are multiple images */}
        {imagesArray.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={handlePrevImage}
              style={{
                position: 'absolute',
                left: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '2rem',
                height: '2rem',
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

            {/* Next Button */}
            <button
              onClick={handleNextImage}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '2rem',
                height: '2rem',
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
              bottom: '0.75rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '0.375rem',
              padding: '0.375rem 0.625rem',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '9999px',
              zIndex: 10
            }}>
              {imagesArray.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '0.375rem',
                    height: '0.375rem',
                    borderRadius: '50%',
                    backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>

            {/* Image Counter Badge */}
            <div style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              zIndex: 10
            }}>
              {currentImageIndex + 1} / {imagesArray.length}
            </div>
          </>
        )}
      </div>

      {/* Card Content Section */}
      <div className="p-4 property-card-content">
        {/* Status badge - only show for verified/approved listings */}
        {(listing.status === "available" || listing.status === "approved" || listing.status === "verified") && (
          <div style={{ marginBottom: '0.75rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.625rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                borderRadius: '9999px',
                backgroundColor: 'hsl(174 62% 32% / 0.1)',
                color: '#1f847a'
              }}
            >
              <CheckCircle2 style={{ height: '0.75rem', width: '0.75rem' }} />
              {listing.status === "available" || listing.status === "approved" || listing.status === "verified" ? "Verified" : listing.status}
            </span>
          </div>
        )}

        <h3 className="font-semibold tracking-tight mb-1" style={{ color: 'hsl(200 25% 15%)', fontSize: '1.125rem' }}>
          {listing.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
          <MapPin style={{ height: '0.875rem', width: '0.875rem', color: 'hsl(200 15% 45%)' }} />
          <span style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
            {listing.area}, {listing.city}
          </span>
        </div>

        <div className="details-section" style={{ marginBottom: '0.75rem' }}>
          <div className="font-bold" style={{ color: 'hsl(174 62% 32%)', fontSize: '1.25rem' }}>
            GH₵{listing.salePrice.toLocaleString()}
          </div>
        </div>

        {listing.agentName && (
          <div className="agent-section" style={{ 
            paddingTop: '0.75rem', 
            borderTop: '1px solid hsl(40 20% 88%)',
            marginBottom: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                {listing.agentName}
              </span>
              {listing.status === "verified" && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.125rem 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: 'hsl(152 60% 40% / 0.1)',
                    color: 'hsl(152 60% 40%)',
                    borderRadius: '9999px'
                  }}
                >
                  <CheckCircle2 style={{ height: '0.75rem', width: '0.75rem', marginRight: '0.25rem' }} />
                  Verified
                </span>
              )}
            </div>
          </div>
        )}

        {listing.reviewCount > 0 && (
          <div className="reviews-section" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star style={{ height: '1rem', width: '1rem', color: 'hsl(38 92% 50%)', fill: 'hsl(38 92% 50%)' }} />
              <span style={{ fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                {listing.rating}
              </span>
            </div>
            <span style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
              ({listing.reviewCount} {listing.reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const SaleListingsPage = ({ listings: initialListingsData = {}, filters = {} }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize listings and filters on component mount
  useEffect(() => {
    // Handle different response formats
    const data = initialListingsData.data || initialListingsData;
    
    if (data && Array.isArray(data)) {
      const formattedInitialListings = formatListings(data);
      setListings(formattedInitialListings);
      
      // Set current page from initial response
      if (initialListingsData.current_page) {
        setCurrentPage(initialListingsData.current_page);
      }
      
      // Check if there are more items (Laravel uses has_more or next_page_url)
      setHasMore(
        initialListingsData.has_more !== false &&
        (initialListingsData.next_page_url || initialListingsData.current_page < initialListingsData.last_page)
      );
    }

    // apply filters passed from server
    if (filters.city) {
      setSelectedCity(filters.city);
    }
    if (filters.area) {
      setSelectedArea(filters.area.replace(/-/g, ' '));
    }
  }, [initialListingsData, filters]);


  const formatListings = (dbListings) => {
    return dbListings.map(listing => ({
      id: listing.id,
      title: listing.title || `${listing.bedrooms} Bedroom ${listing.property_type}`,
      area: listing.area || listing.location,
      city: listing.city || "Accra",
      salePrice: parseFloat(listing.sale_price) || 0,
      advanceDuration: parseInt(listing.advance_duration) || 1,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      property_type: listing.property_type,
      agentName: listing.agent_name || null,
      status: listing.status || 'pending',
      isVerified: Boolean(listing.is_verified),
      isClaimed: Boolean(listing.is_verified), 
      reviewCount: parseInt(listing.review_count) || 0,
      rating: parseFloat(listing.rating) || 0,
      images: listing.images || [],
      amenities: listing.amenities || [],
      description: listing.description || '',
      created_at: listing.created_at
    }));
  };

  const loadMoreListings = async () => {
    // Prevent duplicate requests
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      // Compute next page number
      const nextPage = currentPage + 1;
      const url = `/buy/api/more?page=${nextPage}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Debug logging (remove in production)
      console.log('Loaded listings:', {
        count: data.listings?.length,
        has_more: data.has_more,
        last_id: data.last_id,
        current_total: listings.length
      });
      
      if (data.listings && Array.isArray(data.listings) && data.listings.length > 0) {
        const formattedNewListings = formatListings(data.listings);
        
        // Check for duplicates (development only)
        const existingIds = new Set(listings.map(l => l.id));
        const duplicates = formattedNewListings.filter(l => existingIds.has(l.id));
        
        if (duplicates.length > 0) {
          console.warn('⚠️ Duplicate listings detected:', duplicates.map(d => d.id));
        }
        
        // Add new listings
        setListings(prev => [...prev, ...formattedNewListings]);
        
        // Update current page and hasMore
        setCurrentPage(data.current_page || nextPage);
        setHasMore(data.has_more);
      } else {
        // No more listings available
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more listings:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const cityOptions = [
    { value: "", label: "All Cities" },
    { value: "accra", label: "Accra" },
    { value: "kumasi", label: "Kumasi" },
    { value: "tema", label: "Tema" },
    { value: "tamale", label: "Tamale" }
  ];

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
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1 }}>
          {/* Search Header */}
          <div style={{ backgroundColor: 'hsl(0 0% 100%)', borderBottom: '1px solid hsl(40 20% 88%)', padding: '1.5rem 0' }}>
            <div className="container mx-auto px-4">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4" style={{ color: 'hsl(200 25% 15%)' }}>
                Find Properties for Sale in Ghana
              </h1>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  {/* Search Input */}
                  <div style={{ position: 'relative', gridColumn: 'span 2' }}>
                    <MapPin 
                      style={{ 
                        position: 'absolute', 
                        left: '0.75rem', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        height: '1.25rem', 
                        width: '1.25rem', 
                        color: 'hsl(200 15% 45%)' 
                      }} 
                    />
                    <input
                      type="text"
                      placeholder="Search by area or city..."
                      style={{
                        width: '100%',
                        paddingLeft: '2.5rem',
                        height: '3rem',
                        border: '1px solid hsl(40 20% 88%)',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        outline: 'none',
                        backgroundColor: 'white',
                        color: 'hsl(200 25% 15%)'
                      }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'hsl(174 62% 32%)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'hsl(40 20% 88%)'}
                    />
                  </div>

                  {/* City Dropdown */}
                  <Dropdown
                    value={selectedCity}
                    options={cityOptions}
                    onChange={setSelectedCity}
                    placeholder="All Cities"
                  />

                  {/* Sort By Dropdown */}
                  <Dropdown
                    value={sortBy}
                    options={sortOptions}
                    onChange={setSortBy}
                    placeholder="Sort by"
                  />

                  {/* Search Button */}
                  <button
                    style={{
                      height: '3rem',
                      background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    onClick={() => console.log('Search clicked')}
                  >
                    <Search style={{ height: '1.25rem', width: '1.25rem' }} />
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="container mx-auto px-4 py-8">
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ color: 'hsl(200 15% 45%)' }}>
                Showing <span className="font-medium" style={{ color: 'hsl(200 25% 15%)' }}>{sortedListings.length}</span> properties
              </p>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {sortedListings.map((listing) => (
                <Link 
                  key={listing.id} 
                  href={`/buy/${listing.id}`}
                  className="block transition-transform hover:scale-[1.02]"
                >
                  <PropertyCard listing={listing} />
                </Link>
              ))}
            </div>

            {sortedListings.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <MapPin style={{ height: '3rem', width: '3rem', color: 'hsl(200 15% 45% / 0.5)', margin: '0 auto 1rem' }} />
                <h3 className="text-lg font-semibold tracking-tight" style={{ color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
                  No properties found
                </h3>
                <p style={{ color: 'hsl(200 15% 45%)' }}>Try adjusting your search criteria</p>
              </div>
            )}

            {/* Load More */}
            {hasMore && sortedListings.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                  style={{
                    padding: '0.75rem 2rem',
                    border: '1px solid hsl(40 20% 88%)',
                    borderRadius: '0.75rem',
                    backgroundColor: isLoading ? 'hsl(40 20% 88%)' : 'white',
                    color: isLoading ? 'hsl(200 15% 45%)' : 'hsl(174 62% 32%)',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)')}
                  onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = 'white')}
                  onClick={loadMoreListings}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Load More Properties'}
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