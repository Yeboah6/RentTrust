import { useState } from 'react';
import { router } from '@inertiajs/react';

// ─── Icons ────────────────────────────────────────────────────────────────────

const CheckCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CreditCard = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const Zap = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const Crown = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l7 7-7 7m7-14l7 7-7 7" />
  </svg>
);

const Calendar = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ArrowUp = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);

const XCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ─── Plan icon ────────────────────────────────────────────────────────────────

const PlanIcon = ({ slug, size = '1.5rem' }) => {
  const s = { height: size, width: size };
  const configs = {
    free:  { icon: <Zap style={s} />,   bg: 'hsl(200 15% 45% / 0.1)', color: 'hsl(200 15% 45%)' },
    pro:   { icon: <CheckCircle style={s} />, bg: 'hsl(174 62% 32% / 0.1)', color: 'hsl(174 62% 32%)' },
    elite: { icon: <Crown style={s} />, bg: 'linear-gradient(135deg, hsl(174 62% 32% / 0.15), hsl(38 92% 45% / 0.15))', color: 'hsl(174 62% 32%)' },
  };
  const c = configs[slug] ?? configs.free;
  return (
    <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {c.icon}
    </div>
  );
};

// ─── Status pill ──────────────────────────────────────────────────────────────

const StatusPill = ({ status }) => {
  const config = {
    active:    { bg: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', border: 'hsl(152 60% 85%)', label: 'Active' },
    cancelled: { bg: 'hsl(0 65% 96%)',   color: 'hsl(0 65% 45%)',   border: 'hsl(0 65% 88%)',   label: 'Cancelled' },
    expired:   { bg: 'hsl(40 30% 94%)',  color: 'hsl(200 25% 35%)', border: 'hsl(40 20% 88%)',  label: 'Expired' },
    pending:   { bg: 'hsl(220 80% 96%)', color: 'hsl(220 80% 45%)', border: 'hsl(220 80% 88%)', label: 'Pending' },
    failed:    { bg: 'hsl(0 65% 96%)',   color: 'hsl(0 65% 45%)',   border: 'hsl(0 65% 88%)',   label: 'Failed' },
    success:   { bg: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', border: 'hsl(152 60% 85%)', label: 'Paid' },
  }[status] ?? { bg: 'hsl(40 30% 94%)', color: 'hsl(200 15% 45%)', border: 'hsl(40 20% 88%)', label: status };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: '600', backgroundColor: config.bg, color: config.color, border: `1px solid ${config.border}`, borderRadius: '999px', textTransform: 'capitalize', letterSpacing: '0.03em' }}>
      {config.label}
    </span>
  );
};

// ─── Cancel confirm dialog ────────────────────────────────────────────────────

const CancelDialog = ({ onConfirm, onDismiss, loading }) => (
  <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70, padding: '1rem' }}>
    <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', maxWidth: '420px', width: '100%', boxShadow: '0 20px 40px hsl(200 25% 15% / 0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'hsl(0 65% 96%)', color: 'hsl(0 65% 45%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <AlertCircle style={{ height: '1.25rem', width: '1.25rem' }} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'hsl(200 25% 15%)' }}>Cancel Subscription?</h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.8125rem', color: 'hsl(200 15% 45%)' }}>This action cannot be undone easily.</p>
        </div>
      </div>
      <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
        Your subscription will remain active until the end of the billing period. After that, your account will be downgraded to the Free plan.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={onConfirm}
          disabled={loading}
          style={{ flex: 1, padding: '0.75rem', backgroundColor: 'hsl(0 65% 51%)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontSize: '0.875rem' }}
        >
          {loading ? 'Cancelling...' : 'Yes, Cancel'}
        </button>
        <button
          onClick={onDismiss}
          disabled={loading}
          style={{ flex: 1, padding: '0.75rem', backgroundColor: 'white', color: 'hsl(200 25% 15%)', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem' }}
        >
          Keep Plan
        </button>
      </div>
    </div>
  </div>
);

// ─── Feature row ──────────────────────────────────────────────────────────────

const FeatureRow = ({ label, value, included }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid hsl(40 20% 88% / 0.6)' }}>
    <span style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>{label}</span>
    {included !== undefined ? (
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', fontWeight: '600', color: included ? 'hsl(152 60% 40%)' : 'hsl(200 15% 60%)' }}>
        {included
          ? <CheckCircle style={{ height: '0.875rem', width: '0.875rem' }} />
          : <XCircle style={{ height: '0.875rem', width: '0.875rem' }} />}
        {included ? 'Included' : 'Not included'}
      </span>
    ) : (
      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)' }}>{value}</span>
    )}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Props:
 *   billing  — { subscription: {...} | null, payments: [...] }
 *              passed from DashboardController::agentDashboard()
 *   onUpgrade — () => void  — opens PricingModal
 */
const BillingModule = ({ billing, onUpgrade }) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const sub      = billing?.subscription ?? null;
  const payments = billing?.payments ?? [];
  const hasSub   = !!sub;
  const isFree   = !hasSub || sub.is_free;

  const planColor = {
    free:  'hsl(200 15% 45%)',
    pro:   'hsl(174 62% 32%)',
    elite: 'hsl(38 92% 45%)',
  }[sub?.plan_slug] ?? 'hsl(174 62% 32%)';

  const handleCancel = () => {
    setCancelLoading(true);
    router.post('/checkout/cancel', {}, {
      onSuccess: () => {
        setCancelLoading(false);
        setShowCancelDialog(false);
      },
      onError: () => {
        setCancelLoading(false);
        setShowCancelDialog(false);
      },
    });
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── Current Plan Card ─────────────────────────────────────────── */}
        <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.08)' }}>

          {/* Coloured top bar */}
          <div style={{ height: '4px', background: isFree ? 'hsl(200 15% 80%)' : `linear-gradient(90deg, ${planColor}, ${planColor}88)` }} />

          <div style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <PlanIcon slug={sub?.plan_slug ?? 'free'} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: 'clamp(1.125rem, 3vw, 1.375rem)', fontWeight: '700', color: 'hsl(200 25% 15%)' }}>
                      {sub?.plan_name ?? 'Free'} Plan
                    </h3>
                    {hasSub && <StatusPill status={sub.status} />}
                    {sub?.grace && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: '600', backgroundColor: 'hsl(38 92% 96%)', color: 'hsl(38 92% 40%)', border: '1px solid hsl(38 92% 85%)', borderRadius: '999px' }}>
                        <AlertCircle style={{ height: '0.75rem', width: '0.75rem' }} /> Grace Period
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                    {isFree
                      ? 'Basic access — no payment required'
                      : `GHS ${sub.plan_price.toFixed(2)} / month · renews automatically`}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={onUpgrade}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.1rem', backgroundColor: planColor, color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <ArrowUp style={{ height: '0.875rem', width: '0.875rem' }} />
                  {isFree ? 'Upgrade Plan' : 'Change Plan'}
                </button>
                {!isFree && sub?.status === 'active' && (
                  <button
                    onClick={() => setShowCancelDialog(true)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.1rem', backgroundColor: 'white', color: 'hsl(0 65% 45%)', border: '1px solid hsl(0 65% 88%)', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    <XCircle style={{ height: '0.875rem', width: '0.875rem' }} />
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Billing dates */}
            {!isFree && sub?.ends_at && (
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '1rem', backgroundColor: 'hsl(40 33% 98%)', borderRadius: '0.625rem', marginBottom: '1.5rem' }}>
                {sub.starts_at && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar style={{ height: '1rem', width: '1rem', color: 'hsl(200 15% 45%)', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Started</p>
                      <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)' }}>{sub.starts_at}</p>
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar style={{ height: '1rem', width: '1rem', color: planColor, flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                      {sub.status === 'cancelled' ? 'Access Until' : 'Next Renewal'}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)' }}>
                      {sub.ends_at}
                      {sub.days_left !== null && (
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: sub.days_left <= 5 ? 'hsl(0 65% 45%)' : planColor, fontWeight: '700' }}>
                          ({sub.days_left}d left)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Grace period warning */}
            {sub?.grace && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem 1rem', backgroundColor: 'hsl(38 92% 96%)', border: '1px solid hsl(38 92% 85%)', borderRadius: '0.625rem', marginBottom: '1.5rem' }}>
                <AlertCircle style={{ height: '1.125rem', width: '1.125rem', color: 'hsl(38 92% 45%)', flexShrink: 0, marginTop: '0.0625rem' }} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: 'hsl(38 92% 35%)' }}>Subscription in grace period</p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8125rem', color: 'hsl(38 92% 45%)', lineHeight: '1.5' }}>
                    Your subscription expired but you still have access. Renew now to avoid losing your features.
                  </p>
                  <button onClick={onUpgrade} style={{ marginTop: '0.5rem', padding: '0.4rem 0.875rem', backgroundColor: 'hsl(38 92% 45%)', color: 'white', border: 'none', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.8125rem' }}>
                    Renew Now
                  </button>
                </div>
              </div>
            )}

            {/* Plan features summary */}
            <div>
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.8125rem', fontWeight: '700', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Plan Features
              </h4>
              <div style={{ borderTop: '1px solid hsl(40 20% 88% / 0.6)' }}>
                <FeatureRow label="Property Listings" value={sub?.listing_limit ?? '5 (Limited)'} />
                <FeatureRow label="Lead Contacts / month" value={sub?.lead_limit > 0 ? sub.lead_limit : 'None'} />
                <FeatureRow label="Verified Badge" included={sub?.verified_badge ?? false} />
                <FeatureRow label="Priority Search Ranking" included={sub?.priority_ranking ?? false} />
                <FeatureRow label="Analytics Dashboard" included={sub?.analytics_access ?? false} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Payment History ───────────────────────────────────────────── */}
        <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.08)' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid hsl(40 20% 88%)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CreditCard style={{ height: '1.125rem', width: '1.125rem', color: 'hsl(200 15% 45%)' }} />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'hsl(200 25% 15%)' }}>Payment History</h3>
          </div>

          {payments.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <CreditCard style={{ height: '2.5rem', width: '2.5rem', color: 'hsl(200 15% 70%)', margin: '0 auto 0.75rem' }} />
              <p style={{ color: 'hsl(200 15% 45%)', fontSize: '0.9375rem', fontWeight: '500', margin: '0 0 0.25rem' }}>No payments yet</p>
              <p style={{ color: 'hsl(200 15% 60%)', fontSize: '0.8125rem', margin: 0 }}>Your payment history will appear here after your first transaction.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'hsl(40 33% 98%)', borderBottom: '1px solid hsl(40 20% 88%)' }}>
                    {['Date', 'Reference', 'Provider', 'Amount', 'Status'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, i) => (
                    <tr key={payment.id} style={{ borderBottom: i < payments.length - 1 ? '1px solid hsl(40 20% 88% / 0.5)' : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(40 33% 98%)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '0.875rem 1.25rem', color: 'hsl(200 15% 45%)', whiteSpace: 'nowrap' }}>
                        {payment.created_at}
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <code style={{ fontSize: '0.75rem', backgroundColor: 'hsl(40 33% 96%)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', color: 'hsl(200 25% 25%)', fontFamily: 'monospace' }}>
                          {payment.reference}
                        </code>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', fontWeight: '500', color: payment.provider === 'paystack' ? 'hsl(220 80% 45%)' : 'hsl(28 100% 45%)', textTransform: 'capitalize' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: payment.provider === 'paystack' ? 'hsl(220 80% 52%)' : 'hsl(28 100% 52%)', flexShrink: 0 }} />
                          {payment.provider === 'none' ? 'Free' : payment.provider}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', fontWeight: '700', color: 'hsl(200 25% 15%)', whiteSpace: 'nowrap' }}>
                        {payment.currency} {payment.amount.toFixed(2)}
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <StatusPill status={payment.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Cancel confirm dialog */}
      {showCancelDialog && (
        <CancelDialog
          onConfirm={handleCancel}
          onDismiss={() => setShowCancelDialog(false)}
          loading={cancelLoading}
        />
      )}
    </>
  );
};

export default BillingModule;