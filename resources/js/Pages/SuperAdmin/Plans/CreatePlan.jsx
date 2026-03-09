import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ── Icons ─────────────────────────────────────────────────────────────────────

const BackIcon = () => (
    <svg style={{ width: '0.9rem', height: '0.9rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const PlusIcon = () => (
    <svg style={{ width: '0.9rem', height: '0.9rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const TrashIcon = () => (
    <svg style={{ width: '0.8rem', height: '0.8rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CheckIcon = () => (
    <svg style={{ width: '0.85rem', height: '0.85rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
);

const SpinnerIcon = () => (
    <svg style={{ width: '1rem', height: '1rem', animation: 'spin 0.8s linear infinite' }} fill="none" viewBox="0 0 24 24">
        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
);

const TrendingUpIcon = () => (
    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

// ── Shared field styles ───────────────────────────────────────────────────────

const inputBase = {
    width: '100%',
    padding: '0.6rem 0.875rem',
    border: '1.5px solid hsl(220 15% 88%)',
    borderRadius: '0.6rem',
    fontSize: '0.875rem',
    color: 'hsl(220 25% 18%)',
    backgroundColor: 'white',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    fontFamily: 'inherit',
};

const InputField = ({ label, hint, error, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {label && (
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'hsl(220 25% 22%)', letterSpacing: '0.01em' }}>
                {label}
            </label>
        )}
        {children}
        {hint && !error && <p style={{ fontSize: '0.72rem', color: 'hsl(220 15% 55%)', margin: 0 }}>{hint}</p>}
        {error && <p style={{ fontSize: '0.72rem', color: 'hsl(0 65% 50%)', margin: 0 }}>{error}</p>}
    </div>
);

const useFocusStyle = () => {
    const [focused, setFocused] = useState(false);
    const focusProps = {
        onFocus: () => setFocused(true),
        onBlur:  () => setFocused(false),
    };
    const style = {
        ...inputBase,
        borderColor: focused ? 'hsl(214 80% 55%)' : 'hsl(220 15% 88%)',
        boxShadow:   focused ? '0 0 0 3px hsl(214 80% 55% / 0.12)' : 'none',
    };
    return { focusProps, style };
};

// ── Toggle ────────────────────────────────────────────────────────────────────

const Toggle = ({ checked, onChange }) => (
    <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
            width: '2.75rem', height: '1.5rem', borderRadius: '999px', border: 'none',
            cursor: 'pointer', flexShrink: 0, position: 'relative',
            backgroundColor: checked ? 'hsl(152 60% 38%)' : 'hsl(220 15% 80%)',
            transition: 'background-color 0.2s',
        }}
    >
        <span style={{
            position: 'absolute', top: '0.15rem',
            left: checked ? 'calc(100% - 1.2rem)' : '0.15rem',
            width: '1.2rem', height: '1.2rem', borderRadius: '50%',
            backgroundColor: 'white', transition: 'left 0.2s',
            boxShadow: '0 1px 3px hsl(220 25% 15% / 0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            {checked && <span style={{ color: 'hsl(152 60% 38%)', display: 'flex' }}><CheckIcon /></span>}
        </span>
    </button>
);

// ── Live preview card ─────────────────────────────────────────────────────────

const PreviewCard = ({ data }) => {
    const price = data.price ? `${data.currency || '$'}${data.price}` : '—';
    const cycle = data.billing_cycle || 'month';

    return (
        <div style={{
            backgroundColor: 'white',
            border: '1.5px solid hsl(214 80% 72%)',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 8px 24px hsl(214 80% 50% / 0.12)',
        }}>
            <div style={{ height: '4px', background: 'linear-gradient(90deg, hsl(214 80% 50%), hsl(240 70% 60%))' }} />
            <div style={{ padding: '1.5rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                            <span style={{ fontSize: '0.62rem', fontWeight: '700', letterSpacing: '0.09em', color: 'hsl(214 80% 48%)', backgroundColor: 'hsl(214 100% 95%)', padding: '0.15rem 0.5rem', borderRadius: '0.25rem' }}>
                                PREVIEW
                            </span>
                            {data.is_active && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.62rem', fontWeight: '700', color: 'hsl(152 60% 32%)', backgroundColor: 'hsl(152 60% 93%)', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                                    <span style={{ width: '0.38rem', height: '0.38rem', borderRadius: '50%', backgroundColor: 'hsl(152 60% 38%)' }} />
                                    ACTIVE
                                </span>
                            )}
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'hsl(220 25% 15%)', margin: 0 }}>
                            {data.name || <span style={{ color: 'hsl(220 15% 65%)' }}>Plan Name</span>}
                        </h3>
                        {data.description && (
                            <p style={{ fontSize: '0.78rem', color: 'hsl(220 15% 52%)', margin: '0.3rem 0 0', lineHeight: 1.45 }}>
                                {data.description}
                            </p>
                        )}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'hsl(214 80% 48%)', lineHeight: 1 }}>
                            {price}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 55%)', marginTop: '0.2rem' }}>
                            / {cycle}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: 0, borderTop: '1px solid hsl(220 15% 94%)', borderBottom: '1px solid hsl(220 15% 94%)', margin: '0 -1.5rem' }}>
                    {[
                        { label: 'Max Listings', value: data.max_listings || '∞' },
                        { label: 'Max Agents',   value: data.max_agents   || '∞' },
                        { label: 'Trial Days',   value: data.trial_days   || '0' },
                    ].map((stat, i, arr) => (
                        <div key={i} style={{ flex: 1, padding: '0.75rem 0', textAlign: 'center', borderRight: i < arr.length - 1 ? '1px solid hsl(220 15% 94%)' : 'none' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'hsl(220 25% 15%)' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.62rem', color: 'hsl(220 15% 55%)', marginTop: '0.1rem', letterSpacing: '0.03em' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Features */}
                {data.features.filter(f => f.trim()).length > 0 ? (
                    <ul style={{ listStyle: 'none', margin: '1rem 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {data.features.filter(f => f.trim()).map((f, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'hsl(220 15% 35%)' }}>
                                <span style={{ color: 'hsl(214 80% 48%)', flexShrink: 0 }}><CheckIcon /></span>
                                {f}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ fontSize: '0.75rem', color: 'hsl(220 15% 65%)', margin: '1rem 0 0', fontStyle: 'italic' }}>
                        Add features to see them here…
                    </p>
                )}
            </div>
        </div>
    );
};

// ── Section wrapper ───────────────────────────────────────────────────────────

const Section = ({ title, subtitle, children }) => (
    <div style={{
        backgroundColor: 'white',
        border: '1px solid hsl(220 15% 91%)',
        borderRadius: '0.875rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px hsl(220 20% 15% / 0.05)',
    }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid hsl(220 15% 94%)', backgroundColor: 'hsl(220 15% 98.5%)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'hsl(220 25% 15%)', margin: 0 }}>{title}</h3>
            {subtitle && <p style={{ fontSize: '0.75rem', color: 'hsl(220 15% 55%)', margin: '0.15rem 0 0' }}>{subtitle}</p>}
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {children}
        </div>
    </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────

const PlanCreate = ({ inline = false, onClose } = {}) => {
    const { data, setData, post, processing, errors } = useForm({
        name:            '',
        description:     '',
        price:           '',
        currency:        '$',
        billing_cycle:   'month',
        trial_days:      0,
        max_listings:    '',
        max_agents:      '',
        sort_order:      0,
        is_active:       true,
        is_featured:     false,
        features:        [''],
    });

    const [featureInput, setFeatureInput] = useState('');

    const set = (field) => (e) => setData(field, e.target.value ?? e);

    const addFeature = () => {
        setData('features', [...data.features, '']);
    };

    const updateFeature = (i, val) => {
        const updated = [...data.features];
        updated[i] = val;
        setData('features', updated);
    };

    const removeFeature = (i) => {
        setData('features', data.features.filter((_, idx) => idx !== i));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/super-admin/plans', {
            onSuccess: () => {
                if (onClose) onClose();
            },
        });
    };

    const Field = ({ style: extraStyle, value, onChange, placeholder, type = 'text', ...rest }) => {
        const { focusProps, style } = useFocusStyle();
        return (
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{ ...style, ...extraStyle }}
                {...focusProps}
                {...rest}
            />
        );
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {inline ? (
                        <button
                            type="button"
                            onClick={() => onClose && onClose()}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                padding: '0.45rem 0.75rem', borderRadius: '0.5rem',
                                border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                                color: 'hsl(220 25% 35%)', fontSize: '0.8rem', fontWeight: '600',
                                textDecoration: 'none', transition: 'background-color 0.15s',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <BackIcon /> Close
                        </button>
                    ) : (
                        <Link
                            href="/super-admin/plans"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                padding: '0.45rem 0.75rem', borderRadius: '0.5rem',
                                border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                                color: 'hsl(220 25% 35%)', fontSize: '0.8rem', fontWeight: '600',
                                textDecoration: 'none', transition: 'background-color 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <BackIcon /> Back
                        </Link>
                    )}
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'hsl(220 25% 15%)', margin: '0 0 0.15rem' }}>
                            New Plan
                        </h1>
                        <p style={{ fontSize: '0.8rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                            Configure a new subscription plan for your platform
                        </p>
                    </div>
                </div>
            </div>

            {/* Preview sits on top in redesigned layout */}
            <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.08em', color: 'hsl(220 15% 50%)', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
                    Live Preview
                </p>
                <PreviewCard data={data} />
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* form sections stacked vertically */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Basic Info */}
                        <Section title="Basic Information" subtitle="Name, description and visibility">
                            <InputField label="Plan Name" error={errors.name}>
                                <PlanTextField
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="e.g. Professional, Starter, Enterprise…"
                                    hasError={!!errors.name}
                                />
                            </InputField>

                            <InputField label="Description" hint="Optional — shown on plan cards and pricing pages">
                                <PlanTextarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="A short description of what this plan includes…"
                                    rows={3}
                                />
                            </InputField>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <InputField label="Sort Order" hint="Lower = shown first">
                                    <PlanTextField
                                        type="number"
                                        value={data.sort_order}
                                        onChange={e => setData('sort_order', Number(e.target.value))}
                                        placeholder="0"
                                        min="0"
                                    />
                                </InputField>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'hsl(220 25% 22%)' }}>Status</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: '0.75rem', border: '1.5px solid hsl(220 15% 88%)', borderRadius: '0.6rem', backgroundColor: 'hsl(220 15% 98.5%)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'hsl(220 25% 30%)' }}>Active</span>
                                            <Toggle checked={data.is_active} onChange={v => setData('is_active', v)} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'hsl(220 25% 30%)' }}>Featured</span>
                                            <Toggle checked={data.is_featured} onChange={v => setData('is_featured', v)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Pricing */}
                        <Section title="Pricing & Billing" subtitle="Set the price and billing cycle">
                            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '1rem' }}>
                                <InputField label="Currency">
                                    <PlanSelect
                                        value={data.currency}
                                        onChange={e => setData('currency', e.target.value)}
                                        options={[
                                            { value: '$', label: '$ USD' },
                                            { value: '£', label: '£ GBP' },
                                            { value: '€', label: '€ EUR' },
                                            { value: '₦', label: '₦ NGN' },
                                            { value: 'GH₵', label: 'GH₵ GHS' },
                                            { value: 'KSh', label: 'KSh KES' },
                                        ]}
                                    />
                                </InputField>
                                <InputField label="Price" error={errors.price}>
                                    <PlanTextField
                                        type="number"
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        hasError={!!errors.price}
                                    />
                                </InputField>
                                <InputField label="Billing Cycle">
                                    <PlanSelect
                                        value={data.billing_cycle}
                                        onChange={e => setData('billing_cycle', e.target.value)}
                                        options={[
                                            { value: 'month',  label: 'Monthly' },
                                            { value: 'quarter',label: 'Quarterly' },
                                            { value: 'year',   label: 'Yearly' },
                                            { value: 'week',   label: 'Weekly' },
                                            { value: 'once',   label: 'One-time' },
                                        ]}
                                    />
                                </InputField>
                            </div>

                            <InputField label="Free Trial Days" hint="Set to 0 to disable free trial">
                                <PlanTextField
                                    type="number"
                                    value={data.trial_days}
                                    onChange={e => setData('trial_days', Number(e.target.value))}
                                    placeholder="0"
                                    min="0"
                                />
                            </InputField>
                        </Section>

                        {/* Limits */}
                        <Section title="Usage Limits" subtitle="Leave blank for unlimited">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <InputField label="Max Listings" hint="Blank = unlimited">
                                    <PlanTextField
                                        type="number"
                                        value={data.max_listings}
                                        onChange={e => setData('max_listings', e.target.value)}
                                        placeholder="Unlimited"
                                        min="0"
                                    />
                                </InputField>
                                <InputField label="Max Agents" hint="Blank = unlimited">
                                    <PlanTextField
                                        type="number"
                                        value={data.max_agents}
                                        onChange={e => setData('max_agents', e.target.value)}
                                        placeholder="Unlimited"
                                        min="0"
                                    />
                                </InputField>
                            </div>
                        </Section>

                        {/* Features */}
                        <Section title="Features" subtitle="Bullet points shown on the plan card">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {data.features.map((feature, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ color: 'hsl(214 80% 52%)', flexShrink: 0 }}><CheckIcon /></span>
                                        <PlanTextField
                                            value={feature}
                                            onChange={e => updateFeature(i, e.target.value)}
                                            placeholder={`Feature ${i + 1}…`}
                                            style={{ flex: 1 }}
                                        />
                                        {data.features.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeFeature(i)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    width: '1.75rem', height: '1.75rem', borderRadius: '0.4rem',
                                                    border: 'none', cursor: 'pointer', flexShrink: 0,
                                                    backgroundColor: 'hsl(0 70% 96%)', color: 'hsl(0 65% 50%)',
                                                    transition: 'filter 0.15s',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.92)'}
                                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                                            >
                                                <TrashIcon />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addFeature}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                    padding: '0.45rem 0.875rem', borderRadius: '0.5rem',
                                    border: '1.5px dashed hsl(214 60% 75%)',
                                    backgroundColor: 'hsl(214 100% 98%)', color: 'hsl(214 80% 48%)',
                                    fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer',
                                    transition: 'all 0.15s', alignSelf: 'flex-start',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(214 80% 55%)'; e.currentTarget.style.backgroundColor = 'hsl(214 100% 95%)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(214 60% 75%)'; e.currentTarget.style.backgroundColor = 'hsl(214 100% 98%)'; }}
                            >
                                <PlusIcon /> Add Feature
                            </button>
                        </Section>
                    </div>

                    {/* Submit panel moved below sections */}
                    <div style={{
                        backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)',
                        borderRadius: '0.875rem', padding: '1.25rem',
                        boxShadow: '0 1px 3px hsl(220 20% 15% / 0.05)',
                        marginTop: '1rem',
                    }}>
                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    width: '100%', padding: '0.75rem', borderRadius: '0.65rem', border: 'none',
                                    backgroundColor: processing ? 'hsl(220 25% 40%)' : 'hsl(220 25% 15%)',
                                    color: 'white', fontWeight: '700', fontSize: '0.9rem',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    transition: 'background-color 0.15s',
                                }}
                                onMouseEnter={e => { if (!processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'; }}
                                onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'; }}
                            >
                                {processing ? <><SpinnerIcon /> Creating…</> : <><TrendingUpIcon /> Create Plan</>}
                            </button>

                            <Link
                                href="/super-admin/plans"
                                style={{
                                    display: 'block', textAlign: 'center', marginTop: '0.75rem',
                                    padding: '0.6rem', borderRadius: '0.6rem',
                                    border: '1px solid hsl(220 15% 88%)', backgroundColor: 'transparent',
                                    color: 'hsl(220 25% 45%)', fontSize: '0.82rem', fontWeight: '600',
                                    textDecoration: 'none', transition: 'background-color 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                Cancel
                            </Link>

                            <p style={{ fontSize: '0.7rem', color: 'hsl(220 15% 60%)', textAlign: 'center', margin: '0.75rem 0 0', lineHeight: 1.4 }}>
                                The plan will be visible to admins immediately after creation.
                            </p>
                        </div>
                    </div>
                </form>

            {/* inject spinner keyframes without confusing JSX parser */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
@keyframes spin { to { transform: rotate(360deg); } }
                    `,
                }}
            />
            </div>
    );
};

// ── Reusable field sub-components (defined outside to avoid re-mounting) ───────

const PlanTextField = ({ hasError, style: extraStyle, ...props }) => {
    const [focused, setFocused] = useState(false);
    return (
        <input
            {...props}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
                ...inputBase,
                ...extraStyle,
                borderColor: hasError ? 'hsl(0 65% 55%)' : focused ? 'hsl(214 80% 55%)' : 'hsl(220 15% 88%)',
                boxShadow: hasError
                    ? '0 0 0 3px hsl(0 65% 55% / 0.1)'
                    : focused ? '0 0 0 3px hsl(214 80% 55% / 0.12)' : 'none',
            }}
        />
    );
};

const PlanTextarea = ({ ...props }) => {
    const [focused, setFocused] = useState(false);
    return (
        <textarea
            {...props}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
                ...inputBase,
                resize: 'vertical',
                borderColor: focused ? 'hsl(214 80% 55%)' : 'hsl(220 15% 88%)',
                boxShadow: focused ? '0 0 0 3px hsl(214 80% 55% / 0.12)' : 'none',
            }}
        />
    );
};

const PlanSelect = ({ value, onChange, options }) => {
    const [focused, setFocused] = useState(false);
    return (
        <select
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
                ...inputBase,
                cursor: 'pointer',
                borderColor: focused ? 'hsl(214 80% 55%)' : 'hsl(220 15% 88%)',
                boxShadow: focused ? '0 0 0 3px hsl(214 80% 55% / 0.12)' : 'none',
            }}
        >
            {options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
    );
};

// keep the layout only for full‑page usage; inline embeds pass the `inline` prop
if (!PlanCreate.inline) {
    PlanCreate.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
}

export default PlanCreate;