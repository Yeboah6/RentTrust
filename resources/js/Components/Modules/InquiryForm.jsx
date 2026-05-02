import { useState } from "react";
import { X } from "lucide-react";
import { useForm } from "@inertiajs/react";

const InquiryModal = ({ rental, onClose }) => {
  const [toast, setToast] = useState(null);
  const MAX = 1000;

  const { data, setData, post, processing, errors, reset } = useForm({
    message: "",
    type: "form",
  });

  const showToast = (title, description, variant = "success") => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/api/listings/${rental?.id}/track-inquiry`, {
      onSuccess: () => {
        showToast("Inquiry sent", "The agent will get back to you shortly.", "success");
        reset();
        setTimeout(() => onClose?.(), 1600);
      },
      onError: (errors) => {
        showToast("Failed to send", "Please try again.", "error");
      },
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
        .iq-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
        .iq-wrap { font-family: 'DM Sans', sans-serif; }
        .iq-overlay {
          position: fixed; inset: 0;
          background: rgba(10,8,5,0.72);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9000; padding: 1rem;
        }
        .iq-card {
          background: #0f0e0c;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          width: 100%; max-width: 460px;
          max-height: 90vh; overflow-y: auto;
          scrollbar-width: none;
        }
        .iq-card::-webkit-scrollbar { display: none; }
        .iq-stripe {
          height: 3px;
          background: linear-gradient(90deg, #e8a020 0%, #f0c060 50%, #e8a020 100%);
        }
        .iq-header {
          padding: 1.25rem 1.5rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
        }
        .iq-title { font-family: 'DM Serif Display', serif; font-size: 1.5rem; color: #f5f0e8; line-height: 1.2; }
        .iq-subtitle { font-size: 0.75rem; color: rgba(245,240,232,0.4); margin-top: 0.25rem; font-weight: 300; letter-spacing: 0.04em; text-transform: uppercase; }
        .iq-close {
          background: rgba(255,255,255,0.06); border: none; border-radius: 2px;
          width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(245,240,232,0.5); flex-shrink: 0; margin-top: 2px;
          transition: background 0.15s, color 0.15s;
        }
        .iq-close:hover { background: rgba(255,255,255,0.12); color: #f5f0e8; }
        .iq-property {
          margin: 1rem 1.5rem 0;
          padding: 0.75rem 1rem;
          background: rgba(232,160,32,0.06);
          border-left: 2px solid #e8a020;
          border-radius: 0 2px 2px 0;
        }
        .iq-prop-label { font-size: 0.72rem; font-weight: 700; color: rgba(232,160,32,0.8); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px; }
        .iq-prop-name { font-size: 0.875rem; font-weight: 500; color: #f5f0e8; }
        .iq-prop-meta { font-size: 0.75rem; color: rgba(245,240,232,0.4); margin-top: 2px; }
        .iq-body { padding: 1.25rem 1.5rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .iq-label { font-size: 0.6875rem; font-weight: 500; color: rgba(245,240,232,0.4); letter-spacing: 0.08em; text-transform: uppercase; display: block; margin-bottom: 0.5rem; }
        .iq-textarea {
          width: 100%; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 2px;
          padding: 0.65rem 0.75rem; font-size: 0.8125rem; color: #f5f0e8;
          font-family: 'DM Sans', sans-serif; font-weight: 300;
          outline: none; transition: border-color 0.15s;
          resize: vertical; min-height: 108px; line-height: 1.6;
        }
        .iq-textarea::placeholder { color: rgba(245,240,232,0.2); }
        .iq-textarea:focus { border-color: rgba(232,160,32,0.5); background: rgba(232,160,32,0.03); }
        .iq-textarea.err { border-color: rgba(220,60,60,0.5); }
        .iq-char { font-size: 0.6875rem; color: rgba(245,240,232,0.25); text-align: right; margin-top: 0.25rem; }
        .iq-char.warn { color: rgba(232,160,32,0.6); }
        .iq-error { font-size: 0.6875rem; color: #e05050; margin-top: 0.3rem; }
        .iq-divider { height: 1px; background: rgba(255,255,255,0.06); }
        .iq-row { display: flex; gap: 0.625rem; }
        .iq-submit {
          flex: 2; padding: 0.7rem; background: #e8a020;
          border: none; border-radius: 2px;
          font-family: 'DM Sans', sans-serif; font-size: 0.8125rem; font-weight: 500;
          color: #0f0e0c; letter-spacing: 0.05em; text-transform: uppercase;
          cursor: pointer; transition: background 0.15s, opacity 0.15s;
        }
        .iq-submit:hover:not(:disabled) { background: #f0b030; }
        .iq-submit:disabled { opacity: 0.45; cursor: not-allowed; }
        .iq-cancel {
          flex: 1; padding: 0.7rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 2px;
          font-family: 'DM Sans', sans-serif; font-size: 0.8125rem; font-weight: 400;
          color: rgba(245,240,232,0.55); cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .iq-cancel:hover { background: rgba(255,255,255,0.08); color: #f5f0e8; }
        .iq-toast {
          position: fixed; top: 1.25rem; right: 1.25rem;
          padding: 0.875rem 1.125rem; border-radius: 2px;
          z-index: 9999; max-width: 300px; border-left: 3px solid;
          animation: iqSlide 0.25s ease-out;
        }
        .iq-toast.success { background: #0f1a10; border-color: #4caf65; }
        .iq-toast.error   { background: #1a0f0f; border-color: #e05050; }
        .iq-toast-title { font-size: 0.8125rem; font-weight: 500; color: #f5f0e8; }
        .iq-toast-desc  { font-size: 0.75rem; color: rgba(245,240,232,0.5); margin-top: 0.2rem; }
        @keyframes iqSlide { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      <div className="iq-wrap">
        {toast && (
          <div className={`iq-toast ${toast.variant}`}>
            <div className="iq-toast-title">{toast.title}</div>
            <div className="iq-toast-desc">{toast.description}</div>
          </div>
        )}

        <div className="iq-overlay" onClick={onClose}>
          <div className="iq-card" onClick={e => e.stopPropagation()}>
            <div className="iq-stripe" />

            <div className="iq-header">
              <div>
                <div className="iq-title">Send an inquiry</div>
                <div className="iq-subtitle">Your message will reach the listing agent</div>
              </div>
              <button className="iq-close" onClick={onClose}><X size={14} /></button>
            </div>

            {rental && (
              <div className="iq-property">
                <div className="iq-prop-label">Regarding</div>
                <div className="iq-prop-name">{rental.title}</div>
                <div className="iq-prop-meta">{[rental.area, rental.city].filter(Boolean).join(', ')}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="iq-body">
                <div>
                  <label className="iq-label">Your message *</label>
                  <textarea
                    className={`iq-textarea ${errors.message ? 'err' : ''}`}
                    value={data.message}
                    maxLength={1000}
                    onChange={e => setData("message", e.target.value)}
                    placeholder="Hi, I'm interested in this property. Could you provide more details about availability and viewing times?"
                    rows={5}
                  />
                  <div className={`iq-char ${data.message.length > 800 ? 'warn' : ''}`}>
                    {data.message.length} / 1000
                  </div>
                  {errors.message && <p className="iq-error">{errors.message}</p>}
                </div>

                <div className="iq-divider" />

                <div className="iq-row">
                  <button
                    type="submit"
                    className="iq-submit"
                    disabled={processing || !data.message.trim()}
                  >
                    {processing ? "Sending…" : "Send inquiry"}
                  </button>
                  <button type="button" className="iq-cancel" onClick={onClose}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default InquiryModal;