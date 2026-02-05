import { useState } from "react";
import { useForm } from '@inertiajs/react';
import Header from '../Components/Layouts/Header';
import Footer from '../Components/Layouts/Footer';

// Icon components
const Shield = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const CheckCircle = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Eye = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOff = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const BecomeAgentPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const agentTypes = ['Landlord', 'Agent'];

  const { data, setData, post, processing, errors, reset } = useForm({
    fullName: "",
    phone: "",
    email: "",
    company: "",
    type: "",
    fee: "",
    bio: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/become-agent', {
      onSuccess: () => reset(),
    })
  };

  
  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        h1, h2, h3, h4, h5, h6 {
          font-weight: 600;
        }

        textarea {
          resize: vertical;
        }
      `}
      </style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1, padding: 'clamp(1.5rem, 4vw, 3rem) 1rem' }}>
          <div className="container mx-auto" style={{ maxWidth: '32rem' }}>
            <div
              style={{
                backgroundColor: 'white',
                border: '1px solid hsl(40 20% 88%)',
                borderRadius: '1rem',
                boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)'
              }}
            >
              {/* Header */}
              <div style={{ padding: 'clamp(1.5rem, 4vw, 2rem)', textAlign: 'center', borderBottom: '1px solid hsl(40 20% 88%)' }}>
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    background: 'hsl(174 62% 32% / 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}
                >
                  <Shield style={{ height: '1.5rem', width: '1.5rem', color: 'hsl(174 62% 32%)' }} />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                  Register as Agent/Landlord
                </h1>
                <p style={{ color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                  Build your reputation and connect with tenants on RentTrust
                </p>
              </div>

              {/* Content */}
              <div style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
                <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Full Name */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Kofi Mensah"
                      value={data.fullName}
                      onChange={(e) => setData('fullName', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${errors.fullName ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        outline: 'none',
                        color: 'hsl(200 25% 15%)'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = errors.fullName ? 'hsl(0 72% 51%)' : 'hsl(174 62% 32%)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = errors.fullName ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}
                    />
                    {errors.fullName && (
                      <p style={{ fontSize: '0.875rem', color: 'hsl(0 72% 51%)', marginTop: '0.375rem' }}>
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone and Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="+233 XX XXX XXXX"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `1px solid ${errors.phone ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          outline: 'none',
                          color: 'hsl(200 25% 15%)'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = errors.phone ? 'hsl(0 72% 51%)' : 'hsl(174 62% 32%)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = errors.phone ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}
                      />
                      {errors.phone && (
                        <p style={{ fontSize: '0.875rem', color: 'hsl(0 72% 51%)', marginTop: '0.375rem' }}>
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `1px solid ${errors.email ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          outline: 'none',
                          color: 'hsl(200 25% 15%)'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = errors.email ? 'hsl(0 72% 51%)' : 'hsl(174 62% 32%)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = errors.email ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}
                      />
                      {errors.email && (
                        <p style={{ fontSize: '0.875rem', color: 'hsl(0 72% 51%)', marginTop: '0.375rem' }}>
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Company Name */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                      Company/Agency Name
                    </label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={data.company}
                      onChange={(e) => setData('company', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid hsl(40 20% 88%)',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        outline: 'none',
                        color: 'hsl(200 25% 15%)'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'hsl(174 62% 32%)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'hsl(40 20% 88%)'}
                    />
                    {errors.company && (
                        <p style={{ fontSize: '0.875rem', color: 'hsl(0 72% 51%)', marginTop: '0.375rem' }}>
                          {errors.company}
                        </p>
                      )}
                  </div>

                  {/* License Number and Agent Fee */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                        Type of Agent
                      </label>
                      <select
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all appearance-none"
                        style={{ borderColor: errors.type ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)' }}
                      >
                        <option value="">Select agent type</option>
                        {agentTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.type && (
                        <p style={{ fontSize: '0.875rem', color: 'hsl(0 72% 51%)', marginTop: '0.375rem' }}>
                          {errors.type}
                        </p>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                        Agent Fee (%)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 10"
                        min="0"
                        max="100"
                        value={data.fee}
                        onChange={(e) => setData('fee', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid hsl(40 20% 88%)',
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          outline: 'none',
                          color: 'hsl(200 25% 15%)'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = 'hsl(174 62% 32%)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = 'hsl(40 20% 88%)'}
                      />
                      {errors.fee && (
                        <p style={{ fontSize: '0.875rem', color: 'hsl(0 72% 51%)', marginTop: '0.375rem' }}>
                          {errors.fee}
                        </p>
                      )}
                      <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginTop: '0.375rem' }}>
                        Your typical commission rate
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                      Bio
                    </label>
                    <textarea
                      placeholder="Tell tenants about yourself and your experience..."
                      rows={4}
                      value={data.bio}
                      onChange={(e) => setData('bio', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${errors.bio ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        outline: 'none',
                        color: 'hsl(200 25% 15%)',
                        fontFamily: 'inherit'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = errors.bio ? 'hsl(0 72% 51%)' : 'hsl(174 62% 32%)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = errors.bio ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}
                    />
                    {errors.bio && (
                      <p style={{ fontSize: '0.875rem', color: 'hsl(0 72% 51%)', marginTop: '0.375rem' }}>
                        {errors.bio}
                      </p>
                    )}
                    <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginTop: '0.375rem' }}>
                      {data.bio.length}/500 characters
                    </p>
                  </div>
                  {/* Password Field with Toggle */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          paddingRight: '3rem',
                          border: `1px solid ${errors.password ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          outline: 'none',
                          color: 'hsl(200 25% 15%)'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = errors.password ? 'hsl(0 72% 51%)' : 'hsl(174 62% 32%)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = errors.password ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '0.75rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          background: 'transparent',
                          color: 'hsl(200 15% 45%)',
                          cursor: 'pointer',
                          padding: '0.25rem'
                        }}
                      >
                        {showPassword ? <EyeOff style={{ height: '1.25rem', width: '1.25rem' }} /> : <Eye style={{ height: '1.25rem', width: '1.25rem' }} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p style={{ fontSize: '0.875rem', color: 'hsl(0 72% 51%)', marginTop: '0.375rem' }}>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Benefits Section */}
                  <div
                    style={{
                      backgroundColor: 'hsl(152 60% 40% / 0.05)',
                      border: '1px solid hsl(152 60% 40% / 0.2)',
                      borderRadius: '0.75rem',
                      padding: '1rem'
                    }}
                  >
                    <h4 className="font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                      Benefits of Registering
                    </h4>
                    <div style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                        <CheckCircle style={{ height: '1rem', width: '1rem', marginTop: '0.125rem', color: 'hsl(152 60% 40%)', flexShrink: 0 }} />
                        <span>Respond to tenant reviews and build your reputation</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                        <CheckCircle style={{ height: '1rem', width: '1rem', marginTop: '0.125rem', color: 'hsl(152 60% 40%)', flexShrink: 0 }} />
                        <span>Claim and manage property listings</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                        <CheckCircle style={{ height: '1rem', width: '1rem', marginTop: '0.125rem', color: 'hsl(152 60% 40%)', flexShrink: 0 }} />
                        <span>Get verified badge to increase trust</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                        <CheckCircle style={{ height: '1rem', width: '1rem', marginTop: '0.125rem', color: 'hsl(152 60% 40%)', flexShrink: 0 }} />
                        <span>Connect with potential tenants directly</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    disabled={processing}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: 'none',
                      borderRadius: '0.75rem',
                      background: processing ? 'hsl(174 62% 32% / 0.5)' : 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                      color: 'white',
                      fontWeight: '500',
                      cursor: processing ? 'not-allowed' : 'pointer',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => !processing && (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={(e) => !processing && (e.currentTarget.style.opacity = '1')}
                  >
                    {processing ? "Registering..." : "Complete Registration"}
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