import React, { useState, useRef } from 'react';
import { Link, router, useForm, usePage, Head } from '@inertiajs/react';
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
    user:    () => <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" size="1.5rem" sw={1.5} />,
    shield:  () => <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" size="1.15rem" />,
    mail:    () => <Ico d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" size="0.95rem" />,
    lock:    () => <Ico d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" size="0.95rem" />,
    edit:    () => <Ico d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" size="0.9rem" />,
    check:   () => <Ico d="M5 13l4 4L19 7" size="0.85rem" />,
    x:       () => <Ico d="M6 18L18 6M6 6l12 12" size="0.85rem" />,
    eye:     () => <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} size="0.9rem" />,
    eyeOff:  () => <Ico d={["M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"]} size="0.9rem" />,
    clock:   () => <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size="0.9rem" />,
    key:     () => <Ico d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" size="0.95rem" />,
    activity:() => <Ico d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" size="1.15rem" />,
    spinner: () => (
        <svg style={{ width: '1rem', height: '1rem', animation: 'spSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return v; }
};

const fmtRelative = (v) => {
    if (!v) return '—';
    try {
        const diff = Date.now() - new Date(v);
        if (diff < 60000)      return 'Just now';
        if (diff < 3600000)    return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000)   return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 2592000000) return `${Math.floor(diff / 86400000)}d ago`;
        return fmtDate(v);
    } catch { return v; }
};

const avatarHue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

// ─── Field atoms ──────────────────────────────────────────────────────────────

const inputStyle = (focused, hasError) => ({
    width: '100%', padding: '0.6rem 0.875rem',
    border: `1.5px solid ${hasError ? 'hsl(0 65% 60%)' : focused ? 'hsl(220 60% 55%)' : 'hsl(220 15% 88%)'}`,
    borderRadius: '0.6rem', fontSize: '0.875rem', color: 'hsl(220 25% 16%)',
    backgroundColor: 'white', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    boxShadow: focused && !hasError ? '0 0 0 3px hsl(220 60% 55% / 0.11)' : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
});

const FField = ({ label, hint, error, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32rem' }}>
        {label && <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'hsl(220 25% 22%)' }}>{label}</label>}
        {children}
        {hint  && !error && <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(220 15% 55%)' }}>{hint}</p>}
        {error           && <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(0 65% 48%)', fontWeight: '600' }}>{error}</p>}
    </div>
);

const FInput = ({ hasError, ...props }) => {
    const [f, setF] = useState(false);
    return <input {...props} onFocus={() => setF(true)} onBlur={() => setF(false)} style={inputStyle(f, hasError)} />;
};

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ toast }) => toast ? (
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'spSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {toast.type === 'error' ? <Icons.x /> : <Icons.check />}
        {toast.msg}
    </div>
) : null;

// ─── Info row ─────────────────────────────────────────────────────────────────

const InfoRow = ({ label, value, mono = false }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid hsl(220 15% 95%)' }}>
        <span style={{ fontSize: '0.75rem', color: 'hsl(220 15% 52%)', fontWeight: '500' }}>{label}</span>
        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'hsl(220 25% 18%)', fontFamily: mono ? 'monospace' : 'inherit', textAlign: 'right' }}>{value ?? '—'}</span>
    </div>
);

// ─── Section card ─────────────────────────────────────────────────────────────

const Card = ({ title, icon, children, action }) => (
    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>
        <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid hsl(220 15% 93%)', backgroundColor: 'hsl(220 15% 98.5%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <span style={{ color: 'hsl(220 25% 35%)', display: 'flex' }}>{icon}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'hsl(220 25% 22%)' }}>{title}</span>
            </div>
            {action}
        </div>
        <div style={{ padding: '0.25rem 1.25rem 0.875rem' }}>{children}</div>
    </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const SuperAdminProfile = ({ admin, activity = [], stats = {} }) => {
    const a   = admin ?? {};
    const hue = avatarHue(a.name ?? 'S');

    const [activeTab,   setActiveTab]   = useState('profile');
    const [showPwForm,  setShowPwForm]  = useState(false);
    const [showPw,      setShowPw]      = useState({ current: false, new: false, confirm: false });
    const [toast,       setToast]       = useState(null);
    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    // ── Profile form ──────────────────────────────────────────────────────────
    const profileForm = useForm({
        name:  a.name  ?? '',
        email: a.email ?? '',
    });

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.patch('/super-admin/profile', {
            onSuccess: () => showToast('Profile updated successfully.'),
            onError:   () => showToast('Failed to update profile.', 'error'),
        });
    };

    // ── Password form ─────────────────────────────────────────────────────────
    const pwForm = useForm({
        current_password:      '',
        password:              '',
        password_confirmation: '',
    });

    const submitPassword = (e) => {
        e.preventDefault();
        pwForm.put('/super-admin/profile/password', {
            onSuccess: () => {
                showToast('Password changed successfully.');
                setShowPwForm(false);
                pwForm.reset();
            },
            onError: () => showToast('Password change failed. Check your current password.', 'error'),
        });
    };

    const TABS = [
        { key: 'profile',  label: 'Profile' },
        { key: 'security', label: 'Security' },
        { key: 'activity', label: 'Activity' },
    ];

    return (
        <>
        <Head>
            <title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
        </Head>
            <Toast toast={toast} />

            <div>
                {/* ── Dark gradient hero ── */}
                <div style={{ background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))', borderRadius: '1.25rem', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative' }}>
                    {/* Dot grid */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.07) 1px, transparent 1px)', backgroundSize: '22px 22px', pointerEvents: 'none' }} />
                    {/* Accent bar */}
                    <div style={{ height: '3px', background: 'linear-gradient(90deg, hsl(214 90% 55%), hsl(270 60% 55%), hsl(152 55% 45%))' }} />

                    <div style={{ position: 'relative', padding: '2rem 2rem 1.75rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
                        {/* Avatar + name */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            {a.avatar
                                ? <img src={a.avatar} alt="" style={{ width: '5rem', height: '5rem', borderRadius: '50%', objectFit: 'cover', border: '3px solid hsl(220 30% 30%)', boxShadow: '0 4px 20px hsl(220 28% 6% / 0.5)', flexShrink: 0 }} />
                                : <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', backgroundColor: `hsl(${hue} 50% 50%)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: '900', border: '3px solid hsl(220 30% 30%)', boxShadow: '0 4px 20px hsl(220 28% 6% / 0.5)', flexShrink: 0 }}>
                                    {(a.name ?? 'S').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                                  </div>
                            }
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', color: 'white', letterSpacing: '-0.02em' }}>
                                        {a.name ?? 'Super Admin'}
                                    </h1>
                                    {/* Super admin badge */}
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.65rem', borderRadius: '999px', backgroundColor: 'hsl(214 90% 55% / 0.2)', border: '1px solid hsl(214 90% 55% / 0.35)', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.08em', color: 'hsl(214 90% 72%)' }}>
                                        ⚡ SUPER ADMIN
                                    </span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.82rem', color: 'hsl(220 20% 58%)' }}>
                                    {a.email}
                                </p>
                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'hsl(220 20% 45%)' }}>
                                    Member since {fmtDate(a.created_at)}
                                    {a.last_active && <span> · Last login {fmtRelative(a.last_active)}</span>}
                                </p>
                            </div>
                        </div>

                        {/* Stats strip */}
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            {[
                                { label: 'Actions',   value: (stats.total_actions ?? activity.length).toLocaleString() },
                                { label: 'This Month', value: (stats.this_month   ?? 0).toLocaleString() },
                                { label: 'Admins',     value: (stats.admin_count  ?? 0).toLocaleString() },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'hsl(220 20% 50%)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '0.15rem' }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tab bar */}
                    <div style={{ padding: '0 2rem', display: 'flex', gap: '0.15rem', borderTop: '1px solid hsl(220 25% 22%)' }}>
                        {TABS.map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                style={{ padding: '0.75rem 1.1rem', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: activeTab === tab.key ? '700' : '500', color: activeTab === tab.key ? 'white' : 'hsl(220 20% 48%)', borderBottom: `2px solid ${activeTab === tab.key ? 'hsl(214 90% 62%)' : 'transparent'}`, transition: 'all 0.15s', marginBottom: '-1px' }}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Tab: Profile ── */}
                {activeTab === 'profile' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem', alignItems: 'start' }}>

                        {/* Left — edit form */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <Card title="Personal Information" icon={<Icons.user />}>
                                <form onSubmit={submitProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.75rem' }}>
                                    <FField label="Full Name" error={profileForm.errors.name}>
                                        <FInput
                                            value={profileForm.data.name}
                                            onChange={e => profileForm.setData('name', e.target.value)}
                                            placeholder="Your full name"
                                            hasError={!!profileForm.errors.name}
                                        />
                                    </FField>
                                    <FField label="Email Address" error={profileForm.errors.email} hint="Used to sign in and receive system notifications.">
                                        <FInput
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={e => profileForm.setData('email', e.target.value)}
                                            placeholder="your@email.com"
                                            hasError={!!profileForm.errors.email}
                                        />
                                    </FField>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                                        <button type="submit" disabled={profileForm.processing || !profileForm.isDirty}
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', borderRadius: '0.65rem', border: 'none', backgroundColor: (!profileForm.isDirty || profileForm.processing) ? 'hsl(220 15% 88%)' : 'hsl(220 25% 15%)', color: (!profileForm.isDirty || profileForm.processing) ? 'hsl(220 15% 55%)' : 'white', fontWeight: '700', fontSize: '0.85rem', cursor: (!profileForm.isDirty || profileForm.processing) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                                            {profileForm.processing ? <><Icons.spinner /> Saving…</> : profileForm.isDirty ? <><Icons.check /> Save Changes</> : 'Up to date'}
                                        </button>
                                    </div>
                                </form>
                            </Card>

                            {/* Account details — read only */}
                            <Card title="Account Details" icon={<Icons.shield />}>
                                <div style={{ paddingTop: '0.5rem' }}>
                                    <InfoRow label="Admin ID"    value={`#super_${a.id}`}         mono />
                                    <InfoRow label="Role"        value="Super Administrator" />
                                    <InfoRow label="Status"      value="Active" />
                                    <InfoRow label="Member Since" value={fmtDate(a.created_at)} />
                                    <InfoRow label="Last Login"  value={fmtRelative(a.last_active)} />
                                    <InfoRow label="Last Updated" value={fmtDate(a.updated_at)} />
                                </div>
                            </Card>
                        </div>

                        {/* Right — avatar + quick info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Avatar card */}
                            <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>
                                {a.avatar
                                    ? <img src={a.avatar} alt="" style={{ width: '5rem', height: '5rem', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.875rem', display: 'block', border: '3px solid hsl(220 15% 91%)' }} />
                                    : <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900', margin: '0 auto 0.875rem' }}>
                                        {(a.name ?? 'S').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                                      </div>
                                }
                                <p style={{ margin: '0 0 0.2rem', fontSize: '0.95rem', fontWeight: '800', color: 'hsl(220 25% 15%)' }}>{a.name}</p>
                                <p style={{ margin: '0 0 0.875rem', fontSize: '0.75rem', color: 'hsl(220 15% 52%)' }}>{a.email}</p>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.22rem 0.65rem', borderRadius: '999px', backgroundColor: 'hsl(214 100% 95%)', color: 'hsl(214 80% 42%)', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.06em' }}>
                                    ⚡ SUPER ADMIN
                                </span>
                            </div>

                            {/* Quick stats */}
                            <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>
                                <div style={{ padding: '0.75rem 1.1rem', borderBottom: '1px solid hsl(220 15% 93%)', backgroundColor: 'hsl(220 15% 98.5%)' }}>
                                    <span style={{ fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'hsl(220 25% 22%)' }}>Quick Stats</span>
                                </div>
                                <div style={{ padding: '0.25rem 1.1rem 0.75rem' }}>
                                    <InfoRow label="Total Actions"  value={(stats.total_actions ?? activity.length).toLocaleString()} />
                                    <InfoRow label="This Month"     value={(stats.this_month ?? 0).toLocaleString()} />
                                    <InfoRow label="Admins Managed" value={(stats.admin_count ?? 0).toLocaleString()} />
                                    <InfoRow label="Listings Reviewed" value={(stats.listings_reviewed ?? 0).toLocaleString()} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Tab: Security ── */}
                {activeTab === 'security' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem', alignItems: 'start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                            {/* Change password */}
                            <Card title="Change Password" icon={<Icons.key />}
                                action={
                                    <button onClick={() => setShowPwForm(v => !v)}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(220 25% 32%)', cursor: 'pointer', fontFamily: 'inherit' }}>
                                        <Icons.edit /> {showPwForm ? 'Cancel' : 'Change'}
                                    </button>
                                }>
                                {!showPwForm ? (
                                    <div style={{ paddingTop: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 15% 97.5%)', border: '1px solid hsl(220 15% 91%)' }}>
                                            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.55rem', backgroundColor: 'hsl(220 20% 92%)', color: 'hsl(220 25% 40%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icons.lock /></div>
                                            <div>
                                                <p style={{ margin: '0 0 0.1rem', fontSize: '0.82rem', fontWeight: '600', color: 'hsl(220 25% 18%)' }}>Password protected</p>
                                                <p style={{ margin: 0, fontSize: '0.72rem', color: 'hsl(220 15% 52%)' }}>Your password is set. Click "Change" to update it.</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={submitPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.875rem' }}>
                                        {/* Current password */}
                                        <FField label="Current Password" error={pwForm.errors.current_password}>
                                            <div style={{ position: 'relative' }}>
                                                <FInput
                                                    type={showPw.current ? 'text' : 'password'}
                                                    value={pwForm.data.current_password}
                                                    onChange={e => pwForm.setData('current_password', e.target.value)}
                                                    placeholder="Enter current password"
                                                    hasError={!!pwForm.errors.current_password}
                                                />
                                                <button type="button" onClick={() => setShowPw(p => ({ ...p, current: !p.current }))}
                                                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 55%)', display: 'flex', padding: 0 }}>
                                                    {showPw.current ? <Icons.eyeOff /> : <Icons.eye />}
                                                </button>
                                            </div>
                                        </FField>

                                        {/* New password */}
                                        <FField label="New Password" error={pwForm.errors.password} hint="Minimum 8 characters.">
                                            <div style={{ position: 'relative' }}>
                                                <FInput
                                                    type={showPw.new ? 'text' : 'password'}
                                                    value={pwForm.data.password}
                                                    onChange={e => pwForm.setData('password', e.target.value)}
                                                    placeholder="New password"
                                                    hasError={!!pwForm.errors.password}
                                                />
                                                <button type="button" onClick={() => setShowPw(p => ({ ...p, new: !p.new }))}
                                                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 55%)', display: 'flex', padding: 0 }}>
                                                    {showPw.new ? <Icons.eyeOff /> : <Icons.eye />}
                                                </button>
                                            </div>
                                        </FField>

                                        {/* Confirm password */}
                                        <FField label="Confirm New Password" error={pwForm.errors.password_confirmation}>
                                            <div style={{ position: 'relative' }}>
                                                <FInput
                                                    type={showPw.confirm ? 'text' : 'password'}
                                                    value={pwForm.data.password_confirmation}
                                                    onChange={e => pwForm.setData('password_confirmation', e.target.value)}
                                                    placeholder="Confirm new password"
                                                    hasError={!!pwForm.errors.password_confirmation}
                                                />
                                                <button type="button" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))}
                                                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 55%)', display: 'flex', padding: 0 }}>
                                                    {showPw.confirm ? <Icons.eyeOff /> : <Icons.eye />}
                                                </button>
                                            </div>
                                        </FField>

                                        {/* Strength indicator */}
                                        {pwForm.data.password && (() => {
                                            const pw  = pwForm.data.password;
                                            const score = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
                                            const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
                                            const colors = ['', 'hsl(0 65% 52%)', 'hsl(40 80% 44%)', 'hsl(40 70% 40%)', 'hsl(152 55% 36%)'];
                                            return (
                                                <div>
                                                    <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.3rem' }}>
                                                        {[1,2,3,4].map(i => (
                                                            <div key={i} style={{ flex: 1, height: '3px', borderRadius: '999px', backgroundColor: i <= score ? colors[score] : 'hsl(220 15% 88%)', transition: 'background-color 0.2s' }} />
                                                        ))}
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: '0.7rem', color: colors[score], fontWeight: '600' }}>{labels[score]}</p>
                                                </div>
                                            );
                                        })()}

                                        <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
                                            <button type="button" onClick={() => { setShowPwForm(false); pwForm.reset(); }}
                                                style={{ padding: '0.6rem 1rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>
                                                Cancel
                                            </button>
                                            <button type="submit" disabled={pwForm.processing}
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', borderRadius: '0.65rem', border: 'none', backgroundColor: pwForm.processing ? 'hsl(220 25% 55%)' : 'hsl(220 25% 15%)', color: 'white', fontWeight: '700', fontSize: '0.85rem', cursor: pwForm.processing ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                                                {pwForm.processing ? <><Icons.spinner /> Updating…</> : <><Icons.check /> Update Password</>}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </Card>

                            {/* Session info */}
                            <Card title="Session Info" icon={<Icons.clock />}>
                                <div style={{ paddingTop: '0.5rem' }}>
                                    <InfoRow label="Last Login"       value={fmtRelative(a.last_active)} />
                                    {/* <InfoRow label="Last Login IP"    value={a.last_login_ip ?? '—'} mono /> */}
                                    <InfoRow label="Account Created"  value={fmtDate(a.created_at)} />
                                    <InfoRow label="Password Updated" value={fmtDate(a.updated_at) ?? 'Unknown'} />
                                </div>
                            </Card>
                        </div>

                        {/* Right — security tips */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ backgroundColor: 'hsl(214 100% 98%)', border: '1px solid hsl(214 80% 90%)', borderRadius: '1rem', padding: '1.25rem' }}>
                                <p style={{ margin: '0 0 0.75rem', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(214 80% 46%)' }}>Security Tips</p>
                                {[
                                    'Use a strong password with uppercase, numbers, and symbols.',
                                    'Never share your credentials with anyone.',
                                    'Log out of shared devices after each session.',
                                    'Change your password periodically.',
                                    'Review the activity log regularly for unusual actions.',
                                ].map((tip, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: i < 4 ? '0.55rem' : 0 }}>
                                        <span style={{ color: 'hsl(214 80% 52%)', flexShrink: 0, marginTop: '0.05rem', display: 'flex' }}><Icons.check /></span>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(214 50% 35%)', lineHeight: 1.5 }}>{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Tab: Activity ── */}
                {activeTab === 'activity' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <Card title="Recent Activity" icon={<Icons.activity />}>
                            {activity.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'hsl(220 15% 55%)' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                                    <p style={{ margin: 0, fontSize: '0.85rem' }}>No activity recorded yet.</p>
                                </div>
                            ) : (
                                <div style={{ paddingTop: '0.5rem' }}>
                                    {activity.map((item, i) => {
                                        const isLast = i === activity.length - 1;
                                        return (
                                            <div key={item.id ?? i} style={{ display: 'flex', gap: '0.875rem', paddingBottom: isLast ? 0 : '1rem', marginBottom: isLast ? 0 : '1rem', borderBottom: isLast ? 'none' : '1px solid hsl(220 15% 95%)' }}>
                                                {/* Timeline dot */}
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                                    <div style={{ width: '0.65rem', height: '0.65rem', borderRadius: '50%', backgroundColor: 'hsl(214 80% 50%)', border: '2px solid hsl(214 100% 92%)', marginTop: '0.2rem' }} />
                                                    {!isLast && <div style={{ width: '1px', flex: 1, backgroundColor: 'hsl(220 15% 91%)', marginTop: '0.3rem' }} />}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ margin: '0 0 0.15rem', fontSize: '0.83rem', fontWeight: '600', color: 'hsl(220 25% 18%)' }}>
                                                        {item.action ?? item.title ?? 'Action performed'}
                                                    </p>
                                                    {(item.notes ?? item.description) && (
                                                        <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', color: 'hsl(220 15% 48%)', lineHeight: 1.5 }}>
                                                            {item.notes ?? item.description}
                                                        </p>
                                                    )}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                        <span style={{ fontSize: '0.68rem', color: 'hsl(220 15% 55%)' }}>
                                                            {fmtRelative(item.created_at ?? item.timestamp)}
                                                        </span>
                                                        {item.type && (
                                                            <span style={{ fontSize: '0.62rem', fontWeight: '700', padding: '0.1rem 0.4rem', borderRadius: '999px', backgroundColor: 'hsl(220 15% 94%)', color: 'hsl(220 15% 42%)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                                                {item.type}
                                                            </span>
                                                        )}
                                                        {item.ip && (
                                                            <span style={{ fontSize: '0.65rem', color: 'hsl(220 15% 60%)', fontFamily: 'monospace' }}>
                                                                {item.ip}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid hsl(220 15% 93%)', textAlign: 'center' }}>
                                        <Link href="/super-admin/audit-log"
                                            style={{ fontSize: '0.8rem', fontWeight: '600', color: 'hsl(214 80% 46%)', textDecoration: 'none' }}
                                            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                                            View full audit log →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spSpin    { to { transform: rotate(360deg); } }
                @keyframes spSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
            `}</style>
        </>
    );
};

SuperAdminProfile.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default SuperAdminProfile;