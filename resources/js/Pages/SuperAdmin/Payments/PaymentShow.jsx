import React, { useState, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = ({ d, size = '1rem' }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d={p} />
        ))}
    </svg>
);

const Icons = {
    arrow:    () => <Ico d="M10 19l-7-7m0 0l7-7m-7 7h18" />,
    user:     () => <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    card:     () => <Ico d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
    refund:   () => <Ico d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />,
    receipt:  () => <Ico d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
    history:  () => <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    alert:    () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    x:        () => <Ico d="M6 18L18 6M6 6l12 12" />,
    check:    () => <Ico d="M5 13l4 4L19 7" />,
    plan:     () => <Ico d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    info:     () => <Ico d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
};

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CFG = {
    success:             { label: 'Success',            bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 28%)', dot: 'hsl(152 60% 38%)' },
    paid:                { label: 'Paid',               bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 28%)', dot: 'hsl(152 60% 38%)' },
    pending:             { label: 'Pending',            bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 33%)',  dot: 'hsl(40 80% 46%)' },
    failed:              { label: 'Failed',             bg: 'hsl(0 70% 94%)',   color: 'hsl(0 65% 40%)',   dot: 'hsl(0 65% 50%)' },
    refunded:            { label: 'Refunded',           bg: 'hsl(220 15% 92%)', color: 'hsl(220 15% 36%)', dot: 'hsl(220 15% 50%)' },
    partially_refunded:  { label: 'Partial Refund',     bg: 'hsl(270 55% 94%)', color: 'hsl(270 55% 38%)', dot: 'hsl(270 55% 50%)' },
};

const PROVIDER_CFG = {
    paystack:   { label: 'Paystack',    bg: 'hsl(152 65% 93%)', color: 'hsl(152 65% 28%)' },
    flutterwave:{ label: 'Flutterwave', bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 30%)' },
    manual:     { label: 'Manual',      bg: 'hsl(214 100% 95%)',color: 'hsl(214 80% 38%)' },
    admin_grant:{ label: 'Admin Grant', bg: 'hsl(270 55% 94%)', color: 'hsl(270 55% 38%)' },
    stripe:     { label: 'Stripe',      bg: 'hsl(248 60% 95%)', color: 'hsl(248 60% 38%)' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v) => Number(v).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const avatarHue = (name = '') => [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

const canRefund = (status) => status === 'success' || status === 'paid';

// ─── Atoms ────────────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
    const c = STATUS_CFG[status] ?? { label: status, bg: 'hsl(220 15% 92%)', color: 'hsl(220 15% 40%)', dot: 'hsl(220 15% 54%)' };
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.28rem 0.75rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.06em', backgroundColor: c.bg, color: c.color }}>
            <span style={{ width: '0.4rem', height: '0.4rem', borderRadius: '50%', backgroundColor: c.dot, flexShrink: 0 }} />
            {c.label.toUpperCase()}
        </span>
    );
};

const ProviderBadge = ({ provider }) => {
    const c = PROVIDER_CFG[(provider ?? '').toLowerCase()] ?? { label: provider ?? '—', bg: 'hsl(220 15% 92%)', color: 'hsl(220 15% 40%)' };
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.2rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.04em', backgroundColor: c.bg, color: c.color }}>
            {c.label}
        </span>
    );
};

const Avatar = ({ name, email }) => {
    const str = name ?? email ?? '?';
    const initials = str.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const hue = avatarHue(str);
    return (
        <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', flexShrink: 0, backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 30%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800' }}>
            {initials}
        </div>
    );
};

const Card = ({ children, style = {} }) => (
    <div style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid hsl(220 15% 91%)', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)', overflow: 'hidden', ...style }}>
        {children}
    </div>
);

const CardHeader = ({ icon, title, subtitle, right }) => (
    <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid hsl(220 15% 93%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.1rem', height: '2.1rem', borderRadius: '0.5rem', backgroundColor: 'hsl(220 15% 95%)', color: 'hsl(220 25% 35%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {icon}
            </div>
            <div>
                <h2 style={{ margin: 0, fontSize: '0.88rem', fontWeight: '700', color: 'hsl(220 25% 16%)' }}>{title}</h2>
                {subtitle && <p style={{ margin: 0, fontSize: '0.71rem', color: 'hsl(220 15% 52%)' }}>{subtitle}</p>}
            </div>
        </div>
        {right}
    </div>
);

const InfoRow = ({ label, value, mono = false, node = false }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1.4rem', borderBottom: '1px solid hsl(220 15% 96%)' }}>
        <span style={{ fontSize: '0.77rem', color: 'hsl(220 15% 52%)', fontWeight: '500', flexShrink: 0, marginRight: '1rem' }}>{label}</span>
        {node ? value : (
            <span style={{ fontSize: '0.82rem', color: 'hsl(220 25% 18%)', fontWeight: '600', textAlign: 'right', fontFamily: mono ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>{value ?? '—'}</span>
        )}
    </div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ toast }) => !toast ? null : (
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 100, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'paySlideIn 0.2s ease' }}>
        {toast.type === 'error' ? <Icons.x /> : <Icons.check />} {toast.msg}
    </div>
);

// ─── Refund modal ─────────────────────────────────────────────────────────────

const RefundModal = ({ payment, refundable, onClose, onConfirm, processing }) => {
    const [amount,  setAmount]  = useState(refundable.toFixed(2));
    const [reason,  setReason]  = useState('');
    const [focused, setFocused] = useState(null);

    const amountNum  = parseFloat(amount) || 0;
    const isPartial  = amountNum < refundable && amountNum > 0;
    const isValid    = amountNum > 0 && amountNum <= refundable && reason.trim().length >= 5;

    const inpStyle = (key) => ({
        width: '100%', padding: '0.6rem 0.875rem', boxSizing: 'border-box',
        border: `1.5px solid ${focused === key ? 'hsl(214 80% 55%)' : 'hsl(220 15% 88%)'}`,
        borderRadius: '0.55rem', fontSize: '0.875rem', color: 'hsl(220 25% 16%)',
        backgroundColor: focused === key ? 'white' : 'hsl(220 15% 98.5%)',
        outline: 'none', fontFamily: 'inherit',
        boxShadow: focused === key ? '0 0 0 3px hsl(214 80% 55% / 0.1)' : 'none',
        transition: 'all 0.15s',
    });

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(220 25% 8% / 0.55)', backdropFilter: 'blur(4px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '460px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.1rem', boxShadow: '0 32px 72px hsl(220 25% 8% / 0.22)', overflow: 'hidden' }}>

                {/* Modal header */}
                <div style={{ background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))', padding: '1.4rem 1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '2.4rem', height: '2.4rem', borderRadius: '0.65rem', backgroundColor: 'hsl(214 100% 95%)', color: 'hsl(214 80% 46%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icons.refund />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'white' }}>Issue Refund</h3>
                            <p style={{ margin: 0, fontSize: '0.72rem', color: 'hsl(220 20% 55%)' }}>{payment.reference}</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 20% 55%)', display: 'flex', padding: '0.2rem', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'white'}
                        onMouseLeave={e => e.currentTarget.style.color = 'hsl(220 20% 55%)'}>
                        <Icons.x />
                    </button>
                </div>

                <div style={{ padding: '1.5rem 1.75rem' }}>
                    {/* Payment summary strip */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        {[
                            { label: 'Original',  value: `GH₵ ${fmt(payment.amount)}` },
                            { label: 'Refundable', value: `GH₵ ${fmt(refundable)}`, accent: true },
                            { label: 'User',      value: payment.user_name },
                        ].map(({ label, value, accent }) => (
                            <div key={label} style={{ padding: '0.65rem 0.75rem', borderRadius: '0.55rem', backgroundColor: accent ? 'hsl(152 60% 96%)' : 'hsl(220 15% 97%)', border: `1px solid ${accent ? 'hsl(152 60% 88%)' : 'hsl(220 15% 91%)'}` }}>
                                <div style={{ fontSize: '0.62rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: accent ? 'hsl(152 55% 35%)' : 'hsl(220 15% 52%)', marginBottom: '0.2rem' }}>{label}</div>
                                <div style={{ fontSize: '0.83rem', fontWeight: '700', color: accent ? 'hsl(152 55% 28%)' : 'hsl(220 25% 18%)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Amount input */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'hsl(220 25% 28%)' }}>Refund Amount (GH₵)</span>
                            <button onClick={() => setAmount(refundable.toFixed(2))}
                                style={{ fontSize: '0.7rem', fontWeight: '600', color: 'hsl(214 80% 48%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                                Full refund
                            </button>
                        </label>
                        <input
                            type="number" step="0.01" min="0.01" max={refundable}
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            onFocus={() => setFocused('amount')}
                            onBlur={() => setFocused(null)}
                            style={inpStyle('amount')}
                        />
                        {isPartial && (
                            <p style={{ margin: '0.35rem 0 0', fontSize: '0.7rem', color: 'hsl(270 55% 42%)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <Icons.info /> Partial refund — remaining GH₵ {fmt(refundable - amountNum)} stays with the original payment.
                            </p>
                        )}
                        {amountNum > refundable && (
                            <p style={{ margin: '0.35rem 0 0', fontSize: '0.7rem', color: 'hsl(0 62% 44%)' }}>
                                Amount exceeds the refundable balance of GH₵ {fmt(refundable)}.
                            </p>
                        )}
                    </div>

                    {/* Reason textarea */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'hsl(220 25% 28%)', marginBottom: '0.35rem' }}>
                            Reason <span style={{ color: 'hsl(0 62% 48%)' }}>*</span>
                        </label>
                        <textarea
                            rows={3}
                            placeholder="e.g. Duplicate charge, customer request, service not delivered…"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            onFocus={() => setFocused('reason')}
                            onBlur={() => setFocused(null)}
                            style={{ ...inpStyle('reason'), resize: 'vertical', minHeight: '80px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.2rem' }}>
                            <span style={{ fontSize: '0.68rem', color: reason.length < 5 ? 'hsl(0 62% 46%)' : 'hsl(220 15% 55%)' }}>
                                {reason.length} / 500
                            </span>
                        </div>
                    </div>

                    {/* Warning */}
                    <div style={{ padding: '0.65rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 65% 88%)', fontSize: '0.75rem', color: 'hsl(0 55% 38%)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                        ⚠ Refunds are irreversible. {!isPartial && 'A full refund will cancel the linked subscription if active.'}
                        {isPartial && 'The subscription will remain active after a partial refund.'}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '0.65rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>
                            Cancel
                        </button>
                        <button
                            onClick={() => isValid && onConfirm({ amount: amountNum, reason })}
                            disabled={!isValid || processing}
                            style={{ flex: 2, padding: '0.65rem', borderRadius: '0.6rem', border: 'none', backgroundColor: !isValid || processing ? 'hsl(220 15% 75%)' : 'hsl(0 65% 50%)', color: 'white', fontSize: '0.85rem', fontWeight: '700', cursor: !isValid || processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit', transition: 'background-color 0.15s' }}>
                            <Icons.refund /> {processing ? 'Processing…' : `Refund GH₵ ${amountNum > 0 ? fmt(amountNum) : '0.00'}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const PaymentShow = ({ payment, refunds = [], total_refunded = 0, refundable = 0 }) => {
    const [showRefund, setShowRefund] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [toast,      setToast]      = useState(null);
    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const handleRefund = ({ amount, reason }) => {
        setProcessing(true);
        router.post(`/super-admin/payments/${payment.id}/refund`, { amount, reason }, {
            preserveScroll: true,
            onSuccess: () => { showToast(`Refund of GH₵ ${fmt(amount)} processed.`); setShowRefund(false); },
            onError:   (e) => showToast(Object.values(e)[0] ?? 'Refund failed. Please try again.', 'error'),
            onFinish:  () => setProcessing(false),
        });
    };

    const refundable_amount = refundable;
    const isRefundable      = canRefund(payment.status) && refundable_amount > 0;

    return (
        <>
            <Toast toast={toast} />

            {showRefund && (
                <RefundModal
                    payment={payment}
                    refundable={refundable_amount}
                    onClose={() => setShowRefund(false)}
                    onConfirm={handleRefund}
                    processing={processing}
                />
            )}

            <div style={{ maxWidth: '900px' }}>

                {/* ── Back + header ── */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link href="/super-admin/payments"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: '600', color: 'hsl(220 15% 52%)', textDecoration: 'none', marginBottom: '0.875rem' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'hsl(220 25% 22%)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'hsl(220 15% 52%)'}>
                        <Icons.arrow /> Back to Payments
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                                <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'hsl(220 25% 14%)', margin: 0 }}>
                                    Payment Detail
                                </h1>
                                <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: '700', color: 'hsl(214 80% 46%)', backgroundColor: 'hsl(214 100% 97%)', padding: '0.2rem 0.55rem', borderRadius: '0.35rem' }}>
                                    {payment.reference}
                                </span>
                                <StatusBadge status={payment.status} />
                            </div>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: 'hsl(220 15% 50%)' }}>
                                {payment.created_at_full ?? payment.created_at}
                            </p>
                        </div>

                        {isRefundable && (
                            <button onClick={() => setShowRefund(true)}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.6rem 1.1rem', borderRadius: '0.6rem', backgroundColor: 'hsl(0 65% 50%)', color: 'white', fontWeight: '700', fontSize: '0.84rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                <Icons.refund /> Issue Refund
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Amount hero ── */}
                <div style={{ backgroundColor: 'hsl(222 28% 14%)', borderRadius: '1rem', padding: '1.5rem 1.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.06) 1px, transparent 1px)', backgroundSize: '22px 22px', pointerEvents: 'none' }} />

                    <div style={{ position: 'relative' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(220 20% 48%)', marginBottom: '0.35rem' }}>
                            {payment.type === 'refund' ? 'Refund Amount' : 'Payment Amount'}
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', letterSpacing: '-0.03em', lineHeight: 1 }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: '600', verticalAlign: 'super', marginRight: '0.15rem', color: 'hsl(220 20% 60%)' }}>
                                {payment.currency ?? 'GHS'}
                            </span>
                            {fmt(payment.amount)}
                        </div>
                        {total_refunded > 0 && (
                            <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'hsl(270 55% 72%)', fontWeight: '600' }}>
                                GH₵ {fmt(total_refunded)} refunded · GH₵ {fmt(refundable_amount)} remaining
                            </div>
                        )}
                    </div>

                    <div style={{ position: 'relative', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <div style={{ padding: '0.75rem 1rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 28% 20%)', border: '1px solid hsl(220 25% 28%)' }}>
                            <div style={{ fontSize: '0.62rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(220 20% 48%)', marginBottom: '0.25rem' }}>Provider</div>
                            <ProviderBadge provider={payment.provider} />
                        </div>
                        <div style={{ padding: '0.75rem 1rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 28% 20%)', border: '1px solid hsl(220 25% 28%)' }}>
                            <div style={{ fontSize: '0.62rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(220 20% 48%)', marginBottom: '0.25rem' }}>Plan</div>
                            <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'white' }}>{payment.plan_name}</div>
                        </div>
                    </div>
                </div>

                {/* ── Two-column info ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>

                    {/* Payer */}
                    <Card>
                        <CardHeader icon={<Icons.user />} title="Payer" subtitle="Account linked to this payment" />
                        <div style={{ padding: '1rem 1.4rem', display: 'flex', alignItems: 'center', gap: '0.875rem', borderBottom: '1px solid hsl(220 15% 96%)' }}>
                            <Avatar name={payment.user_name} email={payment.user_email} />
                            <div>
                                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'hsl(220 25% 14%)' }}>{payment.user_name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'hsl(220 15% 52%)' }}>{payment.user_email}</div>
                            </div>
                        </div>
                        <InfoRow label="User ID"      value={`#${payment.user_id}`} mono />
                        <InfoRow label="Plan"         value={payment.plan_name} />
                        <InfoRow label="Status"       node value={<StatusBadge status={payment.status} />} />
                        <div style={{ height: '0.25rem' }} />
                    </Card>

                    {/* Transaction */}
                    <Card>
                        <CardHeader icon={<Icons.card />} title="Transaction" subtitle="Payment gateway details" />
                        <InfoRow label="Reference"    value={payment.reference} mono />
                        <InfoRow label="Provider"     node value={<ProviderBadge provider={payment.provider} />} />
                        <InfoRow label="Currency"     value={payment.currency ?? 'GHS'} />
                        <InfoRow label="Type"         value={(payment.type ?? 'payment').replace(/_/g, ' ')} />
                        <InfoRow label="Subscription" value={payment.subscription_id ? `#${payment.subscription_id}` : '—'} mono />
                        <div style={{ height: '0.25rem' }} />
                    </Card>
                </div>

                {/* ── Notes ── */}
                {payment.notes && (
                    <Card style={{ marginBottom: '1rem' }}>
                        <CardHeader icon={<Icons.info />} title="Notes" />
                        <p style={{ margin: 0, padding: '1rem 1.4rem', fontSize: '0.84rem', color: 'hsl(220 15% 38%)', lineHeight: 1.65 }}>
                            {payment.notes}
                        </p>
                    </Card>
                )}

                {/* ── Refund history ── */}
                <Card>
                    <CardHeader
                        icon={<Icons.history />}
                        title="Refund History"
                        subtitle={refunds.length > 0 ? `${refunds.length} refund${refunds.length !== 1 ? 's' : ''} · GH₵ ${fmt(total_refunded)} total` : 'No refunds issued'}
                    />

                    {refunds.length === 0 ? (
                        <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.75rem', marginBottom: '0.6rem' }}>💳</div>
                            <p style={{ margin: 0, fontSize: '0.84rem', color: 'hsl(220 15% 52%)' }}>No refunds have been issued for this payment.</p>
                            {isRefundable && (
                                <button onClick={() => setShowRefund(true)}
                                    style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', borderRadius: '0.55rem', backgroundColor: 'hsl(0 65% 95%)', color: 'hsl(0 65% 44%)', fontWeight: '600', fontSize: '0.8rem', border: '1px solid hsl(0 65% 88%)', cursor: 'pointer', fontFamily: 'inherit' }}>
                                    <Icons.refund /> Issue a Refund
                                </button>
                            )}
                        </div>
                    ) : (
                        <div>
                            {/* Table header */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 8rem 10rem 8rem auto', gap: '0.75rem', padding: '0.6rem 1.4rem', backgroundColor: 'hsl(220 15% 97.5%)', borderBottom: '1px solid hsl(220 15% 92%)', fontSize: '0.67rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>
                                <div>Reference</div>
                                <div>Amount</div>
                                <div>Date</div>
                                <div>Status</div>
                                <div>Refund Reason</div>
                            </div>

                            {refunds.map((r, i) => (
                                <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1fr 8rem 10rem 8rem auto', gap: '0.75rem', padding: '0.875rem 1.4rem', borderBottom: i < refunds.length - 1 ? '1px solid hsl(220 15% 95%)' : 'none', alignItems: 'start' }}>
                                    <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: '600', color: 'hsl(214 80% 46%)', backgroundColor: 'hsl(214 100% 97%)', padding: '0.18rem 0.45rem', borderRadius: '0.3rem', display: 'inline-block', wordBreak: 'break-all' }}>
                                        {r.reference}
                                    </span>
                                    <span style={{ fontSize: '0.84rem', fontWeight: '700', color: 'hsl(0 62% 44%)' }}>
                                        − {r.currency ?? 'GHS'} {fmt(r.amount)}
                                    </span>
                                    <span style={{ fontSize: '0.78rem', color: 'hsl(220 15% 44%)' }}>{r.created_at}</span>
                                    <StatusBadge status={r.status} />
                                    <span style={{ fontSize: '0.78rem', color: 'hsl(220 15% 44%)', lineHeight: 1.5 }}>
                                        {r.reason ?? 'No reason provided'}
                                    </span>
                                </div>
                            ))}

                            {/* Totals footer */}
                            <div style={{ padding: '0.875rem 1.4rem', backgroundColor: 'hsl(220 15% 97.5%)', borderTop: '1px solid hsl(220 15% 92%)', display: 'flex', justifyContent: 'flex-end', gap: '2rem' }}>
                                <div style={{ fontSize: '0.78rem', color: 'hsl(220 15% 50%)' }}>
                                    Total refunded: <strong style={{ color: 'hsl(0 62% 44%)' }}>− GH₵ {fmt(total_refunded)}</strong>
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'hsl(220 15% 50%)' }}>
                                    Remaining: <strong style={{ color: refundable_amount > 0 ? 'hsl(152 55% 32%)' : 'hsl(220 15% 44%)' }}>GH₵ {fmt(refundable_amount)}</strong>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

            </div>

            <style>{`@keyframes paySlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </>
    );
};

PaymentShow.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default PaymentShow;