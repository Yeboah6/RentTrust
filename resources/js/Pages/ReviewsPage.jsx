import { useState } from "react";
import Header from '../Components/Layouts/Header';
import Footer from '../Components/Layouts/Footer';

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

const reviews = [
  {
    id: "1",
    overall_rating: 5,
    landlord_responsive: true,
    property_matched_description: true,
    fair_pricing: true,
    timely_repairs: true,
    good_communication: true,
    respected_privacy: true,
    refunded_deposit: true,
    comment: "Great experience! The landlord was very responsive and the property was exactly as described. Highly recommend!",
    agent_response: "Thank you for your positive feedback! We're glad you had a great experience.",
    is_anonymous: false,
    created_at: "2024-01-01"
  },
  {
    id: "2",
    overall_rating: 4,
    landlord_responsive: true,
    property_matched_description: true,
    fair_pricing: false,
    timely_repairs: true,
    good_communication: true,
    respected_privacy: true,
    refunded_deposit: null,
    comment: "Good property overall, though I felt the rent was a bit high for the area. Landlord was very helpful with maintenance issues.",
    agent_response: null,
    is_anonymous: true,
    created_at: "2023-12-15"
  },
  {
    id: "3",
    overall_rating: 3,
    landlord_responsive: false,
    property_matched_description: true,
    fair_pricing: true,
    timely_repairs: false,
    good_communication: false,
    respected_privacy: true,
    refunded_deposit: false,
    comment: "Property was nice but landlord took long to respond to repair requests. Deposit refund process was complicated.",
    agent_response: "We apologize for the delay. We've improved our response time and processes. Thank you for the feedback.",
    is_anonymous: false,
    created_at: "2023-11-20"
  }
];

const ReviewsSection = () => {
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
    { key: "timely_repairs", label: "Timely repairs" },
    { key: "good_communication", label: "Good communication" },
    { key: "respected_privacy", label: "Respected privacy" },
    { key: "refunded_deposit", label: "Deposit refunded properly" }
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
          <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem' }}>
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
                <h3 className="text-xl font-semibold mb-1" style={{
                  color: 'hsl(200 25% 15%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <MessageSquare style={{ height: '1.25rem', width: '1.25rem' }} />
                  Tenant & Agent/Landloard Reviews
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                  {reviews.length} reviews from users
                </p>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
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
                Write Review
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div style={{ padding: '1.5rem', backgroundColor: 'hsl(40 30% 94%)', borderBottom: '1px solid hsl(40 20% 88%)' }}>
                <p style={{ textAlign: 'center', color: 'hsl(200 15% 45%)' }}>
                  Review form would go here
                </p>
              </div>
            )}

            {/* Reviews List */}
            <div style={{ padding: '1.5rem' }}>
              {reviews.map((review, reviewIndex) => (
                <div key={review.id}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: reviewIndex < reviews.length - 1 ? '1.5rem' : 0 }}>
                    {/* Avatar */}
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
                      {review.is_anonymous ? '?' : 'T'}
                    </div>

                    <div style={{ flex: 1 }}>
                      {/* Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem',
                        flexWrap: 'wrap'
                      }}>
                        <span className="font-medium" style={{ color: 'hsl(200 25% 15%)' }}>
                          {review.is_anonymous ? 'Anonymous Tenant' : 'Verified Tenant'}
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

                      {/* Review Checklist */}
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

                      {/* Comment */}
                      {review.comment && (
                        <p style={{ color: 'hsl(200 15% 45%)', lineHeight: '1.6', marginBottom: '0.75rem' }}>
                          {review.comment}
                        </p>
                      )}

                      {/* Agent Response */}
                      {review.agent_response && (
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
                            {review.agent_response}
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

              {reviews.length === 0 && (
                <p style={{ textAlign: 'center', color: 'hsl(200 15% 45%)', padding: '2rem 0' }}>
                  No reviews yet. Be the first to share your experience!
                </p>
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