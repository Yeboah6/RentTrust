import { useState } from "react";
import Header from "@/Components/Layouts/Header";
import Footer from "@/Components/Layouts/Footer";
import { Link, useForm, router } from "@inertiajs/react";
import VerifyAgentDialog from '../VerifyAgent';
import ViewRentals from "../ViewRental";
import { MapPin} from 'lucide-react';

// Icon components
const Shield = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Flag = ({ style }) => (
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

const SuperAdminDashboard = ({ adminData, rentals, agentData, reviews, reports }) => {
  const [activeTab, setActiveTab] = useState("agents");
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const { put, data, setData, processing } = useForm({
    status: ''
  });

  const mockAdmin = {
    name: adminData?.fullName || "Super Admin",
    role: "Platform Administrator",
    verification_status: "verified",
    avatar_url: null,
    total_agents: agentData?.length,
    total_listings: rentals?.length,
    total_reports: reports?.length
  };

  const agent = mockAdmin;
  const agents = agentData || [];
  const properties = rentals || [];


  const handleVerifyClick = (agentId) => {
    const verifyAgent = agents.find(a => a.id === agentId);
    setSelectedAgent(verifyAgent);
    setShowDialog(true);
  };

  const handleViewClick = (rental) => {
    const selectViewData = rentals.find(r => r.id === rental.id);
    setSelectedRental(selectViewData);
    setShowViewModal(true);
    // console.log("View Data:", selectViewData);
  };

const handleSuspendAgent = (agentId) => {
  const agent = agents.find(a => a.id === agentId);

  if (!agent) {
    showToast("Error", "Agent not found.", "error");
    return;
  }

  const isSuspended = agent.status === 'suspended';
  const newStatus = isSuspended ? 'unverified' : 'suspended';
  const actionText = isSuspended ? 'unsuspend' : 'suspend';

  if (confirm(`Are you sure you want to ${actionText} ${agent.fullName}?`)) {
    router.put(`/admin/agents/${agentId}/suspend`, {
      status: newStatus
    }, {
      onSuccess: () => {
        showToast(
          isSuspended ? "Agent Unsuspended" : "Agent Suspended",
          `${agent.fullName} has been ${actionText}ed successfully.`,
          "success"
        );
      },
      onError: (errors) => {
        console.error('Suspension error:', errors);
        showToast("Suspension Failed", `Unable to ${actionText} agent. Please try again.`, "error");
      }
    });
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
          backgroundColor: '#d92626',
          color: 'white',
          borderRadius: '9999px',
          gap: '0.25rem',
          border: '1px solid hsl(40 20% 88%)'
        }}>
          <AlertCircle style={{ height: '0.75rem', width: '0.75rem' }} />
          Suspended
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
                        {reports.length} Reports 
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'hsl(200 15% 45%)' }}>
                        <MessageSquare style={{ height: '1rem', width: '1rem' }} />
                        {reviews.length} Reviews
                      </div>
                    </div>
                  </div>
                  <Link 
                  href="/settings"
                  style={{
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
                  </Link>
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
                    <Link
                    href="/become-agent"
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
                      <Home style={{ height: '1rem', width: '1rem' }} />
                      Add New Agent
                    </Link>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4" style={{ gap: '1rem' }}>
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
                                {agentItem.fullName}
                              </h3>
                              {getStatusBadge(agentItem.status)}
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>
                              {agentItem.email}
                            </p>
                            {agentItem.company && (
                              <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
                                {agentItem.company}
                              </p>
                            )}
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                              <span>{agentItem.total_listings} listings</span>
                              <span>Joined {new Date(agentItem.created_at).toLocaleDateString()}</span>
                              <span>Last active {new Date(agentItem.updated_at).toLocaleDateString()}</span>
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
                          {agentItem.status === 'unverified' && (
                            <button
                              onClick={() => handleVerifyClick(agentItem.id)}
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
                          <button
                            onClick={() => handleSuspendAgent(agentItem.id)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #d92626',
                              borderRadius: '0.375rem',
                              backgroundColor: 'white',
                              color: '#d92626',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(0 70% 95%)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                          >
                          {agentItem.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
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
                          {getStatusBadge(property.status)}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                           onClick={() => handleViewClick(property)}
                            style={{
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
                          {property.status === 'pending' && (
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 className="text-lg font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>
                      Platform Reports ({reports.length})
                    </h2>
                  </div>

                  {reports.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-4" style={{ display: 'grid', flexDirection: 'column', gap: '1rem' }}>
                      {reports.map((report) => {
                        const getReportTypeBadge = (type) => {
                          const types = {
                            'Fraudulent agent/landlord': { label: 'Fraudulent Agent/Landlord', color: 'hsl(0 70% 50%)' },
                            'Fraudulent listing': { label: 'Fraudulent Listing', color: 'hsl(0 70% 50%)' },
                            'Harassment': { label: 'Harassment', color: 'hsl(25 95% 53%)' },
                            'False information': { label: 'False Information', color: 'hsl(40 92% 50%)' },
                            'Scam': { label: 'Scam', color: 'hsl(0 84% 60%)' },
                            'Other': { label: 'Other', color: 'hsl(200 15% 45%)' }
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
                            resolved: { label: 'Resolved', bg: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', border: 'hsl(152 60% 80%)' },
                            dismissed: { label: 'Dismissed', bg: 'hsl(0 0% 95%)', color: 'hsl(0 0% 45%)', border: 'hsl(0 0% 80%)' }
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
                      
                        // Parse evidence if it's a JSON string
                        const evidence = typeof report.evidence === 'string' 
                          ? JSON.parse(report.evidence) 
                          : (report.evidence || []);
                      
                        return (
                          <div key={report.id} style={{
                            backgroundColor: 'white',
                            border: '1px solid hsl(40 20% 88%)',
                            borderRadius: '0.75rem',
                            padding: '1.5rem'
                          }}>
                            {/* Header Section */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                                  {getReportTypeBadge(report.report_type)}
                                  {getReportStatusBadge(report.status || 'pending')}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                  <div style={{
                                    width: '2rem',
                                    height: '2rem',
                                    borderRadius: '50%',
                                    backgroundColor: 'hsl(0 70% 50% / 0.1)',
                                    color: 'hsl(0 70% 50%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.875rem',
                                    fontWeight: '600'
                                  }}>
                                    {report.full_name?.[0] || 'R'}
                                  </div>
                                  <div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)' }}>
                                      Reported by: {report.full_name || 'Anonymous'}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                                      {new Date(report.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                                    
                            {/* Report Description */}
                            <div style={{
                              backgroundColor: 'hsl(40 30% 97%)',
                              padding: '1rem',
                              borderRadius: '0.5rem',
                              marginBottom: '1rem',
                              borderLeft: '3px solid hsl(0 70% 50% / 0.3)'
                            }}>
                              <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
                                Report Description
                              </p>
                              <p style={{ color: 'hsl(200 25% 15%)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                                {report.report_description || 'No description provided'}
                              </p>
                            </div>
                          
                            {/* Related Property */}
                            {report.rental && (
                              <div style={{
                                backgroundColor: 'hsl(174 62% 32% / 0.05)',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                marginBottom: '1rem',
                                border: '1px solid hsl(174 62% 32% / 0.2)'
                              }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(174 62% 32%)', marginBottom: '0.5rem' }}>
                                  Related Property
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', flexWrap: 'wrap' }}>
                                  <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.25rem' }}>
                                      {report.rental.title || 'Untitled Property'}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>
                                      <MapPin style={{ height: '0.75rem', width: '0.75rem', display: 'inline', marginRight: '0.25rem' }} />
                                      {report.rental.address}, {report.rental.city}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                                      Property ID: #{report.rental_id}
                                    </p>
                                    {report.rental.agent && (
                                      <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginTop: '0.25rem' }}>
                                        Agent: {report.rental.agent.fullName || 'Unknown'}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleViewClick(report.rental)}
                                    style={{
                                      padding: '0.375rem 0.75rem',
                                      border: '1px solid hsl(174 62% 32%)',
                                      borderRadius: '0.375rem',
                                      backgroundColor: 'white',
                                      color: 'hsl(174 62% 32%)',
                                      fontSize: '0.75rem',
                                      fontWeight: '500',
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap',
                                      transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                  >
                                    View Property
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Evidence Section */}
                            {evidence.length > 0 && (
                              <div style={{
                                backgroundColor: 'hsl(40 30% 97%)',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                marginBottom: '1rem'
                              }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
                                  Evidence Attached ({evidence.length})
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                  {evidence.map((item, index) => (
                                    <span key={index} style={{
                                      padding: '0.25rem 0.625rem',
                                      fontSize: '0.75rem',
                                      backgroundColor: 'white',
                                      color: 'hsl(200 25% 15%)',
                                      borderRadius: '0.375rem',
                                      border: '1px solid hsl(40 20% 88%)'
                                    }}>
                                      📎 {item.name || `Evidence ${index + 1}`}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            {(!report.status || report.status !== 'resolved') && (
                              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <button
                                  onClick={() => {
                                    router.put(`/admin/reports/${report.id}/status`, {
                                      status: 'investigating'
                                    }, {
                                      onSuccess: () => {
                                        showToast("Status Updated", "Report marked as investigating.", "success");
                                      }
                                    });
                                  }}
                                  style={{
                                    padding: '0.375rem 0.75rem',
                                    background: 'linear-gradient(135deg, hsl(214 100% 40%) 0%, hsl(214 100% 35%) 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                  Mark as Investigating
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm("Are you sure you want to resolve this report?")) {
                                      router.put(`/admin/reports/${report.id}/status`, {
                                        status: 'resolved'
                                      }, {
                                        onSuccess: () => {
                                          showToast("Report Resolved", "The report has been marked as resolved.", "success");
                                        }
                                      });
                                    }
                                  }}
                                  style={{
                                    padding: '0.375rem 0.75rem',
                                    background: 'linear-gradient(135deg, hsl(152 60% 40%) 0%, hsl(152 50% 35%) 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                  Resolve Report
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm("Are you sure you want to dismiss this report?")) {
                                      router.put(`/admin/reports/${report.id}/status`, {
                                        status: 'dismissed'
                                      }, {
                                        onSuccess: () => {
                                          showToast("Report Dismissed", "The report has been dismissed.", "success");
                                        }
                                      });
                                    }
                                  }}
                                  style={{
                                    padding: '0.375rem 0.75rem',
                                    border: '1px solid hsl(0 0% 70%)',
                                    borderRadius: '0.375rem',
                                    backgroundColor: 'white',
                                    color: 'hsl(0 0% 45%)',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'hsl(0 0% 95%)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                  }}
                                >
                                  Dismiss Report
                                </button>
                              </div>
                            )}

                            {/* Resolved Status Message */}
                            {report.status === 'resolved' && (
                              <div style={{
                                padding: '0.75rem',
                                backgroundColor: 'hsl(152 60% 95%)',
                                border: '1px solid hsl(152 60% 80%)',
                                borderRadius: '0.5rem',
                                color: 'hsl(152 60% 35%)',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                textAlign: 'center'
                              }}>
                                ✓ This report has been resolved
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.75rem',
                      padding: '3rem 2rem',
                      textAlign: 'center'
                    }}>
                      <Flag style={{ 
                        height: '3rem', 
                        width: '3rem', 
                        color: 'hsl(200 15% 45%)',
                        margin: '0 auto 1rem auto'
                      }} />
                      <h3 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: '600', 
                        color: 'hsl(200 25% 15%)',
                        marginBottom: '0.5rem'
                      }}>
                        No Reports Yet
                      </h3>
                      <p style={{ color: 'hsl(200 15% 45%)' }}>
                        There are no reports on the platform yet.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 className="text-lg font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>
                      All Platform Reviews ({reviews.length})
                    </h2>
                    {/* Optional: Add filter/sort controls */}
                  </div>

                  {reviews.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-4" style={{ display: 'grid', flexDirection: 'column', gap: '1rem' }}>
                      {reviews.map((review) => (
                        <div key={review.id} style={{
                          backgroundColor: 'white',
                          border: '1px solid hsl(40 20% 88%)',
                          borderRadius: '0.75rem',
                          padding: '1.5rem'
                        }}>
                          {/* Header Section */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
                                Review for Property #{review.rental_id || 'Unknown'}
                              </p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <div style={{
                                  width: '2rem',
                                  height: '2rem',
                                  borderRadius: '50%',
                                  backgroundColor: 'hsl(174 62% 32% / 0.1)',
                                  color: 'hsl(174 62% 32%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.875rem',
                                  fontWeight: '600'
                                }}>
                                  {review.full_name?.[0] || 'T'}
                                </div>
                                <div>
                                  <span className="font-medium" style={{ color: 'hsl(200 25% 15%)', display: 'block' }}>
                                    {review.full_name || 'Anonymous Tenant'}
                                  </span>
                                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    {renderStars(review.overall_rating)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                              {new Date(review.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                            
                          {/* Review Attributes */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                            {review.landlord_responsive === 1 && (
                              <span style={{
                                padding: '0.25rem 0.625rem',
                                fontSize: '0.75rem',
                                backgroundColor: 'hsl(152 60% 95%)',
                                color: 'hsl(152 60% 35%)',
                                borderRadius: '9999px',
                                border: '1px solid hsl(152 60% 85%)'
                              }}>
                                ✓ Responsive Landlord
                              </span>
                            )}
                            {review.property_matched_description === 1 && (
                              <span style={{
                                padding: '0.25rem 0.625rem',
                                fontSize: '0.75rem',
                                backgroundColor: 'hsl(152 60% 95%)',
                                color: 'hsl(152 60% 35%)',
                                borderRadius: '9999px',
                                border: '1px solid hsl(152 60% 85%)'
                              }}>
                                ✓ Accurate Description
                              </span>
                            )}
                            {review.fair_pricing === 1 && (
                              <span style={{
                                padding: '0.25rem 0.625rem',
                                fontSize: '0.75rem',
                                backgroundColor: 'hsl(152 60% 95%)',
                                color: 'hsl(152 60% 35%)',
                                borderRadius: '9999px',
                                border: '1px solid hsl(152 60% 85%)'
                              }}>
                                ✓ Fair Pricing
                              </span>
                            )}
                            {review.good_communication === 1 && (
                              <span style={{
                                padding: '0.25rem 0.625rem',
                                fontSize: '0.75rem',
                                backgroundColor: 'hsl(152 60% 95%)',
                                color: 'hsl(152 60% 35%)',
                                borderRadius: '9999px',
                                border: '1px solid hsl(152 60% 85%)'
                              }}>
                                ✓ Good Communication
                              </span>
                            )}
                          </div>
                          
                          {/* Comment */}
                          {review.comments && (
                            <p style={{ 
                              color: 'hsl(200 15% 45%)', 
                              marginBottom: '1rem',
                              fontSize: '0.875rem',
                              lineHeight: '1.5',
                              padding: '0.75rem',
                              backgroundColor: 'hsl(40 30% 97%)',
                              borderRadius: '0.5rem',
                              borderLeft: '3px solid hsl(174 62% 32% / 0.3)'
                            }}>
                              "{review.comments}"
                            </p>
                          )}

                          {/* Agent Response */}
                          {review.response && (
                            <div style={{
                              backgroundColor: 'hsl(210 20% 98%)',
                              padding: '0.75rem',
                              borderRadius: '0.5rem',
                              marginBottom: '1rem',
                              borderLeft: '3px solid hsl(174 62% 32%)'
                            }}>
                              <p style={{ 
                                fontSize: '0.75rem', 
                                fontWeight: '600', 
                                color: 'hsl(174 62% 32%)', 
                                marginBottom: '0.25rem' 
                              }}>
                                Response {review.response_person && `by ${review.response_person}`}
                              </p>
                              <p style={{ 
                                fontSize: '0.875rem', 
                                color: 'hsl(200 25% 15%)',
                                lineHeight: '1.5'
                              }}>
                                {review.response}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                            { review.review_type === 'rent' && (
                              <button
                              onClick={() => {
                                const rental = properties.find(p => p.id === review.rental_id);
                                if (rental) handleViewClick(rental);
                              }}
                              style={{
                                padding: '0.375rem 0.75rem',
                                border: '1px solid hsl(40 20% 88%)',
                                borderRadius: '0.375rem',
                                backgroundColor: 'white',
                                color: 'hsl(174 62% 32%)',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                              }}
                            >
                              View Property
                            </button>
                            ) }
                            
                            <button
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
                                  router.delete(`/admin/reviews/${review.id}`, {
                                    onSuccess: () => {
                                      showToast("Review Deleted", "The review has been removed successfully.", "success");
                                    },
                                    onError: () => {
                                      showToast("Delete Failed", "Unable to delete the review. Please try again.", "error");
                                    }
                                  });
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
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'hsl(0 70% 50% / 0.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                              }}
                            >
                              Delete Review
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: 'white',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.75rem',
                      padding: '3rem 2rem',
                      textAlign: 'center'
                    }}>
                      <Star style={{ 
                        height: '3rem', 
                        width: '3rem', 
                        color: 'hsl(200 15% 45%)',
                        margin: '0 auto 1rem auto',
                        fill: 'none'
                      }} />
                      <h3 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: '600', 
                        color: 'hsl(200 25% 15%)',
                        marginBottom: '0.5rem'
                      }}>
                        No Reviews Yet
                      </h3>
                      <p style={{ color: 'hsl(200 15% 45%)' }}>
                        There are no reviews on the platform yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />

        {selectedAgent && (
          <VerifyAgentDialog
            agentItem={selectedAgent}
            isOpen={showDialog}
            onClose={() => setShowDialog(false)}
          />
        )}
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

export default SuperAdminDashboard;