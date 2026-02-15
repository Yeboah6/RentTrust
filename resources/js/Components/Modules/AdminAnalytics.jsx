import { useState } from "react";
import Header from "@/Components/Layouts/Header";
import Footer from "@/Components/Layouts/Footer";
import { Link } from "@inertiajs/react";

// Icons
const TrendingUp = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
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

const FileText = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const PieChart = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

const CheckCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Simple Bar Chart Component
const SimpleBarChart = ({ data, title, color }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div>
      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '1rem' }}>
        {title}
      </h4>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '200px' }}>
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          return (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '100%', 
                height: '180px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'flex-end'
              }}>
                <div
                  style={{
                    width: '100%',
                    height: `${height}%`,
                    backgroundColor: color,
                    borderRadius: '0.25rem 0.25rem 0 0',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  <span style={{
                    position: 'absolute',
                    top: '-1.5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'hsl(200 25% 15%)',
                    whiteSpace: 'nowrap'
                  }}>
                    GH₵{item.value.toLocaleString()}
                  </span>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', textAlign: 'center' }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Donut Chart Component
const DonutChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const createArc = (startAngle, endAngle, color) => {
    const start = polarToCartesian(100, 100, 80, endAngle);
    const end = polarToCartesian(100, 100, 80, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A 80 80 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div>
      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '1rem' }}>
        {title}
      </h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {data.map((item, index) => {
            const angle = (item.value / total) * 360;
            const path = createArc(currentAngle, currentAngle + angle, item.color);
            const previousAngle = currentAngle;
            currentAngle += angle;
            
            return (
              <path
                key={index}
                d={path}
                fill="none"
                stroke={item.color}
                strokeWidth="30"
                style={{ cursor: 'pointer', transition: 'opacity 0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              />
            );
          })}
          <circle cx="100" cy="100" r="55" fill="white" />
          <text x="100" y="95" textAnchor="middle" fontSize="24" fontWeight="700" fill="hsl(200 25% 15%)">
            {total}
          </text>
          <text x="100" y="110" textAnchor="middle" fontSize="12" fill="hsl(200 15% 45%)">
            Total
          </text>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '1rem', height: '1rem', backgroundColor: item.color, borderRadius: '0.25rem' }} />
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'hsl(200 25% 15%)' }}>
                  {item.label}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)' }}>
                  GH₵{item.value.toLocaleString()} ({((item.value / total) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminAnalytics = ({ analyticsData }) => {
  const [timeRange, setTimeRange] = useState('6months');

  const mrrData = [
    { label: 'Aug', value: 22500 },
    { label: 'Sep', value: 24300 },
    { label: 'Oct', value: 25800 },
    { label: 'Nov', value: 27200 },
    { label: 'Dec', value: 26900 },
    { label: 'Jan', value: 28900 }
  ];

  const revenueByProductData = [
    { label: 'Subscriptions', value: 145600, color: 'hsl(271 76% 53%)' },
    { label: 'Boosts', value: 89200, color: 'hsl(261 51% 51%)' },
    { label: 'Lead Unlocks', value: 49700, color: 'hsl(330 81% 60%)' }
  ];

  const subscriptionMetricsData = [
    { label: 'Active', value: 1247, color: 'hsl(152 60% 40%)' },
    { label: 'Churned', value: 183, color: 'hsl(0 70% 50%)' }
  ];

  const paymentSuccessData = [
    { label: 'Jan', value: 96.5 },
    { label: 'Feb', value: 97.2 },
    { label: 'Mar', value: 95.8 },
    { label: 'Apr', value: 97.8 },
    { label: 'May', value: 96.9 },
    { label: 'Jun', value: 97.5 }
  ];

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

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem' }}>
              {/* Monthly Recurring Revenue */}
              <div style={{
                backgroundColor: 'white',
                border: '1px solid hsl(40 20% 88%)',
                borderRadius: '0.75rem',
                padding: '1.5rem'
              }}>
                <SimpleBarChart
                  data={mrrData}
                  title="Monthly Recurring Revenue (MRR)"
                  color="hsl(271 76% 53%)"
                />
              </div>

              {/* Revenue by Product Type */}
              <div style={{
                backgroundColor: 'white',
                border: '1px solid hsl(40 20% 88%)',
                borderRadius: '0.75rem',
                padding: '1.5rem'
              }}>
                <DonutChart
                  data={revenueByProductData}
                  title="Revenue by Product Type"
                />
              </div>

              {/* Active vs Churned Subscriptions */}
              <div style={{
                backgroundColor: 'white',
                border: '1px solid hsl(40 20% 88%)',
                borderRadius: '0.75rem',
                padding: '1.5rem'
              }}>
                <DonutChart
                  data={subscriptionMetricsData}
                  title="Active vs Churned Subscriptions"
                />
              </div>

              {/* Payment Success Rate */}
              <div style={{
                backgroundColor: 'white',
                border: '1px solid hsl(40 20% 88%)',
                borderRadius: '0.75rem',
                padding: '1.5rem'
              }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '1rem' }}>
                  Payment Success Rate
                </h4>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '200px' }}>
                  {paymentSuccessData.map((item, index) => (
                    <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        width: '100%', 
                        height: '180px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'flex-end'
                      }}>
                        <div
                          style={{
                            width: '100%',
                            height: `${item.value}%`,
                            background: 'linear-gradient(135deg, hsl(152 60% 40%) 0%, hsl(152 50% 35%) 100%)',
                            borderRadius: '0.25rem 0.25rem 0 0',
                            position: 'relative',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                          <span style={{
                            position: 'absolute',
                            top: '-1.5rem',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'hsl(200 25% 15%)',
                            whiteSpace: 'nowrap'
                          }}>
                            {item.value}%
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'hsl(200 15% 45%)', textAlign: 'center' }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1.5rem',
              marginTop: '2rem'
            }}>
              <div style={{
                backgroundColor: 'white',
                border: '1px solid hsl(40 20% 88%)',
                borderRadius: '0.75rem',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
                      Average Revenue Per User
                    </p>
                    <h3 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'hsl(200 25% 15%)' }}>
                      GH₵228
                    </h3>
                  </div>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: 'hsl(271 76% 95%)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TrendingUp style={{ height: '1.5rem', width: '1.5rem', color: 'hsl(271 76% 53%)' }} />
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'hsl(152 60% 40%)', fontWeight: '500' }}>
                  ↑ 12.5% from last month
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '1px solid hsl(40 20% 88%)',
                borderRadius: '0.75rem',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
                      Churn Rate
                    </p>
                    <h3 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'hsl(200 25% 15%)' }}>
                      12.8%
                    </h3>
                  </div>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: 'hsl(0 70% 95%)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Users style={{ height: '1.5rem', width: '1.5rem', color: 'hsl(0 70% 50%)' }} />
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'hsl(152 60% 40%)', fontWeight: '500' }}>
                  ↓ 2.1% from last month
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '1px solid hsl(40 20% 88%)',
                borderRadius: '0.75rem',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
                      Lifetime Value
                    </p>
                    <h3 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'hsl(200 25% 15%)' }}>
                      GH₵1,456
                    </h3>
                  </div>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: 'hsl(152 60% 95%)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle style={{ height: '1.5rem', width: '1.5rem', color: 'hsl(152 60% 40%)' }} />
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'hsl(152 60% 40%)', fontWeight: '500' }}>
                  ↑ 8.3% from last month
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '1px solid hsl(40 20% 88%)',
                borderRadius: '0.75rem',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginBottom: '0.5rem' }}>
                      Conversion Rate
                    </p>
                    <h3 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'hsl(200 25% 15%)' }}>
                      23.4%
                    </h3>
                  </div>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: 'hsl(214 100% 95%)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <PieChart style={{ height: '1.5rem', width: '1.5rem', color: 'hsl(214 100% 50%)' }} />
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'hsl(152 60% 40%)', fontWeight: '500' }}>
                  ↑ 5.2% from last month
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* <Footer /> */}
      </div>
    </>
  );
};

export default AdminAnalytics;