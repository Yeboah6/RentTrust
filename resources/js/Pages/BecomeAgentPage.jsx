import { useState } from "react";

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

const BecomeAgentPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company_name: "",
    license_number: "",
    fee_percentage: "",
    bio: ""
  });

  // Error state
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    company_name: "",
    license_number: "",
    fee_percentage: "",
    bio: ""
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      name: "",
      phone: "",
      email: "",
      company_name: "",
      license_number: "",
      fee_percentage: "",
      bio: ""
    };

    // Validation
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("Registration successful! You can now manage listings and respond to reviews.");
      
      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        company_name: "",
        license_number: "",
        fee_percentage: "",
        bio: ""
      });
    } catch (error) {
      alert("Error during registration. Please try again.");
    } finally {
      setIsSubmitting(false);
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

        textarea {
          resize: vertical;
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        {/* Header */}
        <header style={{ backgroundColor: 'hsl(0 0% 100%)', borderBottom: '1px solid hsl(40 20% 88%)', padding: '1rem 0' }}>
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'hsl(174 62% 32%)' }}>
              RentTrust Ghana
            </h2>
          </div>
        </header>

        <main style={{ flex: 1, padding: '3rem 1rem' }}>
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
              <div style={{ padding: '2rem', textAlign: 'center', borderBottom: '1px solid hsl(40 20% 88%)' }}>
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
                <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                  Register as Agent/Landlord
                </h1>
                <p style={{ color: 'hsl(200 15% 45%)', fontSize: '0.875rem' }}>
                  Build your reputation and connect with tenants on RentTrust
                </p>
              </div>

              {/* Content */}
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Full Name */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Kofi Mensah"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `1px solid ${errors.name ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        outline: 'none',
                        color: 'hsl(200 25% 15%)'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = errors.name ? 'hsl(0 72% 51%)' : 'hsl(174 62% 32%)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = errors.name ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}
                    />
                    {errors.name && (
                      <p style={{ fontSize: '0.875rem', color: 'hsl(0 72% 51%)', marginTop: '0.375rem' }}>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone and Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="+233 XX XXX XXXX"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
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
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
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
                      value={formData.company_name}
                      onChange={(e) => handleChange('company_name', e.target.value)}
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
                  </div>

                  {/* License Number and Agent Fee */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                        License Number
                      </label>
                      <input
                        type="text"
                        placeholder="Optional"
                        value={formData.license_number}
                        onChange={(e) => handleChange('license_number', e.target.value)}
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
                      <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginTop: '0.375rem' }}>
                        If registered with a real estate body
                      </p>
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
                        value={formData.fee_percentage}
                        onChange={(e) => handleChange('fee_percentage', e.target.value)}
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
                      value={formData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
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
                      {formData.bio.length}/500 characters
                    </p>
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
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: 'none',
                      borderRadius: '0.75rem',
                      background: isSubmitting ? 'hsl(174 62% 32% / 0.5)' : 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                      color: 'white',
                      fontWeight: '500',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.opacity = '1')}
                  >
                    {isSubmitting ? "Registering..." : "Complete Registration"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer style={{ backgroundColor: 'hsl(0 0% 100%)', borderTop: '1px solid hsl(40 20% 88%)', padding: '2rem 0' }}>
          <div className="container mx-auto px-4" style={{ textAlign: 'center', color: 'hsl(200 15% 45%)' }}>
            <p>&copy; 2024 RentTrust Ghana. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default BecomeAgentPage;