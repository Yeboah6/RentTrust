import React, { useState, useRef, useMemo } from 'react';
import { router, usePage } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { useRefresh } from '@/Hooks/useRefresh';

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = ({ d, size = '1rem', sw = 1.8 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    search:  () => <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    trash:   () => <Ico d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" size="0.85rem" />,
    check:   () => <Ico d="M5 13l4 4L19 7" size="0.85rem" />,
    x:       () => <Ico d="M6 18L18 6M6 6l12 12" size="0.85rem" />,
    refresh:  () => <Ico d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" size="0.9rem" />,
    ban:     () => <Ico d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" size="0.85rem" />,
    unlock:  () => <Ico d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" size="0.85rem" />,
    users:   () => <Ico d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" size="1.15rem" />,
    user:    () => <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" size="1.15rem" />,
    checkC:  () => <Ico d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size="1.15rem" />,
    home:    () => <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" size="1.15rem" />,
    alert:   () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    chevD:   () => <Ico d="M19 9l-7 7-7-7" size="0.8rem" />,
    chevU:   () => <Ico d="M5 15l7-7 7 7" size="0.8rem" />,
    chevL:   () => <Ico d="M15 19l-7-7 7-7" size="0.8rem" />,
    chevR:   () => <Ico d="M9 5l7 7-7 7" size="0.8rem" />,
    plus:  () => <Ico d="M12 4v16m8-8H4" size="0.95rem" />,
    grid:  () => <Ico d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" size="0.9rem" />,
    list:  () => <Ico d="M4 6h16M4 10h16M4 14h16M4 18h16" size="0.9rem" />,
    spinner: () => (
        <svg style={{ width: '0.95rem', height: '0.95rem', animation: 'tnSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
    active:    { label: 'Active',    bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 28%)', dot: 'hsl(152 60% 38%)' },
    pending:   { label: 'Pending',   bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 30%)',  dot: 'hsl(40 80% 44%)' },
    suspended: { label: 'Suspended', bg: 'hsl(0 70% 95%)',   color: 'hsl(0 65% 40%)',   dot: 'hsl(0 65% 50%)' },
    inactive:  { label: 'Inactive',  bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)' },
    banned:    { label: 'Banned',    bg: 'hsl(0 70% 95%)',   color: 'hsl(0 65% 40%)',   dot: 'hsl(0 65% 50%)' },
};

const STATUSES  = ['all', 'active', 'pending', 'suspended', 'inactive', 'banned'];
const PAGE_SIZE = 12;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return v; }
};

const fmtRelative = (v) => {
    if (!v) return '—';
    try {
        const diff = Date.now() - new Date(v);
        if (diff < 60000)      return 'Just now';
        if (diff < 3600000)    return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000)   return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 2592000000) return `${Math.floor(diff / 86400000)}d ago`;
        return fmtDate(v);
    } catch { return v; }
};

const avatarHue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

const normalise = (t) => ({
    ...t,
    _id:             t.id,
    name:            t.name             ?? t.full_name       ?? '—',
    email:           t.email            ?? '',
    phone:           t.phone            ?? t.phone_number    ?? '',
    status_key:      (t.status          ?? 'active').toLowerCase(),
    location:        t.location         ?? t.city            ?? t.area ?? '',
    avatar:          t.avatar           ?? t.profile_photo   ?? null,
    joined_at:       t.joined_at        ?? t.created_at      ?? '',
    last_active:     t.last_active      ?? t.last_login_at   ?? '',
    inquiries_count: t.inquiries_count  ?? t.total_inquiries ?? 0,
    rentals_count:   t.rentals_count    ?? t.active_rentals  ?? 0,
    saved_count:     t.saved_count      ?? t.saved_listings  ?? 0,
});

// ─── Atoms ────────────────────────────────────────────────────────────────────

const StatusBadge = ({ sk }) => {
    const cfg = STATUS_CFG[sk] ?? STATUS_CFG.active;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.52rem', borderRadius: '999px', fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.06em', backgroundColor: cfg.bg, color: cfg.color, whiteSpace: 'nowrap' }}>
            <span style={{ width: '0.33rem', height: '0.33rem', borderRadius: '50%', backgroundColor: cfg.dot, flexShrink: 0 }} />
            {cfg.label.toUpperCase()}
        </span>
    );
};

const Kpi = ({ label, value, sub, accent, iconBg, iconColor, icon }) => (
    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
        <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.65rem', backgroundColor: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
        <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: accent, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'hsl(220 25% 22%)', marginTop: '0.1rem' }}>{label}</div>
            {sub && <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 55%)', marginTop: '0.05rem' }}>{sub}</div>}
        </div>
    </div>
);

const Toast = ({ toast }) => toast ? (
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'tnSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {toast.type === 'error' ? <Icons.x /> : <Icons.check />}{toast.msg}
    </div>
) : null;

// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination = ({ page, total, onChange }) => {
    if (total <= 1) return null;
    const pages = [];
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || Math.abs(i - page) <= 1) pages.push(i);
        else if (pages[pages.length - 1] !== '…') pages.push('…');
    }
    const btn = (content, onClick, active, disabled) => (
        <button onClick={onClick} disabled={disabled}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '2rem', height: '2rem', padding: '0 0.4rem', borderRadius: '0.45rem', border: `1px solid ${active ? 'hsl(220 25% 22%)' : 'hsl(220 15% 88%)'}`, backgroundColor: active ? 'hsl(220 25% 15%)' : 'white', color: active ? 'white' : disabled ? 'hsl(220 15% 65%)' : 'hsl(220 25% 28%)', fontSize: '0.8rem', fontWeight: active ? '700' : '500', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.15s', fontFamily: 'inherit' }}>
            {content}
        </button>
    );
    return (
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            {btn(<Icons.chevL />, () => onChange(page - 1), false, page === 1)}
            {pages.map((p, i) => p === '…'
                ? <span key={`e${i}`} style={{ fontSize: '0.8rem', color: 'hsl(220 15% 55%)', padding: '0 0.2rem' }}>…</span>
                : btn(p, () => onChange(p), p === page, false)
            )}
            {btn(<Icons.chevR />, () => onChange(page + 1), false, page === total)}
        </div>
    );
};

// ─── Action modal ─────────────────────────────────────────────────────────────

const ActionModal = ({ tenant, action, onConfirm, onClose, processing }) => {
    const hue  = avatarHue(tenant.name);
    const meta = {
        delete:     { label: 'Delete Tenant',    body: `Permanently delete ${tenant.name}? Their account and all inquiry data will be removed.`,    accent: 'hsl(0 65% 44%)',   accentBg: 'hsl(0 70% 95%)',   confirmBg: 'hsl(0 65% 50%)',   confirmLabel: 'Delete',     icon: Icons.trash,  warn: 'This action cannot be undone.' },
        suspend:    { label: 'Suspend Tenant',   body: `Suspend ${tenant.name}? They will lose access to the platform and cannot submit inquiries.`, accent: 'hsl(0 65% 44%)',   accentBg: 'hsl(0 70% 95%)',   confirmBg: 'hsl(0 65% 50%)',   confirmLabel: 'Suspend',    icon: Icons.ban,    warn: null },
        reactivate: { label: 'Reactivate Tenant',body: `Reactivate ${tenant.name}? They will regain full access to browse and contact landlords.`,   accent: 'hsl(152 55% 33%)', accentBg: 'hsl(152 55% 92%)', confirmBg: 'hsl(152 55% 33%)', confirmLabel: 'Reactivate', icon: Icons.unlock, warn: null },
    };
    const m          = meta[action] ?? meta.delete;
    const ActionIcon = m.icon;

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.6)', backdropFilter: 'blur(5px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '420px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.15rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.28)', animation: 'tnModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ height: '4px', background: `linear-gradient(90deg, ${m.accent}, ${m.accent}88)` }} />
                <div style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
                        <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.75rem', backgroundColor: m.accentBg, color: m.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ActionIcon /></div>
                        <div>
                            <h3 style={{ margin: '0 0 0.1rem', fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>{m.label}</h3>
                            <p style={{ margin: 0, fontSize: '0.73rem', color: 'hsl(220 15% 50%)' }}>#{tenant._id}</p>
                        </div>
                    </div>

                    {/* Tenant preview */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem 0.875rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 15% 97%)', border: '1px solid hsl(220 15% 91%)', marginBottom: '1rem' }}>
                        {tenant.avatar
                            ? <img src={tenant.avatar} alt="" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                            : <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 32%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800', flexShrink: 0 }}>
                                {tenant.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                              </div>
                        }
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'hsl(220 25% 14%)' }}>{tenant.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 52%)', marginTop: '0.15rem', display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <StatusBadge sk={tenant.status_key} />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tenant.email}</span>
                            </div>
                        </div>
                    </div>

                    <p style={{ margin: '0 0 0.875rem', fontSize: '0.83rem', color: 'hsl(220 15% 35%)', lineHeight: 1.65 }}>{m.body}</p>

                    {m.warn && (
                        <div style={{ padding: '0.6rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 65% 88%)', fontSize: '0.75rem', color: 'hsl(0 55% 38%)', marginBottom: '1.25rem' }}>
                            ⚠ {m.warn}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem' }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                        <button onClick={onConfirm} disabled={processing}
                            style={{ flex: 2, padding: '0.625rem', borderRadius: '0.6rem', border: 'none', backgroundColor: processing ? 'hsl(220 25% 55%)' : m.confirmBg, color: 'white', fontSize: '0.85rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit' }}>
                            {processing ? <><Icons.spinner />{m.confirmLabel}…</> : <><ActionIcon /> {m.confirmLabel}</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Tenant card (grid view) ──────────────────────────────────────────────────

const TenantCard = ({ tenant: t, index, onAction }) => {
    const [hov, setHov] = useState(false);
    const hue       = avatarHue(t.name);
    const stCfg     = STATUS_CFG[t.status_key] ?? STATUS_CFG.active;
    const isActive  = t.status_key === 'active';
    const isSusp    = t.status_key === 'suspended';

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ backgroundColor: 'white', border: `1.5px solid ${hov ? stCfg.dot : 'hsl(220 15% 91%)'}`, borderRadius: '1rem', overflow: 'hidden', transition: 'all 0.22s ease', transform: hov ? 'translateY(-3px)' : 'none', boxShadow: hov ? '0 16px 40px hsl(220 20% 15% / 0.1)' : '0 1px 4px hsl(220 20% 15% / 0.05)', display: 'flex', flexDirection: 'column', animation: `tnCardIn 0.35s ease ${Math.min(index, 15) * 0.04}s both` }}>

            <div style={{ height: '3px', background: `linear-gradient(90deg, ${stCfg.dot}, ${stCfg.dot}55)` }} />

            <div style={{ padding: '1.1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {/* Avatar + name */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    {t.avatar
                        ? <img src={t.avatar} alt="" style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${stCfg.bg}`, flexShrink: 0 }} />
                        : <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '900', border: `2px solid ${stCfg.bg}`, flexShrink: 0 }}>
                            {t.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                          </div>
                    }
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'hsl(220 25% 13%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.25rem' }}>
                            {t.name}
                        </div>
                        <StatusBadge sk={t.status_key} />
                    </div>
                </div>

                {/* Contact */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{ fontSize: '0.73rem', color: 'hsl(220 15% 45%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>✉ {t.email || '—'}</div>
                    {t.phone    && <div style={{ fontSize: '0.73rem', color: 'hsl(220 15% 45%)' }}>📞 {t.phone}</div>}
                    {t.location && <div style={{ fontSize: '0.73rem', color: 'hsl(220 15% 45%)' }}>📍 {t.location}</div>}
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.45rem' }}>
                    {[
                        { v: t.inquiries_count, l: 'Inquiries' },
                        { v: t.rentals_count,   l: 'Rentals' },
                        { v: t.saved_count,     l: 'Saved' },
                    ].map(({ v, l }) => (
                        <div key={l} style={{ textAlign: 'center', padding: '0.45rem 0.2rem', borderRadius: '0.5rem', backgroundColor: 'hsl(220 15% 97.5%)', border: '1px solid hsl(220 15% 93%)' }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: '900', color: 'hsl(220 25% 14%)', lineHeight: 1 }}>{v ?? 0}</div>
                            <div style={{ fontSize: '0.58rem', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'hsl(220 15% 55%)', marginTop: '0.15rem' }}>{l}</div>
                        </div>
                    ))}
                </div>

                {/* Joined */}
                <div style={{ fontSize: '0.68rem', color: 'hsl(220 15% 55%)' }}>
                    Joined {fmtDate(t.joined_at)}
                    {t.last_active && <span> · Active {fmtRelative(t.last_active)}</span>}
                </div>
            </div>

            {/* Card footer */}
            <div style={{ padding: '0.65rem 1rem', borderTop: '1px solid hsl(220 15% 95%)', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                {isActive && (
                    <button onClick={() => onAction(t, 'suspend')}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', height: '1.9rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 46%)', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                        <Icons.ban /> Suspend
                    </button>
                )}
                {isSusp && (
                    <button onClick={() => onAction(t, 'reactivate')}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', height: '1.9rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(152 55% 92%)', color: 'hsl(152 55% 30%)', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                        <Icons.unlock /> Reactivate
                    </button>
                )}
                <button onClick={() => onAction(t, 'delete')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '1.9rem', height: '1.9rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 48%)', cursor: 'pointer', transition: 'filter 0.15s', fontFamily: 'inherit', marginLeft: 'auto', flexShrink: 0 }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.trash />
                </button>
            </div>
        </div>
    );
};

// ─── Tenant row (list view) ───────────────────────────────────────────────────

const TenantRow = ({ tenant: t, index, onAction }) => {
    const [hov, setHov]  = useState(false);
    const hue            = avatarHue(t.name);
    const isActive       = t.status_key === 'active';
    const isSusp         = t.status_key === 'suspended';

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ display: 'grid', gridTemplateColumns: '2.75rem minmax(0,1fr) 10rem 7rem 7rem 7rem 7rem auto', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', borderBottom: '1px solid hsl(220 15% 95%)', backgroundColor: hov ? 'hsl(220 20% 98.5%)' : 'white', transition: 'background-color 0.12s', animation: `tnRowIn 0.3s ease ${Math.min(index, 15) * 0.025}s both` }}>

            {/* Avatar */}
            {t.avatar
                ? <img src={t.avatar} alt="" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                : <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '800', flexShrink: 0 }}>
                    {t.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                  </div>
            }

            {/* Name + email */}
            <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'hsl(220 25% 14%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.18rem' }}>{t.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 52%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.email}</div>
                {t.phone && <div style={{ fontSize: '0.68rem', color: 'hsl(220 15% 58%)' }}>{t.phone}</div>}
            </div>

            {/* Location */}
            <div style={{ fontSize: '0.78rem', color: 'hsl(220 25% 28%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.location || '—'}</div>

            {/* Status */}
            <div><StatusBadge sk={t.status_key} /></div>

            {/* Inquiries */}
            <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>{t.inquiries_count ?? 0}</div>
                <div style={{ fontSize: '0.62rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'hsl(220 15% 55%)' }}>inquiries</div>
            </div>

            {/* Rentals */}
            <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>{t.rentals_count ?? 0}</div>
                <div style={{ fontSize: '0.62rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'hsl(220 15% 55%)' }}>rentals</div>
            </div>

            {/* Joined */}
            <div>
                <div style={{ fontSize: '0.73rem', fontWeight: '600', color: 'hsl(220 25% 22%)' }}>{fmtDate(t.joined_at)}</div>
                {t.last_active && <div style={{ fontSize: '0.65rem', color: 'hsl(220 15% 55%)' }}>Active {fmtRelative(t.last_active)}</div>}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.3rem' }}>
                {isActive && (
                    <button onClick={() => onAction(t, 'suspend')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.38rem 0.55rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 48%)', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                        <Icons.ban /> Suspend
                    </button>
                )}
                {isSusp && (
                    <button onClick={() => onAction(t, 'reactivate')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.38rem 0.55rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(152 55% 92%)', color: 'hsl(152 55% 30%)', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                        <Icons.unlock /> Reactivate
                    </button>
                )}
                <button onClick={() => onAction(t, 'delete')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 48%)', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.trash />
                </button>
            </div>
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const TenantsIndex = ({ tenants: rawTenants = [] }) => {
    const tenants = useMemo(() => rawTenants.map(normalise), [rawTenants]);
    // const { tenants: pageTenants = [] } = usePage().props;

    const [search,     setSearch]     = useState('');
    const [status,     setStatus]     = useState('all');
    const [sortCol,    setSortCol]    = useState('joined_at');
    const [sortDir,    setSortDir]    = useState('desc');
    const [viewMode,   setViewMode]   = useState('grid');
    const [page,       setPage]       = useState(1);
    const [modal,      setModal]      = useState(null);
    const [processing, setProcessing] = useState(false);
    const [toast,      setToast]      = useState(null);
    const [refreshing,   refresh]   = useRefresh(['tenants']);
    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return tenants
            .filter(t => {
                const okQ  = !q || t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || (t.phone ?? '').includes(q) || (t.location ?? '').toLowerCase().includes(q);
                const okSt = status === 'all' || t.status_key === status;
                return okQ && okSt;
            })
            .sort((a, b) => {
                let av = a[sortCol], bv = b[sortCol];
                if (['joined_at', 'last_active'].includes(sortCol)) { av = new Date(av || 0); bv = new Date(bv || 0); }
                if (['inquiries_count', 'rentals_count', 'saved_count'].includes(sortCol)) { av = Number(av || 0); bv = Number(bv || 0); }
                if (typeof av === 'string') av = av.toLowerCase();
                if (typeof bv === 'string') bv = bv.toLowerCase();
                return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
            });
    }, [tenants, search, status, sortCol, sortDir]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleAction = (tenant, action) => setModal({ tenant, action });

    const confirmAction = () => {
        const { tenant, action } = modal;
        setProcessing(true);
        const routeMap = {
            suspend:    { method: 'post',   url: `/super-admin/tenants/${tenant._id}/suspend` },
            reactivate: { method: 'post',   url: `/super-admin/tenants/${tenant._id}/reactivate` },
            delete:     { method: 'delete', url: `/super-admin/tenants/${tenant._id}` },
        };
        const { method, url } = routeMap[action];
        router[method](url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                const past = action === 'reactivate' ? 'reactivated' : action === 'delete' ? 'deleted' : 'suspended';
                showToast(`"${tenant.name}" ${past} successfully.`);
                setModal(null);
                router.reload({ only: ['tenants'] });
            },
            onError:  () => showToast('Action failed. Please try again.', 'error'),
            onFinish: () => setProcessing(false),
        });
    };

    // KPIs
    const activeCount    = tenants.filter(t => t.status_key === 'active').length;
    const suspendedCount = tenants.filter(t => t.status_key === 'suspended').length;
    const totalInquiries = tenants.reduce((s, t) => s + (t.inquiries_count ?? 0), 0);

    const SortBtn = ({ col, label }) => {
        const active = sortCol === col;
        return (
            <button onClick={() => { if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortCol(col); setSortDir('desc'); } setPage(1); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: active ? 'hsl(220 25% 20%)' : 'hsl(220 15% 48%)', padding: 0, fontFamily: 'inherit' }}>
                {label}{active ? (sortDir === 'asc' ? <Icons.chevU /> : <Icons.chevD />) : <Icons.chevD />}
            </button>
        );
    };

    return (
        <>
            <Toast toast={toast} />
            {modal && (
                <ActionModal
                    tenant={modal.tenant}
                    action={modal.action}
                    onConfirm={confirmAction}
                    onClose={() => setModal(null)}
                    processing={processing}
                />
            )}

            <div>
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.22rem', letterSpacing: '-0.02em' }}>Tenants</h1>
                        <p style={{ fontSize: '0.82rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                            {tenants.length.toLocaleString()} registered · {activeCount} active · {suspendedCount} suspended
                        </p>
                    </div>

                    <button onClick={refresh} disabled={refreshing}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 28%)', fontWeight: '600', fontSize: '0.83rem', cursor: refreshing ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background-color 0.15s' }}
                        onMouseEnter={e => { if (!refreshing) e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'; }}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                        {refreshing ? <><Icons.spinner /> Refreshing…</> : <><Icons.refresh /> Refresh</>}
                    </button>
                </div>

                {/* ── KPI strip ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <Kpi label="Total Tenants"  value={tenants.length.toLocaleString()}  sub="Registered accounts"  accent="hsl(220 25% 15%)"  iconBg="hsl(220 20% 93%)"   iconColor="hsl(220 25% 30%)" icon={<Icons.users />} />
                    <Kpi label="Active"          value={activeCount.toLocaleString()}      sub="Can browse & enquire" accent="hsl(152 55% 33%)"  iconBg="hsl(152 55% 92%)"  iconColor="hsl(152 55% 35%)" icon={<Icons.checkC />} />
                    <Kpi label="Suspended"       value={suspendedCount.toLocaleString()}   sub="Restricted access"    accent="hsl(0 65% 44%)"    iconBg="hsl(0 70% 95%)"    iconColor="hsl(0 65% 44%)"   icon={<Icons.ban />} />
                    <Kpi label="Total Inquiries" value={totalInquiries.toLocaleString()}   sub="Across all tenants"   accent="hsl(214 80% 46%)"  iconBg="hsl(214 100% 95%)" iconColor="hsl(214 80% 46%)" icon={<Icons.home />} />
                </div>

                {/* ── Toolbar ── */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '0.875rem 1.1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>

                        {/* Search */}
                        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 0 }}>
                            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)', pointerEvents: 'none', display: 'flex' }}><Icons.search /></span>
                            <input type="text" placeholder="Search name, email, phone, location…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                                style={{ width: '100%', padding: '0.52rem 0.75rem 0.52rem 2.25rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.55rem', fontSize: '0.855rem', color: 'hsl(220 25% 18%)', backgroundColor: 'hsl(220 15% 98.5%)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                                onFocus={e => e.target.style.borderColor = 'hsl(220 60% 60%)'}
                                onBlur={e => e.target.style.borderColor = 'hsl(220 15% 88%)'} />
                        </div>

                        {/* Sort dropdown (list view only) */}
                        {viewMode === 'list' && (
                            <select value={`${sortCol}:${sortDir}`} onChange={e => { const [c, d] = e.target.value.split(':'); setSortCol(c); setSortDir(d); setPage(1); }}
                                style={{ padding: '0.52rem 0.875rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.55rem', fontSize: '0.82rem', backgroundColor: 'white', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', color: 'hsl(220 25% 22%)' }}>
                                <option value="joined_at:desc">Newest first</option>
                                <option value="joined_at:asc">Oldest first</option>
                                <option value="name:asc">Name A–Z</option>
                                <option value="inquiries_count:desc">Most inquiries</option>
                                <option value="rentals_count:desc">Most rentals</option>
                                <option value="last_active:desc">Recently active</option>
                            </select>
                        )}

                        {(search || status !== 'all') && (
                            <button onClick={() => { setSearch(''); setStatus('all'); setPage(1); }}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.7rem', borderRadius: '999px', border: '1px solid hsl(220 15% 86%)', backgroundColor: 'hsl(220 15% 96%)', color: 'hsl(220 15% 44%)', fontSize: '0.73rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                                <Icons.x /> Clear
                            </button>
                        )}

                        {/* Grid / list toggle */}
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.2rem', backgroundColor: 'hsl(220 15% 96%)', borderRadius: '0.5rem', padding: '0.2rem', flexShrink: 0 }}>
                            {[['grid', '⊞'], ['list', '☰']].map(([v, lbl]) => (
                                <button key={v} onClick={() => { setViewMode(v); setPage(1); }}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem 0.6rem', borderRadius: '0.35rem', border: 'none', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.15s', backgroundColor: viewMode === v ? 'white' : 'transparent', color: viewMode === v ? 'hsl(220 25% 18%)' : 'hsl(220 15% 55%)', boxShadow: viewMode === v ? '0 1px 3px hsl(220 20% 15% / 0.1)' : 'none' }}>
                                    {lbl}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status pills */}
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {STATUSES.map(s => {
                            const a   = status === s;
                            const cfg = STATUS_CFG[s];
                            const cnt = s === 'all' ? tenants.length : tenants.filter(t => t.status_key === s).length;
                            return (
                                <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                                    style={{ padding: '0.3rem 0.65rem', borderRadius: '999px', border: `1.5px solid ${a ? (cfg?.dot ?? 'hsl(220 25% 22%)') : 'hsl(220 15% 88%)'}`, fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', backgroundColor: a ? (cfg?.bg ?? 'hsl(220 25% 15%)') : 'transparent', color: a ? (cfg?.color ?? 'white') : 'hsl(220 15% 48%)' }}>
                                    {s === 'all' ? `All (${cnt})` : `${cfg?.label ?? s} (${cnt})`}
                                </button>
                            );
                        })}
                        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'hsl(220 15% 52%)' }}>
                            {filtered.length.toLocaleString()} result{filtered.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {/* ── Content ── */}
                {paginated.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px dashed hsl(220 15% 86%)' }}>
                        <div style={{ fontSize: '2.75rem', marginBottom: '0.875rem' }}>👤</div>
                        <p style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: '700', color: 'hsl(220 25% 22%)' }}>{search ? 'No tenants found' : 'No tenants yet'}</p>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'hsl(220 15% 55%)' }}>{search ? 'Try a different search or filter.' : 'Tenants who sign up will appear here.'}</p>
                    </div>

                ) : viewMode === 'grid' ? (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1rem' }}>
                            {paginated.map((t, i) => <TenantCard key={t._id} tenant={t} index={i} onAction={handleAction} />)}
                        </div>
                        <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(220 15% 50%)' }}>Page <strong>{page}</strong> of <strong>{totalPages}</strong></p>
                            <Pagination page={page} total={totalPages} onChange={setPage} />
                        </div>
                    </>

                ) : (
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2.75rem minmax(0,1fr) 10rem 7rem 7rem 7rem 7rem auto', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1.25rem', backgroundColor: 'hsl(220 15% 97.5%)', borderBottom: '1px solid hsl(220 15% 92%)' }}>
                            <div />
                            <div><SortBtn col="name"            label="Tenant" /></div>
                            <div><SortBtn col="location"        label="Location" /></div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Status</div>
                            <div><SortBtn col="inquiries_count" label="Inquiries" /></div>
                            <div><SortBtn col="rentals_count"   label="Rentals" /></div>
                            <div><SortBtn col="joined_at"       label="Joined" /></div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Actions</div>
                        </div>

                        {paginated.map((t, i) => <TenantRow key={t._id} tenant={t} index={i} onAction={handleAction} />)}

                        <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'hsl(220 15% 98.5%)' }}>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(220 15% 50%)' }}>
                                Page <strong style={{ color: 'hsl(220 25% 22%)' }}>{page}</strong> of <strong style={{ color: 'hsl(220 25% 22%)' }}>{totalPages}</strong> · {filtered.length.toLocaleString()} result{filtered.length !== 1 ? 's' : ''}
                            </p>
                            <Pagination page={page} total={totalPages} onChange={setPage} />
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes tnSpin    { to { transform: rotate(360deg); } }
                @keyframes tnSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes tnModalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes tnCardIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
                @keyframes tnRowIn   { from { opacity:0; transform:translateX(-4px); } to { opacity:1; transform:translateX(0); } }
            `}</style>
        </>
    );
};

TenantsIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default TenantsIndex;