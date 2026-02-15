import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import Header from "@/Components/Layouts/Header";
import Footer from "@/Components/Layouts/Footer";
import RefundModal from "@/Components/Modules/RefundModal";

// Icon components
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

const FileText = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

const AdminPayments = ({ transactions: initialTransactions }) => {
  const [activeTab, setActiveTab] = useState("payments");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);

  // Mock transaction data
  const mockTransactions = initialTransactions || [
    {
      id: 'TXN-001923',
      user_name: 'Kwame Mensah',
      user_role: 'Agent',
      payment_type: 'Subscription',
      plan: 'Premium Plan',
      amount: 99.00,
      status: 'Success',
      date: '2024-02-14 10:30:00',
      payment_method: 'Mobile Money - MTN',
      email: 'kwame.mensah@example.com'
    },
    {
      id: 'TXN-001922',
      user_name: 'Ama Serwaa',
      user_role: 'Landlord',
      payment_type: 'Boost',
      listing_title: '2BR Apartment - Tema',
      listing_id: 'LST-4521',
      amount: 50.00,
      status: 'Success',
      date: '2024-02-14 09:15:00',
      payment_method: 'Mobile Money - Vodafone',
      email: 'ama.serwaa@example.com'
    },
    {
      id: 'TXN-001921',
      user_name: 'Yaw Boateng',
      user_role: 'Agent',
      payment_type: 'Lead Unlock',
      lead_property: 'Luxury Villa - East Legon',
      lead_id: 'LEAD-8832',
      amount: 30.00,
      status: 'Success',
      date: '2024-02-14 08:45:00',
      payment_method: 'Mobile Money - MTN',
      email: 'yaw.boateng@example.com'
    },
    {
      id: 'TXN-001920',
      user_name: 'Kofi Asante',
      user_role: 'Agent',
      payment_type: 'Subscription',
      plan: 'Business Plan',
      amount: 149.00,
      status: 'Failed',
      date: '2024-02-14 07:20:00',
      payment_method: 'Mobile Money - AirtelTigo',
      email: 'kofi.asante@example.com',
      failure_reason: 'Insufficient funds'
    },
    {
      id: 'TXN-001919',
      user_name: 'Abena Osei',
      user_role: 'Landlord',
      payment_type: 'Subscription',
      plan: 'Premium Plan',
      amount: 99.00,
      status: 'Refunded',
      date: '2024-02-13 16:30:00',
      payment_method: 'Mobile Money - MTN',
      email: 'abena.osei@example.com',
      refund_reason: 'Duplicate charge'
    },
    {
      id: 'TXN-001918',
      user_name: 'Nana Addo',
      user_role: 'Agent',
      payment_type: 'Boost',
      listing_title: '3BR House - Kumasi',
      listing_id: 'LST-3398',
      amount: 75.00,
      status: 'Pending',
      date: '2024-02-13 15:10:00',
      payment_method: 'Mobile Money - Vodafone',
      email: 'nana.addo@example.com'
    },
    {
      id: 'TXN-001917',
      user_name: 'Efua Mensah',
      user_role: 'Landlord',
      payment_type: 'Lead Unlock',
      lead_property: 'Studio Apartment - Accra',
      lead_id: 'LEAD-7621',
      amount: 25.00,
      status: 'Success',
      date: '2024-02-13 14:22:00',
      payment_method: 'Mobile Money - MTN',
      email: 'efua.mensah@example.com'
    },
    {
      id: 'TXN-001916',
      user_name: 'Kwabena Owusu',
      user_role: 'Agent',
      payment_type: 'Subscription',
      plan: 'Starter Plan',
      amount: 49.00,
      status: 'Success',
      date: '2024-02-13 11:45:00',
      payment_method: 'Mobile Money - MTN',
      email: 'kwabena.owusu@example.com'
    },
  ];

  const [transactions, setTransactions] = useState(mockTransactions);

  // Filter transactions
  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = searchQuery === "" || 
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.user_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "" || txn.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === "" || txn.payment_type.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status) => {
    const styles = {
      Success: {
        bg: 'hsl(152 60% 95%)',
        color: 'hsl(152 60% 35%)',
        border: 'hsl(152 60% 85%)'
      },
      Failed: {
        bg: 'hsl(0 70% 95%)',
        color: 'hsl(0 70% 45%)',
        border: 'hsl(0 70% 85%)'
      },
      Refunded: {
        bg: 'hsl(262 83% 95%)',
        color: 'hsl(262 83% 48%)',
        border: 'hsl(262 83% 85%)'
      },
      Pending: {
        bg: 'hsl(40 30% 94%)',
        color: 'hsl(38 92% 50%)',
        border: 'hsl(40 20% 88%)'
      }
    };

    const style = styles[status] || styles.Pending;

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.625rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: style.bg,
        color: style.color,
        borderRadius: '9999px',
        border: `1px solid ${style.border}`
      }}>
        {status}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const isAgent = role === 'Agent';
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.625rem',
        fontSize: '0.75rem',
        fontWeight: '500',
        backgroundColor: isAgent ? 'hsl(174 62% 95%)' : 'hsl(214 100% 95%)',
        color: isAgent ? 'hsl(174 62% 32%)' : 'hsl(214 100% 40%)',
        borderRadius: '9999px'
      }}>
        {role}
      </span>
    );
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowRefundModal(true);
  };

  const handleRefund = (transactionId) => {
    // Mock refund processing
    console.log('Processing refund for:', transactionId);
    setShowRefundModal(false);
  };

  const handleMarkResolved = (transactionId) => {
    // Mock mark as resolved
    console.log('Marking as resolved:', transactionId);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setTypeFilter("");
    setDateFilter("all");
  };

  const exportToCSV = () => {
    console.log('Exporting transactions to CSV...');
    alert('CSV export functionality would be implemented here');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
        }
        h1, h2, h3, h4, h5, h6 {
          font-weight: 600;
          margin: 0;
        }
        p {
          margin: 0;
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fcfaf8' }}>
        {/* <Header /> */}

        <main style={{ flex: 1, padding: '2rem 1rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Filters */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid hsl(40 20% 88%)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                {/* Search */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
                    Search
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Transaction ID, User..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem 0.625rem 2.5rem',
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

                {/* Status Filter */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">All Statuses</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
                    Payment Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">All Types</option>
                    <option value="subscription">Subscription</option>
                    <option value="boost">Boost</option>
                    <option value="lead unlock">Lead Unlock</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
                    Date Range
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <button
                  onClick={clearFilters}
                  style={{
                    fontSize: '0.875rem',
                    color: 'hsl(200 15% 45%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Clear all filters
                </button>

                <button
                  onClick={exportToCSV}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1rem',
                    backgroundColor: 'white',
                    border: '1px solid hsl(40 20% 88%)',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'hsl(200 25% 15%)',
                    cursor: 'pointer'
                  }}
                >
                  <Download style={{ height: '1rem', width: '1rem' }} />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Transactions Table */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid hsl(40 20% 88%)',
              borderRadius: '0.75rem',
              overflow: 'hidden'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: 'hsl(40 33% 99%)', borderBottom: '1px solid hsl(40 20% 88%)' }}>
                    <tr>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Transaction ID
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        User
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Role
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Type
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Amount
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Status
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Date
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((txn, index) => (
                      <tr
                        key={txn.id}
                        style={{
                          borderBottom: index < filteredTransactions.length - 1 ? '1px solid hsl(40 20% 88%)' : 'none',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 33% 99%)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(174 62% 32%)' }}>
                          {txn.id}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.125rem' }}>
                              {txn.user_name}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                              {txn.email}
                            </p>
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {getRoleBadge(txn.user_role)}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.125rem' }}>
                              {txn.payment_type}
                            </p>
                            {txn.plan && (
                              <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                                {txn.plan}
                              </p>
                            )}
                            {txn.listing_title && (
                              <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                                {txn.listing_title}
                              </p>
                            )}
                            {txn.lead_property && (
                              <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                                {txn.lead_property}
                              </p>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)' }}>
                          GH₵{txn.amount.toFixed(2)}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {getStatusBadge(txn.status)}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                          {new Date(txn.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleViewTransaction(txn)}
                              style={{
                                padding: '0.375rem 0.75rem',
                                border: '1px solid hsl(40 20% 88%)',
                                borderRadius: '0.375rem',
                                backgroundColor: 'white',
                                color: 'hsl(174 62% 32%)',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              <Eye style={{ height: '0.875rem', width: '0.875rem' }} />
                              View
                            </button>
                            {txn.status === 'Success' && (
                              <button
                                onClick={() => handleViewTransaction(txn)}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  border: '1px solid hsl(38 92% 50%)',
                                  borderRadius: '0.375rem',
                                  backgroundColor: 'white',
                                  color: 'hsl(38 92% 50%)',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <DollarSign style={{ height: '0.875rem', width: '0.875rem' }} />
                                Refund
                              </button>
                            )}
                            {txn.status === 'Failed' && (
                              <button
                                onClick={() => handleMarkResolved(txn.id)}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  border: '1px solid hsl(152 60% 40%)',
                                  borderRadius: '0.375rem',
                                  backgroundColor: 'white',
                                  color: 'hsl(152 60% 40%)',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <CheckCircle style={{ height: '0.875rem', width: '0.875rem' }} />
                                Resolve
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
              <div style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid hsl(40 20% 88%)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                  Showing <span style={{ fontWeight: '500' }}>1</span> to <span style={{ fontWeight: '500' }}>8</span> of <span style={{ fontWeight: '500' }}>{filteredTransactions.length}</span> results
                </p>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{
                    padding: '0.5rem',
                    border: '1px solid hsl(40 20% 88%)',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                    color: 'hsl(200 15% 45%)',
                    cursor: 'pointer'
                  }}>
                    <ChevronLeft style={{ height: '1.25rem', width: '1.25rem' }} />
                  </button>

                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      style={{
                        padding: '0.5rem 0.875rem',
                        border: '1px solid hsl(40 20% 88%)',
                        borderRadius: '0.375rem',
                        backgroundColor: page === 1 ? 'hsl(174 62% 32%)' : 'white',
                        color: page === 1 ? 'white' : 'hsl(200 15% 45%)',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button style={{
                    padding: '0.5rem',
                    border: '1px solid hsl(40 20% 88%)',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                    color: 'hsl(200 15% 45%)',
                    cursor: 'pointer'
                  }}>
                    <ChevronRight style={{ height: '1.25rem', width: '1.25rem' }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />

        {/* Refund Modal */}
        {showRefundModal && selectedTransaction && (
          <RefundModal
            transaction={selectedTransaction}
            onClose={() => setShowRefundModal(false)}
            onRefund={handleRefund}
          />
        )}
      </div>
    </>
  );
};

export default AdminPayments;