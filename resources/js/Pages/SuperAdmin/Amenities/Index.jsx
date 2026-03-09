import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ── Icons ─────────────────────────────────────────────────────────────────────

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

// Amenity-specific icons mapped by common category/name keywords
const amenityIcons = {
    wifi:       () => <svg style={{ width: '1.4rem', height: '1.4rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>,
    pool:       () => <svg style={{ width: '1.4rem', height: '1.4rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18M5 6l2 2 2-2 2 2 2-2 2 2 2-2M5 18l2 2 2-2 2 2 2-2 2 2 2-2" /></svg>,
    parking:    () => <svg style={{ width: '1.4rem', height: '1.4rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm4 5h3a2 2 0 010 4H9V8zm0 4v4" /></svg>,
    gym:        () => <svg style={{ width: '1.4rem', height: '1.4rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h2m14 0h2M7 7v10M17 7v10M7 10h10" /></svg>,
    security:   () => <svg style={{ width: '1.4rem', height: '1.4rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    garden:     () => <svg style={{ width: '1.4rem', height: '1.4rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22V12m0 0C12 7 7 5 3 7m9 5c0-5 5-7 9-5M9 15.5C7 14 5 14 3 16m18-1c-2-1.5-4-1.5-6 0" /></svg>,
    elevator:   () => <svg style={{ width: '1.4rem', height: '1.4rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L4 7m3-3l3 3m7 1v12m0 0l3-3m-3 3l-3-3" /></svg>,
    water:      () => <svg style={{ width: '1.4rem', height: '1.4rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C6.48 2 4 8 4 12c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4-2.48-10-8-10zm0 14c-2.21 0-4-1.79-4-4" /></svg>,
    electricity:() => <svg style={{ width: '1.4rem', height: '1.4rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    balcony:    () => <svg style={{ width: '1.4rem', height: '1.4rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h18M3 12v7h18v-7M3 12l9-9 9 9" /></svg>,
};

const DefaultAmenityIcon = () => (
    <svg style={{ width: '1.4rem', height: '1.4rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const getAmenityIcon = (name = '') => {
    const lower = name.toLowerCase();
    for (const [key, Icon] of Object.entries(amenityIcons)) {
        if (lower.includes(key)) return Icon;
    }
    return DefaultAmenityIcon;
};

// ── Palette cycling ───────────────────────────────────────────────────────────

const palette = [
    { bg: 'hsl(214 100% 95%)', color: 'hsl(214 80% 48%)' },
    { bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 35%)' },
    { bg: 'hsl(40 90% 93%)',   color: 'hsl(40 80% 40%)'  },
    { bg: 'hsl(270 60% 95%)',  color: 'hsl(270 60% 48%)' },
    { bg: 'hsl(340 70% 94%)',  color: 'hsl(340 70% 48%)' },
    { bg: 'hsl(200 70% 93%)',  color: 'hsl(200 65% 38%)' },
];

// ── Badges ────────────────────────────────────────────────────────────────────

const StatusBadge = ({ active }) => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
        fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.06em',
        padding: '0.2rem 0.55rem', borderRadius: '999px',
        backgroundColor: active ? 'hsl(152 60% 93%)' : 'hsl(220 15% 93%)',
        color: active ? 'hsl(152 60% 30%)' : 'hsl(220 15% 45%)',
    }}>
        <span style={{ width: '0.38rem', height: '0.38rem', borderRadius: '50%', backgroundColor: active ? 'hsl(152 60% 38%)' : 'hsl(220 15% 58%)' }} />
        {active ? 'ACTIVE' : 'INACTIVE'}
    </span>
);

const CategoryBadge = ({ category }) => {
    if (!category) return null;
    return (
        <span style={{
            fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.06em',
            padding: '0.18rem 0.5rem', borderRadius: '0.3rem',
            backgroundColor: 'hsl(220 15% 93%)', color: 'hsl(220 15% 42%)',
        }}>
            {category.toUpperCase()}
        </span>
    );
};

// ── Card ──────────────────────────────────────────────────────────────────────

const AmenityCard = ({ amenity, pal, index }) => {
    const [hovered, setHovered] = useState(false);
    const Icon = getAmenityIcon(amenity.icon ?? amenity.name);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                backgroundColor: 'white',
                border: `1px solid ${hovered ? pal.color : 'hsl(220 15% 90%)'}`,
                borderRadius: '0.875rem',
                overflow: 'hidden',
                transition: 'all 0.22s ease',
                transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: hovered
                    ? '0 12px 28px hsl(220 25% 15% / 0.09)'
                    : '0 1px 3px hsl(220 20% 15% / 0.05)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Accent strip */}
            <div style={{ height: '3px', backgroundColor: pal.color }} />

            {/* Body */}
            <div style={{ padding: '1.1rem 1.1rem 0.9rem', display: 'flex', alignItems: 'flex-start', gap: '0.875rem', flex: 1 }}>
                {/* Icon blob */}
                <div style={{
                    width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', flexShrink: 0,
                    backgroundColor: pal.bg, color: pal.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <h3 style={{ fontSize: '0.925rem', fontWeight: '700', color: 'hsl(220 25% 15%)', margin: 0, lineHeight: 1.3 }}>
                            {amenity.name}
                        </h3>
                        <StatusBadge active={amenity.is_active ?? true} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <CategoryBadge category={amenity.category} />
                        {amenity.slug && (
                            <span style={{
                                fontFamily: 'monospace', fontSize: '0.68rem',
                                color: 'hsl(214 80% 45%)', backgroundColor: 'hsl(214 100% 97%)',
                                padding: '0.1rem 0.4rem', borderRadius: '0.25rem',
                            }}>
                                {amenity.slug}
                            </span>
                        )}
                    </div>

                    {amenity.description && (
                        <p style={{
                            fontSize: '0.75rem', color: 'hsl(220 15% 52%)', margin: '0.5rem 0 0',
                            lineHeight: 1.45, display: '-webkit-box',
                            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                            {amenity.description}
                        </p>
                    )}

                    {/* Listings count */}
                    {amenity.listings_count !== undefined && (
                        <div style={{ marginTop: '0.6rem' }}>
                            <span style={{ fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 15%)' }}>
                                {amenity.listings_count.toLocaleString()}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: 'hsl(220 15% 55%)', marginLeft: '0.3rem' }}>listings</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div style={{
                padding: '0.7rem 1.1rem',
                borderTop: '1px solid hsl(220 15% 95%)',
                display: 'flex', gap: '0.5rem',
            }}>
                <Link
                    href={`/super-admin/amenities/${amenity.id}/edit`}
                    style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        padding: '0.42rem 0.75rem', borderRadius: '0.5rem',
                        fontSize: '0.78rem', fontWeight: '600',
                        backgroundColor: pal.bg, color: pal.color,
                        textDecoration: 'none', transition: 'filter 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.93)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                >
                    <EditIcon /> Edit
                </Link>
                <Link
                    href={`/super-admin/amenities/${amenity.id}`}
                    method="delete"
                    as="button"
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0.42rem 0.6rem', borderRadius: '0.5rem',
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

// ── Main ──────────────────────────────────────────────────────────────────────

const AmenitiesIndex = ({ amenities = [] }) => {
    const [search, setSearch]         = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    const categories = ['all', ...Array.from(new Set(amenities.map(a => a.category).filter(Boolean)))];

    const filtered = amenities.filter(a => {
        const q = search.toLowerCase();
        const matchSearch = !q
            || a.name?.toLowerCase().includes(q)
            || a.slug?.toLowerCase().includes(q)
            || a.category?.toLowerCase().includes(q)
            || a.description?.toLowerCase().includes(q);
        const matchCat = filterCategory === 'all' || a.category === filterCategory;
        return matchSearch && matchCat;
    });

    const activeCount = amenities.filter(a => a.is_active ?? true).length;

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'hsl(220 25% 15%)', margin: '0 0 0.2rem' }}>
                        Amenities
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                        {amenities.length} amenit{amenities.length !== 1 ? 'ies' : 'y'} &middot; {activeCount} active
                        {filtered.length !== amenities.length && ` · ${filtered.length} shown`}
                    </p>
                </div>
                <Link
                    href="/super-admin/amenities/create"
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
                    <PlusIcon /> New Amenity
                </Link>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)', pointerEvents: 'none' }}>
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder="Search amenities…"
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

                {/* Category filter — dynamic from data */}
                {categories.length > 1 && (
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {categories.map(c => (
                            <button
                                key={c}
                                onClick={() => setFilterCategory(c)}
                                style={{
                                    padding: '0.4rem 0.85rem', borderRadius: '999px', border: 'none',
                                    fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.04em', cursor: 'pointer',
                                    transition: 'all 0.15s',
                                    backgroundColor: filterCategory === c ? 'hsl(220 25% 15%)' : 'hsl(220 15% 93%)',
                                    color: filterCategory === c ? 'white' : 'hsl(220 15% 45%)',
                                }}
                            >
                                {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '4rem 2rem',
                    backgroundColor: 'white', borderRadius: '1rem',
                    border: '1px dashed hsl(220 15% 85%)',
                    color: 'hsl(220 15% 55%)', fontSize: '0.9rem',
                }}>
                    {search || filterCategory !== 'all'
                        ? 'No amenities match your filters.'
                        : 'No amenities yet. Add your first amenity to get started.'}
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '1rem',
                }}>
                    {filtered.map((amenity, i) => (
                        <AmenityCard
                            key={amenity.id}
                            amenity={amenity}
                            pal={palette[i % palette.length]}
                            index={i}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

AmenitiesIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default AmenitiesIndex;