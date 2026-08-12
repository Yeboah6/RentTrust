import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import { useForm, usePage } from '@inertiajs/react';

const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

const AppReview = ({ onSuccess, setShowReviewForm }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [toast, setToast] = useState(null);
  const { auth } = usePage().props;

  const userFullName = auth?.agent?.name || auth?.tenant?.name || auth?.super?.name || "";

  const { data, setData, post, transform, processing, reset, errors } = useForm({
    overall_rating: 0,
    name: "",
    comment: "",
  });

  useEffect(() => {
    if (userFullName && !data.name) setData("name", userFullName);
  }, [userFullName]);

  const showToast = (title, description, variant = "success") => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    transform((formData) => ({
      ...formData,
      name: (formData.name && formData.name.trim() !== "") ? formData.name : userFullName,
    }));

    post("/reviews/app", {
      onSuccess: () => {
        showToast("Review submitted", "Thank you for your feedback.", "success");
        reset();
        setTimeout(() => { if (setShowReviewForm) setShowReviewForm(false); }, 1600);
      },
      onError: (errors) => {
        console.error('Submission errors:', errors);
        showToast("Submission failed", "Please check the form and try again.", "error");
      },
    });
  };

  const active = hoveredRating || data.overall_rating;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');

        .ar-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
        .ar-wrap { font-family: 'DM Sans', sans-serif; }

        .ar-overlay {
          position: fixed; inset: 0;
          background: rgba(10, 8, 5, 0.72);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9000; padding: 1rem;
        }

        .ar-card {
          background: #0f0e0c;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          width: 100%; max-width: 460px;
          max-height: 90vh;
          overflow-y: auto;
          scrollbar-width: none;
          position: relative;
        }
        .ar-card::-webkit-scrollbar { display: none; }

        .ar-stripe {
          height: 3px;
          background: linear-gradient(90deg, #e8a020 0%, #f0c060 50%, #e8a020 100%);
        }

        .ar-header {
          padding: 1.25rem 1.5rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
        }

        .ar-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.5rem;
          color: #f5f0e8;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        .ar-subtitle {
          font-size: 0.75rem;
          color: rgba(245,240,232,0.4);
          margin-top: 0.25rem;
          font-weight: 300;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .ar-close {
          background: rgba(255,255,255,0.06);
          border: none; border-radius: 2px;
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(245,240,232,0.5);
          flex-shrink: 0; margin-top: 2px;
          transition: background 0.15s, color 0.15s;
        }
        .ar-close:hover { background: rgba(255,255,255,0.12); color: #f5f0e8; }

        .ar-body { padding: 1.25rem 1.5rem 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }

        .ar-label {
          font-size: 0.6875rem;
          font-weight: 500;
          color: rgba(245,240,232,0.4);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.6rem;
        }

        .ar-stars { display: flex; align-items: center; gap: 4px; }
        .ar-star-btn {
          background: none; border: none; padding: 2px;
          cursor: pointer; line-height: 0;
          transition: transform 0.12s;
        }
        .ar-star-btn:hover { transform: scale(1.15); }

        .ar-rating-label {
          font-size: 0.75rem;
          color: #e8a020;
          margin-left: 8px;
          font-weight: 300;
          min-width: 60px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .ar-rating-label.visible { opacity: 1; }

        .ar-input, .ar-textarea {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          padding: 0.6rem 0.75rem;
          font-size: 0.8125rem;
          color: #f5f0e8;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          outline: none;
          transition: border-color 0.15s;
        }
        .ar-input::placeholder, .ar-textarea::placeholder {
          color: rgba(245,240,232,0.2);
        }
        .ar-input:focus, .ar-textarea:focus {
          border-color: rgba(232,160,32,0.5);
          background: rgba(232,160,32,0.03);
        }
        .ar-textarea { resize: vertical; min-height: 88px; line-height: 1.5; }
        .ar-input.err, .ar-textarea.err { border-color: rgba(220,60,60,0.5); }

        .ar-error { font-size: 0.6875rem; color: #e05050; margin-top: 0.3rem; }

        .ar-submit {
          width: 100%;
          padding: 0.7rem;
          background: #e8a020;
          border: none; border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #0f0e0c;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s;
        }
        .ar-submit:hover:not(:disabled) { background: #f0b030; }
        .ar-submit:disabled { opacity: 0.45; cursor: not-allowed; }

        .ar-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        .ar-toast {
          position: fixed; top: 1.25rem; right: 1.25rem;
          padding: 0.875rem 1.125rem;
          border-radius: 2px;
          z-index: 9999; max-width: 320px;
          border-left: 3px solid;
          animation: arSlide 0.25s ease-out;
        }
        .ar-toast.success { background: #0f1a10; border-color: #4caf65; }
        .ar-toast.error   { background: #1a0f0f; border-color: #e05050; }
        .ar-toast-title { font-size: 0.8125rem; font-weight: 500; color: #f5f0e8; }
        .ar-toast-desc  { font-size: 0.75rem; color: rgba(245,240,232,0.5); margin-top: 0.2rem; }

        @keyframes arSlide {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>

      <div className="ar-wrap">
        {toast && (
          <div className={`ar-toast ${toast.variant}`}>
            <div className="ar-toast-title">{toast.title}</div>
            <div className="ar-toast-desc">{toast.description}</div>
          </div>
        )}

        <div className="ar-overlay">
          <div className="ar-card">
            <div className="ar-stripe" />

            <div className="ar-header">
              <div>
                <div className="ar-title">Rate your experience</div>
                <div className="ar-subtitle">Help others make better decisions</div>
              </div>
              <button className="ar-close" onClick={() => setShowReviewForm?.(false)}>
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="ar-body">

                {/* Star rating */}
                <div>
                  <label className="ar-label">Overall rating *</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="ar-stars">
                      {[1,2,3,4,5].map(v => (
                        <button
                          key={v} type="button"
                          className="ar-star-btn"
                          onMouseEnter={() => setHoveredRating(v)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => setData('overall_rating', v)}
                        >
                          <Star
                            size={22}
                            strokeWidth={1.5}
                            style={{
                              color: v <= active ? '#e8a020' : 'rgba(255,255,255,0.15)',
                              fill:  v <= active ? '#e8a020' : 'none',
                              transition: 'color 0.12s, fill 0.12s',
                            }}
                          />
                        </button>
                      ))}
                    </div>
                    <span className={`ar-rating-label ${active ? 'visible' : ''}`}>
                      {ratingLabels[active]}
                    </span>
                  </div>
                  {errors.overall_rating && <p className="ar-error">{errors.overall_rating}</p>}
                </div>

                <div className="ar-divider" />

                {/* Comments */}
                <div>
                  <label className="ar-label">Comments <span style={{ opacity: 0.4 }}>(optional)</span></label>
                  <textarea
                    className={`ar-textarea ${errors.comment ? 'err' : ''}`}
                    value={data.comment}
                    onChange={e => setData("comment", e.target.value)}
                    placeholder="Share more about your experience…"
                    rows={3}
                  />
                  {errors.comment && <p className="ar-error">{errors.comment}</p>}
                </div>

                {/* Full name */}
                <div>
                  <label className="ar-label">Full name *</label>
                  <input
                    className={`ar-input ${errors.name ? 'err' : ''}`}
                    value={data.name || userFullName}
                    onChange={e => setData("name", e.target.value)}
                    placeholder="Solomon Yeboah"
                  />
                  {errors.name && <p className="ar-error">{errors.name}</p>}
                </div>

                <button type="submit" className="ar-submit" disabled={processing}>
                  {processing ? "Submitting…" : "Submit review"}
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default function App({ setShowReviewForm }) {
  const handleSuccess = () => {
    console.log("Review submitted successfully!");
  };

  return <AppReview setShowReviewForm={setShowReviewForm} onSuccess={handleSuccess} />;
}