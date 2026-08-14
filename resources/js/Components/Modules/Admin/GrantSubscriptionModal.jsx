import { useState } from "react";
import { router } from "@inertiajs/react";

const X = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Gift = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const AlertCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Plans are: Free (0), Verified (149), Pro (349)
// "Next plan" logic: free → verified → pro
// Admin can also manually pick any plan and duration.

const PLAN_ORDER = ['free', 'verified', 'pro'];

const planColor = (slug) => {
  if (slug === 'pro')      return { bg: 'hsl(174 62% 32%)',    text: 'white' };
  if (slug === 'verified') return { bg: 'hsl(214 100% 50%)',   text: 'white' };
  return                          { bg: 'hsl(200 15% 70%)',    text: 'white' };
};

const GrantSubscriptionModal = ({ agent, plans, onClose, onSuccess }) => {
  // Determine current plan slug from agent
  const currentSlug = agent?.package ?? 'free';
  const currentIdx  = PLAN_ORDER.indexOf(currentSlug);
  // Default to next plan up
  const defaultPlan = plans?.find(p => p.slug === PLAN_ORDER[currentIdx + 1])
                   ?? plans?.find(p => p.slug !== 'free')
                   ?? plans?.[0];

  const [selectedPlanId, setSelectedPlanId] = useState(defaultPlan?.id ?? '');
  const [durationMonths, setDurationMonths]  = useState(1);
  const [reason, setReason]                  = useState('');
  const [processing, setProcessing]          = useState(false);
  const [error, setError]                    = useState(null);

  const selectedPlan = plans?.find(p => p.id === Number(selectedPlanId));
  const isFreeSelected = selectedPlan?.slug === 'free';

  // Non-free plans only (can't "grant" free)
  const grantablePlans = (plans ?? []).filter(p => p.slug !== 'free');

  const handleSubmit = () => {
    if (!selectedPlanId) { setError('Please select a plan.'); return; }
    if (isFreeSelected)  { setError('Select a paid plan to grant.'); return; }
    if (durationMonths < 1 || durationMonths > 24) { setError('Duration must be 1–24 months.'); return; }

    setError(null);
    setProcessing(true);

    router.post(`/admin/agents/${agent.id}/grant-subscription`, {
      plan_id:         selectedPlanId,
      duration_months: durationMonths,
      reason:          reason || 'Admin grant',
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setProcessing(false);
        onSuccess?.(`Granted ${selectedPlan.name} to ${agent.fullName} for ${durationMonths} month(s).`);
        onClose();
      },
      onError: (errs) => {
        setProcessing(false);
        setError(Object.values(errs)[0] ?? 'Something went wrong.');
      },
    });
  };

  if (!agent) return null;

  return (
    <div
      className="grant-overlay"
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '1rem' }}
      onClick={onClose}
    >
      <style>{`
        .grant-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0,0,0,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 60;
          padding: 1rem;
        }
        .grant-modal {
          background-color: white;
          border-radius: 1rem;
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow: auto;
          box-shadow: 0 24px 48px rgba(0,0,0,0.15);
        }
        .grant-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid hsl(40 20% 88%);
        }
        .grant-modal-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .grant-modal-footer {
          padding: 1.25rem 1.5rem;
          border-top: 1px solid hsl(40 20% 88%);
          background-color: hsl(40 33% 99%);
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
        .grant-plan-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.625rem;
        }
        .grant-duration-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }
        .grant-footer-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }

        @media (max-width: 640px) {
          .grant-overlay {
            padding: 0.5rem;
            align-items: flex-start;
            overflow-y: auto;
          }
          .grant-modal {
            max-height: 95vh;
            border-radius: 0.75rem;
          }
          .grant-modal-header {
            padding: 1rem 1rem 0.75rem;
          }
          .grant-modal-body {
            padding: 1rem;
            gap: 1rem;
          }
          .grant-modal-footer {
            padding: 1rem;
          }
          .grant-plan-grid {
            grid-template-columns: 1fr; /* stack plan buttons */
          }
          .grant-duration-grid {
            grid-template-columns: repeat(4, 1fr); /* keep 4 columns but smaller */
          }
          .grant-footer-buttons {
            flex-direction: column-reverse;
          }
          .grant-footer-buttons button {
            width: 100%;
          }
        }
      `}</style>

      <div
        className="grant-modal"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="grant-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', backgroundColor: 'hsl(271 76% 95%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gift style={{ height: '1.25rem', width: '1.25rem', color: 'hsl(271 76% 53%)' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'hsl(200 25% 15%)', margin: 0 }}>Grant Free Upgrade</h2>
              <p style={{ fontSize: '0.8rem', color: 'hsl(200 15% 45%)', margin: 0 }}>No payment required</p>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: '0.5rem', border: 'none', backgroundColor: 'hsl(40 30% 94%)', borderRadius: '0.5rem', cursor: 'pointer' }}>
            <X style={{ height: '1.25rem', width: '1.25rem', color: 'hsl(200 15% 45%)' }} />
          </button>
        </div>

        <div className="grant-modal-body">
          {/* Agent info strip */}
          <div style={{ backgroundColor: 'hsl(40 33% 99%)', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', backgroundColor: 'hsl(174 62% 32% / 0.12)', color: 'hsl(174 62% 32%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', fontWeight: '700', flexShrink: 0 }}>
              {agent.name?.[0] ?? '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: '600', color: 'hsl(200 25% 15%)', fontSize: '0.9rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.fullName}</p>
              <p style={{ fontSize: '0.78rem', color: 'hsl(200 15% 45%)', margin: 0 }}>{agent.email}</p>
            </div>
            <div>
              <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '600', backgroundColor: planColor(currentSlug).bg, color: planColor(currentSlug).text }}>
                Current: {currentSlug.charAt(0).toUpperCase() + currentSlug.slice(1)}
              </span>
            </div>
          </div>

          {/* Plan selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.625rem' }}>Select Plan to Grant</label>
            <div className="grant-plan-grid">
              {grantablePlans.map(plan => {
                const selected = Number(selectedPlanId) === plan.id;
                const isUpgrade = PLAN_ORDER.indexOf(plan.slug) > currentIdx;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    style={{
                      padding: '0.875rem',
                      border: selected ? '2px solid hsl(174 62% 32%)' : '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.625rem',
                      backgroundColor: selected ? 'hsl(174 62% 32% / 0.05)' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                      position: 'relative',
                    }}
                  >
                    {isUpgrade && (
                      <span style={{ position: 'absolute', top: '0.375rem', right: '0.375rem', fontSize: '0.6rem', fontWeight: '700', backgroundColor: 'hsl(152 60% 40%)', color: 'white', padding: '0.1rem 0.375rem', borderRadius: '9999px' }}>↑ UPGRADE</span>
                    )}
                    <p style={{ fontWeight: '700', color: 'hsl(200 25% 15%)', margin: '0 0 0.25rem', fontSize: '0.9rem' }}>{plan.name}</p>
                    <p style={{ fontSize: '0.78rem', color: 'hsl(200 15% 45%)', margin: 0 }}>
                      {Number(plan.price) === 0 ? 'Free' : `GH₵${Number(plan.price).toFixed(0)}/mo`}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.625rem' }}>
              Duration
            </label>
            <div className="grant-duration-grid">
              {[1, 2, 3, 6].map(m => (
                <button
                  key={m}
                  onClick={() => setDurationMonths(m)}
                  style={{ padding: '0.6rem', border: durationMonths === m ? '2px solid hsl(174 62% 32%)' : '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', backgroundColor: durationMonths === m ? 'hsl(174 62% 32% / 0.05)' : 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', color: durationMonths === m ? 'hsl(174 62% 32%)' : 'hsl(200 25% 15%)', transition: 'all 0.15s' }}
                >
                  {m}mo
                </button>
              ))}
            </div>
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'hsl(200 15% 45%)' }}>Custom:</span>
              <input
                type="number"
                min={1}
                max={24}
                value={durationMonths}
                onChange={e => setDurationMonths(Math.min(24, Math.max(1, parseInt(e.target.value) || 1)))}
                style={{ width: '5rem', padding: '0.4rem 0.6rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.375rem', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit' }}
              />
              <span style={{ fontSize: '0.8rem', color: 'hsl(200 15% 45%)' }}>months</span>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
              Reason <span style={{ fontSize: '0.78rem', fontWeight: '400', color: 'hsl(200 15% 55%)' }}>(internal note)</span>
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Compensation for downtime, referral reward, trial extension..."
              rows={2}
              style={{ width: '100%', padding: '0.625rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Summary */}
          {selectedPlan && !isFreeSelected && (
            <div style={{ backgroundColor: 'hsl(152 60% 96%)', border: '1px solid hsl(152 60% 80%)', borderRadius: '0.625rem', padding: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
              <CheckCircle style={{ height: '1.1rem', width: '1.1rem', color: 'hsl(152 60% 38%)', flexShrink: 0, marginTop: '0.1rem' }} />
              <p style={{ fontSize: '0.83rem', color: 'hsl(152 58% 28%)', margin: 0, lineHeight: '1.5' }}>
                <strong>{agent.fullName}</strong> will receive the <strong>{selectedPlan.name}</strong> plan free for <strong>{durationMonths} month{durationMonths > 1 ? 's' : ''}</strong>.
                Their current subscription will be replaced. No payment is charged.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 70% 85%)', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
              <AlertCircle style={{ height: '1rem', width: '1rem', color: 'hsl(0 70% 50%)', flexShrink: 0 }} />
              <p style={{ fontSize: '0.83rem', color: 'hsl(0 70% 40%)', margin: 0 }}>{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="grant-modal-footer">
          <div className="grant-footer-buttons">
            <button
              onClick={onClose}
              style={{ padding: '0.625rem 1.25rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', backgroundColor: 'white', color: 'hsl(200 25% 15%)', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={processing || !selectedPlanId || isFreeSelected}
              style={{ padding: '0.625rem 1.25rem', border: 'none', borderRadius: '0.5rem', background: processing || !selectedPlanId || isFreeSelected ? 'hsl(200 15% 80%)' : 'linear-gradient(135deg, hsl(271 76% 53%) 0%, hsl(271 60% 45%) 100%)', color: 'white', fontSize: '0.875rem', fontWeight: '600', cursor: processing || !selectedPlanId || isFreeSelected ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit' }}
            >
              <Gift style={{ height: '1rem', width: '1rem' }} />
              {processing ? 'Granting…' : 'Grant Plan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantSubscriptionModal;