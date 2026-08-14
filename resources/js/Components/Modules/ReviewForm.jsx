import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import { useForm, usePage } from '@inertiajs/react';

const checkboxItems = [
  { name: "landlord_responsive",          label: "Responsive landlord",       icon: "⚡" },
  { name: "property_matched_description", label: "Matched description",        icon: "✓" },
  { name: "fair_pricing",                 label: "Fair pricing",               icon: "₵" },
  { name: "good_communication",           label: "Good communication",         icon: "◎" },
];

const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

const ReviewForm = ({ rental, onSuccess, setShowAddReviewForm, auth }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [toast, setToast] = useState(null);

  const userFullName = auth?.agent?.name || auth?.tenant?.name || auth?.super?.name || "";

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

  useEffect(() => {
    if (userFullName && !data.full_name) setData("full_name", userFullName);
  }, [userFullName]);

  const showToast = (title, description, variant = "success") => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const resolvedName = (data.full_name && data.full_name.trim() !== "")
      ? data.full_name.trim()
      : userFullName;

    post("/review-forms", {
      data: { ...data, full_name: resolvedName },
      onSuccess: () => {
        showToast("Review submitted", "Thank you for your feedback.", "success");
        reset();
        setTimeout(() => { if (setShowAddReviewForm) setShowAddReviewForm(false); }, 1600);
      },
      onError: () => showToast("Submission failed", "Please check the form and try again.", "error"),
    });
  };

  const active = hoveredRating || data.overall_rating;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');

        .rf-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
        .rf-wrap { font-family: 'DM Sans', sans-serif; }

        .rf-overlay {
          position: fixed; inset: 0;
          background: rgba(10, 8, 5, 0.72);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9000; padding: 1rem;
        }

        .rf-card {
          background: #0f0e0c;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          width: 100%; max-width: 460px;
          max-height: 90vh;
          overflow-y: auto;
          scrollbar-width: none;
          position: relative;
        }
        .rf-card::-webkit-scrollbar { display: none; }

        .rf-stripe {
          height: 3px;
          background: linear-gradient(90deg, #e8a020 0%, #f0c060 50%, #e8a020 100%);
        }

        .rf-header {
          padding: 1.25rem 1.5rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
        }

        .rf-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.5rem;
          color: #f5f0e8;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        .rf-subtitle {
          font-size: 0.75rem;
          color: rgba(245,240,232,0.4);
          margin-top: 0.25rem;
          font-weight: 300;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .rf-close {
          background: rgba(255,255,255,0.06);
          border: none; border-radius: 2px;
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(245,240,232,0.5);
          flex-shrink: 0; margin-top: 2px;
          transition: background 0.15s, color 0.15s;
        }
        .rf-close:hover { background: rgba(255,255,255,0.12); color: #f5f0e8; }

        .rf-property {
          margin: 0 1.5rem;
          padding: 0.75rem 1rem;
          background: rgba(232,160,32,0.06);
          border-left: 2px solid #e8a020;
          border-radius: 0 2px 2px 0;
          margin-top: 1rem;
        }
        .rf-prop-name {
          font-size: 0.8125rem; font-weight: 500;
          color: #f5f0e8; line-height: 1.3;
        }
        .rf-prop-meta {
          font-size: 0.6875rem; color: rgba(245,240,232,0.4);
          margin-top: 0.2rem; letter-spacing: 0.02em;
        }
        .rf-prop-agent {
          font-size: 0.6875rem; color: rgba(232,160,32,0.8);
          margin-top: 0.3rem;
        }

        .rf-body { padding: 1.25rem 1.5rem 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }

        .rf-label {
          font-size: 0.6875rem;
          font-weight: 500;
          color: rgba(245,240,232,0.4);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.6rem;
        }

        .rf-stars { display: flex; align-items: center; gap: 4px; }
        .rf-star-btn {
          background: none; border: none; padding: 2px;
          cursor: pointer; line-height: 0;
          transition: transform 0.12s;
        }
        .rf-star-btn:hover { transform: scale(1.15); }

        .rf-rating-label {
          font-size: 0.75rem;
          color: #e8a020;
          margin-left: 8px;
          font-weight: 300;
          min-width: 60px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .rf-rating-label.visible { opacity: 1; }

        .rf-checks { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }

        .rf-check {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.6rem 0.75rem;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 2px;
          cursor: pointer;
          background: rgba(255,255,255,0.02);
          transition: border-color 0.15s, background 0.15s;
          user-select: none;
        }
        .rf-check:hover { border-color: rgba(232,160,32,0.3); background: rgba(232,160,32,0.04); }
        .rf-check.checked { border-color: rgba(232,160,32,0.5); background: rgba(232,160,32,0.07); }

        .rf-check-box {
          width: 14px; height: 14px; flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.15s, background 0.15s;
        }
        .rf-check.checked .rf-check-box {
          border-color: #e8a020;
          background: #e8a020;
        }
        .rf-check-tick { font-size: 9px; color: #0f0e0c; font-weight: 700; line-height: 1; }
        .rf-check-icon { font-size: 0.75rem; color: rgba(245,240,232,0.3); }
        .rf-check.checked .rf-check-icon { color: rgba(232,160,32,0.7); }
        .rf-check-label {
          font-size: 0.75rem; font-weight: 400;
          color: rgba(245,240,232,0.55);
          line-height: 1.3;
        }
        .rf-check.checked .rf-check-label { color: rgba(245,240,232,0.9); }

        .rf-input, .rf-textarea {
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
        .rf-input::placeholder, .rf-textarea::placeholder {
          color: rgba(245,240,232,0.2);
        }
        .rf-input:focus, .rf-textarea:focus {
          border-color: rgba(232,160,32,0.5);
          background: rgba(232,160,32,0.03);
        }
        .rf-textarea { resize: vertical; min-height: 72px; line-height: 1.5; }
        .rf-input.err, .rf-textarea.err { border-color: rgba(220,60,60,0.5); }

        .rf-error { font-size: 0.6875rem; color: #e05050; margin-top: 0.3rem; }

        .rf-submit {
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
        .rf-submit:hover:not(:disabled) { background: #f0b030; }
        .rf-submit:disabled { opacity: 0.45; cursor: not-allowed; }

        .rf-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        .rf-toast {
          position: fixed; top: 1.25rem; right: 1.25rem;
          padding: 0.875rem 1.125rem;
          border-radius: 2px;
          z-index: 9999; max-width: 320px;
          border-left: 3px solid;
          animation: rfSlide 0.25s ease-out;
        }
        .rf-toast.success { background: #0f1a10; border-color: #4caf65; }
        .rf-toast.error   { background: #1a0f0f; border-color: #e05050; }
        .rf-toast-title { font-size: 0.8125rem; font-weight: 500; color: #f5f0e8; }
        .rf-toast-desc  { font-size: 0.75rem; color: rgba(245,240,232,0.5); margin-top: 0.2rem; }

        @keyframes rfSlide {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }

        /* ---------- Mobile ---------- */
        @media (max-width: 480px) {
          .rf-overlay { padding: 0.5rem; align-items: flex-end; }

          .rf-card { max-height: 92vh; }

          .rf-header { padding: 1rem 1.125rem 0.875rem; }
          .rf-title { font-size: 1.25rem; }
          .rf-subtitle { font-size: 0.6875rem; }

          .rf-property { margin: 0.875rem 1.125rem 0; padding: 0.625rem 0.875rem; }

          .rf-body { padding: 1rem 1.125rem 1.25rem; gap: 1.125rem; }

          /* iOS Safari zooms the viewport on focus for any input under 16px */
          .rf-input, .rf-textarea { font-size: 16px; }

          .rf-checks { grid-template-columns: 1fr; }

          .rf-check { padding: 0.7rem 0.75rem; min-height: 44px; }

          /* Enlarge tap targets without changing the visual star size */
          .rf-star-btn {
            padding: 10px;
            margin: -10px;
            min-width: 44px;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .rf-close {
            width: 40px;
            height: 40px;
          }

          .rf-submit { padding: 0.85rem; min-height: 44px; }

          .rf-toast {
            top: 0.75rem;
            left: 0.75rem;
            right: 0.75rem;
            max-width: none;
          }
        }

        @media (max-height: 600px) and (orientation: landscape) {
          .rf-card { max-height: 96vh; }
          .rf-overlay { padding: 0.5rem; align-items: center; }
        }
      `}</style>

      <div className="rf-wrap">
        {toast && (
          <div className={`rf-toast ${toast.variant}`}>
            <div className="rf-toast-title">{toast.title}</div>
            <div className="rf-toast-desc">{toast.description}</div>
          </div>
        )}

        <div className="rf-overlay">
          <div className="rf-card">
            <div className="rf-stripe" />

            <div className="rf-header">
              <div>
                <div className="rf-title">Write a review</div>
                <div className="rf-subtitle">Help others make better decisions</div>
              </div>
              <button className="rf-close" onClick={() => setShowAddReviewForm?.(false)}>
                <X size={14} />
              </button>
            </div>

            {rental && (
              <div className="rf-property">
                <div className="rf-prop-name">{rental.title} {rental.property_type}</div>
                <div className="rf-prop-meta">{rental.area}, {rental.city}</div>
                {rental.agent_name && (
                  <div className="rf-prop-agent">Agent — {rental.agent_name}</div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="rf-body">

                {/* Star rating */}
                <div>
                  <label className="rf-label">Overall rating *</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="rf-stars">
                      {[1,2,3,4,5].map(v => (
                        <button
                          key={v} type="button"
                          className="rf-star-btn"
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
                    <span className={`rf-rating-label ${active ? 'visible' : ''}`}>
                      {ratingLabels[active]}
                    </span>
                  </div>
                  {errors.overall_rating && <p className="rf-error">{errors.overall_rating}</p>}
                </div>

                <div className="rf-divider" />

                {/* Checkboxes */}
                <div>
                  <label className="rf-label">Your experience</label>
                  <div className="rf-checks">
                    {checkboxItems.map(item => {
                      const checked = data[item.name] === true;
                      return (
                        <div
                          key={item.name}
                          className={`rf-check ${checked ? 'checked' : ''}`}
                          onClick={() => setData({ ...data, [item.name]: checked ? false : true })}
                        >
                          <div className="rf-check-box">
                            {checked && <span className="rf-check-tick">✓</span>}
                          </div>
                          <span className="rf-check-icon">{item.icon}</span>
                          <span className="rf-check-label">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rf-divider" />

                {/* Comments */}
                <div>
                  <label className="rf-label">Comments <span style={{ opacity: 0.4 }}>(optional)</span></label>
                  <textarea
                    className={`rf-textarea ${errors.comments ? 'err' : ''}`}
                    value={data.comments}
                    onChange={e => setData("comments", e.target.value)}
                    placeholder="Share more about your experience…"
                    rows={3}
                  />
                  {errors.comments && <p className="rf-error">{errors.comments}</p>}
                </div>

                {/* Full name */}
                <div>
                  <label className="rf-label">Full name *</label>
                  <input
                    className={`rf-input ${errors.full_name ? 'err' : ''}`}
                    value={data.full_name || userFullName}
                    onChange={e => setData("full_name", e.target.value)}
                    placeholder="Solomon Yeboah"
                  />
                  {errors.full_name && <p className="rf-error">{errors.full_name}</p>}
                </div>

                <input type="hidden" value={data.rental_id} />

                <button type="submit" className="rf-submit" disabled={processing}>
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

export default function App({ setShowAddReviewForm, rental, auth }) {
  return (
    <ReviewForm
      rental={rental}
      auth={auth}
      setShowAddReviewForm={setShowAddReviewForm}
    />
  );
}