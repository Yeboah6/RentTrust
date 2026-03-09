import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ── Icons ────────────────────────────────────────────────────────────────────

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

const ChevronIcon = ({ dir = 'down' }) => (
    <svg style={{ width: '0.875rem', height: '0.875rem', transform: dir === 'right' ? 'rotate(-90deg)' : 'none', transition: 'transform 0.15s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const SortChevron = ({ dir = 'down' }) => (
    <svg style={{ width: '0.875rem', height: '0.875rem', transform: dir === 'up' ? 'rotate(180deg)' : 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const MapPinIcon = ({ size = '0.9rem' }) => (
    <svg style={{ width: size, height: size }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const GlobeIcon = () => (
    <svg style={{ width: '0.85rem', height: '0.85rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDate = (val) => {
    if (!val) return '—';
    try { return new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return val; }
};

// type badge colours
const typePalette = {
    country:  { bg: 'hsl(214 100% 95%)', color: 'hsl(214 80% 42%)',  label: 'Country' },
    region:   { bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 32%)',  label: 'Region'  },
    state:    { bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 32%)',  label: 'State'   },
    city:     { bg: 'hsl(40 90% 93%)',   color: 'hsl(40 80% 35%)',   label: 'City'    },
    district: { bg: 'hsl(270 60% 95%)',  color: 'hsl(270 60% 42%)',  label: 'District'},
    area:     { bg: 'hsl(340 70% 94%)',  color: 'hsl(340 70% 42%)',  label: 'Area'    },
};

const TypeBadge = ({ type }) => {
    const key = (type ?? '').toLowerCase();
    const cfg = typePalette[key] ?? { bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 42%)', label: type ?? '—' };
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.06em',
            padding: '0.2rem 0.55rem', borderRadius: '0.35rem',
            backgroundColor: cfg.bg, color: cfg.color,
        }}>
            <GlobeIcon />
            {cfg.label.toUpperCase()}
        </span>
    );
};

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

// ── Row (recursive) ───────────────────────────────────────────────────────────

const LocationRow = ({ location, depth = 0, expandedIds, toggleExpand, hoveredId, setHoveredId, isSearching }) => {
    const hasChildren = location.children?.length > 0;
    const isExpanded  = expandedIds.has(location.id);
    const isHovered   = hoveredId === location.id;
    const indent      = depth * 1.5;

    return (
        <>
            <tr
                onMouseEnter={() => setHoveredId(location.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                    borderBottom: '1px solid hsl(220 15% 94%)',
                    backgroundColor: isHovered
                        ? 'hsl(220 25% 98.5%)'
                        : depth % 2 === 0 ? 'white' : 'hsl(220 15% 99%)',
                    transition: 'background-color 0.12s',
                }}
            >
                {/* Name */}
                <td style={{ padding: '0.8rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: `${indent}rem` }}>
                        {/* Expand toggle */}
                        {hasChildren ? (
                            <button
                                onClick={() => toggleExpand(location.id)}
                                style={{
                                    width: '1.4rem', height: '1.4rem', borderRadius: '0.35rem',
                                    border: 'none', cursor: 'pointer', flexShrink: 0,
                                    backgroundColor: 'hsl(220 15% 92%)', color: 'hsl(220 15% 40%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'background-color 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 85%)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 92%)'}
                            >
                                <ChevronIcon dir={isExpanded ? 'down' : 'right'} />
                            </button>
                        ) : (
                            <span style={{ width: '1.4rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(220 15% 70%)' }}>
                                {depth > 0 && <MapPinIcon size="0.75rem" />}
                            </span>
                        )}

                        <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: depth === 0 ? '700' : '500', color: 'hsl(220 25% 15%)' }}>
                                {location.name}
                            </div>
                            {location.slug && (
                                <span style={{
                                    fontFamily: 'monospace', fontSize: '0.68rem',
                                    color: 'hsl(214 80% 45%)', backgroundColor: 'hsl(214 100% 97%)',
                                    padding: '0.1rem 0.4rem', borderRadius: '0.25rem',
                                }}>
                                    {location.slug}
                                </span>
                            )}
                        </div>
                    </div>
                </td>

                {/* Type */}
                <td style={{ padding: '0.8rem 1rem' }}>
                    <TypeBadge type={location.type} />
                </td>

                {/* Parent */}
                <td style={{ padding: '0.8rem 1rem', fontSize: '0.8rem', color: 'hsl(220 15% 50%)' }}>
                    {location.parent?.name ?? (depth === 0 ? <span style={{ color: 'hsl(220 15% 70%)' }}>—</span> : '—')}
                </td>

                {/* Listings */}
                <td style={{ padding: '0.8rem 1rem', textAlign: 'right' }}>
                    {location.listings_count !== undefined ? (
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 20%)' }}>
                            {location.listings_count.toLocaleString()}
                        </span>
                    ) : '—'}
                </td>

                {/* Children count */}
                <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                    {hasChildren ? (
                        <span style={{
                            fontSize: '0.72rem', fontWeight: '700',
                            color: 'hsl(214 80% 42%)', backgroundColor: 'hsl(214 100% 95%)',
                            padding: '0.15rem 0.5rem', borderRadius: '999px',
                        }}>
                            {location.children.length}
                        </span>
                    ) : (
                        <span style={{ color: 'hsl(220 15% 70%)', fontSize: '0.8rem' }}>—</span>
                    )}
                </td>

                {/* Status */}
                <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                    <StatusBadge active={location.is_active ?? true} />
                </td>

                {/* Created */}
                <td style={{ padding: '0.8rem 1rem', fontSize: '0.8rem', color: 'hsl(220 15% 42%)', whiteSpace: 'nowrap' }}>
                    {formatDate(location.created_at)}
                </td>

                {/* Actions */}
                <td style={{ padding: '0.8rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <Link
                            href={`/super-admin/locations/${location.id}/edit`}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                padding: '0.38rem 0.65rem', borderRadius: '0.5rem',
                                fontSize: '0.75rem', fontWeight: '600',
                                backgroundColor: 'hsl(214 100% 95%)', color: 'hsl(214 80% 42%)',
                                textDecoration: 'none', transition: 'filter 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.93)'}
                            onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                        >
                            <EditIcon /> Edit
                        </Link>
                        <Link
                            href={`/super-admin/locations/${location.id}`}
                            method="delete"
                            as="button"
                            style={{
                                display: 'inline-flex', alignItems: 'center',
                                padding: '0.38rem 0.55rem', borderRadius: '0.5rem',
                                backgroundColor: 'hsl(0 70% 96%)', color: 'hsl(0 65% 48%)',
                                border: 'none', cursor: 'pointer', transition: 'filter 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.93)'}
                            onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                        >
                            <TrashIcon />
                        </Link>
                    </div>
                </td>
            </tr>

            {/* Children rows */}
            {hasChildren && (isExpanded || isSearching) && location.children.map(child => (
                <LocationRow
                    key={child.id}
                    location={child}
                    depth={depth + 1}
                    expandedIds={expandedIds}
                    toggleExpand={toggleExpand}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                    isSearching={isSearching}
                />
            ))}
        </>
    );
};

// ── Flatten for search ────────────────────────────────────────────────────────

const flattenLocations = (locations, depth = 0) => {
    const result = [];
    for (const loc of locations) {
        result.push({ ...loc, _depth: depth });
        if (loc.children?.length) result.push(...flattenLocations(loc.children, depth + 1));
    }
    return result;
};

// ── Main Component ────────────────────────────────────────────────────────────

const TYPES = ['all', 'country', 'region', 'state', 'city', 'district', 'area'];

const LocationsIndex = ({ locations = [] }) => {
    const [search, setSearch]           = useState('');
    const [filterType, setFilterType]   = useState('all');
    const [sortField, setSortField]     = useState('name');
    const [sortDir, setSortDir]         = useState('asc');
    const [expandedIds, setExpandedIds] = useState(new Set());
    const [hoveredId, setHoveredId]     = useState(null);

    const toggleExpand = (id) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const expandAll  = () => setExpandedIds(new Set(flattenLocations(locations).map(l => l.id)));
    const collapseAll = () => setExpandedIds(new Set());

    const isSearching = search.trim().length > 0 || filterType !== 'all';

    const flat = useMemo(() => flattenLocations(locations), [locations]);

    // When searching, show flat filtered list; otherwise show tree from root
    const rootLocations = useMemo(() => {
        if (!isSearching) {
            return locations.filter(l => !l.parent_id);
        }
        return flat
            .filter(l => {
                const q = search.toLowerCase();
                const matchSearch = !q
                    || l.name?.toLowerCase().includes(q)
                    || l.slug?.toLowerCase().includes(q)
                    || l.type?.toLowerCase().includes(q);
                const matchType = filterType === 'all' || (l.type ?? '').toLowerCase() === filterType;
                return matchSearch && matchType;
            })
            .sort((a, b) => {
                let av, bv;
                if (sortField === 'name')   { av = a.name ?? '';         bv = b.name ?? ''; }
                else if (sortField === 'type')   { av = a.type ?? '';    bv = b.type ?? ''; }
                else if (sortField === 'listings'){ av = a.listings_count ?? 0; bv = b.listings_count ?? 0; }
                const cmp = av < bv ? -1 : av > bv ? 1 : 0;
                return sortDir === 'asc' ? cmp : -cmp;
            });
    }, [locations, flat, search, filterType, sortField, sortDir, isSearching]);

    const toggleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
    };

    const totalActive = flat.filter(l => l.is_active ?? true).length;

    const SortTh = ({ field, label, align = 'left' }) => (
        <th
            onClick={() => { if (isSearching) toggleSort(field); }}
            style={{
                padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: '700',
                letterSpacing: '0.07em', color: 'hsl(220 15% 45%)',
                textAlign: align,
                cursor: isSearching ? 'pointer' : 'default',
                userSelect: 'none', whiteSpace: 'nowrap',
                borderBottom: '1px solid hsl(220 15% 91%)',
                backgroundColor: (isSearching && sortField === field) ? 'hsl(220 25% 98%)' : 'hsl(220 15% 97%)',
            }}
        >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                {label}
                {isSearching && (
                    sortField === field
                        ? <SortChevron dir={sortDir === 'asc' ? 'down' : 'up'} />
                        : <span style={{ opacity: 0.3 }}><SortChevron /></span>
                )}
            </span>
        </th>
    );

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'hsl(220 25% 15%)', margin: '0 0 0.2rem' }}>
                        Locations
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                        {flat.length} location{flat.length !== 1 ? 's' : ''} &middot; {totalActive} active
                        {isSearching && ` · ${rootLocations.length} shown`}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!isSearching && (
                        <>
                            <button
                                onClick={expandAll}
                                style={{ padding: '0.5rem 0.9rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 30%)', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Expand All
                            </button>
                            <button
                                onClick={collapseAll}
                                style={{ padding: '0.5rem 0.9rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 30%)', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Collapse
                            </button>
                        </>
                    )}
                    <Link
                        href="/super-admin/locations/create"
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
                        <PlusIcon /> New Location
                    </Link>
                </div>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)', pointerEvents: 'none' }}>
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder="Search locations…"
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
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {TYPES.map(t => (
                        <button
                            key={t}
                            onClick={() => setFilterType(t)}
                            style={{
                                padding: '0.4rem 0.85rem', borderRadius: '999px', border: 'none',
                                fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.04em', cursor: 'pointer',
                                transition: 'all 0.15s',
                                backgroundColor: filterType === t ? 'hsl(220 25% 15%)' : 'hsl(220 15% 93%)',
                                color: filterType === t ? 'white' : 'hsl(220 15% 45%)',
                            }}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div style={{
                backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)',
                borderRadius: '0.875rem', overflow: 'hidden',
                boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)',
            }}>
                {rootLocations.length === 0 ? (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'hsl(220 15% 55%)', fontSize: '0.9rem' }}>
                        {isSearching ? 'No locations match your filters.' : 'No locations yet. Add your first location to get started.'}
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <SortTh field="name"     label="LOCATION" />
                                <SortTh field="type"     label="TYPE" />
                                <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.07em', color: 'hsl(220 15% 45%)', borderBottom: '1px solid hsl(220 15% 91%)', backgroundColor: 'hsl(220 15% 97%)' }}>PARENT</th>
                                <SortTh field="listings" label="LISTINGS" align="right" />
                                <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.07em', color: 'hsl(220 15% 45%)', textAlign: 'center', borderBottom: '1px solid hsl(220 15% 91%)', backgroundColor: 'hsl(220 15% 97%)' }}>CHILDREN</th>
                                <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.07em', color: 'hsl(220 15% 45%)', textAlign: 'center', borderBottom: '1px solid hsl(220 15% 91%)', backgroundColor: 'hsl(220 15% 97%)' }}>STATUS</th>
                                <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.07em', color: 'hsl(220 15% 45%)', borderBottom: '1px solid hsl(220 15% 91%)', backgroundColor: 'hsl(220 15% 97%)' }}>CREATED</th>
                                <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.07em', color: 'hsl(220 15% 45%)', textAlign: 'right', borderBottom: '1px solid hsl(220 15% 91%)', backgroundColor: 'hsl(220 15% 97%)' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rootLocations.map(location => (
                                <LocationRow
                                    key={location.id}
                                    location={location}
                                    depth={isSearching ? (location._depth ?? 0) : 0}
                                    expandedIds={expandedIds}
                                    toggleExpand={toggleExpand}
                                    hoveredId={hoveredId}
                                    setHoveredId={setHoveredId}
                                    isSearching={isSearching}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

LocationsIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default LocationsIndex;