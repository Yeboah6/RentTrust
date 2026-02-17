import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import Header from "../Components/Layouts/Header";
import Footer from "../Components/Layouts/Footer";
import AgentProfileModal from '../Components/Modules/AgentProfileModal';

// Icon components
const Search = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CheckCircle2 = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Star = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const MapPin = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Building2 = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const AgentCard = ({ agent, onViewProfile }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="overflow-hidden cursor-pointer border rounded-xl bg-white transition-all duration-300 agent-card"
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
      <div className="agent-card-content" style={{ padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
        <div style={{ display: 'flex', gap: 'clamp(0.75rem, 2vw, 1rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
          <div
            className="agent-avatar"
            style={{
              width: 'clamp(3rem, 10vw, 3.5rem)',
              height: 'clamp(3rem, 10vw, 3.5rem)',
              borderRadius: '50%',
              background: 'hsl(174 62% 32% / 0.1)',
              color: 'hsl(174 62% 32%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
              fontWeight: '600',
              flexShrink: 0
            }}
          >
            {agent.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <h3 
                className="font-semibold tracking-tight agent-name"
                style={{ 
                  color: 'hsl(200 25% 15%)', 
                  fontSize: 'clamp(0.9375rem, 2.5vw, 1.125rem)',
                  lineHeight: '1.3',
                  wordBreak: 'break-word'
                }}
              >
                {agent.name}
              </h3>
              {agent.isVerified && (
                <span
                  className="verified-badge"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.25rem 0.5rem',
                    fontSize: 'clamp(0.6875rem, 1.8vw, 0.75rem)',
                    fontWeight: '500',
                    backgroundColor: 'hsl(152 60% 40% / 0.1)',
                    color: 'hsl(152 60% 40%)',
                    borderRadius: '9999px',
                    flexShrink: 0,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <CheckCircle2 style={{ height: '0.75rem', width: '0.75rem', marginRight: '0.25rem' }} />
                  Verified
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)', color: 'hsl(38 92% 50%)', fill: 'hsl(38 92% 50%)' }} />
                <span style={{ fontWeight: '500', color: 'hsl(200 25% 15%)' }}>{agent.rating}</span>
                <span style={{ color: 'hsl(200 15% 45%)' }}>({agent.reviewCount})</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)' }}>
            <Building2 style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)', flexShrink: 0 }} />
            <span>{agent.listingsCount} active listings</span>
          </div>
        </div>

        <div
          className="agent-stats"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
            paddingTop: 'clamp(0.75rem, 2vw, 1rem)',
            borderTop: '1px solid hsl(40 20% 88%)',
            gap: '0.5rem'
          }}
        >
          <div style={{ minWidth: 0 }}>
            <span style={{ color: 'hsl(200 15% 45%)' }}>Agent Fee: </span>
            <span className="font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>{agent.feePercent}%</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{ color: 'hsl(200 15% 45%)' }}>Response: </span>
            <span className="font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>{agent.responseRate}%</span>
          </div>
        </div>

        <button
          className="w-full mt-4 px-4 py-2 rounded-lg font-medium transition-colors view-profile-btn"
          onClick={() => onViewProfile(agent)}
          style={{
            border: '1px solid hsl(40 20% 88%)',
            backgroundColor: 'white',
            color: 'hsl(174 62% 32%)',
            fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
            padding: 'clamp(0.625rem, 2vw, 0.75rem) 1rem',
            touchAction: 'manipulation'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

const AgentsPage = ({ agents }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAgentProfile, setShowAgentProfile] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const { auth } = usePage().props;

  const agentsData = agents.map((agentItem) => ({
    id: agentItem.id,
    name: agentItem.name,
    isVerified: agentItem.status === 'verified',
    rating: agentItem.rentals_reviews_avg_overall_rating || 0,
    reviewCount: agentItem.total_reviews_count || 0,
    listingsCount: agentItem.rentals_count || 0,
    feePercent: agentItem.fee || 0,
    responseRate: 95,
    company: agentItem.company,
    _original: agentItem
  }));

  const handleViewProfile = (agentData) => {
    setSelectedAgent(agentData._original);
    setShowAgentProfile(true);
  };

  const filteredAgents = agentsData.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.areas.some((area) => area.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

        /* Mobile touch optimization */
        @media (max-width: 768px) {
          .agent-card {
            -webkit-tap-highlight-color: transparent;
          }

          .view-profile-btn {
            min-height: 44px;
            -webkit-tap-highlight-color: transparent;
          }

          .agent-card:active {
            transform: scale(0.98) !important;
          }

          /* Prevent text from being too small on mobile */
          .agent-name {
            min-height: auto;
          }

          /* Better spacing on mobile */
          .agent-card-content {
            padding: 1rem;
          }

          .agent-stats {
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .agent-stats > div {
            flex: 1 1 auto;
            min-width: fit-content;
          }
        }

        /* Extra small devices */
        @media (max-width: 480px) {
          .page-header-wrapper {
            padding: 1.5rem 0 !important;
          }

          .header-actions {
            flex-direction: column;
            gap: 0.75rem !important;
          }

          .search-wrapper {
            width: 100% !important;
            max-width: 100% !important;
          }

          .become-agent-btn {
            width: 100%;
            justify-content: center;
          }

          .verified-badge {
            font-size: 0.6875rem !important;
            padding: 0.1875rem 0.4375rem !important;
          }
        }

        /* Prevent zoom on input focus for iOS */
        @media (max-width: 768px) {
          input[type="text"],
          input[type="search"] {
            font-size: 16px !important;
          }
        }

        /* Landscape mobile */
        @media (max-height: 600px) and (orientation: landscape) {
          .page-header-wrapper {
            padding: 1rem 0 !important;
          }
        }

        /* Grid improvements for different screen sizes */
        .agents-grid {
          display: grid;
          gap: clamp(1rem, 3vw, 1.5rem);
        }

        @media (min-width: 640px) and (max-width: 1023px) {
          .agents-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .agents-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 639px) {
          .agents-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />
        

        <main style={{ flex: 1 }}>
          {/* Page Header */}
          <div className="page-header-wrapper" style={{ backgroundColor: 'hsl(0 0% 100%)', borderBottom: '1px solid hsl(40 20% 88%)', padding: 'clamp(1.5rem, 4vw, 2rem) 0' }}>
            <div className="container mx-auto" style={{ paddingLeft: 'clamp(0.75rem, 3vw, 1rem)', paddingRight: 'clamp(0.75rem, 3vw, 1rem)' }}>
              <h1 className="tracking-tight" style={{ 
                color: 'hsl(200 25% 15%)',
                fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                fontWeight: '700',
                marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)',
                lineHeight: '1.2'
              }}>
                Find Agents & Landlords
              </h1>
              <p style={{ 
                color: 'hsl(200 15% 45%)', 
                marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
              }}>
                Connect with verified agents who have proven track records
              </p>

              <div className="header-actions" style={{ display: 'flex', gap: 'clamp(0.5rem, 2vw, 1rem)', alignItems: 'stretch' }}>
                <div className="search-wrapper" style={{ position: 'relative', flex: '1', maxWidth: '28rem' }}>
                  <Search 
                    style={{ 
                      position: 'absolute', 
                      left: 'clamp(0.625rem, 2vw, 0.75rem)', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      height: 'clamp(1.125rem, 3vw, 1.25rem)', 
                      width: 'clamp(1.125rem, 3vw, 1.25rem)', 
                      color: 'hsl(200 15% 45%)' 
                    }} 
                  />
                  <input
                    type="text"
                    placeholder="Search by name or area..."
                    style={{
                      width: '100%',
                      paddingLeft: 'clamp(2.25rem, 8vw, 2.5rem)',
                      paddingRight: 'clamp(0.75rem, 2vw, 1rem)',
                      height: 'clamp(2.75rem, 10vw, 3rem)',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.75rem',
                      fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
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
                <Link
                  href="/become-agent"
                  className="become-agent-btn font-semibold rounded-lg text-white transition-all duration-200 active:scale-95"
                  style={{ 
                    backgroundColor: 'hsl(174 62% 32%)',
                    padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(0.875rem, 3vw, 1.25rem)',
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                    touchAction: 'manipulation',
                    minHeight: 'clamp(2.75rem, 10vw, 3rem)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 55% 28%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)'}
                >
                  Become an Landlord
                </Link>
              </div>
            </div>
          </div>

          {/* Agents Grid */}
          <div className="container mx-auto" style={{ 
            paddingLeft: 'clamp(0.75rem, 3vw, 1rem)', 
            paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
            paddingTop: 'clamp(1.5rem, 4vw, 2rem)',
            paddingBottom: 'clamp(1.5rem, 4vw, 2rem)'
          }}>
            <div className="agents-grid">
              {filteredAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} onViewProfile={handleViewProfile} />
              ))}
            </div>

            {filteredAgents.length === 0 && (
              <div style={{ textAlign: 'center', padding: 'clamp(2rem, 5vw, 3rem) 0' }}>
                <Building2 style={{ 
                  height: 'clamp(2.5rem, 8vw, 3rem)', 
                  width: 'clamp(2.5rem, 8vw, 3rem)', 
                  color: 'hsl(200 15% 45% / 0.5)', 
                  margin: '0 auto 1rem' 
                }} />
                <h3 className="tracking-tight" style={{ 
                  color: 'hsl(200 25% 15%)', 
                  marginBottom: '0.5rem',
                  fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                  fontWeight: '600'
                }}>
                  No agents found
                </h3>
                <p style={{ 
                  color: 'hsl(200 15% 45%)',
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                }}>
                  Try adjusting your search
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />

        {/* Agent Profile Modal */}
        <AgentProfileModal
          agent={selectedAgent}
          isOpen={showAgentProfile} 
          onClose={() => setShowAgentProfile(false)}
          auth={auth}
        />
      </div>
    </>
  );
};

export default AgentsPage;