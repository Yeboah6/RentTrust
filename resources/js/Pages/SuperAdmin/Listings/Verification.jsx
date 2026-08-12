import React, { useState, useRef, useMemo } from 'react';
import { Link, router, Head } from '@inertiajs/react';
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
    home:     () => <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" size="1.15rem" />,
    building: () => <Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" size="1.15rem" />,
    shield:   () => <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" size="1.15rem" />,
    alert:    () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    doc:      () => <Ico d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" size="0.85rem" />,
    image:    () => <Ico d={["M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z","M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM5 19l4.5-5.5 3 3.5L16 12l3 7"]} size="0.85rem" />,
    chevL:    () => <Ico d="M15 19l-7-7 7-7" size="0.8rem" />,
    chevR:    () => <Ico d="M9 5l7 7-7 7" size="0.8rem" />,
    external:  () => <Ico d={["M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6","M15 3h6v6M10 14L21 3"]} size="0.8rem" />,
    download:  () => <Ico d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" size="0.75rem" />,
    spinner:  () => (
        <svg style={{ width: '0.95rem', height: '0.95rem', animation: 'lvSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
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

const AVAILABILITY_CFG = {
    available:   { label: 'Available',   bg: 'hsl(152 55% 93%)', color: 'hsl(152 55% 30%)' },
    rented:      { label: 'Rented',      bg: 'hsl(270 60% 95%)', color: 'hsl(270 55% 38%)' },
    sold:        { label: 'Sold',        bg: 'hsl(214 100% 95%)',color: 'hsl(214 80% 38%)' },
    unavailable: { label: 'Unavailable', bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 38%)' },
};

const STATUSES = ['all', 'pending', 'approved', 'rejected'];
const PAGE_SIZE = 12;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return v; }
};

const avatarHue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

const isImageUrl = (path = '') => /\.(png|jpe?g|gif|webp|bmp)(\?.*)?$/i.test(path);

const docUrl = (path) => `/super-admin/admin/documents?path=${encodeURIComponent(path)}`;
const docDownloadUrl = (path) => `/super-admin/admin/documents/download?path=${encodeURIComponent(path)}`;

const docCount = (v) =>
    (v.ownership_documents?.length || 0) + (v.photos?.length || 0) + (v.other_documents?.length || 0);

// ─── Atoms ────────────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CFG[status] ?? STATUS_CFG.pending;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.52rem', borderRadius: '999px', fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.06em', backgroundColor: cfg.bg, color: cfg.color, whiteSpace: 'nowrap' }}>
            <span style={{ width: '0.33rem', height: '0.33rem', borderRadius: '50%', backgroundColor: cfg.dot, flexShrink: 0 }} />
            {cfg.label.toUpperCase()}
        </span>
    );
};

const AvailabilityBadge = ({ status }) => {
    const cfg = AVAILABILITY_CFG[status] ?? AVAILABILITY_CFG.available;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.16rem 0.46rem', borderRadius: '999px', fontSize: '0.6rem', fontWeight: '700', backgroundColor: cfg.bg, color: cfg.color, whiteSpace: 'nowrap' }}>
            {cfg.label}
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
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'lvSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {toast.type === 'error' ? <Icons.x /> : <Icons.check />}
        {toast.msg}
    </div>
) : null;

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

// ─── Documents modal ──────────────────────────────────────────────────────────

const DOC_SECTIONS = [
    { key: 'ownership_documents', label: 'Ownership / Authorization' },
    { key: 'photos', label: 'Property Photos' },
    { key: 'other_documents', label: 'Other Supporting Documents' },
];

const DocumentsModal = ({ verification, onClose }) => {
    if (!verification) return null;

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.6)', backdropFilter: 'blur(5px)', padding: '1rem' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto', backgroundColor: 'white', borderRadius: '1.15rem', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.28)', animation: 'lvModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid hsl(220 15% 91%)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ margin: '0 0 0.15rem', fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>Submitted Documents</h3>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(220 15% 50%)' }}>{verification.property_title}</p>
                    </div>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'hsl(220 15% 50%)', padding: '0.25rem' }}><Icons.x /></button>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {DOC_SECTIONS.map(section => {
                        const files = verification[section.key] || [];
                        return (
                            <div key={section.key}>
                                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'hsl(220 25% 22%)', marginBottom: '0.55rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    {section.label}
                                    <span style={{ fontSize: '0.68rem', fontWeight: '700', color: 'hsl(220 15% 55%)' }}>({files.length})</span>
                                </div>
                                {files.length === 0 ? (
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(220 15% 60%)', fontStyle: 'italic' }}>None submitted</p>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: '0.6rem' }}>
                                        {files.map((path, i) => {
                                            const view = docUrl(path);
                                            const download = docDownloadUrl(path);
                                            return (
                                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', border: '1px solid hsl(220 15% 90%)', borderRadius: '0.55rem', padding: '0.4rem', backgroundColor: 'hsl(220 15% 98%)' }}>
                                                    <a href={view} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', textDecoration: 'none' }}>
                                                        {isImageUrl(path) ? (
                                                            <img src={view} alt="" style={{ width: '100%', height: '72px', objectFit: 'cover', borderRadius: '0.4rem' }} />
                                                        ) : (
                                                            <div style={{ width: '100%', height: '72px', borderRadius: '0.4rem', backgroundColor: 'hsl(220 15% 93%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(220 15% 50%)' }}>
                                                                <Icons.doc />
                                                            </div>
                                                        )}
                                                    </a>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <a href={view} target="_blank" rel="noopener noreferrer"
                                                            style={{ fontSize: '0.62rem', color: 'hsl(214 80% 44%)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}>
                                                            View <Icons.external />
                                                        </a>
                                                        <a href={download}
                                                            style={{ fontSize: '0.62rem', color: 'hsl(220 15% 50%)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}>
                                                            <Icons.download />
                                                        </a>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {verification.notes && (
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'hsl(220 25% 22%)', marginBottom: '0.4rem' }}>Agent Notes</div>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: 'hsl(220 15% 40%)', lineHeight: 1.6, backgroundColor: 'hsl(220 15% 97%)', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.5rem', padding: '0.65rem 0.8rem' }}>{verification.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Approve / Reject modal ────────────────────────────────────────────────────

const ReviewModal = ({ verification, action, onConfirm, onClose, processing }) => {
    const [adminNotes, setAdminNotes] = useState('');
    if (!verification) return null;

    const isApprove = action === 'approve';
    const accent = isApprove ? 'hsl(152 55% 32%)' : 'hsl(0 65% 50%)';
    const accentBg = isApprove ? 'hsl(152 55% 93%)' : 'hsl(0 70% 95%)';
    const ActionIcon = isApprove ? Icons.check : Icons.ban;

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.6)', backdropFilter: 'blur(5px)', padding: '1rem' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '420px', backgroundColor: 'white', borderRadius: '1.15rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.28)', animation: 'lvModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ height: '4px', background: `linear-gradient(90deg, ${accent}, ${accent}88)` }} />
                <div style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
                        <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.75rem', backgroundColor: accentBg, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ActionIcon /></div>
                        <div>
                            <h3 style={{ margin: '0 0 0.1rem', fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>{isApprove ? 'Approve Verification' : 'Reject Verification'}</h3>
                            <p style={{ margin: 0, fontSize: '0.73rem', color: 'hsl(220 15% 50%)' }}>{verification.property_title}</p>
                        </div>
                    </div>

                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'hsl(220 25% 22%)', marginBottom: '0.4rem' }}>
                        Admin Notes {!isApprove && <span style={{ color: 'hsl(0 65% 50%)' }}>*</span>}
                    </label>
                    <textarea
                        value={adminNotes}
                        onChange={e => setAdminNotes(e.target.value)}
                        rows={3}
                        placeholder={isApprove ? 'Optional notes for this approval…' : 'Explain why this request is being rejected…'}
                        style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.55rem', fontSize: '0.82rem', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', marginBottom: '1.1rem', outline: 'none' }}
                    />

                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                        <button
                            onClick={() => onConfirm(adminNotes)}
                            disabled={processing || (!isApprove && !adminNotes.trim())}
                            style={{ flex: 2, padding: '0.625rem', borderRadius: '0.6rem', border: 'none', backgroundColor: processing || (!isApprove && !adminNotes.trim()) ? 'hsl(220 15% 70%)' : accent, color: 'white', fontSize: '0.85rem', fontWeight: '700', cursor: processing || (!isApprove && !adminNotes.trim()) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit' }}>
                            {processing ? <><Icons.spinner /> {isApprove ? 'Approving…' : 'Rejecting…'}</> : <><ActionIcon /> {isApprove ? 'Approve' : 'Reject'}</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Verification row ─────────────────────────────────────────────────────────

const VerificationRow = ({ v, index, onView, onReview }) => {
    const [hov, setHov] = useState(false);

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ position: 'relative', display: 'grid', gridTemplateColumns: '2.5rem minmax(0,1fr) 10rem 8rem 6rem 7rem 8rem', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', borderBottom: '1px solid hsl(220 15% 95%)', backgroundColor: hov ? 'hsl(220 20% 98.5%)' : 'white', transition: 'background-color 0.12s', animation: `lvRowIn 0.3s ease ${Math.min(index, 15) * 0.025}s both` }}>

            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', backgroundColor: 'hsl(220 15% 91%)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(220 15% 55%)' }}>
                {v.listing_image ? <img src={v.listing_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icons.home />}
            </div>

            <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.865rem', fontWeight: '700', color: 'hsl(220 25% 14%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.15rem' }}>{v.property_title}</div>
                <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 50%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📍 {v.property_address}</div>
            </div>

            <div style={{ minWidth: 0 }}>
                {v.agent_name ? (
                    <Link href={`/super-admin/agents/${v.user_id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', textDecoration: 'none' }}>
                        <div style={{ width: '1.65rem', height: '1.65rem', borderRadius: '50%', backgroundColor: `hsl(${avatarHue(v.agent_name)} 50% 88%)`, color: `hsl(${avatarHue(v.agent_name)} 50% 32%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: '800', flexShrink: 0 }}>
                            {v.agent_name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'hsl(214 80% 44%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.agent_name}</span>
                    </Link>
                ) : <span style={{ fontSize: '0.75rem', color: 'hsl(220 15% 55%)', fontStyle: 'italic' }}>Unknown</span>}
            </div>

            <div><AvailabilityBadge status={v.availability_status} /></div>

            <div>
                <button onClick={() => onView(v)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.28rem 0.55rem', borderRadius: '0.4rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 32%)', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <Icons.doc /> {docCount(v)}
                </button>
            </div>

            <div><StatusBadge status={v.status} /></div>

            <div style={{ fontSize: '0.73rem', color: 'hsl(220 15% 52%)' }}>{fmtDate(v.submitted_at)}</div>

            <div style={{
                position: 'absolute', right: '1.25rem', top: '50%',
                transform: hov ? 'translateY(-50%)' : 'translateY(-50%) translateX(4px)',
                display: 'flex', gap: '0.3rem', alignItems: 'center',
                opacity: hov ? 1 : 0,
                transition: 'opacity 0.15s ease, transform 0.15s ease',
                pointerEvents: hov ? 'auto' : 'none',
            }}>
                <Link href={`/super-admin/listings/${v.listing_id}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', textDecoration: 'none' }}>
                    <Icons.eye />
                </Link>
                {v.status === 'pending' && (
                    <>
                        <button onClick={() => onReview(v, 'approve')}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(152 55% 92%)', color: 'hsl(152 55% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>
                            <Icons.check />
                        </button>
                        <button onClick={() => onReview(v, 'reject')}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 48%)', cursor: 'pointer', fontFamily: 'inherit' }}>
                            <Icons.ban />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const VerificationsIndex = ({ verifications: raw = [], metrics: serverMetrics = {} }) => {
    const verifications = raw;

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);
    const [docsModal, setDocsModal] = useState(null);
    const [reviewModal, setReviewModal] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState(null);
    const [refreshing, refresh] = useRefresh(['verifications', 'metrics']);
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
                const okQ = !q
                    || (v.property_title || '').toLowerCase().includes(q)
                    || (v.property_address || '').toLowerCase().includes(q)
                    || (v.agent_name || '').toLowerCase().includes(q);
                const okSt = status === 'all' || v.status === status;
                return okQ && okSt;
            })
            .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
    }, [verifications, search, status]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const totalCount = serverMetrics.total ?? verifications.length;
    const pendingCount = serverMetrics.pending ?? verifications.filter(v => v.status === 'pending').length;
    const approvedCount = serverMetrics.approved ?? verifications.filter(v => v.status === 'approved').length;
    const rejectedCount = serverMetrics.rejected ?? verifications.filter(v => v.status === 'rejected').length;

    const confirmReview = (adminNotes) => {
        const { verification, action } = reviewModal;
        setProcessing(true);
        // Listing verifications live on their own route, distinct from the
        // agent-identity verification endpoints — same "approve"/"reject" verbs,
        // different resource. Also POST (matching the controllers), not PATCH.
        const url = `/super-admin/listing-verifications/${verification.id}/${action}`;
        const payload = action === 'approve'
            ? { admin_notes: adminNotes }
            : { rejection_reason: adminNotes };

        router.post(url, payload, {
            preserveScroll: true,
            onSuccess: () => {
                showToast(`Verification ${action === 'approve' ? 'approved' : 'rejected'}.`);
                setReviewModal(null);
                router.reload({ only: ['verifications', 'metrics'] });
            },
            onError: () => showToast('Action failed. Please try again.', 'error'),
            onFinish: () => setProcessing(false),
        });
    };

    const hasFilters = search || status !== 'all';

    return (
        <>
        <Head>
            <title>RentTrustGh | Listing Verifications</title>
        </Head>
            <Toast toast={toast} />
            {docsModal && <DocumentsModal verification={docsModal} onClose={() => setDocsModal(null)} />}
            {reviewModal && (
                <ReviewModal
                    verification={reviewModal.verification}
                    action={reviewModal.action}
                    onConfirm={confirmReview}
                    onClose={() => setReviewModal(null)}
                    processing={processing}
                />
            )}

            <div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.22rem', letterSpacing: '-0.02em' }}>Listing Verifications</h1>
                        <p style={{ fontSize: '0.82rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                            {totalCount.toLocaleString()} total · {pendingCount} awaiting review
                        </p>
                    </div>
                    <button onClick={refresh} disabled={refreshing}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 28%)', fontWeight: '600', fontSize: '0.83rem', cursor: refreshing ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                        {refreshing ? <><Icons.spinner /> Refreshing…</> : <><Icons.refresh /> Refresh</>}
                    </button>
                </div>

                {/* KPIs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <Kpi label="Total Requests" value={totalCount.toLocaleString()}   sub="All time"          accent="hsl(220 25% 15%)" iconBg="hsl(220 20% 93%)" iconColor="hsl(220 25% 30%)" icon={<Icons.shield />} />
                    <Kpi label="Pending"        value={pendingCount.toLocaleString()}  sub="Awaiting review"   accent="hsl(40 80% 36%)"  iconBg="hsl(40 90% 93%)"  iconColor="hsl(40 80% 36%)"  icon={<Icons.alert />} />
                    <Kpi label="Approved"       value={approvedCount.toLocaleString()} sub="Verified listings" accent="hsl(152 55% 33%)" iconBg="hsl(152 55% 92%)" iconColor="hsl(152 55% 35%)" icon={<Icons.check />} />
                    <Kpi label="Rejected"       value={rejectedCount.toLocaleString()} sub="Declined requests" accent="hsl(0 65% 44%)"   iconBg="hsl(0 70% 95%)"   iconColor="hsl(0 65% 44%)"   icon={<Icons.ban />} />
                </div>

                {/* Toolbar */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '0.875rem 1.1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 0 }}>
                            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)', pointerEvents: 'none', display: 'flex' }}><Icons.search /></span>
                            <input type="text" placeholder="Search title, address, agent…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                                style={{ width: '100%', padding: '0.52rem 0.75rem 0.52rem 2.25rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.55rem', fontSize: '0.855rem', color: 'hsl(220 25% 18%)', backgroundColor: 'hsl(220 15% 98.5%)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                        </div>

                        {hasFilters && (
                            <button onClick={() => { setSearch(''); setStatus('all'); setPage(1); }}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.7rem', borderRadius: '999px', border: '1px solid hsl(220 15% 86%)', backgroundColor: 'hsl(220 15% 96%)', color: 'hsl(220 15% 44%)', fontSize: '0.73rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                                <Icons.x /> Clear
                            </button>
                        )}

                        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'hsl(220 15% 52%)', whiteSpace: 'nowrap' }}>{filtered.length.toLocaleString()} result{filtered.length !== 1 ? 's' : ''}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'hsl(220 15% 52%)', marginRight: '0.2rem' }}>Status:</span>
                        {STATUSES.map(s => {
                            const a = status === s;
                            const cfg = STATUS_CFG[s];
                            return <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                                style={{ padding: '0.3rem 0.65rem', borderRadius: '999px', border: `1.5px solid ${a ? (cfg?.dot ?? 'hsl(220 25% 20%)') : 'hsl(220 15% 88%)'}`, fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', backgroundColor: a ? (cfg?.bg ?? 'hsl(220 25% 15%)') : 'transparent', color: a ? (cfg?.color ?? 'white') : 'hsl(220 15% 48%)' }}>
                                {s === 'all' ? 'All' : (cfg?.label ?? s)}
                            </button>;
                        })}
                    </div>
                </div>

                {/* Table */}
                {paginated.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px dashed hsl(220 15% 86%)' }}>
                        <div style={{ fontSize: '2.75rem', marginBottom: '0.875rem' }}>🛡️</div>
                        <p style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: '700', color: 'hsl(220 25% 22%)' }}>{search ? 'No requests found' : 'No verification requests yet'}</p>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'hsl(220 15% 55%)' }}>{search ? 'Try adjusting your search or filters.' : 'Requests submitted by agents will appear here.'}</p>
                    </div>
                ) : (
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2.5rem minmax(0,1fr) 10rem 8rem 6rem 7rem 8rem', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1.25rem', backgroundColor: 'hsl(220 15% 97.5%)', borderBottom: '1px solid hsl(220 15% 92%)' }}>
                            <div />
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Listing</div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Agent</div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Availability</div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Docs</div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Status</div>
                            <div style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>Submitted</div>
                        </div>

                        {paginated.map((v, i) => (
                            <VerificationRow
                                key={v.id}
                                v={v}
                                index={i}
                                onView={setDocsModal}
                                onReview={(verification, action) => setReviewModal({ verification, action })}
                            />
                        ))}

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
                @keyframes lvSpin    { to { transform: rotate(360deg); } }
                @keyframes lvSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes lvModalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes lvRowIn   { from { opacity:0; transform:translateX(-4px); } to { opacity:1; transform:translateX(0); } }
            `}</style>
        </>
    );
};

VerificationsIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default VerificationsIndex;