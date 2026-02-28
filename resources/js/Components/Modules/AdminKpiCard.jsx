const TrendingUp = ({ style }) => (
  <svg style={style} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const TrendingDown = ({ style }) => (
  <svg style={style} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const AdminKpiCard = ({ icon: Icon, iconBg, iconColor, badge, value, label, change, positive, subValue }) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid hsl(40 20% 88%)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        transition: 'all 0.3s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 12px 24px hsl(200 25% 15% / 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon style={{ height: '1.5rem', width: '1.5rem', color: iconColor }} />
        </div>
        {badge && (
          <span style={{ fontSize: '0.625rem', fontWeight: '600', color: 'hsl(200 15% 45%)', letterSpacing: '0.05em' }}>
            {badge}
          </span>
        )}
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'hsl(200 25% 15%)', marginBottom: '0.25rem', margin: '0 0 0.25rem' }}>
          {value}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', margin: 0 }}>
          {label}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', marginTop: '0.5rem' }}>
        {change !== undefined && change !== null ? (
          <>
            <span style={{ display: 'flex', alignItems: 'center', color: positive ? 'hsl(152 60% 40%)' : 'hsl(0 70% 50%)', fontWeight: '500' }}>
              {positive ? (
                <TrendingUp style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
              ) : (
                <TrendingDown style={{ height: '1rem', width: '1rem', marginRight: '0.25rem' }} />
              )}
              {Math.abs(change)}%
            </span>
            <span style={{ marginLeft: '0.5rem', color: 'hsl(200 15% 45%)' }}>vs last period</span>
          </>
        ) : subValue ? (
          <span style={{ color: 'hsl(200 15% 45%)' }}>{subValue}</span>
        ) : null}
      </div>
    </div>
  );
};

export default AdminKpiCard;