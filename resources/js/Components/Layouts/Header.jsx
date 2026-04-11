import React, { useState, useEffect } from 'react';
import { Link, usePage, useForm } from "@inertiajs/react";
import { Menu, X, Search, User, LogOut, LayoutDashboard } from 'lucide-react';
import { RentDesktop, RentMobile } from "./RentLinks";
import { BuyDesktop, BuyMobile } from "./BuyLinks";
import { AuthDesktop, AuthMobile } from "./AuthActions";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const { auth, url } = usePage().props;
  const currentUrl = usePage().url || url || '/';
  const { post } = useForm();

  // Determine if on rent or buy section
  const isOnRentPage = currentUrl.startsWith('/rent');
  const isOnBuyPage = currentUrl.startsWith('/buy');

  // Convert to proper booleans
  const isAgentLoggedIn = !!auth?.agent;
  const isTenantLoggedIn = !!auth?.tenant;
  const isAdminLoggedIn = !!auth?.admin; // legacy operational admins
  const isSuperAdminLoggedIn = !!auth?.super && !isAdminLoggedIn; // SaaS / platform superuser
  const isAnyUserLoggedIn = isAgentLoggedIn || isTenantLoggedIn || isAdminLoggedIn || isSuperAdminLoggedIn;

  // Store user data separately
  const agentData = auth?.agent;
  const tenantData = auth?.tenant;
  const adminData = auth?.admin;
  const superAdminData = auth?.super;

  const handleLogout = (e) => {
    e.preventDefault();
    post('/logout');
  };

  // Close menu when clicking a link (mobile)
  const handleMobileLinkClick = () => {
    setIsMenuOpen(false);
    document.body.classList.remove('menu-open');
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        
        .mobile-menu {
          transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
        }

        /* Mobile navigation improvements */
        @media (max-width: 768px) {
          .mobile-menu-link {
            -webkit-tap-highlight-color: transparent;
            min-height: 44px;
            display: flex;
            align-items: center;
          }

          .mobile-menu-button {
            min-height: 44px;
            min-width: 44px;
            -webkit-tap-highlight-color: transparent;
          }

          .header-container {
            padding-left: clamp(0.75rem, 3vw, 1rem);
            padding-right: clamp(0.75rem, 3vw, 1rem);
          }
        }

        /* Tablet view - show condensed navigation */
        @media (min-width: 769px) and (max-width: 1023px) {
          .desktop-nav-link {
            padding-left: clamp(0.5rem, 2vw, 1rem);
            padding-right: clamp(0.5rem, 2vw, 1rem);
            font-size: clamp(0.8125rem, 2vw, 0.875rem);
          }
        }

        /* Extra small devices */
        @media (max-width: 480px) {
          .logo-text {
            font-size: clamp(1rem, 5vw, 1.25rem);
          }

          .logo-icon {
            width: clamp(2rem, 8vw, 2.25rem);
            height: clamp(2rem, 8vw, 2.25rem);
          }
        }

        /* Landscape mobile */
        @media (max-height: 600px) and (orientation: landscape) {
          .mobile-menu {
            max-height: 400px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }
        }

        /* Prevent body scroll when mobile menu is open */
        body.menu-open {
          overflow: hidden;
        }
      `}</style>

      <header
        className="sticky top-0 z-50 w-full backdrop-blur-sm"
        style={{
          backgroundColor: 'hsl(0 0% 100% / 0.95)',
          borderBottom: '1px solid hsl(40 20% 88%)'
        }}
      >
        <div className="container mx-auto header-container flex items-center justify-between" style={{ 
          padding: 'clamp(0.75rem, 3vw, 1rem)',
          height: 'clamp(3.5rem, 15vw, 4rem)'
        }}>
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            style={{ touchAction: 'manipulation' }}
          >
            <div
              className="logo-icon flex items-center justify-center rounded-lg"
              style={{ 
                backgroundColor: 'hsl(174 62% 32%)',
                width: 'clamp(2rem, 8vw, 2.25rem)',
                height: 'clamp(2rem, 8vw, 2.25rem)'
              }}
            >
              <span style={{ 
                fontSize: 'clamp(1rem, 4vw, 1.125rem)',
                fontWeight: '700',
                color: 'white'
              }}>R</span>
            </div>
            <span className="logo-text font-bold tracking-tight" style={{ 
              color: 'hsl(200 25% 15%)',
              fontSize: 'clamp(1.125rem, 4vw, 1.25rem)'
            }}>
              RentTrust
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center" style={{ gap: 'clamp(0.125rem, 1vw, 0.25rem)' }}>
            <>
              <RentDesktop
                activeLink={activeLink}
                setActiveLink={setActiveLink}
                isOnRentPage={isOnRentPage}
              />

              <BuyDesktop
                activeLink={activeLink}
                setActiveLink={setActiveLink}
                isOnBuyPage={isOnBuyPage}
              />

              <Link
                href="/agents"
                onMouseEnter={() => setActiveLink('agents')}
                onMouseLeave={() => setActiveLink(null)}
                className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
                style={{
                  color: activeLink === 'agents' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                  backgroundColor: activeLink === 'agents' ? 'hsl(40 30% 94%)' : 'transparent',
                  fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
                }}
              >
                Agents
              </Link>

              <Link
                href="/reviews-reports"
                onMouseEnter={() => setActiveLink('reviews')}
                onMouseLeave={() => setActiveLink(null)}
                className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
                style={{
                  color: activeLink === 'reviews' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                  backgroundColor: activeLink === 'reviews' ? 'hsl(40 30% 94%)' : 'transparent',
                  fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
                }}
              >
                Reports & Reviews
              </Link>
              {/* <Link
                  href="/contact"
                  onMouseEnter={() => setActiveLink('contact')}
                  onMouseLeave={() => setActiveLink(null)}
                  className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
                  style={{
                    color: activeLink === 'contact' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                    backgroundColor: activeLink === 'contact' ? 'hsl(40 30% 94%)' : 'transparent',
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
                  }}
                >
                  Contact
              </Link> */}
                <Link
                  href="/pricing"
                  onMouseEnter={() => setActiveLink('pricing')}
                  onMouseLeave={() => setActiveLink(null)}
                  className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
                  style={{
                    color: activeLink === 'pricing' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                    backgroundColor: activeLink === 'pricing' ? 'hsl(40 30% 94%)' : 'transparent',
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
                  }}
                >
                  Pricing
                </Link>
                {/* <Link
                  href="/about"
                  onMouseEnter={() => setActiveLink('about')}
                  onMouseLeave={() => setActiveLink(null)}
                  className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
                  style={{
                    color: activeLink === 'about' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                    backgroundColor: activeLink === 'about' ? 'hsl(40 30% 94%)' : 'transparent',
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
                  }}
                >
                  About us
                </Link> */}
            </>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center" style={{ gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
            <AuthDesktop
              isAnyUserLoggedIn={isAnyUserLoggedIn}
              isAgentLoggedIn={isAgentLoggedIn}
              isTenantLoggedIn={isTenantLoggedIn}
              isAdminLoggedIn={isAdminLoggedIn}
              isSuperAdminLoggedIn={isSuperAdminLoggedIn}
              agentData={agentData}
              tenantData={tenantData}
              adminData={adminData}
              superAdminData={superAdminData}
              handleLogout={handleLogout}
              isOnBuyPage={isOnBuyPage}
              isOnRentPage={isOnRentPage}
              activeLink={activeLink}
              setActiveLink={setActiveLink}
            />
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="mobile-menu-button md:hidden p-2 rounded-lg transition-colors"
            style={{ 
              color: 'hsl(200 15% 45%)',
              touchAction: 'manipulation'
            }}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X style={{ 
                height: 'clamp(1.25rem, 5vw, 1.5rem)', 
                width: 'clamp(1.25rem, 5vw, 1.5rem)' 
              }} />
            ) : (
              <Menu style={{ 
                height: 'clamp(1.25rem, 5vw, 1.5rem)', 
                width: 'clamp(1.25rem, 5vw, 1.5rem)' 
              }} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className="mobile-menu md:hidden overflow-hidden bg-white"
          style={{
            maxHeight: isMenuOpen ? '500px' : '0',
            opacity: isMenuOpen ? 1 : 0,
            borderTop: isMenuOpen ? '1px solid hsl(40 20% 88%)' : 'none'
          }}
        >
            <nav className="container mx-auto" style={{ 
              padding: 'clamp(0.75rem, 3vw, 1rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
                {/* Show "Find Rentals" only when not on rent page */}
                <RentMobile isOnRentPage={isOnRentPage} handleMobileLinkClick={handleMobileLinkClick} />
                
                <BuyMobile isOnBuyPage={isOnBuyPage} handleMobileLinkClick={handleMobileLinkClick} />
                
                <Link
                  href="/agents"
                  onClick={handleMobileLinkClick}
                  className="mobile-menu-link block px-4 py-3 font-medium rounded-lg transition-colors"
                  style={{ 
                    color: 'hsl(200 25% 15%)',
                    fontSize: 'clamp(0.875rem, 3vw, 1rem)'
                  }}
                  onTouchStart={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onTouchEnd={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Agents
                </Link>

                <Link
                  href="/reviews-reports"
                  onClick={handleMobileLinkClick}
                  className="mobile-menu-link block px-4 py-3 font-medium rounded-lg transition-colors"
                  style={{ 
                    color: 'hsl(200 25% 15%)',
                    fontSize: 'clamp(0.875rem, 3vw, 1rem)'
                  }}
                  onTouchStart={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onTouchEnd={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Reports & Reviews
                </Link>
                <Link
                  href="/contact"
                  onClick={handleMobileLinkClick}
                  className="mobile-menu-link block px-4 py-3 font-medium rounded-lg transition-colors"
                  style={{ 
                    color: 'hsl(200 25% 15%)',
                    fontSize: 'clamp(0.875rem, 3vw, 1rem)'
                  }}
                  onTouchStart={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onTouchEnd={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Contact
                </Link>
                <Link
                  href="/pricing"
                  onClick={handleMobileLinkClick}
                  className="mobile-menu-link block px-4 py-3 font-medium rounded-lg transition-colors"
                  style={{ 
                    color: 'hsl(200 25% 15%)',
                    fontSize: 'clamp(0.875rem, 3vw, 1rem)'
                  }}
                  onTouchStart={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onTouchEnd={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Pricing
                </Link>

                <Link
                  href="/about"
                  onClick={handleMobileLinkClick}
                  className="mobile-menu-link block px-4 py-3 font-medium rounded-lg transition-colors"
                  style={{ 
                    color: 'hsl(200 25% 15%)',
                    fontSize: 'clamp(0.875rem, 3vw, 1rem)'
                  }}
                  onTouchStart={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onTouchEnd={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  About us
                </Link>

            <div style={{ 
              paddingTop: 'clamp(0.75rem, 2vw, 1rem)', 
              marginTop: 'clamp(0.75rem, 2vw, 1rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(0.5rem, 2vw, 0.75rem)',
              borderTop: '1px solid hsl(40 20% 88%)'
            }}>
              <AuthMobile
                isAnyUserLoggedIn={isAnyUserLoggedIn}
                isAgentLoggedIn={isAgentLoggedIn}
                isTenantLoggedIn={isTenantLoggedIn}
                isAdminLoggedIn={isAdminLoggedIn}
                isSuperAdminLoggedIn={isSuperAdminLoggedIn}
                agentData={agentData}
                tenantData={tenantData}
                adminData={adminData}
                superAdminData={superAdminData}
                handleLogout={handleLogout}
                handleMobileLinkClick={handleMobileLinkClick}
                isOnBuyPage={isOnBuyPage}
              />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;