import { useState } from "react";
import { Upload, X } from "lucide-react";
import { useForm } from "@inertiajs/react";

const ReportListingDialog = ({ setShowAddListingModal, rental }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  // FIXED: Ensure property_id is properly set
  const {data, setData, post, processing, errors, reset} = useForm({
    report_type: "",
    description: "",
    evidence: [],
    property_id: rental?.id || "",
    name: ""
  });

  const [toast, setToast] = useState(null);

  const subjectOptions = [
    "Misleading listing information",
    "Fraudulent agent/landlord",
    "Price discrepancy",
    "Property doesn't exist",
    "Harassment or misconduct",
    "Other",
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showToast("File too large", `${file.name} is larger than 5MB`, "error");
        return false;
      }
      return true;
    });
    
    // FIXED: Create new array correctly
    const newFiles = [...uploadedFiles, ...validFiles].slice(0, 5);
    setUploadedFiles(newFiles);
    
    // FIXED: Set evidence in form data
    setData('evidence', newFiles);
  };

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setData('evidence', newFiles);
  };

  const showToast = (title, description, variant = "success") => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // FIXED: Prepare FormData for file uploads
    const formData = new FormData();
    
    // Add text fields
    formData.append('property_id', data.property_id);
    formData.append('description', data.description);
    formData.append('report_type', data.report_type);
    formData.append('name', data.name);
    
    // Add files
    if (data.evidence && data.evidence.length > 0) {
      data.evidence.forEach((file, index) => {
        formData.append(`evidence[${index}]`, file);
      });
    }
    
    // FIXED: Use the correct endpoint and pass FormData
    post('/report-listing', {
      data: formData,
      forceFormData: true,
      onSuccess: () => {
        showToast("Report Submitted", "Thank you for helping us maintain trust.", "success");
        reset();
        setUploadedFiles([]);
        setTimeout(() => {
          if (setShowAddListingModal) setShowAddListingModal(false);
        }, 1500);
      },
      onError: (errors) => {
        console.log("Errors:", errors);
        showToast("Submission Failed", "Please correct the errors and try again.", "error");
      }
    });
  };

  return (
    <>
      {/* Toast Notification - unchanged */}
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
        onClick={() => setShowAddListingModal && setShowAddListingModal(false)}
      >
        {/* Dialog Content - Wrap in form for better accessibility */}
        <form
          onSubmit={handleSubmit}
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
          {/* Header - unchanged */}
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <button
              type="button"
              onClick={() => setShowAddListingModal && setShowAddListingModal(false)}
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

            <div style={{
              backgroundColor: '#f3f4f6',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                {rental?.title} {rental?.property_type}
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                {rental?.address}, {rental?.city} • GH₵ {rental?.rent_min} - GH₵ {rental?.rent_max}/month
              </p>
              <p style={{ color: '#374151', lineHeight: '1.5' }}>
                {rental?.description}
              </p>
            </div>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Hidden property_id field */}
              <input type="hidden" name="property_id" value={data.property_id} />
              
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
                  value={data.report_type}
                  onChange={(e) => setData('report_type', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: `1px solid ${errors.report_type ? '#ef4444' : '#d1d5db'}`,
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
                {errors.report_type && (
                  <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                    {errors.report_type}
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
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
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
                    disabled={uploadedFiles.length >= 5}
                  />
                  <label 
                    htmlFor="evidence-upload" 
                    style={{ 
                      cursor: uploadedFiles.length >= 5 ? 'not-allowed' : 'pointer', 
                      display: 'block',
                      opacity: uploadedFiles.length >= 5 ? 0.5 : 1
                    }}
                  >
                    <Upload size={32} style={{ margin: '0 auto 0.5rem', color: '#9ca3af' }} />
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Click to upload screenshots or documents
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                      Max 5 files, 5MB each ({uploadedFiles.length}/5 uploaded)
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
                          type="button"
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

              {/* Full Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Solomon Yeboah"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: `1px solid ${errors.name ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                {errors.name && (
                  <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  backgroundColor: processing ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                {processing ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </form>
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

export default ReportListingDialog;