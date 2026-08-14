import { useState } from "react";
import Header from "@/Components/Layouts/Header";
import Footer from "@/Components/Layouts/Footer";
import { Link, router, usePage, Head } from "@inertiajs/react";
import AdminOverview from "@/Components/Modules/Admin/AdminOverview";
import AddRentalPage from "@/Components/Modules/AddRentals";
import VerifyAgentDialog from '@/Components/Modules/Admin/VerifyAgent';
import ViewRentals from "@/Components/Modules/ViewRental";
import EditRentals from "@/Components/Modules/EditRentals";
import AdminVerifications from '@/Components/Modules/Admin/AdminVerifications';
import AgentProfileModal from '@/Components/Modules/AgentProfileModal';
import AdminEditAgentModal from '@/Components/Modules/Admin/AdminEditAgentModal';
import AdminAddAgentModal from '@/Components/Modules/Admin/AdminAddAgentModal';
import GrantSubscriptionModal from '@/Components/Modules/Admin/GrantSubscriptionModal';
import InquiriesViewsTab from '@/Components/Modules/Admin/InquiriesViewsTab';
import AgentsTab from '@/Components/Modules/Admin/AgentsTab';
import ReportsTab from '@/Components/Modules/Admin/ReportsTab';
import ReviewsTab from '@/Components/Modules/Admin/ReviewsTab';
import ListingsTab from '@/Components/Modules/Admin/ListingsTab';
import SubscriptionsTab from '@/Components/Modules/Admin/SubscriptionsTab';
import AdminAnalyticsTab from '@/Components/Modules/Admin/AdminAnalyticsTab';
import { MapPin } from 'lucide-react';

// ─── Icons ────────────────────────────────────────────────────────────────────

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

const ShieldCheck = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const BarChart = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const Settings = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Eye = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const Gift = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminDashboard = ({ adminData, rentals, agentData, reviews, reports, agentVerifications, listingVerifications, totalVerifications, totalPendingVerifications, plans, locations, propertyTypes, amenities, views, totalViews, inquiries, subscriptions, viewCount, subsCount }) => {
  const { auth } = usePage().props;
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAgentProfile, setShowAgentProfile] = useState(false);
  const [showEditAgentModal, setShowEditAgentModal] = useState(false);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [showEditListingModal, setShowEditListingModal] = useState(false);
  // Grant subscription modal state
  const [grantTarget, setGrantTarget] = useState(null);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (title, description, variant = "success") => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3500);
  };

  const mockAdmin = {
    name: adminData?.name || "Super Admin",
    role: "Platform Administrator",
    status: "verified",
    avatar_url: null,
    total_agents: agentData?.length,
    total_listings: rentals?.length,
    total_reports: reports?.length
  };

  const agent   = mockAdmin;
  const agents  = agentData || [];
  const properties = rentals || [];

  const handleViewClick = (rental) => {
    setSelectedRental(rentals.find(r => r.id === rental.id));
    setShowViewModal(true);
  };

  const handleViewProfile = (agentData) => {
    setSelectedAgent(agentData?._original ?? agentData);
    setShowAgentProfile(true);
  };

  const handleEditClick = (rental) => {
    setSelectedRental(rentals.find(r => r.id === rental.id));
    setShowEditListingModal(true);
  };

  const handleGrantClick = (agentItem) => {
    setGrantTarget(agentItem);
    setShowGrantModal(true);
  };

  // const handleDeleteAgent = (agent) => {
  //   if (!confirm(`Are you sure you want to permanently delete ${agent.name}? This action cannot be undone.`)) return;
    
  //   router.delete(`/admin/agents/${agent.id}`, {
  //       onSuccess: () => showToast('Agent Deleted', `${agent.name} has been permanently removed.`),
  //       onError: () => showToast('Delete Failed', 'Unable to delete agent.', 'error'),
  //   });
  // };

  const handleDeleteListing = (property) => {
    if (!confirm(`Are you sure you want to delete "${property.title}"?`)) return;
    router.delete(`/admin/listings/${property.id}`, {
      onSuccess: () => showToast('Listing Deleted', 'Listing has been removed.'),
      onError: () => showToast('Failed', 'Unable to delete listing.', 'error'),
    });
  };

  const getStatusBadge = (status) => {
    status = status || '';
    const configs = {
      verified:   { icon: CheckCircle, bg: 'hsl(152 60% 40%)', color: 'white', label: 'Verified' },
      active:     { icon: CheckCircle, bg: 'hsl(152 60% 40%)', color: 'white', label: 'Active' },
      approved:   { icon: CheckCircle, bg: 'hsl(152 60% 40%)', color: 'white', label: 'Approved' },
      pending:    { icon: Clock,       bg: 'hsl(40 30% 94%)', color: 'hsl(200 25% 15%)', label: 'Pending', border: '1px solid hsl(40 20% 88%)' },
      unverified: { icon: Clock,       bg: 'hsl(40 30% 94%)', color: 'hsl(200 25% 15%)', label: 'Unverified', border: '1px solid hsl(40 20% 88%)' },
      suspended:  { icon: AlertCircle, bg: '#d92626',         color: 'white', label: 'Suspended' },
      rejected:   { icon: AlertCircle, bg: '#d92626',         color: 'white', label: 'Rejected' },
    };
    const c = configs[status] ?? { icon: AlertCircle, bg: '#d92626', color: 'white', label: status.charAt(0).toUpperCase() + status.slice(1) };
    const IconComp = c.icon;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', fontSize: '0.75rem', fontWeight: '500', backgroundColor: c.bg, color: c.color, borderRadius: '9999px', gap: '0.25rem', border: c.border ?? 'none' }}>
        <IconComp style={{ height: '0.75rem', width: '0.75rem' }} />
        {c.label}
      </span>
    );
  };

  return (
    <>
    <Head>
      <title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
    </Head>
      <style>{`
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        h1,h2,h3,h4,h5,h6 { font-weight: 600; margin: 0; }
        p { margin: 0; }
        @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @media (min-width: 768px) {
          .md-grid-3 { grid-template-columns: repeat(3, 1fr) !important; }
        }

        /* ---------- Mobile-first responsive styles ---------- */
        .admin-tabs-container {
          display: flex;
          flex-wrap: nowrap;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          gap: 0.25rem;
          background-color: hsl(40 30% 94%);
          padding: 0.25rem;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
        }
        .admin-tabs-container::-webkit-scrollbar { display: none; }
        .admin-tabs-container > button {
          flex: 0 0 auto;
          min-width: max-content;
        }

        .admin-profile-header {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .admin-profile-header .avatar {
          width: clamp(3rem, 10vw, 5rem);
          height: clamp(3rem, 10vw, 5rem);
          border-radius: 50%;
          background-color: hsl(174 62% 32% / 0.1);
          color: hsl(174 62% 32%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(1.25rem, 4vw, 2rem);
          font-weight: 600;
          flex-shrink: 0;
        }
        .admin-profile-header .info {
          flex: 1;
          min-width: 0;
        }
        .admin-profile-header .stats {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
          font-size: clamp(0.75rem, 2vw, 0.875rem);
          align-items: center;
        }
        .admin-profile-header .settings-btn {
          align-self: flex-start;
        }

        @media (max-width: 640px) {
          .admin-profile-header {
            flex-direction: column;
            align-items: stretch;
          }
          .admin-profile-header .settings-btn {
            width: 100%;
            justify-content: center;
          }
        }

        /* ---------- Modals ---------- */
        .admin-modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 1rem;
        }
        .admin-modal-content {
          background-color: white;
          border-radius: 1rem;
          max-height: 90vh;
          overflow: auto;
          width: 100%;
          position: relative;
          max-width: 95%;
          display: flex;
          flex-direction: column;
        }
        .admin-modal-close {
          align-self: flex-end;
          position: sticky;
          top: 0;
          padding: 1rem;
          border: none;
          background: transparent;
          font-size: 1.5rem;
          cursor: pointer;
          color: hsl(200 15% 45%);
          z-index: 10;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (min-width: 640px) {
          .admin-modal-content { max-width: 90%; }
        }
        @media (min-width: 1024px) {
          .admin-modal-content { max-width: 60%; }
        }

        .action-button {
          min-height: 44px;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1, padding: 'clamp(1rem, 3vw, 2rem) clamp(0.75rem, 2vw, 1rem)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            {/* Profile Header */}
            <div className="admin-profile-header">
              <div className="avatar">
                {agent.name[0]}
              </div>
              <div className="info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: '700', color: 'hsl(200 25% 15%)' }}>{agent.name}</h1>
                  {getStatusBadge(agent.status)}
                </div>
                <p style={{ color: 'hsl(200 15% 45%)', marginBottom: '0.5rem', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>{agent.role}</p>
                <div className="stats">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'hsl(200 15% 45%)' }}><Shield style={{ height: '1rem', width: '1rem' }} />{agent.total_agents} Agents</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'hsl(200 15% 45%)' }}><Home style={{ height: '1rem', width: '1rem' }} />{agent.total_listings} Listings</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'hsl(200 15% 45%)' }}><AlertCircle style={{ height: '1rem', width: '1rem' }} />{reports.length} Reports</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'hsl(200 15% 45%)' }}><MessageSquare style={{ height: '1rem', width: '1rem' }} />{reviews.length} Reviews</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'hsl(200 15% 45%)' }}><MessageSquare style={{ height: '1rem', width: '1rem' }} />{inquiries.length} inquiries</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'hsl(200 15% 45%)' }}><Eye style={{ height: '1rem', width: '1rem' }} />{totalViews} Views</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'hsl(200 15% 45%)' }}><Gift style={{ height: '1rem', width: '1rem' }} />{subsCount} Subscriptions</span>
                </div>
              </div>
              <Link href="/settings" className="settings-btn action-button" style={{ padding: '0.5rem 1rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', backgroundColor: 'white', color: 'hsl(174 62% 32%)', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <Settings style={{ height: '1rem', width: '1rem' }} />Settings
              </Link>
            </div>

            {/* Tabs */}
            <div className="admin-tabs-container">
              {['overview', 'agents', 'listings', 'verifications', 'reports', 'reviews', 'inquiries', 'subscriptions', 'analytics'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="action-button"
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
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab === 'overview' && <BarChart style={{ height: '1rem', width: '1rem' }} />}
                  {tab === 'agents' && <Shield style={{ height: '1rem', width: '1rem' }} />}
                  {tab === 'listings' && <Home style={{ height: '1rem', width: '1rem' }} />}
                  {tab === 'verifications' && <Shield style={{ height: '1rem', width: '1rem' }} />}
                  {tab === 'reports' && <AlertCircle style={{ height: '1rem', width: '1rem' }} />}
                  {tab === 'reviews' && <MessageSquare style={{ height: '1rem', width: '1rem' }} />}
                  {tab === 'inquiries' && <Eye style={{ height: '1rem', width: '1rem' }} />}
                  {tab === 'subscriptions' && <Gift style={{ height: '1rem', width: '1rem' }} />}
                  {tab === 'analytics' && <BarChart style={{ height: '1rem', width: '1rem' }} />}
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
                <AdminOverview 
                    rentals={rentals}
                    agentData={agentData}
                    reviews={reviews}
                    views={views}
                    viewCount={viewCount}
                    subsCount={subsCount}
                    subscriptions={subscriptions}
                    inquiries={inquiries}
                    reports={reports}
                    totalPendingVerifications={totalPendingVerifications}
                    agentVerifications={agentVerifications}
                    listingVerifications={listingVerifications}
                    onViewAllListings={() => setActiveTab('listings')}
                    onViewAllAgents={() => setActiveTab('agents')}
                    onViewAllReports={() => setActiveTab('reports')}
                    onViewAllVerifications={() => setActiveTab('verifications')}
                />
            )}

            {activeTab === 'analytics' && (
                <AdminAnalyticsTab
                    rentals={rentals}
                    agentData={agentData}
                    views={views}
                    totalViews={totalViews}
                    inquiries={inquiries}
                    reviews={reviews}
                    subscriptions={subscriptions}
                    totalVerifications={totalVerifications}
                />
            )}

            {/* ── AGENTS TAB ──────────────────────────────────────────────────── */}
            {activeTab === 'agents' && (
                <AgentsTab 
                    agents={agents}
                    onAddAgent={() => setShowAddAgentModal(true)}
                    onViewDetails={(agent) => {
                        setSelectedAgent(agent);
                        setShowAgentProfile(true);
                    }}
                    // onDelete={handleDeleteAgent}
                    onEdit={(agent) => {
                        setSelectedAgent(agent);
                        setShowEditAgentModal(true);
                    }}
                    onVerify={(agentId) => {
                        const agentToVerify = agents.find(a => a.id === agentId);
                        if (agentToVerify) {
                            setSelectedAgent(agentToVerify);
                            setShowDialog(true);
                        }
                    }}
                    onSuspend={(agentId) => {
                        const a = agents.find(a => a.id === agentId);
                        if (!a) return;
                        const isSuspended = a.status === 'suspended';
                        const newStatus = isSuspended ? 'unverified' : 'suspended';
                        const action = isSuspended ? 'unsuspend' : 'suspend';
                        if (!confirm(`Are you sure you want to ${action} ${a.name}?`)) return;
                        router.put(`/admin/agents/${agentId}/suspend`, { status: newStatus }, {
                            onSuccess: () => showToast(isSuspended ? 'Agent Unsuspended' : 'Agent Suspended', `${a.name} has been ${action}ed.`),
                            onError: () => showToast('Failed', `Unable to ${action} agent.`, 'error'),
                        });
                    }}
                    onUpgrade={(agent) => {
                        setGrantTarget(agent);
                        setShowGrantModal(true);
                    }}
                    onResendInvite={(agent) => {
                        if (!confirm(`Resend invitation email to ${agent.name}?`)) return;
                        router.post(`/admin/agents/${agent.id}/resend-invitation`, {}, {
                            onSuccess: () => showToast('Invitation Sent', `Invitation email sent to ${agent.email}`),
                            onError: () => showToast('Failed', 'Unable to resend invitation.', 'error'),
                        });
                    }}
                />
            )}

            {/* ── LISTINGS TAB ─────────────────────────────────────────────── */}
            {activeTab === 'listings' && (
                <ListingsTab 
                    listings={properties || []}
                    onAddListing={() => setShowAddListingModal(true)}
                    onView={handleViewClick}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteListing}
                />
            )}

            {/* ── REPORTS TAB ──────────────────────────────────────────────── */}
            {activeTab === 'reports' && (
                <ReportsTab 
                    reports={reports || []}
                    onViewProperty={handleViewClick}
                    showToast={showToast}
                />
            )}

            {/* ── VERIFICATIONS TAB ────────────────────────────────────────── */}
            {activeTab === 'verifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h2 style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600', color: 'hsl(200 25% 15%)' }}>Verification Requests</h2>
                  <span style={{ padding: '0.5rem 1rem', backgroundColor: 'hsl(174 62% 32% / 0.1)', color: 'hsl(174 62% 32%)', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '600' }}>
                    Total: {(agentVerifications?.length ?? 0) + (listingVerifications?.length ?? 0)}
                  </span>
                </div>
                <AdminVerifications
                  agentVerifications={agentVerifications ?? []}
                  listingVerifications={listingVerifications ?? []}
                />
              </div>
            )}

            {/* ── REVIEWS TAB ──────────────────────────────────────────────── */}
            {activeTab === 'reviews' && (
                <ReviewsTab 
                    reviews={reviews || []}
                    properties={properties || []}
                    onViewProperty={handleViewClick}
                    showToast={showToast}
                />
            )}

            {/* ── INQUIRIES TAB ──────────────────────────────────────────────────── */}
            {activeTab === 'inquiries' && (
                <InquiriesViewsTab
                    inquiries={inquiries}
                    views={views}
                    totalViews={totalViews}
                    rentals={rentals}
                    onViewProperty={handleViewClick}
                />
            )}

            {/* ── SUBSCRIPTIONS TAB ─────────────────────────────────────────── */}
            {activeTab === 'subscriptions' && (
                <SubscriptionsTab 
                    agents={agentData || []}
                    onViewAgent={handleViewProfile}
                    onUpgrade={handleGrantClick}
                />
            )}

          </div>
        </main>

        <Footer />

        {/* ── Modals ───────────────────────────────────────────────────────── */}

        <AgentProfileModal agent={selectedAgent} isOpen={showAgentProfile} onClose={() => setShowAgentProfile(false)} auth={auth} />

        {showEditAgentModal && selectedAgent && (
          <AdminEditAgentModal
            agent={selectedAgent}
            isOpen={showEditAgentModal}
            onClose={() => { setShowEditAgentModal(false); setSelectedAgent(null); }}
            onSuccess={(message) => {
              showToast('Agent Updated', message);
              setShowEditAgentModal(false);
              setSelectedAgent(null);
            }}
          />
        )}

        {showAddAgentModal && (
          <AdminAddAgentModal
            isOpen={showAddAgentModal}
            onClose={() => setShowAddAgentModal(false)}
            onSuccess={(message) => {
              showToast('Agent Created', message);
              setShowAddAgentModal(false);
            }}
          />
        )}

        {showAddListingModal && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-content">
              <button onClick={() => setShowAddListingModal(false)} className="admin-modal-close action-button">✕</button>
              <AddRentalPage
                agentData={agentData}
                setShowAddListingModal={setShowAddListingModal}
                adminData={adminData}
                locations={locations}
                propertyTypes={propertyTypes}
                amenities={amenities}
              />
            </div>
          </div>
        )}

        {showEditListingModal && selectedRental && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-content">
              <button onClick={() => { setShowEditListingModal(false); setSelectedRental(null); }} className="admin-modal-close action-button">✕</button>
              <EditRentals agentData={agentData} setShowEditListingModal={setShowEditListingModal} rental={selectedRental} locations={locations} propertyTypes={propertyTypes} amenities={amenities} userRole="admin" />
            </div>
          </div>
        )}

        {selectedAgent && <VerifyAgentDialog agentItem={selectedAgent} isOpen={showDialog} onClose={() => setShowDialog(false)} />}

        {showViewModal && selectedRental && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-content">
              <button onClick={() => setShowViewModal(false)} className="admin-modal-close action-button">✕</button>
              <ViewRentals rental={selectedRental} setShowViewModal={setShowViewModal} />
            </div>
          </div>
        )}

        {/* ── Grant Subscription Modal ─────────────────────────────────────── */}
        {showGrantModal && grantTarget && (
          <GrantSubscriptionModal
            agent={grantTarget}
            plans={plans ?? []}
            onClose={() => { setShowGrantModal(false); setGrantTarget(null); }}
            onSuccess={(msg) => showToast('Plan Granted 🎉', msg)}
          />
        )}

        {/* Toast */}
        {toast && (
          <div style={{ position: 'fixed', top: '1rem', right: '1rem', backgroundColor: toast.variant === 'error' ? 'hsl(0 70% 50%)' : 'hsl(152 60% 40%)', color: 'white', padding: '1rem 1.5rem', borderRadius: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 9999, maxWidth: '90vw', animation: 'slideIn 0.3s ease-out' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{toast.title}</div>
            <div style={{ fontSize: '0.875rem' }}>{toast.description}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;