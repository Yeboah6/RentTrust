import { useState } from "react";
import Header from "@/Components/Layouts/Header";
import Footer from "@/Components/Layouts/Footer";
import { Link } from "@inertiajs/react";

// Icons
const FileText = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Search = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Filter = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const Download = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const BarChart = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const CreditCard = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const Users = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const TrendingUp = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const RefreshCw = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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

const Edit = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const AdminAudit = ({ auditLogs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [adminFilter, setAdminFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const mockAuditLogs = [
    {
      id: 1,
      admin: 'Super Admin',
      action: 'Refund processed',
      affectedUser: 'Kwame Mensah',
      timestamp: '2024-02-14 10:30:45',
      notes: 'Refund processed for TXN-1923 - Duplicate charge',
      type: 'refund',
      icon: RefreshCw,
      iconBg: 'hsl(40 30% 94%)',
      iconColor: 'hsl(40 90% 50%)'
    },
    {
      id: 2,
      admin: 'Admin User',
      action: 'Subscription extended',
      affectedUser: 'Ama Serwaa',
      timestamp: '2024-02-14 09:15:22',
      notes: 'Subscription manually extended by 1 month - Customer service compensation',
      type: 'subscription',
      icon: CheckCircle,
      iconBg: 'hsl(152 60% 95%)',
      iconColor: 'hsl(152 60% 40%)'
    },
    {
      id: 3,
      admin: 'Super Admin',
      action: 'User account suspended',
      affectedUser: 'Kofi Asante',
      timestamp: '2024-02-14 08:45:10',
      notes: 'Account suspended due to fraudulent activity - Multiple reports',
      type: 'suspension',
      icon: XCircle,
      iconBg: 'hsl(0 70% 95%)',
      iconColor: 'hsl(0 70% 50%)'
    },
    {
      id: 4,
      admin: 'Admin User',
      action: 'Payment verified',
      affectedUser: 'Yaw Boateng',
      timestamp: '2024-02-13 16:20:33',
      notes: 'Manual payment verification for TXN-1918 - Bank confirmation received',
      type: 'payment',
      icon: CheckCircle,
      iconBg: 'hsl(152 60% 95%)',
      iconColor: 'hsl(152 60% 40%)'
    },
    {
      id: 5,
      admin: 'Super Admin',
      action: 'Listing approved',
      affectedUser: 'Abena Osei',
      timestamp: '2024-02-13 14:10:55',
      notes: 'Property listing #4521 approved after review',
      type: 'listing',
      icon: CheckCircle,
      iconBg: 'hsl(152 60% 95%)',
      iconColor: 'hsl(152 60% 40%)'
    },
    {
      id: 6,
      admin: 'Admin User',
      action: 'Agent verified',
      affectedUser: 'Akua Adjei',
      timestamp: '2024-02-13 12:30:18',
      notes: 'Agent verification approved - All documents validated',
      type: 'verification',
      icon: CheckCircle,
      iconBg: 'hsl(152 60% 95%)',
      iconColor: 'hsl(152 60% 40%)'
    },
    {
      id: 7,
      admin: 'Super Admin',
      action: 'Subscription cancelled',
      affectedUser: 'Kwesi Nyarko',
      timestamp: '2024-02-13 11:15:40',
      notes: 'Subscription cancelled at user request - No refund issued',
      type: 'subscription',
      icon: XCircle,
      iconBg: 'hsl(0 70% 95%)',
      iconColor: 'hsl(0 70% 50%)'
    },
    {
      id: 8,
      admin: 'Admin User',
      action: 'Plan upgraded',
      affectedUser: 'Efua Mensah',
      timestamp: '2024-02-12 15:45:27',
      notes: 'User plan upgraded from Basic to Premium - Manual override',
      type: 'subscription',
      icon: TrendingUp,
      iconBg: 'hsl(214 100% 95%)',
      iconColor: 'hsl(214 100% 50%)'
    },
    {
      id: 9,
      admin: 'Super Admin',
      action: 'Listing removed',
      affectedUser: 'Nana Osei',
      timestamp: '2024-02-12 13:20:15',
      notes: 'Property listing #4498 removed - Violation of terms',
      type: 'listing',
      icon: XCircle,
      iconBg: 'hsl(0 70% 95%)',
      iconColor: 'hsl(0 70% 50%)'
    },
    {
      id: 10,
      admin: 'Admin User',
      action: 'Report resolved',
      affectedUser: 'Adwoa Boateng',
      timestamp: '2024-02-12 10:30:52',
      notes: 'User report #892 marked as resolved - Issue addressed',
      type: 'report',
      icon: CheckCircle,
      iconBg: 'hsl(152 60% 95%)',
      iconColor: 'hsl(152 60% 40%)'
    },
    {
      id: 11,
      admin: 'Super Admin',
      action: 'Free month granted',
      affectedUser: 'Kwame Asare',
      timestamp: '2024-02-11 14:25:38',
      notes: 'Free month subscription granted - Service outage compensation',
      type: 'subscription',
      icon: CheckCircle,
      iconBg: 'hsl(152 60% 95%)',
      iconColor: 'hsl(152 60% 40%)'
    },
    {
      id: 12,
      admin: 'Admin User',
      action: 'Account unsuspended',
      affectedUser: 'Esi Owusu',
      timestamp: '2024-02-11 11:10:20',
      notes: 'Account unsuspended - User appeal approved',
      type: 'suspension',
      icon: CheckCircle,
      iconBg: 'hsl(152 60% 95%)',
      iconColor: 'hsl(152 60% 40%)'
    },
    {
      id: 13,
      admin: 'Super Admin',
      action: 'Payment disputed',
      affectedUser: 'Yaa Mensah',
      timestamp: '2024-02-10 16:45:12',
      notes: 'Payment dispute opened for TXN-1889 - Under investigation',
      type: 'payment',
      icon: AlertCircle,
      iconBg: 'hsl(40 30% 94%)',
      iconColor: 'hsl(40 90% 50%)'
    },
    {
      id: 14,
      admin: 'Admin User',
      action: 'Data exported',
      affectedUser: 'Kojo Mensah',
      timestamp: '2024-02-10 09:30:45',
      notes: 'User data export completed - GDPR request fulfilled',
      type: 'data',
      icon: Download,
      iconBg: 'hsl(214 100% 95%)',
      iconColor: 'hsl(214 100% 50%)'
    },
    {
      id: 15,
      admin: 'Super Admin',
      action: 'Settings updated',
      affectedUser: 'Ama Darko',
      timestamp: '2024-02-09 13:15:33',
      notes: 'Account settings updated by admin - Email preferences modified',
      type: 'settings',
      icon: Edit,
      iconBg: 'hsl(261 51% 95%)',
      iconColor: 'hsl(261 51% 51%)'
    }
  ];

  const getActionBadge = (type) => {
    const styles = {
      'refund': { bg: 'hsl(40 30% 94%)', color: 'hsl(40 90% 40%)', label: 'Refund' },
      'subscription': { bg: 'hsl(214 100% 95%)', color: 'hsl(214 100% 40%)', label: 'Subscription' },
      'suspension': { bg: 'hsl(0 70% 95%)', color: 'hsl(0 70% 50%)', label: 'Suspension' },
      'payment': { bg: 'hsl(152 60% 95%)', color: 'hsl(152 60% 35%)', label: 'Payment' },
      'listing': { bg: 'hsl(271 76% 95%)', color: 'hsl(271 76% 40%)', label: 'Listing' },
      'verification': { bg: 'hsl(173 58% 95%)', color: 'hsl(173 58% 35%)', label: 'Verification' },
      'report': { bg: 'hsl(330 81% 95%)', color: 'hsl(330 81% 45%)', label: 'Report' },
      'data': { bg: 'hsl(261 51% 95%)', color: 'hsl(261 51% 45%)', label: 'Data' },
      'settings': { bg: 'hsl(200 15% 95%)', color: 'hsl(200 15% 45%)', label: 'Settings' }
    };
    
    const style = styles[type] || styles.settings;
    
    return (
      <span style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: style.bg,
        color: style.color
      }}>
        {style.label}
      </span>
    );
  };

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = !searchQuery || 
      log.admin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.affectedUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.notes.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = !actionFilter || log.type === actionFilter;
    const matchesAdmin = !adminFilter || log.admin === adminFilter;
    
    return matchesSearch && matchesAction && matchesAdmin;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; box-sizing: border-box; }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        {/* <Header /> */}

        <main style={{ flex: 1, padding: '2rem 1rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

            {/* Filters */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid hsl(40 20% 88%)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {/* Search */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'hsl(200 25% 15%)',
                    marginBottom: '0.5rem'
                  }}>Search</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Search logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        paddingLeft: '2.5rem',
                        paddingRight: '1rem',
                        paddingTop: '0.5rem',
                        paddingBottom: '0.5rem',
                        border: '1px solid hsl(40 20% 88%)',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                    />
                    <Search style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: '1.25rem',
                      width: '1.25rem',
                      color: 'hsl(200 15% 45%)'
                    }} />
                  </div>
                </div>

                {/* Action Filter */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'hsl(200 25% 15%)',
                    marginBottom: '0.5rem'
                  }}>Action Type</label>
                  <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
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

                {/* Admin Filter */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'hsl(200 25% 15%)',
                    marginBottom: '0.5rem'
                  }}>Admin</label>
                  <select
                    value={adminFilter}
                    onChange={(e) => setAdminFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="">All Admins</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin User">Admin User</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'hsl(200 25% 15%)',
                    marginBottom: '0.5rem'
                  }}>Date Range</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActionFilter('');
                    setAdminFilter('');
                    setDateFilter('all');
                  }}
                  style={{
                    fontSize: '0.875rem',
                    color: 'hsl(200 15% 45%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Clear all filters
                </button>
                <button style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'white',
                  border: '1px solid hsl(40 20% 88%)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'hsl(200 25% 15%)',
                  cursor: 'pointer'
                }}>
                  <Download style={{ height: '1rem', width: '1rem' }} />
                  Export Logs
                </button>
              </div>
            </div>

            {/* Results Summary */}
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                Showing <span style={{ fontWeight: '600', color: 'hsl(200 25% 15%)' }}>{filteredLogs.length}</span> of <span style={{ fontWeight: '600', color: 'hsl(200 25% 15%)' }}>{mockAuditLogs.length}</span> audit logs
              </p>
            </div>

            {/* Audit Log Table */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              border: '1px solid hsl(40 20% 88%)',
              overflow: 'hidden'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: 'hsl(40 33% 99%)' }}>
                    <tr>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'hsl(200 15% 45%)', textTransform: 'uppercase' }}>Admin Name</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'hsl(200 15% 45%)', textTransform: 'uppercase' }}>Action</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'hsl(200 15% 45%)', textTransform: 'uppercase' }}>Affected User</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'hsl(200 15% 45%)', textTransform: 'uppercase' }}>Timestamp</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'hsl(200 15% 45%)', textTransform: 'uppercase' }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} style={{ borderTop: '1px solid hsl(40 20% 88%)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '2rem',
                              height: '2rem',
                              backgroundColor: 'hsl(174 62% 32% / 0.1)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: 'hsl(174 62% 32%)'
                            }}>
                              {log.admin[0]}
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)' }}>
                              {log.admin}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '2rem',
                              height: '2rem',
                              backgroundColor: log.iconBg,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <log.icon style={{ height: '1rem', width: '1rem', color: log.iconColor }} />
                            </div>
                            <div>
                              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)' }}>
                                {log.action}
                              </p>
                              {getActionBadge(log.type)}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                          {log.affectedUser}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                          {log.timestamp}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', maxWidth: '400px' }}>
                            {log.notes}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid hsl(40 20% 88%)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                  Showing <span style={{ fontWeight: '500' }}>1</span> to <span style={{ fontWeight: '500' }}>15</span> of <span style={{ fontWeight: '500' }}>15</span> results
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid hsl(40 20% 88%)',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: 'hsl(200 15% 45%)'
                  }} disabled>
                    Previous
                  </button>
                  <button style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    backgroundColor: 'hsl(174 62% 32%)',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    1
                  </button>
                  <button style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid hsl(40 20% 88%)',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: 'hsl(200 15% 45%)'
                  }} disabled>
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AdminAudit;