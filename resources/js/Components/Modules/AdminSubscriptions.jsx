import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import Header from "@/Components/Layouts/Header";
import Footer from "@/Components/Layouts/Footer";

// Icon components (reuse from previous files)
const Users = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CreditCard = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const BarChart = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

const AdminSubscriptions = ({ subscriptions: initialSubscriptions }) => {
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null);

  // Mock subscription data
  const mockSubscriptions = initialSubscriptions || [
    {
      id: 'SUB-7821',
      user_name: 'Kwame Mensah',
      user_email: 'kwame.mensah@example.com',
      user_role: 'Agent',
      current_plan: 'Premium Plan',
      monthly_price: 99.00,
      renewal_date: '2024-03-14',
      status: 'Active',
      payment_method: 'Mobile Money - MTN',
      started_date: '2023-09-14',
      total_paid: 495.00
    },
    {
      id: 'SUB-7820',
      user_name: 'Abena Osei',
      user_email: 'abena.osei@example.com',
      user_role: 'Landlord',
      current_plan: 'Premium Plan',
      monthly_price: 99.00,
      renewal_date: '2024-02-20',
      status: 'Active',
      payment_method: 'Mobile Money - MTN',
      started_date: '2023-08-20',
      total_paid: 594.00
    },
    {
      id: 'SUB-7819',
      user_name: 'Kofi Asante',
      user_email: 'kofi.asante@example.com',
      user_role: 'Agent',
      current_plan: 'Business Plan',
      monthly_price: 149.00,
      renewal_date: '2024-02-25',
      status: 'Cancelled',
      payment_method: 'Mobile Money - Vodafone',
      started_date: '2023-11-25',
      total_paid: 447.00,
      cancellation_date: '2024-01-25'
    },
    {
      id: 'SUB-7818',
      user_name: 'Ama Serwaa',
      user_email: 'ama.serwaa@example.com',
      user_role: 'Landlord',
      current_plan: 'Starter Plan',
      monthly_price: 49.00,
      renewal_date: '2024-02-18',
      status: 'Expired',
      payment_method: 'Mobile Money - AirtelTigo',
      started_date: '2023-10-18',
      total_paid: 196.00,
      expiry_date: '2024-02-18'
    },
    {
      id: 'SUB-7817',
      user_name: 'Nana Addo',
      user_email: 'nana.addo@example.com',
      user_role: 'Agent',
      current_plan: 'Premium Plan',
      monthly_price: 99.00,
      renewal_date: '2024-03-01',
      status: 'Active',
      payment_method: 'Mobile Money - MTN',
      started_date: '2023-07-01',
      total_paid: 792.00
    },
    {
      id: 'SUB-7816',
      user_name: 'Kwabena Owusu',
      user_email: 'kwabena.owusu@example.com',
      user_role: 'Agent',
      current_plan: 'Starter Plan',
      monthly_price: 49.00,
      renewal_date: '2024-02-22',
      status: 'Active',
      payment_method: 'Mobile Money - Vodafone',
      started_date: '2023-11-22',
      total_paid: 147.00
    },
  ];

  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = searchQuery === "" || 
      sub.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.user_email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "" || sub.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPlan = planFilter === "" || sub.current_plan.toLowerCase().includes(planFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusBadge = (status) => {
    const styles = {
      Active: {
        bg: 'hsl(152 60% 95%)',
        color: 'hsl(152 60% 35%)',
        border: 'hsl(152 60% 85%)'
      },
      Cancelled: {
        bg: 'hsl(0 0% 95%)',
        color: 'hsl(0 0% 45%)',
        border: 'hsl(0 0% 85%)'
      },
      Expired: {
        bg: 'hsl(0 70% 95%)',
        color: 'hsl(0 70% 45%)',
        border: 'hsl(0 70% 85%)'
      }
    };

    const style = styles[status] || styles.Active;

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

  const getPlanBadge = (plan) => {
    const colors = {
      'Starter Plan': { bg: 'hsl(214 100% 95%)', color: 'hsl(214 100% 40%)' },
      'Premium Plan': { bg: 'hsl(271 81% 95%)', color: 'hsl(271 81% 56%)' },
      'Business Plan': { bg: 'hsl(174 62% 95%)', color: 'hsl(174 62% 32%)' }
    };

    const color = colors[plan] || colors['Starter Plan'];

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.625rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: color.bg,
        color: color.color,
        borderRadius: '9999px'
      }}>
        {plan}
      </span>
    );
  };

  const handleCancelSubscription = (sub) => {
    setSelectedSubscription(sub);
    setActionType('cancel');
    setShowActionModal(true);
  };

  const handleUpgradePlan = (sub) => {
    setSelectedSubscription(sub);
    setActionType('upgrade');
    setShowActionModal(true);
  };

  const handleGrantFreeMonth = (sub) => {
    setSelectedSubscription(sub);
    setActionType('free_month');
    setShowActionModal(true);
  };

  const handleSuspendAccount = (sub) => {
    setSelectedSubscription(sub);
    setActionType('suspend');
    setShowActionModal(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPlanFilter("");
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

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        {/* <Header /> */}

        <main style={{ flex: 1, padding: '2rem 1rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            {/* <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
                Subscription Management
              </h1>
              <p style={{ color: 'hsl(200 15% 45%)' }}>
                Manage user subscriptions and plans
              </p>
            </div> */}

            {/* Navigation Tabs */}
            {/* <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.5rem',
              backgroundColor: 'hsl(40 30% 94%)',
              padding: '0.25rem',
              borderRadius: '0.75rem',
              marginBottom: '2rem'
            }}>
              {[
                { id: 'overview', label: 'Overview', icon: BarChart, href: '/admin' },
                { id: 'payments', label: 'Payments', icon: CreditCard, href: '/admin/payments' },
                { id: 'subscriptions', label: 'Subscriptions', icon: Users, href: '/admin/subscriptions' },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp, href: '/admin/analytics' },
                { id: 'audit', label: 'Audit Log', icon: FileText, href: '/admin/audit' },
              ].map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.href}
                  style={{
                    padding: '0.75rem 1rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                    color: activeTab === tab.id ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                    boxShadow: activeTab === tab.id ? '0 1px 2px 0 hsl(200 25% 15% / 0.05)' : 'none',
                    textDecoration: 'none'
                  }}
                >
                  <tab.icon style={{ height: '1rem', width: '1rem' }} />
                  {tab.label}
                </Link>
              ))}
            </div> */}

            {/* Summary Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                backgroundColor: 'white',
                border: '1px solid hsl(40 20% 88%)',
                borderRadius: '0.75rem',
                padding: '1.25rem'
              }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Active
                </p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'hsl(152 60% 40%)', marginBottom: '0.25rem' }}>
                  {subscriptions.filter(s => s.status === 'Active').length}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                  Active subscriptions
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '1px solid hsl(40 20% 88%)',
                borderRadius: '0.75rem',
                padding: '1.25rem'
              }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Cancelled
                </p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'hsl(0 0% 45%)', marginBottom: '0.25rem' }}>
                  {subscriptions.filter(s => s.status === 'Cancelled').length}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                  Cancelled this month
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '1px solid hsl(40 20% 88%)',
                borderRadius: '0.75rem',
                padding: '1.25rem'
              }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Expired
                </p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'hsl(0 70% 45%)', marginBottom: '0.25rem' }}>
                  {subscriptions.filter(s => s.status === 'Expired').length}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                  Need renewal
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '1px solid hsl(40 20% 88%)',
                borderRadius: '0.75rem',
                padding: '1.25rem'
              }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  MRR
                </p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'hsl(174 62% 32%)', marginBottom: '0.25rem' }}>
                  GH₵{subscriptions.filter(s => s.status === 'Active').reduce((acc, s) => acc + s.monthly_price, 0).toLocaleString()}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                  Monthly recurring revenue
                </p>
              </div>
            </div>

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
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
                      placeholder="User name, email, ID..."
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
                    <option value="active">Active</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                {/* Plan Filter */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
                    Plan
                  </label>
                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">All Plans</option>
                    <option value="starter">Starter Plan</option>
                    <option value="premium">Premium Plan</option>
                    <option value="business">Business Plan</option>
                  </select>
                </div>
              </div>

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
            </div>

            {/* Subscriptions Table */}
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
                        User
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Current Plan
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Renewal Date
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Status
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Payment Method
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 45%)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscriptions.map((sub, index) => (
                      <tr
                        key={sub.id}
                        style={{
                          borderBottom: index < filteredSubscriptions.length - 1 ? '1px solid hsl(40 20% 88%)' : 'none',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 33% 99%)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '1rem' }}>
                          <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.125rem' }}>
                              {sub.user_name}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', marginBottom: '0.125rem' }}>
                              {sub.user_email}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'hsl(174 62% 32%)', fontWeight: '500' }}>
                              {sub.id}
                            </p>
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div>
                            {getPlanBadge(sub.current_plan)}
                            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginTop: '0.25rem' }}>
                              GH₵{sub.monthly_price.toFixed(2)}/month
                            </p>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'hsl(200 25% 15%)' }}>
                          {new Date(sub.renewal_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          {getStatusBadge(sub.status)}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                          {sub.payment_method}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {sub.status === 'Active' && (
                              <>
                                <button
                                  onClick={() => handleCancelSubscription(sub)}
                                  style={{
                                    padding: '0.375rem 0.75rem',
                                    border: '1px solid hsl(0 0% 70%)',
                                    borderRadius: '0.375rem',
                                    backgroundColor: 'white',
                                    color: 'hsl(0 0% 45%)',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <X style={{ height: '0.875rem', width: '0.875rem', display: 'inline', marginRight: '0.25rem' }} />
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleUpgradePlan(sub)}
                                  style={{
                                    padding: '0.375rem 0.75rem',
                                    border: '1px solid hsl(174 62% 32%)',
                                    borderRadius: '0.375rem',
                                    backgroundColor: 'white',
                                    color: 'hsl(174 62% 32%)',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <TrendingUpIcon style={{ height: '0.875rem', width: '0.875rem', display: 'inline', marginRight: '0.25rem' }} />
                                  Upgrade
                                </button>
                                <button
                                  onClick={() => handleGrantFreeMonth(sub)}
                                  style={{
                                    padding: '0.375rem 0.75rem',
                                    border: '1px solid hsl(271 81% 56%)',
                                    borderRadius: '0.375rem',
                                    backgroundColor: 'white',
                                    color: 'hsl(271 81% 56%)',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Gift style={{ height: '0.875rem', width: '0.875rem', display: 'inline', marginRight: '0.25rem' }} />
                                  Free Month
                                </button>
                                <button
                                  onClick={() => handleSuspendAccount(sub)}
                                  style={{
                                    padding: '0.375rem 0.75rem',
                                    border: '1px solid hsl(0 70% 50%)',
                                    borderRadius: '0.375rem',
                                    backgroundColor: 'white',
                                    color: 'hsl(0 70% 50%)',
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Ban style={{ height: '0.875rem', width: '0.875rem', display: 'inline', marginRight: '0.25rem' }} />
                                  Suspend
                                </button>
                              </>
                            )}
                            {sub.status !== 'Active' && (
                              <button
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  border: '1px solid hsl(40 20% 88%)',
                                  borderRadius: '0.375rem',
                                  backgroundColor: 'white',
                                  color: 'hsl(174 62% 32%)',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  cursor: 'pointer'
                                }}
                              >
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
                  Showing <span style={{ fontWeight: '500' }}>1</span> to <span style={{ fontWeight: '500' }}>{filteredSubscriptions.length}</span> of <span style={{ fontWeight: '500' }}>{filteredSubscriptions.length}</span> results
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

                  <button style={{
                    padding: '0.5rem 0.875rem',
                    border: '1px solid hsl(40 20% 88%)',
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

        {/* Action Modal */}
        {showActionModal && selectedSubscription && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '1rem'
            }}
            onClick={() => setShowActionModal(false)}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                maxWidth: '500px',
                width: '100%',
                padding: '2rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'hsl(200 25% 15%)', marginBottom: '1rem' }}>
                {actionType === 'cancel' && 'Cancel Subscription'}
                {actionType === 'upgrade' && 'Upgrade Plan'}
                {actionType === 'free_month' && 'Grant Free Month'}
                {actionType === 'suspend' && 'Suspend Account'}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '1.5rem' }}>
                {actionType === 'cancel' && `Are you sure you want to cancel the subscription for ${selectedSubscription.user_name}?`}
                {actionType === 'upgrade' && `Select a new plan for ${selectedSubscription.user_name}`}
                {actionType === 'free_month' && `Grant a free month to ${selectedSubscription.user_name}?`}
                {actionType === 'suspend' && `Are you sure you want to suspend ${selectedSubscription.user_name}'s account?`}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={() => setShowActionModal(false)}
                  style={{
                    padding: '0.625rem 1.25rem',
                    border: '1px solid hsl(40 20% 88%)',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    color: 'hsl(200 25% 15%)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Action:', actionType, 'for subscription:', selectedSubscription.id);
                    setShowActionModal(false);
                    alert(`${actionType} action processed successfully`);
                  }}
                  style={{
                    padding: '0.625rem 1.25rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminSubscriptions;