import { useState } from "react";
import Header from "@/Components/Layouts/Header";
import Footer from "@/Components/Layouts/Footer";

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

const Menu = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const X = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Mock data
const mockAdmin = {
  name: "Super Admin",
  role: "Platform Administrator",
  verification_status: "verified",
  avatar_url: null,
  total_agents: 128,
  total_listings: 412,
  total_reports: 36
};

const mockAgents = [
  {
    id: "1",
    name: "John Mensah",
    email: "john.mensah@realty.com",
    company_name: "Mensah Realty Group",
    verification_status: "verified",
    total_listings: 24,
    created_at: "2023-06-15",
    last_active: "2024-01-12"
  },
  {
    id: "2",
    name: "Sarah Osei",
    email: "sarah@goldcoastproperties.com",
    company_name: "Gold Coast Properties",
    verification_status: "pending",
    total_listings: 12,
    created_at: "2024-01-05",
    last_active: "2024-01-11"
  },
  {
    id: "3",
    name: "Kwame Boateng",
    email: "kwame.b@gmail.com",
    company_name: null,
    verification_status: "unverified",
    total_listings: 3,
    created_at: "2024-01-10",
    last_active: "2024-01-10"
  }
];

const mockReports = [
  {
    id: "1",
    type: "fraudulent_listing",
    status: "pending",
    created_at: "2024-01-11",
    reporter_email: "tenant@example.com",
    description: "This listing appears to be fake. The property doesn't exist at the given address.",
    property: {
      id: "5",
      title: "Luxury Villa in East Legon",
      agent_name: "Unknown Agent"
    }
  },
  {
    id: "2",
    type: "harassment",
    status: "investigating",
    created_at: "2024-01-10",
    reporter_email: "user2@example.com",
    description: "Agent has been sending inappropriate messages after I viewed the property.",
    agent: {
      id: "7",
      name: "David Asante",
      company_name: "Asante Homes"
    }
  },
  {
    id: "3",
    type: "false_information",
    status: "resolved",
    created_at: "2024-01-08",
    reporter_email: "tenant3@example.com",
    description: "Listing claimed property had 3 bedrooms but only has 2.",
    property: {
      id: "12",
      title: "3 Bedroom House in Tema",
      agent_name: "Sarah Osei"
    }
  }
];

const mockProperties = [
  {
    id: "1",
    title: "2 Bedroom Self-Contained",
    address: "123 Oxford Street",
    city: "Accra",
    rent_min: 1500,
    rent_max: 2000,
    listing_status: "verified",
    total_reviews: 5,
    agent_name: "John Mensah"
  },
  {
    id: "2",
    title: "3 Bedroom House",
    address: "45 Ring Road",
    city: "Tema",
    rent_min: 2500,
    rent_max: 3000,
    listing_status: "pending",
    total_reviews: 2,
    agent_name: "Sarah Osei"
  }
];

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

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("agents");
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState("");

  const agent = mockAdmin;
  const agents = mockAgents;
  const properties = mockProperties;
  const reviews = mockReviews;
  const reports = mockReports;

  const handleVerifyAgent = (agentId) => {
    alert(`Agent ${agentId} has been verified`);
  };

  const handleSuspendAgent = (agentId) => {
    if (confirm("Are you sure you want to suspend this agent?")) {
      alert(`Agent ${agentId} has been suspended`);
    }
  };

  const handleReportAction = (reportId, action) => {
    alert(`Report ${reportId} marked as ${action}`);
  };

  const handleDeleteListing = (listingId) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      alert(`Listing ${listingId} has been deleted`);
    }
  };

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
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
        }
        h1, h2, h3, h4, h5, h6 {
          font-weight: 600;
          margin: 0;
        }
        p {
          margin: 0;
        }
        textarea {
          resize: vertical;
        }
        @media (min-width: 768px) {
          .md\\:flex { display: flex !important; }
          .md\\:hidden { display: none !important; }
          .md\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
        }
        .container {
          width: 100%;
          margin-left: auto;
          margin-right: auto;
        }
        .grid {
          display: grid;
        }
        .gap-4 {
          gap: 1rem;
        }
        .text-2xl {
          font-size: 1.5rem;
          line-height: 2rem;
        }
        .text-lg {
          font-size: 1.125rem;
          line-height: 1.75rem;
        }
        .font-bold {
          font-weight: 700;
        }
        .font-semibold {
          font-weight: 600;
        }
        .font-medium {
          font-weight: 500;
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1, padding: '2rem 1rem' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Profile Header */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
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
                    fontWeight: '600'
                  }}>
                    {agent.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <h1 className="text-2xl font-bold" style={{ color: 'hsl(200 25% 15%)' }}>{agent.name}</h1>
                      {getStatusBadge(agent.verification_status)}
                    </div>
                    <p style={{ color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>{agent.role}</p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'hsl(200 15% 45%)' }}>
                        <Shield style={{ height: '1rem', width: '1rem' }} />
                        {agent.total_agents} Agents
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'hsl(200 15% 45%)' }}>
                        <Home style={{ height: '1rem', width: '1rem' }} />
                        {agent.total_listings} Listings
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'hsl(200 15% 45%)' }}>
                        <AlertCircle style={{ height: '1rem', width: '1rem' }} />
                        {agent.total_reports} Reports
                      </div>
                    </div>
                  </div>
                  <button style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid hsl(40 20% 88%)',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    color: 'hsl(174 62% 32%)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    alignSelf: 'flex-start'
                  }}>
                    Settings
                  </button>
                  <button style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid hsl(0 70% 50%)',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    color: 'hsl(0 70% 50%)',
                    textDecoration: 'none',
                    fontWeight: '500',
                    cursor: 'pointer',
                    alignSelf: 'flex-start'
                  }}>
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '0.5rem',
                backgroundColor: 'hsl(40 30% 94%)',
                padding: '0.25rem',
                borderRadius: '0.5rem',
                marginBottom: '2rem'
              }}>
                {['agents', 'listings', 'reports', 'reviews'].map((tab) => (
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
                    {tab === 'agents' && <Shield style={{ height: '1rem', width: '1rem' }} />}
                    {tab === 'listings' && <Home style={{ height: '1rem', width: '1rem' }} />}
                    {tab === 'reports' && <AlertCircle style={{ height: '1rem', width: '1rem' }} />}
                    {tab === 'reviews' && <MessageSquare style={{ height: '1rem', width: '1rem' }} />}
                    {tab}
                  </button>
                ))}
              </div>

              {/* Agents Tab */}
              {activeTab === 'agents' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 className="text-lg font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>Platform Agents</h2>
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
                      Add New Agent
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                    {agents.map((agentItem) => (
                      <div key={agentItem.id} style={{
                        backgroundColor: 'white',
                        border: '1px solid hsl(40 20% 88%)',
                        borderRadius: '0.75rem',
                        padding: '1.5rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                          <div style={{ flex: 1, minWidth: '250px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                              <h3 className="font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>
                                {agentItem.name}
                              </h3>
                              {getStatusBadge(agentItem.verification_status)}
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>
                              {agentItem.email}
                            </p>
                            {agentItem.company_name && (
                              <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
                                {agentItem.company_name}
                              </p>
                            )}
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                              <span>{agentItem.total_listings} listings</span>
                              <span>Joined {new Date(agentItem.created_at).toLocaleDateString()}</span>
                              <span>Last active {new Date(agentItem.last_active).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => alert(`Viewing agent ${agentItem.id}`)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              border: '1px solid hsl(40 20% 88%)',
                              borderRadius: '0.375rem',
                              backgroundColor: 'white',
                              color: 'hsl(174 62% 32%)',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            View Details
                          </button>
                          {agentItem.verification_status === 'pending' && (
                            <button
                              onClick={() => handleVerifyAgent(agentItem.id)}
                              style={{
                                padding: '0.375rem 0.75rem',
                                background: 'linear-gradient(135deg, hsl(152 60% 40%) 0%, hsl(152 50% 35%) 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer'
                              }}
                            >
                              Verify Agent
                            </button>
                          )}
                          {agentItem.verification_status === 'unverified' && (
                            <button
                              onClick={() => handleVerifyAgent(agentItem.id)}
                              style={{
                                padding: '0.375rem 0.75rem',
                                border: '1px solid hsl(152 60% 40%)',
                                borderRadius: '0.375rem',
                                backgroundColor: 'white',
                                color: 'hsl(152 60% 40%)',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer'
                              }}
                            >
                              Verify
                            </button>
                          )}
                          <button
                            onClick={() => handleSuspendAgent(agentItem.id)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              border: '1px solid hsl(0 70% 50%)',
                              borderRadius: '0.375rem',
                              backgroundColor: 'white',
                              color: 'hsl(0 70% 50%)',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            Suspend
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Listings Tab */}
              {activeTab === 'listings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 className="text-lg font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>All Platform Listings</h2>
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
                      <Home style={{ height: '1rem', width: '1rem' }} />
                      Add New Listing
                    </button>
                  </div>

                  <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    {properties.map((property) => (
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
                            <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
                              Agent: {property.agent_name}
                            </p>
                            <p className="font-medium" style={{ fontSize: '0.875rem', color: 'hsl(174 62% 32%)' }}>
                              GH₵{property.rent_min.toLocaleString()} - GH₵{property.rent_max.toLocaleString()}
                            </p>
                          </div>
                          {getStatusBadge(property.listing_status)}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                          {property.listing_status === 'pending' && (
                            <button
                              onClick={() => alert(`Listing ${property.id} approved`)}
                              style={{
                                padding: '0.375rem 0.75rem',
                                background: 'linear-gradient(135deg, hsl(152 60% 40%) 0%, hsl(152 50% 35%) 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer'
                              }}
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteListing(property.id)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              border: '1px solid hsl(0 70% 50%)',
                              borderRadius: '0.375rem',
                              backgroundColor: 'white',
                              color: 'hsl(0 70% 50%)',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === 'reports' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h2 className="text-lg font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>Platform Reports</h2>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                    {reports.map((report) => {
                      const getReportTypeBadge = (type) => {
                        const types = {
                          fraudulent_listing: { label: 'Fraudulent Listing', color: 'hsl(0 70% 50%)' },
                          harassment: { label: 'Harassment', color: 'hsl(25 95% 53%)' },
                          false_information: { label: 'False Information', color: 'hsl(40 92% 50%)' }
                        };
                        const config = types[type] || { label: type, color: 'hsl(200 15% 45%)' };
                        return (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.625rem',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            backgroundColor: config.color,
                            color: 'white',
                            borderRadius: '9999px'
                          }}>
                            {config.label}
                          </span>
                        );
                      };

                      const getReportStatusBadge = (status) => {
                        const statuses = {
                          pending: { label: 'Pending', bg: 'hsl(40 30% 94%)', color: 'hsl(200 25% 15%)', border: 'hsl(40 20% 88%)' },
                          investigating: { label: 'Investigating', bg: 'hsl(214 100% 95%)', color: 'hsl(214 100% 40%)', border: 'hsl(214 100% 80%)' },
                          resolved: { label: 'Resolved', bg: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', border: 'hsl(152 60% 80%)' }
                        };
                        const config = statuses[status] || statuses.pending;
                        return (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.625rem',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            backgroundColor: config.bg,
                            color: config.color,
                            borderRadius: '9999px',
                            border: `1px solid ${config.border}`
                          }}>
                            {config.label}
                          </span>
                        );
                      };

                      return (
                        <div key={report.id} style={{
                          backgroundColor: 'white',
                          border: '1px solid hsl(40 20% 88%)',
                          borderRadius: '0.75rem',
                          padding: '1.5rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                                {getReportTypeBadge(report.type)}
                                {getReportStatusBadge(report.status)}
                              </div>
                              <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>
                                Reported by: {report.reporter_email}
                              </p>
                              <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                                {new Date(report.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <p style={{ color: 'hsl(200 25% 15%)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                            {report.description}
                          </p>

                          {report.property && (
                            <div style={{
                              backgroundColor: 'hsl(40 30% 94%)',
                              padding: '0.75rem',
                              borderRadius: '0.5rem',
                              marginBottom: '1rem'
                            }}>
                              <p style={{ fontSize: '0.75rem', fontWeight: '500', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>
                                Related Property
                              </p>
                              <p style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                                {report.property.title}
                              </p>
                              <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                                Agent: {report.property.agent_name}
                              </p>
                            </div>
                          )}

                          {report.agent && (
                            <div style={{
                              backgroundColor: 'hsl(40 30% 94%)',
                              padding: '0.75rem',
                              borderRadius: '0.5rem',
                              marginBottom: '1rem'
                            }}>
                              <p style={{ fontSize: '0.75rem', fontWeight: '500', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>
                                Related Agent
                              </p>
                              <p style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                                {report.agent.name}
                              </p>
                              {report.agent.company_name && (
                                <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                                  {report.agent.company_name}
                                </p>
                              )}
                            </div>
                          )}

                          {report.status !== 'resolved' && (
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <button
                                onClick={() => handleReportAction(report.id, 'investigating')}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  background: 'linear-gradient(135deg, hsl(214 100% 40%) 0%, hsl(214 100% 35%) 100%)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  cursor: 'pointer'
                                }}
                              >
                                Mark as Investigating
                              </button>
                              <button
                                onClick={() => handleReportAction(report.id, 'resolved')}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  background: 'linear-gradient(135deg, hsl(152 60% 40%) 0%, hsl(152 50% 35%) 100%)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  cursor: 'pointer'
                                }}
                              >
                                Resolve Report
                              </button>
                              <button
                                onClick={() => alert(`Viewing details for report ${report.id}`)}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  border: '1px solid hsl(40 20% 88%)',
                                  borderRadius: '0.375rem',
                                  backgroundColor: 'white',
                                  color: 'hsl(174 62% 32%)',
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  cursor: 'pointer'
                                }}
                              >
                                View Details
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                  <h2 className="text-lg font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>All Platform Reviews</h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {reviews.map((review) => (
                      <div key={review.id} style={{
                        backgroundColor: 'white',
                        border: '1px solid hsl(40 20% 88%)',
                        borderRadius: '0.75rem',
                        padding: '1rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
                              Review for Property
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
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

                        {review.agent_response && (
                          <div style={{
                            backgroundColor: 'hsl(40 30% 94%)',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            marginBottom: '0.5rem'
                          }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '500', color: 'hsl(174 62% 32%)', marginBottom: '0.25rem' }}>
                              Agent Response
                            </p>
                            <p style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>{review.agent_response}</p>
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => alert(`Viewing review ${review.id}`)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              border: '1px solid hsl(40 20% 88%)',
                              borderRadius: '0.375rem',
                              backgroundColor: 'white',
                              color: 'hsl(174 62% 32%)',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            View Full Review
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this review?")) {
                                alert(`Review ${review.id} deleted`);
                              }
                            }}
                            style={{
                              padding: '0.375rem 0.75rem',
                              border: '1px solid hsl(0 70% 50%)',
                              borderRadius: '0.375rem',
                              backgroundColor: 'white',
                              color: 'hsl(0 70% 50%)',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            Delete Review
                          </button>
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
      </div>
    </>
  );
};

export default SuperAdminDashboard;