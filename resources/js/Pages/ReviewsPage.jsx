import { useState } from "react";
import Header from '../Components/Layouts/Header';
import Footer from '../Components/Layouts/Footer';
import AppReview from './AppReview';

// Icons
const MessageSquare = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const Star = ({ style }) => (
  <svg style={style} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CheckCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Flag = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
);

const Phone = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

// const rentReviews = [
//   {
//     id: "1",
//     overall_rating: 5,
//     landlord_responsive: true,
//     property_matched_description: true,
//     fair_pricing: true,
//     timely_repairs: true,
//     good_communication: true,
//     respected_privacy: true,
//     refunded_deposit: true,
//     comment: "Great experience! The landlord was very responsive and the property was exactly as described. Highly recommend!",
//     agent_response: "Thank you for your positive feedback! We're glad you had a great experience.",
//     is_anonymous: false,
//     created_at: "2024-01-01"
//   },
//   {
//     id: "2",
//     overall_rating: 4,
//     landlord_responsive: true,
//     property_matched_description: true,
//     fair_pricing: false,
//     timely_repairs: true,
//     good_communication: true,
//     respected_privacy: true,
//     refunded_deposit: null,
//     comment: "Good property overall, though I felt the rent was a bit high for the area. Landlord was very helpful with maintenance issues.",
//     agent_response: null,
//     is_anonymous: true,
//     created_at: "2023-12-15"
//   },
//   {
//     id: "3",
//     overall_rating: 3,
//     landlord_responsive: false,
//     property_matched_description: true,
//     fair_pricing: true,
//     timely_repairs: false,
//     good_communication: false,
//     respected_privacy: true,
//     refunded_deposit: false,
//     comment: "Property was nice but landlord took long to respond to repair requests. Deposit refund process was complicated.",
//     agent_response: "We apologize for the delay. We've improved our response time and processes. Thank you for the feedback.",
//     is_anonymous: false,
//     created_at: "2023-11-20"
//   }
// ];

// const reports = [
//   {
//     id: "1",
//     type: "Scam Listing",
//     property: "2-Bedroom Apartment in East Legon",
//     description: "This listing appears to be a scam. The agent requested payment before viewing and the photos seem to be stock images.",
//     status: "Under Investigation",
//     created_at: "2024-01-15"
//   },
//   {
//     id: "2",
//     type: "Misleading Information",
//     property: "Studio in Osu",
//     description: "Property was advertised as newly renovated but was in poor condition. Photos were heavily edited.",
//     status: "Resolved",
//     created_at: "2024-01-10"
//   }
// ];

const appReviews = [
  {
    id: "1",
    overall_rating: 5,
    comment: "This app has made finding a rental so much easier! The interface is clean and the verification system gives me peace of mind.",
    user_name: "Sarah K.",
    created_at: "2024-01-20"
  },
  {
    id: "2",
    overall_rating: 4,
    comment: "Great app overall. Would love to see a map view feature added in the future. Customer support is excellent!",
    user_name: "Michael A.",
    created_at: "2024-01-18"
  },
  {
    id: "3",
    overall_rating: 5,
    comment: "Finally, a trustworthy platform for rentals in Ghana! The review system is incredibly helpful.",
    user_name: "Akosua M.",
    created_at: "2024-01-12"
  }
];

const ReviewsSection = ({ reviews, reports }) => {
  const [activeTab, setActiveTab] = useState("rent");
  const [showReviewForm, setShowReviewForm] = useState(false);

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

  const reviewCheckItems = [
    { key: "landlord_responsive", label: "Landlord was responsive" },
    { key: "property_matched_description", label: "Property matched description" },
    { key: "fair_pricing", label: "Fair pricing" },
    { key: "good_communication", label: "Good communication" },
  ];

  const tabs = [
    { id: "rent", label: "Rent Reviews", icon: MessageSquare, count: reviews.length },
    { id: "reports", label: "Reports", icon: Flag, count: reports.length },
    { id: "app", label: "App Reviews", icon: Phone, count: appReviews.length }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
      `}</style>
      <Header />

      <div style={{ padding: '2rem', backgroundColor: 'hsl(40 33% 98%)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', overflow: 'hidden' }}>
            {/* Tabs Navigation */}
            <div style={{
              display: 'flex',
              borderBottom: '2px solid hsl(40 20% 88%)',
              backgroundColor: 'hsl(40 30% 96%)'
            }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      border: 'none',
                      backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                      borderBottom: activeTab === tab.id ? '2px solid hsl(174 62% 32%)' : '2px solid transparent',
                      marginBottom: '-2px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontWeight: activeTab === tab.id ? '600' : '500',
                      color: activeTab === tab.id ? 'hsl(174 62% 32%)' : 'hsl(200 15% 45%)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Icon style={{ height: '1.25rem', width: '1.25rem' }} />
                    <span>{tab.label}</span>
                    <span style={{
                      backgroundColor: activeTab === tab.id ? 'hsl(174 62% 32%)' : 'hsl(200 15% 45%)',
                      color: 'white',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid hsl(40 20% 88%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'hsl(200 25% 15%)',
                  marginBottom: '0.25rem'
                }}>
                  {activeTab === "rent" && "Tenant & Landlord Reviews"}
                  {activeTab === "reports" && "Property Reports"}
                  {activeTab === "app" && "Platform Reviews"}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                  {activeTab === "rent" && `${reviews.length} reviews from tenants`}
                  {activeTab === "reports" && `${reports.length} reports submitted`}
                  {activeTab === "app" && `${appReviews.length} reviews of our platform`}
                </p>
              </div>
              {activeTab === "app" && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Write App Review
                </button>
              )}
              {(activeTab === "app") && showReviewForm && (
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
                      <AppReview setShowReviewForm={setShowReviewForm} />
                    </div>
                  </div>
                )}
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem' }}>
              {/* Rent Reviews Tab */}
              {activeTab === "rent" && (
                <>
                  {reviews.map((review, reviewIndex) => (
                    <div key={review.id}>
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: reviewIndex < reviews.length - 1 ? '1.5rem' : 0 }}>
                        <div style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '50%',
                          backgroundColor: 'hsl(174 62% 32% / 0.1)',
                          color: 'hsl(174 62% 32%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          fontWeight: '600',
                          flexShrink: 0
                        }}>
                          {review.full_name ? '?' : 'T'}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.25rem',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{ fontWeight: '500', color: 'hsl(200 25% 15%)' }}>
                              {review.full_name ? 'Anonymous Tenant' : 'Verified Tenant'}
                            </span>
                            <div style={{ display: 'flex' }}>
                              {renderStars(review.overall_rating)}
                            </div>
                          </div>

                          <p style={{
                            fontSize: '0.75rem',
                            color: 'hsl(200 15% 45%)',
                            marginBottom: '0.75rem'
                          }}>
                            {new Date(review.created_at).toLocaleDateString('en-GB', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>

                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '0.5rem',
                            marginBottom: '0.75rem',
                            fontSize: '0.875rem'
                          }}>
                            {reviewCheckItems.map((item) => {
                              const value = review[item.key];
                              if (value === null) return null;
                              return (
                                <div
                                  key={item.key}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    color: value ? 'hsl(152 60% 40%)' : 'hsl(200 15% 45%)'
                                  }}
                                >
                                  {value ? (
                                    <CheckCircle style={{ height: '0.875rem', width: '0.875rem' }} />
                                  ) : (
                                    <XCircle style={{ height: '0.875rem', width: '0.875rem' }} />
                                  )}
                                  {item.label}
                                </div>
                              );
                            })}
                          </div>

                          {review.comments && (
                            <p style={{ color: 'hsl(200 15% 45%)', lineHeight: '1.6', marginBottom: '0.75rem' }}>
                              "{review.comments}"
                            </p>
                          )}

                          {review.response && (
                            <div style={{
                              marginTop: '1rem',
                              paddingLeft: '1rem',
                              borderLeft: '2px solid hsl(174 62% 32% / 0.2)',
                              backgroundColor: 'hsl(40 30% 94%)',
                              padding: '0.75rem',
                              borderRadius: '0 0.5rem 0.5rem 0'
                            }}>
                              <p style={{
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                color: 'hsl(174 62% 32%)',
                                marginBottom: '0.25rem'
                              }}>
                                Agent Response
                              </p>
                              <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                                {review.response}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {reviewIndex < reviews.length - 1 && (
                        <div style={{ height: '1px', backgroundColor: 'hsl(40 20% 88%)', margin: '1.5rem 0' }} />
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* Reports Tab */}
              {activeTab === "reports" && (
                <>
                  {reports.map((report, reportIndex) => (
                    <div key={report.id}>
                      <div style={{ marginBottom: reportIndex < reports.length - 1 ? '1.5rem' : 0 }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          marginBottom: '0.5rem',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}>
                          <div>
                            <h4 style={{
                              fontWeight: '600',
                              color: 'hsl(200 25% 15%)',
                              marginBottom: '0.25rem'
                            }}>
                              {report.report_type}
                            </h4>
                            <p style={{
                              fontSize: '0.875rem',
                              color: 'hsl(174 62% 32%)',
                              fontWeight: '500'
                            }}>
                              {report.rental_id}
                            </p>
                          </div>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            backgroundColor: report.status === "Resolved" ? 'hsl(152 60% 95%)' : 'hsl(38 92% 95%)',
                            color: report.status === "Resolved" ? 'hsl(152 60% 40%)' : 'hsl(38 92% 40%)'
                          }}>
                            {report.status}
                          </span>
                        </div>
                        <p style={{
                          color: 'hsl(200 15% 45%)',
                          lineHeight: '1.6',
                          marginBottom: '0.5rem'
                        }}>
                          {report.report_description}
                        </p>
                        <p style={{
                          fontSize: '0.75rem',
                          color: 'hsl(200 15% 45%)'
                        }}>
                          Reported on {new Date(report.created_at).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      {reportIndex < reports.length - 1 && (
                        <div style={{ height: '1px', backgroundColor: 'hsl(40 20% 88%)', margin: '1.5rem 0' }} />
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* App Reviews Tab */}
              {activeTab === "app" && (
                <>
                  {appReviews.map((review, reviewIndex) => (
                    <div key={review.id}>
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: reviewIndex < appReviews.length - 1 ? '1.5rem' : 0 }}>
                        <div style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '50%',
                          backgroundColor: 'hsl(174 62% 32% / 0.1)',
                          color: 'hsl(174 62% 32%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          fontWeight: '600',
                          flexShrink: 0
                        }}>
                          {review.user_name.charAt(0)}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.25rem',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{ fontWeight: '500', color: 'hsl(200 25% 15%)' }}>
                              {review.user_name}
                            </span>
                            <div style={{ display: 'flex' }}>
                              {renderStars(review.overall_rating)}
                            </div>
                          </div>

                          <p style={{
                            fontSize: '0.75rem',
                            color: 'hsl(200 15% 45%)',
                            marginBottom: '0.75rem'
                          }}>
                            {new Date(review.created_at).toLocaleDateString('en-GB', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>

                          <p style={{ color: 'hsl(200 15% 45%)', lineHeight: '1.6' }}>
                            {review.comment}
                          </p>
                        </div>
                      </div>

                      {reviewIndex < appReviews.length - 1 && (
                        <div style={{ height: '1px', backgroundColor: 'hsl(40 20% 88%)', margin: '1.5rem 0' }} />
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReviewsSection;