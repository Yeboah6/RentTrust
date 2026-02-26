import { useState } from "react";
import { Star, X } from "lucide-react";
import { useForm, usePage } from '@inertiajs/react';

const ReviewForm = ({ propertyId, agentId, onSuccess, rental, setShowAddReviewForm, auth }) => {
  // const { auth } = usePage().props;
  const [hoveredRating, setHoveredRating] = useState(0);
  const [toast, setToast] = useState(null);

  const userFullName = auth?.agent?.name || auth?.tenant?.name || auth?.super?.name || "";
  console.log("Auth in ReviewForm:", auth);
  
  const { data, setData, post, processing, errors, reset } = useForm({
    overall_rating: 0,
    landlord_responsive: undefined,
    property_matched_description: undefined,
    fair_pricing: undefined,
    good_communication: undefined,
    comments: "",
    full_name: "",
    rental_id: rental?.id || "",
  });

  const checkboxItems = [
    { name: "landlord_responsive", label: "Landlord was responsive", description: "Quick to respond to inquiries and issues" },
    { name: "property_matched_description", label: "Property matched description", description: "What you saw matched the listing" },
    { name: "fair_pricing", label: "Fair pricing", description: "Rent and fees were reasonable" },
    { name: "good_communication", label: "Good communication", description: "Clear and respectful communication" },
  ];

  const showToast = (title, description, variant = "success") => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((!data.full_name || data.full_name.trim() === "") && userFullName) {
      setData("full_name", userFullName);
    }

    post("/review-forms", {
      onSuccess: () => {
        showToast("Review Submitted", "Thank you for helping us maintain trust.", "success");
        reset();
        setTimeout(() => {
          if (setShowAddReviewForm) setShowAddReviewForm(false);
        }, 1500);
      },
      onError: () => {
        showToast("Submission Failed", "Please check the form and try again.", "error");
      }
    });
  };

  const handleCheckboxChange = (name, checked) => {
    setData({
      ...data,
      [name]: checked ? true : !checked ? false : undefined
    });
  };

  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          backgroundColor: toast.variant === 'error' ? '#ef4444' : '#10b981',
          color: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          zIndex: 9999,
          maxWidth: '400px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{toast.title}</div>
          <div style={{ fontSize: '0.875rem' }}>{toast.description}</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <form onSubmit={handleSubmit}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Overall Rating *
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setData('overall_rating', value)}
                  style={{
                    padding: '0.25rem',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Star
                    size={32}
                    style={{
                      color: value <= (hoveredRating || data.overall_rating) ? '#f59e0b' : '#d1d5db',
                      fill: value <= (hoveredRating || data.overall_rating) ? '#f59e0b' : 'none',
                      transition: 'all 0.2s'
                    }}
                  />
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {data.overall_rating === 0 
                ? "Click to rate" 
                : `You rated ${data.overall_rating} star${data.overall_rating !== 1 ? "s" : ""}`}
            </p>
            {errors.overall_rating && (
              <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                {errors.overall_rating}
              </p>
            )}
          </div>

          <input type="hidden" value={data.property_id} />

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '1rem'
            }}>
              Your Experience (check all that apply)
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem'
            }}>
              {checkboxItems.map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    padding: '1rem'
                  }}
                >
                  <input
                    type="checkbox"
                    id={item.name}
                    checked={data[item.name] === true}
                    onChange={(e) => handleCheckboxChange(item.name, e.target.checked)}
                    style={{
                      width: '1rem',
                      height: '1rem',
                      marginTop: '0.125rem',
                      cursor: 'pointer',
                      accentColor: '#3b82f6'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <label
                      htmlFor={item.name}
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#111827',
                        marginBottom: '0.25rem',
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </label>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      lineHeight: '1.4'
                    }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Additional Comments (optional)
            </label>
            <textarea
              value={data.comments}
              onChange={(e) => setData("comments", e.target.value)}
              placeholder="Share more details about your experience..."
              rows={4}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: `1px solid ${errors.comments ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            {errors.comments && (
              <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                {errors.comments}
              </p>
            )}
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Full name
            </label>
            <input
              value={data.full_name || userFullName}
              onChange={(e) => setData("full_name", e.target.value)}
              placeholder="Solomon Yeboah"
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: `1px solid ${errors.full_name ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            {errors.full_name && (
              <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                {errors.full_name}
              </p>
            )}
          </div>
          <br />
          <button
            type="submit"
            disabled={processing}
            style={{
              width: '100%',
              padding: '0.625rem',
              backgroundColor: processing ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: processing ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem'
            }}
          >
            {processing ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          box-shadow: 0 0 0 2px #1f847a;
        }
          
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default function App({ setShowAddReviewForm, rental, auth }) {
  // const { auth } = usePage().props;
  console.log(auth);

  const handleSuccess = () => {
    console.log("Review submitted successfully!");
  };

  return (
    <div style={{
      minHeight: '50vh',
      backgroundColor: '#f9fafb',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <button
        onClick={() => setShowAddReviewForm(false)}
        style={{
          position: 'absolute',
          right: '1rem',
          top: '1rem',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          color: '#6b7280',
          padding: '0.25rem'
        }}
      >
        <X size={20} />
      </button>
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '2rem',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            color: '#111827'
          }}>
            Write a Review
          </h1>
          <p style={{ color: '#6b7280' }}>
            Share your experience to help others make informed decisions
          </p>
        </div>

        <div style={{
          backgroundColor: '#f3f4f6',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '2rem',
          borderLeft: '4px solid #3b82f6'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem', color: '#111827' }}>
            {rental.title} {rental.property_type}
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            {rental.area}, {rental.city}
          </p>
            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              Agent:
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e5e7eb', fontSize: '0.75rem', fontWeight: '600' }}>
                {rental.agent_name?.[0]?.toUpperCase() || 'A'}
              </span>
               <span style={{ fontWeight: '600' }}>{rental.agent_name}</span>
            </p>
          </div>

        <ReviewForm
          propertyId={rental?.id}
          rental={rental}
          onSuccess={handleSuccess}
          auth={auth}
          setShowAddReviewForm={setShowAddReviewForm}
        />
      </div>
    </div>
  );
}