import { useState } from "react";
import { Shield, Bell, Lock, User, Mail, Globe, Save, Eye, EyeOff, Check, Clock, XCircle, CheckCircle2, MessageSquare, AlertTriangle, Trash2, ShieldCheck, ArrowRight } from "lucide-react";
import Header from "../../Components/Layouts/Header";
import Footer from "../../Components/Layouts/Footer";
import { usePage, useForm, router, Head } from "@inertiajs/react";
// Adjust this path to wherever AgentIdentityVerificationModal actually lives in your project.
import AgentIdentityVerificationModal from "../../Components/Modules/AgentIdentityVerificationModal";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [securityErrors, setSecurityErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const { auth, userRole: accountRole, canAccessVerification, verification } = usePage().props;

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

  const verificationStatus = verification?.status || null;
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

  const handleVerified = () => {
    setShowVerificationModal(false);
    showToast("Identity verified", "Your Ghana Card and biometric details have been confirmed.");
    router.reload({ only: ["verification"] });
  };

  const deleteForm = useForm({
    password: "",
  });

  const handleDeleteAccount = () => {
    if (!deleteForm.data.password) {
      showToast("Error", "Please enter your password to confirm", "error");
      return;
    }

    if (!window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone — all your listings, inquiries, and data will be removed.")) {
      return;
    }

    router.post('/settings/account', {
      _method: 'DELETE',
      password: deleteForm.data.password,
    }, {
      onSuccess: () => {
        showToast("Account deleted", "Your account has been removed.");
      },
      onError: () => {
        showToast("Error", "Failed to delete account. Please check your password.", "error");
      },
    });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    ...(userAgent ? [{ id: "verification", label: "Verification", icon: Shield }] : []),
    { id: "security", label: "Security", icon: Lock },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
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

              {/* Verification Tab (agents only) — Ghana Card + biometric flow */}
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
                    Confirm your identity with your Ghana Card and a live biometric check to get verified on RentTrustGH
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
                  {verificationStatus === "rejected" && verification?.rejection_reason && (
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
                      <p style={{ color: '#991b1b', fontSize: '0.8125rem' }}>{verification.rejection_reason}</p>
                    </div>
                  )}

                  {/* Reviewed metadata */}
                  {verification?.reviewed_at && (
                    <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '1.5rem' }}>
                      Reviewed on {new Date(verification.reviewed_at).toLocaleDateString()}
                      {verification.reviewed_by_name ? ` by ${verification.reviewed_by_name}` : ""}
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
                          : "Your identity check is under review. We'll notify you once a decision has been made."}
                      </p>
                    </div>
                  ) : (
                    <div style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                      backgroundColor: '#f0fdfa',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '1rem'
                    }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '0.75rem',
                        background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <ShieldCheck size={22} color="white" />
                      </div>

                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.375rem' }}>
                          {verificationStatus === "rejected" ? "Retry identity verification" : "Verify with your Ghana Card"}
                        </h3>
                        <p style={{ fontSize: '0.8125rem', color: '#374151', lineHeight: 1.6, marginBottom: '0.25rem' }}>
                          We'll ask for your Ghana Card number and PIN, then take a quick live selfie to confirm
                          your identity against the National Identification Authority (NIA). It takes about two minutes.
                        </p>
                      </div>

                      <button
                        onClick={() => setShowVerificationModal(true)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1.25rem, 3vw, 1.5rem)',
                          background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
                        }}
                      >
                        <Shield size={16} />
                        {verificationStatus === "rejected" ? "Retry Verification" : "Start Verification"}
                        <ArrowRight size={16} />
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

              {activeTab === "danger" && (
              <div>
                <h2 style={{
                  fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  Danger Zone
                </h2>
                <p style={{ fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)', color: '#6b7280', marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
                  Irreversible actions. Proceed with caution.
                </p>
              
                <div style={{
                  border: '1px solid #fecaca',
                  borderRadius: '0.5rem',
                  padding: 'clamp(1rem, 3vw, 1.5rem)',
                  backgroundColor: '#fef2f2'
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#991b1b', marginBottom: '0.5rem' }}>
                    Delete Account
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#991b1b', marginBottom: '1.25rem' }}>
                    Once you delete your account, there is no going back. All your listings, inquiries, reviews, and personal data will be permanently removed.
                  </p>
              
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={fieldLabelStyle}>Enter your password to confirm</label>
                    <input
                      type="password"
                      value={deleteForm.data.password}
                      onChange={(e) => deleteForm.setData('password', e.target.value)}
                      style={inputStyle}
                      placeholder="••••••••"
                    />
                    {deleteForm.errors.password && <p style={errorTextStyle}>{deleteForm.errors.password}</p>}
                  </div>
              
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteForm.processing}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                      backgroundColor: deleteForm.processing ? '#9ca3af' : '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontWeight: '500',
                      cursor: deleteForm.processing ? 'not-allowed' : 'pointer',
                      fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                      width: '100%'
                    }}
                  >
                    <Trash2 size={16} />
                    {deleteForm.processing ? "Deleting..." : "Delete My Account"}
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
        <Footer />
      </div>

      <AgentIdentityVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        agentData={{ name: verification?.agent_name || userFullName }}
        onVerified={handleVerified}
      />

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

export default SettingsPage;