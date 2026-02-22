import React, { useState } from 'react';
import { router } from '@inertiajs/react';

// Icon components
const CheckCircle2 = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Zap = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const Crown = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l7 7-7 7m7-14l7 7-7 7" />
  </svg>
);

const PricingCard = ({ plan, isPopular, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="overflow-hidden border rounded-xl bg-white transition-all duration-300 pricing-card"
      style={{
        borderColor: 'hsl(40 20% 88%)',
        borderWidth: isPopular ? '2px' : '1px',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 8px 20px -4px hsl(200 25% 15% / 0.12), 0 4px 8px -2px hsl(200 25% 15% / 0.08)'
          : isPopular 
            ? '0 4px 12px -2px hsl(174 62% 32% / 0.15), 0 2px 6px -1px hsl(174 62% 32% / 0.1)'
            : '0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      <div className="pricing-card-content" style={{ padding: '1.5rem' }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          paddingBottom: '1.25rem', 
          borderBottom: '1px solid hsl(40 20% 88%)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {plan.icon}
          </div>
          
          <h3 
            className="font-bold tracking-tight plan-name"
            style={{ 
              color: 'hsl(200 25% 15%)', 
              fontSize: '1.25rem',
              marginBottom: '0.75rem',
              lineHeight: '1.2'
            }}
          >
            {plan.name}
          </h3>
          
          <div style={{ marginBottom: '0.75rem' }}>
            <span 
              className="font-bold tracking-tight"
              style={{ 
                color: 'hsl(200 25% 15%)', 
                fontSize: '2.25rem',
                lineHeight: '1'
              }}
            >
              GHS {plan.price}
            </span>
            <span style={{ 
              color: 'hsl(200 15% 45%)', 
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              /month
            </span>
          </div>
          
          <p style={{ 
            color: 'hsl(200 15% 45%)', 
            fontSize: '0.875rem',
            lineHeight: '1.5'
          }}>
            {plan.description}
          </p>
        </div>

        {/* Features List */}
        <ul style={{ 
          listStyle: 'none', 
          marginBottom: '1.25rem',
          padding: 0
        }}>
          {plan.features.map((feature, index) => (
            <li 
              key={index}
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '0.75rem',
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
                borderBottom: index < plan.features.length - 1 ? '1px solid hsl(40 20% 88% / 0.5)' : 'none',
                fontSize: '0.875rem',
                color: 'hsl(200 25% 15%)',
                lineHeight: '1.6'
              }}
            >
              <CheckCircle2 
                style={{ 
                  height: '1.125rem', 
                  width: '1.125rem', 
                  color: 'hsl(152 60% 40%)',
                  flexShrink: 0,
                  marginTop: '0.125rem'
                }} 
              />
              <span style={{ flex: 1 }}>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          className="w-full font-semibold rounded-lg transition-all duration-200 active:scale-95 cta-button"
          onClick={() => onSelect(plan)}
          style={{
            padding: '1rem',
            fontSize: '1rem',
            backgroundColor: isPopular ? 'hsl(174 62% 32%)' : 'white',
            color: isPopular ? 'white' : 'hsl(174 62% 32%)',
            border: isPopular ? 'none' : '2px solid hsl(174 62% 32%)',
            touchAction: 'manipulation',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            if (isPopular) {
              e.currentTarget.style.backgroundColor = 'hsl(174 55% 28%)';
            } else {
              e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (isPopular) {
              e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)';
            } else {
              e.currentTarget.style.backgroundColor = 'white';
            }
          }}
        >
          {plan.ctaText}
        </button>
      </div>
    </div>
  );
};

const PricingModal = ({ isOpen, onClose }) => {
  const pricingPlans = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for getting started",
      icon: (
        <div
          style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            background: 'hsl(200 15% 45% / 0.1)',
            color: 'hsl(200 15% 45%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Zap style={{ height: '1.5rem', width: '1.5rem' }} />
        </div>
      ),
      features: [
        "Submit listings to the platform",
        "Limited visibility in search results",
        "Basic listing management",
        "Access to tenant inquiries",
        "Standard support"
      ],
      ctaText: "Choose Free",
    },
    {
      name: "Verified",
      price: 149,
      description: "Build trust and stand out",
      icon: (
        <div
          style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            background: 'hsl(174 62% 32% / 0.1)',
            color: 'hsl(174 62% 32%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CheckCircle2 style={{ height: '1.5rem', width: '1.5rem' }} />
        </div>
      ),
      features: [
        "Everything in Free, plus:",
        "Verified landlord badge",
        "Higher ranking in search results",
        "Ability to respond to reviews",
        "Priority customer support"
      ],
      ctaText: "Choose Verified",
    },
    {
      name: "Pro",
      price: 349,
      description: "Advanced tools for professionals",
      icon: (
        <div
          style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, hsl(174 62% 32% / 0.15), hsl(152 60% 40% / 0.15))',
            color: 'hsl(174 62% 32%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Crown style={{ height: '1.5rem', width: '1.5rem' }} />
        </div>
      ),
      features: [
        "Everything in Verified, plus:",
        "Unlimited property listings",
        "Lead unlock credits (50/month)",
        "Featured listing placement",
        "Dedicated account manager",
      ],
      ctaText: "Choose Pro",
    }
  ];

  const handleSelect = (plan) => {
    const pkg = plan.name.toLowerCase();

    if (pkg === 'free') {
      router.post('/agent/select-plan', { package: 'free' });
      if (onClose) onClose();
      return;
    }

    // For paid plans, redirect to the public checkout to proceed with payment
    router.visit('/checkout/plan=' + encodeURIComponent(pkg));
    if (onClose) onClose();
};

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .pricing-modal * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .pricing-modal h1, 
        .pricing-modal h2, 
        .pricing-modal h3, 
        .pricing-modal h4, 
        .pricing-modal h5, 
        .pricing-modal h6 {
          font-weight: 600;
        }

        .pricing-modal .pricing-card {
          -webkit-tap-highlight-color: transparent;
        }

        .pricing-modal .cta-button {
          min-height: 44px;
          -webkit-tap-highlight-color: transparent;
        }

        @media (max-width: 768px) {
          .pricing-modal .pricing-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (min-width: 769px) and (max-width: 1023px) {
          .pricing-modal .pricing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .pricing-modal .pricing-grid > div:last-child {
            grid-column: 1 / -1;
            max-width: 500px;
            margin: 0 auto;
            width: 100%;
          }
        }

        @media (min-width: 1024px) {
          .pricing-modal .pricing-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>

      <div 
        className="pricing-modal"
        style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 60, 
          padding: '1rem',
          overflowY: 'auto'
        }}
        onClick={onClose}
      >
        <div 
          style={{ 
            width: '100%', 
            maxWidth: '1200px', 
            background: 'hsl(40 33% 98%)', 
            borderRadius: '1rem', 
            padding: '2rem', 
            maxHeight: '90vh', 
            overflow: 'auto',
            margin: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid hsl(40 20% 88%)'
          }}>
            <div>
              <h2 
                className="tracking-tight"
                style={{ 
                  margin: 0, 
                  color: 'hsl(200 25% 15%)',
                  fontSize: '1.875rem',
                  fontWeight: '800',
                  letterSpacing: '-0.02em'
                }}
              >
                Choose Your Plan
              </h2>
              <p style={{ 
                margin: '0.5rem 0 0 0',
                color: 'hsl(200 15% 45%)',
                fontSize: '1rem'
              }}>
                Select the perfect plan to grow your rental business
              </p>
            </div>
            <button 
              onClick={onClose} 
              style={{ 
                border: 'none', 
                background: 'white', 
                fontSize: '1.5rem',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'hsl(200 15% 45%)',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(40 20% 88%)';
                e.currentTarget.style.color = 'hsl(200 25% 15%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = 'hsl(200 15% 45%)';
              }}
            >
              ✕
            </button>
          </div>

          <div 
            className="pricing-grid"
            style={{ 
              display: 'grid', 
              gap: '1.5rem'
            }}
          >
            {pricingPlans.map((plan, index) => (
              <div key={plan.name}>
                <PricingCard 
                  plan={plan} 
                  isPopular={plan.isPopular}
                  onSelect={handleSelect}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingModal;