import { useState } from "react";
import Header from "@/Components/Layouts/Header";
import Footer from "@/Components/Layouts/Footer";
import { Link, router, usePage } from "@inertiajs/react";
import AddRentalPage from "@/Components/Modules/AddRentals";
import VerifyAgentDialog from '@/Components/Modules/VerifyAgent';
import ViewRentals from "@/Components/Modules/ViewRental";
import EditRentals from "@/Components/Modules/EditRentals";
import ViewAgentVerifications from '@/Components/Modules/ViewAgentVerifications';
import AgentProfileModal from '@/Components/Modules/AgentProfileModal';
import AdminEditAgentModal from '@/Components/Modules/AdminEditAgentModal';
import AdminAddAgentModal from '@/Components/Modules/AdminAddAgentModal';
import GrantSubscriptionModal from '@/Components/Modules/GrantSubscriptionModal';
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

const Settings = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Gift = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

// Plan badge for agent cards
const PlanBadge = ({ plan }) => {
  const slug = plan?.slug ?? 'free';
  const label = plan?.name ?? slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const configs = {
    pro:      { bg: 'hsl(174 62% 32%)',   text: 'white' },
    verified: { bg: 'hsl(214 100% 50%)',  text: 'white' },
    elite:    { bg: 'hsl(174 62% 32%)',   text: 'white' },
    free:     { bg: 'hsl(40 20% 88%)',    text: 'hsl(200 25% 35%)' },
  };
  const c = configs[slug] ?? configs.free;
  return (
    <span style={{ display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: '700', backgroundColor: c.bg, color: c.text, letterSpacing: '0.03em' }}>
      {label}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminDashboard = ({ adminData, rentals, agentData, reviews, reports, verifications, plans, locations, propertyTypes, amenities }) => {
  const { auth } = usePage().props;
  const findPlan = (packageSlug) => plans?.find(p => p.slug === packageSlug) ?? null;
  const [activeTab, setActiveTab] = useState("agents");
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState("");
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
  const [agentsFilter, setAgentsFilter] = useState('');
  const [listingsFilter, setListingsFilter] = useState('');
  const [listingsStatusFilter, setListingsStatusFilter] = useState('all');
  const [reportsFilter, setReportsFilter] = useState('');
  const [reportsStatusFilter, setReportsStatusFilter] = useState('all');
  const [reviewsFilter, setReviewsFilter] = useState('');
  const [reviewsRatingFilter, setReviewsRatingFilter] = useState('all');
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

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleVerifyClick = (agentId) => {
    setSelectedAgent(agents.find(a => a.id === agentId));
    setShowDialog(true);
  };

  const handleViewClick = (rental) => {
    setSelectedRental(rentals.find(r => r.id === rental.id));
    setShowViewModal(true);
  };

  const handleViewProfile = (agentData) => {
    setSelectedAgent(agentData?._original ?? agentData);
    setShowAgentProfile(true);
  };

  const handleEditAgent = (agentData) => {
    setSelectedAgent(agentData?._original ?? agentData);
    setShowEditAgentModal(true);
  };

  const handleEditClick = (rental) => {
    setSelectedRental(rentals.find(r => r.id === rental.id));
    setShowEditListingModal(true);
  };

  const handleGrantClick = (agentItem) => {
    setGrantTarget(agentItem);
    setShowGrantModal(true);
  };

  const handleSuspendAgent = (agentId) => {
    const a = agents.find(a => a.id === agentId);
    if (!a) return;
    const isSuspended = a.status === 'suspended';
    const newStatus   = isSuspended ? 'unverified' : 'suspended';
    const action      = isSuspended ? 'unsuspend' : 'suspend';
    if (!confirm(`Are you sure you want to ${action} ${a.fullName}?`)) return;
    router.put(`/admin/agents/${agentId}/suspend`, { status: newStatus }, {
      onSuccess: () => showToast(isSuspended ? 'Agent Unsuspended' : 'Agent Suspended', `${a.fullName} has been ${action}ed.`),
      onError: () => showToast('Failed', `Unable to ${action} agent.`, 'error'),
    });
  };

  const handleApproveToggle = (property) => {
    const isApproved = property.status === 'approved';
    const action     = isApproved ? 'revert to pending' : 'approve';
    if (!confirm(`Are you sure you want to ${action} "${property.title}"?`)) return;
    router.put(`/admin/listings/${property.id}/toggle-approval`, {}, {
      onSuccess: () => showToast(isApproved ? 'Reverted to Pending' : 'Listing Approved', `${property.title} updated.`),
      onError: () => showToast('Action Failed', `Unable to ${action}.`, 'error'),
    });
  };

  const handleDeleteListing = (property) => {
    if (!confirm(`Delete "${property.title}"? This cannot be undone.`)) return;
    router.delete(`/rent/${property.id}`, {}, {
      onSuccess: () => showToast('Listing Deleted', `"${property.title}" deleted.`),
      onError: () => showToast('Delete Failed', 'Unable to delete.', 'error'),
    });
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} style={{ height: '1rem', width: '1rem', color: i < rating ? 'hsl(38 92% 50%)' : 'hsl(200 15% 45%)', fill: i < rating ? 'hsl(38 92% 50%)' : 'none' }} />
    ));

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

  const matchesFilter = (value, query) => {
    if (!query) return true;
    return value?.toString().toLowerCase().includes(query.trim().toLowerCase());
  };

  const filteredAgents = agents.filter(agentItem => {
    const query = agentsFilter.trim().toLowerCase();
    if (!query) return true;
    return [agentItem.name, agentItem.email, agentItem.company, agentItem.status, agentItem.package]
      .filter(Boolean)
      .some(value => matchesFilter(value, query));
  });

  const filteredListings = properties.filter(property => {
    const query = listingsFilter.trim().toLowerCase();
    const matchesSearch = !query || [property.title, property.address, property.city, property.agent_name, property.status, property.purpose]
      .filter(Boolean)
      .some(value => matchesFilter(value, query));
    const matchesStatus = listingsStatusFilter === 'all' || property.status === listingsStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredReports = reports.filter(report => {
    const query = reportsFilter.trim().toLowerCase();
    const matchesSearch = !query || [report.full_name, report.email, report.report_type, report.report_description, report.status]
      .filter(Boolean)
      .some(value => matchesFilter(value, query));
    const matchesStatus = reportsStatusFilter === 'all' || report.status === reportsStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredReviews = reviews.filter(review => {
    const query = reviewsFilter.trim().toLowerCase();
    const matchesSearch = !query || [review.full_name, review.comments, review.review_type, review.rental_id?.toString(), review.response]
      .filter(Boolean)
      .some(value => matchesFilter(value, query));
    const matchesRating = reviewsRatingFilter === 'all' || review.overall_rating?.toString() === reviewsRatingFilter;
    return matchesSearch && matchesRating;
  });

  {/* ─── AdminListingSection ─────────────────────────────────────────────────── */}
 
  const AdminListingSection = ({ title, emoji, count, accentColor, accentBg, borderColor, children }) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      
          {/* Section heading strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.5rem 0.875rem', borderRadius: '0.5rem', backgroundColor: accentBg, border: `1px solid ${borderColor}` }}>
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>{emoji}</span>
              <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: accentColor }}>
                  {title}
              </h3>
              <span style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: '700', color: accentColor, backgroundColor: 'white', border: `1px solid ${borderColor}`, padding: '0.1rem 0.5rem', borderRadius: '999px' }}>
                  {count}
              </span>
          </div>
  
          {/* Card grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {children}
          </div>
      </div>
  );
  
  
  {/* ─── AdminListingCard ────────────────────────────────────────────────────── */}
  
  const AdminListingCard = ({ property, onView, onEdit, onApproveToggle, onDelete, getStatusBadge }) => {
      const isRent     = property.purpose === 'rent';
      const isApproved = property.status === 'approved';
  
      const priceStr = isRent
          ? `GH₵${property.rent_min?.toLocaleString() ?? '—'} – GH₵${property.rent_max?.toLocaleString() ?? '—'} / yr`
          : `GH₵${property.sale_price?.toLocaleString() ?? '—'}`;
  
      const priceColor = isRent ? 'hsl(174 55% 28%)' : 'hsl(36 75% 30%)';
  
      return (
          <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          
              {/* Property info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ margin: '0 0 0.2rem', fontWeight: '600', color: 'hsl(200 25% 15%)', fontSize: '0.9375rem', wordBreak: 'break-word' }}>
                          {property.title}
                      </h3>
                      <p style={{ margin: '0 0 0.15rem', fontSize: '0.8rem', color: 'hsl(200 15% 48%)', wordBreak: 'break-word' }}>
                          {[property.address, property.city].filter(Boolean).join(', ')}
                      </p>
                      <p style={{ margin: '0 0 0.3rem', fontSize: '0.75rem', color: 'hsl(200 15% 52%)' }}>
                          Agent: <strong style={{ color: 'hsl(200 25% 25%)', fontWeight: '600' }}>{property.agent_name ?? '—'}</strong>
                      </p>
                      <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: priceColor }}>
                          {priceStr}
                      </p>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                      {getStatusBadge(property.status)}
                  </div>
              </div>
      
              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: 'hsl(40 20% 92%)' }} />
      
              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <ActionBtn label="View"   onClick={() => onView(property)}
                      bg="white" color="hsl(174 55% 28%)" border="1px solid hsl(40 20% 88%)"
                      hoverBg="hsl(174 62% 32% / 0.07)" />
  
                  <ActionBtn label="Edit"   onClick={() => onEdit(property)}
                      bg="white" color="hsl(200 25% 28%)" border="1px solid hsl(40 20% 88%)"
                      hoverBg="hsl(220 15% 95%)" />
  
                  <ActionBtn
                      label={isApproved ? 'Revert' : 'Approve'}
                      onClick={() => onApproveToggle(property)}
                      bg={isApproved
                          ? 'linear-gradient(135deg, hsl(300 70% 50%), hsl(300 60% 40%))'
                          : 'linear-gradient(135deg, hsl(152 60% 40%), hsl(152 50% 35%))'}
                      color="white" border="none"
                      hoverFilter="brightness(0.9)" />
  
                  <ActionBtn label="Delete" onClick={() => onDelete(property)}
                      bg="white" color="hsl(0 65% 48%)" border="1px solid hsl(0 65% 82%)"
                      hoverBg="hsl(0 65% 97%)" />
              </div>
          </div>
      );
  };
  
  
  {/* ─── ActionBtn (shared button atom) ─────────────────────────────────────── */}
  
  const ActionBtn = ({ label, onClick, bg, color, border, hoverBg, hoverFilter }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '0.375rem',
                border: border ?? 'none',
                background: hovered && hoverBg ? hoverBg : bg,
                color,
                fontSize: '0.8125rem',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'inherit',
                filter: hovered && hoverFilter ? hoverFilter : 'none',
                transition: 'background-color 0.15s, filter 0.15s',
            }}>
            {label}
        </button>
    );
  };

  // Check if agent can be upgraded (not already on Pro)
  const canUpgrade = (agentItem) => (agentItem.package ?? 'free') !== 'pro';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        h1,h2,h3,h4,h5,h6 { font-weight: 600; margin: 0; }
        p { margin: 0; }
        @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @media (min-width: 768px) {
          .md-grid-3 { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1, padding: '2rem 1rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            {/* Profile Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', backgroundColor: 'hsl(174 62% 32% / 0.1)', color: 'hsl(174 62% 32%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '600' }}>
                {agent.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'hsl(200 25% 15%)' }}>{agent.name}</h1>
                  {getStatusBadge(agent.status)}
                </div>
                <p style={{ color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>{agent.role}</p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'hsl(200 15% 45%)' }}><Shield style={{ height: '1rem', width: '1rem' }} />{agent.total_agents} Agents</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'hsl(200 15% 45%)' }}><Home style={{ height: '1rem', width: '1rem' }} />{agent.total_listings} Listings</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'hsl(200 15% 45%)' }}><AlertCircle style={{ height: '1rem', width: '1rem' }} />{reports.length} Reports</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'hsl(200 15% 45%)' }}><MessageSquare style={{ height: '1rem', width: '1rem' }} />{reviews.length} Reviews</span>
                </div>
              </div>
              <Link href="/settings" style={{ padding: '0.5rem 1rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', backgroundColor: 'white', color: 'hsl(174 62% 32%)', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', alignSelf: 'flex-start' }}>
                <Settings style={{ height: '1rem', width: '1rem' }} />Settings
              </Link>
            </div>

            {/* Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', backgroundColor: 'hsl(40 30% 94%)', padding: '0.25rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
              {['agents', 'listings', 'verifications', 'reports', 'reviews'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', backgroundColor: activeTab === tab ? 'white' : 'transparent', color: activeTab === tab ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s', boxShadow: activeTab === tab ? '0 1px 2px 0 hsl(200 25% 15% / 0.05)' : 'none', textTransform: 'capitalize' }}>
                  {tab === 'agents' && <Shield style={{ height: '1rem', width: '1rem' }} />}
                  {tab === 'listings' && <Home style={{ height: '1rem', width: '1rem' }} />}
                  {tab === 'verifications' && <ShieldCheck style={{ height: '1rem', width: '1rem' }} />}
                  {tab === 'reports' && <AlertCircle style={{ height: '1rem', width: '1rem' }} />}
                  {tab === 'reviews' && <MessageSquare style={{ height: '1rem', width: '1rem' }} />}
                  {tab}
                </button>
              ))}
            </div>

            {/* ── AGENTS TAB ──────────────────────────────────────────────────── */}
            {activeTab === 'agents' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'hsl(200 25% 15%)' }}>Platform Agents</h2>
                  <button type="button" onClick={() => setShowAddAgentModal(true)} style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Home style={{ height: '1rem', width: '1rem' }} />Add New Agent
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', flex: '1 1 320px' }}>
                    <input
                      type="search"
                      value={agentsFilter}
                      onChange={(e) => setAgentsFilter(e.target.value)}
                      placeholder="Search agents by name, email, status..."
                      style={{ width: '100%', minWidth: '260px', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid hsl(200 15% 85%)', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                  {filteredAgents.map(agentItem => (
                    <div key={agentItem.id} style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                      {/* Card header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                            {/* <h3 style={{ fontWeight: '600', color: 'hsl(200 25% 15%)', fontSize: '0.9rem' }}>{agentItem.name}</h3> */}
                            {getStatusBadge(agentItem.status)}
                          </div>
                          <h3 style={{ fontWeight: '600', color: 'hsl(200 25% 15%)', fontSize: '0.9rem' }}>{agentItem.name}</h3>
                          <p style={{ fontSize: '0.8rem', color: 'hsl(200 15% 45%)', marginBottom: '0.2rem' }}>{agentItem.email}</p>
                          {agentItem.company && <p style={{ fontSize: '0.8rem', color: 'hsl(200 15% 45%)' }}>{agentItem.company}</p>}
                        </div>
                        {/* Plan badge */}
                        <PlanBadge plan={findPlan(agentItem.package)} />
                      </div>

                      {/* Meta */}
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.73rem', color: 'hsl(200 15% 50%)', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <span>{agentItem.rentals_count ?? agentItem.total_listings ?? 0} listings</span>
                        <span>Joined {new Date(agentItem.created_at).toLocaleDateString()}</span>
                        <span>Last active {new Date(agentItem.last_active).toLocaleDateString()}</span>
                        {agentItem.subscription && agentItem.subscription.starts_at && (
                          <span>Plan starts {new Date(agentItem.subscription.starts_at).toLocaleDateString()}</span>
                        )}
                        {agentItem.subscription && agentItem.subscription.ends_at && (
                          <span>Expires {new Date(agentItem.subscription.ends_at).toLocaleDateString()}</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button onClick={() => handleViewProfile(agentItem)} style={{ padding: '0.35rem 0.7rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(174 62% 32%)', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer' }}>
                          View Details
                        </button>

                        <button onClick={() => handleEditAgent(agentItem)} style={{ padding: '0.35rem 0.7rem', border: '1px solid hsl(214 80% 55%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(214 80% 55%)', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer' }}>
                          Edit Agent
                        </button>

                        {(agentItem.status === 'unverified' || agentItem.status === 'pending') && (
                          <button onClick={() => handleVerifyClick(agentItem.id)} style={{ padding: '0.35rem 0.7rem', background: 'linear-gradient(135deg, hsl(152 60% 40%) 0%, hsl(152 50% 35%) 100%)', color: 'white', border: 'none', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer' }}>
                            Verify
                          </button>
                        )}

                        {agentItem.status === 'verified' && (
                          <button onClick={() => { if (!confirm(`Mark ${agentItem.fullName} as unverified?`)) return; router.put(`/admin/agents/${agentItem.id}/suspend`, { status: 'unverified' }, { onSuccess: () => showToast('Updated', `${agentItem.fullName} is now unverified`), onError: () => showToast('Error', 'Failed', 'error') }); }} style={{ padding: '0.35rem 0.7rem', backgroundColor: 'white', color: 'hsl(200 25% 15%)', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer' }}>
                            Mark Unverified
                          </button>
                        )}

                        {/* ── UPGRADE BUTTON ─────────────────────────────── */}
                        {canUpgrade(agentItem) && plans?.length > 0 && (
                          <button
                            onClick={() => handleGrantClick(agentItem)}
                            style={{ padding: '0.35rem 0.7rem', border: '1px solid hsl(271 76% 53%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(271 76% 53%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsl(271 76% 97%)'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; }}
                          >
                            <Gift style={{ height: '0.8rem', width: '0.8rem' }} />
                            Upgrade
                          </button>
                        )}

                        <button onClick={() => handleSuspendAgent(agentItem.id)} style={{ padding: '0.35rem 0.7rem', border: '1px solid #d92626', borderRadius: '0.375rem', backgroundColor: 'white', color: '#d92626', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(0 70% 97%)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                        >
                          {agentItem.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── LISTINGS TAB ─────────────────────────────────────────────── */}
            {activeTab === 'listings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
                  {/* ── Header ── */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                          <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'hsl(200 25% 15%)', margin: '0 0 0.15rem' }}>
                              All Platform Listings
                          </h2>
                          <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(200 15% 48%)' }}>
                              {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found
                          </p>
                      </div>
                      <button
                          onClick={() => setShowAddListingModal(true)}
                          style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.875rem', fontFamily: 'inherit' }}>
                          <Home style={{ height: '1rem', width: '1rem' }} /> Add New Listing
                      </button>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center' }}>
                    <input
                      type="search"
                      value={listingsFilter}
                      onChange={(e) => setListingsFilter(e.target.value)}
                      placeholder="Search listings by title, location, agent..."
                      style={{ width: '100%', minWidth: '260px', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid hsl(200 15% 85%)', fontSize: '0.9rem' }}
                    />
                    <select
                      value={listingsStatusFilter}
                      onChange={(e) => setListingsStatusFilter(e.target.value)}
                      style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid hsl(200 15% 85%)', fontSize: '0.9rem', minWidth: '160px' }}
                    >
                      <option value="all">All statuses</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="unverified">Unverified</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>

                  {/* ── Empty state ── */}
                  {filteredListings.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: 'white', border: '1px dashed hsl(40 20% 82%)', borderRadius: '0.75rem' }}>
                          <p style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>🏠</p>
                          <p style={{ margin: '0 0 0.25rem', fontWeight: '600', color: 'hsl(200 25% 15%)' }}>No listings yet</p>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: 'hsl(200 15% 48%)' }}>Add the first listing to get started.</p>
                      </div>
                  )}

                  {/* ── Rental listings ── */}
                  {(() => {
                      const rentals = filteredListings.filter(p => p.purpose === 'rent');
                      if (rentals.length === 0) return null;
                      return (
                          <AdminListingSection title="Rental Listings" emoji="🏠" count={rentals.length} accentColor="hsl(174 55% 28%)" accentBg="hsl(174 62% 32% / 0.07)" borderColor="hsl(174 50% 80%)">
                              {rentals.map(property => (
                                  <AdminListingCard
                                      key={property.id}
                                      property={property}
                                      onView={handleViewClick}
                                      onEdit={handleEditClick}
                                      onApproveToggle={handleApproveToggle}
                                      onDelete={handleDeleteListing}
                                      getStatusBadge={getStatusBadge}
                                  />
                              ))}
                          </AdminListingSection>
                      );
                  })()}

                  {/* ── Sale listings ── */}
                  {(() => {
                      const sales = filteredListings.filter(p => p.purpose === 'sale');
                      if (sales.length === 0) return null;
                      return (
                          <AdminListingSection title="Sale Listings" emoji="🏷️" count={sales.length} accentColor="hsl(36 75% 30%)" accentBg="hsl(38 92% 50% / 0.07)" borderColor="hsl(38 80% 78%)">
                              {sales.map(property => (
                                  <AdminListingCard
                                      key={property.id}
                                      property={property}
                                      onView={handleViewClick}
                                      onEdit={handleEditClick}
                                      onApproveToggle={handleApproveToggle}
                                      onDelete={handleDeleteListing}
                                      getStatusBadge={getStatusBadge}
                                  />
                              ))}
                          </AdminListingSection>
                      );
                  })()}

              </div>
          )}

            {/* ── REPORTS TAB ──────────────────────────────────────────────── */}
            {activeTab === 'reports' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'hsl(200 25% 15%)' }}>Platform Reports ({filteredReports.length})</h2>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center' }}>
                  <input
                    type="search"
                    value={reportsFilter}
                    onChange={(e) => setReportsFilter(e.target.value)}
                    placeholder="Search reports by type, reporter, description..."
                    style={{ width: '100%', minWidth: '260px', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid hsl(200 15% 85%)', fontSize: '0.9rem' }}
                  />
                  <select
                    value={reportsStatusFilter}
                    onChange={(e) => setReportsStatusFilter(e.target.value)}
                    style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid hsl(200 15% 85%)', fontSize: '0.9rem', minWidth: '160px' }}
                  >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>

                {filteredReports.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
                    {filteredReports.map(report => {
                      const evidence = typeof report.evidence === 'string' ? JSON.parse(report.evidence) : (report.evidence || []);

                      const reportTypeBadge = (type) => {
                        const types = {
                          'Fraudulent agent/landlord': 'hsl(0 70% 50%)',
                          'Fraudulent listing':        'hsl(0 70% 50%)',
                          'Harassment':                'hsl(25 95% 53%)',
                          'False information':         'hsl(40 92% 50%)',
                          'Scam':                      'hsl(0 84% 60%)',
                          'Other':                     'hsl(200 15% 45%)',
                        };
                        const color = types[type] ?? 'hsl(0 70% 50%)';
                        return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', fontSize: '0.72rem', fontWeight: '600', backgroundColor: color, color: 'white', borderRadius: '9999px' }}>{type}</span>;
                      };

                      const reportStatusBadge = (status) => {
                        const s = {
                          pending:       { label: 'Pending',       bg: 'hsl(40 30% 94%)',    color: 'hsl(200 25% 15%)', border: 'hsl(40 20% 88%)' },
                          reviewing:     { label: 'Reviewing',     bg: 'hsl(214 100% 95%)',  color: 'hsl(214 100% 40%)', border: 'hsl(214 100% 80%)' },
                          resolved:      { label: 'Resolved',      bg: 'hsl(152 60% 95%)',  color: 'hsl(152 60% 35%)', border: 'hsl(152 60% 80%)' },
                          dismissed:     { label: 'Dismissed',     bg: 'hsl(0 0% 95%)',     color: 'hsl(0 0% 45%)',    border: 'hsl(0 0% 80%)' },
                        };
                        const c = s[status] ?? s.pending;
                        return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', fontSize: '0.72rem', fontWeight: '500', backgroundColor: c.bg, color: c.color, borderRadius: '9999px', border: `1px solid ${c.border}` }}>{c.label}</span>;
                      };

                      return (
                        <div key={report.id} style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                          {/* Type + Status badges */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                            {reportTypeBadge(report.report_type)}
                            {reportStatusBadge(report.status ?? 'pending')}
                          </div>

                          {/* Reporter */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                            <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'hsl(0 70% 50% / 0.1)', color: 'hsl(0 70% 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '600', flexShrink: 0 }}>
                              {report.full_name?.[0] ?? 'R'}
                            </div>
                            <div>
                              <p style={{ fontSize: '0.85rem', fontWeight: '500', color: 'hsl(200 25% 15%)', margin: 0 }}>Reported by: {report.full_name ?? 'Anonymous'}</p>
                              <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', margin: 0 }}>{new Date(report.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>

                          {/* Description */}
                          <div style={{ backgroundColor: 'hsl(40 30% 97%)', padding: '0.875rem', borderRadius: '0.5rem', marginBottom: '1rem', borderLeft: '3px solid hsl(0 70% 50% / 0.3)' }}>
                            <p style={{ fontSize: '0.72rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.375rem' }}>Report Description</p>
                            <p style={{ color: 'hsl(200 25% 15%)', fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>{report.report_description ?? 'No description provided'}</p>
                          </div>

                          {/* Related Property */}
                          {report.rental && (
                            <div style={{ backgroundColor: 'hsl(174 62% 32% / 0.05)', padding: '0.875rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid hsl(174 62% 32% / 0.2)' }}>
                              <p style={{ fontSize: '0.72rem', fontWeight: '600', color: 'hsl(174 62% 32%)', marginBottom: '0.5rem' }}>Related Property</p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1 }}>
                                  <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.2rem' }}>{report.rental.title ?? 'Untitled Property'}</p>
                                  <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginBottom: '0.2rem' }}>{report.rental.address}, {report.rental.city}</p>
                                  <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>Property ID: #{report.rental_id}</p>
                                  {report.rental.agent && <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginTop: '0.2rem' }}>Agent: {report.rental.agent.fullName ?? 'Unknown'}</p>}
                                </div>
                                <button onClick={() => handleViewClick(report.rental)} style={{ padding: '0.3rem 0.65rem', border: '1px solid hsl(174 62% 32%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(174 62% 32%)', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)'}
                                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                                >View Property</button>
                              </div>
                            </div>
                          )}

                          {/* Evidence */}
                          {evidence.length > 0 && (
                            <div style={{ backgroundColor: 'hsl(40 30% 97%)', padding: '0.875rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                              <p style={{ fontSize: '0.72rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>Evidence Attached ({evidence.length})</p>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                {evidence.map((item, idx) => {
                                  const filename = typeof item === 'string' ? item.split('/').pop() : (item.name ?? `Evidence ${idx + 1}`);
                                  return (
                                    <a
                                      key={idx}
                                      href={`/admin/reports/${report.report_id || report.id}/evidence/${encodeURIComponent(filename)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        padding: '0.2rem 0.5rem',
                                        fontSize: '0.75rem',
                                        backgroundColor: 'white',
                                        color: 'hsl(214 100% 40%)',
                                        borderRadius: '0.375rem',
                                        border: '1px solid hsl(40 20% 88%)',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        display: 'inline-block'
                                      }}
                                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(214 100% 40% / 0.05)'}
                                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                                    >
                                      📎 {filename}
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Action buttons */}
                          {(!report.status || report.status === 'pending') && (
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <button onClick={() => router.put(`/admin/reports/${report.id}/status`, { status: 'reviewing' }, { onSuccess: () => showToast('Status Updated', 'Marked as reviewing.') })}
                                style={{ padding: '0.35rem 0.7rem', background: 'linear-gradient(135deg, hsl(214 100% 40%) 0%, hsl(214 100% 35%) 100%)', color: 'white', border: 'none', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer' }}>
                                Mark as Reviewing
                              </button>
                              <button onClick={() => { if (confirm('Resolve this report?')) router.put(`/admin/reports/${report.id}/status`, { status: 'resolved' }, { onSuccess: () => showToast('Report Resolved', 'Marked as resolved.') }); }}
                                style={{ padding: '0.35rem 0.7rem', background: 'linear-gradient(135deg, hsl(152 60% 40%) 0%, hsl(152 50% 35%) 100%)', color: 'white', border: 'none', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer' }}>
                                Resolve Report
                              </button>
                              <button onClick={() => { if (confirm('Dismiss this report?')) router.put(`/admin/reports/${report.id}/status`, { status: 'dismissed' }, { onSuccess: () => showToast('Report Dismissed', '') }); }}
                                style={{ padding: '0.35rem 0.7rem', border: '1px solid hsl(0 0% 70%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(0 0% 45%)', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(0 0% 95%)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                              >Dismiss Report</button>
                            </div>
                          )}
                          {report.status === 'reviewing' && (
                            <div style={{ padding: '0.625rem', backgroundColor: 'hsl(214 100% 95%)', borderRadius: '0.5rem', color: 'hsl(214 100% 40%)', fontSize: '0.8rem', fontWeight: '500', textAlign: 'center' }}>⏳ This report is under review</div>
                          )}
                          {report.status === 'resolved' && (
                            <div style={{ padding: '0.625rem', backgroundColor: 'hsl(152 60% 95%)', borderRadius: '0.5rem', color: 'hsl(152 60% 35%)', fontSize: '0.8rem', fontWeight: '500', textAlign: 'center' }}>✓ This report has been resolved</div>
                          )}
                          {report.status === 'dismissed' && (
                            <div style={{ padding: '0.625rem', backgroundColor: 'hsl(0 0% 95%)', borderRadius: '0.5rem', color: 'hsl(0 0% 45%)', fontSize: '0.8rem', fontWeight: '500', textAlign: 'center' }}>Report dismissed</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '3rem', textAlign: 'center' }}>
                    <AlertCircle style={{ height: '3rem', width: '3rem', color: 'hsl(200 15% 70%)', margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>No Reports Yet</h3>
                    <p style={{ color: 'hsl(200 15% 45%)' }}>There are no reports on the platform yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── VERIFICATIONS TAB ────────────────────────────────────────── */}
            {activeTab === 'verifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'hsl(200 25% 15%)' }}>Agent Verification Requests</h2>
                  <span style={{ padding: '0.5rem 1rem', backgroundColor: 'hsl(174 62% 32% / 0.1)', color: 'hsl(174 62% 32%)', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '600' }}>Total: {verifications?.length ?? 0}</span>
                </div>
                <ViewAgentVerifications verifications={verifications ?? []} />
              </div>
            )}

            {/* ── REVIEWS TAB ──────────────────────────────────────────────── */}
            {activeTab === 'reviews' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'hsl(200 25% 15%)' }}>All Platform Reviews ({filteredReviews.length})</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center' }}>
                  <input
                    type="search"
                    value={reviewsFilter}
                    onChange={(e) => setReviewsFilter(e.target.value)}
                    placeholder="Search reviews by guest, property, comment..."
                    style={{ width: '100%', minWidth: '260px', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid hsl(200 15% 85%)', fontSize: '0.9rem' }}
                  />
                  <select
                    value={reviewsRatingFilter}
                    onChange={(e) => setReviewsRatingFilter(e.target.value)}
                    style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid hsl(200 15% 85%)', fontSize: '0.9rem', minWidth: '160px' }}
                  >
                    <option value="all">All ratings</option>
                    <option value="5">5 stars</option>
                    <option value="4">4 stars</option>
                    <option value="3">3 stars</option>
                    <option value="2">2 stars</option>
                    <option value="1">1 star</option>
                  </select>
                </div>
                {filteredReviews.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                    {filteredReviews.map(review => (
                      <div key={review.id} style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.875rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.78rem', color: 'hsl(200 15% 45%)', marginBottom: '0.4rem' }}>Review for Property #{review.rental_id ?? 'Unknown'}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.4rem' }}>
                              <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'hsl(174 62% 32% / 0.1)', color: 'hsl(174 62% 32%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '600', flexShrink: 0 }}>
                                {review.full_name?.[0] ?? 'T'}
                              </div>
                              <div>
                                <p style={{ fontWeight: '600', color: 'hsl(200 25% 15%)', fontSize: '0.875rem', margin: 0 }}>{review.full_name ?? 'Anonymous'}</p>
                                <div style={{ display: 'flex', gap: '0.2rem' }}>{renderStars(review.overall_rating)}</div>
                              </div>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>

                        {/* Attribute pills */}
                        {(review.landlord_responsive || review.property_matched_description || review.fair_pricing || review.good_communication) && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.875rem' }}>
                            {review.landlord_responsive == 1 && <span style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem', backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', borderRadius: '9999px', border: '1px solid hsl(152 60% 85%)' }}>✓ Responsive Landlord</span>}
                            {review.property_matched_description == 1 && <span style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem', backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', borderRadius: '9999px', border: '1px solid hsl(152 60% 85%)' }}>✓ Accurate Description</span>}
                            {review.fair_pricing == 1 && <span style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem', backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', borderRadius: '9999px', border: '1px solid hsl(152 60% 85%)' }}>✓ Fair Pricing</span>}
                            {review.good_communication == 1 && <span style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem', backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', borderRadius: '9999px', border: '1px solid hsl(152 60% 85%)' }}>✓ Good Communication</span>}
                          </div>
                        )}

                        {/* Comment */}
                        {review.comments && (
                          <p style={{ color: 'hsl(200 15% 45%)', fontSize: '0.875rem', lineHeight: '1.5', padding: '0.75rem', backgroundColor: 'hsl(40 30% 97%)', borderRadius: '0.5rem', borderLeft: '3px solid hsl(174 62% 32% / 0.3)', marginBottom: '0.875rem' }}>"{review.comments}"</p>
                        )}

                        {/* Agent response */}
                        {review.response && (
                          <div style={{ backgroundColor: 'hsl(210 20% 98%)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '0.875rem', borderLeft: '3px solid hsl(174 62% 32%)' }}>
                            <p style={{ fontSize: '0.72rem', fontWeight: '600', color: 'hsl(174 62% 32%)', marginBottom: '0.25rem' }}>Response {review.response_person ? `by ${review.response_person}` : ''}</p>
                            <p style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)', lineHeight: '1.5', margin: 0 }}>{review.response}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {review.review_type === 'rent' && (
                            <button onClick={() => { const r = properties.find(p => p.id === review.rental_id); if (r) handleViewClick(r); }}
                              style={{ padding: '0.35rem 0.7rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(174 62% 32%)', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer' }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                            >View Property</button>
                          )}
                          <button onClick={() => { if (confirm('Delete this review? This cannot be undone.')) router.delete(`/admin/reviews/${review.id}`, { onSuccess: () => showToast('Review Deleted', 'Removed successfully.'), onError: () => showToast('Delete Failed', 'Please try again.', 'error') }); }}
                            style={{ padding: '0.35rem 0.7rem', border: '1px solid hsl(0 70% 50%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(0 70% 50%)', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(0 70% 50% / 0.05)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                          >Delete Review</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '3rem', textAlign: 'center' }}>
                    <Star style={{ height: '3rem', width: '3rem', color: 'hsl(200 15% 70%)', margin: '0 auto 1rem', fill: 'none' }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>No Reviews Yet</h3>
                    <p style={{ color: 'hsl(200 15% 45%)' }}>There are no reviews on the platform yet.</p>
                  </div>
                )}
              </div>
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
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', maxHeight: '90vh', overflow: 'auto', maxWidth: '60%', width: '100%', position: 'relative' }}>
              <button onClick={() => setShowAddListingModal(false)} style={{ position: 'sticky', top: 0, right: 0, padding: '1rem', border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: 'hsl(200 15% 45%)', float: 'right', zIndex: 10 }}>✕</button>
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
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', maxHeight: '90vh', overflow: 'auto', maxWidth: '60%', width: '100%', position: 'relative' }}>
              <button onClick={() => { setShowEditListingModal(false); setSelectedRental(null); }} style={{ position: 'sticky', top: 0, right: 0, padding: '1rem', border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: 'hsl(200 15% 45%)', float: 'right', zIndex: 10 }}>✕</button>
              <EditRentals agentData={agentData} setShowEditListingModal={setShowEditListingModal} rental={selectedRental} locations={locations} propertyTypes={propertyTypes} amenities={amenities} userRole="admin" />
            </div>
          </div>
        )}

        {selectedAgent && <VerifyAgentDialog agentItem={selectedAgent} isOpen={showDialog} onClose={() => setShowDialog(false)} />}

        {showViewModal && selectedRental && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', maxHeight: '90vh', overflow: 'auto', maxWidth: '60%', width: '100%' }}>
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
          <div style={{ position: 'fixed', top: '1rem', right: '1rem', backgroundColor: toast.variant === 'error' ? 'hsl(0 70% 50%)' : 'hsl(152 60% 40%)', color: 'white', padding: '1rem 1.5rem', borderRadius: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 9999, maxWidth: '400px', animation: 'slideIn 0.3s ease-out' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{toast.title}</div>
            <div style={{ fontSize: '0.875rem' }}>{toast.description}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;