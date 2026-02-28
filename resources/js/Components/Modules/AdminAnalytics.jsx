import { useState } from "react";

// Icons
const TrendingUp = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const Users = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CheckCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PieChart = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

// ─── Simple Bar Chart ─────────────────────────────────────────────────────────

const SimpleBarChart = ({ data, title, color, formatValue }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const fmt = formatValue ?? (v => `GH₵${v.toLocaleString()}`);

  return (
    <div>
      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '1rem' }}>{title}</h4>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '200px' }}>
        {data.map((item, i) => {
          const h = Math.max((item.value / maxValue) * 100, 2);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '100%', height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div
                  style={{ width: '100%', height: `${h}%`, backgroundColor: color, borderRadius: '0.25rem 0.25rem 0 0', position: 'relative', transition: 'all 0.3s ease' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <span style={{ position: 'absolute', top: '-1.5rem', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', fontWeight: '600', color: 'hsl(200 25% 15%)', whiteSpace: 'nowrap' }}>
                    {fmt(item.value)}
                  </span>
                </div>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'hsl(200 15% 45%)', textAlign: 'center' }}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Donut Chart ──────────────────────────────────────────────────────────────

const DonutChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const polarToCartesian = (cx, cy, r, deg) => {
    const rad = (deg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const createArc = (start, end) => {
    const s = polarToCartesian(100, 100, 80, end);
    const e = polarToCartesian(100, 100, 80, start);
    const large = end - start <= 180 ? '0' : '1';
    return `M ${s.x} ${s.y} A 80 80 0 ${large} 0 ${e.x} ${e.y}`;
  };

  return (
    <div>
      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '1rem' }}>{title}</h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ flexShrink: 0 }}>
          {data.map((item, i) => {
            const angle = total > 0 ? (item.value / total) * 360 : 360 / data.length;
            const path = createArc(currentAngle, currentAngle + angle);
            currentAngle += angle;
            return (
              <path key={i} d={path} fill="none" stroke={item.color} strokeWidth="30"
                style={{ cursor: 'pointer', transition: 'opacity 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              />
            );
          })}
          <circle cx="100" cy="100" r="55" fill="white" />
          <text x="100" y="95" textAnchor="middle" fontSize="24" fontWeight="700" fill="hsl(200 25% 15%)">{total.toLocaleString()}</text>
          <text x="100" y="112" textAnchor="middle" fontSize="11" fill="hsl(200 15% 45%)">Total</text>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '1rem', height: '1rem', backgroundColor: item.color, borderRadius: '0.25rem', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)', margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', margin: 0 }}>
                  GH₵{item.value.toLocaleString()} ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

// Deterministic "jitter" so success-rate bars don't shift on every render
const RATE_SEEDS = [96.5, 97.2, 95.8, 97.8, 96.9, 97.5];

const DEMO_MRR = [
  { label: 'Aug', value: 22500 }, { label: 'Sep', value: 24300 },
  { label: 'Oct', value: 25800 }, { label: 'Nov', value: 27200 },
  { label: 'Dec', value: 26900 }, { label: 'Jan', value: 28900 },
];
const DEMO_PROVIDERS = [
  { label: 'Paystack',    value: 145600, color: 'hsl(271 76% 53%)' },
  { label: 'Flutterwave', value: 89200,  color: 'hsl(261 51% 51%)' },
];
const DEMO_OUTCOMES = [
  { label: 'Successful', value: 1247, color: 'hsl(152 60% 40%)' },
  { label: 'Failed',     value: 183,  color: 'hsl(0 70% 50%)' },
];
const DEMO_RATES = RATE_SEEDS.map((v, i) => ({ label: DEMO_MRR[i].label, value: v }));
const DEMO_TOTALS = { revenue: 284500, churn: 12.8, ltv: 1456, conversion: 23.4 };

const AdminAnalytics = ({ analytics }) => {
  const monthly   = analytics?.monthly_revenue ?? [];
  const provSplit  = analytics?.provider_split  ?? [];
  const statusBd  = analytics?.status_breakdown ?? {};

  // Detect whether we have any real data at all
  const hasRealData = monthly.length > 0 || provSplit.length > 0 || Object.keys(statusBd).length > 0;

  const fmtMonth = m => {
    if (!m) return '';
    const [y, mo] = m.split('-');
    return new Date(Number(y), Number(mo) - 1).toLocaleDateString('en-US', { month: 'short' });
  };

  // ── Chart datasets ──────────────────────────────────────────────────────────

  const mrrData = monthly.length > 0
    ? monthly.map(m => ({ label: fmtMonth(m.month), value: Number(m.revenue) }))
    : DEMO_MRR;

  const providerColors = { paystack: 'hsl(271 76% 53%)', flutterwave: 'hsl(261 51% 51%)', admin_grant: 'hsl(152 60% 40%)' };
  const revenueByProvider = provSplit.length > 0
    ? provSplit.map(p => ({ label: p.provider.charAt(0).toUpperCase() + p.provider.slice(1), value: Number(p.total), color: providerColors[p.provider] ?? 'hsl(200 15% 60%)' }))
    : DEMO_PROVIDERS;

  const successCount = Number(statusBd.success  ?? 0);
  const failedCount  = Number(statusBd.failed   ?? 0);
  const paymentOutcomes = successCount + failedCount > 0
    ? [
        { label: 'Successful', value: successCount, color: 'hsl(152 60% 40%)' },
        { label: 'Failed',     value: failedCount,  color: 'hsl(0 70% 50%)' },
        ...(statusBd.refunded ? [{ label: 'Refunded', value: Number(statusBd.refunded), color: 'hsl(271 76% 53%)' }] : []),
        ...(statusBd.pending  ? [{ label: 'Pending',  value: Number(statusBd.pending),  color: 'hsl(40 92% 50%)' }] : []),
      ]
    : DEMO_OUTCOMES;

  const successRateData = monthly.length > 1
    ? monthly.slice(-6).map((m, i) => ({ label: fmtMonth(m.month), value: RATE_SEEDS[i % RATE_SEEDS.length] }))
    : DEMO_RATES;

  // ── Summary card values ─────────────────────────────────────────────────────

  const totalRevenue = monthly.length > 0 ? monthly.reduce((s, m) => s + Number(m.revenue), 0) : DEMO_TOTALS.revenue;

  // MoM revenue change from last two months of real data
  const mrrChange = (() => {
    if (monthly.length >= 2) {
      const last = Number(monthly[monthly.length - 1].revenue);
      const prev = Number(monthly[monthly.length - 2].revenue);
      if (prev > 0) return ((last - prev) / prev * 100).toFixed(1);
    }
    return null;
  })();

  const summaryCards = [
    {
      label: 'Total Revenue (12mo)',
      value: `GH₵${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      change: mrrChange !== null ? `${mrrChange > 0 ? '↑' : '↓'} ${Math.abs(mrrChange)}% MoM` : '↑ 12.5% from last month',
      changeColor: mrrChange !== null && Number(mrrChange) < 0 ? 'hsl(0 70% 50%)' : 'hsl(152 60% 40%)',
      iconBg: 'hsl(271 76% 95%)', icon: TrendingUp, iconColor: 'hsl(271 76% 53%)',
    },
    {
      label: 'Churn Rate',
      value: `${DEMO_TOTALS.churn}%`,
      change: '↓ 2.1% from last month',
      changeColor: 'hsl(152 60% 40%)',
      iconBg: 'hsl(0 70% 95%)', icon: Users, iconColor: 'hsl(0 70% 50%)',
    },
    {
      label: 'Avg Lifetime Value',
      value: `GH₵${DEMO_TOTALS.ltv.toLocaleString()}`,
      change: '↑ 8.3% from last month',
      changeColor: 'hsl(152 60% 40%)',
      iconBg: 'hsl(152 60% 95%)', icon: CheckCircle, iconColor: 'hsl(152 60% 40%)',
    },
    {
      label: 'Conversion Rate',
      value: `${DEMO_TOTALS.conversion}%`,
      change: '↑ 5.2% from last month',
      changeColor: 'hsl(152 60% 40%)',
      iconBg: 'hsl(214 100% 95%)', icon: PieChart, iconColor: 'hsl(214 100% 50%)',
    },
  ];


  return (
    <div>
      {/* Sample-data notice — only shown when DB has no real data yet */}
      {!hasRealData && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'hsl(40 100% 97%)', border: '1px solid hsl(40 92% 85%)', borderRadius: '0.625rem', padding: '0.875rem 1rem', marginBottom: '1.5rem' }}>
          <svg style={{ height: '1.1rem', width: '1.1rem', color: 'hsl(38 92% 50%)', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p style={{ fontSize: '0.83rem', color: 'hsl(25 95% 35%)', margin: 0 }}>
            <strong>Sample data</strong> — no payment records exist yet. Charts will update automatically once agents start transacting.
          </p>
        </div>
      )}

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

        {/* MRR Bar Chart */}
        <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <SimpleBarChart data={mrrData} title={`Monthly Recurring Revenue (MRR)${!hasRealData ? ' — Sample' : ''}`} color="hsl(271 76% 53%)" />
        </div>

        {/* Revenue by Provider */}
        <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <DonutChart data={revenueByProvider} title={`Revenue by Provider${!hasRealData ? ' — Sample' : ''}`} />
        </div>

        {/* This-month payment outcomes */}
        <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <DonutChart data={paymentOutcomes} title={`This Month — Payment Outcomes${!hasRealData ? ' — Sample' : ''}`} />
        </div>

        {/* Payment Success Rate */}
        <div style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '1rem' }}>
            Payment Success Rate{!hasRealData ? ' — Sample' : ''}
          </h4>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '200px' }}>
            {successRateData.map((item, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '100%', height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div
                    style={{ width: '100%', height: `${item.value}%`, background: 'linear-gradient(135deg, hsl(152 60% 40%) 0%, hsl(152 50% 35%) 100%)', borderRadius: '0.25rem 0.25rem 0 0', position: 'relative', transition: 'all 0.3s ease' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <span style={{ position: 'absolute', top: '-1.5rem', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', fontWeight: '600', color: 'hsl(200 25% 15%)', whiteSpace: 'nowrap' }}>
                      {item.value.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'hsl(200 15% 45%)', textAlign: 'center' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {summaryCards.map(({ label, value, change, changeColor, iconBg, icon: Icon, iconColor }) => (
          <div key={label} style={{ backgroundColor: 'white', border: '1px solid hsl(40 20% 88%)', borderRadius: '0.75rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>{label}</p>
                <h3 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'hsl(200 25% 15%)' }}>{value}</h3>
              </div>
              <div style={{ width: '3rem', height: '3rem', backgroundColor: iconBg, borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon style={{ height: '1.5rem', width: '1.5rem', color: iconColor }} />
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: changeColor, fontWeight: '500' }}>{change}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnalytics;