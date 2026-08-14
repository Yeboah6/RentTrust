import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { useForm, usePage } from "@inertiajs/react";

const ReportListingDialog = ({ setShowAddListingModal, rental, auth }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  const { data, setData, post, processing, errors, reset } = useForm({
    report_type: "",
    description: "",
    evidence: [],
    property_id: rental?.id || "",
    name: ""
  });

  const [toast, setToast] = useState(null);
  const userFullName = auth?.agent?.name || auth?.tenant?.name || auth?.super?.name || "";

  useEffect(() => {
    if (userFullName && !data.name) {
      setData('name', userFullName);
    }
  }, [userFullName]);

  useEffect(() => {
    if (rental?.id) {
      setData('property_id', rental.id);
    }
  }, [rental?.id]);

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
    
    const newFiles = [...uploadedFiles, ...validFiles].slice(0, 5);
    setUploadedFiles(newFiles);
    
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
    
    const resolvedName = (data.name && data.name.trim() !== "") ? data.name : userFullName;
    const formData = { ...data, name: resolvedName };
  
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
    <div className="rf-wrap">
      {/* Toast Notification */}
      {toast && (
        <div className={`rf-toast ${toast.variant}`}>
          <div className="rf-toast-title">{toast.title}</div>
          <div className="rf-toast-desc">{toast.description}</div>
        </div>
      )}

      {/* Dialog Overlay */}
      <div className="rf-overlay" onClick={() => setShowAddListingModal && setShowAddListingModal(false)}>
        {/* Dialog Content */}
        <div className="rf-card" onClick={(e) => e.stopPropagation()}>
          <div className="rf-stripe" />
          {/* Header */}
          <div className="rf-header">
            <div>
              <div className="rf-title">Report This Listing</div>
              <div className="rf-subtitle">Help us maintain trust by reporting problematic listings. All reports are reviewed by our team.</div>
            </div>
            <button className="rf-close" onClick={() => setShowAddListingModal && setShowAddListingModal(false)}>
              <X size={14} />
            </button>
          </div>

          {rental && (
            <div className="rf-property">
              <div className="rf-prop-name">{rental?.title} {rental?.property_type}</div>
              <div className="rf-prop-meta">{rental?.area}, {rental?.city}</div>
              {rental?.agent_name && (
                <div className="rf-prop-agent">Agent — {rental?.agent_name}</div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Body */}
            <div className="rf-body">
              {/* Hidden property_id field */}
              <input type="hidden" name="property_id" value={data.property_id} />
              {/* Issue Type */}
              <div>
                <label className="rf-label">Issue Type *</label>
                <select
                  className={`rf-select ${errors.report_type ? 'err' : ''}`}
                  value={data.report_type}
                  onChange={(e) => setData('report_type', e.target.value)}
                >
                  <option value="">Select the issue type</option>
                  {subjectOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.report_type && <p className="rf-error">{errors.report_type}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="rf-label">Description *</label>
                <textarea
                  className={`rf-textarea ${errors.description ? 'err' : ''}`}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Please describe the issue in detail. Include dates, amounts, and any relevant information..."
                  rows={3}
                />
                {errors.description && <p className="rf-error">{errors.description}</p>}
              </div>

              {/* Evidence Upload */}
              <div>
                <label className="rf-label">Evidence (optional)</label>
                <div className="rf-upload">
                  <input
                    type="file"
                    id="evidence-upload"
                    name="evidence[]"
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
                    <Upload size={32} style={{ margin: '0 auto 0.5rem', color: 'rgba(245,240,232,0.4)' }} />
                    <p style={{ fontSize: '0.875rem', color: 'rgba(245,240,232,0.6)' }}>
                      Click to upload screenshots or documents
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.4)', marginTop: '0.25rem' }}>
                      Max 5 files, 5MB each ({uploadedFiles.length}/5 uploaded)
                    </p>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {uploadedFiles.map((file, index) => (
                      <div className="rf-file-item" key={index}>
                        <span>
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
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
                <label className="rf-label">Full name</label>
                <input
                  className={`rf-input ${errors.name ? 'err' : ''}`}
                  type="text"
                  value={data.name || userFullName}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Solomon Yeboah"
                />
                {errors.name && <p className="rf-error">{errors.name}</p>}
              </div>

              <button type="submit" className="rf-submit" disabled={processing}>
                {processing ? "Submitting…" : "Submit report"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');

        .rf-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
        .rf-wrap { font-family: 'DM Sans', sans-serif; }

        .rf-overlay {
          position: fixed; inset: 0;
          background: rgba(10, 8, 5, 0.72);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9000; padding: 1rem;
        }

        .rf-card {
          background: #0f0e0c;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          width: 100%; max-width: 460px;
          max-height: 90vh;
          overflow-y: auto;
          scrollbar-width: none;
          position: relative;
        }
        .rf-card::-webkit-scrollbar { display: none; }

        .rf-stripe {
          height: 3px;
          background: linear-gradient(90deg, #e8a020 0%, #f0c060 50%, #e8a020 100%);
        }

        .rf-header {
          padding: 1.25rem 1.5rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
        }

        .rf-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.5rem;
          color: #f5f0e8;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        .rf-subtitle {
          font-size: 0.75rem;
          color: rgba(245,240,232,0.4);
          margin-top: 0.25rem;
          font-weight: 300;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .rf-close {
          background: rgba(255,255,255,0.06);
          border: none; border-radius: 2px;
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(245,240,232,0.5);
          flex-shrink: 0; margin-top: 2px;
          transition: background 0.15s, color 0.15s;
        }
        .rf-close:hover { background: rgba(255,255,255,0.12); color: #f5f0e8; }

        .rf-property {
          margin: 0 1.5rem;
          padding: 0.75rem 1rem;
          background: rgba(232,160,32,0.06);
          border-left: 2px solid #e8a020;
          border-radius: 0 2px 2px 0;
          margin-top: 1rem;
        }
        .rf-prop-name {
          font-size: 0.8125rem; font-weight: 500;
          color: #f5f0e8; line-height: 1.3;
        }
        .rf-prop-meta {
          font-size: 0.6875rem; color: rgba(245,240,232,0.4);
          margin-top: 0.2rem; letter-spacing: 0.02em;
        }
        .rf-prop-agent {
          font-size: 0.6875rem; color: rgba(232,160,32,0.8);
          margin-top: 0.3rem;
        }

        .rf-body { padding: 1.25rem 1.5rem 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }

        .rf-label {
          font-size: 0.6875rem;
          font-weight: 500;
          color: rgba(245,240,232,0.4);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.6rem;
        }

        .rf-select {
          width: 100%;
          background: #00000008;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          padding: 0.6rem 0.75rem;
          font-size: 0.8125rem;
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          outline: none;
          transition: border-color 0.15s;
        }

        .rf-input, .rf-textarea {
          width: 100%;
          background: #fdfdfd08;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          padding: 0.6rem 0.75rem;
          font-size: 0.8125rem;
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          outline: none;
          transition: border-color 0.15s;
        }
        .rf-input::placeholder, .rf-textarea::placeholder {
          color: rgba(245,240,232,0.2);
        }
        .rf-input:focus, .rf-textarea:focus, .rf-select:focus {
          border-color: rgba(232,160,32,0.5);
          background: rgba(232,160,32,0.03);
        }

        .rf-select:focus {
          background: #050505e7;
          border-color: rgba(232,160,32,0.5);
        }

        .rf-textarea { resize: vertical; min-height: 72px; line-height: 1.5; }
        .rf-input.err, .rf-textarea.err, .rf-select.err { border-color: rgba(220,60,60,0.5); }

        .rf-error { font-size: 0.6875rem; color: #e05050; margin-top: 0.3rem; }

        .rf-submit {
          width: 100%;
          padding: 0.7rem;
          background: #e8a020;
          border: none; border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #0f0e0c;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s;
        }
        .rf-submit:hover:not(:disabled) { background: #f0b030; }
        .rf-submit:disabled { opacity: 0.45; cursor: not-allowed; }

        .rf-toast {
          position: fixed; top: 1.25rem; right: 1.25rem;
          padding: 0.875rem 1.125rem;
          border-radius: 2px;
          z-index: 9999; max-width: 320px;
          border-left: 3px solid;
          animation: rfSlide 0.25s ease-out;
        }
        .rf-toast.success { background: #0f1a10; border-color: #4caf65; }
        .rf-toast.error   { background: #1a0f0f; border-color: #e05050; }
        .rf-toast-title { font-size: 0.8125rem; font-weight: 500; color: #f5f0e8; }
        .rf-toast-desc  { font-size: 0.75rem; color: rgba(245,240,232,0.5); margin-top: 0.2rem; }

        @keyframes rfSlide {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }

        .rf-upload {
          border: 2px dashed rgba(255,255,255,0.08);
          border-radius: 2px;
          padding: 1rem;
          text-align: center;
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          transition: border-color 0.15s;
        }
        .rf-upload:hover {
          border-color: rgba(232,160,32,0.3);
          background: rgba(232,160,32,0.04);
        }

        .rf-file-item {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .rf-file-item span {
          color: #f5f0e8;
          font-size: 0.8125rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }
        .rf-file-item button {
          background: none;
          border: none;
          color: rgba(245,240,232,0.5);
          cursor: pointer;
          padding: 2px;
          transition: color 0.15s;
        }
        .rf-file-item button:hover {
          color: #f5f0e8;
        }

        /* ---------- Mobile ---------- */
        @media (max-width: 480px) {
          .rf-overlay { padding: 0.5rem; align-items: flex-end; }

          .rf-card { max-height: 92vh; }

          .rf-header { padding: 1rem 1.125rem 0.875rem; }
          .rf-title { font-size: 1.25rem; }
          .rf-subtitle { font-size: 0.6875rem; }

          .rf-property { margin: 0.875rem 1.125rem 0; padding: 0.625rem 0.875rem; }

          .rf-body { padding: 1rem 1.125rem 1.25rem; gap: 1.125rem; }

          /* iOS Safari zooms the viewport on focus for any input under 16px */
          .rf-input, .rf-textarea, .rf-select { font-size: 16px; }

          .rf-close { width: 40px; height: 40px; }

          .rf-upload { padding: 1.25rem 1rem; }

          .rf-file-item { padding: 0.625rem 0.75rem; min-height: 44px; }
          .rf-file-item button {
            padding: 10px;
            margin: -10px;
            min-width: 44px;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .rf-submit { padding: 0.85rem; min-height: 44px; }

          .rf-toast {
            top: 0.75rem;
            left: 0.75rem;
            right: 0.75rem;
            max-width: none;
          }
        }

        @media (max-height: 600px) and (orientation: landscape) {
          .rf-card { max-height: 96vh; }
          .rf-overlay { padding: 0.5rem; align-items: center; }
        }
      ` }} />
    </div>
  );
};

export default ReportListingDialog;