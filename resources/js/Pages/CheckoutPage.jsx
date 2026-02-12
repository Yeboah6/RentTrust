import { useState, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import Header from "../Components/Layouts/Header";
import Footer from "../Components/Layouts/Footer";

// Icon components
const CreditCard = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
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

const Loader = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24">
    <circle 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round"
      style={{
        opacity: 0.25
      }}
    />
    <path 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      style={{
        opacity: 0.75
      }}
    />
  </svg>
);

const ArrowRight = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const Lock = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const Shield = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Package = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const Zap = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const Users = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const OrderSummary = ({ orderData }) => {
  const getProductIcon = (type) => {
    if (type === 'subscription') return <Shield style={{ height: '1.5rem', width: '1.5rem' }} />;
    if (type === 'boost') return <Zap style={{ height: '1.5rem', width: '1.5rem' }} />;
    if (type === 'lead_unlock') return <Users style={{ height: '1.5rem', width: '1.5rem' }} />;
    return <Package style={{ height: '1.5rem', width: '1.5rem' }} />;
  };

  const getProductColor = (type) => {
    if (type === 'subscription') return 'hsl(174 62% 32%)';
    if (type === 'boost') return 'hsl(38 92% 50%)';
    if (type === 'lead_unlock') return 'hsl(274 62% 52%)';
    return 'hsl(200 15% 45%)';
  };

  return (
    <div
      className="overflow-hidden border rounded-xl bg-white"
      style={{
        borderColor: 'hsl(40 20% 88%)',
        boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)'
      }}
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
          Order Summary
        </h2>

        {/* Product Details */}
        <div style={{ 
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          padding: 'clamp(1rem, 3vw, 1.25rem)',
          backgroundColor: 'hsl(40 33% 98%)',
          borderRadius: '0.75rem',
          marginBottom: 'clamp(1.5rem, 3vw, 2rem)'
        }}>
          <div
            style={{
              width: 'clamp(2.5rem, 8vw, 3rem)',
              height: 'clamp(2.5rem, 8vw, 3rem)',
              borderRadius: '0.75rem',
              background: `${getProductColor(orderData.type)} / 0.1`,
              color: getProductColor(orderData.type),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {getProductIcon(orderData.type)}
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 
              className="font-semibold"
              style={{ 
                color: 'hsl(200 25% 15%)',
                fontSize: 'clamp(0.9375rem, 2.5vw, 1.0625rem)',
                marginBottom: '0.25rem',
                lineHeight: '1.3'
              }}
            >
              {orderData.productName}
            </h3>
            <p style={{ 
              color: 'hsl(200 15% 45%)',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
              lineHeight: '1.5'
            }}>
              {orderData.description}
            </p>
            {orderData.features && orderData.features.length > 0 && (
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                marginTop: '0.75rem',
                display: 'grid',
                gap: '0.5rem'
              }}>
                {orderData.features.slice(0, 3).map((feature, index) => (
                  <li 
                    key={index}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '0.5rem',
                      fontSize: 'clamp(0.75rem, 1.8vw, 0.8125rem)',
                      color: 'hsl(200 15% 45%)',
                      lineHeight: '1.4'
                    }}
                  >
                    <CheckCircle2 
                      style={{ 
                        height: '0.875rem', 
                        width: '0.875rem', 
                        color: 'hsl(152 60% 40%)',
                        flexShrink: 0,
                        marginTop: '0.125rem'
                      }} 
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Price Breakdown */}
        <div style={{ 
          display: 'grid',
          gap: '0.75rem',
          paddingBottom: '1rem',
          marginBottom: '1rem',
          borderBottom: '1px solid hsl(40 20% 88%)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ 
              color: 'hsl(200 15% 45%)',
              fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)'
            }}>
              Subtotal
            </span>
            <span 
              className="font-semibold"
              style={{ 
                color: 'hsl(200 25% 15%)',
                fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)'
              }}
            >
              GHS {orderData.subtotal.toFixed(2)}
            </span>
          </div>
          
          {orderData.discount && orderData.discount > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ 
                color: 'hsl(152 60% 40%)',
                fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
                fontWeight: '500'
              }}>
                Discount
              </span>
              <span 
                className="font-semibold"
                style={{ 
                  color: 'hsl(152 60% 40%)',
                  fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)'
                }}
              >
                -GHS {orderData.discount.toFixed(2)}
              </span>
            </div>
          )}
          
          {orderData.tax && orderData.tax > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ 
                color: 'hsl(200 15% 45%)',
                fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)'
              }}>
                Tax
              </span>
              <span 
                className="font-semibold"
                style={{ 
                  color: 'hsl(200 25% 15%)',
                  fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)'
                }}
              >
                GHS {orderData.tax.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Total */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'clamp(1rem, 3vw, 1.25rem)',
          backgroundColor: `${getProductColor(orderData.type)} / 0.05`,
          borderRadius: '0.75rem'
        }}>
          <span 
            className="font-bold"
            style={{ 
              color: 'hsl(200 25% 15%)',
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)'
            }}
          >
            Total
          </span>
          <span 
            className="font-bold tracking-tight"
            style={{ 
              color: getProductColor(orderData.type),
              fontSize: 'clamp(1.5rem, 4vw, 1.75rem)',
              lineHeight: '1'
            }}
          >
            GHS {orderData.total.toFixed(2)}
          </span>
        </div>

        {/* Recurring Note */}
        {orderData.isRecurring && (
          <div style={{ 
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: 'hsl(220 60% 50% / 0.05)',
            border: '1px solid hsl(220 60% 50% / 0.2)',
            borderRadius: '0.5rem'
          }}>
            <p style={{ 
              color: 'hsl(200 15% 45%)',
              fontSize: 'clamp(0.75rem, 1.8vw, 0.8125rem)',
              lineHeight: '1.5',
              margin: 0,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem'
            }}>
              <span style={{ flexShrink: 0 }}>ℹ️</span>
              <span>This is a recurring payment. You will be charged GHS {orderData.total.toFixed(2)} {orderData.billingCycle} until you cancel.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const PaymentMethodSelector = ({ selectedMethod, onMethodChange, savedCards }) => {
  return (
    <div
      className="overflow-hidden border rounded-xl bg-white"
      style={{
        borderColor: 'hsl(40 20% 88%)',
        boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)'
      }}
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
          Payment Method
        </h2>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {/* Saved Cards */}
          {savedCards && savedCards.length > 0 && (
            <>
              {savedCards.map((card) => (
                <label
                  key={card.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 'clamp(1rem, 3vw, 1.25rem)',
                    border: selectedMethod === `card_${card.id}` ? '2px solid hsl(174 62% 32%)' : '1px solid hsl(40 20% 88%)',
                    borderRadius: '0.75rem',
                    backgroundColor: selectedMethod === `card_${card.id}` ? 'hsl(174 62% 32% / 0.03)' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    gap: '1rem'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedMethod !== `card_${card.id}`) {
                      e.currentTarget.style.borderColor = 'hsl(174 62% 32% / 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedMethod !== `card_${card.id}`) {
                      e.currentTarget.style.borderColor = 'hsl(40 20% 88%)';
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={`card_${card.id}`}
                    checked={selectedMethod === `card_${card.id}`}
                    onChange={(e) => onMethodChange(e.target.value)}
                    style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      accentColor: 'hsl(174 62% 32%)',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  />
                  
                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
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
                    <p 
                      className="font-semibold"
                      style={{ 
                        color: 'hsl(200 25% 15%)',
                        fontSize: 'clamp(0.9375rem, 2.5vw, 1rem)',
                        marginBottom: '0.125rem'
                      }}
                    >
                      {card.brand} •••• {card.last4}
                    </p>
                    <p style={{ 
                      color: 'hsl(200 15% 45%)',
                      fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                      margin: 0
                    }}>
                      Expires {card.expiryDate}
                    </p>
                  </div>
                  
                  {card.isDefault && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.625rem',
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
                </label>
              ))}
            </>
          )}

          {/* New Card Option */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 'clamp(1rem, 3vw, 1.25rem)',
              border: selectedMethod === 'new_card' ? '2px solid hsl(174 62% 32%)' : '1px solid hsl(40 20% 88%)',
              borderRadius: '0.75rem',
              backgroundColor: selectedMethod === 'new_card' ? 'hsl(174 62% 32% / 0.03)' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              gap: '1rem'
            }}
            onMouseEnter={(e) => {
              if (selectedMethod !== 'new_card') {
                e.currentTarget.style.borderColor = 'hsl(174 62% 32% / 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMethod !== 'new_card') {
                e.currentTarget.style.borderColor = 'hsl(40 20% 88%)';
              }
            }}
          >
            <input
              type="radio"
              name="payment_method"
              value="new_card"
              checked={selectedMethod === 'new_card'}
              onChange={(e) => onMethodChange(e.target.value)}
              style={{
                width: '1.25rem',
                height: '1.25rem',
                accentColor: 'hsl(174 62% 32%)',
                cursor: 'pointer',
                flexShrink: 0
              }}
            />
            
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
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
              <p 
                className="font-semibold"
                style={{ 
                  color: 'hsl(200 25% 15%)',
                  fontSize: 'clamp(0.9375rem, 2.5vw, 1rem)',
                  marginBottom: '0.125rem'
                }}
              >
                Use a new card
              </p>
              <p style={{ 
                color: 'hsl(200 15% 45%)',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                margin: 0
              }}>
                Credit or debit card
              </p>
            </div>
          </label>
        </div>

        {/* Security Badge */}
        <div style={{ 
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: 'hsl(40 33% 98%)',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Lock style={{ 
            height: '1.25rem', 
            width: '1.25rem', 
            color: 'hsl(200 15% 45%)',
            flexShrink: 0
          }} />
          <p style={{ 
            color: 'hsl(200 15% 45%)',
            fontSize: 'clamp(0.75rem, 1.8vw, 0.8125rem)',
            lineHeight: '1.5',
            margin: 0
          }}>
            Your payment information is encrypted and secure. We never store your full card details.
          </p>
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div style={{ 
      textAlign: 'center',
      padding: 'clamp(3rem, 8vw, 5rem) clamp(1rem, 3vw, 2rem)'
    }}>
      <div style={{ 
        width: 'clamp(4rem, 12vw, 5rem)',
        height: 'clamp(4rem, 12vw, 5rem)',
        margin: '0 auto 2rem',
        color: 'hsl(174 62% 32%)'
      }}>
        <Loader 
          style={{ 
            width: '100%', 
            height: '100%',
            animation: 'spin 1s linear infinite'
          }} 
        />
      </div>
      <h3 
        className="font-bold tracking-tight"
        style={{ 
          color: 'hsl(200 25% 15%)',
          fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
          marginBottom: '0.75rem'
        }}
      >
        Processing Payment
      </h3>
      <p style={{ 
        color: 'hsl(200 15% 45%)',
        fontSize: 'clamp(0.9375rem, 2.5vw, 1rem)',
        lineHeight: '1.6',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        Please wait while we securely process your payment. This may take a few moments.
      </p>
      <p style={{ 
        color: 'hsl(38 92% 50%)',
        fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
        marginTop: '1rem',
        fontWeight: '500'
      }}>
        Do not close or refresh this page
      </p>
    </div>
  );
};

const SuccessState = ({ orderData, transactionId }) => {
  return (
    <div style={{ 
      textAlign: 'center',
      padding: 'clamp(3rem, 8vw, 5rem) clamp(1rem, 3vw, 2rem)'
    }}>
      <div
        style={{
          width: 'clamp(4rem, 12vw, 5rem)',
          height: 'clamp(4rem, 12vw, 5rem)',
          borderRadius: '50%',
          background: 'hsl(152 60% 40% / 0.1)',
          color: 'hsl(152 60% 40%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem'
        }}
      >
        <CheckCircle2 style={{ height: '2.5rem', width: '2.5rem' }} />
      </div>
      
      <h3 
        className="font-bold tracking-tight"
        style={{ 
          color: 'hsl(200 25% 15%)',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          marginBottom: '0.75rem',
          lineHeight: '1.2'
        }}
      >
        Payment Successful!
      </h3>
      
      <p style={{ 
        color: 'hsl(200 15% 45%)',
        fontSize: 'clamp(0.9375rem, 2.5vw, 1.0625rem)',
        lineHeight: '1.6',
        maxWidth: '500px',
        margin: '0 auto 2rem'
      }}>
        Your payment has been processed successfully. You now have access to {orderData.productName}.
      </p>

      {/* Transaction Details */}
      <div style={{ 
        display: 'inline-block',
        padding: '1rem 1.5rem',
        backgroundColor: 'hsl(40 33% 98%)',
        borderRadius: '0.75rem',
        marginBottom: '2rem'
      }}>
        <p style={{ 
          color: 'hsl(200 15% 45%)',
          fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
          marginBottom: '0.25rem'
        }}>
          Transaction ID
        </p>
        <p 
          className="font-semibold"
          style={{ 
            color: 'hsl(200 25% 15%)',
            fontSize: 'clamp(0.9375rem, 2.5vw, 1rem)',
            fontFamily: 'monospace',
            margin: 0
          }}
        >
          {transactionId}
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <Link
          href="/dashboard"
          className="font-semibold rounded-lg transition-all duration-200 active:scale-95"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: 'clamp(0.75rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
            fontSize: 'clamp(0.9375rem, 2vw, 1rem)',
            backgroundColor: 'hsl(174 62% 32%)',
            color: 'white',
            border: 'none',
            touchAction: 'manipulation',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 55% 28%)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)'}
        >
          Go to Dashboard
          <ArrowRight style={{ height: '1rem', width: '1rem' }} />
        </Link>
        
        <button
          onClick={() => window.print()}
          className="font-semibold rounded-lg transition-all duration-200 active:scale-95"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: 'clamp(0.75rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
            fontSize: 'clamp(0.9375rem, 2vw, 1rem)',
            backgroundColor: 'white',
            color: 'hsl(174 62% 32%)',
            border: '1px solid hsl(174 62% 32%)',
            touchAction: 'manipulation',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32% / 0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
        >
          Print Receipt
        </button>
      </div>

      {/* Email Confirmation Note */}
      <p style={{ 
        color: 'hsl(200 15% 45%)',
        fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
        marginTop: '2rem'
      }}>
        A confirmation email has been sent to your registered email address.
      </p>
    </div>
  );
};

const FailureState = ({ error, onRetry, onCancel }) => {
  return (
    <div style={{ 
      textAlign: 'center',
      padding: 'clamp(3rem, 8vw, 5rem) clamp(1rem, 3vw, 2rem)'
    }}>
      <div
        style={{
          width: 'clamp(4rem, 12vw, 5rem)',
          height: 'clamp(4rem, 12vw, 5rem)',
          borderRadius: '50%',
          background: 'hsl(0 65% 51% / 0.1)',
          color: 'hsl(0 65% 51%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem'
        }}
      >
        <XCircle style={{ height: '2.5rem', width: '2.5rem' }} />
      </div>
      
      <h3 
        className="font-bold tracking-tight"
        style={{ 
          color: 'hsl(200 25% 15%)',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          marginBottom: '0.75rem',
          lineHeight: '1.2'
        }}
      >
        Payment Failed
      </h3>
      
      <p style={{ 
        color: 'hsl(200 15% 45%)',
        fontSize: 'clamp(0.9375rem, 2.5vw, 1.0625rem)',
        lineHeight: '1.6',
        maxWidth: '500px',
        margin: '0 auto 1rem'
      }}>
        We couldn't process your payment. Please check your payment details and try again.
      </p>

      {/* Error Message */}
      {error && (
        <div style={{ 
          display: 'inline-block',
          padding: '1rem 1.5rem',
          backgroundColor: 'hsl(0 65% 51% / 0.05)',
          border: '1px solid hsl(0 65% 51% / 0.2)',
          borderRadius: '0.75rem',
          marginBottom: '2rem',
          maxWidth: '500px'
        }}>
          <p style={{ 
            color: 'hsl(0 65% 51%)',
            fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
            margin: 0,
            fontWeight: '500'
          }}>
            {error}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={onRetry}
          className="font-semibold rounded-lg transition-all duration-200 active:scale-95"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: 'clamp(0.75rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
            fontSize: 'clamp(0.9375rem, 2vw, 1rem)',
            backgroundColor: 'hsl(174 62% 32%)',
            color: 'white',
            border: 'none',
            touchAction: 'manipulation',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 55% 28%)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)'}
        >
          Try Again
        </button>
        
        <button
          onClick={onCancel}
          className="font-semibold rounded-lg transition-all duration-200 active:scale-95"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: 'clamp(0.75rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
            fontSize: 'clamp(0.9375rem, 2vw, 1rem)',
            backgroundColor: 'white',
            color: 'hsl(200 25% 15%)',
            border: '1px solid hsl(40 20% 88%)',
            touchAction: 'manipulation',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(40 33% 98%)';
            e.currentTarget.style.borderColor = 'hsl(200 25% 15% / 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = 'hsl(40 20% 88%)';
          }}
        >
          Cancel
        </button>
      </div>

      {/* Help Text */}
      <p style={{ 
        color: 'hsl(200 15% 45%)',
        fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
        marginTop: '2rem'
      }}>
        Need help? <Link 
          href="/contact" 
          style={{ 
            color: 'hsl(174 62% 32%)', 
            fontWeight: '500',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
        >
          Contact Support
        </Link>
      </p>
    </div>
  );
};

const Checkout = ({ orderType, productId }) => {
  const { auth } = usePage().props;
  const [paymentState, setPaymentState] = useState('form'); // 'form', 'loading', 'success', 'failure'
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('new_card');
  const [error, setError] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  // Mock data - replace with actual data from backend based on orderType and productId
  const [orderData, setOrderData] = useState(null);
  const [savedCards, setSavedCards] = useState([]);

  useEffect(() => {
    // Fetch order details based on orderType and productId
    // This would come from your backend
    const mockOrderData = {
      subscription: {
        type: 'subscription',
        productName: 'Verified Plan',
        description: 'Monthly subscription to RentTrust Verified',
        subtotal: 149.00,
        discount: 0,
        tax: 0,
        total: 149.00,
        isRecurring: true,
        billingCycle: 'monthly',
        features: [
          'Verified landlord badge',
          'Higher ranking in search results',
          'Ability to respond to reviews',
          'Basic listing insights & analytics'
        ]
      },
      boost: {
        type: 'boost',
        productName: 'Listing Boost - 7 Days',
        description: 'Boost your listing to the top for 7 days',
        subtotal: 50.00,
        discount: 0,
        tax: 0,
        total: 50.00,
        isRecurring: false,
        features: [
          'Featured placement for 7 days',
          '3x more visibility',
          'Highlighted badge'
        ]
      },
      lead_unlock: {
        type: 'lead_unlock',
        productName: 'Lead Credits - 10 Pack',
        description: 'Unlock contact details for 10 interested tenants',
        subtotal: 75.00,
        discount: 0,
        tax: 0,
        total: 75.00,
        isRecurring: false,
        features: [
          '10 lead unlock credits',
          'Full contact information',
          'Credits never expire'
        ]
      }
    };

    const mockSavedCards = [
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

    setOrderData(mockOrderData[orderType] || mockOrderData.subscription);
    setSavedCards(mockSavedCards);
    
    // Set default payment method if cards exist
    if (mockSavedCards.length > 0) {
      const defaultCard = mockSavedCards.find(card => card.isDefault);
      setSelectedPaymentMethod(defaultCard ? `card_${defaultCard.id}` : `card_${mockSavedCards[0].id}`);
    }
  }, [orderType, productId]);

  const handlePayment = async () => {
    setPaymentState('loading');
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate

      if (isSuccess) {
        setTransactionId(`TXN-${Date.now()}`);
        setPaymentState('success');
        
        // You would make an actual API call here
        // const response = await router.post('/api/process-payment', {
        //   orderType,
        //   productId,
        //   paymentMethod: selectedPaymentMethod,
        //   amount: orderData.total
        // });
      } else {
        throw new Error('Payment was declined by your bank. Please check your card details or try a different payment method.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setPaymentState('failure');
    }
  };

  const handleRetry = () => {
    setPaymentState('form');
    setError(null);
  };

  const handleCancel = () => {
    router.visit('/dashboard');
  };

  if (!orderData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingState />
      </div>
    );
  }

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

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
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
          input[type="search"],
          input[type="radio"] {
            font-size: 16px !important;
          }
        }

        /* Print styles */
        @media print {
          header, footer, .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1 }}>
          {/* Page Header */}
          {paymentState === 'form' && (
            <div 
              className="page-header-wrapper no-print" 
              style={{ 
                backgroundColor: 'hsl(0 0% 100%)', 
                borderBottom: '1px solid hsl(40 20% 88%)', 
                padding: 'clamp(1.5rem, 4vw, 2rem) 0' 
              }}
            >
              <div className="container mx-auto" style={{ 
                paddingLeft: 'clamp(0.75rem, 3vw, 1rem)', 
                paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
                maxWidth: '1000px'
              }}>
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
                  Checkout
                </h1>
                <p style={{ 
                  color: 'hsl(200 15% 45%)', 
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                }}>
                  Complete your purchase securely
                </p>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="container mx-auto" style={{ 
            paddingLeft: 'clamp(0.75rem, 3vw, 1rem)', 
            paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
            paddingTop: paymentState === 'form' ? 'clamp(2rem, 5vw, 3rem)' : 0,
            paddingBottom: 'clamp(2rem, 5vw, 3rem)',
            maxWidth: '1000px'
          }}>
            {paymentState === 'loading' && <LoadingState />}
            
            {paymentState === 'success' && (
              <SuccessState orderData={orderData} transactionId={transactionId} />
            )}
            
            {paymentState === 'failure' && (
              <FailureState error={error} onRetry={handleRetry} onCancel={handleCancel} />
            )}

            {paymentState === 'form' && (
              <div style={{ 
                display: 'grid', 
                gap: 'clamp(1.5rem, 4vw, 2rem)',
                gridTemplateColumns: '1fr',
                maxWidth: '900px',
                margin: '0 auto'
              }}>
                {/* Order Summary */}
                <OrderSummary orderData={orderData} />

                {/* Payment Method */}
                <PaymentMethodSelector
                  selectedMethod={selectedPaymentMethod}
                  onMethodChange={setSelectedPaymentMethod}
                  savedCards={savedCards}
                />

                {/* Confirm Payment Button */}
                <div
                  className="overflow-hidden border rounded-xl bg-white"
                  style={{
                    borderColor: 'hsl(40 20% 88%)',
                    boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)'
                  }}
                >
                  <div style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
                    <button
                      onClick={handlePayment}
                      className="font-bold rounded-lg transition-all duration-200 active:scale-95"
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        padding: 'clamp(1rem, 3vw, 1.25rem)',
                        fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                        backgroundColor: 'hsl(174 62% 32%)',
                        color: 'white',
                        border: 'none',
                        touchAction: 'manipulation',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 55% 28%)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)'}
                    >
                      <Lock style={{ height: '1.25rem', width: '1.25rem' }} />
                      Confirm Payment - GHS {orderData.total.toFixed(2)}
                    </button>

                    <p style={{ 
                      color: 'hsl(200 15% 45%)',
                      fontSize: 'clamp(0.75rem, 1.8vw, 0.8125rem)',
                      textAlign: 'center',
                      marginTop: '1rem',
                      lineHeight: '1.5'
                    }}>
                      By confirming this payment, you agree to our{' '}
                      <Link 
                        href="/terms" 
                        style={{ 
                          color: 'hsl(174 62% 32%)', 
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                      >
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link 
                        href="/privacy" 
                        style={{ 
                          color: 'hsl(174 62% 32%)', 
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                      >
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Checkout;