import { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import Header from "../Components/Layouts/Header";
import Footer from "../Components/Layouts/Footer";

// Icon components
const CreditCard = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const Download = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const Calendar = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CheckCircle2 = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircle = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircle = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Plus = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const Trash2 = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const Crown = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l7 7-7 7m7-14l7 7-7 7" />
  </svg>
);

const Zap = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const CurrentPlanCard = ({ currentPlan, onUpgrade, onCancel }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPlanIcon = (planName) => {
    if (planName === 'Pro') return <Crown style={{ height: '1.5rem', width: '1.5rem' }} />;
    if (planName === 'Verified') return <CheckCircle2 style={{ height: '1.5rem', width: '1.5rem' }} />;
    return <Zap style={{ height: '1.5rem', width: '1.5rem' }} />;
  };

  const getPlanColor = (planName) => {
    if (planName === 'Pro') return 'hsl(274 62% 52%)';
    if (planName === 'Verified') return 'hsl(174 62% 32%)';
    return 'hsl(200 15% 45%)';
  };

  return (
    <div
      className="overflow-hidden border rounded-xl bg-white transition-all duration-300"
      style={{
        borderColor: 'hsl(40 20% 88%)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 8px 20px -4px hsl(200 25% 15% / 0.12), 0 4px 8px -2px hsl(200 25% 15% / 0.08)'
          : '0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h2 
            className="font-bold tracking-tight"
            style={{ 
              color: 'hsl(200 25% 15%)', 
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              lineHeight: '1.2'
            }}
          >
            Current Plan
          </h2>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: `${getPlanColor(currentPlan.name)} / 0.1`,
              color: getPlanColor(currentPlan.name),
              borderRadius: '9999px',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
              fontWeight: '600'
            }}
          >
            <div style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              background: `${getPlanColor(currentPlan.name)} / 0.15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getPlanIcon(currentPlan.name)}
            </div>
            {currentPlan.name}
          </div>
        </div>

        {/* Plan Details */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'clamp(1rem, 3vw, 1.5rem)',
          marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
          paddingBottom: 'clamp(1.5rem, 3vw, 2rem)',
          borderBottom: '1px solid hsl(40 20% 88%)'
        }}>
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <Calendar style={{ 
                height: '1.125rem', 
                width: '1.125rem', 
                color: 'hsl(200 15% 45%)' 
              }} />
              <span style={{ 
                color: 'hsl(200 15% 45%)', 
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                fontWeight: '500'
              }}>
                Renewal Date
              </span>
            </div>
            <p 
              className="font-semibold"
              style={{ 
                color: 'hsl(200 25% 15%)',
                fontSize: 'clamp(0.9375rem, 2.5vw, 1rem)'
              }}
            >
              {currentPlan.renewalDate}
            </p>
          </div>

          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <CreditCard style={{ 
                height: '1.125rem', 
                width: '1.125rem', 
                color: 'hsl(200 15% 45%)' 
              }} />
              <span style={{ 
                color: 'hsl(200 15% 45%)', 
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                fontWeight: '500'
              }}>
                Monthly Cost
              </span>
            </div>
            <p 
              className="font-semibold"
              style={{ 
                color: 'hsl(200 25% 15%)',
                fontSize: 'clamp(0.9375rem, 2.5vw, 1rem)'
              }}
            >
              GHS {currentPlan.price}/month
            </p>
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
          <h3 
            className="font-semibold"
            style={{ 
              color: 'hsl(200 25% 15%)',
              fontSize: 'clamp(0.9375rem, 2.5vw, 1rem)',
              marginBottom: '1rem'
            }}
          >
            Your Benefits
          </h3>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0,
            display: 'grid',
            gap: '0.75rem'
          }}>
            {currentPlan.features.map((feature, index) => (
              <li 
                key={index}
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '0.625rem',
                  fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                  color: 'hsl(200 25% 15%)',
                  lineHeight: '1.5'
                }}
              >
                <CheckCircle2 
                  style={{ 
                    height: '1rem', 
                    width: '1rem', 
                    color: 'hsl(152 60% 40%)',
                    flexShrink: 0,
                    marginTop: '0.125rem'
                  }} 
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}>
          {currentPlan.name !== 'Pro' && (
            <button
              onClick={onUpgrade}
              className="font-semibold rounded-lg transition-all duration-200 active:scale-95"
              style={{
                flex: '1',
                minWidth: '140px',
                padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.25rem)',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                backgroundColor: 'hsl(174 62% 32%)',
                color: 'white',
                border: 'none',
                touchAction: 'manipulation',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 55% 28%)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)'}
            >
              Upgrade Plan
            </button>
          )}
          <button
            onClick={onCancel}
            className="font-semibold rounded-lg transition-all duration-200 active:scale-95"
            style={{
              flex: currentPlan.name === 'Pro' ? '1' : '0',
              minWidth: '140px',
              padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.25rem)',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
              backgroundColor: 'white',
              color: 'hsl(0 65% 51%)',
              border: '1px solid hsl(0 65% 51% / 0.3)',
              touchAction: 'manipulation',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'hsl(0 65% 51% / 0.05)';
              e.currentTarget.style.borderColor = 'hsl(0 65% 51%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = 'hsl(0 65% 51% / 0.3)';
            }}
          >
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

const PaymentMethodSection = ({ paymentMethods, onAddCard, onRemoveCard }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="overflow-hidden border rounded-xl bg-white transition-all duration-300"
      style={{
        borderColor: 'hsl(40 20% 88%)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 8px 20px -4px hsl(200 25% 15% / 0.12), 0 4px 8px -2px hsl(200 25% 15% / 0.08)'
          : '0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h2 
            className="font-bold tracking-tight"
            style={{ 
              color: 'hsl(200 25% 15%)', 
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              lineHeight: '1.2'
            }}
          >
            Payment Methods
          </h2>
          <button
            onClick={onAddCard}
            className="font-semibold rounded-lg transition-all duration-200 active:scale-95"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.875rem, 3vw, 1rem)',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
              backgroundColor: 'white',
              color: 'hsl(174 62% 32%)',
              border: '1px solid hsl(174 62% 32%)',
              touchAction: 'manipulation',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <Plus style={{ height: '1rem', width: '1rem' }} />
            Add Card
          </button>
        </div>

        {paymentMethods.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 'clamp(2rem, 5vw, 3rem) 1rem',
            backgroundColor: 'hsl(40 33% 98%)',
            borderRadius: '0.75rem'
          }}>
            <CreditCard style={{ 
              height: 'clamp(2.5rem, 8vw, 3rem)', 
              width: 'clamp(2.5rem, 8vw, 3rem)', 
              color: 'hsl(200 15% 45% / 0.5)', 
              margin: '0 auto 1rem' 
            }} />
            <h3 
              className="font-semibold"
              style={{ 
                color: 'hsl(200 25% 15%)',
                fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                marginBottom: '0.5rem'
              }}
            >
              No payment methods added
            </h3>
            <p style={{ 
              color: 'hsl(200 15% 45%)',
              fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
              marginBottom: '1.5rem'
            }}>
              Add a payment method to manage your subscription
            </p>
            <button
              onClick={onAddCard}
              className="font-semibold rounded-lg transition-all duration-200 active:scale-95"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1.25rem, 3vw, 1.5rem)',
                fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
                backgroundColor: 'hsl(174 62% 32%)',
                color: 'white',
                border: 'none',
                touchAction: 'manipulation',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 55% 28%)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)'}
            >
              <Plus style={{ height: '1.125rem', width: '1.125rem' }} />
              Add Your First Card
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {paymentMethods.map((card) => (
              <div
                key={card.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'clamp(1rem, 3vw, 1.25rem)',
                  border: '1px solid hsl(40 20% 88%)',
                  borderRadius: '0.75rem',
                  backgroundColor: card.isDefault ? 'hsl(174 62% 32% / 0.03)' : 'white',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1', minWidth: '200px' }}>
                  <div
                    style={{
                      width: 'clamp(2.5rem, 8vw, 3rem)',
                      height: 'clamp(2.5rem, 8vw, 3rem)',
                      borderRadius: '0.5rem',
                      background: 'hsl(174 62% 32% / 0.1)',
                      color: 'hsl(174 62% 32%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <CreditCard style={{ height: '1.25rem', width: '1.25rem' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <p 
                        className="font-semibold"
                        style={{ 
                          color: 'hsl(200 25% 15%)',
                          fontSize: 'clamp(0.9375rem, 2.5vw, 1rem)',
                          margin: 0
                        }}
                      >
                        •••• {card.last4}
                      </p>
                      {card.isDefault && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.125rem 0.5rem',
                            fontSize: 'clamp(0.6875rem, 1.8vw, 0.75rem)',
                            fontWeight: '500',
                            backgroundColor: 'hsl(174 62% 32% / 0.1)',
                            color: 'hsl(174 62% 32%)',
                            borderRadius: '9999px'
                          }}
                        >
                          Default
                        </span>
                      )}
                    </div>
                    <p style={{ 
                      color: 'hsl(200 15% 45%)',
                      fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                      margin: 0
                    }}>
                      {card.brand} • Expires {card.expiryDate}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => onRemoveCard(card.id)}
                  className="font-medium rounded-lg transition-all duration-200 active:scale-95"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.75rem, 2.5vw, 1rem)',
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                    backgroundColor: 'white',
                    color: 'hsl(0 65% 51%)',
                    border: '1px solid hsl(0 65% 51% / 0.2)',
                    touchAction: 'manipulation',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(0 65% 51% / 0.05)';
                    e.currentTarget.style.borderColor = 'hsl(0 65% 51%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = 'hsl(0 65% 51% / 0.2)';
                  }}
                >
                  <Trash2 style={{ height: '0.875rem', width: '0.875rem' }} />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BillingHistoryTable = ({ transactions, onDownloadInvoice }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusIcon = (status) => {
    if (status === 'paid') return <CheckCircle2 style={{ height: '1rem', width: '1rem' }} />;
    if (status === 'failed') return <XCircle style={{ height: '1rem', width: '1rem' }} />;
    return <AlertCircle style={{ height: '1rem', width: '1rem' }} />;
  };

  const getStatusColor = (status) => {
    if (status === 'paid') return 'hsl(152 60% 40%)';
    if (status === 'failed') return 'hsl(0 65% 51%)';
    return 'hsl(38 92% 50%)';
  };

  return (
    <div
      className="overflow-hidden border rounded-xl bg-white transition-all duration-300"
      style={{
        borderColor: 'hsl(40 20% 88%)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 8px 20px -4px hsl(200 25% 15% / 0.12), 0 4px 8px -2px hsl(200 25% 15% / 0.08)'
          : '0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
        <h2 
          className="font-bold tracking-tight"
          style={{ 
            color: 'hsl(200 25% 15%)', 
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
            lineHeight: '1.2'
          }}
        >
          Billing History
        </h2>

        {/* Desktop Table */}
        <div className="desktop-table" style={{ display: 'none' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid hsl(40 20% 88%)' }}>
                <th style={{ 
                  padding: '0.75rem 0',
                  textAlign: 'left',
                  color: 'hsl(200 15% 45%)',
                  fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Date
                </th>
                <th style={{ 
                  padding: '0.75rem 0',
                  textAlign: 'left',
                  color: 'hsl(200 15% 45%)',
                  fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Description
                </th>
                <th style={{ 
                  padding: '0.75rem 0',
                  textAlign: 'left',
                  color: 'hsl(200 15% 45%)',
                  fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Amount
                </th>
                <th style={{ 
                  padding: '0.75rem 0',
                  textAlign: 'left',
                  color: 'hsl(200 15% 45%)',
                  fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Status
                </th>
                <th style={{ 
                  padding: '0.75rem 0',
                  textAlign: 'right',
                  color: 'hsl(200 15% 45%)',
                  fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr 
                  key={transaction.id}
                  style={{ 
                    borderBottom: '1px solid hsl(40 20% 88%)',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 33% 98%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ 
                    padding: '1rem 0',
                    color: 'hsl(200 25% 15%)',
                    fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)'
                  }}>
                    {transaction.date}
                  </td>
                  <td style={{ 
                    padding: '1rem 0',
                    color: 'hsl(200 25% 15%)',
                    fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)'
                  }}>
                    {transaction.description}
                  </td>
                  <td style={{ 
                    padding: '1rem 0',
                    color: 'hsl(200 25% 15%)',
                    fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
                    fontWeight: '600'
                  }}>
                    GHS {transaction.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.25rem 0.75rem',
                        fontSize: 'clamp(0.75rem, 1.8vw, 0.8125rem)',
                        fontWeight: '500',
                        backgroundColor: `${getStatusColor(transaction.status)} / 0.1`,
                        color: getStatusColor(transaction.status),
                        borderRadius: '9999px',
                        textTransform: 'capitalize'
                      }}
                    >
                      {getStatusIcon(transaction.status)}
                      {transaction.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                    {transaction.status === 'paid' && (
                      <button
                        onClick={() => onDownloadInvoice(transaction.id)}
                        className="font-medium rounded-lg transition-all duration-200 active:scale-95"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          padding: '0.5rem 0.875rem',
                          fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                          backgroundColor: 'white',
                          color: 'hsl(174 62% 32%)',
                          border: '1px solid hsl(174 62% 32%)',
                          touchAction: 'manipulation',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        <Download style={{ height: '0.875rem', width: '0.875rem' }} />
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="mobile-cards" style={{ display: 'grid', gap: '1rem' }}>
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              style={{
                padding: '1rem',
                border: '1px solid hsl(40 20% 88%)',
                borderRadius: '0.75rem',
                backgroundColor: 'white'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '0.75rem',
                gap: '0.5rem'
              }}>
                <div style={{ flex: 1 }}>
                  <p 
                    className="font-semibold"
                    style={{ 
                      color: 'hsl(200 25% 15%)',
                      fontSize: 'clamp(0.9375rem, 2.5vw, 1rem)',
                      marginBottom: '0.25rem'
                    }}
                  >
                    {transaction.description}
                  </p>
                  <p style={{ 
                    color: 'hsl(200 15% 45%)',
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
                  }}>
                    {transaction.date}
                  </p>
                </div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.25rem 0.625rem',
                    fontSize: 'clamp(0.75rem, 1.8vw, 0.8125rem)',
                    fontWeight: '500',
                    backgroundColor: `${getStatusColor(transaction.status)} / 0.1`,
                    color: getStatusColor(transaction.status),
                    borderRadius: '9999px',
                    textTransform: 'capitalize',
                    flexShrink: 0
                  }}
                >
                  {getStatusIcon(transaction.status)}
                  {transaction.status}
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.75rem',
                borderTop: '1px solid hsl(40 20% 88%)',
                gap: '0.75rem'
              }}>
                <span 
                  className="font-semibold"
                  style={{ 
                    color: 'hsl(200 25% 15%)',
                    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)'
                  }}
                >
                  GHS {transaction.amount.toFixed(2)}
                </span>
                {transaction.status === 'paid' && (
                  <button
                    onClick={() => onDownloadInvoice(transaction.id)}
                    className="font-medium rounded-lg transition-all duration-200 active:scale-95"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.5rem 0.875rem',
                      fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                      backgroundColor: 'white',
                      color: 'hsl(174 62% 32%)',
                      border: '1px solid hsl(174 62% 32%)',
                      touchAction: 'manipulation',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <Download style={{ height: '0.875rem', width: '0.875rem' }} />
                    Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {transactions.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: 'clamp(2rem, 5vw, 3rem) 1rem',
            backgroundColor: 'hsl(40 33% 98%)',
            borderRadius: '0.75rem'
          }}>
            <Calendar style={{ 
              height: 'clamp(2.5rem, 8vw, 3rem)', 
              width: 'clamp(2.5rem, 8vw, 3rem)', 
              color: 'hsl(200 15% 45% / 0.5)', 
              margin: '0 auto 1rem' 
            }} />
            <h3 
              className="font-semibold"
              style={{ 
                color: 'hsl(200 25% 15%)',
                fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                marginBottom: '0.5rem'
              }}
            >
              No billing history yet
            </h3>
            <p style={{ 
              color: 'hsl(200 15% 45%)',
              fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)'
            }}>
              Your transactions will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const AgentBillingDashboard = () => {
  const { auth } = usePage().props;

  // Mock data - replace with actual data from backend
  const currentPlan = {
    name: 'Verified',
    price: 149,
    renewalDate: 'March 15, 2026',
    features: [
      'Verified landlord badge',
      'Higher ranking in search results',
      'Ability to respond to reviews',
      'Basic listing insights & analytics',
      'Priority customer support'
    ]
  };

  const paymentMethods = [
    {
      id: 1,
      brand: 'Visa',
      last4: '4242',
      expiryDate: '12/25',
      isDefault: true
    },
    {
      id: 2,
      brand: 'Mastercard',
      last4: '8888',
      expiryDate: '03/26',
      isDefault: false
    }
  ];

  const transactions = [
    {
      id: 1,
      date: 'Feb 15, 2026',
      description: 'Verified Plan - Monthly Subscription',
      amount: 149.00,
      status: 'paid'
    },
    {
      id: 2,
      date: 'Jan 15, 2026',
      description: 'Verified Plan - Monthly Subscription',
      amount: 149.00,
      status: 'paid'
    },
    {
      id: 3,
      date: 'Dec 15, 2025',
      description: 'Verified Plan - Monthly Subscription',
      amount: 149.00,
      status: 'paid'
    },
    {
      id: 4,
      date: 'Nov 15, 2025',
      description: 'Pro Plan - Monthly Subscription',
      amount: 349.00,
      status: 'failed'
    },
    {
      id: 5,
      date: 'Oct 15, 2025',
      description: 'Free Plan - Trial Period',
      amount: 0.00,
      status: 'paid'
    }
  ];

  const handleUpgrade = () => {
    router.visit('/pricing');
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel your subscription? You will lose access to all premium features at the end of your billing period.')) {
      // Handle cancellation
      console.log('Cancelling subscription...');
    }
  };

  const handleAddCard = () => {
    // Open payment method modal
    console.log('Add card...');
  };

  const handleRemoveCard = (cardId) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      console.log('Removing card:', cardId);
    }
  };

  const handleDownloadInvoice = (transactionId) => {
    console.log('Downloading invoice:', transactionId);
    // Implement download logic
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

        /* Desktop table - show on larger screens */
        @media (min-width: 769px) {
          .desktop-table {
            display: block !important;
          }
          .mobile-cards {
            display: none !important;
          }
        }

        /* Mobile cards - show on smaller screens */
        @media (max-width: 768px) {
          .desktop-table {
            display: none !important;
          }
          .mobile-cards {
            display: grid !important;
          }
        }

        /* Mobile touch optimization */
        @media (max-width: 768px) {
          button {
            -webkit-tap-highlight-color: transparent;
            min-height: 44px;
          }
        }

        /* Extra small devices */
        @media (max-width: 480px) {
          .page-header-wrapper {
            padding: 1.5rem 0 !important;
          }
        }

        /* Prevent zoom on input focus for iOS */
        @media (max-width: 768px) {
          input[type="text"],
          input[type="search"] {
            font-size: 16px !important;
          }
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1 }}>
          {/* Page Header */}
          <div 
            className="page-header-wrapper" 
            style={{ 
              backgroundColor: 'hsl(0 0% 100%)', 
              borderBottom: '1px solid hsl(40 20% 88%)', 
              padding: 'clamp(1.5rem, 4vw, 2rem) 0' 
            }}
          >
            <div className="container mx-auto" style={{ 
              paddingLeft: 'clamp(0.75rem, 3vw, 1rem)', 
              paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
              maxWidth: '1200px'
            }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <Link
                  href="/dashboard"
                  style={{
                    color: 'hsl(174 62% 32%)',
                    fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
                    fontWeight: '500',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  ← Back to Dashboard
                </Link>
              </div>
              <h1 
                className="tracking-tight" 
                style={{ 
                  color: 'hsl(200 25% 15%)',
                  fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                  fontWeight: '700',
                  marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)',
                  lineHeight: '1.2'
                }}
              >
                Billing & Subscription
              </h1>
              <p style={{ 
                color: 'hsl(200 15% 45%)', 
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
              }}>
                Manage your subscription, payment methods, and view billing history
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="container mx-auto" style={{ 
            paddingLeft: 'clamp(0.75rem, 3vw, 1rem)', 
            paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
            paddingTop: 'clamp(2rem, 5vw, 3rem)',
            paddingBottom: 'clamp(2rem, 5vw, 3rem)',
            maxWidth: '1200px'
          }}>
            <div style={{ display: 'grid', gap: 'clamp(1.5rem, 4vw, 2rem)' }}>
              {/* Current Plan */}
              <CurrentPlanCard 
                currentPlan={currentPlan}
                onUpgrade={handleUpgrade}
                onCancel={handleCancel}
              />

              {/* Payment Methods */}
              <PaymentMethodSection
                paymentMethods={paymentMethods}
                onAddCard={handleAddCard}
                onRemoveCard={handleRemoveCard}
              />

              {/* Billing History */}
              <BillingHistoryTable
                transactions={transactions}
                onDownloadInvoice={handleDownloadInvoice}
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AgentBillingDashboard;