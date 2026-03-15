import React, { useState, useRef, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
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
    dollar:  () => <Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    image:   () => <Ico d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    upload:  () => <Ico d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />,
    user:    () => <Ico d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
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

// const PROPERTY_TYPES = [
//     'Apartment', 'House', 'Land', 'Commercial', 'Office',
//     'Shop', 'Warehouse', 'Villa', 'Studio', 'Duplex', 'Bungalow', 'Mansion',
// ];

const CURRENCIES = [
    { value: 'GH₵', label: 'GH₵ GHS' },
    { value: '$',   label: '$ USD' },
    { value: '£',   label: '£ GBP' },
    { value: '€',   label: '€ EUR' },
    { value: '₦',   label: '₦ NGN' },
];

const ALL_STATUSES = ['active','pending','sold','rented','rejected','draft','expired','flagged','suspended'];

const STEPS = [
    { number: 1, label: 'Property Info',  icon: Icons.home },
    { number: 2, label: 'Pricing',        icon: Icons.dollar },
    { number: 3, label: 'Images',         icon: Icons.image },
    { number: 4, label: 'Review',         icon: Icons.check },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return v; }
};

const parseImages = (raw) => {
    if (!raw) return [];
    try {
        if (Array.isArray(raw)) return raw;
        if (typeof raw === 'string') { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; }
        return [];
    } catch { return []; }
};

// ─── Field atoms ──────────────────────────────────────────────────────────────

const inputStyle = (focused, hasError) => ({
    width: '100%', padding: '0.6rem 0.875rem',
    border: `1.5px solid ${hasError ? 'hsl(0 65% 60%)' : focused ? 'hsl(220 60% 55%)' : 'hsl(220 15% 88%)'}`,
    borderRadius: '0.6rem', fontSize: '0.875rem', color: 'hsl(220 25% 16%)',
    backgroundColor: 'white', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    boxShadow: focused && !hasError ? '0 0 0 3px hsl(220 60% 55% / 0.11)' : hasError ? '0 0 0 3px hsl(0 65% 55% / 0.1)' : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
});

const FField = ({ label, required, hint, error, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32rem' }}>
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
        delete:  { label: 'Delete Listing',  body: 'This will permanently delete the listing and all its data. This cannot be undone.', warn: true,  confirmBg: 'hsl(0 65% 50%)', confirmLabel: 'Delete',  icon: Icons.trash },
        suspend: { label: 'Suspend Listing', body: `Suspend "${title}"? It will be hidden from the platform until reactivated.`,          warn: false, confirmBg: 'hsl(0 65% 50%)', confirmLabel: 'Suspend', icon: Icons.ban },
    };
    const m = meta[action] ?? meta.delete;
    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.65)', backdropFilter: 'blur(5px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '400px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.1rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.32)', animation: 'leModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ height: '4px', background: 'linear-gradient(90deg, hsl(0 65% 50%), hsl(0 75% 62%))' }} />
                <div style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.75rem', backgroundColor: 'hsl(0 70% 95%)', color: 'hsl(0 65% 44%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><m.icon /></div>
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
                            {processing ? <><Icons.spinner /> {m.confirmLabel}…</> : <><m.icon /> {m.confirmLabel}</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Step progress bar ────────────────────────────────────────────────────────

const StepBar = ({ current }) => (
    <div style={{ backgroundColor: 'white', borderBottom: '1px solid hsl(220 15% 91%)', padding: '1rem 1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '640px', margin: '0 auto' }}>
            {STEPS.map((step, i) => {
                const done   = current > step.number;
                const active = current === step.number;
                return (
                    <React.Fragment key={step.number}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: done ? 'hsl(152 55% 38%)' : active ? 'hsl(220 25% 15%)' : 'hsl(220 15% 92%)', color: done || active ? 'white' : 'hsl(220 15% 52%)', transition: 'all 0.25s', flexShrink: 0 }}>
                                {done ? <Icons.check /> : <step.icon />}
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: '700', color: active ? 'hsl(220 25% 15%)' : done ? 'hsl(152 55% 32%)' : 'hsl(220 15% 52%)', whiteSpace: 'nowrap', display: 'none' /* shown on sm+ via media query */ }}>
                                {step.label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div style={{ flex: 1, height: '2px', backgroundColor: done ? 'hsl(152 55% 38%)' : 'hsl(220 15% 88%)', margin: '0 0.5rem', marginBottom: '0.9rem', transition: 'background-color 0.25s' }} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
        {/* Step label below */}
        <p style={{ margin: '0.5rem 0 0', textAlign: 'center', fontSize: '0.78rem', fontWeight: '600', color: 'hsl(220 25% 22%)' }}>
            Step {current} of {STEPS.length} — <span style={{ color: 'hsl(220 15% 50%)', fontWeight: '500' }}>{STEPS[current - 1].label}</span>
        </p>
    </div>
);

// ─── Review row ───────────────────────────────────────────────────────────────

const ReviewRow = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0', borderBottom: '1px solid hsl(220 15% 95%)' }}>
        <span style={{ fontSize: '0.78rem', color: 'hsl(220 15% 50%)' }}>{label}</span>
        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'hsl(220 25% 18%)', textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{value || '—'}</span>
    </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const ListingEdit = ({ listing, agents = [], property_types = [], amenities = [] }) => {
    const l          = listing ?? {};
    const statusKey  = (l.status ?? 'pending').toLowerCase();

    // ── Form state ────────────────────────────────────────────────────────────
    const [form, setForm] = useState({
        title:            l.title         ?? '',
        description:      l.description   ?? '',
        listing_type:     (l.listing_type ?? l.type ?? 'sale').toLowerCase(),
        purpose:          l.purpose       ?? (l.listing_type === 'sale' ? 'sale' : 'rent'),
        property_type:    l.property_type ?? '',
        sale_price:       l.sale_price    ?? '',
        rent_min:         l.rent_min      ?? '',
        rent_max:         l.rent_max      ?? '',
        advance_duration: l.advance_duration ?? '',
        currency:         l.currency     ?? 'GH₵',
        location:         l.location     ?? l.city ?? '',
        address:          l.address      ?? '',
        bedrooms:         l.bedrooms     ?? '',
        bathrooms:        l.bathrooms    ?? '',
        area:             l.area          ?? '',
        // is_featured:      l.is_featured  ?? false,
        is_verified:      l.is_verified  ?? false,
        status:           statusKey,
        agent_id:         l.agent?.id    ?? l.agent_id ?? '',
        amenity_ids:      (l.amenities   ?? []).map(a => a.id ?? a).filter(Boolean),
    });

    const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
    const toggleAmenity = (id) => set('amenity_ids', form.amenity_ids.includes(id) ? form.amenity_ids.filter(x => x !== id) : [...form.amenity_ids, id]);

    // ── Image state ───────────────────────────────────────────────────────────
    const [existingImages, setExistingImages] = useState(() =>
        parseImages(l.images).map((img, i) => {
            const path = typeof img === 'string' ? img : (img?.path ?? img?.url ?? '');
            return {
                id:         `existing-${i}`,
                path,
                preview:     `/storage/rental_images/${path}`,
                isExisting: true,
            };
        })
    );
    const [newImages,     setNewImages]     = useState([]);
    const [removedImages, setRemovedImages] = useState([]);

    const allImages  = [...existingImages, ...newImages];
    const imageCount = allImages.length;

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const valid = files.filter(f => {
            if (f.size > 5 * 1024 * 1024) { showToast(`${f.name} exceeds 5 MB.`, 'error'); return false; }
            return true;
        });
        if (imageCount + valid.length > 6) { showToast('Maximum 6 images allowed.', 'error'); return; }
        setNewImages(prev => [...prev, ...valid.map(f => ({
            id:      Math.random().toString(36).slice(2),
            file:    f,
            preview: URL.createObjectURL(f),
            name:    f.name,
            isExisting: false,
        }))]);
        e.target.value = '';
    };

    const removeImage = (id, isExisting) => {
        if (isExisting) {
            const img = existingImages.find(i => i.id === id);
            setExistingImages(prev => prev.filter(i => i.id !== id));
            if (img) setRemovedImages(prev => [...prev, img.path]);
        } else {
            setNewImages(prev => prev.filter(i => i.id !== id));
        }
    };

    // ── Step / errors state ───────────────────────────────────────────────────
    const [step,       setStep]       = useState(1);
    const [errors,     setErrors]     = useState({});
    const [processing, setProcessing] = useState(false);
    const [confirmAct, setConfirmAct] = useState(null);
    const [actLoading, setActLoading] = useState(false);
    const [toast,      setToast]      = useState(null);
    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    // ── Step validation ───────────────────────────────────────────────────────
    const validateStep = (s) => {
        const e = {};
        if (s === 1) {
            if (!form.title.trim())          e.title         = 'Title is required.';
            if (!form.listing_type)          e.listing_type  = 'Listing type is required.';
            if (!form.location.trim())       e.location      = 'Location is required.';
        }
        if (s === 2) {
            if (form.purpose === 'sale') {
                if (!form.sale_price)        e.sale_price    = 'Sale price is required.';
            } else {
                if (!form.rent_min)          e.rent_min      = 'Minimum rent is required.';
                if (form.rent_max && parseFloat(form.rent_max) < parseFloat(form.rent_min))
                                             e.rent_max      = 'Max rent must be ≥ min rent.';
            }
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => { if (validateStep(step)) setStep(s => Math.min(s + 1, 4)); };
    const handlePrev = () => setStep(s => Math.max(s - 1, 1));

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = () => {
        if (!validateStep(step)) return;
        setProcessing(true);

        const fd = new FormData();
        fd.append('_method', 'PUT');

        // Text fields
        Object.entries(form).forEach(([k, v]) => {
            if (k === 'amenity_ids') {
                v.forEach((id, i) => fd.append(`amenity_ids[${i}]`, id));
            } else {
                fd.append(k, v === null || v === undefined ? '' : v);
            }
        });

        // Images
        existingImages.forEach((img, i) => fd.append(`existingImages[${i}]`, img.path));
        removedImages.forEach((path, i)  => fd.append(`removedImages[${i}]`, path));
        newImages.forEach((img, i)        => fd.append(`newImages[${i}]`, img.file));

        axios.post(`/super-admin/listings/${l.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(() => {
                showToast('Listing updated successfully.');
                setTimeout(() => router.visit(`/super-admin/listings/${l.id}`), 1200);
            })
            .catch(err => {
                const data = err.response?.data;
                if (data?.errors) {
                    setErrors(data.errors);
                    // Jump back to the step that has errors
                    const keys = Object.keys(data.errors);
                    if (keys.some(k => ['title','listing_type','location','property_type','description'].includes(k))) setStep(1);
                    else if (keys.some(k => ['sale_price','rent_min','rent_max','bedrooms','currency'].includes(k))) setStep(2);
                    showToast('Please fix the errors below.', 'error');
                } else {
                    showToast(data?.message ?? 'Update failed. Please try again.', 'error');
                }
                setProcessing(false);
            });
    };

    // ── Danger actions ────────────────────────────────────────────────────────
    const confirmAction = () => {
        setActLoading(true);
        const isDelete = confirmAct === 'delete';
        router[isDelete ? 'delete' : 'post'](
            isDelete ? `/super-admin/listings/${l.id}` : `/super-admin/listings/${l.id}/suspend`,
            {},
            {
                onSuccess: () => { isDelete ? router.visit('/super-admin/listings') : (showToast('Listing suspended.'), setConfirmAct(null)); },
                onError:   () => { showToast('Action failed.', 'error'); setActLoading(false); },
                onFinish:  () => setActLoading(false),
            }
        );
    };

    // ── Derived ───────────────────────────────────────────────────────────────
    const allPropTypes = [...new Set([ ...(property_types ?? [])])];
    const titleStr     = form.title || 'Listing';
    const hue          = [...titleStr].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    const initials     = titleStr.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
    const isSale       = form.purpose === 'sale';

    return (
        <>
            <Toast toast={toast} />
            {confirmAct && (
                <ConfirmModal action={confirmAct} title={l.title ?? 'this listing'}
                    onConfirm={confirmAction} onClose={() => setConfirmAct(null)} processing={actLoading} />
            )}

            <div>
                {/* ── Page header ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link href={`/super-admin/listings/${l.id}`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                            <Icons.back /> Back
                        </Link>
                        <div>
                            <h1 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.12rem', letterSpacing: '-0.02em' }}>Edit Listing</h1>
                            <p style={{ fontSize: '0.78rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 272px', gap: '1.25rem', alignItems: 'start' }}>

                    {/* ═══ LEFT: wizard card ════════════════════════════════ */}
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>

                        {/* Dark header */}
                        <div style={{ background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))', padding: '1.25rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.07) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.875rem', backgroundColor: `hsl(${hue} 50% 50%)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem', fontWeight: '800', flexShrink: 0, border: '2px solid hsl(220 30% 30%)', boxShadow: '0 2px 12px hsl(220 28% 6% / 0.4)' }}>
                                        {initials || <Icons.home />}
                                    </div>
                                    <div>
                                        <h2 style={{ margin: '0 0 0.15rem', fontSize: '1rem', fontWeight: '800', color: 'white' }}>{form.title || 'Listing Title'}</h2>
                                        <p style={{ margin: 0, fontSize: '0.73rem', color: 'hsl(220 20% 58%)' }}>{form.location || 'No location set'}</p>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'hsl(220 20% 55%)', backgroundColor: 'hsl(220 25% 25%)', padding: '0.22rem 0.6rem', borderRadius: '0.4rem' }}>#{l.id}</span>
                            </div>
                        </div>

                        {/* Step bar */}
                        <StepBar current={step} />

                        {/* Step content */}
                        <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                            {/* ── STEP 1: Property info ── */}
                            {step === 1 && (
                                <>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <SectionLabel>Basic Information</SectionLabel>

                                        <FField label="Listing Title" required error={errors.title}>
                                            <FInput value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Spacious 3-Bed Apartment in East Legon" hasError={!!errors.title} />
                                        </FField>

                                        <FField label="Description" error={errors.description}>
                                            <FTextarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the property…" rows={4} />
                                        </FField>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <SectionLabel>Classification</SectionLabel>

                                        {/* Listing type */}
                                        <FField label="Listing Type" required error={errors.purpose}>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                                {LISTING_TYPES.map(t => {
                                                    const active = form.purpose === t.value;
                                                    return (
                                                        <button type="button" key={t.value}
                                                            onClick={() => { set('purpose', t.value); set('purpose', t.value === 'sale' ? 'sale' : 'rent'); }}
                                                            style={{ padding: '0.6rem 0.4rem', borderRadius: '0.65rem', border: `1.5px solid ${active ? 'hsl(220 60% 55%)' : 'hsl(220 15% 88%)'}`, backgroundColor: active ? 'hsl(214 100% 97%)' : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', fontFamily: 'inherit', boxShadow: active ? '0 0 0 3px hsl(220 60% 55% / 0.11)' : 'none' }}>
                                                            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: active ? 'hsl(214 80% 44%)' : 'hsl(220 25% 22%)' }}>{t.label}</div>
                                                            {active && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.2rem', color: 'hsl(214 80% 48%)' }}><Icons.check /></div>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </FField>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                            <FField label="Property Type" error={errors.property_type}>
                                                <FSelect value={form.property_type} onChange={e => set('property_type', e.target.value)}>
                                                    {/* <option value="">Select type…</option> */}
                                                    {allPropTypes.map(pt => <option key={pt} value={pt.toLowerCase()}>{pt}</option>)}
                                                </FSelect>
                                            </FField>
                                            <FField label="Status" error={errors.status}>
                                                <FSelect value={form.status} onChange={e => set('status', e.target.value)}>
                                                    {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_CFG[s]?.label ?? s}</option>)}
                                                </FSelect>
                                            </FField>
                                        </div>

                                        {agents.length > 0 && (
                                            <FField label="Assigned Agent" error={errors.agent_id}>
                                                <FSelect value={form.agent_id} onChange={e => set('agent_id', e.target.value)}>
                                                    <option value="">Unassigned</option>
                                                    {agents.map(a => <option key={a.id} value={a.id}>{a.name}{a.agency ? ` — ${a.agency}` : ''}</option>)}
                                                </FSelect>
                                            </FField>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <SectionLabel>Location</SectionLabel>
                                        <FField label="Region" required error={errors.location}>
                                            <FInput value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. East Legon, Accra" hasError={!!errors.location} />
                                        </FField>
                                        <FField label="Location / Area" required error={errors.location}>
                                            <FInput value={form.area} onChange={e => set('location', e.target.value)} placeholder="e.g. East Legon, Spintex" hasError={!!errors.location} />
                                        </FField>
                                        <FField label="Full Address" hint="Optional — shown to verified leads only" error={errors.address}>
                                            <FInput value={form.address} onChange={e => set('address', e.target.value)} placeholder="House number, street, area…" />
                                        </FField>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <SectionLabel>Visibility & Trust</SectionLabel>
                                        <Toggle value={form.is_featured} onChange={v => set('is_featured', v)} label="Featured Listing" sub="Highlighted in search and featured sections" />
                                        <Toggle value={form.is_verified} onChange={v => set('is_verified', v)} label="Verified Listing" sub="Shows the verified badge on the listing" />
                                    </div>
                                </>
                            )}

                            {/* ── STEP 2: Pricing & specs ── */}
                            {step === 2 && (
                                <>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <SectionLabel>Pricing</SectionLabel>
                                        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.875rem' }}>
                                            <FField label="Currency">
                                                <FSelect value={form.currency} onChange={e => set('currency', e.target.value)}>
                                                    {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                                </FSelect>
                                            </FField>

                                            {isSale ? (
                                                <FField label="Sale Price" required error={errors.sale_price}>
                                                    <FInput type="number" value={form.sale_price} onChange={e => set('sale_price', e.target.value)} placeholder="0.00" min="0" step="0.01" hasError={!!errors.sale_price} />
                                                </FField>
                                            ) : (
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                                    <FField label="Min Rent / mo" required error={errors.rent_min}>
                                                        <FInput type="number" value={form.rent_min} onChange={e => set('rent_min', e.target.value)} placeholder="0.00" min="0" step="0.01" hasError={!!errors.rent_min} />
                                                    </FField>
                                                    <FField label="Max Rent / mo" error={errors.rent_max}>
                                                        <FInput type="number" value={form.rent_max} onChange={e => set('rent_max', e.target.value)} placeholder="0.00" min="0" step="0.01" hasError={!!errors.rent_max} />
                                                    </FField>
                                                </div>
                                            )}
                                        </div>

                                        {!isSale && (
                                            <FField label="Advance Duration" hint="Number of years required upfront" error={errors.advance_duration}>
                                                <FInput type="number" value={form.advance_duration} onChange={e => set('advance_duration', e.target.value)} placeholder="e.g. 6" min="1" />
                                            </FField>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <SectionLabel>Property Specs</SectionLabel>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.875rem' }}>
                                            <FField label="Bedrooms" error={errors.bedrooms}>
                                                <FInput type="number" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} placeholder="—" min="0" />
                                            </FField>
                                            <FField label="Bathrooms" error={errors.bathrooms}>
                                                <FInput type="number" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} placeholder="—" min="0" />
                                            </FField>
                                            {/* <FField label="Toilets" error={errors.toilets}>
                                                <FInput type="number" value={form.toilets} onChange={e => set('toilets', e.target.value)} placeholder="—" min="0" />
                                            </FField> */}
                                            {/* <FField label="Area (sqft)" error={errors.area_sqft}>
                                                <FInput type="number" value={form.area_sqft} onChange={e => set('area_sqft', e.target.value)} placeholder="—" min="0" />
                                            </FField> */}
                                        </div>
                                    </div>

                                    {amenities.length > 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <SectionLabel>Amenities</SectionLabel>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                                {amenities.map(am => {
                                                    const selected = form.amenity_ids.includes(am.id);
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
                                            <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(220 15% 55%)' }}>{form.amenity_ids.length} selected</p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* ── STEP 3: Images ── */}
                            {step === 3 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <SectionLabel>Listing Images ({imageCount}/6)</SectionLabel>

                                    {existingImages.length > 0 && (
                                        <div style={{ padding: '0.6rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(214 100% 96%)', border: '1px solid hsl(214 80% 88%)', fontSize: '0.75rem', color: 'hsl(214 80% 38%)' }}>
                                            📷 {existingImages.length} existing image{existingImages.length !== 1 ? 's' : ''} loaded
                                            {newImages.length > 0 && ` · ${newImages.length} new to upload`}
                                        </div>
                                    )}

                                    {/* Upload zone */}
                                    {imageCount < 6 && (
                                        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '7rem', border: '2px dashed hsl(220 15% 82%)', borderRadius: '0.75rem', backgroundColor: 'hsl(220 15% 98.5%)', cursor: 'pointer', transition: 'all 0.15s', gap: '0.5rem' }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(220 25% 55%)'; e.currentTarget.style.backgroundColor = 'hsl(214 100% 98%)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'hsl(220 15% 82%)'; e.currentTarget.style.backgroundColor = 'hsl(220 15% 98.5%)'; }}>
                                            <span style={{ color: 'hsl(220 15% 52%)', display: 'flex' }}><Icons.upload /></span>
                                            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'hsl(220 25% 38%)' }}>Click to upload images</span>
                                            <span style={{ fontSize: '0.7rem', color: 'hsl(220 15% 55%)' }}>JPEG, PNG, GIF · max 5 MB each</span>
                                            <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageUpload} />
                                        </label>
                                    )}

                                    {/* Image grid */}
                                    {imageCount > 0 && (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                                            {allImages.map(img => (
                                                <div key={img.id} style={{ position: 'relative', aspectRatio: '1', borderRadius: '0.65rem', overflow: 'hidden', border: img.isExisting ? '2px solid hsl(214 80% 72%)' : '2px solid hsl(152 55% 68%)' }}>
                                                    <img src={img.preview} alt={img.name ?? img.path}
                                                        onError={e => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e2e8f0" width="100" height="100"/%3E%3C/svg%3E'; }}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    {/* Badge */}
                                                    <div style={{ position: 'absolute', top: '0.35rem', left: '0.35rem', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.6rem', fontWeight: '700', backgroundColor: img.isExisting ? 'hsl(214 80% 50%)' : 'hsl(152 55% 38%)', color: 'white' }}>
                                                        {img.isExisting ? 'Saved' : 'New'}
                                                    </div>
                                                    {/* Remove */}
                                                    <button type="button" onClick={() => removeImage(img.id, img.isExisting)}
                                                        style={{ position: 'absolute', top: '0.35rem', right: '0.35rem', width: '1.4rem', height: '1.4rem', borderRadius: '50%', border: 'none', backgroundColor: 'hsl(0 65% 50%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                                                        <Icons.x />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {imageCount === 0 && (
                                        <p style={{ margin: 0, fontSize: '0.78rem', color: 'hsl(220 15% 55%)', textAlign: 'center' }}>No images yet. Upload up to 6.</p>
                                    )}
                                </div>
                            )}

                            {/* ── STEP 4: Review ── */}
                            {step === 4 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <SectionLabel>Review before saving</SectionLabel>

                                    {/* Property */}
                                    <div style={{ borderRadius: '0.75rem', backgroundColor: 'hsl(220 15% 97.5%)', border: '1px solid hsl(220 15% 91%)', overflow: 'hidden' }}>
                                        <div style={{ padding: '0.6rem 1rem', backgroundColor: 'hsl(220 15% 95%)', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(220 25% 35%)' }}>Property Info</div>
                                        <div style={{ padding: '0.25rem 1rem 0.5rem' }}>
                                            <ReviewRow label="Title"       value={form.title} />
                                            <ReviewRow label="Type"        value={(form.purpose).toLowerCase()} />
                                            <ReviewRow label="Property"    value={form.property_type} />
                                            <ReviewRow label="Location"    value={form.location} />
                                            <ReviewRow label="Address"     value={form.address} />
                                            <ReviewRow label="Status"      value={STATUS_CFG[form.status]?.label ?? form.status} />
                                            {/* <ReviewRow label="Featured"    value={form.is_featured ? 'Yes' : 'No'} /> */}
                                            <ReviewRow label="Verified"    value={form.is_verified ? 'Yes' : 'No'} />
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div style={{ borderRadius: '0.75rem', backgroundColor: 'hsl(220 15% 97.5%)', border: '1px solid hsl(220 15% 91%)', overflow: 'hidden' }}>
                                        <div style={{ padding: '0.6rem 1rem', backgroundColor: 'hsl(220 15% 95%)', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(220 25% 35%)' }}>Pricing & Specs</div>
                                        <div style={{ padding: '0.25rem 1rem 0.5rem' }}>
                                            {isSale
                                                ? <ReviewRow label="Sale Price" value={form.sale_price ? `${form.currency} ${Number(form.sale_price).toLocaleString()}` : '—'} />
                                                : <>
                                                    <ReviewRow label="Min Rent" value={form.rent_min ? `${form.currency} ${Number(form.rent_min).toLocaleString()}/mo` : '—'} />
                                                    <ReviewRow label="Max Rent" value={form.rent_max ? `${form.currency} ${Number(form.rent_max).toLocaleString()}/mo` : '—'} />
                                                    <ReviewRow label="Advance"  value={form.advance_duration ? `${form.advance_duration} year(s)` : '—'} />
                                                </>
                                            }
                                            <ReviewRow label="Bedrooms"  value={form.bedrooms} />
                                            <ReviewRow label="Bathrooms" value={form.bathrooms} />
                                            {/* <ReviewRow label="Toilets"   value={form.toilets} /> */}
                                            {/* <ReviewRow label="Area"      value={form.area_sqft ? `${form.area_sqft} sqft` : '—'} /> */}
                                            {form.amenity_ids.length > 0 && (
                                                <ReviewRow label="Amenities" value={`${form.amenity_ids.length} selected`} />
                                            )}
                                        </div>
                                    </div>

                                    {/* Images */}
                                    <div style={{ borderRadius: '0.75rem', backgroundColor: 'hsl(220 15% 97.5%)', border: '1px solid hsl(220 15% 91%)', overflow: 'hidden' }}>
                                        <div style={{ padding: '0.6rem 1rem', backgroundColor: 'hsl(220 15% 95%)', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'hsl(220 25% 35%)' }}>Images ({imageCount})</div>
                                        {imageCount > 0 ? (
                                            <div style={{ padding: '0.75rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.4rem' }}>
                                                {allImages.map(img => (
                                                    <div key={img.id} style={{ aspectRatio: '1', borderRadius: '0.4rem', overflow: 'hidden' }}>
                                                        <img src={img.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p style={{ margin: 0, padding: '0.75rem 1rem', fontSize: '0.78rem', color: 'hsl(220 15% 55%)' }}>No images attached.</p>
                                        )}
                                    </div>

                                    {/* Info banner */}
                                    <div style={{ padding: '0.75rem 1rem', borderRadius: '0.6rem', backgroundColor: 'hsl(152 60% 96%)', border: '1px solid hsl(152 55% 85%)', fontSize: '0.78rem', color: 'hsl(152 55% 28%)', lineHeight: 1.6 }}>
                                        ✓ All changes save immediately. The listing page will reflect updates within a few seconds.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Step navigation footer ── */}
                        <div style={{ padding: '1rem 1.75rem 1.5rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', gap: '0.65rem' }}>
                            {step > 1 ? (
                                <button type="button" onClick={handlePrev}
                                    style={{ flex: 1, padding: '0.65rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                                    Previous
                                </button>
                            ) : (
                                <Link href={`/super-admin/listings/${l.id}`}
                                    style={{ flex: 1, padding: '0.65rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 30%)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                                    Cancel
                                </Link>
                            )}

                            {step < 4 ? (
                                <button type="button" onClick={handleNext}
                                    style={{ flex: 2, padding: '0.65rem', borderRadius: '0.65rem', border: 'none', backgroundColor: 'hsl(220 25% 15%)', color: 'white', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'background-color 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'}>
                                    Next Step →
                                </button>
                            ) : (
                                <button type="button" onClick={handleSubmit} disabled={processing}
                                    style={{ flex: 2, padding: '0.65rem', borderRadius: '0.65rem', border: 'none', backgroundColor: processing ? 'hsl(220 25% 55%)' : 'hsl(152 55% 33%)', color: 'white', fontSize: '0.875rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'background-color 0.15s' }}>
                                    {processing ? <><Icons.spinner /> Saving…</> : <><Icons.save /> Save Changes</>}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ═══ RIGHT: sidebar ═══════════════════════════════════ */}
                    <div style={{ position: 'sticky', top: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* Record info */}
                        <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', overflow: 'hidden', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                            <div style={{ padding: '0.7rem 1rem', borderBottom: '1px solid hsl(220 15% 94%)', backgroundColor: 'hsl(220 15% 98.5%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'hsl(220 25% 22%)' }}>Record Info</p>
                                <StatusBadge sk={statusKey} />
                            </div>
                            <div style={{ padding: '0.5rem 1rem 0.75rem' }}>
                                {[
                                    { label: 'Listing ID', value: `#${l.id}` },
                                    { label: 'Views',      value: (l.views_count ?? l.views ?? 0).toLocaleString() },
                                    { label: 'Inquiries',  value: l.inquiries_count ?? l.inquiries ?? 0 },
                                    { label: 'Created',    value: fmtDate(l.created_at) },
                                    { label: 'Updated',    value: fmtDate(l.updated_at) },
                                    { label: 'Images',     value: `${imageCount} / 6` },
                                ].map(({ label, value }) => (
                                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.42rem 0', borderBottom: '1px solid hsl(220 15% 95%)' }}>
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
                                    style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(214 80% 88%)', backgroundColor: 'hsl(214 100% 97%)', color: 'hsl(214 80% 44%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', textDecoration: 'none', boxSizing: 'border-box' }}>
                                    <Icons.back /> View Listing
                                </Link>
                                {statusKey !== 'suspended' && (
                                    <button type="button" onClick={() => setConfirmAct('suspend')}
                                        style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(0 65% 88%)', backgroundColor: 'hsl(0 65% 97%)', color: 'hsl(0 62% 46%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit' }}>
                                        <Icons.ban /> Suspend Listing
                                    </button>
                                )}
                                <button type="button" onClick={() => setConfirmAct('delete')}
                                    style={{ width: '100%', padding: '0.55rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(0 65% 88%)', backgroundColor: 'hsl(0 65% 97%)', color: 'hsl(0 62% 46%)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit' }}>
                                    <Icons.trash /> Delete Listing
                                </button>
                            </div>
                        </div>

                        {/* Danger zone */}
                        <div style={{ backgroundColor: 'hsl(0 70% 98%)', border: '1px solid hsl(0 65% 88%)', borderRadius: '0.875rem', padding: '1rem' }}>
                            <p style={{ margin: '0 0 0.35rem', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(0 65% 44%)' }}>Danger Zone</p>
                            <p style={{ margin: '0 0 0.75rem', fontSize: '0.74rem', color: 'hsl(0 40% 45%)', lineHeight: 1.55 }}>
                                Deleting this listing is permanent and removes all associated inquiries, images, and data.
                            </p>
                            <button type="button" onClick={() => setConfirmAct('delete')}
                                style={{ width: '100%', padding: '0.55rem', borderRadius: '0.55rem', border: 'none', backgroundColor: 'hsl(0 65% 50%)', color: 'white', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit' }}
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