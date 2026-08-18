import React, { useState, useRef } from 'react';
import { router, useForm, Head } from '@inertiajs/react';
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
    back:    () => <Ico d="M15 19l-7-7 7-7" size="0.9rem" />,
    x:       () => <Ico d="M6 18L18 6M6 6l12 12" />,
    check:   () => <Ico d="M5 13l4 4L19 7" size="0.82rem" />,
    save:    () => <Ico d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" size="1rem" />,
    shield:  () => <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" size="0.75rem" />,
    eye:     () => <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} />,
    eyeOff:  () => <Ico d={["M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"]} />,
    alert:   () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size="1.1rem" />,
    ban:     () => <Ico d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />,
    unlock:  () => <Ico d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />,
    mail:    () => <Ico d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    reset:   () => <Ico d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" size="0.88rem" />,
    trash:   () => <Ico d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    clock:   () => <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size="0.85rem" />,
    spinner: () => (
        <svg style={{ width: '1rem', height: '1rem', animation: 'adminEditSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Config ───────────────────────────────────────────────────────────────────

const ROLES = [
    { value: 'admin',       name: "Admin",       tag: 'ADMIN',   tagBg: 'hsl(214 80% 93%)', tagColor: 'hsl(214 80% 42%)', desc: 'Standard platform access',   activeBorder: 'hsl(220 60% 55%)', activeBg: 'hsl(214 100% 98%)', glow: 'hsl(220 60% 55% / 0.11)' },
    { value: 'super_admin', name: "Super Admin", tag: '★ SUPER', tagBg: 'hsl(270 60% 93%)', tagColor: 'hsl(270 60% 42%)', desc: 'Full unrestricted access',    activeBorder: 'hsl(270 60% 55%)', activeBg: 'hsl(270 60% 98%)', glow: 'hsl(270 60% 55% / 0.11)' },
];

const STATUS_CFG = {
    active:    { label: 'Active',    bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 30%)', dot: 'hsl(152 60% 40%)' },
    inactive:  { label: 'Inactive',  bg: 'hsl(220 15% 92%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)' },
    suspended: { label: 'Suspended', bg: 'hsl(0 70% 94%)',   color: 'hsl(0 65% 42%)',   dot: 'hsl(0 65% 52%)' },
    pending:   { label: 'Pending',   bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 35%)',  dot: 'hsl(40 80% 48%)' },
};

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

// ─── Field atoms ──────────────────────────────────────────────────────────────

const fieldStyle = (focused, hasError) => ({
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
                style={{ ...fieldStyle(f, hasError), paddingRight: suffix ? '2.5rem' : '0.875rem' }} />
            {suffix && (
                <span style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                    {suffix}
                </span>
            )}
        </div>
    );
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

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ toast }) => toast ? (
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : toast.type === 'info' ? 'hsl(220 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'adminEditSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {toast.type === 'error' ? <Icons.x /> : toast.type === 'info' ? <Icons.mail /> : <Icons.check />}
        {toast.msg}
    </div>
) : null;

// ─── Confirm action modal (suspend / reactivate) ──────────────────────────────

const ConfirmModal = ({ action, adminName, onConfirm, onClose, processing }) => {
    const isSuspend = action === 'suspend';
    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.65)', backdropFilter: 'blur(5px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '400px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.1rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.32)', animation: 'adminEditModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ height: '4px', background: isSuspend ? 'linear-gradient(90deg, hsl(0 65% 52%), hsl(0 75% 62%))' : 'linear-gradient(90deg, hsl(152 55% 40%), hsl(152 65% 50%))' }} />
                <div style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.75rem', backgroundColor: isSuspend ? 'hsl(0 70% 94%)' : 'hsl(152 55% 92%)', color: isSuspend ? 'hsl(0 65% 48%)' : 'hsl(152 55% 33%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {isSuspend ? <Icons.ban /> : <Icons.unlock />}
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 0.12rem', fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>
                                    {isSuspend ? 'Suspend Admin' : 'Reactivate Admin'}
                                </h3>
                                <p style={{ margin: 0, fontSize: '0.73rem', color: 'hsl(220 15% 50%)' }}>{adminName}</p>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 55%)', padding: '0.2rem', display: 'flex' }}><Icons.x /></button>
                    </div>

                    <p style={{ fontSize: '0.83rem', color: 'hsl(220 15% 35%)', lineHeight: 1.65, margin: '0 0 1rem' }}>
                        {isSuspend
                            ? `Suspending ${adminName} will immediately revoke their access to the admin panel. All active sessions will be invalidated.`
                            : `Reactivating ${adminName} will restore their access to the admin panel based on their assigned role.`
                        }
                    </p>

                    {isSuspend && (
                        <div style={{ padding: '0.6rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 65% 88%)', fontSize: '0.75rem', color: 'hsl(0 55% 38%)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                            ⚠ This admin will lose access immediately.
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                        <button onClick={onConfirm} disabled={processing}
                            style={{ flex: 2, padding: '0.625rem', borderRadius: '0.6rem', border: 'none', backgroundColor: processing ? 'hsl(220 25% 55%)' : isSuspend ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontSize: '0.85rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit' }}>
                            {processing ? <><Icons.spinner />{isSuspend ? 'Suspending…' : 'Reactivating…'}</> : isSuspend ? <><Icons.ban /> Suspend</> : <><Icons.unlock /> Reactivate</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const AdminEdit = ({ admin, inline, onClose }) => {
    const { data, setData, put, processing, errors, isDirty, reset } = useForm({
        name:                  admin.name     ?? '',
        email:                 admin.email    ?? '',
        role:                  admin.role     ?? 'Admin',
        password:              '',
        password_confirmation: '',
    });

    const originalRole = admin.role ?? 'Admin';
    const roleChanged  = data.role !== originalRole;

    const [showPw,      setShowPw]      = useState(false);
    const [showPw2,     setShowPw2]     = useState(false);
    const [confirmAct,  setConfirmAct]  = useState(null); // 'suspend' | 'reactivate'
    const [actLoading,  setActLoading]  = useState(false);
    const [toast,       setToast]       = useState(null);
    const [resendingEmail, setResendingEmail] = useState(false);
    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/super-admin/admins/${admin.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                showToast('Admin account updated successfully.');
                if (inline) {
                    onClose?.();
                    router.reload({ only: ['admins'] });
                }
            },
            onError:   () => showToast('Please fix the errors below.', 'error'),
        });
    };

    const confirmAction = () => {
        setActLoading(true);
        const isSuspend = confirmAct === 'suspend';
        router.post(`/super-admin/admins/${admin.id}/${isSuspend ? 'suspend' : 'reactivate'}`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                showToast(isSuspend ? `${admin.name} suspended.` : `${admin.name} reactivated.`);
                setConfirmAct(null);
                if (inline) {
                    router.reload({ only: ['admins'] });
                } else {
                    router.reload({ only: ['admin'] });
                }
            },
            onError: () => showToast('Action failed. Please try again.', 'error'),
            onFinish: () => setActLoading(false),
        });
    };

    const resendInvite = () => {
        setResendingEmail(true);
        showToast(`Sending invitation to ${admin.email}...`, 'info');
        
        router.post(`/super-admin/admins/${admin.id}/resend-invite`, {
            preserveScroll: true,
            onSuccess: () => {
                showToast(`Invitation email sent successfully to ${admin.email}`, 'success');
            },
            onError: (errors) => {
                console.error('Failed to resend invitation:', errors);
                showToast('Failed to resend invitation. Please try again.', 'error');
            },
            onFinish: () => setResendingEmail(false),
        });
    };

    // Live header avatar colour from name/email
    const str      = data.name || data.email || '';
    const hue      = [...str].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    const initials = str ? str.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : null;
    const isSuspended = (admin.status ?? '').toLowerCase() === 'suspended';

    const content = (
        <>
            <Toast toast={toast} />
            {confirmAct && (
                <ConfirmModal
                    action={confirmAct}
                    adminName={admin.name ?? admin.email}
                    onConfirm={confirmAction}
                    onClose={() => setConfirmAct(null)}
                    processing={actLoading}
                />
            )}

            <div>
                {/* ── Unsaved changes banner ── */}
                {isDirty && (
                    <div style={{ position: 'sticky', top: 0, zIndex: 30, marginBottom: '0.75rem', padding: '0.65rem 1.1rem', borderRadius: '0.65rem', backgroundColor: 'hsl(40 90% 95%)', border: '1px solid hsl(40 80% 82%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', animation: 'adminEditSlideIn 0.2s ease' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {!inline && (
                            <a href="/super-admin/admins"
                                onClick={e => { e.preventDefault(); router.visit('/super-admin/admins'); }}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', transition: 'background-color 0.15s', cursor: 'pointer' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                                <Icons.back /> Back
                            </a>
                        )}
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'hsl(220 25% 14%)', margin: '0 0 0.15rem' }}>Edit Admin</h1>
                            <p style={{ fontSize: '0.8rem', color: 'hsl(220 15% 50%)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                Updating <strong style={{ color: 'hsl(220 25% 22%)' }}>{admin.name ?? admin.email}</strong>
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'hsl(220 15% 52%)', fontWeight: '500' }}>
                            Joined {fmtDate(admin.created_at)}
                        </span>
                        <StatusBadge status={admin.status ?? 'active'} />
                    </div>
                </div>

                {/* ── Main card with AddAdmin design ── */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>

                    {/* Dark header — mirrors AddAdminModal */}
                    <div style={{ background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))', padding: '1.5rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.07) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {/* Live avatar */}
                                <div style={{ width: '3rem', height: '3rem', borderRadius: '0.875rem', backgroundColor: initials ? `hsl(${hue} 50% 50%)` : 'hsl(220 25% 30%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: initials ? '0.9rem' : '1rem', fontWeight: 800, letterSpacing: '0.02em', transition: 'background-color 0.3s', border: '2px solid hsl(220 30% 30%)', boxShadow: '0 2px 12px hsl(220 28% 6% / 0.4)', flexShrink: 0 }}>
                                    {initials ?? <Icons.shield />}
                                </div>
                                <div>
                                    <h2 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: 800, color: 'white', letterSpacing: '-0.01em' }}>
                                        {data.name || data.email || 'Admin Account'}
                                    </h2>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(220 20% 62%)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        {data.email || 'No email set'}
                                        {isDirty && <span style={{ color: 'hsl(40 85% 60%)', fontWeight: '600' }}>· Unsaved changes</span>}
                                    </p>
                                </div>
                            </div>
                            {/* Admin ID badge */}
                            <span style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.07em', color: 'hsl(220 20% 55%)', backgroundColor: 'hsl(220 25% 25%)', padding: '0.25rem 0.6rem', borderRadius: '0.4rem' }}>
                                ADMIN #{admin.id}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

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
                                {/* Role changed warning */}
                                {roleChanged && (
                                    <div style={{ padding: '0.65rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(40 90% 96%)', border: '1px solid hsl(40 80% 84%)', fontSize: '0.76rem', color: 'hsl(36 75% 33%)', lineHeight: 1.5, display: 'flex', gap: '0.5rem', alignItems: 'flex-start', animation: 'adminEditSlideIn 0.2s ease', marginBottom: '0.6rem' }}>
                                        <span style={{ flexShrink: 0, marginTop: '0.05rem', display: 'flex' }}><Icons.alert /></span>
                                        <span>Changing from <strong>{originalRole}</strong> to <strong>{data.role}</strong>. This affects access permissions immediately on save.</span>
                                    </div>
                                )}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                                    {ROLES.map(r => {
                                        const active = data.role === r.value;
                                        return (
                                            <button type="button" key={r.value} onClick={() => setData('role', r.value)}
                                                style={{ padding: '0.75rem 0.875rem', borderRadius: '0.7rem', border: `1.5px solid ${active ? r.activeBorder : 'hsl(220 15% 88%)'}`, backgroundColor: active ? r.activeBg : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'inherit', boxShadow: active ? `0 0 0 3px ${r.glow}` : 'none' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                                    <span style={{ fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.07em', color: active ? r.tagColor : 'hsl(220 15% 50%)', padding: '0.15rem 0.45rem', borderRadius: '0.3rem', backgroundColor: active ? r.tagBg : 'hsl(220 15% 93%)' }}>
                                                        {r.tag}
                                                    </span>
                                                    {active && <span style={{ color: r.tagColor, display: 'flex' }}><Icons.check /></span>}
                                                </div>
                                                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'hsl(220 25% 18%)', marginBottom: '0.1rem' }}>{r.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 55%)' }}>{r.desc}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </FField>

                            {/* Password */}
                            <FField label="Change Password" hint="Leave blank to keep current password">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                    <FInput type={showPw ? 'text' : 'password'} value={data.password} onChange={e => setData('password', e.target.value)} placeholder="New password" hasError={!!errors.password}
                                        suffix={
                                            <button type="button" onClick={() => setShowPw(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 55%)', padding: 0, display: 'flex' }}>
                                                {showPw ? <Icons.eyeOff /> : <Icons.eye />}
                                            </button>
                                        }
                                    />
                                    <FInput type={showPw2 ? 'text' : 'password'} value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} placeholder="Confirm new password" hasError={!!errors.password_confirmation}
                                        suffix={
                                            <button type="button" onClick={() => setShowPw2(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 55%)', padding: 0, display: 'flex' }}>
                                                {showPw2 ? <Icons.eyeOff /> : <Icons.eye />}
                                            </button>
                                        }
                                    />
                                </div>
                                {errors.password && <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(0 65% 48%)', fontWeight: '600' }}>{errors.password}</p>}
                                {errors.password_confirmation && <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(0 65% 48%)', fontWeight: '600' }}>{errors.password_confirmation}</p>}
                            </FField>

                            {/* Quick actions */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingTop: '0.5rem', borderTop: '1px solid hsl(220 15% 93%)' }}>
                                <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)' }}>Quick Actions</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => router.post(`/super-admin/impersonate/${admin.id}`)}
                                        style={{ padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(270 60% 88%)', backgroundColor: 'hsl(270 60% 97%)', color: 'hsl(270 60% 42%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                        <Icons.shield /> Impersonate
                                    </button>

                                    <button
                                        type="button"
                                        onClick={resendInvite}
                                        disabled={resendingEmail}
                                        style={{ padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(214 80% 88%)', backgroundColor: 'hsl(214 100% 97%)', color: 'hsl(214 80% 44%)', fontSize: '0.8rem', fontWeight: '600', cursor: resendingEmail ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s', opacity: resendingEmail ? 0.6 : 1 }}
                                        onMouseEnter={e => { if (!resendingEmail) e.currentTarget.style.filter = 'brightness(0.94)'; }}
                                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                        {resendingEmail ? <Icons.spinner /> : <Icons.mail />} {resendingEmail ? 'Sending...' : 'Resend Email'}
                                    </button>

                                    {isSuspended ? (
                                        <button
                                            type="button"
                                            onClick={() => setConfirmAct('reactivate')}
                                            style={{ padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(152 55% 80%)', backgroundColor: 'hsl(152 55% 96%)', color: 'hsl(152 55% 32%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                            onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                            <Icons.unlock /> Reactivate
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setConfirmAct('suspend')}
                                            style={{ padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(0 65% 88%)', backgroundColor: 'hsl(0 65% 97%)', color: 'hsl(0 62% 46%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                            onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                            <Icons.ban /> Suspend
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Info row */}
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'hsl(220 15% 55%)', paddingTop: '0.5rem', borderTop: '1px solid hsl(220 15% 93%)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <Icons.clock /> Last active: {fmtRelative(admin.last_login_at)}
                                </span>
                                <span>Joined: {fmtDate(admin.created_at)}</span>
                            </div>
                        </div>

                        {/* ── Footer ── */}
                        <div style={{ padding: '1rem 1.75rem 1.5rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', gap: '0.65rem' }}>
                            <button
                                type="button"
                                onClick={() => inline ? onClose?.() : router.visit('/super-admin/admins')}
                                style={{ flex: 1, padding: '0.65rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 30%)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s', cursor: 'pointer', fontFamily: 'inherit' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                                Cancel
                            </button>
                            <button type="submit" disabled={processing || !isDirty}
                                style={{ flex: 2, padding: '0.65rem', borderRadius: '0.65rem', border: 'none', backgroundColor: processing ? 'hsl(220 25% 38%)' : isDirty ? 'hsl(220 25% 15%)' : 'hsl(220 15% 72%)', color: 'white', fontSize: '0.875rem', fontWeight: '700', cursor: processing || !isDirty ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'background-color 0.15s' }}
                                onMouseEnter={e => { if (!processing && isDirty) e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'; }}
                                onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = isDirty ? 'hsl(220 25% 15%)' : 'hsl(220 15% 72%)'; }}>
                                {processing ? <><Icons.spinner /> Saving…</> : isDirty ? <><Icons.save /> Save Changes</> : <><Icons.check /> Up to date</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes adminEditSpin    { to { transform: rotate(360deg); } }
                @keyframes adminEditSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes adminEditModalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
            `}</style>
        </>
    );

    // If inline mode, wrap in a container with max-width
    if (inline) {
        return (
            <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', padding: '1.5rem' }}>
                {content}
            </div>
        );
    }

    return content;
};

AdminEdit.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default AdminEdit;