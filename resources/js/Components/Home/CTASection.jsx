import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Building2, Users } from 'lucide-react';

const CTASection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  // const handleTenantClick = () => {
  //   console.log('Submit a Review clicked');
  //   alert('Redirecting to review submission form...');
  // };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        
        .card-interactive {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-interactive:hover {
          transform: translateY(-4px);
        }
        
        .gradient-accent {
          background: linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(30 90% 45%) 100%);
        }
      `}</style>

      <section className="py-16" style={{ backgroundColor: 'hsl(40 30% 94%)' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* For Tenants */}
            <div
              className="card-interactive border rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl"
              style={{ borderColor: 'hsl(40 20% 88%)' }}
              onMouseEnter={() => setHoveredCard('tenant')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="p-6 md:p-8">
                <div 
                  className="h-12 w-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300"
                  style={{ 
                    backgroundColor: 'hsl(174 62% 32% / 0.1)',
                    transform: hoveredCard === 'tenant' ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  <Users className="h-6 w-6" style={{ color: 'hsl(174 62% 32%)' }} />
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                  For Tenants
                </h3>
                <p className="mb-6" style={{ color: 'hsl(200 15% 45%)' }}>
                  Share your rent experience and help other Ghanaians avoid bad deals. 
                  Your review could save someone from a scam.
                </p>
                <Link
                  href="/reviews-reports"
                  className="inline-flex items-center px-6 py-3 text-white font-semibold rounded-lg transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
                  style={{ backgroundColor: 'hsl(174 62% 32%)' }}
                >
                  Reviews
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>

            {/* For Agents/Landlords */}
            <div
              className="card-interactive border rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl"
              style={{ borderColor: 'hsl(40 20% 88%)' }}
              onMouseEnter={() => setHoveredCard('agent')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="p-6 md:p-8">
                <div 
                  className="h-12 w-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300"
                  style={{ 
                    backgroundColor: 'hsl(38 92% 50% / 0.1)',
                    transform: hoveredCard === 'agent' ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  <Building2 className="h-6 w-6" style={{ color: 'hsl(38 92% 50%)' }} />
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                  For Agents & Landlords
                </h3>
                <p className="mb-6" style={{ color: 'hsl(200 15% 45%)' }}>
                  Claim your listings, build your reputation with verified reviews, 
                  and connect with serious tenants.
                </p>
                <Link
                  href='/become-agent'
                  className="gradient-accent inline-flex items-center px-6 py-3 font-semibold rounded-lg transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
                  style={{ color: 'hsl(200 25% 10%)' }}
                >
                  Become an Agent
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTASection;