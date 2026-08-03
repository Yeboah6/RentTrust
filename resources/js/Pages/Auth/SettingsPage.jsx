import { useState } from "react";
import { Shield, Bell, Lock, User, Mail, Globe, Save, Eye, EyeOff, Check, Upload, FileText, Clock, XCircle, CheckCircle2, MessageSquare } from "lucide-react";
import Header from "../../Components/Layouts/Header";
import Footer from "../../Components/Layouts/Footer";
import { usePage, useForm, router, Head } from "@inertiajs/react";

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [securityErrors, setSecurityErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const { auth, userRole: accountRole, canAccessVerification } = usePage().props;

  const userAgent = canAccessVerification || accountRole === 'agent' || !!auth?.agent;
  const userAdmin = !!auth?.super;

  const userFullName = auth?.agent?.name || auth?.super?.name || "";
  const userEmail = auth?.agent?.email || auth?.super?.email || "";
  const userphone = auth?.agent?.phone || auth?.super?.phone || "";
  const userlocation = auth?.agent?.location || auth?.super?.location || "";
  const userbio = auth?.agent?.bio || auth?.super?.bio || "";
  const userRole = auth?.agent?.type || auth?.super?.type || "";
  const userCompany = auth?.agent?.company || auth?.super?.company || "";
  const userFee = auth?.agent?.fee || auth?.super?.fee || "";
  const userStatus = auth?.agent?.status || auth?.super?.status || "";

  // Existing verification record, if any (assumes controller passes this under auth.agent.verification)
  const verification = auth?.agent?.verification || null;
  const verificationStatus = verification?.status || null; // 'pending' | 'approved' | 'rejected' | null
  const verificationLocked = verificationStatus === "pending" || verificationStatus === "approved";

  // Separate forms for agent and admin
  const agentForm = useForm({
    name: userFullName,
    email: userEmail,
    phone: userphone,
    location: userlocation,
    bio: userbio,
    company: userCompany,
    fee: userFee,
    role: userRole,
  });

  const adminForm = useForm({
    name: userFullName,
    email: userEmail,
    phone: userphone,
    bio: userbio,
    location: userlocation,
    company: userCompany,
    fee: userFee,
  });

  // Use the appropriate form based on user type
  const { data, setData, errors, put, processing } = userAgent ? agentForm : adminForm;

  // Verification form (matches agent_verifications table)
  const verificationForm = useForm({
    agent_name: verification?.agent_name || userFullName,
    email: verification?.email || userEmail,
    phone_number: verification?.phone_number || userphone,
    gov_id: null,
    license_documents: null,
    proof_of_address: null,
    resubmission_note: "", // Add note field for resubmission
  });

  // Security settings
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,
    sessionTimeout: "30",
  });

  const showToast = (title, description, variant = "success") => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveAgentProfile = () => {
    agentForm.put("/settings/profile/agent", {
      onSuccess: () => {
        showToast("Profile updated", "Your profile information has been saved successfully");
      },
      onError: (errors) => {
        showToast("Error", "Failed to update profile. Please check the form.", "error");
        console.error("Validation errors:", errors);
      },
    });
  };

  const handleSaveAdminProfile = () => {
    adminForm.put("/settings/profile/admin", {
      onSuccess: () => {
        showToast("Profile updated", "Your profile information has been saved successfully");
      },
      onError: (errors) => {
        showToast("Error", "Failed to update profile. Please check the form.", "error");
        console.error("Validation errors:", errors);
      },
    });
  };

  const handleSaveSecurity = () => {
    if (securityData.newPassword && securityData.newPassword !== securityData.confirmPassword) {
      showToast("Password mismatch", "New passwords do not match", "error");
      return;
    }

    setIsSaving(true);
    setSecurityErrors({});

    router.put('/settings/password', {
      currentPassword: securityData.currentPassword,
      newPassword: securityData.newPassword,
      newPassword_confirmation: securityData.confirmPassword,
    }, {
      onSuccess: () => {
        showToast("Security updated", "Password changed successfully");
        setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "", sessionTimeout: securityData.sessionTimeout });
        setIsSaving(false);
      },
      onError: (errors) => {
        setSecurityErrors(errors);
        showToast("Error", errors.currentPassword || "Failed to update password.", "error");
        setIsSaving(false);
      }
    });
  };

  const handleSubmitVerification = () => {
    verificationForm.post("/settings/verification", {
      forceFormData: true,
      onSuccess: () => {
        showToast("Verification submitted", "Your documents have been sent for review");
      },
      onError: (errors) => {
        showToast("Error", "Failed to submit verification. Please check the form.", "error");
        console.error("Validation errors:", errors);
      },
    });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    ...(userAgent ? [{ id: "verification", label: "Verification", icon: Shield }] : []),
    { id: "security", label: "Security", icon: Lock },
  ];

  const statusBadge = (() => {
    if (!verificationStatus) {
      return { label: "Not Submitted", bg: '#f3f4f6', color: '#6b7280', Icon: Clock };
    }
    if (verificationStatus === "approved") {
      return { label: "Approved", bg: '#dcfce7', color: '#15803d', Icon: CheckCircle2 };
    }
    if (verificationStatus === "rejected") {
      return { label: "Rejected", bg: '#fee2e2', color: '#b91c1c', Icon: XCircle };
    }
    return { label: "Pending Review", bg: '#fef3c7', color: '#92400e', Icon: Clock };
  })();

  const fieldLabelStyle = {
    display: 'block',
    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  };

  const inputStyle = {
    width: '100%',
    padding: 'clamp(0.625rem, 2vw, 0.75rem)',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
    outline: 'none'
  };

  const errorTextStyle = { color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' };

  return (
    <>
    <Head>
      <title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
    </Head>
      {/* Toast Notification */}
      {toast && (
        <div className="toast-notification" style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          left: '1rem',
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

      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <Header />

        {/* Main Content */}
        <div className="settings-container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(1rem, 4vw, 2rem) clamp(0.75rem, 3vw, 1rem)'
        }}>
          <div className="settings-grid" style={{
            display: 'grid',
            gap: 'clamp(1rem, 3vw, 2rem)',
          }}>
            {/* Sidebar Navigation */}
            <div className="sidebar-nav" style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '0.5rem',
              height: 'fit-content',
              border: '1px solid #e5e7eb',
              display: 'flex',
              gap: '0.25rem',
            }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      flex: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: 'clamp(0.5rem, 2vw, 0.75rem)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      backgroundColor: activeTab === tab.id ? '#eff6ff' : 'transparent',
                      color: activeTab === tab.id ? '#1e40af' : '#6b7280',
                      fontWeight: activeTab === tab.id ? '500' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Icon size={18} style={{ flexShrink: 0 }} />
                    <span className="tab-label">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: 'clamp(1rem, 4vw, 2rem)',
              border: '1px solid #e5e7eb'
            }}>
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <h2 style={{
                    fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Profile Information
                  </h2>
                  <p style={{ fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: '#6b7280', marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
                    Update your personal information and public profile
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.25rem, 3vw, 1.5rem)' }}>
                    {/* Avatar */}
                    <div>
                      <label style={fieldLabelStyle}>
                        Profile Picture
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: 'clamp(60px, 15vw, 80px)',
                          height: 'clamp(60px, 15vw, 80px)',
                          borderRadius: '50%',
                          backgroundColor: '#0f766e',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'clamp(1.25rem, 4vw, 2rem)',
                          fontWeight: '600'
                        }}>
                          {data.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label style={fieldLabelStyle}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        style={inputStyle}
                      />
                      {errors.name && <p style={errorTextStyle}>{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label style={fieldLabelStyle}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        style={inputStyle}
                      />
                      {errors.email && <p style={errorTextStyle}>{errors.email}</p>}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label style={fieldLabelStyle}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        style={inputStyle}
                      />
                      {errors.phone && <p style={errorTextStyle}>{errors.phone}</p>}
                    </div>

                    {/* Location */}
                    <div>
                      <label style={fieldLabelStyle}>
                        Location
                      </label>
                      <input
                        type="tel"
                        value={data.location}
                        onChange={(e) => setData('location', e.target.value)}
                        style={inputStyle}
                      />
                      {errors.location && <p style={errorTextStyle}>{errors.location}</p>}
                    </div>

                    {userAgent && (
                      <>
                        {/* Role */}
                        <div>
                          <label style={fieldLabelStyle}>
                            Role
                          </label>
                          <input
                            type="text"
                            value={data.role}
                            disabled
                            style={{ ...inputStyle, backgroundColor: '#f9fafb', color: '#6b7280', cursor: 'not-allowed' }}
                          />
                        </div>

                        {/* Status */}
                        <div>
                          <label style={fieldLabelStyle}>
                            Status
                          </label>
                          <input
                            type="text"
                            value={userStatus}
                            disabled
                            style={{ ...inputStyle, backgroundColor: '#f9fafb', color: '#6b7280', cursor: 'not-allowed' }}
                          />
                        </div>

                        {/* Company */}
                        <div>
                          <label style={fieldLabelStyle}>
                            Company
                          </label>
                          <input
                            type="text"
                            value={data.company}
                            onChange={(e) => setData('company', e.target.value)}
                            style={inputStyle}
                          />
                          {errors.company && <p style={errorTextStyle}>{errors.company}</p>}
                        </div>

                        {/* Fee */}
                        <div>
                          <label style={fieldLabelStyle}>
                            Fee
                          </label>
                          <input
                            type="number"
                            value={data.fee}
                            onChange={(e) => setData('fee', e.target.value)}
                            min="0"
                            step="0.01"
                            style={inputStyle}
                          />
                          {errors.fee && <p style={errorTextStyle}>{errors.fee}</p>}
                        </div>
                      </>
                    )}

                    {/* Bio */}
                    <div>
                      <label style={fieldLabelStyle}>
                        Bio
                      </label>
                      <textarea
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        rows={3}
                        style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                      />
                      {errors.bio && <p style={errorTextStyle}>{errors.bio}</p>}
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={userAgent ? handleSaveAgentProfile : handleSaveAdminProfile}
                      disabled={processing}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                        backgroundColor: processing ? '#9ca3af' : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontWeight: '500',
                        cursor: processing ? 'not-allowed' : 'pointer',
                        fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                        width: '100%'
                      }}
                    >
                      <Save size={16} />
                      {processing ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}

              {/* Verification Tab (agents only) */}
              {activeTab === "verification" && userAgent && (
                <div>
                  <h2 style={{
                    fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Agent Verification
                  </h2>
                  <p style={{ fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: '#6b7280', marginBottom: '1rem' }}>
                    Submit your ID and supporting documents to get verified on RentTrustGH
                  </p>

                  {/* Status Badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: statusBadge.bg,
                    color: statusBadge.color,
                    padding: '0.5rem 0.875rem',
                    borderRadius: '9999px',
                    fontSize: '0.8125rem',
                    fontWeight: '600',
                    marginBottom: 'clamp(1.5rem, 3vw, 2rem)'
                  }}>
                    <statusBadge.Icon size={16} />
                    {statusBadge.label}
                  </div>

                  {/* Rejection notes from reviewer */}
                  {verificationStatus === "rejected" && verification?.notes && (
                    <div style={{
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      marginBottom: '1.5rem'
                    }}>
                      <p style={{ fontWeight: '600', color: '#991b1b', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                        Reason for rejection
                      </p>
                      <p style={{ color: '#991b1b', fontSize: '0.8125rem' }}>{verification.notes}</p>
                    </div>
                  )}

                  {/* Reviewed metadata */}
                  {verification?.reviewed_at && (
                    <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '1.5rem' }}>
                      Reviewed on {new Date(verification.reviewed_at).toLocaleDateString()}
                      {verification.reviewed_by ? ` by ${verification.reviewed_by}` : ""}
                    </p>
                  )}

                  {verificationLocked ? (
                    <div style={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '1.25rem'
                    }}>
                      <p style={{ color: '#374151', fontSize: '0.875rem' }}>
                        {verificationStatus === "approved"
                          ? "You're verified. No further action needed."
                          : "Your documents are under review. We'll notify you once a decision has been made."}
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.25rem, 3vw, 1.5rem)' }}>
                      {/* Agent Name */}
                      <div>
                        <label style={fieldLabelStyle}>Full Name</label>
                        <input
                          type="text"
                          value={verificationForm.data.agent_name}
                          onChange={(e) => verificationForm.setData('agent_name', e.target.value)}
                          style={inputStyle}
                        />
                        {verificationForm.errors.agent_name && <p style={errorTextStyle}>{verificationForm.errors.agent_name}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label style={fieldLabelStyle}>Email Address</label>
                        <input
                          type="email"
                          value={verificationForm.data.email}
                          onChange={(e) => verificationForm.setData('email', e.target.value)}
                          style={inputStyle}
                        />
                        {verificationForm.errors.email && <p style={errorTextStyle}>{verificationForm.errors.email}</p>}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label style={fieldLabelStyle}>Phone Number</label>
                        <input
                          type="tel"
                          value={verificationForm.data.phone_number}
                          onChange={(e) => verificationForm.setData('phone_number', e.target.value)}
                          style={inputStyle}
                        />
                        {verificationForm.errors.phone_number && <p style={errorTextStyle}>{verificationForm.errors.phone_number}</p>}
                      </div>

                      {/* Resubmission Note - shown only when rejected */}
                      {verificationStatus === "rejected" && (
                        <div>
                          <label style={{
                            ...fieldLabelStyle,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <MessageSquare size={16} />
                            Response Note (optional)
                          </label>
                          <textarea
                            value={verificationForm.data.resubmission_note}
                            onChange={(e) => verificationForm.setData('resubmission_note', e.target.value)}
                            placeholder="Add a note addressing the rejection reason or explaining your resubmission..."
                            rows={3}
                            style={{
                              ...inputStyle,
                              resize: 'vertical',
                              fontFamily: 'inherit',
                              borderColor: '#d1d5db'
                            }}
                          />
                          {verificationForm.errors.resubmission_note && (
                            <p style={errorTextStyle}>{verificationForm.errors.resubmission_note}</p>
                          )}
                          <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                            This note will be visible to the reviewer when they process your new submission
                          </p>
                        </div>
                      )}

                      {/* Government ID */}
                      <div>
                        <label style={fieldLabelStyle}>Government ID (required)</label>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          border: '1px dashed #d1d5db',
                          borderRadius: '0.375rem',
                          padding: 'clamp(0.75rem, 2vw, 1rem)',
                          cursor: 'pointer',
                          color: '#374151',
                          fontSize: '0.875rem'
                        }}>
                          <Upload size={16} />
                          {verificationForm.data.gov_id?.name || (verification?.gov_id ? "Replace uploaded ID" : "Upload a government-issued ID")}
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => verificationForm.setData('gov_id', e.target.files[0])}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {verificationForm.errors.gov_id && <p style={errorTextStyle}>{verificationForm.errors.gov_id}</p>}
                      </div>

                      {/* License Documents */}
                      <div>
                        <label style={fieldLabelStyle}>License Documents (optional)</label>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          border: '1px dashed #d1d5db',
                          borderRadius: '0.375rem',
                          padding: 'clamp(0.75rem, 2vw, 1rem)',
                          cursor: 'pointer',
                          color: '#374151',
                          fontSize: '0.875rem'
                        }}>
                          <FileText size={16} />
                          {verificationForm.data.license_documents?.name || (verification?.license_documents ? "Replace uploaded document" : "Upload a license document")}
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => verificationForm.setData('license_documents', e.target.files[0])}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {verificationForm.errors.license_documents && <p style={errorTextStyle}>{verificationForm.errors.license_documents}</p>}
                      </div>

                      {/* Proof of Address */}
                      <div>
                        <label style={fieldLabelStyle}>Proof of Address (optional)</label>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          border: '1px dashed #d1d5db',
                          borderRadius: '0.375rem',
                          padding: 'clamp(0.75rem, 2vw, 1rem)',
                          cursor: 'pointer',
                          color: '#374151',
                          fontSize: '0.875rem'
                        }}>
                          <FileText size={16} />
                          {verificationForm.data.proof_of_address?.name || (verification?.proof_of_address ? "Replace uploaded document" : "Upload proof of address")}
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => verificationForm.setData('proof_of_address', e.target.files[0])}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {verificationForm.errors.proof_of_address && <p style={errorTextStyle}>{verificationForm.errors.proof_of_address}</p>}
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={handleSubmitVerification}
                        disabled={verificationForm.processing}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                          backgroundColor: verificationForm.processing ? '#9ca3af' : '#0f766e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontWeight: '500',
                          cursor: verificationForm.processing ? 'not-allowed' : 'pointer',
                          fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                          width: '100%'
                        }}
                      >
                        <Shield size={16} />
                        {verificationForm.processing ? "Submitting..." : verificationStatus === "rejected" ? "Resubmit for Review" : "Submit for Verification"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "security" && (
                <div>
                  <h2 style={{
                    fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Security Settings
                  </h2>
                  <p style={{ fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: '#6b7280', marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
                    Manage your password and security preferences
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.25rem, 3vw, 1.5rem)' }}>
                    {/* Current Password */}
                    <div>
                      <label style={fieldLabelStyle}>
                        Current Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={securityData.currentPassword}
                          onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                          style={{ ...inputStyle, paddingRight: '2.5rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '0.5rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {securityErrors.currentPassword && (
                        <p style={errorTextStyle}>
                          {securityErrors.currentPassword}
                        </p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label style={fieldLabelStyle}>
                        New Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={securityData.newPassword}
                          onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                          style={{ ...inputStyle, paddingRight: '2.5rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          style={{
                            position: 'absolute',
                            right: '0.5rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {securityErrors.newPassword && (
                        <p style={errorTextStyle}>
                          {securityErrors.newPassword}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label style={fieldLabelStyle}>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={handleSaveSecurity}
                      disabled={isSaving}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                        backgroundColor: isSaving ? '#9ca3af' : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontWeight: '500',
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                        width: '100%'
                      }}
                    >
                      <Save size={16} />
                      {isSaving ? "Saving..." : "Update Security"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>

      <style>{`
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-weight: 600;
        }
            
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

        /* Desktop: 2-column grid */
        @media (min-width: 769px) {
          .settings-grid {
            grid-template-columns: 250px 1fr;
          }
          
          .sidebar-nav {
            flex-direction: column !important;
          }
          
          .sidebar-nav button {
            justify-content: flex-start !important;
          }
          
          .toast-notification {
            left: auto !important;
            margin-left: auto;
            margin-right: 1rem;
          }
        }

        /* Mobile: Single column, horizontal tabs */
        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
          
          .sidebar-nav {
            flex-direction: row !important;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          
          .sidebar-nav button {
            flex-shrink: 0;
            min-width: fit-content;
          }
          
          .tab-label {
            font-size: 0.8125rem;
          }
        }

        /* Extra small mobile devices */
        @media (max-width: 480px) {
          .settings-container {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          
          .sidebar-nav {
            padding: 0.375rem;
          }
          
          .sidebar-nav button {
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
          }
          
          .sidebar-nav button svg {
            width: 16px;
            height: 16px;
          }
        }

        /* Landscape mobile orientation */
        @media (max-height: 600px) and (orientation: landscape) {
          .settings-container {
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
          }
        }

        /* Prevent zoom on input focus for iOS */
        @media (max-width: 768px) {
          input[type="text"],
          input[type="email"],
          input[type="tel"],
          input[type="number"],
          input[type="password"],
          textarea,
          select {
            font-size: 16px !important;
          }
        }
      `}</style>
    </>
  );
};

export default AdminSettingsPage;