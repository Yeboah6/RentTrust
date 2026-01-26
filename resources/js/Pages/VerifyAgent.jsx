import { useState } from "react";
import { useForm } from '@inertiajs/react';

// Icon components (reused from original)
const ShieldCheck = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const UserCheck = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const XCircle = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DocumentText = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Calendar = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Star = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const VerifyAgentDialog = ({ agentItem, isOpen, onClose, onSubmit }) => {
  const [verificationStatus, setVerificationStatus] = useState('');
  // const [adminNotes, setAdminNotes] = useState('');
  // const [verificationLevel, setVerificationLevel] = useState('basic');
  const [expiryDate, setExpiryDate] = useState('');
  
  // const verificationLevels = [
  //   { value: 'basic', label: 'Basic Verification', description: 'Basic identity verification' },
  //   { value: 'premium', label: 'Premium Verified', description: 'Document verification completed' },
  //   { value: 'trusted', label: 'Trusted Partner', description: 'Verified + Excellent track record' },
  // ];

  const { data, setData, put, processing, errors, reset } = useForm({
    status: '',
    // level: '',
    // notes: '',
    // expiry_date: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/admin/agents/${agentItem.id}/verify`, {
      onSuccess: () => {
        
        reset();
        onClose();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .dialog-overlay {
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }

        .dialog-content {
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}
      </style>

      {/* Overlay */}
      <div
        className="dialog-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
        onClick={onClose}
      >
        {/* Dialog */}
        <div
          className="dialog-content"
          style={{
            width: '100%',
            maxWidth: '42rem',
            maxHeight: '90vh',
            overflowY: 'auto',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid hsl(40 20% 88%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    background: 'hsl(174 62% 32% / 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ShieldCheck style={{ height: '1.5rem', width: '1.5rem', color: 'hsl(174 62% 32%)' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'hsl(200 25% 15%)' }}>
                    Verify Agent Application
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginTop: '0.25rem' }}>
                    Review agent details and set verification status
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  border: 'none',
                  background: 'none',
                  color: 'hsl(200 15% 45%)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 20% 88% / 0.5)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <XCircle style={{ height: '1.5rem', width: '1.5rem' }} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '1.5rem' }}>
            {/* Agent Summary Card */}
            <div
              style={{
                backgroundColor: 'hsl(40 33% 98%)',
                border: '1px solid hsl(40 20% 88%)',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    background: 'hsl(200 25% 15% / 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    color: 'hsl(200 25% 15%)'
                  }}
                >
                  {agentItem.fullName?.charAt(0) || 'A'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: '600', color: 'hsl(200 25% 15%)' }}>
                    {agentItem.fullName || 'Agent Name'}
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                    <span>{agentItem.email || 'email@example.com'}</span>
                    <span>•</span>
                    <span>{agentItem.phone || '+233 XX XXX XXXX'}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                    Joined: {agentItem.created_at ? new Date(agentItem.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: agentItem.type === 'Landlord' ? 'hsl(30 80% 55%)' : 'hsl(220 70% 50%)' }}>
                    {agentItem.type || 'Agent'}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Verification Status */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                    Verification Status *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                    {[
                      { value: 'approved', label: 'Approve', color: 'hsl(152 60% 40%)' },
                      { value: 'rejected', label: 'Reject', color: 'hsl(0 72% 51%)' },
                      { value: 'pending', label: 'Request Info', color: 'hsl(30 80% 55%)' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setData('status', option.value)}
                        style={{
                          padding: '0.75rem',
                          border: `2px solid ${data.status === option.value ? option.color : 'hsl(40 20% 88%)'}`,
                          borderRadius: '0.75rem',
                          background: data.status === option.value ? `${option.color}0D` : 'transparent',
                          color: data.status === option.value ? option.color : 'hsl(200 25% 15%)',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        {data.status === option.value ? (
                          <UserCheck style={{ height: '1rem', width: '1rem' }} />
                        ) : null}
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {errors.status && (
                    <p style={{ fontSize: '0.875rem', color: 'hsl(0 72% 51%)', marginTop: '0.375rem' }}>
                      {errors.status}
                    </p>
                  )}
                </div>

                {/* Verification Level */}
                {/* <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                    Verification Level
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {verificationLevels.map((level) => (
                      <label
                        key={level.value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          border: `1px solid ${data.level === level.value ? 'hsl(174 62% 32%)' : 'hsl(40 20% 88%)'}`,
                          borderRadius: '0.75rem',
                          backgroundColor: data.level === level.value ? 'hsl(174 62% 32% / 0.05)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="radio"
                          name="verificationLevel"
                          value={level.value}
                          checked={data.level === level.value}
                          onChange={(e) => setData('level', e.target.value)}
                          style={{
                            accentColor: 'hsl(174 62% 32%)'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {level.value === 'trusted' && <Star style={{ height: '1rem', width: '1rem', color: 'hsl(45 100% 50%)' }} />}
                            <span style={{ fontWeight: '500', color: 'hsl(200 25% 15%)' }}>
                              {level.label}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginTop: '0.125rem' }}>
                            {level.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.level && (
                    <p style={{ fontSize: '0.875rem', color: 'hsl(0 72% 51%)', marginTop: '0.375rem' }}>
                      {errors.level}
                    </p>
                  )}
                </div> */}

                {/* Expiry Date */}
                {/* <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                    Verification Expiry Date
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Calendar style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: '1.25rem',
                      width: '1.25rem',
                      color: 'hsl(200 15% 45%)'
                    }} />
                    <input
                      type="date"
                      value={data.expiry_date}
                      onChange={(e) => setData('expiry_date', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.75rem',
                        border: `1px solid ${errors.expiry_date ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        outline: 'none',
                        color: 'hsl(200 25% 15%)'
                      }}
                    />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginTop: '0.375rem' }}>
                    Leave empty for permanent verification
                  </p>
                </div> */}

                {/* Admin Notes */}
                {/* <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                    Admin Notes
                  </label>
                  <div style={{ position: 'relative' }}>
                    <DocumentText style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '0.75rem',
                      height: '1.25rem',
                      width: '1.25rem',
                      color: 'hsl(200 15% 45%)'
                    }} />
                    <textarea
                      placeholder="Add internal notes or feedback for the agent..."
                      rows={4}
                      value={data.notes}
                      onChange={(e) => setData('notes', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.75rem',
                        border: `1px solid ${errors.notes ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)'}`,
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        outline: 'none',
                        color: 'hsl(200 25% 15%)',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginTop: '0.375rem' }}>
                    These notes are for internal use only and won't be visible to the agent
                  </p>
                </div> */}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.75rem',
                      background: 'transparent',
                      color: 'hsl(200 25% 15%)',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 20% 88% / 0.5)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing || !data.status}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: 'none',
                      borderRadius: '0.75rem',
                      background: processing || !data.status
                        ? 'hsl(174 62% 32% / 0.5)'
                        : 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                      color: 'white',
                      fontWeight: '500',
                      cursor: processing || !data.status ? 'not-allowed' : 'pointer',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => !processing && data.status && (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={(e) => !processing && data.status && (e.currentTarget.style.opacity = '1')}
                  >
                    {processing ? "Processing..." : "Submit Verification"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyAgentDialog;