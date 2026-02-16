import { useState } from "react";
import { useForm, Link } from "@inertiajs/react";

// Icon components
const Mail = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Building = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const Users = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ArrowLeft = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    post('/sign-up');
  }

  const handleLogin = (e) => {
    e.preventDefault();
    post('/login');
  }

  const handleBack = () => {
    window.location.href = "/";
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    reset(); // Clear form data when switching modes
    setShowPassword(false); // Reset password visibility
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        h1, h2, h3, h4, h5, h6 {
          font-weight: 600;
        }

        /* Mobile touch optimization */
        @media (max-width: 768px) {
          button {
            -webkit-tap-highlight-color: transparent;
            min-height: 44px;
          }
        }

        /* Prevent zoom on input focus for iOS */
        @media (max-width: 768px) {
          input[type="text"],
          input[type="email"],
          input[type="password"] {
            font-size: 16px !important;
          }
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(1rem, 4vw, 3rem) 1rem' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '28rem',
              backgroundColor: 'white',
              border: '1px solid hsl(40 20% 88%)',
              borderRadius: '1rem',
              boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)',
              position: 'relative'
            }}
          >
            {/* Back Button */}
            <button
              onClick={handleBack}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '1rem',
                padding: '0.5rem',
                border: 'none',
                background: 'transparent',
                color: 'hsl(200 15% 45%)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(174 62% 32%)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(200 15% 45%)'}
            >
              <ArrowLeft style={{ height: '1rem', width: '1rem' }} />
              Back
            </button>

            {/* Header */}
            <div style={{ padding: '3rem 2rem 1.5rem', textAlign: 'center' }}>
              <h1 
                className="tracking-tight" 
                style={{ 
                  color: 'hsl(200 25% 15%)',
                  fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  lineHeight: '1.2'
                }}
              >
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p style={{ 
                color: 'hsl(200 15% 45%)', 
                fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
                lineHeight: '1.5'
              }}>
                {isLogin
                  ? "Sign in to your RentTrust account"
                  : "Join RentTrust to find your perfect home"}
              </p>
            </div>

            {/* Content */}
            <div style={{ padding: '0 2rem 2rem' }}>
              {/* Form */}
              <form onSubmit={isLogin ? handleLogin : handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Full Name - Show only for signup */}
                {!isLogin && (
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '500', 
                      fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', 
                      color: 'hsl(200 25% 15%)' 
                    }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Kofi Mensah"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'clamp(0.625rem, 2vw, 0.75rem)',
                        border: `1px solid ${errors.name ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                        borderRadius: '0.75rem',
                        fontSize: 'clamp(0.9375rem, 2vw, 1rem)',
                        outline: 'none',
                        color: 'hsl(200 25% 15%)',
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = errors.name ? 'hsl(0 72% 51%)' : 'hsl(174 62% 32%)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = errors.name ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}
                    />
                    {errors.name && (
                      <p style={{ 
                        fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', 
                        color: 'hsl(0 72% 51%)', 
                        marginTop: '0.375rem',
                        lineHeight: '1.4'
                      }}>
                        {errors.name}
                      </p>
                    )}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500', 
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', 
                    color: 'hsl(200 25% 15%)' 
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: 'clamp(0.625rem, 2vw, 0.75rem)',
                      border: `1px solid ${errors.email ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                      borderRadius: '0.75rem',
                      fontSize: 'clamp(0.9375rem, 2vw, 1rem)',
                      outline: 'none',
                      color: 'hsl(200 25% 15%)',
                      backgroundColor: 'white'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = errors.email ? 'hsl(0 72% 51%)' : 'hsl(174 62% 32%)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = errors.email ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}
                  />
                  {errors.email && (
                    <p style={{ 
                      fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', 
                      color: 'hsl(0 72% 51%)', 
                      marginTop: '0.375rem',
                      lineHeight: '1.4'
                    }}>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500', 
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', 
                    color: 'hsl(200 25% 15%)' 
                  }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      style={{
                        width: '100%',
                        padding: 'clamp(0.625rem, 2vw, 0.75rem)',
                        paddingRight: '3rem',
                        border: `1px solid ${errors.password ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                        borderRadius: '0.75rem',
                        fontSize: 'clamp(0.9375rem, 2vw, 1rem)',
                        outline: 'none',
                        color: 'hsl(200 25% 15%)',
                        backgroundColor: 'white'
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
                        padding: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(174 62% 32%)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(200 15% 45%)'}
                    >
                      {showPassword ? (
                        <EyeOff style={{ height: '1.25rem', width: '1.25rem' }} />
                      ) : (
                        <Eye style={{ height: '1.25rem', width: '1.25rem' }} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p style={{ 
                      fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', 
                      color: 'hsl(0 72% 51%)', 
                      marginTop: '0.375rem',
                      lineHeight: '1.4'
                    }}>
                      {errors.password}
                    </p>
                  )}
                  {!isLogin && !errors.password && (
                    <p style={{ 
                      fontSize: 'clamp(0.75rem, 1.8vw, 0.8125rem)', 
                      color: 'hsl(200 15% 45%)', 
                      marginTop: '0.375rem',
                      lineHeight: '1.4'
                    }}>
                      Must be at least 8 characters
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="font-semibold rounded-lg transition-all duration-200 active:scale-95"
                  style={{
                    width: '100%',
                    padding: 'clamp(0.75rem, 2.5vw, 1rem)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    background: processing ? 'hsl(174 62% 32% / 0.5)' : 'hsl(174 62% 32%)',
                    color: 'white',
                    fontSize: 'clamp(0.9375rem, 2vw, 1rem)',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    marginTop: '0.5rem',
                    touchAction: 'manipulation'
                  }}
                  onMouseEnter={(e) => !processing && (e.currentTarget.style.backgroundColor = 'hsl(174 55% 28%)')}
                  onMouseLeave={(e) => !processing && (e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)')}
                >
                  {processing ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
                </button>

                {/* Forgot Password Link */}
                {isLogin && (
                  <div style={{ textAlign: 'center' }}>
                    <Link 
                      href="/forgot-password"
                      style={{
                        color: 'hsl(174 62% 32%)',
                        fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                        fontWeight: '500',
                        textDecoration: 'none',
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}
              </form>

              {/* Toggle Login/Signup */}
              <div style={{ 
                marginTop: '1.5rem', 
                paddingTop: '1.5rem',
                borderTop: '1px solid hsl(40 20% 88%)',
                textAlign: 'center' 
              }}>
                <p style={{ 
                  color: 'hsl(200 15% 45%)', 
                  fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                  marginBottom: '0.5rem'
                }}>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p>
                <button
                  onClick={toggleAuthMode}
                  className="font-semibold"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'hsl(174 62% 32%)',
                    cursor: 'pointer',
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                    padding: '0.5rem 1rem',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {isLogin ? "Create an account" : "Sign in instead"}
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