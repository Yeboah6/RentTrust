import { useState } from "react";
import Header from "../Components/Layouts/Header";
import Footer from "../Components/Layouts/Footer";

// Icon components
const Shield = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Upload = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const X = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Search = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CheckCircle = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const mockProperties = [
  { id: "1", title: "2 Bedroom Self-Contained", address: "123 Oxford Street", city: "Accra" },
  { id: "2", title: "3 Bedroom House", address: "45 Ring Road", city: "Accra" },
  { id: "3", title: "Studio Apartment", address: "12 Cantonments Road", city: "Accra" },
  { id: "4", title: "1 Bedroom Apartment", address: "78 Spintex Road", city: "Tema" },
  { id: "5", title: "4 Bedroom Townhouse", address: "90 East Legon", city: "Accra" },
];

const ClaimListingPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState("");

  const filteredProperties = searchQuery.length >= 2
    ? mockProperties.filter(prop =>
        prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB`);
        return false;
      }
      return true;
    });
    setUploadedFiles((prev) => [...prev, ...validFiles].slice(0, 5));
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const selectProperty = (property) => {
    setSelectedProperty(property);
    setSearchQuery("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!selectedProperty) {
      setError("Please select a property");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("Claim submitted successfully! We'll review your claim within 2-3 business days.");
      
      // Reset form
      setSelectedProperty(null);
      setUploadedFiles([]);
      setError("");
    } catch (error) {
      alert("Error submitting claim. Please try again.");
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

        .property-option:hover {
          background-color: hsl(40 30% 94%);
        }
      `}</style>

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
                <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                  Claim a Listing
                </h1>
                <p style={{ color: 'hsl(200 15% 45%)', fontSize: '0.875rem' }}>
                  Verify that you manage or own a property to respond to reviews and update listing details
                </p>
              </div>

              {/* Content */}
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Property Search */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                      Select Property *
                    </label>

                    {selectedProperty ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: 'hsl(40 30% 94%)',
                          borderRadius: '0.75rem',
                          padding: '0.75rem'
                        }}
                      >
                        <div>
                          <p className="font-medium" style={{ color: 'hsl(200 25% 15%)' }}>
                            {selectedProperty.title}
                          </p>
                          <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                            {selectedProperty.address}, {selectedProperty.city}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedProperty(null);
                            setError("");
                          }}
                          style={{
                            padding: '0.5rem',
                            border: 'none',
                            background: 'transparent',
                            color: 'hsl(200 15% 45%)',
                            cursor: 'pointer',
                            borderRadius: '0.375rem'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 20% 88%)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <X style={{ height: '1rem', width: '1rem' }} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ position: 'relative' }}>
                        <Search
                          style={{
                            position: 'absolute',
                            left: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            height: '1rem',
                            width: '1rem',
                            color: 'hsl(200 15% 45%)'
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Search for a property..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{
                            width: '100%',
                            paddingLeft: '2.5rem',
                            padding: '0.75rem',
                            border: `1px solid ${error ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                            borderRadius: '0.75rem',
                            fontSize: '1rem',
                            outline: 'none',
                            color: 'hsl(200 25% 15%)'
                          }}
                          onFocus={(e) => e.currentTarget.style.borderColor = error ? 'hsl(0 72% 51%)' : 'hsl(174 62% 32%)'}
                          onBlur={(e) => e.currentTarget.style.borderColor = error ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}
                        />

                        {filteredProperties.length > 0 && (
                          <div
                            style={{
                              position: 'absolute',
                              zIndex: 10,
                              width: '100%',
                              marginTop: '0.25rem',
                              backgroundColor: 'white',
                              border: '1px solid hsl(40 20% 88%)',
                              borderRadius: '0.75rem',
                              boxShadow: '0 8px 20px -4px hsl(200 25% 15% / 0.12)',
                              maxHeight: '15rem',
                              overflowY: 'auto'
                            }}
                          >
                            {filteredProperties.map((property, index) => (
                              <button
                                key={property.id}
                                onClick={() => selectProperty(property)}
                                className="property-option"
                                style={{
                                  width: '100%',
                                  textAlign: 'left',
                                  padding: '0.75rem 1rem',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.15s',
                                  borderBottom: index < filteredProperties.length - 1 ? '1px solid hsl(40 20% 92%)' : 'none'
                                }}
                              >
                                <p className="font-medium" style={{ color: 'hsl(200 25% 15%)', marginBottom: '0.125rem' }}>
                                  {property.title}
                                </p>
                                <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                                  {property.address}, {property.city}
                                </p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginTop: '0.375rem' }}>
                      Search for unclaimed properties by name or address
                    </p>
                    {error && (
                      <p style={{ fontSize: '0.875rem', color: 'hsl(0 72% 51%)', marginTop: '0.375rem' }}>
                        {error}
                      </p>
                    )}
                  </div>

                  {/* Verification Documents */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                      Verification Documents
                    </label>
                    <div
                      style={{
                        border: '2px dashed hsl(40 20% 88%)',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.borderColor = 'hsl(174 62% 32%)';
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.style.borderColor = 'hsl(40 20% 88%)';
                      }}
                    >
                      <input
                        type="file"
                        id="doc-upload"
                        style={{ display: 'none' }}
                        accept="image/*,.pdf"
                        multiple
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="doc-upload" style={{ cursor: 'pointer' }}>
                        <Upload style={{ height: '2rem', width: '2rem', margin: '0 auto 0.5rem', color: 'hsl(200 15% 45%)' }} />
                        <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                          Upload proof of ownership or management
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginTop: '0.25rem' }}>
                          Lease agreements, property documents, agency contracts
                        </p>
                      </label>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              backgroundColor: 'hsl(40 30% 94%)',
                              borderRadius: '0.5rem',
                              padding: '0.5rem'
                            }}
                          >
                            <span style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                              {file.name}
                            </span>
                            <button
                              onClick={() => removeFile(index)}
                              style={{
                                padding: '0.25rem',
                                border: 'none',
                                background: 'transparent',
                                color: 'hsl(200 15% 45%)',
                                cursor: 'pointer',
                                borderRadius: '0.25rem'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 20% 88%)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <X style={{ height: '1rem', width: '1rem' }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Info Box */}
                  <div
                    style={{
                      backgroundColor: 'hsl(40 30% 94%)',
                      borderRadius: '0.75rem',
                      padding: '1rem'
                    }}
                  >
                    <h4 className="font-medium mb-2" style={{ color: 'hsl(200 25% 15%)' }}>
                      What happens next?
                    </h4>
                    <div style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                        <CheckCircle style={{ height: '1rem', width: '1rem', marginTop: '0.125rem', color: 'hsl(152 60% 40%)', flexShrink: 0 }} />
                        <span>Our team will review your claim within 2-3 business days</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                        <CheckCircle style={{ height: '1rem', width: '1rem', marginTop: '0.125rem', color: 'hsl(152 60% 40%)', flexShrink: 0 }} />
                        <span>You may be contacted for additional verification</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                        <CheckCircle style={{ height: '1rem', width: '1rem', marginTop: '0.125rem', color: 'hsl(152 60% 40%)', flexShrink: 0 }} />
                        <span>Once verified, you can manage the listing and respond to reviews</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !selectedProperty}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: 'none',
                      borderRadius: '0.75rem',
                      background: (isSubmitting || !selectedProperty) 
                        ? 'hsl(174 62% 32% / 0.5)' 
                        : 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                      color: 'white',
                      fontWeight: '500',
                      cursor: (isSubmitting || !selectedProperty) ? 'not-allowed' : 'pointer',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => !isSubmitting && selectedProperty && (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={(e) => !isSubmitting && selectedProperty && (e.currentTarget.style.opacity = '1')}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Claim"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ClaimListingPage;