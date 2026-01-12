import { useState } from "react";
import Header from "../../Components/Layouts/Header";
import Footer from "../../Components/Layouts/Footer";
import { useForm } from "@inertiajs/react";

// Icon components
const Mail = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Phone = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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

  const { data, setData, post, processing, errors, reset } = useForm({
    fullName: '',
    email: '',
    password: '',
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    post('/sign-up', {
      onSuccess: () => reset(),
    });
  }

  const [isLogin, setIsLogin] = useState(true);
  const [activeTab, setActiveTab] = useState("email");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Email form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailErrors, setEmailErrors] = useState({ email: "", password: "", fullName: "" });

  // Phone form state
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async () => {
    const errors = { email: "", password: "", fullName: "" };

    if (!email) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!isLogin && !fullName) {
      errors.fullName = "Full name is required";
    }

    setEmailErrors(errors);

    if (errors.email || errors.password || errors.fullName) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isLogin) {
        alert("Welcome back! You have successfully signed in");
      } else {
        alert("Account created! Welcome to RentTrust Ghana");
      }
      
      // Reset form
      setEmail("");
      setPassword("");
      setFullName("");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phone) {
      setPhoneError("Phone number is required");
      return;
    } else if (phone.length < 10) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    setPhoneError("");
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("OTP Sent! Check your phone for the verification code");
      setPhone("");
    } finally {
      setIsLoading(false);
    }
  };

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
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

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
              onClick={() => alert("Navigate to home")}
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

            {/* Header */}
            <div style={{ padding: '3rem 2rem 1.5rem', textAlign: 'center' }}>
              <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p style={{ color: 'hsl(200 15% 45%)', fontSize: '0.875rem' }}>
                {isLogin
                  ? "Sign in to submit reviews and list properties"
                  : "Join RentTrust to help fellow tenants"}
              </p>
            </div>

            {/* Content */}
            <div style={{ padding: '0 2rem 2rem' }}>
              {/* Tabs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  backgroundColor: 'hsl(40 30% 94%)',
                  padding: '0.25rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1.5rem'
                }}
              >
                <button
                  onClick={() => setActiveTab("email")}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    backgroundColor: activeTab === "email" ? 'white' : 'transparent',
                    color: activeTab === "email" ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                    boxShadow: activeTab === "email" ? '0 1px 2px 0 hsl(200 25% 15% / 0.05)' : 'none'
                  }}
                >
                  <Mail style={{ height: '1rem', width: '1rem' }} />
                  Email
                </button>
                <button
                  onClick={() => setActiveTab("phone")}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    backgroundColor: activeTab === "phone" ? 'white' : 'transparent',
                    color: activeTab === "phone" ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                    boxShadow: activeTab === "phone" ? '0 1px 2px 0 hsl(200 25% 15% / 0.05)' : 'none'
                  }}
                >
                  <Phone style={{ height: '1rem', width: '1rem' }} />
                  Phone
                </button>
              </div>

              {/* Email Tab */}
              {activeTab === "email" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <form onSubmit={handleSignUp}>
                  {!isLogin && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Kofi Mensah"
                        value={data.fullName}
                        onChange={(e) => setData("fullName", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `1px solid ${emailErrors.fullName ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          outline: 'none',
                          color: 'hsl(200 25% 15%)'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = emailErrors.fullName ? 'hsl(0 72% 51%)' : 'hsl(174 62% 32%)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = emailErrors.fullName ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}
                      />
                      {emailErrors.fullName && (
                        <p style={{ fontSize: '0.875rem', color: 'hsl(0 72% 51%)', marginTop: '0.375rem' }}>
                          {emailErrors.fullName}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={data.email}
                      onChange={(e) => setData("email", e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit()}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${emailErrors.email ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        outline: 'none',
                        color: 'hsl(200 25% 15%)'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = emailErrors.email ? 'hsl(0 72% 51%)' : 'hsl(174 62% 32%)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = emailErrors.email ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}
                    />
                    {emailErrors.email && (
                      <p style={{ fontSize: '0.875rem', color: 'hsl(0 72% 51%)', marginTop: '0.375rem' }}>
                        {emailErrors.email}
                      </p>
                    )}
                  </div>

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
                        onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit()}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          paddingRight: '3rem',
                          border: `1px solid ${emailErrors.password ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          outline: 'none',
                          color: 'hsl(200 25% 15%)'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = emailErrors.password ? 'hsl(0 72% 51%)' : 'hsl(174 62% 32%)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = emailErrors.password ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}
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
                    {emailErrors.password && (
                      <p style={{ fontSize: '0.875rem', color: 'hsl(0 72% 51%)', marginTop: '0.375rem' }}>
                        {emailErrors.password}
                      </p>
                    )}
                  </div>

                  <button
                    // onClick={handleEmailSubmit}
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
                    {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
                  </button>
                  </form>
                </div>
              )}

              {/* Phone Tab */}
              {activeTab === "phone" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+233 XX XXX XXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handlePhoneSubmit()}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${phoneError ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        outline: 'none',
                        color: 'hsl(200 25% 15%)'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = phoneError ? 'hsl(0 72% 51%)' : 'hsl(174 62% 32%)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = phoneError ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}
                    />
                    {phoneError && (
                      <p style={{ fontSize: '0.875rem', color: 'hsl(0 72% 51%)', marginTop: '0.375rem' }}>
                        {phoneError}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handlePhoneSubmit}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: 'none',
                      borderRadius: '0.75rem',
                      background: isLoading ? 'hsl(174 62% 32% / 0.5)' : 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                      color: 'white',
                      fontWeight: '500',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => !isLoading && (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={(e) => !isLoading && (e.currentTarget.style.opacity = '1')}
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </button>

                  <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', textAlign: 'center' }}>
                    We'll send a one-time code to verify your number
                  </p>
                </div>
              )}

              {/* Toggle Login/Signup */}
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setEmailErrors({ email: "", password: "", fullName: "" });
                    setPhoneError("");
                  }}
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
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AuthPage;