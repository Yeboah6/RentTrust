const SetupExpired = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(220 25% 10%)', padding: '1rem' }}>
    <div style={{ maxWidth: '380px', width: '100%', backgroundColor: 'white', borderRadius: '1.25rem', padding: '2.5rem', textAlign: 'center' }}>
      <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', backgroundColor: 'hsl(0 72% 51% / 0.1)', color: 'hsl(0 72% 51%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.4rem' }}>✕</div>
      <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'hsl(220 25% 15%)', margin: '0 0 0.5rem' }}>Link Expired</h1>
      <p style={{ fontSize: '0.875rem', color: 'hsl(220 15% 50%)', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
        This setup link has already been used or has expired. Ask a super admin to resend the invitation.
      </p>
      <a href="/" style={{ display: 'inline-block', padding: '0.65rem 1.5rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 25% 15%)', color: 'white', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
        Back to Home
      </a>
    </div>
  </div>
);

export default SetupExpired;