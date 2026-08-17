import { useState } from 'react';
import { router } from '@inertiajs/react';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = '1rem', sw = 1.8 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    credit:     <Ico d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
    check:      <Ico d="M5 13l4 4L19 7" />,
    clock:      <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    x:          <Ico d="M6 18L18 6M6 6l12 12" />,
    star:       <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    shield:     <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    trending:   <Ico d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    calendar:   <Ico d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    dollar:     <Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    upgrade:    <Ico d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    analytics:  <Ico d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    list:       <Ico d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
    alert:      <Ico d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    empty:      <Ico d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" size="2.5rem" sw={1.2} />,
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const config = {
        active:    { bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 35%)', icon: Icons.check, label: 'Active' },
        pending:   { bg: 'hsl(38 92% 93%)',   color: 'hsl(38 92% 40%)',  icon: Icons.clock, label: 'Pending' },
        cancelled: { bg: 'hsl(0 72% 93%)',    color: 'hsl(0 72% 45%)',   icon: Icons.x,     label: 'Cancelled' },
        expired:   { bg: 'hsl(220 15% 93%)',  color: 'hsl(220 15% 45%)', icon: Icons.clock, label: 'Expired' },
        grace:     { bg: 'hsl(38 92% 93%)',   color: 'hsl(38 92% 40%)',  icon: Icons.alert, label: 'Grace Period' },
        completed: { bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 35%)', icon: Icons.check, label: 'Completed' },
        failed:    { bg: 'hsl(0 72% 93%)',    color: 'hsl(0 72% 45%)',   icon: Icons.x,     label: 'Failed' },
        success:   { bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 35%)', icon: Icons.check, label: 'Paid' },
        refunded:  { bg: 'hsl(220 15% 93%)',  color: 'hsl(220 15% 45%)', icon: Icons.x,     label: 'Refunded' },
    };
    const cfg = config[status] || config.pending;
    
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.18rem 0.55rem', borderRadius: 999,
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
            backgroundColor: cfg.bg, color: cfg.color, flexShrink: 0,
        }}>
            {cfg.icon}{cfg.label}
        </span>
    );
};

// ─── Plan Badge ───────────────────────────────────────────────────────────────
const PlanBadge = ({ plan, isFree }) => {
    const config = {
        pro:       { bg: 'hsl(271 50% 93%)', color: 'hsl(271 60% 45%)' },
        verified:  { bg: 'hsl(214 60% 93%)', color: 'hsl(214 70% 42%)' },
        elite:     { bg: 'hsl(38 92% 93%)',  color: 'hsl(38 92% 40%)' },
        premium:   { bg: 'hsl(174 40% 93%)', color: 'hsl(174 62% 35%)' },
    };
    const cfg = config[plan?.toLowerCase()] || { bg: 'hsl(220 15% 93%)', color: 'hsl(220 25% 45%)' };
    
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.25rem 0.75rem', borderRadius: 999,
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.03em',
            backgroundColor: isFree ? 'hsl(220 15% 93%)' : cfg.bg,
            color: isFree ? 'hsl(220 25% 45%)' : cfg.color,
            border: `1px solid ${isFree ? 'hsl(220 15% 88%)' : 'transparent'}`,
        }}>
            {isFree ? Icons.dollar : Icons.star}
            {plan || 'Free'}
        </span>
    );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (v) => {
    if (!v) return '—';
    return new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
const fmtCurrency = (amount, currency = 'GHS') => {
    return `${currency === 'GHS' ? 'GH₵' : '$'}${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// ─── Cancel Confirmation Modal ────────────────────────────────────────────────
const CancelModal = ({ onConfirm, onDismiss, loading }) => (
    <div style={{ 
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        zIndex: 100, padding: '1rem', backdropFilter: 'blur(4px)',
    }}>
        <div style={{ 
            background: 'white', borderRadius: '1rem', padding: '2rem', 
            maxWidth: '440px', width: '100%', 
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            animation: 'fadeIn 0.2s ease',
        }}>
            <div style={{ 
                width: '3rem', height: '3rem', borderRadius: '50%', 
                background: 'hsl(0 72% 95%)', color: 'hsl(0 72% 48%)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                marginBottom: '1.25rem', fontSize: '1.25rem',
            }}>
                {Icons.alert}
            </div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 800, color: 'hsl(220 25% 12%)' }}>
                Cancel Subscription?
            </h3>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.85rem', color: 'hsl(220 15% 50%)', lineHeight: 1.6 }}>
                Your subscription will remain active until the end of the billing period. After that, your account will be downgraded to the Free plan and you'll lose access to premium features.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                    onClick={onDismiss}
                    disabled={loading}
                    style={{ 
                        flex: 1, minWidth: '120px', padding: '0.7rem', borderRadius: '0.5rem',
                        border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                        color: 'hsl(220 25% 35%)', fontSize: '0.82rem', fontWeight: 700,
                        cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                    }}
                >
                    Keep Plan
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    style={{ 
                        flex: 1, minWidth: '120px', padding: '0.7rem', borderRadius: '0.5rem',
                        border: 'none', backgroundColor: 'hsl(0 72% 48%)',
                        color: 'white', fontSize: '0.82rem', fontWeight: 700,
                        cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                        opacity: loading ? 0.7 : 1,
                    }}
                >
                    {loading ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
            </div>
        </div>
        <style>{`
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
        `}</style>
    </div>
);

// ─── Feature Row ──────────────────────────────────────────────────────────────
const FeatureRow = ({ label, value, included, isFree }) => (
    <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '0.6rem 0',
        borderBottom: '1px solid hsl(220 15% 94%)',
    }}>
        <span style={{ fontSize: '0.78rem', color: 'hsl(220 15% 50%)', fontWeight: 500 }}>{label}</span>
        {included !== undefined ? (
            <span style={{ 
                display: 'flex', alignItems: 'center', gap: '0.3rem', 
                fontSize: '0.75rem', fontWeight: 700,
                color: included && !isFree ? 'hsl(152 60% 40%)' : 'hsl(220 15% 60%)',
            }}>
                {included && !isFree ? Icons.check : Icons.x}
                {included && !isFree ? 'Included' : 'Not included'}
            </span>
        ) : (
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'hsl(220 25% 15%)' }}>
                {value}
            </span>
        )}
    </div>
);

// ─── Billing Tab Module ───────────────────────────────────────────────────────
const BillingTab = ({ billing, plans = [], onUpgrade }) => {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);

    const sub = billing?.subscription;
    const payments = billing?.payments || [];
    const hasSub = !!sub && !sub.is_free;
    const isFree = !hasSub;
    
    const currentPlanName = sub?.plan_name || 'Free';
    const planSlug = sub?.plan_slug || 'free';

    const handleCancel = () => {
        setCancelLoading(true);
        router.post('/checkout/cancel', {}, {
            onSuccess: () => {
                setCancelLoading(false);
                setShowCancelModal(false);
            },
            onError: () => {
                setCancelLoading(false);
                setShowCancelModal(false);
            },
        });
    };

    return (
        <>
            <style>{`
                /* Responsive adjustments for billing */
                @media (max-width: 640px) {
                    .billing-container {
                        gap: 1rem !important;
                    }
                    .billing-plan-header {
                        flex-direction: column !important;
                        align-items: stretch !important;
                        gap: 0.75rem !important;
                    }
                    .billing-plan-header .plan-title-section {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 0.5rem !important;
                    }
                    .billing-plan-header .plan-actions {
                        width: 100% !important;
                        justify-content: flex-end !important;
                    }
                    .billing-plan-header .plan-actions button {
                        width: 100% !important;
                        justify-content: center !important;
                    }
                    .billing-billing-period {
                        flex-direction: column !important;
                        gap: 0.75rem !important;
                    }
                    .payment-history-table {
                        display: block !important;
                        overflow-x: auto !important;
                        white-space: nowrap !important;
                    }
                }
                @media (max-width: 480px) {
                    .billing-plan-header .plan-actions button,
                    .billing-cancel-button {
                        min-height: 44px !important;
                        width: 100% !important;
                        justify-content: center !important;
                    }
                }
            `}</style>

            <div className="billing-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* ── Current Plan Card ─────────────────────────────────────── */}
                <div style={{
                    backgroundColor: 'white',
                    border: '1px solid hsl(220 15% 91%)',
                    borderRadius: '0.875rem',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)',
                }}>
                    {/* Plan colour strip */}
                    <div style={{ 
                        height: 3, 
                        background: isFree 
                            ? 'hsl(220 15% 70%)' 
                            : `linear-gradient(90deg, hsl(271 60% 50%), hsl(271 60% 40%))`,
                        opacity: 0.8,
                    }} />

                    <div style={{ padding: '1.5rem' }}>
                        
                        {/* Plan header */}
                        <div className="billing-plan-header" style={{ 
                            display: 'flex', justifyContent: 'space-between', 
                            alignItems: 'flex-start', flexWrap: 'wrap', 
                            gap: '1rem', marginBottom: '1.5rem',
                        }}>
                            <div className="plan-title-section" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {/* Plan icon */}
                                <div style={{
                                    width: '3rem', height: '3rem', borderRadius: '0.75rem',
                                    background: isFree 
                                        ? 'hsl(220 15% 95%)' 
                                        : 'linear-gradient(135deg, hsl(271 60% 50% / 0.1), hsl(271 60% 40% / 0.1))',
                                    color: isFree ? 'hsl(220 15% 45%)' : 'hsl(271 60% 45%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.25rem',
                                    flexShrink: 0,
                                }}>
                                    {isFree ? Icons.dollar : Icons.star}
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'hsl(220 25% 12%)' }}>
                                            {currentPlanName} Plan
                                        </h3>
                                        <PlanBadge plan={currentPlanName} isFree={isFree} />
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'hsl(220 15% 50%)', fontWeight: 500 }}>
                                        {isFree 
                                            ? 'Basic access — no payment required'
                                            : `${fmtCurrency(sub?.plan_price || 0)} / month · Renews automatically`}
                                    </p>
                                </div>
                            </div>

                            {/* Status + Actions */}
                            <div className="plan-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                {hasSub && sub?.status && (
                                    <StatusBadge status={sub.status} />
                                )}
                                <button
                                    onClick={onUpgrade}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                        padding: '0.55rem 1rem', borderRadius: '0.5rem',
                                        border: 'none',
                                        background: isFree 
                                            ? 'hsl(271 60% 50%)' 
                                            : 'linear-gradient(135deg, hsl(271 60% 50%), hsl(271 60% 40%))',
                                        color: 'white', fontSize: '0.78rem', fontWeight: 700,
                                        cursor: 'pointer', fontFamily: 'inherit',
                                        transition: 'opacity 0.15s', whiteSpace: 'nowrap',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    {Icons.upgrade}
                                    {isFree ? 'Upgrade Plan' : 'Change Plan'}
                                </button>
                            </div>
                        </div>

                        {/* Billing period info */}
                        {hasSub && sub?.ends_at && (
                            <div className="billing-billing-period" style={{ 
                                display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
                                padding: '1rem', backgroundColor: 'hsl(220 15% 97%)',
                                borderRadius: '0.625rem', marginBottom: '1.25rem',
                                border: '1px solid hsl(220 15% 93%)',
                            }}>
                                {sub.starts_at && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 auto' }}>
                                        <div style={{
                                            width: '2rem', height: '2rem', borderRadius: '0.5rem',
                                            backgroundColor: 'hsl(220 15% 90%)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            {Icons.calendar}
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.65rem', color: 'hsl(220 15% 50%)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                Started
                                            </p>
                                            <p style={{ margin: '0.1rem 0 0', fontSize: '0.8rem', fontWeight: 700, color: 'hsl(220 25% 15%)' }}>
                                                {fmtDate(sub.starts_at)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 auto' }}>
                                    <div style={{
                                        width: '2rem', height: '2rem', borderRadius: '0.5rem',
                                        backgroundColor: isFree ? 'hsl(220 15% 90%)' : 'hsl(271 60% 50% / 0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, color: isFree ? 'hsl(220 15% 45%)' : 'hsl(271 60% 45%)',
                                    }}>
                                        {Icons.calendar}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.65rem', color: 'hsl(220 15% 50%)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            {sub.status === 'cancelled' ? 'Access Until' : 'Next Renewal'}
                                        </p>
                                        <p style={{ margin: '0.1rem 0 0', fontSize: '0.8rem', fontWeight: 700, color: 'hsl(220 25% 15%)' }}>
                                            {fmtDate(sub.ends_at)}
                                            {sub.days_left !== null && (
                                                <span style={{ 
                                                    marginLeft: '0.5rem', fontSize: '0.7rem',
                                                    color: sub.days_left <= 7 ? 'hsl(0 72% 48%)' : 'hsl(152 60% 40%)',
                                                    fontWeight: 700,
                                                }}>
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
                            <div style={{ 
                                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                                padding: '0.875rem 1rem', backgroundColor: 'hsl(38 92% 96%)',
                                border: '1px solid hsl(38 92% 85%)', borderRadius: '0.625rem',
                                marginBottom: '1.25rem',
                            }}>
                                <div style={{ color: 'hsl(38 92% 45%)', flexShrink: 0, marginTop: '0.125rem', display: 'flex' }}>
                                    {Icons.alert}
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: 'hsl(38 92% 35%)' }}>
                                        Subscription in Grace Period
                                    </p>
                                    <p style={{ margin: '0.2rem 0 0.5rem', fontSize: '0.78rem', color: 'hsl(38 92% 45%)', lineHeight: 1.5 }}>
                                        Your subscription has expired but you still have temporary access. Renew now to keep your premium features.
                                    </p>
                                    <button 
                                        onClick={onUpgrade}
                                        style={{
                                            padding: '0.4rem 0.9rem', borderRadius: '0.375rem',
                                            border: 'none', backgroundColor: 'hsl(38 92% 45%)',
                                            color: 'white', fontSize: '0.75rem', fontWeight: 700,
                                            cursor: 'pointer', fontFamily: 'inherit',
                                        }}
                                    >
                                        Renew Now
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Plan features */}
                        <div>
                            <p style={{ 
                                margin: '0 0 0.75rem', fontSize: '0.7rem', fontWeight: 700,
                                color: 'hsl(220 15% 48%)', textTransform: 'uppercase', letterSpacing: '0.05em',
                            }}>
                                Plan Features
                            </p>
                            <div style={{ borderTop: '1px solid hsl(220 15% 94%)' }}>
                                <FeatureRow label="Property Listings" value={sub?.listing_limit || 'Unlimited'} isFree={isFree} />
                                <FeatureRow label="Priority Ranking" included={sub?.priority_ranking ?? false} isFree={isFree} />
                                <FeatureRow label="Analytics Access" included={sub?.analytics_access ?? false} isFree={isFree} />
                                <FeatureRow label="Respond to tenant reviews" />
                                <FeatureRow label="View inquiries from tenants" />
                            </div>
                        </div>

                        {/* Cancel button */}
                        {hasSub && sub?.status === 'active' && (
                            <div style={{ 
                                marginTop: '1.5rem', paddingTop: '1.25rem',
                                borderTop: '1px solid hsl(220 15% 93%)',
                                display: 'flex', justifyContent: 'flex-end',
                            }}>
                                <button
                                    className="billing-cancel-button"
                                    onClick={() => setShowCancelModal(true)}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                        padding: '0.55rem 1rem', borderRadius: '0.5rem',
                                        border: '1px solid hsl(0 72% 70%)', backgroundColor: 'white',
                                        color: 'hsl(0 72% 48%)', fontSize: '0.78rem', fontWeight: 700,
                                        cursor: 'pointer', fontFamily: 'inherit',
                                        transition: 'all 0.12s',
                                    }}
                                    onMouseEnter={e => { 
                                        e.currentTarget.style.backgroundColor = 'hsl(0 72% 97%)'; 
                                        e.currentTarget.style.borderColor = 'hsl(0 72% 50%)'; 
                                    }}
                                    onMouseLeave={e => { 
                                        e.currentTarget.style.backgroundColor = 'white'; 
                                        e.currentTarget.style.borderColor = 'hsl(0 72% 70%)'; 
                                    }}
                                >
                                    {Icons.x} Cancel Subscription
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Payment History Card ──────────────────────────────────── */}
                <div style={{
                    backgroundColor: 'white',
                    border: '1px solid hsl(220 15% 91%)',
                    borderRadius: '0.875rem',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)',
                }}>
                    <div style={{ 
                        padding: '1rem 1.5rem', borderBottom: '1px solid hsl(220 15% 93%)',
                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                    }}>
                        <div style={{ width: 3, height: '1rem', borderRadius: 999, backgroundColor: 'hsl(174 62% 32%)' }} />
                        <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'hsl(220 25% 12%)' }}>
                            Payment History
                        </h3>
                        <span style={{ 
                            fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem',
                            borderRadius: 999, backgroundColor: 'hsl(220 15% 93%)', color: 'hsl(220 25% 35%)',
                            marginLeft: 'auto',
                        }}>
                            {payments.length}
                        </span>
                    </div>

                    {payments.length > 0 ? (
                        <div className="payment-history-table" style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', minWidth: '600px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid hsl(220 15% 93%)' }}>
                                        {['Date', 'Reference', 'Amount', 'Provider', 'Status'].map(h => (
                                            <th key={h} style={{ 
                                                padding: '0.65rem 1rem', textAlign: 'left',
                                                fontWeight: 700, color: 'hsl(220 15% 48%)', 
                                                fontSize: '0.68rem', textTransform: 'uppercase', 
                                                letterSpacing: '0.04em', whiteSpace: 'nowrap',
                                            }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((payment, i) => (
                                        <tr 
                                            key={payment.id || i}
                                            style={{ 
                                                borderBottom: i < payments.length - 1 ? '1px solid hsl(220 15% 94%)' : 'none',
                                                transition: 'background-color 0.1s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 98%)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <td style={{ padding: '0.7rem 1rem', color: 'hsl(220 15% 50%)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                                {payment.created_at || '—'}
                                            </td>
                                            <td style={{ padding: '0.7rem 1rem' }}>
                                                <code style={{ 
                                                    fontSize: '0.7rem', backgroundColor: 'hsl(220 15% 96%)',
                                                    padding: '0.2rem 0.45rem', borderRadius: '0.3rem',
                                                    color: 'hsl(220 25% 25%)', fontFamily: 'monospace',
                                                }}>
                                                    {payment.reference || '—'}
                                                </code>
                                            </td>
                                            <td style={{ padding: '0.7rem 1rem', fontWeight: 700, color: 'hsl(174 62% 32%)', whiteSpace: 'nowrap' }}>
                                                {fmtCurrency(payment.amount, payment.currency)}
                                            </td>
                                            <td style={{ padding: '0.7rem 1rem', color: 'hsl(220 15% 50%)', fontWeight: 500, textTransform: 'capitalize' }}>
                                                {payment.provider === 'none' ? 'Free' : payment.provider || '—'}
                                            </td>
                                            <td style={{ padding: '0.7rem 1rem' }}>
                                                <StatusBadge status={payment.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ padding: '2.5rem', textAlign: 'center' }}>
                            <div style={{ 
                                color: 'hsl(220 15% 68%)', margin: '0 auto 0.75rem',
                                display: 'flex', justifyContent: 'center',
                            }}>
                                {Icons.empty}
                            </div>
                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'hsl(220 25% 15%)' }}>
                                No Payment History
                            </p>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'hsl(220 15% 52%)' }}>
                                Your payment transactions will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <CancelModal
                    onConfirm={handleCancel}
                    onDismiss={() => setShowCancelModal(false)}
                    loading={cancelLoading}
                />
            )}
        </>
    );
};

export default BillingTab;