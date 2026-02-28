import { useState } from "react";

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

const TrendingUp = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const CheckCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RefreshCw = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const Edit = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

// Map real activity statuses to audit-like entries
const buildAuditEntries = (activity) => {
  if (activity && activity.length > 0) {
    return activity.map(item => ({
      id:           item.id,
      admin:        'Admin',
      action:       item.title,
      affectedUser: item.title.split('—').pop()?.trim() ?? item.title,
      timestamp:    item.time,
      notes:        item.description,
      type:         item.status === 'success' ? 'payment' : item.status === 'failed' ? 'suspension' : 'payment',
      icon:         item.status === 'success' ? CheckCircle : item.status === 'failed' ? XCircle : AlertCircle,
      iconBg:       item.status === 'success' ? 'hsl(152 60% 95%)' : item.status === 'failed' ? 'hsl(0 70% 95%)' : 'hsl(40 30% 94%)',
      iconColor:    item.status === 'success' ? 'hsl(152 60% 40%)' : item.status === 'failed' ? 'hsl(0 70% 50%)' : 'hsl(40 90% 50%)',
    }));
  }
  // Fallback static entries
  return [
    { id: 1, admin: 'Super Admin', action: 'Refund processed', affectedUser: 'Kwame Mensah', timestamp: '2024-02-14 10:30:45', notes: 'Refund processed for duplicate charge', type: 'refund', icon: RefreshCw, iconBg: 'hsl(40 30% 94%)', iconColor: 'hsl(40 90% 50%)' },
    { id: 2, admin: 'Admin User', action: 'Subscription extended', affectedUser: 'Ama Serwaa', timestamp: '2024-02-14 09:15:22', notes: 'Manually extended by 1 month — customer service compensation', type: 'subscription', icon: CheckCircle, iconBg: 'hsl(152 60% 95%)', iconColor: 'hsl(152 60% 40%)' },
    { id: 3, admin: 'Super Admin', action: 'Account suspended', affectedUser: 'Kofi Asante', timestamp: '2024-02-14 08:45:10', notes: 'Suspended due to fraudulent activity', type: 'suspension', icon: XCircle, iconBg: 'hsl(0 70% 95%)', iconColor: 'hsl(0 70% 50%)' },
    { id: 4, admin: 'Admin User', action: 'Payment verified', affectedUser: 'Yaw Boateng', timestamp: '2024-02-13 16:20:33', notes: 'Manual payment verification — bank confirmation received', type: 'payment', icon: CheckCircle, iconBg: 'hsl(152 60% 95%)', iconColor: 'hsl(152 60% 40%)' },
    { id: 5, admin: 'Super Admin', action: 'Subscription cancelled', affectedUser: 'Kwesi Nyarko', timestamp: '2024-02-13 11:15:40', notes: 'Cancelled at user request — no refund issued', type: 'subscription', icon: XCircle, iconBg: 'hsl(0 70% 95%)', iconColor: 'hsl(0 70% 50%)' },
    { id: 6, admin: 'Admin User', action: 'Plan upgraded', affectedUser: 'Efua Mensah', timestamp: '2024-02-12 15:45:27', notes: 'Upgraded from Free to Pro — manual override', type: 'subscription', icon: TrendingUp, iconBg: 'hsl(214 100% 95%)', iconColor: 'hsl(214 100% 50%)' },
    { id: 7, admin: 'Super Admin', action: 'Payment disputed', affectedUser: 'Yaa Mensah', timestamp: '2024-02-10 16:45:12', notes: 'Payment dispute opened — under investigation', type: 'payment', icon: AlertCircle, iconBg: 'hsl(40 30% 94%)', iconColor: 'hsl(40 90% 50%)' },
    { id: 8, admin: 'Admin User', action: 'Free month granted', affectedUser: 'Kwame Asare', timestamp: '2024-02-11 14:25:38', notes: 'Free month granted — service outage compensation', type: 'subscription', icon: CheckCircle, iconBg: 'hsl(152 60% 95%)', iconColor: 'hsl(152 60% 40%)' },
    { id: 9, admin: 'Super Admin', action: 'Settings updated', affectedUser: 'Ama Darko', timestamp: '2024-02-09 13:15:33', notes: 'Account settings updated — email preferences modified', type: 'settings', icon: Edit, iconBg: 'hsl(261 51% 95%)', iconColor: 'hsl(261 51% 51%)' },
  ];
};

const getActionBadge = (type) => {
  const styles = {
    refund:       { bg: 'hsl(40 30% 94%)',  color: 'hsl(40 90% 40%)',  label: 'Refund' },
    subscription: { bg: 'hsl(214 100% 95%)', color: 'hsl(214 100% 40%)', label: 'Subscription' },
    suspension:   { bg: 'hsl(0 70% 95%)',   color: 'hsl(0 70% 50%)',   label: 'Suspension' },
    payment:      { bg: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', label: 'Payment' },
    listing:      { bg: 'hsl(271 76% 95%)', color: 'hsl(271 76% 40%)', label: 'Listing' },
    verification: { bg: 'hsl(173 58% 95%)', color: 'hsl(173 58% 35%)', label: 'Verification' },
    report:       { bg: 'hsl(330 81% 95%)', color: 'hsl(330 81% 45%)', label: 'Report' },
    data:         { bg: 'hsl(261 51% 95%)', color: 'hsl(261 51% 45%)', label: 'Data' },
    settings:     { bg: 'hsl(200 15% 95%)', color: 'hsl(200 15% 45%)', label: 'Settings' },
  };
  const s = styles[type] ?? styles.settings;
  return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: s.bg, color: s.color }}>{s.label}</span>;
};

const AdminAudit = ({ activity }) => {
  const allLogs = buildAuditEntries(activity);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [adminFilter, setAdminFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const filtered = allLogs.filter(log => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      log.admin.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.affectedUser.toLowerCase().includes(q) ||
      log.notes.toLowerCase().includes(q);
    const matchesAction = !actionFilter || log.type === actionFilter;
    const matchesAdmin  = !adminFilter  || log.admin === adminFilter;
    return matchesSearch && matchesAction && matchesAdmin;
  });

  const exportLogs = () => {
    const headers = ['ID', 'Admin', 'Action', 'Affected User', 'Timestamp', 'Notes', 'Type'];
    const rows = filtered.map(l => [l.id, l.admin, l.action, l.affectedUser, l.timestamp, l.notes, l.type]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'audit-log.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const admins = [...new Set(allLogs.map(l => l.admin))];

  return (
    <div>
      {/* Filters */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid hsl(40 20% 88%)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>Search</label>
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Search logs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', height: '1.25rem', width: '1.25rem', color: 'hsl(200 15% 45%)' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>Action Type</label>
            <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit' }}>
              <option value="">All Actions</option>
              <option value="refund">Refunds</option>
              <option value="subscription">Subscriptions</option>
              <option value="suspension">Suspensions</option>
              <option value="payment">Payments</option>
              <option value="listing">Listings</option>
              <option value="verification">Verifications</option>
              <option value="report">Reports</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>Admin</label>
            <select value={adminFilter} onChange={e => setAdminFilter(e.target.value)} style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit' }}>
              <option value="">All Admins</option>
              {admins.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>Date Range</label>
            <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit' }}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => { setSearchQuery(''); setActionFilter(''); setAdminFilter(''); setDateFilter('all'); }} style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Clear all filters
          </button>
          <button onClick={exportLogs} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', cursor: 'pointer' }}>
            <Download style={{ height: '1rem', width: '1rem' }} /> Export Logs
          </button>
        </div>
      </div>

      {/* Results summary */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
          Showing <span style={{ fontWeight: '600', color: 'hsl(200 25% 15%)' }}>{filtered.length}</span> of <span style={{ fontWeight: '600', color: 'hsl(200 25% 15%)' }}>{allLogs.length}</span> audit logs
        </p>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid hsl(40 20% 88%)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'hsl(40 33% 99%)' }}>
              <tr>
                {['Admin Name', 'Action', 'Affected User', 'Timestamp', 'Notes'].map(h => (
                  <th key={h} style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'hsl(200 15% 55%)' }}>No logs found</td></tr>
              ) : filtered.map((log) => (
                <tr key={log.id} style={{ borderTop: '1px solid hsl(40 20% 88%)', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(40 33% 99%)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '2rem', height: '2rem', backgroundColor: 'hsl(174 62% 32% / 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(174 62% 32%)', flexShrink: 0 }}>
                        {log.admin[0]}
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', whiteSpace: 'nowrap' }}>{log.admin}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '2rem', height: '2rem', backgroundColor: log.iconBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <log.icon style={{ height: '1rem', width: '1rem', color: log.iconColor }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.25rem', whiteSpace: 'nowrap' }}>{log.action}</p>
                        {getActionBadge(log.type)}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'hsl(200 25% 15%)', whiteSpace: 'nowrap' }}>{log.affectedUser}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'hsl(200 15% 45%)', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                  <td style={{ padding: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', maxWidth: '380px' }}>{log.notes}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid hsl(40 20% 88%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
            Showing <strong>1</strong> to <strong>{filtered.length}</strong> of <strong>{filtered.length}</strong> results
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button disabled style={{ padding: '0.5rem 1rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.375rem', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: '500', cursor: 'not-allowed', color: 'hsl(200 15% 55%)', opacity: 0.5 }}>Previous</button>
            <button style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '0.375rem', backgroundColor: 'hsl(174 62% 32%)', color: 'white', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>1</button>
            <button disabled style={{ padding: '0.5rem 1rem', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.375rem', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: '500', cursor: 'not-allowed', color: 'hsl(200 15% 55%)', opacity: 0.5 }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAudit;