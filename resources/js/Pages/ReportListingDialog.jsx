import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Upload, X, AlertCircle, Check, Shield } from "lucide-react";

// Icon components (add these to the existing icons in your file)
const Upload = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const X = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AlertCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Check = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const Shield = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ReportListingDialog = ({ open, onOpenChange, propertyId, agentId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    is_anonymous: false
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Mock auth user (replace with your actual auth context)
  const user = null; // Replace with: const { user } = useAuth();

  const subjectOptions = [
    "Misleading listing information",
    "Fraudulent agent/landlord",
    "Price discrepancy",
    "Property doesn't exist",
    "Harassment or misconduct",
    "Other"
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subject) {
      newErrors.subject = "Please select an issue type";
    } else if (formData.subject.length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    }
    
    if (!formData.description) {
      newErrors.description = "Please provide a description";
    } else if (formData.description.length < 20) {
      newErrors.description = "Please provide more details (at least 20 characters)";
    } else if (formData.description.length > 2000) {
      newErrors.description = "Description is too long (max 2000 characters)";
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
    
    if (uploadedFiles.length + validFiles.length > 5) {
      showToast("Too many files", "Maximum 5 files allowed", "error");
      validFiles.splice(5 - uploadedFiles.length);
    }
    
    setUploadedFiles((prev) => [...prev, ...validFiles].slice(0, 5));
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const showToast = (title, description, type = "default") => {
    setToast({ title, description, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      showToast("Please sign in", "You need to be signed in to report a listing", "error");
      navigate("/sign-up", { state: { from: window.location.pathname } });
      return;
    }
    
    if (!validateForm()) {
      showToast("Validation error", "Please fix the errors in the form", "error");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload evidence files (mock implementation)
      const evidenceUrls = [];
      for (const file of uploadedFiles) {
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        // Mock upload - replace with actual Supabase upload
        evidenceUrls.push(`evidence/${fileName}`);
      }
      
      // Create complaint (mock implementation)
      console.log("Submitting complaint:", {
        ...formData,
        propertyId,
        agentId,
        evidenceUrls,
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast("Report submitted", "We'll review your complaint and take appropriate action", "success");
      
      // Reset form
      setFormData({
        subject: "",
        description: "",
        is_anonymous: false
      });
      setUploadedFiles([]);
      setErrors({});
      
      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting report:", error);
      showToast("Error", error.message || "Failed to submit report", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {/* Toast Notification */}
        {toast && (
          <div style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            backgroundColor: toast.type === "error" ? "#fef2f2" : 
                           toast.type === "success" ? "#f0fdf4" : "white",
            border: `1px solid ${
              toast.type === "error" ? "#fecaca" : 
              toast.type === "success" ? "#bbf7d0" : "#e5e7eb"
            }`,
            borderRadius: "0.5rem",
            padding: "1rem",
            maxWidth: "24rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            zIndex: 100,
            animation: "slideIn 0.3s ease-out"
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <div style={{
                backgroundColor: toast.type === "error" ? "#dc2626" : 
                               toast.type === "success" ? "#16a34a" : "#3b82f6",
                borderRadius: "9999px",
                padding: "0.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {toast.type === "error" ? (
                  <X style={{ height: "0.75rem", width: "0.75rem", color: "white" }} />
                ) : toast.type === "success" ? (
                  <Check style={{ height: "0.75rem", width: "0.75rem", color: "white" }} />
                ) : (
                  <AlertCircle style={{ height: "0.75rem", width: "0.75rem", color: "white" }} />
                )}
              </div>
              <div>
                <p style={{ fontWeight: "500", color: "#1f2937", marginBottom: "0.25rem" }}>
                  {toast.title}
                </p>
                <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  {toast.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dialog */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "0.75rem",
          width: "100%",
          maxWidth: "32rem",
          maxHeight: "90vh",
          overflowY: "auto",
          margin: "1rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
        }}>
          {/* Header */}
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1f2937" }}>
                Report This Listing
              </h2>
              <button
                onClick={() => onOpenChange(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.25rem",
                  borderRadius: "0.25rem",
                  color: "#9ca3af"
                }}
              >
                <X style={{ height: "1.25rem", width: "1.25rem" }} />
              </button>
            </div>
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
              Help us maintain trust by reporting problematic listings. All reports are reviewed by our team.
            </p>
          </div>

          {/* Content */}
          <div style={{ padding: "1.5rem" }}>
            {!user ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <div style={{
                  backgroundColor: "#f3f4f6",
                  borderRadius: "9999px",
                  width: "3rem",
                  height: "3rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem"
                }}>
                  <Shield style={{ height: "1.5rem", width: "1.5rem", color: "#6b7280" }} />
                </div>
                <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
                  You need to be signed in to submit a report
                </p>
                <button
                  onClick={() => navigate("/sign-up", { state: { from: window.location.pathname } })}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#059669",
                    color: "white",
                    border: "none",
                    borderRadius: "0.375rem",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
                  Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Issue Type */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.25rem" }}>
                    Issue Type *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      border: `1px solid ${errors.subject ? "#dc2626" : "#d1d5db"}`,
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      backgroundColor: "white",
                      color: "#1f2937"
                    }}
                  >
                    <option value="">Select the issue type</option>
                    {subjectOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p style={{ fontSize: "0.75rem", color: "#dc2626", marginTop: "0.25rem" }}>
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.25rem" }}>
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Please describe the issue in detail. Include dates, amounts, and any relevant information..."
                    rows={5}
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      border: `1px solid ${errors.description ? "#dc2626" : "#d1d5db"}`,
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      backgroundColor: "white",
                      color: "#1f2937",
                      resize: "vertical",
                      fontFamily: "inherit"
                    }}
                  />
                  {errors.description && (
                    <p style={{ fontSize: "0.75rem", color: "#dc2626", marginTop: "0.25rem" }}>
                      {errors.description}
                    </p>
                  )}
                  <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                    {formData.description.length}/2000 characters
                  </p>
                </div>

                {/* Evidence Upload */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.25rem" }}>
                    Evidence (optional)
                  </label>
                  <div style={{
                    border: "2px dashed #d1d5db",
                    borderRadius: "0.5rem",
                    padding: "1.5rem",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: uploadedFiles.length > 0 ? "#f9fafb" : "white"
                  }}>
                    <input
                      type="file"
                      id="evidence-upload"
                      style={{ display: "none" }}
                      accept="image/*,.pdf"
                      multiple
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="evidence-upload" style={{ cursor: "pointer", display: "block" }}>
                      <Upload style={{ height: "2rem", width: "2rem", color: "#6b7280", margin: "0 auto 0.5rem" }} />
                      <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                        Click to upload screenshots or documents
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.25rem" }}>
                        Max 5 files, 5MB each
                      </p>
                    </label>
                  </div>

                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: "#f3f4f6",
                          borderRadius: "0.375rem",
                          padding: "0.5rem"
                        }}>
                          <span style={{ fontSize: "0.75rem", color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "0.25rem",
                              color: "#9ca3af"
                            }}
                          >
                            <X style={{ height: "0.875rem", width: "0.875rem" }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Anonymous Report */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  backgroundColor: "#f9fafb"
                }}>
                  <div>
                    <p style={{ fontWeight: "500", color: "#1f2937", marginBottom: "0.25rem" }}>
                      Report Anonymously
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Your identity won't be shared with the reported party
                    </p>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={formData.is_anonymous}
                      onChange={(e) => handleChange("is_anonymous", e.target.checked)}
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor="anonymous"
                      style={{
                        display: "block",
                        width: "2.5rem",
                        height: "1.25rem",
                        backgroundColor: formData.is_anonymous ? "#059669" : "#d1d5db",
                        borderRadius: "9999px",
                        position: "relative",
                        cursor: "pointer",
                        transition: "background-color 0.2s"
                      }}
                    >
                      <span style={{
                        position: "absolute",
                        top: "0.125rem",
                        left: formData.is_anonymous ? "calc(100% - 1rem)" : "0.125rem",
                        width: "1rem",
                        height: "1rem",
                        backgroundColor: "white",
                        borderRadius: "9999px",
                        transition: "left 0.2s",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
                      }} />
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    backgroundColor: isSubmitting ? "#9ca3af" : "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "0.375rem",
                    fontWeight: "500",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem"
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div style={{
                        width: "0.75rem",
                        height: "0.75rem",
                        border: "2px solid rgba(255, 255, 255, 0.3)",
                        borderTop: "2px solid white",
                        borderRadius: "9999px",
                        animation: "spin 1s linear infinite"
                      }} />
                      Submitting...
                    </>
                  ) : "Submit Report"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Add animations */}
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
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
};

export default ReportListingDialog;