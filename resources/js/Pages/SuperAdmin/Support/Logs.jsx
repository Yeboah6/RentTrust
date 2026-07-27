import React, { useState, useRef, useMemo } from 'react';
import { router, Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = ({ d, size = '1rem', sw = 1.75 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    search:   () => <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    download: () => <Ico d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    refresh:  () => <Ico d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" size="0.9rem" />,
    check:    () => <Ico d="M5 13l4 4L19 7" size="0.85rem" />,
    checkCircle:() => <Ico d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size="1.1rem" />,
    xCircle:  () => <Ico d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" size="1.1rem" />,
    alert:    () => <Ico d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size="1.1rem" />,
    shield:   () => <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" size="1.1rem" />,
    creditCard:() => <Ico d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" size="1.1rem" />,
    user:     () => <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" size="1.1rem" />,
    tag:      () => <Ico d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" size="1.1rem" />,
    settings: () => <Ico d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" size="1.1rem" />,
    x:        () => <Ico d="M6 18L18 6M6 6l12 12" size="0.9rem" />,
    filter:   () => <Ico d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" size="0.9rem" />,
    chevL:    () => <Ico d="M15 19l-7-7 7-7" size="0.85rem" />,
    chevR:    () => <Ico d="M9 5l7 7-7 7" size="0.85rem" />,
    eye:      () => <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} size="0.9rem" />,
    spinner:  () => (
        <svg style={{ width: '0.9rem', height: '0.9rem', animation: 'auditSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Action type config ───────────────────────────────────────────────────────

const ACTION_TYPES = {
    payment:      { label: 'Payment',      bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 30%)', dot: 'hsl(152 60% 40%)', icon: Icons.creditCard },
    refund:       { label: 'Refund',       bg: 'hsl(40 90% 93%)',   color: 'hsl(40 80% 33%)',  dot: 'hsl(40 80% 48%)',  icon: Icons.refresh },
    subscription: { label: 'Subscription', bg: 'hsl(214 100% 95%)', color: 'hsl(214 80% 40%)', dot: 'hsl(214 80% 52%)', icon: Icons.tag },
    suspension:   { label: 'Suspension',   bg: 'hsl(0 70% 95%)',    color: 'hsl(0 65% 42%)',   dot: 'hsl(0 65% 52%)',   icon: Icons.xCircle },
    listing:      { label: 'Listing',      bg: 'hsl(270 60% 95%)',  color: 'hsl(270 60% 40%)', dot: 'hsl(270 60% 52%)', icon: Icons.tag },
    verification: { label: 'Verification', bg: 'hsl(190 65% 93%)',  color: 'hsl(190 60% 30%)', dot: 'hsl(190 60% 42%)', icon: Icons.checkCircle },
    report:       { label: 'Report',       bg: 'hsl(340 70% 95%)',  color: 'hsl(340 65% 40%)', dot: 'hsl(340 65% 52%)', icon: Icons.alert },
    user:         { label: 'User',         bg: 'hsl(248 65% 95%)',  color: 'hsl(248 60% 40%)', dot: 'hsl(248 60% 52%)', icon: Icons.user },
    settings:     { label: 'Settings',     bg: 'hsl(220 15% 93%)',  color: 'hsl(220 15% 40%)', dot: 'hsl(220 15% 54%)', icon: Icons.settings },
    security:     { label: 'Security',     bg: 'hsl(16 90% 94%)',   color: 'hsl(16 80% 36%)',  dot: 'hsl(16 80% 50%)',  icon: Icons.shield },
};

const getActionCfg = (type) => ACTION_TYPES[(type ?? '').toLowerCase()] ?? ACTION_TYPES.settings;

// ─── Normalise incoming data ──────────────────────────────────────────────────

const normalise = (logs, activity) => {
    const safeLogs     = logs     ?? [];
    const safeActivity = activity ?? [];

    const mappedActivity = safeActivity.map((item, i) => {

        const title        = item.title ?? item.action ?? item.event ?? '—';
            const affectedUser = item.affected_user
                ?? item.affectedUser
                ?? item.subject_name
                ?? (item.title?.includes('—') ? item.title.split('—').pop()?.trim() : null)
                ?? '—';
            const statusType = item.status === 'failed' ? 'suspension'
                : item.status === 'pending' ? 'payment'
                : item.status === 'success' ? 'payment'
                : null;
            return {
                id:            item.id ?? i + 1,
                admin:         item.admin ?? item.causer_name ?? item.admin_name ?? 'Admin',
                admin_email:   item.admin_email ?? item.causer_email ?? '',
                action:        title,
                type:          item.type ?? statusType ?? 'payment',
                affected_user: affectedUser,
                affected_id:   item.affected_id ?? item.subject_id ?? null,
                timestamp:     item.timestamp ?? item.created_at ?? item.time ?? '',
                notes:         item.notes ?? item.description ?? item.properties ?? '',
                ip:            item.ip ?? item.ip_address ?? '',
            };
        });

    return [...safeLogs, ...mappedActivity];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return v; }
};

const fmtTime = (v) => {
    if (!v) return '';
    try { return new Date(v).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); }
    catch { return ''; }
};

const avatarHue = (name = '') => [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

const isToday = (v) => {
    if (!v) return false;
    try { return new Date(v).toDateString() === new Date().toDateString(); }
    catch { return false; }
};

const isWithinDays = (v, days) => {
    if (!v) return false;
    try { return (Date.now() - new Date(v)) < days * 86400000; }
    catch { return false; }
};

const PAGE_SIZE = 10;

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ toast }) => toast ? (
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'auditSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {toast.type === 'error' ? <Icons.x /> : <Icons.check />}
        {toast.msg}
    </div>
) : null;

// ─── Action type badge ────────────────────────────────────────────────────────

const TypeBadge = ({ type }) => {
    const cfg = getActionCfg(type);
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', padding: '0.2rem 0.55rem', borderRadius: '999px', fontSize: '0.63rem', fontWeight: '800', letterSpacing: '0.06em', backgroundColor: cfg.bg, color: cfg.color, whiteSpace: 'nowrap' }}>
            <span style={{ width: '0.33rem', height: '0.33rem', borderRadius: '50%', backgroundColor: cfg.dot, flexShrink: 0 }} />
            {cfg.label.toUpperCase()}
        </span>
    );
};

// ─── Log detail drawer ────────────────────────────────────────────────────────

const DetailDrawer = ({ log, onClose }) => {
    if (!log) return null;
    const cfg = getActionCfg(log.type);
    const TypeIcon = cfg.icon;
    const hue = avatarHue(log.admin);

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', justifyContent: 'flex-end', backgroundColor: 'hsl(222 28% 8% / 0.45)', backdropFilter: 'blur(4px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '440px', height: '100%', backgroundColor: 'white', boxShadow: '-20px 0 60px hsl(220 28% 6% / 0.18)', display: 'flex', flexDirection: 'column', animation: 'auditDrawerIn 0.25s cubic-bezier(0.16,1,0.3,1)' }}>

                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))', padding: '1.5rem 1.75rem', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.07) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', backgroundColor: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <TypeIcon />
                            </div>
                            <div>
                                <h2 style={{ margin: '0 0 0.2rem', fontSize: '0.975rem', fontWeight: '800', color: 'white', lineHeight: 1.2 }}>{log.action}</h2>
                                <p style={{ margin: 0, fontSize: '0.72rem', color: 'hsl(220 20% 58%)' }}>Audit Entry #{log.id}</p>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 20% 55%)', padding: '0.2rem', display: 'flex', transition: 'color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'hsl(220 20% 55%)'}>
                            <Icons.x />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>

                    {/* Admin who performed action */}
                    <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'hsl(220 20% 97.5%)', border: '1px solid hsl(220 15% 91%)', marginBottom: '1.25rem' }}>
                        <p style={{ margin: '0 0 0.65rem', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)' }}>Performed By</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', flexShrink: 0, backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 32%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800' }}>
                                {log.admin.split(' ').map(w => w[0]).slice(0, 2).join('')}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'hsl(220 25% 15%)' }}>{log.admin}</div>
                                {log.admin_email && <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 52%)' }}>{log.admin_email}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Details grid */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        {[
                            { label: 'Action',         value: log.action,        mono: false },
                            { label: 'Type',           value: <TypeBadge type={log.type} />, mono: false, isNode: true },
                            { label: 'Affected User',  value: log.affected_user, mono: false },
                            { label: 'User / Entity ID', value: log.affected_id ? `#${log.affected_id}` : '—', mono: true },
                            { label: 'Date',           value: fmtDate(log.timestamp), mono: false },
                            { label: 'Time',           value: fmtTime(log.timestamp) || '—', mono: false },
                            { label: 'IP Address',     value: log.ip || '—',       mono: true },
                        ].map(({ label, value, mono, isNode }) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid hsl(220 15% 94%)' }}>
                                <span style={{ fontSize: '0.75rem', color: 'hsl(220 15% 52%)', fontWeight: '500' }}>{label}</span>
                                {isNode ? value : (
                                    <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'hsl(220 25% 20%)', fontFamily: mono ? 'monospace' : 'inherit', textAlign: 'right', maxWidth: '55%', wordBreak: 'break-word' }}>{value}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Notes */}
                    <div>
                        <p style={{ margin: '0 0 0.5rem', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)' }}>Notes</p>
                        <div style={{ padding: '0.875rem', borderRadius: '0.6rem', backgroundColor: 'hsl(220 20% 97.5%)', border: '1px solid hsl(220 15% 91%)', fontSize: '0.83rem', color: 'hsl(220 15% 35%)', lineHeight: 1.65 }}>
                            {log.notes || <span style={{ fontStyle: 'italic', color: 'hsl(220 15% 60%)' }}>No notes recorded.</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── KPI card ─────────────────────────────────────────────────────────────────

const Kpi = ({ label, value, sub, accent, iconBg, iconColor, icon }) => (
    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
        <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.65rem', backgroundColor: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
        <div>
            <div style={{ fontSize: '1.55rem', fontWeight: '900', color: accent, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'hsl(220 25% 22%)', marginTop: '0.1rem' }}>{label}</div>
            {sub && <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 55%)', marginTop: '0.05rem' }}>{sub}</div>}
        </div>
    </div>
);

// ─── Input helpers ────────────────────────────────────────────────────────────

const iStyle = (focused) => ({
    width: '100%', padding: '0.52rem 0.875rem',
    border: `1.5px solid ${focused ? 'hsl(220 60% 55%)' : 'hsl(220 15% 88%)'}`,
    borderRadius: '0.55rem', fontSize: '0.855rem', color: 'hsl(220 25% 16%)',
    backgroundColor: focused ? 'white' : 'hsl(220 15% 98.5%)', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
    boxShadow: focused ? '0 0 0 3px hsl(220 60% 55% / 0.1)' : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s, background-color 0.15s',
});

const FocusInput = ({ prefix, ...props }) => {
    const [f, setF] = useState(false);
    return (
        <div style={{ position: 'relative' }}>
            {prefix && <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)', pointerEvents: 'none', display: 'flex' }}>{prefix}</span>}
            <input {...props} onFocus={() => setF(true)} onBlur={() => setF(false)} style={{ ...iStyle(f), paddingLeft: prefix ? '2.25rem' : '0.875rem' }} />
        </div>
    );
};

const FocusSelect = ({ children, ...props }) => {
    const [f, setF] = useState(false);
    return (
        <select {...props} onFocus={() => setF(true)} onBlur={() => setF(false)}
            style={{ ...iStyle(f), appearance: 'none', cursor: 'pointer' }}>
            {children}
        </select>
    );
};

// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination = ({ page, totalPages, onChange }) => {
    if (totalPages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
        else if (pages[pages.length - 1] !== '…') pages.push('…');
    }
    return (
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            <button onClick={() => onChange(page - 1)} disabled={page === 1}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.45rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? 'hsl(220 15% 65%)' : 'hsl(220 25% 25%)', transition: 'all 0.15s' }}>
                <Icons.chevL />
            </button>
            {pages.map((p, i) => (
                p === '…'
                    ? <span key={`e${i}`} style={{ fontSize: '0.8rem', color: 'hsl(220 15% 55%)', padding: '0 0.2rem' }}>…</span>
                    : <button key={p} onClick={() => onChange(p)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.45rem', border: `1px solid ${page === p ? 'hsl(220 25% 22%)' : 'hsl(220 15% 88%)'}`, backgroundColor: page === p ? 'hsl(220 25% 15%)' : 'white', color: page === p ? 'white' : 'hsl(220 25% 25%)', fontSize: '0.82rem', fontWeight: page === p ? '700' : '500', cursor: 'pointer', transition: 'all 0.15s' }}>
                        {p}
                    </button>
            ))}
            <button onClick={() => onChange(page + 1)} disabled={page === totalPages}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '0.45rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? 'hsl(220 15% 65%)' : 'hsl(220 25% 25%)', transition: 'all 0.15s' }}>
                <Icons.chevR />
            </button>
        </div>
    );
};

// ─── Log row ──────────────────────────────────────────────────────────────────

const LogRow = ({ log, index, onView }) => {
    const [hov, setHov] = useState(false);
    const cfg = getActionCfg(log.type);
    const TypeIcon = cfg.icon;
    const hue = avatarHue(log.admin || 'Unknown');

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ display: 'grid', gridTemplateColumns: '14rem 1fr 12rem 11rem 8rem auto', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.25rem', borderBottom: '1px solid hsl(220 15% 95%)', backgroundColor: hov ? 'hsl(220 20% 98.5%)' : 'white', transition: 'background-color 0.12s', animation: `auditRowIn 0.3s ease ${Math.min(index, 15) * 0.03}s both`, cursor: 'default' }}>

            {/* Admin */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                <div style={{ width: '2.1rem', height: '2.1rem', borderRadius: '50%', flexShrink: 0, backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 32%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: '800' }}>
                    {(log.admin || '?').split(' ').map(w => w[0]).slice(0, 2).join('')}
                </div>
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'hsl(220 25% 15%)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.admin || 'Unknown'}</div>
                    {log.admin_email && <div style={{ fontSize: '0.67rem', color: 'hsl(220 15% 55%)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.admin_email}</div>}
                </div>
            </div>

            {/* Action + badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TypeIcon />
                </div>
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.83rem', fontWeight: '700', color: 'hsl(220 25% 14%)', marginBottom: '0.18rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.action}</div>
                    <TypeBadge type={log.type} />
                </div>
            </div>

            {/* Affected user */}
            <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'hsl(220 25% 20%)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.affected_user}</div>
                {log.affected_id && <div style={{ fontFamily: 'monospace', fontSize: '0.67rem', color: 'hsl(214 80% 46%)', backgroundColor: 'hsl(214 100% 96%)', padding: '0.05rem 0.3rem', borderRadius: '0.25rem', display: 'inline-block', marginTop: '0.15rem' }}>#{log.affected_id}</div>}
            </div>

            {/* Timestamp */}
            <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'hsl(220 25% 22%)' }}>{fmtDate(log.timestamp)}</div>
                <div style={{ fontSize: '0.68rem', color: 'hsl(220 15% 55%)', marginTop: '0.1rem' }}>{fmtTime(log.timestamp)}</div>
            </div>

            {/* IP */}
            <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'hsl(220 15% 50%)', whiteSpace: 'nowrap' }}>{log.ip || '—'}</div>

            {/* View button */}
            <button onClick={() => onView(log)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.65rem', borderRadius: '0.45rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.73rem', fontWeight: '700', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsl(220 20% 96%)'; e.currentTarget.style.borderColor = 'hsl(220 15% 78%)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'; }}>
                <Icons.eye /> View
            </button>
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const AuditLog = ({ logs: rawLogs, activity }) => {
    const allLogs = useMemo(
        () => normalise(rawLogs ?? [], activity ?? []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        [rawLogs, activity]
    );

    const [search,       setSearch]       = useState('');
    const [typeFilter,   setTypeFilter]   = useState('all');
    const [adminFilter,  setAdminFilter]  = useState('all');
    const [dateFilter,   setDateFilter]   = useState('all');
    const [page,         setPage]         = useState(1);
    const [detail,       setDetail]       = useState(null);
    const [refreshing,   setRefreshing]   = useState(false);
    const [toast,        setToast]        = useState(null);
    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3000);
    };

    // Reset to page 1 on any filter change
    const setFilterAndReset = (fn) => (...args) => { fn(...args); setPage(1); };

    const admins = useMemo(() => [...new Set(allLogs.map(l => l.admin || 'Unknown'))].sort(), [allLogs]);

    const filtered = useMemo(() => allLogs.filter(log => {
        const q = search.toLowerCase();
        const okSearch = !q
            || (log.admin || '').toLowerCase().includes(q)
            || log.action.toLowerCase().includes(q)
            || (log.affected_user ?? '').toLowerCase().includes(q)
            || (log.notes ?? '').toLowerCase().includes(q)
            || (log.ip ?? '').includes(q);
        const okType  = typeFilter  === 'all' || log.type === typeFilter;
        const okAdmin = adminFilter === 'all' || (log.admin || '') === adminFilter;
        const okDate  = dateFilter  === 'all'
            || (dateFilter === 'today' && isToday(log.timestamp))
            || (dateFilter === 'week'  && isWithinDays(log.timestamp, 7))
            || (dateFilter === 'month' && isWithinDays(log.timestamp, 30));
        return okSearch && okType && okAdmin && okDate;
    }), [allLogs, search, typeFilter, adminFilter, dateFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageLogs   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const clearFilters = () => { setSearch(''); setTypeFilter('all'); setAdminFilter('all'); setDateFilter('all'); setPage(1); };
    const hasFilters = search || typeFilter !== 'all' || adminFilter !== 'all' || dateFilter !== 'all';

    const handleRefresh = () => {
        setRefreshing(true);
        router.reload({ only: ['logs', 'activity'], onFinish: () => setRefreshing(false) });
    };

    const exportCSV = () => {
        const headers = ['ID', 'Admin', 'Admin Email', 'Action', 'Type', 'Affected User', 'Affected ID', 'Timestamp', 'IP', 'Notes'];
        const rows = filtered.map(l => [l.id, l.admin, l.admin_email, l.action, l.type, l.affected_user, l.affected_id ?? '', l.timestamp, l.ip, `"${(l.notes ?? '').replace(/"/g, '""')}"`]);
        const csv  = [headers.map(h => `"${h}"`), ...rows.map(r => r.map((v, i) => i === 9 ? v : `"${v}"`))].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = Object.assign(document.createElement('a'), { href: url, download: `audit-log-${Date.now()}.csv` });
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Exported ${filtered.length} record${filtered.length !== 1 ? 's' : ''}.`);
    };

    // KPI counts
    const todayCount   = allLogs.filter(l => isToday(l.timestamp)).length;
    const weekCount    = allLogs.filter(l => isWithinDays(l.timestamp, 7)).length;
    const suspensions  = allLogs.filter(l => l.type === 'suspension').length;

    return (
        <>
        <Head>
            <title>RentTrustGh</title>
        </Head>
            <Toast toast={toast} />
            <DetailDrawer log={detail} onClose={() => setDetail(null)} />

            <div>
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.22rem', letterSpacing: '-0.02em' }}>Audit Log</h1>
                        <p style={{ fontSize: '0.82rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                            {allLogs.length} total entr{allLogs.length !== 1 ? 'ies' : 'y'} · {todayCount} today · {admins.length} admin{admins.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.65rem', flexShrink: 0 }}>
                        <button onClick={handleRefresh} disabled={refreshing}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 28%)', fontWeight: '600', fontSize: '0.83rem', cursor: refreshing ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => { if (!refreshing) e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'; }}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                            {refreshing ? <><Icons.spinner /> Refreshing…</> : <><Icons.refresh /> Refresh</>}
                        </button>
                        <button onClick={exportCSV}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.6rem 1.1rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 25% 15%)', color: 'white', fontWeight: '700', fontSize: '0.83rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'}>
                            <Icons.download /> Export CSV
                        </button>
                    </div>
                </div>

                {/* ── KPI strip ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <Kpi label="Total Entries"  value={allLogs.length}  sub="All time"        accent="hsl(220 25% 15%)"  iconBg="hsl(220 20% 93%)"   iconColor="hsl(220 25% 30%)" icon={<Icons.filter />} />
                    <Kpi label="Today"          value={todayCount}      sub="Last 24 hours"   accent="hsl(214 80% 46%)"  iconBg="hsl(214 100% 95%)"  iconColor="hsl(214 80% 46%)" icon={<Icons.checkCircle />} />
                    <Kpi label="This Week"      value={weekCount}       sub="Last 7 days"     accent="hsl(152 55% 35%)"  iconBg="hsl(152 55% 92%)"   iconColor="hsl(152 55% 35%)" icon={<Icons.check />} />
                    <Kpi label="Suspensions"    value={suspensions}     sub="All time"        accent="hsl(0 65% 44%)"    iconBg="hsl(0 70% 95%)"     iconColor="hsl(0 65% 44%)"   icon={<Icons.shield />} />
                </div>

                {/* ── Filters toolbar ── */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '1rem 1.25rem', marginBottom: '1.25rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '0.875rem' }}>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'hsl(220 25% 28%)', marginBottom: '0.3rem', letterSpacing: '0.01em' }}>Search</label>
                            <FocusInput type="text" placeholder="Admin, action, user, IP…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} prefix={<Icons.search />} />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'hsl(220 25% 28%)', marginBottom: '0.3rem', letterSpacing: '0.01em' }}>Action Type</label>
                            <FocusSelect value={typeFilter} onChange={e => { setFilterAndReset(setTypeFilter)(e.target.value); }}>
                                <option value="all">All Types</option>
                                {Object.entries(ACTION_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                            </FocusSelect>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'hsl(220 25% 28%)', marginBottom: '0.3rem', letterSpacing: '0.01em' }}>Admin</label>
                            <FocusSelect value={adminFilter} onChange={e => { setFilterAndReset(setAdminFilter)(e.target.value); }}>
                                <option value="all">All Admins</option>
                                {admins.map(a => <option key={a} value={a}>{a}</option>)}
                            </FocusSelect>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'hsl(220 25% 28%)', marginBottom: '0.3rem', letterSpacing: '0.01em' }}>Date Range</label>
                            <FocusSelect value={dateFilter} onChange={e => { setFilterAndReset(setDateFilter)(e.target.value); }}>
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">Last 7 Days</option>
                                <option value="month">Last 30 Days</option>
                            </FocusSelect>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid hsl(220 15% 94%)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'hsl(220 15% 48%)' }}>
                                Showing <strong style={{ color: 'hsl(220 25% 18%)' }}>{filtered.length}</strong> of <strong style={{ color: 'hsl(220 25% 18%)' }}>{allLogs.length}</strong> entries
                            </p>
                            {hasFilters && (
                                <button onClick={clearFilters}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.28rem 0.65rem', borderRadius: '999px', border: '1px solid hsl(220 15% 86%)', backgroundColor: 'hsl(220 15% 96%)', color: 'hsl(220 15% 44%)', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                                    <Icons.x /> Clear filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Table ── */}
                {pageLogs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px dashed hsl(220 15% 86%)' }}>
                        <div style={{ fontSize: '2.75rem', marginBottom: '0.875rem' }}>🔍</div>
                        <p style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: '700', color: 'hsl(220 25% 22%)' }}>No audit entries found</p>
                        <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: 'hsl(220 15% 55%)' }}>Try adjusting your search or filters.</p>
                        <button onClick={clearFilters} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.1rem', borderRadius: '0.6rem', backgroundColor: 'hsl(220 25% 15%)', color: 'white', fontWeight: '700', fontSize: '0.83rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                            <Icons.x /> Clear Filters
                        </button>
                    </div>
                ) : (
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>

                        {/* Table header */}
                        <div style={{ display: 'grid', gridTemplateColumns: '14rem 1fr 12rem 11rem 8rem auto', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1.25rem', backgroundColor: 'hsl(220 15% 97.5%)', borderBottom: '1px solid hsl(220 15% 92%)', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>
                            <div>Admin</div>
                            <div>Action</div>
                            <div>Affected</div>
                            <div>Timestamp</div>
                            <div>IP</div>
                            <div />
                        </div>

                        {/* Rows */}
                        {pageLogs.map((log, i) => (
                            <LogRow key={log.id} log={log} index={i} onView={setDetail} />
                        ))}

                        {/* Footer */}
                        <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'hsl(220 15% 98%)' }}>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(220 15% 50%)' }}>
                                Page <strong style={{ color: 'hsl(220 25% 22%)' }}>{page}</strong> of <strong style={{ color: 'hsl(220 25% 22%)' }}>{totalPages}</strong> · {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                            </p>
                            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes auditSpin     { to { transform: rotate(360deg); } }
                @keyframes auditSlideIn  { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes auditRowIn    { from { opacity:0; transform:translateX(-4px); } to { opacity:1; transform:translateX(0); } }
                @keyframes auditDrawerIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
            `}</style>
        </>
    );
};

AuditLog.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default AuditLog;