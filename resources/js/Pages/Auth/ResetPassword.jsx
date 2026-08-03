import { useState } from "react";
import { useForm, Link, Head } from "@inertiajs/react";

// ── Icons (inline SVG, matches AuthPage) ──────────────────────────────────────
const Eye = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOff = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const AlertCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowLeft = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const Lock = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const CheckCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ── Design tokens (matches AuthPage) ──────────────────────────────────────────
const COLOR = {
  teal:        'hsl(174 62% 32%)',
  tealHover:   'hsl(174 55% 28%)',
  tealLight:   'hsl(174 62% 32% / 0.08)',
  red:         'hsl(0 72% 51%)',
  redLight:    'hsl(0 72% 51% / 0.05)',
  green:       'hsl(142 60% 36%)',
  greenLight:  'hsl(142 60% 36% / 0.05)',
  greenBorder: 'hsl(142 50% 55%)',
  border:      'hsl(40 20% 88%)',
  muted:       'hsl(200 15% 45%)',
  text:        'hsl(200 25% 15%)',
  bg:          'hsl(40 33% 98%)',
};

// ── Shared field helpers (matches AuthPage) ───────────────────────────────────
const fieldStyle = (hasError, isValid = false) => ({
  width: '100%',
  padding: 'clamp(0.625rem, 2vw, 0.75rem)',
  border: `1px solid ${hasError ? COLOR.red : isValid ? COLOR.greenBorder : COLOR.border}`,
  borderRadius: '0.75rem',
  fontSize: 'clamp(0.9375rem, 2vw, 1rem)',
  outline: 'none',
  color: COLOR.text,
  backgroundColor: hasError ? COLOR.redLight : isValid ? COLOR.greenLight : 'white',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, background-color 0.15s',
});

const ErrorMsg = ({ msg }) =>
  msg ? <p style={{ fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: COLOR.red, margin: '0.375rem 0 0', lineHeight: 1.4 }}>{msg}</p> : null;

const HintMsg = ({ msg, color = COLOR.muted }) =>
  msg ? <p style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.8125rem)', color, margin: '0.375rem 0 0', lineHeight: 1.4 }}>{msg}</p> : null;

// ── Password strength (matches AuthPage) ──────────────────────────────────────
const STRENGTH_COLORS = ['', COLOR.red, 'hsl(38 92% 50%)', COLOR.teal, COLOR.green];
const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Strong', 'Very strong'];

const getStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8)          s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

const StrengthMeter = ({ password }) => {
  if (!password) return null;
  const score = getStrength(password);
  return (
    <div style={{ display: 'grid', gap: 4, marginTop: 4 }}>
      <div style={{ display: 'flex', gap: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= score ? STRENGTH_COLORS[score] : COLOR.border, transition: 'background 0.2s' }} />
        ))}
      </div>
      <span style={{ fontSize: '0.75rem', color: STRENGTH_COLORS[score] || COLOR.muted }}>
        {STRENGTH_LABELS[score] || 'Too short'}
      </span>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const ResetPasswordPage = ({ token, email, userType }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    token,
    email,
    userType,
    password: '',
    password_confirmation: '',
  });

  const confirmFilled   = data.password_confirmation.length > 0;
  const passwordsMatch  = data.password === data.password_confirmation;
  const confirmHasError = !!errors.password_confirmation || (confirmFilled && !passwordsMatch);
  const confirmIsValid  = !errors.password_confirmation && confirmFilled && passwordsMatch;

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/reset-password', {
      onSuccess: () => setResetSuccess(true),
    });
  };

  const btnStyle = (isHovered) => ({
    width: '100%',
    padding: 'clamp(0.75rem, 2.5vw, 1rem)',
    border: 'none',
    borderRadius: '0.75rem',
    background: processing ? `${COLOR.teal}80` : isHovered ? COLOR.tealHover : COLOR.teal,
    color: 'white',
    fontSize: 'clamp(0.9375rem, 2vw, 1rem)',
    fontWeight: 600,
    cursor: processing ? 'not-allowed' : 'pointer',
    marginTop: '0.25rem',
    transition: 'background 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  });

  return (
    <>
      <Head>
        <title>Reset password | RentTrustGh</title>
        <meta name="description" content="Reset your RentTrustGh account password." />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Head>

      <style>{`
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
        @media (max-width: 768px) {
          input[type="password"], input[type="text"] { font-size: 16px !important; }
          button { -webkit-tap-highlight-color: transparent; min-height: 44px; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: COLOR.bg }}>
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(1rem, 4vw, 3rem) 1rem' }}>
          <div style={{ width: '100%', maxWidth: '28rem', backgroundColor: 'white', border: `1px solid ${COLOR.border}`, borderRadius: '1rem', boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.1)', position: 'relative' }}>

            {!resetSuccess && (
              <button
                onClick={() => window.location.href = '/login'}
                style={{ position: 'absolute', left: '1rem', top: '1rem', padding: '0.5rem', border: 'none', background: 'transparent', color: COLOR.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}
                onMouseEnter={(e) => e.currentTarget.style.color = COLOR.teal}
                onMouseLeave={(e) => e.currentTarget.style.color = COLOR.muted}
              >
                <ArrowLeft style={{ height: '1rem', width: '1rem' }} />
                Back
              </button>
            )}

            {!resetSuccess ? (
              <>
                {/* Header */}
                <div style={{ padding: '3rem 2rem 1.5rem', textAlign: 'center' }}>
                  <div style={{ width: '30%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <img src="/images/rent-trust.png" alt="RentTrustGh" />
                  </div>
                  <h1 style={{ color: COLOR.text, fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.2 }}>
                    Reset password
                  </h1>
                  <p style={{ color: COLOR.muted, fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)', lineHeight: 1.5, margin: 0 }}>
                    Create a new password for your account
                  </p>
                </div>

                <div style={{ padding: '0 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Email display */}
                  <div style={{ padding: '0.875rem 1rem', backgroundColor: COLOR.bg, border: `1px solid ${COLOR.border}`, borderRadius: '0.75rem' }}>
                    <p style={{ fontSize: '0.8125rem', color: COLOR.muted, margin: 0 }}>
                      Resetting password for <strong style={{ color: COLOR.text }}>{email}</strong>
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* New password */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: COLOR.text }}>
                        New password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={data.password}
                          onChange={(e) => setData('password', e.target.value)}
                          style={{ ...fieldStyle(!!errors.password), paddingRight: '3rem' }}
                          onFocus={(e) => e.currentTarget.style.borderColor = errors.password ? COLOR.red : COLOR.teal}
                          onBlur={(e) => e.currentTarget.style.borderColor = errors.password ? COLOR.red : COLOR.border}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: COLOR.muted, cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = COLOR.teal}
                          onMouseLeave={(e) => e.currentTarget.style.color = COLOR.muted}
                        >
                          {showPassword ? <EyeOff style={{ height: '1.25rem', width: '1.25rem' }} /> : <Eye style={{ height: '1.25rem', width: '1.25rem' }} />}
                        </button>
                      </div>
                      <StrengthMeter password={data.password} />
                      <ErrorMsg msg={errors.password} />
                    </div>

                    {/* Confirm password */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: COLOR.text }}>
                        Confirm password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={data.password_confirmation}
                          onChange={(e) => setData('password_confirmation', e.target.value)}
                          style={{ ...fieldStyle(confirmHasError, confirmIsValid), paddingRight: '3rem' }}
                          onFocus={(e) => e.currentTarget.style.borderColor = confirmHasError ? COLOR.red : confirmIsValid ? COLOR.greenBorder : COLOR.teal}
                          onBlur={(e) => e.currentTarget.style.borderColor = confirmHasError ? COLOR.red : confirmIsValid ? COLOR.greenBorder : COLOR.border}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: COLOR.muted, cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = COLOR.teal}
                          onMouseLeave={(e) => e.currentTarget.style.color = COLOR.muted}
                        >
                          {showConfirm ? <EyeOff style={{ height: '1.25rem', width: '1.25rem' }} /> : <Eye style={{ height: '1.25rem', width: '1.25rem' }} />}
                        </button>
                      </div>
                      {errors.password_confirmation && <ErrorMsg msg={errors.password_confirmation} />}
                      {!errors.password_confirmation && confirmFilled && !passwordsMatch && <ErrorMsg msg="Passwords do not match." />}
                      {!errors.password_confirmation && confirmIsValid && <HintMsg msg="✓ Passwords match." color={COLOR.green} />}
                    </div>

                    {/* Requirements */}
                    <div style={{ padding: '0.875rem 1rem', backgroundColor: COLOR.bg, border: `1px solid ${COLOR.border}`, borderRadius: '0.75rem' }}>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: COLOR.text, marginBottom: '0.375rem' }}>
                        Password must contain:
                      </p>
                      <ul style={{ margin: 0, paddingLeft: '1.125rem', fontSize: '0.8125rem', color: COLOR.muted, lineHeight: 1.8 }}>
                        <li>At least 8 characters</li>
                        <li>Both uppercase and lowercase letters</li>
                        <li>At least one number</li>
                        <li>At least one special character</li>
                      </ul>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={processing}
                      style={btnStyle(btnHovered)}
                      onMouseEnter={() => setBtnHovered(true)}
                      onMouseLeave={() => setBtnHovered(false)}
                    >
                      <Lock style={{ height: '1rem', width: '1rem' }} />
                      {processing ? 'Resetting…' : 'Reset password'}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              /* Success state */
              <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: COLOR.greenLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <CheckCircle style={{ height: '2rem', width: '2rem', color: COLOR.green }} />
                </div>
                <h2 style={{ fontSize: 'clamp(1.375rem, 4vw, 1.75rem)', fontWeight: 700, color: COLOR.text, marginBottom: '0.75rem', lineHeight: 1.2 }}>
                  Password reset successful
                </h2>
                <p style={{ fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)', color: COLOR.muted, lineHeight: 1.6, marginBottom: '2rem' }}>
                  Your password has been updated. You can now sign in with your new password.
                </p>
                <Link
                  href="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: 'clamp(0.75rem, 2.5vw, 1rem) 2rem',
                    background: COLOR.teal,
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '0.75rem',
                    fontWeight: 600,
                    fontSize: 'clamp(0.9375rem, 2vw, 1rem)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = COLOR.tealHover}
                  onMouseLeave={(e) => e.currentTarget.style.background = COLOR.teal}
                >
                  Sign in now
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ResetPasswordPage;