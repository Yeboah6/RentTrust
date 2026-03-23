import React, { useState, useRef, useMemo } from 'react';
import { Link, router } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

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
    star:     () => <Ico d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" size="1.15rem" />,
    flag:     () => <Ico d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" size="1.15rem" />,
    phone:    () => <Ico d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" size="1.15rem" />,
    check:    () => <Ico d="M5 13l4 4L19 7" size="0.85rem" />,
    checkC:   () => <Ico d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    xC:       () => <Ico d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" size="0.8rem" />,
    x:        () => <Ico d="M6 18L18 6M6 6l12 12" size="0.85rem" />,
    trash:    () => <Ico d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" size="0.85rem" />,
    eye:      () => <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} size="0.85rem" />,
    reply:    () => <Ico d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" size="0.85rem" />,
    alert:    () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    chevD:    () => <Ico d="M19 9l-7 7-7-7" size="0.8rem" />,
    chevL:    () => <Ico d="M15 19l-7-7 7-7" size="0.8rem" />,
    chevR:    () => <Ico d="M9 5l7 7-7 7" size="0.8rem" />,
    spinner:  () => (
        <svg style={{ width: '0.9rem', height: '0.9rem', animation: 'rvSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Config ───────────────────────────────────────────────────────────────────

const REPORT_STATUS_CFG = {
    pending:    { label: 'Pending',    bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 30%)',  dot: 'hsl(40 80% 44%)' },
    resolved:   { label: 'Resolved',  bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 28%)', dot: 'hsl(152 60% 38%)' },
    dismissed:  { label: 'Dismissed', bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)' },
    reviewing:  { label: 'Reviewing', bg: 'hsl(214 100% 95%)',color: 'hsl(214 80% 38%)', dot: 'hsl(214 80% 50%)' },
};

const PAGE_SIZE = 10;

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

// ─── Atoms ────────────────────────────────────────────────────────────────────

const StarRating = ({ rating = 0, size = '0.9rem' }) => (
    <div style={{ display: 'flex', gap: '0.1rem' }}>
        {[1,2,3,4,5].map(i => (
            <svg key={i} style={{ width: size, height: size }} viewBox="0 0 24 24" fill={i <= rating ? 'hsl(38 92% 50%)' : 'none'} stroke={i <= rating ? 'hsl(38 92% 50%)' : 'hsl(220 15% 70%)'} strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ))}
    </div>
);

const StatusBadge = ({ status, cfg }) => {
    const c = cfg ?? REPORT_STATUS_CFG[status?.toLowerCase()] ?? REPORT_STATUS_CFG.pending;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.52rem', borderRadius: '999px', fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.06em', backgroundColor: c.bg, color: c.color, whiteSpace: 'nowrap' }}>
            <span style={{ width: '0.33rem', height: '0.33rem', borderRadius: '50%', backgroundColor: c.dot, flexShrink: 0 }} />
            {c.label.toUpperCase()}
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
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'rvSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

// ─── Detail drawer ────────────────────────────────────────────────────────────

const DetailDrawer = ({ item, type, onClose, onAction, processing }) => {
    const [replyText, setReplyText] = useState(item?.response ?? '');

    if (!item) return null;
    const hue = avatarHue(item.full_name ?? item.reviewer_name ?? 'U');

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', justifyContent: 'flex-end', backgroundColor: 'hsl(222 28% 8% / 0.45)', backdropFilter: 'blur(4px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '460px', height: '100%', backgroundColor: 'white', boxShadow: '-20px 0 60px hsl(220 28% 6% / 0.18)', display: 'flex', flexDirection: 'column', animation: 'rvDrawerIn 0.25s cubic-bezier(0.16,1,0.3,1)' }}>

                {/* Drawer header */}
                <div style={{ background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))', padding: '1.5rem 1.75rem', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.07) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: '800', color: 'white' }}>
                                {type === 'review' ? 'Review Details' : type === 'report' ? 'Report Details' : 'App Review Details'}
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.72rem', color: 'hsl(220 20% 55%)' }}>#{item.id}</p>
                        </div>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 20% 55%)', padding: '0.2rem', display: 'flex', transition: 'color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'hsl(220 20% 55%)'}>
                            <Icons.x />
                        </button>
                    </div>
                </div>

                {/* Drawer body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>

                    {/* Reviewer info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem', borderRadius: '0.75rem', backgroundColor: 'hsl(220 15% 97.5%)', border: '1px solid hsl(220 15% 91%)', marginBottom: '1.25rem' }}>
                        <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: '800', flexShrink: 0 }}>
                            {(item.full_name ?? item.reviewer_name ?? 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'hsl(220 25% 14%)' }}>{item.full_name ?? item.reviewer_name ?? 'Anonymous'}</div>
                            <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 52%)', marginTop: '0.1rem' }}>{fmtDate(item.created_at)}</div>
                        </div>
                        {type === 'review' && <div style={{ marginLeft: 'auto', flexShrink: 0 }}><StarRating rating={item.overall_rating} /></div>}
                        {type === 'report' && <div style={{ marginLeft: 'auto' }}><StatusBadge status={item.status} /></div>}
                    </div>

                    {/* Content */}
                    {type === 'review' && (
                        <>
                            {/* Check items */}
                            {[
                                { key: 'landlord_responsive',        label: 'Landlord was responsive' },
                                { key: 'property_matched_description',label: 'Property matched description' },
                                { key: 'fair_pricing',               label: 'Fair pricing' },
                                { key: 'good_communication',         label: 'Good communication' },
                            ].filter(c => item[c.key] !== null && item[c.key] !== undefined).map(c => (
                                <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.82rem', color: item[c.key] ? 'hsl(152 55% 32%)' : 'hsl(220 15% 48%)' }}>
                                    {item[c.key]
                                        ? <span style={{ display: 'flex', color: 'hsl(152 55% 40%)' }}><Icons.checkC /></span>
                                        : <span style={{ display: 'flex', color: 'hsl(220 15% 55%)' }}><Icons.xC /></span>
                                    }
                                    {c.label}
                                </div>
                            ))}

                            {item.comments && (
                                <div style={{ marginTop: '1rem', padding: '0.875rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 15% 97.5%)', border: '1px solid hsl(220 15% 91%)', fontSize: '0.83rem', color: 'hsl(220 15% 35%)', lineHeight: 1.65, fontStyle: 'italic' }}>
                                    "{item.comments}"
                                </div>
                            )}

                            {/* Related listing — clickable link to super admin listing view */}
                            {(item.listing_title ?? item.property_title) && (
                                <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '0.65rem', backgroundColor: 'hsl(214 100% 97%)', border: '1px solid hsl(214 80% 88%)' }}>
                                    <p style={{ margin: '0 0 0.4rem', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(214 80% 46%)' }}>Related Listing</p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '0.83rem', fontWeight: '600', color: 'hsl(220 25% 18%)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.listing_title ?? item.property_title}
                                        </span>
                                        {item.listing_id && (
                                            <Link href={`/super-admin/listings/${item.listing_id}`}
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.75rem', borderRadius: '0.5rem', backgroundColor: 'hsl(214 80% 46%)', color: 'white', fontSize: '0.75rem', fontWeight: '700', textDecoration: 'none', flexShrink: 0, transition: 'filter 0.15s' }}
                                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                                <Icons.eye /> View Listing
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Admin reply */}
                            <div style={{ marginTop: '1.25rem' }}>
                                <p style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)' }}>
                                    {item.response ? 'Edit Reply' : 'Add Reply'}
                                </p>
                                <textarea
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    placeholder="Write a response to this review…"
                                    rows={3}
                                    style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1.5px solid hsl(220 15% 88%)', borderRadius: '0.6rem', fontSize: '0.855rem', color: 'hsl(220 25% 16%)', resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.5 }}
                                    onFocus={e => e.target.style.borderColor = 'hsl(220 60% 55%)'}
                                    onBlur={e => e.target.style.borderColor = 'hsl(220 15% 88%)'}
                                />
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                                    <button onClick={() => onAction('reply', item.id, replyText)} disabled={processing || !replyText.trim()}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem', borderRadius: '0.55rem', border: 'none', backgroundColor: (!replyText.trim() || processing) ? 'hsl(220 15% 88%)' : 'hsl(220 25% 15%)', color: (!replyText.trim() || processing) ? 'hsl(220 15% 55%)' : 'white', fontWeight: '700', fontSize: '0.8rem', cursor: (!replyText.trim() || processing) ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                                        {processing ? <Icons.spinner /> : <Icons.reply />} {item.response ? 'Update Reply' : 'Post Reply'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {type === 'app_review' && (
                        <>
                            {item.comments && (
                                <div style={{ padding: '0.875rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 15% 97.5%)', border: '1px solid hsl(220 15% 91%)', fontSize: '0.83rem', color: 'hsl(220 15% 35%)', lineHeight: 1.65, fontStyle: 'italic' }}>
                                    "{item.comments}"
                                </div>
                            )}
                            <div style={{ marginTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid hsl(220 15% 94%)' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'hsl(220 15% 52%)' }}>Rating</span>
                                    <StarRating rating={item.overall_rating} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid hsl(220 15% 94%)' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'hsl(220 15% 52%)' }}>Submitted</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'hsl(220 25% 18%)' }}>{fmtDate(item.created_at)}</span>
                                </div>
                            </div>
                        </>
                    )}

                    {type === 'report' && (
                        <>
                            <div style={{ marginBottom: '1rem' }}>
                                <p style={{ margin: '0 0 0.25rem', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)' }}>Report Type</p>
                                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 18%)' }}>{item.report_type}</p>
                            </div>
                            {item.title && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)' }}>Title</p>
                                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 18%)' }}>{item.title}</p>
                                </div>
                            )}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <p style={{ margin: '0 0 0.25rem', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)' }}>Description</p>
                                <p style={{ margin: 0, fontSize: '0.83rem', color: 'hsl(220 15% 35%)', lineHeight: 1.65 }}>{item.report_description ?? item.description}</p>
                            </div>

                            {/* Reported listing — clickable link */}
                            {(item.listing_title ?? item.property_title) && (
                                <div style={{ marginBottom: '1.25rem', padding: '0.75rem', borderRadius: '0.65rem', backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 65% 88%)' }}>
                                    <p style={{ margin: '0 0 0.4rem', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(0 65% 44%)' }}>Reported Listing</p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '0.83rem', fontWeight: '600', color: 'hsl(220 25% 18%)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.listing_title ?? item.property_title}
                                        </span>
                                        {item.listing_id && (
                                            <Link href={`/super-admin/listings/${item.listing_id}`}
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.75rem', borderRadius: '0.5rem', backgroundColor: 'hsl(0 65% 50%)', color: 'white', fontSize: '0.75rem', fontWeight: '700', textDecoration: 'none', flexShrink: 0, transition: 'filter 0.15s' }}
                                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                                <Icons.eye /> View Listing
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Status action buttons */}
                            <div>
                                <p style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)' }}>Update Status</p>
                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                    {[
                                        { status: 'reviewing',  label: 'Mark Reviewing', bg: 'hsl(214 100% 95%)',  color: 'hsl(214 80% 42%)' },
                                        { status: 'resolved',   label: 'Mark Resolved',  bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 28%)' },
                                        { status: 'dismissed',  label: 'Dismiss',         bg: 'hsl(220 15% 93%)',  color: 'hsl(220 15% 38%)' },
                                    ].map(btn => (
                                        <button key={btn.status}
                                            onClick={() => onAction('report_status', item.id, btn.status)}
                                            disabled={processing || item.status?.toLowerCase() === btn.status}
                                            style={{ padding: '0.45rem 0.75rem', borderRadius: '0.5rem', border: 'none', backgroundColor: item.status?.toLowerCase() === btn.status ? 'hsl(220 15% 90%)' : btn.bg, color: item.status?.toLowerCase() === btn.status ? 'hsl(220 15% 52%)' : btn.color, fontSize: '0.75rem', fontWeight: '700', cursor: (processing || item.status?.toLowerCase() === btn.status) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: processing ? 0.7 : 1 }}>
                                            {btn.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Drawer footer — delete */}
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid hsl(220 15% 93%)', flexShrink: 0 }}>
                    <button onClick={() => onAction('delete', item.id)} disabled={processing}
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '0.6rem', border: 'none', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 44%)', fontSize: '0.83rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontFamily: 'inherit' }}>
                        <Icons.trash /> Delete {type === 'report' ? 'Report' : 'Review'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Review row ───────────────────────────────────────────────────────────────

const ReviewRow = ({ item, type, index, onView }) => {
    const [hov, setHov] = useState(false);
    const hue = avatarHue(item.full_name ?? item.reviewer_name ?? 'U');
    const name = item.full_name ?? item.reviewer_name ?? 'Anonymous';

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ display: 'grid', gridTemplateColumns: type === 'report' ? '2.5rem minmax(0,1fr) 12rem 10rem 7rem auto' : '2.5rem minmax(0,1fr) 8rem 12rem 7rem auto', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', borderBottom: '1px solid hsl(220 15% 95%)', backgroundColor: hov ? 'hsl(220 20% 98.5%)' : 'white', transition: 'background-color 0.12s', animation: `rvRowIn 0.3s ease ${Math.min(index, 15) * 0.025}s both`, cursor: 'default' }}>

            {/* Avatar */}
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: `hsl(${hue} 50% 88%)`, color: `hsl(${hue} 50% 28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '800', flexShrink: 0 }}>
                {name.split(' ').map(w => w[0]).slice(0, 2).join('')}
            </div>

            {/* Name + meta */}
            <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'hsl(220 25% 14%)', marginBottom: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
                <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 52%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {type === 'report'
                        ? (item.title ?? item.report_type ?? '—')
                        : (item.comments ? `"${item.comments.slice(0, 60)}${item.comments.length > 60 ? '…' : ''}"` : '—')
                    }
                </div>
            </div>

            {/* Col 3 */}
            {type === 'report' ? (
                <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'hsl(220 25% 22%)' }}>{item.report_type}</div>
                    {/* Listing link inline in row */}
                    {item.listing_title && (
                        item.listing_id
                            ? <Link href={`/super-admin/listings/${item.listing_id}`}
                                style={{ fontSize: '0.68rem', color: 'hsl(214 80% 46%)', marginTop: '0.1rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'none', fontWeight: '600' }}
                                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                                ↗ {item.listing_title}
                              </Link>
                            : <div style={{ fontSize: '0.68rem', color: 'hsl(220 15% 55%)', marginTop: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.listing_title}</div>
                    )}
                </div>
            ) : (
                <StarRating rating={item.overall_rating} />
            )}

            {/* Col 4 */}
            {type === 'report' ? (
                <StatusBadge status={item.status} />
            ) : (
                // Listing name — clickable if listing_id is available
                item.listing_id
                    ? <Link href={`/super-admin/listings/${item.listing_id}`}
                        style={{ fontSize: '0.72rem', color: 'hsl(214 80% 46%)', fontWeight: '600', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                        ↗ {item.listing_title ?? item.property_title}
                      </Link>
                    : <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 52%)' }}>
                        {item.listing_title ?? item.property_title ?? '—'}
                      </div>
            )}

            {/* Date */}
            <div style={{ fontSize: '0.73rem', color: 'hsl(220 15% 52%)' }}>{fmtRelative(item.created_at)}</div>

            {/* View */}
            <button onClick={() => onView(item)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.65rem', borderRadius: '0.45rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.73rem', fontWeight: '700', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsl(220 20% 96%)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; }}>
                <Icons.eye /> View
            </button>
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const ReviewsReports = ({
    reviews:    rawReviews    = [],
    reports:    rawReports    = [],
    app_reviews: rawAppReviews = [],
}) => {
    const [activeTab,  setActiveTab]  = useState('reviews');
    const [search,     setSearch]     = useState('');
    const [filter,     setFilter]     = useState('all');
    const [page,       setPage]       = useState(1);
    const [drawer,     setDrawer]     = useState(null);  // { item, type }
    const [processing, setProcessing] = useState(false);
    const [toast,      setToast]      = useState(null);
    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const TAB_CFG = [
        { key: 'reviews',    label: 'Rent Reviews',  icon: Icons.star,  count: rawReviews.length },
        { key: 'reports',    label: 'Reports',        icon: Icons.flag,  count: rawReports.length },
        { key: 'app_reviews',label: 'App Reviews',    icon: Icons.phone, count: rawAppReviews.length },
    ];

    const activeData = activeTab === 'reviews' ? rawReviews : activeTab === 'reports' ? rawReports : rawAppReviews;

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return activeData.filter(item => {
            const name  = (item.full_name ?? item.reviewer_name ?? '').toLowerCase();
            const text  = (item.comments ?? item.report_description ?? item.title ?? '').toLowerCase();
            const type  = (item.report_type ?? '').toLowerCase();
            const okQ   = !q || name.includes(q) || text.includes(q) || type.includes(q);
            const okF   = filter === 'all' ||
                (activeTab === 'reports' && item.status?.toLowerCase() === filter) ||
                (activeTab !== 'reports' && String(Math.floor(item.overall_rating)) === filter);
            return okQ && okF;
        });
    }, [activeData, search, filter, activeTab]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleTabChange = (tab) => { setActiveTab(tab); setSearch(''); setFilter('all'); setPage(1); setDrawer(null); };

    const handleAction = (action, id, payload) => {
        setProcessing(true);
        const urlMap = {
            reply:         `/super-admin/reviews/${id}/reply`,
            report_status: `/super-admin/reports/${id}/status`,
            delete:        drawer?.type === 'report'
                ? `/super-admin/reports/${id}`
                : `/super-admin/reviews/${id}`,
        };
        const method = action === 'delete' ? 'delete' : 'post';
        const data   = action === 'reply'         ? { response: payload }
                     : action === 'report_status' ? { status: payload }
                     : {};

        router[method](urlMap[action], data, {
            preserveScroll: true,
            onSuccess: () => {
                showToast(
                    action === 'delete'        ? 'Deleted successfully.'          :
                    action === 'reply'         ? 'Reply posted successfully.'     :
                    action === 'report_status' ? `Status updated to ${payload}.`  : 'Done.'
                );
                if (action === 'delete') setDrawer(null);
                router.reload({ only: ['reviews', 'reports', 'app_reviews'] });
            },
            onError:  () => showToast('Action failed. Please try again.', 'error'),
            onFinish: () => setProcessing(false),
        });
    };

    // KPIs
    const avgRating     = rawReviews.length ? (rawReviews.reduce((s, r) => s + (r.overall_rating ?? 0), 0) / rawReviews.length).toFixed(1) : '—';
    const pendingRpts   = rawReports.filter(r => r.status?.toLowerCase() === 'pending').length;
    const avgAppRating  = rawAppReviews.length ? (rawAppReviews.reduce((s, r) => s + (r.overall_rating ?? 0), 0) / rawAppReviews.length).toFixed(1) : '—';

    const FILTER_OPTIONS = activeTab === 'reports'
        ? [{ v: 'all', l: 'All' }, { v: 'pending', l: 'Pending' }, { v: 'reviewing', l: 'Reviewing' }, { v: 'resolved', l: 'Resolved' }, { v: 'dismissed', l: 'Dismissed' }]
        : [{ v: 'all', l: 'All Stars' }, { v: '5', l: '⭐ 5 Stars' }, { v: '4', l: '⭐ 4 Stars' }, { v: '3', l: '⭐ 3 Stars' }, { v: '2', l: '⭐ 2 Stars' }, { v: '1', l: '⭐ 1 Star' }];

    return (
        <>
            <Toast toast={toast} />
            {drawer && (
                <DetailDrawer
                    item={drawer.item}
                    type={drawer.type}
                    onClose={() => setDrawer(null)}
                    onAction={handleAction}
                    processing={processing}
                />
            )}

            <div>
                {/* ── Header ── */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.22rem', letterSpacing: '-0.02em' }}>Reviews & Reports</h1>
                    <p style={{ fontSize: '0.82rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                        {rawReviews.length} rent reviews · {rawReports.length} reports · {rawAppReviews.length} app reviews
                    </p>
                </div>

                {/* ── KPI strip ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <Kpi label="Rent Reviews"     value={rawReviews.length}    sub="From tenants"        accent="hsl(220 25% 15%)"  iconBg="hsl(220 20% 93%)"   iconColor="hsl(220 25% 30%)" icon={<Icons.star />} />
                    <Kpi label="Avg Rent Rating"  value={avgRating}            sub="Out of 5 stars"      accent="hsl(38 80% 44%)"   iconBg="hsl(38 90% 93%)"   iconColor="hsl(38 80% 44%)"  icon={<Icons.star />} />
                    <Kpi label="Pending Reports"  value={pendingRpts}          sub="Need attention"      accent="hsl(0 65% 44%)"    iconBg="hsl(0 70% 95%)"    iconColor="hsl(0 65% 44%)"   icon={<Icons.flag />} />
                    <Kpi label="Avg App Rating"   value={avgAppRating}         sub="Platform reviews"    accent="hsl(152 55% 35%)"  iconBg="hsl(152 55% 92%)"  iconColor="hsl(152 55% 35%)" icon={<Icons.phone />} />
                </div>

                {/* ── Tab bar + content ── */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>

                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid hsl(220 15% 91%)', backgroundColor: 'hsl(220 15% 97.5%)' }}>
                        {TAB_CFG.map(tab => {
                            const TabIcon = tab.icon;
                            const active = activeTab === tab.key;
                            return (
                                <button key={tab.key} onClick={() => handleTabChange(tab.key)}
                                    style={{ flex: 1, padding: '0.875rem 1rem', border: 'none', backgroundColor: active ? 'white' : 'transparent', borderBottom: `2px solid ${active ? 'hsl(220 25% 22%)' : 'transparent'}`, marginBottom: '-1px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                                    <span style={{ color: active ? 'hsl(220 25% 22%)' : 'hsl(220 15% 52%)', display: 'flex' }}><TabIcon /></span>
                                    <span style={{ fontSize: '0.82rem', fontWeight: active ? '700' : '500', color: active ? 'hsl(220 25% 15%)' : 'hsl(220 15% 50%)' }}>{tab.label}</span>
                                    <span style={{ fontSize: '0.65rem', fontWeight: '800', padding: '0.1rem 0.45rem', borderRadius: '999px', backgroundColor: active ? 'hsl(220 25% 15%)' : 'hsl(220 15% 88%)', color: active ? 'white' : 'hsl(220 15% 48%)' }}>{tab.count}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Toolbar */}
                    <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid hsl(220 15% 93%)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {/* Search */}
                        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 0 }}>
                            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)', pointerEvents: 'none', display: 'flex' }}><Icons.search /></span>
                            <input type="text" placeholder="Search name, comment, type…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                                style={{ width: '100%', padding: '0.52rem 0.75rem 0.52rem 2.25rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.55rem', fontSize: '0.855rem', color: 'hsl(220 25% 18%)', backgroundColor: 'hsl(220 15% 98.5%)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                                onFocus={e => e.target.style.borderColor = 'hsl(220 60% 60%)'}
                                onBlur={e => e.target.style.borderColor = 'hsl(220 15% 88%)'} />
                        </div>

                        {/* Filter pills */}
                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                            {FILTER_OPTIONS.map(opt => (
                                <button key={opt.v} onClick={() => { setFilter(opt.v); setPage(1); }}
                                    style={{ padding: '0.3rem 0.65rem', borderRadius: '999px', border: `1.5px solid ${filter === opt.v ? 'hsl(220 25% 22%)' : 'hsl(220 15% 88%)'}`, fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', backgroundColor: filter === opt.v ? 'hsl(220 25% 15%)' : 'transparent', color: filter === opt.v ? 'white' : 'hsl(220 15% 48%)', transition: 'all 0.15s' }}>
                                    {opt.l}
                                </button>
                            ))}
                        </div>

                        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'hsl(220 15% 52%)', whiteSpace: 'nowrap' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
                    </div>

                    {/* Table header */}
                    {paginated.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'reports' ? '2.5rem minmax(0,1fr) 12rem 10rem 7rem auto' : '2.5rem minmax(0,1fr) 8rem 12rem 7rem auto', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1.25rem', backgroundColor: 'hsl(220 15% 97.5%)', borderBottom: '1px solid hsl(220 15% 93%)', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>
                            <div />
                            <div>Reviewer</div>
                            <div>{activeTab === 'reports' ? 'Type' : 'Rating'}</div>
                            <div>{activeTab === 'reports' ? 'Status' : 'Listing'}</div>
                            <div>Date</div>
                            <div />
                        </div>
                    )}

                    {/* Rows */}
                    {paginated.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                                {activeTab === 'reviews' ? '⭐' : activeTab === 'reports' ? '🚩' : '📱'}
                            </div>
                            <p style={{ margin: '0 0 0.3rem', fontSize: '1rem', fontWeight: '700', color: 'hsl(220 25% 22%)' }}>
                                {search ? 'No results found' : `No ${activeTab.replace('_', ' ')} yet`}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: 'hsl(220 15% 55%)' }}>
                                {search ? 'Try adjusting your search.' : 'They will appear here once submitted.'}
                            </p>
                        </div>
                    ) : (
                        paginated.map((item, i) => (
                            <ReviewRow
                                key={item.id}
                                item={item}
                                type={activeTab === 'app_reviews' ? 'app_review' : activeTab === 'reports' ? 'report' : 'review'}
                                index={i}
                                onView={(item) => setDrawer({ item, type: activeTab === 'app_reviews' ? 'app_review' : activeTab === 'reports' ? 'report' : 'review' })}
                            />
                        ))
                    )}

                    {/* Footer */}
                    {paginated.length > 0 && (
                        <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'hsl(220 15% 98.5%)' }}>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(220 15% 50%)' }}>
                                Page <strong style={{ color: 'hsl(220 25% 22%)' }}>{page}</strong> of <strong style={{ color: 'hsl(220 25% 22%)' }}>{totalPages}</strong>
                            </p>
                            <Pagination page={page} total={totalPages} onChange={setPage} />
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes rvSpin     { to { transform: rotate(360deg); } }
                @keyframes rvSlideIn  { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes rvRowIn    { from { opacity:0; transform:translateX(-4px); } to { opacity:1; transform:translateX(0); } }
                @keyframes rvDrawerIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
            `}</style>
        </>
    );
};

ReviewsReports.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default ReviewsReports;