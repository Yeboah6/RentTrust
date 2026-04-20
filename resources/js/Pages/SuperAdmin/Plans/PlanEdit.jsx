import React, { useState, useEffect, useRef } from 'react';
import { Link, useForm, router } from '@inertiajs/react';
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
    back:     () => <Ico d="M15 19l-7-7 7-7" size="0.9rem" />,
    plus:     () => <Ico d="M12 4v16m8-8H4" size="0.9rem" />,
    x:        () => <Ico d="M6 18L18 6M6 6l12 12" size="0.8rem" />,
    check:    () => <Ico d="M5 13l4 4L19 7" size="0.82rem" />,
    save:     () => <Ico d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" size="1rem" />,
    plan:     () => <Ico d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" size="1.25rem" />,
    trash:    () => <Ico d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    tag:      () => <Ico d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" size="1.1rem" />,
    users:    () => <Ico d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" size="1.1rem" />,
    clock:    () => <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size="1.1rem" />,
    currency: () => <Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size="1.1rem" />,
    alert:    () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size="1.1rem" />,
    reset:    () => <Ico d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" size="0.9rem" />,
    users2:   () => <Ico d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" size="0.9rem" />,
    trending: () => <Ico d="M13 7H3v13a2 2 0 002 2h10v-2m0-11l4.293-4.293a1 1 0 111.414 1.414L18.707 7m0 0V3m0 4h-4" size="0.9rem" />,
    spinner:  () => (
        <svg style={{ width: '1rem', height: '1rem', animation: 'planEditSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Config ───────────────────────────────────────────────────────────────────

const CYCLES = [
    { value: 'month',   label: 'Monthly',   sub: 'Every month' },
    { value: 'year',    label: 'Yearly',    sub: 'Best value' },
    { value: 'quarter', label: 'Quarterly', sub: 'Every 3 mo.' },
    { value: 'week',    label: 'Weekly',    sub: 'Short-term' },
    { value: 'once',    label: 'One-time',  sub: 'Single pay' },
];

const CURRENCIES = [
    { value: '$',   label: '$ USD' },
    { value: '£',   label: '£ GBP' },
    { value: '€',   label: '€ EUR' },
    { value: '₦',   label: '₦ NGN' },
    { value: 'GH₵', label: 'GH₵ GHS' },
    { value: 'KSh', label: 'KSh KES' },
];

// ─── Field helpers ────────────────────────────────────────────────────────────

const inputBase = (focused, hasError) => ({
    width: '100%',
    padding: '0.6rem 0.875rem',
    border: `1.5px solid ${hasError ? 'hsl(0 65% 60%)' : focused ? 'hsl(220 60% 55%)' : 'hsl(220 15% 88%)'}`,
    borderRadius: '0.6rem',
    fontSize: '0.875rem',
    color: 'hsl(220 25% 16%)',
    backgroundColor: 'white',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    boxShadow: focused && !hasError ? '0 0 0 3px hsl(220 60% 55% / 0.11)' : hasError ? '0 0 0 3px hsl(0 65% 55% / 0.1)' : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
});

const FField = ({ label, required, hint, error, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32rem' }}>
        {label && (
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'hsl(220 25% 22%)', letterSpacing: '0.01em' }}>
                {label}{required && <span style={{ color: 'hsl(0 65% 52%)', marginLeft: '0.2rem' }}>*</span>}
            </label>
        )}
        {children}
        {hint  && !error && <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(220 15% 55%)' }}>{hint}</p>}
        {error           && <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(0 65% 48%)', fontWeight: '600' }}>{error}</p>}
    </div>
);

const PlanInput = ({ hasError, style: ex, ...props }) => {
    const [f, setF] = useState(false);
    return <input {...props} onFocus={() => setF(true)} onBlur={() => setF(false)} style={{ ...inputBase(f, hasError), ...ex }} />;
};

const PlanTextarea = ({ rows = 3, ...props }) => {
    const [f, setF] = useState(false);
    return <textarea {...props} rows={rows} onFocus={() => setF(true)} onBlur={() => setF(false)} style={{ ...inputBase(f, false), resize: 'vertical' }} />;
};

const PlanSelect = ({ value, onChange, options }) => {
    const [f, setF] = useState(false);
    return (
        <select value={value} onChange={onChange} onFocus={() => setF(true)} onBlur={() => setF(false)} style={{ ...inputBase(f, false), cursor: 'pointer', appearance: 'none' }}>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    );
};

// ─── Toggle ───────────────────────────────────────────────────────────────────

const Toggle = ({ value, onChange, label, sub }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 15% 97%)', border: '1px solid hsl(220 15% 91%)' }}>
        <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'hsl(220 25% 20%)' }}>{label}</div>
            {sub && <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 52%)', marginTop: '0.1rem' }}>{sub}</div>}
        </div>
        <button type="button" onClick={() => onChange(!value)}
            style={{ width: '2.75rem', height: '1.5rem', borderRadius: '999px', border: 'none', cursor: 'pointer', flexShrink: 0, position: 'relative', backgroundColor: value ? 'hsl(152 55% 38%)' : 'hsl(220 15% 80%)', transition: 'background-color 0.2s' }}>
            <span style={{ position: 'absolute', top: '0.15rem', left: value ? 'calc(100% - 1.2rem)' : '0.15rem', width: '1.2rem', height: '1.2rem', borderRadius: '50%', backgroundColor: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px hsl(220 25% 15% / 0.25)' }} />
        </button>
    </div>
);

// ─── Live preview card ────────────────────────────────────────────────────────

const PreviewCard = ({ data }) => {
    const price    = data.price ? `${data.currency}${Number(data.price).toLocaleString()}` : '—';
    const cycle    = CYCLES.find(c => c.value === data.interval)?.label ?? data.interval;
    const hue      = [...(data.name || 'Plan')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    const initials = (data.name || '?').slice(0, 2).toUpperCase();

    return (
        <div style={{ backgroundColor: 'white', border: '1.5px solid hsl(220 15% 88%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 20px hsl(220 25% 12% / 0.08)' }}>
            <div style={{ height: '4px', background: `linear-gradient(90deg, hsl(${hue} 55% 48%), hsl(${(hue + 40) % 360} 55% 55%))` }} />
            <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.65rem', backgroundColor: `hsl(${hue} 45% 88%)`, color: `hsl(${hue} 45% 32%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.02em', flexShrink: 0 }}>
                            {initials}
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: 'hsl(220 25% 14%)', lineHeight: 1 }}>
                                    {data.name || <span style={{ color: 'hsl(220 15% 65%)', fontWeight: '500' }}>Plan Name</span>}
                                </p>
                                {data.verified_badge && (
                                    <span style={{ fontSize: '0.6rem', fontWeight: '800', letterSpacing: '0.07em', color: 'hsl(40 80% 38%)', backgroundColor: 'hsl(40 90% 93%)', padding: '0.12rem 0.45rem', borderRadius: '999px' }}>✓ VERIFIED</span>
                                )}
                            </div>
                            {data.priority_ranking
                                ? <p style={{ margin: 0, fontSize: '0.72rem', color: 'hsl(152 55% 40%)', lineHeight: 1.4 }}>Priority ranking enabled</p>
                                : <p style={{ margin: 0, fontSize: '0.72rem', color: 'hsl(220 15% 68%)', fontStyle: 'italic' }}>Standard ranking</p>
                            }
                        </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: `hsl(${hue} 55% 40%)`, lineHeight: 1 }}>{price}</div>
                        <div style={{ fontSize: '0.68rem', color: 'hsl(220 15% 55%)', marginTop: '0.15rem' }}>/ {cycle}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', borderTop: '1px solid hsl(220 15% 94%)', borderBottom: '1px solid hsl(220 15% 94%)', margin: '0 -1.25rem' }}>
                    {[
                        { label: 'Listings',  value: data.listing_limit || '∞', icon: <Icons.tag /> },
                        { label: 'Rentals',   value: data.rental_limit || '∞', icon: <Icons.users /> },
                        { label: 'Sales',     value: data.sale_limit || '∞', icon: <Icons.trending /> },
                    ].map((s, i, arr) => (
                        <div key={i} style={{ flex: 1, padding: '0.65rem 0', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid hsl(220 15% 94%)' : 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', color: `hsl(${hue} 45% 40%)`, marginBottom: '0.15rem' }}>{s.icon}</div>
                            <div style={{ fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 15%)' }}>{s.value}</div>
                            <div style={{ fontSize: '0.6rem', color: 'hsl(220 15% 55%)', letterSpacing: '0.04em', marginTop: '0.05rem', textTransform: 'uppercase', fontWeight: '600' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Permissions/Features */}
                <div style={{ marginTop: '0.875rem', minHeight: '2rem' }}>
                    {(data.verified_badge || data.priority_ranking || data.analytics_access) ? (
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.38rem' }}>
                            {data.verified_badge && (
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: 'hsl(220 15% 35%)' }}>
                                    <span style={{ color: `hsl(${hue} 55% 42%)`, flexShrink: 0, display: 'flex' }}><Icons.check /></span>
                                    Verified Badge
                                </li>
                            )}
                            {data.priority_ranking && (
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: 'hsl(220 15% 35%)' }}>
                                    <span style={{ color: `hsl(${hue} 55% 42%)`, flexShrink: 0, display: 'flex' }}><Icons.check /></span>
                                    Priority Ranking
                                </li>
                            )}
                            {data.analytics_access && (
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: 'hsl(220 15% 35%)' }}>
                                    <span style={{ color: `hsl(${hue} 55% 42%)`, flexShrink: 0, display: 'flex' }}><Icons.check /></span>
                                    Analytics Access
                                </li>
                            )}
                        </ul>
                    ) : (
                        <p style={{ margin: 0, fontSize: '0.73rem', color: 'hsl(220 15% 62%)', fontStyle: 'italic' }}>No special permissions…</p>
                    )}
                </div>

                <div style={{ marginTop: '0.875rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {data.is_active
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.06em', color: 'hsl(152 55% 30%)', backgroundColor: 'hsl(152 55% 92%)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                            <span style={{ width: '0.38rem', height: '0.38rem', borderRadius: '50%', backgroundColor: 'hsl(152 55% 40%)' }} />ACTIVE
                          </span>
                        : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.06em', color: 'hsl(220 15% 40%)', backgroundColor: 'hsl(220 15% 92%)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                            <span style={{ width: '0.38rem', height: '0.38rem', borderRadius: '50%', backgroundColor: 'hsl(220 15% 55%)' }} />INACTIVE
                          </span>
                    }
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.06em', color: `hsl(${hue} 55% 35%)`, backgroundColor: `hsl(${hue} 55% 93%)`, padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                        {data.interval?.toUpperCase() || 'MONTHLY'}
                    </span>
                </div>
            </div>
        </div>
    );
};

// ─── Delete plan modal ────────────────────────────────────────────────────────

const DeleteModal = ({ plan, onConfirm, onClose, processing }) => (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.6)', backdropFilter: 'blur(5px)' }}>
        <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '420px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.15rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.32)', animation: 'planEditModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
            <div style={{ height: '4px', background: 'linear-gradient(90deg, hsl(0 65% 52%), hsl(0 75% 62%))' }} />
            <div style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.75rem', backgroundColor: 'hsl(0 70% 94%)', color: 'hsl(0 65% 48%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icons.trash />
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 0.12rem', fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>Delete Plan</h3>
                            <p style={{ margin: 0, fontSize: '0.73rem', color: 'hsl(220 15% 50%)' }}>This action cannot be undone</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 55%)', padding: '0.2rem', display: 'flex' }}><Icons.x /></button>
                </div>

                {/* Plan preview row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 15% 97%)', border: '1px solid hsl(220 15% 91%)', marginBottom: '1rem' }}>
                    {(() => {
                        const hue = [...(plan.name || 'Plan')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
                        return (
                            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.6rem', backgroundColor: `hsl(${hue} 45% 88%)`, color: `hsl(${hue} 45% 32%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '800', flexShrink: 0 }}>
                                {(plan.name || '?').slice(0, 2).toUpperCase()}
                            </div>
                        );
                    })()}
                    <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'hsl(220 25% 15%)' }}>{plan.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 52%)' }}>
                            {plan.currency}{plan.price} / {plan.interval} &middot; {plan.subscribers_count ?? 0} subscriber{plan.subscribers_count !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>

                {plan.subscribers_count > 0 && (
                    <div style={{ padding: '0.75rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(40 90% 96%)', border: '1px solid hsl(40 80% 85%)', fontSize: '0.76rem', color: 'hsl(36 75% 35%)', marginBottom: '1rem', lineHeight: 1.5, display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <span style={{ flexShrink: 0, marginTop: '0.05rem', display: 'flex' }}><Icons.alert /></span>
                        <span>This plan has <strong>{plan.subscribers_count} active subscriber{plan.subscribers_count !== 1 ? 's' : ''}</strong>. Deleting it will not immediately cancel their subscriptions, but no new subscriptions can be created.</span>
                    </div>
                )}

                <div style={{ padding: '0.65rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 65% 88%)', fontSize: '0.76rem', color: 'hsl(0 55% 38%)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    ⚠ All plan data including features, pricing, and configuration will be permanently removed.
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                    <button onClick={onConfirm} disabled={processing}
                        style={{ flex: 2, padding: '0.625rem', borderRadius: '0.6rem', border: 'none', backgroundColor: processing ? 'hsl(0 50% 60%)' : 'hsl(0 65% 50%)', color: 'white', fontSize: '0.85rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit' }}>
                        {processing ? <><Icons.spinner /> Deleting…</> : <><Icons.trash /> Delete Plan</>}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ toast }) => toast ? (
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 100, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'planEditSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {toast.type === 'error' ? <Icons.x /> : <Icons.check />}
        {toast.msg}
    </div>
) : null;

// ─── Unsaved changes banner ───────────────────────────────────────────────────

const UnsavedBanner = ({ onReset }) => (
    <div style={{ position: 'sticky', top: 0, zIndex: 30, marginBottom: '0.75rem', padding: '0.65rem 1.1rem', borderRadius: '0.65rem', backgroundColor: 'hsl(40 90% 95%)', border: '1px solid hsl(40 80% 82%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', animation: 'planEditSlideIn 0.2s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <span style={{ color: 'hsl(36 80% 40%)', display: 'flex', flexShrink: 0 }}><Icons.alert /></span>
            <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: '600', color: 'hsl(36 70% 30%)' }}>You have unsaved changes</p>
        </div>
        <button type="button" onClick={onReset}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: '0.45rem', border: '1px solid hsl(40 70% 70%)', backgroundColor: 'white', color: 'hsl(36 70% 32%)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            <Icons.reset /> Reset changes
        </button>
    </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const PlanEdit = ({ plan, inline = false, onClose } = {}) => {
    // Normalise incoming plan — map old field names to new ones
    const normalisedPlan = {
        ...plan,
        currency:      plan.currency      ?? 'GHS',
        description:   plan.description,
        interval:      plan.interval      ?? plan.billing_cycle ?? 'month',
        is_active:     plan.is_active     ?? true,
        slug:          plan.slug          ?? '',
        listing_limit: plan.listing_limit ?? plan.max_listings ?? '',
        rental_limit:  plan.rental_limit  ?? '',
        sale_limit:    plan.sale_limit    ?? '',
        boost_limit:   plan.boost_limit   ?? '',
        lead_limit:    plan.lead_limit    ?? '',
        verified_badge: plan.verified_badge ?? false,
        priority_ranking: plan.priority_ranking ?? false,
        analytics_access: plan.analytics_access ?? false,
        paystack_plan_code: plan.paystack_plan_code ?? '',
        flutterwave_plan_id: plan.flutterwave_plan_id ?? '',
        sort_order:    plan.sort_order    ?? 0,
        // features: [],
    };

    const { data, setData, put, processing, errors, isDirty, reset } = useForm({ ...normalisedPlan });

    const [showDelete,     setShowDelete]     = useState(false);
    const [deleting,       setDeleting]       = useState(false);
    const [toast,          setToast]          = useState(null);
    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/super-admin/plans/${plan.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                showToast('Plan updated successfully.');
                if (inline) onClose?.();
            },
            onError:   () => showToast('Please fix the errors below.', 'error'),
        });
    };

    const confirmDelete = () => {
        setDeleting(true);
        router.delete(`/super-admin/plans/${plan.id}`, {
            onSuccess: () => {
                if (inline) {
                    onClose?.();
                } else {
                    router.visit('/super-admin/plans');
                }
            },
            onError:   () => { showToast('Failed to delete plan.', 'error'); setDeleting(false); setShowDelete(false); },
        });
    };

    const hue      = [...(data.name || 'Plan')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    const initials = data.name ? data.name.slice(0, 2).toUpperCase() : null;

    const fmtDate = (v) => {
        if (!v) return '—';
        try { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
        catch { return v; }
    };

    return (
        <>
            <Toast toast={toast} />
            {showDelete && <DeleteModal plan={{ ...data, subscribers_count: plan.subscribers_count }} onConfirm={confirmDelete} onClose={() => setShowDelete(false)} processing={deleting} />}

            <div>
                {/* ── Unsaved changes banner ── */}
                {isDirty && <UnsavedBanner onReset={() => reset()} />}

                {/* ── Page header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {inline ? (
                            <button type="button" onClick={() => onClose?.()}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                                <Icons.x /> Close
                            </button>
                        ) : (
                            <Link href="/super-admin/plans"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', transition: 'background-color 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                                <Icons.back /> Back
                            </Link>
                        )}
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'hsl(220 25% 14%)', margin: '0 0 0.15rem' }}>Edit Plan</h1>
                            <p style={{ fontSize: '0.8rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                                Updating <strong style={{ color: 'hsl(220 25% 25%)' }}>{plan.name}</strong>
                                {plan.subscribers_count > 0 && (
                                    <span style={{ marginLeft: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', fontWeight: '600', color: 'hsl(214 80% 46%)', backgroundColor: 'hsl(214 100% 95%)', padding: '0.12rem 0.5rem', borderRadius: '999px' }}>
                                        <Icons.users2 /> {plan.subscribers_count} subscriber{plan.subscribers_count !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Plan meta pill */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'hsl(220 15% 52%)', fontWeight: '500' }}>
                            Created {fmtDate(plan.created_at)}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.06em', color: plan.is_active ? 'hsl(152 55% 30%)' : 'hsl(220 15% 40%)', backgroundColor: plan.is_active ? 'hsl(152 55% 92%)' : 'hsl(220 15% 92%)', padding: '0.22rem 0.65rem', borderRadius: '999px' }}>
                            <span style={{ width: '0.38rem', height: '0.38rem', borderRadius: '50%', backgroundColor: plan.is_active ? 'hsl(152 55% 40%)' : 'hsl(220 15% 55%)' }} />
                            {plan.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                    </div>
                </div>

                {/* ── Two-column layout ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>

                    {/* ═══ LEFT: form card ═══════════════════════════════════ */}
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>

                        {/* Dark header */}
                        <div style={{ background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))', padding: '1.5rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.07) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {/* Live avatar */}
                                    <div style={{ width: '3rem', height: '3rem', borderRadius: '0.875rem', backgroundColor: initials ? `hsl(${hue} 50% 50%)` : 'hsl(220 25% 30%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: initials ? '0.9rem' : '1.1rem', fontWeight: '800', letterSpacing: '0.02em', transition: 'background-color 0.3s', border: '2px solid hsl(220 30% 30%)', boxShadow: '0 2px 12px hsl(220 28% 6% / 0.4)', flexShrink: 0 }}>
                                        {initials ?? <Icons.plan />}
                                    </div>
                                    <div>
                                        <h2 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: '800', color: 'white', letterSpacing: '-0.01em' }}>
                                            {data.name || 'Editing Plan'}
                                        </h2>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(220 20% 62%)' }}>
                                            {data.price ? `${data.currency}${data.price} / ${data.interval}` : 'No price set'}
                                            {isDirty && <span style={{ marginLeft: '0.5rem', color: 'hsl(40 85% 60%)', fontWeight: '600' }}>· Unsaved changes</span>}
                                        </p>
                                    </div>
                                </div>
                                {/* Plan ID badge */}
                                <span style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.07em', color: 'hsl(220 20% 55%)', backgroundColor: 'hsl(220 25% 25%)', padding: '0.25rem 0.6rem', borderRadius: '0.4rem' }}>
                                    PLAN #{plan.id}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', maxHeight: inline ? 'calc(90vh - 300px)' : 'none', overflow: inline ? 'auto' : 'visible' }}>

                                {/* ── Basic info ── */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', paddingBottom: '0.4rem', borderBottom: '1px solid hsl(220 15% 94%)' }}>Basic Information</p>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '0.875rem' }}>
                                        <FField label="Plan Name" required error={errors.name}>
                                            <PlanInput value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. Professional, Starter…" hasError={!!errors.name} />
                                        </FField>
                                        <FField label="Sort Order" hint="Lower = first">
                                            <PlanInput type="number" value={data.sort_order} onChange={e => setData('sort_order', Number(e.target.value))} placeholder="0" min="0" />
                                        </FField>
                                    </div>

                                    <FField label="Description" hint="Shown to users on the pricing page">
                                        <PlanTextarea
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            placeholder="e.g. Perfect for getting started…"
                                            rows={2}
                                        />
                                    </FField>

                                    <FField label="Slug" hint="URL-friendly identifier">
                                        <PlanInput value={data.slug} onChange={e => setData('slug', e.target.value)} placeholder="e.g. professional, starter…" error={errors.slug} hasError={!!errors.slug} />
                                    </FField>

                                    <Toggle value={data.is_active}   onChange={v => setData('is_active', v)}   label="Active"   sub="Visible to users" />
                                </div>

                                {/* ── Pricing ── */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', paddingBottom: '0.4rem', borderBottom: '1px solid hsl(220 15% 94%)' }}>Pricing & Billing</p>

                                    <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '0.875rem' }}>
                                        <FField label="Currency">
                                            <PlanSelect value={data.currency} onChange={e => setData('currency', e.target.value)} options={CURRENCIES} />
                                        </FField>
                                        <FField label="Price" required error={errors.price}>
                                            <PlanInput type="number" value={data.price} onChange={e => setData('price', e.target.value)} placeholder="0.00" min="0" step="0.01" hasError={!!errors.price} />
                                        </FField>
                                    </div>

                                    {/* Billing cycle card selector */}
                                    <FField label="Billing Interval">
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.45rem' }}>
                                            {CYCLES.map(c => {
                                                const active = data.interval === c.value;
                                                return (
                                                    <button type="button" key={c.value} onClick={() => setData('interval', c.value)}
                                                        style={{ padding: '0.6rem 0.4rem', borderRadius: '0.65rem', border: `1.5px solid ${active ? 'hsl(220 60% 55%)' : 'hsl(220 15% 88%)'}`, backgroundColor: active ? 'hsl(214 100% 97%)' : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', fontFamily: 'inherit', boxShadow: active ? '0 0 0 3px hsl(220 60% 55% / 0.11)' : 'none' }}>
                                                        <div style={{ fontSize: '0.7rem', fontWeight: '800', color: active ? 'hsl(214 80% 44%)' : 'hsl(220 25% 22%)', marginBottom: '0.15rem' }}>{c.label}</div>
                                                        <div style={{ fontSize: '0.6rem', color: active ? 'hsl(214 80% 56%)' : 'hsl(220 15% 55%)' }}>{c.sub.split(' ').slice(0, 2).join(' ')}</div>
                                                        {active && <div style={{ marginTop: '0.3rem', display: 'flex', justifyContent: 'center', color: 'hsl(214 80% 48%)' }}><Icons.check /></div>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </FField>
                                </div>

                                {/* ── Usage limits ── */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', paddingBottom: '0.4rem', borderBottom: '1px solid hsl(220 15% 94%)' }}>Usage Limits</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                        <FField label="Listing Limit" hint="Blank = unlimited">
                                            <PlanInput type="number" value={data.listing_limit} onChange={e => setData('listing_limit', e.target.value)} placeholder="Unlimited" min="0" />
                                        </FField>
                                        <FField label="Rental Limit" hint="Blank = unlimited">
                                            <PlanInput type="number" value={data.rental_limit} onChange={e => setData('rental_limit', e.target.value)} placeholder="Unlimited" min="0" />
                                        </FField>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                        <FField label="Sale Limit" hint="Blank = unlimited">
                                            <PlanInput type="number" value={data.sale_limit} onChange={e => setData('sale_limit', e.target.value)} placeholder="Unlimited" min="0" />
                                        </FField>
                                        <FField label="Boost Limit" hint="Blank = unlimited">
                                            <PlanInput type="number" value={data.boost_limit} onChange={e => setData('boost_limit', e.target.value)} placeholder="Unlimited" min="0" />
                                        </FField>
                                    </div>
                                    <FField label="Lead Limit" hint="Blank = unlimited">
                                        <PlanInput type="number" value={data.lead_limit} onChange={e => setData('lead_limit', e.target.value)} placeholder="Unlimited" min="0" />
                                    </FField>
                                </div>

                                {/* ── Plan Features ── */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', paddingBottom: '0.4rem', borderBottom: '1px solid hsl(220 15% 94%)' }}>Plan Features</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        <Toggle value={data.verified_badge}   onChange={v => setData('verified_badge', v)}   label="Verified Badge"   sub="Show verification mark on listings" />
                                        <Toggle value={data.priority_ranking}   onChange={v => setData('priority_ranking', v)}   label="Priority Ranking"   sub="Better visibility in search results" />
                                        <Toggle value={data.analytics_access}   onChange={v => setData('analytics_access', v)}   label="Analytics Access"   sub="View detailed listing analytics" />
                                    </div>
                                </div>

                                <FField label="Feature Bullet Points" hint="Shown as a checklist on the pricing page">
                                    {data.features.map((f, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                            <PlanInput
                                                value={f}
                                                onChange={e => {
                                                    const updated = [...data.features];
                                                    updated[i] = e.target.value;
                                                    setData('features', updated);
                                                }}
                                                placeholder={`Feature ${i + 1}`}
                                            />
                                            <button type="button" onClick={() => setData('features', data.features.filter((_, j) => j !== i))}
                                                style={{ padding: '0 0.65rem', borderRadius: '0.55rem', border: '1px solid hsl(0 65% 88%)', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 48%)', cursor: 'pointer' }}>
                                                <Icons.x />
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => setData('features', [...data.features, ''])}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.875rem', borderRadius: '0.55rem', border: '1px dashed hsl(220 15% 82%)', backgroundColor: 'transparent', color: 'hsl(220 15% 48%)', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                                        <Icons.plus /> Add Feature
                                    </button>
                                </FField>

                                {/* ── Payment Gateway Codes ── */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', paddingBottom: '0.4rem', borderBottom: '1px solid hsl(220 15% 94%)' }}>Payment Gateway Integration</p>
                                    <FField label="Paystack Plan Code" hint="E.g., PLN_xxxxx">
                                        <PlanInput value={data.paystack_plan_code} onChange={e => setData('paystack_plan_code', e.target.value)} placeholder="Leave blank if not using Paystack" />
                                    </FField>
                                    <FField label="Flutterwave Plan ID" hint="E.g., xxxxx">
                                        <PlanInput value={data.flutterwave_plan_id} onChange={e => setData('flutterwave_plan_id', e.target.value)} placeholder="Leave blank if not using Flutterwave" />
                                    </FField>
                                </div>
                            </div>

                            {/* ── Footer ── */}
                            <div style={{ padding: '1rem 1.75rem 1.5rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', gap: '0.65rem' }}>
                                {inline ? (
                                    <button type="button" onClick={() => onClose?.()}
                                        style={{ flex: 1, padding: '0.65rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>
                                        Cancel
                                    </button>
                                ) : (
                                    <Link href="/super-admin/plans"
                                        style={{ flex: 1, padding: '0.65rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 30%)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                                        Cancel
                                    </Link>
                                )}
                                <button type="submit" disabled={processing}
                                    style={{ flex: 2, padding: '0.65rem', borderRadius: '0.65rem', border: 'none', backgroundColor: processing ? 'hsl(220 25% 38%)' : isDirty ? 'hsl(220 25% 15%)' : 'hsl(220 15% 60%)', color: 'white', fontSize: '0.875rem', fontWeight: '700', cursor: processing || !isDirty ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'background-color 0.15s' }}
                                    onMouseEnter={e => { if (!processing && isDirty) e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'; }}
                                    onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = isDirty ? 'hsl(220 25% 15%)' : 'hsl(220 15% 60%)'; }}>
                                    {processing ? <><Icons.spinner /> Saving…</> : isDirty ? <><Icons.save /> Save Changes</> : <><Icons.check /> Up to date</>}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ═══ RIGHT: sticky sidebar ════════════════════════════ */}
                    <div style={{ position: 'sticky', top: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* Live preview */}
                        <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)' }}>Live Preview</p>
                        <PreviewCard data={data} />

                        {/* Plan stats */}
                        {(plan.subscribers_count !== undefined || plan.created_at) && (
                            <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                                <p style={{ margin: '0 0 0.75rem', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)' }}>Plan Stats</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {[
                                        { label: 'Subscribers',  value: (plan.subscribers_count ?? 0).toLocaleString() },
                                        { label: 'Plan ID',      value: `#${plan.id}` },
                                        { label: 'Created',      value: fmtDate(plan.created_at) },
                                        { label: 'Last updated', value: fmtDate(plan.updated_at) },
                                    ].map(({ label, value }) => (
                                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'hsl(220 15% 52%)' }}>{label}</span>
                                            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'hsl(220 25% 22%)' }}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Danger zone */}
                        <div style={{ backgroundColor: 'white', border: '1.5px solid hsl(0 65% 90%)', borderRadius: '0.75rem', overflow: 'hidden' }}>
                            <div style={{ padding: '0.65rem 1rem', backgroundColor: 'hsl(0 65% 97%)', borderBottom: '1px solid hsl(0 65% 90%)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <span style={{ color: 'hsl(0 65% 50%)', display: 'flex' }}><Icons.alert /></span>
                                <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(0 55% 42%)' }}>Danger Zone</p>
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <p style={{ margin: '0 0 0.75rem', fontSize: '0.78rem', color: 'hsl(220 15% 40%)', lineHeight: 1.5 }}>
                                    Permanently delete this plan. Active subscribers won't be cancelled but no new subscriptions can be created.
                                </p>
                                <button type="button" onClick={() => setShowDelete(true)}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '0.55rem', border: '1.5px solid hsl(0 65% 80%)', backgroundColor: 'white', color: 'hsl(0 62% 46%)', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit', transition: 'all 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsl(0 65% 97%)'; e.currentTarget.style.borderColor = 'hsl(0 65% 68%)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = 'hsl(0 65% 80%)'; }}>
                                    <Icons.trash /> Delete Plan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes planEditSpin    { to { transform: rotate(360deg); } }
                @keyframes planEditSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes planEditModalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
            `}</style>
        </>
    );
};

PlanEdit.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default PlanEdit;