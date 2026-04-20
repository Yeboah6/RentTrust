import { useState } from "react";
import Header from '../Components/Layouts/Header';
import Footer from '../Components/Layouts/Footer';
import AppReview from '../Components/Modules/AppReview';
import { User } from 'lucide-react';
import { usePage } from '@inertiajs/react';

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

const ReviewsSection = ({ reviews, reports, appReviews }) => {
  const [activeTab, setActiveTab] = useState("rent");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { auth } = usePage().props;

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

  const renderReportStatusBadge = (status) => {
    const normalized = (status || 'pending').toLowerCase();
    const styles = {
      pending:    { label: 'Pending',    bg: 'hsl(40 30% 94%)',    color: 'hsl(200 25% 15%)', border: 'hsl(40 20% 88%)' },
      reviewing:  { label: 'Reviewing',  bg: 'hsl(214 100% 95%)',  color: 'hsl(214 100% 40%)', border: 'hsl(214 100% 80%)' },
      resolved:   { label: 'Resolved',   bg: 'hsl(152 60% 95%)',  color: 'hsl(152 60% 40%)', border: 'hsl(152 60% 80%)' },
      dismissed:  { label: 'Dismissed',  bg: 'hsl(0 0% 95%)',     color: 'hsl(0 0% 45%)',    border: 'hsl(0 0% 80%)' },
    };
    const s = styles[normalized] ?? styles.pending;
    return (
      <span style={{
        padding: 'clamp(0.1875rem, 1vw, 0.25rem) clamp(0.5rem, 2vw, 0.75rem)',
        borderRadius: '9999px',
        fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
        fontWeight: '500',
        backgroundColor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: 'nowrap'
      }}>
        {s.label}
      </span>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        
        /* Mobile touch optimization */
        @media (max-width: 768px) {
          .tab-button {
            min-height: 44px;
            -webkit-tap-highlight-color: transparent;
            font-size: clamp(0.75rem, 2vw, 0.875rem) !important;
          }
          
          .tab-icon {
            height: clamp(1rem, 3vw, 1.25rem) !important;
            width: clamp(1rem, 3vw, 1.25rem) !important;
          }
          
          .review-item {
            flex-direction: column;
            gap: 0.75rem !important;
          }
          
          .check-items-grid {
            grid-template-columns: 1fr !important;
          }
          
          .modal-content {
            max-width: 95% !important;
            margin: 0.5rem;
            max-height: 85vh;
          }
          
          .count-badge {
            font-size: 0.6875rem !important;
            padding: 0.125rem 0.375rem !important;
          }
        }
        
        /* Extra small devices */
        @media (max-width: 480px) {
          .tabs-container {
            flex-direction: column;
            border-bottom: none !important;
          }
          
          .tab-button {
            border-bottom: 1px solid hsl(40 20% 88%);
            justify-content: flex-start !important;
            padding-left: 1rem !important;
          }
          
          .header-section {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
        }
        
        /* Prevent zoom on input focus for iOS */
        @media (max-width: 768px) {
          input[type="text"],
          input[type="email"],
          textarea {
            font-size: 16px !important;
          }
        }
        
        /* Landscape mobile */
        @media (max-height: 600px) and (orientation: landscape) {
          .modal-content {
            max-height: 75vh;
          }
        }
        
        /* Tablet */
        @media (min-width: 481px) and (max-width: 768px) {
          .check-items-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        /* Desktop */
        @media (min-width: 769px) {
          .check-items-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
          }
        }
      `}</style>
      
      <Header />
      
      <div style={{ 
        padding: 'clamp(1rem, 3vw, 2rem) clamp(0.75rem, 3vw, 1rem)', 
        backgroundColor: 'hsl(40 33% 98%)', 
        minHeight: '100vh' 
      }}>
        <div style={{ 
          maxWidth: '56rem', 
          margin: '0 auto' 
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid hsl(40 20% 88%)', 
            borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)', 
            overflow: 'hidden' 
          }}>
            {/* Tabs Navigation */}
            <div className="tabs-container" style={{
              display: 'flex',
              borderBottom: '2px solid hsl(40 20% 88%)',
              backgroundColor: 'hsl(40 30% 96%)',
              flexDirection: 'row'
            }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className="tab-button"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      flex: 1,
                      padding: 'clamp(0.75rem, 2vw, 1rem)',
                      border: 'none',
                      backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                      borderBottom: activeTab === tab.id ? '2px solid hsl(174 62% 32%)' : '2px solid transparent',
                      marginBottom: '-2px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'clamp(0.25rem, 1vw, 0.5rem)',
                      fontWeight: activeTab === tab.id ? '600' : '500',
                      color: activeTab === tab.id ? 'hsl(174 62% 32%)' : 'hsl(200 15% 45%)',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      touchAction: 'manipulation'
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
                    <Icon className="tab-icon" style={{ 
                      height: 'clamp(1rem, 3vw, 1.25rem)', 
                      width: 'clamp(1rem, 3vw, 1.25rem)' 
                    }} />
                    <span style={{
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                    }}>{tab.label}</span>
                    <span className="count-badge" style={{
                      backgroundColor: activeTab === tab.id ? 'hsl(174 62% 32%)' : 'hsl(200 15% 45%)',
                      color: 'white',
                      padding: 'clamp(0.125rem, 1vw, 0.125rem) clamp(0.375rem, 2vw, 0.5rem)',
                      borderRadius: '9999px',
                      fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                      fontWeight: '600'
                    }}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Header */}
            <div className="header-section" style={{
              padding: 'clamp(1rem, 3vw, 1.5rem)',
              borderBottom: '1px solid hsl(40 20% 88%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              flexWrap: 'wrap',
              gap: 'clamp(0.5rem, 2vw, 1rem)'
            }}>
              <div>
                <h3 style={{
                  fontSize: 'clamp(1.125rem, 4vw, 1.25rem)',
                  fontWeight: '600',
                  color: 'hsl(200 25% 15%)',
                  marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)',
                  lineHeight: '1.2'
                }}>
                  {activeTab === "rent" && "Tenant & Landlord Reviews"}
                  {activeTab === "reports" && "Property Reports"}
                  {activeTab === "app" && "Platform Reviews"}
                </h3>
                <p style={{ 
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                  color: 'hsl(200 15% 45%)' 
                }}>
                  {activeTab === "rent" && `${reviews.length} reviews from tenants`}
                  {activeTab === "reports" && `${reports.length} reports submitted`}
                  {activeTab === "app" && `${appReviews.length} reviews of our platform`}
                </p>
              </div>
              {activeTab === "app" && (
                <button
                onClick={() => {
                    if (!auth?.agent && !auth?.super && !auth?.tenant) {
                      window.location.href = '/sign-up';
                    } else {
                      setShowReviewForm(true);
                    }
                  }}
                  style={{
                    padding: 'clamp(0.5rem, 2vw, 0.5rem) clamp(0.75rem, 3vw, 1rem)',
                    background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    whiteSpace: 'nowrap',
                    touchAction: 'manipulation',
                    minHeight: '44px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Write App Review
                </button>
              )}
            </div>

            {/* Content */}
            <div style={{ 
              padding: 'clamp(1rem, 3vw, 1.5rem)' 
            }}>
              {/* Rent Reviews Tab */}
              {activeTab === "rent" && (
                <>
                  {reviews.map((review, reviewIndex) => (
                    <div key={review.id}>
                      <div className="review-item" style={{ 
                        display: 'flex', 
                        gap: 'clamp(0.75rem, 2vw, 1rem)', 
                        marginBottom: reviewIndex < reviews.length - 1 ? 'clamp(1rem, 3vw, 1.5rem)' : 0 
                      }}>
                        <div style={{
                          width: 'clamp(2.5rem, 8vw, 2.5rem)',
                          height: 'clamp(2.5rem, 8vw, 2.5rem)',
                          borderRadius: '50%',
                          backgroundColor: 'hsl(174 62% 32% / 0.1)',
                          color: 'hsl(174 62% 32%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                          fontWeight: '600',
                          flexShrink: 0
                        }}>
                          {review.full_name ?  <User size={20} /> : 'T'}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'clamp(0.25rem, 1vw, 0.5rem)',
                            marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{ 
                              fontWeight: '500', 
                              color: 'hsl(200 25% 15%)',
                              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                            }}>
                              {review.full_name}
                            </span>
                            <div style={{ display: 'flex' }}>
                              {renderStars(review.overall_rating)}
                            </div>
                          </div>

                          <p style={{
                            fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                            color: 'hsl(200 15% 45%)',
                            marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)'
                          }}>
                            {new Date(review.created_at).toLocaleDateString('en-GB', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>

                          <div className="check-items-grid" style={{
                            display: 'grid',
                            gap: 'clamp(0.375rem, 1.5vw, 0.5rem)',
                            marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)',
                            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
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
                                    gap: 'clamp(0.25rem, 1vw, 0.375rem)',
                                    color: value ? 'hsl(152 60% 40%)' : 'hsl(200 15% 45%)'
                                  }}
                                >
                                  {value ? (
                                    <CheckCircle style={{ 
                                      height: 'clamp(0.75rem, 2vw, 0.875rem)', 
                                      width: 'clamp(0.75rem, 2vw, 0.875rem)' 
                                    }} />
                                  ) : (
                                    <XCircle style={{ 
                                      height: 'clamp(0.75rem, 2vw, 0.875rem)', 
                                      width: 'clamp(0.75rem, 2vw, 0.875rem)' 
                                    }} />
                                  )}
                                  {item.label}
                                </div>
                              );
                            })}
                          </div>

                          {review.comments && (
                            <p style={{ 
                              color: 'hsl(200 15% 45%)', 
                              lineHeight: '1.6', 
                              marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)',
                              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
                            }}>
                              "{review.comments}"
                            </p>
                          )}

                          {review.response && (
                            <div style={{
                              marginTop: 'clamp(0.75rem, 2vw, 1rem)',
                              paddingLeft: 'clamp(0.75rem, 2vw, 1rem)',
                              borderLeft: '2px solid hsl(174 62% 32% / 0.2)',
                              backgroundColor: 'hsl(40 30% 94%)',
                              padding: 'clamp(0.5rem, 2vw, 0.75rem)',
                              borderRadius: '0 clamp(0.375rem, 2vw, 0.5rem) clamp(0.375rem, 2vw, 0.5rem) 0'
                            }}>
                              <p style={{
                                fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                                fontWeight: '500',
                                color: 'hsl(174 62% 32%)',
                                marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)'
                              }}>
                                Agent Response
                              </p>
                               <span style={{ 
                                  color: 'hsl(200 25% 15%)',
                                  fontSize: 'clamp(0.875rem, 1.5vw, .5rem)'
                                }}>
                                  {review.response_person}
                                </span>
                              <p style={{ 
                                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                                color: 'hsl(200 15% 45%)' 
                              }}>
                                {review.response}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {reviewIndex < reviews.length - 1 && (
                        <div style={{ 
                          height: '1px', 
                          backgroundColor: 'hsl(40 20% 88%)', 
                          margin: 'clamp(1rem, 3vw, 1.5rem) 0' 
                        }} />
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
                      <div style={{ 
                        marginBottom: reportIndex < reports.length - 1 ? 'clamp(1rem, 3vw, 1.5rem)' : 0 
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)',
                          flexWrap: 'wrap',
                          gap: 'clamp(0.25rem, 1vw, 0.5rem)'
                        }}>
                          <div>
                            <h4 style={{
                              fontWeight: '600',
                              color: 'hsl(200 25% 15%)',
                              marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)',
                              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                            }}>
                              {report.report_type}
                            </h4>
                            <p style={{
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                              color: 'hsl(174 62% 32%)',
                              fontWeight: '500'
                            }}>
                              {report.title}
                            </p>
                          </div>
                          {renderReportStatusBadge(report.status)}
                        </div>
                        <p style={{
                          color: 'hsl(200 15% 45%)',
                          lineHeight: '1.6',
                          marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)',
                          fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
                        }}>
                          {report.report_description}
                        </p>
                        <p style={{
                          fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
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
                        <div style={{ 
                          height: '1px', 
                          backgroundColor: 'hsl(40 20% 88%)', 
                          margin: 'clamp(1rem, 3vw, 1.5rem) 0' 
                        }} />
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
                      <div className="review-item" style={{ 
                        display: 'flex', 
                        gap: 'clamp(0.75rem, 2vw, 1rem)', 
                        marginBottom: reviewIndex < appReviews.length - 1 ? 'clamp(1rem, 3vw, 1.5rem)' : 0 
                      }}>
                        <div style={{
                          width: 'clamp(2.5rem, 8vw, 2.5rem)',
                          height: 'clamp(2.5rem, 8vw, 2.5rem)',
                          borderRadius: '50%',
                          backgroundColor: 'hsl(174 62% 32% / 0.1)',
                          color: 'hsl(174 62% 32%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                          fontWeight: '600',
                          flexShrink: 0
                        }}>
                          {review.full_name ?  <User size={20} /> : "T"}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'clamp(0.25rem, 1vw, 0.5rem)',
                            marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{ 
                              fontWeight: '500', 
                              color: 'hsl(200 25% 15%)',
                              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                            }}>
                              {review.full_name}
                            </span>
                            <div style={{ display: 'flex' }}>
                              {renderStars(review.overall_rating)}
                            </div>
                          </div>

                          <p style={{
                            fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                            color: 'hsl(200 15% 45%)',
                            marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)'
                          }}>
                            {new Date(review.created_at).toLocaleDateString('en-GB', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>

                          <p style={{ 
                            color: 'hsl(200 15% 45%)', 
                            lineHeight: '1.6',
                            fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
                          }}>
                            {review.comments}
                          </p>
                        </div>
                      </div>

                      {reviewIndex < appReviews.length - 1 && (
                        <div style={{ 
                          height: '1px', 
                          backgroundColor: 'hsl(40 20% 88%)', 
                          margin: 'clamp(1rem, 3vw, 1.5rem) 0' 
                        }} />
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* App Review Modal */}
      {activeTab === "app" && showReviewForm && (
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
          padding: 'clamp(0.5rem, 2vw, 1rem)'
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
            maxHeight: '90vh',
            overflow: 'auto',
            maxWidth: 'clamp(90%, 95vw, 60%)',
            width: '100%',
            position: 'relative'
          }}>
            <AppReview setShowReviewForm={setShowReviewForm} auth={auth} />
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
};

export default ReviewsSection;