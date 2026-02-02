import { useState } from "react";
import { Shield, Bell, Lock, User, Mail, Globe, Save, Eye, EyeOff, Check } from "lucide-react";
import Header from "../../Components/Layouts/Header";
import Footer from "../../Components/Layouts/Footer";
import { usePage, useForm } from "@inertiajs/react";

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const { auth } = usePage().props;

  const userAgent = !!auth?.agent;
  const userAdmin = !!auth?.super;

  // console.log("Auth Data:", userAgent, userAdmin);

  const userFullName = auth?.agent?.fullName || auth?.super?.fullName || "";
  const userEmail = auth?.agent?.email || auth?.super?.email || "";
  const userphone = auth?.agent?.phone || auth?.super?.phone || "";
  const userbio = auth?.agent?.bio || auth?.super?.bio || "";
  const userCompany = auth?.agent?.company || auth?.super?.company || "";
  const userType = auth?.agent?.type || auth?.super?.type || "";
  const userFee = auth?.agent?.fee || auth?.super?.fee || "";
  const userStatus = auth?.agent?.status || auth?.super?.status || "";

  // Separate forms for agent and admin
  const agentForm = useForm({
    name: userFullName,
    email: userEmail,
    phone: userphone,
    bio: userbio,
    company: userCompany,
    fee: userFee,
    role: userType,
  });

  const adminForm = useForm({
    name: userFullName,
    email: userEmail,
    phone: userphone,
    bio: userbio,
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
    setTimeout(() => {
      console.log("Security settings saved:", securityData);
      showToast("Security updated", "Your security settings have been saved successfully");
      setSecurityData({ ...securityData, currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsSaving(false);
    }, 1000);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
  ];

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

      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <Header />

        {/* Main Content */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1.5rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '250px 1fr',
            gap: '2rem'
          }}>
            {/* Sidebar Navigation */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '1rem',
              height: 'fit-content',
              border: '1px solid #e5e7eb'
            }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      backgroundColor: activeTab === tab.id ? '#eff6ff' : 'transparent',
                      color: activeTab === tab.id ? '#1e40af' : '#6b7280',
                      fontWeight: activeTab === tab.id ? '500' : '400',
                      cursor: 'pointer',
                      marginBottom: '0.25rem',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              border: '1px solid #e5e7eb'
            }}>
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Profile Information
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '2rem' }}>
                    Update your personal information and public profile
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Avatar */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.5rem'
                      }}>
                        Profile Picture
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          backgroundColor: '#0f766e',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          fontWeight: '600'
                        }}>
                          {data.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                      </div>
                    </div>

                    {/* Name */}
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
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          outline: 'none'
                        }}
                      />
                      {errors.name && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.5rem'
                      }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          outline: 'none'
                        }}
                      />
                      {errors.email && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</p>}
                    </div>

                    {!userAdmin && (
                      <>
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                          }}>
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              outline: 'none'
                            }}
                          />
                          {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.phone}</p>}
                        </div>

                        {/* Role */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                          }}>
                            Role
                          </label>
                          <input
                            type="text"
                            value={data.role}
                            disabled
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              backgroundColor: '#f9fafb',
                              color: '#6b7280',
                              cursor: 'not-allowed'
                            }}
                          />
                        </div>

                        {/* Status */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                          }}>
                            Status
                          </label>
                          <input
                            type="text"
                            value={userStatus}
                            disabled
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              backgroundColor: '#f9fafb',
                              color: '#6b7280',
                              cursor: 'not-allowed'
                            }}
                          />
                        </div>

                        {/* Company */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                          }}>
                            Company
                          </label>
                          <input
                            type="text"
                            value={data.company}
                            onChange={(e) => setData('company', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              outline: 'none'
                            }}
                          />
                          {errors.company && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.company}</p>}
                        </div>

                        {/* Fee */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                          }}>
                            Fee
                          </label>
                          <input
                            type="number"
                            value={data.fee}
                            onChange={(e) => setData('fee', e.target.value)}
                            min="0"
                            step="0.01"
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              outline: 'none'
                            }}
                          />
                          {errors.fee && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.fee}</p>}
                        </div>

                        {/* Bio */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                          }}>
                            Bio
                          </label>
                          <textarea
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              outline: 'none',
                              resize: 'vertical',
                              fontFamily: 'inherit'
                            }}
                          />
                          {errors.bio && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.bio}</p>}
                        </div>
                      </>
                    )}

                    {!userAdmin && (
                      <>
                        {/* Phone Number for Admin */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                          }}>
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              outline: 'none'
                            }}
                          />
                          {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.phone}</p>}
                        </div>

                        {/* Bio for Admin */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                          }}>
                            Bio
                          </label>
                          <textarea
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              outline: 'none',
                              resize: 'vertical',
                              fontFamily: 'inherit'
                            }}
                          />
                          {errors.bio && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.bio}</p>}
                        </div>
                      </>
                    )}

                    {/* Save Button */}
                    <button
                      onClick={userAgent ? handleSaveAgentProfile : handleSaveAdminProfile}
                      disabled={processing}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.625rem 1.5rem',
                        backgroundColor: processing ? '#9ca3af' : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontWeight: '500',
                        cursor: processing ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        alignSelf: 'flex-start'
                      }}
                    >
                      <Save size={16} />
                      {processing ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Security Settings
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '2rem' }}>
                    Manage your password and security preferences
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Current Password */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.5rem'
                      }}>
                        Current Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={securityData.currentPassword}
                          onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.5rem 2.5rem 0.5rem 0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            outline: 'none'
                          }}
                        />
                        <button
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
                            padding: '0.25rem'
                          }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.5rem'
                      }}>
                        New Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={securityData.newPassword}
                          onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.5rem 2.5rem 0.5rem 0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            outline: 'none'
                          }}
                        />
                        <button
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
                            padding: '0.25rem'
                          }}
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.5rem'
                      }}>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          outline: 'none'
                        }}
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
                        padding: '0.625rem 1.5rem',
                        backgroundColor: isSaving ? '#9ca3af' : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontWeight: '500',
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        alignSelf: 'flex-start'
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
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

        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
};

export default AdminSettingsPage;