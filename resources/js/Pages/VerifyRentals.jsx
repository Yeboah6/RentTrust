import { useState } from "react";

// Icons
const ShieldCheck = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const X = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Upload = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const CheckCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Building = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const DocumentText = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const UserCheck = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const VerificationRequestModal = ({ isOpen, onClose, agentData, selectedRental }) => {
  const [formData, setFormData] = useState({
    rental_id: selectedRental?.id || "",
    rental_title: selectedRental?.title || "",
    request_type: "initial_verification",
    proof_documents: [],
    property_ownership_docs: [],
    agent_license_docs: [],
    utility_bills: [],
    additional_notes: "",
    terms_accepted: false
  });

  const [uploadProgress, setUploadProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal closes or rental changes
  React.useEffect(() => {
    if (selectedRental) {
      setFormData(prev => ({
        ...prev,
        rental_id: selectedRental.id,
        rental_title: selectedRental.title
      }));
    }
  }, [selectedRental]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field, e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      progress: 0
    }));
    
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ...newFiles]
    }));

    // Simulate upload progress
    newFiles.forEach(fileObj => {
      simulateUpload(fileObj.id, field);
    });
  };

  const simulateUpload = (fileId, field) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const removeFile = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.terms_accepted) {
      alert("Please accept the terms and conditions");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare form data
      const submissionData = new FormData();
      
      // Add text fields
      submissionData.append('rental_id', formData.rental_id);
      submissionData.append('request_type', formData.request_type);
      submissionData.append('additional_notes', formData.additional_notes);
      submissionData.append('agent_id', agentData?.id);
      submissionData.append('agent_name', agentData?.fullName);
      
      // Add files
      formData.proof_documents.forEach((fileObj, index) => {
        submissionData.append(`proof_docs[${index}]`, fileObj.file);
      });
      
      formData.property_ownership_docs.forEach((fileObj, index) => {
        submissionData.append(`ownership_docs[${index}]`, fileObj.file);
      });
      
      formData.agent_license_docs.forEach((fileObj, index) => {
        submissionData.append(`license_docs[${index}]`, fileObj.file);
      });
      
      formData.utility_bills.forEach((fileObj, index) => {
        submissionData.append(`utility_bills[${index}]`, fileObj.file);
      });

      // Submit to backend
      const response = await fetch('/api/verification-requests', {
        method: 'POST',
        body: submissionData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
        }
      });

      if (response.ok) {
        alert("Verification request submitted successfully! You'll be notified when it's reviewed.");
        handleClose();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert("Failed to submit verification request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form state
    setFormData({
      rental_id: selectedRental?.id || "",
      rental_title: selectedRental?.title || "",
      request_type: "initial_verification",
      proof_documents: [],
      property_ownership_docs: [],
      agent_license_docs: [],
      utility_bills: [],
      additional_notes: "",
      terms_accepted: false
    });
    setUploadProgress({});
    onClose();
  };

  const documentSections = [
    {
      key: 'proof_documents',
      title: 'Proof of Property Ownership/Authorization',
      description: 'Property deed, title, lease agreement, or authorization letter from owner',
      required: true
    },
    {
      key: 'agent_license_docs',
      title: 'Agent License/Certification',
      description: 'Real estate license, business registration, or professional certification',
      required: false
    },
    {
      key: 'property_ownership_docs',
      title: 'Property Photos',
      description: 'Clear photos of property exterior, interior, and address',
      required: true
    },
    {
      key: 'utility_bills',
      title: 'Utility Bills (Optional)',
      description: 'Recent utility bills showing property address and ownership',
      required: false
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Backdrop */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
        animation: 'backdropFadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          handleClose();
        }
      }}
      >
        {/* Modal Container */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          animation: 'modalFadeIn 0.3s ease-out',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid hsl(40 20% 88%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.5rem',
                background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
              </div>
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: 'hsl(200 25% 15%)',
                  marginBottom: '0.125rem'
                }}>
                  Request Listing Verification
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                  Submit documents to verify your property listing
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              style={{
                padding: '0.5rem',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isSubmitting ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <X style={{ height: '1.5rem', width: '1.5rem', color: 'hsl(200 15% 45%)' }} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div style={{
            padding: '1.5rem',
            overflowY: 'auto',
            flex: 1
          }}>
            {/* Property Info */}
            <div style={{
              backgroundColor: 'hsl(174 62% 32% / 0.05)',
              border: '1px solid hsl(174 62% 32% / 0.2)',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Building style={{ height: '1.25rem', width: '1.25rem', color: 'hsl(174 62% 32%)' }} />
                <h3 style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'hsl(200 25% 15%)'
                }}>
                  Property Being Verified
                </h3>
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(174 62% 32%)', marginBottom: '0.25rem' }}>
                {formData.rental_title || 'No property selected'}
              </p>
              {selectedRental?.address && (
                <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                  {selectedRental.address}
                </p>
              )}
            </div>

            {/* Request Type */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'hsl(200 25% 15%)',
                marginBottom: '0.5rem'
              }}>
                Verification Request Type
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => handleInputChange('request_type', 'initial_verification')}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: formData.request_type === 'initial_verification' 
                      ? '2px solid hsl(174 62% 32%)' 
                      : '1px solid hsl(40 20% 88%)',
                    backgroundColor: formData.request_type === 'initial_verification' 
                      ? 'hsl(174 62% 32% / 0.1)' 
                      : 'white',
                    borderRadius: '0.5rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  <DocumentText style={{ 
                    height: '1.5rem', 
                    width: '1.5rem', 
                    color: formData.request_type === 'initial_verification' 
                      ? 'hsl(174 62% 32%)' 
                      : 'hsl(200 15% 45%)'
                  }} />
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: formData.request_type === 'initial_verification' 
                      ? 'hsl(174 62% 32%)' 
                      : 'hsl(200 25% 15%)'
                  }}>
                    Initial Verification
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'hsl(200 15% 45%)',
                    textAlign: 'center'
                  }}>
                    First-time verification request
                  </span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleInputChange('request_type', 're_verification')}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: formData.request_type === 're_verification' 
                      ? '2px solid hsl(174 62% 32%)' 
                      : '1px solid hsl(40 20% 88%)',
                    backgroundColor: formData.request_type === 're_verification' 
                      ? 'hsl(174 62% 32% / 0.1)' 
                      : 'white',
                    borderRadius: '0.5rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  <UserCheck style={{ 
                    height: '1.5rem', 
                    width: '1.5rem', 
                    color: formData.request_type === 're_verification' 
                      ? 'hsl(174 62% 32%)' 
                      : 'hsl(200 15% 45%)'
                  }} />
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: formData.request_type === 're_verification' 
                      ? 'hsl(174 62% 32%)' 
                      : 'hsl(200 25% 15%)'
                  }}>
                    Re-Verification
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'hsl(200 15% 45%)',
                    textAlign: 'center'
                  }}>
                    Update expired verification
                  </span>
                </button>
              </div>
            </div>

            {/* Document Upload Sections */}
            {documentSections.map((section) => (
              <div key={section.key} style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <label style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'hsl(200 25% 15%)'
                  }}>
                    {section.title}
                  </label>
                  {section.required && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'hsl(0 65% 45%)',
                      backgroundColor: 'hsl(0 65% 45% / 0.1)',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '0.25rem'
                    }}>
                      Required
                    </span>
                  )}
                </div>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'hsl(200 15% 45%)',
                  marginBottom: '0.75rem'
                }}>
                  {section.description}
                </p>
                
                {/* Upload Area */}
                <div style={{
                  border: '2px dashed hsl(40 20% 88%)',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'hsl(40 30% 98%)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  marginBottom: '0.75rem',
                  opacity: isSubmitting ? 0.7 : 1
                }}
                onClick={() => {
                  if (!isSubmitting) {
                    document.getElementById(`${section.key}-input`).click();
                  }
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.borderColor = 'hsl(174 62% 32%)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.borderColor = 'hsl(40 20% 88%)';
                  }
                }}
                >
                  <Upload style={{ 
                    height: '1.5rem', 
                    width: '1.5rem', 
                    color: 'hsl(200 15% 45%)', 
                    margin: '0 auto 0.5rem' 
                  }} />
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: 'hsl(200 25% 15%)', 
                    fontWeight: '500', 
                    marginBottom: '0.25rem' 
                  }}>
                    {isSubmitting ? 'Upload disabled during submission' : 'Click to upload files'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                    PNG, JPG, PDF up to 10MB each
                  </p>
                  <input
                    id={`${section.key}-input`}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(section.key, e)}
                    style={{ display: 'none' }}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Uploaded Files List */}
                {formData[section.key].length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    {formData[section.key].map((fileObj, index) => (
                      <div key={fileObj.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem',
                        backgroundColor: 'hsl(40 30% 96%)',
                        borderRadius: '0.375rem',
                        marginBottom: '0.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                          {uploadProgress[fileObj.id] >= 100 ? (
                            <CheckCircle style={{ height: '1rem', width: '1rem', color: 'hsl(152 60% 40%)' }} />
                          ) : (
                            <div style={{
                              width: '1rem',
                              height: '1rem',
                              border: '2px solid hsl(174 62% 32%)',
                              borderTopColor: 'transparent',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }} />
                          )}
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                              {fileObj.name}
                            </span>
                            {uploadProgress[fileObj.id] < 100 && (
                              <div style={{
                                width: '100%',
                                height: '4px',
                                backgroundColor: 'hsl(40 20% 88%)',
                                borderRadius: '2px',
                                marginTop: '0.25rem',
                                overflow: 'hidden'
                              }}>
                                <div style={{
                                  width: `${uploadProgress[fileObj.id]}%`,
                                  height: '100%',
                                  backgroundColor: 'hsl(174 62% 32%)',
                                  transition: 'width 0.3s ease'
                                }} />
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(section.key, index)}
                          disabled={isSubmitting || uploadProgress[fileObj.id] < 100}
                          style={{
                            padding: '0.25rem',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: (isSubmitting || uploadProgress[fileObj.id] < 100) ? 'not-allowed' : 'pointer',
                            color: 'hsl(0 65% 45%)',
                            opacity: (isSubmitting || uploadProgress[fileObj.id] < 100) ? 0.5 : 1
                          }}
                        >
                          <X style={{ height: '1rem', width: '1rem' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Additional Notes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'hsl(200 25% 15%)',
                marginBottom: '0.5rem'
              }}>
                Additional Information
              </label>
              <textarea
                value={formData.additional_notes}
                onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                placeholder="Any additional information that might help with verification..."
                rows={3}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid hsl(40 20% 88%)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                  backgroundColor: isSubmitting ? 'hsl(40 30% 96%)' : 'white',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              />
            </div>

            {/* Terms and Conditions */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.terms_accepted}
                  onChange={(e) => handleInputChange('terms_accepted', e.target.checked)}
                  disabled={isSubmitting}
                  style={{
                    marginTop: '0.125rem',
                    accentColor: 'hsl(174 62% 32%)',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                />
                <div>
                  <label htmlFor="terms" style={{
                    fontSize: '0.875rem',
                    color: isSubmitting ? 'hsl(200 15% 45%)' : 'hsl(200 25% 15%)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    lineHeight: '1.5'
                  }}>
                    I confirm that all submitted documents are authentic and accurate. I understand that:
                  </label>
                  <ul style={{
                    fontSize: '0.75rem',
                    color: 'hsl(200 15% 45%)',
                    marginTop: '0.5rem',
                    paddingLeft: '1rem',
                    lineHeight: '1.5'
                  }}>
                    <li>Providing false information may result in account suspension</li>
                    <li>Verification typically takes 3-5 business days</li>
                    <li>I may be contacted for additional information</li>
                    <li>Verification decisions are final and at the discretion of the platform</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Action Buttons */}
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid hsl(40 20% 88%)',
            backgroundColor: 'hsl(40 30% 98%)',
            flexShrink: 0
          }}>
            <div style={{
              display: 'flex',
              gap: '0.75rem'
            }}>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid hsl(40 20% 88%)',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  color: 'hsl(200 15% 45%)',
                  opacity: isSubmitting ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = 'hsl(40 30% 96%)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.terms_accepted}
                style={{
                  flex: 2,
                  padding: '0.75rem',
                  border: 'none',
                  background: isSubmitting || !formData.terms_accepted 
                    ? 'hsl(200 15% 45%)' 
                    : 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                  color: 'white',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: isSubmitting || !formData.terms_accepted ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  opacity: isSubmitting || !formData.terms_accepted ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Submitting...
                  </>
                ) : (
                  'Submit Verification Request'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationRequestModal;