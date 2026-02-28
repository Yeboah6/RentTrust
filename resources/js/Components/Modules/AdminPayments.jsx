import { useState } from "react";
import { router } from "@inertiajs/react";
import RefundModal from "@/Components/Modules/RefundModal";

const Search = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Download = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Eye = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const DollarSign = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

// Normalize payments from controller (snake_case DB format) to component format
const normalizePayment = (p) => ({
  id: p.reference ?? `#${p.id}`,
  user_name: p.user?.name ?? '—',
  email: p.user?.email ?? '',
  user_role: 'Agent',
  payment_type: 'Subscription',
  amount: p.amount ?? 0,
  status: p.status?.charAt(0).toUpperCase() + p.status?.slice(1) ?? 'Pending',
  date: p.created_at ?? '',
  payment_method: p.provider?.charAt(0).toUpperCase() + p.provider?.slice(1) ?? '—',
  failure_reason: p.failure_reason,
  currency: p.currency ?? 'GHS',
  _raw: p,
});

const PAGE_SIZE = 10;

const AdminPayments = ({ payments: initialPayments }) => {
  const normalized = (initialPayments ?? []).map(normalizePayment);
  const [payments, setPayments] = useState(normalized);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [page, setPage] = useState(1);
  const [serverSearching, setServerSearching] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Client-side filter
  const filtered = payments.filter(txn => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      txn.id.toLowerCase().includes(q) ||
      txn.user_name.toLowerCase().includes(q) ||
      txn.email.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || txn.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType   = !typeFilter   || txn.payment_type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Server search
  const handleServerSearch = async () => {
    setServerSearching(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (statusFilter) params.set('status', statusFilter.toLowerCase());
      const res  = await fetch(`/admin/payments/filter?${params}`);
      const data = await res.json();
      setPayments(data.map(normalizePayment));
      setPage(1);
    } catch {
      showToast('Search failed.', 'error');
    } finally {
      setServerSearching(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setTypeFilter("");
    setDateFilter("all");
    setPayments(normalized);
    setPage(1);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'User', 'Email', 'Type', 'Amount', 'Status', 'Date', 'Provider'];
    const rows = filtered.map(t => [t.id, t.user_name, t.email, t.payment_type, t.amount, t.status, t.date, t.payment_method]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'payments.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewTransaction = (txn) => {
    setSelectedTransaction(txn);
    setShowRefundModal(true);
  };

  const handleRefund = (txnId) => {
    const raw = payments.find(p => p.id === txnId)?._raw;
    if (!raw) return;
    router.post(`/admin/payments/${raw.id}/refund`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        setPayments(prev => prev.map(p => p.id === txnId ? { ...p, status: 'Refunded' } : p));
        showToast('Payment refunded successfully.');
        setShowRefundModal(false);
      },
      onError: () => showToast('Refund failed.', 'error'),
    });
  };

  const handleMarkResolved = (txnId) => {
    showToast('Marked as resolved.');
  };

  const getStatusBadge = (status) => {
    const styles = {
      Success:  { bg: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', border: 'hsl(152 60% 85%)' },
      Failed:   { bg: 'hsl(0 70% 95%)',   color: 'hsl(0 70% 45%)',   border: 'hsl(0 70% 85%)' },
      Refunded: { bg: 'hsl(262 83% 95%)', color: 'hsl(262 83% 48%)', border: 'hsl(262 83% 85%)' },
      Pending:  { bg: 'hsl(40 30% 94%)',  color: 'hsl(38 92% 50%)',  border: 'hsl(40 20% 88%)' },
    };
    const s = styles[status] ?? styles.Pending;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', fontSize: '0.75rem', fontWeight: '600', backgroundColor: s.bg, color: s.color, borderRadius: '9999px', border: `1px solid ${s.border}` }}>
        {status}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const isAgent = role === 'Agent';
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', fontSize: '0.75rem', fontWeight: '500', backgroundColor: isAgent ? 'hsl(174 62% 95%)' : 'hsl(214 100% 95%)', color: isAgent ? 'hsl(174 62% 32%)' : 'hsl(214 100% 40%)', borderRadius: '9999px' }}>
        {role}
      </span>
    );
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 100, padding: '0.875rem 1.25rem', borderRadius: '0.625rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 51%)' : 'hsl(152 58% 38%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          {toast.msg}
        </div>
      )}

      {/* Filters */}
      <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>Search</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Transaction ID, User..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleServerSearch()}
                style={{ width: '100%', padding: '0.625rem 0.875rem 0.625rem 2.5rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
              <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', height: '1.25rem', width: '1.25rem', color: 'hsl(200 15% 45%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', backgroundColor: 'white', outline: 'none', fontFamily: 'inherit' }}>
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>Payment Type</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', backgroundColor: 'white', outline: 'none', fontFamily: 'inherit' }}>
              <option value="">All Types</option>
              <option value="subscription">Subscription</option>
              <option value="boost">Boost</option>
              <option value="lead unlock">Lead Unlock</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>Date Range</label>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', backgroundColor: 'white', outline: 'none', fontFamily: 'inherit' }}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={clearFilters} style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
              Clear all filters
            </button>
            <button onClick={handleServerSearch} disabled={serverSearching} style={{ padding: '0.5rem 1rem', backgroundColor: 'hsl(174 62% 32%)', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', opacity: serverSearching ? 0.7 : 1 }}>
              {serverSearching ? 'Searching…' : 'Search DB'}
            </button>
          </div>
          <button onClick={exportToCSV} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', cursor: 'pointer' }}>
            <Download style={{ height: '1rem', width: '1rem' }} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'hsl(40 33% 99%)', borderBottom: '1px solid hsl(40 20% 88%)' }}>
              <tr>
                {['Transaction ID', 'User', 'Role', 'Type', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'hsl(200 15% 55%)' }}>No payments found</td></tr>
              ) : paginated.map((txn, i) => (
                <tr key={txn.id} style={{ borderBottom: i < paginated.length - 1 ? '1px solid hsl(40 20% 88%)' : 'none', transition: 'background-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(40 33% 99%)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(174 62% 32%)', whiteSpace: 'nowrap' }}>{txn.id}</td>
                  <td style={{ padding: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.125rem' }}>{txn.user_name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>{txn.email}</p>
                  </td>
                  <td style={{ padding: '1rem' }}>{getRoleBadge(txn.user_role)}</td>
                  <td style={{ padding: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.125rem' }}>{txn.payment_type}</p>
                    <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>{txn.payment_method}</p>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', whiteSpace: 'nowrap' }}>
                    {txn.currency ?? 'GHS'} {Number(txn.amount).toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {getStatusBadge(txn.status)}
                    {txn.failure_reason && <p style={{ fontSize: '0.7rem', color: 'hsl(0 65% 48%)', marginTop: '0.25rem', maxWidth: '140px' }}>{txn.failure_reason}</p>}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.75rem', color: 'hsl(200 15% 45%)', whiteSpace: 'nowrap' }}>{txn.date}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button onClick={() => handleViewTransaction(txn)} style={{ padding: '0.375rem 0.75rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(174 62% 32%)', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Eye style={{ height: '0.875rem', width: '0.875rem' }} /> View
                      </button>
                      {txn.status === 'Success' && (
                        <button onClick={() => handleViewTransaction(txn)} style={{ padding: '0.375rem 0.75rem', border: '1px solid hsl(38 92% 50%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(38 92% 50%)', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <DollarSign style={{ height: '0.875rem', width: '0.875rem' }} /> Refund
                        </button>
                      )}
                      {txn.status === 'Failed' && (
                        <button onClick={() => handleMarkResolved(txn.id)} style={{ padding: '0.375rem 0.75rem', border: '1px solid hsl(152 60% 40%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(152 60% 40%)', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle style={{ height: '0.875rem', width: '0.875rem' }} /> Resolve
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
            Showing <strong>{Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}</strong>–<strong>{Math.min(page * PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong> results
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '0.5rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(200 15% 45%)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>
              <ChevronLeft style={{ height: '1.25rem', width: '1.25rem' }} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{ padding: '0.5rem 0.875rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.375rem', backgroundColor: page === p ? 'hsl(174 62% 32%)' : 'white', color: page === p ? 'white' : 'hsl(200 15% 45%)', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '0.5rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.375rem', backgroundColor: 'white', color: 'hsl(200 15% 45%)', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>
              <ChevronRight style={{ height: '1.25rem', width: '1.25rem' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && selectedTransaction && (
        <RefundModal
          transaction={selectedTransaction}
          onClose={() => setShowRefundModal(false)}
          onRefund={handleRefund}
        />
      )}
    </div>
  );
};

export default AdminPayments;