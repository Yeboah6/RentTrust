import { useState } from "react";
import { Link, useForm, router, usePage } from "@inertiajs/react";
import Header from "@/Components/Layouts/Header";
import Footer from "@/Components/Layouts/Footer";
import AddRentalPage from "@/Components/Modules/AddRentals";
import EditRentals from "@/Components/Modules/EditRentals";
import VerificationRequestModal from "@/Components/Modules/Agent/VerificationRequestModal";
import ViewRentals from "@/Components/Modules/ViewRental";
import PricingModal from '@/Components/Modules/PricingModal';
import OverviewTab from '@/Components/Modules/Agent/AgentOverviewTab';
import ListingsTab from '@/Components/Modules/Agent/ListingsTab';
import InquiriesTab from '@/Components/Modules/Agent/InquiriesTab';
import ReviewsTab from '@/Components/Modules/Agent/ReviewsTab';
import ViewsTab from '@/Components/Modules/Agent/ViewsTab';
import BillingTab from '@/Components/Modules/Agent/BillingsTab';


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

const Settings = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BarChart = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const Eye = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const TrendingUp = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const Users = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const AgentDashboardPage = ({ agentData, rentals, reviews, inquiries = [], views = [], limitStatus, locations, propertyTypes, amenities }) => {
  const { billing, plans } = usePage().props;

  const [activeTab, setActiveTab] = useState("overview");
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [showEditListingModal, setShowEditListingModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedRentalForVerification, setSelectedRentalForVerification] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showToast, setShowToast] = useState(null);

  const { data, setData, put, processing, reset } = useForm({
    'response': "",
    'response_name': agentData?.name
  });

  const handleResponse = (e, reviewId) => {
    e.preventDefault();

    router.put('/response', {
      review_id: reviewId,
      response: responseText,
      response_name: agentData?.name
    }, {
      onSuccess: () => {
        setShowToast({ 
          message: "Response Submitted", 
          description: "Your response has been posted successfully.", 
          variant: "success" 
        });
        setTimeout(() => setShowToast(null), 3000);
        setResponseText("");
        setRespondingTo(null);

        console.log(agentData?.name, responseText);
      },
      onError: (errors) => {
        console.error('Submission errors:', errors);
        setShowToast({ 
          message: "Submission Failed", 
          description: "Please correct the errors and try again.", 
          variant: "error" 
        });
        setTimeout(() => setShowToast(null), 3000);
      },
    });
  };

  const handleEditClick = (rental) => {
    const selectedRentalData = rentals.find(r => r.id === rental.id);
    setSelectedRental(selectedRentalData);
    setShowEditListingModal(true);
  };

  const handleViewClick = (rental) => {
    const selectViewData = rentals.find(r => r.id === rental.id);
    setSelectedRental(selectViewData);
    setShowViewModal(true);
  };

  const handleFeatureClick = (property) => {
    if (window.confirm(`Are you sure you want to feature this ${property.purpose === 'sale' ? 'sale' : 'rental'} listing?`)) {
      router.post(`/api/listings/${property.id}/feature`, {}, {
        onSuccess: (response) => {
          setShowToast({
            message: response.data.message || "Listing featured successfully!",
            variant: "success"
          });
          setTimeout(() => setShowToast(null), 3000);
          // Optionally refresh the page or update the listing status
          window.location.reload();
        },
        onError: (errors) => {
          setShowToast({
            message: errors.message || "Failed to feature listing. Please try again.",
            variant: "error" 
          });
          setTimeout(() => setShowToast(null), 3000);
        },
      });
    }
  };

  const agent = {
    name: agentData?.name || "Unknown Agent",
    company: agentData?.company || null,
    status: agentData?.status || "unverified",
    avatar_url: null,
  };

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
      response_name: review.response_name || null,
      created_at: review.created_at || new Date().toISOString()
    }))
    : [];
// proxy.js:1
//  Uncaught Error: Attempting to use a disconnected port object
  const properties = rentals && rentals.length > 0
    ? rentals.map(rental => ({
      id: rental.id,
      title: rental.title || "Unknown",
      address: rental.address || "Unknown Address",
      purpose: rental.purpose || "rent", 
      city: rental.city || "Unknown City",
      rent_min: rental.rent_min || 0,
      rent_max: rental.rent_max || 0,
      sale_price: rental.sale_price || 0,
      effective_listing_status: rental.status || 'unverified',
      verification_status: rental.verification_status || null,
      total_reviews: rental.reviews_count || 0,
      views: rental.views_count || 0,
      inquiries: rental.inquiries_count || 0,
      is_featured: rental.is_featured,
      is_sold: rental.is_sold,
    }))
    : [];

  const viewedProperties = properties.filter(property => Number(property.views) > 0);

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

  const total = reviews.length;
    const avgRating = total > 0 
        ? (reviews.reduce((sum, r) => sum + (Number(r.overall_rating) || 0), 0) / total).toFixed(1) 
        : '0.0';

  const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalInquiries = properties.reduce((sum, p) => sum + (p.inquiries || 0), 0);
  const conversionRate = totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(1) : 0;

  const getStatusBadge = (status) => {
    if (status === "approved" || status === "verified" || status === "active") {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: 'clamp(0.25rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)', fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', fontWeight: '500', backgroundColor: 'hsl(152 60% 40%)', color: 'white', borderRadius: '9999px', gap: 'clamp(0.25rem, 1vw, 0.25rem)' }}>
          <CheckCircle style={{ height: 'clamp(0.75rem, 2vw, 0.75rem)', width: 'clamp(0.75rem, 2vw, 0.75rem)' }} />
          Verified
        </span>
      );
    } else if (status === "pending") {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: 'clamp(0.25rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)', fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', fontWeight: '500', backgroundColor: 'hsl(40 30% 94%)', color: 'hsl(200 25% 15%)', borderRadius: '9999px', gap: 'clamp(0.25rem, 1vw, 0.25rem)', border: '1px solid hsl(40 20% 88%)' }}>
          <Clock style={{ height: 'clamp(0.75rem, 2vw, 0.75rem)', width: 'clamp(0.75rem, 2vw, 0.75rem)' }} />
          Pending
        </span>
      );
    } else if (status === "rejected") {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: 'clamp(0.25rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)', fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', fontWeight: '500', backgroundColor: 'hsl(0 70% 50%)', color: 'white', borderRadius: '9999px', gap: 'clamp(0.25rem, 1vw, 0.25rem)' }}>
          <AlertCircle style={{ height: 'clamp(0.75rem, 2vw, 0.75rem)', width: 'clamp(0.75rem, 2vw, 0.75rem)' }} />
          Rejected
        </span>
      );
    } else if (status === "rented") {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: 'clamp(0.25rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)', fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', fontWeight: '500', backgroundColor: 'hsl(252 60% 40%)', color: 'white', borderRadius: '9999px', gap: 'clamp(0.25rem, 1vw, 0.25rem)' }}>
          <CheckCircle style={{ height: 'clamp(0.75rem, 2vw, 0.75rem)', width: 'clamp(0.75rem, 2vw, 0.75rem)' }} />
          Rented
        </span>
      );
    } else if (status === "sold") {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: 'clamp(0.25rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)', fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', fontWeight: '500', backgroundColor: 'hsl(240 20% 93%)', color: 'hsl(240 16% 20%)', borderRadius: '9999px', gap: 'clamp(0.25rem, 1vw, 0.25rem)', border: '1px solid hsl(40 20% 88%)' }}>
          <CheckCircle style={{ height: 'clamp(0.75rem, 2vw, 0.75rem)', width: 'clamp(0.75rem, 2vw, 0.75rem)' }} />
          Sold
        </span>
      );
    } else if (status === "inactive") {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: 'clamp(0.25rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)', fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', fontWeight: '500', backgroundColor: 'hsl(206 16% 94%)', color: 'hsl(200 15% 45%)', borderRadius: '9999px', gap: 'clamp(0.25rem, 1vw, 0.25rem)', border: '1px solid hsl(40 20% 88%)' }}>
          <AlertCircle style={{ height: 'clamp(0.75rem, 2vw, 0.75rem)', width: 'clamp(0.75rem, 2vw, 0.75rem)' }} />
          Inactive
        </span>
      );
    }

    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', padding: 'clamp(0.25rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)', fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', fontWeight: '500', backgroundColor: 'white', color: 'hsl(200 15% 45%)', borderRadius: '9999px', gap: 'clamp(0.25rem, 1vw, 0.25rem)', border: '1px solid hsl(40 20% 88%)' }}>
        <AlertCircle style={{ height: 'clamp(0.75rem, 2vw, 0.75rem)', width: 'clamp(0.75rem, 2vw, 0.75rem)' }} />
        Unverified
      </span>
    );
  };

  const getVerificationButtonText = (listingStatus, verificationStatus) => {
    if (verificationStatus === 'pending') {
      return '⏳ Verification Pending';
    }

    if (listingStatus === 'pending') {
      return 'Request Verification';
    }

    if ((listingStatus === 'approved' || listingStatus === 'verified') && verificationStatus === 'verified') {
      return 'Approved';
    }

    return 'Request Verification';
  };

  const isVerificationButtonDisabled = (listingStatus, verificationStatus) => {
    return verificationStatus === 'pending' || ((listingStatus === 'approved' || listingStatus === 'verified') && verificationStatus === 'verified');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        h1, h2, h3, h4, h5, h6 { font-weight: 600; }
        textarea { resize: vertical; }
        @media (max-width: 768px) {
          .profile-header-container { flex-direction: column !important; align-items: flex-start !important; }
          .profile-avatar { margin-bottom: clamp(1rem, 3vw, 1rem) !important; }
          .settings-link { align-self: stretch !important; margin-top: 1rem !important; width: 100% !important; }
          .tabs-grid { grid-template-columns: 1fr 1fr !important; gap: 0.5rem !important; }
          .tabs-grid button { min-height: 44px !important; padding: 0.75rem !important; font-size: 0.875rem !important; }
          .listing-grid { grid-template-columns: 1fr !important; }
          .review-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.75rem !important; }
          .stats-grid > div { padding: 1rem !important; }
          .modal-content { max-width: 95% !important; margin: 0.5rem; padding: 1rem !important; }
          .action-button { min-height: 44px !important; padding: 0.75rem 1rem !important; font-size: 0.875rem !important; }
          .listing-card { padding: 1rem !important; }
          .listing-card button { min-height: 40px !important; margin-bottom: 0.5rem !important; }
          .review-card { padding: 1rem !important; }
          .inquiry-card { padding: 1rem !important; }
          .mobile-stack { flex-direction: column !important; gap: 0.75rem !important; }
          .mobile-full-width { width: 100% !important; }
          .mobile-text-center { text-align: center !important; }
          .mobile-justify-center { justify-content: center !important; }
          .mobile-hide { display: none !important; }
          .mobile-compact { margin-bottom: 0.5rem !important; }
          .mobile-touch-target { min-height: 44px !important; min-width: 44px !important; }
          .mobile-form-spacing { gap: 1rem !important; }
          .mobile-button-group { flex-direction: column !important; width: 100% !important; }
          .mobile-button-group button { width: 100% !important; margin-bottom: 0.5rem !important; }
          .mobile-button-group button:last-child { margin-bottom: 0 !important; }
        }
        @media (max-width: 480px) {
          .tabs-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .profile-header-container { text-align: center !important; }
          .modal-content { max-width: 98% !important; margin: 0.25rem; padding: 0.75rem !important; }
          .action-button { font-size: 0.8125rem !important; }
          .mobile-extra-compact { padding: 0.5rem !important; margin-bottom: 0.25rem !important; }
        }
        @media (min-width: 769px) and (max-width: 1023px) {
          .profile-header-container { flex-direction: row !important; }
          .settings-link { align-self: flex-start !important; margin-top: 0 !important; }
          .tabs-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .listing-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .review-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 1024px) { 
          .tabs-grid { grid-template-columns: repeat(6, 1fr) !important; }
          .listing-grid { grid-template-columns: repeat(4, 1fr) !important; } 
          .review-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        .toast-container { position: fixed; top: 1rem; right: 1rem; z-index: 1000; max-width: 24rem; width: 100%; }
        .toast-success { background-color: hsl(152 60% 40%); color: white; }
        .toast-error { background-color: hsl(0 72% 51%); color: white; }
        .action-button { min-height: 44px; -webkit-tap-highlight-color: transparent; }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1, padding: 'clamp(1.5rem, 4vw, 2rem) clamp(0.75rem, 3vw, 1rem)' }}>
          <div className="container mx-auto" style={{ maxWidth: '1200px' }}>

            {/* Profile Header */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
              <div className="profile-header-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(1rem, 3vw, 1.5rem)', flex: 1 }}>
                  <div className="profile-avatar" style={{ width: 'clamp(3rem, 12vw, 4.5rem)', height: 'clamp(3rem, 12vw, 4.5rem)', borderRadius: '50%', backgroundColor: 'hsl(174 62% 32% / 0.1)', color: 'hsl(174 62% 32%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', fontWeight: '600', flexShrink: 0 }}>
                    {agent.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.75rem)', marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)', flexWrap: 'wrap' }}>
                      <h1 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1.125rem, 4vw, 1.5rem)', fontWeight: '700', lineHeight: '1.2' }}>{agent.name}</h1>
                      {getStatusBadge(agent.status)}
                    </div>
                    {agent.company && <p style={{ color: 'hsl(200 15% 45%)', marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>{agent.company}</p>}
                    <div style={{ display: 'flex', gap: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.25rem, 1vw, 0.375rem)', color: 'hsl(200 15% 45%)' }}>
                        <Home style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />
                        {properties.length} {properties.length === 1 ? 'Listing' : 'Listings'}
                        {properties.filter(p => p.purpose === 'rent').length > 0 && properties.filter(p => p.purpose === 'sale').length > 0 && (
                          <span style={{ fontSize: '0.75rem', color: 'hsl(200 15% 55%)' }}>
                            ({properties.filter(p => p.purpose === 'rent').length} rent · {properties.filter(p => p.purpose === 'sale').length} sale)
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.25rem, 1vw, 0.375rem)', color: 'hsl(200 15% 45%)' }}>
                        <Star style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />
                        {avgRating} ({reviews.length} reviews)
                      </div>
                    </div>
                  </div>
                </div>
                <Link className="settings-link action-button" href={'settings'} style={{ padding: 'clamp(0.5rem, 2vw, 0.5rem) clamp(1rem, 3vw, 1rem)', border: '1px solid hsl(40 20% 88%)', borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)', backgroundColor: 'white', color: 'hsl(174 62% 32%)', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(0.5rem, 2vw, 0.5rem)', textDecoration: 'none', fontSize: 'clamp(0.875rem, 2vw, 0.875rem)', transition: 'all 0.2s', whiteSpace: 'nowrap', height: 'fit-content' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'hsl(40 30% 96%)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                >
                  <Settings style={{ height: 'clamp(1rem, 3vw, 1rem)', width: 'clamp(1rem, 3vw, 1rem)' }} />
                  Settings
                </Link>
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div className="tabs-grid" style={{ display: 'grid', gap: 'clamp(0.25rem, 1vw, 0.5rem)', backgroundColor: 'hsl(40 30% 94%)', padding: 'clamp(0.25rem, 1vw, 0.25rem)', borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
                {['overview', 'listings', 'inquiries', 'reviews', 'views', 'billing'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className="action-button" style={{ padding: 'clamp(0.5rem, 2vw, 0.5rem) clamp(0.75rem, 3vw, 1rem)', border: 'none', borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)', backgroundColor: activeTab === tab ? 'white' : 'transparent', color: activeTab === tab ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(0.25rem, 1vw, 0.5rem)', transition: 'all 0.2s', boxShadow: activeTab === tab ? '0 1px 2px 0 hsl(200 25% 15% / 0.05)' : 'none', textTransform: 'capitalize', fontSize: 'clamp(0.875rem, 2vw, 0.875rem)', whiteSpace: 'nowrap' }}>
                    {tab === 'overview' && <BarChart style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />}
                    {tab === 'listings' && <Home style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />}
                    {tab === 'inquiries' && <MessageSquare style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />}
                    {tab === 'reviews' && <MessageSquare style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />}
                    {tab === 'views' && <Eye style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />}
                    {tab === 'billing' && <svg style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                    {tab}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                  <OverviewTab 
                      properties={properties}
                      totalViews={totalViews}
                      totalInquiries={totalInquiries}
                      conversionRate={conversionRate}
                      limitStatus={limitStatus}
                      getStatusBadge={getStatusBadge}
                      onViewAllListings={() => setActiveTab('listings')}
                  />
              )}

              {/* Listings Tab */}
              {activeTab === 'listings' && (
                  <ListingsTab 
                      properties={properties}
                      onAddListing={() => setShowAddListingModal(true)}
                      onView={handleViewClick}
                      onEdit={handleEditClick}
                      onVerify={(property) => {
                          setSelectedRentalForVerification(property);
                          setShowVerificationModal(true);
                      }}
                      getVerificationButtonText={getVerificationButtonText}
                      isVerificationButtonDisabled={isVerificationButtonDisabled}
                  />
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                  <ReviewsTab 
                      reviews={formattedReviews}
                      respondingTo={respondingTo}
                      setRespondingTo={setRespondingTo}
                      responseText={responseText}
                      setResponseText={setResponseText}
                      onSubmitResponse={(reviewId) => handleResponse({ preventDefault: () => {} }, reviewId)}
                      processing={processing}
                      onView={(review) => {
                          const rental = rentals?.find(r => r.id === review.rental_id);
                          if (rental) {
                              handleViewClick(rental);
                          }
                      }}
                      properties={properties}
                  />
              )}

              {/* Inquiries Tab */}
              {activeTab === 'inquiries' && (
                  <InquiriesTab 
                      inquiries={inquiries || []}
                      rentals={rentals || []}
                      onView={(inquiry) => {
                          const rental = rentals?.find(r => r.id === inquiry.rental_id);
                          if (rental) {
                              handleViewClick(rental);
                          }
                      }}
                  />
              )}

              {/* Views Tab */}
              {activeTab === 'views' && (
                  <ViewsTab 
                      properties={properties}
                      onView={handleViewClick}
                  />
              )}

              {/* ── Billing Tab ──────────────────────────────────────────────────── */}
              {activeTab === 'billing' && (
                  <BillingTab 
                      billing={billing}
                      plans={plans ?? []}
                      onUpgrade={() => setShowPricingModal(true)}
                  />
              )}

            </div>
          </div>
        </main>

        <Footer />

        {/* Toast */}
        {showToast && (
          <div className="toast-container">
            <div className={`toast-${showToast.variant}`} style={{ padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>{showToast.message}</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>{showToast.description}</p>
            </div>
          </div>
        )}

        {/* ── Pricing Modal — now receives plans from Inertia props ─────────── */}
        {showPricingModal && (
          <PricingModal
            isOpen={showPricingModal}
            onClose={() => setShowPricingModal(false)}
            plans={plans ?? []}
          />
        )}

        {/* Add Listing Modal */}
        {showAddListingModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 'clamp(0.5rem, 2vw, 1rem)' }}>
            <div className="modal-content" style={{ backgroundColor: 'white', borderRadius: 'clamp(0.75rem, 2vw, 1rem)', maxHeight: '90vh', overflow: 'auto', maxWidth: 'clamp(90%, 95vw, 60%)', width: '100%', position: 'relative' }}>
              <button onClick={() => setShowAddListingModal(false)} className="action-button" style={{ position: 'sticky', top: 0, right: 0, padding: 'clamp(0.75rem, 2vw, 1rem)', border: 'none', background: 'transparent', fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', cursor: 'pointer', color: 'hsl(200 15% 45%)', float: 'right', zIndex: 10 }}>✕</button>
              <AddRentalPage agentData={agentData} setShowAddListingModal={setShowAddListingModal} locations={locations} propertyTypes={propertyTypes} amenities={amenities} />
            </div>
          </div>
        )}

        {/* Edit Listing Modal */}
        {showEditListingModal && selectedRental && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 'clamp(0.5rem, 2vw, 1rem)' }}>
            <div className="modal-content" style={{ backgroundColor: 'white', borderRadius: 'clamp(0.75rem, 2vw, 1rem)', maxHeight: '90vh', overflow: 'auto', maxWidth: 'clamp(90%, 95vw, 60%)', width: '100%', position: 'relative' }}>
              <button onClick={() => { setShowEditListingModal(false); setSelectedRental(null); }} className="action-button" style={{ position: 'sticky', top: 0, right: 0, padding: 'clamp(0.75rem, 2vw, 1rem)', border: 'none', background: 'transparent', fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', cursor: 'pointer', color: 'hsl(200 15% 45%)', float: 'right', zIndex: 10 }}>✕</button>
              <EditRentals agentData={agentData} setShowEditListingModal={setShowEditListingModal} rental={selectedRental} locations={locations} propertyTypes={propertyTypes} amenities={amenities} />
            </div>
          </div>
        )}

        {/* Verification Modal */}
        <VerificationRequestModal isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)} agentData={agentData} selectedRental={selectedRentalForVerification} />

        {/* View Rental Modal */}
        {showViewModal && selectedRental && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 'clamp(0.5rem, 2vw, 1rem)' }}>
            <div className="modal-content" style={{ backgroundColor: 'white', borderRadius: 'clamp(0.75rem, 2vw, 1rem)', maxHeight: '90vh', overflow: 'auto', maxWidth: 'clamp(90%, 95vw, 60%)', width: '100%', position: 'relative' }}>
              <button onClick={() => setShowViewModal(false)} className="action-button" style={{ position: 'sticky', top: 0, right: 0, padding: 'clamp(0.75rem, 2vw, 1rem)', border: 'none', background: 'transparent', fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', cursor: 'pointer', color: 'hsl(200 15% 45%)', float: 'right', zIndex: 10 }}>✕</button>
              <ViewRentals rental={selectedRental} setShowViewModal={setShowViewModal} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AgentDashboardPage;