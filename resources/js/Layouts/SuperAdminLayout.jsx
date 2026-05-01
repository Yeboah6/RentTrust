import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Header from '@/Components/Layouts/Header';

// ── Icons ─────────────────────────────────────────────────────────────────────

const DashboardIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
    </svg>
);
const PlansIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);
const SubscriptionsIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);
const PaymentsIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);
const AdminsIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const PropertyTypesIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);
const LocationsIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const AmenitiesIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);
const SettingsIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const FeaturesIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 3h6m-6 0v6l-4 9a1 1 0 00.9 1.45h12.2A1 1 0 0019 18l-4-9V3M9 3h6" />
    </svg>
);
const ImpersonateIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const LogsIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const CheckCircleIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const CollapseIcon = ({ collapsed }) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
);

// ── Nav config ────────────────────────────────────────────────────────────────

const NAV = [
    {
        key: 'overview',
        items: [
            { label: 'Dashboard', href: '/super-admin/dashboard', icon: DashboardIcon },
        ],
    },
    {
        key: 'saas',
        label: 'SaaS Management',
        items: [
            { label: 'Plans',         href: '/super-admin/plans',         icon: PlansIcon },
            { label: 'Subscriptions', href: '/super-admin/subscriptions', icon: SubscriptionsIcon },
            { label: 'Payments',      href: '/super-admin/payments',      icon: PaymentsIcon },
            { label: 'Listings',      href: '/super-admin/listings',      icon: PropertyTypesIcon },
            { label: 'Verification',  href: '/super-admin/listings/verification', icon: CheckCircleIcon },
            { label: 'Reports & Reviews',      href: '/super-admin/reports-reviews',      icon: PropertyTypesIcon },
        ],
    },
    {
        key: 'admin',
        label: 'User Management',
        items: [
            { label: 'Admin Accounts',  href: '/super-admin/admins',  icon: AdminsIcon },
            { label: 'Agent Accounts',  href: '/super-admin/agents',  icon: AdminsIcon },
            { label: 'Tenant Accounts', href: '/super-admin/tenants', icon: AdminsIcon },
        ],
    },
    {
        key: 'platform',
        label: 'Platform Config',
        items: [
            { label: 'Property Types', href: '/super-admin/property-types', icon: PropertyTypesIcon },
            { label: 'Locations',      href: '/super-admin/locations',      icon: LocationsIcon },
            { label: 'Amenities',      href: '/super-admin/amenities',      icon: AmenitiesIcon },
            { label: 'Settings',       href: '/super-admin/settings',       icon: SettingsIcon },
            { label: 'Feature Flags',  href: '/super-admin/features',       icon: FeaturesIcon },
        ],
    },
    {
        key: 'support',
        label: 'Support & System',
        items: [
            { label: 'Impersonate', href: '/super-admin/impersonate', icon: ImpersonateIcon },
            { label: 'System Logs', href: '/super-admin/audit-log',   icon: LogsIcon },
            { label: 'Reports', href: '/super-admin/reports',   icon: LogsIcon },
        ],
    },
];

// ── Nav item ──────────────────────────────────────────────────────────────────

const NavItem = ({ item, active, collapsed }) => {
    const [hovered, setHovered] = useState(false);
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            title={collapsed ? item.label : undefined}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: collapsed ? '0.6rem' : '0.55rem 0.75rem',
                borderRadius: '0.6rem',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative',
                backgroundColor: active
                    ? 'hsla(214 100% 60% / 0.15)'
                    : hovered ? 'hsla(0 0% 100% / 0.06)' : 'transparent',
                boxShadow: active ? 'inset 0 0 0 1px hsla(214 100% 65% / 0.25)' : 'none',
            }}
        >
            {active && (
                <span style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: '2px', borderRadius: '0 2px 2px 0',
                    backgroundColor: 'hsl(214 90% 62%)',
                }} />
            )}
            <span style={{
                color: active ? 'hsl(214 90% 68%)' : hovered ? 'hsla(0 0% 100% / 0.85)' : 'hsla(0 0% 100% / 0.45)',
                transition: 'color 0.15s', flexShrink: 0, display: 'flex',
            }}>
                <Icon />
            </span>
            {!collapsed && (
                <span style={{
                    fontSize: '0.82rem',
                    fontWeight: active ? '600' : '500',
                    color: active ? 'hsl(0 0% 96%)' : hovered ? 'hsla(0 0% 100% / 0.85)' : 'hsla(0 0% 100% / 0.5)',
                    transition: 'color 0.15s',
                    letterSpacing: '0.01em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                }}>
                    {item.label}
                </span>
            )}
        </Link>
    );
};

// ── Section divider ───────────────────────────────────────────────────────────

const SectionLabel = ({ label, collapsed }) => {
    if (collapsed) return <div style={{ height: '1px', backgroundColor: 'hsla(0 0% 100% / 0.07)', margin: '0.4rem 0.75rem' }} />;
    return (
        <div style={{
            padding: '0.6rem 0.75rem 0.2rem',
            fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.12em',
            color: 'hsla(0 0% 100% / 0.22)', textTransform: 'uppercase', userSelect: 'none',
        }}>
            {label}
        </div>
    );
};

// ── Layout ────────────────────────────────────────────────────────────────────

// ↓ Adjust this to match your actual <Header /> height in pixels
const HEADER_HEIGHT = 64;

const SuperAdminLayout = ({ children }) => {
    const { url, props } = usePage();
    const superAdminData = props?.auth?.super;
    const [collapsed, setCollapsed] = useState(false);
    const sidebarWidth = collapsed ? '4rem' : '14rem';

    return (
        <>
            <style>{`
                /* Lock the viewport — only inner panels scroll */
                html, body { height: 100%; overflow: hidden; }

                /* Sidebar nav scrollbar — subtle */
                .sa-nav::-webkit-scrollbar       { width: 3px; }
                .sa-nav::-webkit-scrollbar-track  { background: transparent; }
                .sa-nav::-webkit-scrollbar-thumb  { background: hsla(0 0% 100% / 0.14); border-radius: 999px; }
                .sa-nav::-webkit-scrollbar-thumb:hover { background: hsla(0 0% 100% / 0.28); }
                .sa-nav { scrollbar-width: thin; scrollbar-color: hsla(0 0% 100% / 0.14) transparent; }

                /* Main content scrollbar — visible */
                .sa-main::-webkit-scrollbar       { width: 6px; }
                .sa-main::-webkit-scrollbar-track  { background: hsl(220 15% 92%); }
                .sa-main::-webkit-scrollbar-thumb  { background: hsl(220 15% 76%); border-radius: 999px; }
                .sa-main::-webkit-scrollbar-thumb:hover { background: hsl(220 15% 60%); }
            `}</style>

            {/*
                Root container fills the viewport exactly.
                overflow:hidden stops any outer scroll.
            */}
            <div style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backgroundColor: 'hsl(220 15% 96%)',
            }}>

                {/* ── Header — fixed height, never scrolls ── */}
                <div style={{ height: `${HEADER_HEIGHT}px`, flexShrink: 0, zIndex: 20, position: 'relative' }}>
                    <Header />
                </div>

                <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

                    {/* ── Sidebar — never scrolls horizontally, nav scrolls vertically ── */}
                    <aside style={{
                        width: sidebarWidth,
                        minWidth: sidebarWidth,
                        flexShrink: 0,
                        backgroundColor: 'hsl(222 28% 14%)',
                        borderRight: '1px solid hsla(0 0% 100% / 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        transition: 'width 0.25s ease, min-width 0.25s ease',
                        // The sidebar itself doesn't scroll — only the <nav> inside does
                    }}>

                        {/* Brand row */}
                        <div style={{
                            padding: collapsed ? '1rem 0' : '1rem 0.875rem',
                            borderBottom: '1px solid hsla(0 0% 100% / 0.07)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: collapsed ? 'center' : 'space-between',
                            gap: '0.5rem',
                            flexShrink: 0,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                                <div style={{
                                    width: '3rem', height: '3rem', borderRadius: '0.45rem', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <img
                                        src="/rent-trust.png"
                                        alt="RentTrustGh Logo"
                                        style={{ width: '100%', height: '100%', display: 'block' }}
                                      />
                                </div>
                                {!collapsed && (
                                    <div style={{ overflow: 'hidden' }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'hsl(0 0% 95%)', letterSpacing: '0.01em', lineHeight: 1, whiteSpace: 'nowrap' }}>
                                            {superAdminData?.name || 'Super Admin'}
                                        </div>
                                        <div style={{ fontSize: '0.58rem', color: 'hsla(0 0% 100% / 0.28)', letterSpacing: '0.09em', textTransform: 'uppercase', marginTop: '0.15rem', whiteSpace: 'nowrap' }}>
                                            Control Panel
                                        </div>
                                    </div>
                                )}
                            </div>
                            {!collapsed && (
                                <button
                                    onClick={() => setCollapsed(true)}
                                    title="Collapse sidebar"
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
                                        color: 'hsla(0 0% 100% / 0.22)', padding: '0.25rem', borderRadius: '0.35rem',
                                        display: 'flex', transition: 'color 0.15s, background-color 0.15s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.color = 'hsla(0 0% 100% / 0.6)'; e.currentTarget.style.backgroundColor = 'hsla(0 0% 100% / 0.07)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = 'hsla(0 0% 100% / 0.22)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                    <CollapseIcon collapsed={false} />
                                </button>
                            )}
                        </div>

                        <nav className="sa-nav" style={{
                            flex: 1,
                            minHeight: 0,        // ← critical: without this flex child won't shrink
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            padding: '0.5rem',
                        }}>
                            {NAV.map((section) => (
                                <div key={section.key} style={{ marginBottom: '0.1rem' }}>
                                    {section.label && <SectionLabel label={section.label} collapsed={collapsed} />}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                        {section.items.map(item => (
                                            <NavItem
                                                key={item.href}
                                                item={item}
                                                active={url === item.href || url.startsWith(item.href + '/')}
                                                collapsed={collapsed}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>

                        {/* Collapse toggle — always pinned to the bottom of the sidebar */}
                        <div style={{ padding: '0.625rem 0.5rem', borderTop: '1px solid hsla(0 0% 100% / 0.07)', flexShrink: 0 }}>
                            <button
                                onClick={() => setCollapsed(c => !c)}
                                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                                style={{
                                    width: '100%',
                                    padding: collapsed ? '0.55rem' : '0.5rem 0.75rem',
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                    gap: '0.65rem',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    borderRadius: '0.6rem',
                                    color: 'hsla(0 0% 100% / 0.28)',
                                    fontSize: '0.78rem', fontWeight: '500',
                                    transition: 'background-color 0.15s, color 0.15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsla(0 0% 100% / 0.06)'; e.currentTarget.style.color = 'hsla(0 0% 100% / 0.65)'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'hsla(0 0% 100% / 0.28)'; }}
                            >
                                <CollapseIcon collapsed={collapsed} />
                                {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>Collapse</span>}
                            </button>
                        </div>
                    </aside>

                    <main className="sa-main" style={{
                        flex: 1,
                        minWidth: 0,
                        minHeight: 0,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        padding: '1.75rem 2rem',
                    }}>
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
};

export default SuperAdminLayout;