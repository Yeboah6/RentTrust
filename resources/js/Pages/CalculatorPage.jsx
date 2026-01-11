import { useState } from "react";
import Header from "../Components/Layouts/Header";
import Footer from "../Components/Layouts/Footer";

// Icon components
const Calculator = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const DollarSign = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Calendar = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const TrendingUp = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const AlertCircle = ({ className, style }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RentCalculator = () => {
  const [monthlyRent, setMonthlyRent] = useState(1000);
  const [advanceYears, setAdvanceYears] = useState(2);
  const [agentFee, setAgentFee] = useState(10);
  const [includeUtilities, setIncludeUtilities] = useState(false);
  const [utilities, setUtilities] = useState(0);

  const calculateTotal = () => {
    const advancePayment = monthlyRent * 12 * advanceYears;
    const agentFeeCost = (monthlyRent * 12) * (agentFee / 100);
    const utilitiesCost = includeUtilities ? utilities : 0;
    const total = advancePayment + agentFeeCost + utilitiesCost;
    
    return {
      advancePayment,
      agentFeeCost,
      utilitiesCost,
      total
    };
  };

  const results = calculateTotal();

  return (
    <div className="container mx-auto px-4">
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, hsl(174 62% 32% / 0.2) 0%, hsl(174 62% 32% / 0.05) 100%)',
            marginBottom: '1rem'
          }}>
            <Calculator style={{ height: '2rem', width: '2rem', color: 'hsl(174 62% 32%)' }} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3" style={{ color: 'hsl(200 25% 15%)' }}>
            Rent Calculator
          </h1>
          <p style={{ color: 'hsl(200 15% 45%)', fontSize: '1.125rem', maxWidth: '42rem', margin: '0 auto' }}>
            Calculate your total move-in costs including advance rent, agent fees, and utilities
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Calculator Card */}
          <div 
            style={{
              backgroundColor: 'white',
              border: '1px solid hsl(40 20% 88%)',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 2px 8px -2px hsl(200 25% 15% / 0.1), 0 1px 3px -1px hsl(200 25% 15% / 0.06)'
            }}
          >
            <h2 className="text-xl font-semibold tracking-tight mb-6" style={{ color: 'hsl(200 25% 15%)' }}>
              Input Details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Monthly Rent */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '500', color: 'hsl(200 25% 15%)' }}>
                  <DollarSign style={{ height: '1rem', width: '1rem', color: 'hsl(174 62% 32%)' }} />
                  Monthly Rent (GH₵)
                </label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid hsl(40 20% 88%)',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    outline: 'none',
                    color: 'hsl(200 25% 15%)'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'hsl(174 62% 32%)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'hsl(40 20% 88%)'}
                />
                <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginTop: '0.375rem' }}>
                  Annual: GH₵{(monthlyRent * 12).toLocaleString()}
                </p>
              </div>

              {/* Advance Years */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '500', color: 'hsl(200 25% 15%)' }}>
                  <Calendar style={{ height: '1rem', width: '1rem', color: 'hsl(174 62% 32%)' }} />
                  Advance Payment (Years)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={advanceYears}
                  onChange={(e) => setAdvanceYears(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '0.5rem',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    background: `linear-gradient(to right, hsl(174 62% 32%) 0%, hsl(174 62% 32%) ${(advanceYears - 1) * 25}%, hsl(40 20% 88%) ${(advanceYears - 1) * 25}%, hsl(40 20% 88%) 100%)`
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>1 year</span>
                  <span className="font-semibold" style={{ fontSize: '1rem', color: 'hsl(174 62% 32%)' }}>
                    {advanceYears} {advanceYears === 1 ? 'year' : 'years'}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>5 years</span>
                </div>
              </div>

              {/* Agent Fee */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '500', color: 'hsl(200 25% 15%)' }}>
                  <TrendingUp style={{ height: '1rem', width: '1rem', color: 'hsl(174 62% 32%)' }} />
                  Agent Fee (%)
                </label>
                <input
                  type="number"
                  value={agentFee}
                  onChange={(e) => setAgentFee(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid hsl(40 20% 88%)',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    outline: 'none',
                    color: 'hsl(200 25% 15%)'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'hsl(174 62% 32%)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'hsl(40 20% 88%)'}
                />
                <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)', marginTop: '0.375rem' }}>
                  Typical range: 8-15% of annual rent
                </p>
              </div>

              {/* Utilities */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    type="checkbox"
                    checked={includeUtilities}
                    onChange={(e) => setIncludeUtilities(e.target.checked)}
                    style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      cursor: 'pointer',
                      accentColor: 'hsl(174 62% 32%)'
                    }}
                  />
                  <span style={{ fontWeight: '500', color: 'hsl(200 25% 15%)' }}>
                    Include Utilities Deposit
                  </span>
                </label>
                {includeUtilities && (
                  <input
                    type="number"
                    value={utilities}
                    onChange={(e) => setUtilities(Number(e.target.value))}
                    placeholder="Enter utilities amount"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid hsl(40 20% 88%)',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      outline: 'none',
                      color: 'hsl(200 25% 15%)'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'hsl(174 62% 32%)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'hsl(40 20% 88%)'}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div 
            style={{
              background: 'linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%)',
              borderRadius: '1rem',
              padding: '2rem',
              color: 'white',
              boxShadow: '0 8px 20px -4px hsl(174 62% 32% / 0.3)'
            }}
          >
            <h2 className="text-xl font-semibold tracking-tight mb-6">
              Total Move-In Cost
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* Advance Payment */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <span style={{ opacity: 0.9 }}>Advance Payment</span>
                <span className="font-semibold text-lg">
                  GH₵{results.advancePayment.toLocaleString()}
                </span>
              </div>

              {/* Agent Fee */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <span style={{ opacity: 0.9 }}>Agent Fee ({agentFee}%)</span>
                <span className="font-semibold text-lg">
                  GH₵{results.agentFeeCost.toLocaleString()}
                </span>
              </div>

              {/* Utilities */}
              {includeUtilities && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <span style={{ opacity: 0.9 }}>Utilities Deposit</span>
                  <span className="font-semibold text-lg">
                    GH₵{results.utilitiesCost.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.15)', 
              borderRadius: '0.75rem', 
              padding: '1.5rem',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>
                TOTAL AMOUNT
              </div>
              <div className="text-3xl md:text-4xl font-bold">
                GH₵{results.total.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.8 }}>
                Monthly equivalent: GH₵{Math.round(results.total / (advanceYears * 12)).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div 
            style={{
              backgroundColor: 'hsl(38 92% 50% / 0.1)',
              border: '1px solid hsl(38 92% 50% / 0.2)',
              borderRadius: '0.75rem',
              padding: '1rem',
              display: 'flex',
              gap: '0.75rem'
            }}
          >
            <AlertCircle style={{ height: '1.25rem', width: '1.25rem', color: 'hsl(38 92% 50%)', flexShrink: 0, marginTop: '0.125rem' }} />
            <div>
              <h3 className="font-semibold mb-1" style={{ color: 'hsl(200 25% 15%)' }}>
                Important Note
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'hsl(200 15% 45%)' }}>
                In Ghana, landlords typically require 1-2 years of advance rent payment. Agent fees range from 8-15% of annual rent. Always verify terms before signing a rental agreement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CalculatorPage = () => {
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

        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          cursor: pointer;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          background: hsl(174 62% 32%);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        input[type="range"]::-moz-range-thumb {
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          background: hsl(174 62% 32%);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
        <Header />

        <main style={{ flex: 1, padding: '2rem 0' }}>
          <RentCalculator />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CalculatorPage;