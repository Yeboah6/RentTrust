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
      <div className="p-6">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              background: 'hsl(174 62% 32% / 0.1)',
              color: 'hsl(174 62% 32%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.125rem',
              fontWeight: '600',
              flexShrink: 0
            }}
          >
            {agent.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h3 
                className="font-semibold tracking-tight"
                style={{ 
                  color: 'hsl(200 25% 15%)', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap' 
                }}
              >
                {agent.name}
              </h3>
              {agent.isVerified && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.25rem 0.625rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: 'hsl(152 60% 40% / 0.1)',
                    color: 'hsl(152 60% 40%)',
                    borderRadius: '9999px',
                    flexShrink: 0
                  }}
                >
                  <CheckCircle2 style={{ height: '0.75rem', width: '0.75rem', marginRight: '0.25rem' }} />
                  Verified
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star style={{ height: '1rem', width: '1rem', color: 'hsl(38 92% 50%)', fill: 'hsl(38 92% 50%)' }} />
                <span style={{ fontWeight: '500', color: 'hsl(200 25% 15%)' }}>{agent.rating}</span>
                <span style={{ color: 'hsl(200 15% 45%)' }}>({agent.reviewCount})</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '0.75rem' }}>
            <MapPin style={{ height: '1rem', width: '1rem', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {agent.areas.join(", ")}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
            <Building2 style={{ height: '1rem', width: '1rem', flexShrink: 0 }} />
            <span>{agent.listingsCount} active listings</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.875rem',
            paddingTop: '1rem',
            borderTop: '1px solid hsl(40 20% 88%)'
          }}
        >
          <div>
            <span style={{ color: 'hsl(200 15% 45%)' }}>Agent Fee: </span>
            <span className="font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>{agent.feePercent}%</span>
          </div>
          <div>
            <span style={{ color: 'hsl(200 15% 45%)' }}>Response: </span>
            <span className="font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>{agent.responseRate}%</span>
          </div>
        </div>

        <button
          className="w-full mt-4 px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={() => onViewProfile(agent)}
          style={{
            border: '1px solid hsl(40 20% 88%)',
            backgroundColor: 'white',
            color: 'hsl(174 62% 32%)'
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

const AgentsPage = ({ agent, listingsCount }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAgentProfile, setShowAgentProfile] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const { auth } = usePage().props;

  const agentsData = agent.map((agentItem) => ({
    id: agentItem.id,
    name: agentItem.fullName,
    isVerified: agentItem.verification_status === 'verified',
    rating: agentItem.average_rating || 0,
    reviewCount: agentItem.total_reviews || 0,
    // listingsCount: listingsCount[agentItem.id] || 0,
    areas: agentItem.service_areas ? agentItem.service_areas.split(',').map(a => a.trim()) : [],
    feePercent: agentItem.fee || 0,
    responseRate: agentItem.response_rate || 0,
    company: agentItem.company,
    _original: agentItem // Store original data
  }));

  const handleViewProfile = (agentData) => {
    // Use the original agent data for the modal
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
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />
        

        <main style={{ flex: 1 }}>
          {/* Page Header */}
          <div style={{ backgroundColor: 'hsl(0 0% 100%)', borderBottom: '1px solid hsl(40 20% 88%)', padding: '2rem 0' }}>
            <div className="container mx-auto px-4">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                Find Agents & Landlords
              </h1>
              <p style={{ color: 'hsl(200 15% 45%)', marginBottom: '1.5rem' }}>
                Connect with verified agents who have proven track records
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
                <div style={{ position: 'relative', maxWidth: '28rem' }}>
                  <Search 
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
                    placeholder="Search by name or area..."
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
               <Link
                  href="/become-agent"
                  className="px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all duration-200 active:scale-95"
                  style={{ backgroundColor: 'hsl(174 62% 32%)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 55% 28%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)'}
                >
                  Become an Landlord
                </Link>
              </div>
            </div>
          </div>

          {/* Agents Grid */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} onViewProfile={handleViewProfile} />
              ))}
            </div>

            {filteredAgents.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <Building2 style={{ height: '3rem', width: '3rem', color: 'hsl(200 15% 45% / 0.5)', margin: '0 auto 1rem' }} />
                <h3 className="text-lg font-semibold tracking-tight" style={{ color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
                  No agents found
                </h3>
                <p style={{ color: 'hsl(200 15% 45%)' }}>Try adjusting your search</p>
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