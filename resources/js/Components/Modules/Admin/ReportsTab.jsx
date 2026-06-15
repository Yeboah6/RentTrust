import { useState } from 'react';
import { router } from '@inertiajs/react';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = '1rem', sw = 1.8 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    alert:      <Ico d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    user:       <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    calendar:   <Ico d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    eye:        <Ico d={['M15 12a3 3 0 11-6 0 3 3 0 016 0z','M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z']} />,
    file:       <Ico d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    search:     <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    check:      <Ico d="M5 13l4 4L19 7" />,
    clock:      <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    x:          <Ico d="M6 18L18 6M6 6l12 12" />,
    empty:      <Ico d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size="2.5rem" sw={1.2} />,
    property:   <Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const config = {
        pending:   { bg: 'hsl(40 30% 94%)',    color: 'hsl(200 25% 15%)', border: '1px solid hsl(40 20% 88%)', icon: Icons.clock,  label: 'Pending' },
        reviewing: { bg: 'hsl(214 100% 95%)',  color: 'hsl(214 100% 40%)', border: '1px solid hsl(214 100% 80%)', icon: Icons.eye,    label: 'Reviewing' },
        resolved:  { bg: 'hsl(152 60% 95%)',   color: 'hsl(152 60% 35%)', border: '1px solid hsl(152 60% 80%)', icon: Icons.check,  label: 'Resolved' },
        dismissed: { bg: 'hsl(0 0% 95%)',      color: 'hsl(0 0% 45%)',    border: '1px solid hsl(0 0% 80%)',    icon: Icons.x,      label: 'Dismissed' },
    };
    const cfg = config[status] || config.pending;
    
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.28rem',
            padding: '0.2rem 0.55rem', borderRadius: 999,
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
            backgroundColor: cfg.bg, color: cfg.color, flexShrink: 0,
            border: cfg.border,
        }}>
            {cfg.icon}{cfg.label}
        </span>
    );
};

// ─── Type Badge ───────────────────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
    const config = {
        'Fraudulent agent/landlord': { bg: 'hsl(0 70% 50%)',   color: 'white' },
        'Fraudulent listing':        { bg: 'hsl(0 70% 50%)',   color: 'white' },
        'Harassment':                { bg: 'hsl(25 95% 53%)',  color: 'white' },
        'False information':         { bg: 'hsl(40 92% 50%)',  color: 'white' },
        'Scam':                      { bg: 'hsl(0 84% 60%)',   color: 'white' },
        'Other':                     { bg: 'hsl(220 15% 50%)', color: 'white' },
    };
    const cfg = config[type] || { bg: 'hsl(0 70% 50%)', color: 'white' };
    
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.28rem',
            padding: '0.2rem 0.55rem', borderRadius: 999,
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
            backgroundColor: cfg.bg, color: cfg.color, flexShrink: 0,
        }}>
            {Icons.alert}{type}
        </span>
    );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const initial = (name) => (name || 'R').charAt(0).toUpperCase();
const fmtDate = (v) => {
    if (!v) return '—';
    return new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// ─── Single Report Card ───────────────────────────────────────────────────────
const ReportCard = ({ report, onViewProperty, onStatusChange }) => {
    const evidence = typeof report.evidence === 'string' 
        ? JSON.parse(report.evidence) 
        : (report.evidence || []);

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
            {/* Status colour strip */}
            <div style={{ 
                height: 3, 
                backgroundColor: report.status === 'resolved' ? 'hsl(152 60% 40%)' 
                    : report.status === 'reviewing' ? 'hsl(214 100% 48%)' 
                    : report.status === 'dismissed' ? 'hsl(220 15% 60%)' 
                    : 'hsl(0 72% 48%)',
                opacity: 0.7 
            }} />

            {/* Card body */}
            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                
                {/* Type + Status badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <TypeBadge type={report.report_type || 'Other'} />
                    <StatusBadge status={report.status || 'pending'} />
                </div>

                {/* Reporter info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                        width: '2rem', height: '2rem', borderRadius: '50%', flexShrink: 0,
                        backgroundColor: 'hsl(0 70% 50% / 0.1)', color: 'hsl(0 70% 50%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 800,
                    }}>
                        {initial(report.full_name)}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: 'hsl(220 25% 14%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {report.full_name || 'Anonymous'}
                        </p>
                        <p style={{ margin: '0.1rem 0 0', fontSize: '0.68rem', color: 'hsl(220 15% 52%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {report.email || 'No email'}
                        </p>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'hsl(220 15% 60%)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {fmtDate(report.created_at)}
                    </span>
                </div>

                {/* Description */}
                <div style={{ 
                    padding: '0.75rem', 
                    backgroundColor: 'hsl(40 33% 97%)', 
                    borderRadius: '0.5rem',
                    border: '1px solid hsl(40 25% 90%)',
                    borderLeft: '3px solid hsl(0 70% 50% / 0.3)',
                }}>
                    <p style={{ 
                        margin: 0, fontSize: '0.78rem', color: 'hsl(220 20% 30%)', 
                        lineHeight: 1.55, fontStyle: 'italic' 
                    }}>
                        "{report.report_description || 'No description provided'}"
                    </p>
                </div>

                {/* Related Property */}
                {report.rental && (
                    <div style={{
                        padding: '0.75rem',
                        backgroundColor: 'hsl(174 40% 97%)',
                        borderRadius: '0.5rem',
                        border: '1px solid hsl(174 40% 88%)',
                    }}>
                        <p style={{ 
                            margin: '0 0 0.35rem', fontSize: '0.65rem', fontWeight: 700, 
                            color: 'hsl(174 62% 32%)', letterSpacing: '0.04em', textTransform: 'uppercase' 
                        }}>
                            Related Property
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '0.5rem' }}>
                            <div style={{ minWidth: 0, flex: 1 }}>
                                <p style={{ margin: '0 0 0.15rem', fontSize: '0.8rem', fontWeight: 700, color: 'hsl(220 25% 14%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {report.rental.title || 'Untitled Property'}
                                </p>
                                <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(220 15% 52%)' }}>
                                    {[report.rental.address, report.rental.city].filter(Boolean).join(', ')}
                                </p>
                                {report.rental.agent?.name && (
                                    <p style={{ margin: '0.15rem 0 0', fontSize: '0.68rem', color: 'hsl(220 15% 48%)' }}>
                                        Agent: {report.rental.agent.name}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => onViewProperty?.(report.rental)}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                    padding: '0.3rem 0.6rem', borderRadius: '0.4rem',
                                    border: '1px solid hsl(174 62% 40%)', backgroundColor: 'white',
                                    color: 'hsl(174 62% 30%)', fontSize: '0.68rem', fontWeight: 700,
                                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                                    flexShrink: 0, whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(174 62% 30%)'; e.currentTarget.style.backgroundColor = 'hsl(174 40% 95%)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(174 62% 40%)'; e.currentTarget.style.backgroundColor = 'white'; }}
                            >
                                {Icons.eye} View
                            </button>
                        </div>
                    </div>
                )}

                {/* Evidence */}
                {evidence.length > 0 && (
                    <div style={{
                        padding: '0.75rem',
                        backgroundColor: 'hsl(220 15% 97%)',
                        borderRadius: '0.5rem',
                        border: '1px solid hsl(220 15% 91%)',
                    }}>
                        <p style={{ 
                            margin: '0 0 0.5rem', fontSize: '0.65rem', fontWeight: 700, 
                            color: 'hsl(220 15% 50%)', letterSpacing: '0.04em', textTransform: 'uppercase' 
                        }}>
                            Evidence ({evidence.length})
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {evidence.map((item, idx) => {
                                const filename = typeof item === 'string' 
                                    ? item.split('/').pop() 
                                    : (item.name || `Evidence ${idx + 1}`);
                                return (
                                    <a
                                        key={idx}
                                        href={`/admin/reports/${report.report_id || report.id}/evidence/${encodeURIComponent(filename)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                            padding: '0.25rem 0.55rem', fontSize: '0.7rem',
                                            backgroundColor: 'white', color: 'hsl(214 100% 42%)',
                                            borderRadius: '0.375rem', border: '1px solid hsl(220 15% 88%)',
                                            textDecoration: 'none', cursor: 'pointer',
                                            fontWeight: 600, transition: 'all 0.12s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsl(214 100% 97%)'; e.currentTarget.style.borderColor = 'hsl(214 100% 70%)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'; }}
                                    >
                                        {Icons.file} {filename}
                                    </a>
                                );
                            })}
                        </div>
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
                {/* Pending actions */}
                {(!report.status || report.status === 'pending') && (
                    <>
                        <button
                            onClick={() => onStatusChange?.(report.id, 'reviewing')}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                                border: 'none', backgroundColor: 'hsl(214 100% 48%)',
                                color: 'white', fontSize: '0.7rem', fontWeight: 700,
                                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(214 100% 42%)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(214 100% 48%)'}
                        >
                            {Icons.eye} Review
                        </button>
                        <button
                            onClick={() => onStatusChange?.(report.id, 'resolved')}
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
                            {Icons.check} Resolve
                        </button>
                        <button
                            onClick={() => onStatusChange?.(report.id, 'dismissed')}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                padding: '0.35rem 0.7rem', borderRadius: '0.4rem',
                                border: '1px solid hsl(220 15% 75%)', backgroundColor: 'white',
                                color: 'hsl(220 15% 45%)', fontSize: '0.7rem', fontWeight: 700,
                                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(220 15% 55%)'; e.currentTarget.style.backgroundColor = 'hsl(220 15% 95%)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(220 15% 75%)'; e.currentTarget.style.backgroundColor = 'white'; }}
                        >
                            {Icons.x} Dismiss
                        </button>
                    </>
                )}

                {/* Status messages for non-pending */}
                {report.status === 'reviewing' && (
                    <div style={{ 
                        width: '100%', padding: '0.5rem', 
                        backgroundColor: 'hsl(214 100% 96%)', borderRadius: '0.4rem',
                        color: 'hsl(214 100% 42%)', fontSize: '0.7rem', fontWeight: 600,
                        textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                    }}>
                        {Icons.clock} Under Review
                    </div>
                )}
                {report.status === 'resolved' && (
                    <div style={{ 
                        width: '100%', padding: '0.5rem', 
                        backgroundColor: 'hsl(152 60% 96%)', borderRadius: '0.4rem',
                        color: 'hsl(152 60% 36%)', fontSize: '0.7rem', fontWeight: 600,
                        textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                    }}>
                        {Icons.check} Resolved
                    </div>
                )}
                {report.status === 'dismissed' && (
                    <div style={{ 
                        width: '100%', padding: '0.5rem', 
                        backgroundColor: 'hsl(220 15% 96%)', borderRadius: '0.4rem',
                        color: 'hsl(220 15% 48%)', fontSize: '0.7rem', fontWeight: 600,
                        textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                    }}>
                        {Icons.x} Dismissed
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Reports Tab Module ───────────────────────────────────────────────────────
const ReportsTab = ({ reports = [], onViewProperty, onStatusChange, showToast }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    
    const filteredReports = reports.filter(report => {
        const q = searchTerm.toLowerCase();
        const matchesSearch = !q || [
            report.full_name,
            report.email,
            report.report_type,
            report.report_description,
            report.status,
        ].filter(Boolean).some(value => value?.toString().toLowerCase().includes(q));
        
        const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const total     = reports.length;
    const pending   = reports.filter(r => !r.status || r.status === 'pending').length;
    const reviewing = reports.filter(r => r.status === 'reviewing').length;
    const resolved  = reports.filter(r => r.status === 'resolved').length;
    const dismissed = reports.filter(r => r.status === 'dismissed').length;

    const handleStatusChange = (reportId, newStatus) => {
        const statusMessages = {
            reviewing: { title: 'Status Updated', message: 'Marked as reviewing.' },
            resolved: { title: 'Report Resolved', message: 'Marked as resolved.' },
            dismissed: { title: 'Report Dismissed', message: '' },
        };
        
        const msg = statusMessages[newStatus];
        
        if (newStatus === 'resolved' && !confirm('Resolve this report?')) return;
        if (newStatus === 'dismissed' && !confirm('Dismiss this report?')) return;
        
        router.put(`/admin/reports/${reportId}/status`, { status: newStatus }, {
            onSuccess: () => showToast?.(msg.title, msg.message),
            onError: () => showToast?.('Failed', 'Unable to update report status.', 'error'),
        });
        
        onStatusChange?.(reportId, newStatus);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Section heading + counts */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 3, height: '1.2rem', borderRadius: 999, backgroundColor: 'hsl(0 72% 48%)', flexShrink: 0 }} />
                    <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'hsl(220 25% 12%)', letterSpacing: '-0.01em' }}>
                        Platform Reports
                    </h2>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.18rem 0.6rem', borderRadius: 999, backgroundColor: 'hsl(220 15% 93%)', color: 'hsl(220 25% 35%)' }}>
                        {total}
                    </span>
                </div>

                {/* Status pills */}
                {total > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {[
                            { label: 'Pending',   val: pending,   icon: Icons.clock, bg: 'hsl(40 30% 94%)',    color: 'hsl(200 25% 15%)', border: '1px solid hsl(40 20% 88%)' },
                            { label: 'Reviewing', val: reviewing, icon: Icons.eye,   bg: 'hsl(214 100% 95%)',  color: 'hsl(214 100% 40%)', border: '1px solid hsl(214 100% 80%)' },
                            { label: 'Resolved',  val: resolved,  icon: Icons.check, bg: 'hsl(152 60% 95%)',   color: 'hsl(152 60% 35%)', border: '1px solid hsl(152 60% 80%)' },
                            { label: 'Dismissed', val: dismissed, icon: Icons.x,     bg: 'hsl(0 0% 95%)',      color: 'hsl(0 0% 45%)',    border: '1px solid hsl(0 0% 80%)' },
                        ].filter(t => t.val > 0).map(t => (
                            <span key={t.label} style={{ 
                                display: 'inline-flex', alignItems: 'center', gap: '0.28rem',
                                padding: '0.2rem 0.6rem', borderRadius: 999,
                                fontSize: '0.68rem', fontWeight: 700,
                                backgroundColor: t.bg, color: t.color, border: t.border,
                            }}>
                                {t.icon}{t.val} {t.label}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Search + Filter */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1 1 260px' }}>
                    <div style={{ 
                        position: 'absolute', left: '0.75rem', top: '50%', 
                        transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)',
                        display: 'flex',
                    }}>
                        {Icons.search}
                    </div>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search reports by type, reporter, description..."
                        style={{
                            width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem',
                            borderRadius: '0.625rem',
                            border: '1px solid hsl(220 15% 88%)',
                            backgroundColor: 'white',
                            fontSize: '0.8rem', color: 'hsl(220 25% 15%)',
                            fontFamily: 'inherit',
                            outline: 'none',
                            transition: 'border-color 0.15s',
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = 'hsl(0 72% 50%)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'}
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                        padding: '0.65rem 1rem', borderRadius: '0.625rem',
                        border: '1px solid hsl(220 15% 88%)',
                        backgroundColor: 'white',
                        fontSize: '0.8rem', color: 'hsl(220 25% 15%)',
                        fontFamily: 'inherit', minWidth: '150px',
                        outline: 'none', cursor: 'pointer',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'hsl(0 72% 50%)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'}
                >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                </select>
            </div>

            {/* Grid or empty state */}
            {filteredReports.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.875rem',
                }}>
                    {filteredReports.map(report => (
                        <ReportCard
                            key={report.id}
                            report={report}
                            onViewProperty={onViewProperty}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            ) : (
                <div style={{
                    backgroundColor: 'white', 
                    border: '1px solid hsl(220 15% 91%)',
                    borderRadius: '0.875rem', 
                    padding: '3rem', 
                    textAlign: 'center',
                    boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)',
                }}>
                    <div style={{ 
                        color: 'hsl(220 15% 68%)', 
                        margin: '0 auto 1rem', 
                        display: 'flex', 
                        justifyContent: 'center' 
                    }}>
                        {Icons.empty}
                    </div>
                    <h3 style={{ 
                        fontSize: '0.95rem', fontWeight: 800, 
                        color: 'hsl(220 25% 15%)', margin: '0 0 0.35rem' 
                    }}>
                        {searchTerm || statusFilter !== 'all' ? 'No Reports Found' : 'No Reports Yet'}
                    </h3>
                    <p style={{ color: 'hsl(220 15% 52%)', fontSize: '0.82rem', margin: 0 }}>
                        {searchTerm || statusFilter !== 'all'
                            ? 'No reports match your search criteria. Try different filters.'
                            : 'There are no reports on the platform yet.'}
                    </p>
                </div>
            )}

            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ReportsTab;