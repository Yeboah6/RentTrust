import React, { useState, useRef } from 'react';
import { Link, router, Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = ({ d, size = '1rem', style: extra }) => (
    <svg style={{ width: size, height: size, flexShrink: 0, ...extra }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d={p} />
        ))}
    </svg>
);

const Icons = {
    arrow:    () => <Ico d="M10 19l-7-7m0 0l7-7m-7 7h18" />,
    user:     () => <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    plan:     () => <Ico d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    calendar: () => <Ico d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    payment:  () => <Ico d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
    log:      () => <Ico d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
    gift:     () => <Ico d={["M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"]} />,
    ban:      () => <Ico d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />,
    upgrade:  () => <Ico d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    cancel:   () => <Ico d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    alert:    () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    x:        () => <Ico d="M6 18L18 6M6 6l12 12" />,
    check:    () => <Ico d="M5 13l4 4L19 7" />,
    clock:    () => <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
};

// ─── Status / plan config ─────────────────────────────────────────────────────

const STATUS_CFG = {
    active:    { label: 'Active',       bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 30%)', dot: 'hsl(152 60% 40%)' },
    trial:     { label: 'Trial',        bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 35%)',  dot: 'hsl(40 80% 48%)' },
    pending:   { label: 'Pending',      bg: 'hsl(214 100% 95%)',color: 'hsl(214 80% 40%)', dot: 'hsl(214 80% 52%)' },
    expired:   { label: 'Expired',      bg: 'hsl(0 70% 94%)',   color: 'hsl(0 65% 42%)',   dot: 'hsl(0 65% 52%)' },
    cancelled: { label: 'Cancelled',    bg: 'hsl(220 15% 92%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)' },
    suspended: { label: 'Suspended',    bg: 'hsl(0 70% 94%)',   color: 'hsl(0 65% 42%)',   dot: 'hsl(0 65% 52%)' },
    grace:     { label: 'Grace Period', bg: 'hsl(38 92% 93%)',  color: 'hsl(36 85% 33%)',  dot: 'hsl(36 85% 45%)' },
    inactive:  { label: 'Inactive',     bg: 'hsl(220 15% 92%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)' },
};

const PLAN_PALETTE = [
    'hsl(214 80% 48%)', 'hsl(152 55% 33%)', 'hsl(270 60% 45%)',
    'hsl(40 80% 40%)',  'hsl(0 62% 48%)',   'hsl(174 55% 35%)',
];

const ACTION_LOG_COLORS = {
    cancel:              { bg: 'hsl(0 70% 94%)',   color: 'hsl(0 65% 42%)' },
    suspend:             { bg: 'hsl(0 70% 94%)',   color: 'hsl(0 65% 42%)' },
    free_month:          { bg: 'hsl(270 55% 94%)', color: 'hsl(270 55% 40%)' },
    upgrade:             { bg: 'hsl(152 55% 92%)', color: 'hsl(152 55% 30%)' },
    admin_grant:         { bg: 'hsl(214 100% 95%)',color: 'hsl(214 80% 40%)' },
    created_via_upgrade: { bg: 'hsl(152 55% 92%)', color: 'hsl(152 55% 30%)' },
    cancelled_for_grant: { bg: 'hsl(220 15% 92%)', color: 'hsl(220 15% 38%)' },
};

const ACTION_LABELS = {
    cancel:              'Cancelled',
    suspend:             'Suspended',
    free_month:          'Free Extension',
    upgrade:             'Plan Upgraded',
    admin_grant:         'Admin Grant',
    created_via_upgrade: 'Created via Upgrade',
    cancelled_for_grant: 'Cancelled for Grant',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return v; }
};

const fmtDateTime = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    catch { return v; }
};

const planColor = (name = '') =>
    PLAN_PALETTE[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % PLAN_PALETTE.length];

// ─── Atoms ────────────────────────────────────────────────────────────────────

const StatusBadge = ({ statusKey, grace }) => {
    const key = grace ? 'grace' : (statusKey ?? '');
    const c   = STATUS_CFG[key] ?? { label: key, bg: 'hsl(220 15% 92%)', color: 'hsl(220 15% 40%)', dot: 'hsl(220 15% 55%)' };
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.28rem 0.75rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.06em', backgroundColor: c.bg, color: c.color }}>
            <span style={{ width: '0.4rem', height: '0.4rem', borderRadius: '50%', backgroundColor: c.dot, flexShrink: 0 }} />
            {c.label.toUpperCase()}
        </span>
    );
};

const Avatar = ({ name, email, size = '2.75rem', fontSize = '0.8rem' }) => {
    const str      = name ?? email ?? '?';
    const initials = str.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const hue      = [...str].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    return (
        <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 30%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize, fontWeight: '800', letterSpacing: '0.02em' }}>
            {initials}
        </div>
    );
};

const Card = ({ children, style = {} }) => (
    <div style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid hsl(220 15% 91%)', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)', overflow: 'hidden', ...style }}>
        {children}
    </div>
);

const CardHeader = ({ icon, title, subtitle }) => (
    <div style={{ padding: '1.1rem 1.4rem', borderBottom: '1px solid hsl(220 15% 93%)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '2.2rem', height: '2.2rem', borderRadius: '0.55rem', backgroundColor: 'hsl(220 15% 95%)', color: 'hsl(220 25% 35%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
        </div>
        <div>
            <h2 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700', color: 'hsl(220 25% 16%)' }}>{title}</h2>
            {subtitle && <p style={{ margin: 0, fontSize: '0.72rem', color: 'hsl(220 15% 52%)' }}>{subtitle}</p>}
        </div>
    </div>
);

const InfoRow = ({ label, value, mono = false }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.7rem 1.4rem', borderBottom: '1px solid hsl(220 15% 96%)' }}>
        <span style={{ fontSize: '0.78rem', color: 'hsl(220 15% 52%)', fontWeight: '500', flexShrink: 0, marginRight: '1rem' }}>{label}</span>
        <span style={{ fontSize: '0.82rem', color: 'hsl(220 25% 18%)', fontWeight: '600', textAlign: 'right', fontFamily: mono ? 'monospace' : 'inherit' }}>{value ?? '—'}</span>
    </div>
);

const ActionBtn = ({ iconEl, label, onClick, bg, color, disabled = false }) => (
    <button onClick={onClick} disabled={disabled}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: '600', backgroundColor: disabled ? 'hsl(220 15% 93%)' : bg, color: disabled ? 'hsl(220 15% 58%)' : color, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'filter 0.12s', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
        onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(0.91)'; }}
        onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}>
        {iconEl}{label}
    </button>
);

// ─── Confirm Modal ────────────────────────────────────────────────────────────

const ConfirmModal = ({ title, description, danger, confirmLabel, onConfirm, onClose, processing, children }) => (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(220 25% 8% / 0.55)', backdropFilter: 'blur(4px)' }}>
        <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '440px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.1rem', padding: '2rem', boxShadow: '0 32px 72px hsl(220 25% 8% / 0.22)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', backgroundColor: danger ? 'hsl(0 70% 94%)' : 'hsl(214 100% 95%)', color: danger ? 'hsl(0 65% 48%)' : 'hsl(214 80% 48%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icons.alert />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>{title}</h3>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 55%)', display: 'flex', padding: '0.25rem' }}><Icons.x /></button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'hsl(220 15% 38%)', lineHeight: 1.6, margin: '0 0 1rem' }}>{description}</p>

            {children}

            {danger && (
                <div style={{ padding: '0.65rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 65% 88%)', fontSize: '0.76rem', color: 'hsl(0 55% 38%)', marginBottom: '1rem', lineHeight: 1.5 }}>
                    ⚠ This action is immediate and may affect the user's access to the platform.
                </div>
            )}

            <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button onClick={onClose} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Cancel
                </button>
                <button onClick={onConfirm} disabled={processing}
                    style={{ flex: 2, padding: '0.625rem', borderRadius: '0.6rem', border: 'none', backgroundColor: processing ? 'hsl(220 25% 55%)' : (danger ? 'hsl(0 65% 50%)' : 'hsl(152 55% 33%)'), color: 'white', fontSize: '0.85rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                    {processing ? 'Processing…' : confirmLabel}
                </button>
            </div>
        </div>
    </div>
);

// ─── Upgrade Modal ────────────────────────────────────────────────────────────

const UpgradeModal = ({ subscription, plans, onClose, processing, onConfirm }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const currentPlanId = subscription.plan_id;

    const availablePlans = plans.filter(p => p.id !== currentPlanId);

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(220 25% 8% / 0.55)', backdropFilter: 'blur(4px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '480px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.1rem', padding: '2rem', boxShadow: '0 32px 72px hsl(220 25% 8% / 0.22)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>Upgrade Plan</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 55%)', display: 'flex', padding: '0.25rem' }}><Icons.x /></button>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'hsl(220 15% 45%)', margin: '0 0 1rem', lineHeight: 1.6 }}>
                    Select a new plan for <strong>{subscription.user_name}</strong>. The current subscription will be cancelled and a new one created immediately.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    {availablePlans.map(plan => {
                        const color   = planColor(plan.name);
                        const active  = selectedPlan === plan.id;
                        return (
                            <button key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderRadius: '0.65rem', border: `2px solid ${active ? color : 'hsl(220 15% 90%)'}`, backgroundColor: active ? `${color}0d` : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'inherit' }}>
                                <div>
                                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: active ? color : 'hsl(220 25% 18%)' }}>{plan.name}</div>
                                    <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 52%)', marginTop: '0.1rem' }}>
                                        GH₵{Number(plan.price).toFixed(2)}/{plan.billing_cycle}
                                    </div>
                                </div>
                                {active && (
                                    <span style={{ width: '1.3rem', height: '1.3rem', borderRadius: '50%', backgroundColor: color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icons.check />
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Cancel
                    </button>
                    <button onClick={() => selectedPlan && onConfirm(selectedPlan)} disabled={!selectedPlan || processing}
                        style={{ flex: 2, padding: '0.625rem', borderRadius: '0.6rem', border: 'none', backgroundColor: !selectedPlan || processing ? 'hsl(220 25% 55%)' : 'hsl(152 55% 33%)', color: 'white', fontSize: '0.85rem', fontWeight: '700', cursor: !selectedPlan || processing ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                        {processing ? 'Upgrading…' : 'Confirm Upgrade'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ toast }) => {
    if (!toast) return null;
    return (
        <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 100, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'slideIn 0.2s ease' }}>
            {toast.msg}
        </div>
    );
};

// ─── Main Show Page ───────────────────────────────────────────────────────────

const SubscriptionShow = ({ subscription: sub, audit_logs = [], plans = [] }) => {
    const [modal,      setModal]      = useState(null); // null | 'cancel' | 'suspend' | 'free_month' | 'upgrade'
    const [processing, setProcessing] = useState(false);
    const [toast,      setToast]      = useState(null);
    const toastTimer                  = useRef(null);

    const isActive = ['active', 'trial'].includes(sub.status);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const postAction = (url, body = {}, successMsg) => {
        setProcessing(true);
        router.post(url, body, {
            preserveScroll: true,
            onSuccess: () => { showToast(successMsg); setModal(null); },
            onError:   () => showToast('Action failed. Please try again.', 'error'),
            onFinish:  () => setProcessing(false),
        });
    };

    const handleConfirm = () => {
        const id = sub.id;
        if (modal === 'cancel')     postAction(`/super-admin/subscriptions/${id}/cancel`,  {},           'Subscription cancelled.');
        if (modal === 'suspend')    postAction(`/super-admin/subscriptions/${id}/suspend`, {},           'Account suspended.');
        if (modal === 'free_month') postAction(`/super-admin/subscriptions/${id}/extend`,  { days: 30 }, 'Free month granted.');
    };

    const handleUpgrade = (planId) => {
        setProcessing(true);
        router.post(`/super-admin/subscriptions/${sub.id}/upgrade`, { plan_id: planId }, {
            preserveScroll: true,
            onSuccess: () => { showToast('Plan upgraded successfully.'); setModal(null); },
            onError:   () => showToast('Upgrade failed. Please try again.', 'error'),
            onFinish:  () => setProcessing(false),
        });
    };

    const modalCfg = {
        cancel: {
            title: 'Cancel Subscription', confirmLabel: 'Confirm Cancel', danger: true,
            description: `Cancel the ${sub.plan_name} subscription for ${sub.user_name}? Their account will be downgraded to Free immediately.`,
        },
        suspend: {
            title: 'Suspend Account', confirmLabel: 'Confirm Suspend', danger: true,
            description: `Suspend ${sub.user_name}'s account? They will lose access to all paid features immediately.`,
        },
        free_month: {
            title: 'Grant Free Month', confirmLabel: 'Grant Extension', danger: false,
            description: `Grant a free 30-day extension to ${sub.user_name}? Their renewal date will be pushed back by 30 days.`,
        },
    };

    return (
        <>
        <Head>
            <title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
        </Head>
            <Toast toast={toast} />

            {/* ── Confirm modals (cancel / suspend / free month) ── */}
            {modal && modal !== 'upgrade' && modalCfg[modal] && (
                <ConfirmModal
                    {...modalCfg[modal]}
                    onConfirm={handleConfirm}
                    onClose={() => setModal(null)}
                    processing={processing}
                />
            )}

            {/* ── Upgrade modal ── */}
            {modal === 'upgrade' && (
                <UpgradeModal
                    subscription={sub}
                    plans={plans}
                    onClose={() => setModal(null)}
                    processing={processing}
                    onConfirm={handleUpgrade}
                />
            )}

            <div style={{ maxWidth: '960px' }}>

                {/* ── Back + header ── */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link href="/super-admin/subscriptions"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: '600', color: 'hsl(220 15% 52%)', textDecoration: 'none', marginBottom: '0.875rem' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'hsl(220 25% 22%)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'hsl(220 15% 52%)'}>
                        <Icons.arrow /> Back to Subscriptions
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'hsl(220 25% 14%)', margin: 0 }}>
                                    Subscription Detail
                                </h1>
                                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: '700', color: 'hsl(214 80% 46%)', backgroundColor: 'hsl(214 100% 97%)', padding: '0.2rem 0.55rem', borderRadius: '0.35rem' }}>
                                    {sub.sub_ref}
                                </span>
                                <StatusBadge statusKey={sub.status} grace={sub.on_grace_period} />
                            </div>
                            <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem', color: 'hsl(220 15% 50%)' }}>
                                Manage and review this subscription's details and history.
                            </p>
                        </div>

                        {/* Action buttons */}
                        {isActive && (
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <ActionBtn iconEl={<Icons.upgrade />} label="Upgrade"    onClick={() => setModal('upgrade')}    bg="hsl(152 55% 92%)" color="hsl(152 55% 30%)" />
                                <ActionBtn iconEl={<Icons.gift />}    label="Free Month" onClick={() => setModal('free_month')} bg="hsl(270 55% 94%)" color="hsl(270 55% 40%)" />
                                <ActionBtn iconEl={<Icons.ban />}     label="Suspend"    onClick={() => setModal('suspend')}    bg="hsl(0 65% 95%)"   color="hsl(0 62% 45%)" />
                                <ActionBtn iconEl={<Icons.cancel />}  label="Cancel"     onClick={() => setModal('cancel')}     bg="hsl(220 15% 91%)" color="hsl(220 15% 38%)" />
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Two-column layout ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>

                    {/* User info */}
                    <Card>
                        <CardHeader icon={<Icons.user />} title="Account Holder" subtitle="User linked to this subscription" />

                        <div style={{ padding: '1.1rem 1.4rem', display: 'flex', alignItems: 'center', gap: '0.875rem', borderBottom: '1px solid hsl(220 15% 96%)' }}>
                            <Avatar name={sub.user_name} email={sub.email} />
                            <div>
                                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'hsl(220 25% 14%)' }}>{sub.user_name}</div>
                                <div style={{ fontSize: '0.78rem', color: 'hsl(220 15% 52%)', marginTop: '0.1rem' }}>{sub.email}</div>
                            </div>
                        </div>

                        <InfoRow label="User ID"  value={`#${sub.user_id}`} mono />
                        <InfoRow label="Package"  value={sub.plan_name} />
                        <div style={{ height: '0.25rem' }} />
                    </Card>

                    {/* Plan info */}
                    <Card>
                        <CardHeader icon={<Icons.plan />} title="Plan Details" subtitle="Current plan configuration" />

                        {(() => {
                            const color = planColor(sub.plan_name);
                            return (
                                <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid hsl(220 15% 96%)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.6rem', backgroundColor: `${color}18`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.02em' }}>
                                        {sub.plan_name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: '700', color }}>{sub.plan_name}</div>
                                        <div style={{ fontSize: '0.78rem', color: 'hsl(220 15% 52%)' }}>
                                            GH₵{Number(sub.plan_price).toFixed(2)}/{sub.plan_cycle}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        <InfoRow label="Billing Cycle" value={sub.plan_cycle} />
                        <InfoRow label="Provider"      value={sub.payment_method} />
                        <div style={{ height: '0.25rem' }} />
                    </Card>
                </div>

                {/* ── Dates & billing ── */}
                <Card style={{ marginBottom: '1rem' }}>
                    <CardHeader icon={<Icons.calendar />} title="Billing Timeline" subtitle="Key dates for this subscription" />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                        {[
                            ['Started',      fmtDate(sub.starts_at ?? sub.created_at)],
                            ['Renews / Ends', fmtDate(sub.renews_at)],
                            ['Days Left',    (() => {
                                const start = sub.starts_at ?? sub.created_at;
                                if (!start || !sub.renews_at) return '—';
                                const diff = Math.ceil((new Date(sub.renews_at) - new Date()) / (1000 * 60 * 60 * 24));
                                const days = Math.max(0, diff);
                                return `${days} day${days !== 1 ? 's' : ''}`;
                            })()],
                            ['Created At',    fmtDate(sub.created_at)],
                        ].map(([label, value]) => (
                            <div key={label} style={{ padding: '1rem 1.4rem', borderRight: '1px solid hsl(220 15% 95%)', borderBottom: '1px solid hsl(220 15% 95%)' }}>
                                <div style={{ fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', marginBottom: '0.3rem' }}>{label}</div>
                                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'hsl(220 25% 16%)' }}>{value}</div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* ── Audit log ── */}
                <Card>
                    <CardHeader
                        icon={<Icons.log />}
                        title="Audit Log"
                        subtitle={`${audit_logs.length} action${audit_logs.length !== 1 ? 's' : ''} recorded`}
                    />

                    {audit_logs.length === 0 ? (
                        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.75rem', marginBottom: '0.6rem' }}>📋</div>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'hsl(220 15% 52%)' }}>No admin actions have been recorded for this subscription yet.</p>
                        </div>
                    ) : (
                        <div style={{ padding: '0.5rem 0' }}>
                            {audit_logs.map((log, i) => {
                                const c = ACTION_LOG_COLORS[log.action] ?? { bg: 'hsl(220 15% 92%)', color: 'hsl(220 15% 38%)' };
                                const isLast = i === audit_logs.length - 1;
                                return (
                                    <div key={log.id} style={{ display: 'flex', gap: '1rem', padding: '0.875rem 1.4rem', position: 'relative' }}>
                                        {/* Timeline line */}
                                        {!isLast && (
                                            <div style={{ position: 'absolute', left: '1.4rem', top: '2.5rem', bottom: 0, width: '2px', backgroundColor: 'hsl(220 15% 93%)', marginLeft: '0.75rem' }} />
                                        )}

                                        {/* Dot */}
                                        <div style={{ width: '1.6rem', height: '1.6rem', borderRadius: '50%', backgroundColor: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                                            <Icons.clock />
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                                                <span style={{ padding: '0.18rem 0.6rem', borderRadius: '999px', fontSize: '0.67rem', fontWeight: '700', letterSpacing: '0.06em', backgroundColor: c.bg, color: c.color }}>
                                                    {(ACTION_LABELS[log.action] ?? log.action).toUpperCase()}
                                                </span>
                                                <span style={{ fontSize: '0.72rem', color: 'hsl(220 15% 55%)' }}>
                                                    by <strong style={{ color: 'hsl(220 25% 30%)' }}>{log.admin_name}</strong>
                                                </span>
                                                <span style={{ fontSize: '0.72rem', color: 'hsl(220 15% 60%)', marginLeft: 'auto' }}>
                                                    {fmtDateTime(log.created_at)}
                                                </span>
                                            </div>

                                            {log.notes && (
                                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'hsl(220 15% 38%)', lineHeight: 1.5 }}>{log.notes}</p>
                                            )}

                                            {/* Meta details */}
                                            {log.meta && Object.keys(log.meta).length > 0 && (
                                                <details style={{ marginTop: '0.4rem' }}>
                                                    <summary style={{ fontSize: '0.7rem', color: 'hsl(220 15% 55%)', cursor: 'pointer', userSelect: 'none' }}>
                                                        View details
                                                    </summary>
                                                    <div style={{ marginTop: '0.35rem', padding: '0.6rem 0.75rem', borderRadius: '0.45rem', backgroundColor: 'hsl(220 15% 97%)', border: '1px solid hsl(220 15% 91%)' }}>
                                                        {Object.entries(log.meta).map(([k, v]) => (
                                                            <div key={k} style={{ display: 'flex', gap: '0.75rem', padding: '0.18rem 0', fontSize: '0.72rem' }}>
                                                                <span style={{ color: 'hsl(220 15% 52%)', fontWeight: '600', flexShrink: 0, minWidth: '120px' }}>{k.replace(/_/g, ' ')}</span>
                                                                <span style={{ color: 'hsl(220 25% 25%)', fontFamily: 'monospace', wordBreak: 'break-all' }}>{String(v)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </details>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>
            </div>

            <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </>
    );
};

SubscriptionShow.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default SubscriptionShow;