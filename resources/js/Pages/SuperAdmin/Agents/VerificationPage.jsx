import React, { useState, useRef, useMemo } from 'react';
import { Link, router, usePage, Head } from '@inertiajs/react';
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
    search:   () => <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    eye:      () => <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} size="0.85rem" />,
    check:    () => <Ico d="M5 13l4 4L19 7" size="0.85rem" />,
    x:        () => <Ico d="M6 18L18 6M6 6l12 12" size="0.85rem" />,
    refresh:  () => <Ico d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" size="0.9rem" />,
    ban:      () => <Ico d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" size="0.85rem" />,
    users:    () => <Ico d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" size="1.15rem" />,
    shield:   () => <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" size="1.15rem" />,
    alert:    () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    file:     () => <Ico d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" size="0.8rem" />,
    clock:    () => <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size="1.15rem" />,
    chevD:    () => <Ico d="M19 9l-7 7-7-7" size="0.8rem" />,
    chevU:    () => <Ico d="M5 15l7-7 7 7" size="0.8rem" />,
    chevL:    () => <Ico d="M15 19l-7-7 7-7" size="0.8rem" />,
    chevR:    () => <Ico d="M9 5l7 7-7 7" size="0.8rem" />,
    spinner:  () => (
        <svg style={{ width: '0.95rem', height: '0.95rem', animation: 'avSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
    pending:  { label: 'Pending',  bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 30%)',  dot: 'hsl(40 80% 44%)' },
    approved: { label: 'Approved', bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 28%)', dot: 'hsl(152 60% 38%)' },
    rejected: { label: 'Rejected', bg: 'hsl(0 70% 95%)',   color: 'hsl(0 65% 40%)',   dot: 'hsl(0 65% 50%)' },
};

const STATUSES = ['all', 'pending', 'approved', 'rejected'];
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
        if (diff < 60000)       return 'Just now';
        if (diff < 3600000)     return `${Math.floor(diff/60000)}m ago`;
        if (diff < 86400000)    return `${Math.floor(diff/3600000)}h ago`;
        if (diff < 2592000000)  return `${Math.floor(diff/86400000)}d ago`;
        return fmtDate(v);
    } catch { return v; }
};

const avatarHue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

const fileUrl = (path) => (path ? `/storage/${path}` : null);

const normalise = (v) => ({
    ...v,
    _id:        v.id,
    status_key: (v.status ?? 'pending').toLowerCase(),
});

// ─── Atoms ────────────────────────────────────────────────────────────────────

const StatusBadge = ({ sk }) => {
    const cfg = STATUS_CFG[sk] ?? STATUS_CFG.pending;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.52rem', borderRadius: '999px', fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.06em', backgroundColor: cfg.bg, color: cfg.color, whiteSpace: 'nowrap' }}>
            <span style={{ width: '0.33rem', height: '0.33rem', borderRadius: '50%', backgroundColor: cfg.dot, flexShrink: 0 }} />
            {cfg.label.toUpperCase()}
        </span>
    );
};

const DocChip = ({ label, path }) => {
    if (!path) return null;
    return (
        <a href={fileUrl(path)} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.28rem 0.55rem', borderRadius: '0.4rem', backgroundColor: 'hsl(214 100% 96%)', color: 'hsl(214 80% 42%)', fontSize: '0.7rem', fontWeight: '700', textDecoration: 'none', border: '1px solid hsl(214 60% 88%)' }}>
            <Icons.file /> {label}
        </a>
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
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'avSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {toast.type === 'error' ? <Icons.x /> : <Icons.check />}
        {toast.msg}
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

// ─── Review modal (approve / reject) ───────────────────────────────────────────

const ReviewModal = ({ verification: v, action, onConfirm, onClose, processing }) => {
    const [reason, setReason] = useState('');
    const hue = avatarHue(v.agent_name);

    const isApprove = action === 'approve';
    const accent    = isApprove ? 'hsl(152 55% 33%)' : 'hsl(0 65% 46%)';
    const accentBg  = isApprove ? 'hsl(152 55% 92%)'  : 'hsl(0 70% 95%)';
    const ActionIcon = isApprove ? Icons.check : Icons.ban;

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.6)', backdropFilter: 'blur(5px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '440px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.15rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.28)', animation: 'avModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ height: '4px', background: `linear-gradient(90deg, ${accent}, ${accent}88)` }} />
                <div style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                        <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.75rem', backgroundColor: accentBg, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ActionIcon /></div>
                        <div>
                            <h3 style={{ margin: '0 0 0.1rem', fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>{isApprove ? 'Approve Verification' : 'Reject Verification'}</h3>
                            <p style={{ margin: 0, fontSize: '0.73rem', color: 'hsl(220 15% 50%)' }}>{isApprove ? 'The agent will be marked as verified' : 'The agent will be notified and can resubmit'}</p>
                        </div>
                    </div>

                    {/* Agent preview */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem', borderRadius: '0.75rem', backgroundColor: 'hsl(220 15% 97%)', border: '1px solid hsl(220 15% 91%)', marginBottom: '1.1rem' }}>
                        <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 32%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '800', flexShrink: 0 }}>
                            {v.agent_name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'hsl(220 25% 15%)', marginBottom: '0.15rem' }}>{v.agent_name}</div>
                            <div style={{ fontSize: '0.73rem', color: 'hsl(220 15% 52%)' }}>{v.email}</div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                        <DocChip label="Gov ID" path={v.gov_id} />
                        <DocChip label="License" path={v.license_documents} />
                        <DocChip label="Proof of Address" path={v.proof_of_address} />
                    </div>

                    {!isApprove && (
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'hsl(220 25% 25%)', marginBottom: '0.4rem' }}>Reason for rejection</label>
                            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="Explain what's missing or incorrect so the agent can fix it…"
                                style={{ width: '100%', padding: '0.65rem 0.75rem', border: '1px solid hsl(220 15% 86%)', borderRadius: '0.55rem', fontSize: '0.83rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                            <p style={{ margin: '0.35rem 0 0', fontSize: '0.7rem', color: 'hsl(220 15% 55%)' }}>Visible to the agent when they resubmit.</p>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                        <button onClick={() => onConfirm(reason)} disabled={processing || (!isApprove && !reason.trim())}
                            style={{ flex: 2, padding: '0.625rem', borderRadius: '0.6rem', border: 'none', backgroundColor: processing || (!isApprove && !reason.trim()) ? 'hsl(220 15% 70%)' : accent, color: 'white', fontSize: '0.85rem', fontWeight: '700', cursor: processing || (!isApprove && !reason.trim()) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit' }}>
                            {processing ? <><Icons.spinner /> {isApprove ? 'Approving' : 'Rejecting'}…</> : <><ActionIcon /> {isApprove ? 'Approve' : 'Reject'}</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Verification card ─────────────────────────────────────────────────────────

const VerificationCard = ({ v, index, onAction }) => {
    const [hov, setHov] = useState(false);
    const hue   = avatarHue(v.agent_name);
    const stCfg = STATUS_CFG[v.status_key] ?? STATUS_CFG.pending;

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ backgroundColor: 'white', border: `1.5px solid ${hov ? stCfg.dot : 'hsl(220 15% 91%)'}`, borderRadius: '1rem', overflow: 'hidden', transition: 'all 0.22s ease', transform: hov ? 'translateY(-3px)' : 'none', boxShadow: hov ? '0 16px 40px hsl(220 20% 15% / 0.1)' : '0 1px 4px hsl(220 20% 15% / 0.05)', display: 'flex', flexDirection: 'column', animation: `avCardIn 0.35s ease ${Math.min(index, 15) * 0.04}s both` }}>

            <div style={{ height: '3px', background: `linear-gradient(90deg, ${stCfg.dot}, ${stCfg.dot}55)` }} />

            <div style={{ padding: '1.1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '900', border: `2px solid ${stCfg.bg}`, flexShrink: 0 }}>
                        {v.agent_name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'hsl(220 25% 13%)', margin: '0 0 0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.agent_name}</h3>
                        <StatusBadge sk={v.status_key} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32rem' }}>
                    <div style={{ fontSize: '0.73rem', color: 'hsl(220 15% 45%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>✉ {v.email || '—'}</div>
                    {v.phone_number && <div style={{ fontSize: '0.73rem', color: 'hsl(220 15% 45%)' }}>📞 {v.phone_number}</div>}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <DocChip label="Gov ID" path={v.gov_id} />
                    <DocChip label="License" path={v.license_documents} />
                    <DocChip label="Proof of Address" path={v.proof_of_address} />
                </div>

                {/* {v.status_key === 'rejected' && v.notes && ( */}
                    <div style={{ fontSize: '0.72rem', color: 'hsl(0 65% 42%)', backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 65% 90%)', borderRadius: '0.5rem', padding: '0.5rem 0.65rem', lineHeight: 1.5 }}>
                        {v.notes}
                    </div>
                {/* )} */}

                {v.admin_notes && (
                    <>
                    <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'hsl(220 25% 13%)', margin: '0 0 0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Admin Notes</p>
                    <div style={{ fontSize: '0.72rem', color: 'hsl(0 65% 42%)', backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 65% 90%)', borderRadius: '0.5rem', padding: '0.5rem 0.65rem', lineHeight: 1.5 }}>
                        {v.admin_notes}
                    </div>
                    </>
                )} 

                <div style={{ fontSize: '0.68rem', color: 'hsl(220 15% 55%)' }}>
                    Submitted {fmtRelative(v.submitted_at)}
                    {v.reviewed_at && <span> · Reviewed {fmtRelative(v.reviewed_at)}{v.reviewed_by ? ` by ${v.reviewed_by}` : ''}</span>}
                </div>
            </div>

            {v.status_key === 'pending' && (
                <div style={{ padding: '0.65rem 1rem', borderTop: '1px solid hsl(220 15% 95%)', display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => onAction(v, 'reject')}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', height: '1.9rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 46%)', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                        <Icons.ban /> Reject
                    </button>
                    <button onClick={() => onAction(v, 'approve')}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', height: '1.9rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(152 55% 92%)', color: 'hsl(152 55% 30%)', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                        <Icons.check /> Approve
                    </button>
                </div>
            )}
        </div>
    );
};

// ─── Verification row (list view) ──────────────────────────────────────────────

const VerificationRow = ({ v, index, onAction }) => {
    const [hov, setHov] = useState(false);
    const hue = avatarHue(v.agent_name);

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ position: 'relative', display: 'grid', gridTemplateColumns: '3rem minmax(0,1fr) 9rem 14rem 9rem 8rem', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', borderBottom: '1px solid hsl(220 15% 95%)', backgroundColor: hov ? 'hsl(220 20% 98.5%)' : 'white', transition: 'background-color 0.12s', animation: `avRowIn 0.3s ease ${Math.min(index, 15) * 0.025}s both` }}>

            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '800' }}>
                {v.agent_name.split(' ').map(w => w[0]).slice(0, 2).join('')}
            </div>

            <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'hsl(220 25% 14%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.agent_name}</div>
                <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 52%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.email}</div>
            </div>

            <div><StatusBadge sk={v.status_key} /></div>

            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                <DocChip label="ID" path={v.gov_id} />
                <DocChip label="License" path={v.license_documents} />
                <DocChip label="Address" path={v.proof_of_address} />
            </div>

            <div>
                <div style={{ fontSize: '0.73rem', fontWeight: '600', color: 'hsl(220 25% 22%)' }}>{fmtDate(v.submitted_at)}</div>
                {v.reviewed_at && <div style={{ fontSize: '0.65rem', color: 'hsl(220 15% 55%)' }}>Reviewed {fmtRelative(v.reviewed_at)}</div>}
            </div>

            <div style={{
                position: 'absolute', right: '1.25rem', top: '50%',
                transform: hov ? 'translateY(-50%)' : 'translateY(-50%) translateX(4px)',
                display: 'flex', gap: '0.3rem', alignItems: 'center',
                opacity: v.status_key === 'pending' ? (hov ? 1 : 0) : 0,
                transition: 'opacity 0.15s ease, transform 0.15s ease',
                pointerEvents: v.status_key === 'pending' && hov ? 'auto' : 'none',
            }}>
                <button onClick={() => onAction(v, 'reject')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 48%)', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.ban />
                </button>
                <button onClick={() => onAction(v, 'approve')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(152 55% 92%)', color: 'hsl(152 55% 30%)', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.check />
                </button>
            </div>
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const AgentVerificationsIndex = ({ verifications: raw = [] }) => {
    const verifications = useMemo(() => raw.map(normalise), [raw]);

    const [search,     setSearch]     = useState('');
    const [status,     setStatus]     = useState('pending');
    const [sortCol,    setSortCol]    = useState('submitted_at');
    const [sortDir,    setSortDir]    = useState('desc');
    const [viewMode,   setViewMode]   = useState('grid');
    const [page,       setPage]       = useState(1);
    const [modal,      setModal]      = useState(null);
    const [processing, setProcessing] = useState(false);
    const [toast,      setToast]      = useState(null);
    const [refreshing,   refresh]   = useRefresh(['verifications']);
    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return verifications
            .filter(v => {
                const okQ  = !q || v.agent_name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q) || (v.phone_number ?? '').toLowerCase().includes(q);
                const okSt = status === 'all' || v.status_key === status;
                return okQ && okSt;
            })
            .sort((a, b) => {
                let av = a[sortCol], bv = b[sortCol];
                if (['submitted_at','reviewed_at'].includes(sortCol)) { av = new Date(av || 0); bv = new Date(bv || 0); }
                if (typeof av === 'string') av = av.toLowerCase();
                if (typeof bv === 'string') bv = bv.toLowerCase();
                return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
            });
    }, [verifications, search, status, sortCol, sortDir]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleAction = (v, action) => setModal({ v, action });

    const confirmAction = (reason) => {
        const { v, action } = modal;
        setProcessing(true);
        const url = `/super-admin/verifications/${v._id}/${action}`;
        const payload = action === 'reject' ? { admin_notes: reason } : {};
        router.post(url, payload, {
            preserveScroll: true,
            onSuccess: () => {
                showToast(`${v.agent_name} ${action === 'approve' ? 'verified' : 'rejected'}.`);
                setModal(null);
                router.reload({ only: ['verifications'] });
            },
            onError:  () => showToast('Action failed.', 'error'),
            onFinish: () => setProcessing(false),
        });
    };

    const pendingCount  = verifications.filter(v => v.status_key === 'pending').length;
    const approvedCount = verifications.filter(v => v.status_key === 'approved').length;
    const rejectedCount = verifications.filter(v => v.status_key === 'rejected').length;

    const SortBtn = ({ col, label }) => {
        const active = sortCol === col;
        return (
            <button onClick={() => { if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortCol(col); setSortDir('desc'); } setPage(1); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: active ? 'hsl(220 25% 20%)' : 'hsl(220 15% 48%)', padding: 0, fontFamily: 'inherit' }}>
                {label}{active ? (sortDir === 'asc' ? <Icons.chevU /> : <Icons.chevD />) : <Icons.chevD />}
            </button>
        );
    };

    const hasFilters = search || status !== 'pending';

    return (
        <>
        <Head>
            <title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
        </Head>
            <Toast toast={toast} />
            {modal && (
                <ReviewModal
                    verification={modal.v}
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
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.22rem', letterSpacing: '-0.02em' }}>Agent Verification</h1>
                        <p style={{ fontSize: '0.82rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                            {verifications.length.toLocaleString()} submissions · {pendingCount} awaiting review
                        </p>
                    </div>
                    <button onClick={refresh} disabled={refreshing}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 28%)', fontWeight: '600', fontSize: '0.83rem', cursor: refreshing ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background-color 0.15s', flexShrink: 0 }}
                        onMouseEnter={e => { if (!refreshing) e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'; }}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                        {refreshing ? <><Icons.spinner /> Refreshing…</> : <><Icons.refresh /> Refresh</>}
                    </button>
                </div>

                {/* ── KPI strip ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <Kpi label="Total Submissions" value={verifications.length.toLocaleString()} sub="All time"           accent="hsl(220 25% 15%)" iconBg="hsl(220 20% 93%)" iconColor="hsl(220 25% 30%)" icon={<Icons.users />} />
                    <Kpi label="Pending Review"     value={pendingCount.toLocaleString()}          sub="Needs a decision" accent="hsl(40 80% 36%)"  iconBg="hsl(40 90% 93%)"  iconColor="hsl(40 80% 36%)"  icon={<Icons.clock />} />
                    <Kpi label="Approved"           value={approvedCount.toLocaleString()}          sub="Verified agents"  accent="hsl(152 55% 33%)" iconBg="hsl(152 55% 92%)" iconColor="hsl(152 55% 35%)" icon={<Icons.shield />} />
                    <Kpi label="Rejected"           value={rejectedCount.toLocaleString()}          sub="Can resubmit"     accent="hsl(0 65% 44%)"   iconBg="hsl(0 70% 95%)"   iconColor="hsl(0 65% 44%)"   icon={<Icons.ban />} />
                </div>

                {/* ── Toolbar ── */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '0.875rem 1.1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 0 }}>
                            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)', pointerEvents: 'none', display: 'flex' }}><Icons.search /></span>
                            <input type="text" placeholder="Search name, email, phone…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                                style={{ width: '100%', padding: '0.52rem 0.75rem 0.52rem 2.25rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.55rem', fontSize: '0.855rem', color: 'hsl(220 25% 18%)', backgroundColor: 'hsl(220 15% 98.5%)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                                onFocus={e => e.target.style.borderColor = 'hsl(220 60% 60%)'}
                                onBlur={e => e.target.style.borderColor = 'hsl(220 15% 88%)'} />
                        </div>

                        {viewMode === 'list' && (
                            <select value={`${sortCol}:${sortDir}`} onChange={e => { const [c, d] = e.target.value.split(':'); setSortCol(c); setSortDir(d); setPage(1); }}
                                style={{ padding: '0.52rem 0.875rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.55rem', fontSize: '0.82rem', backgroundColor: 'white', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', color: 'hsl(220 25% 22%)' }}>
                                <option value="submitted_at:desc">Newest first</option>
                                <option value="submitted_at:asc">Oldest first</option>
                                <option value="agent_name:asc">Name A–Z</option>
                            </select>
                        )}

                        {hasFilters && (
                            <button onClick={() => { setSearch(''); setStatus('pending'); setPage(1); }}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.7rem', borderRadius: '999px', border: '1px solid hsl(220 15% 86%)', backgroundColor: 'hsl(220 15% 96%)', color: 'hsl(220 15% 44%)', fontSize: '0.73rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                                <Icons.x /> Clear
                            </button>
                        )}

                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.2rem', backgroundColor: 'hsl(220 15% 96%)', borderRadius: '0.5rem', padding: '0.2rem', flexShrink: 0 }}>
                            {[['grid', '⊞'], ['list', '☰']].map(([v, label]) => (
                                <button key={v} onClick={() => { setViewMode(v); setPage(1); }}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem 0.6rem', borderRadius: '0.35rem', border: 'none', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.15s', backgroundColor: viewMode === v ? 'white' : 'transparent', color: viewMode === v ? 'hsl(220 25% 18%)' : 'hsl(220 15% 55%)', boxShadow: viewMode === v ? '0 1px 3px hsl(220 20% 15% / 0.1)' : 'none' }}>
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {STATUSES.map(s => {
                            const a   = status === s;
                            const cfg = STATUS_CFG[s];
                            return (
                                <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                                    style={{ padding: '0.3rem 0.65rem', borderRadius: '999px', border: `1.5px solid ${a ? (cfg?.dot ?? 'hsl(220 25% 22%)') : 'hsl(220 15% 88%)'}`, fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', backgroundColor: a ? (cfg?.bg ?? 'hsl(220 25% 15%)') : 'transparent', color: a ? (cfg?.color ?? 'white') : 'hsl(220 15% 48%)' }}>
                                    {s === 'all' ? `All (${verifications.length})` : `${cfg?.label ?? s} (${verifications.filter(vv => vv.status_key === s).length})`}
                                </button>
                            );
                        })}
                        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'hsl(220 15% 52%)' }}>{filtered.length.toLocaleString()} result{filtered.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                {/* ── Content ── */}
                {paginated.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px dashed hsl(220 15% 86%)' }}>
                        <div style={{ fontSize: '2.75rem', marginBottom: '0.875rem' }}>🪪</div>
                        <p style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: '700', color: 'hsl(220 25% 22%)' }}>{search ? 'No submissions found' : 'Nothing to review'}</p>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'hsl(220 15% 55%)' }}>{search ? 'Try a different search or filter.' : 'Verification submissions from agents will appear here.'}</p>
                    </div>

                ) : viewMode === 'grid' ? (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {paginated.map((v, i) => <VerificationCard key={v._id} v={v} index={i} onAction={handleAction} />)}
                        </div>
                        <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(220 15% 50%)' }}>Page <strong>{page}</strong> of <strong>{totalPages}</strong></p>
                            <Pagination page={page} total={totalPages} onChange={setPage} />
                        </div>
                    </>

                ) : (
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '3rem minmax(0,1fr) 9rem 14rem 9rem 8rem', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1.25rem', backgroundColor: 'hsl(220 15% 97.5%)', borderBottom: '1px solid hsl(220 15% 92%)' }}>
                            <div />
                            <div><SortBtn col="agent_name" label="Agent" /></div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Status</div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Documents</div>
                            <div><SortBtn col="submitted_at" label="Submitted" /></div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Actions</div>
                        </div>
                        {paginated.map((v, i) => <VerificationRow key={v._id} v={v} index={i} onAction={handleAction} />)}
                        <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'hsl(220 15% 98.5%)' }}>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(220 15% 50%)' }}>Page <strong style={{ color: 'hsl(220 25% 22%)' }}>{page}</strong> of <strong style={{ color: 'hsl(220 25% 22%)' }}>{totalPages}</strong> · {filtered.length.toLocaleString()} result{filtered.length !== 1 ? 's' : ''}</p>
                            <Pagination page={page} total={totalPages} onChange={setPage} />
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes avSpin    { to { transform: rotate(360deg); } }
                @keyframes avSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes avModalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes avCardIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
                @keyframes avRowIn   { from { opacity:0; transform:translateX(-4px); } to { opacity:1; transform:translateX(0); } }
            `}</style>
        </>
    );
};

AgentVerificationsIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default AgentVerificationsIndex;