import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = ({ d, size = '1rem', sw = 1.9 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    back:    () => <Ico d="M15 19l-7-7 7-7" size="0.9rem" />,
    plus:    () => <Ico d="M12 4v16m8-8H4" />,
    check:   () => <Ico d="M5 13l4 4L19 7" size="0.82rem" />,
    x:       () => <Ico d="M6 18L18 6M6 6l12 12" />,
    home:    () => <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" size="1.15rem" />,
    tag:     () => <Ico d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />,
    pin:     () => <Ico d={["M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z","M15 11a3 3 0 11-6 0 3 3 0 016 0z"]} />,
    currency:() => <Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size="1.1rem" />,
    spinner: () => (
        <svg style={{ width: '1rem', height: '1rem', animation: 'lcSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Config ───────────────────────────────────────────────────────────────────

const LISTING_TYPES = [
    { value: 'sale',  label: 'For Sale',  sub: 'Outright purchase' },
    { value: 'rent',  label: 'For Rent',  sub: 'Monthly / yearly' },
    { value: 'short', label: 'Short Let', sub: 'Days / weeks' },
    { value: 'lease', label: 'Lease',     sub: 'Long-term lease' },
];

// const PROPERTY_TYPES = [
//     'Apartment', 'House', 'Land', 'Commercial', 'Office',
//     'Shop', 'Warehouse', 'Villa', 'Studio', 'Duplex', 'Bungalow', 'Mansion',
// ];

const CURRENCIES = [
    { value: 'GH₵', label: 'GH₵ GHS' },
    { value: '$',   label: '$ USD' },
    { value: '£',   label: '£ GBP' },
    { value: '€',   label: '€ EUR' },
    { value: '₦',   label: '₦ NGN' },
];

const INITIAL_STATUSES = ['active', 'pending', 'draft'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const avatarHue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

// ─── Field atoms ──────────────────────────────────────────────────────────────

const inputStyle = (focused, hasError) => ({
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

const FInput = ({ hasError, ...props }) => {
    const [f, setF] = useState(false);
    return <input {...props} onFocus={() => setF(true)} onBlur={() => setF(false)} style={inputStyle(f, hasError)} />;
};

const FTextarea = ({ rows = 4, hasError, ...props }) => {
    const [f, setF] = useState(false);
    return <textarea {...props} rows={rows} onFocus={() => setF(true)} onBlur={() => setF(false)} style={{ ...inputStyle(f, hasError), resize: 'vertical' }} />;
};

const FSelect = ({ hasError, children, ...props }) => {
    const [f, setF] = useState(false);
    return <select {...props} onFocus={() => setF(true)} onBlur={() => setF(false)} style={{ ...inputStyle(f, hasError), cursor: 'pointer', appearance: 'none' }}>{children}</select>;
};

const Toggle = ({ value, onChange, label, sub }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 0.875rem', borderRadius: '0.6rem', backgroundColor: 'hsl(220 15% 97.5%)', border: '1px solid hsl(220 15% 91%)' }}>
        <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'hsl(220 25% 20%)' }}>{label}</div>
            {sub && <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 52%)', marginTop: '0.08rem' }}>{sub}</div>}
        </div>
        <button type="button" onClick={() => onChange(!value)}
            style={{ width: '2.75rem', height: '1.5rem', borderRadius: '999px', border: 'none', cursor: 'pointer', flexShrink: 0, position: 'relative', backgroundColor: value ? 'hsl(152 55% 38%)' : 'hsl(220 15% 80%)', transition: 'background-color 0.2s' }}>
            <span style={{ position: 'absolute', top: '0.15rem', left: value ? 'calc(100% - 1.2rem)' : '0.15rem', width: '1.2rem', height: '1.2rem', borderRadius: '50%', backgroundColor: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px hsl(220 25% 15% / 0.25)' }} />
        </button>
    </div>
);

const SectionLabel = ({ children }) => (
    <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', paddingBottom: '0.4rem', borderBottom: '1px solid hsl(220 15% 94%)' }}>
        {children}
    </p>
);

// ─── Live preview card ────────────────────────────────────────────────────────

const PreviewCard = ({ data }) => {
    const isSale  = data.purpose === 'sale';
    const price   = isSale ? data.sale_price : data.rent_min;
    const typeLabel = LISTING_TYPES.find(t => t.value === data.purpose)?.label ?? 'Listing';
    const hue     = avatarHue(data.title || 'L');
    const fmtP    = (v) => {
        const n = Number(v);
        if (!v || !n) return '—';
        if (n >= 1_000_000) return `${data.currency}${(n/1_000_000).toFixed(2)}M`;
        if (n >= 1_000)     return `${data.currency}${n.toLocaleString()}`;
        return `${data.currency}${n}`;
    };

    return (
        <div style={{ backgroundColor: 'white', border: '1.5px solid hsl(220 15% 88%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 20px hsl(220 25% 12% / 0.08)' }}>
            <div style={{ height: '4px', background: `linear-gradient(90deg, hsl(${hue} 55% 48%), hsl(${(hue+40)%360} 55% 55%))` }} />

            {/* Thumbnail placeholder */}
            <div style={{ height: '7rem', backgroundColor: `hsl(${hue} 30% 92%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `hsl(${hue} 40% 52%)` }}>
                <Icons.home />
            </div>

            <div style={{ padding: '0.875rem' }}>
                {/* Title */}
                <p style={{ margin: '0 0 0.3rem', fontSize: '0.875rem', fontWeight: '800', color: 'hsl(220 25% 14%)', lineHeight: 1.3 }}>
                    {data.title || <span style={{ color: 'hsl(220 15% 60%)', fontWeight: '400', fontStyle: 'italic' }}>Listing title…</span>}
                </p>

                {/* Location */}
                {data.location && (
                    <p style={{ margin: '0 0 0.6rem', fontSize: '0.72rem', color: 'hsl(220 15% 52%)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        📍 {data.location}
                    </p>
                )}

                {/* Type + property */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.06em', padding: '0.15rem 0.45rem', borderRadius: '999px', backgroundColor: 'hsl(214 100% 95%)', color: 'hsl(214 80% 40%)' }}>
                        {typeLabel.toUpperCase()}
                    </span>
                    {data.property_type && (
                        <span style={{ fontSize: '0.62rem', fontWeight: '700', letterSpacing: '0.05em', padding: '0.15rem 0.45rem', borderRadius: '999px', backgroundColor: 'hsl(220 15% 93%)', color: 'hsl(220 15% 40%)', textTransform: 'uppercase' }}>
                            {data.property_type}
                        </span>
                    )}
                </div>

                {/* Price */}
                <div style={{ borderTop: '1px solid hsl(220 15% 94%)', paddingTop: '0.65rem' }}>
                    {isSale ? (
                        <div style={{ fontSize: '1.15rem', fontWeight: '900', color: `hsl(${hue} 55% 40%)` }}>
                            {fmtP(data.sale_price)}
                        </div>
                    ) : (
                        <div>
                            <div style={{ fontSize: '1.15rem', fontWeight: '900', color: `hsl(${hue} 55% 40%)` }}>
                                {data.rent_min && data.rent_max && data.rent_min !== data.rent_max
                                    ? `${fmtP(data.rent_min)} – ${fmtP(data.rent_max)}`
                                    : fmtP(data.rent_min)
                                }
                            </div>
                            {data.advance_duration && (
                                <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 52%)', marginTop: '0.1rem' }}>
                                    {data.advance_duration} month{data.advance_duration !== '1' ? 's' : ''} advance
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Specs row */}
                {(data.bedrooms || data.bathrooms || data.area_sqft) && (
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.55rem', paddingTop: '0.55rem', borderTop: '1px solid hsl(220 15% 94%)' }}>
                        {data.bedrooms  && <span style={{ fontSize: '0.7rem', color: 'hsl(220 15% 45%)', fontWeight: '600' }}>🛏 {data.bedrooms} bd</span>}
                        {data.bathrooms && <span style={{ fontSize: '0.7rem', color: 'hsl(220 15% 45%)', fontWeight: '600' }}>🚿 {data.bathrooms} ba</span>}
                        {data.area_sqft && <span style={{ fontSize: '0.7rem', color: 'hsl(220 15% 45%)', fontWeight: '600' }}>📐 {data.area_sqft} sqft</span>}
                    </div>
                )}

                {/* Flags */}
                {(data.is_featured || data.is_verified) && (
                    <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.55rem', flexWrap: 'wrap' }}>
                        {data.is_featured && <span style={{ fontSize: '0.6rem', fontWeight: '800', backgroundColor: 'hsl(40 90% 93%)', color: 'hsl(40 80% 30%)', padding: '0.1rem 0.4rem', borderRadius: '0.3rem' }}>⭐ FEATURED</span>}
                        {data.is_verified && <span style={{ fontSize: '0.6rem', fontWeight: '800', backgroundColor: 'hsl(214 100% 95%)', color: 'hsl(214 80% 38%)', padding: '0.1rem 0.4rem', borderRadius: '0.3rem' }}>✓ VERIFIED</span>}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const ListingCreate = ({ agents = [], property_types = [], amenities = [] }) => {
    const { data, setData, post, processing, errors } = useForm({
        title:            '',
        description:      '',
        purpose:          'rent',
        property_type:    '',
        sale_price:       '',
        rent_min:         '',
        rent_max:         '',
        advance_duration: '',
        currency:         'GH₵',
        location:         '',
        address:          '',
        bedrooms:         '',
        bathrooms:        '',
        toilets:          '',
        area_sqft:        '',
        is_featured:      false,
        is_verified:      false,
        status:           'pending',
        agent_id:         '',
        amenity_ids:      [],
    });

    const isSale = data.purpose === 'sale';

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/super-admin/listings', {
            onError: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        });
    };

    const toggleAmenity = (id) => {
        setData('amenity_ids', data.amenity_ids.includes(id)
            ? data.amenity_ids.filter(x => x !== id)
            : [...data.amenity_ids, id]
        );
    };

    const allPropTypes = [...new Set([...(property_types ?? [])])];

    // Live header values
    const hue      = avatarHue(data.title || 'L');
    const initials = data.title ? data.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : null;

    return (
        <div>
            {/* ── Page header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/super-admin/listings"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', transition: 'background-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                        <Icons.back /> Back
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.15rem', letterSpacing: '-0.02em' }}>New Listing</h1>
                        <p style={{ fontSize: '0.8rem', color: 'hsl(220 15% 50%)', margin: 0 }}>Add a new property listing to the platform</p>
                    </div>
                </div>
            </div>

            {/* ── Two-column layout ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>

                {/* ═══ LEFT: form ═══════════════════════════════════════════ */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>

                    {/* Dark gradient header */}
                    <div style={{ background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))', padding: '1.5rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.07) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {/* Live avatar */}
                            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.875rem', backgroundColor: initials ? `hsl(${hue} 50% 50%)` : 'hsl(220 25% 30%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: initials ? '0.9rem' : '1.1rem', fontWeight: '800', transition: 'background-color 0.3s', border: '2px solid hsl(220 30% 30%)', boxShadow: '0 2px 12px hsl(220 28% 6% / 0.4)', flexShrink: 0 }}>
                                {initials ?? <Icons.home />}
                            </div>
                            <div>
                                <h2 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: '800', color: 'white', letterSpacing: '-0.01em' }}>
                                    {data.title || 'New Property Listing'}
                                </h2>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(220 20% 62%)' }}>
                                    {data.location
                                        ? `📍 ${data.location}`
                                        : LISTING_TYPES.find(t => t.value === data.purpose)?.label ?? 'Set details below'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

                            {/* ── Basic info ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Basic Information</SectionLabel>
                                <FField label="Listing Title" required error={errors.title}>
                                    <FInput value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. Spacious 3-Bed Apartment in East Legon" hasError={!!errors.title} />
                                </FField>
                                <FField label="Description" error={errors.description}>
                                    <FTextarea value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Describe the property in detail…" rows={5} hasError={!!errors.description} />
                                </FField>
                            </div>

                            {/* ── Classification ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Classification</SectionLabel>

                                {/* Purpose / listing type card selector */}
                                <FField label="Listing Purpose" required error={errors.purpose}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                        {LISTING_TYPES.map(t => {
                                            const active = data.purpose === t.value;
                                            return (
                                                <button type="button" key={t.value} onClick={() => setData('purpose', t.value)}
                                                    style={{ padding: '0.65rem 0.4rem', borderRadius: '0.65rem', border: `1.5px solid ${active ? 'hsl(220 60% 55%)' : 'hsl(220 15% 88%)'}`, backgroundColor: active ? 'hsl(214 100% 97%)' : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', fontFamily: 'inherit', boxShadow: active ? '0 0 0 3px hsl(220 60% 55% / 0.11)' : 'none' }}>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: active ? 'hsl(214 80% 44%)' : 'hsl(220 25% 22%)', marginBottom: '0.15rem' }}>{t.label}</div>
                                                    <div style={{ fontSize: '0.62rem', color: active ? 'hsl(214 80% 56%)' : 'hsl(220 15% 55%)' }}>{t.sub}</div>
                                                    {active && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.3rem', color: 'hsl(214 80% 48%)' }}><Icons.check /></div>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </FField>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                    <FField label="Property Type" error={errors.property_type}>
                                        <FSelect value={data.property_type} onChange={e => setData('property_type', e.target.value)}>
                                            <option value="">Select type…</option>
                                            {allPropTypes.map(pt => <option key={pt} value={pt.toLowerCase()}>{pt}</option>)}
                                        </FSelect>
                                    </FField>
                                    <FField label="Initial Status" error={errors.status}>
                                        <FSelect value={data.status} onChange={e => setData('status', e.target.value)}>
                                            {INITIAL_STATUSES.map(s => (
                                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                            ))}
                                        </FSelect>
                                    </FField>
                                </div>

                                {agents.length > 0 && (
                                    <FField label="Assign to Agent" error={errors.agent_id} hint="Optional — can be assigned later">
                                        <FSelect value={data.agent_id} onChange={e => setData('agent_id', e.target.value)}>
                                            <option value="">Unassigned</option>
                                            {agents.map(a => (
                                                <option key={a.id} value={a.id}>
                                                    {a.name}{a.agency ? ` — ${a.agency}` : ''}
                                                </option>
                                            ))}
                                        </FSelect>
                                    </FField>
                                )}
                            </div>

                            {/* ── Pricing ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Pricing</SectionLabel>

                                <FField label="Currency">
                                    <FSelect value={data.currency} onChange={e => setData('currency', e.target.value)}>
                                        {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </FSelect>
                                </FField>

                                {isSale ? (
                                    <FField label="Sale Price" required error={errors.sale_price}>
                                        <FInput type="number" value={data.sale_price} onChange={e => setData('sale_price', e.target.value)} placeholder="0.00" min="0" step="0.01" hasError={!!errors.sale_price} />
                                    </FField>
                                ) : (
                                    <>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                            <FField label="Min Rent / month" required error={errors.rent_min}>
                                                <FInput type="number" value={data.rent_min} onChange={e => setData('rent_min', e.target.value)} placeholder="0.00" min="0" step="0.01" hasError={!!errors.rent_min} />
                                            </FField>
                                            <FField label="Max Rent / month" error={errors.rent_max}>
                                                <FInput type="number" value={data.rent_max} onChange={e => setData('rent_max', e.target.value)} placeholder="0.00" min="0" step="0.01" />
                                            </FField>
                                        </div>
                                        <FField label="Advance Duration" hint="Number of months required upfront" error={errors.advance_duration}>
                                            <FInput type="number" value={data.advance_duration} onChange={e => setData('advance_duration', e.target.value)} placeholder="e.g. 6" min="1" />
                                        </FField>
                                    </>
                                )}
                            </div>

                            {/* ── Location ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Location</SectionLabel>
                                <FField label="Location / Area" required error={errors.location}>
                                    <FInput value={data.location} onChange={e => setData('location', e.target.value)} placeholder="e.g. East Legon, Accra" hasError={!!errors.location} />
                                </FField>
                                <FField label="Full Address" error={errors.address} hint="Optional — shown to verified leads only">
                                    <FInput value={data.address} onChange={e => setData('address', e.target.value)} placeholder="House number, street, area…" />
                                </FField>
                            </div>

                            {/* ── Property specs ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Property Specs</SectionLabel>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem' }}>
                                    <FField label="Bedrooms" error={errors.bedrooms}>
                                        <FInput type="number" value={data.bedrooms} onChange={e => setData('bedrooms', e.target.value)} placeholder="—" min="0" />
                                    </FField>
                                    <FField label="Bathrooms" error={errors.bathrooms}>
                                        <FInput type="number" value={data.bathrooms} onChange={e => setData('bathrooms', e.target.value)} placeholder="—" min="0" />
                                    </FField>
                                    <FField label="Toilets" error={errors.toilets}>
                                        <FInput type="number" value={data.toilets} onChange={e => setData('toilets', e.target.value)} placeholder="—" min="0" />
                                    </FField>
                                    <FField label="Area (sqft)" error={errors.area_sqft}>
                                        <FInput type="number" value={data.area_sqft} onChange={e => setData('area_sqft', e.target.value)} placeholder="—" min="0" />
                                    </FField>
                                </div>
                            </div>

                            {/* ── Visibility ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Visibility & Trust</SectionLabel>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                                    <Toggle value={data.is_featured} onChange={v => setData('is_featured', v)} label="Featured Listing" sub="Shown in featured sections and highlighted in search" />
                                    <Toggle value={data.is_verified} onChange={v => setData('is_verified', v)} label="Verified Listing" sub="Shows the verified badge — confirms property details are accurate" />
                                </div>
                            </div>

                            {/* ── Amenities ── */}
                            {amenities.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <SectionLabel>Amenities</SectionLabel>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                        {amenities.map(am => {
                                            const selected = data.amenity_ids.includes(am.id);
                                            return (
                                                <button type="button" key={am.id} onClick={() => toggleAmenity(am.id)}
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.32rem 0.7rem', borderRadius: '999px', border: `1.5px solid ${selected ? 'hsl(152 55% 50%)' : 'hsl(220 15% 86%)'}`, backgroundColor: selected ? 'hsl(152 55% 94%)' : 'white', color: selected ? 'hsl(152 55% 28%)' : 'hsl(220 15% 42%)', fontSize: '0.76rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                                                    {am.icon && <span>{am.icon}</span>}
                                                    {am.name}
                                                    {selected && <Icons.check />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(220 15% 55%)' }}>{data.amenity_ids.length} selected</p>
                                </div>
                            )}
                        </div>

                        {/* ── Footer ── */}
                        <div style={{ padding: '1rem 1.75rem 1.5rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                            <Link href="/super-admin/listings"
                                style={{ flex: 1, padding: '0.65rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 30%)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                                Cancel
                            </Link>
                            <button type="submit" disabled={processing}
                                style={{ flex: 2, padding: '0.65rem', borderRadius: '0.65rem', border: 'none', backgroundColor: processing ? 'hsl(220 15% 70%)' : 'hsl(220 25% 15%)', color: processing ? 'hsl(220 15% 45%)' : 'white', fontSize: '0.875rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'all 0.2s' }}
                                onMouseEnter={e => { if (!processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'; }}
                                onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'; }}>
                                {processing ? <><Icons.spinner /> Creating…</> : <><Icons.plus /> Create Listing</>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ═══ RIGHT: sticky preview ════════════════════════════════ */}
                <div style={{ position: 'sticky', top: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)' }}>Live Preview</p>

                    <PreviewCard data={data} />

                    {/* Tips */}
                    <div style={{ backgroundColor: 'hsl(214 100% 98%)', border: '1px solid hsl(214 80% 90%)', borderRadius: '0.75rem', padding: '1rem' }}>
                        <p style={{ margin: '0 0 0.6rem', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(214 80% 46%)' }}>Tips</p>
                        {[
                            'Set status to "Pending" if the listing needs agent approval first.',
                            'Verified listings get higher trust scores and better search placement.',
                            'Rentals need both min and max rent for price range display.',
                            'Leave agent unassigned — the agent can claim it later.',
                        ].map((tip, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: i > 0 ? '0.5rem' : 0 }}>
                                <span style={{ color: 'hsl(214 80% 52%)', flexShrink: 0, marginTop: '0.05rem', display: 'flex' }}><Icons.check /></span>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(214 50% 35%)', lineHeight: 1.5 }}>{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`@keyframes lcSpin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

ListingCreate.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default ListingCreate;