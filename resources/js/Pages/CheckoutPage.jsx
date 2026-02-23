import { useState, useEffect, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import axios from 'axios';
import Header from "@/Components/Layouts/Header";
import Footer from "@/Components/Layouts/Footer";

// Icons (keeping your existing icons)
const CreditCard = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const Phone = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" style={{ opacity: 0.25 }} />
    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }} />
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

const AlertCircle = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Clock = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Mobile Money Provider Configuration
const mobileMoneyProviders = [
  { 
    id: 'mtn', 
    name: 'MTN Mobile Money', 
    color: '#FFC107', 
    bgColor: '#FFF3E0',
    icon: '📱',
    prefix: '024, 054, 055, 059',
    ussd: '*170#'
  },
  { 
    id: 'vodafone', 
    name: 'Vodafone Cash', 
    color: '#E60000', 
    bgColor: '#FFE5E5',
    icon: '📱',
    prefix: '020, 050',
    ussd: '*110#'
  },
  { 
    id: 'airteltigo', 
    name: 'AirtelTigo Money', 
    color: '#333333', 
    bgColor: '#F0F0F0',
    icon: '📱',
    prefix: '027, 057, 026',
    ussd: '*555#'
  },
];

// Order Summary Component
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
    <div className="overflow-hidden border rounded-xl bg-white" style={{
      borderColor: 'hsl(40 20% 88%)',
      boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)'
    }}>
      <div style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
        <h2 className="font-bold tracking-tight" style={{ 
          color: 'hsl(200 25% 15%)', 
          fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
          marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
          lineHeight: '1.2'
        }}>
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
          <div style={{
            width: 'clamp(2.5rem, 8vw, 3rem)',
            height: 'clamp(2.5rem, 8vw, 3rem)',
            borderRadius: '0.75rem',
            background: getProductColor(orderData.type),
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {getProductIcon(orderData.type)}
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 className="font-semibold" style={{ 
              color: 'hsl(200 25% 15%)',
              fontSize: 'clamp(0.9375rem, 2.5vw, 1.0625rem)',
              marginBottom: '0.25rem',
              lineHeight: '1.3'
            }}>
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
                  <li key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '0.5rem',
                    fontSize: 'clamp(0.75rem, 1.8vw, 0.8125rem)',
                    color: 'hsl(200 15% 45%)',
                    lineHeight: '1.4'
                  }}>
                    <CheckCircle2 style={{ 
                      height: '0.875rem', 
                      width: '0.875rem', 
                      color: 'hsl(152 60% 40%)',
                      flexShrink: 0,
                      marginTop: '0.125rem'
                    }} />
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)' }}>
              Subtotal
            </span>
            <span className="font-semibold" style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)' }}>
              GHS {orderData.subtotal.toFixed(2)}
            </span>
          </div>
          
          {orderData.discount && orderData.discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'hsl(152 60% 40%)', fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)', fontWeight: '500' }}>
                Discount
              </span>
              <span className="font-semibold" style={{ color: 'hsl(152 60% 40%)', fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)' }}>
                -GHS {orderData.discount.toFixed(2)}
              </span>
            </div>
          )}
          
          {orderData.tax && orderData.tax > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'hsl(200 15% 45%)', fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)' }}>
                Tax
              </span>
              <span className="font-semibold" style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)' }}>
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
          backgroundColor: getProductColor(orderData.type) + '10',
          borderRadius: '0.75rem'
        }}>
          <span className="font-bold" style={{ color: 'hsl(200 25% 15%)', fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}>
            Total
          </span>
          <span className="font-bold tracking-tight" style={{ 
            color: getProductColor(orderData.type),
            fontSize: 'clamp(1.5rem, 4vw, 1.75rem)',
            lineHeight: '1'
          }}>
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
              <span style={{ flexShrink: 0 }}>🔄</span>
              <span>This is a recurring payment. You will be charged GHS {orderData.total.toFixed(2)} {orderData.billingCycle} until you cancel.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Payment Method Selector Component
const PaymentMethodSelector = ({ selectedMethod, onMethodChange, phoneNumber, setPhoneNumber, onValidatePhone, validationError, providerInstructions }) => {
  const [isValidating, setIsValidating] = useState(false);

  const handlePhoneChange = async (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    setPhoneNumber(value);
    
    // Validate if we have both method and complete number
    if (selectedMethod && value.length === 9) {
      setIsValidating(true);
      await onValidatePhone(value, selectedMethod);
      setIsValidating(false);
    }
  };

  return (
    <div className="overflow-hidden border rounded-xl bg-white" style={{
      borderColor: 'hsl(40 20% 88%)',
      boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)'
    }}>
      <div style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
        <h2 className="font-bold tracking-tight" style={{ 
          color: 'hsl(200 25% 15%)', 
          fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
          marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
          lineHeight: '1.2'
        }}>
          Payment Method
        </h2>

        <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {/* Mobile Money Providers */}
          {mobileMoneyProviders.map((provider) => (
            <label
              key={provider.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: 'clamp(1rem, 3vw, 1.25rem)',
                border: selectedMethod === provider.id ? '2px solid hsl(174 62% 32%)' : '1px solid hsl(40 20% 88%)',
                borderRadius: '0.75rem',
                backgroundColor: selectedMethod === provider.id ? 'hsl(174 62% 32% / 0.03)' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                gap: '1rem'
              }}
              onMouseEnter={(e) => {
                if (selectedMethod !== provider.id) {
                  e.currentTarget.style.borderColor = 'hsl(174 62% 32% / 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedMethod !== provider.id) {
                  e.currentTarget.style.borderColor = 'hsl(40 20% 88%)';
                }
              }}
            >
              <input
                type="radio"
                name="payment_method"
                value={provider.id}
                checked={selectedMethod === provider.id}
                onChange={(e) => {
                  onMethodChange(e.target.value);
                  setPhoneNumber(''); // Reset phone when provider changes
                }}
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  accentColor: 'hsl(174 62% 32%)',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              />
              
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.5rem',
                background: provider.bgColor,
                color: provider.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '1.5rem'
              }}>
                {provider.icon}
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="font-semibold" style={{ 
                  color: 'hsl(200 25% 15%)',
                  fontSize: 'clamp(0.9375rem, 2.5vw, 1rem)',
                  marginBottom: '0.125rem'
                }}>
                  {provider.name}
                </p>
                <p style={{ 
                  color: 'hsl(200 15% 45%)',
                  fontSize: 'clamp(0.75rem, 2vw, 0.8125rem)',
                  margin: 0
                }}>
                  Numbers: {provider.prefix}
                </p>
              </div>
            </label>
          ))}
        </div>

        {/* Phone Number Input */}
        {selectedMethod && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500', 
              fontSize: '0.875rem', 
              color: 'hsl(200 25% 15%)' 
            }}>
              Mobile Money Number *
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                pointerEvents: 'none'
              }}>
                <Phone style={{ height: '1.125rem', width: '1.125rem', color: 'hsl(200 15% 45%)' }} />
                <span style={{ color: 'hsl(200 15% 45%)', fontSize: '0.9375rem', fontWeight: '500' }}>
                  +233
                </span>
              </div>
              <input
                type="tel"
                placeholder="XX XXX XXXX"
                value={phoneNumber}
                onChange={handlePhoneChange}
                maxLength={9}
                disabled={isValidating}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 5.5rem',
                  border: validationError ? '1px solid hsl(0 65% 51%)' : '1px solid hsl(40 20% 88%)',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  outline: 'none',
                  color: 'hsl(200 25% 15%)',
                  transition: 'border-color 0.2s ease',
                  backgroundColor: isValidating ? 'hsl(40 33% 98%)' : 'white'
                }}
                onFocus={(e) => !validationError && (e.currentTarget.style.borderColor = 'hsl(174 62% 32%)')}
                onBlur={(e) => !validationError && (e.currentTarget.style.borderColor = 'hsl(40 20% 88%)')}
              />
              {isValidating && (
                <div style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}>
                  <Loader style={{ height: '1.25rem', width: '1.25rem', color: 'hsl(174 62% 32%)', animation: 'spin 1s linear infinite' }} />
                </div>
              )}
            </div>
            
            {/* Validation Message */}
            {validationError && (
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                color: 'hsl(0 65% 51%)',
                fontSize: 'clamp(0.75rem, 1.8vw, 0.8125rem)'
              }}>
                <AlertCircle style={{ height: '1rem', width: '1rem', flexShrink: 0 }} />
                <span>{validationError}</span>
              </div>
            )}

            {/* Provider Instructions */}
            {selectedMethod && providerInstructions && (
              <div style={{ 
                marginTop: '0.75rem',
                padding: '0.75rem',
                backgroundColor: 'hsl(40 33% 98%)',
                borderRadius: '0.5rem',
                fontSize: 'clamp(0.75rem, 1.8vw, 0.8125rem)',
                color: 'hsl(200 15% 45%)'
              }}>
                <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'hsl(200 25% 15%)' }}>
                  ℹ️ Instructions:
                </strong>
                {providerInstructions}
              </div>
            )}
          </div>
        )}

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
          <Lock style={{ height: '1.25rem', width: '1.25rem', color: 'hsl(200 15% 45%)', flexShrink: 0 }} />
          <p style={{ 
            color: 'hsl(200 15% 45%)',
            fontSize: 'clamp(0.75rem, 1.8vw, 0.8125rem)',
            lineHeight: '1.5',
            margin: 0
          }}>
            Your payment is secured and encrypted. You will receive a prompt on your phone to authorize the transaction.
          </p>
        </div>
      </div>
    </div>
  );
};

// Loading State with Timer
const LoadingState = ({ timeoutDuration = 120, onTimeout, orderData = null, paymentReference = '' }) => {
  const [secondsLeft, setSecondsLeft] = useState(timeoutDuration);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        
        // Show warning when 30 seconds left
        if (prev === 31) {
          setShowTimeoutWarning(true);
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

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
        <Loader style={{ 
          width: '100%', 
          height: '100%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
      
      <h3 className="font-bold tracking-tight" style={{ 
        color: 'hsl(200 25% 15%)',
        fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
        marginBottom: '0.75rem'
      }}>
        Waiting for Payment Approval
      </h3>
      
      <p style={{ 
        color: 'hsl(200 15% 45%)',
        fontSize: 'clamp(0.9375rem, 2.5vw, 1rem)',
        lineHeight: '1.6',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        Please check your phone and approve the mobile money payment prompt to complete your transaction.
      </p>

      {/* Timer Display */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: showTimeoutWarning ? 'hsl(38 92% 50% / 0.1)' : 'hsl(40 33% 98%)',
        borderRadius: '0.75rem',
        display: 'inline-block'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock style={{ 
            height: '1.25rem', 
            width: '1.25rem', 
            color: showTimeoutWarning ? 'hsl(38 92% 50%)' : 'hsl(200 15% 45%)'
          }} />
          <span style={{ 
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            fontWeight: '700',
            fontFamily: 'monospace',
            color: showTimeoutWarning ? 'hsl(38 92% 50%)' : 'hsl(200 25% 15%)'
          }}>
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
        {showTimeoutWarning && (
          <p style={{ 
            marginTop: '0.5rem',
            color: 'hsl(38 92% 50%)',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            ⚠️ Payment session expiring soon
          </p>
        )}
      </div>

      {/* USSD Fallback Instructions */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: 'hsl(220 60% 50% / 0.05)',
        border: '1px solid hsl(220 60% 50% / 0.2)',
        borderRadius: '0.75rem',
        textAlign: 'left'
      }}>
        <h4 style={{ 
          fontWeight: '600',
          color: 'hsl(200 25% 15%)',
          marginBottom: '1rem',
          fontSize: '1rem'
        }}>
          📞 Didn't receive a prompt?
        </h4>
        <p style={{ 
          color: 'hsl(200 15% 45%)',
          fontSize: '0.875rem',
          marginBottom: '0.75rem'
        }}>
          Try these steps:
        </p>
        <ol style={{ 
          color: 'hsl(200 15% 45%)',
          fontSize: '0.875rem',
          paddingLeft: '1.5rem',
          margin: 0,
          display: 'grid',
          gap: '0.5rem'
        }}>
          <li>Dial <strong>*170#</strong> for MTN, <strong>*110#</strong> for Vodafone, or <strong>*555#</strong> for AirtelTigo</li>
          <li>Select "Mobile Money" or "Make Payment"</li>
          <li>Enter merchant code: <strong>123456</strong></li>
          <li>Enter amount: <strong>GHS {orderData?.total}</strong></li>
          <li>Enter reference: <strong>{paymentReference}</strong></li>
        </ol>
      </div>

      <p style={{ 
        color: 'hsl(38 92% 50%)',
        fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
        marginTop: '2rem',
        fontWeight: '500'
      }}>
        Do not close or refresh this page
      </p>
    </div>
  );
};

// Success State
const SuccessState = ({ orderData, transactionId, reference }) => {
  return (
    <div style={{ 
      textAlign: 'center',
      padding: 'clamp(3rem, 8vw, 5rem) clamp(1rem, 3vw, 2rem)'
    }}>
      <div style={{
        width: 'clamp(4rem, 12vw, 5rem)',
        height: 'clamp(4rem, 12vw, 5rem)',
        borderRadius: '50%',
        background: 'hsl(152 60% 40% / 0.1)',
        color: 'hsl(152 60% 40%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 2rem'
      }}>
        <CheckCircle2 style={{ height: '2.5rem', width: '2.5rem' }} />
      </div>
      
      <h3 className="font-bold tracking-tight" style={{ 
        color: 'hsl(200 25% 15%)',
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        marginBottom: '0.75rem',
        lineHeight: '1.2'
      }}>
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
        padding: '1.5rem',
        backgroundColor: 'hsl(40 33% 98%)',
        borderRadius: '0.75rem',
        marginBottom: '2rem',
        textAlign: 'left'
      }}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <p style={{ color: 'hsl(200 15% 45%)', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
              Transaction ID
            </p>
            <p className="font-semibold" style={{ 
              color: 'hsl(200 25% 15%)',
              fontSize: '1rem',
              fontFamily: 'monospace',
              margin: 0
            }}>
              {transactionId}
            </p>
          </div>
          <div>
            <p style={{ color: 'hsl(200 15% 45%)', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
              Reference
            </p>
            <p style={{ 
              color: 'hsl(200 25% 15%)',
              fontSize: '0.9375rem',
              fontFamily: 'monospace',
              margin: 0
            }}>
              {reference}
            </p>
          </div>
          <div>
            <p style={{ color: 'hsl(200 15% 45%)', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
              Date & Time
            </p>
            <p style={{ 
              color: 'hsl(200 25% 15%)',
              fontSize: '0.9375rem',
              margin: 0
            }}>
              {new Date().toLocaleString()}
            </p>
          </div>
        </div>
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

// Failure State
const FailureState = ({ error, onRetry, onCancel, reference }) => {
  return (
    <div style={{ 
      textAlign: 'center',
      padding: 'clamp(3rem, 8vw, 5rem) clamp(1rem, 3vw, 2rem)'
    }}>
      <div style={{
        width: 'clamp(4rem, 12vw, 5rem)',
        height: 'clamp(4rem, 12vw, 5rem)',
        borderRadius: '50%',
        background: 'hsl(0 65% 51% / 0.1)',
        color: 'hsl(0 65% 51%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 2rem'
      }}>
        <XCircle style={{ height: '2.5rem', width: '2.5rem' }} />
      </div>
      
      <h3 className="font-bold tracking-tight" style={{ 
        color: 'hsl(200 25% 15%)',
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        marginBottom: '0.75rem',
        lineHeight: '1.2'
      }}>
        Payment Failed
      </h3>
      
      <p style={{ 
        color: 'hsl(200 15% 45%)',
        fontSize: 'clamp(0.9375rem, 2.5vw, 1.0625rem)',
        lineHeight: '1.6',
        maxWidth: '500px',
        margin: '0 auto 1rem'
      }}>
        We couldn't complete your mobile money payment. Please check that you approved the payment prompt and have sufficient balance.
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

      {/* Troubleshooting Tips */}
      <div style={{ 
        maxWidth: '500px',
        margin: '0 auto 2rem',
        padding: '1.5rem',
        backgroundColor: 'hsl(40 33% 98%)',
        borderRadius: '0.75rem',
        textAlign: 'left'
      }}>
        <h4 style={{ 
          fontWeight: '600',
          color: 'hsl(200 25% 15%)',
          marginBottom: '1rem',
          fontSize: '1rem'
        }}>
          🔍 Troubleshooting Tips:
        </h4>
        <ul style={{ 
          color: 'hsl(200 15% 45%)',
          fontSize: '0.875rem',
          paddingLeft: '1.5rem',
          margin: 0,
          display: 'grid',
          gap: '0.5rem'
        }}>
          <li>Ensure you have sufficient balance in your mobile money account</li>
          <li>Check that you approved the payment prompt on your phone</li>
          <li>Make sure your mobile money PIN was entered correctly</li>
          <li>Verify that your SIM card is active and has network coverage</li>
          <li>If using USSD, ensure you completed all steps</li>
        </ul>
      </div>

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

// Main Checkout Component
const Checkout = ({ orderType, productId, product, providers }) => {
  const { auth } = usePage().props;
  const [paymentState, setPaymentState] = useState('form'); // 'form', 'loading', 'success', 'failure'
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [error, setError] = useState(null);
  const [paymentReference, setPaymentReference] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [orderData, setOrderData] = useState(product);
  const [pollingInterval, setPollingInterval] = useState(null);

  // Provider-specific instructions
  const providerInstructions = {
    mtn: 'Enter the number registered with MTN Mobile Money. You will receive a USSD prompt to approve the payment.',
    vodafone: 'Ensure your Vodafone Cash account is active and has sufficient balance. You will receive a prompt to approve.',
    airteltigo: 'Check that AirtelTigo Money is installed on your SIM card. You will receive a payment request shortly.'
  };

  // Load last used provider from localStorage
  useEffect(() => {
    const lastUsedProvider = localStorage.getItem('lastPaymentProvider');
    if (lastUsedProvider && providers.available.includes(lastUsedProvider)) {
      setSelectedPaymentMethod(lastUsedProvider);
    }
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const handleMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setValidationError(null);
    localStorage.setItem('lastPaymentProvider', method);
  };

  const validatePhoneNumber = async (phone, provider) => {
    try {
      const response = await axios.post('/payment/validate-phone', {
        phone: `0${phone}`, // Add leading 0 for validation
        provider
      });

      if (!response.data.valid) {
        setValidationError(response.data.message);
      } else {
        setValidationError(null);
      }

      return response.data.valid;
    } catch (error) {
      console.error('Phone validation failed:', error);
      return false;
    }
  };

  const handlePayment = async () => {
    // Validate frontend first
    if (!selectedPaymentMethod) {
        setError('Please select a mobile money provider');
        return;
    }

    if (!phoneNumber || phoneNumber.length !== 9) {
        setError('Please enter a valid 9-digit mobile money number');
        return;
    }

    setPaymentState('loading');
    setError(null);

    try {
        // Prepare data exactly as backend expects
        const requestData = {
            payable_type: 'subscription',
            payable_id: 1, // You can use 1 as default
            amount: orderData.total,
            payment_method: selectedPaymentMethod,
            phone_number: '0' + phoneNumber, // Add leading 0
            provider: 'paystack' // or let backend use default
        };

        console.log('Sending payment request:', requestData);

        const response = await axios.post('/payment/initialize', requestData);

        if (response.data.status === true || response.data.success === true) {
            // This is SUCCESS - proceed with polling
            const { payment } = response.data;
            setPaymentReference(payment.reference);
            setPaymentId(payment.id);
            startPolling(payment.reference);
        } else {
            // This is actual failure
            throw new Error(response.data.message || 'Payment initialization failed');
        }
        
    } catch (error) {
        console.error('Payment initialization error:', error);
        
        // Check if this is actually a success response being misrouted
        if (error.response?.data?.message === 'Charge attempted' || 
            error.response?.data?.status === true) {
            // This is actually success! Handle it properly
            console.log('Payment initialized successfully (caught in error handler)');
            const { payment } = error.response.data;
            setPaymentReference(payment.reference);
            setPaymentId(payment.id);
            startPolling(payment.reference);
            return;
        }
        
        // Real error handling
        setError(error.response?.data?.message || 'Failed to initialize payment');
        setPaymentState('failure');
    }
};

  // const handlePayment = async () => {
  //   // Validate phone number
  //   if (!phoneNumber || phoneNumber.length !== 9) {
  //     setValidationError('Please enter a valid 9-digit mobile money number');
  //     return;
  //   }

  //   if (!selectedPaymentMethod) {
  //     setValidationError('Please select a mobile money provider');
  //     return;
  //   }

  //   // Final validation with backend
  //   const isValid = await validatePhoneNumber(phoneNumber, selectedPaymentMethod);
  //   if (!isValid) {
  //     return;
  //   }

  //   setPaymentState('loading');
  //   setError(null);

  //   try {
  //     // Initialize payment with backend
  //     const response = await axios.post('/payment/initialize', {
  //       payable_type: orderType,
  //       payable_id: productId,
  //       provider: providers.primary, // Can add provider selection logic
  //       payment_method: selectedPaymentMethod,
  //       phone_number: `0${phoneNumber}`, // Send with leading 0
  //       amount: orderData.total,
  //       plan_id: productId,
  //       description: orderData.productName
  //     });

  //     if (!response.data.success) {
  //       throw new Error(response.data.message);
  //     }

  //     const { payment } = response.data;
  //     setPaymentReference(payment.reference);
  //     setPaymentId(payment.id);

  //     // Start polling for payment status
  //     startPolling(payment.reference);

  //   } catch (err) {
  //     setError(err.response?.data?.message || err.message || 'An unexpected error occurred');
  //     setPaymentState('failure');
  //   }
  // };

  const startPolling = (reference) => {
    // Poll every 3 seconds
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/payment/status/${reference}`);
        
        if (response.data.status === 'success') {
          clearInterval(interval);
          setTransactionId(response.data.transaction_id);
          setPaymentState('success');
        } else if (response.data.status === 'failed') {
          clearInterval(interval);
          setError('Payment failed');
          setPaymentState('failure');
        } else if (response.data.status === 'expired') {
          clearInterval(interval);
          setError('Payment session expired');
          setPaymentState('failure');
        }
        // Continue polling for 'pending'
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000);

    setPollingInterval(interval);

    // Stop polling after 2 minutes
    setTimeout(() => {
      clearInterval(interval);
      // Check final status
      checkFinalStatus(reference);
    }, 120000);
  };

  const checkFinalStatus = async (reference) => {
    try {
      const response = await axios.get(`/payment/verify/${reference}`);
      
      if (response.data.success && response.data.status === 'success') {
        setTransactionId(response.data.payment.transaction_id);
        setPaymentState('success');
      } else if (response.data.status === 'expired') {
        setError('Payment session expired');
        setPaymentState('failure');
      } else {
        setError('Payment verification timed out');
        setPaymentState('failure');
      }
    } catch (error) {
      setError('Failed to verify payment status');
      setPaymentState('failure');
    }
  };

  const handleTimeout = () => {
    if (paymentReference) {
      checkFinalStatus(paymentReference);
    } else {
      setError('Payment session timed out');
      setPaymentState('failure');
    }
  };

  const handleRetry = () => {
    setPaymentState('form');
    setError(null);
    setValidationError(null);
    setPaymentReference(null);
    setTransactionId(null);
    
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  const handleCancel = () => {
    router.visit('/agent/dashboard');
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

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Mobile touch optimization */
        @media (max-width: 768px) {
          button, input[type="radio"] {
            -webkit-tap-highlight-color: transparent;
            min-height: 44px;
          }
        }

        /* Prevent zoom on input focus for iOS */
        @media (max-width: 768px) {
          input[type="tel"] {
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
            <div className="page-header-wrapper no-print" style={{ 
              backgroundColor: 'hsl(0 0% 100%)', 
              borderBottom: '1px solid hsl(40 20% 88%)', 
              padding: 'clamp(1.5rem, 4vw, 2rem) 0' 
            }}>
              <div className="container mx-auto" style={{ 
                paddingLeft: 'clamp(0.75rem, 3vw, 1rem)', 
                paddingRight: 'clamp(0.75rem, 3vw, 1rem)',
                maxWidth: '1000px'
              }}>
                <h1 className="tracking-tight" style={{ 
                  color: 'hsl(200 25% 15%)',
                  fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                  fontWeight: '700',
                  marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)',
                  lineHeight: '1.2'
                }}>
                  Complete Your Purchase
                </h1>
                <p style={{ 
                  color: 'hsl(200 15% 45%)', 
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                }}>
                  Pay securely with mobile money
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
            {paymentState === 'loading' && (
              <LoadingState 
                timeoutDuration={120} 
                onTimeout={handleTimeout}
                orderData={orderData}
                paymentReference={paymentReference}
              />
            )}
            
            {paymentState === 'success' && (
              <SuccessState 
                orderData={orderData} 
                transactionId={transactionId} 
                reference={paymentReference}
              />
            )}
            
            {paymentState === 'failure' && (
              <FailureState 
                error={error} 
                onRetry={handleRetry} 
                onCancel={handleCancel}
                reference={paymentReference}
              />
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
                  onMethodChange={handleMethodChange}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  onValidatePhone={validatePhoneNumber}
                  validationError={validationError}
                  providerInstructions={selectedPaymentMethod ? providerInstructions[selectedPaymentMethod] : null}
                />

                {/* Confirm Payment Button */}
                <div className="overflow-hidden border rounded-xl bg-white" style={{
                  borderColor: 'hsl(40 20% 88%)',
                  boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)'
                }}>
                  <div style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}>
                    <button
                      onClick={handlePayment}
                      disabled={!selectedPaymentMethod || !phoneNumber || phoneNumber.length !== 9 || validationError}
                      className="font-bold rounded-lg transition-all duration-200 active:scale-95"
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        padding: 'clamp(1rem, 3vw, 1.25rem)',
                        fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                        backgroundColor: (!selectedPaymentMethod || !phoneNumber || phoneNumber.length !== 9 || validationError) 
                          ? 'hsl(174 62% 32% / 0.5)' 
                          : 'hsl(174 62% 32%)',
                        color: 'white',
                        border: 'none',
                        touchAction: 'manipulation',
                        cursor: (!selectedPaymentMethod || !phoneNumber || phoneNumber.length !== 9 || validationError) ? 'not-allowed' : 'pointer',
                        opacity: (!selectedPaymentMethod || !phoneNumber || phoneNumber.length !== 9 || validationError) ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (selectedPaymentMethod && phoneNumber && phoneNumber.length === 9 && !validationError) {
                          e.currentTarget.style.backgroundColor = 'hsl(174 55% 28%)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedPaymentMethod && phoneNumber && phoneNumber.length === 9 && !validationError) {
                          e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)';
                        }
                      }}
                    >
                      <Phone style={{ height: '1.25rem', width: '1.25rem' }} />
                      Pay GHS {orderData.total.toFixed(2)} with Mobile Money
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

                {/* Payment Support */}
                <div style={{ 
                  textAlign: 'center',
                  padding: '1rem',
                  color: 'hsl(200 15% 45%)',
                  fontSize: '0.875rem'
                }}>
                  <p>Having trouble? <Link href="/contact" style={{ color: 'hsl(174 62% 32%)' }}>Contact Support</Link></p>
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