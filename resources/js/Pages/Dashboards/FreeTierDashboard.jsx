import { useState } from "react";
import { Link, useForm, usePage, router } from "@inertiajs/react";
import Header from "@/Components/Layouts/Header";
import Footer from "@/Components/Layouts/Footer";
import AddRentalPage from "@/Components/Modules/AddRentals";
import ViewRentals from "@/Components/Modules/ViewRental";

// Icon components
const Home = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const Star = ({ style }) => (
  <svg style={style} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const MessageSquare = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const CheckCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Clock = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Settings = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Lock = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const Zap = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const Eye = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const CreditCard = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const BarChart = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const AgentFreeDashboard = ({ agentData, rentals = [], reviews = [] }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
  const { auth } = usePage().props;

  // Free tier limits
  const LISTING_LIMIT = 3;
  const INQUIRY_LIMIT = 10;
  const PHOTO_LIMIT = 5;

  const agent = {
    name: agentData?.name || "Unknown Agent",
    company: agentData?.company || null,
    status: agentData?.status || "unverified",
    plan: agentData?.plan || "free",
    average_rating: 4.7,
  };

  const properties = rentals && rentals.length > 0
    ? rentals.map(rental => ({
      id: rental.id,
      title: rental.title || "Unknown",
      address: rental.address || "Unknown Address",
      city: rental.city || "Unknown City",
      rent_min: rental.rent_min || 0,
      rent_max: rental.rent_max || 0,
      listing_status: rental.status || "unverified",
      views: Math.floor(Math.random() * 100), // Mock data
      inquiries: Math.floor(Math.random() * 10),
    }))
    : [];

  const activeListings = properties.length;
  const monthlyInquiries = 6; // Mock
  const listingsFull = activeListings >= LISTING_LIMIT;
  const inquiriesFull = monthlyInquiries >= INQUIRY_LIMIT;

  const formattedReviews = reviews && reviews.length > 0
    ? reviews.map(review => ({
      id: review.id,
      rental_id: review.rental_id || "Unknown",
      overall_rating: review.overall_rating || 0,
      landlord_responsive: review.landlord_responsive || 0,
      property_matched_description: review.property_matched_description || 0,
      fair_pricing: review.fair_pricing || 0,
      good_communication: review.good_communication || 0,
      comments: review.comments || null,
      full_name: review.full_name || "Anonymous",
      response: review.response || null,
      response_person: review.response_person || null,
      created_at: review.created_at || new Date().toISOString()
    }))
    : [];

  const calculateAverageRating = () => {
    if (!formattedReviews || formattedReviews.length === 0) return 4.7;
    const sum = formattedReviews.reduce((acc, review) => acc + (review.overall_rating || 0), 0);
    return (sum / formattedReviews.length).toFixed(1);
  };

  const getStatusBadge = (status) => {
    if (status === "verified") {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: 'clamp(0.25rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)',
          fontSize: 'clamp(0.75rem, 2vw, 0.75rem)',
          fontWeight: '500',
          backgroundColor: 'hsl(152 60% 40%)',
          color: 'white',
          borderRadius: '9999px',
          gap: 'clamp(0.25rem, 1vw, 0.25rem)'
        }}>
          <CheckCircle style={{ height: 'clamp(0.75rem, 2vw, 0.75rem)', width: 'clamp(0.75rem, 2vw, 0.75rem)' }} />
          Verified
        </span>
      );
    } else if (status === "pending") {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: 'clamp(0.25rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)',
          fontSize: 'clamp(0.75rem, 2vw, 0.75rem)',
          fontWeight: '500',
          backgroundColor: 'hsl(40 30% 94%)',
          color: 'hsl(200 25% 15%)',
          borderRadius: '9999px',
          gap: 'clamp(0.25rem, 1vw, 0.25rem)',
          border: '1px solid hsl(40 20% 88%)'
        }}>
          <Clock style={{ height: 'clamp(0.75rem, 2vw, 0.75rem)', width: 'clamp(0.75rem, 2vw, 0.75rem)' }} />
          Pending
        </span>
      );
    } else {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: 'clamp(0.25rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)',
          fontSize: 'clamp(0.75rem, 2vw, 0.75rem)',
          fontWeight: '500',
          backgroundColor: 'white',
          color: 'hsl(200 15% 45%)',
          borderRadius: '9999px',
          gap: 'clamp(0.25rem, 1vw, 0.25rem)',
          border: '1px solid hsl(40 20% 88%)'
        }}>
          <AlertCircle style={{ height: 'clamp(0.75rem, 2vw, 0.75rem)', width: 'clamp(0.75rem, 2vw, 0.75rem)' }} />
          Unverified
        </span>
      );
    }
  };

  const renderStars = (rating) => {
    const ratingValue = Math.floor(rating || 0);
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        style={{
          height: 'clamp(0.875rem, 2.5vw, 1rem)',
          width: 'clamp(0.875rem, 2.5vw, 1rem)',
          color: i < ratingValue ? 'hsl(38 92% 50%)' : 'hsl(200 15% 45%)',
          fill: i < ratingValue ? 'hsl(38 92% 50%)' : 'none'
        }}
      />
    ));
  };

  const handleViewClick = (rental) => {
    const selectViewData = rentals.find(r => r.id === rental.id);
    setSelectedRental(selectViewData);
    setShowViewModal(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        h1, h2, h3, h4, h5, h6 {
          font-weight: 600;
        }

        .listing-grid {
           grid-template-columns: 1fr !important;
        }

        @media (max-width: 768px) {
          .profile-header-container {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .tabs-grid {
            grid-template-columns: 1fr !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          .listing-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        @media (min-width: 1024px) {
          .listing-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }

        @media (min-width: 769px) {
          .tabs-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }

        .action-button {
          min-height: 44px;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1, padding: 'clamp(1.5rem, 4vw, 2rem) clamp(0.75rem, 3vw, 1rem)' }}>
          <div className="container mx-auto" style={{ maxWidth: '1200px' }}>
            
            {/* Profile Header */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
              <div className="profile-header-container" style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 'clamp(1rem, 3vw, 1.5rem)'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(1rem, 3vw, 1.5rem)', flex: 1 }}>
                  <div style={{
                    width: 'clamp(3rem, 12vw, 4.5rem)',
                    height: 'clamp(3rem, 12vw, 4.5rem)',
                    borderRadius: '50%',
                    backgroundColor: 'hsl(174 62% 32% / 0.1)',
                    color: 'hsl(174 62% 32%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    {agent.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.75rem)', marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)', flexWrap: 'wrap' }}>
                      <h1 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1.125rem, 4vw, 1.5rem)', fontWeight: '700', lineHeight: '1.2' }}>
                        {agent.name}
                      </h1>
                      {getStatusBadge(agent.status)}
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.625rem',
                        backgroundColor: 'hsl(152 60% 40% / 0.15)',
                        color: 'hsl(152 60% 40%)',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'hsl(152 60% 40%)', display: 'inline-block', marginRight: '0.25rem' }} />
                        Free Plan
                      </span>
                    </div>
                    {agent.company && (
                      <p style={{ color: 'hsl(200 15% 45%)', marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                        {agent.company}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.25rem, 1vw, 0.375rem)', color: 'hsl(200 15% 45%)' }}>
                        <Home style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />
                        {activeListings} / {LISTING_LIMIT} Listings
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.25rem, 1vw, 0.375rem)', color: 'hsl(200 15% 45%)' }}>
                        <Star style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />
                        {calculateAverageRating()} ({reviews.length} reviews)
                      </div>
                    </div>
                  </div>
                </div>
                
                <Link href="/pricing" style={{
                  padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.25rem)',
                  background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                  color: 'white',
                  borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                  fontWeight: '600',
                  fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                  height: 'fit-content'
                }}>
                  <Zap style={{ height: '1rem', width: '1rem' }} />
                  Upgrade to Pro
                </Link>
              </div>

              {/* Limit Warning Banners */}
              {listingsFull && (
                <div style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: 'hsl(0 65% 51% / 0.05)',
                  border: '1px solid hsl(0 65% 51% / 0.2)',
                  borderRadius: '0.625rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}>
                  <AlertCircle style={{ width: '1.125rem', height: '1.125rem', color: 'hsl(0 65% 51%)', flexShrink: 0, marginTop: '0.125rem' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: '600', color: 'hsl(0 65% 51%)', fontSize: '0.9rem' }}>
                      🚫 You've reached your free listing limit
                    </p>
                    <p style={{ margin: '0.25rem 0 0', color: 'hsl(200 15% 45%)', fontSize: '0.8125rem' }}>
                      Upgrade to continue posting properties and attract more tenants.
                    </p>
                  </div>
                  <Link href="/pricing" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'hsl(0 65% 51%)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    flexShrink: 0,
                  }}>
                    <Zap style={{ width: '0.75rem', height: '0.75rem' }} />
                    Upgrade Now
                  </Link>
                </div>
              )}

              {inquiriesFull && (
                <div style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: 'hsl(38 92% 50% / 0.07)',
                  border: '1px solid hsl(38 92% 50% / 0.27)',
                  borderRadius: '0.625rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}>
                  <MessageSquare style={{ width: '1.125rem', height: '1.125rem', color: 'hsl(38 92% 50%)', flexShrink: 0, marginTop: '0.125rem' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: '600', color: 'hsl(38 92% 50%)', fontSize: '0.9rem' }}>
                      🎯 High Demand — Inquiry Limit Reached
                    </p>
                    <p style={{ margin: '0.25rem 0 0', color: 'hsl(200 15% 45%)', fontSize: '0.8125rem' }}>
                      You've received {INQUIRY_LIMIT} inquiries this month. Upgrade for unlimited access to leads.
                    </p>
                  </div>
                  <Link href="/pricing" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'hsl(38 92% 50%)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    flexShrink: 0,
                  }}>
                    Unlock Leads
                  </Link>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div>
              <div className="tabs-grid" style={{
                display: 'grid',
                gap: 'clamp(0.25rem, 1vw, 0.5rem)',
                backgroundColor: 'hsl(40 30% 94%)',
                padding: 'clamp(0.25rem, 1vw, 0.25rem)',
                borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                marginBottom: 'clamp(1.5rem, 4vw, 2rem)'
              }}>
                {['overview', 'listings', 'reviews', 'billing'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="action-button"
                    style={{
                      padding: 'clamp(0.5rem, 2vw, 0.5rem) clamp(0.75rem, 3vw, 1rem)',
                      border: 'none',
                      borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)',
                      backgroundColor: activeTab === tab ? 'white' : 'transparent',
                      color: activeTab === tab ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'clamp(0.25rem, 1vw, 0.5rem)',
                      transition: 'all 0.2s',
                      boxShadow: activeTab === tab ? '0 1px 2px 0 hsl(200 25% 15% / 0.05)' : 'none',
                      textTransform: 'capitalize',
                      fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {tab === 'overview' && <BarChart style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />}
                    {tab === 'listings' && <Home style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />}
                    {tab === 'reviews' && <MessageSquare style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />}
                    {tab === 'billing' && <CreditCard style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />}
                    {tab}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 4vw, 2rem)' }}>
                  
                  {/* Stats Grid */}
                  <div className="stats-grid" style={{
                    display: 'grid',
                    gap: 'clamp(0.75rem, 2vw, 1.25rem)'
                  }}>
                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.75rem',
                      padding: 'clamp(1rem, 3vw, 1.25rem)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div style={{
                          width: '2.25rem',
                          height: '2.25rem',
                          borderRadius: '0.5rem',
                          background: 'hsl(174 62% 32% / 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Home style={{ width: '1.125rem', height: '1.125rem', color: 'hsl(174 62% 32%)' }} />
                        </div>
                      </div>
                      <p style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: '700', color: 'hsl(200 25% 15%)', margin: 0, lineHeight: 1 }}>
                        {activeListings} / {LISTING_LIMIT}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: 'hsl(200 15% 45%)', margin: '0.25rem 0 0' }}>Active Listings</p>
                      <p style={{ fontSize: '0.75rem', color: activeListings >= LISTING_LIMIT ? 'hsl(0 65% 51%)' : 'hsl(200 15% 45%)', marginTop: '0.25rem', fontWeight: activeListings >= LISTING_LIMIT ? 600 : 400 }}>
                        {activeListings >= LISTING_LIMIT ? '⚠ Limit reached' : `${LISTING_LIMIT - activeListings} slots left`}
                      </p>
                    </div>

                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.75rem',
                      padding: 'clamp(1rem, 3vw, 1.25rem)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div style={{
                          width: '2.25rem',
                          height: '2.25rem',
                          borderRadius: '0.5rem',
                          background: 'hsl(174 62% 32% / 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Eye style={{ width: '1.125rem', height: '1.125rem', color: 'hsl(174 62% 32%)' }} />
                        </div>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.3rem 0.7rem',
                          background: 'hsl(38 92% 50% / 0.1)',
                          color: 'hsl(38 92% 50%)',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                        }}>
                          <Lock style={{ width: '0.75rem', height: '0.75rem' }} />
                          Pro
                        </span>
                      </div>
                      <p style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: '700', color: 'hsl(200 25% 15%)', margin: 0, lineHeight: 1 }}>
                        148
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: 'hsl(200 15% 45%)', margin: '0.25rem 0 0' }}>Views This Month</p>
                      <p style={{ fontSize: '0.75rem', color: 'hsl(38 92% 50%)', marginTop: '0.25rem', fontWeight: 600 }}>
                        🔒 Detailed breakdown
                      </p>
                    </div>

                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.75rem',
                      padding: 'clamp(1rem, 3vw, 1.25rem)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div style={{
                          width: '2.25rem',
                          height: '2.25rem',
                          borderRadius: '0.5rem',
                          background: 'hsl(174 62% 32% / 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <MessageSquare style={{ width: '1.125rem', height: '1.125rem', color: 'hsl(174 62% 32%)' }} />
                        </div>
                      </div>
                      <p style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: '700', color: 'hsl(200 25% 15%)', margin: 0, lineHeight: 1 }}>
                        {monthlyInquiries} / {INQUIRY_LIMIT}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: 'hsl(200 15% 45%)', margin: '0.25rem 0 0' }}>Inquiries</p>
                      <p style={{ fontSize: '0.75rem', color: monthlyInquiries >= INQUIRY_LIMIT ? 'hsl(0 65% 51%)' : 'hsl(200 15% 45%)', marginTop: '0.25rem', fontWeight: monthlyInquiries >= INQUIRY_LIMIT ? 600 : 400 }}>
                        {monthlyInquiries >= INQUIRY_LIMIT ? 'Limit reached' : `${INQUIRY_LIMIT - monthlyInquiries} remaining`}
                      </p>
                    </div>

                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.75rem',
                      padding: 'clamp(1rem, 3vw, 1.25rem)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div style={{
                          width: '2.25rem',
                          height: '2.25rem',
                          borderRadius: '0.5rem',
                          background: 'hsl(174 62% 32% / 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Star style={{ width: '1.125rem', height: '1.125rem', color: 'hsl(174 62% 32%)' }} />
                        </div>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.3rem 0.7rem',
                          background: 'hsl(38 92% 50% / 0.1)',
                          color: 'hsl(38 92% 50%)',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                        }}>
                          <Lock style={{ width: '0.75rem', height: '0.75rem' }} />
                          Pro
                        </span>
                      </div>
                      <p style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: '700', color: 'hsl(200 25% 15%)', margin: 0, lineHeight: 1 }}>
                        0
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: 'hsl(200 15% 45%)', margin: '0.25rem 0 0' }}>Featured Listings</p>
                      <p style={{ fontSize: '0.75rem', color: 'hsl(38 92% 50%)', marginTop: '0.25rem', fontWeight: 600 }}>
                        🔒 Upgrade required
                      </p>
                    </div>
                  </div>

                  {/* Upgrade CTA */}
                  <div style={{
                    borderRadius: '0.875rem',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 55% 22%) 100%)',
                    padding: 'clamp(1.25rem, 4vw, 2rem)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.375rem', color: 'white', fontWeight: '700', fontSize: 'clamp(1.125rem, 3vw, 1.375rem)' }}>
                          🚀 Grow Faster with Pro
                        </h3>
                        <p style={{ margin: '0 0 0.875rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                          Top agents on RentTrust use Pro. Join them and unlock unlimited listings, priority placement & full lead access.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                          {['Unlimited listings', 'Full lead access', 'Advanced analytics', 'WhatsApp automation'].map(f => (
                            <span key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem' }}>
                              <CheckCircle style={{ width: '0.875rem', height: '0.875rem', color: 'rgba(255,255,255,0.85)' }} />
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Link href="/pricing" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.875rem 1.75rem',
                        backgroundColor: 'white',
                        color: 'hsl(174 62% 32%)',
                        borderRadius: '0.625rem',
                        fontWeight: '700',
                        fontSize: '0.9375rem',
                        textDecoration: 'none',
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                      }}>
                        <Zap style={{ width: '1rem', height: '1rem' }} />
                        Upgrade – GHS 149/mo
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs would render here - keeping them simple for now */}
              {activeTab === 'listings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'clamp(0.75rem, 2vw, 1rem)'
                  }}>
                    <h2 style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(1rem, 3vw, 1.125rem)',
                      fontWeight: '600'
                    }}>
                      Your Listings
                    </h2>
                    <button
                      onClick={() => setShowAddListingModal(true)}
                      className="action-button"
                      style={{
                        padding: 'clamp(0.5rem, 2vw, 0.5rem) clamp(0.75rem, 3vw, 1rem)',
                        background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'clamp(0.25rem, 1vw, 0.5rem)',
                        fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                        whiteSpace: 'nowrap'
                      }}>
                      <Home style={{ 
                        height: 'clamp(0.875rem, 2.5vw, 1rem)', 
                        width: 'clamp(0.875rem, 2.5vw, 1rem)' 
                      }} />
                      Add Listing
                    </button>
                  </div>

                  <div className="listing-grid" style={{
                    display: 'grid',
                    gap: 'clamp(0.75rem, 2vw, 1rem)'
                  }}>
                    {properties.length > 0 ? (
                      properties.map((property) => (
                        <div key={property.id} style={{
                          backgroundColor: 'white',
                          border: '1px solid hsl(40 20% 88%)',
                          borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
                          padding: 'clamp(0.75rem, 2vw, 1rem)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'clamp(0.75rem, 2vw, 1rem)'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'start',
                            gap: 'clamp(0.5rem, 2vw, 1rem)'
                          }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h3 style={{ 
                                color: 'hsl(200 25% 15%)', 
                                marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)',
                                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                                fontWeight: '600',
                                wordBreak: 'break-word'
                              }}>
                                {property.title}
                              </h3>
                              <p style={{ 
                                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                                color: 'hsl(200 15% 45%)', 
                                marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)',
                                wordBreak: 'break-word'
                              }}>
                                {property.address}, {property.city}
                              </p>
                              <p style={{ 
                                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                                color: 'hsl(174 62% 32%)',
                                fontWeight: '500'
                              }}>
                                GH₵{Math.round(property.rent_min).toLocaleString()} - GH₵{Math.round(property.rent_max).toLocaleString()}
                              </p>
                            </div>
                            {getStatusBadge(property.listing_status)}
                          </div>
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr', 
                            gap: 'clamp(0.375rem, 1.5vw, 0.5rem)',
                            marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)'
                          }}>
                            <button
                              onClick={() => handleViewClick(property)}
                              className="action-button"
                              style={{
                                padding: 'clamp(0.375rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
                                border: '1px solid hsl(40 20% 88%)',
                                borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)',
                                backgroundColor: 'white',
                                color: 'hsl(174 62% 32%)',
                                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                fontWeight: '500',
                                cursor: 'pointer',
                                textAlign: 'center'
                              }}>
                              View
                            </button>
                            <button
                              onClick={() => handleEditClick(property)}
                              className="action-button"
                              style={{
                                padding: 'clamp(0.375rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
                                border: '1px solid hsl(40 20% 88%)',
                                borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)',
                                backgroundColor: 'white',
                                color: 'hsl(174 62% 32%)',
                                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                fontWeight: '500',
                                cursor: 'pointer',
                                textAlign: 'center'
                              }}>
                              Edit
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedRentalForVerification(property);
                              setShowVerificationModal(true);
                            }}
                            className="action-button"
                            style={{
                              width: '100%',
                              padding: 'clamp(0.375rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
                              border: '1px solid hsl(40 20% 88%)',
                              borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)',
                              backgroundColor: 'white',
                              color: 'hsl(174 62% 32%)',
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            Request Verification
                          </button>
                        </div>
                      ))
                    ) : (
                      <div style={{
                        gridColumn: '1 / -1',
                        padding: 'clamp(1.5rem, 4vw, 2rem)',
                        textAlign: 'center',
                        backgroundColor: 'white',
                        border: '1px solid hsl(40 20% 88%)',
                        borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)'
                      }}>
                        <p style={{ 
                          color: 'hsl(200 15% 45%)', 
                          marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
                          fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                        }}>
                          No listings yet. Add your first property to get started!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <p style={{ textAlign: 'center', color: 'hsl(200 15% 45%)', padding: '2rem' }}>
                    Reviews view - Connect your existing reviews component here
                  </p>
                </div>
              )}

              {activeTab === 'billing' && (
                <div>
                  <p style={{ textAlign: 'center', color: 'hsl(200 15% 45%)', padding: '2rem' }}>
                    Billing view - Connect your existing billing component here
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />

        {showAddListingModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: 'clamp(0.5rem, 2vw, 1rem)'
          }}>
            <div className="modal-content" style={{
              backgroundColor: 'white',
              borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
              maxHeight: '90vh',
              overflow: 'auto',
              maxWidth: 'clamp(90%, 95vw, 60%)',
              width: '100%',
              position: 'relative'
            }}>
              <button
                onClick={() => setShowAddListingModal(false)}
                className="action-button"
                style={{
                  position: 'sticky',
                  top: 0,
                  right: 0,
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  border: 'none',
                  background: 'transparent',
                  fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                  cursor: 'pointer',
                  color: 'hsl(200 15% 45%)',
                  float: 'right',
                  zIndex: 10
                }}
              >
                ✕
              </button>
              <AddRentalPage agentData={agentData} setShowAddListingModal={setShowAddListingModal} />
            </div>
          </div>
        )}

        {/* View Rental Modal */}
        {showViewModal && selectedRental && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: 'clamp(0.5rem, 2vw, 1rem)'
          }}>
            <div className="modal-content" style={{
              backgroundColor: 'white',
              borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
              maxHeight: '90vh',
              overflow: 'auto',
              maxWidth: 'clamp(90%, 95vw, 60%)',
              width: '100%',
              position: 'relative'
            }}>
              <button
                onClick={() => setShowViewModal(false)}
                className="action-button"
                style={{
                  position: 'sticky',
                  top: 0,
                  right: 0,
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  border: 'none',
                  background: 'transparent',
                  fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                  cursor: 'pointer',
                  color: 'hsl(200 15% 45%)',
                  float: 'right',
                  zIndex: 10
                }}
              >
                ✕
              </button>
              <ViewRentals
                rental={selectedRental}
                setShowViewModal={setShowViewModal}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AgentFreeDashboard;