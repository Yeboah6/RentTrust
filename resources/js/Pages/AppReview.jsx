import { useState } from "react";
import { Star, X } from "lucide-react";

const AppReview = ({ propertyId, agentId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    overall_rating: 0,
    name: "",
    comment: "",
  });
  const [errors, setErrors] = useState({});

  // Mock user - set to null to test "not signed in" state
  const user = { id: "user123", email: "user@example.com" };

  const showToast = (title, description, variant = "success") => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.overall_rating < 1 || formData.overall_rating > 5) {
      newErrors.overall_rating = "Please select a rating";
    }
    
    if (formData.comment && formData.comment.length > 1000) {
      newErrors.comment = "Comment must be less than 1000 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      showToast("Please sign in", "You need to be signed in to submit a review", "error");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Review submitted:", {
        property_id: propertyId,
        agent_id: agentId,
        reviewer_id: user.id,
        ...formData,
        comment: formData.comment || null,
      });
      
      showToast("Review submitted", "Thank you for sharing your experience!");
      
      // Reset form
      setFormData({
        overall_rating: 0,
        name: "",
        comment: "",
      });
      setErrors({});
      setIsSubmitting(false);
      
      onSuccess?.();
    }, 1500);
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
          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{toast.title}</div>
          <div style={{ fontSize: '0.875rem' }}>{toast.description}</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                onClick={() => setFormData({ ...formData, overall_rating: value })}
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
                    color: value <= (hoveredRating || formData.overall_rating) ? '#f59e0b' : '#d1d5db',
                    fill: value <= (hoveredRating || formData.overall_rating) ? '#f59e0b' : 'none',
                    transition: 'all 0.2s'
                  }}
                />
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {formData.overall_rating === 0 
              ? "Click to rate" 
              : `You rated ${formData.overall_rating} star${formData.overall_rating !== 1 ? "s" : ""}`}
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
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
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
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '0.625rem',
            backgroundColor: isSubmitting ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontWeight: '500',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem'
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
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
        onClick={() => onOpenChange(false)}
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
      <X size={20} onClick={() => setShowReviewForm(false)}/>
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
            Write a Review
          </h1>
          <p style={{ color: '#6b7280' }}>
            Share your experience with RentTrust to help others make informed decisions
          </p>
        </div>

        <AppReview
          propertyId="prop123"
          agentId="agent456"
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}