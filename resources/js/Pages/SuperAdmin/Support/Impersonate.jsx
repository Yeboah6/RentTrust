import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ── Icons ─────────────────────────────────────────────────────────────────────

const SearchIcon = () => (
    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const ChevronIcon = ({ dir = 'down' }) => (
    <svg style={{ width: '0.875rem', height: '0.875rem', transform: dir === 'up' ? 'rotate(180deg)' : 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const UserSwitchIcon = () => (
    <svg style={{ width: '1.1rem', height: '1.1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const ShieldAlertIcon = () => (
    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
    </svg>
);

const XIcon = () => (
    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const EyeIcon = () => (
    <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────

const Avatar = ({ name, email, size = '2.5rem', fontSize = '0.75rem' }) => {
    const initials = (name ?? email ?? '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const hue = [...(name ?? email ?? '')].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%', flexShrink: 0,
            backgroundColor: `hsl(${hue} 55% 88%)`, color: `hsl(${hue} 55% 32%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize, fontWeight: '800', letterSpacing: '0.02em',
        }}>
            {initials}
        </div>
    );
};

const rolePalette = {
    admin:       { bg: 'hsl(214 100% 95%)', color: 'hsl(214 80% 42%)' },
    super_admin: { bg: 'hsl(270 60% 95%)',  color: 'hsl(270 60% 42%)' },
    agent:       { bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 32%)' },
    user:        { bg: 'hsl(220 15% 93%)',  color: 'hsl(220 15% 42%)' },
};

const RoleBadge = ({ role }) => {
    const key = (role ?? 'user').toLowerCase().replace(/\s+/g, '_');
    const cfg = rolePalette[key] ?? rolePalette.user;
    return (
        <span style={{
            fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.06em',
            padding: '0.18rem 0.5rem', borderRadius: '0.3rem',
            backgroundColor: cfg.bg, color: cfg.color,
        }}>
            {(role ?? 'User').toUpperCase()}
        </span>
    );
};

const StatusDot = ({ active }) => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
        fontSize: '0.68rem', fontWeight: '600', color: active ? 'hsl(152 60% 32%)' : 'hsl(220 15% 50%)',
    }}>
        <span style={{ width: '0.45rem', height: '0.45rem', borderRadius: '50%', backgroundColor: active ? 'hsl(152 60% 42%)' : 'hsl(220 15% 65%)', display: 'inline-block' }} />
        {active ? 'Active' : 'Inactive'}
    </span>
);

const formatDate = (val) => {
    if (!val) return null;
    try { return new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return val; }
};

// ── Confirm modal ─────────────────────────────────────────────────────────────

const ConfirmModal = ({ user, onConfirm, onCancel, loading }) => (
    <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        backgroundColor: 'hsl(220 25% 10% / 0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(3px)',
    }}
        onClick={onCancel}
    >
        <div
            onClick={e => e.stopPropagation()}
            style={{
                backgroundColor: 'white', borderRadius: '1rem',
                padding: '2rem', width: '100%', maxWidth: '420px', margin: '1rem',
                boxShadow: '0 24px 60px hsl(220 25% 10% / 0.2)',
            }}
        >
            {/* Warning header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', backgroundColor: 'hsl(40 90% 93%)', color: 'hsl(40 80% 40%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <ShieldAlertIcon />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 15%)', margin: '0 0 0.1rem' }}>Confirm Impersonation</h2>
                        <p style={{ fontSize: '0.75rem', color: 'hsl(220 15% 50%)', margin: 0 }}>This action is logged and auditable</p>
                    </div>
                </div>
                <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 55%)', padding: '0.25rem' }}>
                    <XIcon />
                </button>
            </div>

            {/* User preview */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.875rem',
                padding: '1rem', borderRadius: '0.75rem',
                backgroundColor: 'hsl(220 15% 97%)', border: '1px solid hsl(220 15% 91%)',
                marginBottom: '1.25rem',
            }}>
                <Avatar name={user.name} email={user.email} size="3rem" fontSize="0.85rem" />
                <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'hsl(220 25% 15%)' }}>{user.name ?? '—'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'hsl(220 15% 50%)', marginBottom: '0.3rem' }}>{user.email}</div>
                    <RoleBadge role={user.role} />
                </div>
            </div>

            {/* Warning note */}
            <div style={{
                fontSize: '0.78rem', color: 'hsl(40 70% 35%)',
                backgroundColor: 'hsl(40 90% 95%)', border: '1px solid hsl(40 70% 80%)',
                borderRadius: '0.5rem', padding: '0.65rem 0.85rem',
                marginBottom: '1.25rem', lineHeight: 1.5,
            }}>
                You will be logged in as this user. Any actions taken will appear as if performed by them. A log entry will be created.
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                    onClick={onCancel}
                    style={{
                        flex: 1, padding: '0.6rem', borderRadius: '0.6rem',
                        border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                        fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)',
                        cursor: 'pointer',
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    style={{
                        flex: 2, padding: '0.6rem', borderRadius: '0.6rem', border: 'none',
                        backgroundColor: loading ? 'hsl(220 25% 50%)' : 'hsl(220 25% 15%)',
                        color: 'white', fontSize: '0.85rem', fontWeight: '700',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    }}
                >
                    <UserSwitchIcon />
                    {loading ? 'Starting session…' : 'Impersonate User'}
                </button>
            </div>
        </div>
    </div>
);

// ── User row ──────────────────────────────────────────────────────────────────

const UserRow = ({ user, onSelect, hovered, onHover }) => (
    <tr
        onMouseEnter={() => onHover(user.id)}
        onMouseLeave={() => onHover(null)}
        style={{
            borderBottom: '1px solid hsl(220 15% 94%)',
            backgroundColor: hovered ? 'hsl(220 25% 98.5%)' : 'white',
            transition: 'background-color 0.12s',
        }}
    >
        {/* User */}
        <td style={{ padding: '0.875rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Avatar name={user.name} email={user.email} />
                <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 15%)' }}>
                        {user.name ?? '—'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 55%)' }}>{user.email}</div>
                </div>
            </div>
        </td>

        {/* Role */}
        <td style={{ padding: '0.875rem 1rem' }}>
            <RoleBadge role={user.role} />
        </td>

        {/* Status */}
        <td style={{ padding: '0.875rem 1rem' }}>
            <StatusDot active={user.is_active ?? true} />
        </td>

        {/* Last login */}
        <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'hsl(220 15% 45%)', whiteSpace: 'nowrap' }}>
            {formatDate(user.last_login_at) ?? '—'}
        </td>

        {/* Action */}
        <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
            <button
                onClick={() => onSelect(user)}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.42rem 0.85rem', borderRadius: '0.5rem', border: 'none',
                    fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer',
                    backgroundColor: hovered ? 'hsl(220 25% 15%)' : 'hsl(220 15% 93%)',
                    color: hovered ? 'white' : 'hsl(220 25% 30%)',
                    transition: 'all 0.15s',
                }}
            >
                <EyeIcon /> Impersonate
            </button>
        </td>
    </tr>
);

// ── Main ──────────────────────────────────────────────────────────────────────

const ROLES = ['all', 'user', 'agent', 'admin', 'super_admin'];

const Impersonate = ({ users = [] }) => {
    const [search, setSearch]         = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [sortField, setSortField]   = useState('name');
    const [sortDir, setSortDir]       = useState('asc');
    const [hoveredId, setHoveredId]   = useState(null);
    const [selected, setSelected]     = useState(null);
    const [loading, setLoading]       = useState(false);

    const toggleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
    };

    const filtered = users
        .filter(u => {
            const q = search.toLowerCase();
            const matchSearch = !q
                || u.name?.toLowerCase().includes(q)
                || u.email?.toLowerCase().includes(q);
            const matchRole = filterRole === 'all'
                || (u.role ?? 'user').toLowerCase().replace(/\s+/g, '_') === filterRole;
            return matchSearch && matchRole;
        })
        .sort((a, b) => {
            let av, bv;
            if (sortField === 'name')  { av = a.name ?? '';           bv = b.name ?? ''; }
            if (sortField === 'role')  { av = a.role ?? '';           bv = b.role ?? ''; }
            if (sortField === 'login') { av = a.last_login_at ?? '';  bv = b.last_login_at ?? ''; }
            const cmp = av < bv ? -1 : av > bv ? 1 : 0;
            return sortDir === 'asc' ? cmp : -cmp;
        });

    const handleConfirm = async () => {
        if (!selected) return;
        setLoading(true);
        try {
            await router.post(`/super-admin/impersonate/${selected.id}`);
        } finally {
            setLoading(false);
            setSelected(null);
        }
    };

    const SortTh = ({ field, label, align = 'left' }) => (
        <th
            onClick={() => toggleSort(field)}
            style={{
                padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: '700',
                letterSpacing: '0.07em', color: 'hsl(220 15% 45%)',
                textAlign: align, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
                borderBottom: '1px solid hsl(220 15% 91%)',
                backgroundColor: sortField === field ? 'hsl(220 25% 98%)' : 'hsl(220 15% 97%)',
            }}
        >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                {label}
                {sortField === field
                    ? <ChevronIcon dir={sortDir === 'asc' ? 'down' : 'up'} />
                    : <span style={{ opacity: 0.3 }}><ChevronIcon /></span>}
            </span>
        </th>
    );

    return (
        <>
            {selected && (
                <ConfirmModal
                    user={selected}
                    onConfirm={handleConfirm}
                    onCancel={() => setSelected(null)}
                    loading={loading}
                />
            )}

            <div>
                {/* Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'hsl(220 25% 15%)', margin: '0 0 0.2rem' }}>
                        Impersonate User
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                        Select a user to start an impersonation session. All sessions are logged.
                    </p>
                </div>

                {/* Warning banner */}
                <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    padding: '0.9rem 1.1rem', borderRadius: '0.75rem', marginBottom: '1.5rem',
                    backgroundColor: 'hsl(40 90% 95%)', border: '1px solid hsl(40 70% 80%)',
                }}>
                    <span style={{ color: 'hsl(40 80% 40%)', flexShrink: 0, marginTop: '0.05rem' }}><ShieldAlertIcon /></span>
                    <div style={{ fontSize: '0.82rem', color: 'hsl(40 70% 30%)', lineHeight: 1.5 }}>
                        <strong>Use with caution.</strong> Impersonating a user gives you full access to their account. Every session is recorded in the audit log with your admin ID, the target user, and a timestamp.
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
                            placeholder="Search by name or email…"
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
                        {ROLES.map(r => (
                            <button
                                key={r}
                                onClick={() => setFilterRole(r)}
                                style={{
                                    padding: '0.4rem 0.85rem', borderRadius: '999px', border: 'none',
                                    fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.04em', cursor: 'pointer',
                                    transition: 'all 0.15s',
                                    backgroundColor: filterRole === r ? 'hsl(220 25% 15%)' : 'hsl(220 15% 93%)',
                                    color: filterRole === r ? 'white' : 'hsl(220 15% 45%)',
                                }}
                            >
                                {r === 'all' ? 'All' : r.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
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
                    {filtered.length === 0 ? (
                        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'hsl(220 15% 55%)', fontSize: '0.9rem' }}>
                            No users match your filters.
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <SortTh field="name"  label="USER" />
                                    <SortTh field="role"  label="ROLE" />
                                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.07em', color: 'hsl(220 15% 45%)', borderBottom: '1px solid hsl(220 15% 91%)', backgroundColor: 'hsl(220 15% 97%)' }}>STATUS</th>
                                    <SortTh field="login" label="LAST LOGIN" />
                                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.07em', color: 'hsl(220 15% 45%)', textAlign: 'right', borderBottom: '1px solid hsl(220 15% 91%)', backgroundColor: 'hsl(220 15% 97%)' }}>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(user => (
                                    <UserRow
                                        key={user.id}
                                        user={user}
                                        onSelect={setSelected}
                                        hovered={hoveredId === user.id}
                                        onHover={setHoveredId}
                                    />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <p style={{ fontSize: '0.75rem', color: 'hsl(220 15% 55%)', marginTop: '0.875rem', textAlign: 'right' }}>
                    {filtered.length} of {users.length} user{users.length !== 1 ? 's' : ''} shown
                </p>
            </div>
        </>
    );
};

Impersonate.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default Impersonate;