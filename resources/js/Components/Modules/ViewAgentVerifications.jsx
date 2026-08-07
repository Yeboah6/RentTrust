import { useState } from "react";
import { router } from '@inertiajs/react';

// Icons
const ShieldCheck = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Home = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const Clock = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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

// ---- Shared helpers ----

const parseDocuments = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'object') return [raw];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    // Plain string path, not JSON
    return [{ url: raw, original_name: raw.split('/').pop() }];
  }
};

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const StatusBadge = ({ status }) => {
  const baseStyle = {
    display: 'inline-flex', alignItems: 'center', padding: '0.375rem 0.75rem',
    fontSize: '0.75rem', fontWeight: '600', borderRadius: '9999px', gap: '0.375rem'
  };

  if (status === "approved") {
    return (
      <span style={{ ...baseStyle, backgroundColor: 'hsl(152 60% 40%)', color: 'white' }}>
        <CheckCircle style={{ height: '0.875rem', width: '0.875rem' }} /> Approved
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span style={{ ...baseStyle, backgroundColor: 'hsl(40 30% 94%)', color: 'hsl(200 25% 15%)', border: '1px solid hsl(40 20% 88%)' }}>
        <Clock style={{ height: '0.875rem', width: '0.875rem' }} /> Pending
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span style={{ ...baseStyle, backgroundColor: 'hsl(0 70% 50%)', color: 'white' }}>
        <XCircle style={{ height: '0.875rem', width: '0.875rem' }} /> Rejected
      </span>
    );
  }
  return null;
};

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
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem',
              backgroundColor: 'hsl(40 30% 97%)', borderRadius: '0.375rem',
              border: '1px solid hsl(40 20% 88%)', textDecoration: 'none',
              color: 'hsl(174 62% 32%)', fontSize: '0.875rem', fontWeight: '500',
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

const EmptyState = ({ icon: Icon, filterStatus, entityLabel }) => (
  <div style={{
    textAlign: 'center', padding: '3rem 1rem', backgroundColor: 'hsl(40 30% 97%)',
    borderRadius: '0.5rem', border: '1px dashed hsl(40 20% 88%)'
  }}>
    <Icon style={{ height: '3rem', width: '3rem', color: 'hsl(200 15% 45%)', margin: '0 auto 1rem' }} />
    <p style={{ fontSize: '1rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
      No {entityLabel} found
    </p>
    <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
      {filterStatus === 'all' ? `No ${entityLabel} yet` : `No ${filterStatus} ${entityLabel}`}
    </p>
  </div>
);

const FilterBar = ({ filterStatus, setFilterStatus }) => (
  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
    {['all', 'pending', 'approved', 'rejected'].map(status => (
      <button
        key={status}
        onClick={() => setFilterStatus(status)}
        style={{
          padding: '0.5rem 1rem', border: '1px solid hsl(200 15% 85%)', borderRadius: '0.375rem',
          backgroundColor: filterStatus === status ? 'hsl(174 62% 32%)' : 'white',
          color: filterStatus === status ? 'white' : 'hsl(200 25% 15%)',
          fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => { if (filterStatus !== status) e.currentTarget.style.backgroundColor = 'hsl(200 15% 95%)'; }}
        onMouseLeave={(e) => { if (filterStatus !== status) e.currentTarget.style.backgroundColor = 'white'; }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </button>
    ))}
  </div>
);

const ReviewSection = ({ item, onApprove, onReject, adminNotes, setAdminNotes, rejectionReason, setRejectionReason }) => (
  <>
    {item.status === 'pending' && (
      <div style={{ backgroundColor: 'hsl(174 62% 32% / 0.05)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid hsl(174 62% 32% / 0.2)' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(174 62% 32%)', marginBottom: '1rem' }}>
          Admin Review
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
            Admin Notes (optional)
          </label>
          <textarea
            value={adminNotes[item.id] || ''}
            onChange={(e) => setAdminNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
            placeholder="Add notes about this verification..."
            style={{
              width: '100%', padding: '0.75rem', border: '1px solid hsl(200 15% 85%)',
              borderRadius: '0.375rem', fontSize: '0.875rem', fontFamily: 'inherit',
              minHeight: '80px', resize: 'vertical', boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
            Rejection Reason (if rejecting)
          </label>
          <textarea
            value={rejectionReason[item.id] || ''}
            onChange={(e) => setRejectionReason(prev => ({ ...prev, [item.id]: e.target.value }))}
            placeholder="Provide reason for rejection..."
            style={{
              width: '100%', padding: '0.75rem', border: '1px solid hsl(200 15% 85%)',
              borderRadius: '0.375rem', fontSize: '0.875rem', fontFamily: 'inherit',
              minHeight: '80px', resize: 'vertical', boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onApprove(item.id)}
            style={{
              padding: '0.625rem 1.25rem', backgroundColor: 'hsl(152 60% 40%)', color: 'white',
              border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '600',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(152 60% 35%)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(152 60% 40%)'}
          >
            <CheckCircle style={{ height: '1rem', width: '1rem' }} /> Approve
          </button>
          <button
            onClick={() => onReject(item.id)}
            style={{
              padding: '0.625rem 1.25rem', backgroundColor: 'hsl(0 70% 50%)', color: 'white',
              border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '600',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(0 70% 45%)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(0 70% 50%)'}
          >
            <XCircle style={{ height: '1rem', width: '1rem' }} /> Reject
          </button>
        </div>
      </div>
    )}

    {item.reviewed_at && (
      <div style={{ backgroundColor: 'hsl(152 60% 40% / 0.05)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid hsl(152 60% 40% / 0.2)' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(152 60% 40%)', marginBottom: '0.75rem' }}>
          Review History
        </p>
        <div style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: '600' }}>Reviewed:</span> {formatDate(item.reviewed_at)}
            {item.reviewed_by ? ` by ${item.reviewed_by}` : ''}
          </p>
          {item.admin_notes && (
            <div style={{ backgroundColor: 'hsl(40 30% 97%)', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>
                Admin Notes
              </p>
              <p style={{ margin: 0 }}>{item.admin_notes}</p>
            </div>
          )}
        </div>
      </div>
    )}
  </>
);

// ---- Agent Verifications tab ----

const AgentVerificationsList = ({ items, showToast }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [adminNotes, setAdminNotes] = useState({});
  const [rejectionReason, setRejectionReason] = useState({});

  const handleApprove = (id) => {
    if (!confirm("Approve this agent verification request?")) return;
    router.patch(`/api/agent-verifications/${id}/status`, {
      status: "approved",
      admin_notes: adminNotes[id] || ""
    }, {
      onSuccess: () => {
        showToast("Approved", "Agent verification has been approved", "success");
        setAdminNotes(prev => ({ ...prev, [id]: "" }));
      },
      onError: () => showToast("Error", "Failed to approve request", "error"),
    });
  };

  const handleReject = (id) => {
    if (!rejectionReason[id]?.trim()) {
      showToast("Required", "Please provide a rejection reason", "warning");
      return;
    }
    if (!confirm("Reject this agent verification request?")) return;
    router.patch(`/api/agent-verifications/${id}/status`, {
      status: "rejected",
      rejection_reason: rejectionReason[id],
      admin_notes: adminNotes[id] || ""
    }, {
      onSuccess: () => {
        showToast("Rejected", "Agent verification has been rejected", "success");
        setRejectionReason(prev => ({ ...prev, [id]: "" }));
        setAdminNotes(prev => ({ ...prev, [id]: "" }));
      },
      onError: () => showToast("Error", "Failed to reject request", "error"),
    });
  };

  const filtered = filterStatus === "all" ? items : items.filter(v => v.status === filterStatus);

  return (
    <div>
      <FilterBar filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

      {filtered.length === 0 ? (
        <EmptyState icon={ShieldCheck} filterStatus={filterStatus} entityLabel="agent verifications" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{ backgroundColor: 'white', border: '1px solid hsl(200 15% 90%)', borderRadius: '0.5rem', overflow: 'hidden' }}
            >
              <div
                style={{
                  padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  backgroundColor: 'hsl(40 30% 98%)', borderBottom: '1px solid hsl(200 15% 90%)', cursor: 'pointer'
                }}
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{
                    width: '3rem', height: '3rem', borderRadius: '50%',
                    backgroundColor: 'hsl(174 62% 32% / 0.1)', color: 'hsl(174 62% 32%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <ShieldCheck style={{ height: '1.5rem', width: '1.5rem' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.25rem' }}>
                      {item.agent_name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                      {item.email}{item.phone_number ? ` · ${item.phone_number}` : ''}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <StatusBadge status={item.status} />
                  <ChevronDown style={{
                    height: '1.25rem', width: '1.25rem', color: 'hsl(200 15% 45%)',
                    transform: expandedId === item.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'
                  }} />
                </div>
              </div>

              <div style={{ padding: '1rem', borderBottom: '1px solid hsl(200 15% 90%)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>Submitted</p>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)', fontWeight: '500' }}>{formatDate(item.submitted_at)}</p>
                  </div>
                </div>
              </div>

              {expandedId === item.id && (
                <div style={{ padding: '1rem' }}>
                  {item.notes && (
                    <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid hsl(200 15% 90%)' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
                        Agent's Notes
                      </p>
                      <div style={{
                        backgroundColor: 'hsl(40 30% 97%)', padding: '0.75rem', borderRadius: '0.375rem',
                        borderLeft: '3px solid hsl(40 80% 50%)', fontSize: '0.875rem', color: 'hsl(200 25% 15%)', lineHeight: '1.5'
                      }}>
                        {item.notes}
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid hsl(200 15% 90%)' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '1rem' }}>
                      Uploaded Documents
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                      <DocumentSection title="Government ID" documents={parseDocuments(item.gov_id)} />
                      <DocumentSection title="License Documents" documents={parseDocuments(item.license_documents)} />
                      <DocumentSection title="Proof of Address" documents={parseDocuments(item.proof_of_address)} />
                    </div>
                  </div>

                  <ReviewSection
                    item={item}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    adminNotes={adminNotes}
                    setAdminNotes={setAdminNotes}
                    rejectionReason={rejectionReason}
                    setRejectionReason={setRejectionReason}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Listing Verifications tab ----

const ListingVerificationsList = ({ items, showToast }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [adminNotes, setAdminNotes] = useState({});
  const [rejectionReason, setRejectionReason] = useState({});

  const handleApprove = (id) => {
  if (!confirm("Approve this listing verification request?")) return;
  router.put(`/api/listing-verifications/${id}/approve`, {
    admin_notes: adminNotes[id] || ""
  }, {
    onSuccess: () => {
      showToast("Approved", "Listing verification has been approved", "success");
      setAdminNotes(prev => ({ ...prev, [id]: "" }));
    },
    onError: () => showToast("Error", "Failed to approve request", "error"),
  });
};

const handleReject = (id) => {
  if (!rejectionReason[id]?.trim()) {
    showToast("Required", "Please provide a rejection reason", "warning");
    return;
  }
  if (!confirm("Reject this listing verification request?")) return;
  router.put(`/api/listing-verifications/${id}/reject`, {
    rejection_reason: rejectionReason[id],
    admin_notes: adminNotes[id] || ""
  }, {
    onSuccess: () => {
      showToast("Rejected", "Listing verification has been rejected", "success");
      setRejectionReason(prev => ({ ...prev, [id]: "" }));
      setAdminNotes(prev => ({ ...prev, [id]: "" }));
    },
    onError: () => showToast("Error", "Failed to reject request", "error"),
  });
};

  const filtered = filterStatus === "all" ? items : items.filter(v => v.status === filterStatus);

  return (
    <div>
      <FilterBar filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

      {filtered.length === 0 ? (
        <EmptyState icon={Home} filterStatus={filterStatus} entityLabel="listing verifications" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{ backgroundColor: 'white', border: '1px solid hsl(200 15% 90%)', borderRadius: '0.5rem', overflow: 'hidden' }}
            >
              <div
                style={{
                  padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  backgroundColor: 'hsl(40 30% 98%)', borderBottom: '1px solid hsl(200 15% 90%)', cursor: 'pointer'
                }}
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{
                    width: '3rem', height: '3rem', borderRadius: '50%',
                    backgroundColor: 'hsl(38 92% 50% / 0.12)', color: 'hsl(38 92% 40%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Home style={{ height: '1.5rem', width: '1.5rem' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.25rem' }}>
                      {item.property_title}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                      {item.property_address}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <StatusBadge status={item.status} />
                  <ChevronDown style={{
                    height: '1.25rem', width: '1.25rem', color: 'hsl(200 15% 45%)',
                    transform: expandedId === item.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'
                  }} />
                </div>
              </div>

              <div style={{ padding: '1rem', borderBottom: '1px solid hsl(200 15% 90%)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>Availability</p>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)', fontWeight: '500', textTransform: 'capitalize' }}>
                      {item.availability_status}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.25rem' }}>Submitted</p>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(200 25% 15%)', fontWeight: '500' }}>{formatDate(item.submitted_at)}</p>
                  </div>
                </div>
              </div>

              {expandedId === item.id && (
                <div style={{ padding: '1rem' }}>
                  {item.notes && (
                    <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid hsl(200 15% 90%)' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
                        Submitter's Notes
                      </p>
                      <div style={{
                        backgroundColor: 'hsl(40 30% 97%)', padding: '0.75rem', borderRadius: '0.375rem',
                        borderLeft: '3px solid hsl(38 92% 50%)', fontSize: '0.875rem', color: 'hsl(200 25% 15%)', lineHeight: '1.5'
                      }}>
                        {item.notes}
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid hsl(200 15% 90%)' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '1rem' }}>
                      Uploaded Documents
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                      <DocumentSection title="Ownership Documents" documents={parseDocuments(item.ownership_documents)} />
                      <DocumentSection title="Photos" documents={parseDocuments(item.photos)} />
                      <DocumentSection title="Other Documents" documents={parseDocuments(item.other_documents)} />
                    </div>
                  </div>

                  <ReviewSection
                    item={item}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    adminNotes={adminNotes}
                    setAdminNotes={setAdminNotes}
                    rejectionReason={rejectionReason}
                    setRejectionReason={setRejectionReason}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Main component ----
const ViewAgentVerifications = ({ agentVerifications = [], listingVerifications = [] }) => {
  const [activeTab, setActiveTab] = useState("agents");
  const [toast, setToast] = useState(null);

  const showToast = (title, message, type = "success") => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const pendingAgentCount = agentVerifications.filter(v => v.status === 'pending').length;
  const pendingListingCount = listingVerifications.filter(v => v.status === 'pending').length;

  return (
    <div style={{ width: '100%' }}>
      <style>{`
        @keyframes slideIn {
          from { max-height: 0; opacity: 0; }
          to { max-height: 1000px; opacity: 1; }
        }
        .verification-details { animation: slideIn 0.3s ease-out; }
      `}</style>

      {toast && (
        <div style={{
          position: 'fixed', top: '1rem', right: '1rem',
          backgroundColor: toast.type === 'success' ? 'hsl(152 60% 40%)' :
                           toast.type === 'error' ? 'hsl(0 70% 50%)' : 'hsl(40 80% 50%)',
          color: 'white', padding: '1rem 1.5rem', borderRadius: '0.5rem', zIndex: 50,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: '500'
        }}>
          <p style={{ margin: 0, fontWeight: '600', marginBottom: '0.25rem' }}>{toast.title}</p>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>{toast.message}</p>
        </div>
      )}

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid hsl(200 15% 90%)' }}>
        <button
          onClick={() => setActiveTab("agents")}
          style={{
            padding: '0.75rem 1.25rem', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: '0.9375rem', fontWeight: '600',
            color: activeTab === 'agents' ? 'hsl(174 62% 32%)' : 'hsl(200 15% 45%)',
            borderBottom: activeTab === 'agents' ? '2px solid hsl(174 62% 32%)' : '2px solid transparent',
            marginBottom: '-2px', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <ShieldCheck style={{ height: '1rem', width: '1rem' }} />
          Agent Verifications
          {pendingAgentCount > 0 && (
            <span style={{
              backgroundColor: 'hsl(40 80% 50%)', color: 'white', borderRadius: '9999px',
              fontSize: '0.6875rem', padding: '0.125rem 0.5rem', fontWeight: '700'
            }}>
              {pendingAgentCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("listings")}
          style={{
            padding: '0.75rem 1.25rem', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: '0.9375rem', fontWeight: '600',
            color: activeTab === 'listings' ? 'hsl(38 92% 40%)' : 'hsl(200 15% 45%)',
            borderBottom: activeTab === 'listings' ? '2px solid hsl(38 92% 50%)' : '2px solid transparent',
            marginBottom: '-2px', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <Home style={{ height: '1rem', width: '1rem' }} />
          Listing Verifications
          {pendingListingCount > 0 && (
            <span style={{
              backgroundColor: 'hsl(40 80% 50%)', color: 'white', borderRadius: '9999px',
              fontSize: '0.6875rem', padding: '0.125rem 0.5rem', fontWeight: '700'
            }}>
              {pendingListingCount}
            </span>
          )}
        </button>
      </div>

      {activeTab === "agents" ? (
        <AgentVerificationsList items={agentVerifications} showToast={showToast} />
      ) : (
        <ListingVerificationsList items={listingVerifications} showToast={showToast} />
      )}
    </div>
  );
};

export default ViewAgentVerifications;