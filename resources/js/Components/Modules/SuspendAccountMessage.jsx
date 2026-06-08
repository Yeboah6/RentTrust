const SuspendedModal = () => (
  <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
    <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid hsl(40 20% 88%)', padding: '2rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>

      <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'hsl(0 70% 97%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
        <AlertCircle style={{ height: '1.5rem', width: '1.5rem', color: 'hsl(0 70% 50%)' }} />
      </div>

      <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'hsl(200 25% 15%)', marginBottom: '0.5rem' }}>
        Account suspended
      </h2>
      <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
        Your account has been suspended. Please contact support to resolve this issue and regain access.
      </p>

      <div style={{ backgroundColor: 'hsl(40 30% 97%)', borderRadius: '0.5rem', border: '1px solid hsl(40 20% 88%)', padding: '0.875rem 1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
        <p style={{ fontSize: '0.8rem', color: 'hsl(200 15% 45%)', margin: 0, lineHeight: '1.6' }}>
          Common reasons include policy violations, suspicious activity, or unpaid dues. Our support team can help clarify.
        </p>
      </div>

      <a
        href="mailto:support@renttrustgh.com"
        style={{ display: 'block', padding: '0.625rem 1rem', backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 70% 88%)', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: 'hsl(0 70% 45%)', textDecoration: 'none' }}
      >
        Contact support
      </a>

    </div>
  </div>
);

export default SuspendedModal;