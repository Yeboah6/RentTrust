import React, { useState } from 'react';
import { Link, usePage, useForm } from "@inertiajs/react";
import { Menu, X, Search, User, LogOut, LayoutDashboard } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const { auth } = usePage().props;
  const { post } = useForm();

  const isAgentLoggedIn = auth?.agent;
  const isTenantLoggedIn = auth?.user;
  const isAnyUserLoggedIn = isAgentLoggedIn || isTenantLoggedIn;

    const handleLogout = (e) => {
      e.preventDefault();
      post('/logout');
    };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        
        .mobile-menu {
          transition: max-height 0.3s ease-in-out;
        }
      `}</style>

      <header 
        className="sticky top-0 z-50 w-full backdrop-blur-sm"
        style={{ 
          backgroundColor: 'hsl(0 0% 100% / 0.95)',
          borderBottom: '1px solid hsl(40 20% 88%)'
        }}
      >
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div 
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: 'hsl(174 62% 32%)' }}
            >
              <span className="text-lg font-bold text-white">R</span>
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
              RentTrust
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
              <>
                <Link
                  href="/listings"
                  onMouseEnter={() => setActiveLink('listings')}
                  onMouseLeave={() => setActiveLink(null)}
                  className="px-4 py-2 text-sm font-medium transition-all rounded-lg"
                  style={{ 
                    color: activeLink === 'listings' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                    backgroundColor: activeLink === 'listings' ? 'hsl(40 30% 94%)' : 'transparent'
                  }}
                >
                  Find Rentals
                </Link>
                <Link
                  href="/areas"
                  onMouseEnter={() => setActiveLink('areas')}
                  onMouseLeave={() => setActiveLink(null)}
                  className="px-4 py-2 text-sm font-medium transition-all rounded-lg"
                  style={{ 
                    color: activeLink === 'areas' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                    backgroundColor: activeLink === 'areas' ? 'hsl(40 30% 94%)' : 'transparent'
                  }}
                >
                  Areas
                </Link>
                <Link
                  href="/agents"
                  onMouseEnter={() => setActiveLink('agents')}
                  onMouseLeave={() => setActiveLink(null)}
                  className="px-4 py-2 text-sm font-medium transition-all rounded-lg"
                  style={{ 
                    color: activeLink === 'agents' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                    backgroundColor: activeLink === 'agents' ? 'hsl(40 30% 94%)' : 'transparent'
                  }}
                >
                  Agents
                </Link>
                <Link
                  href="/calculator"
                  onMouseEnter={() => setActiveLink('calculator')}
                  onMouseLeave={() => setActiveLink(null)}
                  className="px-4 py-2 text-sm font-medium transition-all rounded-lg"
                  style={{ 
                    color: activeLink === 'calculator' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                    backgroundColor: activeLink === 'calculator' ? 'hsl(40 30% 94%)' : 'transparent'
                  }}
                >
                  Calculator
                </Link>
              </>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
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
                  <Search className="h-5 w-5" />
                </button>
                <Link
                  href="/sign-up"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors"
                  style={{ 
                    borderColor: 'hsl(40 20% 88%)',
                    color: 'hsl(200 25% 15%)',
                    backgroundColor: 'white'
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
                <Link
                  href="/become-agent"
                  className="px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all duration-200 active:scale-95"
                  style={{ backgroundColor: 'hsl(174 62% 32%)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 55% 28%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)'}
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
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors"
                  style={{ 
                    borderColor: 'hsl(40 20% 88%)',
                    color: 'hsl(200 25% 15%)',
                    backgroundColor: 'white'
                  }}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors"
                    style={{ 
                      borderColor: 'hsl(0 70% 50%)',
                      color: 'hsl(0 70% 50%)',
                      backgroundColor: 'white'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(0 70% 50% / 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
              </>
              
            )}
           

            {/* Tenant Logged In */}
            {isTenantLoggedIn && !isAgentLoggedIn && (
              <>
              <Link
                  href="/listings"
                  onMouseEnter={() => setActiveLink('listings')}
                  onMouseLeave={() => setActiveLink(null)}
                  className="px-4 py-2 text-sm font-medium transition-all rounded-lg"
                  style={{ 
                    color: activeLink === 'listings' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                    backgroundColor: activeLink === 'listings' ? 'hsl(40 30% 94%)' : 'transparent'
                  }}
                >
                  Find Rentals
                </Link>
                <Link
                  href="/areas"
                  onMouseEnter={() => setActiveLink('areas')}
                  onMouseLeave={() => setActiveLink(null)}
                  className="px-4 py-2 text-sm font-medium transition-all rounded-lg"
                  style={{ 
                    color: activeLink === 'areas' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                    backgroundColor: activeLink === 'areas' ? 'hsl(40 30% 94%)' : 'transparent'
                  }}
                >
                  Areas
                </Link>
                <Link
                  href="/agents"
                  onMouseEnter={() => setActiveLink('agents')}
                  onMouseLeave={() => setActiveLink(null)}
                  className="px-4 py-2 text-sm font-medium transition-all rounded-lg"
                  style={{ 
                    color: activeLink === 'agents' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                    backgroundColor: activeLink === 'agents' ? 'hsl(40 30% 94%)' : 'transparent'
                  }}
                >
                  Agents
                </Link>
                <Link
                  href="/calculator"
                  onMouseEnter={() => setActiveLink('calculator')}
                  onMouseLeave={() => setActiveLink(null)}
                  className="px-4 py-2 text-sm font-medium transition-all rounded-lg"
                  style={{ 
                    color: activeLink === 'calculator' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                    backgroundColor: activeLink === 'calculator' ? 'hsl(40 30% 94%)' : 'transparent'
                  }}
                >
                  Calculator
                </Link>
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors"
                    style={{ 
                      borderColor: 'hsl(0 70% 50%)',
                      color: 'hsl(0 70% 50%)',
                      backgroundColor: 'white'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(0 70% 50% / 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'hsl(200 15% 45%)' }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className="mobile-menu md:hidden overflow-hidden bg-white"
          style={{ 
            maxHeight: isMenuOpen ? '500px' : '0',
            borderTop: isMenuOpen ? '1px solid hsl(40 20% 88%)' : 'none'
          }}
        >
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {/* {!isAgentLoggedIn && ( */}
              <>
                <Link
                  href="/listings"
                  className="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                  style={{ color: 'hsl(200 25% 15%)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Find Rentals
                </Link>
                <Link
                  href="/areas"
                  className="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                  style={{ color: 'hsl(200 25% 15%)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Areas
                </Link>
                <Link
                  href="/agents"
                  className="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                  style={{ color: 'hsl(200 25% 15%)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Agents
                </Link>
                <Link
                  href="/calculator"
                  className="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                  style={{ color: 'hsl(200 25% 15%)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Calculator
                </Link>
              </>
            {/* )} */}
            
            <div className="pt-4 space-y-2 border-t mt-4" style={{ borderColor: 'hsl(40 20% 88%)' }}>
              {/* Not Logged In */}
              {!isAnyUserLoggedIn && (
                <>
                  <Link
                    href="/sign-up"
                    className="w-full inline-flex items-center justify-start px-4 py-3 text-sm font-medium rounded-lg border transition-colors"
                    style={{ 
                      borderColor: 'hsl(40 20% 88%)',
                      color: 'hsl(200 25% 15%)',
                      backgroundColor: 'white'
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                  <Link
                    href="/become-agent"
                    className="w-full px-4 py-3 text-sm font-semibold rounded-lg text-white transition-colors"
                    style={{ backgroundColor: 'hsl(174 62% 32%)' }}
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
                    className="w-full inline-flex items-center justify-start px-4 py-3 text-sm font-medium rounded-lg border transition-colors"
                    style={{ 
                      borderColor: 'hsl(40 20% 88%)',
                      color: 'hsl(200 25% 15%)',
                      backgroundColor: 'white'
                    }}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors"
                    style={{ 
                      borderColor: 'hsl(0 70% 50%)',
                      color: 'hsl(0 70% 50%)',
                      backgroundColor: 'white'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(0 70% 50% / 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              )}

              {/* Tenant Logged In */}
              {isTenantLoggedIn && !isAgentLoggedIn && (
                <>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors"
                    style={{ 
                      borderColor: 'hsl(0 70% 50%)',
                      color: 'hsl(0 70% 50%)',
                      backgroundColor: 'white'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(0 70% 50% / 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
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