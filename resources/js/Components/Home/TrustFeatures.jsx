import React, { useState } from 'react';
import { Shield, Eye, Users, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: "Real Price Transparency",
    description: "See actual prices paid by buyers and renters, not inflated asking prices.",
  },
  {
    icon: Shield,
    title: "Verified Agents",
    description: "Identify trustworthy agents through verified profiles and client reviews.",
  },
  {
    icon: MessageSquare,
    title: "Honest Reviews",
    description: "Read real experiences from buyers and renters who have transacted in the area.",
  },
  {
    icon: AlertTriangle,
    title: "Report Issues",
    description: "Flag problematic agents or misleading listings to protect other users.",
  },
  {
    icon: CheckCircle2,
    title: "Agent Accountability",
    description: "Agents respond to reviews, building their reputation in the community.",
  },
  {
    icon: Users,
    title: "Community Insights",
    description: "Learn about areas from people who live there – amenities, safety, and more.",
  },
];

const TrustFeatures = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        
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
        
        .feature-card {
          animation: fadeInUp 0.6s ease-out forwards;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .feature-card:hover {
          transform: translateY(-4px);
        }
      `}</style>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
              Why People Trust Us
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: 'hsl(200 15% 45%)' }}>
              We're building a platform that puts buyers and renters first, with transparency and 
              accountability at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="feature-card border rounded-xl bg-white shadow-md hover:shadow-xl"
                style={{ 
                  borderColor: 'hsl(40 20% 88%)',
                  animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={() => setHoveredCard(feature.title)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="p-6">
                  <div 
                    className="h-12 w-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300"
                    style={{ 
                      backgroundColor: 'hsl(174 62% 32% / 0.1)',
                      transform: hoveredCard === feature.title ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
                    }}
                  >
                    <feature.icon 
                      className="h-6 w-6" 
                      style={{ color: 'hsl(174 62% 32%)' }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TrustFeatures;