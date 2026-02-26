// import { useState } from "react";
// import { Link, useForm, router } from "@inertiajs/react";
// import Header from "@/Components/Layouts/Header";
// import Footer from "@/Components/Layouts/Footer";
// import AddRentalPage from "@/Components/Modules/AddRentals";
// import EditRentals from "@/Components/Modules/EditRentals";
// import VerificationRequestModal from "@/Components/Modules/VerifyRentals";
// import ViewRentals from "@/Components/Modules/ViewRental";
// import BillingModule from "@/Components/Modules/BillingDashboard";
// import PricingModal from '@/Components/Modules/PricingModal';

// // Icon components
// const Shield = ({ style }) => (
//   <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//   </svg>
// );

// const Home = ({ style }) => (
//   <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//   </svg>
// );

// const Star = ({ style }) => (
//   <svg style={style} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//   </svg>
// );

// const MessageSquare = ({ style }) => (
//   <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//   </svg>
// );

// const CheckCircle = ({ style }) => (
//   <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const Clock = ({ style }) => (
//   <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const AlertCircle = ({ style }) => (
//   <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const Settings = ({ style }) => (
//   <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );

// const BarChart = ({ style }) => (
//   <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//   </svg>
// );

// const Eye = ({ style }) => (
//   <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//   </svg>
// );

// const TrendingUp = ({ style }) => (
//   <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//   </svg>
// );

// const Users = ({ style }) => (
//   <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//   </svg>
// );

// const AgentDashboardPage = ({ agentData, rentals, reviews }) => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [respondingTo, setRespondingTo] = useState(null);
//   const [responseText, setResponseText] = useState("");
//   const [showAddListingModal, setShowAddListingModal] = useState(false);
//   const [showEditListingModal, setShowEditListingModal] = useState(false);
//   const [selectedRental, setSelectedRental] = useState(null);
//   const [showVerificationModal, setShowVerificationModal] = useState(false);
//   const [selectedRentalForVerification, setSelectedRentalForVerification] = useState(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showPricingModal, setShowPricingModal] = useState(false);
//   const [showToast, setShowToast] = useState(null);

//   const { data, setData, put, processing, reset } = useForm({
//     'response': "",
//     'response_name': agentData?.fullName
//   });

//   const handleResponse = (e, reviewId) => {
//     e.preventDefault();

//     router.put('/response', {
//       review_id: reviewId,
//       response: responseText,
//       response_person: agentData.fullName
//     }, {
//       onSuccess: () => {
//         setShowToast({ 
//           message: "Response Submitted", 
//           description: "Your response has been posted successfully.", 
//           variant: "success" 
//         });
//         setTimeout(() => setShowToast(null), 3000);
//         setResponseText("");
//         setRespondingTo(null);
//       },
//       onError: (errors) => {
//         console.error('Submission errors:', errors);
//         setShowToast({ 
//           message: "Submission Failed", 
//           description: "Please correct the errors and try again.", 
//           variant: "error" 
//         });
//         setTimeout(() => setShowToast(null), 3000);
//       },
//     });
//   };

//   const handleEditClick = (rental) => {
//     const selectedRentalData = rentals.find(r => r.id === rental.id);
//     setSelectedRental(selectedRentalData);
//     setShowEditListingModal(true);
//   };

//   const handleViewClick = (rental) => {
//     const selectViewData = rentals.find(r => r.id === rental.id);
//     setSelectedRental(selectViewData);
//     setShowViewModal(true);
//   };

//   const agent = {
//     name: agentData?.name || "Unknown Agent",
//     company: agentData?.company || null,
//     status: agentData?.status || "unverified",
//     avatar_url: null,
//     average_rating: 4.7,
//   };

//   const formattedReviews = reviews && reviews.length > 0
//     ? reviews.map(review => ({
//       id: review.id,
//       rental_id: review.rental_id || "Unknown",
//       overall_rating: review.overall_rating || 0,
//       landlord_responsive: review.landlord_responsive || 0,
//       property_matched_description: review.property_matched_description || 0,
//       fair_pricing: review.fair_pricing || 0,
//       good_communication: review.good_communication || 0,
//       comments: review.comments || null,
//       full_name: review.full_name || "Anonymous",
//       response: review.response || null,
//       response_person: review.response_person || null,
//       created_at: review.created_at || new Date().toISOString()
//     }))
//     : [];

//   const properties = rentals && rentals.length > 0
//     ? rentals.map(rental => ({
//       id: rental.id,
//       title: rental.title || "Unknown",
//       address: rental.address || "Unknown Address",
//       city: rental.city || "Unknown City",
//       rent_min: rental.rent_min || 0,
//       rent_max: rental.rent_max || 0,
//       listing_status: rental.status || "unverified",
//       total_reviews: 0,
//       views: Math.floor(Math.random() * 100), // Mock data
//       inquiries: Math.floor(Math.random() * 10),
//     }))
//     : [];

//   const renderStars = (rating) => {
//     const ratingValue = Math.floor(rating || 0);
//     return Array.from({ length: 5 }).map((_, i) => (
//       <Star
//         key={i}
//         style={{
//           height: 'clamp(0.875rem, 2.5vw, 1rem)',
//           width: 'clamp(0.875rem, 2.5vw, 1rem)',
//           color: i < ratingValue ? 'hsl(38 92% 50%)' : 'hsl(200 15% 45%)',
//           fill: i < ratingValue ? 'hsl(38 92% 50%)' : 'none'
//         }}
//       />
//     ));
//   };

//   const calculateAverageRating = () => {
//     if (!formattedReviews || formattedReviews.length === 0) return 4.7;
//     const sum = formattedReviews.reduce((acc, review) => acc + (review.overall_rating || 0), 0);
//     return (sum / formattedReviews.length).toFixed(1);
//   };

//   const agentWithRealData = {
//     ...agent,
//     average_rating: calculateAverageRating(),
//     total_reviews: formattedReviews.length
//   };

//   // Calculate totals for overview
//   const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
//   const totalInquiries = properties.reduce((sum, p) => sum + (p.inquiries || 0), 0);
//   const conversionRate = totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(1) : 0;

//   const getStatusBadge = (status) => {
//     if (status === "verified") {
//       return (
//         <span style={{
//           display: 'inline-flex',
//           alignItems: 'center',
//           padding: 'clamp(0.25rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)',
//           fontSize: 'clamp(0.75rem, 2vw, 0.75rem)',
//           fontWeight: '500',
//           backgroundColor: 'hsl(152 60% 40%)',
//           color: 'white',
//           borderRadius: '9999px',
//           gap: 'clamp(0.25rem, 1vw, 0.25rem)'
//         }}>
//           <CheckCircle style={{ 
//             height: 'clamp(0.75rem, 2vw, 0.75rem)', 
//             width: 'clamp(0.75rem, 2vw, 0.75rem)' 
//           }} />
//           Verified
//         </span>
//       );
//     } else if (status === "pending") {
//       return (
//         <span style={{
//           display: 'inline-flex',
//           alignItems: 'center',
//           padding: 'clamp(0.25rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)',
//           fontSize: 'clamp(0.75rem, 2vw, 0.75rem)',
//           fontWeight: '500',
//           backgroundColor: 'hsl(40 30% 94%)',
//           color: 'hsl(200 25% 15%)',
//           borderRadius: '9999px',
//           gap: 'clamp(0.25rem, 1vw, 0.25rem)',
//           border: '1px solid hsl(40 20% 88%)'
//         }}>
//           <Clock style={{ 
//             height: 'clamp(0.75rem, 2vw, 0.75rem)', 
//             width: 'clamp(0.75rem, 2vw, 0.75rem)' 
//           }} />
//           Pending
//         </span>
//       );
//     } else {
//       return (
//         <span style={{
//           display: 'inline-flex',
//           alignItems: 'center',
//           padding: 'clamp(0.25rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)',
//           fontSize: 'clamp(0.75rem, 2vw, 0.75rem)',
//           fontWeight: '500',
//           backgroundColor: 'white',
//           color: 'hsl(200 15% 45%)',
//           borderRadius: '9999px',
//           gap: 'clamp(0.25rem, 1vw, 0.25rem)',
//           border: '1px solid hsl(40 20% 88%)'
//         }}>
//           <AlertCircle style={{ 
//             height: 'clamp(0.75rem, 2vw, 0.75rem)', 
//             width: 'clamp(0.75rem, 2vw, 0.75rem)' 
//           }} />
//           Unverified
//         </span>
//       );
//     }
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
//         * {
//           font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
//         }
//         h1, h2, h3, h4, h5, h6 {
//           font-weight: 600;
//         }
//         textarea {
//           resize: vertical;
//         }

//         /* Responsive styles */
//         @media (max-width: 768px) {
//           .profile-header-container {
//             flex-direction: column !important;
//             align-items: flex-start !important;
//           }
          
//           .profile-avatar {
//             margin-bottom: clamp(1rem, 3vw, 1rem) !important;
//           }
          
//           .settings-link {
//             align-self: stretch !important;
//             margin-top: 1rem !important;
//             width: 100% !important;
//           }
          
//           .tabs-grid {
//             grid-template-columns: 1fr !important;
//           }
          
//           .listing-grid {
//             grid-template-columns: 1fr !important;
//           }
          
//           .review-grid {
//             grid-template-columns: 1fr !important;
//           }

//           .stats-grid {
//             grid-template-columns: repeat(2, 1fr) !important;
//           }
          
//           .modal-content {
//             max-width: 95% !important;
//             margin: 0.5rem;
//           }
//         }

//         @media (min-width: 769px) {
//           .profile-header-container {
//             flex-direction: row !important;
//           }
          
//           .settings-link {
//             align-self: flex-start !important;
//             margin-top: 0 !important;
//           }
          
//           .tabs-grid {
//             grid-template-columns: repeat(4, 1fr) !important;
//           }
          
//           .listing-grid {
//             grid-template-columns: repeat(3, 1fr) !important;
//           }
          
//           .review-grid {
//             grid-template-columns: repeat(3, 1fr) !important;
//           }

//           .stats-grid {
//             grid-template-columns: repeat(4, 1fr) !important;
//           }
//         }

//         @media (min-width: 1024px) {
//           .listing-grid {
//             grid-template-columns: repeat(4, 1fr) !important;
//           }
//         }

//         /* Toast notification */
//         .toast-container {
//           position: fixed;
//           top: 1rem;
//           right: 1rem;
//           z-index: 1000;
//           max-width: 24rem;
//           width: 100%;
//         }

//         .toast-success {
//           background-color: hsl(152 60% 40%);
//           color: white;
//         }

//         .toast-error {
//           background-color: hsl(0 72% 51%);
//           color: white;
//         }

//         /* Mobile touch optimization */
//         .action-button {
//           min-height: 44px;
//           -webkit-tap-highlight-color: transparent;
//         }
//       `}</style>

//       <div style={{ 
//         minHeight: '100vh', 
//         display: 'flex', 
//         flexDirection: 'column', 
//         backgroundColor: 'hsl(40 33% 98%)' 
//       }}>
//         <Header />

//         <main style={{ 
//           flex: 1, 
//           padding: 'clamp(1.5rem, 4vw, 2rem) clamp(0.75rem, 3vw, 1rem)' 
//         }}>
//           <div className="container mx-auto" style={{ maxWidth: '1200px' }}>
//             {/* Profile Header */}
//             <div style={{ 
//               display: 'flex', 
//               flexDirection: 'column', 
//               gap: '1.5rem', 
//               marginBottom: 'clamp(1.5rem, 4vw, 2rem)' 
//             }}>
//               <div className="profile-header-container" style={{
//                 display: 'flex',
//                 flexWrap: 'wrap',
//                 justifyContent: 'space-between',
//                 alignItems: 'flex-start',
//                 gap: 'clamp(1rem, 3vw, 1.5rem)'
//               }}>
//                 <div style={{ 
//                   display: 'flex', 
//                   alignItems: 'flex-start',
//                   gap: 'clamp(1rem, 3vw, 1.5rem)',
//                   flex: 1
//                 }}>
//                   <div className="profile-avatar" style={{
//                     width: 'clamp(3rem, 12vw, 4.5rem)',
//                     height: 'clamp(3rem, 12vw, 4.5rem)',
//                     borderRadius: '50%',
//                     backgroundColor: 'hsl(174 62% 32% / 0.1)',
//                     color: 'hsl(174 62% 32%)',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
//                     fontWeight: '600',
//                     flexShrink: 0
//                   }}>
//                     {agent.name[0]}
//                   </div>
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div style={{ 
//                       display: 'flex', 
//                       alignItems: 'center', 
//                       gap: 'clamp(0.5rem, 2vw, 0.75rem)', 
//                       marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)', 
//                       flexWrap: 'wrap' 
//                     }}>
//                       <h1 style={{ 
//                         color: 'hsl(200 25% 15%)',
//                         fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
//                         fontWeight: '700',
//                         lineHeight: '1.2'
//                       }}>
//                         {agent.name}
//                       </h1>
//                       {getStatusBadge(agent.status)}
//                     </div>
//                     {agent.company && (
//                       <p style={{ 
//                         color: 'hsl(200 15% 45%)', 
//                         marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)', 
//                         fontSize: 'clamp(0.875rem, 2vw, 1rem)' 
//                       }}>
//                         {agent.company}
//                       </p>
//                     )}
//                     <div style={{ 
//                       display: 'flex', 
//                       gap: 'clamp(0.75rem, 2vw, 1rem)', 
//                       fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
//                       flexWrap: 'wrap' 
//                     }}>
//                       <div style={{ 
//                         display: 'flex', 
//                         alignItems: 'center', 
//                         gap: 'clamp(0.25rem, 1vw, 0.375rem)', 
//                         color: 'hsl(200 15% 45%)' 
//                       }}>
//                         <Home style={{ 
//                           height: 'clamp(0.875rem, 2.5vw, 1rem)', 
//                           width: 'clamp(0.875rem, 2.5vw, 1rem)' 
//                         }} />
//                         {properties.length} {properties.length === 1 ? 'Listing' : 'Listings'}
//                       </div>
//                       <div style={{ 
//                         display: 'flex', 
//                         alignItems: 'center', 
//                         gap: 'clamp(0.25rem, 1vw, 0.375rem)', 
//                         color: 'hsl(200 15% 45%)' 
//                       }}>
//                         <Star style={{ 
//                           height: 'clamp(0.875rem, 2.5vw, 1rem)', 
//                           width: 'clamp(0.875rem, 2.5vw, 1rem)' 
//                         }} />
//                         {agent.average_rating} ({reviews.length} reviews)
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Settings Link - Properly positioned */}
//                 <Link 
//                   className="settings-link action-button"
//                   href={'settings'}
//                   style={{
//                     padding: 'clamp(0.5rem, 2vw, 0.5rem) clamp(1rem, 3vw, 1rem)',
//                     border: '1px solid hsl(40 20% 88%)',
//                     borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
//                     backgroundColor: 'white',
//                     color: 'hsl(174 62% 32%)',
//                     fontWeight: '500',
//                     cursor: 'pointer',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     gap: 'clamp(0.5rem, 2vw, 0.5rem)',
//                     textDecoration: 'none',
//                     fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
//                     transition: 'all 0.2s',
//                     whiteSpace: 'nowrap',
//                     height: 'fit-content'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = 'hsl(40 30% 96%)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = 'white';
//                   }}
//                 >
//                   <Settings style={{ 
//                     height: 'clamp(1rem, 3vw, 1rem)', 
//                     width: 'clamp(1rem, 3vw, 1rem)' 
//                   }} />
//                   Settings
//                 </Link>
//               </div>
//             </div>

//             {/* Tabs */}
//             <div>
//               <div className="tabs-grid" style={{
//                 display: 'grid',
//                 gap: 'clamp(0.25rem, 1vw, 0.5rem)',
//                 backgroundColor: 'hsl(40 30% 94%)',
//                 padding: 'clamp(0.25rem, 1vw, 0.25rem)',
//                 borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
//                 marginBottom: 'clamp(1.5rem, 4vw, 2rem)'
//               }}>
//                 {['overview', 'listings', 'reviews', 'billing'].map((tab) => (
//                   <button
//                     key={tab}
//                     onClick={() => setActiveTab(tab)}
//                     className="action-button"
//                     style={{
//                       padding: 'clamp(0.5rem, 2vw, 0.5rem) clamp(0.75rem, 3vw, 1rem)',
//                       border: 'none',
//                       borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)',
//                       backgroundColor: activeTab === tab ? 'white' : 'transparent',
//                       color: activeTab === tab ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
//                       fontWeight: '500',
//                       cursor: 'pointer',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       gap: 'clamp(0.25rem, 1vw, 0.5rem)',
//                       transition: 'all 0.2s',
//                       boxShadow: activeTab === tab ? '0 1px 2px 0 hsl(200 25% 15% / 0.05)' : 'none',
//                       textTransform: 'capitalize',
//                       fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
//                       whiteSpace: 'nowrap'
//                     }}
//                   >
//                     {tab === 'overview' && <BarChart style={{ 
//                       height: 'clamp(0.875rem, 2.5vw, 1rem)', 
//                       width: 'clamp(0.875rem, 2.5vw, 1rem)' 
//                     }} />}
//                     {tab === 'listings' && <Home style={{ 
//                       height: 'clamp(0.875rem, 2.5vw, 1rem)', 
//                       width: 'clamp(0.875rem, 2.5vw, 1rem)' 
//                     }} />}
//                     {tab === 'reviews' && <MessageSquare style={{ 
//                       height: 'clamp(0.875rem, 2.5vw, 1rem)', 
//                       width: 'clamp(0.875rem, 2.5vw, 1rem)' 
//                     }} />}
//                     {tab === 'billing' && (
//                       <svg style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//                       </svg>
//                     )}
//                     {tab}
//                   </button>
//                 ))}
//               </div>

//               {/* Overview Tab */}
//               {activeTab === 'overview' && (
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 4vw, 2rem)' }}>
                  
//                   {/* Stats Grid */}
//                   <div className="stats-grid" style={{
//                     display: 'grid',
//                     gap: 'clamp(0.75rem, 2vw, 1.25rem)'
//                   }}>
//                     <div style={{
//                       backgroundColor: 'white',
//                       border: '1px solid hsl(40 20% 88%)',
//                       borderRadius: '0.75rem',
//                       padding: 'clamp(1rem, 3vw, 1.25rem)',
//                       boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.08)',
//                     }}>
//                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
//                         <div style={{
//                           width: '2.25rem',
//                           height: '2.25rem',
//                           borderRadius: '0.5rem',
//                           background: 'hsl(174 62% 32% / 0.1)',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                         }}>
//                           <Home style={{ width: '1.125rem', height: '1.125rem', color: 'hsl(174 62% 32%)' }} />
//                         </div>
//                       </div>
//                       <p style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: '700', color: 'hsl(200 25% 15%)', margin: 0, lineHeight: 1 }}>
//                         {properties.length}
//                       </p>
//                       <p style={{ fontSize: '0.8125rem', color: 'hsl(200 15% 45%)', margin: '0.25rem 0 0' }}>Active Listings</p>
//                     </div>

//                     <div style={{
//                       backgroundColor: 'white',
//                       border: '1px solid hsl(40 20% 88%)',
//                       borderRadius: '0.75rem',
//                       padding: 'clamp(1rem, 3vw, 1.25rem)',
//                       boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.08)',
//                     }}>
//                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
//                         <div style={{
//                           width: '2.25rem',
//                           height: '2.25rem',
//                           borderRadius: '0.5rem',
//                           background: 'hsl(174 62% 32% / 0.1)',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                         }}>
//                           <Eye style={{ width: '1.125rem', height: '1.125rem', color: 'hsl(174 62% 32%)' }} />
//                         </div>
//                       </div>
//                       <p style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: '700', color: 'hsl(200 25% 15%)', margin: 0, lineHeight: 1 }}>
//                         {totalViews}
//                       </p>
//                       <p style={{ fontSize: '0.8125rem', color: 'hsl(200 15% 45%)', margin: '0.25rem 0 0' }}>Total Views</p>
//                       <p style={{ fontSize: '0.75rem', color: 'hsl(152 60% 40%)', marginTop: '0.25rem', fontWeight: 600 }}>
//                         +12% this month
//                       </p>
//                     </div>

//                     <div style={{
//                       backgroundColor: 'white',
//                       border: '1px solid hsl(40 20% 88%)',
//                       borderRadius: '0.75rem',
//                       padding: 'clamp(1rem, 3vw, 1.25rem)',
//                       boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.08)',
//                     }}>
//                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
//                         <div style={{
//                           width: '2.25rem',
//                           height: '2.25rem',
//                           borderRadius: '0.5rem',
//                           background: 'hsl(174 62% 32% / 0.1)',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                         }}>
//                           <Users style={{ width: '1.125rem', height: '1.125rem', color: 'hsl(174 62% 32%)' }} />
//                         </div>
//                       </div>
//                       <p style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: '700', color: 'hsl(200 25% 15%)', margin: 0, lineHeight: 1 }}>
//                         {totalInquiries}
//                       </p>
//                       <p style={{ fontSize: '0.8125rem', color: 'hsl(200 15% 45%)', margin: '0.25rem 0 0' }}>Total Inquiries</p>
//                       <p style={{ fontSize: '0.75rem', color: 'hsl(152 60% 40%)', marginTop: '0.25rem', fontWeight: 600 }}>
//                         +8% this month
//                       </p>
//                     </div>

//                     <div style={{
//                       backgroundColor: 'white',
//                       border: '1px solid hsl(40 20% 88%)',
//                       borderRadius: '0.75rem',
//                       padding: 'clamp(1rem, 3vw, 1.25rem)',
//                       boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.08)',
//                     }}>
//                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
//                         <div style={{
//                           width: '2.25rem',
//                           height: '2.25rem',
//                           borderRadius: '0.5rem',
//                           background: 'hsl(174 62% 32% / 0.1)',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                         }}>
//                           <TrendingUp style={{ width: '1.125rem', height: '1.125rem', color: 'hsl(174 62% 32%)' }} />
//                         </div>
//                       </div>
//                       <p style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: '700', color: 'hsl(200 25% 15%)', margin: 0, lineHeight: 1 }}>
//                         {conversionRate}%
//                       </p>
//                       <p style={{ fontSize: '0.8125rem', color: 'hsl(200 15% 45%)', margin: '0.25rem 0 0' }}>Conversion Rate</p>
//                       <p style={{ fontSize: '0.75rem', color: 'hsl(152 60% 40%)', marginTop: '0.25rem', fontWeight: 600 }}>
//                         +2% this month
//                       </p>
//                     </div>
//                   </div>

//                   {/* Recent Listings Preview */}
//                   <div style={{
//                     backgroundColor: 'white',
//                     border: '1px solid hsl(40 20% 88%)',
//                     borderRadius: '0.75rem',
//                     padding: 'clamp(1rem, 3vw, 1.5rem)',
//                     boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.08)',
//                   }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
//                       <h2 style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600', color: 'hsl(200 25% 15%)', margin: 0 }}>
//                         Recent Listings
//                       </h2>
//                       <button
//                         onClick={() => setActiveTab('listings')}
//                         style={{
//                           background: 'transparent',
//                           border: 'none',
//                           color: 'hsl(174 62% 32%)',
//                           fontSize: '0.875rem',
//                           fontWeight: '500',
//                           cursor: 'pointer',
//                           padding: '0.25rem 0.5rem',
//                         }}
//                       >
//                         View all →
//                       </button>
//                     </div>
//                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
//                       {properties.slice(0, 3).map((property) => (
//                         <div key={property.id} style={{
//                           padding: '0.875rem',
//                           backgroundColor: 'hsl(40 33% 98%)',
//                           borderRadius: '0.625rem',
//                           border: '1px solid hsl(40 20% 88%)',
//                         }}>
//                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
//                             <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)' }}>
//                               {property.title}
//                             </h3>
//                             {getStatusBadge(property.listing_status)}
//                           </div>
//                           <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
//                             {property.address}, {property.city}
//                           </p>
//                           <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
//                             <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
//                               <Eye style={{ width: '0.75rem', height: '0.75rem' }} /> {property.views}
//                             </span>
//                             <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
//                               <Users style={{ width: '0.75rem', height: '0.75rem' }} /> {property.inquiries}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     {properties.length === 0 && (
//                       <p style={{ textAlign: 'center', color: 'hsl(200 15% 45%)', padding: '2rem', fontSize: '0.875rem' }}>
//                         No listings yet. Add your first property to get started!
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Listings Tab */}
//               {activeTab === 'listings' && (
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
//                   <div style={{ 
//                     display: 'flex', 
//                     justifyContent: 'space-between', 
//                     alignItems: 'center',
//                     flexWrap: 'wrap',
//                     gap: 'clamp(0.75rem, 2vw, 1rem)'
//                   }}>
//                     <h2 style={{ 
//                       color: 'hsl(200 25% 15%)',
//                       fontSize: 'clamp(1rem, 3vw, 1.125rem)',
//                       fontWeight: '600'
//                     }}>
//                       Your Listings
//                     </h2>
//                     <button
//                       onClick={() => setShowAddListingModal(true)}
//                       className="action-button"
//                       style={{
//                         padding: 'clamp(0.5rem, 2vw, 0.5rem) clamp(0.75rem, 3vw, 1rem)',
//                         background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
//                         fontWeight: '500',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 'clamp(0.25rem, 1vw, 0.5rem)',
//                         fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
//                         whiteSpace: 'nowrap'
//                       }}>
//                       <Home style={{ 
//                         height: 'clamp(0.875rem, 2.5vw, 1rem)', 
//                         width: 'clamp(0.875rem, 2.5vw, 1rem)' 
//                       }} />
//                       Add Listing
//                     </button>
//                   </div>

//                   <div className="listing-grid" style={{
//                     display: 'grid',
//                     gap: 'clamp(0.75rem, 2vw, 1rem)'
//                   }}>
//                     {properties.length > 0 ? (
//                       properties.map((property) => (
//                         <div key={property.id} style={{
//                           backgroundColor: 'white',
//                           border: '1px solid hsl(40 20% 88%)',
//                           borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
//                           padding: 'clamp(0.75rem, 2vw, 1rem)',
//                           display: 'flex',
//                           flexDirection: 'column',
//                           gap: 'clamp(0.75rem, 2vw, 1rem)'
//                         }}>
//                           <div style={{ 
//                             display: 'flex', 
//                             justifyContent: 'space-between', 
//                             alignItems: 'start',
//                             gap: 'clamp(0.5rem, 2vw, 1rem)'
//                           }}>
//                             <div style={{ flex: 1, minWidth: 0 }}>
//                               <h3 style={{ 
//                                 color: 'hsl(200 25% 15%)', 
//                                 marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)',
//                                 fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
//                                 fontWeight: '600',
//                                 wordBreak: 'break-word'
//                               }}>
//                                 {property.title}
//                               </h3>
//                               <p style={{ 
//                                 fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
//                                 color: 'hsl(200 15% 45%)', 
//                                 marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)',
//                                 wordBreak: 'break-word'
//                               }}>
//                                 {property.address}, {property.city}
//                               </p>
//                               <p style={{ 
//                                 fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
//                                 color: 'hsl(174 62% 32%)',
//                                 fontWeight: '500'
//                               }}>
//                                 GH₵{Math.round(property.rent_min).toLocaleString()} - GH₵{Math.round(property.rent_max).toLocaleString()}
//                               </p>
//                             </div>
//                             {getStatusBadge(property.listing_status)}
//                           </div>
//                           <div style={{ 
//                             display: 'grid', 
//                             gridTemplateColumns: '1fr 1fr', 
//                             gap: 'clamp(0.375rem, 1.5vw, 0.5rem)',
//                             marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)'
//                           }}>
//                             <button
//                               onClick={() => handleViewClick(property)}
//                               className="action-button"
//                               style={{
//                                 padding: 'clamp(0.375rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
//                                 border: '1px solid hsl(40 20% 88%)',
//                                 borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)',
//                                 backgroundColor: 'white',
//                                 color: 'hsl(174 62% 32%)',
//                                 fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
//                                 fontWeight: '500',
//                                 cursor: 'pointer',
//                                 textAlign: 'center'
//                               }}>
//                               View
//                             </button>
//                             <button
//                               onClick={() => handleEditClick(property)}
//                               className="action-button"
//                               style={{
//                                 padding: 'clamp(0.375rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
//                                 border: '1px solid hsl(40 20% 88%)',
//                                 borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)',
//                                 backgroundColor: 'white',
//                                 color: 'hsl(174 62% 32%)',
//                                 fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
//                                 fontWeight: '500',
//                                 cursor: 'pointer',
//                                 textAlign: 'center'
//                               }}>
//                               Edit
//                             </button>
//                           </div>
//                           <button
//                             onClick={() => {
//                               setSelectedRentalForVerification(property);
//                               setShowVerificationModal(true);
//                             }}
//                             className="action-button"
//                             style={{
//                               width: '100%',
//                               padding: 'clamp(0.375rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
//                               border: '1px solid hsl(40 20% 88%)',
//                               borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)',
//                               backgroundColor: 'white',
//                               color: 'hsl(174 62% 32%)',
//                               fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
//                               fontWeight: '500',
//                               cursor: 'pointer'
//                             }}
//                           >
//                             Request Verification
//                           </button>
//                         </div>
//                       ))
//                     ) : (
//                       <div style={{
//                         gridColumn: '1 / -1',
//                         padding: 'clamp(1.5rem, 4vw, 2rem)',
//                         textAlign: 'center',
//                         backgroundColor: 'white',
//                         border: '1px solid hsl(40 20% 88%)',
//                         borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)'
//                       }}>
//                         <p style={{ 
//                           color: 'hsl(200 15% 45%)', 
//                           marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
//                           fontSize: 'clamp(0.875rem, 2vw, 1rem)'
//                         }}>
//                           No listings yet. Add your first property to get started!
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Reviews Tab */}
//               {activeTab === 'reviews' && (
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
//                   <h2 style={{ 
//                     color: 'hsl(200 25% 15%)',
//                     fontSize: 'clamp(1rem, 3vw, 1.125rem)',
//                     fontWeight: '600'
//                   }}>
//                     Tenant Reviews ({formattedReviews.length})
//                   </h2>

//                   {formattedReviews.length > 0 ? (
//                     <div className="review-grid" style={{
//                       display: 'grid',
//                       gap: 'clamp(0.75rem, 2vw, 1rem)'
//                     }}>
//                       {formattedReviews.map((review) => (
//                         <div key={review.id} style={{
//                           backgroundColor: 'white',
//                           border: '1px solid hsl(40 20% 88%)',
//                           borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
//                           padding: 'clamp(0.75rem, 2vw, 1rem)'
//                         }}>
//                           <div style={{ 
//                             display: 'flex', 
//                             justifyContent: 'space-between', 
//                             marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
//                             flexDirection: 'column',
//                             gap: 'clamp(0.5rem, 2vw, 0.75rem)'
//                           }}>
//                             <div>
//                               <p style={{ 
//                                 fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
//                                 color: 'hsl(200 15% 45%)', 
//                                 marginBottom: 'clamp(0.5rem, 2vw, 0.5rem)' 
//                               }}>
//                                 Review for Property #{review.rental_id}
//                               </p>
//                               <div style={{ 
//                                 display: 'flex', 
//                                 alignItems: 'center', 
//                                 gap: 'clamp(0.5rem, 2vw, 0.5rem)', 
//                                 marginBottom: 'clamp(0.5rem, 2vw, 0.5rem)' 
//                               }}>
//                                 <div style={{
//                                   width: 'clamp(2rem, 8vw, 2rem)',
//                                   height: 'clamp(2rem, 8vw, 2rem)',
//                                   borderRadius: '50%',
//                                   backgroundColor: 'hsl(174 62% 32% / 0.1)',
//                                   color: 'hsl(174 62% 32%)',
//                                   display: 'flex',
//                                   alignItems: 'center',
//                                   justifyContent: 'center',
//                                   fontSize: 'clamp(0.875rem, 2.5vw, 0.875rem)',
//                                   fontWeight: '600',
//                                   flexShrink: 0
//                                 }}>
//                                   {review.full_name?.[0] || 'T'}
//                                 </div>
//                                 <div style={{ flex: 1, minWidth: 0 }}>
//                                   <span style={{ 
//                                     color: 'hsl(200 25% 15%)', 
//                                     display: 'block',
//                                     fontSize: 'clamp(0.875rem, 2.5vw, 0.875rem)',
//                                     fontWeight: '500',
//                                     marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)',
//                                     wordBreak: 'break-word'
//                                   }}>
//                                     {review.full_name || 'Anonymous Tenant'}
//                                   </span>
//                                   <div style={{ display: 'flex' }}>
//                                     {renderStars(review.overall_rating)}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <span style={{ 
//                               fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', 
//                               color: 'hsl(200 15% 45%)',
//                               alignSelf: 'flex-start'
//                             }}>
//                               {new Date(review.created_at).toLocaleDateString('en-US', {
//                                 year: 'numeric',
//                                 month: 'short',
//                                 day: 'numeric'
//                               })}
//                             </span>
//                           </div>

//                           {/* Review Attributes */}
//                           <div style={{ 
//                             display: 'flex', 
//                             flexWrap: 'wrap', 
//                             gap: 'clamp(0.375rem, 1.5vw, 0.5rem)', 
//                             marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)' 
//                           }}>
//                             {review.landlord_responsive === 1 && (
//                               <span style={{
//                                 padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)',
//                                 fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
//                                 backgroundColor: 'hsl(152 60% 95%)',
//                                 color: 'hsl(152 60% 35%)',
//                                 borderRadius: '9999px',
//                                 border: '1px solid hsl(152 60% 85%)',
//                                 whiteSpace: 'nowrap'
//                               }}>
//                                 ✓ Responsive
//                               </span>
//                             )}
//                             {review.property_matched_description === 1 && (
//                               <span style={{
//                                 padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)',
//                                 fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
//                                 backgroundColor: 'hsl(152 60% 95%)',
//                                 color: 'hsl(152 60% 35%)',
//                                 borderRadius: '9999px',
//                                 border: '1px solid hsl(152 60% 85%)',
//                                 whiteSpace: 'nowrap'
//                               }}>
//                                 ✓ Accurate
//                               </span>
//                             )}
//                             {review.fair_pricing === 1 && (
//                               <span style={{
//                                 padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)',
//                                 fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
//                                 backgroundColor: 'hsl(152 60% 95%)',
//                                 color: 'hsl(152 60% 35%)',
//                                 borderRadius: '9999px',
//                                 border: '1px solid hsl(152 60% 85%)',
//                                 whiteSpace: 'nowrap'
//                               }}>
//                                 ✓ Fair Price
//                               </span>
//                             )}
//                             {review.good_communication === 1 && (
//                               <span style={{
//                                 padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)',
//                                 fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
//                                 backgroundColor: 'hsl(152 60% 95%)',
//                                 color: 'hsl(152 60% 35%)',
//                                 borderRadius: '9999px',
//                                 border: '1px solid hsl(152 60% 85%)',
//                                 whiteSpace: 'nowrap'
//                               }}>
//                                 ✓ Good Comm
//                               </span>
//                             )}
//                           </div>

//                           {review.comments && (
//                             <p style={{
//                               color: 'hsl(200 15% 45%)',
//                               marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
//                               fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
//                               lineHeight: '1.5'
//                             }}>
//                               "{review.comments}"
//                             </p>
//                           )}

//                           {review.response ? (
//                             <div style={{
//                               backgroundColor: 'hsl(210 20% 98%)',
//                               padding: 'clamp(0.5rem, 2vw, 0.75rem)',
//                               borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
//                               borderLeft: '3px solid hsl(174 62% 32%)',
//                               marginTop: 'clamp(0.5rem, 2vw, 0.5rem)'
//                             }}>
//                               <p style={{
//                                 fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
//                                 fontWeight: '600',
//                                 color: 'hsl(174 62% 32%)',
//                                 marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)'
//                               }}>
//                                 Your Response {review.response_person && `by ${review.response_person}`}
//                               </p>
//                               <p style={{
//                                 fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
//                                 color: 'hsl(200 25% 15%)',
//                                 lineHeight: '1.5'
//                               }}>
//                                 {review.response}
//                               </p>
//                             </div>
//                           ) : respondingTo === review.id ? (
//                             <div style={{ 
//                               display: 'flex', 
//                               flexDirection: 'column', 
//                               gap: 'clamp(0.5rem, 2vw, 0.5rem)', 
//                               marginTop: 'clamp(0.5rem, 2vw, 0.5rem)' 
//                             }}>
//                               <form onSubmit={(e) => handleResponse(e, review.id)}>
//                                 <textarea
//                                   placeholder="Write your response to this review..."
//                                   value={responseText}
//                                   onChange={(e) => setResponseText(e.target.value)}
//                                   rows={3}
//                                   style={{
//                                     width: '100%',
//                                     padding: 'clamp(0.5rem, 2vw, 0.75rem)',
//                                     border: '1px solid hsl(40 20% 88%)',
//                                     borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
//                                     fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
//                                     outline: 'none',
//                                     fontFamily: 'inherit',
//                                     resize: 'vertical'
//                                   }}
//                                 />
//                                 <div style={{ 
//                                   display: 'flex', 
//                                   gap: 'clamp(0.375rem, 1.5vw, 0.5rem)', 
//                                   marginTop: 'clamp(0.5rem, 2vw, 0.5rem)' 
//                                 }}>
//                                   <button
//                                     type="submit"
//                                     disabled={processing}
//                                     className="action-button"
//                                     style={{
//                                       flex: 1,
//                                       padding: 'clamp(0.375rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
//                                       background: !processing
//                                         ? 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)'
//                                         : 'hsl(200 15% 70%)',
//                                       color: 'white',
//                                       border: 'none',
//                                       borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)',
//                                       fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
//                                       fontWeight: '500',
//                                       cursor: !processing ? 'pointer' : 'not-allowed',
//                                       opacity: processing ? 0.7 : 1
//                                     }}
//                                   >
//                                     {processing ? 'Submitting...' : 'Submit'}
//                                   </button>
//                                   <button
//                                     type="button"
//                                     onClick={() => { setRespondingTo(null); }}
//                                     disabled={processing}
//                                     className="action-button"
//                                     style={{
//                                       flex: 1,
//                                       padding: 'clamp(0.375rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
//                                       border: '1px solid hsl(40 20% 88%)',
//                                       borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)',
//                                       backgroundColor: 'white',
//                                       color: 'hsl(200 25% 15%)',
//                                       fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
//                                       fontWeight: '500',
//                                       cursor: processing ? 'not-allowed' : 'pointer',
//                                       opacity: processing ? 0.7 : 1
//                                     }}
//                                   >
//                                     Cancel
//                                   </button>
//                                 </div>
//                               </form>
//                             </div>
//                           ) : (
//                             <button
//                               onClick={() => setRespondingTo(review.id)}
//                               className="action-button"
//                               style={{
//                                 width: '100%',
//                                 padding: 'clamp(0.375rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)',
//                                 border: '1px solid hsl(40 20% 88%)',
//                                 borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)',
//                                 backgroundColor: 'white',
//                                 color: 'hsl(174 62% 32%)',
//                                 fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
//                                 fontWeight: '500',
//                                 cursor: 'pointer',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 gap: 'clamp(0.25rem, 1vw, 0.5rem)',
//                                 marginTop: 'clamp(0.5rem, 2vw, 0.5rem)'
//                               }}
//                             >
//                               <MessageSquare style={{ 
//                                 height: 'clamp(0.875rem, 2.5vw, 1rem)', 
//                                 width: 'clamp(0.875rem, 2.5vw, 1rem)' 
//                               }} />
//                               Respond
//                             </button>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div style={{
//                       backgroundColor: 'white',
//                       border: '1px solid hsl(40 20% 88%)',
//                       borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
//                       padding: 'clamp(1.5rem, 4vw, 2rem)',
//                       textAlign: 'center'
//                     }}>
//                       <MessageSquare style={{
//                         height: 'clamp(2.5rem, 10vw, 3rem)',
//                         width: 'clamp(2.5rem, 10vw, 3rem)',
//                         color: 'hsl(200 15% 45%)',
//                         margin: '0 auto clamp(0.75rem, 2vw, 1rem) auto'
//                       }} />
//                       <h3 style={{
//                         fontSize: 'clamp(1rem, 3vw, 1.125rem)',
//                         fontWeight: '600',
//                         color: 'hsl(200 25% 15%)',
//                         marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)'
//                       }}>
//                         No Reviews Yet
//                       </h3>
//                       <p style={{ 
//                         color: 'hsl(200 15% 45%)',
//                         fontSize: 'clamp(0.875rem, 2vw, 0.875rem)'
//                       }}>
//                         You haven't received any reviews from tenants yet.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Billing Tab */}
//               {activeTab === 'billing' && (
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
//                   <h2 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600' }}>Billing & Subscription</h2>
//                   <BillingModule onUpgrade={() => setShowPricingModal(true)} />
//                 </div>
//               )}
//             </div>
//           </div>
//         </main>

//         <Footer />

//         {/* Toast Notification */}
//         {showToast && (
//           <div className="toast-container">
//             <div className={`toast-${showToast.variant}`} style={{
//               padding: '1rem',
//               borderRadius: '0.5rem',
//               boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//               display: 'flex',
//               flexDirection: 'column',
//               gap: '0.25rem'
//             }}>
//               <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>
//                 {showToast.message}
//               </p>
//               <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>
//                 {showToast.description}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Pricing Modal */}
//         {showPricingModal && (
//           <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
//         )}

//         {/* Add Listing Modal */}
//         {showAddListingModal && (
//           <div style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 50,
//             padding: 'clamp(0.5rem, 2vw, 1rem)'
//           }}>
//             <div className="modal-content" style={{
//               backgroundColor: 'white',
//               borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
//               maxHeight: '90vh',
//               overflow: 'auto',
//               maxWidth: 'clamp(90%, 95vw, 60%)',
//               width: '100%',
//               position: 'relative'
//             }}>
//               <button
//                 onClick={() => setShowAddListingModal(false)}
//                 className="action-button"
//                 style={{
//                   position: 'sticky',
//                   top: 0,
//                   right: 0,
//                   padding: 'clamp(0.75rem, 2vw, 1rem)',
//                   border: 'none',
//                   background: 'transparent',
//                   fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
//                   cursor: 'pointer',
//                   color: 'hsl(200 15% 45%)',
//                   float: 'right',
//                   zIndex: 10
//                 }}
//               >
//                 ✕
//               </button>
//               <AddRentalPage agentData={agentData} setShowAddListingModal={setShowAddListingModal} />
//             </div>
//           </div>
//         )}

//         {/* Edit Listing Modal */}
//         {showEditListingModal && selectedRental && (
//           <div style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 50,
//             padding: 'clamp(0.5rem, 2vw, 1rem)'
//           }}>
//             <div className="modal-content" style={{
//               backgroundColor: 'white',
//               borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
//               maxHeight: '90vh',
//               overflow: 'auto',
//               maxWidth: 'clamp(90%, 95vw, 60%)',
//               width: '100%',
//               position: 'relative'
//             }}>
//               <button
//                 onClick={() => {
//                   setShowEditListingModal(false);
//                   setSelectedRental(null);
//                 }}
//                 className="action-button"
//                 style={{
//                   position: 'sticky',
//                   top: 0,
//                   right: 0,
//                   padding: 'clamp(0.75rem, 2vw, 1rem)',
//                   border: 'none',
//                   background: 'transparent',
//                   fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
//                   cursor: 'pointer',
//                   color: 'hsl(200 15% 45%)',
//                   float: 'right',
//                   zIndex: 10
//                 }}
//               >
//                 ✕
//               </button>
//               <EditRentals
//                 agentData={agentData}
//                 setShowEditListingModal={setShowEditListingModal}
//                 rental={selectedRental}
//               />
//             </div>
//           </div>
//         )}

//         {/* Verification Modal */}
//         <VerificationRequestModal
//           isOpen={showVerificationModal}
//           onClose={() => setShowVerificationModal(false)}
//           agentData={agentData}
//           selectedRental={selectedRentalForVerification}
//         />

//         {/* View Rental Modal */}
//         {showViewModal && selectedRental && (
//           <div style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 50,
//             padding: 'clamp(0.5rem, 2vw, 1rem)'
//           }}>
//             <div className="modal-content" style={{
//               backgroundColor: 'white',
//               borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
//               maxHeight: '90vh',
//               overflow: 'auto',
//               maxWidth: 'clamp(90%, 95vw, 60%)',
//               width: '100%',
//               position: 'relative'
//             }}>
//               <button
//                 onClick={() => setShowViewModal(false)}
//                 className="action-button"
//                 style={{
//                   position: 'sticky',
//                   top: 0,
//                   right: 0,
//                   padding: 'clamp(0.75rem, 2vw, 1rem)',
//                   border: 'none',
//                   background: 'transparent',
//                   fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
//                   cursor: 'pointer',
//                   color: 'hsl(200 15% 45%)',
//                   float: 'right',
//                   zIndex: 10
//                 }}
//               >
//                 ✕
//               </button>
//               <ViewRentals
//                 rental={selectedRental}
//                 setShowViewModal={setShowViewModal}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default AgentDashboardPage;


import { useState } from "react";
import { Link, useForm, router, usePage } from "@inertiajs/react";  {/* ← added usePage */}
import Header from "@/Components/Layouts/Header";
import Footer from "@/Components/Layouts/Footer";
import AddRentalPage from "@/Components/Modules/AddRentals";
import EditRentals from "@/Components/Modules/EditRentals";
import VerificationRequestModal from "@/Components/Modules/VerifyRentals";
import ViewRentals from "@/Components/Modules/ViewRental";
import BillingModule from "@/Components/Modules/BillingDashboard";
import PricingModal from '@/Components/Modules/PricingModal';

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

const AgentDashboardPage = ({ agentData, rentals, reviews }) => {
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
    'response_name': agentData?.fullName
  });

  const handleResponse = (e, reviewId) => {
    e.preventDefault();

    router.put('/response', {
      review_id: reviewId,
      response: responseText,
      response_person: agentData.fullName
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

  const agent = {
    name: agentData?.name || "Unknown Agent",
    company: agentData?.company || null,
    status: agentData?.status || "unverified",
    avatar_url: null,
    average_rating: 4.7,
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
      response_person: review.response_person || null,
      created_at: review.created_at || new Date().toISOString()
    }))
    : [];

  const properties = rentals && rentals.length > 0
    ? rentals.map(rental => ({
      id: rental.id,
      title: rental.title || "Unknown",
      address: rental.address || "Unknown Address",
      city: rental.city || "Unknown City",
      rent_min: rental.rent_min || 0,
      rent_max: rental.rent_max || 0,
      listing_status: rental.status || "unverified",
      total_reviews: 0,
      views: Math.floor(Math.random() * 100),
      inquiries: Math.floor(Math.random() * 10),
    }))
    : [];

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

  const calculateAverageRating = () => {
    if (!formattedReviews || formattedReviews.length === 0) return 4.7;
    const sum = formattedReviews.reduce((acc, review) => acc + (review.overall_rating || 0), 0);
    return (sum / formattedReviews.length).toFixed(1);
  };

  const agentWithRealData = {
    ...agent,
    average_rating: calculateAverageRating(),
    total_reviews: formattedReviews.length
  };

  const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalInquiries = properties.reduce((sum, p) => sum + (p.inquiries || 0), 0);
  const conversionRate = totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(1) : 0;

  const getStatusBadge = (status) => {
    if (status === "verified") {
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
    } else {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: 'clamp(0.25rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)', fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', fontWeight: '500', backgroundColor: 'white', color: 'hsl(200 15% 45%)', borderRadius: '9999px', gap: 'clamp(0.25rem, 1vw, 0.25rem)', border: '1px solid hsl(40 20% 88%)' }}>
          <AlertCircle style={{ height: 'clamp(0.75rem, 2vw, 0.75rem)', width: 'clamp(0.75rem, 2vw, 0.75rem)' }} />
          Unverified
        </span>
      );
    }
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
          .tabs-grid { grid-template-columns: 1fr !important; }
          .listing-grid { grid-template-columns: 1fr !important; }
          .review-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .modal-content { max-width: 95% !important; margin: 0.5rem; }
        }
        @media (min-width: 769px) {
          .profile-header-container { flex-direction: row !important; }
          .settings-link { align-self: flex-start !important; margin-top: 0 !important; }
          .tabs-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .listing-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .review-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (min-width: 1024px) { .listing-grid { grid-template-columns: repeat(4, 1fr) !important; } }
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
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.25rem, 1vw, 0.375rem)', color: 'hsl(200 15% 45%)' }}>
                        <Star style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />
                        {agent.average_rating} ({reviews.length} reviews)
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
                {['overview', 'listings', 'reviews', 'billing'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className="action-button" style={{ padding: 'clamp(0.5rem, 2vw, 0.5rem) clamp(0.75rem, 3vw, 1rem)', border: 'none', borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)', backgroundColor: activeTab === tab ? 'white' : 'transparent', color: activeTab === tab ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(0.25rem, 1vw, 0.5rem)', transition: 'all 0.2s', boxShadow: activeTab === tab ? '0 1px 2px 0 hsl(200 25% 15% / 0.05)' : 'none', textTransform: 'capitalize', fontSize: 'clamp(0.875rem, 2vw, 0.875rem)', whiteSpace: 'nowrap' }}>
                    {tab === 'overview' && <BarChart style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />}
                    {tab === 'listings' && <Home style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />}
                    {tab === 'reviews' && <MessageSquare style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />}
                    {tab === 'billing' && <svg style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                    {tab}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 4vw, 2rem)' }}>
                  <div className="stats-grid" style={{ display: 'grid', gap: 'clamp(0.75rem, 2vw, 1.25rem)' }}>
                    {[
                      { icon: <Home style={{ width: '1.125rem', height: '1.125rem', color: 'hsl(174 62% 32%)' }} />, value: properties.length, label: 'Active Listings', trend: null },
                      { icon: <Eye style={{ width: '1.125rem', height: '1.125rem', color: 'hsl(174 62% 32%)' }} />, value: totalViews, label: 'Total Views', trend: '+12% this month' },
                      { icon: <Users style={{ width: '1.125rem', height: '1.125rem', color: 'hsl(174 62% 32%)' }} />, value: totalInquiries, label: 'Total Inquiries', trend: '+8% this month' },
                      { icon: <TrendingUp style={{ width: '1.125rem', height: '1.125rem', color: 'hsl(174 62% 32%)' }} />, value: `${conversionRate}%`, label: 'Conversion Rate', trend: '+2% this month' },
                    ].map(({ icon, value, label, trend }) => (
                      <div key={label} style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: 'clamp(1rem, 3vw, 1.25rem)', boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.08)' }}>
                        <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem', background: 'hsl(174 62% 32% / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>{icon}</div>
                        <p style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: '700', color: 'hsl(200 25% 15%)', margin: 0, lineHeight: 1 }}>{value}</p>
                        <p style={{ fontSize: '0.8125rem', color: 'hsl(200 15% 45%)', margin: '0.25rem 0 0' }}>{label}</p>
                        {trend && <p style={{ fontSize: '0.75rem', color: 'hsl(152 60% 40%)', marginTop: '0.25rem', fontWeight: 600 }}>{trend}</p>}
                      </div>
                    ))}
                  </div>

                  <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: 'clamp(1rem, 3vw, 1.5rem)', boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <h2 style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600', color: 'hsl(200 25% 15%)', margin: 0 }}>Recent Listings</h2>
                      <button onClick={() => setActiveTab('listings')} style={{ background: 'transparent', border: 'none', color: 'hsl(174 62% 32%)', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>View all →</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                      {properties.slice(0, 3).map((property) => (
                        <div key={property.id} style={{ padding: '0.875rem', backgroundColor: 'hsl(40 33% 98%)', borderRadius: '0.625rem', border: '1px solid hsl(40 20% 88%)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)' }}>{property.title}</h3>
                            {getStatusBadge(property.listing_status)}
                          </div>
                          <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>{property.address}, {property.city}</p>
                          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Eye style={{ width: '0.75rem', height: '0.75rem' }} /> {property.views}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users style={{ width: '0.75rem', height: '0.75rem' }} /> {property.inquiries}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {properties.length === 0 && <p style={{ textAlign: 'center', color: 'hsl(200 15% 45%)', padding: '2rem', fontSize: '0.875rem' }}>No listings yet. Add your first property to get started!</p>}
                  </div>
                </div>
              )}

              {/* Listings Tab */}
              {activeTab === 'listings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                    <h2 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600' }}>Your Listings</h2>
                    <button onClick={() => setShowAddListingModal(true)} className="action-button" style={{ padding: 'clamp(0.5rem, 2vw, 0.5rem) clamp(0.75rem, 3vw, 1rem)', background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)', color: 'white', border: 'none', borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'clamp(0.25rem, 1vw, 0.5rem)', fontSize: 'clamp(0.875rem, 2vw, 0.875rem)', whiteSpace: 'nowrap' }}>
                      <Home style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />
                      Add Listing
                    </button>
                  </div>
                  <div className="listing-grid" style={{ display: 'grid', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                    {properties.length > 0 ? properties.map((property) => (
                      <div key={property.id} style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)', padding: 'clamp(0.75rem, 2vw, 1rem)', display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 'clamp(0.5rem, 2vw, 1rem)' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{ color: 'hsl(200 25% 15%)', marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', fontWeight: '600', wordBreak: 'break-word' }}>{property.title}</h3>
                            <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)', marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)', wordBreak: 'break-word' }}>{property.address}, {property.city}</p>
                            <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(174 62% 32%)', fontWeight: '500' }}>GH₵{Math.round(property.rent_min).toLocaleString()} - GH₵{Math.round(property.rent_max).toLocaleString()}</p>
                          </div>
                          {getStatusBadge(property.listing_status)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(0.375rem, 1.5vw, 0.5rem)', marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' }}>
                          <button onClick={() => handleViewClick(property)} className="action-button" style={{ padding: 'clamp(0.375rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)', border: '1px solid hsl(40 20% 88%)', borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)', backgroundColor: 'white', color: 'hsl(174 62% 32%)', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontWeight: '500', cursor: 'pointer', textAlign: 'center' }}>View</button>
                          <button onClick={() => handleEditClick(property)} className="action-button" style={{ padding: 'clamp(0.375rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)', border: '1px solid hsl(40 20% 88%)', borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)', backgroundColor: 'white', color: 'hsl(174 62% 32%)', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontWeight: '500', cursor: 'pointer', textAlign: 'center' }}>Edit</button>
                        </div>
                        <button onClick={() => { setSelectedRentalForVerification(property); setShowVerificationModal(true); }} className="action-button" style={{ width: '100%', padding: 'clamp(0.375rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)', border: '1px solid hsl(40 20% 88%)', borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)', backgroundColor: 'white', color: 'hsl(174 62% 32%)', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontWeight: '500', cursor: 'pointer' }}>
                          Request Verification
                        </button>
                      </div>
                    )) : (
                      <div style={{ gridColumn: '1 / -1', padding: 'clamp(1.5rem, 4vw, 2rem)', textAlign: 'center', backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                        <p style={{ color: 'hsl(200 15% 45%)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>No listings yet. Add your first property to get started!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                  <h2 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600' }}>Tenant Reviews ({formattedReviews.length})</h2>
                  {formattedReviews.length > 0 ? (
                    <div className="review-grid" style={{ display: 'grid', gap: 'clamp(0.75rem, 2vw, 1rem)' }}>
                      {formattedReviews.map((review) => (
                        <div key={review.id} style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)', padding: 'clamp(0.75rem, 2vw, 1rem)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'clamp(0.75rem, 2vw, 1rem)', flexDirection: 'column', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                            <div>
                              <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(200 15% 45%)', marginBottom: 'clamp(0.5rem, 2vw, 0.5rem)' }}>Review for Property #{review.rental_id}</p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.5rem)', marginBottom: 'clamp(0.5rem, 2vw, 0.5rem)' }}>
                                <div style={{ width: 'clamp(2rem, 8vw, 2rem)', height: 'clamp(2rem, 8vw, 2rem)', borderRadius: '50%', backgroundColor: 'hsl(174 62% 32% / 0.1)', color: 'hsl(174 62% 32%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(0.875rem, 2.5vw, 0.875rem)', fontWeight: '600', flexShrink: 0 }}>
                                  {review.full_name?.[0] || 'T'}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <span style={{ color: 'hsl(200 25% 15%)', display: 'block', fontSize: 'clamp(0.875rem, 2.5vw, 0.875rem)', fontWeight: '500', marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)', wordBreak: 'break-word' }}>{review.full_name || 'Anonymous Tenant'}</span>
                                  <div style={{ display: 'flex' }}>{renderStars(review.overall_rating)}</div>
                                </div>
                              </div>
                            </div>
                            <span style={{ fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', color: 'hsl(200 15% 45%)', alignSelf: 'flex-start' }}>
                              {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(0.375rem, 1.5vw, 0.5rem)', marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                            {review.landlord_responsive === 1 && <span style={{ padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)', fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)', backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', borderRadius: '9999px', border: '1px solid hsl(152 60% 85%)', whiteSpace: 'nowrap' }}>✓ Responsive</span>}
                            {review.property_matched_description === 1 && <span style={{ padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)', fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)', backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', borderRadius: '9999px', border: '1px solid hsl(152 60% 85%)', whiteSpace: 'nowrap' }}>✓ Accurate</span>}
                            {review.fair_pricing === 1 && <span style={{ padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)', fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)', backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', borderRadius: '9999px', border: '1px solid hsl(152 60% 85%)', whiteSpace: 'nowrap' }}>✓ Fair Price</span>}
                            {review.good_communication === 1 && <span style={{ padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.625rem)', fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)', backgroundColor: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', borderRadius: '9999px', border: '1px solid hsl(152 60% 85%)', whiteSpace: 'nowrap' }}>✓ Good Comm</span>}
                          </div>
                          {review.comments && <p style={{ color: 'hsl(200 15% 45%)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', lineHeight: '1.5' }}>"{review.comments}"</p>}
                          {review.response ? (
                            <div style={{ backgroundColor: 'hsl(210 20% 98%)', padding: 'clamp(0.5rem, 2vw, 0.75rem)', borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)', borderLeft: '3px solid hsl(174 62% 32%)', marginTop: 'clamp(0.5rem, 2vw, 0.5rem)' }}>
                              <p style={{ fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)', fontWeight: '600', color: 'hsl(174 62% 32%)', marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)' }}>Your Response {review.response_person && `by ${review.response_person}`}</p>
                              <p style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'hsl(200 25% 15%)', lineHeight: '1.5' }}>{review.response}</p>
                            </div>
                          ) : respondingTo === review.id ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 2vw, 0.5rem)', marginTop: 'clamp(0.5rem, 2vw, 0.5rem)' }}>
                              <form onSubmit={(e) => handleResponse(e, review.id)}>
                                <textarea placeholder="Write your response to this review..." value={responseText} onChange={(e) => setResponseText(e.target.value)} rows={3} style={{ width: '100%', padding: 'clamp(0.5rem, 2vw, 0.75rem)', border: '1px solid hsl(40 20% 88%)', borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)', fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }} />
                                <div style={{ display: 'flex', gap: 'clamp(0.375rem, 1.5vw, 0.5rem)', marginTop: 'clamp(0.5rem, 2vw, 0.5rem)' }}>
                                  <button type="submit" disabled={processing} className="action-button" style={{ flex: 1, padding: 'clamp(0.375rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)', background: !processing ? 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)' : 'hsl(200 15% 70%)', color: 'white', border: 'none', borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontWeight: '500', cursor: !processing ? 'pointer' : 'not-allowed', opacity: processing ? 0.7 : 1 }}>{processing ? 'Submitting...' : 'Submit'}</button>
                                  <button type="button" onClick={() => { setRespondingTo(null); }} disabled={processing} className="action-button" style={{ flex: 1, padding: 'clamp(0.375rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)', border: '1px solid hsl(40 20% 88%)', borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)', backgroundColor: 'white', color: 'hsl(200 25% 15%)', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontWeight: '500', cursor: processing ? 'not-allowed' : 'pointer', opacity: processing ? 0.7 : 1 }}>Cancel</button>
                                </div>
                              </form>
                            </div>
                          ) : (
                            <button onClick={() => setRespondingTo(review.id)} className="action-button" style={{ width: '100%', padding: 'clamp(0.375rem, 2vw, 0.375rem) clamp(0.5rem, 2vw, 0.75rem)', border: '1px solid hsl(40 20% 88%)', borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)', backgroundColor: 'white', color: 'hsl(174 62% 32%)', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(0.25rem, 1vw, 0.5rem)', marginTop: 'clamp(0.5rem, 2vw, 0.5rem)' }}>
                              <MessageSquare style={{ height: 'clamp(0.875rem, 2.5vw, 1rem)', width: 'clamp(0.875rem, 2.5vw, 1rem)' }} />
                              Respond
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)', padding: 'clamp(1.5rem, 4vw, 2rem)', textAlign: 'center' }}>
                      <MessageSquare style={{ height: 'clamp(2.5rem, 10vw, 3rem)', width: 'clamp(2.5rem, 10vw, 3rem)', color: 'hsl(200 15% 45%)', margin: '0 auto clamp(0.75rem, 2vw, 1rem) auto' }} />
                      <h3 style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)' }}>No Reviews Yet</h3>
                      <p style={{ color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.875rem, 2vw, 0.875rem)' }}>You haven't received any reviews from tenants yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Billing Tab ──────────────────────────────────────────────────── */}
              {activeTab === 'billing' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                  <h2 style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600', margin: 0 }}>
                    Billing & Subscription
                  </h2>

                  {/* ↓ billing and onUpgrade now both passed */}
                  <BillingModule
                    billing={billing}
                    onUpgrade={() => setShowPricingModal(true)}
                  />
                </div>
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
              <AddRentalPage agentData={agentData} setShowAddListingModal={setShowAddListingModal} />
            </div>
          </div>
        )}

        {/* Edit Listing Modal */}
        {showEditListingModal && selectedRental && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 'clamp(0.5rem, 2vw, 1rem)' }}>
            <div className="modal-content" style={{ backgroundColor: 'white', borderRadius: 'clamp(0.75rem, 2vw, 1rem)', maxHeight: '90vh', overflow: 'auto', maxWidth: 'clamp(90%, 95vw, 60%)', width: '100%', position: 'relative' }}>
              <button onClick={() => { setShowEditListingModal(false); setSelectedRental(null); }} className="action-button" style={{ position: 'sticky', top: 0, right: 0, padding: 'clamp(0.75rem, 2vw, 1rem)', border: 'none', background: 'transparent', fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', cursor: 'pointer', color: 'hsl(200 15% 45%)', float: 'right', zIndex: 10 }}>✕</button>
              <EditRentals agentData={agentData} setShowEditListingModal={setShowEditListingModal} rental={selectedRental} />
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