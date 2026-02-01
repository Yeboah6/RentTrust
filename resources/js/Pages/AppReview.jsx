import { useState } from "react";
import { Star, X } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { User } from "lucide-react";
import { usePage } from '@inertiajs/react';

const AppReview = ({ onSuccess, setShowReviewForm }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [toast, setToast] = useState(null);
  const { auth } = usePage().props;

  const userFullName = auth?.agent?.fullName || auth?.tenant?.fullName || auth?.super?.fullName || "";

  const { data, setData, post, processing, reset, errors } = useForm({
    'overall_rating': 0,
    'name': "",
    'comment': ""
  })

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure name is populated from authenticated user when empty
    const finalData = {
      ...data,
      name: (data.name && data.name.trim() !== "") ? data.name : userFullName
    };

    post("/reviews/app", {
      data: finalData,
      onSuccess: () => {
        showToast("Review Submitted", "Thank you!!", "success");
        reset();
        setTimeout(() => {
          setShowReviewForm(false);
        }, 1500);
      },
      onError: (errors) => {
        console.error('Submission errors:', errors);
        showToast("Submission Failed", "Please correct the errors and try again.", "error");
      },
    });
  }

  const showToast = (name, comment = "success") => {
    setToast({ name, comment, variant: comment });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      {/* Toast Notification */}
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
          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{toast.name}</div>
          <div style={{ fontSize: '0.875rem' }}>{toast.comment}</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <form onSubmit={handleSubmit}>
        {/* Overall Rating */}
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
                onClick={() => setData({ ...data, overall_rating: value })}
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

        {/* Comment */}
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
            value={data.comment}
            onChange={(e) => setData({ ...data, comment: e.target.value })}
            placeholder="Share more details about your experience..."
            rows={4}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: `1px solid ${errors.comment ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
          {errors.comment && (
            <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
              {errors.comment}
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
            value={data.name || userFullName }
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="Solomon Yeboah"
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: `1px solid ${errors.comment ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
          {errors.comment && (
            <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
              {errors.comment}
            </p>
          )}
        </div>
        <br />
        {/* Submit Button */}
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
            ring: 2px;
            ring-color: hsl(174 62% 32%);
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

// Demo App
export default function App({ setShowReviewForm }) {
  const handleSuccess = () => {
    console.log("Review submitted successfully!");
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <br />

      <button
        onClick={() => setShowReviewForm(false)}
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
        maxWidth: '800px',
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
            Rate your Experience
          </h1>
          <p style={{ color: '#6b7280' }}>
            Share your experience with RentTrust to help others make informed decisions
          </p>
        </div>

        <AppReview setShowReviewForm={setShowReviewForm} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}