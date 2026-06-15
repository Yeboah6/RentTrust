import { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
// import SuspendedModal from "@/Components/Modules/SuspendAccountMessage";

// ── Icons ────────────────────────────────────────────────────────────────────
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

// ── Design tokens ─────────────────────────────────────────────────────────────
const COLOR = {
  teal:       'hsl(174 62% 32%)',
  tealHover:  'hsl(174 55% 28%)',
  tealLight:  'hsl(174 62% 32% / 0.08)',
  red:        'hsl(0 72% 51%)',
  redLight:   'hsl(0 72% 51% / 0.05)',
  green:      'hsl(142 60% 36%)',
  greenLight: 'hsl(142 60% 36% / 0.05)',
  greenBorder:'hsl(142 50% 55%)',
  border:     'hsl(40 20% 88%)',
  muted:      'hsl(200 15% 45%)',
  text:       'hsl(200 25% 15%)',
  bg:         'hsl(40 33% 98%)',
};

// ── Shared field helpers ──────────────────────────────────────────────────────
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

// ── Password strength ─────────────────────────────────────────────────────────
const STRENGTH_COLORS = ['', COLOR.red, 'hsl(38 92% 50%)', COLOR.teal, COLOR.green];
const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Strong', 'Very strong'];

const getStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8)           s++;
  if (/[A-Z]/.test(pw))         s++;
  if (/[0-9]/.test(pw))         s++;
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

// ── Email status indicator ────────────────────────────────────────────────────
const EmailIcon = ({ status }) => {
  if (status === 'checking') return <span style={{ fontSize: '0.75rem', color: COLOR.muted }}>…</span>;
  if (status === 'valid')    return <span style={{ color: COLOR.green }}>✓</span>;
  if (status === 'invalid' || status === 'taken') return <span style={{ color: COLOR.red }}>✕</span>;
  return null;
};

// ── Main component ────────────────────────────────────────────────────────────
const AuthPage = ({ isLogin: initialLogin = true }) => {
  const [isLogin, setIsLogin] = useState(initialLogin);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // email validation state: 'idle' | 'invalid' | 'checking' | 'taken' | 'valid'
  const [emailStatus, setEmailStatus] = useState('idle');

  const { data, setData, post, errors, processing, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });

  // const { errors } = usePage().props;
  // const { errors: pageErrors } = usePage().props;

  const toggleMode = () => {
    setIsLogin((v) => !v);
    reset();
    setShowPassword(false);
    setShowConfirm(false);
    setEmailStatus('idle');
  };

  // ── Email handler ───────────────────────────────────────────────────────────
  // Replace the fetch in handleEmailChange with this:
const handleEmailChange = (val) => {
  setData('email', val);
  clearTimeout(window._emailTimer);

  if (!val) { setEmailStatus('idle'); return; }

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  if (!valid) { setEmailStatus('invalid'); return; }

  if (isLogin) { setEmailStatus('idle'); return; }

  setEmailStatus('checking');
  window._emailTimer = setTimeout(async () => {
    try {
      // Use the shared prop for CSRF token
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      const res = await fetch(`/check-email?email=${encodeURIComponent(val)}`, {
        headers: {
          'X-CSRF-TOKEN': token,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
      });
      const json = await res.json();
      setEmailStatus(json.taken ? 'taken' : 'valid');
    } catch {
      setEmailStatus('valid');
    }
  }, 600);
};

  const emailHasError = !!errors.email || emailStatus === 'invalid' || emailStatus === 'taken';
  const emailIsValid  = !errors.email && emailStatus === 'valid';

  const confirmFilled     = data.password_confirmation.length > 0;
  const passwordsMatch    = data.password === data.password_confirmation;
  const confirmHasError   = !!errors.password_confirmation || (confirmFilled && !passwordsMatch);
  const confirmIsValid    = !errors.password_confirmation && confirmFilled && passwordsMatch;

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    post(isLogin ? '/login' : '/sign-up', {
      onSuccess: () => { reset(); setEmailStatus('idle'); },
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
  });

  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
        @media (max-width: 768px) {
          input[type="text"], input[type="email"], input[type="password"], input[type="tel"] { font-size: 16px !important; }
          button { -webkit-tap-highlight-color: transparent; min-height: 44px; }
        }
      `}</style>

          {errors?.suspended && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid hsl(40 20% 88%)', padding: '2rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>

                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'hsl(0 70% 97%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <AlertCircle style={{ height: '1.5rem', width: '1.5rem', color: 'hsl(0 70% 50%)' }} />
                </div>

                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
                  Account suspended
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  Your account has been suspended. Please contact support to resolve this issue and regain access.
                </p>

                <div style={{ backgroundColor: 'hsl(40 30% 97%)', borderRadius: '0.5rem', border: '1px solid hsl(40 20% 88%)', padding: '0.875rem 1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                  <p style={{ fontSize: '0.8rem', color: 'hsl(200 15% 45%)', margin: 0, lineHeight: '1.6' }}>
                    Common reasons include policy violations, suspicious activity, or unpaid dues. Our support team can help clarify.
                  </p>
                </div>

                <a
                  href="mailto:renttrustgh2026@gmail.com"
                  style={{ display: 'block', padding: '0.625rem 1rem', backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 70% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(0 70% 45%)', textDecoration: 'none' }}
                >
                  Contact support
                </a>

                <button
                style={{ display: 'block', padding: '0.625rem 1rem', backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 70% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(0 70% 45%)', textDecoration: 'none' }}
                >
                  Close
                </button>

              </div>
            </div>
          )
        }

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: COLOR.bg }}>
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(1rem, 4vw, 3rem) 1rem' }}>
          <div style={{ width: '100%', maxWidth: '28rem', backgroundColor: 'white', border: `1px solid ${COLOR.border}`, borderRadius: '1rem', boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.1)', position: 'relative' }}>

            {/* Back button */}
            <button
              onClick={() => window.location.href = '/'}
              style={{ position: 'absolute', left: '1rem', top: '1rem', padding: '0.5rem', border: 'none', background: 'transparent', color: COLOR.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}
              onMouseEnter={(e) => e.currentTarget.style.color = COLOR.teal}
              onMouseLeave={(e) => e.currentTarget.style.color = COLOR.muted}
            >
              <ArrowLeft style={{ height: '1rem', width: '1rem' }} />
              Back
            </button>

            {/* Header */}
            <div style={{ padding: '3rem 2rem 1.5rem', textAlign: 'center' }}>
              <h1 style={{ color: COLOR.text, fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.2 }}>
                {isLogin ? 'Welcome back' : 'Create account'}
              </h1>
              <p style={{ color: COLOR.muted, fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)', lineHeight: 1.5, margin: 0 }}>
                {isLogin ? 'Sign in to your RentTrustGh account' : 'Join RentTrustGh to find your perfect home'}
              </p>
            </div>

            <div style={{ padding: '0 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Full name — signup only */}
                {!isLogin && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: COLOR.text }}>Full name</label>
                    <input
                      type="text"
                      placeholder="Kofi Mensah"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      style={fieldStyle(!!errors.name)}
                      onFocus={(e) => e.currentTarget.style.borderColor = errors.name ? COLOR.red : COLOR.teal}
                      onBlur={(e) => e.currentTarget.style.borderColor = errors.name ? COLOR.red : COLOR.border}
                    />
                    <ErrorMsg msg={errors.name} />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: COLOR.text }}>Email</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={data.email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      style={{ ...fieldStyle(emailHasError, emailIsValid), paddingRight: '2.25rem' }}
                      onFocus={(e) => e.currentTarget.style.borderColor = emailHasError ? COLOR.red : emailIsValid ? COLOR.greenBorder : COLOR.teal}
                      onBlur={(e) => e.currentTarget.style.borderColor = emailHasError ? COLOR.red : emailIsValid ? COLOR.greenBorder : COLOR.border}
                    />
                    <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.875rem', pointerEvents: 'none' }}>
                      <EmailIcon status={emailStatus} />
                    </span>
                  </div>

                  {/* Priority: server error > taken > invalid > valid */}
                  {errors.email && <ErrorMsg msg={errors.email} />}
                  {!errors.email && emailStatus === 'taken'   && <ErrorMsg msg="This email is already registered." />}
                  {!errors.email && emailStatus === 'invalid' && <ErrorMsg msg="Please enter a valid email address." />}
                  {!errors.email && emailStatus === 'valid'   && <HintMsg msg="✓ Email is available." color={COLOR.green} />}
                </div>

                {/* Phone — signup only */}
                {!isLogin && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: COLOR.text }}>Phone number</label>
                    <input
                      type="tel"
                      placeholder="055 000 0000"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      style={fieldStyle(!!errors.phone)}
                      onFocus={(e) => e.currentTarget.style.borderColor = errors.phone ? COLOR.red : COLOR.teal}
                      onBlur={(e) => e.currentTarget.style.borderColor = errors.phone ? COLOR.red : COLOR.border}
                    />
                    <ErrorMsg msg={errors.phone} />
                  </div>
                )}

                {/* Password */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: COLOR.text }}>Password</label>
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
                  {!isLogin && <StrengthMeter password={data.password} />}
                  <ErrorMsg msg={errors.password} />
                </div>

                {/* Confirm password — signup only */}
                {!isLogin && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: COLOR.text }}>Confirm password</label>
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

                    {/* Match feedback */}
                    {errors.password_confirmation && <ErrorMsg msg={errors.password_confirmation} />}
                    {!errors.password_confirmation && confirmFilled && !passwordsMatch && <ErrorMsg msg="Passwords do not match." />}
                    {!errors.password_confirmation && confirmIsValid && <HintMsg msg="✓ Passwords match." color={COLOR.green} />}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={processing}
                  style={btnStyle(btnHovered)}
                  onMouseEnter={() => setBtnHovered(true)}
                  onMouseLeave={() => setBtnHovered(false)}
                >
                  {processing ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
                </button>

                {/* Forgot password */}
                {isLogin && (
                  <div style={{ textAlign: 'center' }}>
                    <Link href="/forgot-password" style={{ color: COLOR.teal, fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                      Forgot password?
                    </Link>
                  </div>
                )}
              </form>

              {/* Toggle mode */}
              <div style={{ marginTop: '0.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${COLOR.border}`, textAlign: 'center' }}>
                <p style={{ color: COLOR.muted, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                </p>
                <button onClick={toggleMode} style={{ border: 'none', background: 'transparent', color: COLOR.teal, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, padding: '0.5rem 1rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                  {isLogin ? 'Create an account' : 'Sign in instead'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AuthPage;