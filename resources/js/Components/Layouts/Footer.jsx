import React, { useState } from 'react';
import { Link, useForm } from "@inertiajs/react";

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    email: ''
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    post('/newsletter/subscribe', {
      preserveScroll: true,
      onSuccess: () => {
        setSubscribed(true);
        reset('email');
      }
    });
  };

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
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
      `}</style>

      <footer className="border-t bg-white" style={{ borderColor: 'hsl(40 20% 88%)' }}>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link
                href="/"
                className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
              >
                <div 
                  className="flex h-13 w-13 items-center justify-center rounded-lg"
                >
                  <span className="text-base font-bold text-white"><img src='/images/rent-trust.png' alt="Logo" /></span>
                </div>
                <span className="text-lg font-bold tracking-tight" style={{ color: '#1d2930' }}>
                  RentTrustGh
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
                      onMouseEnter={() => setHoveredLink(link.path)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="text-sm transition-colors text-left block"
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
                    <Link
                      href={link.path}
                      onMouseEnter={() => setHoveredLink(link.path)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="text-sm transition-colors text-left block"
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

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                Legal
              </h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      onMouseEnter={() => setHoveredLink(link.path)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="text-sm transition-colors text-left block"
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

            {/* Newsletter / Subscribe */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-semibold mb-4 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                Stay Updated
              </h4>
              <p className="text-sm mb-3" style={{ color: 'hsl(200 15% 45%)' }}>
                Get new listings delivered to your inbox.
              </p>

              {subscribed ? (
                <p
                  className="text-sm rounded-lg px-3 py-2"
                  style={{
                    backgroundColor: 'hsl(174 62% 32% / 0.1)',
                    color: 'hsl(174 62% 25%)'
                  }}
                >
                  🎉 You're subscribed! Watch your inbox for new listings.
                </p>
              ) : (
                <form onSubmit={handleSubscribe} noValidate>
                  <div className="flex flex-col gap-2">
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="text-sm rounded-lg px-3 py-2 border outline-none"
                      style={{
                        borderColor: errors.email ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)',
                        color: 'hsl(200 25% 15%)'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={processing}
                      className="text-sm font-semibold rounded-lg px-3 py-2 transition-opacity"
                      style={{
                        backgroundColor: 'hsl(38 92% 50%)',
                        color: 'hsl(200 25% 10%)',
                        opacity: processing ? 0.6 : 1,
                        cursor: processing ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {processing ? 'Subscribing…' : 'Subscribe'}
                    </button>
                  </div>
                  {errors.email && (
                    <p className="text-xs mt-1" style={{ color: 'hsl(0 72% 51%)' }}>
                      {errors.email}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>

          <div 
            className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
            style={{ borderColor: 'hsl(40 20% 88%)' }}
          >
            <p className="text-sm" style={{ color: 'hsl(200 15% 45%)' }}>
              © {new Date().getFullYear()} RentTrustGh. All rights reserved. 
            </p>
            <p className="text-sm" style={{ color: 'hsl(200 15% 45%)', textAlign: 'center' }}>
              KEKStudios || Everyday with God is Everyday in Victory.
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