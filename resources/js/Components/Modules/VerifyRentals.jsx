import { useState, useEffect } from "react";

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

  useEffect(() => {
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

        /* Responsive styles */
        @media (max-width: 768px) {
          .modal-container {
            max-height: 85vh !important;
            margin: 0.5rem !important;
            max-width: 95% !important;
            border-radius: 0.75rem !important;
          }

          .modal-header {
            padding: 1rem !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
          }

          .request-type-container {
            flex-direction: column !important;
          }

          .document-section {
            margin-bottom: 1.25rem !important;
          }

          .upload-area {
            padding: 1rem !important;
          }

          .modal-footer {
            padding: 1rem !important;
            flex-direction: column !important;
          }

          .modal-footer button {
            width: 100% !important;
            min-height: 44px;
            -webkit-tap-highlight-color: transparent;
          }

          .terms-container {
            margin-bottom: 1.25rem !important;
          }

          .close-button {
            position: absolute !important;
            top: 0.75rem !important;
            right: 0.75rem !important;
          }
        }

        /* Extra small devices */
        @media (max-width: 480px) {
          .modal-container {
            max-height: 90vh !important;
          }

          .modal-content {
            padding: 1rem !important;
          }

          .property-info {
            padding: 0.75rem !important;
          }

          .file-item {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.5rem !important;
          }

          .file-actions {
            align-self: flex-end !important;
          }
        }

        /* Landscape mobile */
        @media (max-height: 600px) and (orientation: landscape) {
          .modal-container {
            max-height: 80vh !important;
          }
        }

        /* Tablet */
        @media (min-width: 481px) and (max-width: 768px) {
          .request-type-container {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        /* Desktop */
        @media (min-width: 769px) {
          .request-type-container {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
        }

        /* Large desktop */
        @media (min-width: 1024px) {
          .modal-container {
            max-width: 48rem !important;
          }
        }

        /* Prevent zoom on input focus for iOS */
        @media (max-width: 768px) {
          input[type="text"],
          input[type="email"],
          textarea {
            font-size: 16px !important;
          }
        }

        /* Touch optimization */
        .touch-button {
          min-height: 44px;
          -webkit-tap-highlight-color: transparent;
        }

        /* Action button styling for mobile */
        .action-button {
          touch-action: manipulation;
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
        padding: 'clamp(0.5rem, 2vw, 1rem)',
        animation: 'backdropFadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          handleClose();
        }
      }}
      >
        {/* Modal Container */}
        <div className="modal-container" style={{
          backgroundColor: 'white',
          borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
          width: '100%',
          maxWidth: 'clamp(90%, 95vw, 48rem)',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          animation: 'modalFadeIn 0.3s ease-out',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div className="modal-header" style={{
            padding: 'clamp(1rem, 3vw, 1.5rem)',
            borderBottom: '1px solid hsl(40 20% 88%)',
            backgroundColor: 'white',
            flexShrink: 0,
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.75rem)', flex: 1 }}>
              <div style={{
                width: 'clamp(2.5rem, 8vw, 2.5rem)',
                height: 'clamp(2.5rem, 8vw, 2.5rem)',
                borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck style={{ 
                  height: 'clamp(1.25rem, 4vw, 1.5rem)', 
                  width: 'clamp(1.25rem, 4vw, 1.5rem)', 
                  color: 'white' 
                }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{
                  fontSize: 'clamp(1.125rem, 4vw, 1.25rem)',
                  fontWeight: '700',
                  color: 'hsl(200 25% 15%)',
                  marginBottom: 'clamp(0.125rem, 1vw, 0.125rem)',
                  lineHeight: '1.2'
                }}>
                  Request Listing Verification
                </h2>
                <p style={{ 
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                  color: 'hsl(200 15% 45%)',
                  lineHeight: '1.4'
                }}>
                  Submit documents to verify your property listing
                </p>
              </div>
            </div>
            <button
              className="close-button touch-button"
              onClick={handleClose}
              disabled={isSubmitting}
              style={{
                padding: 'clamp(0.375rem, 1.5vw, 0.5rem)',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isSubmitting ? 0.5 : 1,
                flexShrink: 0
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
              <X style={{ 
                height: 'clamp(1.25rem, 4vw, 1.5rem)', 
                width: 'clamp(1.25rem, 4vw, 1.5rem)', 
                color: 'hsl(200 15% 45%)' 
              }} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="modal-content" style={{
            padding: 'clamp(1rem, 3vw, 1.5rem)',
            overflowY: 'auto',
            flex: 1
          }}>
            {/* Property Info */}
            <div className="property-info" style={{
              backgroundColor: 'hsl(174 62% 32% / 0.05)',
              border: '1px solid hsl(174 62% 32% / 0.2)',
              borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
              padding: 'clamp(0.75rem, 3vw, 1rem)',
              marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'clamp(0.5rem, 2vw, 0.75rem)', 
                marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)' 
              }}>
                <Building style={{ 
                  height: 'clamp(1rem, 3vw, 1.25rem)', 
                  width: 'clamp(1rem, 3vw, 1.25rem)', 
                  color: 'hsl(174 62% 32%)' 
                }} />
                <h3 style={{
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  fontWeight: '600',
                  color: 'hsl(200 25% 15%)'
                }}>
                  Property Being Verified
                </h3>
              </div>
              <p style={{ 
                fontSize: 'clamp(0.875rem, 2.5vw, 0.875rem)', 
                fontWeight: '600', 
                color: 'hsl(174 62% 32%)', 
                marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)',
                wordBreak: 'break-word'
              }}>
                {formData.rental_title || 'No property selected'}
              </p>
              {selectedRental?.address && (
                <p style={{ 
                  fontSize: 'clamp(0.75rem, 2vw, 0.75rem)', 
                  color: 'hsl(200 15% 45%)',
                  lineHeight: '1.4'
                }}>
                  {selectedRental.address}
                </p>
              )}
            </div>

            {/* Request Type */}
            <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
              <label style={{
                display: 'block',
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                fontWeight: '600',
                color: 'hsl(200 25% 15%)',
                marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)'
              }}>
                Verification Request Type
              </label>
              <div className="request-type-container" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.5rem, 2vw, 0.75rem)'
              }}>
                <button
                  type="button"
                  onClick={() => handleInputChange('request_type', 'initial_verification')}
                  disabled={isSubmitting}
                  className="touch-button action-button"
                  style={{
                    padding: 'clamp(0.75rem, 3vw, 0.75rem)',
                    border: formData.request_type === 'initial_verification' 
                      ? '2px solid hsl(174 62% 32%)' 
                      : '1px solid hsl(40 20% 88%)',
                    backgroundColor: formData.request_type === 'initial_verification' 
                      ? 'hsl(174 62% 32% / 0.1)' 
                      : 'white',
                    borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'clamp(0.375rem, 1.5vw, 0.5rem)',
                    opacity: isSubmitting ? 0.7 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  <DocumentText style={{ 
                    height: 'clamp(1.25rem, 4vw, 1.5rem)', 
                    width: 'clamp(1.25rem, 4vw, 1.5rem)', 
                    color: formData.request_type === 'initial_verification' 
                      ? 'hsl(174 62% 32%)' 
                      : 'hsl(200 15% 45%)'
                  }} />
                  <span style={{
                    fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                    fontWeight: '500',
                    color: formData.request_type === 'initial_verification' 
                      ? 'hsl(174 62% 32%)' 
                      : 'hsl(200 25% 15%)'
                  }}>
                    Initial Verification
                  </span>
                  <span style={{
                    fontSize: 'clamp(0.75rem, 2vw, 0.75rem)',
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
                  className="touch-button action-button"
                  style={{
                    padding: 'clamp(0.75rem, 3vw, 0.75rem)',
                    border: formData.request_type === 're_verification' 
                      ? '2px solid hsl(174 62% 32%)' 
                      : '1px solid hsl(40 20% 88%)',
                    backgroundColor: formData.request_type === 're_verification' 
                      ? 'hsl(174 62% 32% / 0.1)' 
                      : 'white',
                    borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'clamp(0.375rem, 1.5vw, 0.5rem)',
                    opacity: isSubmitting ? 0.7 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  <UserCheck style={{ 
                    height: 'clamp(1.25rem, 4vw, 1.5rem)', 
                    width: 'clamp(1.25rem, 4vw, 1.5rem)', 
                    color: formData.request_type === 're_verification' 
                      ? 'hsl(174 62% 32%)' 
                      : 'hsl(200 15% 45%)'
                  }} />
                  <span style={{
                    fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                    fontWeight: '500',
                    color: formData.request_type === 're_verification' 
                      ? 'hsl(174 62% 32%)' 
                      : 'hsl(200 25% 15%)'
                  }}>
                    Re-Verification
                  </span>
                  <span style={{
                    fontSize: 'clamp(0.75rem, 2vw, 0.75rem)',
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
              <div key={section.key} className="document-section" style={{ 
                marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  flexWrap: 'wrap',
                  gap: 'clamp(0.25rem, 1vw, 0.5rem)', 
                  marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)' 
                }}>
                  <label style={{
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    fontWeight: '600',
                    color: 'hsl(200 25% 15%)'
                  }}>
                    {section.title}
                  </label>
                  {section.required && (
                    <span style={{
                      fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                      color: 'hsl(0 65% 45%)',
                      backgroundColor: 'hsl(0 65% 45% / 0.1)',
                      padding: 'clamp(0.125rem, 1vw, 0.125rem) clamp(0.25rem, 2vw, 0.375rem)',
                      borderRadius: 'clamp(0.125rem, 1.5vw, 0.25rem)',
                      fontWeight: '500'
                    }}>
                      Required
                    </span>
                  )}
                </div>
                <p style={{
                  fontSize: 'clamp(0.75rem, 2vw, 0.75rem)',
                  color: 'hsl(200 15% 45%)',
                  marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)',
                  lineHeight: '1.4'
                }}>
                  {section.description}
                </p>
                
                {/* Upload Area */}
                <div className="upload-area" style={{
                  border: '2px dashed hsl(40 20% 88%)',
                  borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                  padding: 'clamp(1rem, 3vw, 1.5rem)',
                  textAlign: 'center',
                  backgroundColor: 'hsl(40 30% 98%)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)',
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: 'all 0.2s'
                }}
                onClick={() => {
                  if (!isSubmitting) {
                    document.getElementById(`${section.key}-input`).click();
                  }
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.borderColor = 'hsl(174 62% 32%)';
                    e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.borderColor = 'hsl(40 20% 88%)';
                    e.currentTarget.style.backgroundColor = 'hsl(40 30% 98%)';
                  }
                }}
                >
                  <Upload style={{ 
                    height: 'clamp(1.25rem, 4vw, 1.5rem)', 
                    width: 'clamp(1.25rem, 4vw, 1.5rem)', 
                    color: 'hsl(200 15% 45%)', 
                    margin: '0 auto clamp(0.375rem, 1.5vw, 0.5rem)' 
                  }} />
                  <p style={{ 
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                    color: 'hsl(200 25% 15%)', 
                    fontWeight: '500', 
                    marginBottom: 'clamp(0.125rem, 1vw, 0.25rem)' 
                  }}>
                    {isSubmitting ? 'Upload disabled during submission' : 'Click to upload files'}
                  </p>
                  <p style={{ 
                    fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)', 
                    color: 'hsl(200 15% 45%)',
                    lineHeight: '1.4'
                  }}>
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
                  <div style={{ marginTop: 'clamp(0.5rem, 2vw, 0.5rem)' }}>
                    {formData[section.key].map((fileObj, index) => (
                      <div key={fileObj.id} className="file-item" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'clamp(0.5rem, 2vw, 0.75rem)',
                        backgroundColor: 'hsl(40 30% 96%)',
                        borderRadius: 'clamp(0.25rem, 1.5vw, 0.375rem)',
                        marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)',
                        gap: 'clamp(0.5rem, 2vw, 0.75rem)'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 'clamp(0.375rem, 1.5vw, 0.5rem)', 
                          flex: 1,
                          minWidth: 0
                        }}>
                          {uploadProgress[fileObj.id] >= 100 ? (
                            <CheckCircle style={{ 
                              height: 'clamp(1rem, 3vw, 1rem)', 
                              width: 'clamp(1rem, 3vw, 1rem)', 
                              color: 'hsl(152 60% 40%)',
                              flexShrink: 0
                            }} />
                          ) : (
                            <div style={{
                              width: 'clamp(1rem, 3vw, 1rem)',
                              height: 'clamp(1rem, 3vw, 1rem)',
                              border: '2px solid hsl(174 62% 32%)',
                              borderTopColor: 'transparent',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite',
                              flexShrink: 0
                            }} />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ 
                              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                              color: 'hsl(200 25% 15%)',
                              display: 'block',
                              wordBreak: 'break-all'
                            }}>
                              {fileObj.name}
                            </span>
                            {uploadProgress[fileObj.id] < 100 && (
                              <div style={{
                                width: '100%',
                                height: '4px',
                                backgroundColor: 'hsl(40 20% 88%)',
                                borderRadius: '2px',
                                marginTop: 'clamp(0.125rem, 1vw, 0.25rem)',
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
                          className="touch-button"
                          style={{
                            padding: 'clamp(0.25rem, 1vw, 0.25rem)',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: (isSubmitting || uploadProgress[fileObj.id] < 100) ? 'not-allowed' : 'pointer',
                            color: 'hsl(0 65% 45%)',
                            opacity: (isSubmitting || uploadProgress[fileObj.id] < 100) ? 0.5 : 1,
                            flexShrink: 0
                          }}
                        >
                          <X style={{ 
                            height: 'clamp(1rem, 3vw, 1rem)', 
                            width: 'clamp(1rem, 3vw, 1rem)' 
                          }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Additional Notes */}
            <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
              <label style={{
                display: 'block',
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                fontWeight: '600',
                color: 'hsl(200 25% 15%)',
                marginBottom: 'clamp(0.375rem, 1.5vw, 0.5rem)'
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
                  padding: 'clamp(0.5rem, 2vw, 0.625rem)',
                  border: '1px solid hsl(40 20% 88%)',
                  borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                  fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                  resize: 'vertical',
                  backgroundColor: isSubmitting ? 'hsl(40 30% 96%)' : 'white',
                  opacity: isSubmitting ? 0.7 : 1,
                  fontFamily: 'inherit',
                  minHeight: '5rem'
                }}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="terms-container" style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.terms_accepted}
                  onChange={(e) => handleInputChange('terms_accepted', e.target.checked)}
                  disabled={isSubmitting}
                  style={{
                    marginTop: 'clamp(0.125rem, 1vw, 0.125rem)',
                    accentColor: 'hsl(174 62% 32%)',
                    opacity: isSubmitting ? 0.7 : 1,
                    width: 'clamp(1rem, 3vw, 1.125rem)',
                    height: 'clamp(1rem, 3vw, 1.125rem)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <label htmlFor="terms" style={{
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    color: isSubmitting ? 'hsl(200 15% 45%)' : 'hsl(200 25% 15%)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    lineHeight: '1.5',
                    display: 'block',
                    marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)'
                  }}>
                    I confirm that all submitted documents are authentic and accurate. I understand that:
                  </label>
                  <ul style={{
                    fontSize: 'clamp(0.6875rem, 2vw, 0.75rem)',
                    color: 'hsl(200 15% 45%)',
                    paddingLeft: 'clamp(0.75rem, 3vw, 1rem)',
                    lineHeight: '1.5',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
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
          <div className="modal-footer" style={{
            padding: 'clamp(1rem, 3vw, 1.5rem)',
            borderTop: '1px solid hsl(40 20% 88%)',
            backgroundColor: 'hsl(40 30% 98%)',
            flexShrink: 0
          }}>
            <div style={{
              display: 'flex',
              gap: 'clamp(0.5rem, 2vw, 0.75rem)'
            }}>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="touch-button action-button"
                style={{
                  flex: 1,
                  padding: 'clamp(0.625rem, 2vw, 0.75rem)',
                  border: '1px solid hsl(40 20% 88%)',
                  backgroundColor: 'white',
                  borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                  color: 'hsl(200 15% 45%)',
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: 'all 0.2s'
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
                className="touch-button action-button"
                style={{
                  flex: 2,
                  padding: 'clamp(0.625rem, 2vw, 0.75rem)',
                  border: 'none',
                  background: isSubmitting || !formData.terms_accepted 
                    ? 'hsl(200 15% 45%)' 
                    : 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                  color: 'white',
                  borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
                  fontWeight: '600',
                  cursor: isSubmitting || !formData.terms_accepted ? 'not-allowed' : 'pointer',
                  fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                  opacity: isSubmitting || !formData.terms_accepted ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'clamp(0.25rem, 1vw, 0.5rem)',
                  transition: 'all 0.2s'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{
                      width: 'clamp(1rem, 3vw, 1rem)',
                      height: 'clamp(1rem, 3vw, 1rem)',
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