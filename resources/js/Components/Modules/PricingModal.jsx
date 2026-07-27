import React, { useState } from 'react';
import { router } from '@inertiajs/react';

// ─── Icons ────────────────────────────────────────────────────────────────────

const CheckCircle2 = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Zap = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const Crown = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l7 7-7 7m7-14l7 7-7 7" />
  </svg>
);

// ─── Plan icon by slug ─────────────────────────────────────────────────────────

const PlanIcon = ({ slug }) => {
  const icons = {
    free: (
      <div style={{
        width: 'clamp(2.5rem, 8vw, 3rem)',
        height: 'clamp(2.5rem, 8vw, 3rem)',
        borderRadius: '50%',
        background: 'hsl(200 15% 45% / 0.1)',
        color: 'hsl(200 15% 45%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Zap style={{ height: 'clamp(1.25rem, 4vw, 1.5rem)', width: 'clamp(1.25rem, 4vw, 1.5rem)' }} />
      </div>
    ),
    pro: (
      <div style={{
        width: 'clamp(2.5rem, 8vw, 3rem)',
        height: 'clamp(2.5rem, 8vw, 3rem)',
        borderRadius: '50%',
        background: 'hsl(174 62% 32% / 0.1)',
        color: 'hsl(174 62% 32%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CheckCircle2 style={{ height: 'clamp(1.25rem, 4vw, 1.5rem)', width: 'clamp(1.25rem, 4vw, 1.5rem)' }} />
      </div>
    ),
    elite: (
      <div style={{
        width: 'clamp(2.5rem, 8vw, 3rem)',
        height: 'clamp(2.5rem, 8vw, 3rem)',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, hsl(174 62% 32% / 0.15), hsl(152 60% 40% / 0.15))',
        color: 'hsl(174 62% 32%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Crown style={{ height: 'clamp(1.25rem, 4vw, 1.5rem)', width: 'clamp(1.25rem, 4vw, 1.5rem)' }} />
      </div>
    ),
  };

  return icons[slug] ?? icons.free;
};

// ─── Pricing Card ─────────────────────────────────────────────────────────────

const PricingCard = ({ plan, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPopular = plan.is_popular;

  return (
    <div
      className="overflow-hidden border rounded-xl bg-white transition-all duration-300"
      style={{
        borderColor: isPopular ? 'hsl(174 62% 32%)' : 'hsl(40 20% 88%)',
        borderWidth: isPopular ? '2px' : '1px',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 8px 20px -4px hsl(200 25% 15% / 0.12)'
          : isPopular
            ? '0 4px 12px -2px hsl(174 62% 32% / 0.15)'
            : '0 2px 8px -2px hsl(200 25% 15% / 0.1)',
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isPopular && (
        <div style={{
          position: 'absolute',
          top: '-1px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'hsl(174 62% 32%)',
          color: 'white',
          fontSize: 'clamp(0.6rem, 2vw, 0.65rem)',
          fontWeight: '700',
          letterSpacing: '0.08em',
          padding: '0.2rem 0.75rem',
          borderRadius: '0 0 0.5rem 0.5rem',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap'
        }}>
          Most Popular
        </div>
      )}

      <div style={{
        padding: isPopular ? 'clamp(1rem, 3vw, 1.5rem) clamp(1rem, 3vw, 1.5rem) 1.25rem' : 'clamp(1rem, 3vw, 1.25rem)',
        paddingTop: isPopular ? 'clamp(1.75rem, 4vw, 2rem)' : 'clamp(1rem, 3vw, 1.25rem)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', paddingBottom: '1rem', borderBottom: '1px solid hsl(40 20% 88%)', marginBottom: '1rem' }}>
          <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PlanIcon slug={plan.slug} />
          </div>
          <h3 style={{
            color: 'hsl(200 25% 15%)',
            fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            {plan.name}
          </h3>
          <div style={{ marginBottom: '0.5rem' }}>
            {plan.is_free
              ? <span style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1.75rem, 5vw, 2.25rem)', fontWeight: '700' }}>Free</span>
              : <>
                  <span style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1.75rem, 5vw, 2.25rem)', fontWeight: '700' }}>GHS {plan.price}</span>
                  <span style={{ color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.875rem, 2vw, 1rem)', fontWeight: '500' }}>/month</span>
                </>
            }
          </div>
          <p style={{
            color: 'hsl(200 15% 45%)',
            fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
            lineHeight: '1.5',
            margin: 0
          }}>
            {plan.description}
          </p>
        </div>

        {/* Features — from DB via plansForModal() */}
        <ul style={{ listStyle: 'none', marginBottom: '1.25rem', padding: 0 }}>
          {(plan.features ?? []).map((feature, i) => (
            <li key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              padding: '0.6rem 0',
              borderBottom: i < plan.features.length - 1 ? '1px solid hsl(40 20% 88% / 0.5)' : 'none',
              fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
              color: 'hsl(200 25% 15%)',
              lineHeight: '1.5'
            }}>
              <CheckCircle2 style={{ height: 'clamp(1rem, 2.5vw, 1.125rem)', width: 'clamp(1rem, 2.5vw, 1.125rem)', color: 'hsl(152 60% 40%)', flexShrink: 0, marginTop: '0.125rem' }} />
              <span style={{ flex: 1 }}>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={() => onSelect(plan)}
          style={{
            width: '100%',
            padding: 'clamp(0.75rem, 2vw, 1rem)',
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            fontWeight: '600',
            backgroundColor: isPopular ? 'hsl(174 62% 32%)' : 'white',
            color: isPopular ? 'white' : 'hsl(174 62% 32%)',
            border: isPopular ? 'none' : '2px solid hsl(174 62% 32%)',
            cursor: 'pointer',
            borderRadius: '0.5rem',
            minHeight: '44px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = isPopular ? 'hsl(174 55% 28%)' : 'hsl(174 62% 32% / 0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = isPopular ? 'hsl(174 62% 32%)' : 'white'; }}
        >
          {plan.cta_text}
        </button>
      </div>
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────

const PricingModal = ({ isOpen, onClose, plans = [] }) => {

  const handleSelect = (plan) => {
    if (onClose) onClose();

    if (plan.is_free) {
      router.post('/agent/select-plan', { package: 'free' });
      return;
    }

    router.visit(`/checkout/${plan.slug}`);
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .pricing-modal * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }

        /* Mobile-first grid */
        .pricing-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        /* Tablet */
        @media (min-width: 640px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          /* On tablet, make the third card span full width if only 3 plans */
          .pricing-grid > div:last-child:nth-child(3) {
            grid-column: 1 / -1;
            max-width: 500px;
            margin: 0 auto;
            width: 100%;
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .pricing-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .pricing-grid > div:last-child:nth-child(3) {
            grid-column: auto;
            max-width: none;
            margin: 0;
          }
        }
      `}</style>

      <div
        className="pricing-modal"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60,
          padding: 'clamp(0.75rem, 3vw, 1.5rem)',
          overflowY: 'auto'
        }}
        onClick={onClose}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            background: 'hsl(40 33% 98%)',
            borderRadius: 'clamp(0.75rem, 2vw, 1rem)',
            padding: 'clamp(1rem, 4vw, 2rem)',
            maxHeight: '90vh',
            overflow: 'auto',
            margin: 'auto'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
            marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
            paddingBottom: 'clamp(0.75rem, 2vw, 1rem)',
            borderBottom: '1px solid hsl(40 20% 88%)',
            flexWrap: 'wrap'
          }}>
            <div>
              <h2 style={{
                margin: 0,
                color: 'hsl(200 25% 15%)',
                fontSize: 'clamp(1.5rem, 5vw, 1.875rem)',
                fontWeight: '800',
                letterSpacing: '-0.02em'
              }}>
                Choose Your Plan
              </h2>
              <p style={{
                margin: '0.25rem 0 0',
                color: 'hsl(200 15% 45%)',
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
              }}>
                Select the perfect plan to grow your rental business
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'white',
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                width: 'clamp(2.5rem, 8vw, 2.5rem)',
                height: 'clamp(2.5rem, 8vw, 2.5rem)',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'hsl(200 15% 45%)',
                flexShrink: 0,
                minHeight: '44px',
                minWidth: '44px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsl(40 20% 88%)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; }}
            >✕</button>
          </div>

          {/* Plans grid */}
          {plans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'hsl(200 15% 45%)' }}>
              Loading plans...
            </div>
          ) : (
            <div className="pricing-grid">
              {plans.map(plan => (
                <div key={plan.slug}>
                  <PricingCard plan={plan} onSelect={handleSelect} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PricingModal;