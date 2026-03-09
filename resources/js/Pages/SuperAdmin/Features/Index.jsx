import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ── Icons ─────────────────────────────────────────────────────────────────────

const SearchIcon = () => (
    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const FlagIcon = () => (
    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21V5a2 2 0 012-2h10l2 3h4v10h-4l-2 3H5" />
    </svg>
);

const FlaskIcon = () => (
    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3h6m-6 0v6l-4 9a1 1 0 00.9 1.45h12.2A1 1 0 0019 18l-4-9V3M9 3h6" />
    </svg>
);

const LockIcon = () => (
    <svg style={{ width: '0.85rem', height: '0.85rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const UsersIcon = () => (
    <svg style={{ width: '0.85rem', height: '0.85rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CheckIcon = () => (
    <svg style={{ width: '0.85rem', height: '0.85rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
);

const ChevronIcon = ({ dir = 'down' }) => (
    <svg style={{ width: '0.875rem', height: '0.875rem', transform: dir === 'up' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────

const humanise = (key) =>
    (key ?? '').replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

// Infer a "category" from common key prefixes
const inferCategory = (key = '') => {
    const k = key.toLowerCase();
    if (k.startsWith('beta_') || k.includes('_beta') || k.includes('experimental')) return 'beta';
    if (k.startsWith('admin_') || k.includes('super') || k.includes('internal'))    return 'internal';
    if (k.startsWith('payment') || k.includes('billing') || k.includes('invoice'))  return 'billing';
    if (k.startsWith('email') || k.includes('notification') || k.includes('alert')) return 'notifications';
    if (k.startsWith('listing') || k.includes('property') || k.includes('booking')) return 'listings';
    return 'general';
};

const categoryConfig = {
    general:       { label: 'General',       bg: 'hsl(220 15% 93%)',  color: 'hsl(220 15% 40%)' },
    beta:          { label: 'Beta',           bg: 'hsl(270 60% 95%)',  color: 'hsl(270 60% 42%)' },
    internal:      { label: 'Internal',       bg: 'hsl(0 70% 94%)',    color: 'hsl(0 65% 42%)'   },
    billing:       { label: 'Billing',        bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 32%)' },
    notifications: { label: 'Notifications',  bg: 'hsl(40 90% 93%)',   color: 'hsl(40 80% 35%)'  },
    listings:      { label: 'Listings',       bg: 'hsl(214 100% 95%)', color: 'hsl(214 80% 42%)' },
};

const FILTERS = ['all', 'enabled', 'disabled', 'beta', 'internal', 'billing', 'notifications', 'listings', 'general'];

// ── Toggle switch ─────────────────────────────────────────────────────────────

const Toggle = ({ checked, onChange, size = 'md', disabled = false }) => {
    const w = size === 'lg' ? '3.25rem' : '2.75rem';
    const h = size === 'lg' ? '1.75rem' : '1.5rem';
    const d = size === 'lg' ? '1.35rem' : '1.2rem';

    return (
        <button
            onClick={() => !disabled && onChange(!checked)}
            disabled={disabled}
            style={{
                width: w, height: h, borderRadius: '999px', border: 'none',
                cursor: disabled ? 'not-allowed' : 'pointer', flexShrink: 0,
                position: 'relative',
                backgroundColor: checked ? 'hsl(152 60% 38%)' : 'hsl(220 15% 80%)',
                transition: 'background-color 0.2s',
                opacity: disabled ? 0.5 : 1,
            }}
        >
            <span style={{
                position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                left: checked ? `calc(100% - ${d} - 0.15rem)` : '0.15rem',
                width: d, height: d, borderRadius: '50%',
                backgroundColor: 'white', transition: 'left 0.2s',
                boxShadow: '0 1px 3px hsl(220 25% 15% / 0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {checked && <CheckIcon />}
            </span>
        </button>
    );
};

// ── Flag card ─────────────────────────────────────────────────────────────────

const FlagCard = ({ flagKey, flag, onToggle, saving }) => {
    const [expanded, setExpanded] = useState(false);
    const [hovered, setHovered]   = useState(false);

    // flag can be a simple boolean or a rich object { enabled, description, rollout, users, ... }
    const isObj    = typeof flag === 'object' && flag !== null;
    const enabled  = isObj ? (flag.enabled ?? flag.value ?? false) : Boolean(flag);
    const desc     = isObj ? flag.description : null;
    const rollout  = isObj ? flag.rollout_percentage ?? flag.rollout : null;
    const users    = isObj ? flag.users ?? flag.user_ids : null;
    const isLocked = isObj ? flag.locked : false;
    const category = isObj ? (flag.category ?? inferCategory(flagKey)) : inferCategory(flagKey);
    const catCfg   = categoryConfig[category] ?? categoryConfig.general;
    const hasExtra = desc || rollout !== null || (users && users.length > 0);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                backgroundColor: 'white',
                border: `1px solid ${hovered ? (enabled ? 'hsl(152 45% 72%)' : 'hsl(220 15% 80%)') : 'hsl(220 15% 91%)'}`,
                borderRadius: '0.875rem',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
                boxShadow: hovered ? '0 8px 20px hsl(220 25% 15% / 0.08)' : '0 1px 3px hsl(220 20% 15% / 0.04)',
            }}
        >
            {/* Enabled indicator strip */}
            <div style={{ height: '3px', backgroundColor: enabled ? 'hsl(152 60% 42%)' : 'hsl(220 15% 85%)', transition: 'background-color 0.3s' }} />

            <div style={{ padding: '1rem 1.1rem' }}>
                {/* Main row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Key name */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                            <code style={{
                                fontSize: '0.82rem', fontWeight: '700',
                                color: 'hsl(220 25% 18%)',
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                            }}>
                                {flagKey}
                            </code>
                            {isLocked && (
                                <span style={{ color: 'hsl(40 80% 42%)', display: 'flex', alignItems: 'center' }} title="Locked — cannot be changed">
                                    <LockIcon />
                                </span>
                            )}
                        </div>

                        {/* Badges row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <span style={{
                                fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.06em',
                                padding: '0.18rem 0.5rem', borderRadius: '0.3rem',
                                backgroundColor: catCfg.bg, color: catCfg.color,
                            }}>
                                {catCfg.label.toUpperCase()}
                            </span>

                            {rollout !== null && rollout !== undefined && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.68rem', fontWeight: '600', color: 'hsl(214 80% 42%)', backgroundColor: 'hsl(214 100% 96%)', padding: '0.18rem 0.5rem', borderRadius: '0.3rem' }}>
                                    <FlaskIcon /> {rollout}% rollout
                                </span>
                            )}

                            {users && users.length > 0 && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.68rem', fontWeight: '600', color: 'hsl(270 60% 42%)', backgroundColor: 'hsl(270 60% 96%)', padding: '0.18rem 0.5rem', borderRadius: '0.3rem' }}>
                                    <UsersIcon /> {users.length} user{users.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {desc && (
                            <p style={{ fontSize: '0.775rem', color: 'hsl(220 15% 52%)', margin: '0.5rem 0 0', lineHeight: 1.45 }}>
                                {desc}
                            </p>
                        )}
                    </div>

                    {/* Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.04em', color: enabled ? 'hsl(152 60% 35%)' : 'hsl(220 15% 50%)' }}>
                            {saving ? '…' : enabled ? 'ON' : 'OFF'}
                        </span>
                        <Toggle checked={enabled} onChange={() => onToggle(flagKey, !enabled)} disabled={isLocked || saving} />
                    </div>
                </div>

                {/* Expand button for extra metadata */}
                {hasExtra && isObj && Object.keys(flag).length > 3 && (
                    <button
                        onClick={() => setExpanded(e => !e)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                            marginTop: '0.65rem', background: 'none', border: 'none',
                            cursor: 'pointer', fontSize: '0.72rem', fontWeight: '600',
                            color: 'hsl(220 15% 55%)', padding: 0,
                        }}
                    >
                        <ChevronIcon dir={expanded ? 'up' : 'down'} />
                        {expanded ? 'Hide' : 'Show'} metadata
                    </button>
                )}

                {/* Expanded metadata */}
                {expanded && isObj && (
                    <div style={{
                        marginTop: '0.75rem', padding: '0.75rem',
                        backgroundColor: 'hsl(220 15% 97%)', borderRadius: '0.5rem',
                        fontSize: '0.75rem', fontFamily: 'monospace',
                        color: 'hsl(220 25% 30%)', lineHeight: 1.6,
                        whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                    }}>
                        {JSON.stringify(flag, null, 2)}
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Summary stat ──────────────────────────────────────────────────────────────

const StatPill = ({ label, value, bg, color }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: '0.65rem',
        backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)',
        borderRadius: '0.75rem', padding: '0.75rem 1.1rem',
        boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)',
    }}>
        <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'hsl(220 25% 15%)' }}>{value}</span>
        <span style={{ fontSize: '0.72rem', fontWeight: '600', color: 'hsl(220 15% 50%)', lineHeight: 1.3 }}>{label}</span>
        <span style={{ marginLeft: 'auto', width: '0.6rem', height: '0.6rem', borderRadius: '50%', backgroundColor: bg, flexShrink: 0 }} />
    </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────

const FeaturesIndex = ({ flags = {} }) => {
    const [localFlags, setLocalFlags] = useState(flags);
    const [saving, setSaving]         = useState({});
    const [search, setSearch]         = useState('');
    const [filter, setFilter]         = useState('all');

    const allKeys = Object.keys(localFlags);

    const enabledCount  = allKeys.filter(k => {
        const f = localFlags[k];
        return typeof f === 'object' ? (f.enabled ?? f.value ?? false) : Boolean(f);
    }).length;
    const disabledCount = allKeys.length - enabledCount;
    const betaCount     = allKeys.filter(k => inferCategory(k) === 'beta' || localFlags[k]?.category === 'beta').length;

    const handleToggle = async (key, newValue) => {
        setSaving(prev => ({ ...prev, [key]: true }));
        setLocalFlags(prev => {
            const f = prev[key];
            if (typeof f === 'object' && f !== null) {
                return { ...prev, [key]: { ...f, enabled: newValue } };
            }
            return { ...prev, [key]: newValue };
        });
        try {
            await router.put(`/super-admin/features/${key}`, { enabled: newValue }, { preserveScroll: true });
        } catch (e) {
            // rollback on failure
            setLocalFlags(prev => {
                const f = prev[key];
                if (typeof f === 'object' && f !== null) {
                    return { ...prev, [key]: { ...f, enabled: !newValue } };
                }
                return { ...prev, [key]: !newValue };
            });
        } finally {
            setSaving(prev => ({ ...prev, [key]: false }));
        }
    };

    const filtered = allKeys.filter(key => {
        const q = search.toLowerCase();
        const flag = localFlags[key];
        const enabled = typeof flag === 'object' ? (flag.enabled ?? flag.value ?? false) : Boolean(flag);
        const category = typeof flag === 'object' ? (flag.category ?? inferCategory(key)) : inferCategory(key);

        const matchSearch = !q || key.toLowerCase().includes(q) || (flag?.description ?? '').toLowerCase().includes(q);
        const matchFilter =
            filter === 'all'      ? true :
            filter === 'enabled'  ? enabled :
            filter === 'disabled' ? !enabled :
            category === filter;

        return matchSearch && matchFilter;
    });

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'hsl(220 25% 15%)', margin: '0 0 0.2rem' }}>
                        Feature Flags
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                        {allKeys.length} flag{allKeys.length !== 1 ? 's' : ''} &middot; {filtered.length} shown
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FlagIcon />
                </div>
            </div>

            {/* Stat pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <StatPill label="Total Flags"    value={allKeys.length}  bg="hsl(214 80% 50%)"  color="hsl(214 80% 42%)" />
                <StatPill label="Enabled"        value={enabledCount}    bg="hsl(152 60% 38%)"  color="hsl(152 60% 32%)" />
                <StatPill label="Disabled"       value={disabledCount}   bg="hsl(220 15% 65%)"  color="hsl(220 15% 45%)" />
                <StatPill label="Beta / Experimental" value={betaCount}  bg="hsl(270 60% 52%)"  color="hsl(270 60% 42%)" />
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)', pointerEvents: 'none' }}>
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder="Search flags…"
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
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '0.4rem 0.85rem', borderRadius: '999px', border: 'none',
                                fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.04em', cursor: 'pointer',
                                transition: 'all 0.15s',
                                backgroundColor: filter === f ? 'hsl(220 25% 15%)' : 'hsl(220 15% 93%)',
                                color: filter === f ? 'white' : 'hsl(220 15% 45%)',
                            }}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '4rem 2rem',
                    backgroundColor: 'white', borderRadius: '1rem',
                    border: '1px dashed hsl(220 15% 85%)',
                    color: 'hsl(220 15% 55%)', fontSize: '0.9rem',
                }}>
                    No flags match your filters.
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '0.875rem',
                }}>
                    {filtered.map(key => (
                        <FlagCard
                            key={key}
                            flagKey={key}
                            flag={localFlags[key]}
                            onToggle={handleToggle}
                            saving={!!saving[key]}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

FeaturesIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default FeaturesIndex;