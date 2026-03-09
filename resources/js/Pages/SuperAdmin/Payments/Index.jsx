import React, { useState, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icon = ({ d, size = '1rem', fill = 'none', ...rest }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill={fill} stroke="currentColor" viewBox="0 0 24 24" {...rest}>
        {Array.isArray(d)
            ? d.map((p, i) => <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d={p} />)
            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d={d} />}
    </svg>
);

const Icons = {
    search:   () => <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    download: () => <Icon d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
    eye:      () => <Icon d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} />,
    refund:   () => <Icon d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    resolve:  () => <Icon d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    server:   () => <Icon d={["M5 12h14","M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"]} />,
    chevron:  ({ dir = 'down' }) => {
        const rotate = { up: 'rotate(180deg)', left: 'rotate(90deg)', right: 'rotate(-90deg)', down: 'none' }[dir];
        return <Icon d="M19 9l-7 7-7-7" style={{ width: '0.875rem', height: '0.875rem', transform: rotate, flexShrink: 0 }} />;
    },
    alert:    () => <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size="1.25rem" />,
    x:        () => <Icon d="M6 18L18 6M6 6l12 12" size="1rem" />,
    dollar:   () => <Icon d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size="1.1rem" />,
    trending: () => <Icon d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" size="1.1rem" />,
    clock:    () => <Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size="1.1rem" />,
    warning:  () => <Icon d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" size="1.1rem" />,
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
    paid:        { label: 'Paid',       bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 30%)', dot: 'hsl(152 60% 40%)' },
    success:     { label: 'Paid',       bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 30%)', dot: 'hsl(152 60% 40%)' },
    successful:  { label: 'Paid',       bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 30%)', dot: 'hsl(152 60% 40%)' },
    pending:     { label: 'Pending',    bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 35%)',  dot: 'hsl(40 80% 48%)' },
    failed:      { label: 'Failed',     bg: 'hsl(0 70% 94%)',   color: 'hsl(0 65% 42%)',   dot: 'hsl(0 65% 52%)' },
    refunded:    { label: 'Refunded',   bg: 'hsl(214 100% 95%)',color: 'hsl(214 80% 40%)', dot: 'hsl(214 80% 52%)' },
    cancelled:   { label: 'Cancelled',  bg: 'hsl(0 70% 94%)',   color: 'hsl(0 65% 42%)',   dot: 'hsl(0 65% 52%)' },
    processing:  { label: 'Processing', bg: 'hsl(270 60% 95%)', color: 'hsl(270 60% 40%)', dot: 'hsl(270 60% 54%)' },
    resolved:    { label: 'Resolved',   bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 30%)', dot: 'hsl(152 60% 40%)' },
};

const METHOD_CFG = {
    card:          { label: 'Card',         color: 'hsl(214 80% 48%)' },
    bank_transfer: { label: 'Bank Transfer',color: 'hsl(152 60% 35%)' },
    paypal:        { label: 'PayPal',       color: 'hsl(214 90% 38%)' },
    crypto:        { label: 'Crypto',       color: 'hsl(40 80% 40%)'  },
    mobile_money:  { label: 'Mobile Money', color: 'hsl(270 60% 45%)' },
    momo:          { label: 'Mobile Money', color: 'hsl(270 60% 45%)' },
};

const ROLE_CFG = {
    agent: { bg: 'hsl(174 62% 93%)', color: 'hsl(174 62% 30%)' },
    admin: { bg: 'hsl(214 100% 94%)',color: 'hsl(214 80% 40%)' },
    user:  { bg: 'hsl(220 15% 91%)', color: 'hsl(220 15% 40%)' },
};

const STATUSES  = ['all','paid','pending','processing','refunded','failed','cancelled'];
const PAY_TYPES = ['all','subscription','boost','lead unlock'];
const DATE_OPTS = [
    { value: 'all',   label: 'All Time'     },
    { value: 'today', label: 'Today'        },
    { value: 'week',  label: 'Last 7 Days'  },
    { value: 'month', label: 'Last 30 Days' },
];
const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return v; }
};

const inRange = (dateStr, range) => {
    if (range === 'all' || !dateStr) return true;
    const diff = (Date.now() - new Date(dateStr)) / 86400000;
    if (range === 'today') return diff < 1;
    return diff <= (range === 'week' ? 7 : 30);
};

const normalise = (p) => ({
    ...p,
    _id:            p.id,
    reference:      p.reference ?? `#${p.id}`,
    user_name:      p.user?.name    ?? p.user_name    ?? '—',
    email:          p.user?.email   ?? p.email        ?? '',
    user_role:      (p.user?.role   ?? p.user_role    ?? 'user').toLowerCase(),
    payment_type:   p.payment_type  ?? 'Subscription',
    plan_name:      p.plan?.name    ?? p.plan_name    ?? '—',
    amount_num:     parseFloat(p.amount_raw ?? p.amount ?? 0),
    status_key:     (p.status ?? 'pending').toLowerCase(),
    currency:       p.currency      ?? 'GHS',
    method_key:     (p.payment_method ?? p.provider ?? p.method ?? '').toLowerCase().replace(/[\s-]+/g,'_'),
    failure_reason: p.failure_reason ?? null,
    created_at:     p.created_at    ?? p.date ?? '',
});

// ─── Small UI atoms ───────────────────────────────────────────────────────────

const StatusBadge = ({ statusKey }) => {
    const c = STATUS_CFG[statusKey] ?? { label: statusKey, bg: 'hsl(220 15% 92%)', color: 'hsl(220 15% 40%)', dot: 'hsl(220 15% 55%)' };
    return (
        <span style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', padding:'0.25rem 0.65rem', borderRadius:'999px', fontSize:'0.68rem', fontWeight:'700', letterSpacing:'0.06em', backgroundColor:c.bg, color:c.color }}>
            <span style={{ width:'0.38rem', height:'0.38rem', borderRadius:'50%', backgroundColor:c.dot }} />
            {c.label.toUpperCase()}
        </span>
    );
};

const MethodTag = ({ methodKey }) => {
    const c = METHOD_CFG[methodKey] ?? { label: methodKey || '—', color: 'hsl(220 15% 45%)' };
    return <span style={{ fontSize:'0.72rem', fontWeight:'600', color:c.color }}>{c.label}</span>;
};

const RoleBadge = ({ role }) => {
    const c = ROLE_CFG[role] ?? ROLE_CFG.user;
    return (
        <span style={{ display:'inline-block', padding:'0.2rem 0.55rem', borderRadius:'999px', fontSize:'0.67rem', fontWeight:'700', letterSpacing:'0.05em', backgroundColor:c.bg, color:c.color }}>
            {role.toUpperCase()}
        </span>
    );
};

// ─── Summary card ─────────────────────────────────────────────────────────────

const SummaryCard = ({ label, value, sub, iconEl, accentBg, accentColor }) => (
    <div style={{ backgroundColor:'white', borderRadius:'0.875rem', border:'1px solid hsl(220 15% 91%)', padding:'1.1rem 1.25rem', boxShadow:'0 1px 4px hsl(220 20% 15% / 0.05)', display:'flex', alignItems:'center', gap:'0.875rem' }}>
        <div style={{ width:'2.5rem', height:'2.5rem', borderRadius:'0.65rem', backgroundColor:accentBg, color:accentColor, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            {iconEl}
        </div>
        <div>
            <div style={{ fontSize:'1.25rem', fontWeight:'800', color:'hsl(220 25% 15%)', lineHeight:1 }}>{value}</div>
            <div style={{ fontSize:'0.72rem', fontWeight:'600', color:'hsl(220 15% 48%)', marginTop:'0.2rem' }}>{label}</div>
            {sub && <div style={{ fontSize:'0.67rem', color:'hsl(220 15% 60%)' }}>{sub}</div>}
        </div>
    </div>
);

// ─── Refund modal ─────────────────────────────────────────────────────────────

const RefundModal = ({ payment, onConfirm, onClose, processing }) => (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'hsl(220 25% 8% / 0.55)', backdropFilter:'blur(4px)' }}>
        <div onClick={e => e.stopPropagation()} style={{ width:'100%', maxWidth:'430px', margin:'1rem', backgroundColor:'white', borderRadius:'1.1rem', padding:'2rem', boxShadow:'0 32px 72px hsl(220 25% 8% / 0.22)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem' }}>
                <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
                    <div style={{ width:'2.6rem', height:'2.6rem', borderRadius:'0.75rem', backgroundColor:'hsl(40 90% 93%)', color:'hsl(40 75% 40%)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Icons.alert />
                    </div>
                    <div>
                        <h3 style={{ margin:'0 0 0.15rem', fontSize:'1rem', fontWeight:'800', color:'hsl(220 25% 14%)' }}>Confirm Refund</h3>
                        <p style={{ margin:0, fontSize:'0.75rem', color:'hsl(220 15% 50%)' }}>This action cannot be undone</p>
                    </div>
                </div>
                <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'hsl(220 15% 55%)', display:'flex', padding:'0.25rem' }}><Icons.x /></button>
            </div>

            <div style={{ backgroundColor:'hsl(220 15% 97%)', border:'1px solid hsl(220 15% 91%)', borderRadius:'0.75rem', padding:'1rem', marginBottom:'1.1rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem 1.25rem' }}>
                {[
                    ['Reference', payment.reference],
                    ['User',      payment.user_name],
                    ['Amount',    `${payment.currency} ${Number(payment.amount_num).toFixed(2)}`],
                    ['Type',      payment.payment_type],
                ].map(([k,v]) => (
                    <div key={k}>
                        <div style={{ fontSize:'0.62rem', fontWeight:'700', letterSpacing:'0.09em', color:'hsl(220 15% 52%)', textTransform:'uppercase' }}>{k}</div>
                        <div style={{ fontSize:'0.84rem', fontWeight:'600', color:'hsl(220 25% 16%)', marginTop:'0.1rem' }}>{v ?? '—'}</div>
                    </div>
                ))}
            </div>

            <div style={{ padding:'0.7rem 0.9rem', borderRadius:'0.55rem', backgroundColor:'hsl(40 90% 96%)', border:'1px solid hsl(40 70% 82%)', fontSize:'0.77rem', color:'hsl(40 65% 32%)', lineHeight:1.55, marginBottom:'1.25rem' }}>
                The full amount will be returned to the customer's original payment method. Refunds are permanent.
            </div>

            <div style={{ display:'flex', gap:'0.65rem' }}>
                <button onClick={onClose} style={{ flex:1, padding:'0.625rem', borderRadius:'0.6rem', border:'1px solid hsl(220 15% 88%)', backgroundColor:'white', fontSize:'0.85rem', fontWeight:'600', color:'hsl(220 25% 30%)', cursor:'pointer' }}>Cancel</button>
                <button onClick={onConfirm} disabled={processing} style={{ flex:2, padding:'0.625rem', borderRadius:'0.6rem', border:'none', backgroundColor: processing ? 'hsl(40 65% 55%)' : 'hsl(40 80% 45%)', color:'white', fontSize:'0.85rem', fontWeight:'700', cursor: processing ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.45rem' }}>
                    <Icons.refund /> {processing ? 'Processing…' : 'Issue Refund'}
                </button>
            </div>
        </div>
    </div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ toast }) => {
    if (!toast) return null;
    const isErr = toast.type === 'error';
    return (
        <div style={{ position:'fixed', top:'1.25rem', right:'1.25rem', zIndex:100, display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.85rem 1.25rem', borderRadius:'0.75rem', backgroundColor: isErr ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color:'white', fontWeight:'600', fontSize:'0.875rem', boxShadow:'0 8px 28px hsl(220 25% 8% / 0.22)', animation:'slideIn 0.2s ease' }}>
            {toast.msg}
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const PaymentsIndex = ({ payments: raw = [] }) => {
    const initial = raw.map(normalise);

    const [payments,       setPayments]       = useState(initial);
    const [search,         setSearch]         = useState('');
    const [filterStatus,   setFilterStatus]   = useState('all');
    const [filterType,     setFilterType]     = useState('all');
    const [filterDate,     setFilterDate]     = useState('all');
    const [sortField,      setSortField]      = useState('created_at');
    const [sortDir,        setSortDir]        = useState('desc');
    const [hoveredRow,     setHoveredRow]     = useState(null);
    const [page,           setPage]           = useState(1);
    const [serverBusy,     setServerBusy]     = useState(false);
    const [refundTarget,   setRefundTarget]   = useState(null);
    const [refunding,      setRefunding]      = useState(false);
    const [toast,          setToast]          = useState(null);

    const toastTimer = useRef(null);
    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    // ── sort ──────────────────────────────────────────────────────────────────
    const toggleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
        setPage(1);
    };

    // ── filter + sort ─────────────────────────────────────────────────────────
    const filtered = payments
        .filter(p => {
            const q = search.toLowerCase();
            const matchSearch = !q
                || p.reference.toLowerCase().includes(q)
                || p.user_name.toLowerCase().includes(q)
                || p.email.toLowerCase().includes(q)
                || p.plan_name.toLowerCase().includes(q);
            const paidKeys = ['paid','success','successful'];
            const matchStatus = filterStatus === 'all'
                || p.status_key === filterStatus
                || (filterStatus === 'paid' && paidKeys.includes(p.status_key));
            const matchType = filterType === 'all'
                || p.payment_type.toLowerCase() === filterType;
            const matchDate = inRange(p.created_at, filterDate);
            return matchSearch && matchStatus && matchType && matchDate;
        })
        .sort((a, b) => {
            const map = { reference:'reference', user:'user_name', plan:'plan_name', amount:'amount_num', status:'status_key', created_at:'created_at' };
            const key = map[sortField] ?? 'created_at';
            const av = a[key] ?? '', bv = b[key] ?? '';
            const cmp = av < bv ? -1 : av > bv ? 1 : 0;
            return sortDir === 'asc' ? cmp : -cmp;
        });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // ── summary stats ─────────────────────────────────────────────────────────
    const paidKeys = ['paid','success','successful'];
    const totalRevenue = payments
        .filter(p => paidKeys.includes(p.status_key))
        .reduce((s, p) => s + p.amount_num, 0);
    const pendingCount = payments.filter(p => p.status_key === 'pending').length;
    const failedCount  = payments.filter(p => ['failed','cancelled'].includes(p.status_key)).length;
    const refundedCount= payments.filter(p => p.status_key === 'refunded').length;

    // ── server search ─────────────────────────────────────────────────────────
    const handleServerSearch = async () => {
        setServerBusy(true);
        try {
            const params = new URLSearchParams();
            if (search)               params.set('search', search);
            if (filterStatus !== 'all') params.set('status', filterStatus);
            if (filterType   !== 'all') params.set('type',   filterType);
            if (filterDate   !== 'all') params.set('date',   filterDate);
            const res  = await fetch(`/admin/payments/filter?${params}`);
            const data = await res.json();
            setPayments(data.map(normalise));
            setPage(1);
        } catch {
            showToast('Server search failed.', 'error');
        } finally {
            setServerBusy(false);
        }
    };

    const clearFilters = () => {
        setSearch(''); setFilterStatus('all'); setFilterType('all'); setFilterDate('all');
        setPayments(initial); setPage(1);
    };

    // ── actions ───────────────────────────────────────────────────────────────
    const handleRefund = () => {
        if (!refundTarget) return;
        setRefunding(true);
        router.post(`/admin/payments/${refundTarget._id}/refund`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setPayments(prev => prev.map(p => p._id === refundTarget._id ? { ...p, status_key: 'refunded' } : p));
                showToast('Payment refunded successfully.');
                setRefundTarget(null);
            },
            onError: () => showToast('Refund failed. Please try again.', 'error'),
            onFinish: () => setRefunding(false),
        });
    };

    const handleMarkResolved = (payment) => {
        router.patch(`/admin/payments/${payment._id}/resolve`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setPayments(prev => prev.map(p => p._id === payment._id ? { ...p, status_key: 'resolved' } : p));
                showToast('Payment marked as resolved.');
            },
            onError: () => showToast('Could not resolve payment.', 'error'),
        });
    };

    const exportCSV = () => {
        const rows  = [['Reference','User','Email','Role','Type','Plan','Amount','Currency','Status','Method','Date']];
        filtered.forEach(p => rows.push([p.reference, p.user_name, p.email, p.user_role, p.payment_type, p.plan_name, p.amount_num.toFixed(2), p.currency, p.status_key, p.method_key, p.created_at]));
        const csv = rows.map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
        const a   = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: 'payments.csv' });
        a.click();
    };

    // ── sort-able th ──────────────────────────────────────────────────────────
    const SortTh = ({ field, label, align = 'left' }) => {
        const active = sortField === field;
        return (
            <th onClick={() => toggleSort(field)} style={{ padding:'0.75rem 1rem', fontSize:'0.68rem', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', color: active ? 'hsl(220 25% 25%)' : 'hsl(220 15% 50%)', textAlign:align, cursor:'pointer', userSelect:'none', whiteSpace:'nowrap', backgroundColor: active ? 'hsl(220 20% 97%)' : 'hsl(220 15% 97.5%)', borderBottom:'1px solid hsl(220 15% 91%)', transition:'background-color 0.12s' }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem' }}>
                    {label}
                    <span style={{ opacity: active ? 1 : 0.3 }}>
                        <Icons.chevron dir={active && sortDir === 'desc' ? 'up' : 'down'} />
                    </span>
                </span>
            </th>
        );
    };

    const PlainTh = ({ label, align = 'left' }) => (
        <th style={{ padding:'0.75rem 1rem', fontSize:'0.68rem', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', color:'hsl(220 15% 50%)', textAlign:align, backgroundColor:'hsl(220 15% 97.5%)', borderBottom:'1px solid hsl(220 15% 91%)' }}>{label}</th>
    );

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <>
            <Toast toast={toast} />
            {refundTarget && (
                <RefundModal payment={refundTarget} onConfirm={handleRefund} onClose={() => setRefundTarget(null)} processing={refunding} />
            )}

            <div>
                {/* ── Page header ── */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize:'1.5rem', fontWeight:'800', color:'hsl(220 25% 14%)', margin:'0 0 0.2rem' }}>Payments</h1>
                        <p style={{ fontSize:'0.875rem', color:'hsl(220 15% 50%)', margin:0 }}>
                            {filtered.length.toLocaleString()} of {payments.length.toLocaleString()} transaction{payments.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button onClick={exportCSV} style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', padding:'0.55rem 1.1rem', borderRadius:'0.6rem', border:'none', cursor:'pointer', backgroundColor:'hsl(220 25% 15%)', color:'white', fontWeight:'600', fontSize:'0.8rem', transition:'background-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'}>
                        <Icons.download /> Export CSV
                    </button>
                </div>

                {/* ── Summary cards ── */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'0.875rem', marginBottom:'1.5rem' }}>
                    <SummaryCard
                        label="Total Revenue" sub="Successful payments"
                        value={`${initial[0]?.currency ?? 'GHS'} ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 })}`}
                        iconEl={<Icons.dollar />} accentBg="hsl(152 55% 92%)" accentColor="hsl(152 55% 33%)"
                    />
                    <SummaryCard
                        label="Total Transactions" sub={`${filtered.length} matching`}
                        value={payments.length.toLocaleString()}
                        iconEl={<Icons.trending />} accentBg="hsl(214 100% 94%)" accentColor="hsl(214 80% 48%)"
                    />
                    <SummaryCard
                        label="Pending" sub="Awaiting confirmation"
                        value={pendingCount}
                        iconEl={<Icons.clock />} accentBg="hsl(40 90% 93%)" accentColor="hsl(40 75% 40%)"
                    />
                    <SummaryCard
                        label="Failed / Cancelled" sub={`${refundedCount} refunded`}
                        value={failedCount}
                        iconEl={<Icons.warning />} accentBg="hsl(0 65% 94%)" accentColor="hsl(0 62% 48%)"
                    />
                </div>

                {/* ── Filter bar ── */}
                <div style={{ backgroundColor:'white', border:'1px solid hsl(220 15% 91%)', borderRadius:'0.875rem', padding:'1.1rem 1.25rem', marginBottom:'1rem', boxShadow:'0 1px 3px hsl(220 20% 15% / 0.04)' }}>

                    {/* Row 1: inputs */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 160px 160px auto', gap:'0.75rem', marginBottom:'0.875rem', alignItems:'end' }}>

                        {/* Search */}
                        <div>
                            <label style={{ display:'block', fontSize:'0.68rem', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', color:'hsl(220 15% 52%)', marginBottom:'0.3rem' }}>Search</label>
                            <div style={{ position:'relative' }}>
                                <span style={{ position:'absolute', left:'0.7rem', top:'50%', transform:'translateY(-50%)', color:'hsl(220 15% 55%)', pointerEvents:'none', display:'flex' }}><Icons.search /></span>
                                <input
                                    type="text"
                                    placeholder="Reference, user, email, plan…"
                                    value={search}
                                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                                    onKeyDown={e => e.key === 'Enter' && handleServerSearch()}
                                    style={{ width:'100%', padding:'0.55rem 0.75rem 0.55rem 2.25rem', border:'1px solid hsl(220 15% 88%)', borderRadius:'0.55rem', fontSize:'0.85rem', color:'hsl(220 25% 18%)', outline:'none', boxSizing:'border-box', fontFamily:'inherit' }}
                                />
                            </div>
                        </div>

                        {/* Type */}
                        <div>
                            <label style={{ display:'block', fontSize:'0.68rem', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', color:'hsl(220 15% 52%)', marginBottom:'0.3rem' }}>Type</label>
                            <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }} style={{ width:'100%', padding:'0.55rem 0.75rem', border:'1px solid hsl(220 15% 88%)', borderRadius:'0.55rem', fontSize:'0.82rem', backgroundColor:'white', outline:'none', cursor:'pointer', color:'hsl(220 25% 18%)', fontFamily:'inherit' }}>
                                {PAY_TYPES.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                            </select>
                        </div>

                        {/* Date range */}
                        <div>
                            <label style={{ display:'block', fontSize:'0.68rem', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', color:'hsl(220 15% 52%)', marginBottom:'0.3rem' }}>Date Range</label>
                            <select value={filterDate} onChange={e => { setFilterDate(e.target.value); setPage(1); }} style={{ width:'100%', padding:'0.55rem 0.75rem', border:'1px solid hsl(220 15% 88%)', borderRadius:'0.55rem', fontSize:'0.82rem', backgroundColor:'white', outline:'none', cursor:'pointer', color:'hsl(220 25% 18%)', fontFamily:'inherit' }}>
                                {DATE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>

                        {/* Server search */}
                        <button onClick={handleServerSearch} disabled={serverBusy} style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', padding:'0.55rem 1rem', borderRadius:'0.55rem', border:'none', cursor: serverBusy ? 'not-allowed' : 'pointer', backgroundColor:'hsl(174 55% 32%)', color:'white', fontWeight:'600', fontSize:'0.8rem', opacity: serverBusy ? 0.7 : 1, whiteSpace:'nowrap', alignSelf:'flex-end', fontFamily:'inherit' }}>
                            <Icons.server /> {serverBusy ? 'Searching…' : 'Search DB'}
                        </button>
                    </div>

                    {/* Row 2: status pills + clear */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem' }}>
                        <div style={{ display:'flex', gap:'0.3rem', flexWrap:'wrap' }}>
                            {STATUSES.map(s => (
                                <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }} style={{ padding:'0.35rem 0.85rem', borderRadius:'999px', border:'none', fontSize:'0.72rem', fontWeight:'600', letterSpacing:'0.04em', cursor:'pointer', transition:'all 0.15s', backgroundColor: filterStatus === s ? 'hsl(220 25% 15%)' : 'hsl(220 15% 93%)', color: filterStatus === s ? 'white' : 'hsl(220 15% 45%)', fontFamily:'inherit' }}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            ))}
                        </div>
                        <button onClick={clearFilters} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'0.78rem', fontWeight:'600', color:'hsl(220 15% 50%)', fontFamily:'inherit' }}>
                            Clear all
                        </button>
                    </div>
                </div>

                {/* ── Table ── */}
                <div style={{ backgroundColor:'white', border:'1px solid hsl(220 15% 91%)', borderRadius:'0.875rem', overflow:'hidden', boxShadow:'0 1px 4px hsl(220 20% 15% / 0.05)' }}>
                    {paginated.length === 0 ? (
                        <div style={{ padding:'4rem 2rem', textAlign:'center' }}>
                            <div style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>💳</div>
                            <p style={{ fontSize:'0.9rem', color:'hsl(220 15% 50%)', margin:0 }}>No payments match your current filters.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX:'auto' }}>
                            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'900px' }}>
                                <thead>
                                    <tr>
                                        <SortTh field="reference" label="Reference" />
                                        <SortTh field="user"      label="User" />
                                        <PlainTh label="Role" />
                                        <PlainTh label="Type · Method" />
                                        <SortTh field="plan"      label="Plan" />
                                        <SortTh field="amount"    label="Amount" align="right" />
                                        <SortTh field="status"    label="Status" align="center" />
                                        <SortTh field="created_at" label="Date" />
                                        <PlainTh label="Actions" align="right" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginated.map(p => {
                                        const canRefund  = paidKeys.includes(p.status_key);
                                        const canResolve = p.status_key === 'failed';
                                        return (
                                            <tr key={p._id}
                                                onMouseEnter={() => setHoveredRow(p._id)}
                                                onMouseLeave={() => setHoveredRow(null)}
                                                style={{ borderBottom:'1px solid hsl(220 15% 94%)', backgroundColor: hoveredRow === p._id ? 'hsl(220 25% 98.5%)' : 'white', transition:'background-color 0.1s' }}>

                                                {/* Reference */}
                                                <td style={{ padding:'0.875rem 1rem' }}>
                                                    <span style={{ fontFamily:'monospace', fontSize:'0.77rem', fontWeight:'600', color:'hsl(214 80% 46%)', backgroundColor:'hsl(214 100% 97%)', padding:'0.2rem 0.5rem', borderRadius:'0.35rem', letterSpacing:'0.02em' }}>
                                                        {p.reference}
                                                    </span>
                                                </td>

                                                {/* User */}
                                                <td style={{ padding:'0.875rem 1rem' }}>
                                                    <div style={{ fontSize:'0.875rem', fontWeight:'600', color:'hsl(220 25% 15%)' }}>{p.user_name}</div>
                                                    {p.email && <div style={{ fontSize:'0.72rem', color:'hsl(220 15% 55%)' }}>{p.email}</div>}
                                                </td>

                                                {/* Role */}
                                                <td style={{ padding:'0.875rem 1rem' }}>
                                                    <RoleBadge role={p.user_role} />
                                                </td>

                                                {/* Type + method */}
                                                <td style={{ padding:'0.875rem 1rem' }}>
                                                    <div style={{ fontSize:'0.82rem', fontWeight:'600', color:'hsl(220 25% 20%)' }}>{p.payment_type}</div>
                                                    <MethodTag methodKey={p.method_key} />
                                                </td>

                                                {/* Plan */}
                                                <td style={{ padding:'0.875rem 1rem', fontSize:'0.82rem', color:'hsl(220 25% 30%)' }}>
                                                    {p.plan_name}
                                                </td>

                                                {/* Amount */}
                                                <td style={{ padding:'0.875rem 1rem', textAlign:'right', whiteSpace:'nowrap' }}>
                                                    <span style={{ fontSize:'0.9rem', fontWeight:'700', color:'hsl(220 25% 15%)' }}>
                                                        {p.currency} {p.amount_num.toFixed(2)}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td style={{ padding:'0.875rem 1rem', textAlign:'center' }}>
                                                    <StatusBadge statusKey={p.status_key} />
                                                    {p.failure_reason && (
                                                        <div style={{ fontSize:'0.67rem', color:'hsl(0 62% 46%)', marginTop:'0.25rem', maxWidth:'130px', margin:'0.2rem auto 0', lineHeight:1.3 }}>
                                                            {p.failure_reason}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Date */}
                                                <td style={{ padding:'0.875rem 1rem', fontSize:'0.8rem', color:'hsl(220 15% 42%)', whiteSpace:'nowrap' }}>
                                                    {fmtDate(p.created_at)}
                                                </td>

                                                {/* Actions */}
                                                <td style={{ padding:'0.875rem 1rem' }}>
                                                    <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'0.4rem' }}>
                                                        <Link href={`/super-admin/payments/${p._id}`}
                                                            style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.38rem 0.7rem', borderRadius:'0.45rem', fontSize:'0.75rem', fontWeight:'600', backgroundColor:'hsl(220 15% 93%)', color:'hsl(220 25% 28%)', textDecoration:'none', transition:'filter 0.12s', whiteSpace:'nowrap' }}
                                                            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.93)'}
                                                            onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                                            <Icons.eye /> View
                                                        </Link>

                                                        {canRefund && (
                                                            <button onClick={() => setRefundTarget(p)}
                                                                style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.38rem 0.7rem', borderRadius:'0.45rem', fontSize:'0.75rem', fontWeight:'600', backgroundColor:'hsl(40 90% 93%)', color:'hsl(40 75% 38%)', border:'none', cursor:'pointer', transition:'filter 0.12s', whiteSpace:'nowrap', fontFamily:'inherit' }}
                                                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.92)'}
                                                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                                                <Icons.refund /> Refund
                                                            </button>
                                                        )}

                                                        {canResolve && (
                                                            <button onClick={() => handleMarkResolved(p)}
                                                                style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.38rem 0.7rem', borderRadius:'0.45rem', fontSize:'0.75rem', fontWeight:'600', backgroundColor:'hsl(152 55% 92%)', color:'hsl(152 55% 30%)', border:'none', cursor:'pointer', transition:'filter 0.12s', whiteSpace:'nowrap', fontFamily:'inherit' }}
                                                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.92)'}
                                                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                                                <Icons.resolve /> Resolve
                                                            </button>
                                                        )}
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
                                <PagBtn onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} label={<Icons.chevron dir="left" />} />
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
                                <PagBtn onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} label={<Icons.chevron dir="right" />} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }`}</style>
        </>
    );
};

const PagBtn = ({ onClick, disabled, active, label }) => (
    <button onClick={onClick} disabled={disabled} style={{ minWidth:'2.2rem', height:'2.2rem', padding:'0 0.5rem', display:'inline-flex', alignItems:'center', justifyContent:'center', border:'1px solid hsl(220 15% 88%)', borderRadius:'0.5rem', backgroundColor: active ? 'hsl(220 25% 15%)' : 'white', color: active ? 'white' : 'hsl(220 15% 45%)', fontSize:'0.82rem', fontWeight:'600', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, fontFamily:'inherit' }}>
        {label}
    </button>
);

PaymentsIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default PaymentsIndex;