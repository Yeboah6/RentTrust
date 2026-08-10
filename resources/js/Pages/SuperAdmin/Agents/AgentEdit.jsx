import React, { useState, useRef } from 'react';
import { Link, router, useForm, Head } from '@inertiajs/react';
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
    save:    () => <Ico d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />,
    check:   () => <Ico d="M5 13l4 4L19 7" size="0.82rem" />,
    x:       () => <Ico d="M6 18L18 6M6 6l12 12" />,
    ban:     () => <Ico d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />,
    trash:   () => <Ico d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    unlock:  () => <Ico d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />,
    shield:  () => <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    eye:     () => <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} />,
    eyeOff:  () => <Ico d={["M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"]} />,
    alert:   () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size="1.05rem" />,
    reset:   () => <Ico d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" size="0.88rem" />,
    user:    () => <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" size="1.1rem" />,
    clock:   () => <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size="0.85rem" />,
    spinner: () => (
        <svg style={{ width: '1rem', height: '1rem', animation: 'ageSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
    active:    { label: 'Active',    bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 28%)', dot: 'hsl(152 60% 38%)' },
    pending:   { label: 'Pending',   bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 30%)',  dot: 'hsl(40 80% 44%)' },
    verified:  { label: 'Verified',  bg: 'hsl(214 100% 95%)',color: 'hsl(214 80% 38%)', dot: 'hsl(214 80% 50%)' },
    suspended: { label: 'Suspended', bg: 'hsl(0 70% 95%)',   color: 'hsl(0 65% 40%)',   dot: 'hsl(0 65% 50%)' },
    rejected:  { label: 'Rejected',  bg: 'hsl(0 70% 95%)',   color: 'hsl(0 65% 40%)',   dot: 'hsl(0 65% 50%)' },
    inactive:  { label: 'Inactive',  bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)' },
};

const TIERS = [
    { value: 'basic',    label: 'Basic',    desc: 'Entry level access',       activeBorder: 'hsl(220 15% 60%)', activeBg: 'hsl(220 15% 97%)', glow: 'hsl(220 15% 60% / 0.15)', tagBg: 'hsl(220 15% 93%)', tagColor: 'hsl(220 15% 38%)' },
    { value: 'standard', label: 'Standard', desc: 'Standard platform access', activeBorder: 'hsl(214 80% 55%)', activeBg: 'hsl(214 100% 98%)', glow: 'hsl(214 80% 55% / 0.12)', tagBg: 'hsl(214 100% 95%)', tagColor: 'hsl(214 80% 40%)' },
    { value: 'pro',      label: 'Pro',      desc: 'Priority features',        activeBorder: 'hsl(270 60% 55%)', activeBg: 'hsl(270 60% 98%)', glow: 'hsl(270 60% 55% / 0.12)', tagBg: 'hsl(270 60% 95%)', tagColor: 'hsl(270 55% 40%)' },
    { value: 'premium',  label: 'Premium',  desc: 'Full featured + priority', activeBorder: 'hsl(40 80% 50%)',  activeBg: 'hsl(40 90% 98%)',  glow: 'hsl(40 80% 50% / 0.12)',  tagBg: 'hsl(40 90% 93%)',  tagColor: 'hsl(40 80% 30%)' },
];

const ALL_STATUSES = ['active', 'pending', 'verified', 'suspended', 'rejected', 'inactive'];
// Add this constant near your other configs at the top
const AGENT_TYPES = [
    'Agent',
    'Landlord',
];

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
    boxShadow: focused && !hasError ? '0 0 0 3px hsl(220 60% 55% / 0.11)' : hasError ? '0 0 0 3px hsl(0 65% 55% / 0.1)' : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
});

const FField = ({ label, required, hint, error, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32rem' }}>
        {label && <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'hsl(220 25% 22%)', letterSpacing: '0.01em' }}>{label}{required && <span style={{ color: 'hsl(0 65% 52%)', marginLeft: '0.2rem' }}>*</span>}</label>}
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
            {suffix && <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', cursor: 'pointer' }}>{suffix}</span>}
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
    <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', paddingBottom: '0.4rem', borderBottom: '1px solid hsl(220 15% 94%)' }}>{children}</p>
);

const StatusBadge = ({ sk }) => {
    const c = STATUS_CFG[sk] ?? STATUS_CFG.inactive;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.06em', backgroundColor: c.bg, color: c.color }}>
            <span style={{ width: '0.35rem', height: '0.35rem', borderRadius: '50%', backgroundColor: c.dot }} />{c.label.toUpperCase()}
        </span>
    );
};

const Toast = ({ toast }) => toast ? (
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'ageSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {toast.type === 'error' ? <Icons.x /> : <Icons.check />}{toast.msg}
    </div>
) : null;

// ─── Confirm modal ────────────────────────────────────────────────────────────

const ConfirmModal = ({ action, agentName, onConfirm, onClose, processing }) => {
    const meta = {
        suspend:  { label: 'Suspend Agent',  body: `Suspend ${agentName}? They will immediately lose access to the platform.`, warn: true,  confirmBg: 'hsl(0 65% 50%)',   confirmLabel: 'Suspend',    icon: Icons.ban },
        delete:   { label: 'Delete Agent',   body: `Permanently delete ${agentName}? This removes their account and all listings.`, warn: true, confirmBg: 'hsl(0 65% 50%)', confirmLabel: 'Delete',     icon: Icons.trash },
        reactivate:{ label: 'Reactivate',    body: `Reactivate ${agentName}? They will regain full platform access.`, warn: false, confirmBg: 'hsl(152 55% 33%)', confirmLabel: 'Reactivate', icon: Icons.unlock },
    };
    const m = meta[action] ?? meta.delete;
    const ActionIcon = m.icon;
    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.65)', backdropFilter: 'blur(5px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '400px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.1rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.32)', animation: 'ageModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ height: '4px', background: `linear-gradient(90deg, ${m.confirmBg}, ${m.confirmBg}88)` }} />
                <div style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.75rem', backgroundColor: action === 'reactivate' ? 'hsl(152 55% 92%)' : 'hsl(0 70% 95%)', color: m.confirmBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ActionIcon /></div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>{m.label}</h3>
                    </div>
                    <p style={{ margin: '0 0 1rem', fontSize: '0.83rem', color: 'hsl(220 15% 35%)', lineHeight: 1.65 }}>{m.body}</p>
                    {m.warn && (
                        <div style={{ padding: '0.6rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 65% 88%)', fontSize: '0.75rem', color: 'hsl(0 55% 38%)', marginBottom: '1.25rem' }}>
                            ⚠ This action cannot be undone.
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                        <button onClick={onConfirm} disabled={processing}
                            style={{ flex: 2, padding: '0.625rem', borderRadius: '0.6rem', border: 'none', backgroundColor: processing ? 'hsl(220 25% 55%)' : m.confirmBg, color: 'white', fontSize: '0.85rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit' }}>
                            {processing ? <><Icons.spinner />{m.confirmLabel}…</> : <><ActionIcon /> {m.confirmLabel}</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const AgentEdit = ({ agent: a }) => {
    const statusKey = (a.status ?? 'pending').toLowerCase();
    const hue       = avatarHue(a.name ?? '');

    const { data, setData, put, processing, errors, isDirty, reset } = useForm({
        name:                  a.name         ?? a.full_name    ?? '',
        email:                 a.email        ?? '',
        phone:                 a.phone        ?? a.phone_number ?? '',
        company:               a.company      ?? '',
        type:                  a.type         ?? '',
        location:              a.location     ?? a.city         ?? '',
        bio:                   a.bio          ?? a.about        ?? '',
        status:                statusKey,
        // is_verified:           a.is_verified  ?? false,
        password:              '',
        password_confirmation: '',
    });

    const [confirmAct, setConfirmAct] = useState(null);
    const [actLoading, setActLoading] = useState(false);
    const [toast,      setToast]      = useState(null);
    const [showPw, setShowPw] = useState(false);
    const [showPw2, setShowPw2] = useState(false);

    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/super-admin/agents/${a.id}`, {
            preserveScroll: true,
            onSuccess: () => showToast('Agent account updated successfully.'),
            onError:   () => showToast('Please fix the errors below.', 'error'),
        });
    };

    const confirmAction = () => {
        setActLoading(true);
        const map = {
            suspend:    { method: 'post',   url: `/super-admin/agents/${a.id}/suspend` },
            reactivate: { method: 'post',   url: `/super-admin/agents/${a.id}/reactivate` },
            delete:     { method: 'delete', url: `/super-admin/agents/${a.id}` },
        };
        const { method, url } = map[confirmAct];
        router[method](url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                if (confirmAct === 'delete') {
                    router.visit('/super-admin/agents');
                } else {
                    showToast(`Agent ${confirmAct}d successfully.`);
                    setConfirmAct(null);
                    router.reload({ only: ['agent'] });
                }
            },
            onError:  () => { showToast('Action failed.', 'error'); setActLoading(false); },
            onFinish: () => setActLoading(false),
        });
    };

    const initials     = data.name ? data.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : null;
    const liveHue      = avatarHue(data.name || '');
    const isSuspended = (data.status ?? statusKey) === 'suspended';

    return (
        <>
        <Head>
           <title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
        </Head>
            <Toast toast={toast} />
            {confirmAct && (
                <ConfirmModal
                    action={confirmAct}
                    agentName={a.name ?? a.email}
                    onConfirm={confirmAction}
                    onClose={() => setConfirmAct(null)}
                    processing={actLoading}
                />
            )}

            <div>
                {/* ── Unsaved changes banner ── */}
                {isDirty && (
                    <div style={{ position: 'sticky', top: 0, zIndex: 30, marginBottom: '0.75rem', padding: '0.65rem 1.1rem', borderRadius: '0.65rem', backgroundColor: 'hsl(40 90% 95%)', border: '1px solid hsl(40 80% 82%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', animation: 'ageSlideIn 0.2s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                            <span style={{ color: 'hsl(36 80% 40%)', display: 'flex', flexShrink: 0 }}><Icons.alert /></span>
                            <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: '600', color: 'hsl(36 70% 30%)' }}>You have unsaved changes</p>
                        </div>
                        <button type="button" onClick={() => reset()}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: '0.45rem', border: '1px solid hsl(40 70% 70%)', backgroundColor: 'white', color: 'hsl(36 70% 32%)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                            <Icons.reset /> Reset changes
                        </button>
                    </div>
                )}

                {/* ── Page header ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link href={`/super-admin/agents/${a.id}`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                            <Icons.back /> Back
                        </Link>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.15rem', letterSpacing: '-0.02em' }}>Edit Agent</h1>
                            <p style={{ fontSize: '0.8rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                                Editing <strong style={{ color: 'hsl(220 25% 22%)' }}>{a.name}</strong>
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'hsl(220 15% 52%)' }}>#{a.id}</span>
                        <StatusBadge sk={statusKey} />
                    </div>
                </div>

                {/* ── Two-column layout ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>

                    {/* ═══ LEFT: form ═══════════════════════════════════════════ */}
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>

                        {/* Dark gradient header */}
                        <div style={{ background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))', padding: '1.5rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.07) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {/* Live avatar */}
                                    <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: initials ? `hsl(${liveHue} 50% 50%)` : 'hsl(220 25% 30%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: initials ? '0.9rem' : '1rem', fontWeight: '800', transition: 'background-color 0.3s', border: '2px solid hsl(220 30% 30%)', boxShadow: '0 2px 12px hsl(220 28% 6% / 0.4)', flexShrink: 0 }}>
                                        {initials ?? <Icons.user />}
                                    </div>
                                    <div>
                                        <h2 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: '800', color: 'white', letterSpacing: '-0.01em' }}>
                                            {data.name || 'Agent Account'}
                                        </h2>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(220 20% 62%)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            {data.email || 'No email set'}
                                            {isDirty && <span style={{ color: 'hsl(40 85% 60%)', fontWeight: '600' }}>· Unsaved changes</span>}
                                        </p>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.07em', color: 'hsl(220 20% 55%)', backgroundColor: 'hsl(220 25% 25%)', padding: '0.25rem 0.6rem', borderRadius: '0.4rem' }}>
                                    AGENT #{a.id}
                                </span>
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
                                        <FField label="Agency / Company" error={errors.company}>
                                            <FInput value={data.company} onChange={e => setData('company', e.target.value)} placeholder="e.g. Devtraco Properties" />
                                        </FField>
                                        <FField label="Type of Agent" error={errors.type}>
                                        <FSelect value={data.type} onChange={e => setData('type', e.target.value)}>
                                            {AGENT_TYPES.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </FSelect>
                                    </FField>
                                    </div>
                                </div>

                                {/* ── Status & flags ── */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <SectionLabel>Status & Visibility</SectionLabel>
                                    <FField label="Account Status" error={errors.status}>
                                        <FSelect value={data.status} onChange={e => setData('status', e.target.value)}>
                                            {ALL_STATUSES.map(s => {
                                                const cfg = STATUS_CFG[s];
                                                return <option key={s} value={s}>{cfg?.label ?? s}</option>;
                                            })}
                                        </FSelect>
                                    </FField>
                                    {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                                        <Toggle value={data.is_verified} onChange={v => setData('is_verified', v)} label="Verified Agent" sub="Shows the blue verified checkmark on their profile and listings" />
                                        <Toggle value={data.is_featured} onChange={v => setData('is_featured', v)} label="Featured Agent" sub="Agent appears in featured agent sections" />
                                    </div> */}
                                </div>

                                {/* ── Password ── */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <SectionLabel>Reset Password</SectionLabel>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(220 15% 52%)' }}>Leave both fields blank to keep the current password unchanged.</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                        <FField label="New Password" error={errors.password}>
                                            <FInput type={showPw ? 'text' : 'password'} value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Min. 8 characters" hasError={!!errors.password}
                                                suffix={<button type="button" onClick={() => setShowPw(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 52%)', display: 'flex', padding: 0 }}>{showPw ? <Icons.eyeOff /> : <Icons.eye />}</button>} />
                                        </FField>
                                        <FField label="Confirm Password" error={errors.password_confirmation}>
                                            <FInput type={showPw2 ? 'text' : 'password'} value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} placeholder="Repeat password" hasError={!!errors.password_confirmation}
                                                suffix={<button type="button" onClick={() => setShowPw2(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 52%)', display: 'flex', padding: 0 }}>{showPw2 ? <Icons.eyeOff /> : <Icons.eye />}</button>} />
                                        </FField>
                                    </div>
                                </div>
                            </div>

                            {/* ── Footer ── */}
                            <div style={{ padding: '1rem 1.75rem 1.5rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                                <Link href={`/super-admin/agents/${a.id}`}
                                    style={{ flex: 1, padding: '0.65rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 30%)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                                    Cancel
                                </Link>
                                <button type="submit" disabled={processing || !isDirty}
                                    style={{ flex: 2, padding: '0.65rem', borderRadius: '0.65rem', border: 'none', backgroundColor: (!isDirty || processing) ? 'hsl(220 15% 80%)' : 'hsl(220 25% 15%)', color: (!isDirty || processing) ? 'hsl(220 15% 55%)' : 'white', fontSize: '0.875rem', fontWeight: '700', cursor: (!isDirty || processing) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { if (isDirty && !processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'; }}
                                    onMouseLeave={e => { if (isDirty && !processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'; }}>
                                    {processing ? <><Icons.spinner /> Saving…</> : isDirty ? <><Icons.save /> Save Changes</> : <><Icons.check /> Up to date</>}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ═══ RIGHT: sidebar ═══════════════════════════════════════ */}
                    <div style={{ position: 'sticky', top: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* Record info */}
                        <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', overflow: 'hidden', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                            <div style={{ padding: '0.7rem 1rem', borderBottom: '1px solid hsl(220 15% 94%)', backgroundColor: 'hsl(220 15% 98.5%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'hsl(220 25% 22%)' }}>Account Info</p>
                                <StatusBadge sk={statusKey} />
                            </div>
                            <div style={{ padding: '0.5rem 1rem 0.75rem' }}>
                                {[
                                    { label: 'Agent ID',    value: `#${a.id}` },
                                    { label: 'Listings',    value: (a.listings_count ?? a.total_listings ?? 0).toLocaleString() },
                                    { label: 'Sold/Rented', value: a.sold_count ?? a.properties_sold ?? 0 },
                                    { label: 'Joined',      value: fmtDate(a.joined_at ?? a.created_at) },
                                    { label: 'Last Active', value: fmtRelative(a.last_active ?? a.last_login_at) },
                                    { label: 'Updated',     value: fmtDate(a.updated_at) },
                                ].map(({ label, value }) => (
                                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0', borderBottom: '1px solid hsl(220 15% 95%)' }}>
                                        <span style={{ fontSize: '0.74rem', color: 'hsl(220 15% 52%)' }}>{label}</span>
                                        <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'hsl(220 25% 22%)' }}>{value ?? '—'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick actions */}
                        <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '1rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                            <p style={{ margin: '0 0 0.75rem', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)' }}>Quick Actions</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                                <Link href={`/super-admin/agents/${a.id}`}
                                    style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(214 80% 88%)', backgroundColor: 'hsl(214 100% 97%)', color: 'hsl(214 80% 44%)', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', textDecoration: 'none', boxSizing: 'border-box', transition: 'filter 0.12s' }}
                                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                    <Icons.eye /> View Profile
                                </Link>
                                {isSuspended ? (
                                    <button type="button" onClick={() => setConfirmAct('reactivate')}
                                        style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(152 55% 80%)', backgroundColor: 'hsl(152 55% 96%)', color: 'hsl(152 55% 32%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                        <Icons.unlock /> Reactivate Account
                                    </button>
                                ) : (
                                    <button type="button" onClick={() => setConfirmAct('suspend')}
                                        style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(0 65% 88%)', backgroundColor: 'hsl(0 65% 97%)', color: 'hsl(0 62% 46%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                        <Icons.ban /> Suspend Account
                                    </button>
                                )}
                                <button type="button" onClick={() => setConfirmAct('delete')}
                                    style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(0 65% 88%)', backgroundColor: 'hsl(0 65% 97%)', color: 'hsl(0 62% 46%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                    <Icons.trash /> Delete Agent
                                </button>
                            </div>
                        </div>

                        {/* Danger zone */}
                        <div style={{ backgroundColor: 'hsl(0 70% 98%)', border: '1px solid hsl(0 65% 88%)', borderRadius: '0.875rem', padding: '1rem' }}>
                            <p style={{ margin: '0 0 0.4rem', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(0 65% 44%)' }}>Danger Zone</p>
                            <p style={{ margin: '0 0 0.75rem', fontSize: '0.74rem', color: 'hsl(0 40% 45%)', lineHeight: 1.55 }}>
                                Deleting this agent permanently removes their account and all {(a.listings_count ?? 0)} listing{(a.listings_count ?? 0) !== 1 ? 's' : ''}.
                            </p>
                            <button type="button" onClick={() => setConfirmAct('delete')}
                                style={{ width: '100%', padding: '0.55rem', borderRadius: '0.55rem', border: 'none', backgroundColor: 'hsl(0 65% 50%)', color: 'white', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                <Icons.trash /> Delete This Agent
                            </button>
                        </div>

                        {/* Last login */}
                        {(a.last_active ?? a.last_login_at) && (
                            <div style={{ padding: '0.75rem 1rem', borderRadius: '0.65rem', backgroundColor: 'hsl(214 100% 98%)', border: '1px solid hsl(214 80% 90%)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: 'hsl(214 80% 48%)', flexShrink: 0, display: 'flex' }}><Icons.clock /></span>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.73rem', fontWeight: '600', color: 'hsl(214 60% 35%)' }}>Last seen {fmtRelative(a.last_active ?? a.last_login_at)}</p>
                                    <p style={{ margin: 0, fontSize: '0.68rem', color: 'hsl(214 50% 55%)' }}>{fmtDate(a.last_active ?? a.last_login_at)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes ageSpin    { to { transform: rotate(360deg); } }
                @keyframes ageSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes ageModalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
            `}</style>
        </>
    );
};

AgentEdit.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default AgentEdit;