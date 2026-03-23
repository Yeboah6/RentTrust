import React from 'react';
import { Link } from "@inertiajs/react";

// desktop version of the rent-related links
export function RentDesktop({ activeLink, setActiveLink, isOnRentPage }) {
  if (isOnRentPage) {
    return (
    <>
      <Link
        href="/rent/listings"
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
        href="/rent/areas"
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

      {/* <Link
        href="/rent/calculator"
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
      </Link> */}
    </>
  );
  }
}

// mobile version of the rent links; the caller is expected to provide the
// click handler that will close the mobile menu
export function RentMobile({ isOnRentPage, handleMobileLinkClick }) {
  if (isOnRentPage) {
    return (
    <>
      <Link
        href="/rent/listings"
        onClick={handleMobileLinkClick}
        className="mobile-menu-link block px-4 py-3 font-medium rounded-lg transition-colors"
        style={{
          color: 'hsl(200 25% 15%)',
          fontSize: 'clamp(0.875rem, 3vw, 1rem)'
        }}
        onTouchStart={(e) => (e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)')}
        onTouchEnd={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        Find Rentals
      </Link>

      {/* <Link
        href="/rent/calculator"
        onClick={handleMobileLinkClick}
        className="mobile-menu-link block px-4 py-3 font-medium rounded-lg transition-colors"
        style={{
          color: 'hsl(200 25% 15%)',
          fontSize: 'clamp(0.875rem, 3vw, 1rem)'
        }}
        onTouchStart={(e) => (e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)')}
        onTouchEnd={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        Calculator
      </Link> */}
    </>
  );
  }
}
