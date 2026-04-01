import React, { useState } from 'react';
import { Link } from "@inertiajs/react";

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null);

  const footerLinks = {
    explore: [
      { label: 'Verified Agents', path: '/agents' },
      { label: 'About us', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Pricing', path: '/pricing' }
    ],
    resources: [
      { label: 'Renting Guide', path: '/guide' },
      { label: 'Safety Tips', path: '/safety' },
      { label: 'FAQs', path: '/faq' }
    ],
    legal: [
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Report Issue', path: '/report' }
    ]
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
      `}</style>

      <footer className="border-t bg-white" style={{ borderColor: 'hsl(40 20% 88%)' }}>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link
                href="/"
                className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
              >
                <div 
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: '#1f847a' }}
                >
                  <span className="text-base font-bold text-white">R</span>
                </div>
                <span className="text-lg font-bold tracking-tight" style={{ color: '#1d2930' }}>
                  RentTrust
                </span>
              </Link>
              <p className="text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
                Empowering tenants with transparent rent information across Ghana.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                Explore
              </h4>
              <ul className="space-y-2">
                {footerLinks.explore.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      onClick={() => handleLinkClick(link.path)}
                      onMouseEnter={() => setHoveredLink(link.path)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="text-sm transition-colors text-left"
                      style={{ 
                        color: hoveredLink === link.path ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)'
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                Resources
              </h4>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => handleLinkClick(link.path)}
                      onMouseEnter={() => setHoveredLink(link.path)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="text-sm transition-colors text-left"
                      style={{ 
                        color: hoveredLink === link.path ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)'
                      }}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                Legal
              </h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => handleLinkClick(link.path)}
                      onMouseEnter={() => setHoveredLink(link.path)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="text-sm transition-colors text-left"
                      style={{ 
                        color: hoveredLink === link.path ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)'
                      }}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div 
            className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
            style={{ borderColor: 'hsl(40 20% 88%)' }}
          >
            <p className="text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
              © {new Date().getFullYear()} RentTrust Ghana. All rights reserved.
            </p>
            <p className="text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
               Made with ❤️✌️ by Alpha Dev
            </p>
            <p 
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{ 
                backgroundColor: 'hsl(38 92% 50% / 0.1)',
                color: 'hsl(200 25% 10%)'
              }}
            >
              ⚠️ Always inspect a property before paying any money.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;