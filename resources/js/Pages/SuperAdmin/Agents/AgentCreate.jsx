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
    plus:    () => <Ico d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />,
    check:   () => <Ico d="M5 13l4 4L19 7" size="0.82rem" />,
    x:       () => <Ico d="M6 18L18 6M6 6l12 12" />,
    eye:     () => <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} />,
    eyeOff:  () => <Ico d={["M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"]} />,
    user:    () => <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" size="1.1rem" />,
    shield:  () => <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    building:() => <Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" size="1.1rem" />,
    star:    () => <Ico d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" size="0.9rem" />,
    spinner: () => (
        <svg style={{ width: '1rem', height: '1rem', animation: 'acSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Config ───────────────────────────────────────────────────────────────────

const TIERS = [
    { value: 'basic',    label: 'Basic',    desc: 'Entry level access',       activeBorder: 'hsl(220 15% 60%)', activeBg: 'hsl(220 15% 97%)', glow: 'hsl(220 15% 60% / 0.15)', tagBg: 'hsl(220 15% 93%)', tagColor: 'hsl(220 15% 38%)' },
    { value: 'standard', label: 'Standard', desc: 'Standard platform access', activeBorder: 'hsl(214 80% 55%)', activeBg: 'hsl(214 100% 98%)', glow: 'hsl(214 80% 55% / 0.12)', tagBg: 'hsl(214 100% 95%)', tagColor: 'hsl(214 80% 40%)' },
    { value: 'pro',      label: 'Pro',      desc: 'Priority features',        activeBorder: 'hsl(270 60% 55%)', activeBg: 'hsl(270 60% 98%)', glow: 'hsl(270 60% 55% / 0.12)', tagBg: 'hsl(270 60% 95%)', tagColor: 'hsl(270 55% 40%)' },
    { value: 'premium',  label: 'Premium',  desc: 'Full featured + priority', activeBorder: 'hsl(40 80% 50%)',  activeBg: 'hsl(40 90% 98%)',  glow: 'hsl(40 80% 50% / 0.12)',  tagBg: 'hsl(40 90% 93%)',  tagColor: 'hsl(40 80% 30%)' },
];

const INITIAL_STATUSES = [
    { value: 'pending',  label: 'Pending' },
    { value: 'active',   label: 'Active' },
    { value: 'verified', label: 'Verified' },
];

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

const FInput = ({ hasError, suffix, ...props }) => {
    const [f, setF] = useState(false);
    return (
        <div style={{ position: 'relative' }}>
            <input {...props} onFocus={() => setF(true)} onBlur={() => setF(false)}
                style={{ ...inputStyle(f, hasError), paddingRight: suffix ? '2.8rem' : '0.875rem' }} />
            {suffix && (
                <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', cursor: 'pointer' }}>
                    {suffix}
                </span>
            )}
        </div>
    );
};

const FTextarea = ({ rows = 3, hasError, ...props }) => {
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
    const hue      = avatarHue(data.name || 'A');
    const initials = data.name
        ? data.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : null;
    const tier     = TIERS.find(t => t.value === data.tier);

    return (
        <div style={{ backgroundColor: 'white', border: '1.5px solid hsl(220 15% 88%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 20px hsl(220 25% 12% / 0.08)' }}>
            <div style={{ height: '4px', background: `linear-gradient(90deg, hsl(${hue} 55% 48%), hsl(${(hue+50)%360} 55% 55%))` }} />
            <div style={{ padding: '1.1rem' }}>

                {/* Avatar + name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: initials ? `hsl(${hue} 50% 88%)` : 'hsl(220 15% 91%)', color: initials ? `hsl(${hue} 50% 28%)` : 'hsl(220 15% 55%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: initials ? '0.9rem' : '1rem', fontWeight: '900', border: '2px solid hsl(220 15% 93%)' }}>
                            {initials ?? <Icons.user />}
                        </div>
                        {data.is_verified && (
                            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '1rem', height: '1rem', borderRadius: '50%', backgroundColor: 'hsl(214 80% 50%)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg style={{ width: '0.5rem', height: '0.5rem' }} fill="white" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            </div>
                        )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'hsl(220 25% 14%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {data.name || <span style={{ color: 'hsl(220 15% 60%)', fontWeight: '400', fontStyle: 'italic' }}>Agent name…</span>}
                        </div>
                        {data.agency && (
                            <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 52%)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <Icons.building /> {data.agency}
                            </div>
                        )}
                    </div>
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {tier && (
                        <span style={{ fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.06em', padding: '0.15rem 0.45rem', borderRadius: '999px', backgroundColor: tier.tagBg, color: tier.tagColor }}>
                            {data.tier === 'premium' || data.tier === 'pro' ? '⭐ ' : ''}{tier.label.toUpperCase()}
                        </span>
                    )}
                    {data.status && (
                        <span style={{ fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.06em', padding: '0.15rem 0.45rem', borderRadius: '999px', backgroundColor: data.status === 'verified' ? 'hsl(214 100% 95%)' : data.status === 'active' ? 'hsl(152 60% 93%)' : 'hsl(40 90% 93%)', color: data.status === 'verified' ? 'hsl(214 80% 38%)' : data.status === 'active' ? 'hsl(152 60% 28%)' : 'hsl(40 80% 30%)' }}>
                            {data.status.toUpperCase()}
                        </span>
                    )}
                    {data.is_featured && (
                        <span style={{ fontSize: '0.62rem', fontWeight: '800', padding: '0.15rem 0.4rem', borderRadius: '999px', backgroundColor: 'hsl(40 90% 93%)', color: 'hsl(40 80% 30%)' }}>⭐ FEATURED</span>
                    )}
                </div>

                {/* Info lines */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', borderTop: '1px solid hsl(220 15% 95%)', paddingTop: '0.75rem' }}>
                    {data.email && (
                        <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 48%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            ✉ {data.email}
                        </div>
                    )}
                    {data.phone && (
                        <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 48%)' }}>📞 {data.phone}</div>
                    )}
                    {data.location && (
                        <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 48%)' }}>📍 {data.location}</div>
                    )}
                    {data.license && (
                        <div style={{ fontSize: '0.68rem', color: 'hsl(214 80% 44%)', fontFamily: 'monospace', backgroundColor: 'hsl(214 100% 96%)', padding: '0.1rem 0.35rem', borderRadius: '0.3rem', display: 'inline-block', marginTop: '0.1rem' }}>
                            #{data.license}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const AgentCreate = () => {
    const { data, setData, post, processing, errors } = useForm({
        name:                  '',
        email:                 '',
        phone:                 '',
        agency:                '',
        license:               '',
        location:              '',
        bio:                   '',
        website:               '',
        status:                'pending',
        tier:                  'standard',
        is_verified:           false,
        is_featured:           false,
        password:              '',
        password_confirmation: '',
    });

    const [showPw,  setShowPw]  = useState(false);
    const [showPw2, setShowPw2] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/super-admin/agents', {
            onError: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        });
    };

    const hue      = avatarHue(data.name || 'A');
    const initials = data.name
        ? data.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : null;

    return (
        <div>
            {/* ── Page header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/super-admin/agents"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', transition: 'background-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                        <Icons.back /> Back
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.15rem', letterSpacing: '-0.02em' }}>New Agent</h1>
                        <p style={{ fontSize: '0.8rem', color: 'hsl(220 15% 50%)', margin: 0 }}>Register a new agent account on the platform</p>
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
                            <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: initials ? `hsl(${hue} 50% 50%)` : 'hsl(220 25% 30%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: initials ? '0.9rem' : '1rem', fontWeight: '800', transition: 'background-color 0.3s', border: '2px solid hsl(220 30% 30%)', boxShadow: '0 2px 12px hsl(220 28% 6% / 0.4)', flexShrink: 0 }}>
                                {initials ?? <Icons.user />}
                            </div>
                            <div>
                                <h2 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: '800', color: 'white', letterSpacing: '-0.01em' }}>
                                    {data.name || 'New Agent Account'}
                                </h2>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(220 20% 62%)' }}>
                                    {data.email || 'Set details below'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

                            {/* ── Profile ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Profile</SectionLabel>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                    <FField label="Full Name" required error={errors.name}>
                                        <FInput value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Jane Mensah" hasError={!!errors.name} />
                                    </FField>
                                    <FField label="Email Address" required error={errors.email}>
                                        <FInput type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="jane@agency.com" hasError={!!errors.email} />
                                    </FField>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                    <FField label="Phone Number" error={errors.phone}>
                                        <FInput type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+233 xx xxx xxxx" />
                                    </FField>
                                    <FField label="Location / City" error={errors.location}>
                                        <FInput value={data.location} onChange={e => setData('location', e.target.value)} placeholder="Accra, Greater Accra" />
                                    </FField>
                                </div>
                                <FField label="Bio" error={errors.bio} hint="Shown on the agent's public profile">
                                    <FTextarea value={data.bio} onChange={e => setData('bio', e.target.value)} placeholder="Brief description of the agent and their experience…" rows={3} />
                                </FField>
                            </div>

                            {/* ── Professional ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Professional Details</SectionLabel>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                    <FField label="Agency / Company" error={errors.agency}>
                                        <FInput value={data.agency} onChange={e => setData('agency', e.target.value)} placeholder="e.g. Devtraco Properties" />
                                    </FField>
                                    <FField label="License / REA Number" error={errors.license} hint="Registered estate agent number">
                                        <FInput value={data.license} onChange={e => setData('license', e.target.value)} placeholder="e.g. REA-2024-XXXX" />
                                    </FField>
                                </div>
                                <FField label="Website" error={errors.website}>
                                    <FInput type="url" value={data.website} onChange={e => setData('website', e.target.value)} placeholder="https://agency.com" />
                                </FField>
                            </div>

                            {/* ── Tier ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Subscription Tier</SectionLabel>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                    {TIERS.map(t => {
                                        const active = data.tier === t.value;
                                        return (
                                            <button type="button" key={t.value} onClick={() => setData('tier', t.value)}
                                                style={{ padding: '0.65rem 0.4rem', borderRadius: '0.7rem', border: `1.5px solid ${active ? t.activeBorder : 'hsl(220 15% 88%)'}`, backgroundColor: active ? t.activeBg : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', fontFamily: 'inherit', boxShadow: active ? `0 0 0 3px ${t.glow}` : 'none' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.3rem' }}>
                                                    <span style={{ fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.06em', color: active ? t.tagColor : 'hsl(220 15% 50%)', padding: '0.12rem 0.4rem', borderRadius: '0.3rem', backgroundColor: active ? t.tagBg : 'hsl(220 15% 93%)' }}>
                                                        {t.label.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '0.7rem', color: active ? t.tagColor : 'hsl(220 15% 55%)' }}>{t.desc.split(' ').slice(0, 2).join(' ')}</div>
                                                {active && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.3rem', color: t.tagColor }}><Icons.check /></div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ── Status & flags ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Status & Visibility</SectionLabel>
                                <FField label="Initial Status" error={errors.status}>
                                    <FSelect value={data.status} onChange={e => setData('status', e.target.value)}>
                                        {INITIAL_STATUSES.map(s => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </FSelect>
                                </FField>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                                    <Toggle value={data.is_verified} onChange={v => setData('is_verified', v)} label="Verified Agent" sub="Shows the blue verified checkmark on their profile and listings" />
                                    <Toggle value={data.is_featured} onChange={v => setData('is_featured', v)} label="Featured Agent" sub="Agent appears in featured agent sections" />
                                </div>
                            </div>

                            {/* ── Password ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Account Password</SectionLabel>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                    <FField label="Password" required error={errors.password}>
                                        <FInput type={showPw ? 'text' : 'password'} value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Min. 8 characters" hasError={!!errors.password}
                                            suffix={
                                                <button type="button" onClick={() => setShowPw(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 52%)', display: 'flex', padding: 0 }}>
                                                    {showPw ? <Icons.eyeOff /> : <Icons.eye />}
                                                </button>
                                            } />
                                    </FField>
                                    <FField label="Confirm Password" required error={errors.password_confirmation}>
                                        <FInput type={showPw2 ? 'text' : 'password'} value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} placeholder="Repeat password" hasError={!!errors.password_confirmation}
                                            suffix={
                                                <button type="button" onClick={() => setShowPw2(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 52%)', display: 'flex', padding: 0 }}>
                                                    {showPw2 ? <Icons.eyeOff /> : <Icons.eye />}
                                                </button>
                                            } />
                                    </FField>
                                </div>
                            </div>
                        </div>

                        {/* ── Footer ── */}
                        <div style={{ padding: '1rem 1.75rem 1.5rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                            <Link href="/super-admin/agents"
                                style={{ flex: 1, padding: '0.65rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 30%)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                                Cancel
                            </Link>
                            <button type="submit" disabled={processing}
                                style={{ flex: 2, padding: '0.65rem', borderRadius: '0.65rem', border: 'none', backgroundColor: processing ? 'hsl(220 15% 70%)' : 'hsl(220 25% 15%)', color: processing ? 'hsl(220 15% 45%)' : 'white', fontSize: '0.875rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'all 0.2s' }}
                                onMouseEnter={e => { if (!processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'; }}
                                onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'; }}>
                                {processing ? <><Icons.spinner /> Creating…</> : <><Icons.plus /> Create Agent</>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ═══ RIGHT: sticky preview + tips ════════════════════════ */}
                <div style={{ position: 'sticky', top: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)' }}>Live Preview</p>

                    <PreviewCard data={data} />

                    {/* Tips */}
                    <div style={{ backgroundColor: 'hsl(214 100% 98%)', border: '1px solid hsl(214 80% 90%)', borderRadius: '0.75rem', padding: '1rem' }}>
                        <p style={{ margin: '0 0 0.6rem', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(214 80% 46%)' }}>Tips</p>
                        {[
                            'Set status to "Pending" if the agent needs to complete their profile first.',
                            'Verified agents get a trust badge shown on all their listings.',
                            'The license/REA number is shown publicly to build buyer trust.',
                            'Password must be at least 8 characters. Share it securely with the agent.',
                        ].map((tip, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: i > 0 ? '0.5rem' : 0 }}>
                                <span style={{ color: 'hsl(214 80% 52%)', flexShrink: 0, marginTop: '0.05rem', display: 'flex' }}><Icons.check /></span>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(214 50% 35%)', lineHeight: 1.5 }}>{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`@keyframes acSpin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

AgentCreate.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default AgentCreate;