import { useState } from "react";
import { router } from "@inertiajs/react";

const Search = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const X = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Gift = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const Ban = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);

const TrendingUpIcon = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ChevronLeft = ({ style }) => (
  <svg style={style} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ChevronRight = ({ style }) => (
  <svg style={style} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

// Normalize subscription from controller format
const normalizeSubscription = (s) => ({
  id:              s.id,
  sub_display:     `SUB-${s.id}`,
  user_name:       s.user?.name ?? '—',
  user_email:      s.user?.email ?? '',
  user_role:       'Agent',
  current_plan:    s.plan?.name ?? 'Free',
  monthly_price:   s.plan?.price ?? 0,
  renewal_date:    s.ends_at ?? null,
  status:          s.status?.charAt(0).toUpperCase() + s.status?.slice(1) ?? 'Active',
  payment_method:  s.provider?.charAt(0).toUpperCase() + s.provider?.slice(1) ?? '—',
  started_date:    s.starts_at ?? null,
  grace:           s.grace ?? false,
  days_left:       s.days_left ?? null,
  _raw:            s,
});

const PAGE_SIZE = 10;

const AdminSubscriptions = ({ subscriptions: initialSubscriptions }) => {
  const normalized = (initialSubscriptions ?? []).map(normalizeSubscription);
  const [subscriptions, setSubscriptions] = useState(normalized);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = subscriptions.filter(sub => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      sub.sub_display.toLowerCase().includes(q) ||
      sub.user_name.toLowerCase().includes(q) ||
      sub.user_email.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || sub.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPlan   = !planFilter   || sub.current_plan.toLowerCase().includes(planFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => { setSearchQuery(""); setStatusFilter(""); setPlanFilter(""); setPage(1); };

  const openAction = (sub, type) => { setSelectedSubscription(sub); setActionType(type); setShowActionModal(true); };

  const confirmAction = () => {
    if (!selectedSubscription) return;
    const id = selectedSubscription._raw?.id ?? selectedSubscription.id;
    setProcessingId(id);

    if (actionType === 'cancel') {
      router.post(`/admin/subscriptions/${id}/cancel`, {}, {
        preserveScroll: true,
        onSuccess: () => {
          setSubscriptions(prev => prev.map(s => s.id === selectedSubscription.id ? { ...s, status: 'Cancelled' } : s));
          showToast('Subscription cancelled.');
        },
        onError: () => showToast('Action failed.', 'error'),
        onFinish: () => { setProcessingId(null); setShowActionModal(false); },
      });
    } else {
      // free_month / upgrade / suspend — show feedback for now
      showToast(`${actionType.replace('_', ' ')} action applied.`);
      setShowActionModal(false);
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status, grace) => {
    if (grace) return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'hsl(38 92% 94%)', color: 'hsl(36 85% 33%)', borderRadius: '9999px', border: '1px solid hsl(38 80% 85%)' }}>Grace Period</span>;
    const styles = {
      Active:    { bg: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', border: 'hsl(152 60% 85%)' },
      Cancelled: { bg: 'hsl(0 0% 95%)',    color: 'hsl(0 0% 45%)',    border: 'hsl(0 0% 85%)' },
      Expired:   { bg: 'hsl(0 70% 95%)',   color: 'hsl(0 70% 45%)',   border: 'hsl(0 70% 85%)' },
      Pending:   { bg: 'hsl(220 80% 95%)', color: 'hsl(220 80% 44%)', border: 'hsl(220 80% 85%)' },
    };
    const s = styles[status] ?? styles.Active;
    return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', fontSize: '0.75rem', fontWeight: '600', backgroundColor: s.bg, color: s.color, borderRadius: '9999px', border: `1px solid ${s.border}` }}>{status}</span>;
  };

  const getPlanBadge = (plan) => {
    const colors = {
      'Free':     { bg: 'hsl(200 15% 95%)', color: 'hsl(200 15% 40%)' },
      'Verified': { bg: 'hsl(214 100% 95%)', color: 'hsl(214 100% 40%)' },
      'Pro':      { bg: 'hsl(174 62% 95%)', color: 'hsl(174 62% 32%)' },
    };
    const c = colors[plan] ?? colors['Free'];
    return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', fontSize: '0.75rem', fontWeight: '600', backgroundColor: c.bg, color: c.color, borderRadius: '9999px' }}>{plan}</span>;
  };

  const activeSubs = subscriptions.filter(s => s.status === 'Active');
  const mrr = activeSubs.reduce((acc, s) => acc + (s.monthly_price || 0), 0);

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 100, padding: '0.875rem 1.25rem', borderRadius: '0.625rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 51%)' : 'hsl(152 58% 38%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          {toast.msg}
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Active', value: activeSubs.length, valueColor: 'hsl(152 60% 40%)', sub: 'Active subscriptions' },
          { label: 'Cancelled', value: subscriptions.filter(s => s.status === 'Cancelled').length, valueColor: 'hsl(0 0% 45%)', sub: 'Cancelled this month' },
          { label: 'Expired', value: subscriptions.filter(s => s.status === 'Expired').length, valueColor: 'hsl(0 70% 45%)', sub: 'Need renewal' },
          { label: 'MRR', value: `GH₵${mrr.toLocaleString()}`, valueColor: 'hsl(174 62% 32%)', sub: 'Monthly recurring revenue' },
        ].map(({ label, value, valueColor, sub }) => (
          <div key={label} style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: valueColor, marginBottom: '0.25rem' }}>{value}</p>
            <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>Search</label>
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="User name, email, ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '0.625rem 0.875rem 0.625rem 2.5rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', height: '1.25rem', width: '1.25rem', color: 'hsl(200 15% 45%)' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', backgroundColor: 'white', outline: 'none', fontFamily: 'inherit' }}>
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>Plan</label>
            <select value={planFilter} onChange={e => setPlanFilter(e.target.value)} style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', backgroundColor: 'white', outline: 'none', fontFamily: 'inherit' }}>
              <option value="">All Plans</option>
              <option value="free">Free</option>
              <option value="verified">Verified</option>
              <option value="pro">Pro</option>
            </select>
          </div>
        </div>
        <button onClick={clearFilters} style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>Clear all filters</button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'hsl(40 33% 99%)', borderBottom: '1px solid hsl(40 20% 88%)' }}>
              <tr>
                {['User', 'Current Plan', 'Renewal Date', 'Status', 'Provider', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'hsl(200 15% 55%)' }}>No subscriptions found</td></tr>
              ) : paginated.map((sub, i) => (
                <tr key={sub.id} style={{ borderBottom: i < paginated.length - 1 ? '1px solid hsl(40 20% 88%)' : 'none', transition: 'background-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(40 33% 99%)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.125rem' }}>{sub.user_name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginBottom: '0.125rem' }}>{sub.user_email}</p>
                    <p style={{ fontSize: '0.75rem', color: 'hsl(174 62% 32%)', fontWeight: '500' }}>{sub.sub_display}</p>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div>
                      {getPlanBadge(sub.current_plan)}
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginTop: '0.25rem' }}>GH₵{Number(sub.monthly_price).toFixed(2)}/month</p>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'hsl(200 25% 15%)', whiteSpace: 'nowrap' }}>
                    {sub.renewal_date ?? 'No expiry'}
                    {sub.days_left !== null && <p style={{ fontSize: '0.73rem', color: sub.days_left <= 5 ? 'hsl(0 63% 44%)' : 'hsl(200 15% 52%)', marginTop: '0.15rem' }}>{sub.days_left}d left</p>}
                  </td>
                  <td style={{ padding: '1rem' }}>{getStatusBadge(sub.status, sub.grace)}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>{sub.payment_method}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {sub.status === 'Active' ? (
                        <>
                          <button onClick={() => openAction(sub, 'cancel')} style={{ padding: '0.375rem 0.75rem', border: '1px solid hsl(0 0% 70%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(0 0% 45%)', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <X style={{ height: '0.875rem', width: '0.875rem' }} /> Cancel
                          </button>
                          <button onClick={() => openAction(sub, 'upgrade')} style={{ padding: '0.375rem 0.75rem', border: '1px solid hsl(174 62% 32%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(174 62% 32%)', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <TrendingUpIcon style={{ height: '0.875rem', width: '0.875rem' }} /> Upgrade
                          </button>
                          <button onClick={() => openAction(sub, 'free_month')} style={{ padding: '0.375rem 0.75rem', border: '1px solid hsl(271 81% 56%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(271 81% 56%)', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Gift style={{ height: '0.875rem', width: '0.875rem' }} /> Free Month
                          </button>
                          <button onClick={() => openAction(sub, 'suspend')} style={{ padding: '0.375rem 0.75rem', border: '1px solid hsl(0 70% 50%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(0 70% 50%)', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Ban style={{ height: '0.875rem', width: '0.875rem' }} /> Suspend
                          </button>
                        </>
                      ) : (
                        <button onClick={() => openAction(sub, 'view')} style={{ padding: '0.375rem 0.75rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(174 62% 32%)', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer' }}>
                          View Details
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid hsl(40 20% 88%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
            Showing <strong>{Math.min((page-1)*PAGE_SIZE+1, filtered.length)}</strong>–<strong>{Math.min(page*PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong> results
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} style={{ padding: '0.5rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(200 15% 45%)', cursor: page===1?'not-allowed':'pointer', opacity: page===1?0.5:1 }}>
              <ChevronLeft style={{ height: '1.25rem', width: '1.25rem' }} />
            </button>
            {Array.from({ length: Math.min(totalPages,5) }, (_,i) => i+1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{ padding: '0.5rem 0.875rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.375rem', backgroundColor: page===p?'hsl(174 62% 32%)':'white', color: page===p?'white':'hsl(200 15% 45%)', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ padding: '0.5rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(200 15% 45%)', cursor: page===totalPages?'not-allowed':'pointer', opacity: page===totalPages?0.5:1 }}>
              <ChevronRight style={{ height: '1.25rem', width: '1.25rem' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && selectedSubscription && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }} onClick={() => setShowActionModal(false)}>
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', maxWidth: '500px', width: '100%', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'hsl(200 25% 15%)', marginBottom: '1rem' }}>
              {actionType === 'cancel' && 'Cancel Subscription'}
              {actionType === 'upgrade' && 'Upgrade Plan'}
              {actionType === 'free_month' && 'Grant Free Month'}
              {actionType === 'suspend' && 'Suspend Account'}
              {actionType === 'view' && 'Subscription Details'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '1.5rem' }}>
              {actionType === 'cancel' && `Cancel the ${selectedSubscription.current_plan} subscription for ${selectedSubscription.user_name}? Their account will be downgraded to Free immediately.`}
              {actionType === 'upgrade' && `Select a new plan for ${selectedSubscription.user_name}.`}
              {actionType === 'free_month' && `Grant a free month extension to ${selectedSubscription.user_name}?`}
              {actionType === 'suspend' && `Suspend ${selectedSubscription.user_name}'s account? They will lose access immediately.`}
              {actionType === 'view' && `Subscription ${selectedSubscription.sub_display} for ${selectedSubscription.user_name} — Status: ${selectedSubscription.status}`}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setShowActionModal(false)} style={{ padding: '0.625rem 1.25rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', backgroundColor: 'white', color: 'hsl(200 25% 15%)', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>
                {actionType === 'view' ? 'Close' : 'Cancel'}
              </button>
              {actionType !== 'view' && (
                <button onClick={confirmAction} disabled={!!processingId} style={{ padding: '0.625rem 1.25rem', border: 'none', borderRadius: '0.5rem', background: actionType === 'cancel' || actionType === 'suspend' ? 'hsl(0 65% 50%)' : 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)', color: 'white', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}>
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptions;