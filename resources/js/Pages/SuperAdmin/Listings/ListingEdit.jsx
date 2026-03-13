import React, { useState, useRef } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = ({ d, size = '1rem', sw = 1.9 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    back:    () => <Ico d="M15 19l-7-7 7-7" size="0.9rem" />,
    save:    () => <Ico d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />,
    check:   () => <Ico d="M5 13l4 4L19 7" size="0.82rem" />,
    x:       () => <Ico d="M6 18L18 6M6 6l12 12" />,
    ban:     () => <Ico d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />,
    trash:   () => <Ico d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    home:    () => <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" size="1.15rem" />,
    alert:   () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size="1.05rem" />,
    reset:   () => <Ico d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" size="0.88rem" />,
    clock:   () => <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size="0.85rem" />,
    eye:     () => <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} />,
    unlock:  () => <Ico d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />,
    spinner: () => (
        <svg style={{ width: '1rem', height: '1rem', animation: 'leSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
    active:    { label: 'Active',    bg: 'hsl(152 60% 93%)', color: 'hsl(152 60% 28%)', dot: 'hsl(152 60% 38%)' },
    pending:   { label: 'Pending',   bg: 'hsl(40 90% 93%)',  color: 'hsl(40 80% 30%)',  dot: 'hsl(40 80% 44%)' },
    sold:      { label: 'Sold',      bg: 'hsl(214 100% 95%)',color: 'hsl(214 80% 38%)', dot: 'hsl(214 80% 50%)' },
    rented:    { label: 'Rented',    bg: 'hsl(270 60% 95%)', color: 'hsl(270 55% 38%)', dot: 'hsl(270 55% 50%)' },
    rejected:  { label: 'Rejected',  bg: 'hsl(0 70% 95%)',   color: 'hsl(0 65% 40%)',   dot: 'hsl(0 65% 50%)' },
    draft:     { label: 'Draft',     bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)' },
    expired:   { label: 'Expired',   bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 38%)', dot: 'hsl(220 15% 52%)' },
    flagged:   { label: 'Flagged',   bg: 'hsl(0 80% 94%)',   color: 'hsl(0 70% 38%)',   dot: 'hsl(0 70% 50%)' },
    suspended: { label: 'Suspended', bg: 'hsl(0 70% 95%)',   color: 'hsl(0 65% 40%)',   dot: 'hsl(0 65% 50%)' },
};

const LISTING_TYPES = [
    { value: 'sale',  label: 'For Sale' },
    { value: 'rent',  label: 'For Rent' },
    { value: 'short', label: 'Short Let' },
    { value: 'lease', label: 'Lease' },
];

const PROPERTY_TYPES = [
    'Apartment', 'House', 'Land', 'Commercial', 'Office',
    'Shop', 'Warehouse', 'Villa', 'Studio', 'Duplex', 'Bungalow', 'Mansion',
];

const CURRENCIES = [
    { value: 'GH₵', label: 'GH₵ GHS' },
    { value: '$',   label: '$ USD' },
    { value: '£',   label: '£ GBP' },
    { value: '€',   label: '€ EUR' },
    { value: '₦',   label: '₦ NGN' },
];

const ALL_STATUSES = ['active','pending','sold','rented','rejected','draft','expired','flagged','suspended'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return v; }
};

const avatarHue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

// ─── Field atoms ──────────────────────────────────────────────────────────────

const inputStyle = (focused, hasError) => ({
    width: '100%',
    padding: '0.6rem 0.875rem',
    border: `1.5px solid ${hasError ? 'hsl(0 65% 60%)' : focused ? 'hsl(220 60% 55%)' : 'hsl(220 15% 88%)'}`,
    borderRadius: '0.6rem',
    fontSize: '0.875rem',
    color: 'hsl(220 25% 16%)',
    backgroundColor: 'white',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    boxShadow: focused && !hasError ? '0 0 0 3px hsl(220 60% 55% / 0.11)' : hasError ? '0 0 0 3px hsl(0 65% 55% / 0.1)' : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
});

const FField = ({ label, required, hint, error, col, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32rem', gridColumn: col }}>
        {label && (
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'hsl(220 25% 22%)', letterSpacing: '0.01em' }}>
                {label}{required && <span style={{ color: 'hsl(0 65% 52%)', marginLeft: '0.2rem' }}>*</span>}
            </label>
        )}
        {children}
        {hint  && !error && <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(220 15% 55%)' }}>{hint}</p>}
        {error           && <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(0 65% 48%)', fontWeight: '600' }}>{error}</p>}
    </div>
);

const FInput = ({ hasError, ...props }) => {
    const [f, setF] = useState(false);
    return <input {...props} onFocus={() => setF(true)} onBlur={() => setF(false)} style={inputStyle(f, hasError)} />;
};

const FTextarea = ({ rows = 4, hasError, ...props }) => {
    const [f, setF] = useState(false);
    return <textarea {...props} rows={rows} onFocus={() => setF(true)} onBlur={() => setF(false)} style={{ ...inputStyle(f, hasError), resize: 'vertical' }} />;
};

const FSelect = ({ hasError, children, ...props }) => {
    const [f, setF] = useState(false);
    return <select {...props} onFocus={() => setF(true)} onBlur={() => setF(false)} style={{ ...inputStyle(f, hasError), cursor: 'pointer', appearance: 'none' }}>{children}</select>;
};

const Toggle = ({ value, onChange, label, sub }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 0.875rem', borderRadius: '0.6rem', backgroundColor: 'hsl(220 15% 97.5%)', border: '1px solid hsl(220 15% 91%)' }}>
        <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'hsl(220 25% 20%)' }}>{label}</div>
            {sub && <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 52%)', marginTop: '0.08rem' }}>{sub}</div>}
        </div>
        <button type="button" onClick={() => onChange(!value)}
            style={{ width: '2.75rem', height: '1.5rem', borderRadius: '999px', border: 'none', cursor: 'pointer', flexShrink: 0, position: 'relative', backgroundColor: value ? 'hsl(152 55% 38%)' : 'hsl(220 15% 80%)', transition: 'background-color 0.2s' }}>
            <span style={{ position: 'absolute', top: '0.15rem', left: value ? 'calc(100% - 1.2rem)' : '0.15rem', width: '1.2rem', height: '1.2rem', borderRadius: '50%', backgroundColor: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px hsl(220 25% 15% / 0.25)' }} />
        </button>
    </div>
);

const SectionLabel = ({ children }) => (
    <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(220 15% 52%)', paddingBottom: '0.4rem', borderBottom: '1px solid hsl(220 15% 94%)' }}>
        {children}
    </p>
);

const StatusBadge = ({ sk }) => {
    const c = STATUS_CFG[sk] ?? STATUS_CFG.draft;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.06em', backgroundColor: c.bg, color: c.color }}>
            <span style={{ width: '0.35rem', height: '0.35rem', borderRadius: '50%', backgroundColor: c.dot }} />
            {c.label.toUpperCase()}
        </span>
    );
};

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ toast }) => toast ? (
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'leSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {toast.type === 'error' ? <Icons.x /> : <Icons.check />}
        {toast.msg}
    </div>
) : null;

// ─── Confirm modal ────────────────────────────────────────────────────────────

const ConfirmModal = ({ action, title, onConfirm, onClose, processing }) => {
    const meta = {
        delete:  { label: 'Delete Listing',  body: 'This will permanently delete the listing and all its data. This cannot be undone.', warn: true, confirmBg: 'hsl(0 65% 50%)', confirmLabel: 'Delete', icon: Icons.trash },
        suspend: { label: 'Suspend Listing', body: `Suspend "${title}"? It will be hidden from the platform until reactivated.`, warn: false, confirmBg: 'hsl(0 65% 50%)', confirmLabel: 'Suspend', icon: Icons.ban },
    };
    const m = meta[action] ?? meta.delete;
    const ActionIcon = m.icon;
    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.65)', backdropFilter: 'blur(5px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '400px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.1rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.32)', animation: 'leModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ height: '4px', background: 'linear-gradient(90deg, hsl(0 65% 50%), hsl(0 75% 62%))' }} />
                <div style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.75rem', backgroundColor: 'hsl(0 70% 95%)', color: 'hsl(0 65% 44%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ActionIcon /></div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>{m.label}</h3>
                    </div>
                    <p style={{ margin: '0 0 1rem', fontSize: '0.83rem', color: 'hsl(220 15% 35%)', lineHeight: 1.65 }}>{m.body}</p>
                    {m.warn && (
                        <div style={{ padding: '0.6rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(0 70% 97%)', border: '1px solid hsl(0 65% 88%)', fontSize: '0.75rem', color: 'hsl(0 55% 38%)', marginBottom: '1.25rem' }}>
                            ⚠ This action cannot be undone.
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                        <button onClick={onConfirm} disabled={processing}
                            style={{ flex: 2, padding: '0.625rem', borderRadius: '0.6rem', border: 'none', backgroundColor: processing ? 'hsl(220 25% 55%)' : m.confirmBg, color: 'white', fontSize: '0.85rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit' }}>
                            {processing ? <><Icons.spinner />{m.confirmLabel}…</> : <><ActionIcon /> {m.confirmLabel}</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const ListingEdit = ({ listing, agents = [], property_types = [], amenities = [] }) => {
    const l = listing ?? {};
    const statusKey = (l.status ?? 'pending').toLowerCase();

    const { data, setData, put, processing, errors, isDirty, reset } = useForm({
        title:         l.title         ?? l.name          ?? '',
        description:   l.description   ?? '',
        listing_type:  (l.listing_type ?? l.type          ?? 'sale').toLowerCase(),
        property_type: l.property_type ?? l.category      ?? '',
        purpose:          l.purpose          ?? 'rent',
        sale_price:       l.sale_price       ?? '',
        rent_min:         l.rent_min         ?? '',
        rent_max:         l.rent_max         ?? '',
        advance_duration: l.advance_duration ?? '',
        currency:      l.currency      ?? 'GH₵',
        location:      l.location      ?? l.city          ?? '',
        address:       l.address       ?? '',
        bedrooms:      l.bedrooms      ?? l.beds          ?? '',
        bathrooms:     l.bathrooms     ?? l.baths         ?? '',
        toilets:       l.toilets       ?? '',
        area_sqft:     l.area_sqft     ?? l.floor_area    ?? '',
        is_featured:   l.is_featured   ?? l.featured      ?? false,
        is_verified:   l.is_verified   ?? l.verified      ?? false,
        status:        statusKey,
        agent_id:      l.agent?.id     ?? l.agent_id      ?? '',
        amenity_ids:   (l.amenities    ?? []).map(a => a.id ?? a).filter(Boolean),
    });

    const [confirmAct, setConfirmAct] = useState(null); // 'delete' | 'suspend'
    const [actLoading, setActLoading] = useState(false);
    const [toast,      setToast]      = useState(null);
    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/super-admin/listings/${l.id}`, {
            preserveScroll: true,
            onSuccess: () => showToast('Listing updated successfully.'),
            onError:   () => showToast('Please fix the errors below.', 'error'),
        });
    };

    const confirmAction = () => {
        setActLoading(true);
        const isDelete = confirmAct === 'delete';
        const method   = isDelete ? 'delete' : 'post';
        const url      = isDelete
            ? `/super-admin/listings/${l.id}`
            : `/super-admin/listings/${l.id}/suspend`;

        router[method](url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                if (isDelete) {
                    router.visit('/super-admin/listings');
                } else {
                    showToast('Listing suspended.');
                    setConfirmAct(null);
                    router.reload({ only: ['listing'] });
                }
            },
            onError:  () => { showToast('Action failed.', 'error'); setActLoading(false); },
            onFinish: () => setActLoading(false),
        });
    };

    // Live header derived values
    const titleStr  = data.title || 'Listing';
    const hue       = [...titleStr].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    const initials  = titleStr.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

    const toggleAmenity = (id) => {
        setData('amenity_ids', data.amenity_ids.includes(id)
            ? data.amenity_ids.filter(x => x !== id)
            : [...data.amenity_ids, id]
        );
    };

    const allPropTypes = [...new Set([...PROPERTY_TYPES, ...(property_types ?? [])])];

    return (
        <>
            <Toast toast={toast} />
            {confirmAct && (
                <ConfirmModal
                    action={confirmAct}
                    title={l.title ?? 'this listing'}
                    onConfirm={confirmAction}
                    onClose={() => setConfirmAct(null)}
                    processing={actLoading}
                />
            )}

            <div>
                {/* ── Unsaved changes banner ── */}
                {isDirty && (
                    <div style={{ position: 'sticky', top: 0, zIndex: 30, marginBottom: '0.75rem', padding: '0.65rem 1.1rem', borderRadius: '0.65rem', backgroundColor: 'hsl(40 90% 95%)', border: '1px solid hsl(40 80% 82%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', animation: 'leSlideIn 0.2s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                            <span style={{ color: 'hsl(36 80% 40%)', display: 'flex', flexShrink: 0 }}><Icons.alert /></span>
                            <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: '600', color: 'hsl(36 70% 30%)' }}>You have unsaved changes</p>
                        </div>
                        <button type="button" onClick={() => reset()}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: '0.45rem', border: '1px solid hsl(40 70% 70%)', backgroundColor: 'white', color: 'hsl(36 70% 32%)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                            <Icons.reset /> Reset changes
                        </button>
                    </div>
                )}

                {/* ── Page header ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link href={`/super-admin/listings/${l.id}`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                            <Icons.back /> Back
                        </Link>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.15rem', letterSpacing: '-0.02em' }}>Edit Listing</h1>
                            <p style={{ fontSize: '0.8rem', color: 'hsl(220 15% 50%)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                Editing <strong style={{ color: 'hsl(220 25% 22%)' }}>{l.title}</strong>
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'hsl(220 15% 52%)' }}>#{l.id}</span>
                        <StatusBadge sk={statusKey} />
                    </div>
                </div>

                {/* ── Two-column layout ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>

                    {/* ═══ LEFT: form ═══════════════════════════════════════ */}
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>

                        {/* Dark gradient header */}
                        <div style={{ background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))', padding: '1.5rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.07) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {/* Live avatar */}
                                    <div style={{ width: '3rem', height: '3rem', borderRadius: '0.875rem', backgroundColor: `hsl(${hue} 50% 50%)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '800', letterSpacing: '0.02em', transition: 'background-color 0.3s', border: '2px solid hsl(220 30% 30%)', boxShadow: '0 2px 12px hsl(220 28% 6% / 0.4)', flexShrink: 0 }}>
                                        {initials || <Icons.home />}
                                    </div>
                                    <div>
                                        <h2 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: '800', color: 'white', letterSpacing: '-0.01em' }}>
                                            {data.title || 'Listing Title'}
                                        </h2>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(220 20% 62%)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            {data.location || 'No location set'}
                                            {isDirty && <span style={{ color: 'hsl(40 85% 60%)', fontWeight: '600' }}>· Unsaved changes</span>}
                                        </p>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.07em', color: 'hsl(220 20% 55%)', backgroundColor: 'hsl(220 25% 25%)', padding: '0.25rem 0.6rem', borderRadius: '0.4rem' }}>
                                    #{l.id}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

                                {/* ── Basic info ── */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <SectionLabel>Basic Information</SectionLabel>
                                    <FField label="Listing Title" required error={errors.title}>
                                        <FInput value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. Spacious 3-Bed Apartment in East Legon" hasError={!!errors.title} />
                                    </FField>
                                    <FField label="Description" error={errors.description}>
                                        <FTextarea value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Describe the property…" rows={5} hasError={!!errors.description} />
                                    </FField>
                                </div>

                                {/* ── Classification ── */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <SectionLabel>Classification</SectionLabel>

                                    {/* Listing type card selector */}
                                    <FField label="Listing Type" required error={errors.listing_type}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                            {LISTING_TYPES.map(t => {
                                                const active = data.listing_type === t.value;
                                                return (
                                                    <button type="button" key={t.value} onClick={() => setData('listing_type', t.value)}
                                                        style={{ padding: '0.6rem 0.4rem', borderRadius: '0.65rem', border: `1.5px solid ${active ? 'hsl(220 60% 55%)' : 'hsl(220 15% 88%)'}`, backgroundColor: active ? 'hsl(214 100% 97%)' : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', fontFamily: 'inherit', boxShadow: active ? '0 0 0 3px hsl(220 60% 55% / 0.11)' : 'none' }}>
                                                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: active ? 'hsl(214 80% 44%)' : 'hsl(220 25% 22%)' }}>{t.label}</div>
                                                        {active && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.25rem', color: 'hsl(214 80% 48%)' }}><Icons.check /></div>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </FField>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                        <FField label="Property Type" error={errors.property_type}>
                                            <FSelect value={data.property_type} onChange={e => setData('property_type', e.target.value)}>
                                                <option value="">Select type…</option>
                                                {allPropTypes.map(pt => <option key={pt} value={pt.toLowerCase()}>{pt}</option>)}
                                            </FSelect>
                                        </FField>
                                        <FField label="Status" error={errors.status}>
                                            <FSelect value={data.status} onChange={e => setData('status', e.target.value)}>
                                                {ALL_STATUSES.map(s => {
                                                    const cfg = STATUS_CFG[s];
                                                    return <option key={s} value={s}>{cfg?.label ?? s}</option>;
                                                })}
                                            </FSelect>
                                        </FField>
                                    </div>

                                    {/* Agent selector */}
                                    {agents.length > 0 && (
                                        <FField label="Assigned Agent" error={errors.agent_id}>
                                            <FSelect value={data.agent_id} onChange={e => setData('agent_id', e.target.value)}>
                                                <option value="">Unassigned</option>
                                                {agents.map(a => <option key={a.id} value={a.id}>{a.name} {a.agency ? `— ${a.agency}` : ''}</option>)}
                                            </FSelect>
                                        </FField>
                                    )}
                                </div>

                                {/* ── Pricing & location ── */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <SectionLabel>Pricing & Location</SectionLabel>
                                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.875rem' }}>
                                        <FField label="Currency">
                                            <FSelect value={data.currency} onChange={e => setData('currency', e.target.value)}>
                                                {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                            </FSelect>
                                        </FField>

                                        {data.purpose === 'sale' ? (
                                            <FField label="Sale Price" required error={errors.sale_price}>
                                                <FInput
                                                    type="number"
                                                    value={data.sale_price ?? ''}
                                                    onChange={e => setData('sale_price', e.target.value)}
                                                    placeholder="0.00" min="0" step="0.01"
                                                    hasError={!!errors.sale_price}
                                                />
                                            </FField>
                                        ) : (
                                            <>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                                    <FField label="Min Rent / month" required error={errors.rent_min}>
                                                        <FInput
                                                            type="number"
                                                            value={data.rent_min ?? ''}
                                                            onChange={e => setData('rent_min', e.target.value)}
                                                            placeholder="0.00" min="0" step="0.01"
                                                            hasError={!!errors.rent_min}
                                                        />
                                                    </FField>
                                                    <FField label="Max Rent / month" error={errors.rent_max}>
                                                        <FInput
                                                            type="number"
                                                            value={data.rent_max ?? ''}
                                                            onChange={e => setData('rent_max', e.target.value)}
                                                            placeholder="0.00" min="0" step="0.01"
                                                            hasError={!!errors.rent_max}
                                                        />
                                                    </FField>
                                                </div>
                                                <FField label="Advance Duration" hint="Number of months required upfront" error={errors.advance_duration}>
                                                    <FInput
                                                        type="number"
                                                        value={data.advance_duration ?? ''}
                                                        onChange={e => setData('advance_duration', e.target.value)}
                                                        placeholder="e.g. 6" min="1"
                                                    />
                                                </FField>
                                            </>
                                        )}
                                    </div>
                                    <FField label="Location / Area" required error={errors.location}>
                                        <FInput value={data.location} onChange={e => setData('location', e.target.value)} placeholder="e.g. East Legon, Accra" hasError={!!errors.location} />
                                    </FField>
                                    <FField label="Full Address" error={errors.address} hint="Optional — shown to verified leads only">
                                        <FInput value={data.address} onChange={e => setData('address', e.target.value)} placeholder="House number, street, area…" />
                                    </FField>
                                </div>

                                {/* ── Property specs ── */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <SectionLabel>Property Specs</SectionLabel>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem' }}>
                                        <FField label="Bedrooms" error={errors.bedrooms}>
                                            <FInput type="number" value={data.bedrooms} onChange={e => setData('bedrooms', e.target.value)} placeholder="—" min="0" />
                                        </FField>
                                        <FField label="Bathrooms" error={errors.bathrooms}>
                                            <FInput type="number" value={data.bathrooms} onChange={e => setData('bathrooms', e.target.value)} placeholder="—" min="0" />
                                        </FField>
                                        <FField label="Toilets" error={errors.toilets}>
                                            <FInput type="number" value={data.toilets} onChange={e => setData('toilets', e.target.value)} placeholder="—" min="0" />
                                        </FField>
                                        <FField label="Area (sqft)" error={errors.area_sqft}>
                                            <FInput type="number" value={data.area_sqft} onChange={e => setData('area_sqft', e.target.value)} placeholder="—" min="0" />
                                        </FField>
                                    </div>
                                </div>

                                {/* ── Visibility flags ── */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <SectionLabel>Visibility & Trust</SectionLabel>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                                        <Toggle value={data.is_featured} onChange={v => setData('is_featured', v)} label="Featured Listing" sub="Shown in featured sections and highlighted in search" />
                                        <Toggle value={data.is_verified} onChange={v => setData('is_verified', v)} label="Verified Listing" sub="Shows the verified badge — confirms property details are accurate" />
                                    </div>
                                </div>

                                {/* ── Amenities ── */}
                                {amenities.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <SectionLabel>Amenities</SectionLabel>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                            {amenities.map(am => {
                                                const selected = data.amenity_ids.includes(am.id);
                                                return (
                                                    <button type="button" key={am.id} onClick={() => toggleAmenity(am.id)}
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.32rem 0.7rem', borderRadius: '999px', border: `1.5px solid ${selected ? 'hsl(152 55% 50%)' : 'hsl(220 15% 86%)'}`, backgroundColor: selected ? 'hsl(152 55% 94%)' : 'white', color: selected ? 'hsl(152 55% 28%)' : 'hsl(220 15% 42%)', fontSize: '0.76rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                                                        {am.icon && <span>{am.icon}</span>}
                                                        {am.name}
                                                        {selected && <Icons.check />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(220 15% 55%)' }}>{data.amenity_ids.length} selected</p>
                                    </div>
                                )}
                            </div>

                            {/* ── Footer ── */}
                            <div style={{ padding: '1rem 1.75rem 1.5rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                                <Link href={`/super-admin/listings/${l.id}`}
                                    style={{ flex: 1, padding: '0.65rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 30%)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                                    Cancel
                                </Link>
                                <button type="submit" disabled={processing || !isDirty}
                                    style={{ flex: 2, padding: '0.65rem', borderRadius: '0.65rem', border: 'none', backgroundColor: (!isDirty || processing) ? 'hsl(220 15% 80%)' : 'hsl(220 25% 15%)', color: (!isDirty || processing) ? 'hsl(220 15% 55%)' : 'white', fontSize: '0.875rem', fontWeight: '700', cursor: (!isDirty || processing) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { if (isDirty && !processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'; }}
                                    onMouseLeave={e => { if (isDirty && !processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'; }}>
                                    {processing ? <><Icons.spinner /> Saving…</> : isDirty ? <><Icons.save /> Save Changes</> : <><Icons.check /> Up to date</>}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ═══ RIGHT: sidebar ═══════════════════════════════════ */}
                    <div style={{ position: 'sticky', top: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* Record info */}
                        <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', overflow: 'hidden', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                            <div style={{ padding: '0.7rem 1rem', borderBottom: '1px solid hsl(220 15% 94%)', backgroundColor: 'hsl(220 15% 98.5%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'hsl(220 25% 22%)' }}>Record Info</p>
                                <StatusBadge sk={statusKey} />
                            </div>
                            <div style={{ padding: '0.5rem 1rem 0.75rem' }}>
                                {[
                                    { label: 'Listing ID',  value: `#${l.id}` },
                                    { label: 'Views',       value: (l.views ?? l.views_count ?? 0).toLocaleString() },
                                    { label: 'Inquiries',   value: l.inquiries ?? l.inquiries_count ?? 0 },
                                    { label: 'Created',     value: fmtDate(l.created_at) },
                                    { label: 'Updated',     value: fmtDate(l.updated_at) },
                                ].map(({ label, value }) => (
                                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0', borderBottom: '1px solid hsl(220 15% 95%)' }}>
                                        <span style={{ fontSize: '0.74rem', color: 'hsl(220 15% 52%)' }}>{label}</span>
                                        <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'hsl(220 25% 22%)' }}>{value ?? '—'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick actions */}
                        <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '1rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                            <p style={{ margin: '0 0 0.75rem', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)' }}>Quick Actions</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                                <Link href={`/super-admin/listings/${l.id}`}
                                    style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(214 80% 88%)', backgroundColor: 'hsl(214 100% 97%)', color: 'hsl(214 80% 44%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', textDecoration: 'none', boxSizing: 'border-box', transition: 'filter 0.12s' }}
                                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                    <Icons.eye /> View Listing
                                </Link>
                                {statusKey !== 'suspended' && (
                                    <button type="button" onClick={() => setConfirmAct('suspend')}
                                        style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(0 65% 88%)', backgroundColor: 'hsl(0 65% 97%)', color: 'hsl(0 62% 46%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                        <Icons.ban /> Suspend Listing
                                    </button>
                                )}
                                <button type="button" onClick={() => setConfirmAct('delete')}
                                    style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(0 65% 88%)', backgroundColor: 'hsl(0 65% 97%)', color: 'hsl(0 62% 46%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.94)'}
                                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                    <Icons.trash /> Delete Listing
                                </button>
                            </div>
                        </div>

                        {/* Danger zone */}
                        <div style={{ backgroundColor: 'hsl(0 70% 98%)', border: '1px solid hsl(0 65% 88%)', borderRadius: '0.875rem', padding: '1rem' }}>
                            <p style={{ margin: '0 0 0.4rem', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(0 65% 44%)' }}>Danger Zone</p>
                            <p style={{ margin: '0 0 0.75rem', fontSize: '0.74rem', color: 'hsl(0 40% 45%)', lineHeight: 1.55 }}>
                                Deleting this listing is permanent and removes all associated inquiries, images, and data.
                            </p>
                            <button type="button" onClick={() => setConfirmAct('delete')}
                                style={{ width: '100%', padding: '0.55rem', borderRadius: '0.55rem', border: 'none', backgroundColor: 'hsl(0 65% 50%)', color: 'white', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'filter 0.12s' }}
                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                                onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                                <Icons.trash /> Delete This Listing
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes leSpin    { to { transform: rotate(360deg); } }
                @keyframes leSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes leModalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
            `}</style>
        </>
    );
};

ListingEdit.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default ListingEdit;