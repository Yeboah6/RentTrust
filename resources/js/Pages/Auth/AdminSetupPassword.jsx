import { useForm, Head } from '@inertiajs/react';
import { useState } from 'react';

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

const ShieldIcon = () => (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const SpinnerIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 0.75s linear infinite' }}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.2 }} />
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" style={{ opacity: 0.85 }} />
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
    { label: 'Weak',        color: 'hsl(0 72% 51%)',    bg: 'hsl(0 72% 51%)' },
    { label: 'Fair',        color: 'hsl(38 92% 50%)',   bg: 'hsl(38 92% 50%)' },
    { label: 'Strong',      color: 'hsl(220 60% 48%)',  bg: 'hsl(220 60% 48%)' },
    { label: 'Very strong', color: 'hsl(142 60% 36%)',  bg: 'hsl(142 60% 36%)' },
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
                        background: i <= score ? meta.bg : 'hsl(220 15% 90%)',
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
    { test: pw => pw.length >= 8,          label: 'At least 8 characters' },
    { test: pw => /[A-Z]/.test(pw),        label: 'One uppercase letter' },
    { test: pw => /[0-9]/.test(pw),        label: 'One number' },
];

const RequirementItem = ({ met, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
        <div style={{
            width: '1.1rem', height: '1.1rem', borderRadius: '50%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: met ? 'hsl(220 60% 48%)' : 'hsl(220 15% 92%)',
            color: met ? 'white' : 'hsl(220 15% 70%)',
            transition: 'all 0.2s',
        }}>
            <CheckIcon />
        </div>
        <span style={{
            fontSize: '0.75rem', fontWeight: 500,
            color: met ? 'hsl(220 40% 28%)' : 'hsl(220 15% 52%)',
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
            color: 'hsl(220 25% 18%)', letterSpacing: '0.01em',
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
                    border: `1.5px solid ${error ? 'hsl(0 72% 55%)' : 'hsl(220 15% 85%)'}`,
                    borderRadius: '0.75rem',
                    fontSize: '0.9375rem',
                    color: 'hsl(220 25% 15%)',
                    backgroundColor: error ? 'hsl(0 72% 51% / 0.03)' : 'white',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                    letterSpacing: show ? 'normal' : '0.1em',
                }}
                onFocus={e => e.currentTarget.style.borderColor = error ? 'hsl(0 72% 51%)' : 'hsl(220 60% 55%)'}
                onBlur={e => e.currentTarget.style.borderColor = error ? 'hsl(0 72% 55%)' : 'hsl(220 15% 85%)'}
            />
            <button
                type="button"
                onClick={onToggle}
                style={{
                    position: 'absolute', right: '0.875rem', top: '50%',
                    transform: 'translateY(-50%)', border: 'none',
                    background: 'transparent', cursor: 'pointer',
                    color: 'hsl(220 15% 52%)', display: 'flex', padding: 0,
                    transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'hsl(220 60% 48%)'}
                onMouseLeave={e => e.currentTarget.style.color = 'hsl(220 15% 52%)'}
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

// ── Main ──────────────────────────────────────────────────────────────────────

const AdminSetup = ({ token, name, email }) => {
    const [showPw,  setShowPw]  = useState(false);
    const [showPw2, setShowPw2] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        password:              '',
        password_confirmation: '',
    });

    const confirmFilled   = data.password_confirmation.length > 0;
    const passwordsMatch  = data.password === data.password_confirmation;
    const confirmIsValid  = confirmFilled && passwordsMatch && !errors.password_confirmation;
    const confirmHasError = !!errors.password_confirmation || (confirmFilled && !passwordsMatch);
    const allReqsMet      = REQUIREMENTS.every(r => r.test(data.password));

    const liveHue = [...(name || '')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    const initials = (name || '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/admin-setup/${token}`);
    };

    return (
        <>
        <Head>
            <title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
        </Head>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: hsl(222 28% 10%); }
                @keyframes spin    { to { transform: rotate(360deg); } }
                @keyframes fadeUp  { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                @media (max-width: 640px) {
                    input[type="password"], input[type="text"] { font-size: 16px !important; }
                }
            `}</style>

            <div style={{
                minHeight: '100vh',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '2rem 1rem',
                background: 'hsl(222 28% 10%)',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                position: 'relative', overflow: 'hidden',
            }}>

                {/* Background texture */}
                <div style={{
                    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
                    backgroundImage: `
                        radial-gradient(circle at 15% 25%, hsl(220 60% 48% / 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 85% 75%, hsl(222 50% 30% / 0.1) 0%, transparent 50%),
                        radial-gradient(hsl(220 30% 50% / 0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: 'auto, auto, 28px 28px',
                }} />

                {/* Card */}
                <div style={{
                    width: '100%', maxWidth: '440px',
                    position: 'relative', zIndex: 1,
                    animation: 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
                }}>

                    {/* Brand mark */}
                    <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                      <div
                          style={{
                              display: 'inline-flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '1rem 1.25rem',
                          }}
                      >
                          <img
                              src="/images/rent-trust.png"
                              alt="RentTrustGh Logo"
                              style={{
                                  width: '120px',
                                  height: '120px',
                              }}
                          />
                      </div>
                    </div>

                    {/* Main card */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '1.25rem',
                        border: '1px solid hsl(220 15% 88%)',
                        boxShadow: '0 40px 80px hsl(220 28% 6% / 0.5), 0 4px 16px hsl(220 28% 6% / 0.3)',
                        overflow: 'hidden',
                    }}>

                        {/* Dark header — matches AddAdminModal exactly */}
                        <div style={{
                            background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))',
                            padding: '1.75rem',
                            position: 'relative', overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute', inset: 0, pointerEvents: 'none',
                                backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.07) 1px, transparent 1px)',
                                backgroundSize: '20px 20px',
                            }} />
                            {/* Glow orb */}
                            <div style={{
                                position: 'absolute', top: '-2rem', right: '-2rem',
                                width: '8rem', height: '8rem', borderRadius: '50%',
                                background: 'hsl(220 60% 55% / 0.12)',
                                filter: 'blur(20px)', pointerEvents: 'none',
                            }} />

                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                    backgroundColor: 'hsl(220 60% 55% / 0.15)',
                                    border: '1px solid hsl(220 60% 65% / 0.25)',
                                    borderRadius: '999px', padding: '0.25rem 0.7rem',
                                    marginBottom: '0.875rem',
                                }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color: 'hsl(220 60% 75%)', textTransform: 'uppercase' }}>
                                        Admin Activation
                                    </span>
                                </div>
                                <h1 style={{
                                    fontFamily: "'DM Serif Display', Georgia, serif",
                                    fontSize: '1.5rem', fontWeight: 400,
                                    color: 'white', lineHeight: 1.2,
                                    marginBottom: '0.4rem',
                                    letterSpacing: '-0.01em',
                                }}>
                                    Welcome, {(name || '').split(' ')[0]}
                                </h1>
                                <p style={{ fontSize: '0.82rem', color: 'hsl(220 20% 62%)', lineHeight: 1.5 }}>
                                    Set a password to activate your admin account on RentTrustGH.
                                </p>
                            </div>
                        </div>

                        {/* Account info pill */}
                        <div style={{
                            margin: '1.25rem 1.75rem 0',
                            padding: '0.65rem 1rem',
                            borderRadius: '0.65rem',
                            backgroundColor: 'hsl(220 25% 97%)',
                            border: '1px solid hsl(220 15% 91%)',
                            display: 'flex', alignItems: 'center', gap: '0.65rem',
                        }}>
                            {/* Live avatar */}
                            <div style={{
                                width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem', flexShrink: 0,
                                backgroundColor: `hsl(${liveHue} 50% 50%)`,
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.02em',
                            }}>
                                {initials}
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'hsl(220 25% 15%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {name}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 50%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {email}
                                </div>
                            </div>
                            <div style={{
                                marginLeft: 'auto', flexShrink: 0,
                                fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.07em',
                                padding: '0.2rem 0.55rem', borderRadius: '999px',
                                backgroundColor: 'hsl(220 25% 15%)', color: 'white',
                                textTransform: 'uppercase',
                            }}>
                                Admin
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div style={{ padding: '1.25rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

                                <PasswordField
                                    label="Create Password"
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
                                        backgroundColor: 'hsl(220 25% 98%)',
                                        border: '1px solid hsl(220 15% 91%)',
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
                                    error={confirmHasError && !errors.password_confirmation ? 'Passwords do not match.' : errors.password_confirmation}
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

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem',
                                        border: 'none',
                                        borderRadius: '0.75rem',
                                        background: processing || !allReqsMet
                                            ? 'hsl(220 15% 78%)'
                                            : 'hsl(220 25% 15%)',
                                        color: processing || !allReqsMet ? 'hsl(220 10% 55%)' : 'white',
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                        cursor: processing ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.2s',
                                        boxShadow: processing || !allReqsMet ? 'none' : '0 2px 12px hsl(220 25% 15% / 0.25)',
                                        marginTop: '0.25rem',
                                    }}
                                    onMouseEnter={e => { if (!processing && allReqsMet) e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'; }}
                                    onMouseLeave={e => { if (!processing && allReqsMet) e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'; }}
                                >
                                    {processing ? <><SpinnerIcon /> Activating account…</> : 'Activate My Account →'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Footer note */}
                    <p style={{
                        textAlign: 'center', marginTop: '1.25rem',
                        fontSize: '0.75rem', color: 'hsl(220 15% 45%)', lineHeight: 1.6,
                    }}>
                        This link is single-use and will expire after activation.<br />
                        Need help? Contact <span style={{ color: 'hsl(220 60% 65%)', fontWeight: 600 }}>support@renttrustgh.com</span>
                    </p>
                </div>
            </div>
        </>
    );
};

export default AdminSetup;