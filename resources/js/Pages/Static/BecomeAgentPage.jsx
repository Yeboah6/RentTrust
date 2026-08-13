import { useState } from "react";
import { useForm, Head } from '@inertiajs/react';
import Header from '../../Components/Layouts/Header';
import Footer from '../../Components/Layouts/Footer';

// ── Icons ─────────────────────────────────────────────────────────────────────
const Shield = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const CheckCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

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

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  teal:        'hsl(174 62% 32%)',
  tealLight:   'hsl(174 62% 32% / 0.08)',
  red:         'hsl(0 72% 51%)',
  redLight:    'hsl(0 72% 51% / 0.05)',
  green:       'hsl(142 60% 36%)',
  greenLight:  'hsl(142 60% 36% / 0.05)',
  greenBorder: 'hsl(142 50% 55%)',
  border:      'hsl(40 20% 88%)',
  muted:       'hsl(200 15% 45%)',
  text:        'hsl(200 25% 15%)',
};

// ── Shared helpers ────────────────────────────────────────────────────────────
const fieldStyle = (hasError, isValid = false) => ({
  width: '100%',
  padding: '0.75rem',
  border: `1px solid ${hasError ? C.red : isValid ? C.greenBorder : C.border}`,
  borderRadius: '0.75rem',
  fontSize: '1rem',
  outline: 'none',
  color: C.text,
  backgroundColor: hasError ? C.redLight : isValid ? C.greenLight : 'white',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, background-color 0.15s',
});

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 500,
  fontSize: '0.875rem',
  color: C.text,
};

const ErrorMsg = ({ msg }) =>
  msg ? (
    <p style={{ fontSize: '0.875rem', color: C.red, marginTop: '0.375rem', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
      <span style={{ fontSize: '0.75rem' }}>✕</span> {msg}
    </p>
  ) : null;

const HintMsg = ({ msg, color = C.muted }) =>
  msg ? <p style={{ fontSize: '0.75rem', color, marginTop: '0.375rem', lineHeight: 1.4 }}>{msg}</p> : null;

// ── Password strength ─────────────────────────────────────────────────────────
const STRENGTH_COLORS = ['', C.red, 'hsl(38 92% 50%)', C.teal, C.green];
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
    <div style={{ display: 'grid', gap: 4, marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= score ? STRENGTH_COLORS[score] : C.border, transition: 'background 0.2s' }} />
        ))}
      </div>
      <span style={{ fontSize: '0.75rem', color: STRENGTH_COLORS[score] || C.muted }}>
        {STRENGTH_LABELS[score] || 'Too short'}
      </span>
    </div>
  );
};

// ── Email status icon ─────────────────────────────────────────────────────────
const EmailIcon = ({ status }) => {
  if (status === 'checking') return <span style={{ fontSize: '0.75rem', color: C.muted }}>…</span>;
  if (status === 'valid')    return <span style={{ color: C.green, fontSize: '0.875rem' }}>✓</span>;
  if (status === 'invalid' || status === 'taken') return <span style={{ color: C.red, fontSize: '0.875rem' }}>✕</span>;
  return null;
};

// ── Page ──────────────────────────────────────────────────────────────────────
const BecomeAgentPage = () => {
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [emailStatus, setEmailStatus]     = useState('idle'); // idle | invalid | checking | taken | valid

  const agentTypes = ['Landlord', 'Agent'];

  const { data, setData, post, processing, errors, reset } = useForm({
    name:                  '',
    phone:                 '',
    email:                 '',
    company:               '',
    type:                  '',
    fee:                   '',
    bio:                   '',
    password:              '',
    password_confirmation: '',
  });

  // ── Email validation ──────────────────────────────────────────────────────
  const handleEmailChange = (val) => {
    setData('email', val);
    clearTimeout(window._agentEmailTimer);

    if (!val) { setEmailStatus('idle'); return; }

    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!valid) { setEmailStatus('invalid'); return; }

    setEmailStatus('checking');
    window._agentEmailTimer = setTimeout(async () => {
      try {
        const res  = await fetch(`/check-email?email=${encodeURIComponent(val)}`);
        const json = await res.json();
        setEmailStatus(json.taken ? 'taken' : 'valid');
      } catch {
        setEmailStatus('valid'); // fail open — server catches it on submit
      }
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/become-agent', {
      onSuccess: () => { reset(); setEmailStatus('idle'); },
    });
  };

  // ── Derived state ─────────────────────────────────────────────────────────
  const emailHasError = !!errors.email || emailStatus === 'invalid' || emailStatus === 'taken';
  const emailIsValid  = !errors.email  && emailStatus === 'valid';

  const confirmFilled  = data.password_confirmation.length > 0;
  const passwordsMatch = data.password === data.password_confirmation;
  const confirmHasError = !!errors.password_confirmation || (confirmFilled && !passwordsMatch);
  const confirmIsValid  = !errors.password_confirmation  &&  confirmFilled &&  passwordsMatch;

  // ── Focus/blur helpers ────────────────────────────────────────────────────
  const onFocus = (hasError, isValid = false) => (e) =>
    e.currentTarget.style.borderColor = hasError ? C.red : isValid ? C.greenBorder : C.teal;
  const onBlur = (hasError, isValid = false) => (e) =>
    e.currentTarget.style.borderColor = hasError ? C.red : isValid ? C.greenBorder : C.border;

  return (
    <>
        <Head>
          <title>Become a Verified Agent or Landlord | RentTrustGh</title>

          {/* Primary Meta */}
          <meta
              name="description"
              content="Register as a verified real estate agent or landlord on RentTrustGh. List your properties, build your reputation, respond to tenant reviews, and connect with thousands of renters across Ghana."
          />

          <meta
              name="keywords"
              content="Become an agent Ghana, landlord registration Ghana, register as estate agent Ghana, verified real estate agent Ghana, RentTrustGh agent, property agent Ghana, landlord account Ghana, list property Ghana"
          />

          <meta
              name="robots"
              content="index,follow,max-image-preview:large"
          />

          <meta
              name="googlebot"
              content="index,follow"
          />

          {/* Canonical */}
          <link
              rel="canonical"
              href="https://renttrustgh.com/become-agent"
          />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="RentTrustGh" />
          <meta property="og:locale" content="en_GH" />

          <meta
              property="og:title"
              content="Become a Verified Agent or Landlord | RentTrustGh"
          />

          <meta
              property="og:description"
              content="Join RentTrustGh as a verified real estate agent or landlord. Manage listings, earn trust, and connect with more tenants."
          />

          <meta
              property="og:url"
              content="https://renttrustgh.com/become-agent"
          />

          <meta
              property="og:image"
              content="https://renttrustgh.com/images/rent-trust.jpg"
          />

          {/* Twitter */}
          <meta
              name="twitter:card"
              content="summary_large_image"
          />

          <meta
              name="twitter:title"
              content="Become a Verified Agent or Landlord | RentTrustGh"
          />

          <meta
              name="twitter:description"
              content="Create your RentTrustGh agent account, list properties, build trust, and reach more tenants across Ghana."
          />

          <meta
              name="twitter:image"
              content="https://renttrustgh.com/images/rent-trust.jpg"
          />

          {/* Structured Data */}
          <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "WebPage",
                      "name": "Become a Verified Agent or Landlord",
                      "url": "https://renttrustgh.com/become-agent",
                      "description": "Register as a verified landlord or real estate agent on RentTrustGh.",
                      "isPartOf": {
                          "@type": "WebSite",
                          "name": "RentTrustGh",
                          "url": "https://renttrustgh.com"
                      },
                      "publisher": {
                          "@type": "Organization",
                          "name": "RentTrustGh",
                          "url": "https://renttrustgh.com",
                          "logo": {
                              "@type": "ImageObject",
                              "url": "https://renttrustgh.com/images/rent-trust.jpg"
                          }
                      }
                  })
              }}
          />

          {/* Breadcrumb Schema */}
          <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "BreadcrumbList",
                      "itemListElement": [
                          {
                              "@type": "ListItem",
                              "position": 1,
                              "name": "Home",
                              "item": "https://renttrustgh.com"
                          },
                          {
                              "@type": "ListItem",
                              "position": 2,
                              "name": "Become an Agent",
                              "item": "https://renttrustgh.com/become-agent"
                          }
                      ]
                  })
              }}
          />
      </Head>
      <style>{`
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
        h1,h2,h3,h4,h5,h6 { font-weight: 600; }
        textarea { resize: vertical; }
        @media (max-width: 768px) {
          input[type="text"], input[type="email"], input[type="password"], input[type="tel"], input[type="number"] { font-size: 16px !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1, padding: 'clamp(1.5rem, 4vw, 3rem) 1rem' }}>
          <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
            <div style={{ backgroundColor: 'white', border: `1px solid ${C.border}`, borderRadius: '1rem', boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.1)' }}>

              {/* Header */}
              <div style={{ padding: 'clamp(1.5rem, 4vw, 2rem)', textAlign: 'center', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: '30%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <img src="/images/rent-trust.png" alt="RentTrustGh" />
                </div>
                <h1 style={{ color: C.text, fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Register as Agent/Landlord
                </h1>
                <p style={{ color: C.muted, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', margin: 0 }}>
                  Build your reputation and connect with tenants on RentTrust
                </p>
              </div>

              {/* Form */}
              <div style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Full name */}
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input
                        type="text"
                        placeholder="Kofi Mensah"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        style={fieldStyle(!!errors.name)}
                        onFocus={onFocus(!!errors.name)}
                        onBlur={onBlur(!!errors.name)}
                      />
                      <ErrorMsg msg={errors.name} />
                    </div>

                    {/* Phone */}
                    <div>
                      <label style={labelStyle}>Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="+233 XX XXX XXXX"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        style={fieldStyle(!!errors.phone)}
                        onFocus={onFocus(!!errors.phone)}
                        onBlur={onBlur(!!errors.phone)}
                      />
                      <ErrorMsg msg={errors.phone} />
                    </div>

                    {/* Email */}
                    <div>
                      <label style={labelStyle}>Email *</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={data.email}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          style={{ ...fieldStyle(emailHasError, emailIsValid), paddingRight: '2.25rem' }}
                          onFocus={onFocus(emailHasError, emailIsValid)}
                          onBlur={onBlur(emailHasError, emailIsValid)}
                        />
                        <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                          <EmailIcon status={emailStatus} />
                        </span>
                      </div>
                      {errors.email                                      && <ErrorMsg msg={errors.email} />}
                      {!errors.email && emailStatus === 'taken'          && <ErrorMsg msg="This email is already registered." />}
                      {!errors.email && emailStatus === 'invalid'        && <ErrorMsg msg="Please enter a valid email address." />}
                      {!errors.email && emailStatus === 'valid'          && <HintMsg  msg="✓ Email is available." color={C.green} />}
                    </div>

                    {/* Company */}
                    <div>
                      <label style={labelStyle}>Company/Agency Name</label>
                      <input
                        type="text"
                        placeholder="Optional"
                        value={data.company}
                        onChange={(e) => setData('company', e.target.value)}
                        style={fieldStyle(!!errors.company)}
                        onFocus={onFocus(!!errors.company)}
                        onBlur={onBlur(!!errors.company)}
                      />
                      <ErrorMsg msg={errors.company} />
                    </div>

                    {/* Type + Fee */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={labelStyle}>Type of Agent</label>
                        <select
                          value={data.type}
                          onChange={(e) => setData('type', e.target.value)}
                          style={{ ...fieldStyle(!!errors.type), appearance: 'none' }}
                          onFocus={onFocus(!!errors.type)}
                          onBlur={onBlur(!!errors.type)}
                        >
                          <option value="">Select agent type</option>
                          {agentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ErrorMsg msg={errors.type} />
                      </div>

                      <div>
                        <label style={labelStyle}>Agent Fee (%)</label>
                        <input
                          type="number"
                          placeholder="e.g. 10"
                          min="0" max="100"
                          value={data.fee}
                          onChange={(e) => setData('fee', e.target.value)}
                          style={fieldStyle(!!errors.fee)}
                          onFocus={onFocus(!!errors.fee)}
                          onBlur={onBlur(!!errors.fee)}
                        />
                        <ErrorMsg msg={errors.fee} />
                        {!errors.fee && <HintMsg msg="Your typical commission rate" />}
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label style={labelStyle}>Bio</label>
                      <textarea
                        placeholder="Tell tenants about yourself and your experience..."
                        rows={4}
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        style={{ ...fieldStyle(!!errors.bio), fontFamily: 'inherit' }}
                        onFocus={onFocus(!!errors.bio)}
                        onBlur={onBlur(!!errors.bio)}
                      />
                      <ErrorMsg msg={errors.bio} />
                      <HintMsg msg={`${data.bio.length}/500 characters`} color={data.bio.length > 480 ? C.red : C.muted} />
                    </div>

                    {/* Password */}
                    <div>
                      <label style={labelStyle}>Password *</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={data.password}
                          onChange={(e) => setData('password', e.target.value)}
                          style={{ ...fieldStyle(!!errors.password), paddingRight: '3rem' }}
                          onFocus={onFocus(!!errors.password)}
                          onBlur={onBlur(!!errors.password)}
                        />
                        <button type="button" onClick={() => setShowPassword((v) => !v)}
                          style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: C.muted, cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = C.teal}
                          onMouseLeave={(e) => e.currentTarget.style.color = C.muted}
                        >
                          {showPassword ? <EyeOff style={{ height: '1.25rem', width: '1.25rem' }} /> : <Eye style={{ height: '1.25rem', width: '1.25rem' }} />}
                        </button>
                      </div>
                      <StrengthMeter password={data.password} />
                      <ErrorMsg msg={errors.password} />
                    </div>

                    {/* Confirm password */}
                    <div>
                      <label style={labelStyle}>Confirm Password *</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={data.password_confirmation}
                          onChange={(e) => setData('password_confirmation', e.target.value)}
                          style={{ ...fieldStyle(confirmHasError, confirmIsValid), paddingRight: '3rem' }}
                          onFocus={onFocus(confirmHasError, confirmIsValid)}
                          onBlur={onBlur(confirmHasError, confirmIsValid)}
                        />
                        <button type="button" onClick={() => setShowConfirm((v) => !v)}
                          style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: C.muted, cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = C.teal}
                          onMouseLeave={(e) => e.currentTarget.style.color = C.muted}
                        >
                          {showConfirm ? <EyeOff style={{ height: '1.25rem', width: '1.25rem' }} /> : <Eye style={{ height: '1.25rem', width: '1.25rem' }} />}
                        </button>
                      </div>
                      {errors.password_confirmation                            && <ErrorMsg msg={errors.password_confirmation} />}
                      {!errors.password_confirmation && confirmFilled && !passwordsMatch && <ErrorMsg msg="Passwords do not match." />}
                      {!errors.password_confirmation && confirmIsValid              && <HintMsg  msg="✓ Passwords match." color={C.green} />}
                    </div>

                    {/* Benefits */}
                    <div style={{ backgroundColor: 'hsl(152 60% 40% / 0.05)', border: '1px solid hsl(152 60% 40% / 0.2)', borderRadius: '0.75rem', padding: '1rem' }}>
                      <h4 style={{ fontWeight: 500, marginBottom: '0.5rem', color: C.text }}>Benefits of Registering</h4>
                      <div style={{ fontSize: '0.875rem', color: C.muted, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                        {[
                          'Respond to tenant reviews and build your reputation',
                          'Manage property listings',
                          'Get verified badge to increase trust',
                          'Connect with potential tenants directly',
                        ].map((benefit) => (
                          <div key={benefit} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <CheckCircle style={{ height: '1rem', width: '1rem', marginTop: '0.125rem', color: 'hsl(152 60% 40%)', flexShrink: 0 }} />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={processing}
                      style={{ width: '100%', padding: '0.75rem', border: 'none', borderRadius: '0.75rem', background: processing ? `${C.teal}80` : C.teal, color: 'white', fontWeight: 600, fontSize: '1rem', cursor: processing ? 'not-allowed' : 'pointer', transition: 'opacity 0.15s' }}
                      onMouseEnter={(e) => !processing && (e.currentTarget.style.opacity = '0.88')}
                      onMouseLeave={(e) => !processing && (e.currentTarget.style.opacity = '1')}
                    >
                      {processing ? 'Registering…' : 'Complete Registration'}
                    </button>

                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BecomeAgentPage;