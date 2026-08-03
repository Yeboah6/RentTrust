import React, { useState, useMemo } from 'react';
import { Calculator, Info } from 'lucide-react';

const RentCalculator = () => {
  const [monthlyRent, setMonthlyRent] = useState(1500);
  const [advanceYears, setAdvanceYears] = useState(2);
  const [agentFeePercent, setAgentFeePercent] = useState(10);
  const [showTooltip, setShowTooltip] = useState(null);

  const calculations = useMemo(() => {
    const advanceMonths = advanceYears * 12;
    const rentTotal = monthlyRent * advanceMonths;
    const agentFee = (monthlyRent * agentFeePercent) / 100;
    const totalUpfront = rentTotal + agentFee;

    return {
      advanceMonths,
      rentTotal,
      agentFee,
      totalUpfront,
    };
  }, [monthlyRent, advanceYears, agentFeePercent]);

  const formatPrice = (price) => {
    return `GH₵${price.toLocaleString()}`;
  };

  return (
    <>
      <style>{`
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        
        .slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: hsl(40 20% 88%);
          outline: none;
        }
        
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: hsl(174 62% 32%);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 0 8px hsl(174 62% 32% / 0.1);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: hsl(174 62% 32%);
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 0 8px hsl(174 62% 32% / 0.1);
        }
        
        .warning-box {
          background-color: hsl(38 92% 50% / 0.1);
          border: 1px solid hsl(38 92% 50% / 0.2);
          border-radius: 0.75rem;
          padding: 1rem;
        }
        
        .tooltip {
          position: absolute;
          background: hsl(200 25% 10%);
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          max-width: 16rem;
          z-index: 50;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transform: translateY(-100%);
          margin-top: -0.5rem;
          left: 50%;
          transform: translateX(-50%) translateY(-100%);
        }
      `}</style>

      <section className="py-16" style={{ backgroundColor: 'hsl(40 30% 94%)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div 
                className="inline-flex items-center justify-center h-12 w-12 rounded-full mb-4"
                style={{ backgroundColor: 'hsl(174 62% 32% / 0.1)' }}
              >
                <Calculator className="h-6 w-6" style={{ color: 'hsl(174 62% 32%)' }} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                Rent Advance Calculator
              </h2>
              <p style={{ color: 'hsl(200 15% 45%)' }}>
                Calculate the total upfront cost before you rent
              </p>
            </div>

            <div className="border rounded-xl bg-white shadow-lg" style={{ borderColor: 'hsl(40 20% 88%)' }}>
              <div className="border-b px-6 py-4" style={{ borderColor: 'hsl(40 20% 88%)' }}>
                <h3 className="text-lg font-semibold tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                  Enter Your Details
                </h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Monthly Rent */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-base font-medium" style={{ color: 'hsl(200 25% 15%)' }}>
                      Monthly Rent
                    </label>
                    <span className="text-lg font-bold" style={{ color: 'hsl(174 62% 32%)' }}>
                      {formatPrice(monthlyRent)}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value) || 0)}
                    className="w-full h-12 text-lg px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{ 
                      borderColor: 'hsl(40 20% 88%)',
                      '--tw-ring-color': 'hsl(174 62% 32%)'
                    }}
                    placeholder="Enter monthly rent"
                  />
                </div>

                {/* Advance Duration */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label className="text-base font-medium" style={{ color: 'hsl(200 25% 15%)' }}>
                        Advance Duration
                      </label>
                      <div 
                        className="relative"
                        onMouseEnter={() => setShowTooltip('advance')}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <Info className="h-4 w-4 cursor-help" style={{ color: 'hsl(200 15% 45%)' }} />
                        {showTooltip === 'advance' && (
                          <div className="tooltip">
                            Most landlords in Ghana require 1-2 years advance rent payment
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-lg font-bold" style={{ color: 'hsl(200 25% 15%)' }}>
                      {advanceYears} {advanceYears === 1 ? 'year' : 'years'}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="slider"
                    value={advanceYears}
                    onChange={(e) => setAdvanceYears(Number(e.target.value))}
                    min="1"
                    max="5"
                    step="1"
                  />
                  <div className="flex justify-between text-xs" style={{ color: 'hsl(200 15% 45%)' }}>
                    <span>1 year</span>
                    <span>5 years</span>
                  </div>
                </div>

                {/* Agent Fee */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label className="text-base font-medium" style={{ color: 'hsl(200 25% 15%)' }}>
                        Agent Fee
                      </label>
                      <div 
                        className="relative"
                        onMouseEnter={() => setShowTooltip('agent')}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <Info className="h-4 w-4 cursor-help" style={{ color: 'hsl(200 15% 45%)' }} />
                        {showTooltip === 'agent' && (
                          <div className="tooltip">
                            Typical agent commission is 5-10% of one month's rent
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-lg font-bold" style={{ color: 'hsl(200 25% 15%)' }}>
                      {agentFeePercent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    className="slider"
                    value={agentFeePercent}
                    onChange={(e) => setAgentFeePercent(Number(e.target.value))}
                    min="0"
                    max="20"
                    step="5"
                  />
                  <div className="flex justify-between text-xs" style={{ color: 'hsl(200 15% 45%)' }}>
                    <span>0%</span>
                    <span>20%</span>
                  </div>
                </div>

                {/* Results */}
                <div className="pt-6 border-t space-y-3" style={{ borderColor: 'hsl(40 20% 88%)' }}>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'hsl(200 15% 45%)' }}>
                      Rent ({calculations.advanceMonths} months)
                    </span>
                    <span className="font-medium" style={{ color: 'hsl(200 25% 15%)' }}>
                      {formatPrice(calculations.rentTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'hsl(200 15% 45%)' }}>Agent Fee</span>
                    <span className="font-medium" style={{ color: 'hsl(200 25% 15%)' }}>
                      {formatPrice(calculations.agentFee)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: 'hsl(40 20% 88%)' }}>
                    <span className="text-lg font-semibold" style={{ color: 'hsl(200 25% 15%)' }}>
                      Total Upfront
                    </span>
                    <span className="text-2xl font-bold" style={{ color: 'hsl(174 62% 32%)' }}>
                      {formatPrice(calculations.totalUpfront)}
                    </span>
                  </div>
                </div>

                {/* Warning */}
                <div className="warning-box">
                  <p className="font-medium mb-1" style={{ color: 'hsl(200 25% 15%)' }}>
                    ⚠️ Before You Pay
                  </p>
                  <p className="text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
                    Always inspect the property in person and verify the agent's identity before 
                    making any payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RentCalculator;