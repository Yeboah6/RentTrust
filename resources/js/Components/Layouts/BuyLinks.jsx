import React from 'react';
import { Link } from "@inertiajs/react";

export function BuyDesktop({ isOnBuyPage, activeLink, setActiveLink }) {
  if (isOnBuyPage) {
    return (
    <>
        <Link
          href="/buy/listings"
          onMouseEnter={() => setActiveLink('sales')}
          onMouseLeave={() => setActiveLink(null)}
          className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
          style={{
            color: activeLink === 'sales' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
            backgroundColor: activeLink === 'sales' ? 'hsl(40 30% 94%)' : 'transparent',
            fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
          }}
        >
          Find Sales
        </Link>

        <Link
          href="/buy/areas"
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
    </>
  );
  }
}

export function BuyMobile({ isOnBuyPage, handleMobileLinkClick }) {
  if (isOnBuyPage) {
    return (
        <>
    <Link
      href="/buy/listings"
      onClick={handleMobileLinkClick}
      className="mobile-menu-link block px-4 py-3 font-medium rounded-lg transition-colors"
      style={{
        color: 'hsl(200 25% 15%)',
        fontSize: 'clamp(0.875rem, 3vw, 1rem)'
      }}
      onTouchStart={(e) => (e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)')}
      onTouchEnd={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      Buy Properties
    </Link>

    <Link
      href="/buy/areas"
      onClick={handleMobileLinkClick}
      className="mobile-menu-link block px-4 py-3 font-medium rounded-lg transition-colors"
      style={{
        color: 'hsl(200 25% 15%)',
        fontSize: 'clamp(0.875rem, 3vw, 1rem)'
      }}
      onTouchStart={(e) => (e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)')}
      onTouchEnd={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      Areas
    </Link>
    </>
  );
  }
}
