import React, { useState, useRef } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import AdminEdit from './AdminEdit';
import { useRefresh } from '@/Hooks/useRefresh';

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = ({ d, size = '1rem' }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d={p} />
        ))}
    </svg>
);

const Icons = {
    search:      () => <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    plus:        () => <Ico d="M12 4v16m8-8H4" size="1rem" />,
    edit:        () => <Ico d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />,
    trash:       () => <Ico d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    impersonate: () => <Ico d={["M16 7a4 4 0 11-8 0 4 4 0 018 0z","M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"]} />,
    shield:      () => <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" size="0.75rem" />,
    x:           () => <Ico d="M6 18L18 6M6 6l12 12" />,
    refresh:  () => <Ico d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" size="0.9rem" />,
    eye:         () => <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z", "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} />,
    eyeOff:      () => <Ico d={["M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"]} />,
    check:       () => <Ico d="M5 13l4 4L19 7" />,
    chevD:       () => <Ico d="M19 9l-7 7-7-7" size="0.875rem" />,
    chevU:       () => <Ico d="M5 15l7-7 7 7" size="0.875rem" />,
    users:       () => <Ico d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" size="1.1rem" />,
    checkCircle: () => <Ico d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size="1.1rem" />,
    banCircle:   () => <Ico d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" size="1.1rem" />,
    clockCircle: () => <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size="1.1rem" />,
    mail:        () => <Ico d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    spinner:     () => (
        <svg style={{ width: '1rem', height: '1rem', animation: 'adminSpin 0.7s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
    active:    { label: 'Active',    bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 30%)', dot: 'hsl(152 60% 40%)' },
    inactive:  { label: 'Inactive',  bg: 'hsl(220 15% 92%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)' },
    suspended: { label: 'Suspended', bg: 'hsl(0 70% 94%)',   color: 'hsl(0 65% 42%)',   dot: 'hsl(0 65% 52%)' },
    pending:   { label: 'Pending',   bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 35%)',  dot: 'hsl(40 80% 48%)' },
};

const STATUSES = ['all', 'active', 'pending', 'suspended', 'inactive'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return v; }
};

const fmtRelative = (v) => {
    if (!v) return 'Never';
    try {
        const diff = (Date.now() - new Date(v)) / 1000;
        if (diff < 60)     return 'Just now';
        if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return fmtDate(v);
    } catch { return v; }
};

// ─── Shared atoms ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
    const key = (status ?? 'active').toLowerCase();
    const c   = STATUS_CFG[key] ?? STATUS_CFG.active;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.06em', backgroundColor: c.bg, color: c.color }}>
            <span style={{ width: '0.38rem', height: '0.38rem', borderRadius: '50%', backgroundColor: c.dot, flexShrink: 0 }} />
            {c.label.toUpperCase()}
        </span>
    );
};

const RoleBadge = ({ role }) => {
    const isSuper = (role ?? '').toLowerCase().includes('super');
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.05em', backgroundColor: isSuper ? 'hsl(270 60% 95%)' : 'hsl(214 100% 95%)', color: isSuper ? 'hsl(270 60% 42%)' : 'hsl(214 80% 42%)' }}>
            <Icons.shield />{role ?? 'Admin'}
        </span>
    );
};

const Avatar = ({ name, email, size = '2.25rem', fontSize = '0.7rem' }) => {
    const str      = name ?? email ?? '?';
    const initials = str.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const hue      = [...str].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    return (
        <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 32%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize, fontWeight: '800', letterSpacing: '0.02em' }}>
            {initials}
        </div>
    );
};

const KpiCard = ({ label, value, sub, iconEl, accentBg, accentColor }) => (
    <div style={{ backgroundColor: 'white', borderRadius: '0.875rem', border: '1px solid hsl(220 15% 91%)', padding: '1.1rem 1.25rem', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.65rem', backgroundColor: accentBg, color: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {iconEl}
        </div>
        <div>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'hsl(220 25% 14%)', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'hsl(220 15% 48%)', marginTop: '0.2rem' }}>{label}</div>
            {sub && <div style={{ fontSize: '0.67rem', color: 'hsl(220 15% 60%)', marginTop: '0.05rem' }}>{sub}</div>}
        </div>
    </div>
);

// ─── Add Admin Modal ──────────────────────────────────────────────────────────

const ROLES = [
    { value: 'Admin',       label: 'Admin',       desc: 'Standard platform access',     tag: 'ADMIN',    tagBg: 'hsl(214 80% 93%)', tagColor: 'hsl(214 80% 42%)' },
    { value: 'Super Admin', label: 'Super Admin', desc: 'Full unrestricted access',      tag: '★ SUPER',  tagBg: 'hsl(270 60% 93%)', tagColor: 'hsl(270 60% 42%)' },
];

const fieldStyle = (focused, hasError) => ({
    width: '100%', padding: '0.6rem 0.875rem',
    border: `1.5px solid ${hasError ? 'hsl(0 65% 60%)' : focused ? 'hsl(220 60% 55%)' : 'hsl(220 15% 88%)'}`,
    borderRadius: '0.6rem', fontSize: '0.875rem', color: 'hsl(220 25% 16%)',
    backgroundColor: 'white', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    boxShadow: focused && !hasError ? '0 0 0 3px hsl(220 60% 55% / 0.11)' : hasError ? '0 0 0 3px hsl(0 65% 55% / 0.1)' : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
});

const FField = ({ label, required, hint, error, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'hsl(220 25% 22%)', letterSpacing: '0.01em' }}>
            {label}{required && <span style={{ color: 'hsl(0 65% 52%)', marginLeft: '0.2rem' }}>*</span>}
        </label>
        {children}
        {hint && !error  && <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(220 15% 55%)' }}>{hint}</p>}
        {error           && <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(0 65% 48%)', fontWeight: '600' }}>{error}</p>}
    </div>
);

const FInput = ({ type = 'text', value, onChange, placeholder, hasError, suffix }) => {
    const [f, setF] = useState(false);
    return (
        <div style={{ position: 'relative' }}>
            <input type={type} value={value} onChange={onChange} placeholder={placeholder}
                onFocus={() => setF(true)} onBlur={() => setF(false)}
                style={{ ...fieldStyle(f, hasError), paddingRight: suffix ? '2.5rem' : '0.875rem' }} />
            {suffix && (
                <span style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', cursor: 'pointer' }}>
                    {suffix}
                </span>
            )}
        </div>
    );
};

const FSelect = ({ value, onChange, children, hasError }) => {
    const [f, setF] = useState(false);
    return (
        <select value={value} onChange={onChange} onFocus={() => setF(true)} onBlur={() => setF(false)}
            style={{ ...fieldStyle(f, hasError), cursor: 'pointer', appearance: 'none' }}>
            {children}
        </select>
    );
};

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

const AddAdminModal = ({ onClose, onSuccess }) => {
    const [adminEdit, setAdminEdit] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name:                  '',
        email:                 '',
        role:                  'Admin',
        password:              '',
        password_confirmation: '',
        send_invite:           true,
    });

    const [showPw,  setShowPw]  = useState(false);
    const [showPw2, setShowPw2] = useState(false);
    const [done,    setDone]    = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/super-admin/admins', {
            preserveScroll: true,
            onSuccess: () => { setDone(true); onSuccess?.(); },
        });
    };

    const liveHue      = [...(data.name || data.email || '')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    const liveInitials = (data.name || data.email || '')
        ? (data.name || data.email).split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()
        : null;

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.62)', backdropFilter: 'blur(5px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '540px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.32)', animation: 'adminModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>

                {/* ── Dark header ── */}
                <div style={{ background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))', padding: '1.5rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
                    {/* subtle grid overlay */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.07) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />

                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {/* Live avatar preview */}
                            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.875rem', backgroundColor: liveInitials ? `hsl(${liveHue} 50% 50%)` : 'hsl(220 25% 30%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: liveInitials ? '0.9rem' : '1rem', fontWeight: '800', letterSpacing: '0.02em', transition: 'background-color 0.3s', border: '2px solid hsl(220 30% 30%)', boxShadow: '0 2px 12px hsl(220 28% 6% / 0.4)' }}>
                                {liveInitials ?? <Icons.users />}
                            </div>
                            <div>
                                <h2 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: '800', color: 'white', letterSpacing: '-0.01em' }}>
                                    {done ? 'Admin Created!' : 'Add New Admin'}
                                </h2>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(220 20% 62%)' }}>
                                    {done ? `${data.name || data.email} is ready` : 'Configure access credentials and role'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 20% 55%)', padding: '0.3rem', display: 'flex', borderRadius: '0.4rem', transition: 'color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'white'}
                            onMouseLeave={e => e.currentTarget.style.color = 'hsl(220 20% 55%)'}>
                            <Icons.x />
                        </button>
                    </div>
                </div>

                {done ? (
                    /* ── Success panel ── */
                    <div style={{ padding: '2.25rem 1.75rem', textAlign: 'center' }}>
                        <div style={{ width: '4.5rem', height: '4.5rem', borderRadius: '50%', backgroundColor: 'hsl(152 55% 92%)', color: 'hsl(152 55% 33%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.6rem' }}>
                            <Icons.check />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'hsl(220 25% 15%)', margin: '0 0 0.5rem' }}>
                            {data.name || data.email} added successfully
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'hsl(220 15% 50%)', margin: '0 0 0.5rem', lineHeight: 1.6 }}>
                            {data.send_invite
                                ? <>An invitation has been sent to <strong>{data.email}</strong>.</>
                                : <>The account is now active. Share credentials securely.</>}
                        </p>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', borderRadius: '999px', backgroundColor: 'hsl(270 60% 95%)', color: 'hsl(270 60% 42%)', fontSize: '0.72rem', fontWeight: '700', marginBottom: '1.75rem' }}>
                            <Icons.shield /> {data.role}
                        </div>
                        <div style={{ display: 'flex', gap: '0.65rem' }}>
                            <button onClick={() => { reset(); setDone(false); setShowPw(false); setShowPw2(false); }}
                                style={{ flex: 1, padding: '0.65rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>
                                Add Another
                            </button>
                            <button onClick={onClose}
                                style={{ flex: 1, padding: '0.65rem', borderRadius: '0.65rem', border: 'none', backgroundColor: 'hsl(220 25% 15%)', color: 'white', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                                Done
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>

                            {/* Name + Email */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                <FField label="Full Name" required error={errors.name}>
                                    <FInput value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Jane Doe" hasError={!!errors.name} />
                                </FField>
                                <FField label="Email Address" required error={errors.email}>
                                    <FInput type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="jane@company.com" hasError={!!errors.email} />
                                </FField>
                            </div>

                            {/* Role selector */}
                            <FField label="Role" hint="Super Admins have unrestricted access to this panel.">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                                    {ROLES.map(r => {
                                        const active = data.role === r.value;
                                        const isSuper = r.value === 'Super Admin';
                                        const activeBorder = isSuper ? 'hsl(270 60% 55%)' : 'hsl(220 60% 55%)';
                                        const activeBg     = isSuper ? 'hsl(270 60% 98%)' : 'hsl(214 100% 98%)';
                                        return (
                                            <button type="button" key={r.value} onClick={() => setData('role', r.value)}
                                                style={{ padding: '0.75rem 0.875rem', borderRadius: '0.7rem', border: `1.5px solid ${active ? activeBorder : 'hsl(220 15% 88%)'}`, backgroundColor: active ? activeBg : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'inherit', boxShadow: active ? `0 0 0 3px ${isSuper ? 'hsl(270 60% 55% / 0.1)' : 'hsl(220 60% 55% / 0.1)'}` : 'none' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                                    <span style={{ fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.07em', color: active ? r.tagColor : 'hsl(220 15% 50%)', padding: '0.15rem 0.45rem', borderRadius: '0.3rem', backgroundColor: active ? r.tagBg : 'hsl(220 15% 93%)' }}>
                                                        {r.tag}
                                                    </span>
                                                    {active && <span style={{ color: isSuper ? 'hsl(270 60% 48%)' : 'hsl(220 60% 52%)', display: 'flex' }}><Icons.check /></span>}
                                                </div>
                                                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'hsl(220 25% 18%)', marginBottom: '0.1rem' }}>{r.label}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 55%)' }}>{r.desc}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </FField>

                            {/* Divider */}
                            <div style={{ borderTop: '1px solid hsl(220 15% 93%)' }} />

                            {/* Passwords */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                <FField label="Password" hint={data.send_invite ? 'Optional — auto-generated if blank' : 'Min 8 characters'} error={errors.password}>
                                    <FInput type={showPw ? 'text' : 'password'} value={data.password} onChange={e => setData('password', e.target.value)} placeholder={data.send_invite ? 'Optional' : '••••••••'} hasError={!!errors.password}
                                        suffix={
                                            <button type="button" onClick={() => setShowPw(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 55%)', padding: 0, display: 'flex' }}>
                                                {showPw ? <Icons.eyeOff /> : <Icons.eye />}
                                            </button>
                                        }
                                    />
                                </FField>
                                <FField label="Confirm Password" error={errors.password_confirmation}>
                                    <FInput type={showPw2 ? 'text' : 'password'} value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} placeholder="Repeat password" hasError={!!errors.password_confirmation}
                                        suffix={
                                            <button type="button" onClick={() => setShowPw2(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 55%)', padding: 0, display: 'flex' }}>
                                                {showPw2 ? <Icons.eyeOff /> : <Icons.eye />}
                                            </button>
                                        }
                                    />
                                </FField>
                            </div>

                            {/* Invite toggle */}
                            <Toggle
                                value={data.send_invite}
                                onChange={v => setData('send_invite', v)}
                                label="Send invitation email"
                                sub="Admin will receive a one-time setup link to activate their account"
                            />
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '1rem 1.75rem 1.5rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', gap: '0.65rem' }}>
                            <button type="button" onClick={onClose}
                                style={{ flex: 1, padding: '0.65rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>
                                Cancel
                            </button>
                            <button type="submit" disabled={processing}
                                style={{ flex: 2, padding: '0.65rem', borderRadius: '0.65rem', border: 'none', backgroundColor: processing ? 'hsl(220 25% 38%)' : 'hsl(220 25% 15%)', color: 'white', fontSize: '0.875rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'background-color 0.15s' }}
                                onMouseEnter={e => { if (!processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'; }}
                                onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = processing ? 'hsl(220 25% 38%)' : 'hsl(220 25% 15%)'; }}>
                                {processing ? <><Icons.spinner /> Creating account…</> : <><Icons.plus /> Create Admin Account</>}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

// ─── Delete confirm modal ─────────────────────────────────────────────────────

const DeleteModal = ({ admin, onConfirm, onClose, processing }) => (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.6)', backdropFilter: 'blur(4px)' }}>
        <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '400px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.1rem', overflow: 'hidden', boxShadow: '0 32px 80px hsl(220 28% 6% / 0.28)', animation: 'adminModalIn 0.2s cubic-bezier(0.16,1,0.3,1)' }}>
            <div style={{ height: '4px', background: 'linear-gradient(90deg, hsl(0 65% 52%), hsl(0 75% 62%))' }} />
            <div style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.75rem', backgroundColor: 'hsl(0 70% 94%)', color: 'hsl(0 65% 48%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icons.trash />
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 0.12rem', fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>Remove Admin</h3>
                            <p style={{ margin: 0, fontSize: '0.73rem', color: 'hsl(220 15% 50%)' }}>This action cannot be undone</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 55%)', padding: '0.2rem', display: 'flex' }}><Icons.x /></button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 15% 97%)', border: '1px solid hsl(220 15% 91%)', marginBottom: '1rem' }}>
                    <Avatar name={admin.name} email={admin.email} size="2.5rem" fontSize="0.75rem" />
                    <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'hsl(220 25% 15%)' }}>{admin.name ?? '—'}</div>
                        <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 52%)' }}>{admin.email}</div>
                    </div>
                    <RoleBadge role={admin.role} />
                </div>

                <p style={{ fontSize: '0.83rem', color: 'hsl(220 15% 35%)', lineHeight: 1.65, margin: '0 0 0.875rem' }}>
                    Removing this admin will revoke all access immediately. All active sessions will be invalidated.
                </p>

                <div style={{ padding: '0.6rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 65% 88%)', fontSize: '0.75rem', color: 'hsl(0 55% 38%)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    ⚠ This admin will lose access to all admin tools and data immediately.
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                    <button onClick={onConfirm} disabled={processing}
                        style={{ flex: 2, padding: '0.625rem', borderRadius: '0.6rem', border: 'none', backgroundColor: processing ? 'hsl(0 50% 60%)' : 'hsl(0 65% 50%)', color: 'white', fontSize: '0.85rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit' }}>
                        {processing ? <><Icons.spinner /> Removing…</> : <><Icons.trash /> Remove Admin</>}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ toast }) => toast ? (
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 100, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'adminSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {toast.type === 'error' ? <Icons.x /> : <Icons.check />}
        {toast.msg}
    </div>
) : null;

// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminsIndex = ({ admins: initial = [] }) => {
    // const [admins,       setAdmins]       = useState(initial);
    const { admins = [] } = usePage().props;
    const [search,       setSearch]       = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortField,    setSortField]    = useState('name');
    const [sortDir,      setSortDir]      = useState('asc');
    const [hoveredRow,   setHoveredRow]   = useState(null);
    const [showAdd,      setShowAdd]      = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting,     setDeleting]     = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [toast,        setToast]        = useState(null);
    const [refreshing,   refresh]   = useRefresh(['admins']);
    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const toggleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
    };

    const filtered = admins
        .filter(a => {
            const q = search.toLowerCase();
            const matchSearch = !q || (a.name ?? '').toLowerCase().includes(q) || (a.email ?? '').toLowerCase().includes(q) || (a.role ?? '').toLowerCase().includes(q);
            const matchStatus = filterStatus === 'all' || (a.status ?? 'active').toLowerCase() === filterStatus;
            return matchSearch && matchStatus;
        })
        .sort((a, b) => {
            const km = { name: 'name', role: 'role', status: 'status', date: 'created_at', login: 'last_active' };
            const k  = km[sortField] ?? 'name';
            const cmp = (a[k] ?? '') < (b[k] ?? '') ? -1 : (a[k] ?? '') > (b[k] ?? '') ? 1 : 0;
            return sortDir === 'asc' ? cmp : -cmp;
        });

    const activeCount    = admins.filter(a => (a.status ?? 'active').toLowerCase() === 'active').length;
    const suspendedCount = admins.filter(a => (a.status ?? '').toLowerCase() === 'suspended').length;
    const pendingCount   = admins.filter(a => (a.status ?? '').toLowerCase() === 'pending').length;
    const superCount     = admins.filter(a => (a.role ?? '').toLowerCase().includes('super')).length;

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/super-admin/admins/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setAdmins(prev => prev.filter(a => a.id !== deleteTarget.id));
                showToast(`${deleteTarget.name} removed successfully.`);
                setDeleteTarget(null);
            },
            onError: () => showToast('Failed to remove admin.', 'error'),
            onFinish: () => setDeleting(false),
        });
    };

    const SortTh = ({ field, label, align = 'left' }) => {
        const active = sortField === field;
        const ChevEl = active && sortDir === 'desc' ? Icons.chevD : Icons.chevU;
        return (
            <th onClick={() => toggleSort(field)} style={{ padding: '0.75rem 1rem', fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: active ? 'hsl(220 25% 22%)' : 'hsl(220 15% 50%)', textAlign: align, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap', backgroundColor: active ? 'hsl(220 20% 97%)' : 'hsl(220 15% 97.5%)', borderBottom: '1px solid hsl(220 15% 91%)', transition: 'background-color 0.12s' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    {label}
                    <span style={{ opacity: active ? 1 : 0.3 }}><ChevEl /></span>
                </span>
            </th>
        );
    };

    const PlainTh = ({ label, align = 'left' }) => (
        <th style={{ padding: '0.75rem 1rem', fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)', textAlign: align, backgroundColor: 'hsl(220 15% 97.5%)', borderBottom: '1px solid hsl(220 15% 91%)' }}>{label}</th>
    );

    return (
        <>
            <Toast toast={toast} />
            {showAdd    && <AddAdminModal onClose={() => setShowAdd(false)} onSuccess={() => { showToast('Admin account created.'); router.reload({ only: ['admins'] }); }} />}
            {deleteTarget && <DeleteModal admin={deleteTarget} onConfirm={confirmDelete} onClose={() => setDeleteTarget(null)} processing={deleting} />}

            <div>
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'hsl(220 25% 14%)', margin: '0 0 0.2rem' }}>Admin Accounts</h1>
                        <p style={{ fontSize: '0.875rem', color: 'hsl(220 15% 50%)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <span>{admins.length} admin{admins.length !== 1 ? 's' : ''}</span>
                            <span style={{ opacity: 0.35 }}>·</span>
                            <span>{activeCount} active</span>
                            {suspendedCount > 0 && <>
                                <span style={{ opacity: 0.35 }}>·</span>
                                <span style={{ color: 'hsl(0 62% 48%)', fontWeight: '600' }}>{suspendedCount} suspended</span>
                            </>}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.65rem', flexShrink: 0 }}>
                        <button onClick={refresh} disabled={refreshing}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 28%)', fontWeight: '600', fontSize: '0.83rem', cursor: refreshing ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => { if (!refreshing) e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'; }}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                            {refreshing ? <><Icons.spinner /> Refreshing…</> : <><Icons.refresh /> Refresh</>}
                        </button>
                        <button onClick={() => setShowAdd(true)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.6rem 1.2rem', borderRadius: '0.65rem', border: 'none', cursor: 'pointer', backgroundColor: 'hsl(220 25% 15%)', color: 'white', fontWeight: '700', fontSize: '0.875rem', whiteSpace: 'nowrap', transition: 'background-color 0.15s', fontFamily: 'inherit' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'}>
                            <Icons.plus /> New Admin
                        </button>
                    </div>
                </div>

                {/* ── KPI cards ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
                    <KpiCard label="Total Admins"     sub="All roles"         value={admins.length}    iconEl={<Icons.users />}       accentBg="hsl(214 100% 94%)" accentColor="hsl(214 80% 48%)" />
                    <KpiCard label="Active"           sub="Currently enabled" value={activeCount}      iconEl={<Icons.checkCircle />} accentBg="hsl(152 55% 92%)" accentColor="hsl(152 55% 33%)" />
                    <KpiCard label="Suspended"        sub="Access revoked"    value={suspendedCount}   iconEl={<Icons.banCircle />}   accentBg="hsl(0 65% 94%)"   accentColor="hsl(0 62% 48%)" />
                    <KpiCard label="Pending Invite"   sub="Awaiting setup"    value={pendingCount}     iconEl={<Icons.clockCircle />} accentBg="hsl(40 90% 93%)"  accentColor="hsl(40 75% 40%)" />
                </div>

                {/* ── Toolbar ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                        <span style={{ position: 'absolute', left: '0.72rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)', pointerEvents: 'none', display: 'flex' }}>
                            <Icons.search />
                        </span>
                        <input type="text" placeholder="Search by name, email or role…" value={search} onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.25rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.6rem', fontSize: '0.85rem', color: 'hsl(220 25% 20%)', backgroundColor: 'white', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {STATUSES.map(s => (
                            <button key={s} onClick={() => setFilterStatus(s)}
                                style={{ padding: '0.4rem 0.875rem', borderRadius: '999px', border: 'none', fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.04em', cursor: 'pointer', transition: 'all 0.15s', backgroundColor: filterStatus === s ? 'hsl(220 25% 15%)' : 'hsl(220 15% 93%)', color: filterStatus === s ? 'white' : 'hsl(220 15% 45%)', fontFamily: 'inherit' }}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Table ── */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>
                    {filtered.length === 0 ? (
                        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.875rem' }}>🛡️</div>
                            <p style={{ fontSize: '0.9rem', color: 'hsl(220 15% 50%)', margin: '0 0 1.25rem', fontWeight: '500' }}>
                                {search || filterStatus !== 'all' ? 'No admin accounts match your filters.' : 'No admin accounts yet.'}
                            </p>
                            <button onClick={() => setShowAdd(true)}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.1rem', borderRadius: '0.6rem', border: '1.5px dashed hsl(214 60% 72%)', backgroundColor: 'hsl(214 100% 98%)', color: 'hsl(214 80% 46%)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                                <Icons.plus /> Add first admin
                            </button>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '740px' }}>
                                <thead>
                                    <tr>
                                        <SortTh field="name"   label="Admin" />
                                        <SortTh field="role"   label="Role" />
                                        <SortTh field="status" label="Status" align="center" />
                                        <SortTh field="login"  label="Last Active" />
                                        <SortTh field="date"   label="Created" />
                                        <PlainTh label="Actions" align="right" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(a => (
                                        <tr key={a.id}
                                            onMouseEnter={() => setHoveredRow(a.id)}
                                            onMouseLeave={() => setHoveredRow(null)}
                                            style={{ borderBottom: '1px solid hsl(220 15% 94%)', backgroundColor: hoveredRow === a.id ? 'hsl(220 25% 98.5%)' : 'white', transition: 'background-color 0.1s' }}>

                                            {/* Admin */}
                                            <td style={{ padding: '0.875rem 1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <Avatar name={a.name} email={a.email} />
                                                    <div>
                                                        <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'hsl(220 25% 14%)' }}>{a.name ?? '—'}</div>
                                                        <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 52%)' }}>{a.email}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td style={{ padding: '0.875rem 1rem' }}>
                                                <RoleBadge role={a.role} />
                                            </td>

                                            {/* Status */}
                                            <td style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>
                                                <StatusBadge status={a.status ?? 'active'} />
                                            </td>

                                            {/* Last active */}
                                            <td style={{ padding: '0.875rem 1rem' }}>
                                                <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'hsl(220 25% 22%)' }}>
                                                    {fmtRelative(a.last_active)}
                                                </div>
                                                {a.last_active && (
                                                    <div style={{ fontSize: '0.68rem', color: 'hsl(220 15% 55%)', marginTop: '0.1rem' }}>
                                                        {fmtDate(a.last_active)}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Created */}
                                            <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'hsl(220 15% 42%)', whiteSpace: 'nowrap' }}>
                                                {fmtDate(a.created_at)}
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '0.875rem 1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                                                    <Link href={`/super-admin/impersonate/${a.id}`} method="post" as="button"
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.65rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'hsl(270 60% 95%)', color: 'hsl(270 60% 42%)', border: 'none', cursor: 'pointer', textDecoration: 'none', transition: 'filter 0.12s', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
                                                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.92)'}
                                                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                                        <Icons.impersonate /> Impersonate
                                                    </Link>
                                                    <button 
                                                    onClick={() => setEditingAdmin(a)}
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.65rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'hsl(214 100% 95%)', color: 'hsl(214 80% 42%)', textDecoration: 'none', transition: 'filter 0.12s', whiteSpace: 'nowrap' }}
                                                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.92)'}
                                                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                                        <Icons.edit /> Edit
                                                    </button>
                                                    <button onClick={() => setDeleteTarget(a)}
                                                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem 0.55rem', borderRadius: '0.5rem', backgroundColor: 'hsl(0 70% 96%)', color: 'hsl(0 65% 48%)', border: 'none', cursor: 'pointer', transition: 'filter 0.12s', fontFamily: 'inherit' }}
                                                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.92)'}
                                                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                                        <Icons.trash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {editingAdmin && (
                    <div
                        style={{
                            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                            backgroundColor: 'hsl(222 28% 8% / 0.6)', backdropFilter: 'blur(5px)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                            overflow: 'auto',
                        }}
                        onClick={() => setEditingAdmin(null)}
                    >
                        <div
                            style={{ width: '90%', maxWidth: '900px', maxHeight: '90vh', overflow: 'auto', margin: '1rem auto' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <AdminEdit admin={editingAdmin} inline onClose={() => setEditingAdmin(null)} />
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes adminSpin    { to { transform: rotate(360deg); } }
                @keyframes adminSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes adminModalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
            `}</style>
        </>
    );
};

AdminsIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default AdminsIndex;