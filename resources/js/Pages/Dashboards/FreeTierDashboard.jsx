import { useState } from "react";
import { Link, usePage, useForm } from "@inertiajs/react";
import Header from "@/Components/Layouts/Header";
import Footer from "@/Components/Layouts/Footer";

// ── Icons ───────────────────────────────────────────────────────────────────
const Home        = ({ s }) => <svg style={s} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const Building    = ({ s }) => <svg style={s} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const Users       = ({ s }) => <svg style={s} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const BarChart    = ({ s }) => <svg style={s} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const Zap         = ({ s }) => <svg style={s} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const Lock        = ({ s }) => <svg style={s} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const Eye         = ({ s }) => <svg style={s} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const Plus        = ({ s }) => <svg style={s} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const Star        = ({ s }) => <svg style={s} fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
const MapPin      = ({ s }) => <svg style={s} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const Bell        = ({ s }) => <svg style={s} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const TrendingUp  = ({ s }) => <svg style={s} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const CheckCircle = ({ s }) => <svg style={s} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AlertTriangle = ({ s }) => <svg style={s} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const Megaphone   = ({ s }) => <svg style={s} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>;
const CreditCard  = ({ s }) => <svg style={s} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;

// ── Helpers ─────────────────────────────────────────────────────────────────
const TEAL   = 'hsl(174 62% 32%)';
const DARK   = 'hsl(200 25% 15%)';
const MUTED  = 'hsl(200 15% 45%)';
const BORDER = 'hsl(40 20% 88%)';
const BG     = 'hsl(40 33% 98%)';
const WHITE  = '#fff';
const AMBER  = 'hsl(38 92% 50%)';
const RED    = 'hsl(0 65% 51%)';
const GREEN  = 'hsl(152 60% 40%)';

const card = (extra = {}) => ({
  backgroundColor: WHITE,
  border: `1px solid ${BORDER}`,
  borderRadius: '0.75rem',
  boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.08)',
  ...extra,
});

const UpgradeBadge = ({ label = "Upgrade to unlock", small = false }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
    padding: small ? '0.2rem 0.5rem' : '0.3rem 0.7rem',
    background: 'hsl(38 92% 50% / 0.1)',
    color: AMBER,
    borderRadius: '9999px',
    fontSize: small ? '0.7rem' : '0.75rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  }}>
    <Lock s={{ width: small ? '0.625rem' : '0.75rem', height: small ? '0.625rem' : '0.75rem' }} />
    {label}
  </span>
);

// Reusable blurred overlay card
const LockedOverlay = ({ children, label = "Available in Pro Plan" }) => (
  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '0.75rem' }}>
    <div style={{ filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none', opacity: 0.6 }}>
      {children}
    </div>
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'hsl(200 25% 15% / 0.55)',
      backdropFilter: 'blur(2px)',
      borderRadius: '0.75rem',
      gap: '0.5rem',
    }}>
      <div style={{
        width: '2.5rem', height: '2.5rem', borderRadius: '50%',
        background: 'hsl(38 92% 50% / 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Lock s={{ width: '1.25rem', height: '1.25rem', color: AMBER }} />
      </div>
      <p style={{ color: WHITE, fontWeight: '600', fontSize: '0.875rem', margin: 0 }}>{label}</p>
    </div>
  </div>
);

// Usage progress bar
const UsageBar = ({ used, limit, label, warn }) => {
  const pct = Math.min((used / limit) * 100, 100);
  const color = pct >= 100 ? RED : pct >= 67 ? AMBER : GREEN;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
        <span style={{ fontSize: '0.8125rem', color: MUTED }}>{label}</span>
        <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: pct >= 67 ? color : DARK }}>
          {used} / {limit}
        </span>
      </div>
      <div style={{ height: '6px', borderRadius: '9999px', background: BORDER }}>
        <div style={{
          height: '100%', borderRadius: '9999px',
          width: `${pct}%`,
          background: color,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  );
};

// Stat card
const StatCard = ({ icon, label, value, sub, locked }) => (
  <div style={{ ...card(), padding: 'clamp(1rem, 3vw, 1.25rem)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
      <div style={{
        width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem',
        background: `${TEAL}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      {locked && <UpgradeBadge small />}
    </div>
    <p style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: '700', color: DARK, margin: 0, lineHeight: 1 }}>
      {value}
    </p>
    <p style={{ fontSize: '0.8125rem', color: MUTED, margin: '0.25rem 0 0' }}>{label}</p>
    {sub && <p style={{ fontSize: '0.75rem', color: locked ? AMBER : MUTED, marginTop: '0.25rem', fontWeight: locked ? 600 : 400 }}>{sub}</p>}
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────
const AgentFreeDashboard = ({ agent, listings = [], inquiries = [], stats = {} }) => {
  const { auth } = usePage().props;
  const { post } = useForm();

  const agentData = auth?.agent || {};
  const agentName = agentData?.name || agentData?.fullName || 'Agent';
  const plan = agentData?.plan || 'free';

  // Limits
  const LISTING_LIMIT = 3;
  const INQUIRY_LIMIT = 10;
  const activeListings = listings.length || 2;
  const monthlyInquiries = inquiries.length || 6;
  const listingsFull = activeListings >= LISTING_LIMIT;
  const inquiriesFull = monthlyInquiries >= INQUIRY_LIMIT;

  // Mock data for demo
  const mockInquiries = [
    { id: 1, name: 'Kwame A.', property: '3BR Apt, East Legon', date: 'Feb 14', preview: 'Hello, I am interested in the property. Is it still available for viewing this…' },
    { id: 2, name: 'Ama S.',   property: 'Studio, Osu',         date: 'Feb 13', preview: 'Good morning! I would like to schedule a visit. My budget is flexible and I…' },
    { id: 3, name: 'Kofi M.',  property: '2BR, Cantonments',    date: 'Feb 12', preview: 'Please send me more pictures and the exact location. I am ready to move in…' },
    { id: 4, name: 'Abena T.', property: '3BR Apt, East Legon', date: 'Feb 11', preview: 'Hi, I was referred to you by a friend. I am looking for something immediate…' },
    { id: 5, name: 'Yaw D.',   property: 'Studio, Osu',         date: 'Feb 10', preview: 'Is the price negotiable? I have been looking in this area for 3 months and…' },
  ];

  const mockListings = [
    { id: 1, title: '3BR Apartment, East Legon', price: 'GHS 4,500/mo', views: 89, inquiries: 3, status: 'active' },
    { id: 2, title: 'Studio Apartment, Osu',    price: 'GHS 2,200/mo', views: 59, inquiries: 3, status: 'active' },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    post('/logout');
  };

  const navItem = (href, label, Icon, locked = false) => {
    const [hover, setHover] = useState(false);
    return (
      <Link
        href={locked ? '#' : href}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.625rem',
          padding: '0.625rem 0.875rem',
          borderRadius: '0.5rem',
          color: locked ? MUTED : hover ? DARK : MUTED,
          backgroundColor: hover && !locked ? 'hsl(40 30% 94%)' : 'transparent',
          fontSize: '0.875rem', fontWeight: '500',
          transition: 'all 0.15s ease',
          textDecoration: 'none',
          cursor: locked ? 'default' : 'pointer',
        }}
        onMouseEnter={() => !locked && setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Icon s={{ width: '1rem', height: '1rem' }} />
        {label}
        {locked && <Lock s={{ width: '0.75rem', height: '0.75rem', marginLeft: 'auto', opacity: 0.5 }} />}
      </Link>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
        h1,h2,h3,h4,h5,h6 { font-weight: 600; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease-out both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.1s; }
        .fade-up-3 { animation-delay: 0.15s; }
        .fade-up-4 { animation-delay: 0.2s; }
        .fade-up-5 { animation-delay: 0.25s; }

        @media (max-width: 768px) {
          .sidebar { display: none !important; }
          .main-content { margin-left: 0 !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(0.75rem, 2vw, 1.25rem);
        }
        @media (min-width: 640px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .listings-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .listings-grid { grid-template-columns: repeat(2, 1fr); }
        }

        button:active { transform: scale(0.97); }
      `}</style>

      <div style={{ minHeight: '100vh', backgroundColor: BG, display: 'flex' }}>

        {/* ── Sidebar ── */}
        <aside className="sidebar" style={{
          width: '220px', minHeight: '100vh', flexShrink: 0,
          backgroundColor: WHITE, borderRight: `1px solid ${BORDER}`,
          padding: '1.5rem 0.75rem',
          display: 'flex', flexDirection: 'column', gap: '0.25rem',
          position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingLeft: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: WHITE, fontWeight: '800', fontSize: '1.125rem' }}>R</span>
            </div>
            <span style={{ color: DARK, fontWeight: '700', fontSize: '1.125rem', letterSpacing: '-0.02em' }}>RentTrust</span>
          </Link>

          {/* Nav Links */}
          <p style={{ fontSize: '0.6875rem', color: MUTED, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.5rem', marginBottom: '0.25rem' }}>Menu</p>
          {navItem('/agent-dashboard',          'Dashboard',    Home)}
          {navItem('/agent/listings',           'My Listings',  Building)}
          {navItem('/agent/leads',              'Leads',        Users)}
          {navItem('#',                         'Analytics',    BarChart, true)}
          {navItem('/agent/promotion',          'Promotion',    Megaphone, true)}

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: `1px solid ${BORDER}` }}>
            {/* Upgrade CTA in sidebar */}
            <Link href="/pricing" style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem',
              background: `linear-gradient(135deg, ${TEAL}, hsl(174 55% 25%))`,
              borderRadius: '0.625rem',
              color: WHITE, fontWeight: '600', fontSize: '0.8125rem',
              textDecoration: 'none',
              marginBottom: '0.75rem',
            }}>
              <Zap s={{ width: '0.875rem', height: '0.875rem' }} />
              Upgrade to Pro
            </Link>

            {/* Plan Badge */}
            <div style={{ padding: '0.5rem 0.75rem', backgroundColor: BG, borderRadius: '0.5rem' }}>
              <p style={{ fontSize: '0.6875rem', color: MUTED, margin: 0 }}>Current Plan</p>
              <p style={{ fontSize: '0.8125rem', fontWeight: '700', color: DARK, margin: '0.125rem 0 0' }}>Free Tier</p>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="main-content" style={{ flex: 1, minWidth: 0 }}>

          {/* Top bar */}
          <div style={{
            backgroundColor: WHITE, borderBottom: `1px solid ${BORDER}`,
            padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'sticky', top: 0, zIndex: 40,
          }}>
            {/* Mobile logo */}
            <Link href="/" className="mobile-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '0.375rem', backgroundColor: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: WHITE, fontWeight: '800', fontSize: '1rem' }}>R</span>
              </div>
              <span style={{ color: DARK, fontWeight: '700', fontSize: '1rem' }}>RentTrust</span>
            </Link>

            <div className="sidebar" style={{ fontSize: '0.875rem', color: MUTED }}>
              Agent Dashboard
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Upgrade pill */}
              <Link href="/pricing" style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.5rem 1rem',
                background: `linear-gradient(135deg, ${TEAL}, hsl(174 55% 25%))`,
                borderRadius: '9999px',
                color: WHITE, fontWeight: '600', fontSize: '0.8rem',
                textDecoration: 'none',
              }}>
                <Zap s={{ width: '0.75rem', height: '0.75rem' }} />
                Upgrade
              </Link>

              {/* Bell */}
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.5rem', color: MUTED }}>
                <Bell s={{ width: '1.125rem', height: '1.125rem' }} />
              </button>

              {/* Avatar */}
              <div style={{
                width: '2rem', height: '2rem', borderRadius: '50%',
                background: `${TEAL}22`, color: TEAL,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '700', fontSize: '0.875rem',
              }}>
                {agentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            </div>
          </div>

          {/* Page Body */}
          <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: '1100px' }}>

            {/* ── Welcome Section ── */}
            <div className="fade-up fade-up-1" style={{ marginBottom: 'clamp(1.25rem, 3vw, 2rem)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: 'clamp(1.375rem, 4vw, 1.75rem)', fontWeight: '700', color: DARK, margin: 0, lineHeight: 1.2 }}>
                    Welcome back, {agentName.split(' ')[0]} 👋
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                      padding: '0.25rem 0.625rem',
                      backgroundColor: `${GREEN}15`, color: GREEN,
                      borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: GREEN, display: 'inline-block' }} />
                      Free Plan
                    </span>
                    <span style={{ color: MUTED, fontSize: '0.8125rem' }}>
                      {LISTING_LIMIT - activeListings} listing{LISTING_LIMIT - activeListings !== 1 ? 's' : ''} remaining
                    </span>
                  </div>
                </div>
                <Link href="/agent/listings/new" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: listingsFull ? BORDER : TEAL,
                  color: listingsFull ? MUTED : WHITE,
                  borderRadius: '0.625rem', fontWeight: '600', fontSize: '0.875rem',
                  textDecoration: 'none', pointerEvents: listingsFull ? 'none' : 'auto',
                }}>
                  <Plus s={{ width: '1rem', height: '1rem' }} />
                  {listingsFull ? 'Limit Reached' : 'Add Listing'}
                </Link>
              </div>

              {/* Limit warning banner */}
              {listingsFull && (
                <div style={{
                  marginTop: '1rem', padding: '1rem 1.25rem',
                  backgroundColor: `${RED}0d`, border: `1px solid ${RED}33`,
                  borderRadius: '0.625rem',
                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap',
                }}>
                  <AlertTriangle s={{ width: '1.125rem', height: '1.125rem', color: RED, flexShrink: 0, marginTop: '0.125rem' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: '600', color: RED, fontSize: '0.9rem' }}>You've reached your free listing limit</p>
                    <p style={{ margin: '0.25rem 0 0', color: MUTED, fontSize: '0.8125rem' }}>Upgrade to continue posting properties and attract more tenants.</p>
                  </div>
                  <Link href="/pricing" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.5rem 1rem', backgroundColor: RED, color: WHITE,
                    borderRadius: '0.5rem', fontWeight: '600', fontSize: '0.8rem',
                    textDecoration: 'none', flexShrink: 0,
                  }}>
                    <Zap s={{ width: '0.75rem', height: '0.75rem' }} />
                    Upgrade Now
                  </Link>
                </div>
              )}

              {/* Inquiry cap banner */}
              {inquiriesFull && (
                <div style={{
                  marginTop: '0.75rem', padding: '1rem 1.25rem',
                  backgroundColor: `${AMBER}12`, border: `1px solid ${AMBER}44`,
                  borderRadius: '0.625rem',
                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap',
                }}>
                  <Bell s={{ width: '1.125rem', height: '1.125rem', color: AMBER, flexShrink: 0, marginTop: '0.125rem' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: '600', color: AMBER, fontSize: '0.9rem' }}>🎯 High Demand — Inquiry Limit Reached</p>
                    <p style={{ margin: '0.25rem 0 0', color: MUTED, fontSize: '0.8125rem' }}>You've received {INQUIRY_LIMIT} inquiries this month. Upgrade for unlimited access to leads.</p>
                  </div>
                  <Link href="/pricing" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.5rem 1rem', backgroundColor: AMBER, color: WHITE,
                    borderRadius: '0.5rem', fontWeight: '600', fontSize: '0.8rem',
                    textDecoration: 'none', flexShrink: 0,
                  }}>
                    Unlock Leads
                  </Link>
                </div>
              )}
            </div>

            {/* ── Section 1: Stats ── */}
            <div className="stats-grid fade-up fade-up-2" style={{ marginBottom: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
              <StatCard
                icon={<Building s={{ width: '1.125rem', height: '1.125rem', color: TEAL }} />}
                label="Active Listings"
                value={`${activeListings} / ${LISTING_LIMIT}`}
                sub={activeListings >= LISTING_LIMIT ? "⚠ Limit reached" : `${LISTING_LIMIT - activeListings} slots left`}
              />
              <StatCard
                icon={<Eye s={{ width: '1.125rem', height: '1.125rem', color: TEAL }} />}
                label="Views This Month"
                value="148"
                sub="🔒 Detailed breakdown"
                locked
              />
              <StatCard
                icon={<Users s={{ width: '1.125rem', height: '1.125rem', color: TEAL }} />}
                label="Inquiries"
                value={`${monthlyInquiries} / ${INQUIRY_LIMIT}`}
                sub={monthlyInquiries >= INQUIRY_LIMIT ? "Limit reached" : `${INQUIRY_LIMIT - monthlyInquiries} remaining`}
              />
              <StatCard
                icon={<Star s={{ width: '1.125rem', height: '1.125rem', color: TEAL }} />}
                label="Featured Listings"
                value="0"
                sub="🔒 Upgrade required"
                locked
              />
            </div>

            {/* ── Usage Bars ── */}
            <div className="fade-up fade-up-2" style={{ ...card(), padding: 'clamp(1rem, 3vw, 1.5rem)', marginBottom: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: DARK, margin: '0 0 1.25rem' }}>Free Plan Usage</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <UsageBar used={activeListings}    limit={LISTING_LIMIT} label="Listings"             />
                <UsageBar used={monthlyInquiries}  limit={INQUIRY_LIMIT} label="Monthly Inquiries"   />
                <UsageBar used={5}                 limit={5}             label="Photos per Listing"  />
              </div>
              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: MUTED }}>
                  Upgrade to <strong style={{ color: DARK }}>Pro</strong> for unlimited listings, leads & analytics.
                </p>
                <Link href="/pricing" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.5rem 1rem',
                  background: `linear-gradient(135deg, ${TEAL}, hsl(174 55% 25%))`,
                  color: WHITE, borderRadius: '0.5rem', fontWeight: '600', fontSize: '0.8rem',
                  textDecoration: 'none',
                }}>
                  <Zap s={{ width: '0.75rem', height: '0.75rem' }} />
                  Upgrade – GHS 149/month
                </Link>
              </div>
            </div>

            {/* ── Section 2 & 3 side-by-side ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 'clamp(1rem, 3vw, 1.5rem)', marginBottom: 'clamp(1.25rem, 3vw, 1.75rem)' }}>

              {/* ── Listings ── */}
              <div className="fade-up fade-up-3">
                <div style={{ ...card(), overflow: 'hidden' }}>
                  <div style={{ padding: '1.25rem 1.25rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h2 style={{ fontSize: '1rem', fontWeight: '700', color: DARK, margin: 0 }}>My Listings</h2>
                      <Link href="/agent/listings" style={{ fontSize: '0.8rem', color: TEAL, textDecoration: 'none', fontWeight: '500' }}>View all</Link>
                    </div>
                  </div>

                  <div style={{ padding: '0 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {mockListings.map(l => (
                      <div key={l.id} style={{ padding: '0.875rem', backgroundColor: BG, borderRadius: '0.625rem', border: `1px solid ${BORDER}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.625rem' }}>
                          <p style={{ margin: 0, fontWeight: '600', color: DARK, fontSize: '0.875rem', flex: 1 }}>{l.title}</p>
                          <span style={{
                            padding: '0.125rem 0.5rem', borderRadius: '9999px',
                            backgroundColor: `${GREEN}15`, color: GREEN,
                            fontSize: '0.7rem', fontWeight: '600'
                          }}>
                            {l.status}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 0.625rem', fontSize: '0.875rem', fontWeight: '600', color: TEAL }}>{l.price}</p>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: MUTED }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Eye s={{ width: '0.75rem', height: '0.75rem' }} /> {l.views} views
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Users s={{ width: '0.75rem', height: '0.75rem' }} /> {l.inquiries} inquiries
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Locked slot */}
                    {activeListings < LISTING_LIMIT && (
                      <div style={{
                        padding: '0.875rem', borderRadius: '0.625rem',
                        border: `1.5px dashed ${BORDER}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        color: MUTED, fontSize: '0.8rem',
                      }}>
                        <Plus s={{ width: '0.875rem', height: '0.875rem' }} />
                        {LISTING_LIMIT - activeListings} slot{LISTING_LIMIT - activeListings !== 1 ? 's' : ''} remaining
                      </div>
                    )}

                    {/* Feature CTA */}
                    <div style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: `${AMBER}0d`, border: `1px solid ${AMBER}33`,
                      borderRadius: '0.625rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Lock s={{ width: '0.875rem', height: '0.875rem', color: AMBER }} />
                        <p style={{ margin: 0, fontSize: '0.8rem', color: DARK, fontWeight: '500' }}>Feature a listing</p>
                      </div>
                      <Link href="/pricing" style={{ fontSize: '0.75rem', fontWeight: '600', color: AMBER, textDecoration: 'none' }}>Upgrade →</Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Inquiries ── */}
              <div className="fade-up fade-up-3">
                <div style={{ ...card(), overflow: 'hidden' }}>
                  <div style={{ padding: '1.25rem 1.25rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h2 style={{ fontSize: '1rem', fontWeight: '700', color: DARK, margin: 0 }}>Recent Inquiries</h2>
                      <UpgradeBadge label="Full details" small />
                    </div>
                  </div>

                  <div style={{ padding: '0 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {mockInquiries.map((inq, i) => (
                      <div key={inq.id} style={{
                        padding: '0.875rem 0',
                        borderBottom: i < mockInquiries.length - 1 ? `1px solid ${BORDER}` : 'none',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '1.75rem', height: '1.75rem', borderRadius: '50%',
                              background: `${TEAL}1a`, color: TEAL,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.7rem', fontWeight: '700', flexShrink: 0,
                            }}>
                              {inq.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: '600', color: DARK, fontSize: '0.8125rem' }}>{inq.name}</p>
                              <p style={{ margin: 0, color: MUTED, fontSize: '0.7rem' }}>{inq.property}</p>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: MUTED, flexShrink: 0 }}>{inq.date}</span>
                        </div>
                        <p style={{ margin: '0.375rem 0 0', fontSize: '0.75rem', color: MUTED, lineHeight: '1.5' }}>
                          {inq.preview}
                        </p>
                      </div>
                    ))}

                    {/* Locked full contact CTA */}
                    <div style={{
                      marginTop: '0.75rem', padding: '0.875rem',
                      backgroundColor: `${TEAL}08`, border: `1px solid ${TEAL}22`,
                      borderRadius: '0.625rem',
                    }}>
                      <p style={{ margin: '0 0 0.5rem', fontWeight: '600', color: DARK, fontSize: '0.8125rem' }}>
                        🚀 Unlock full contact details
                      </p>
                      <p style={{ margin: '0 0 0.75rem', color: MUTED, fontSize: '0.75rem', lineHeight: '1.5' }}>
                        Upgrade to Pro to view phone numbers, emails, auto-match leads and export your CRM.
                      </p>
                      <Link href="/pricing" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                        padding: '0.5rem 0.875rem',
                        background: `linear-gradient(135deg, ${TEAL}, hsl(174 55% 25%))`,
                        color: WHITE, borderRadius: '0.5rem', fontWeight: '600', fontSize: '0.75rem',
                        textDecoration: 'none',
                      }}>
                        <Zap s={{ width: '0.75rem', height: '0.75rem' }} />
                        Upgrade to Pro
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 3: Analytics Teaser ── */}
            <div className="fade-up fade-up-4" style={{ ...card(), padding: 'clamp(1rem, 3vw, 1.5rem)', marginBottom: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: '700', color: DARK, margin: 0 }}>Performance Snapshot</h2>
                <UpgradeBadge label="Full analytics in Pro" />
              </div>

              {/* Basic visible stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Total Views', value: '148', icon: <Eye s={{ width: '1rem', height: '1rem', color: TEAL }} />, trend: '+12%' },
                  { label: 'Inquiries',   value: '6',   icon: <Users s={{ width: '1rem', height: '1rem', color: TEAL }} />, trend: '+8%' },
                  { label: 'Conv. Rate',  value: '4.1%',icon: <TrendingUp s={{ width: '1rem', height: '1rem', color: TEAL }} />, trend: '+2%' },
                ].map(m => (
                  <div key={m.label} style={{ padding: '0.875rem', backgroundColor: BG, borderRadius: '0.625rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                      {m.icon}
                      <span style={{ fontSize: '0.7rem', color: GREEN, fontWeight: '600' }}>{m.trend}</span>
                    </div>
                    <p style={{ margin: 0, fontWeight: '700', color: DARK, fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>{m.value}</p>
                    <p style={{ margin: '0.125rem 0 0', fontSize: '0.75rem', color: MUTED }}>{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Blurred chart teaser */}
              <LockedOverlay label="Unlock advanced analytics">
                <div style={{ padding: '1rem', backgroundColor: BG, borderRadius: '0.625rem' }}>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', fontWeight: '600', color: MUTED }}>Traffic Sources</p>
                  {['Direct Search', 'Referral', 'Featured', 'Social'].map((src, i) => (
                    <div key={src} style={{ marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: MUTED, marginBottom: '0.25rem' }}>
                        <span>{src}</span><span>{[45, 30, 15, 10][i]}%</span>
                      </div>
                      <div style={{ height: '6px', borderRadius: '9999px', background: BORDER }}>
                        <div style={{ height: '100%', width: `${[45, 30, 15, 10][i]}%`, borderRadius: '9999px', background: TEAL }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: WHITE, borderRadius: '0.5rem', border: `1px solid ${BORDER}` }}>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: DARK, fontWeight: '600' }}>
                      📈 Your listing is outperforming 67% of agents in your area.
                    </p>
                  </div>
                </div>
              </LockedOverlay>
            </div>

            {/* ── Section 4: Promotion Tools (Locked) ── */}
            <div className="fade-up fade-up-5" style={{ ...card(), overflow: 'hidden', marginBottom: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
              <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: '700', color: DARK, margin: 0 }}>Promotion Tools</h2>
                  <UpgradeBadge label="Pro feature" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  {[
                    { label: 'Social Auto-Share',      icon: <Megaphone s={{ width: '1.125rem', height: '1.125rem' }} />, desc: 'Auto-post to social media' },
                    { label: 'Boosted Placement',      icon: <Zap       s={{ width: '1.125rem', height: '1.125rem' }} />, desc: 'Appear at top of search' },
                    { label: 'WhatsApp Tracking',      icon: <Bell      s={{ width: '1.125rem', height: '1.125rem' }} />, desc: 'Track click-throughs' },
                    { label: 'SMS Lead Alerts',        icon: <Bell      s={{ width: '1.125rem', height: '1.125rem' }} />, desc: 'Instant SMS on new leads' },
                  ].map(tool => (
                    <div key={tool.label} style={{
                      padding: '1rem',
                      backgroundColor: BG, borderRadius: '0.625rem',
                      border: `1px solid ${BORDER}`,
                      opacity: 0.65,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ color: MUTED }}>{tool.icon}</div>
                        <Lock s={{ width: '0.75rem', height: '0.75rem', color: AMBER }} />
                      </div>
                      <p style={{ margin: 0, fontWeight: '600', color: DARK, fontSize: '0.8125rem' }}>{tool.label}</p>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: MUTED }}>{tool.desc}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Link href="/pricing" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: `linear-gradient(135deg, ${TEAL}, hsl(174 55% 25%))`,
                    color: WHITE, borderRadius: '0.625rem', fontWeight: '600', fontSize: '0.875rem',
                    textDecoration: 'none',
                  }}>
                    <Zap s={{ width: '0.875rem', height: '0.875rem' }} />
                    Upgrade to Promote Listings
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Upgrade Banner ── */}
            <div className="fade-up fade-up-5" style={{
              borderRadius: '0.875rem', overflow: 'hidden',
              background: `linear-gradient(135deg, ${TEAL} 0%, hsl(174 55% 22%) 100%)`,
              padding: 'clamp(1.25rem, 4vw, 2rem)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.375rem', color: WHITE, fontWeight: '700', fontSize: 'clamp(1.125rem, 3vw, 1.375rem)' }}>
                    🚀 Grow Faster with Pro
                  </h3>
                  <p style={{ margin: '0 0 0.875rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    Top agents on RentTrust use Pro. Join them and unlock unlimited listings, priority placement & full lead access.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {['Unlimited listings', 'Full lead access', 'Advanced analytics', 'WhatsApp automation'].map(f => (
                      <span key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem' }}>
                        <CheckCircle s={{ width: '0.875rem', height: '0.875rem', color: 'rgba(255,255,255,0.85)' }} />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href="/pricing" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.875rem 1.75rem',
                  backgroundColor: WHITE, color: TEAL,
                  borderRadius: '0.625rem', fontWeight: '700', fontSize: '0.9375rem',
                  textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap',
                }}>
                  <Zap s={{ width: '1rem', height: '1rem' }} />
                  Upgrade – GHS 149/mo
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AgentFreeDashboard;