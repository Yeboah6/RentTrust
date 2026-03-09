import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

const SearchIcon = () => (
    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const PlusIcon = () => (
    <svg style={{ width: '1.1rem', height: '1.1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const EditIcon = () => (
    <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const TrashIcon = () => (
    <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const HomeIcon = () => (
    <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const BuildingIcon = () => (
    <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const OfficeIcon = () => (
    <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
);

const LandIcon = () => (
    <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const DefaultTypeIcon = () => (
    <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
);

const iconPalette = [
    { bg: 'hsl(214 100% 95%)', color: 'hsl(214 80% 48%)', Icon: HomeIcon },
    { bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 35%)', Icon: BuildingIcon },
    { bg: 'hsl(40 90% 93%)',   color: 'hsl(40 80% 40%)',  Icon: OfficeIcon },
    { bg: 'hsl(270 60% 95%)',  color: 'hsl(270 60% 48%)', Icon: LandIcon },
    { bg: 'hsl(340 70% 94%)',  color: 'hsl(340 70% 48%)', Icon: HomeIcon },
    { bg: 'hsl(200 70% 93%)',  color: 'hsl(200 65% 38%)', Icon: DefaultTypeIcon },
];

const StatusBadge = ({ active }) => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
        fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.06em',
        padding: '0.2rem 0.55rem', borderRadius: '999px',
        backgroundColor: active ? 'hsl(152 60% 93%)' : 'hsl(220 15% 93%)',
        color: active ? 'hsl(152 60% 30%)' : 'hsl(220 15% 45%)',
    }}>
        <span style={{
            width: '0.38rem', height: '0.38rem', borderRadius: '50%',
            backgroundColor: active ? 'hsl(152 60% 38%)' : 'hsl(220 15% 58%)',
        }} />
        {active ? 'ACTIVE' : 'INACTIVE'}
    </span>
);

const TypeCard = ({ type, palette, index }) => {
    const [hovered, setHovered] = useState(false);
    const { bg, color, Icon } = palette;

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                backgroundColor: 'white',
                border: `1px solid ${hovered ? color : 'hsl(220 15% 90%)'}`,
                borderRadius: '0.875rem',
                overflow: 'hidden',
                transition: 'all 0.22s ease',
                transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: hovered
                    ? `0 12px 28px hsl(220 25% 15% / 0.09)`
                    : '0 1px 3px hsl(220 20% 15% / 0.05)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Coloured top strip */}
            <div style={{ height: '3px', backgroundColor: color }} />

            <div style={{ padding: '1.25rem 1.25rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                {/* Icon */}
                <div style={{
                    width: '3rem', height: '3rem', borderRadius: '0.75rem', flexShrink: 0,
                    backgroundColor: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '0.975rem', fontWeight: '700', color: 'hsl(220 25% 15%)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {type.name}
                        </h3>
                        <StatusBadge active={type.is_active ?? true} />
                    </div>

                    {type.description && (
                        <p style={{ fontSize: '0.78rem', color: 'hsl(220 15% 52%)', margin: '0 0 0.6rem', lineHeight: 1.45,
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                            {type.description}
                        </p>
                    )}

                    {/* Stats row */}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: type.description ? 0 : '0.4rem' }}>
                        {type.listings_count !== undefined && (
                            <div>
                                <span style={{ fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 15%)' }}>
                                    {type.listings_count?.toLocaleString() ?? 0}
                                </span>
                                <span style={{ fontSize: '0.68rem', color: 'hsl(220 15% 55%)', marginLeft: '0.3rem' }}>listings</span>
                            </div>
                        )}
                        {type.slug && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{
                                    fontFamily: 'monospace', fontSize: '0.72rem',
                                    color: 'hsl(214 80% 45%)', backgroundColor: 'hsl(214 100% 97%)',
                                    padding: '0.15rem 0.45rem', borderRadius: '0.3rem',
                                }}>
                                    {type.slug}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div style={{
                padding: '0.75rem 1.25rem',
                borderTop: '1px solid hsl(220 15% 95%)',
                display: 'flex', gap: '0.5rem',
                marginTop: 'auto',
            }}>
                <Link
                    href={`/super-admin/property-types/${type.id}/edit`}
                    style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        padding: '0.45rem 0.75rem', borderRadius: '0.5rem',
                        fontSize: '0.78rem', fontWeight: '600',
                        backgroundColor: bg, color,
                        textDecoration: 'none', transition: 'filter 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.93)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                >
                    <EditIcon /> Edit
                </Link>
                <Link
                    href={`/super-admin/property-types/${type.id}`}
                    method="delete"
                    as="button"
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0.45rem 0.6rem', borderRadius: '0.5rem',
                        backgroundColor: 'hsl(0 70% 96%)', color: 'hsl(0 65% 48%)',
                        border: 'none', cursor: 'pointer', transition: 'filter 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.93)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                >
                    <TrashIcon />
                </Link>
            </div>
        </div>
    );
};

const TypesIndex = ({ types = [] }) => {
    const [search, setSearch] = useState('');

    const filtered = types.filter(t =>
        !search || t.name?.toLowerCase().includes(search.toLowerCase())
            || t.slug?.toLowerCase().includes(search.toLowerCase())
            || t.description?.toLowerCase().includes(search.toLowerCase())
    );

    const activeCount = types.filter(t => t.is_active ?? true).length;

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'hsl(220 25% 15%)', margin: '0 0 0.2rem' }}>
                        Property Types
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                        {types.length} type{types.length !== 1 ? 's' : ''} &middot; {activeCount} active
                    </p>
                </div>
                <Link
                    href="/super-admin/property-types/create"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.6rem 1.25rem', borderRadius: '0.6rem',
                        backgroundColor: 'hsl(220 25% 15%)', color: 'white',
                        fontWeight: '600', fontSize: '0.875rem', textDecoration: 'none',
                        transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'}
                >
                    <PlusIcon /> New Type
                </Link>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', maxWidth: '360px', marginBottom: '1.25rem' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)', pointerEvents: 'none' }}>
                    <SearchIcon />
                </span>
                <input
                    type="text"
                    placeholder="Search property types…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.25rem',
                        border: '1px solid hsl(220 15% 88%)', borderRadius: '0.6rem',
                        fontSize: '0.85rem', color: 'hsl(220 25% 20%)',
                        backgroundColor: 'white', outline: 'none', boxSizing: 'border-box',
                    }}
                />
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '4rem 2rem',
                    backgroundColor: 'white', borderRadius: '1rem',
                    border: '1px dashed hsl(220 15% 85%)',
                    color: 'hsl(220 15% 55%)', fontSize: '0.9rem',
                }}>
                    {search ? 'No property types match your search.' : 'No property types yet. Add your first type to get started.'}
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '1rem',
                }}>
                    {filtered.map((type, i) => (
                        <TypeCard
                            key={type.id}
                            type={type}
                            palette={iconPalette[i % iconPalette.length]}
                            index={i}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

TypesIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default TypesIndex;