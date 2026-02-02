import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { Link, useForm } from "@inertiajs/react";

const ResetPasswordPage = ({ token, email, userType }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    token: token,
    email: email,
    userType: userType,
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    post("/reset-password", {
      onSuccess: () => {
        setResetSuccess(true);
      },
      onError: (errors) => {
        console.error("Error:", errors);
      },
    });
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 1, label: "Weak", color: "#fc8181" },
      { strength: 2, label: "Fair", color: "#f6ad55" },
      { strength: 3, label: "Good", color: "#68d391" },
      { strength: 4, label: "Strong", color: "#48bb78" },
      { strength: 5, label: "Very Strong", color: "#38a169" },
    ];

    return levels.find((l) => l.strength === strength) || levels[0];
  };

  const passwordStrength = getPasswordStrength(data.password);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "400px",
          height: "400px",
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "50%",
          filter: "blur(100px)",
          animation: "float 10s ease-in-out infinite reverse",
        }}
      />

      {/* Main Card */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          borderRadius: "24px",
          padding: "3rem",
          maxWidth: "480px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          position: "relative",
          zIndex: 1,
          backdropFilter: "blur(10px)",
        }}
      >
        {!resetSuccess ? (
          <>
            {/* Header */}
            <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
                }}
              >
                <Lock size={36} color="white" />
              </div>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  color: "#1a202c",
                  marginBottom: "0.5rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Reset Password
              </h1>
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "#718096",
                  lineHeight: "1.6",
                }}
              >
                Create a new password for your account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Email Display */}
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "#edf2f7",
                  borderRadius: "12px",
                  marginBottom: "1.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#4a5568",
                    margin: 0,
                  }}
                >
                  Resetting password for:{" "}
                  <strong style={{ color: "#2d3748" }}>{email}</strong>
                </p>
              </div>

              {/* Password Input */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="password"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#2d3748",
                    marginBottom: "0.5rem",
                  }}
                >
                  New Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={18}
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#a0aec0",
                    }}
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder="Enter new password"
                    required
                    style={{
                      width: "100%",
                      padding: "0.875rem 3rem 0.875rem 3rem",
                      border: errors.password
                        ? "2px solid #fc8181"
                        : "2px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "0.9375rem",
                      outline: "none",
                      transition: "all 0.2s",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => {
                      if (!errors.password) {
                        e.target.style.borderColor = "#667eea";
                        e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.password) {
                        e.target.style.borderColor = "#e2e8f0";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#a0aec0",
                      padding: "0.25rem",
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {data.password && (
                  <div style={{ marginTop: "0.75rem" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.25rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          style={{
                            flex: 1,
                            height: "4px",
                            backgroundColor:
                              level <= passwordStrength.strength
                                ? passwordStrength.color
                                : "#e2e8f0",
                            borderRadius: "2px",
                            transition: "all 0.3s",
                          }}
                        />
                      ))}
                    </div>
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: passwordStrength.color,
                        fontWeight: "500",
                        margin: 0,
                      }}
                    >
                      {passwordStrength.label}
                    </p>
                  </div>
                )}

                {errors.password && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                      color: "#e53e3e",
                      fontSize: "0.8125rem",
                    }}
                  >
                    <AlertCircle size={14} />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="password_confirmation"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#2d3748",
                    marginBottom: "0.5rem",
                  }}
                >
                  Confirm Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={18}
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#a0aec0",
                    }}
                  />
                  <input
                    id="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    value={data.password_confirmation}
                    onChange={(e) =>
                      setData("password_confirmation", e.target.value)
                    }
                    placeholder="Re-enter new password"
                    required
                    style={{
                      width: "100%",
                      padding: "0.875rem 3rem 0.875rem 3rem",
                      border: errors.password_confirmation
                        ? "2px solid #fc8181"
                        : "2px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "0.9375rem",
                      outline: "none",
                      transition: "all 0.2s",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => {
                      if (!errors.password_confirmation) {
                        e.target.style.borderColor = "#667eea";
                        e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.password_confirmation) {
                        e.target.style.borderColor = "#e2e8f0";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#a0aec0",
                      padding: "0.25rem",
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                      color: "#e53e3e",
                      fontSize: "0.8125rem",
                    }}
                  >
                    <AlertCircle size={14} />
                    {errors.password_confirmation}
                  </div>
                )}
              </div>

              {/* Password Requirements */}
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "#f7fafc",
                  borderRadius: "12px",
                  marginBottom: "1.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: "600",
                    color: "#2d3748",
                    marginBottom: "0.5rem",
                  }}
                >
                  Password must contain:
                </p>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "1.25rem",
                    fontSize: "0.8125rem",
                    color: "#4a5568",
                    lineHeight: "1.8",
                  }}
                >
                  <li>At least 8 characters</li>
                  <li>Both uppercase and lowercase letters</li>
                  <li>At least one number</li>
                  <li>At least one special character</li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: processing
                    ? "#a0aec0"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: processing ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: processing
                    ? "none"
                    : "0 4px 12px rgba(102, 126, 234, 0.4)",
                }}
                onMouseEnter={(e) => {
                  if (!processing) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(102, 126, 234, 0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!processing) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(102, 126, 234, 0.4)";
                  }
                }}
              >
                {processing ? (
                  <>
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        border: "2px solid white",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 0.6s linear infinite",
                      }}
                    />
                    Resetting...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Reset Password
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Success State */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  boxShadow: "0 10px 30px rgba(72, 187, 120, 0.3)",
                  animation: "scaleIn 0.4s ease-out",
                }}
              >
                <CheckCircle size={40} color="white" />
              </div>
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "700",
                  color: "#1a202c",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Password Reset Successful!
              </h2>
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "#718096",
                  lineHeight: "1.6",
                  marginBottom: "2rem",
                }}
              >
                Your password has been successfully reset. You can now sign in
                with your new password.
              </p>

              <Link
                href="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "1rem 2rem",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontWeight: "600",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(102, 126, 234, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(102, 126, 234, 0.4)";
                }}
              >
                Sign In Now
              </Link>
            </div>
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordPage;