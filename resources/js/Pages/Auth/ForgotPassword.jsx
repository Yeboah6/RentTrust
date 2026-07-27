import { useState } from "react";
import { useForm, Link, Head } from "@inertiajs/react";

// Icon components
const Mail = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ArrowLeft = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const CheckCircle = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const ForgotPasswordPage = () => {
  const [emailSent, setEmailSent] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    userType: "agent", // 'agent' or 'admin'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateEmail(data.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    post("/forgot-password", {
      onSuccess: () => {
        setEmailSent(true);
        reset("email");
      },
      onError: (errors) => {
        console.error("Error:", errors);
      },
    });
  };

  const handleBack = () => {
    window.location.href = "/sign-up";
  };

  return (
    <>
    <Head>
        <title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
    </Head>
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

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .slide-in {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
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
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(174 62% 32%)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(200 15% 45%)'}
            >
              <ArrowLeft style={{ height: '1rem', width: '1rem' }} />
              Back
            </button>

            {!emailSent ? (
              <>
                {/* Header */}
                <div style={{ padding: '3rem 2rem 1.5rem', textAlign: 'center' }}>
                  <div
                    style={{
                      width: '4rem',
                      height: '4rem',
                      margin: '0 auto 1rem',
                      borderRadius: '1rem',
                      background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Mail style={{ height: '2rem', width: '2rem', color: 'white' }} />
                  </div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
                    Forgot Password?
                  </h1>
                  <p style={{ color: 'hsl(200 15% 45%)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    No worries! Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {/* Content */}
                <div style={{ padding: '0 2rem 2rem' }}>
                  {/* Form */}
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* User Type Selection */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                        I am a
                      </label>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <label
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.75rem',
                            border: `2px solid ${data.userType === "agent" ? 'hsl(174 62% 32%)' : 'hsl(40 20% 88%)'}`,
                            borderRadius: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            backgroundColor: data.userType === "agent" ? 'hsl(174 62% 32% / 0.05)' : 'white',
                          }}
                        >
                          <input
                            type="radio"
                            name="userType"
                            value="agent"
                            checked={data.userType === "agent"}
                            onChange={(e) => setData("userType", e.target.value)}
                            style={{ 
                              marginRight: '0.5rem',
                              accentColor: 'hsl(174 62% 32%)'
                            }}
                          />
                          <span
                            style={{
                              fontWeight: '500',
                              fontSize: '0.875rem',
                              color: data.userType === "agent" ? 'hsl(174 62% 32%)' : 'hsl(200 15% 45%)',
                            }}
                          >
                            Agent
                          </span>
                        </label>
                        <label
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.75rem',
                            border: `2px solid ${data.userType === "admin" ? 'hsl(174 62% 32%)' : 'hsl(40 20% 88%)'}`,
                            borderRadius: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            backgroundColor: data.userType === "admin" ? 'hsl(174 62% 32% / 0.05)' : 'white',
                          }}
                        >
                          <input
                            type="radio"
                            name="userType"
                            value="admin"
                            checked={data.userType === "admin"}
                            onChange={(e) => setData("userType", e.target.value)}
                            style={{ 
                              marginRight: '0.5rem',
                              accentColor: 'hsl(174 62% 32%)'
                            }}
                          />
                          <span
                            style={{
                              fontWeight: '500',
                              fontSize: '0.875rem',
                              color: data.userType === "admin" ? 'hsl(174 62% 32%)' : 'hsl(200 15% 45%)',
                            }}
                          >
                            Admin
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="you@example.com"
                        required
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

                    {/* Submit Button */}
                    <button
                      type="submit"
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
                        transition: 'opacity 0.2s',
                        marginTop: '0.5rem'
                      }}
                      onMouseEnter={(e) => !processing && (e.currentTarget.style.opacity = '0.9')}
                      onMouseLeave={(e) => !processing && (e.currentTarget.style.opacity = '1')}
                    >
                      {processing ? "Sending..." : "Send Reset Link"}
                    </button>
                  </form>

                  {/* Footer Link */}
                  <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link
                      href="/sign-up"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: 'hsl(174 62% 32%)',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        textDecoration: 'underline'
                      }}
                    >
                      Remember your password? Sign in
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="slide-in" style={{ padding: '3rem 2rem 2rem', textAlign: 'center' }}>
                  <div
                    style={{
                      width: '4rem',
                      height: '4rem',
                      margin: '0 auto 1rem',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, hsl(142 76% 36%) 0%, hsl(142 71% 30%) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckCircle style={{ height: '2rem', width: '2rem', color: 'white' }} />
                  </div>
                  <h2
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: 'hsl(200 25% 15%)',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Check Your Email
                  </h2>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'hsl(200 15% 45%)',
                      lineHeight: '1.5',
                      marginBottom: '1.5rem'
                    }}
                  >
                    We've sent a password reset link to <strong style={{ color: 'hsl(200 25% 15%)' }}>{data.email}</strong>. 
                    Please check your inbox and follow the instructions.
                  </p>

                  <div
                    style={{
                      padding: '1rem',
                      backgroundColor: 'hsl(40 33% 98%)',
                      borderRadius: '0.75rem',
                      marginBottom: '1.5rem',
                      border: '1px solid hsl(40 20% 88%)'
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'hsl(200 15% 45%)',
                        margin: 0,
                      }}
                    >
                      💡 <strong style={{ color: 'hsl(200 25% 15%)' }}>Didn't receive the email?</strong> Check your spam
                      folder or{" "}
                      <button
                        onClick={() => setEmailSent(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'hsl(174 62% 32%)',
                          fontWeight: '500',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: 0,
                          fontSize: '0.8125rem'
                        }}
                      >
                        try again
                      </button>
                      .
                    </p>
                  </div>

                  <Link
                    href="/sign-up"
                    style={{
                      display: 'inline-block',
                      padding: '0.75rem 2rem',
                      border: 'none',
                      borderRadius: '0.75rem',
                      background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                      color: 'white',
                      fontWeight: '500',
                      textDecoration: 'none',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ForgotPasswordPage;