import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import Header from "@/Components/Layouts/Header";
import Footer from "@/Components/Layouts/Footer";
import AdminKpiCard from "@/Components/Modules/AdminKpiCard";
import AdminPayments from "@/Components/Modules/AdminPayments";
import AdminSubscriptions from "@/Components/Modules/AdminSubscriptions";
import AdminAnalytics from "@/Components/Modules/AdminAnalytics";
import AdminAudit from "@/Components/Modules/AdminAudit";

// ─── Icons ────────────────────────────────────────────────────────────────────

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

// ─── Activity icon by status ──────────────────────────────────────────────────

const ActivityIcon = ({ status }) => {
  const config = {
    success:  { Icon: CheckCircle, bg: 'hsl(152 60% 94%)', color: 'hsl(152 58% 30%)' },
    failed:   { Icon: AlertCircle, bg: 'hsl(0 65% 95%)',   color: 'hsl(0 63% 40%)' },
    pending:  { Icon: Clock,       bg: 'hsl(220 80% 95%)', color: 'hsl(220 78% 40%)' },
    refunded: { Icon: DollarSign,  bg: 'hsl(38 80% 94%)',  color: 'hsl(36 70% 36%)' },
  }[status] ?? { Icon: Clock, bg: 'hsl(40 30% 94%)', color: 'hsl(200 15% 45%)' };

  return (
    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <config.Icon style={{ height: '1.25rem', width: '1.25rem', color: config.color }} />
    </div>
  );
};

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'Overview',       Icon: BarChart    },
  { id: 'Payments',       Icon: CreditCard  },
  { id: 'Subscriptions',  Icon: Users       },
  { id: 'Analytics',      Icon: TrendingUp  },
  { id: 'Audit',          Icon: FileText    },
];

// ─── Dashboard ────────────────────────────────────────────────────────────────

const AdminDashboard = ({ adminData, kpis, payments, subscriptions, analytics, activity }) => {
  const { auth } = usePage().props;
  const [activeTab, setActiveTab] = useState('Overview');

  const admin = {
    name: adminData?.fullName ?? auth?.super?.name ?? 'Super Admin',
    role: 'Platform Administrator',
  };

  // Safe KPI values with fallback to 0
  const k = kpis ?? {};
  const fmtGhs = n => `GHS ${(Number(n) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; box-sizing: border-box; }
        body { margin: 0; }
        h1, h2, h3, h4, h5, h6, p { margin: 0; }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1, padding: '2rem 1rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

            {/* ── Page header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'hsl(200 25% 12%)', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
                  Payments
                </h1>
                <p style={{ color: 'hsl(200 15% 48%)', fontSize: '0.9375rem' }}>
                  Monitor revenue, subscriptions, and payment metrics
                </p>
              </div>

              {/* Admin chip */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', boxShadow: '0 1px 4px hsl(200 25% 15% / 0.05)' }}>
                <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', backgroundColor: 'hsl(174 62% 32% / 0.1)', color: 'hsl(174 62% 32%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9375rem', fontWeight: '700', flexShrink: 0 }}>
                  {admin.name[0]}
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: '700', color: 'hsl(200 25% 14%)' }}>{admin.name}</p>
                  <p style={{ fontSize: '0.73rem', color: 'hsl(200 15% 48%)' }}>{admin.role}</p>
                </div>
              </div>
            </div>

            {/* ── Tabs ── */}
            <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'hsl(40 25% 93%)', padding: '0.3rem', borderRadius: '0.75rem', marginBottom: '2rem', overflowX: 'auto' }}>
              {TABS.map(({ id, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{ flex: '1 0 auto', minWidth: '100px', padding: '0.7rem 1rem', border: 'none', borderRadius: '0.5rem', backgroundColor: activeTab === id ? 'white' : 'transparent', color: activeTab === id ? 'hsl(200 25% 14%)' : 'hsl(200 15% 48%)', fontWeight: activeTab === id ? '700' : '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.15s', boxShadow: activeTab === id ? '0 1px 3px hsl(200 25% 15% / 0.08)' : 'none', fontSize: '0.875rem', whiteSpace: 'nowrap' }}
                >
                  <Icon style={{ height: '1rem', width: '1rem' }} />
                  {id}
                </button>
              ))}
            </div>

            {/* ── Overview ── */}
            {activeTab === 'Overview' && (
              <>
                {/* KPI Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>

                  <AdminKpiCard
                    icon={DollarSign}
                    iconBg="hsl(174 62% 94%)"
                    iconColor="hsl(174 62% 30%)"
                    badge="ALL TIME"
                    value={fmtGhs(k.total_revenue)}
                    label="Total Revenue"
                    change={null}
                  />

                  <AdminKpiCard
                    icon={TrendingUp}
                    iconBg="hsl(152 60% 94%)"
                    iconColor="hsl(152 58% 32%)"
                    badge="THIS MONTH"
                    value={fmtGhs(k.month_revenue)}
                    label="Revenue This Month"
                    change={k.rev_change}
                    positive={(k.rev_change ?? 0) >= 0}
                  />

                  <AdminKpiCard
                    icon={CheckCircle}
                    iconBg="hsl(214 100% 95%)"
                    iconColor="hsl(214 100% 40%)"
                    badge="ACTIVE"
                    value={(k.active_subs ?? 0).toLocaleString()}
                    label="Active Subscriptions"
                    change={k.subs_change}
                    positive={(k.subs_change ?? 0) >= 0}
                    subValue={k.plan_breakdown
                      ? Object.entries(k.plan_breakdown)
                          .map(([slug, v]) => `${v.name}: ${v.count}`)
                          .join(' · ')
                      : null}
                  />

                  <AdminKpiCard
                    icon={AlertCircle}
                    iconBg="hsl(0 65% 95%)"
                    iconColor="hsl(0 63% 46%)"
                    badge="THIS MONTH"
                    value={k.failed_payments ?? 0}
                    label="Failed Payments"
                    change={k.failed_change}
                    positive={(k.failed_change ?? 0) <= 0}
                  />

                  <AdminKpiCard
                    icon={Clock}
                    iconBg="hsl(38 80% 94%)"
                    iconColor="hsl(36 70% 36%)"
                    badge="PENDING"
                    value={k.pending_refunds ?? 0}
                    label="Refunded Payments"
                    subValue={k.refund_amount != null ? `${fmtGhs(k.refund_amount)} total` : null}
                  />

                  <AdminKpiCard
                    icon={BarChart}
                    iconBg="hsl(174 55% 94%)"
                    iconColor="hsl(174 62% 30%)"
                    badge="MRR"
                    value={fmtGhs(k.mrr)}
                    label="Monthly Recurring Revenue"
                    change={k.mrr_change}
                    positive={(k.mrr_change ?? 0) >= 0}
                  />
                </div>

                {/* Quick Actions */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.875rem', padding: '1.5rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'hsl(200 25% 14%)', marginBottom: '1.125rem' }}>Quick Actions</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.875rem' }}>

                    {/* Go to Payments tab */}
                    <button
                      onClick={() => setActiveTab('Payments')}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem 1rem', backgroundColor: 'hsl(174 55% 94%)', color: 'hsl(174 62% 28%)', border: 'none', borderRadius: '0.625rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(174 55% 88%)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(174 55% 94%)'}
                    >
                      <CreditCard style={{ height: '1.125rem', width: '1.125rem' }} />
                      View All Payments
                    </button>

                    {/* Go to Subscriptions tab */}
                    <button
                      onClick={() => setActiveTab('Subscriptions')}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem 1rem', backgroundColor: 'hsl(214 100% 95%)', color: 'hsl(214 100% 36%)', border: 'none', borderRadius: '0.625rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(214 100% 89%)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(214 100% 95%)'}
                    >
                      <Users style={{ height: '1.125rem', width: '1.125rem' }} />
                      Manage Subscriptions
                    </button>

                    {/* Go to Payments tab filtered to refunds */}
                    <button
                      onClick={() => setActiveTab('Payments')}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem 1rem', backgroundColor: 'hsl(38 80% 94%)', color: 'hsl(36 70% 34%)', border: 'none', borderRadius: '0.625rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(38 80% 87%)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(38 80% 94%)'}
                    >
                      <DollarSign style={{ height: '1.125rem', width: '1.125rem' }} />
                      Process Refunds
                    </button>

                    {/* Go to Analytics tab */}
                    <button
                      onClick={() => setActiveTab('Analytics')}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem 1rem', backgroundColor: 'hsl(152 60% 94%)', color: 'hsl(152 58% 30%)', border: 'none', borderRadius: '0.625rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(152 60% 87%)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(152 60% 94%)'}
                    >
                      <BarChart style={{ height: '1.125rem', width: '1.125rem' }} />
                      View Analytics
                    </button>
                  </div>
                </div>

                {/* Recent Activity on Overview */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.875rem', overflow: 'hidden' }}>
                  <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid hsl(40 20% 88%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'hsl(200 25% 14%)' }}>Recent Activity</h3>
                    <span style={{ fontSize: '0.73rem', color: 'hsl(200 15% 52%)', backgroundColor: 'hsl(40 20% 94%)', padding: '0.2rem 0.6rem', borderRadius: '0.375rem', fontWeight: '600' }}>
                      {(activity ?? []).length} events
                    </span>
                  </div>

                  {(activity ?? []).length === 0 ? (
                    <p style={{ padding: '3rem', textAlign: 'center', color: 'hsl(200 15% 55%)', fontSize: '0.875rem' }}>No recent activity</p>
                  ) : (activity ?? []).slice(0, 8).map((item, i, arr) => (
                    <div
                      key={item.id}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1.125rem 1.5rem', borderBottom: i < arr.length - 1 ? '1px solid hsl(40 20% 90%)' : 'none', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(40 30% 98%)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flex: 1, minWidth: 0 }}>
                        <ActivityIcon status={item.status} />
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 14%)', marginBottom: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                          <p style={{ fontSize: '0.76rem', color: 'hsl(200 15% 50%)' }}>{item.description}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: '800', color: item.status === 'success' ? 'hsl(152 58% 30%)' : 'hsl(200 20% 40%)', marginBottom: '0.15rem' }}>
                          GHS {(item.amount ?? 0).toFixed(2)}
                        </p>
                        <p style={{ fontSize: '0.73rem', color: 'hsl(200 15% 55%)' }}>{item.time}</p>
                      </div>
                    </div>
                  ))}

                  <div style={{ padding: '1rem 1.5rem', backgroundColor: 'hsl(40 25% 97%)', borderTop: '1px solid hsl(40 20% 88%)' }}>
                    <button
                      onClick={() => setActiveTab('Audit')}
                      style={{ background: 'none', border: 'none', color: 'hsl(174 62% 30%)', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}
                    >
                      View full audit log →
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── Payments Tab ── */}
            {activeTab === 'Payments' && (
              <AdminPayments payments={payments ?? []} />
            )}

            {/* ── Subscriptions Tab ── */}
            {activeTab === 'Subscriptions' && (
              <AdminSubscriptions subscriptions={subscriptions ?? []} />
            )}

            {/* ── Analytics Tab ── */}
            {activeTab === 'Analytics' && (
              <AdminAnalytics analytics={analytics} />
            )}

            {/* ── Audit Tab ── */}
            {activeTab === 'Audit' && (
              <AdminAudit activity={activity ?? []} />
            )}

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AdminDashboard;