import { useState, useEffect } from "react";
import { useForm, router } from '@inertiajs/react';

// Icons (keep all your existing icon components)
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

const AlertCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const VerificationRequestModal = ({ isOpen, onClose, agentData, selectedRental }) => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [toast, setToast] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({
    proof_documents: [],
    property_ownership_docs: [],
    utility_bills: []
  });

  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    rental_id: selectedRental?.id || "",
    rental_title: selectedRental?.title || "",
    request_type: "initial_verification",
    additional_notes: "",
    terms_accepted: false,
    // Store file references as arrays of File objects
    proof_docs: [],
    ownership_documents: [],
    utility_bills: [],
    agent_id: agentData?.id || "",
    agent_name: agentData?.fullName || agentData?.name || ""
  });

  // Initialize form when modal opens or selectedRental changes
  useEffect(() => {
    if (isOpen && selectedRental) {
      setData({
        rental_id: selectedRental.id,
        rental_title: selectedRental.title,
        request_type: "initial_verification",
        additional_notes: "",
        terms_accepted: false,
        proof_docs: [],
        ownership_documents: [],
        utility_bills: [],
        agent_id: agentData?.id || "",
        agent_name: agentData?.fullName || agentData?.name || ""
      });
      setSelectedFiles({
        proof_documents: [],
        property_ownership_docs: [],
        utility_bills: []
      });
      setUploadProgress({});
      clearErrors();
    }
  }, [isOpen, selectedRental]);

  const handleInputChange = (field, value) => {
    setData(field, value);
    // Clear errors for this field
    if (errors[field]) {
      clearErrors(field);
    }
  };

  const handleFileUpload = (field, e) => {
    const files = Array.from(e.target.files);
    
    // Validate file sizes
    const invalidFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      // Set error through useForm errors
      setData(field, []);
      alert(`Some files exceed 10MB limit: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    // Map file objects for UI display
    const newFiles = files.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      progress: 0
    }));

    // Update selected files for UI
    setSelectedFiles(prev => ({
      ...prev,
      [field]: [...prev[field], ...newFiles]
    }));

    // Update form data with actual File objects
    const currentFiles = data[field === 'proof_documents' ? 'proof_docs' : 
                              field === 'property_ownership_docs' ? 'ownership_documents' : 'utility_bills'] || [];
    
    setData(
      field === 'proof_documents' ? 'proof_docs' : 
      field === 'property_ownership_docs' ? 'ownership_documents' : 'utility_bills',
      [...currentFiles, ...files]
    );

    // Clear error
    if (errors[field]) {
      clearErrors(field);
    }

    // Simulate upload progress for UI
    newFiles.forEach(fileObj => {
      simulateUpload(fileObj.id);
    });
  };

  const simulateUpload = (fileId) => {
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
    // Update UI files
    setSelectedFiles(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));

    // Update form data
    const formField = field === 'proof_documents' ? 'proof_docs' : 
                     field === 'property_ownership_docs' ? 'ownership_documents' : 'utility_bills';
    
    const currentFiles = [...data[formField]];
    currentFiles.splice(index, 1);
    setData(formField, currentFiles);
  };

  const validateForm = () => {
    // Check if at least one document is uploaded
    const totalDocs = (data.proof_docs?.length || 0) + 
                     (data.ownership_documents?.length || 0) +
                     (data.utility_bills?.length || 0);

    if (totalDocs === 0) {
      alert('Please upload at least one document');
      return false;
    }

    if (!data.terms_accepted) {
      alert('You must accept the terms and conditions');
      return false;
    }

    if (!data.rental_id) {
      alert('No rental property selected');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Use Inertia's post method to submit the form
    post('/verification-requests', {
      onSuccess: () => {
        showToast('Verification request submitted successfully!', 'success', 3000);
        setTimeout(() => {
          router.reload({ only: ['rentals'] });
          handleClose();
        }, 1500);
      },
      onError: (errors) => {
        console.error('Submission errors:', errors);
        const firstError = Object.values(errors)[0];
        showToast(typeof firstError === 'string' ? firstError : 'An error occurred while submitting', 'error', 4000);
      },
      // Important: Use FormData for file uploads
      forceFormData: true
    });
  };

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  const handleClose = () => {
    if (processing) return;
    
    reset();
    setSelectedFiles({
      proof_documents: [],
      property_ownership_docs: [],
      utility_bills: []
    });
    setUploadProgress({});
    clearErrors();
    setToast(null);
    onClose();
  };

  const documentSections = [
    {
      key: 'proof_documents',
      formKey: 'proof_docs',
      title: 'Proof of Property Ownership/Authorization',
      description: 'Property deed, title, lease agreement, or authorization letter from owner',
      required: false
    },
    {
      key: 'property_ownership_docs',
      formKey: 'ownership_documents',
      title: 'Property Photos',
      description: 'Clear photos of property exterior, interior, and address',
      required: true
    },
    {
      key: 'utility_bills',
      formKey: 'utility_bills',
      title: 'Utility Bills (Optional)',
      description: 'Recent utility bills showing property address',
      required: false
    }
  ];

  if (!isOpen) return null;

  const toastStyles = {
    success: {
      backgroundColor: 'hsl(152 60% 40%)',
      borderColor: 'hsl(152 60% 30%)',
      color: 'white'
    },
    error: {
      backgroundColor: 'hsl(0 72% 51%)',
      borderColor: 'hsl(0 72% 40%)',
      color: 'white'
    }
  };

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
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(1rem); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOutDown {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(1rem); }
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 2000,
          animation: 'slideInUp 0.3s ease-out'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderRadius: '0.5rem',
            border: '1px solid',
            backgroundColor: toastStyles[toast.type].backgroundColor,
            color: toastStyles[toast.type].color,
            borderColor: toastStyles[toast.type].borderColor,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            {toast.type === 'success' ? (
              <CheckCircle style={{ height: '1.25rem', width: '1.25rem', flexShrink: 0 }} />
            ) : (
              <AlertCircle style={{ height: '1.25rem', width: '1.25rem', flexShrink: 0 }} />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

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
        animation: 'backdropFadeIn 0.2s ease-out',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !processing) {
          handleClose();
        }
      }}
      >
        {/* Modal Container */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          width: '100%',
          maxWidth: '48rem',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          animation: 'modalFadeIn 0.3s ease-out',
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto'
        }}>
          {/* Header */}
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid hsl(40 20% 88%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'hsl(200 25% 15%)', marginBottom: '0.125rem' }}>
                  Request Listing Verification
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                  Submit documents to verify your property
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={processing}
              style={{
                padding: '0.5rem',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: processing ? 'not-allowed' : 'pointer',
                borderRadius: '0.375rem',
                opacity: processing ? 0.5 : 1
              }}
            >
              <X style={{ height: '1.5rem', width: '1.5rem', color: 'hsl(200 15% 45%)' }} />
            </button>
          </div>

          {/* Error Display */}
          {Object.keys(errors).length > 0 && (
            <div style={{
              margin: '1rem 1.5rem 0',
              padding: '1rem',
              backgroundColor: 'hsl(0 72% 51% / 0.1)',
              border: '1px solid hsl(0 72% 51% / 0.3)',
              borderRadius: '0.5rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'start'
            }}>
              <AlertCircle style={{ height: '1.25rem', width: '1.25rem', color: 'hsl(0 72% 51%)', flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: '600', color: 'hsl(0 72% 51%)', marginBottom: '0.25rem' }}>Error</p>
                {Object.entries(errors).map(([key, error]) => (
                  <p key={key} style={{ fontSize: '0.875rem', color: 'hsl(0 72% 40%)' }}>
                    {error}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Scrollable Content */}
          <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
            
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
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)' }}>
                  Property Being Verified
                </h3>
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(174 62% 32%)', marginBottom: '0.25rem' }}>
                {data.rental_title || 'No property selected'}
              </p>
              {errors.rental_id && (
                <p style={{ fontSize: '0.75rem', color: 'hsl(0 72% 51%)', marginTop: '0.25rem' }}>
                  {errors.rental_id}
                </p>
              )}
            </div>

            {/* Request Type */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
                Verification Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => handleInputChange('request_type', 'initial_verification')}
                  disabled={processing}
                  style={{
                    padding: '0.75rem',
                    border: data.request_type === 'initial_verification' ? '2px solid hsl(174 62% 32%)' : '1px solid hsl(40 20% 88%)',
                    backgroundColor: data.request_type === 'initial_verification' ? 'hsl(174 62% 32% / 0.1)' : 'white',
                    borderRadius: '0.5rem',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <DocumentText style={{ 
                    height: '1.5rem', 
                    width: '1.5rem', 
                    color: data.request_type === 'initial_verification' ? 'hsl(174 62% 32%)' : 'hsl(200 15% 45%)',
                    margin: '0 auto 0.5rem'
                  }} />
                  <span style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: data.request_type === 'initial_verification' ? 'hsl(174 62% 32%)' : 'hsl(200 25% 15%)'
                  }}>
                    Initial Verification
                  </span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleInputChange('request_type', 're_verification')}
                  disabled={processing}
                  style={{
                    padding: '0.75rem',
                    border: data.request_type === 're_verification' ? '2px solid hsl(174 62% 32%)' : '1px solid hsl(40 20% 88%)',
                    backgroundColor: data.request_type === 're_verification' ? 'hsl(174 62% 32% / 0.1)' : 'white',
                    borderRadius: '0.5rem',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <UserCheck style={{ 
                    height: '1.5rem', 
                    width: '1.5rem', 
                    color: data.request_type === 're_verification' ? 'hsl(174 62% 32%)' : 'hsl(200 15% 45%)',
                    margin: '0 auto 0.5rem'
                  }} />
                  <span style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: data.request_type === 're_verification' ? 'hsl(174 62% 32%)' : 'hsl(200 25% 15%)'
                  }}>
                    Re-Verification
                  </span>
                </button>
              </div>
              {errors.request_type && (
                <p style={{ fontSize: '0.75rem', color: 'hsl(0 72% 51%)', marginTop: '0.5rem' }}>
                  {errors.request_type}
                </p>
              )}
            </div>

            {/* Document Upload Sections */}
            {documentSections.map((section) => (
              <div key={section.key} style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)' }}>
                    {section.title}
                  </label>
                  {section.required && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'hsl(0 65% 45%)',
                      backgroundColor: 'hsl(0 65% 45% / 0.1)',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '0.25rem',
                      fontWeight: '500'
                    }}>
                      Required
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginBottom: '0.75rem' }}>
                  {section.description}
                </p>
                
                {errors[section.formKey] && (
                  <p style={{ fontSize: '0.75rem', color: 'hsl(0 72% 51%)', marginBottom: '0.5rem' }}>
                    {errors[section.formKey]}
                  </p>
                )}

                {/* Upload Area */}
                <div style={{
                  border: '2px dashed hsl(40 20% 88%)',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'hsl(40 30% 98%)',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  marginBottom: '0.75rem'
                }}
                onClick={() => !processing && document.getElementById(`${section.key}-input`).click()}
                >
                  <Upload style={{ height: '1.5rem', width: '1.5rem', color: 'hsl(200 15% 45%)', margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)', fontWeight: '500', marginBottom: '0.25rem' }}>
                    Click to upload files
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
                    disabled={processing}
                  />
                </div>

                {/* Uploaded Files */}
                {selectedFiles[section.key].length > 0 && (
                  <div>
                    {selectedFiles[section.key].map((fileObj, index) => (
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
                          <span style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)', flex: 1 }}>
                            {fileObj.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(section.key, index)}
                          disabled={processing || uploadProgress[fileObj.id] < 100}
                          style={{
                            padding: '0.25rem',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: (processing || uploadProgress[fileObj.id] < 100) ? 'not-allowed' : 'pointer',
                            color: 'hsl(0 65% 45%)'
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
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
                Additional Information
              </label>
              <textarea
                value={data.additional_notes}
                onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                placeholder="Any additional information..."
                rows={3}
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: errors.additional_notes ? '1px solid hsl(0 72% 51%)' : '1px solid hsl(40 20% 88%)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              {errors.additional_notes && (
                <p style={{ fontSize: '0.75rem', color: 'hsl(0 72% 51%)', marginTop: '0.5rem' }}>
                  {errors.additional_notes}
                </p>
              )}
            </div>

            {/* Terms */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={data.terms_accepted}
                  onChange={(e) => handleInputChange('terms_accepted', e.target.checked)}
                  disabled={processing}
                  style={{ 
                    accentColor: 'hsl(174 62% 32%)', 
                    width: '1.125rem', 
                    height: '1.125rem', 
                    cursor: 'pointer' 
                  }}
                />
                <label htmlFor="terms" style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)', cursor: 'pointer', flex: 1 }}>
                  I confirm all submitted documents are authentic. I understand verification takes 3-5 business days and false information may result in account suspension.
                </label>
              </div>
              {errors.terms_accepted && (
                <p style={{ fontSize: '0.75rem', color: 'hsl(0 72% 51%)', marginTop: '0.5rem', marginLeft: '2rem' }}>
                  {errors.terms_accepted}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid hsl(40 20% 88%)',
            backgroundColor: 'hsl(40 30% 98%)',
            display: 'flex',
            gap: '0.75rem'
          }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={processing}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid hsl(40 20% 88%)',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: processing ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                color: 'hsl(200 15% 45%)'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={processing || !data.terms_accepted}
              style={{
                flex: 2,
                padding: '0.75rem',
                border: 'none',
                background: processing || !data.terms_accepted 
                  ? 'hsl(200 15% 45%)' 
                  : 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                color: 'white',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: processing || !data.terms_accepted ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {processing ? (
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
    </>
  );
};

export default VerificationRequestModal;