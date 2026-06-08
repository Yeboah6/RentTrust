import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';

// ── Icons ─────────────────────────────────────────────────────────────────────

const EyeIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeOffIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

const CheckIcon = () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const SpinnerIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 0.75s linear infinite' }}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.2 }} />
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" style={{ opacity: 0.85 }} />
    </svg>
);

const CheckCircleIcon = () => (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
);

// ── Password strength ─────────────────────────────────────────────────────────

const getStrength = (pw) => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8)           s++;
    if (/[A-Z]/.test(pw))         s++;
    if (/[0-9]/.test(pw))         s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
};

const STRENGTH_META = [
    null,
    { label: 'Weak',        color: 'hsl(0 72% 51%)',   bg: 'hsl(0 72% 51%)' },
    { label: 'Fair',        color: 'hsl(38 92% 50%)',  bg: 'hsl(38 92% 50%)' },
    { label: 'Strong',      color: 'hsl(174 62% 36%)', bg: 'hsl(174 62% 36%)' },
    { label: 'Very strong', color: 'hsl(142 60% 36%)', bg: 'hsl(142 60% 36%)' },
];

const StrengthBar = ({ password }) => {
    if (!password) return null;
    const score = getStrength(password);
    const meta  = STRENGTH_META[score];
    return (
        <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '3px', marginBottom: '0.3rem' }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                        flex: 1, height: '3px', borderRadius: '2px',
                        background: i <= score ? meta.bg : 'hsl(174 20% 88%)',
                        transition: 'background 0.25s',
                    }} />
                ))}
            </div>
            {meta && (
                <span style={{ fontSize: '0.72rem', color: meta.color, fontWeight: 600 }}>
                    {meta.label}
                </span>
            )}
        </div>
    );
};

// ── Requirements checklist ────────────────────────────────────────────────────

const REQUIREMENTS = [
    { test: pw => pw.length >= 8,           label: 'At least 8 characters' },
    { test: pw => /[A-Z]/.test(pw),         label: 'One uppercase letter' },
    { test: pw => /[0-9]/.test(pw),         label: 'One number' },
    { test: pw => /[^A-Za-z0-9]/.test(pw), label: 'One special character' },
];

const RequirementItem = ({ met, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
        <div style={{
            width: '1.1rem', height: '1.1rem', borderRadius: '50%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: met ? 'hsl(174 62% 36%)' : 'hsl(174 20% 92%)',
            color: met ? 'white' : 'hsl(174 20% 70%)',
            transition: 'all 0.2s',
        }}>
            <CheckIcon />
        </div>
        <span style={{
            fontSize: '0.75rem', fontWeight: 500,
            color: met ? 'hsl(174 40% 28%)' : 'hsl(200 15% 52%)',
            transition: 'color 0.2s',
        }}>
            {label}
        </span>
    </div>
);

// ── Password field ────────────────────────────────────────────────────────────

const PasswordField = ({ label, value, onChange, error, show, onToggle, placeholder }) => (
    <div>
        <label style={{
            display: 'block', marginBottom: '0.5rem',
            fontSize: '0.8rem', fontWeight: 700,
            color: 'hsl(200 25% 18%)', letterSpacing: '0.01em',
        }}>
            {label}
        </label>
        <div style={{ position: 'relative' }}>
            <input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '0.75rem 3rem 0.75rem 1rem',
                    border: `1.5px solid ${error ? 'hsl(0 72% 55%)' : 'hsl(174 30% 82%)'}`,
                    borderRadius: '0.75rem',
                    fontSize: '0.9375rem',
                    color: 'hsl(200 25% 15%)',
                    backgroundColor: error ? 'hsl(0 72% 51% / 0.03)' : 'white',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                    letterSpacing: show ? 'normal' : '0.1em',
                }}
                onFocus={e => e.currentTarget.style.borderColor = error ? 'hsl(0 72% 51%)' : 'hsl(174 62% 40%)'}
                onBlur={e => e.currentTarget.style.borderColor = error ? 'hsl(0 72% 55%)' : 'hsl(174 30% 82%)'}
            />
            <button
                type="button"
                onClick={onToggle}
                style={{
                    position: 'absolute', right: '0.875rem', top: '50%',
                    transform: 'translateY(-50%)', border: 'none',
                    background: 'transparent', cursor: 'pointer',
                    color: 'hsl(200 15% 52%)', display: 'flex', padding: 0,
                    transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'hsl(174 62% 36%)'}
                onMouseLeave={e => e.currentTarget.style.color = 'hsl(200 15% 52%)'}
            >
                {show ? <EyeOffIcon /> : <EyeIcon />}
            </button>
        </div>
        {error && (
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', color: 'hsl(0 72% 48%)', fontWeight: 600 }}>
                {error}
            </p>
        )}
    </div>
);

// ── Role label ────────────────────────────────────────────────────────────────

const ROLE_LABELS = {
    agent:       'Agent',
    admin:       'Admin',
    super_admin: 'Super Admin',
};

// ── Main ──────────────────────────────────────────────────────────────────────

const ResetPasswordPage = ({ token, email, userType }) => {
    const [showPw,    setShowPw]    = useState(false);
    const [showPw2,   setShowPw2]   = useState(false);
    const [resetDone, setResetDone] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        token:                 token,
        email:                 email,
        userType:              userType,
        password:              '',
        password_confirmation: '',
    });

    const confirmFilled  = data.password_confirmation.length > 0;
    const passwordsMatch = data.password === data.password_confirmation;
    const confirmIsValid = confirmFilled && passwordsMatch && !errors.password_confirmation;
    const confirmError   = errors.password_confirmation || (confirmFilled && !passwordsMatch ? 'Passwords do not match.' : '');
    const allReqsMet     = REQUIREMENTS.every(r => r.test(data.password));

    const roleLabel = ROLE_LABELS[userType] || 'User';
    const emailInitial = (email || 'U').charAt(0).toUpperCase();

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/reset-password', {
            onSuccess: () => setResetDone(true),
        });
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: hsl(168 30% 96%); }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.85); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @media (max-width: 640px) {
                    input[type="password"], input[type="text"] { font-size: 16px !important; }
                }
            `}</style>

            <div style={{
                minHeight: '100vh',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '2rem 1rem',
                background: 'hsl(168 30% 96%)',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Background texture */}
                <div style={{
                    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
                    backgroundImage: `
                        radial-gradient(circle at 20% 20%, hsl(174 62% 36% / 0.06) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, hsl(174 50% 28% / 0.05) 0%, transparent 50%),
                        radial-gradient(hsl(174 30% 50% / 0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: 'auto, auto, 28px 28px',
                }} />

                {/* Card wrapper */}
                <div style={{
                    width: '100%', maxWidth: '440px',
                    position: 'relative', zIndex: 1,
                    animation: 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
                }}>
                    {/* Logo */}
                    <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '1rem 1.25rem' }}>
                            <img src="/rent-trust.png" alt="RentTrustGH" style={{ width: '100px', height: '100px' }} />
                        </div>
                    </div>

                    {/* ── SUCCESS STATE ─────────────────────────────────── */}
                    {resetDone ? (
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '1.25rem',
                            border: '1px solid hsl(174 25% 88%)',
                            boxShadow: '0 4px 24px hsl(174 40% 20% / 0.09), 0 1px 4px hsl(174 40% 20% / 0.06)',
                            overflow: 'hidden',
                            textAlign: 'center',
                        }}>
                            {/* Green header bar */}
                            <div style={{
                                background: 'linear-gradient(135deg, hsl(142 55% 30%) 0%, hsl(142 50% 24%) 100%)',
                                padding: '2rem',
                                position: 'relative', overflow: 'hidden',
                            }}>
                                <div style={{
                                    position: 'absolute', inset: 0, pointerEvents: 'none',
                                    backgroundImage: 'radial-gradient(hsl(142 80% 80% / 0.08) 1px, transparent 1px)',
                                    backgroundSize: '18px 18px',
                                }} />
                                <div style={{
                                    position: 'absolute', top: '-2rem', right: '-2rem',
                                    width: '8rem', height: '8rem', borderRadius: '50%',
                                    background: 'hsl(142 60% 50% / 0.15)', filter: 'blur(20px)',
                                }} />
                                <div style={{
                                    width: '4rem', height: '4rem', borderRadius: '50%',
                                    backgroundColor: 'hsl(142 55% 40% / 0.25)',
                                    border: '2px solid hsl(142 60% 60% / 0.35)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto',
                                    color: 'hsl(142 60% 78%)',
                                    animation: 'popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
                                }}>
                                    <CheckCircleIcon />
                                </div>
                            </div>

                            <div style={{ padding: '2rem 2rem 2.5rem' }}>
                                <h2 style={{
                                    fontFamily: "'DM Serif Display', Georgia, serif",
                                    fontSize: '1.5rem', fontWeight: 400,
                                    color: 'hsl(200 25% 12%)', marginBottom: '0.6rem',
                                    letterSpacing: '-0.01em',
                                }}>
                                    Password Reset!
                                </h2>
                                <p style={{
                                    fontSize: '0.85rem', color: 'hsl(200 15% 50%)',
                                    lineHeight: 1.6, marginBottom: '1.75rem',
                                }}>
                                    Your password has been updated. You can now sign in to your account with your new credentials.
                                </p>
                                <Link
                                    href="/login"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '0.875rem 1.75rem',
                                        background: 'linear-gradient(135deg, hsl(174 62% 32%), hsl(174 55% 26%))',
                                        color: 'white', textDecoration: 'none',
                                        borderRadius: '0.75rem', fontWeight: 700,
                                        fontSize: '0.9rem', fontFamily: 'inherit',
                                        boxShadow: '0 2px 12px hsl(174 62% 28% / 0.3)',
                                        transition: 'box-shadow 0.2s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px hsl(174 62% 28% / 0.45)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px hsl(174 62% 28% / 0.3)'}
                                >
                                    Sign In Now <ArrowRightIcon />
                                </Link>
                            </div>
                        </div>
                    ) : (

                    // ── FORM STATE ────────────────────────────────────────
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '1.25rem',
                        border: '1px solid hsl(174 25% 88%)',
                        boxShadow: '0 4px 24px hsl(174 40% 20% / 0.09), 0 1px 4px hsl(174 40% 20% / 0.06)',
                        overflow: 'hidden',
                    }}>
                        {/* Teal header */}
                        <div style={{
                            background: 'linear-gradient(135deg, hsl(174 62% 28%) 0%, hsl(174 55% 22%) 100%)',
                            padding: '1.75rem 2rem',
                            position: 'relative', overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute', inset: 0, pointerEvents: 'none',
                                backgroundImage: 'radial-gradient(hsl(174 80% 80% / 0.08) 1px, transparent 1px)',
                                backgroundSize: '18px 18px',
                            }} />
                            <div style={{
                                position: 'absolute', top: '-2rem', right: '-2rem',
                                width: '8rem', height: '8rem', borderRadius: '50%',
                                background: 'hsl(174 60% 50% / 0.15)',
                                filter: 'blur(20px)', pointerEvents: 'none',
                            }} />

                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                    backgroundColor: 'hsl(174 60% 50% / 0.15)',
                                    border: '1px solid hsl(174 60% 60% / 0.25)',
                                    borderRadius: '999px', padding: '0.25rem 0.7rem',
                                    marginBottom: '0.75rem',
                                }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color: 'hsl(174 60% 75%)', textTransform: 'uppercase' }}>
                                        Password Reset
                                    </span>
                                </div>
                                <h1 style={{
                                    fontFamily: "'DM Serif Display', Georgia, serif",
                                    fontSize: '1.5rem', fontWeight: 400,
                                    color: 'white', lineHeight: 1.2,
                                    marginBottom: '0.4rem', letterSpacing: '-0.01em',
                                }}>
                                    Create a new password
                                </h1>
                                <p style={{ fontSize: '0.82rem', color: 'hsl(174 30% 72%)', lineHeight: 1.5 }}>
                                    Choose a strong password to secure your RentTrustGH account.
                                </p>
                            </div>
                        </div>

                        {/* Account info pill */}
                        <div style={{
                            margin: '1.25rem 1.75rem 0',
                            padding: '0.65rem 1rem',
                            borderRadius: '0.65rem',
                            backgroundColor: 'hsl(174 40% 96%)',
                            border: '1px solid hsl(174 35% 88%)',
                            display: 'flex', alignItems: 'center', gap: '0.65rem',
                        }}>
                            <div style={{
                                width: '2.25rem', height: '2.25rem', borderRadius: '50%', flexShrink: 0,
                                backgroundColor: 'hsl(174 62% 32%)',
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.78rem', fontWeight: 800,
                            }}>
                                {emailInitial}
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'hsl(200 25% 15%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {email}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'hsl(174 40% 38%)' }}>
                                    Resetting password for this account
                                </div>
                            </div>
                            <div style={{
                                marginLeft: 'auto', flexShrink: 0,
                                fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.07em',
                                padding: '0.2rem 0.55rem', borderRadius: '999px',
                                backgroundColor: 'hsl(174 62% 32%)', color: 'white',
                                textTransform: 'uppercase',
                            }}>
                                {roleLabel}
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div style={{ padding: '1.25rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

                                <PasswordField
                                    label="New Password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    error={errors.password}
                                    show={showPw}
                                    onToggle={() => setShowPw(v => !v)}
                                    placeholder="••••••••"
                                />

                                {/* Strength + requirements */}
                                {data.password && (
                                    <div style={{
                                        padding: '0.875rem 1rem', borderRadius: '0.65rem',
                                        backgroundColor: 'hsl(174 30% 97%)',
                                        border: '1px solid hsl(174 25% 90%)',
                                        display: 'flex', flexDirection: 'column', gap: '0.75rem',
                                        animation: 'fadeUp 0.2s ease both',
                                    }}>
                                        <StrengthBar password={data.password} />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            {REQUIREMENTS.map((r, i) => (
                                                <RequirementItem key={i} met={r.test(data.password)} label={r.label} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <PasswordField
                                    label="Confirm Password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    error={confirmError}
                                    show={showPw2}
                                    onToggle={() => setShowPw2(v => !v)}
                                    placeholder="••••••••"
                                />

                                {confirmIsValid && (
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        fontSize: '0.78rem', fontWeight: 600,
                                        color: 'hsl(142 55% 34%)',
                                        animation: 'fadeUp 0.2s ease both',
                                    }}>
                                        <CheckIcon /> Passwords match
                                    </div>
                                )}

                                {/* General error (e.g. invalid/expired token) */}
                                {errors.email && (
                                    <div style={{
                                        padding: '0.75rem 1rem', borderRadius: '0.65rem',
                                        backgroundColor: 'hsl(0 72% 51% / 0.06)',
                                        border: '1px solid hsl(0 72% 51% / 0.2)',
                                        fontSize: '0.8rem', color: 'hsl(0 65% 44%)', fontWeight: 600,
                                    }}>
                                        {errors.email}
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        width: '100%', padding: '0.875rem', border: 'none',
                                        borderRadius: '0.75rem',
                                        background: processing || !allReqsMet
                                            ? 'hsl(174 20% 78%)'
                                            : 'linear-gradient(135deg, hsl(174 62% 32%), hsl(174 55% 26%))',
                                        color: processing || !allReqsMet ? 'hsl(174 10% 55%)' : 'white',
                                        fontSize: '0.9rem', fontWeight: 700,
                                        cursor: processing ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        fontFamily: 'inherit', transition: 'all 0.2s',
                                        boxShadow: processing || !allReqsMet ? 'none' : '0 2px 12px hsl(174 62% 28% / 0.3)',
                                        marginTop: '0.25rem',
                                    }}
                                    onMouseEnter={e => { if (!processing && allReqsMet) e.currentTarget.style.boxShadow = '0 4px 20px hsl(174 62% 28% / 0.4)'; }}
                                    onMouseLeave={e => { if (!processing && allReqsMet) e.currentTarget.style.boxShadow = '0 2px 12px hsl(174 62% 28% / 0.3)'; }}
                                >
                                    {processing ? <><SpinnerIcon /> Resetting password…</> : 'Reset Password →'}
                                </button>

                                {/* Back to login */}
                                <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'hsl(200 15% 52%)' }}>
                                    Remembered it?{' '}
                                    <Link href="/login" style={{ color: 'hsl(174 62% 32%)', fontWeight: 700, textDecoration: 'none' }}>
                                        Back to sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                    )}

                    {/* Footer note */}
                    {!resetDone && (
                        <p style={{
                            textAlign: 'center', marginTop: '1.25rem',
                            fontSize: '0.75rem', color: 'hsl(200 15% 52%)', lineHeight: 1.6,
                        }}>
                            This link expires in 24 hours.<br />
                            Need help? Contact{' '}
                            <span style={{ color: 'hsl(174 62% 32%)', fontWeight: 600 }}>renttrust2026@gmail.com</span>
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ResetPasswordPage;