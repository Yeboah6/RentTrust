import { useState, useMemo } from "react";
import { useForm } from '@inertiajs/react';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = '1rem', sw = 1.8 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    shield:     <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    user:       <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    mail:       <Ico d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    phone:      <Ico d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
    calendar:   <Ico d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    check:      <Ico d="M5 13l4 4L19 7" />,
    clock:      <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    x:          <Ico d="M6 18L18 6M6 6l12 12" />,
    search:     <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    eye:        <Ico d={['M15 12a3 3 0 11-6 0 3 3 0 016 0z','M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z']} />,
    document:   <Ico d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    chevronLeft:  <Ico d="M15 19l-7-7 7-7" />,
    chevronRight: <Ico d="M9 5l7 7-7 7" />,
    empty:      <Ico d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" size="2.5rem" sw={1.2} />,
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const config = {
        verified:   { bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 35%)', icon: Icons.check, label: 'Verified' },
        pending:    { bg: 'hsl(38 92% 93%)',   color: 'hsl(38 92% 40%)',  icon: Icons.clock, label: 'Pending' },
        rejected:   { bg: 'hsl(0 72% 93%)',    color: 'hsl(0 72% 45%)',   icon: Icons.x,     label: 'Rejected' },
        unverified: { bg: 'hsl(220 15% 93%)',  color: 'hsl(220 15% 45%)', icon: Icons.clock, label: 'Unverified' },
    };
    const cfg = config[status] || config.pending;
    
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.18rem 0.55rem', borderRadius: 999,
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
            backgroundColor: cfg.bg, color: cfg.color, flexShrink: 0,
        }}>
            {cfg.icon}{cfg.label}
        </span>
    );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.25rem', padding: '1rem 0',
        }}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '2rem', height: '2rem', borderRadius: '0.375rem',
                    border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                    color: currentPage === 1 ? 'hsl(220 15% 70%)' : 'hsl(220 25% 35%)',
                    cursor: currentPage === 1 ? 'default' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1,
                    transition: 'all 0.12s',
                }}
            >
                {Icons.chevronLeft}
            </button>

            {start > 1 && (
                <>
                    <button onClick={() => onPageChange(1)} style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '2rem', height: '2rem', borderRadius: '0.375rem',
                        border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                        color: 'hsl(220 25% 35%)', fontSize: '0.75rem', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit',
                    }}>1</button>
                    {start > 2 && <span style={{ color: 'hsl(220 15% 60%)', fontSize: '0.75rem', padding: '0 0.25rem' }}>...</span>}
                </>
            )}

            {pages.map(page => (
                <button key={page} onClick={() => onPageChange(page)} style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '2rem', height: '2rem', borderRadius: '0.375rem',
                    border: page === currentPage ? 'none' : '1px solid hsl(220 15% 88%)',
                    backgroundColor: page === currentPage ? 'hsl(174 62% 32%)' : 'white',
                    color: page === currentPage ? 'white' : 'hsl(220 25% 35%)',
                    fontSize: '0.75rem', fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.12s',
                }}
                    onMouseEnter={e => { if (page !== currentPage) e.currentTarget.style.backgroundColor = 'hsl(220 15% 95%)'; }}
                    onMouseLeave={e => { if (page !== currentPage) e.currentTarget.style.backgroundColor = 'white'; }}
                >{page}</button>
            ))}

            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <span style={{ color: 'hsl(220 15% 60%)', fontSize: '0.75rem', padding: '0 0.25rem' }}>...</span>}
                    <button onClick={() => onPageChange(totalPages)} style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '2rem', height: '2rem', borderRadius: '0.375rem',
                        border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                        color: 'hsl(220 25% 35%)', fontSize: '0.75rem', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit',
                    }}>{totalPages}</button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '2rem', height: '2rem', borderRadius: '0.375rem',
                    border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                    color: currentPage === totalPages ? 'hsl(220 15% 70%)' : 'hsl(220 25% 35%)',
                    cursor: currentPage === totalPages ? 'default' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    transition: 'all 0.12s',
                }}
            >
                {Icons.chevronRight}
            </button>
        </div>
    );
};

const ITEMS_PER_PAGE = 9;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const initial = (name) => (name || 'A').charAt(0).toUpperCase();
const hue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
const fmtDate = (v) => {
    if (!v) return '—';
    return new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// ─── Verification Card ────────────────────────────────────────────────────────
const VerificationCard = ({ verification, onVerify }) => {
    return (
        <div style={{
            backgroundColor: 'white',
            border: '1px solid hsl(220 15% 91%)',
            borderRadius: '0.875rem',
            overflow: 'hidden',
            boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)',
            display: 'flex', flexDirection: 'column',
            transition: 'box-shadow 0.15s',
        }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px hsl(220 20% 15% / 0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px hsl(220 20% 15% / 0.04)'}
        >
            {/* Status strip */}
            <div style={{ 
                height: 3, 
                backgroundColor: verification.status === 'verified' ? 'hsl(152 60% 40%)' 
                    : verification.status === 'rejected' ? 'hsl(0 72% 48%)' 
                    : 'hsl(38 92% 50%)',
                opacity: 0.7 
            }} />

            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                
                {/* Agent header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <div style={{
                        width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', flexShrink: 0,
                        backgroundColor: `hsl(${hue(verification.agent?.name || verification.agent?.fullName)} 45% 90%)`,
                        color: `hsl(${hue(verification.agent?.name || verification.agent?.fullName)} 45% 30%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.9rem', fontWeight: 800,
                    }}>
                        {initial(verification.agent?.name || verification.agent?.fullName)}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                            <h3 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: 'hsl(220 25% 12%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {verification.agent?.name || verification.agent?.fullName || 'Unknown Agent'}
                            </h3>
                            <StatusBadge status={verification.status || 'pending'} />
                        </div>
                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.68rem', color: 'hsl(220 15% 50%)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            {Icons.mail}{verification.agent?.email || 'No email'}
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, backgroundColor: 'hsl(220 15% 94%)' }} />

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.7rem', color: 'hsl(220 15% 50%)' }}>
                    {verification.agent?.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            {Icons.phone}
                            <span>{verification.agent.phone}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {Icons.calendar}
                        <span>Submitted {fmtDate(verification.created_at)}</span>
                    </div>
                    {verification.rental && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            {Icons.document}
                            <span>Property: {verification.rental.title || `#${verification.rental_id}`}</span>
                        </div>
                    )}
                </div>

                {/* Notes preview */}
                {verification.notes && (
                    <div style={{
                        padding: '0.65rem', backgroundColor: 'hsl(40 33% 97%)',
                        borderRadius: '0.5rem', border: '1px solid hsl(40 25% 90%)',
                    }}>
                        <p style={{ margin: 0, fontSize: '0.72rem', color: 'hsl(220 20% 30%)', lineHeight: 1.5, fontStyle: 'italic' }}>
                            "{verification.notes?.slice(0, 100)}{verification.notes?.length > 100 ? '...' : ''}"
                        </p>
                    </div>
                )}
            </div>

            {/* Footer actions */}
            <div style={{ 
                borderTop: '1px solid hsl(220 15% 93%)', 
                padding: '0.6rem 1rem', 
                backgroundColor: 'hsl(220 15% 98.5%)',
                display: 'flex', gap: '0.4rem', flexWrap: 'wrap',
            }}>
                {(verification.status === 'pending' || verification.status === 'unverified') && (
                    <>
                        <button
                            onClick={() => onVerify?.(verification, 'verified')}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                                border: 'none', backgroundColor: 'hsl(152 60% 40%)',
                                color: 'white', fontSize: '0.7rem', fontWeight: 700,
                                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(152 60% 35%)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(152 60% 40%)'}
                        >
                            {Icons.check} Approve
                        </button>
                        <button
                            onClick={() => onVerify?.(verification, 'rejected')}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                                border: '1px solid hsl(0 72% 70%)', backgroundColor: 'white',
                                color: 'hsl(0 72% 48%)', fontSize: '0.7rem', fontWeight: 700,
                                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(0 72% 50%)'; e.currentTarget.style.backgroundColor = 'hsl(0 72% 97%)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(0 72% 70%)'; e.currentTarget.style.backgroundColor = 'white'; }}
                        >
                            {Icons.x} Reject
                        </button>
                    </>
                )}
                {verification.status === 'verified' && (
                    <div style={{ width: '100%', padding: '0.4rem', backgroundColor: 'hsl(152 60% 96%)', borderRadius: '0.4rem', color: 'hsl(152 60% 36%)', fontSize: '0.7rem', fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                        {Icons.check} Verified
                    </div>
                )}
                {verification.status === 'rejected' && (
                    <div style={{ width: '100%', padding: '0.4rem', backgroundColor: 'hsl(0 72% 96%)', borderRadius: '0.4rem', color: 'hsl(0 72% 48%)', fontSize: '0.7rem', fontWeight: 600, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                        {Icons.x} Rejected
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Verification Detail Modal ────────────────────────────────────────────────
const VerifyModal = ({ verification, isOpen, onClose, onSubmit }) => {
    const [toast, setToast] = useState(null);

    const { data, setData, put, processing, errors, reset } = useForm({
        status: verification?.status || '',
    });

    const showToast = (title, description, variant = "success") => {
        setToast({ title, description, variant });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/agents/${verification.agent_id}/verify`, {
            onSuccess: () => {
                showToast("Verification Updated", "Agent verification status has been updated.");
                reset();
                setTimeout(() => onClose?.(), 1500);
            },
            onError: (errors) => {
                showToast("Failed", "Please correct the errors and try again.", "error");
            },
        });
    };

    if (!isOpen) return null;

    return (
        <>
            {toast && (
                <div style={{ position: 'fixed', top: '1rem', right: '1rem', backgroundColor: toast.variant === 'error' ? '#ef4444' : '#10b981', color: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', zIndex: 9999, maxWidth: '400px', animation: 'slideIn 0.3s ease-out' }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{toast.title}</div>
                    <div style={{ fontSize: '0.875rem' }}>{toast.description}</div>
                </div>
            )}

            <div className="verify-modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem', backdropFilter: 'blur(4px)' }} onClick={onClose}>
                <div className="verify-modal-content" style={{ width: '100%', maxWidth: '36rem', maxHeight: '90vh', overflowY: 'auto', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', animation: 'fadeIn 0.2s ease' }} onClick={e => e.stopPropagation()}>
                    
                    {/* Header */}
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid hsl(220 15% 93%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'hsl(174 62% 32% / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {Icons.shield}
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'hsl(220 25% 12%)' }}>Verify Agent</h2>
                                <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: 'hsl(220 15% 50%)' }}>Review and update verification status</p>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ border: 'none', background: 'none', color: 'hsl(220 15% 45%)', cursor: 'pointer', padding: '0.25rem', borderRadius: '0.375rem', display: 'flex' }}>
                            {Icons.x}
                        </button>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '1.25rem' }}>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.78rem', fontWeight: 700, color: 'hsl(220 25% 12%)' }}>Verification Status</label>
                                    <div className="verify-status-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                        {[
                                            { value: 'verified', label: 'Approve', color: 'hsl(152 60% 40%)' },
                                            { value: 'rejected', label: 'Reject', color: 'hsl(0 72% 48%)' },
                                            { value: 'pending', label: 'Pending', color: 'hsl(38 92% 40%)' },
                                        ].map(opt => (
                                            <button key={opt.value} type="button" onClick={() => setData('status', opt.value)} style={{
                                                padding: '0.6rem', borderRadius: '0.5rem',
                                                border: `2px solid ${data.status === opt.value ? opt.color : 'hsl(220 15% 88%)'}`,
                                                backgroundColor: data.status === opt.value ? `${opt.color}0D` : 'white',
                                                color: data.status === opt.value ? opt.color : 'hsl(220 25% 15%)',
                                                fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                                                fontFamily: 'inherit', transition: 'all 0.15s',
                                            }}>
                                                {data.status === opt.value && <>{Icons.check} </>}{opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="verify-modal-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 15%)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                                    <button type="submit" disabled={processing || !data.status} style={{ flex: 1, padding: '0.65rem', borderRadius: '0.5rem', border: 'none', backgroundColor: processing || !data.status ? 'hsl(174 62% 32% / 0.5)' : 'hsl(174 62% 32%)', color: 'white', fontSize: '0.78rem', fontWeight: 700, cursor: processing || !data.status ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                                        {processing ? 'Saving...' : 'Submit'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                /* Responsive styles */
                .verify-modal-overlay {
                    align-items: flex-start;
                    overflow-y: auto;
                }
                .verify-modal-content {
                    margin: 0 auto;
                    max-height: 95vh;
                }
                @media (max-width: 640px) {
                    .verify-modal-overlay {
                        padding: 0.5rem;
                    }
                    .verify-modal-content {
                        border-radius: 0.75rem;
                    }
                    .verify-status-options {
                        grid-template-columns: 1fr !important; /* stack on mobile */
                    }
                    .verify-modal-actions {
                        flex-direction: column-reverse;
                    }
                }
            `}</style>
        </>
    );
};

// ─── Verifications Tab Module ─────────────────────────────────────────────────
const VerificationsTab = ({ verifications = [], showToast }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedVerification, setSelectedVerification] = useState(null);
    const [showVerifyModal, setShowVerifyModal] = useState(false);

    const filteredVerifications = useMemo(() => {
        return verifications.filter(v => {
            const q = searchTerm.toLowerCase();
            const matchesSearch = !q || [
                v.agent?.name,
                v.agent?.fullName,
                v.agent?.email,
                v.status,
                v.rental?.title,
            ].filter(Boolean).some(value => value?.toString().toLowerCase().includes(q));
            
            const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [verifications, searchTerm, statusFilter]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const total = verifications.length;
    const filteredTotal = filteredVerifications.length;
    const pending = verifications.filter(v => v.status === 'pending' || v.status === 'unverified').length;
    const verified = verifications.filter(v => v.status === 'verified').length;
    const rejected = verifications.filter(v => v.status === 'rejected').length;

    // Pagination
    const totalPages = Math.ceil(filteredTotal / ITEMS_PER_PAGE);
    const paginatedVerifications = filteredVerifications.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleVerify = (verification, status) => {
        setSelectedVerification({ ...verification, status });
        setShowVerifyModal(true);
    };

    const handleSubmitVerification = () => {
        setShowVerifyModal(false);
        setSelectedVerification(null);
        showToast?.('Verification Updated', 'Agent verification status has been updated.');
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <style>{`
                    /* Responsive styles for verification tab */
                    .verify-header {
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        justify-content: space-between;
                        gap: 0.75rem;
                    }
                    .verify-filters {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 0.75rem;
                    }
                    .verify-filters .search-wrapper {
                        position: relative;
                        flex: 2 1 260px;
                    }
                    .verify-filters select {
                        flex: 1 1 150px;
                    }
                    .verify-grid {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: 0.875rem;
                    }

                    @media (max-width: 640px) {
                        .verify-header {
                            flex-direction: column;
                            align-items: stretch;
                        }
                        .verify-filters {
                            flex-direction: column;
                        }
                        .verify-filters .search-wrapper,
                        .verify-filters select {
                            width: 100%;
                            flex: none;
                        }
                    }

                    @media (min-width: 640px) {
                        .verify-grid {
                            grid-template-columns: repeat(2, 1fr);
                        }
                    }

                    @media (min-width: 1024px) {
                        .verify-grid {
                            grid-template-columns: repeat(3, 1fr);
                        }
                    }
                `}</style>

                {/* Section heading + counts */}
                <div className="verify-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: 3, height: '1.2rem', borderRadius: 999, backgroundColor: 'hsl(174 62% 32%)', flexShrink: 0 }} />
                        <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'hsl(220 25% 12%)', letterSpacing: '-0.01em' }}>
                            Verification Requests
                        </h2>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.18rem 0.6rem', borderRadius: 999, backgroundColor: 'hsl(220 15% 93%)', color: 'hsl(220 25% 35%)' }}>
                            {total}
                        </span>
                    </div>

                    {total > 0 && (
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {[
                                { label: 'Pending',  val: pending,  icon: Icons.clock, bg: 'hsl(38 92% 93%)',  color: 'hsl(38 92% 40%)', border: '1px solid hsl(38 92% 85%)' },
                                { label: 'Verified', val: verified, icon: Icons.check, bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 35%)', border: '1px solid hsl(152 60% 85%)' },
                                { label: 'Rejected', val: rejected, icon: Icons.x,     bg: 'hsl(0 72% 93%)',   color: 'hsl(0 72% 45%)',   border: '1px solid hsl(0 72% 85%)' },
                            ].filter(t => t.val > 0).map(t => (
                                <span key={t.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700, backgroundColor: t.bg, color: t.color, border: t.border }}>
                                    {t.icon}{t.val} {t.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search + Filter */}
                <div className="verify-filters">
                    <div className="search-wrapper">
                        <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)', display: 'flex' }}>
                            {Icons.search}
                        </div>
                        <input type="search" value={searchTerm} onChange={handleSearchChange} placeholder="Search by agent name, email, property..."
                            style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '0.625rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.8rem', color: 'hsl(220 25% 15%)', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s' }}
                            onFocus={e => e.currentTarget.style.borderColor = 'hsl(174 62% 40%)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'}
                        />
                    </div>
                    <select value={statusFilter} onChange={handleStatusFilterChange}
                        style={{ padding: '0.65rem 1rem', borderRadius: '0.625rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.8rem', color: 'hsl(220 25% 15%)', fontFamily: 'inherit', minWidth: '150px', outline: 'none', cursor: 'pointer' }}
                        onFocus={e => e.currentTarget.style.borderColor = 'hsl(174 62% 40%)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'}
                    >
                        <option value="all">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="unverified">Unverified</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* Results info */}
                {filteredTotal > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'hsl(220 15% 50%)', fontWeight: 500 }}>
                        <span>Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredTotal)} of {filteredTotal} request{filteredTotal !== 1 ? 's' : ''}</span>
                    </div>
                )}

                {/* Grid or empty */}
                {filteredTotal > 0 ? (
                    <>
                        <div className="verify-grid">
                            {paginatedVerifications.map(verification => (
                                <VerificationCard
                                    key={verification.id}
                                    verification={verification}
                                    onVerify={handleVerify}
                                />
                            ))}
                        </div>
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </>
                ) : (
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                        <div style={{ color: 'hsl(220 15% 68%)', margin: '0 auto 1rem', display: 'flex', justifyContent: 'center' }}>{Icons.empty}</div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'hsl(220 25% 15%)', margin: '0 0 0.35rem' }}>{searchTerm || statusFilter !== 'all' ? 'No Requests Found' : 'No Verification Requests'}</h3>
                        <p style={{ color: 'hsl(220 15% 52%)', fontSize: '0.82rem', margin: 0 }}>{searchTerm || statusFilter !== 'all' ? 'No verification requests match your search.' : 'There are no verification requests yet.'}</p>
                    </div>
                )}
            </div>

            {/* Verify Modal */}
            <VerifyModal
                verification={selectedVerification}
                isOpen={showVerifyModal}
                onClose={() => { setShowVerifyModal(false); setSelectedVerification(null); }}
                onSubmit={handleSubmitVerification}
            />
        </>
    );
};

export default VerificationsTab;