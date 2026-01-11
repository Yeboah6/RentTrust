import React, { useState } from 'react';
import { Menu, X, Search, User } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  const handleSignIn = () => {
    console.log('Sign in clicked');
    alert('Opening sign in dialog...');
  };

  const handleListProperty = () => {
    console.log('List property clicked');
    alert('Opening list property form...');
  };

  const handleSearch = () => {
    console.log('Search clicked');
    alert('Opening search...');
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
          <a 
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
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <a
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
            </a>
            <a
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
            </a>
            <a
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
            </a>
            <a
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
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleSearch}
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
            <a
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
            </a>
            <button
              onClick={handleListProperty}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all duration-200 active:scale-95"
              style={{ backgroundColor: 'hsl(174 62% 32%)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 55% 28%)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'hsl(174 62% 32%)'}
            >
              List Property
            </button>
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
            maxHeight: isMenuOpen ? '384px' : '0',
            borderTop: isMenuOpen ? '1px solid hsl(40 20% 88%)' : 'none'
          }}
        >
          <nav className="container mx-auto px-4 py-4 space-y-1">
            <a
              href="/listings"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('Find Rentals', '/listings');
              }}
              className="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
              style={{ color: 'hsl(200 25% 15%)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Find Rentals
            </a>
            <a
              href="/areas"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('Areas', '/areas');
              }}
              className="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
              style={{ color: 'hsl(200 25% 15%)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Areas
            </a>
            <a
              href="/agents"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('Agents', '/agents');
              }}
              className="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
              style={{ color: 'hsl(200 25% 15%)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Agents
            </a>
            <a
              href="/calculator"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('Calculator', '/calculator');
              }}
              className="block px-4 py-3 text-sm font-medium rounded-lg transition-colors"
              style={{ color: 'hsl(200 25% 15%)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Calculator
            </a>
            <div className="pt-4 space-y-2 border-t mt-4" style={{ borderColor: 'hsl(40 20% 88%)' }}>
              <button
                onClick={handleSignIn}
                className="w-full inline-flex items-center justify-start px-4 py-3 text-sm font-medium rounded-lg border transition-colors"
                style={{ 
                  borderColor: 'hsl(40 20% 88%)',
                  color: 'hsl(200 25% 15%)',
                  backgroundColor: 'white'
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </button>
              <button
                onClick={handleListProperty}
                className="w-full px-4 py-3 text-sm font-semibold rounded-lg text-white transition-colors"
                style={{ backgroundColor: 'hsl(174 62% 32%)' }}
              >
                List Property
              </button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;