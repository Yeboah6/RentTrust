import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
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
    plan:     () => <Ico d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" size="1.25rem" />,
    tag:      () => <Ico d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" size="1.1rem" />,
    users:    () => <Ico d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" size="1.1rem" />,
    clock:    () => <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size="1.1rem" />,
    currency: () => <Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size="1.1rem" />,
    trending: () => <Ico d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" size="1rem" />,
    spinner:  () => (
        <svg style={{ width: '1rem', height: '1rem', animation: 'planSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

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

const FField = ({ label, required, hint, error, col, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32rem', gridColumn: col }}>
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

// ─── Section card ─────────────────────────────────────────────────────────────

const Section = ({ title, subtitle, children, grid }) => (
    <div style={{ backgroundColor: 'red', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', overflow: 'hidden', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
        <div style={{ padding: '0.875rem 1.375rem', borderBottom: '1px solid hsl(220 15% 94%)', backgroundColor: 'hsl(220 15% 98.5%)' }}>
            <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: '700', color: 'hsl(220 25% 18%)', letterSpacing: '-0.01em' }}>{title}</p>
            {subtitle && <p style={{ margin: '0.1rem 0 0', fontSize: '0.7rem', color: 'hsl(220 15% 52%)' }}>{subtitle}</p>}
        </div>
        <div style={{ padding: '1.25rem 1.375rem', display: grid ? 'grid' : 'flex', ...(grid ? { gridTemplateColumns: grid, gap: '1rem' } : { flexDirection: 'column', gap: '1rem' }) }}>
            {children}
        </div>
    </div>
);

// ─── Billing cycle cards ──────────────────────────────────────────────────────

const CYCLES = [
    { value: 'month',   label: 'Monthly',   sub: 'Billed every month' },
    { value: 'year',    label: 'Yearly',    sub: 'Best for retention' },
    { value: 'quarter', label: 'Quarterly', sub: 'Every 3 months' },
    { value: 'week',    label: 'Weekly',    sub: 'Short-term access' },
    { value: 'once',    label: 'One-time',  sub: 'Single payment' },
];

const CURRENCIES = [
    { value: 'GH₵', label: 'GH₵ GHS' },
    { value: '$',   label: '$ USD' },
    { value: '£',   label: '£ GBP' },
    { value: '€',   label: '€ EUR' },
    { value: '₦',   label: '₦ NGN' },
];

// ─── Live preview card ────────────────────────────────────────────────────────

const PreviewCard = ({ data }) => {
    const price   = data.price ? `${data.currency}${Number(data.price).toLocaleString()}` : '—';
    const cycle   = CYCLES.find(c => c.value === data.interval)?.label ?? data.interval;
    const hue     = [...(data.name || 'Plan')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    const initials= (data.name || '?').slice(0, 2).toUpperCase();

    return (
        <div style={{ backgroundColor: 'white', border: '1.5px solid hsl(220 15% 88%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 20px hsl(220 25% 12% / 0.08)' }}>
            {/* Colour bar */}
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

                {/* Stats row */}
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
                    {(data.priority_ranking || data.analytics_access) ? (
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.38rem' }}>
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

                {/* Status pill */}
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

// ─── Main ─────────────────────────────────────────────────────────────────────

const PlanCreate = ({ inline = false, onClose } = {}) => {
    const { data, setData, post, processing, errors } = useForm({
        name:               '',
        description:        '',
        slug:               '',
        price:              '',
        currency:           'GHS',
        interval:           'month',
        listing_limit:      '',
        rental_limit:       '',
        sale_limit:         '',
        priority_ranking:   false,
        analytics_access:   false,
        is_active:          true,
        sort_order:         0,
        features: [],
    });



    const handleSubmit = (e) => {
        e.preventDefault();
        post('/super-admin/plans', { onSuccess: () => onClose?.() });
    };

    // live avatar colour from plan name
    const hue      = [...(data.name || 'Plan')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    const initials = data.name ? data.name.slice(0, 2).toUpperCase() : null;

    return (
        <div>
            {/* ── Page header ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', padding: '1rem 1.25rem', borderRadius: '0.75rem', border: '1px solid hsl(220 15% 88%)' }}>
                {inline ? (
                    <button type="button" onClick={() => onClose?.()}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                        <Icons.back /> Close
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
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'hsl(220 25% 14%)', margin: '0 0 0.15rem' }}>New Plan</h1>
                    <p style={{ fontSize: '0.8rem', color: 'hsl(220 15% 50%)', margin: 0 }}>Configure a new subscription plan for your platform</p>
                </div>
            </div>

            {/* ── Two-column layout: form (left) + sticky preview (right) ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>

                {/* ═══ LEFT: form card ═══════════════════════════════════════ */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>

                    {/* Dark header — mirrors AddAdminModal */}
                    <div style={{ background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))', padding: '1.5rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.07) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {/* Live plan avatar */}
                            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.875rem', backgroundColor: initials ? `hsl(${hue} 50% 50%)` : 'hsl(220 25% 30%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: initials ? '0.9rem' : '1.1rem', fontWeight: '800', letterSpacing: '0.02em', transition: 'background-color 0.3s', border: '2px solid hsl(220 30% 30%)', boxShadow: '0 2px 12px hsl(220 28% 6% / 0.4)', flexShrink: 0 }}>
                                {initials ?? <Icons.plan />}
                            </div>
                            <div>
                                <h2 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: '800', color: 'white', letterSpacing: '-0.01em' }}>
                                    {data.name || 'New Subscription Plan'}
                                </h2>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(220 20% 62%)' }}>
                                    {data.price ? `${data.currency}${data.price} / ${data.interval}` : 'Set pricing and features below'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

                            {/* ── Basic info ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', paddingBottom: '0.4rem', borderBottom: '1px solid hsl(220 15% 94%)' }}>Basic Information</p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '0.875rem' }}>
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

                                <FField label="URL Slug" hint="Auto-generated from name if empty">
                                    <PlanInput value={data.slug} onChange={e => setData('slug', e.target.value)} placeholder="professional, starter…" />
                                </FField>

                                {/* Active toggle */}
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

                                {/* Billing cycle — card selector style matching role cards in AddAdminModal */}
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
                                    <FField label="Listing Limit" hint="Blank = unlimited">
                                        <PlanInput type="number" value={data.listing_limit} onChange={e => setData('listing_limit', e.target.value)} placeholder="Unlimited" min="0" />
                                    </FField>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                    <FField label="Sale Limit" hint="Blank = unlimited">
                                        <PlanInput type="number" value={data.sale_limit} onChange={e => setData('sale_limit', e.target.value)} placeholder="Unlimited" min="0" />
                                    </FField>
                                    <FField label="Rental Limit" hint="Blank = unlimited">
                                        <PlanInput type="number" value={data.rental_limit} onChange={e => setData('rental_limit', e.target.value)} placeholder="Unlimited" min="0" />
                                    </FField>
                                </div>
                            </div>

                            {/* ── Plan Features ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', paddingBottom: '0.4rem', borderBottom: '1px solid hsl(220 15% 94%)' }}>Plan Features</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
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
                                style={{ flex: 2, padding: '0.65rem', borderRadius: '0.65rem', border: 'none', backgroundColor: processing ? 'hsl(220 25% 38%)' : 'hsl(220 25% 15%)', color: 'white', fontSize: '0.875rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'background-color 0.15s' }}
                                onMouseEnter={e => { if (!processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'; }}
                                onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = processing ? 'hsl(220 25% 38%)' : 'hsl(220 25% 15%)'; }}>
                                {processing ? <><Icons.spinner /> Creating Plan…</> : <><Icons.trending /> Create Plan</>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ═══ RIGHT: sticky preview ════════════════════════════════ */}
                <div style={{ position: 'sticky', top: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)' }}>Live Preview</p>
                    <PreviewCard data={data} />

                    {/* Quick tips */}
                    <div style={{ backgroundColor: 'hsl(214 100% 98%)', border: '1px solid hsl(214 80% 90%)', borderRadius: '0.75rem', padding: '1rem' }}>
                        <p style={{ margin: '0 0 0.6rem', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(214 80% 46%)' }}>Tips</p>
                        {[
                            'Leave usage limits blank to allow unlimited access.',
                            'Priority ranking improves visibility in search results.',
                            'Payment gateway codes are required for Paystack/Flutterwave.',
                        ].map((tip, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: i > 0 ? '0.5rem' : 0 }}>
                                <span style={{ color: 'hsl(214 80% 52%)', flexShrink: 0, marginTop: '0.05rem', display: 'flex' }}><Icons.check /></span>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(214 50% 35%)', lineHeight: 1.5 }}>{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`@keyframes planSpin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

PlanCreate.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default PlanCreate;