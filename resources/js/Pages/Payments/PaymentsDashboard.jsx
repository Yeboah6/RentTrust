import { useState } from "react";
import { Link } from "@inertiajs/react";
import Header from "@/Components/Layouts/Header";
import Footer from "@/Components/Layouts/Footer";
import AdminKpiCard from "@/Components/Modules/AdminKpiCard";
import AdminPayments from "@/Components/Modules/AdminPayments";
import AdminSubscriptions from "@/Components/Modules/AdminSubscriptions";
import AdminAnalytics from "@/Components/Modules/AdminAnalytics";
import AdminAudit from "@/Components/Modules/AdminAudit";

// Icon components
const DollarSign = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

const AlertCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Clock = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Zap = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const Key = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const BarChart = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const FileText = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

const AdminDashboard = ({ adminData, revenueData, activityLog }) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [timeFilter, setTimeFilter] = useState("7days");

  const mockAdmin = {
    name: adminData?.fullName || "Super Admin",
    role: "Platform Administrator",
    avatar_url: null,
  };

  // Mock KPI data - in production, this would come from props
  const kpiData = {
    totalRevenue: { value: 284500, change: 12.5, positive: true },
    monthlyRevenue: { value: 42350, change: 8.3, positive: true },
    activeSubscriptions: { value: 1247, change: 5.2, positive: true },
    failedPayments: { value: 23, change: -2.1, positive: false },
    pendingRefunds: { value: 7, amount: 3450 },
    boostPurchases: { value: 342, change: 15.7, positive: true },
    leadUnlocks: { value: 189, change: 22.4, positive: true },
    mrr: { value: 28900, change: 6.8, positive: true },
  };

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      type: 'payment',
      icon: CheckCircle,
      iconBg: 'hsl(152 60% 95%)',
      iconColor: 'hsl(152 60% 40%)',
      title: 'Payment received from Kwame Mensah',
      description: 'Premium Plan subscription - GH₵99.00',
      time: '2 minutes ago'
    },
    {
      id: 2,
      type: 'boost',
      icon: Zap,
      iconBg: 'hsl(271 81% 95%)',
      iconColor: 'hsl(271 81% 56%)',
      title: 'Listing boost purchased',
      description: 'Ama Serwaa - 2BR Apartment Tema - GH₵50.00',
      time: '15 minutes ago'
    },
    {
      id: 3,
      type: 'failed',
      icon: AlertCircle,
      iconBg: 'hsl(0 70% 95%)',
      iconColor: 'hsl(0 70% 50%)',
      title: 'Payment failed',
      description: 'Kofi Asante - Insufficient funds - GH₵149.00',
      time: '1 hour ago'
    },
    {
      id: 4,
      type: 'unlock',
      icon: Key,
      iconBg: 'hsl(314 100% 95%)',
      iconColor: 'hsl(314 100% 47%)',
      title: 'Lead unlocked',
      description: 'Yaw Boateng - Contact info for Luxury Villa East Legon - GH₵30.00',
      time: '2 hours ago'
    },
    {
      id: 5,
      type: 'refund',
      icon: Clock,
      iconBg: 'hsl(40 30% 94%)',
      iconColor: 'hsl(38 92% 50%)',
      title: 'Refund requested',
      description: 'Abena Osei - Duplicate charge - GH₵99.00',
      time: '3 hours ago'
    },
  ];

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
        <Header />

        <main style={{ flex: 1, padding: '2rem 1rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
                    Payments
                  </h1>
                  <p style={{ color: 'hsl(200 15% 45%)' }}>
                    Monitor revenue, subscriptions, and payment metrics
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'white',
                  border: '1px solid hsl(40 20% 88%)',
                  borderRadius: '0.75rem'
                }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'hsl(174 62% 32% / 0.1)',
                    color: 'hsl(174 62% 32%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}>
                    {mockAdmin.name[0]}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)' }}>
                      {mockAdmin.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                      {mockAdmin.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.5rem',
              backgroundColor: 'hsl(40 30% 94%)',
              padding: '0.25rem',
              borderRadius: '0.75rem',
              marginBottom: '2rem'
            }}>
              {['Overview', 'Payments', 'Subscriptions', 'Analytics', 'Audit']
              .map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '0.75rem 1rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    backgroundColor: activeTab === tab ? 'white' : 'transparent',
                    color: activeTab === tab ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                    boxShadow: activeTab === tab ? '0 1px 2px 0 hsl(200 25% 15% / 0.05)' : 'none',
                    textDecoration: 'none'
                  }}
                >
                    {tab === 'Overview' && <BarChart style={{ height: '1rem', width: '1rem' }} />}
                    {tab === 'Payments' && <CreditCard style={{ height: '1rem', width: '1rem' }} />}
                    {tab === 'Subscriptions' && <Users style={{ height: '1rem', width: '1rem' }} />}
                    {tab === 'Analytics' && <TrendingUp style={{ height: '1rem', width: '1rem' }} />}
                    {tab === 'Audit' && <FileText style={{ height: '1rem', width: '1rem' }} />}
                    {tab}
                </button>
              ))}
            </div>

            {/* Time Filter */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{
                display: 'inline-flex',
                gap: '0.25rem',
                backgroundColor: 'white',
                padding: '0.25rem',
                borderRadius: '0.75rem',
                border: '1px solid hsl(40 20% 88%)'
              }}>
                {[
                  { id: '7days', label: 'Last 7 days' },
                  { id: '30days', label: 'Last 30 days' },
                  { id: '12months', label: 'Last 12 months' },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setTimeFilter(filter.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      backgroundColor: timeFilter === filter.id ? 'hsl(174 62% 32%)' : 'transparent',
                      color: timeFilter === filter.id ? 'white' : 'hsl(200 15% 45%)',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'Overview' && (
              <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <AdminKpiCard
                icon={DollarSign}
                iconBg="hsl(271 81% 95%)"
                iconColor="hsl(271 81% 56%)"
                badge="ALL TIME"
                value={`GH₵${kpiData.totalRevenue.value.toLocaleString()}`}
                label="Total Revenue"
                change={kpiData.totalRevenue.change}
                positive={kpiData.totalRevenue.positive}
              />

              <AdminKpiCard
                icon={TrendingUp}
                iconBg="hsl(152 60% 95%)"
                iconColor="hsl(152 60% 40%)"
                badge="THIS MONTH"
                value={`GH₵${kpiData.monthlyRevenue.value.toLocaleString()}`}
                label="Revenue This Month"
                change={kpiData.monthlyRevenue.change}
                positive={kpiData.monthlyRevenue.positive}
              />

              <AdminKpiCard
                icon={CheckCircle}
                iconBg="hsl(214 100% 95%)"
                iconColor="hsl(214 100% 40%)"
                badge="ACTIVE"
                value={kpiData.activeSubscriptions.value.toLocaleString()}
                label="Active Subscriptions"
                change={kpiData.activeSubscriptions.change}
                positive={kpiData.activeSubscriptions.positive}
              />

              <AdminKpiCard
                icon={AlertCircle}
                iconBg="hsl(0 70% 95%)"
                iconColor="hsl(0 70% 50%)"
                badge="FAILED"
                value={kpiData.failedPayments.value}
                label="Failed Payments"
                change={kpiData.failedPayments.change}
                positive={kpiData.failedPayments.positive}
              />

              <AdminKpiCard
                icon={Clock}
                iconBg="hsl(40 30% 94%)"
                iconColor="hsl(38 92% 50%)"
                badge="PENDING"
                value={kpiData.pendingRefunds.value}
                label="Pending Refunds"
                subValue={`GH₵${kpiData.pendingRefunds.amount.toLocaleString()} total amount`}
              />

              <AdminKpiCard
                icon={Zap}
                iconBg="hsl(262 83% 95%)"
                iconColor="hsl(262 83% 58%)"
                badge="THIS MONTH"
                value={kpiData.boostPurchases.value}
                label="Boost Purchases"
                change={kpiData.boostPurchases.change}
                positive={kpiData.boostPurchases.positive}
              />

              <AdminKpiCard
                icon={Key}
                iconBg="hsl(314 100% 95%)"
                iconColor="hsl(314 100% 47%)"
                badge="THIS MONTH"
                value={kpiData.leadUnlocks.value}
                label="Lead Unlock Purchases"
                change={kpiData.leadUnlocks.change}
                positive={kpiData.leadUnlocks.positive}
              />

              <AdminKpiCard
                icon={BarChart}
                iconBg="hsl(173 58% 95%)"
                iconColor="hsl(173 58% 39%)"
                badge="MRR"
                value={`GH₵${kpiData.mrr.value.toLocaleString()}`}
                label="Monthly Recurring Revenue"
                change={kpiData.mrr.change}
                positive={kpiData.mrr.positive}
              />
            </div>

            <div style={{
              backgroundColor: 'white',
              border: '1px solid hsl(40 20% 88%)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '1rem' }}>
                Quick Actions
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <Link
                  href="/admin/payments"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 1rem',
                    backgroundColor: 'hsl(271 81% 95%)',
                    color: 'hsl(271 81% 56%)',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(271 81% 90%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(271 81% 95%)'}
                >
                  <CreditCard style={{ height: '1.25rem', width: '1.25rem' }} />
                  View All Payments
                </Link>

                <Link
                  href="/admin/subscriptions"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 1rem',
                    backgroundColor: 'hsl(214 100% 95%)',
                    color: 'hsl(214 100% 40%)',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(214 100% 90%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(214 100% 95%)'}
                >
                  <Users style={{ height: '1.25rem', width: '1.25rem' }} />
                  Manage Subscriptions
                </Link>

                <button
                  onClick={() => window.location.href = '/admin/payments?filter=refunds'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 1rem',
                    backgroundColor: 'hsl(40 30% 94%)',
                    color: 'hsl(38 92% 50%)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 88%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                >
                  <DollarSign style={{ height: '1.25rem', width: '1.25rem' }} />
                  Process Refunds
                </button>

                <Link
                  href="/admin/analytics"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 1rem',
                    backgroundColor: 'hsl(152 60% 95%)',
                    color: 'hsl(152 60% 40%)',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(152 60% 90%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(152 60% 95%)'}
                >
                  <BarChart style={{ height: '1.25rem', width: '1.25rem' }} />
                  View Analytics
                </Link>
              </div>
            </div>
            </>
            )}
            
            {activeTab === 'Payments' && (
              <AdminPayments />
            )}

            {activeTab === 'Subscriptions' && (
              <AdminSubscriptions />
            )}

            {activeTab === 'Analytics' && (
              <AdminAnalytics />
            )}

            {activeTab === 'Audit' && (
              <AdminAudit />
            )}

            {/* Recent Activity */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid hsl(40 20% 88%)',
              borderRadius: '0.75rem',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid hsl(40 20% 88%)'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'hsl(200 25% 15%)' }}>
                  Recent Activity
                </h3>
              </div>

              <div>
                {recentActivity.map((activity, index) => (
                  <div
                    key={activity.id}
                    style={{
                      padding: '1.5rem',
                      borderBottom: index < recentActivity.length - 1 ? '1px solid hsl(40 20% 88%)' : 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 33% 99%)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <div style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '50%',
                          backgroundColor: activity.iconBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <activity.icon style={{ height: '1.25rem', width: '1.25rem', color: activity.iconColor }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', marginBottom: '0.25rem' }}>
                            {activity.title}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                            {activity.description}
                          </p>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', flexShrink: 0 }}>
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                padding: '1rem 1.5rem',
                backgroundColor: 'hsl(40 33% 99%)',
                borderTop: '1px solid hsl(40 20% 88%)'
              }}>
                <Link
                  href="/admin/audit"
                  style={{
                    fontSize: '0.875rem',
                    color: 'hsl(174 62% 32%)',
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                >
                  View all activity →
                </Link>
              </div>
            </div>
          </div>

          
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AdminDashboard;