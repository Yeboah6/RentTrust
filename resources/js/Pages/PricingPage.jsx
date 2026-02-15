import { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import Header from "../Components/Layouts/Header";
import Footer from "../Components/Layouts/Footer";

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
        borderColor: isPopular ? 'hsl(174 62% 32%)' : 'hsl(40 20% 88%)',
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
      {isPopular && (
        <div
          style={{
            position: 'absolute',
            top: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'hsl(174 62% 32%)',
            color: 'white',
            padding: '0.375rem 1rem',
            borderRadius: '9999px',
            fontSize: 'clamp(0.6875rem, 1.8vw, 0.75rem)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
            zIndex: 10
          }}
        >
          Most Popular
        </div>
      )}

      <div className="pricing-card-content" style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          paddingBottom: 'clamp(1.25rem, 3vw, 1.5rem)', 
          borderBottom: '1px solid hsl(40 20% 88%)',
          marginBottom: 'clamp(1.25rem, 3vw, 1.5rem)'
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
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
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
                fontSize: 'clamp(2.25rem, 5vw, 3rem)',
                lineHeight: '1'
              }}
            >
              GHS {plan.price}
            </span>
            <span style={{ 
              color: 'hsl(200 15% 45%)', 
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              fontWeight: '500'
            }}>
              /month
            </span>
          </div>
          
          <p style={{ 
            color: 'hsl(200 15% 45%)', 
            fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
            lineHeight: '1.5'
          }}>
            {plan.description}
          </p>
        </div>

        {/* Features List */}
        <ul style={{ 
          listStyle: 'none', 
          marginBottom: 'clamp(1.25rem, 3vw, 1.5rem)',
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
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                color: 'hsl(200 25% 15%)',
                lineHeight: '1.6'
              }}
            >
              <CheckCircle2 
                style={{ 
                  height: 'clamp(1rem, 2.5vw, 1.125rem)', 
                  width: 'clamp(1rem, 2.5vw, 1.125rem)', 
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
            padding: 'clamp(0.75rem, 2.5vw, 1rem)',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
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

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        border: '1px solid hsl(40 20% 88%)',
        borderRadius: '0.75rem',
        marginBottom: '1rem',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'hsl(174 62% 32%)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'hsl(40 20% 88%)'}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: 'clamp(1rem, 3vw, 1.25rem) clamp(1rem, 3vw, 1.5rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'white',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 33% 98%)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
      >
        <span
          className="font-semibold"
          style={{
            color: 'hsl(200 25% 15%)',
            fontSize: 'clamp(0.9375rem, 2.5vw, 1.0625rem)',
            lineHeight: '1.4',
            paddingRight: '1rem'
          }}
        >
          {question}
        </span>
        <span
          style={{
            color: 'hsl(174 62% 32%)',
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            fontWeight: '600',
            flexShrink: 0,
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
          }}
        >
          +
        </span>
      </button>
      
      <div
        style={{
          maxHeight: isOpen ? '500px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, padding 0.3s ease',
          backgroundColor: 'hsl(40 33% 98%)',
          padding: isOpen ? 'clamp(1rem, 3vw, 1.25rem) clamp(1rem, 3vw, 1.5rem)' : '0 clamp(1rem, 3vw, 1.5rem)'
        }}
      >
        <p
          style={{
            color: 'hsl(200 15% 45%)',
            fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
            lineHeight: '1.7',
            margin: 0
          }}
        >
          {answer}
        </p>
      </div>
    </div>
  );
};

const Pricing = () => {
  // const { auth } = usePage().props;
  const { props } = usePage();
  const auth = props?.auth;
  const [errorMessage, setErrorMessage] = useState(null);
  const user = auth?.agent || auth?.tenant || auth?.super;

  console.log('Auth object:', user);
  console.log('Role candidate:', user ? (user.role || user.type || user.role_name || user.roles) : 'No user');

  const pricingPlans = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for getting started",
      icon: (
        <div
          style={{
            width: 'clamp(2.5rem, 8vw, 3rem)',
            height: 'clamp(2.5rem, 8vw, 3rem)',
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
        "Submit limited listings to the platform",
        "Limited visibility in search results",
        "Basic listing management",
        "Access to tenant inquiries",
        "Standard support"
      ],
      ctaText: "Get Started Free",
      isPopular: false
    },
    {
      name: "Verified",
      price: 149,
      description: "Build trust and stand out",
      icon: (
        <div
          style={{
            width: 'clamp(2.5rem, 8vw, 3rem)',
            height: 'clamp(2.5rem, 8vw, 3rem)',
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
        // "Basic listing insights & analytics",
        "Priority customer support"
      ],
      ctaText: "Start Verification",
      isPopular: true
    },
    {
      name: "Pro",
      price: 349,
      description: "Advanced tools for professionals",
      icon: (
        <div
          style={{
            width: 'clamp(2.5rem, 8vw, 3rem)',
            height: 'clamp(2.5rem, 8vw, 3rem)',
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
        // "Advanced analytics dashboard",
        "Featured listing placement",
        "Dedicated account manager",
        // "API access for integrations"
      ],
      ctaText: "Go Pro",
      isPopular: false
    }
  ];

  const faqs = [
    {
      question: "How does verification work?",
      answer: "Our verification process includes identity confirmation, property ownership documentation, and background checks to ensure all landlords on our platform are legitimate and trustworthy."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes! You can cancel your subscription at any time. Your plan will remain active until the end of your current billing period, and you won't be charged for the next month."
    },
    {
      question: "What are lead unlock credits?",
      answer: "Lead unlock credits allow you to view full contact information for interested tenants. Each credit unlocks one tenant's contact details, making it easier to connect with serious prospects."
    },
    {
      question: "Do verified badges really make a difference?",
      answer: "Absolutely! Our data shows that verified listings receive 3x more inquiries than non-verified listings. Tenants trust verified landlords more, leading to faster rentals and higher quality applicants."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your plan at any time from your account settings. Upgrades take effect immediately, while downgrades will apply at the start of your next billing cycle."
    }
  ];

  const handleSelect = (plan) => {
    const planSlug = String(plan.name || '').toLowerCase();

    // Not logged in -> redirect to login, then back to checkout with plan
    if (!auth || !auth.user) {
      const returnUrl = `/checkout?plan=${encodeURIComponent(planSlug)}`;
      const loginUrl = `/sign-up?redirect=${encodeURIComponent(returnUrl)}`;
      router.visit(loginUrl);
      return;
    }

    // Check role for logged in users
    const user = auth?.agent || auth?.tenant || auth?.super;
    const roleCandidate = user.role || user.type || user.role_name || user.roles;
    let isAgent = false;

    

    if (Array.isArray(roleCandidate)) {
      isAgent = roleCandidate.map(r => String(r).toLowerCase()).includes('Agent') || roleCandidate.map(r => String(r).toLowerCase()).includes('landlord');
    } else if (typeof roleCandidate === 'string') {
      const rl = roleCandidate.toLowerCase();
      isAgent = rl === 'Agent' || rl === 'landlord' || rl.includes('Agent') || rl.includes('landlord');
    }

    if (!isAgent) {
      setErrorMessage('Only agents can subscribe.');
      return;
    }

    // Proceed to checkout for agents
    const checkoutUrl = `/checkout?plan=${encodeURIComponent(planSlug)}`;
    router.visit(checkoutUrl);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        h1, h2, h3, h4, h5, h6 {
          font-weight: 600;
        }

        /* Mobile touch optimization */
        @media (max-width: 768px) {
          .pricing-card {
            -webkit-tap-highlight-color: transparent;
          }

          .cta-button {
            min-height: 44px;
            -webkit-tap-highlight-color: transparent;
          }

          .pricing-card:active {
            transform: scale(0.98) !important;
          }

          .pricing-card-content {
            padding: 1.25rem;
          }
        }

        /* Extra small devices */
        @media (max-width: 480px) {
          .page-header-wrapper {
            padding: 1.5rem 0 !important;
          }

          .hero-section {
            padding: 2rem 0 !important;
          }
        }

        /* Prevent zoom on input focus for iOS */
        @media (max-width: 768px) {
          input[type="text"],
          input[type="search"] {
            font-size: 16px !important;
          }
        }

        /* Grid improvements for different screen sizes */
        .pricing-grid {
          display: grid;
          gap: clamp(1.25rem, 3vw, 2rem);
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .pricing-grid > div:last-child {
            grid-column: 1 / -1;
            max-width: 500px;
            margin: 0 auto;
            width: 100%;
          }
        }

        @media (min-width: 1024px) {
          .pricing-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 767px) {
          .pricing-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Smooth animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1 }}>
          {/* Hero Section */}
          <div 
            className="hero-section" 
            style={{ 
              backgroundColor: 'hsl(0 0% 100%)', 
              borderBottom: '1px solid hsl(40 20% 88%)',
              padding: 'clamp(3rem, 8vw, 5rem) 0',
              textAlign: 'center'
            }}
          >
            <div className="container mx-auto" style={{ 
              paddingLeft: 'clamp(0.75rem, 3vw, 1rem)', 
              paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
              maxWidth: '900px'
            }}>
              <h1 
                className="tracking-tight fade-in-up" 
                style={{ 
                  color: 'hsl(200 25% 15%)',
                  fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                  fontWeight: '800',
                  marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
                  lineHeight: '1.1',
                  letterSpacing: '-0.02em'
                }}
              >
                Build Trust. <span style={{ color: 'hsl(174 62% 32%)' }}>Get More Tenants.</span>
              </h1>
              <p 
                className="fade-in-up"
                style={{ 
                  color: 'hsl(200 15% 45%)',
                  fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                  lineHeight: '1.7',
                  maxWidth: '650px',
                  margin: '0 auto',
                  animationDelay: '0.1s'
                }}
              >
                Join hundreds of verified landlords who are attracting quality tenants with verified badges, 
                higher visibility, and powerful tools designed to grow your rental business.
              </p>
            </div>
          </div>

           {errorMessage && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: 8, background: 'hsl(0 72% 51% / 0.12)', border: '1px solid hsl(0 72% 51% / 0.18)', color: 'hsl(0 72% 51%)' }}>
              {errorMessage}
            </div>
          )}

          {/* Pricing Cards Section */}
          <div className="container mx-auto" style={{ 
            paddingLeft: 'clamp(0.75rem, 3vw, 1rem)', 
            paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
            paddingTop: 'clamp(3rem, 8vw, 5rem)',
            paddingBottom: 'clamp(2rem, 6vw, 3rem)',
            maxWidth: '1200px'
          }}>
            <div className="pricing-grid">
              {pricingPlans.map((plan, index) => (
                <div 
                  key={plan.name}
                  className="fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PricingCard 
                    plan={plan} 
                    isPopular={plan.isPopular}
                    onSelect={handleSelect}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div style={{ 
            backgroundColor: 'hsl(0 0% 100%)',
            borderTop: '1px solid hsl(40 20% 88%)',
            padding: 'clamp(3rem, 8vw, 5rem) 0'
          }}>
            <div className="container mx-auto" style={{ 
              paddingLeft: 'clamp(0.75rem, 3vw, 1rem)', 
              paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
              maxWidth: '900px'
            }}>
              <h2 
                className="tracking-tight"
                style={{ 
                  color: 'hsl(200 25% 15%)',
                  fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                  fontWeight: '800',
                  textAlign: 'center',
                  marginBottom: 'clamp(2rem, 5vw, 3rem)',
                  lineHeight: '1.2',
                  letterSpacing: '-0.02em'
                }}
              >
                Frequently Asked Questions
              </h2>
              
              <div>
                {faqs.map((faq, index) => (
                  <FAQItem 
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div style={{ 
            backgroundColor: 'hsl(40 33% 98%)',
            padding: 'clamp(3rem, 8vw, 5rem) 0',
            textAlign: 'center'
          }}>
            <div className="container mx-auto" style={{ 
              paddingLeft: 'clamp(0.75rem, 3vw, 1rem)', 
              paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
              maxWidth: '700px'
            }}>
              <h2 
                className="tracking-tight"
                style={{ 
                  color: 'hsl(200 25% 15%)',
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  lineHeight: '1.2'
                }}
              >
                Ready to get started?
              </h2>
              <p style={{ 
                color: 'hsl(200 15% 45%)',
                fontSize: 'clamp(0.9375rem, 2.5vw, 1.0625rem)',
                marginBottom: '2rem',
                lineHeight: '1.7'
              }}>
                Join RentTrust today and start building trust with quality tenants.
              </p>
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <Link
                  href="/signup"
                  className="font-semibold rounded-lg text-white transition-all duration-200 active:scale-95"
                  style={{ 
                    backgroundColor: 'hsl(174 62% 32%)',
                    padding: 'clamp(0.75rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
                    fontSize: 'clamp(0.9375rem, 2vw, 1rem)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    touchAction: 'manipulation',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 55% 28%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)'}
                >
                  Get Started Free
                </Link>
                <Link
                  href="/contact"
                  className="font-semibold rounded-lg transition-all duration-200 active:scale-95"
                  style={{ 
                    backgroundColor: 'white',
                    color: 'hsl(174 62% 32%)',
                    border: '2px solid hsl(174 62% 32%)',
                    padding: 'clamp(0.75rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
                    fontSize: 'clamp(0.9375rem, 2vw, 1rem)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    touchAction: 'manipulation',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Pricing;