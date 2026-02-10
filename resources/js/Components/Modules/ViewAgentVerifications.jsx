import { useState, useEffect } from "react";
import { useForm, router } from '@inertiajs/react';

// Icons
const ShieldCheck = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const DocumentCheck = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Clock = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l5.5-5.5M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
  </svg>
);

const Download = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
  </svg>
);

const ChevronDown = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

const MapPin = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ViewAgentVerifications = ({ verifications = [] }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [adminNotes, setAdminNotes] = useState({});
  const [toast, setToast] = useState(null);
  const [rejectionReason, setRejectionReason] = useState({});

  const showToast = (title, message, type = "success") => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (verificationId) => {
    if (confirm("Are you sure you want to approve this verification request?")) {
      router.patch(`/api/verification-requests/${verificationId}/status`, {
        status: "approved",
        admin_notes: adminNotes[verificationId] || ""
      }, {
        onSuccess: () => {
          showToast("Approved", "Verification request has been approved", "success");
          setAdminNotes(prev => ({ ...prev, [verificationId]: "" }));
        },
        onError: () => {
          showToast("Error", "Failed to approve verification request", "error");
        }
      });
    }
  };

  const handleReject = (verificationId) => {
    if (!rejectionReason[verificationId]?.trim()) {
      showToast("Required", "Please provide a rejection reason", "warning");
      return;
    }
    
    if (confirm("Are you sure you want to reject this verification request?")) {
      router.patch(`/api/verification-requests/${verificationId}/status`, {
        status: "rejected",
        rejection_reason: rejectionReason[verificationId],
        admin_notes: adminNotes[verificationId] || ""
      }, {
        onSuccess: () => {
          showToast("Rejected", "Verification request has been rejected", "success");
          setRejectionReason(prev => ({ ...prev, [verificationId]: "" }));
          setAdminNotes(prev => ({ ...prev, [verificationId]: "" }));
        },
        onError: () => {
          showToast("Error", "Failed to reject verification request", "error");
        }
      });
    }
  };

  const getStatusBadge = (status) => {
    const baseStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.375rem 0.75rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      borderRadius: '9999px',
      gap: '0.375rem'
    };

    if (status === "approved") {
      return (
        <span style={{ ...baseStyle, backgroundColor: 'hsl(152 60% 40%)', color: 'white' }}>
          <CheckCircle style={{ height: '0.875rem', width: '0.875rem' }} />
          Approved
        </span>
      );
    } else if (status === "pending") {
      return (
        <span style={{ ...baseStyle, backgroundColor: 'hsl(40 30% 94%)', color: 'hsl(200 25% 15%)', border: '1px solid hsl(40 20% 88%)' }}>
          <Clock style={{ height: '0.875rem', width: '0.875rem' }} />
          Pending
        </span>
      );
    } else if (status === "rejected") {
      return (
        <span style={{ ...baseStyle, backgroundColor: 'hsl(0 70% 50%)', color: 'white' }}>
          <XCircle style={{ height: '0.875rem', width: '0.875rem' }} />
          Rejected
        </span>
      );
    }
  };

  const filteredVerifications = filterStatus === "all" 
    ? verifications 
    : verifications.filter(v => v.status === filterStatus);

  const DocumentSection = ({ title, documents }) => {
    if (!documents || documents.length === 0) {
      return (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
            {title}
          </p>
          <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', fontStyle: 'italic' }}>
            No documents provided
          </p>
        </div>
      );
    }

    return (
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
          {title}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {documents.map((doc, idx) => (
            <a
              key={idx}
              href={doc.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                backgroundColor: 'hsl(40 30% 97%)',
                borderRadius: '0.375rem',
                border: '1px solid hsl(40 20% 88%)',
                textDecoration: 'none',
                color: 'hsl(174 62% 32%)',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 97%)'}
            >
              <Download style={{ height: '0.875rem', width: '0.875rem' }} />
              {doc.original_name || `Document ${idx + 1}`}
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <style>{`
        @keyframes slideIn {
          from {
            max-height: 0;
            opacity: 0;
          }
          to {
            max-height: 1000px;
            opacity: 1;
          }
        }
        .verification-details {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          backgroundColor: toast.type === 'success' ? 'hsl(152 60% 40%)' : 
                           toast.type === 'error' ? 'hsl(0 70% 50%)' : 'hsl(40 80% 50%)',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '0.5rem',
          zIndex: 50,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          fontWeight: '500'
        }}>
          <p style={{ margin: 0, fontWeight: '600', marginBottom: '0.25rem' }}>{toast.title}</p>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>{toast.message}</p>
        </div>
      )}

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'pending', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid hsl(200 15% 85%)',
              borderRadius: '0.375rem',
              backgroundColor: filterStatus === status ? 'hsl(174 62% 32%)' : 'white',
              color: filterStatus === status ? 'white' : 'hsl(200 25% 15%)',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (filterStatus !== status) {
                e.currentTarget.style.backgroundColor = 'hsl(200 15% 95%)';
              }
            }}
            onMouseLeave={(e) => {
              if (filterStatus !== status) {
                e.currentTarget.style.backgroundColor = 'white';
              }
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Verification Cards */}
      {filteredVerifications.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          backgroundColor: 'hsl(40 30% 97%)',
          borderRadius: '0.5rem',
          border: '1px dashed hsl(40 20% 88%)'
        }}>
          <ShieldCheck style={{ height: '3rem', width: '3rem', color: 'hsl(200 15% 45%)', margin: '0 auto 1rem' }} />
          <p style={{ fontSize: '1rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
            No verifications found
          </p>
          <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
            {filterStatus === 'all' ? 'No agent verification requests yet' : `No ${filterStatus} verification requests`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredVerifications.map((verification) => (
            <div
              key={verification.id}
              style={{
                backgroundColor: 'white',
                border: '1px solid hsl(200 15% 90%)',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              {/* Header */}
              <div
                style={{
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'hsl(40 30% 98%)',
                  borderBottom: '1px solid hsl(200 15% 90%)',
                  cursor: 'pointer'
                }}
                onClick={() => setExpandedId(expandedId === verification.id ? null : verification.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    backgroundColor: 'hsl(174 62% 32% / 0.1)',
                    color: 'hsl(174 62% 32%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <ShieldCheck style={{ height: '1.5rem', width: '1.5rem' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.25rem' }}>
                      {verification.agent_name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                      Property: {verification.rental?.title || 'Unknown'}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {getStatusBadge(verification.status)}
                  <ChevronDown
                    style={{
                      height: '1.25rem',
                      width: '1.25rem',
                      color: 'hsl(200 15% 45%)',
                      transform: expandedId === verification.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  />
                </div>
              </div>

              {/* Summary Info */}
              <div style={{ padding: '1rem', borderBottom: '1px solid hsl(200 15% 90%)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>
                      Request Type
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)', fontWeight: '500' }}>
                      {verification.request_type === 'initial_verification' ? 'Initial Verification' : 'Re-Verification'}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>
                      Submitted
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)', fontWeight: '500' }}>
                      {new Date(verification.submitted_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>
                      Location
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin style={{ height: '0.875rem', width: '0.875rem' }} />
                      {verification.rental?.city}, {verification.rental?.area}
                    </p>
                  </div>
                </div>
              </div>

              {/* Expandable Details */}
              {expandedId === verification.id && (
                <div className="verification-details" style={{ padding: '1rem', borderTop: '1px solid hsl(200 15% 90%)' }}>
                  {/* Additional Notes */}
                  {verification.additional_notes && (
                    <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid hsl(200 15% 90%)' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
                        Agent's Additional Notes
                      </p>
                      <div style={{
                        backgroundColor: 'hsl(40 30% 97%)',
                        padding: '0.75rem',
                        borderRadius: '0.375rem',
                        borderLeft: '3px solid hsl(40 80% 50%)',
                        fontSize: '0.875rem',
                        color: 'hsl(200 25% 15%)',
                        lineHeight: '1.5'
                      }}>
                        {verification.additional_notes}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid hsl(200 15% 90%)' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '1rem' }}>
                      Uploaded Documents
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                      <DocumentSection 
                        title="Proof Documents" 
                        documents={Array.isArray(verification.proof_documents) ? verification.proof_documents : JSON.parse(verification.proof_documents || '[]')}
                      />
                      <DocumentSection 
                        title="Ownership Documents" 
                        documents={Array.isArray(verification.ownership_documents) ? verification.ownership_documents : JSON.parse(verification.ownership_documents || '[]')}
                      />
                      <DocumentSection 
                        title="Utility Bills" 
                        documents={Array.isArray(verification.utility_bills) ? verification.utility_bills : JSON.parse(verification.utility_bills || '[]')}
                      />
                    </div>
                  </div>

                  {/* Admin Review Section */}
                  {verification.status === 'pending' && (
                    <div style={{ backgroundColor: 'hsl(174 62% 32% / 0.05)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid hsl(174 62% 32% / 0.2)' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(174 62% 32%)', marginBottom: '1rem' }}>
                        Admin Review
                      </p>

                      {/* Admin Notes */}
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
                          Admin Notes (optional)
                        </label>
                        <textarea
                          value={adminNotes[verification.id] || ''}
                          onChange={(e) => setAdminNotes(prev => ({ ...prev, [verification.id]: e.target.value }))}
                          placeholder="Add notes about this verification..."
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid hsl(200 15% 85%)',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontFamily: 'inherit',
                            minHeight: '80px',
                            resize: 'vertical',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      {/* Rejection Reason */}
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
                          Rejection Reason (if rejecting)
                        </label>
                        <textarea
                          value={rejectionReason[verification.id] || ''}
                          onChange={(e) => setRejectionReason(prev => ({ ...prev, [verification.id]: e.target.value }))}
                          placeholder="Provide reason for rejection..."
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid hsl(200 15% 85%)',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontFamily: 'inherit',
                            minHeight: '80px',
                            resize: 'vertical',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleApprove(verification.id)}
                          style={{
                            padding: '0.625rem 1.25rem',
                            backgroundColor: 'hsl(152 60% 40%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(152 60% 35%)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(152 60% 40%)'}
                        >
                          <CheckCircle style={{ height: '1rem', width: '1rem' }} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(verification.id)}
                          style={{
                            padding: '0.625rem 1.25rem',
                            backgroundColor: 'hsl(0 70% 50%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(0 70% 45%)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(0 70% 50%)'}
                        >
                          <XCircle style={{ height: '1rem', width: '1rem' }} />
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Review History */}
                  {verification.reviewed_at && (
                    <div style={{ backgroundColor: 'hsl(152 60% 40% / 0.05)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid hsl(152 60% 40% / 0.2)' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(152 60% 40%)', marginBottom: '0.75rem' }}>
                        Review History
                      </p>
                      <div style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)', lineHeight: '1.6' }}>
                        <p style={{ marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: '600' }}>Reviewed:</span> {new Date(verification.reviewed_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {verification.admin_notes && (
                          <div style={{ backgroundColor: 'hsl(40 30% 97%)', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '0.5rem' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>
                              Admin Notes
                            </p>
                            <p style={{ margin: 0 }}>{verification.admin_notes}</p>
                          </div>
                        )}
                        {verification.rejection_reason && (
                          <div style={{ backgroundColor: 'hsl(0 70% 50% / 0.1)', padding: '0.75rem', borderRadius: '0.375rem' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(0 70% 50%)', marginBottom: '0.25rem' }}>
                              Rejection Reason
                            </p>
                            <p style={{ margin: 0, color: 'hsl(200 25% 15%)' }}>{verification.rejection_reason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAgentVerifications;
