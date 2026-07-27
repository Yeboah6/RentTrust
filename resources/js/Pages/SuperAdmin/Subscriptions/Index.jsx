import React, { useState, useRef } from 'react';
import { Link, router, Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = ({ d, size = '1rem', style: extraStyle }) => (
    <svg style={{ width: size, height: size, flexShrink: 0, ...extraStyle }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d={p} />
        ))}
    </svg>
);

const Icons = {
    search:  () => <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    eye:     () => <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} />,
    x:       () => <Ico d="M6 18L18 6M6 6l12 12" />,
    gift:    () => <Ico d={["M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"]} />,
    ban:     () => <Ico d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />,
    upgrade: () => <Ico d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    cancel:  () => <Ico d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    alert:   () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size="1.25rem" />,
    users:   () => <Ico d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" size="1.1rem" />,
    xCircle: () => <Ico d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" size="1.1rem" />,
    clock:   () => <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size="1.1rem" />,
    currency:() => <Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size="1.1rem" />,
    chevL:   () => <Ico d="M15 19l-7-7 7-7" size="0.875rem" />,
    chevR:   () => <Ico d="M9 5l7 7-7 7" size="0.875rem" />,
    chevD:   () => <Ico d="M19 9l-7 7-7-7" size="0.875rem" />,
    chevU:   () => <Ico d="M5 15l7-7 7 7" size="0.875rem" />,
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
    active:    { label: 'Active',       bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 30%)', dot: 'hsl(152 60% 40%)' },
    trial:     { label: 'Trial',        bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 35%)',  dot: 'hsl(40 80% 48%)' },
    pending:   { label: 'Pending',      bg: 'hsl(214 100% 95%)',color: 'hsl(214 80% 40%)', dot: 'hsl(214 80% 52%)' },
    expired:   { label: 'Expired',      bg: 'hsl(0 70% 94%)',   color: 'hsl(0 65% 42%)',   dot: 'hsl(0 65% 52%)' },
    cancelled: { label: 'Cancelled',    bg: 'hsl(220 15% 92%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)' },
    inactive:  { label: 'Inactive',     bg: 'hsl(220 15% 92%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)' },
    suspended: { label: 'Suspended',    bg: 'hsl(0 70% 94%)',   color: 'hsl(0 65% 42%)',   dot: 'hsl(0 65% 52%)' },
    grace:     { label: 'Grace Period', bg: 'hsl(38 92% 93%)',  color: 'hsl(36 85% 33%)',  dot: 'hsl(36 85% 45%)' },
};

const PLAN_PALETTE = [
    'hsl(214 80% 48%)', 'hsl(152 55% 33%)', 'hsl(270 60% 45%)',
    'hsl(40 80% 40%)',  'hsl(0 62% 48%)',   'hsl(174 55% 35%)',
];

const ACTION_CFG = {
    cancel:     { label: 'Cancel Subscription', confirmLabel: 'Confirm Cancel', danger: true,  BtnIcon: 'cancel',  btnBg: 'hsl(0 65% 50%)',    btnColor: 'white' },
    upgrade:    { label: 'Upgrade Plan',         confirmLabel: 'Confirm Upgrade',danger: false, BtnIcon: 'upgrade', btnBg: 'hsl(152 55% 33%)',  btnColor: 'white' },
    free_month: { label: 'Grant Free Month',     confirmLabel: 'Grant Extension',danger: false, BtnIcon: 'gift',    btnBg: 'hsl(270 55% 45%)',  btnColor: 'white' },
    suspend:    { label: 'Suspend Account',      confirmLabel: 'Confirm Suspend',danger: true,  BtnIcon: 'ban',     btnBg: 'hsl(0 65% 50%)',    btnColor: 'white' },
};

const ACTION_DESC = {
    cancel:     (s) => `Cancel the ${s.plan_name} subscription for ${s.user_name}? Their account will be downgraded to Free immediately.`,
    upgrade:    (s) => `Select a new plan for ${s.user_name}. The change takes effect at the start of the next billing cycle.`,
    free_month: (s) => `Grant a free one-month extension to ${s.user_name}? Their renewal date will be pushed back by 30 days.`,
    suspend:    (s) => `Suspend ${s.user_name}'s account? They will lose access to all paid features immediately.`,
};

const STATUSES  = ['all','active','trial','pending','expired','cancelled','inactive'];
const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return v; }
};

const planColor = (name = '') =>
    PLAN_PALETTE[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % PLAN_PALETTE.length];

const normalise = (s) => ({
    ...s,
    _id:        s.id,
    sub_ref:    s.sub_ref ?? `SUB-${String(s.id).padStart(4,'0')}`,
    user_name:  s.user?.name       ?? s.user_name   ?? '—',
    email:      s.user?.email      ?? s.email       ?? '',
    plan_name:  s.plan?.name       ?? s.plan_name   ?? '—',
    plan_price: s.plan?.price      ?? s.monthly_price ?? 0,
    plan_cycle: s.plan?.billing_cycle ?? 'month',
    status_key: (s.status ?? 'active').toLowerCase().replace(/\s+/g,'_'),
    grace:      s.on_grace_period  ?? s.grace        ?? false,
    days_left:  s.days_left        ?? null,
    provider:   s.payment_method   ?? s.provider    ?? '—',
    created_at: s.created_at       ?? s.starts_at   ?? '',
    renews_at:  s.renews_at        ?? s.ends_at     ?? '',
});

// ─── Atoms ────────────────────────────────────────────────────────────────────

const StatusBadge = ({ statusKey, grace }) => {
    const key = grace ? 'grace' : (statusKey ?? '');
    const c   = STATUS_CFG[key] ?? { label: key, bg: 'hsl(220 15% 92%)', color: 'hsl(220 15% 40%)', dot: 'hsl(220 15% 55%)' };
    return (
        <span style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', padding:'0.25rem 0.65rem', borderRadius:'999px', fontSize:'0.68rem', fontWeight:'700', letterSpacing:'0.06em', backgroundColor:c.bg, color:c.color }}>
            <span style={{ width:'0.38rem', height:'0.38rem', borderRadius:'50%', backgroundColor:c.dot, flexShrink:0 }} />
            {c.label.toUpperCase()}
        </span>
    );
};

const PlanTag = ({ name, price, cycle }) => {
    const color = planColor(name);
    return (
        <div>
            <span style={{ display:'inline-block', padding:'0.18rem 0.55rem', borderRadius:'0.35rem', fontSize:'0.72rem', fontWeight:'700', letterSpacing:'0.04em', backgroundColor:`${color}1a`, color, marginBottom:'0.2rem' }}>
                {name}
            </span>
            {Number(price) > 0 && (
                <div style={{ fontSize:'0.72rem', color:'hsl(220 15% 52%)', fontWeight:'500' }}>
                    GH₵{Number(price).toFixed(2)}/{cycle}
                </div>
            )}
        </div>
    );
};

const Avatar = ({ name, email }) => {
    const str      = name ?? email ?? '?';
    const initials = str.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
    const hue      = [...str].reduce((a,c) => a + c.charCodeAt(0), 0) % 360;
    return (
        <div style={{ width:'2.25rem', height:'2.25rem', borderRadius:'50%', flexShrink:0, backgroundColor:`hsl(${hue} 50% 88%)`, color:`hsl(${hue} 50% 32%)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:'800', letterSpacing:'0.02em' }}>
            {initials}
        </div>
    );
};

const SummaryCard = ({ label, value, sub, iconEl, accentBg, accentColor }) => (
    <div style={{ backgroundColor:'white', borderRadius:'0.875rem', border:'1px solid hsl(220 15% 91%)', padding:'1.1rem 1.25rem', boxShadow:'0 1px 4px hsl(220 20% 15% / 0.05)', display:'flex', alignItems:'center', gap:'0.875rem' }}>
        <div style={{ width:'2.5rem', height:'2.5rem', borderRadius:'0.65rem', backgroundColor:accentBg, color:accentColor, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            {iconEl}
        </div>
        <div>
            <div style={{ fontSize:'1.3rem', fontWeight:'800', color:'hsl(220 25% 14%)', lineHeight:1 }}>{value}</div>
            <div style={{ fontSize:'0.72rem', fontWeight:'600', color:'hsl(220 15% 48%)', marginTop:'0.2rem' }}>{label}</div>
            {sub && <div style={{ fontSize:'0.67rem', color:'hsl(220 15% 60%)' }}>{sub}</div>}
        </div>
    </div>
);

const ActionBtn = ({ iconName, label, onClick, bg, color }) => {
    const BtnIco = Icons[iconName];
    return (
        <button onClick={onClick}
            style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.38rem 0.7rem', borderRadius:'0.45rem', fontSize:'0.75rem', fontWeight:'600', backgroundColor: bg, color, border:'none', cursor:'pointer', transition:'filter 0.12s', whiteSpace:'nowrap', fontFamily:'inherit' }}
            onMouseEnter={e => e.currentTarget.style.filter='brightness(0.91)'}
            onMouseLeave={e => e.currentTarget.style.filter='none'}>
            {BtnIco && <BtnIco />}{label}
        </button>
    );
};

const PagBtn = ({ onClick, disabled, active, label }) => (
    <button onClick={onClick} disabled={disabled}
        style={{ minWidth:'2.2rem', height:'2.2rem', padding:'0 0.5rem', display:'inline-flex', alignItems:'center', justifyContent:'center', border:'1px solid hsl(220 15% 88%)', borderRadius:'0.5rem', backgroundColor: active ? 'hsl(220 25% 15%)' : 'white', color: active ? 'white' : 'hsl(220 15% 45%)', fontSize:'0.82rem', fontWeight:'600', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, fontFamily:'inherit' }}>
        {label}
    </button>
);

// ─── Action modal ─────────────────────────────────────────────────────────────

const ActionModal = ({ sub, actionType, onConfirm, onClose, processing }) => {
    const cfg = ACTION_CFG[actionType];
    if (!cfg) return null;
    const BtnIco = Icons[cfg.BtnIcon];
    return (
        <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'hsl(220 25% 8% / 0.55)', backdropFilter:'blur(4px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width:'100%', maxWidth:'440px', margin:'1rem', backgroundColor:'white', borderRadius:'1.1rem', padding:'2rem', boxShadow:'0 32px 72px hsl(220 25% 8% / 0.22)' }}>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem' }}>
                    <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
                        <div style={{ width:'2.6rem', height:'2.6rem', borderRadius:'0.75rem', backgroundColor: cfg.danger ? 'hsl(0 70% 94%)' : 'hsl(214 100% 95%)', color: cfg.danger ? 'hsl(0 65% 48%)' : 'hsl(214 80% 48%)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Icons.alert />
                        </div>
                        <div>
                            <h3 style={{ margin:'0 0 0.15rem', fontSize:'1rem', fontWeight:'800', color:'hsl(220 25% 14%)' }}>{cfg.label}</h3>
                            <p style={{ margin:0, fontSize:'0.75rem', color:'hsl(220 15% 50%)' }}>{sub.user_name} · {sub.sub_ref}</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'hsl(220 15% 55%)', display:'flex', padding:'0.25rem' }}><Icons.x /></button>
                </div>

                {/* Detail card */}
                <div style={{ backgroundColor:'hsl(220 15% 97%)', border:'1px solid hsl(220 15% 91%)', borderRadius:'0.75rem', padding:'0.875rem 1rem', marginBottom:'1rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem 1.25rem' }}>
                    {[
                        ['User',   sub.user_name],
                        ['Plan',   sub.plan_name],
                        ['Status', STATUS_CFG[sub.status_key]?.label ?? sub.status_key],
                        ['Renews', fmtDate(sub.renews_at)],
                    ].map(([k,v]) => (
                        <div key={k}>
                            <div style={{ fontSize:'0.62rem', fontWeight:'700', letterSpacing:'0.09em', color:'hsl(220 15% 52%)', textTransform:'uppercase' }}>{k}</div>
                            <div style={{ fontSize:'0.84rem', fontWeight:'600', color:'hsl(220 25% 16%)', marginTop:'0.1rem' }}>{v ?? '—'}</div>
                        </div>
                    ))}
                </div>

                <p style={{ fontSize:'0.82rem', color:'hsl(220 15% 38%)', lineHeight:1.6, margin:'0 0 1.1rem' }}>
                    {ACTION_DESC[actionType]?.(sub)}
                </p>

                {cfg.danger && (
                    <div style={{ padding:'0.65rem 0.875rem', borderRadius:'0.5rem', backgroundColor:'hsl(0 70% 97%)', border:'1px solid hsl(0 65% 88%)', fontSize:'0.76rem', color:'hsl(0 55% 38%)', marginBottom:'1.1rem', lineHeight:1.5 }}>
                        ⚠ This action is immediate and may affect the user's access to the platform.
                    </div>
                )}

                <div style={{ display:'flex', gap:'0.65rem' }}>
                    <button onClick={onClose} style={{ flex:1, padding:'0.625rem', borderRadius:'0.6rem', border:'1px solid hsl(220 15% 88%)', backgroundColor:'white', fontSize:'0.85rem', fontWeight:'600', color:'hsl(220 25% 30%)', cursor:'pointer', fontFamily:'inherit' }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={processing}
                        style={{ flex:2, padding:'0.625rem', borderRadius:'0.6rem', border:'none', backgroundColor: processing ? 'hsl(220 25% 55%)' : cfg.btnBg, color: cfg.btnColor, fontSize:'0.85rem', fontWeight:'700', cursor: processing ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.45rem', fontFamily:'inherit' }}>
                        {BtnIco && <BtnIco />}{processing ? 'Processing…' : cfg.confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ toast }) => {
    if (!toast) return null;
    return (
        <div style={{ position:'fixed', top:'1.25rem', right:'1.25rem', zIndex:100, padding:'0.85rem 1.25rem', borderRadius:'0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color:'white', fontWeight:'600', fontSize:'0.875rem', boxShadow:'0 8px 28px hsl(220 25% 8% / 0.22)', animation:'slideIn 0.2s ease' }}>
            {toast.msg}
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const SubscriptionsIndex = ({ subscriptions: raw = [] }) => {
    const initial = raw.map(normalise);

    const [subs,         setSubs]         = useState(initial);
    const [search,       setSearch]       = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPlan,   setFilterPlan]   = useState('all');
    const [sortField,    setSortField]    = useState('created_at');
    const [sortDir,      setSortDir]      = useState('desc');
    const [hoveredRow,   setHoveredRow]   = useState(null);
    const [page,         setPage]         = useState(1);
    const [actionTarget, setActionTarget] = useState(null);
    const [processing,   setProcessing]   = useState(false);
    const [toast,        setToast]        = useState(null);
    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const planNames = [...new Set(initial.map(s => s.plan_name).filter(Boolean))];

    const toggleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
        setPage(1);
    };

    const filtered = subs
        .filter(s => {
            const q = search.toLowerCase();
            const matchSearch = !q
                || s.user_name.toLowerCase().includes(q)
                || s.email.toLowerCase().includes(q)
                || s.sub_ref.toLowerCase().includes(q)
                || s.plan_name.toLowerCase().includes(q);
            const matchStatus = filterStatus === 'all' || s.status_key === filterStatus;
            const matchPlan   = filterPlan   === 'all' || s.plan_name.toLowerCase() === filterPlan.toLowerCase();
            return matchSearch && matchStatus && matchPlan;
        })
        .sort((a, b) => {
            const keyMap = { user:'user_name', plan:'plan_name', status:'status_key', date:'created_at', renews:'renews_at' };
            const k = keyMap[sortField] ?? 'created_at';
            const cmp = (a[k] ?? '') < (b[k] ?? '') ? -1 : (a[k] ?? '') > (b[k] ?? '') ? 1 : 0;
            return sortDir === 'asc' ? cmp : -cmp;
        });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

    // summary stats
    const activeCount    = subs.filter(s => s.status_key === 'active').length;
    const cancelledCount = subs.filter(s => s.status_key === 'cancelled').length;
    const expiredCount   = subs.filter(s => s.status_key === 'expired').length;
    const mrr            = subs.filter(s => s.status_key === 'active').reduce((acc, s) => acc + Number(s.plan_price), 0);

    const confirmAction = () => {
        if (!actionTarget) return;
        const { sub, type } = actionTarget;
        setProcessing(true);
        
        if (type === 'upgrade') {
            // Upgrade is handled entirely inside the UpgradeModal on the Show page.
            // From the Index page, just navigate to the Show page where the modal lives.
            router.visit(`/super-admin/subscriptions/${sub._id}`);
            setProcessing(false);
            setActionTarget(null);
            return;
        }
    
        const endpoints = {
            cancel:     `/super-admin/subscriptions/${sub._id}/cancel`,
            suspend:    `/super-admin/subscriptions/${sub._id}/suspend`,
            free_month: `/super-admin/subscriptions/${sub._id}/extend`,
        };
    
        const body      = type === 'free_month' ? { days: 30 } : {};
        const newStatus = { cancel: 'cancelled', suspend: 'suspended' }[type];
    
        router.post(endpoints[type], body, {
            preserveScroll: true,
            onSuccess: () => {
                if (newStatus) setSubs(prev => prev.map(s => s._id === sub._id ? { ...s, status_key: newStatus } : s));
                showToast(`${ACTION_CFG[type].label} applied successfully.`);
                setActionTarget(null);
            },
            onError:  () => showToast('Action failed. Please try again.', 'error'),
            onFinish: () => setProcessing(false),
        });
    };

    const SortTh = ({ field, label, align = 'left' }) => {
        const active = sortField === field;
        const ChevEl = active && sortDir === 'desc' ? Icons.chevD : Icons.chevU;
        return (
            <th onClick={() => toggleSort(field)} style={{ padding:'0.75rem 1rem', fontSize:'0.68rem', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', color: active ? 'hsl(220 25% 22%)' : 'hsl(220 15% 50%)', textAlign:align, cursor:'pointer', userSelect:'none', whiteSpace:'nowrap', backgroundColor: active ? 'hsl(220 20% 97%)' : 'hsl(220 15% 97.5%)', borderBottom:'1px solid hsl(220 15% 91%)', transition:'background-color 0.12s' }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem' }}>
                    {label}
                    <span style={{ opacity: active ? 1 : 0.3 }}><ChevEl /></span>
                </span>
            </th>
        );
    };

    const PlainTh = ({ label, align = 'left' }) => (
        <th style={{ padding:'0.75rem 1rem', fontSize:'0.68rem', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', color:'hsl(220 15% 50%)', textAlign:align, backgroundColor:'hsl(220 15% 97.5%)', borderBottom:'1px solid hsl(220 15% 91%)' }}>{label}</th>
    );

    return (
        <>
        <Head>
            <title>RentTrustGh</title>
        </Head>
            <Toast toast={toast} />
            {actionTarget && (
                <ActionModal sub={actionTarget.sub} actionType={actionTarget.type} onConfirm={confirmAction} onClose={() => setActionTarget(null)} processing={processing} />
            )}

            <div>
                {/* ── Header ── */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize:'1.5rem', fontWeight:'800', color:'hsl(220 25% 14%)', margin:'0 0 0.2rem' }}>Subscriptions</h1>
                        <p style={{ fontSize:'0.875rem', color:'hsl(220 15% 50%)', margin:0 }}>
                            {filtered.length.toLocaleString()} of {subs.length.toLocaleString()} subscription{subs.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {/* ── Summary cards ── */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'0.875rem', marginBottom:'1.5rem' }}>
                    <SummaryCard label="Active Subscriptions" sub="Currently paying"     value={activeCount.toLocaleString()}    iconEl={<Icons.users />}    accentBg="hsl(152 55% 92%)" accentColor="hsl(152 55% 33%)" />
                    <SummaryCard label="Cancelled"            sub="Churned or downgraded" value={cancelledCount.toLocaleString()} iconEl={<Icons.xCircle />}  accentBg="hsl(220 15% 92%)" accentColor="hsl(220 15% 42%)" />
                    <SummaryCard label="Expired"              sub="Need renewal"          value={expiredCount.toLocaleString()}   iconEl={<Icons.clock />}    accentBg="hsl(0 65% 94%)"   accentColor="hsl(0 62% 48%)" />
                    <SummaryCard label="Monthly Revenue"      sub="Active subs only"      value={`GH₵${mrr.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`} iconEl={<Icons.currency />} accentBg="hsl(214 100% 94%)" accentColor="hsl(214 80% 48%)" />
                </div>

                {/* ── Filter bar ── */}
                <div style={{ backgroundColor:'white', border:'1px solid hsl(220 15% 91%)', borderRadius:'0.875rem', padding:'1.1rem 1.25rem', marginBottom:'1rem', boxShadow:'0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 180px auto', gap:'0.75rem', marginBottom:'0.875rem', alignItems:'end' }}>
                        <div>
                            <label style={{ display:'block', fontSize:'0.68rem', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', color:'hsl(220 15% 52%)', marginBottom:'0.3rem' }}>Search</label>
                            <div style={{ position:'relative' }}>
                                <span style={{ position:'absolute', left:'0.7rem', top:'50%', transform:'translateY(-50%)', color:'hsl(220 15% 55%)', pointerEvents:'none', display:'flex' }}><Icons.search /></span>
                                <input type="text" placeholder="User, email, SUB ID, plan…" value={search}
                                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                                    style={{ width:'100%', padding:'0.55rem 0.75rem 0.55rem 2.25rem', border:'1px solid hsl(220 15% 88%)', borderRadius:'0.55rem', fontSize:'0.85rem', color:'hsl(220 25% 18%)', outline:'none', boxSizing:'border-box', fontFamily:'inherit' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display:'block', fontSize:'0.68rem', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', color:'hsl(220 15% 52%)', marginBottom:'0.3rem' }}>Plan</label>
                            <select value={filterPlan} onChange={e => { setFilterPlan(e.target.value); setPage(1); }}
                                style={{ width:'100%', padding:'0.55rem 0.75rem', border:'1px solid hsl(220 15% 88%)', borderRadius:'0.55rem', fontSize:'0.82rem', backgroundColor:'white', outline:'none', cursor:'pointer', color:'hsl(220 25% 18%)', fontFamily:'inherit' }}>
                                <option value="all">All Plans</option>
                                {planNames.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <button onClick={() => { setSearch(''); setFilterStatus('all'); setFilterPlan('all'); setPage(1); setSubs(initial); }}
                            style={{ background:'none', border:'none', cursor:'pointer', fontSize:'0.78rem', fontWeight:'600', color:'hsl(220 15% 50%)', fontFamily:'inherit', alignSelf:'flex-end', padding:'0.55rem 0.5rem' }}>
                            Clear all
                        </button>
                    </div>
                    <div style={{ display:'flex', gap:'0.3rem', flexWrap:'wrap' }}>
                        {STATUSES.map(s => (
                            <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
                                style={{ padding:'0.35rem 0.85rem', borderRadius:'999px', border:'none', fontSize:'0.72rem', fontWeight:'600', letterSpacing:'0.04em', cursor:'pointer', transition:'all 0.15s', backgroundColor: filterStatus === s ? 'hsl(220 25% 15%)' : 'hsl(220 15% 93%)', color: filterStatus === s ? 'white' : 'hsl(220 15% 45%)', fontFamily:'inherit' }}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Table ── */}
                <div style={{ backgroundColor:'white', border:'1px solid hsl(220 15% 91%)', borderRadius:'0.875rem', overflow:'hidden', boxShadow:'0 1px 4px hsl(220 20% 15% / 0.05)' }}>
                    {paginated.length === 0 ? (
                        <div style={{ padding:'4rem 2rem', textAlign:'center' }}>
                            <div style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>📋</div>
                            <p style={{ fontSize:'0.9rem', color:'hsl(220 15% 50%)', margin:0 }}>No subscriptions match your current filters.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX:'auto' }}>
                            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'960px' }}>
                                <thead>
                                    <tr>
                                        <SortTh field="user"   label="User" />
                                        <PlainTh label="Ref" />
                                        <SortTh field="plan"   label="Plan" />
                                        <SortTh field="status" label="Status" align="center" />
                                        <PlainTh label="Provider" />
                                        <SortTh field="date"   label="Started" />
                                        <SortTh field="renews" label="Renews" />
                                        <PlainTh label="Actions" align="right" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginated.map(s => {
                                        const isActive = s.status_key === 'active';
                                        return (
                                            <tr key={s._id}
                                                onMouseEnter={() => setHoveredRow(s._id)}
                                                onMouseLeave={() => setHoveredRow(null)}
                                                style={{ borderBottom:'1px solid hsl(220 15% 94%)', backgroundColor: hoveredRow === s._id ? 'hsl(220 25% 98.5%)' : 'white', transition:'background-color 0.1s' }}>

                                                {/* User */}
                                                <td style={{ padding:'0.875rem 1rem' }}>
                                                    <div style={{ display:'flex', alignItems:'center', gap:'0.7rem' }}>
                                                        <Avatar name={s.user_name} email={s.email} />
                                                        <div>
                                                            <div style={{ fontSize:'0.875rem', fontWeight:'600', color:'hsl(220 25% 15%)' }}>{s.user_name}</div>
                                                            {s.email && <div style={{ fontSize:'0.72rem', color:'hsl(220 15% 55%)' }}>{s.email}</div>}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Ref */}
                                                <td style={{ padding:'0.875rem 1rem' }}>
                                                    <span style={{ fontFamily:'monospace', fontSize:'0.73rem', fontWeight:'600', color:'hsl(214 80% 46%)', backgroundColor:'hsl(214 100% 97%)', padding:'0.18rem 0.45rem', borderRadius:'0.3rem' }}>
                                                        {s.sub_ref}
                                                    </span>
                                                </td>

                                                {/* Plan */}
                                                <td style={{ padding:'0.875rem 1rem' }}>
                                                    <PlanTag name={s.plan_name} price={s.plan_price} cycle={s.plan_cycle} />
                                                </td>

                                                {/* Status */}
                                                <td style={{ padding:'0.875rem 1rem', textAlign:'center' }}>
                                                    <StatusBadge statusKey={s.status_key} grace={s.grace} />
                                                    {s.days_left !== null && (
                                                        <div style={{ fontSize:'0.67rem', marginTop:'0.25rem', color: s.days_left <= 5 ? 'hsl(0 62% 46%)' : 'hsl(220 15% 52%)', fontWeight:'600' }}>
                                                            {s.days_left}d left
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Provider */}
                                                <td style={{ padding:'0.875rem 1rem', fontSize:'0.8rem', color:'hsl(220 15% 42%)', whiteSpace:'nowrap' }}>
                                                    {s.provider}
                                                </td>

                                                {/* Started */}
                                                <td style={{ padding:'0.875rem 1rem', fontSize:'0.8rem', color:'hsl(220 15% 42%)', whiteSpace:'nowrap' }}>
                                                    {fmtDate(s.created_at)}
                                                </td>

                                                {/* Renews */}
                                                <td style={{ padding:'0.875rem 1rem', fontSize:'0.8rem', color:'hsl(220 15% 42%)', whiteSpace:'nowrap' }}>
                                                    {fmtDate(s.renews_at)}
                                                </td>

                                                {/* Actions */}
                                                <td style={{ padding:'0.875rem 1rem' }}>
                                                    <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'0.4rem', flexWrap:'wrap' }}>
                                                        <Link href={`/super-admin/subscriptions/${s._id}`}
                                                            style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.38rem 0.7rem', borderRadius:'0.45rem', fontSize:'0.75rem', fontWeight:'600', backgroundColor:'hsl(220 15% 93%)', color:'hsl(220 25% 28%)', textDecoration:'none', transition:'filter 0.12s', whiteSpace:'nowrap' }}
                                                            onMouseEnter={e => e.currentTarget.style.filter='brightness(0.92)'}
                                                            onMouseLeave={e => e.currentTarget.style.filter='none'}>
                                                            <Icons.eye /> View
                                                        </Link>

                                                        {isActive && (<>
                                                            <ActionBtn iconName="upgrade"  label="Upgrade"    onClick={() => setActionTarget({ sub:s, type:'upgrade' })}    bg="hsl(152 55% 92%)" color="hsl(152 55% 30%)" />
                                                            <ActionBtn iconName="gift"     label="Free Month" onClick={() => setActionTarget({ sub:s, type:'free_month' })} bg="hsl(270 55% 94%)" color="hsl(270 55% 40%)" />
                                                            <ActionBtn iconName="ban"      label="Suspend"    onClick={() => setActionTarget({ sub:s, type:'suspend' })}    bg="hsl(0 65% 95%)"   color="hsl(0 62% 45%)" />
                                                            <ActionBtn iconName="cancel"   label="Cancel"     onClick={() => setActionTarget({ sub:s, type:'cancel' })}     bg="hsl(220 15% 91%)" color="hsl(220 15% 38%)" />
                                                        </>)}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ── Pagination ── */}
                    {totalPages > 1 && (
                        <div style={{ padding:'0.875rem 1.5rem', borderTop:'1px solid hsl(220 15% 91%)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'0.75rem' }}>
                            <p style={{ margin:0, fontSize:'0.82rem', color:'hsl(220 15% 48%)' }}>
                                Showing <strong>{Math.min((page-1)*PAGE_SIZE+1, filtered.length)}</strong>–<strong>{Math.min(page*PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong>
                            </p>
                            <div style={{ display:'flex', gap:'0.35rem', alignItems:'center' }}>
                                <PagBtn onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} label={<Icons.chevL />} />
                                {(() => {
                                    const pages = [];
                                    if (totalPages <= 7) {
                                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                                    } else {
                                        pages.push(1);
                                        if (page > 3) pages.push('…');
                                        for (let i = Math.max(2, page-1); i <= Math.min(totalPages-1, page+1); i++) pages.push(i);
                                        if (page < totalPages - 2) pages.push('…');
                                        pages.push(totalPages);
                                    }
                                    return pages.map((p, i) =>
                                        p === '…'
                                            ? <span key={`e${i}`} style={{ padding:'0.45rem 0.4rem', color:'hsl(220 15% 55%)', fontSize:'0.82rem' }}>…</span>
                                            : <PagBtn key={p} onClick={() => setPage(p)} active={page === p} label={p} />
                                    );
                                })()}
                                <PagBtn onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} label={<Icons.chevR />} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </>
    );
};

SubscriptionsIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default SubscriptionsIndex;