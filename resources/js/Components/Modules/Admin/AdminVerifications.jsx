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

// DocumentSection with responsive truncation
const DocumentSection = ({ title, documents, downloadBase }) => {
  if (!documents || documents.length === 0) {
    return (
      <div style={{ marginBottom: '1rem', minWidth: 0 }}>
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
    <div style={{ marginBottom: '1rem', minWidth: 0 }}>
      <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
        {title}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0 }}>
        {documents.map((doc, idx) => {
          const rawPath = doc.url || doc.path || (typeof doc === 'string' ? doc : '');
          const filename = rawPath.split('/').pop();
          const label = doc.original_name || filename || `Document ${idx + 1}`;
          const href = `${downloadBase}/${encodeURIComponent(filename)}`;

          return (
            <a
              key={idx}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={label} // Show full name on hover
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem',
                backgroundColor: 'hsl(40 30% 97%)', borderRadius: '0.375rem',
                border: '1px solid hsl(40 20% 88%)', textDecoration: 'none',
                color: 'hsl(174 62% 32%)', fontSize: '0.875rem', fontWeight: '500',
                transition: 'all 0.2s',
                minWidth: 0,
                width: '100%',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 97%)'}
            >
              <Download style={{ height: '0.875rem', width: '0.875rem', flexShrink: 0 }} />
              <span style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                minWidth: 0,
                fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
              }}>
                {label}
              </span>
            </a>
          );
        })}
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

const ReviewSection = ({ item, onApprove, onReject, reviewNotes, setReviewNotes }) => (
  <>
    {item.status === 'pending' && (
      <div style={{ backgroundColor: 'hsl(174 62% 32% / 0.05)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid hsl(174 62% 32% / 0.2)' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(174 62% 32%)', marginBottom: '1rem' }}>
          Admin Review
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
            Admin Notes <span style={{ fontWeight: '400', color: 'hsl(200 15% 55%)' }}>(optional to approve, required to reject)</span>
          </label>
          <textarea
            value={reviewNotes[item.id] || ''}
            onChange={(e) => setReviewNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
            placeholder="Add notes about this verification, or explain why it's being rejected..."
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

// ---- Agent Verifications list ----

const AgentVerificationsList = ({ items, showToast }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [reviewNotes, setReviewNotes] = useState({});

  const handleApprove = (id) => {
    if (!confirm("Approve this agent verification request?")) return;
    router.post(`/admin/agent-verifications/${id}/approve`, {
      admin_notes: reviewNotes[id] || ""
    }, {
      onSuccess: () => {
        showToast("Approved", "Agent verification has been approved", "success");
        setReviewNotes(prev => ({ ...prev, [id]: "" }));
      },
      onError: () => showToast("Error", "Failed to approve request", "error"),
    });
  };

  const handleReject = (id) => {
    if (!reviewNotes[id]?.trim()) {
      showToast("Required", "Please provide a reason before rejecting", "warning");
      return;
    }
    if (!confirm("Reject this agent verification request?")) return;
    router.post(`/admin/agent-verifications/${id}/reject`, {
      rejection_reason: reviewNotes[id]
    }, {
      onSuccess: () => {
        showToast("Rejected", "Agent verification has been rejected", "success");
        setReviewNotes(prev => ({ ...prev, [id]: "" }));
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
        <div className="verification-grid">
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{ backgroundColor: 'white', border: '1px solid hsl(200 15% 90%)', borderRadius: '0.5rem', overflow: 'hidden' }}
            >
              <div
                className="verification-card-header"
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
                <div className="verification-header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <StatusBadge status={item.status} />
                  <ChevronDown style={{
                    height: '1.25rem', width: '1.25rem', color: 'hsl(200 15% 45%)',
                    transform: expandedId === item.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'
                  }} />
                </div>
              </div>

              <div style={{ padding: '1rem', borderBottom: '1px solid hsl(200 15% 90%)' }}>
                <div className="info-grid">
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
                    <div className="documents-grid">
                      <DocumentSection
                        title="Government ID"
                        documents={parseDocuments(item.gov_id)}
                        downloadBase={`/admin/agent-verifications/${item.id}/documents`}
                      />
                      <DocumentSection
                        title="License Documents"
                        documents={parseDocuments(item.license_documents)}
                        downloadBase={`/admin/agent-verifications/${item.id}/documents`}
                      />
                      <DocumentSection
                        title="Proof of Address"
                        documents={parseDocuments(item.proof_of_address)}
                        downloadBase={`/admin/agent-verifications/${item.id}/documents`}
                      />
                    </div>
                  </div>

                  <ReviewSection
                    item={item}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    reviewNotes={reviewNotes}
                    setReviewNotes={setReviewNotes}
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

// ---- Listing Verifications list ----

const ListingVerificationsList = ({ items, showToast }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [reviewNotes, setReviewNotes] = useState({});

  const handleApprove = (id) => {
    if (!confirm("Approve this listing verification request?")) return;
    router.post(`/admin/listing-verifications/${id}/approve`, {
      admin_notes: reviewNotes[id] || ""
    }, {
      onSuccess: () => {
        showToast("Approved", "Listing verification has been approved", "success");
        setReviewNotes(prev => ({ ...prev, [id]: "" }));
      },
      onError: () => showToast("Error", "Failed to approve request", "error"),
    });
  };

  const handleReject = (id) => {
    if (!reviewNotes[id]?.trim()) {
      showToast("Required", "Please provide a reason before rejecting", "warning");
      return;
    }
    if (!confirm("Reject this listing verification request?")) return;
    router.post(`/admin/listing-verifications/${id}/reject`, {
      rejection_reason: reviewNotes[id]
    }, {
      onSuccess: () => {
        showToast("Rejected", "Listing verification has been rejected", "success");
        setReviewNotes(prev => ({ ...prev, [id]: "" }));
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
        <div className="verification-grid">
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{ backgroundColor: 'white', border: '1px solid hsl(200 15% 90%)', borderRadius: '0.5rem', overflow: 'hidden' }}
            >
              <div
                className="verification-card-header"
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
                <div className="verification-header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <StatusBadge status={item.status} />
                  <ChevronDown style={{
                    height: '1.25rem', width: '1.25rem', color: 'hsl(200 15% 45%)',
                    transform: expandedId === item.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'
                  }} />
                </div>
              </div>

              <div style={{ padding: '1rem', borderBottom: '1px solid hsl(200 15% 90%)' }}>
                <div className="info-grid">
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
                    <div className="documents-grid">
                      <DocumentSection
                        title="Ownership Documents"
                        documents={parseDocuments(item.ownership_documents)}
                        downloadBase={`/admin/listing-verifications/${item.id}/documents`}
                      />
                      <DocumentSection
                        title="Photos"
                        documents={parseDocuments(item.photos)}
                        downloadBase={`/admin/listing-verifications/${item.id}/documents`}
                      />
                      <DocumentSection
                        title="Other Documents"
                        documents={parseDocuments(item.other_documents)}
                        downloadBase={`/admin/listing-verifications/${item.id}/documents`}
                      />
                    </div>
                  </div>

                  <ReviewSection
                    item={item}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    reviewNotes={reviewNotes}
                    setReviewNotes={setReviewNotes}
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
    <div style={{ width: '100%', minWidth: 0 }}>
      <style>{`
        @keyframes slideIn {
          from { max-height: 0; opacity: 0; }
          to { max-height: 1000px; opacity: 1; }
        }
        .verification-details { animation: slideIn 0.3s ease-out; }

        /* Responsive improvements */
        .verification-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          min-width: 0;
        }
        .verification-card-header {
          flex-wrap: wrap;
          gap: 0.5rem;
          min-width: 0;
        }
        .verification-header-right {
          margin-left: auto;
          flex-shrink: 0;
        }
        .documents-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          min-width: 0;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          min-width: 0;
        }
        .verification-card {
          min-width: 0;
        }

        @media (min-width: 600px) {
          .documents-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
          .info-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          }
        }

        @media (min-width: 768px) {
          .verification-grid {
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          }
        }

        /* Mobile-specific styles */
        @media (max-width: 640px) {
          .verification-card-header {
            padding: 0.75rem !important;
          }
          .verification-card-header > div:first-child {
            gap: 0.5rem !important;
          }
          .verification-header-right {
            gap: 0.5rem !important;
          }
          .verification-header-right .status-badge {
            font-size: 0.65rem !important;
            padding: 0.3rem 0.6rem !important;
          }
          .documents-grid {
            gap: 0.75rem !important;
          }
        }

        @media (max-width: 480px) {
          .verification-card-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .verification-header-right {
            margin-left: 0 !important;
            width: 100%;
            justify-content: space-between;
          }
          .info-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* Tab switcher mobile styles */
        .verification-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid hsl(200 15% 90%);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .verification-tabs::-webkit-scrollbar {
          display: none;
        }
        .verification-tabs button {
          flex: 0 0 auto;
          white-space: nowrap;
        }
        @media (max-width: 480px) {
          .verification-tabs {
            gap: 0.25rem;
          }
          .verification-tabs button {
            padding: 0.75rem 0.75rem !important;
            font-size: 0.8125rem !important;
            gap: 0.25rem !important;
          }
        }
      `}</style>

      {toast && (
        <div style={{
          position: 'fixed', top: '1rem', right: '1rem', left: '1rem',
          backgroundColor: toast.type === 'success' ? 'hsl(152 60% 40%)' :
                           toast.type === 'error' ? 'hsl(0 70% 50%)' : 'hsl(40 80% 50%)',
          color: 'white', padding: '1rem 1.5rem', borderRadius: '0.5rem', zIndex: 50,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: '500',
          maxWidth: '90vw', margin: '0 auto',
          fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
        }}>
          <p style={{ margin: 0, fontWeight: '600', marginBottom: '0.25rem' }}>{toast.title}</p>
          <p style={{ margin: 0, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>{toast.message}</p>
        </div>
      )}

      {/* Tab switcher */}
      <div className="verification-tabs">
        <button
          onClick={() => setActiveTab("agents")}
          style={{
            padding: '0.75rem 1.25rem', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 'clamp(0.8125rem, 2.5vw, 0.9375rem)', fontWeight: '600',
            color: activeTab === 'agents' ? 'hsl(174 62% 32%)' : 'hsl(200 15% 45%)',
            borderBottom: activeTab === 'agents' ? '2px solid hsl(174 62% 32%)' : '2px solid transparent',
            marginBottom: '-2px', display: 'flex', alignItems: 'center', gap: '0.5rem',
            whiteSpace: 'nowrap',
            minHeight: '44px',
          }}
        >
          <ShieldCheck style={{ height: '1rem', width: '1rem', flexShrink: 0 }} />
          Agent Verifications
          {pendingAgentCount > 0 && (
            <span style={{
              backgroundColor: 'hsl(40 80% 50%)', color: 'white', borderRadius: '9999px',
              fontSize: '0.6875rem', padding: '0.125rem 0.5rem', fontWeight: '700',
              flexShrink: 0
            }}>
              {pendingAgentCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("listings")}
          style={{
            padding: '0.75rem 1.25rem', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 'clamp(0.8125rem, 2.5vw, 0.9375rem)', fontWeight: '600',
            color: activeTab === 'listings' ? 'hsl(38 92% 40%)' : 'hsl(200 15% 45%)',
            borderBottom: activeTab === 'listings' ? '2px solid hsl(38 92% 50%)' : '2px solid transparent',
            marginBottom: '-2px', display: 'flex', alignItems: 'center', gap: '0.5rem',
            whiteSpace: 'nowrap',
            minHeight: '44px',
          }}
        >
          <Home style={{ height: '1rem', width: '1rem', flexShrink: 0 }} />
          Listing Verifications
          {pendingListingCount > 0 && (
            <span style={{
              backgroundColor: 'hsl(40 80% 50%)', color: 'white', borderRadius: '9999px',
              fontSize: '0.6875rem', padding: '0.125rem 0.5rem', fontWeight: '700',
              flexShrink: 0
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