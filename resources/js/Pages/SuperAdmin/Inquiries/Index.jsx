import { useState, useCallback } from 'react';
import { router } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ─── Design tokens (matches Reports / Analytics pages) ───────────────────────
const T = {
    surface:   'white',
    border:    'hsl(220 15% 91%)',
    borderSub: 'hsl(220 15% 94%)',
    headBg:    'hsl(220 15% 98.5%)',
    text:      'hsl(220 25% 12%)',
    textSub:   'hsl(220 15% 50%)',
    textDim:   'hsl(220 15% 68%)',
    blue:      'hsl(214 80% 50%)',
    blueDim:   'hsl(214 100% 95%)',
    green:     'hsl(152 55% 33%)',
    greenDim:  'hsl(152 55% 92%)',
    amber:     'hsl(40 80% 36%)',
    amberDim:  'hsl(40 90% 93%)',
    purple:    'hsl(270 55% 40%)',
    purpleDim: 'hsl(270 60% 95%)',
    teal:      'hsl(200 65% 36%)',
    tealDim:   'hsl(200 60% 93%)',
    red:       'hsl(0 65% 44%)',
    redDim:    'hsl(0 65% 95%)',
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = '1rem', sw = 1.8 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const I = {
    search:    <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    x:         <Ico d="M6 18L18 6M6 6l12 12" size="0.85rem" />,
    chat:      <Ico d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />,
    phone:     <Ico d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
    form:      <Ico d={['M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z']} />,
    whatsapp:  <Ico d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    calendar:  <Ico d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    filter:    <Ico d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />,
    pin:       <Ico d={['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z','M15 11a3 3 0 11-6 0 3 3 0 016 0z']} />,
    user:      <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    home:      <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    chevL:     <Ico d="M15 19l-7-7 7-7" size="0.9rem" />,
    chevR:     <Ico d="M9 5l7 7-7 7" size="0.9rem" />,
    chevDown:  <Ico d="M19 9l-7 7-7-7" size="0.85rem" />,
    refresh:   <Ico d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" size="0.9rem" />,
    message:   <Ico d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt    = (n) => Number(n || 0).toLocaleString('en-GH');
const fmtDate = (v) => {
    if (!v) return '—';
    return new Date(v).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' });
};
const fmtTime = (v) => {
    if (!v) return '';
    return new Date(v).toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' });
};
const initial = (name) => (name || 'G').charAt(0).toUpperCase();
const cap     = (s)    => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—';

const TYPE_META = {
    whatsapp: { label: 'WhatsApp', color: T.green,  bg: T.greenDim,  icon: I.whatsapp },
    phone:    { label: 'Phone',    color: T.blue,   bg: T.blueDim,   icon: I.phone },
    form:     { label: 'Form',     color: T.purple, bg: T.purpleDim, icon: I.form },
};

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, accent, bg, bar }) => (
    <div style={{ backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: '0.875rem', overflow: 'hidden', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)', display: 'flex', flexDirection: 'column' }}>
        {bar && <div style={{ height: 3, background: `linear-gradient(90deg, ${bar}, ${bar}55)` }} />}
        <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: '2.4rem', height: '2.4rem', borderRadius: '0.6rem', backgroundColor: bg, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: accent, lineHeight: 1, letterSpacing: '-0.02em' }}>{fmt(value)}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: T.text, marginTop: '0.1rem' }}>{label}</div>
            </div>
        </div>
    </div>
);

// ─── Section heading ──────────────────────────────────────────────────────────
const SectionHead = ({ title, accent = T.blue }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.875rem' }}>
        <div style={{ width: 3, height: '1.2rem', borderRadius: 999, backgroundColor: accent, flexShrink: 0 }} />
        <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: T.text, letterSpacing: '-0.01em' }}>{title}</h2>
    </div>
);

// ─── Filter input ─────────────────────────────────────────────────────────────
const FilterInput = ({ placeholder, value, onChange, icon, type = 'text', onKeyDown }) => (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <span style={{ position: 'absolute', left: '0.65rem', color: T.textDim, pointerEvents: 'none' }}>{icon}</span>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            style={{
                width: '100%', paddingLeft: '2rem', paddingRight: '0.75rem',
                paddingTop: '0.42rem', paddingBottom: '0.42rem',
                border: `1px solid ${T.border}`, borderRadius: '0.55rem',
                fontSize: '0.8rem', color: T.text, backgroundColor: T.surface,
                outline: 'none', fontFamily: 'inherit',
                transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = T.blue}
            onBlur={e => e.target.style.borderColor = T.border}
        />
    </div>
);

// ─── Select filter ────────────────────────────────────────────────────────────
const FilterSelect = ({ value, onChange, children, icon }) => (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && <span style={{ position: 'absolute', left: '0.65rem', color: T.textDim, pointerEvents: 'none', zIndex: 1 }}>{icon}</span>}
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{
                width: '100%',
                paddingLeft: icon ? '2rem' : '0.75rem',
                paddingRight: '1.75rem',
                paddingTop: '0.42rem', paddingBottom: '0.42rem',
                border: `1px solid ${T.border}`, borderRadius: '0.55rem',
                fontSize: '0.8rem', color: value ? T.text : T.textDim,
                backgroundColor: T.surface, outline: 'none',
                fontFamily: 'inherit', appearance: 'none',
                cursor: 'pointer', transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = T.blue}
            onBlur={e => e.target.style.borderColor = T.border}
        >
            {children}
        </select>
        <span style={{ position: 'absolute', right: '0.6rem', color: T.textDim, pointerEvents: 'none' }}>{I.chevDown}</span>
    </div>
);

// ─── Type badge ───────────────────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
    const meta = TYPE_META[type] || { label: cap(type), color: T.textSub, bg: T.headBg, icon: I.chat };
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.22rem 0.6rem', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em', backgroundColor: meta.bg, color: meta.color, whiteSpace: 'nowrap' }}>
            {meta.icon}{meta.label}
        </span>
    );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ name, color = T.teal, bg = T.tealDim }) => (
    <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', backgroundColor: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, flexShrink: 0 }}>
        {initial(name)}
    </div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
const Empty = () => (
    <div style={{ backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: '0.875rem', padding: '3.5rem', textAlign: 'center' }}>
        <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', backgroundColor: T.blueDim, color: T.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Ico d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" size="1.5rem" />
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: T.text, margin: '0 0 0.4rem' }}>No inquiries found</h3>
        <p style={{ fontSize: '0.82rem', color: T.textSub, margin: 0 }}>Try adjusting your filters or search query.</p>
    </div>
);

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({ meta }) => {
    const { current_page, last_page, from, to, total, links } = meta;
    if (last_page <= 1) return null;

    const go = (url) => { if (url) router.get(url, {}, { preserveState: true, replace: true }); };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <p style={{ margin: 0, fontSize: '0.78rem', color: T.textSub }}>
                Showing <strong>{from}–{to}</strong> of <strong>{fmt(total)}</strong> inquiries
            </p>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
                <PageBtn onClick={() => go(links[0]?.url)} disabled={current_page === 1}>{I.chevL}</PageBtn>
                {links.slice(1, -1).map((l, i) => (
                    <PageBtn key={i} onClick={() => go(l.url)} active={l.active}>
                        {l.label}
                    </PageBtn>
                ))}
                <PageBtn onClick={() => go(links[links.length - 1]?.url)} disabled={current_page === last_page}>{I.chevR}</PageBtn>
            </div>
        </div>
    );
};

const PageBtn = ({ children, onClick, disabled, active }) => (
    <button onClick={onClick} disabled={disabled} style={{
        minWidth: '2rem', height: '2rem', padding: '0 0.4rem',
        borderRadius: '0.4rem', border: `1px solid ${active ? T.blue : T.border}`,
        backgroundColor: active ? T.blue : T.surface,
        color: active ? 'white' : disabled ? T.textDim : T.text,
        fontSize: '0.78rem', fontWeight: active ? 700 : 400,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.12s', fontFamily: 'inherit',
    }}>
        {children}
    </button>
);

// ─── Inquiry card ─────────────────────────────────────────────────────────────
const InquiryCard = ({ inquiry }) => {
    const [expanded, setExpanded] = useState(false);
    const isGuest = !inquiry.tenant_id;

    const avatarBg    = isGuest ? T.amberDim : T.tealDim;
    const avatarColor = isGuest ? T.amber    : T.teal;

    return (
        <div style={{
            backgroundColor: T.surface, border: `1px solid ${T.border}`,
            borderRadius: '0.875rem', overflow: 'hidden',
            boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)',
            transition: 'box-shadow 0.15s',
        }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px hsl(220 20% 15% / 0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px hsl(220 20% 15% / 0.04)'}
        >
            {/* Card header */}
            <div style={{ padding: '0.875rem 1.25rem', borderBottom: `1px solid ${T.borderSub}`, backgroundColor: T.headBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                    <div style={{ color: T.blue }}>{I.home}</div>
                    <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 800, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inquiry.rental_title}</p>
                        <p style={{ margin: '0.1rem 0 0', fontSize: '0.68rem', color: T.textSub, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ color: T.textDim }}>{I.pin}</span>
                            {inquiry.rental_city || '—'}
                            {inquiry.rental_address && ` · ${inquiry.rental_address}`}
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <TypeBadge type={inquiry.type} />
                    <span style={{ fontSize: '0.68rem', color: T.textDim, whiteSpace: 'nowrap' }}>
                        {fmtDate(inquiry.created_at)}
                        <span style={{ display: 'block', textAlign: 'right' }}>{fmtTime(inquiry.created_at)}</span>
                    </span>
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>

                {/* Tenant */}
                <div style={{ flex: 1, minWidth: '200px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <Avatar name={inquiry.tenant_name || 'Guest'} color={avatarColor} bg={avatarBg} />
                    <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.1rem' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: T.text }}>
                                {inquiry.tenant_name || 'Anonymous Tenant'}
                            </p>
                            {isGuest && (
                                <span style={{ fontSize: '0.6rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: 999, backgroundColor: T.amberDim, color: T.amber, letterSpacing: '0.04em' }}>GUEST</span>
                            )}
                        </div>
                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: T.textSub }}>{inquiry.tenant_email || 'No email'}</p>
                        <p style={{ margin: '0.1rem 0 0', fontSize: '0.75rem', color: T.textSub }}>{inquiry.tenant_phone || 'No phone'}</p>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ width: 1, backgroundColor: T.borderSub, alignSelf: 'stretch', flexShrink: 0 }} />

                {/* Agent */}
                <div style={{ flex: 1, minWidth: '200px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <Avatar name={inquiry.agent_name || 'A'} color={T.blue} bg={T.blueDim} />
                    <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: T.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>Agent</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: T.text }}>{inquiry.agent_name || '—'}</p>
                        {inquiry.agent_company && <p style={{ margin: '0.1rem 0 0', fontSize: '0.75rem', color: T.textSub }}>{inquiry.agent_company}</p>}
                        <p style={{ margin: '0.1rem 0 0', fontSize: '0.75rem', color: T.textSub }}>{inquiry.agent_email || '—'}</p>
                    </div>
                </div>
            </div>

            {/* Message (collapsible) */}
            {inquiry.message && (
                <div style={{ borderTop: `1px solid ${T.borderSub}` }}>
                    <button
                        onClick={() => setExpanded(e => !e)}
                        style={{ width: '100%', padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: T.textSub }}>
                            {I.message} Message
                        </span>
                        <span style={{ color: T.textDim, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>{I.chevDown}</span>
                    </button>
                    {expanded && (
                        <div style={{ padding: '0 1.25rem 1rem' }}>
                            <div style={{ backgroundColor: 'hsl(40 33% 98%)', border: `1px solid hsl(40 25% 90%)`, borderRadius: '0.5rem', padding: '0.875rem 1rem' }}>
                                <p style={{ margin: 0, fontSize: '0.83rem', color: T.text, lineHeight: 1.6, fontStyle: 'italic' }}>"{inquiry.message}"</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const InquiriesIndex = ({ inquiries, summary, filters, cities, agents }) => {
    const [form, setForm] = useState({
        search:     filters?.search     || '',
        type:       filters?.type       || '',
        city:       filters?.city       || '',
        agent_id:   filters?.agent_id   || '',
        start_date: filters?.start_date || '',
        end_date:   filters?.end_date   || '',
        per_page:   filters?.per_page   || 20,
    });

    const setField = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

    const applyFilters = useCallback((overrides = {}) => {
        const params = { ...form, ...overrides };
        // Strip empty values
        Object.keys(params).forEach(k => { if (!params[k] || params[k] === 20) delete params[k]; });
        router.get(route('super-admin.inquiries.index'), params, { preserveState: true, replace: true });
    }, [form]);

    const resetFilters = () => {
        const blank = { search: '', type: '', city: '', agent_id: '', start_date: '', end_date: '', per_page: 20 };
        setForm(blank);
        router.get(route('super-admin.inquiries.index'), {}, { preserveState: true, replace: true });
    };

    const hasFilters = form.search || form.type || form.city || form.agent_id || form.start_date || form.end_date;

    const handleKeyDown = (e) => { if (e.key === 'Enter') applyFilters(); };

    const data = inquiries?.data ?? [];
    const meta = inquiries ?? {};

    return (
        <>
            {/* ── Page header ───────────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: T.text, margin: '0 0 0.22rem', letterSpacing: '-0.02em' }}>
                        Inquiries
                    </h1>
                    <p style={{ fontSize: '0.82rem', color: T.textSub, margin: 0 }}>
                        All tenant inquiries across the platform
                    </p>
                </div>
                {hasFilters && (
                    <button onClick={resetFilters} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.9rem', borderRadius: '0.55rem', border: `1px solid ${T.border}`, backgroundColor: T.surface, color: T.textSub, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {I.refresh} Reset Filters
                    </button>
                )}
            </div>

            {/* Gradient accent bar */}
            <div style={{ height: 4, borderRadius: 999, background: 'linear-gradient(90deg, hsl(200 65% 40%), hsl(152 55% 38%), hsl(214 80% 50%))', marginBottom: '1.5rem', opacity: 0.45 }} />

            {/* ── Summary KPIs ───────────────────────────────────────────── */}
            <div style={{ marginBottom: '1.75rem' }}>
                <SectionHead title="Overview" accent={T.teal} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.875rem' }}>
                    <StatCard label="Total Inquiries" value={summary?.total}     accent="hsl(220 25% 15%)" bg={T.blueDim}   bar={T.blue}   icon={I.chat} />
                    <StatCard label="WhatsApp"        value={summary?.whatsapp}  accent={T.green}          bg={T.greenDim}  bar={T.green}  icon={I.whatsapp} />
                    <StatCard label="Phone"           value={summary?.phone}     accent={T.blue}           bg={T.blueDim}   bar={T.blue}   icon={I.phone} />
                    <StatCard label="Form"            value={summary?.form}      accent={T.purple}         bg={T.purpleDim} bar={T.purple} icon={I.form} />
                    <StatCard label="From Guests"     value={summary?.guests}    accent={T.amber}          bg={T.amberDim}  bar={T.amber}  icon={I.user} />
                    <StatCard label="Today"           value={summary?.today}     accent={T.teal}           bg={T.tealDim}   bar={T.teal}   icon={I.calendar} />
                </div>
            </div>

            {/* ── Filters ────────────────────────────────────────────────── */}
            <div style={{ marginBottom: '1.5rem' }}>
                <SectionHead title="Filter Inquiries" accent={T.blue} />
                <div style={{ backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: '0.875rem', padding: '1.1rem 1.25rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
                        {/* Search */}
                        <div style={{ gridColumn: 'span 2' }}>
                            <FilterInput
                                placeholder="Search listing, tenant, agent, message…"
                                value={form.search}
                                onChange={setField('search')}
                                onKeyDown={handleKeyDown}
                                icon={I.search}
                            />
                        </div>

                        {/* Type */}
                        <FilterSelect value={form.type} onChange={setField('type')} icon={I.chat}>
                            <option value="">All types</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="phone">Phone</option>
                            <option value="form">Form</option>
                        </FilterSelect>

                        {/* City */}
                        <FilterSelect value={form.city} onChange={setField('city')} icon={I.pin}>
                            <option value="">All cities</option>
                            {(cities ?? []).map(c => <option key={c} value={c}>{c}</option>)}
                        </FilterSelect>

                        {/* Agent */}
                        <FilterSelect value={form.agent_id} onChange={setField('agent_id')} icon={I.user}>
                            <option value="">All agents</option>
                            {(agents ?? []).map(a => (
                                <option key={a.id} value={a.id}>{a.name}{a.company ? ` (${a.company})` : ''}</option>
                            ))}
                        </FilterSelect>

                        {/* Date from */}
                        <FilterInput type="date" placeholder="From date" value={form.start_date} onChange={setField('start_date')} icon={I.calendar} />

                        {/* Date to */}
                        <FilterInput type="date" placeholder="To date" value={form.end_date} onChange={setField('end_date')} icon={I.calendar} />

                        {/* Per page */}
                        <FilterSelect value={form.per_page} onChange={v => setField('per_page')(Number(v))}>
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                            <option value={100}>100 per page</option>
                        </FilterSelect>
                    </div>

                    {/* Action row */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.875rem', justifyContent: 'flex-end' }}>
                        {hasFilters && (
                            <button onClick={resetFilters} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.875rem', borderRadius: '0.5rem', border: `1px solid ${T.border}`, backgroundColor: T.surface, color: T.textSub, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                                {I.x} Clear
                            </button>
                        )}
                        <button onClick={() => applyFilters()} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 1.1rem', borderRadius: '0.5rem', border: 'none', backgroundColor: T.blue, color: 'white', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            {I.filter} Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Results ────────────────────────────────────────────────── */}
            <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                    <SectionHead title={`Inquiries (${fmt(meta.total ?? 0)})`} accent={T.teal} />
                    {hasFilters && (
                        <span style={{ fontSize: '0.75rem', color: T.textSub, fontWeight: 600 }}>
                            Filtered results
                        </span>
                    )}
                </div>

                {data.length === 0 ? (
                    <Empty />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        {data.map(inquiry => (
                            <InquiryCard key={inquiry.id} inquiry={inquiry} />
                        ))}
                    </div>
                )}

                <Pagination meta={meta} />
            </div>

            <style>{`
                input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.45; cursor: pointer; }
                select option { color: hsl(220 25% 12%); }
            `}</style>
        </>
    );
};

InquiriesIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default InquiriesIndex;