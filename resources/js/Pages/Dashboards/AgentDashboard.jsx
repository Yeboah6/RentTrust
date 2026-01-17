import { useState } from "react";
import { Link } from "@inertiajs/react";
import Header from "@/Components/Layouts/Header";
import Footer from "@/Components/Layouts/Footer";
import AddRentalPage from "@/Pages/AddRentals";

// Icon components
const Shield = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

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


const mockReviews = [
  {
    id: "1",
    overall_rating: 5,
    comment: "Great landlord! Very responsive and professional.",
    agent_response: "Thank you for the positive feedback!",
    created_at: "2024-01-15",
    property_id: "1",
    is_anonymous: false
  },
  {
    id: "2",
    overall_rating: 4,
    comment: "Good experience overall, minor delays with repairs.",
    agent_response: null,
    created_at: "2024-01-10",
    property_id: "1",
    is_anonymous: true
  }
];

const mockClaims = [
  {
    id: "1",
    status: "pending",
    created_at: "2024-01-20",
    properties: {
      id: "3",
      title: "Studio Apartment",
      address: "12 Cantonments Road, Accra"
    }
  }
];

const AgentDashboardPage = ({ agentData, rentals }) => {
  const [activeTab, setActiveTab] = useState("listings");
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [showAddListingModal, setShowAddListingModal] = useState(false);

  const agent = {
    name: agentData?.fullName || "Unknown Agent",
    company: agentData?.company || null,
    verification_status: "verified",
    avatar_url: null,
    average_rating: 4.7,
    total_reviews: 24
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
        total_reviews: 0
      }))
    : [];

  const reviews = mockReviews;
  const claims = mockClaims;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        style={{
          height: '1rem',
          width: '1rem',
          color: i < rating ? 'hsl(38 92% 50%)' : 'hsl(200 15% 45%)',
          fill: i < rating ? 'hsl(38 92% 50%)' : 'none'
        }}
      />
    ));
  };

  const getStatusBadge = (status) => {
    if (status === "verified") {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.25rem 0.625rem',
          fontSize: '0.75rem',
          fontWeight: '500',
          backgroundColor: 'hsl(152 60% 40%)',
          color: 'white',
          borderRadius: '9999px',
          gap: '0.25rem'
        }}>
          <CheckCircle style={{ height: '0.75rem', width: '0.75rem' }} />
          Verified
        </span>
      );
    } else if (status === "pending") {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.25rem 0.625rem',
          fontSize: '0.75rem',
          fontWeight: '500',
          backgroundColor: 'hsl(40 30% 94%)',
          color: 'hsl(200 25% 15%)',
          borderRadius: '9999px',
          gap: '0.25rem',
          border: '1px solid hsl(40 20% 88%)'
        }}>
          <Clock style={{ height: '0.75rem', width: '0.75rem' }} />
          Pending
        </span>
      );
    } else {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.25rem 0.625rem',
          fontSize: '0.75rem',
          fontWeight: '500',
          backgroundColor: 'white',
          color: 'hsl(200 15% 45%)',
          borderRadius: '9999px',
          gap: '0.25rem',
          border: '1px solid hsl(40 20% 88%)'
        }}>
          <AlertCircle style={{ height: '0.75rem', width: '0.75rem' }} />
          Unverified
        </span>
      );
    }
  };

  const handleResponseSubmit = (reviewId) => {
    if (!responseText.trim()) return;
    alert(`Response submitted for review ${reviewId}`);
    setRespondingTo(null);
    setResponseText("");
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
        textarea {
          resize: vertical;
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1, padding: '2rem 1rem' }}>
          <div className="container mx-auto" style={{ maxWidth: '1200px' }}>
            {/* Profile Header */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="md:flex md:items-center md:gap-6">
                <div style={{
                  width: '5rem',
                  height: '5rem',
                  borderRadius: '50%',
                  backgroundColor: 'hsl(174 62% 32% / 0.1)',
                  color: 'hsl(174 62% 32%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  {agent.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <h1 className="text-2xl font-bold" style={{ color: 'hsl(200 25% 15%)' }}>{agent.name}</h1>
                    {getStatusBadge(agent.verification_status)}
                  </div>
                  {agent.company && (
                    <p style={{ color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>{agent.company}</p>
                  )}
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'hsl(200 15% 45%)' }}>
                      <Home style={{ height: '1rem', width: '1rem' }} />
                      {properties.length} {properties.length === 1 ? 'Listing' : 'Listings'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'hsl(200 15% 45%)' }}>
                      <Star style={{ height: '1rem', width: '1rem' }} />
                      {agent.average_rating} ({agent.total_reviews} reviews)
                    </div>
                  </div>
                </div>
                <Link style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid hsl(40 20% 88%)',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    color: 'hsl(174 62% 32%)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    alignSelf: 'flex-start'
                  }}
                  href={'settings'}>
                    Settings
                  </Link>
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                backgroundColor: 'hsl(40 30% 94%)',
                padding: '0.25rem',
                borderRadius: '0.5rem',
                marginBottom: '2rem'
              }}>
                {['listings', 'reviews', 'claims'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '0.375rem',
                      backgroundColor: activeTab === tab ? 'white' : 'transparent',
                      color: activeTab === tab ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s',
                      boxShadow: activeTab === tab ? '0 1px 2px 0 hsl(200 25% 15% / 0.05)' : 'none',
                      textTransform: 'capitalize'
                    }}
                  >
                    {tab === 'listings' && <Home style={{ height: '1rem', width: '1rem' }} />}
                    {tab === 'reviews' && <MessageSquare style={{ height: '1rem', width: '1rem' }} />}
                    {tab === 'claims' && <Shield style={{ height: '1rem', width: '1rem' }} />}
                    {tab}
                  </button>
                ))}
              </div>

              {/* Listings Tab */}
              {activeTab === 'listings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="text-lg font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>Your Listings</h2>
                    <button 
                      onClick={() => setShowAddListingModal(true)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                      <Shield style={{ height: '1rem', width: '1rem' }} />
                      Add Listing
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {properties.length > 0 ? (
                      properties.map((property) => (
                        <div key={property.id} style={{
                          backgroundColor: 'white',
                          border: '1px solid hsl(40 20% 88%)',
                          borderRadius: '0.75rem',
                          padding: '1rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div>
                              <h3 className="font-medium" style={{ color: 'hsl(200 25% 15%)', marginBottom: '0.25rem' }}>
                                {property.title}
                              </h3>
                              <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
                                {property.address}, {property.city}
                              </p>
                              <p className="font-medium" style={{ fontSize: '0.875rem', color: 'hsl(174 62% 32%)' }}>
                                GH₵{Math.round(property.rent_min).toLocaleString()} - GH₵{Math.round(property.rent_max).toLocaleString()}
                              </p>
                            </div>
                            {getStatusBadge(property.listing_status)}
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button style={{
                              padding: '0.375rem 0.75rem',
                              border: '1px solid hsl(40 20% 88%)',
                              borderRadius: '0.375rem',
                              backgroundColor: 'white',
                              color: 'hsl(174 62% 32%)',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}>
                              View
                            </button>
                            <button style={{
                              padding: '0.375rem 0.75rem',
                              border: '1px solid hsl(40 20% 88%)',
                              borderRadius: '0.375rem',
                              backgroundColor: 'white',
                              color: 'hsl(174 62% 32%)',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}>
                              Edit
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{
                        gridColumn: '1 / -1',
                        padding: '2rem',
                        textAlign: 'center',
                        backgroundColor: 'white',
                        border: '1px solid hsl(40 20% 88%)',
                        borderRadius: '0.75rem'
                      }}>
                        <p style={{ color: 'hsl(200 15% 45%)', marginBottom: '1rem' }}>
                          No listings yet. Add your first property to get started!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h2 className="text-lg font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>Tenant Reviews</h2>

                  <div className="grid md:grid-cols-2 gap-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {reviews.map((review) => (
                      <div key={review.id} style={{
                        backgroundColor: 'white',
                        border: '1px solid hsl(40 20% 88%)',
                        borderRadius: '0.75rem',
                        padding: '1rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <div>
                            <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
                              Review for Property
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span className="font-medium" style={{ color: 'hsl(200 25% 15%)' }}>
                                {review.is_anonymous ? 'Anonymous' : 'Verified Tenant'}
                              </span>
                              <div style={{ display: 'flex' }}>{renderStars(review.overall_rating)}</div>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {review.comment && (
                          <p style={{ color: 'hsl(200 15% 45%)', marginBottom: '1rem' }}>{review.comment}</p>
                        )}

                        {review.agent_response ? (
                          <div style={{
                            backgroundColor: 'hsl(40 30% 94%)',
                            padding: '0.75rem',
                            borderRadius: '0.5rem'
                          }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '500', color: 'hsl(174 62% 32%)', marginBottom: '0.25rem' }}>
                              Your Response
                            </p>
                            <p style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>{review.agent_response}</p>
                          </div>
                        ) : respondingTo === review.id ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <textarea
                              placeholder="Write your response..."
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              rows={3}
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid hsl(40 20% 88%)',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                outline: 'none',
                                fontFamily: 'inherit'
                              }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                onClick={() => handleResponseSubmit(review.id)}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  cursor: 'pointer'
                                }}
                              >
                                Submit Response
                              </button>
                              <button
                                onClick={() => { setRespondingTo(null); setResponseText(''); }}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  border: '1px solid hsl(40 20% 88%)',
                                  borderRadius: '0.375rem',
                                  backgroundColor: 'white',
                                  color: 'hsl(200 25% 15%)',
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  cursor: 'pointer'
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRespondingTo(review.id)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              border: '1px solid hsl(40 20% 88%)',
                              borderRadius: '0.375rem',
                              backgroundColor: 'white',
                              color: 'hsl(174 62% 32%)',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            <MessageSquare style={{ height: '1rem', width: '1rem' }} />
                            Respond
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Claims Tab */}
              {activeTab === 'claims' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="text-lg font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>Listing Claims</h2>
                    <button style={{
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Shield style={{ height: '1rem', width: '1rem' }} />
                      New Claim
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {claims.map((claim) => (
                      <div key={claim.id} style={{
                        backgroundColor: 'white',
                        border: '1px solid hsl(40 20% 88%)',
                        borderRadius: '0.75rem',
                        padding: '1rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div>
                            <p className="font-medium" style={{ color: 'hsl(200 25% 15%)', marginBottom: '0.25rem' }}>
                              {claim.properties?.title}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
                              {claim.properties?.address}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                              Submitted {new Date(claim.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {getStatusBadge(claim.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />

        {/* Add Listing Modal */}
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
            padding: '1rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              maxHeight: '90vh',
              overflow: 'auto',
              maxWidth: '60%',
              width: '100%',
              position: 'relative'
            }}>
              <button
                onClick={() => setShowAddListingModal(false)}
                style={{
                  position: 'sticky',
                  top: 0,
                  right: 0,
                  padding: '1rem',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'hsl(200 15% 45%)',
                  float: 'right',
                  zIndex: 10
                }}
              >
                ✕
              </button>
              <AddRentalPage />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AgentDashboardPage;