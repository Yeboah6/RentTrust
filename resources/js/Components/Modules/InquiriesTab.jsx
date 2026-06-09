import { useState } from 'react';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = '1rem', sw = 1.8 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    whatsapp: <Ico d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    phone:    <Ico d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
    form:     <Ico d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    pin:      <Ico d={['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z','M15 11a3 3 0 11-6 0 3 3 0 016 0z']} size="0.78rem" />,
    msg:      <Ico d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" size="0.78rem" />,
    chevDown: <Ico d="M19 9l-7 7-7-7" size="0.78rem" />,
    eye:      <Ico d={['M15 12a3 3 0 11-6 0 3 3 0 016 0z','M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z']} size="0.78rem" />,
    inbox:    <Ico d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" size="2.5rem" sw={1.2} />,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (v) => {
    if (!v) return '—';
    return new Date(v).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' });
};
const initial = (name) => (name || 'G').charAt(0).toUpperCase();

const TYPE_CFG = {
    whatsapp: { label: 'WhatsApp', icon: Icons.whatsapp, color: 'hsl(142 55% 33%)', bg: 'hsl(142 55% 93%)' },
    phone:    { label: 'Phone',    icon: Icons.phone,    color: 'hsl(214 80% 48%)', bg: 'hsl(214 100% 95%)' },
    form:     { label: 'Form',     icon: Icons.form,     color: 'hsl(270 55% 42%)', bg: 'hsl(270 60% 95%)' },
};

// ─── Single inquiry card ──────────────────────────────────────────────────────
const InquiryCard = ({ inquiry, rentals, onViewProperty }) => {
    const [open, setOpen] = useState(false);

    const rental  = rentals?.find(r => r.id === inquiry.rental_id);
    const title   = rental?.title   || `Property #${inquiry.rental_id}`;
    const city    = rental?.city    || 'Unknown';
    const address = rental?.address || '';
    const isGuest = !inquiry.user?.name;
    const type    = TYPE_CFG[inquiry.type] || TYPE_CFG.form;

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
            {/* Type colour strip */}
            <div style={{ height: 3, backgroundColor: type.color, opacity: 0.7 }} />

            {/* Card body */}
            <div style={{ padding: '0.9rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                {/* Property + type badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 800, color: 'hsl(220 25% 12%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
                            {title}
                        </p>
                        <p style={{ margin: '0.18rem 0 0', fontSize: '0.7rem', color: 'hsl(220 15% 52%)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            {Icons.pin}{city}{address ? ` · ${address}` : ''}
                        </p>
                    </div>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.28rem', flexShrink: 0,
                        padding: '0.2rem 0.55rem', borderRadius: 999,
                        fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.04em',
                        backgroundColor: type.bg, color: type.color,
                    }}>
                        {type.icon}{type.label}
                    </span>
                </div>

                {/* Divider */}
                <div style={{ height: 1, backgroundColor: 'hsl(220 15% 94%)' }} />

                {/* Tenant row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                        width: '2rem', height: '2rem', borderRadius: '50%', flexShrink: 0,
                        backgroundColor: isGuest ? 'hsl(40 90% 93%)' : 'hsl(174 40% 92%)',
                        color: isGuest ? 'hsl(40 80% 36%)' : 'hsl(174 62% 30%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 800,
                    }}>
                        {initial(inquiry.user?.name)}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: 'hsl(220 25% 14%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {inquiry.user?.name || 'Anonymous Tenant'}
                            </p>
                            {isGuest && (
                                <span style={{ fontSize: '0.58rem', fontWeight: 800, padding: '0.1rem 0.35rem', borderRadius: 999, backgroundColor: 'hsl(40 90% 93%)', color: 'hsl(40 80% 36%)', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>GUEST</span>
                            )}
                        </div>
                        <p style={{ margin: '0.1rem 0 0', fontSize: '0.68rem', color: 'hsl(220 15% 52%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {inquiry.user?.email || 'No email'} {inquiry.user?.phone ? `· ${inquiry.user.phone}` : ''}
                        </p>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'hsl(220 15% 60%)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {fmtDate(inquiry.created_at)}
                    </span>
                </div>

                {/* Message accordion */}
                {inquiry.message && (
                    <div style={{ borderTop: '1px solid hsl(220 15% 94%)', marginTop: 'auto' }}>
                        <button
                            onClick={() => setOpen(o => !o)}
                            style={{
                                width: '100%', padding: '0.5rem 0 0',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                            }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', fontWeight: 700, color: 'hsl(220 15% 48%)' }}>
                                {Icons.msg} Message
                            </span>
                            <span style={{ color: 'hsl(220 15% 60%)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'flex' }}>
                                {Icons.chevDown}
                            </span>
                        </button>
                        {open && (
                            <div style={{
                                marginTop: '0.5rem', padding: '0.65rem 0.75rem',
                                backgroundColor: 'hsl(40 33% 98%)', borderRadius: '0.5rem',
                                border: '1px solid hsl(40 25% 90%)',
                                animation: 'slideDown 0.18s ease',
                            }}>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(220 20% 30%)', lineHeight: 1.55, fontStyle: 'italic' }}>
                                    "{inquiry.message}"
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer action */}
            <div style={{ borderTop: '1px solid hsl(220 15% 93%)', padding: '0.6rem 1rem', backgroundColor: 'hsl(220 15% 98.5%)' }}>
                <button
                    onClick={() => onViewProperty?.(rental)}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.3rem 0.7rem', borderRadius: '0.4rem',
                        border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white',
                        color: 'hsl(174 62% 30%)', fontSize: '0.72rem', fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(174 62% 40%)'; e.currentTarget.style.backgroundColor = 'hsl(174 40% 97%)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(220 15% 88%)'; e.currentTarget.style.backgroundColor = 'white'; }}
                >
                    {Icons.eye} View Property
                </button>
            </div>
        </div>
    );
};

// ─── Inquiries tab module ─────────────────────────────────────────────────────
const InquiriesTab = ({ inquiries = [], rentals = [], onViewProperty }) => {
    const total     = inquiries.length;
    const whatsapp  = inquiries.filter(i => i.type === 'whatsapp').length;
    const phone     = inquiries.filter(i => i.type === 'phone').length;
    const form      = inquiries.filter(i => i.type === 'form').length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Section heading + counts */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 3, height: '1.2rem', borderRadius: 999, backgroundColor: 'hsl(174 62% 32%)', flexShrink: 0 }} />
                    <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'hsl(220 25% 12%)', letterSpacing: '-0.01em' }}>
                        Property Inquiries
                    </h2>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.18rem 0.6rem', borderRadius: 999, backgroundColor: 'hsl(220 15% 93%)', color: 'hsl(220 25% 35%)' }}>
                        {total}
                    </span>
                </div>

                {/* Mini type pills */}
                {total > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {[
                            { label: 'WhatsApp', val: whatsapp, ...TYPE_CFG.whatsapp },
                            { label: 'Phone',    val: phone,    ...TYPE_CFG.phone },
                            { label: 'Form',     val: form,     ...TYPE_CFG.form },
                        ].filter(t => t.val > 0).map(t => (
                            <span key={t.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', padding: '0.2rem 0.6rem', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700, backgroundColor: t.bg, color: t.color }}>
                                {t.icon}{t.val} {t.label}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Grid or empty */}
            {total > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.875rem',
                }}>
                    {inquiries.map(inquiry => (
                        <InquiryCard
                            key={inquiry.id}
                            inquiry={inquiry}
                            rentals={rentals}
                            onViewProperty={onViewProperty}
                        />
                    ))}
                </div>
            ) : (
                <div style={{
                    backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)',
                    borderRadius: '0.875rem', padding: '3rem', textAlign: 'center',
                    boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)',
                }}>
                    <div style={{ color: 'hsl(220 15% 68%)', margin: '0 auto 1rem', display: 'flex', justifyContent: 'center' }}>
                        {Icons.inbox}
                    </div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'hsl(220 25% 15%)', margin: '0 0 0.35rem' }}>No Inquiries Yet</h3>
                    <p style={{ color: 'hsl(220 15% 52%)', fontSize: '0.82rem', margin: 0 }}>There are no property inquiries to show.</p>
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

export default InquiriesTab;