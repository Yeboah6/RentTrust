import React from 'react';
import { Link } from "@inertiajs/react";
import { User, LayoutDashboard, LogOut } from 'lucide-react';

// renders buttons for authenticated / unauthenticated users in desktop nav
export function AuthDesktop({
  isAnyUserLoggedIn,
  isAgentLoggedIn,
  isTenantLoggedIn,
  isAdminLoggedIn,
  isSuperAdminLoggedIn,
  agentData,
  tenantData,
  adminData,
  superAdminData,
  handleLogout,
  isOnBuyPage,
  isOnRentPage,
  activeLink,
  setActiveLink
}) {
  if (!isAnyUserLoggedIn) {
    return (
      <>
        {isOnBuyPage && (
          <Link
            href="/rent/listings"
            onMouseEnter={() => setActiveLink('rent')}
            onMouseLeave={() => setActiveLink(null)}
            className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
            style={{
              color: activeLink === 'rent' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
              backgroundColor: activeLink === 'rent' ? 'hsl(40 30% 94%)' : 'transparent',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
            }}
          >
            Find Rentals
          </Link>
        )}

        {isOnRentPage && (
          <Link
            href="/buy/listings"
            onMouseEnter={() => setActiveLink('buy')}
            onMouseLeave={() => setActiveLink(null)}
            className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
            style={{
              color: activeLink === 'buy' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
              backgroundColor: activeLink === 'buy' ? 'hsl(40 30% 94%)' : 'transparent',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
            }}
          >
            Buy Properties
          </Link>
        )}

        {!isOnRentPage && !isOnBuyPage && (
          <>
            <Link
              href="/rent/listings"
              onMouseEnter={() => setActiveLink('rent')}
              onMouseLeave={() => setActiveLink(null)}
              className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
              style={{
                color: activeLink === 'rent' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                backgroundColor: activeLink === 'rent' ? 'hsl(40 30% 94%)' : 'transparent',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
              }}
            >
              Find Rentals
            </Link>

            <Link
              href="/buy/listings"
              onMouseEnter={() => setActiveLink('buy')}
              onMouseLeave={() => setActiveLink(null)}
              className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
              style={{
                color: activeLink === 'buy' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                backgroundColor: activeLink === 'buy' ? 'hsl(40 30% 94%)' : 'transparent',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
              }}
            >
              Buy Properties
            </Link>
          </>
        )}

        <Link
          href="/sign-up"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
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
          <User
            style={{
              height: 'clamp(0.875rem, 2.5vw, 1rem)',
              width: 'clamp(0.875rem, 2.5vw, 1rem)',
              marginRight: '0.5rem'
            }}
          />
          Sign In
        </Link>
      </>
    );
  }

  // agent / super / tenant logged in
  if (isAgentLoggedIn) {
    return (
      <>
        {isOnBuyPage && (
          <Link
            href="/rent/listings"
            onMouseEnter={() => setActiveLink('rent')}
            onMouseLeave={() => setActiveLink(null)}
            className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
            style={{
              color: activeLink === 'rent' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
              backgroundColor: activeLink === 'rent' ? 'hsl(40 30% 94%)' : 'transparent',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
            }}
          >
            Find Rentals
          </Link>
        )}

        {isOnRentPage && (
          <Link
            href="/buy/listings"
            onMouseEnter={() => setActiveLink('buy')}
            onMouseLeave={() => setActiveLink(null)}
            className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
            style={{
              color: activeLink === 'buy' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
              backgroundColor: activeLink === 'buy' ? 'hsl(40 30% 94%)' : 'transparent',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
            }}
          >
            Buy Properties
          </Link>
        )}

        {!isOnRentPage && !isOnBuyPage && (
          <>
            <Link
              href="/rent/listings"
              onMouseEnter={() => setActiveLink('rent')}
              onMouseLeave={() => setActiveLink(null)}
              className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
              style={{
                color: activeLink === 'rent' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                backgroundColor: activeLink === 'rent' ? 'hsl(40 30% 94%)' : 'transparent',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
              }}
            >
              Find Rentals
            </Link>

            <Link
              href="/buy/listings"
              onMouseEnter={() => setActiveLink('buy')}
              onMouseLeave={() => setActiveLink(null)}
              className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
              style={{
                color: activeLink === 'buy' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                backgroundColor: activeLink === 'buy' ? 'hsl(40 30% 94%)' : 'transparent',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
              }}
            >
              Buy Properties
            </Link>
          </>
        )}

        <Link
          href={
            agentData?.package === 'free' || agentData?.package === null
              ? '/agent/dashboard'
              : '/agent-dashboard'
          }
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
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
          <LayoutDashboard
            style={{
              height: 'clamp(0.875rem, 2.5vw, 1rem)',
              width: 'clamp(0.875rem, 2.5vw, 1rem)',
              marginRight: '0.5rem'
            }}
          />
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
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'hsl(0 70% 50% / 0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          onClick={handleLogout}
        >
          <LogOut
            style={{
              height: 'clamp(0.875rem, 2.5vw, 1rem)',
              width: 'clamp(0.875rem, 2.5vw, 1rem)',
              marginRight: '0.5rem'
            }}
          />
          Logout
        </button>
      </>
    );
  }

  if (isSuperAdminLoggedIn || isAdminLoggedIn) {
    return (
      <>
      {isOnBuyPage && (
          <Link
            href="/rent/listings"
            onMouseEnter={() => setActiveLink('rent')}
            onMouseLeave={() => setActiveLink(null)}
            className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
            style={{
              color: activeLink === 'rent' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
              backgroundColor: activeLink === 'rent' ? 'hsl(40 30% 94%)' : 'transparent',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
            }}
          >
            Find Rentals
          </Link>
        )}

        {isOnRentPage && (
          <Link
            href="/buy/listings"
            onMouseEnter={() => setActiveLink('buy')}
            onMouseLeave={() => setActiveLink(null)}
            className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
            style={{
              color: activeLink === 'buy' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
              backgroundColor: activeLink === 'buy' ? 'hsl(40 30% 94%)' : 'transparent',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
            }}
          >
            Buy Properties
          </Link>
        )}

        {!isOnRentPage && !isOnBuyPage && (
          <>
            <Link
              href="/rent/listings"
              onMouseEnter={() => setActiveLink('rent')}
              onMouseLeave={() => setActiveLink(null)}
              className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
              style={{
                color: activeLink === 'rent' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                backgroundColor: activeLink === 'rent' ? 'hsl(40 30% 94%)' : 'transparent',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
              }}
            >
              Find Rentals
            </Link>

            <Link
              href="/buy/listings"
              onMouseEnter={() => setActiveLink('buy')}
              onMouseLeave={() => setActiveLink(null)}
              className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
              style={{
                color: activeLink === 'buy' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                backgroundColor: activeLink === 'buy' ? 'hsl(40 30% 94%)' : 'transparent',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
              }}
            >
              Buy Properties
            </Link>
          </>
        )}

        <Link
          href={isSuperAdminLoggedIn ? '/super-admin/dashboard' : '/admin'}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
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
          <LayoutDashboard
            style={{
              height: 'clamp(0.875rem, 2.5vw, 1rem)',
              width: 'clamp(0.875rem, 2.5vw, 1rem)',
              marginRight: '0.5rem'
            }}
          />
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
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'hsl(0 70% 50% / 0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          onClick={handleLogout}
        >
          <LogOut
            style={{
              height: 'clamp(0.875rem, 2.5vw, 1rem)',
              width: 'clamp(0.875rem, 2.5vw, 1rem)',
              marginRight: '0.5rem'
            }}
          />
          Logout
        </button>
      </>
    );
  }

  if (isTenantLoggedIn) {
    return (
      <>
      {isOnBuyPage && (
          <Link
            href="/rent/listings"
            onMouseEnter={() => setActiveLink('rent')}
            onMouseLeave={() => setActiveLink(null)}
            className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
            style={{
              color: activeLink === 'rent' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
              backgroundColor: activeLink === 'rent' ? 'hsl(40 30% 94%)' : 'transparent',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
            }}
          >
            Find Rentals
          </Link>
        )}

        {isOnRentPage && (
          <Link
            href="/buy/listings"
            onMouseEnter={() => setActiveLink('buy')}
            onMouseLeave={() => setActiveLink(null)}
            className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
            style={{
              color: activeLink === 'buy' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
              backgroundColor: activeLink === 'buy' ? 'hsl(40 30% 94%)' : 'transparent',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
            }}
          >
            Buy Properties
          </Link>
        )}

        {!isOnRentPage && !isOnBuyPage && (
          <>
            <Link
              href="/rent/listings"
              onMouseEnter={() => setActiveLink('rent')}
              onMouseLeave={() => setActiveLink(null)}
              className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
              style={{
                color: activeLink === 'rent' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                backgroundColor: activeLink === 'rent' ? 'hsl(40 30% 94%)' : 'transparent',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
              }}
            >
              Find Rentals
            </Link>

            <Link
              href="/buy/listings"
              onMouseEnter={() => setActiveLink('buy')}
              onMouseLeave={() => setActiveLink(null)}
              className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
              style={{
                color: activeLink === 'buy' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                backgroundColor: activeLink === 'buy' ? 'hsl(40 30% 94%)' : 'transparent',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
              }}
            >
              Buy Properties
            </Link>
          </>
        )}
        
        <p
          style={{
            fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
            fontWeight: '500',
            color: 'hsl(200 25% 15%)'
          }}
        >
          {tenantData?.name || 'Tenant'}
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
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'hsl(0 70% 50% / 0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          onClick={handleLogout}
        >
          <LogOut
            style={{
              height: 'clamp(0.875rem, 2.5vw, 1rem)',
              width: 'clamp(0.875rem, 2.5vw, 1rem)',
              marginRight: '0.5rem'
            }}
          />
          Logout
        </button>
      </>
    );
  }

  return null;
}

export function AuthMobile({
  isAnyUserLoggedIn,
  isAgentLoggedIn,
  isTenantLoggedIn,
  isAdminLoggedIn,
  isSuperAdminLoggedIn,
  agentData,
  tenantData,
  adminData,
  superAdminData,
  handleLogout,
  handleMobileLinkClick,
  activeLink,
  setActiveLink,
  isOnBuyPage,
  isOnRentPage
}) {
  if (!isAnyUserLoggedIn) {
    return (
      <>
        {isOnBuyPage && (
          <Link
            href="/rent/listings"
            onMouseEnter={() => setActiveLink('rent')}
            onMouseLeave={() => setActiveLink(null)}
            className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
            style={{
              color: activeLink === 'rent' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
              backgroundColor: activeLink === 'rent' ? 'hsl(40 30% 94%)' : 'transparent',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
            }}
          >
            Find Rentals
          </Link>
        )}
        {isOnRentPage && (
          <Link
            href="/buy/listings"
            onMouseEnter={() => setActiveLink('buy')}
            onMouseLeave={() => setActiveLink(null)}
            className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
            style={{
              color: activeLink === 'buy' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
              backgroundColor: activeLink === 'buy' ? 'hsl(40 30% 94%)' : 'transparent',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
            }}
          >
            Buy Properties
          </Link>
        )}

        {!isOnRentPage && !isOnBuyPage && (
          <>
            <Link
              href="/rent/listings"
              onMouseEnter={() => setActiveLink('rent')}
              onMouseLeave={() => setActiveLink(null)}
              className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
              style={{
                color: activeLink === 'rent' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                backgroundColor: activeLink === 'rent' ? 'hsl(40 30% 94%)' : 'transparent',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
              }}
            >
              Find Rentals
            </Link>

            <Link
              href="/buy/listings"
              onMouseEnter={() => setActiveLink('buy')}
              onMouseLeave={() => setActiveLink(null)}
              className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
              style={{
                color: activeLink === 'buy' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                backgroundColor: activeLink === 'buy' ? 'hsl(40 30% 94%)' : 'transparent',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
              }}
            >
              Buy Properties
            </Link>
          </>
        )}

        <Link
          href="/sign-up"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
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
          <User
            style={{
              height: 'clamp(0.875rem, 2.5vw, 1rem)',
              width: 'clamp(0.875rem, 2.5vw, 1rem)',
              marginRight: '0.5rem'
            }}
          />
          Sign In
        </Link>
      </>
    );
  }

  if (isAgentLoggedIn) {
    return (
      <>
        {isOnBuyPage && (
          <Link
            href="/rent/listings"
            onMouseEnter={() => setActiveLink('rent')}
            onMouseLeave={() => setActiveLink(null)}
            className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
            style={{
              color: activeLink === 'rent' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
              backgroundColor: activeLink === 'rent' ? 'hsl(40 30% 94%)' : 'transparent',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
            }}
          >
            Find Rentals
          </Link>
        )}

        {isOnRentPage && (
          <Link
            href="/buy/listings"
            onMouseEnter={() => setActiveLink('buy')}
            onMouseLeave={() => setActiveLink(null)}
            className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
            style={{
              color: activeLink === 'buy' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
              backgroundColor: activeLink === 'buy' ? 'hsl(40 30% 94%)' : 'transparent',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
            }}
          >
            Buy Properties
          </Link>
        )}

        {!isOnRentPage && !isOnBuyPage && (
          <>
            <Link
              href="/rent/listings"
              onMouseEnter={() => setActiveLink('rent')}
              onMouseLeave={() => setActiveLink(null)}
              className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
              style={{
                color: activeLink === 'rent' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                backgroundColor: activeLink === 'rent' ? 'hsl(40 30% 94%)' : 'transparent',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
              }}
            >
              Find Rentals
            </Link>

            <Link
              href="/buy/listings"
              onMouseEnter={() => setActiveLink('buy')}
              onMouseLeave={() => setActiveLink(null)}
              className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
              style={{
                color: activeLink === 'buy' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                backgroundColor: activeLink === 'buy' ? 'hsl(40 30% 94%)' : 'transparent',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
              }}
            >
              Buy Properties
            </Link>
          </>
        )}

        <Link
          href={
            agentData?.package === 'free' || agentData?.package === null
              ? '/agent/dashboard'
              : '/agent-dashboard'
          }
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
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
          <LayoutDashboard
            style={{
              height: 'clamp(0.875rem, 2.5vw, 1rem)',
              width: 'clamp(0.875rem, 2.5vw, 1rem)',
              marginRight: '0.5rem'
            }}
          />
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
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'hsl(0 70% 50% / 0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          onClick={handleLogout}
        >
          <LogOut
            style={{
              height: 'clamp(0.875rem, 2.5vw, 1rem)',
              width: 'clamp(0.875rem, 2.5vw, 1rem)',
              marginRight: '0.5rem'
            }}
          />
          Logout
        </button>
      </>
    );
  }

    if (isSuperAdminLoggedIn || isAdminLoggedIn) {
    return (
      <>
      {isOnBuyPage && (
          <Link
            href="/rent/listings"
            onMouseEnter={() => setActiveLink('rent')}
            onMouseLeave={() => setActiveLink(null)}
            className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
            style={{
              color: activeLink === 'rent' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
              backgroundColor: activeLink === 'rent' ? 'hsl(40 30% 94%)' : 'transparent',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
            }}
          >
            Find Rentals
          </Link>
        )}

        {isOnRentPage && (
          <Link
            href="/buy/listings"
            onMouseEnter={() => setActiveLink('buy')}
            onMouseLeave={() => setActiveLink(null)}
            className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
            style={{
              color: activeLink === 'buy' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
              backgroundColor: activeLink === 'buy' ? 'hsl(40 30% 94%)' : 'transparent',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
            }}
          >
            Buy Properties
          </Link>
        )}

        {!isOnRentPage && !isOnBuyPage && (
          <>
            <Link
              href="/rent/listings"
              onMouseEnter={() => setActiveLink('rent')}
              onMouseLeave={() => setActiveLink(null)}
              className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
              style={{
                color: activeLink === 'rent' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                backgroundColor: activeLink === 'rent' ? 'hsl(40 30% 94%)' : 'transparent',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
              }}
            >
              Find Rentals
            </Link>

            <Link
              href="/buy/listings"
              onMouseEnter={() => setActiveLink('buy')}
              onMouseLeave={() => setActiveLink(null)}
              className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
              style={{
                color: activeLink === 'buy' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                backgroundColor: activeLink === 'buy' ? 'hsl(40 30% 94%)' : 'transparent',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
              }}
            >
              Buy Properties
            </Link>
          </>
        )}

        <Link
          href={isSuperAdminLoggedIn ? '/super-admin/dashboard' : '/admin'}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'hsl(40 30% 94%)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
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
          <LayoutDashboard
            style={{
              height: 'clamp(0.875rem, 2.5vw, 1rem)',
              width: 'clamp(0.875rem, 2.5vw, 1rem)',
              marginRight: '0.5rem'
            }}
          />
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
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'hsl(0 70% 50% / 0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          onClick={handleLogout}
        >
          <LogOut
            style={{
              height: 'clamp(0.875rem, 2.5vw, 1rem)',
              width: 'clamp(0.875rem, 2.5vw, 1rem)',
              marginRight: '0.5rem'
            }}
          />
          Logout
        </button>
      </>
    );
  }

  if (isTenantLoggedIn) {
    return (
      <>
      {isOnBuyPage && (
          <Link
            href="/rent/listings"
            onMouseEnter={() => setActiveLink('rent')}
            onMouseLeave={() => setActiveLink(null)}
            className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
            style={{
              color: activeLink === 'rent' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
              backgroundColor: activeLink === 'rent' ? 'hsl(40 30% 94%)' : 'transparent',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
            }}
          >
            Find Rentals
          </Link>
        )}

        {isOnRentPage && (
          <Link
            href="/buy/listings"
            onMouseEnter={() => setActiveLink('buy')}
            onMouseLeave={() => setActiveLink(null)}
            className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
            style={{
              color: activeLink === 'buy' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
              backgroundColor: activeLink === 'buy' ? 'hsl(40 30% 94%)' : 'transparent',
              fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
            }}
          >
            Buy Properties
          </Link>
        )}

        {!isOnRentPage && !isOnBuyPage && (
          <>
            <Link
              href="/rent/listings"
              onMouseEnter={() => setActiveLink('rent')}
              onMouseLeave={() => setActiveLink(null)}
              className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
              style={{
                color: activeLink === 'rent' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                backgroundColor: activeLink === 'rent' ? 'hsl(40 30% 94%)' : 'transparent',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
              }}
            >
              Find Rentals
            </Link>

            <Link
              href="/buy/listings"
              onMouseEnter={() => setActiveLink('buy')}
              onMouseLeave={() => setActiveLink(null)}
              className="desktop-nav-link px-4 py-2 font-medium transition-all rounded-lg"
              style={{
                color: activeLink === 'buy' ? 'hsl(200 25% 15%)' : 'hsl(200 15% 45%)',
                backgroundColor: activeLink === 'buy' ? 'hsl(40 30% 94%)' : 'transparent',
                fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)'
              }}
            >
              Buy Properties
            </Link>
          </>
        )}
        
        <p
          style={{
            fontSize: 'clamp(0.8125rem, 2vw, 0.875rem)',
            fontWeight: '500',
            color: 'hsl(200 25% 15%)'
          }}
        >
          {tenantData?.name || 'Tenant'}
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
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'hsl(0 70% 50% / 0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          onClick={handleLogout}
        >
          <LogOut
            style={{
              height: 'clamp(0.875rem, 2.5vw, 1rem)',
              width: 'clamp(0.875rem, 2.5vw, 1rem)',
              marginRight: '0.5rem'
            }}
          />
          Logout
        </button>
      </>
    );
  }

  return null;
}
