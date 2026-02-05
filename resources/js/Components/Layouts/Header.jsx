import React, { useState } from 'react';
import { Link, usePage, useForm } from "@inertiajs/react";
import { Menu, X, Search, User, LogOut, LayoutDashboard } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const { auth } = usePage().props;
  const { post } = useForm();

  // Convert to proper booleans
  const isAgentLoggedIn = !!auth?.agent;
  const isTenantLoggedIn = !!auth?.tenant;
  const isSuperAdminLoggedIn = !!auth?.super;
  const isAnyUserLoggedIn = isAgentLoggedIn || isTenantLoggedIn || isSuperAdminLoggedIn;

  // Store user data separately
  const agentData = auth?.agent;
  const tenantData = auth?.tenant;
  const superAdminData = auth?.super;

  console.log('Auth state:', {
    isAgentLoggedIn,
    isTenantLoggedIn,
    isSuperAdminLoggedIn,
    isAnyUserLoggedIn,
    tenantData
  });

  const handleLogout = (e) => {
    e.preventDefault();
    post('/logout');
  };

  // Close menu when clicking a link (mobile)
  const handleMobileLinkClick = () => {
    setIsMenuOpen(false);
  };

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
              <Link
                href="/listings"
                onMouseEnter={() => setActiveLink('listings')}
                onMouseLeave={() => setActiveLink(null)}
                className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
                style={{
                  color: activeLink === 'listings' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                  backgroundColor: activeLink === 'listings' ? 'hsl(40 30% 94%)' : 'transparent',
                  fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
                }}
              >
                Find Rentals
              </Link>
              <Link
                href="/areas"
                onMouseEnter={() => setActiveLink('areas')}
                onMouseLeave={() => setActiveLink(null)}
                className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
                style={{
                  color: activeLink === 'areas' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                  backgroundColor: activeLink === 'areas' ? 'hsl(40 30% 94%)' : 'transparent',
                  fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
                }}
              >
                Areas
              </Link>
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
                href="/calculator"
                onMouseEnter={() => setActiveLink('calculator')}
                onMouseLeave={() => setActiveLink(null)}
                className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
                style={{
                  color: activeLink === 'calculator' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                  backgroundColor: activeLink === 'calculator' ? 'hsl(40 30% 94%)' : 'transparent',
                  fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
                }}
              >
                Calculator
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
            </>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center" style={{ gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
            {!isAnyUserLoggedIn && (
              <>
                <button
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    color: 'hsl(200 15% 45%)',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  aria-label="Search"
                >
                  <Search style={{ 
                    height: 'clamp(1.125rem, 3vw, 1.25rem)', 
                    width: 'clamp(1.125rem, 3vw, 1.25rem)' 
                  }} />
                </button>
                <Link
                  href="/sign-up"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  className="inline-flex items-center rounded-lg border transition-colors"
                  style={{
                    borderColor: 'hsl(40 20% 88%)',
                    color: 'hsl(200 25% 15%)',
                    backgroundColor: 'white',
                    padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.75rem, 3vw, 1rem)',
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                    fontWeight: '500'
                  }}
                >
                  <User style={{ 
                    height: 'clamp(0.875rem, 2.5vw, 1rem)', 
                    width: 'clamp(0.875rem, 2.5vw, 1rem)',
                    marginRight: '0.5rem'
                  }} />
                  Sign In
                </Link>
              </>
            )}

            {/* Agent Logged In */}
            {isAgentLoggedIn && (
              <>
                <Link
                  href="/agent-dashboard"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  className="inline-flex items-center rounded-lg border transition-colors"
                  style={{
                    borderColor: 'hsl(40 20% 88%)',
                    color: 'hsl(200 25% 15%)',
                    backgroundColor: 'white',
                    padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.75rem, 3vw, 1rem)',
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                    fontWeight: '500'
                  }}
                >
                  <LayoutDashboard style={{ 
                    height: 'clamp(0.875rem, 2.5vw, 1rem)', 
                    width: 'clamp(0.875rem, 2.5vw, 1rem)',
                    marginRight: '0.5rem'
                  }} />
                  Dashboard
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg border transition-colors"
                  style={{
                    borderColor: 'hsl(0 70% 50%)',
                    color: 'hsl(0 70% 50%)',
                    backgroundColor: 'white',
                    padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.75rem, 3vw, 1rem)',
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(0 70% 50% / 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  onClick={handleLogout}
                >
                  <LogOut style={{ 
                    height: 'clamp(0.875rem, 2.5vw, 1rem)', 
                    width: 'clamp(0.875rem, 2.5vw, 1rem)',
                    marginRight: '0.5rem'
                  }} />
                  Logout
                </button>
              </>
            )}

            {/* Super Admin Logged In */}
            {isSuperAdminLoggedIn && (
              <>
                <Link
                  href="/super-admin"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  className="inline-flex items-center rounded-lg border transition-colors"
                  style={{
                    borderColor: 'hsl(40 20% 88%)',
                    color: 'hsl(200 25% 15%)',
                    backgroundColor: 'white',
                    padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.75rem, 3vw, 1rem)',
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                    fontWeight: '500'
                  }}
                >
                  <LayoutDashboard style={{ 
                    height: 'clamp(0.875rem, 2.5vw, 1rem)', 
                    width: 'clamp(0.875rem, 2.5vw, 1rem)',
                    marginRight: '0.5rem'
                  }} />
                  Dashboard
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg border transition-colors"
                  style={{
                    borderColor: 'hsl(0 70% 50%)',
                    color: 'hsl(0 70% 50%)',
                    backgroundColor: 'white',
                    padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.75rem, 3vw, 1rem)',
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(0 70% 50% / 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  onClick={handleLogout}
                >
                  <LogOut style={{ 
                    height: 'clamp(0.875rem, 2.5vw, 1rem)', 
                    width: 'clamp(0.875rem, 2.5vw, 1rem)',
                    marginRight: '0.5rem'
                  }} />
                  Logout
                </button>
              </>
            )}

            {/* Tenant Logged In */}
            {isTenantLoggedIn && !isAgentLoggedIn && !isSuperAdminLoggedIn && (
              <>
                <p style={{
                  fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                  fontWeight: '500',
                  color: 'hsl(200 25% 15%)'
                }}>
                  {tenantData?.fullName || 'Tenant'}
                </p>
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg border transition-colors"
                  style={{
                    borderColor: 'hsl(0 70% 50%)',
                    color: 'hsl(0 70% 50%)',
                    backgroundColor: 'white',
                    padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.75rem, 3vw, 1rem)',
                    fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(0 70% 50% / 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  onClick={handleLogout}
                >
                  <LogOut style={{ 
                    height: 'clamp(0.875rem, 2.5vw, 1rem)', 
                    width: 'clamp(0.875rem, 2.5vw, 1rem)',
                    marginRight: '0.5rem'
                  }} />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              // Toggle body scroll
              if (!isMenuOpen) {
                document.body.classList.add('menu-open');
              } else {
                document.body.classList.remove('menu-open');
              }
            }}
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
            {/* {!isAnyUserLoggedIn && ( */}
              {/* <> */}
                <Link
                  href="/listings"
                  onClick={handleMobileLinkClick}
                  className="mobile-menu-link block px-4 py-3 font-medium rounded-lg transition-colors"
                  style={{ 
                    color: 'hsl(200 25% 15%)',
                    fontSize: 'clamp(0.875rem, 3vw, 1rem)'
                  }}
                  onTouchStart={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onTouchEnd={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Find Rentals
                </Link>
                <Link
                  href="/areas"
                  onClick={handleMobileLinkClick}
                  className="mobile-menu-link block px-4 py-3 font-medium rounded-lg transition-colors"
                  style={{ 
                    color: 'hsl(200 25% 15%)',
                    fontSize: 'clamp(0.875rem, 3vw, 1rem)'
                  }}
                  onTouchStart={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onTouchEnd={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Areas
                </Link>
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
                  href="/calculator"
                  onClick={handleMobileLinkClick}
                  className="mobile-menu-link block px-4 py-3 font-medium rounded-lg transition-colors"
                  style={{ 
                    color: 'hsl(200 25% 15%)',
                    fontSize: 'clamp(0.875rem, 3vw, 1rem)'
                  }}
                  onTouchStart={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onTouchEnd={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Calculator
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
              {/* </> */}
            {/* // )} */}

            <div style={{ 
              paddingTop: 'clamp(0.75rem, 2vw, 1rem)', 
              marginTop: 'clamp(0.75rem, 2vw, 1rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(0.5rem, 2vw, 0.75rem)',
              borderTop: '1px solid hsl(40 20% 88%)'
            }}>
              {/* Not Logged In */}
              {!isAnyUserLoggedIn && (
                <>
                  <Link
                    href="/sign-up"
                    onClick={handleMobileLinkClick}
                    className="w-full inline-flex items-center justify-start rounded-lg border transition-colors"
                    style={{
                      borderColor: 'hsl(40 20% 88%)',
                      color: 'hsl(200 25% 15%)',
                      backgroundColor: 'white',
                      padding: 'clamp(0.75rem, 3vw, 1rem)',
                      fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                      fontWeight: '500',
                      minHeight: '44px',
                      touchAction: 'manipulation'
                    }}
                  >
                    <User style={{ 
                      height: 'clamp(1rem, 3vw, 1.125rem)', 
                      width: 'clamp(1rem, 3vw, 1.125rem)',
                      marginRight: '0.5rem'
                    }} />
                    Sign In
                  </Link>
                  <Link
                    href="/become-agent"
                    onClick={handleMobileLinkClick}
                    className="w-full rounded-lg text-white transition-colors"
                    style={{ 
                      backgroundColor: 'hsl(174 62% 32%)',
                      padding: 'clamp(0.75rem, 3vw, 1rem)',
                      fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                      fontWeight: '600',
                      minHeight: '44px',
                      touchAction: 'manipulation',
                      textAlign: 'center'
                    }}
                  >
                    List Property
                  </Link>
                </>
              )}

              {/* Agent Logged In */}
              {isAgentLoggedIn && (
                <>
                  <Link
                    href="/agent-dashboard"
                    onClick={handleMobileLinkClick}
                    className="w-full inline-flex items-center justify-start rounded-lg border transition-colors"
                    style={{
                      borderColor: 'hsl(40 20% 88%)',
                      color: 'hsl(200 25% 15%)',
                      backgroundColor: 'white',
                      padding: 'clamp(0.75rem, 3vw, 1rem)',
                      fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                      fontWeight: '500',
                      minHeight: '44px',
                      touchAction: 'manipulation'
                    }}
                  >
                    <LayoutDashboard style={{ 
                      height: 'clamp(1rem, 3vw, 1.125rem)', 
                      width: 'clamp(1rem, 3vw, 1.125rem)',
                      marginRight: '0.5rem'
                    }} />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-start rounded-lg border transition-colors"
                    style={{
                      borderColor: 'hsl(0 70% 50%)',
                      color: 'hsl(0 70% 50%)',
                      backgroundColor: 'white',
                      padding: 'clamp(0.75rem, 3vw, 1rem)',
                      fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                      fontWeight: '500',
                      minHeight: '44px',
                      touchAction: 'manipulation'
                    }}
                    onClick={(e) => {
                      handleLogout(e);
                      handleMobileLinkClick();
                    }}
                  >
                    <LogOut style={{ 
                      height: 'clamp(1rem, 3vw, 1.125rem)', 
                      width: 'clamp(1rem, 3vw, 1.125rem)',
                      marginRight: '0.5rem'
                    }} />
                    Logout
                  </button>
                </>
              )}

              {/* Super Admin Logged In */}
              {isSuperAdminLoggedIn && (
                <>
                  <Link
                    href="/super-admin"
                    onClick={handleMobileLinkClick}
                    className="w-full inline-flex items-center justify-start rounded-lg border transition-colors"
                    style={{
                      borderColor: 'hsl(40 20% 88%)',
                      color: 'hsl(200 25% 15%)',
                      backgroundColor: 'white',
                      padding: 'clamp(0.75rem, 3vw, 1rem)',
                      fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                      fontWeight: '500',
                      minHeight: '44px',
                      touchAction: 'manipulation'
                    }}
                  >
                    <LayoutDashboard style={{ 
                      height: 'clamp(1rem, 3vw, 1.125rem)', 
                      width: 'clamp(1rem, 3vw, 1.125rem)',
                      marginRight: '0.5rem'
                    }} />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-start rounded-lg border transition-colors"
                    style={{
                      borderColor: 'hsl(0 70% 50%)',
                      color: 'hsl(0 70% 50%)',
                      backgroundColor: 'white',
                      padding: 'clamp(0.75rem, 3vw, 1rem)',
                      fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                      fontWeight: '500',
                      minHeight: '44px',
                      touchAction: 'manipulation'
                    }}
                    onClick={(e) => {
                      handleLogout(e);
                      handleMobileLinkClick();
                    }}
                  >
                    <LogOut style={{ 
                      height: 'clamp(1rem, 3vw, 1.125rem)', 
                      width: 'clamp(1rem, 3vw, 1.125rem)',
                      marginRight: '0.5rem'
                    }} />
                    Logout
                  </button>
                </>
              )}

              {/* Tenant Logged In */}
              {isTenantLoggedIn && !isAgentLoggedIn && !isSuperAdminLoggedIn && (
                <>
                  <div style={{ 
                    padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem)',
                    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                    fontWeight: '500',
                    color: 'hsl(200 25% 15%)'
                  }}>
                    {tenantData?.fullName || 'Tenant'}
                  </div>
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-start rounded-lg border transition-colors"
                    style={{
                      borderColor: 'hsl(0 70% 50%)',
                      color: 'hsl(0 70% 50%)',
                      backgroundColor: 'white',
                      padding: 'clamp(0.75rem, 3vw, 1rem)',
                      fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                      fontWeight: '500',
                      minHeight: '44px',
                      touchAction: 'manipulation'
                    }}
                    onClick={(e) => {
                      handleLogout(e);
                      handleMobileLinkClick();
                    }}
                  >
                    <LogOut style={{ 
                      height: 'clamp(1rem, 3vw, 1.125rem)', 
                      width: 'clamp(1rem, 3vw, 1.125rem)',
                      marginRight: '0.5rem'
                    }} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;