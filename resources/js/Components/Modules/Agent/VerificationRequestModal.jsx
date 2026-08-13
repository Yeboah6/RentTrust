import { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";

// ----- Icons (unchanged) -----
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
const AlertCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ----- Document buckets: match listing_verifications columns exactly -----
// (ownership_documents, photos, other_documents are the only file columns on the table)
const DOCUMENT_SECTIONS = [
  {
    key: "ownership_documents",
    title: "Proof of Ownership / Authorization",
    description: "Property deed, title, lease agreement, or authorization letter from the owner",
  },
  {
    key: "photos",
    title: "Property Photos",
    description: "Clear photos of the property exterior, interior, and address markers",
  },
  {
    key: "other_documents",
    title: "Other Supporting Documents",
    description: "Utility bills, business licenses/permits, or anything else that supports the request",
  },
];

const AVAILABILITY_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "rented", label: "Rented" },
  { value: "sold", label: "Sold" },
  { value: "unavailable", label: "Unavailable" },
];

// Storage disk is public, symlinked via `php artisan storage:link` — same convention
// used on the agent-verification review page.
const fileUrl = (path) => (path ? `/storage/${path}` : null);
const fileName = (path) => (path ? path.split("/").pop() : "");

// ----- Main Component -----
const VerificationRequestModal = ({ isOpen, onClose, agentData, selectedRental, verificationData }) => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [toast, setToast] = useState(null);

  const [selectedFiles, setSelectedFiles] = useState({
    ownership_documents: [],
    photos: [],
    other_documents: [],
  });

  const [verificationStatus, setVerificationStatus] = useState(null);
  const [existingVerification, setExistingVerification] = useState(null);
  const existingVerificationId = existingVerification?.id ?? null;

  const { data, setData, processing, errors, reset, clearErrors } = useForm({
    listing_id: selectedRental?.id || "",
    property_title: selectedRental?.title || "",
    property_address: selectedRental?.address || "",
    availability_status: "available",
    notes: "",
    terms_accepted: false,
    ownership_documents: [],
    photos: [],
    other_documents: [],
  });

  // ---------- Compute verification status (and the record to resubmit against) ----------
  useEffect(() => {
    if (!isOpen || !selectedRental?.id) {
      setVerificationStatus(null);
      setExistingVerification(null);
      return;
    }

    if (verificationData && verificationData.length > 0) {
      const relevant = verificationData
        .filter((v) => v.listing_id === selectedRental.id)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const latest = relevant[0];

      if (latest && (latest.status === "pending" || latest.status === "approved")) {
        setVerificationStatus(latest.status);
        setExistingVerification(latest);
      } else if (latest && latest.status === "rejected") {
        setVerificationStatus("rejected");
        setExistingVerification(latest);
      } else {
        setVerificationStatus("none");
        setExistingVerification(null);
      }
    } else {
      setVerificationStatus("none");
      setExistingVerification(null);
    }
  }, [isOpen, selectedRental, verificationData]);

  useEffect(() => {
    if (isOpen && selectedRental && (verificationStatus === "none" || verificationStatus === "rejected")) {
      setData("listing_id", selectedRental.id);
      setData("property_title", selectedRental.title || "");
      setData("property_address", selectedRental.address || "");
      setData("availability_status", "available");
      setData("notes", "");
      setData("terms_accepted", false);
      setData("ownership_documents", []);
      setData("photos", []);
      setData("other_documents", []);

      setSelectedFiles({ ownership_documents: [], photos: [], other_documents: [] });
      setUploadProgress({});
      clearErrors();
    }
  }, [isOpen, selectedRental, verificationStatus]);

  // ---------- Handlers ----------
  const handleInputChange = (field, value) => {
    setData(field, value);
    if (errors[field]) clearErrors(field);
  };

  const handleFileUpload = (field, e) => {
    const files = Array.from(e.target.files);
    const invalidFiles = files.filter((f) => f.size > 10 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      alert(`Some files exceed 10MB limit: ${invalidFiles.map((f) => f.name).join(", ")}`);
      return;
    }

    const newFiles = files.map((file) => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
    }));

    setSelectedFiles((prev) => ({ ...prev, [field]: [...prev[field], ...newFiles] }));

    const current = data[field] || [];
    setData(field, [...current, ...files]);

    if (errors[field]) clearErrors(field);

    newFiles.forEach((fileObj) => simulateUpload(fileObj.id));
  };

  const simulateUpload = (fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
      if (progress >= 100) clearInterval(interval);
    }, 200);
  };

  const removeFile = (field, index) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));

    const files = [...data[field]];
    files.splice(index, 1);
    setData(field, files);
  };

  const validateForm = () => {
    const totalDocs =
      (data.ownership_documents?.length || 0) +
      (data.photos?.length || 0) +
      (data.other_documents?.length || 0);

    if (totalDocs === 0) {
      alert("Please upload at least one document to verify your listing");
      return false;
    }
    if (!data.terms_accepted) {
      alert("You must accept the terms and conditions");
      return false;
    }
    if (!data.listing_id) {
      alert("No property selected");
      return false;
    }
    if (!data.property_address.trim()) {
      alert("Please provide the property address");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const isResubmission = verificationStatus === "rejected" && !!existingVerificationId;

    const formData = new FormData();
    formData.append("listing_id", data.listing_id);
    formData.append("property_title", data.property_title);
    formData.append("property_address", data.property_address);
    formData.append("availability_status", data.availability_status);
    formData.append("notes", data.notes ?? "");

    data.ownership_documents.forEach((file) => formData.append("ownership_documents[]", file));
    data.photos.forEach((file) => formData.append("photos[]", file));
    data.other_documents.forEach((file) => formData.append("other_documents[]", file));

    if (isResubmission) {
      formData.append("_method", "put");
    }

    const url = isResubmission
      ? `/verification-requests/${existingVerificationId}`
      : "/verification-requests";

    router.post(url, formData, {
      forceFormData: true,
      onSuccess: () => {
        showToast(
          isResubmission
            ? "Verification request resubmitted successfully!"
            : "Verification request submitted successfully!",
          "success",
          3000
        );
        setTimeout(() => {
          router.reload({ only: ["rentals"] });
          handleClose();
        }, 1500);
      },
      onError: (errs) => {
        const firstError = Object.values(errs)[0];
        showToast(
          typeof firstError === "string" ? firstError : "An error occurred while submitting",
          "error",
          4000
        );
      },
    });
  };

  const showToast = (message, type = "success", duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  const handleClose = () => {
    if (processing) return;
    reset();
    setSelectedFiles({ ownership_documents: [], photos: [], other_documents: [] });
    setUploadProgress({});
    clearErrors();
    setToast(null);
    onClose();
  };

  // ----- Status view (when pending or approved) -----
  const renderStatusView = () => {
    const isPending = verificationStatus === "pending";

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem", textAlign: "center", flex: 1 }}>
        {isPending ? (
          <>
            <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", backgroundColor: "hsl(48 96% 89%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
              <svg style={{ height: "2rem", width: "2rem", color: "hsl(48 96% 30%)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "hsl(200 25% 15%)", marginBottom: "0.5rem" }}>
              Verification In Progress
            </h3>
            <p style={{ fontSize: "0.875rem", color: "hsl(200 15% 45%)", maxWidth: "24rem", marginBottom: "1.5rem" }}>
              Your verification request for <strong>{selectedRental?.title}</strong> is currently pending review. Our team will process it within 3–5 business days. You'll be notified once a decision is made.
            </p>
          </>
        ) : (
          <>
            <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", backgroundColor: "hsl(152 60% 40% / 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
              <CheckCircle style={{ height: "2rem", width: "2rem", color: "hsl(152 60% 40%)" }} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "hsl(200 25% 15%)", marginBottom: "0.5rem" }}>
              Listing Verified
            </h3>
            <p style={{ fontSize: "0.875rem", color: "hsl(200 15% 45%)", maxWidth: "24rem", marginBottom: "1.5rem" }}>
              <strong>{selectedRental?.title}</strong> has been successfully verified.
            </p>
          </>
        )}
        <button
          onClick={handleClose}
          style={{
            padding: "0.75rem 2rem", backgroundColor: "white", border: "1px solid hsl(40 20% 88%)",
            borderRadius: "0.5rem", fontWeight: "600", cursor: "pointer", fontSize: "0.875rem", color: "hsl(200 25% 15%)",
          }}
        >
          Close
        </button>
      </div>
    );
  };

  if (!isOpen) return null;

  const toastStyles = {
    success: { backgroundColor: "hsl(152 60% 40%)", borderColor: "hsl(152 60% 30%)", color: "white" },
    error: { backgroundColor: "hsl(0 72% 51%)", borderColor: "hsl(0 72% 40%)", color: "white" },
  };

  // Only a verified/approved listing is considered locked for verification.
  // A pending status is still treated as a requestable default state, so the agent
  // can open the form and submit when needed.
  const showForm = verificationStatus !== "approved" && verificationStatus !== "verified";
  const isResubmitFlow = verificationStatus === "rejected";

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes modalFadeIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes backdropFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(1rem); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {toast && (
        <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 2000, animation: "slideInUp 0.3s ease-out" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem 1.25rem",
            borderRadius: "0.5rem", border: "1px solid", backgroundColor: toastStyles[toast.type].backgroundColor,
            color: toastStyles[toast.type].color, borderColor: toastStyles[toast.type].borderColor,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)", fontSize: "0.875rem", fontWeight: "500"
          }}>
            {toast.type === "success" ? <CheckCircle style={{ height: "1.25rem", width: "1.25rem", flexShrink: 0 }} /> : <AlertCircle style={{ height: "1.25rem", width: "1.25rem", flexShrink: 0 }} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: "1rem", animation: "backdropFadeIn 0.2s ease-out", overflowY: "auto"
        }}
        onClick={(e) => { if (e.target === e.currentTarget && !processing) handleClose(); }}
      >
        <div style={{
          backgroundColor: "white", borderRadius: "1rem", width: "100%", maxWidth: "48rem", maxHeight: "90vh",
          overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", animation: "modalFadeIn 0.3s ease-out",
          display: "flex", flexDirection: "column", margin: "auto"
        }}>
          {/* Header */}
          <div style={{ padding: "1.5rem", borderBottom: "1px solid hsl(40 20% 88%)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.5rem", background: "linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShieldCheck style={{ height: "1.5rem", width: "1.5rem", color: "white" }} />
              </div>
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "hsl(200 25% 15%)", marginBottom: "0.125rem" }}>
                  {isResubmitFlow ? "Resubmit Listing Verification" : "Request Listing Verification"}
                </h2>
                <p style={{ fontSize: "0.875rem", color: "hsl(200 15% 45%)" }}>
                  {showForm
                    ? (isResubmitFlow ? "Update your documents and resubmit for review" : "Submit documents to verify your property")
                    : "Verification status"}
                </p>
              </div>
            </div>
            <button onClick={handleClose} disabled={processing} style={{ padding: "0.5rem", border: "none", backgroundColor: "transparent", cursor: processing ? "not-allowed" : "pointer", borderRadius: "0.375rem", opacity: processing ? 0.5 : 1 }}>
              <X style={{ height: "1.5rem", width: "1.5rem", color: "hsl(200 15% 45%)" }} />
            </button>
          </div>

          {showForm && isResubmitFlow && (
            <div style={{ margin: "1rem 1.5rem 0", padding: "1rem", backgroundColor: "hsl(0 72% 51% / 0.06)", border: "1px solid hsl(0 72% 51% / 0.25)", borderRadius: "0.5rem", display: "flex", gap: "0.75rem", alignItems: "start" }}>
              <AlertCircle style={{ height: "1.25rem", width: "1.25rem", color: "hsl(0 72% 51%)", flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: "600", color: "hsl(0 72% 51%)", marginBottom: "0.25rem" }}>Previous request was rejected</p>
                <p style={{ fontSize: "0.875rem", color: "hsl(0 72% 40%)", margin: 0 }}>
                  Update your documents below and resubmit — this will replace your rejected request rather than create a new one.
                </p>
                {existingVerification?.admin_notes && (
                  <p style={{ fontSize: "0.875rem", color: "hsl(0 72% 40%)", margin: "0.5rem 0 0" }}>
                    <strong>Reason:</strong> {existingVerification.admin_notes}
                  </p>
                )}
              </div>
            </div>
          )}

          {showForm && Object.keys(errors).length > 0 && (
            <div style={{ margin: "1rem 1.5rem 0", padding: "1rem", backgroundColor: "hsl(0 72% 51% / 0.1)", border: "1px solid hsl(0 72% 51% / 0.3)", borderRadius: "0.5rem", display: "flex", gap: "0.75rem", alignItems: "start" }}>
              <AlertCircle style={{ height: "1.25rem", width: "1.25rem", color: "hsl(0 72% 51%)", flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: "600", color: "hsl(0 72% 51%)", marginBottom: "0.25rem" }}>Error</p>
                {Object.entries(errors).map(([key, error]) => (
                  <p key={key} style={{ fontSize: "0.875rem", color: "hsl(0 72% 40%)" }}>{error}</p>
                ))}
              </div>
            </div>
          )}

          <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
            {!showForm ? (
              renderStatusView()
            ) : (
              <>
                {/* Property title (read-only) */}
                <div style={{ backgroundColor: "hsl(174 62% 32% / 0.05)", border: "1px solid hsl(174 62% 32% / 0.2)", borderRadius: "0.5rem", padding: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <Building style={{ height: "1.25rem", width: "1.25rem", color: "hsl(174 62% 32%)" }} />
                    <h3 style={{ fontSize: "0.875rem", fontWeight: "600", color: "hsl(200 25% 15%)" }}>Property Being Verified</h3>
                  </div>
                  <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "hsl(174 62% 32%)", margin: 0 }}>
                    {data.property_title || "No property selected"}
                  </p>
                  {errors.listing_id && <p style={{ fontSize: "0.75rem", color: "hsl(0 72% 51%)", marginTop: "0.25rem" }}>{errors.listing_id}</p>}
                </div>

                {/* Property address */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "hsl(200 25% 15%)", marginBottom: "0.5rem" }}>
                    Property Address
                  </label>
                  <input
                    type="text"
                    value={data.property_address}
                    onChange={(e) => handleInputChange("property_address", e.target.value)}
                    placeholder="e.g. 12 Cantonments Road, Accra"
                    disabled={processing}
                    style={{ width: "100%", padding: "0.625rem", border: errors.property_address ? "1px solid hsl(0 72% 51%)" : "1px solid hsl(40 20% 88%)", borderRadius: "0.5rem", fontSize: "0.875rem" }}
                  />
                  {errors.property_address && <p style={{ fontSize: "0.75rem", color: "hsl(0 72% 51%)", marginTop: "0.5rem" }}>{errors.property_address}</p>}
                </div>

                {/* Availability status */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "hsl(200 25% 15%)", marginBottom: "0.5rem" }}>
                    Current Availability
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
                    {AVAILABILITY_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleInputChange("availability_status", value)}
                        disabled={processing}
                        style={{
                          padding: "0.5rem", border: data.availability_status === value ? "2px solid hsl(174 62% 32%)" : "1px solid hsl(40 20% 88%)",
                          backgroundColor: data.availability_status === value ? "hsl(174 62% 32% / 0.1)" : "white", borderRadius: "0.5rem",
                          cursor: processing ? "not-allowed" : "pointer", fontSize: "0.8125rem", fontWeight: "500",
                          color: data.availability_status === value ? "hsl(174 62% 32%)" : "hsl(200 25% 15%)"
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {errors.availability_status && <p style={{ fontSize: "0.75rem", color: "hsl(0 72% 51%)", marginTop: "0.5rem" }}>{errors.availability_status}</p>}
                </div>

                {/* Info note */}
                <div style={{ backgroundColor: "hsl(48 96% 89%)", border: "1px solid hsl(48 96% 70%)", borderRadius: "0.5rem", padding: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <CheckCircle style={{ height: "1.25rem", width: "1.25rem", color: "hsl(48 96% 30%)" }} />
                    <h3 style={{ fontSize: "0.875rem", fontWeight: "600", color: "hsl(48 96% 20%)" }}>Simplified Verification Process</h3>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "hsl(48 96% 25%)", margin: 0 }}>
                    Upload at least one document across the categories below to get your listing verified.
                  </p>
                </div>

                {/* Document upload sections */}
                {DOCUMENT_SECTIONS.map((section) => {
                  const existingPaths = isResubmitFlow ? (existingVerification?.[section.key] ?? []) : [];
                  const hasExisting = existingPaths.length > 0;

                  return (
                  <div key={section.key} style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "hsl(200 25% 15%)", marginBottom: "0.25rem" }}>{section.title}</label>
                    <p style={{ fontSize: "0.75rem", color: "hsl(200 15% 45%)", marginBottom: "0.75rem" }}>{section.description}</p>
                    {errors[section.key] && <p style={{ fontSize: "0.75rem", color: "hsl(0 72% 51%)", marginBottom: "0.5rem" }}>{errors[section.key]}</p>}

                    {/* Previously submitted documents for this category — only relevant on a
                        rejected resubmission. Uploading new files below replaces these. */}
                    {hasExisting && (
                      <div style={{ marginBottom: "0.75rem" }}>
                        <p style={{ fontSize: "0.72rem", fontWeight: "600", color: "hsl(200 15% 45%)", marginBottom: "0.4rem" }}>
                          Previously submitted ({existingPaths.length}):
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                          {existingPaths.map((path, i) => (
                            <a key={i} href={fileUrl(path)} target="_blank" rel="noopener noreferrer"
                              style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.28rem 0.55rem", borderRadius: "0.4rem", backgroundColor: "hsl(214 100% 96%)", color: "hsl(214 80% 42%)", fontSize: "0.7rem", fontWeight: "700", textDecoration: "none", border: "1px solid hsl(214 60% 88%)" }}>
                              {fileName(path)}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div
                      style={{ border: "2px dashed hsl(40 20% 88%)", borderRadius: "0.5rem", padding: "1.5rem", textAlign: "center", backgroundColor: "hsl(40 30% 98%)", cursor: processing ? "not-allowed" : "pointer", marginBottom: "0.75rem" }}
                      onClick={() => !processing && document.getElementById(`${section.key}-input`).click()}
                    >
                      <Upload style={{ height: "1.5rem", width: "1.5rem", color: "hsl(200 15% 45%)", margin: "0 auto 0.5rem" }} />
                      <p style={{ fontSize: "0.875rem", color: "hsl(200 25% 15%)", fontWeight: "500", marginBottom: "0.25rem" }}>
                        {hasExisting ? "Click to upload replacement files" : "Click to upload files"}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "hsl(200 15% 45%)" }}>PNG, JPG, PDF up to 10MB each</p>
                      <input id={`${section.key}-input`} type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={(e) => handleFileUpload(section.key, e)} style={{ display: "none" }} disabled={processing} />
                    </div>

                    {selectedFiles[section.key].length > 0 && (
                      <div>
                        {selectedFiles[section.key].map((fileObj, index) => (
                          <div key={fileObj.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", backgroundColor: "hsl(40 30% 96%)", borderRadius: "0.375rem", marginBottom: "0.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
                              {uploadProgress[fileObj.id] >= 100 ? <CheckCircle style={{ height: "1rem", width: "1rem", color: "hsl(152 60% 40%)" }} /> : <div style={{ width: "1rem", height: "1rem", border: "2px solid hsl(174 62% 32%)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />}
                              <span style={{ fontSize: "0.875rem", color: "hsl(200 25% 15%)", flex: 1 }}>{fileObj.name}</span>
                            </div>
                            <button type="button" onClick={() => removeFile(section.key, index)} disabled={processing || uploadProgress[fileObj.id] < 100} style={{ padding: "0.25rem", border: "none", backgroundColor: "transparent", cursor: (processing || uploadProgress[fileObj.id] < 100) ? "not-allowed" : "pointer", color: "hsl(0 65% 45%)" }}>
                              <X style={{ height: "1rem", width: "1rem" }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  );
                })}

                {/* Notes */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "hsl(200 25% 15%)", marginBottom: "0.5rem" }}>Additional Notes</label>
                  <textarea
                    value={data.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Any additional information..." rows={3} disabled={processing}
                    style={{ width: "100%", padding: "0.625rem", border: errors.notes ? "1px solid hsl(0 72% 51%)" : "1px solid hsl(40 20% 88%)", borderRadius: "0.5rem", fontSize: "0.875rem", resize: "vertical", fontFamily: "inherit" }}
                  />
                  {errors.notes && <p style={{ fontSize: "0.75rem", color: "hsl(0 72% 51%)", marginTop: "0.5rem" }}>{errors.notes}</p>}
                </div>

                {/* Terms */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <input type="checkbox" id="terms" checked={data.terms_accepted} onChange={(e) => handleInputChange("terms_accepted", e.target.checked)} disabled={processing} style={{ accentColor: "hsl(174 62% 32%)", width: "1.125rem", height: "1.125rem", cursor: "pointer" }} />
                    <label htmlFor="terms" style={{ fontSize: "0.875rem", color: "hsl(200 25% 15%)", cursor: "pointer", flex: 1 }}>
                      I confirm all submitted documents are authentic. I understand verification takes 3-5 business days and false information may result in account suspension.
                    </label>
                  </div>
                  {errors.terms_accepted && <p style={{ fontSize: "0.75rem", color: "hsl(0 72% 51%)", marginTop: "0.5rem", marginLeft: "2rem" }}>{errors.terms_accepted}</p>}
                </div>
              </>
            )}
          </div>

          {showForm && (
            <div style={{ padding: "1.5rem", borderTop: "1px solid hsl(40 20% 88%)", backgroundColor: "hsl(40 30% 98%)", display: "flex", gap: "0.75rem" }}>
              <button type="button" onClick={handleClose} disabled={processing} style={{ flex: 1, padding: "0.75rem", border: "1px solid hsl(40 20% 88%)", backgroundColor: "white", borderRadius: "0.5rem", fontWeight: "600", cursor: processing ? "not-allowed" : "pointer", fontSize: "0.875rem", color: "hsl(200 15% 45%)" }}>
                Cancel
              </button>
              <button
                type="button" onClick={handleSubmit} disabled={processing || !data.terms_accepted}
                style={{
                  flex: 2, padding: "0.75rem", border: "none",
                  background: processing || !data.terms_accepted ? "hsl(200 15% 45%)" : "linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)",
                  color: "white", borderRadius: "0.5rem", fontWeight: "600", cursor: processing || !data.terms_accepted ? "not-allowed" : "pointer", fontSize: "0.875rem",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
                }}
              >
                {processing ? (
                  <>
                    <div style={{ width: "1rem", height: "1rem", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    {isResubmitFlow ? "Resubmitting..." : "Submitting..."}
                  </>
                ) : (
                  isResubmitFlow ? "Resubmit Verification Request" : "Submit Verification Request"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VerificationRequestModal;