import React, { useState } from 'react';
// import { Search, MapPin, Shield } from 'lucide-react';

const PropertyMosaic = () => (
  <div style={{
    position: 'absolute', right: 0, top: 0, bottom: 0, width: '56%', zIndex: 1,
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)', gap: '4px',
  }}>
    {/* Tall cell spanning 2 rows */}
    <div style={{ gridRow: '1 / 3', background: 'hsl(174 25% 22%)', overflow: 'hidden' }}>
      <img src="/images/download 2.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
    </div>
    <div style={{ background: 'hsl(200 30% 18%)', overflow: 'hidden' }}>
      <img src="/images/download 1.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
    </div>
    <div style={{ background: 'hsl(174 35% 16%)', overflow: 'hidden' }}>
      <img src="/images/download 2.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
    </div>
    {/* Wide cell spanning 2 columns */}
    <div style={{ gridColumn: '2 / 4', background: 'hsl(30 25% 18%)', overflow: 'hidden' }}>
      <img src="/images/download 1.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
    </div>
    <div style={{ background: 'hsl(220 30% 16%)', overflow: 'hidden' }}>
      <img src="/images/download 3.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
    </div>
    <div style={{ background: 'hsl(174 20% 14%)', overflow: 'hidden' }}>
      <img src="/images/download 5.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
    </div>
    <div style={{ background: 'hsl(15 25% 16%)', overflow: 'hidden' }}>
      <img src="/images/download 4.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
    </div>
  </div>
);

const HeroSection = ( { totalAreas, totalListings, totalVerifiedAgents, users } ) => {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { value: totalAreas,     label: 'Areas Covered' },
    { value: totalVerifiedAgents,    label: 'Verified Agents' },
    { value: totalListings, label: 'Properties Listed' },
  ];

  return (
    <section style={{ position: 'relative', overflow: 'hidden', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>

      {/* Base dark teal background */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, hsl(174 62% 20%), hsl(174 50% 12%))', zIndex: 0 }} />

      {/* Property mosaic — right side */}
      <PropertyMosaic />

      {/* Gradient overlay — fades mosaic into content */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'linear-gradient(to right, hsl(174 60% 14% / 0.97) 0%, hsl(174 55% 14% / 0.82) 42%, hsl(174 55% 14% / 0.35) 100%)',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 2rem 3rem 3rem', maxWidth: '560px' }}>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'hsl(0 0% 100% / 0.12)', border: '1px solid hsl(0 0% 100% / 0.2)', borderRadius: '999px', padding: '5px 14px', fontSize: '13px', color: 'white', fontWeight: 500, marginBottom: '1.25rem', width: 'fit-content' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'hsl(152 60% 52%)', flexShrink: 0 }} />
          Trusted by {users.toLocaleString()} Ghanaians
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
          Rent Smarter.<br />
          <span style={{ color: 'hsl(38 92% 60%)' }}>Sell Confidently.</span>
        </h1>

        <p style={{ fontSize: '1rem', color: 'hsl(0 0% 100% / 0.72)', lineHeight: 1.6, margin: '0 0 1.75rem', maxWidth: '420px' }}>
          Find the best rental properties or sell your home with confidence.
          Real prices, verified agents, and honest reviews across Ghana.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
          {stats.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div style={{ width: '1px', height: '36px', background: 'hsl(0 0% 100% / 0.15)' }} />}
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: 'hsl(0 0% 100% / 0.52)', marginTop: '2px' }}>{s.label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Warning strip */}
      <div style={{ position: 'relative', zIndex: 3, background: 'hsl(38 92% 50% / 0.12)', borderTop: '1px solid hsl(38 92% 50% / 0.25)', padding: '10px 3rem', fontSize: '15px', color: 'hsl(38 70% 85%)', fontWeight: 500, textAlign: 'center', }}>
        ⚠ Always inspect a property in person before paying any money
      </div>
    </section>
  );
};

export default HeroSection;