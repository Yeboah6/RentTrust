import { useState } from "react";
import { Upload, X, AlertCircle } from "lucide-react";

// Standalone Report Listing Dialog Component
const ReportListingDialog = ({ open, onOpenChange, propertyId, agentId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    is_anonymous: false,
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  
  // Mock user - set to null to see "not signed in" state
  const user = { id: "user123", email: "user@example.com" };

  const subjectOptions = [
    "Misleading listing information",
    "Fraudulent agent/landlord",
    "Price discrepancy",
    "Property doesn't exist",
    "Harassment or misconduct",
    "Other",
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subject) {
      newErrors.subject = "Please select an issue type";
    } else if (formData.subject.length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    }
    
    if (!formData.description) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Please provide more details (at least 20 characters)";
    } else if (formData.description.length > 2000) {
      newErrors.description = "Description must be less than 2000 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showToast("File too large", `${file.name} is larger than 5MB`, "error");
        return false;
      }
      return true;
    });
    setUploadedFiles((prev) => [...prev, ...validFiles].slice(0, 5));
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const showToast = (title, description, variant = "success") => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      showToast("Please sign in", "You need to be signed in to report a listing", "error");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Report submitted:", {
        complainant_id: user.id,
        property_id: propertyId,
        agent_id: agentId,
        subject: formData.subject,
        description: formData.description,
        evidence_files: uploadedFiles.map(f => f.name),
        is_anonymous: formData.is_anonymous,
      });
      
      showToast("Report submitted", "We'll review your complaint and take appropriate action");
      
      // Reset
      setFormData({ subject: "", description: "", is_anonymous: false });
      setUploadedFiles([]);
      setErrors({});
      setIsSubmitting(false);
      
      // Close dialog after short delay
      setTimeout(() => onOpenChange(false), 1500);
    }, 1500);
  };

  if (!open) return null;

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          backgroundColor: toast.variant === 'error' ? '#ef4444' : '#10b981',
          color: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          zIndex: 9999,
          maxWidth: '400px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{toast.title}</div>
          <div style={{ fontSize: '0.875rem' }}>{toast.description}</div>
        </div>
      )}

      {/* Dialog Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem'
        }}
        onClick={() => onOpenChange(false)}
      >
        {/* Dialog Content */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            maxWidth: '32rem',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <button
              onClick={() => onOpenChange(false)}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '1rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '0.25rem'
              }}
            >
              <X size={20} />
            </button>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Report This Listing
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Help us maintain trust by reporting problematic listings. All reports are reviewed by our team.
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: '1.5rem' }}>
            {!user ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  You need to be signed in to submit a report
                </p>
                <button style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Sign In
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Issue Type */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Issue Type *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: `1px solid ${errors.subject ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  >
                    <option value="">Select the issue type</option>
                    {subjectOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Please describe the issue in detail. Include dates, amounts, and any relevant information..."
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: `1px solid ${errors.description ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                  {errors.description && (
                    <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Evidence Upload */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Evidence (optional)
                  </label>
                  <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <input
                      type="file"
                      id="evidence-upload"
                      style={{ display: 'none' }}
                      accept="image/*,.pdf"
                      multiple
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="evidence-upload" style={{ cursor: 'pointer', display: 'block' }}>
                      <Upload size={32} style={{ margin: '0 auto 0.5rem', color: '#9ca3af' }} />
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Click to upload screenshots or documents
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                        Max 5 files, 5MB each
                      </p>
                    </label>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '0.375rem',
                            padding: '0.5rem'
                          }}
                        >
                          <span style={{
                            fontSize: '0.875rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1
                          }}>
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeFile(index)}
                            style={{
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              color: '#6b7280'
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Anonymous Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }}>
                  <div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.25rem'
                    }}>
                      Report Anonymously
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      Your identity won't be shared with the reported party
                    </div>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, is_anonymous: !formData.is_anonymous })}
                    style={{
                      width: '44px',
                      height: '24px',
                      backgroundColor: formData.is_anonymous ? '#3b82f6' : '#d1d5db',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: formData.is_anonymous ? '22px' : '2px',
                      transition: 'left 0.2s'
                    }} />
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    backgroundColor: isSubmitting ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontWeight: '500',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

// Demo App
export default function App() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '2rem',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
      }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: '700',
          marginBottom: '1rem',
          color: '#111827'
        }}>
          Property Listing
        </h1>
        
        <div style={{
          backgroundColor: '#f3f4f6',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
            Luxury 3-Bedroom Apartment
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            East Legon, Accra • GH₵ 2,500/month
          </p>
          <p style={{ color: '#374151', lineHeight: '1.5' }}>
            Beautiful spacious apartment with modern amenities, 24/7 security, 
            and close proximity to shopping centers and restaurants.
          </p>
        </div>

        <button
          onClick={() => setDialogOpen(true)}
          style={{
            padding: '0.625rem 1.25rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <AlertCircle size={18} />
          Report This Listing
        </button>
      </div>

      <ReportListingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        propertyId="prop123"
        agentId="agent456"
      />
    </div>
  );
}