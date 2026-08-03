import React, { useState, useRef, useMemo } from 'react';
import { router, usePage, Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { useRefresh } from '@/Hooks/useRefresh';

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = ({ d, size = '1rem', sw = 1.75 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    search:   () => <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    plus:     () => <Ico d="M12 4v16m8-8H4" size="0.95rem" />,
    edit:     () => <Ico d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" size="0.85rem" />,
    trash:    () => <Ico d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" size="0.85rem" />,
    x:        () => <Ico d="M6 18L18 6M6 6l12 12" size="0.9rem" />,
    check:    () => <Ico d="M5 13l4 4L19 7" size="0.85rem" />,
    alert:    () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size="1rem" />,
    grid:     () => <Ico d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" size="0.9rem" />,
    list:     () => <Ico d="M4 6h16M4 10h16M4 14h16M4 18h16" size="0.9rem" />,
    star:     () => <Ico d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" size="0.85rem" />,
    listings: () => <Ico d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" size="0.85rem" />,
    refresh:  () => <Ico d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" size="0.9rem" />,
    wifi:     () => <Ico d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" size="1.4rem" sw={1.5} />,
    pool:     () => <Ico d="M3 10h18M3 14h18M5 6l2 2 2-2 2 2 2-2 2 2 2-2M5 18l2 2 2-2 2 2 2-2 2 2 2-2" size="1.4rem" sw={1.5} />,
    parking:  () => <Ico d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm4 5h3a2 2 0 010 4H9V8zm0 4v4" size="1.4rem" sw={1.5} />,
    gym:      () => <Ico d="M3 10h2m14 0h2M7 7v10M17 7v10M7 10h10" size="1.4rem" sw={1.5} />,
    security: () => <Ico d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" size="1.4rem" sw={1.5} />,
    garden:   () => <Ico d="M12 22V12m0 0C12 7 7 5 3 7m9 5c0-5 5-7 9-5M9 15.5C7 14 5 14 3 16m18-1c-2-1.5-4-1.5-6 0" size="1.4rem" sw={1.5} />,
    elevator: () => <Ico d="M7 16V4m0 0L4 7m3-3l3 3m7 1v12m0 0l3-3m-3 3l-3-3" size="1.4rem" sw={1.5} />,
    water:    () => <Ico d="M12 2C6.48 2 4 8 4 12c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4-2.48-10-8-10zm0 14c-2.21 0-4-1.79-4-4" size="1.4rem" sw={1.5} />,
    electric: () => <Ico d="M13 10V3L4 14h7v7l9-11h-7z" size="1.4rem" sw={1.5} />,
    balcony:  () => <Ico d="M3 12h18M3 12v7h18v-7M3 12l9-9 9 9" size="1.4rem" sw={1.5} />,
    pet:      () => <Ico d="M12 2a4 4 0 100 8 4 4 0 000-8zm-7 9a3 3 0 100 6 3 3 0 000-6zm14 0a3 3 0 100 6 3 3 0 000-6zm-5 9a3 3 0 100-6 3 3 0 000 6zm-4 0a3 3 0 100-6 3 3 0 000 6z" size="1.4rem" sw={1.5} />,
    ac:       () => <Ico d="M9.5 1v3m5-3v3M12 8v3m-4.5.5L5 14m14-2.5L16.5 14M12 17v4m-7.5-4.5L7 14m10 2.5L14.5 14M4 9h3m10 0h3" size="1.4rem" sw={1.5} />,
    laundry:  () => <Ico d="M3 3h18a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm9 5a5 5 0 100 10A5 5 0 0012 8z" size="1.4rem" sw={1.5} />,
    kitchen:  () => <Ico d="M3 3h18v4H3V3zm2 4v14m14-14v14M9 7v4m6-4v4M7 17h10" size="1.4rem" sw={1.5} />,
    default:  () => <Ico d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" size="1.4rem" sw={1.5} />,
    spinner:  () => (
        <svg style={{ width: '1rem', height: '1rem', animation: 'amenSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Icon resolution ──────────────────────────────────────────────────────────

const ICON_MAP = [
    [['wifi', 'internet', 'broadband'],           Icons.wifi],
    [['pool', 'swim', 'jacuzzi', 'hot tub'],      Icons.pool],
    [['park', 'garage', 'car'],                   Icons.parking],
    [['gym', 'fitness', 'sport', 'workout'],      Icons.gym],
    [['security', 'guard', 'cctv', 'gated'],      Icons.security],
    [['garden', 'yard', 'lawn', 'outdoor'],       Icons.garden],
    [['lift', 'elevator'],                        Icons.elevator],
    [['water', 'borehole', 'supply'],             Icons.water],
    [['power', 'electric', 'solar', 'generator'], Icons.electric],
    [['balcony', 'terrace', 'deck', 'veranda'],   Icons.balcony],
    [['pet', 'animal', 'dog', 'cat'],             Icons.pet],
    [['air', 'ac', 'cool', 'hvac'],               Icons.ac],
    [['laundry', 'washer', 'dryer'],              Icons.laundry],
    [['kitchen', 'cook', 'dining'],               Icons.kitchen],
];

const resolveIcon = (name = '') => {
    const n = name.toLowerCase();
    for (const [keys, Icon] of ICON_MAP) {
        if (keys.some(k => n.includes(k))) return Icon;
    }
    return Icons.default;
};

// ─── Category config ──────────────────────────────────────────────────────────

const CAT_PALETTES = [
    { bg: 'hsl(214 100% 95%)', color: 'hsl(214 80% 42%)', dot: 'hsl(214 80% 52%)' },
    { bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 30%)', dot: 'hsl(152 60% 42%)' },
    { bg: 'hsl(270 60% 95%)',  color: 'hsl(270 60% 40%)', dot: 'hsl(270 60% 52%)' },
    { bg: 'hsl(40 90% 93%)',   color: 'hsl(40 80% 33%)',  dot: 'hsl(40 80% 48%)'  },
    { bg: 'hsl(340 70% 94%)',  color: 'hsl(340 70% 40%)', dot: 'hsl(340 70% 52%)' },
    { bg: 'hsl(190 65% 93%)',  color: 'hsl(190 65% 30%)', dot: 'hsl(190 65% 42%)' },
    { bg: 'hsl(16 90% 94%)',   color: 'hsl(16 80% 36%)',  dot: 'hsl(16 80% 50%)'  },
];

const getCatPalette = (cat, i) => {
    if (!cat) return CAT_PALETTES[i % CAT_PALETTES.length];
    const seed = cat.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return CAT_PALETTES[seed % CAT_PALETTES.length];
};

const autoCategory = (name = '') => {
    const n = name.toLowerCase();
    if (['wifi','internet','tv','cable','phone'].some(k => n.includes(k)))                    return 'Connectivity';
    if (['pool','gym','sport','fitness','tennis','game'].some(k => n.includes(k)))            return 'Recreation';
    if (['security','cctv','guard','gated','intercom'].some(k => n.includes(k)))              return 'Security';
    if (['garden','park','terrace','balcony','outdoor'].some(k => n.includes(k)))             return 'Outdoor';
    if (['water','electric','generator','solar','power','borehole'].some(k => n.includes(k))) return 'Utilities';
    if (['elevator','lift','concierge','reception'].some(k => n.includes(k)))                 return 'Building';
    if (['ac','air','heat','cool','hvac'].some(k => n.includes(k)))                           return 'Climate';
    if (['laundry','kitchen','cook','dish'].some(k => n.includes(k)))                         return 'Kitchen & Laundry';
    if (['pet','dog','cat'].some(k => n.includes(k)))                                         return 'Pet Friendly';
    return 'General';
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const iStyle = (f, err) => ({
    width: '100%', padding: '0.6rem 0.875rem',
    border: `1.5px solid ${err ? 'hsl(0 65% 60%)' : f ? 'hsl(220 60% 55%)' : 'hsl(220 15% 88%)'}`,
    borderRadius: '0.55rem', fontSize: '0.875rem', color: 'hsl(220 25% 16%)', backgroundColor: 'white',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    boxShadow: f && !err ? '0 0 0 3px hsl(220 60% 55% / 0.1)' : err ? '0 0 0 3px hsl(0 65% 55% / 0.09)' : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
});

const AField = ({ label, required, error, hint, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {label && <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'hsl(220 25% 22%)', letterSpacing: '0.01em' }}>
            {label}{required && <span style={{ color: 'hsl(0 65% 52%)', marginLeft: '0.2rem' }}>*</span>}
        </label>}
        {children}
        {error && <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(0 65% 48%)', fontWeight: '600' }}>{error}</p>}
        {hint && !error && <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(220 15% 55%)' }}>{hint}</p>}
    </div>
);

const AInput = ({ error, ...props }) => {
    const [f, setF] = useState(false);
    return <input {...props} onFocus={() => setF(true)} onBlur={() => setF(false)} style={iStyle(f, !!error)} />;
};

const ATextarea = ({ ...props }) => {
    const [f, setF] = useState(false);
    return <textarea {...props} onFocus={() => setF(true)} onBlur={() => setF(false)} style={{ ...iStyle(f, false), resize: 'vertical' }} />;
};

const AToggle = ({ value, onChange, label, sub }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 0.875rem', borderRadius: '0.55rem', backgroundColor: 'hsl(220 15% 97.5%)', border: '1px solid hsl(220 15% 91%)' }}>
        <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'hsl(220 25% 20%)' }}>{label}</div>
            {sub && <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 55%)', marginTop: '0.1rem' }}>{sub}</div>}
        </div>
        <button type="button" onClick={() => onChange(!value)} style={{ width: '2.6rem', height: '1.4rem', borderRadius: '999px', border: 'none', cursor: 'pointer', flexShrink: 0, position: 'relative', backgroundColor: value ? 'hsl(152 55% 38%)' : 'hsl(220 15% 78%)', transition: 'background-color 0.2s' }}>
            <span style={{ position: 'absolute', top: '0.13rem', left: value ? 'calc(100% - 1.14rem)' : '0.13rem', width: '1.14rem', height: '1.14rem', borderRadius: '50%', backgroundColor: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px hsl(220 25% 15% / 0.22)' }} />
        </button>
    </div>
);

const Toast = ({ toast }) => toast ? (
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'amenSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {toast.type === 'error' ? <Icons.x /> : <Icons.check />}
        {toast.msg}
    </div>
) : null;

// ─── Amenity modal ────────────────────────────────────────────────────────────

const AmenityModal = ({ mode, initial, categories, onClose, onSaved, showToast }) => {
    const isEdit = mode === 'edit';
    const [form, setForm] = useState({
        name:        initial?.name        ?? '',
        category:    initial?.category    ?? '',
        description: initial?.description ?? '',
        icon:        initial?.icon        ?? '',
        is_active:   initial?.is_active   ?? true,
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const AmenIcon = resolveIcon(form.name);
    const suggestedCat = form.name ? autoCategory(form.name) : '';

    const handleSubmit = e => {
        e.preventDefault();
        if (!form.name.trim()) { setErrors({ name: 'Name is required.' }); return; }
        setProcessing(true);
        const url    = isEdit ? `/super-admin/amenities/${initial.id}` : '/super-admin/amenities';
        const method = isEdit ? 'put' : 'post';
        router[method](url, form, {
            preserveScroll: true,
            onSuccess: () => { showToast(isEdit ? 'Amenity updated.' : 'Amenity created.'); onSaved(); onClose(); },
            onError:   errs => { setErrors(errs); showToast('Please fix the errors.', 'error'); setProcessing(false); },
            onFinish:  () => setProcessing(false),
        });
    };

    // Palette for header from name
    const seed = form.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const pal  = CAT_PALETTES[seed % CAT_PALETTES.length];

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.6)', backdropFilter: 'blur(5px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '500px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.15rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.32)', animation: 'amenModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>

                {/* Dark header with live icon */}
                <div style={{ background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))', padding: '1.4rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.07) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                            <div style={{ width: '2.8rem', height: '2.8rem', borderRadius: '0.75rem', backgroundColor: form.name ? pal.color : 'hsl(220 25% 30%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.25s', border: '2px solid hsl(220 30% 30%)', boxShadow: '0 2px 12px hsl(220 28% 6% / 0.4)', flexShrink: 0 }}>
                                <AmenIcon />
                            </div>
                            <div>
                                <h2 style={{ margin: '0 0 0.18rem', fontSize: '1rem', fontWeight: '800', color: 'white' }}>{isEdit ? 'Edit Amenity' : 'New Amenity'}</h2>
                                <p style={{ margin: 0, fontSize: '0.73rem', color: 'hsl(220 20% 58%)' }}>
                                    {form.name || (isEdit ? `Editing "${initial.name}"` : 'Fill in details below')}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 20% 55%)', padding: '0.3rem', display: 'flex', borderRadius: '0.4rem', transition: 'color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'hsl(220 20% 55%)'}>
                            <Icons.x />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        <AField label="Amenity Name" required error={errors.name}>
                            <AInput value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Swimming Pool, 24/7 Security…" error={errors.name} autoFocus />
                        </AField>

                        <AField label="Category" hint={suggestedCat ? `Suggested: "${suggestedCat}"` : 'Group this amenity for filtering'}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    <AInput value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Recreation, Utilities…" list="amen-cats" />
                                    <datalist id="amen-cats">
                                        {[...new Set([...categories, 'Connectivity','Recreation','Security','Outdoor','Utilities','Building','Climate','Kitchen & Laundry','Pet Friendly','General'])].map(c => <option key={c} value={c} />)}
                                    </datalist>
                                </div>
                                {suggestedCat && form.category !== suggestedCat && (
                                    <button type="button" onClick={() => set('category', suggestedCat)}
                                        style={{ padding: '0.6rem 0.75rem', borderRadius: '0.55rem', border: '1px solid hsl(214 80% 88%)', backgroundColor: 'hsl(214 100% 97%)', color: 'hsl(214 80% 46%)', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', flexShrink: 0 }}>
                                        Use "{suggestedCat}"
                                    </button>
                                )}
                            </div>
                        </AField>

                        <AField label="Description" hint="Optional — shown on listing detail pages">
                            <ATextarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description of this amenity…" rows={2} />
                        </AField>

                        <AField label="Custom Icon Code" hint="Optional — icon class or emoji override">
                            <AInput value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🏊 or fa-swimming-pool" />
                        </AField>

                        <AToggle value={form.is_active} onChange={v => set('is_active', v)} label="Active" sub="Make this amenity selectable on listings" />
                    </div>

                    <div style={{ padding: '1rem 1.75rem 1.5rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', gap: '0.65rem' }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.6rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 32%)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                        <button type="submit" disabled={processing}
                            style={{ flex: 2, padding: '0.6rem', borderRadius: '0.6rem', border: 'none', backgroundColor: processing ? 'hsl(220 25% 40%)' : 'hsl(220 25% 15%)', color: 'white', fontSize: '0.875rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => { if (!processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'; }}
                            onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'; }}>
                            {processing ? <><Icons.spinner />{isEdit ? 'Saving…' : 'Creating…'}</> : isEdit ? <><Icons.check /> Save Changes</> : <><Icons.plus /> Create Amenity</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Delete modal ─────────────────────────────────────────────────────────────

const DeleteModal = ({ amenity, catPal, onConfirm, onClose, processing }) => {
    const AmenIcon = resolveIcon(amenity.name);
    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.65)', backdropFilter: 'blur(5px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '400px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.15rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.32)', animation: 'amenModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ height: '4px', background: 'linear-gradient(90deg, hsl(0 65% 52%), hsl(0 75% 62%))' }} />
                <div style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
                        <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.75rem', backgroundColor: 'hsl(0 70% 94%)', color: 'hsl(0 65% 48%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icons.trash /></div>
                        <div>
                            <h3 style={{ margin: '0 0 0.12rem', fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>Delete Amenity</h3>
                            <p style={{ margin: 0, fontSize: '0.73rem', color: 'hsl(220 15% 50%)' }}>This cannot be undone</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.875rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 15% 97%)', border: '1px solid hsl(220 15% 91%)', marginBottom: '1.1rem' }}>
                        <div style={{ width: '2.2rem', height: '2.2rem', borderRadius: '0.55rem', backgroundColor: catPal.bg, color: catPal.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AmenIcon /></div>
                        <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'hsl(220 25% 15%)' }}>{amenity.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 52%)' }}>
                                {amenity.category || 'Uncategorised'}
                                {amenity.listings_count > 0 && <> · {amenity.listings_count} listing{amenity.listings_count !== 1 ? 's' : ''}</>}
                            </div>
                        </div>
                    </div>

                    {(amenity.listings_count ?? 0) > 0 && (
                        <div style={{ padding: '0.65rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(40 90% 96%)', border: '1px solid hsl(40 80% 85%)', fontSize: '0.76rem', color: 'hsl(36 75% 35%)', marginBottom: '1rem', lineHeight: 1.5, display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <span style={{ flexShrink: 0, marginTop: '0.05rem', display: 'flex' }}><Icons.alert /></span>
                            <span><strong>{amenity.listings_count} listing{amenity.listings_count !== 1 ? 's' : ''}</strong> reference this amenity. They won't be deleted, but will lose this amenity tag.</span>
                        </div>
                    )}

                    <p style={{ fontSize: '0.8rem', color: 'hsl(220 15% 38%)', lineHeight: 1.6, margin: '0 0 1.25rem' }}>Permanently remove <strong>"{amenity.name}"</strong>?</p>

                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                        <button onClick={onConfirm} disabled={processing}
                            style={{ flex: 2, padding: '0.625rem', borderRadius: '0.6rem', border: 'none', backgroundColor: processing ? 'hsl(0 50% 60%)' : 'hsl(0 65% 50%)', color: 'white', fontSize: '0.85rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit' }}>
                            {processing ? <><Icons.spinner /> Deleting…</> : <><Icons.trash /> Delete</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Amenity card ─────────────────────────────────────────────────────────────

const AmenityCard = ({ amenity, catPal, index, onEdit, onDelete }) => {
    const [hov, setHov] = useState(false);
    const AmenIcon = resolveIcon(amenity.name);
    const isActive = amenity.is_active ?? true;
    const iconDisplay = amenity.icon && amenity.icon.length <= 4 ? amenity.icon : null; // emoji override

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ backgroundColor: 'white', border: `1.5px solid ${hov ? catPal.dot : 'hsl(220 15% 91%)'}`, borderRadius: '1rem', overflow: 'hidden', transition: 'all 0.22s ease', transform: hov ? 'translateY(-3px)' : 'translateY(0)', boxShadow: hov ? `0 16px 40px ${catPal.bg.replace(')', ' / 0.35)')}` : '0 1px 4px hsl(220 20% 15% / 0.05)', display: 'flex', flexDirection: 'column', animation: `amenCardIn 0.35s ease ${Math.min(index, 20) * 0.035}s both` }}>

            {/* Gradient bar */}
            <div style={{ height: '3px', background: `linear-gradient(90deg, ${catPal.dot}, ${catPal.color})` }} />

            <div style={{ padding: '1.15rem 1.15rem 0.875rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.7rem', backgroundColor: catPal.bg, color: catPal.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'transform 0.22s', transform: hov ? 'scale(1.1) rotate(-3deg)' : 'scale(1) rotate(0deg)', fontSize: iconDisplay ? '1.3rem' : 'inherit' }}>
                            {iconDisplay ? iconDisplay : <AmenIcon />}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'hsl(220 25% 13%)', margin: '0 0 0.15rem', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '10rem' }}>{amenity.name}</h3>
                            {amenity.category && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.05em', color: catPal.color, backgroundColor: catPal.bg, padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>
                                    {amenity.category.toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', padding: '0.18rem 0.48rem', borderRadius: '999px', fontSize: '0.6rem', fontWeight: '800', letterSpacing: '0.07em', flexShrink: 0, backgroundColor: isActive ? 'hsl(152 55% 92%)' : 'hsl(220 15% 92%)', color: isActive ? 'hsl(152 55% 27%)' : 'hsl(220 15% 42%)' }}>
                        <span style={{ width: '0.33rem', height: '0.33rem', borderRadius: '50%', backgroundColor: isActive ? 'hsl(152 55% 40%)' : 'hsl(220 15% 55%)', flexShrink: 0 }} />
                        {isActive ? 'ON' : 'OFF'}
                    </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.76rem', color: amenity.description ? 'hsl(220 15% 50%)' : 'hsl(220 15% 68%)', margin: 0, lineHeight: 1.55, fontStyle: amenity.description ? 'normal' : 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.2rem' }}>
                    {amenity.description || 'No description added.'}
                </p>

                {/* Listings stat */}
                {amenity.listings_count !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.65rem', borderRadius: '0.5rem', backgroundColor: catPal.bg, marginTop: 'auto' }}>
                        <span style={{ color: catPal.color, display: 'flex' }}><Icons.listings /></span>
                        <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'hsl(220 25% 13%)' }}>{(amenity.listings_count ?? 0).toLocaleString()}</span>
                        <span style={{ fontSize: '0.65rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'hsl(220 15% 55%)' }}>listings</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div style={{ padding: '0.65rem 1.1rem', borderTop: '1px solid hsl(220 15% 95%)', display: 'flex', gap: '0.45rem' }}>
                <button onClick={() => onEdit(amenity)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.38rem', padding: '0.44rem 0', borderRadius: '0.5rem', fontSize: '0.77rem', fontWeight: '700', backgroundColor: catPal.bg, color: catPal.color, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.edit /> Edit
                </button>
                <button onClick={() => onDelete(amenity)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.44rem 0.7rem', borderRadius: '0.5rem', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 50%)', border: 'none', cursor: 'pointer', transition: 'filter 0.15s', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.trash />
                </button>
            </div>
        </div>
    );
};

// ─── List row ─────────────────────────────────────────────────────────────────

const AmenityRow = ({ amenity, catPal, index, onEdit, onDelete }) => {
    const [hov, setHov] = useState(false);
    const AmenIcon = resolveIcon(amenity.name);
    const isActive = amenity.is_active ?? true;
    const iconDisplay = amenity.icon && amenity.icon.length <= 4 ? amenity.icon : null;

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ display: 'grid', gridTemplateColumns: '2.25rem 1fr 10rem 7rem 6rem auto', alignItems: 'center', gap: '1rem', padding: '0.8rem 1.25rem', borderBottom: '1px solid hsl(220 15% 95%)', backgroundColor: hov ? 'hsl(220 20% 98.5%)' : 'white', transition: 'background-color 0.12s', animation: `amenRowIn 0.3s ease ${Math.min(index, 20) * 0.025}s both` }}>

            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.6rem', backgroundColor: catPal.bg, color: catPal.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: iconDisplay ? '1.1rem' : 'inherit' }}>
                {iconDisplay ? iconDisplay : <AmenIcon />}
            </div>

            <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'hsl(220 25% 14%)', marginBottom: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{amenity.name}</div>
                {amenity.description && <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 55%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{amenity.description}</div>}
            </div>

            <div>
                {amenity.category ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.05em', color: catPal.color, backgroundColor: catPal.bg, padding: '0.15rem 0.45rem', borderRadius: '0.3rem' }}>
                        {amenity.category.toUpperCase()}
                    </span>
                ) : <span style={{ fontSize: '0.72rem', color: 'hsl(220 15% 62%)', fontStyle: 'italic' }}>—</span>}
            </div>

            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>{(amenity.listings_count ?? 0).toLocaleString()}</div>
                <div style={{ fontSize: '0.63rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'hsl(220 15% 56%)' }}>listings</div>
            </div>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.07em', backgroundColor: isActive ? 'hsl(152 55% 92%)' : 'hsl(220 15% 92%)', color: isActive ? 'hsl(152 55% 27%)' : 'hsl(220 15% 42%)', whiteSpace: 'nowrap' }}>
                <span style={{ width: '0.33rem', height: '0.33rem', borderRadius: '50%', backgroundColor: isActive ? 'hsl(152 55% 40%)' : 'hsl(220 15% 55%)' }} />
                {isActive ? 'ACTIVE' : 'INACTIVE'}
            </span>

            <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button onClick={() => onEdit(amenity)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.65rem', borderRadius: '0.45rem', border: 'none', cursor: 'pointer', backgroundColor: catPal.bg, color: catPal.color, fontSize: '0.75rem', fontWeight: '700', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'} onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.edit /> Edit
                </button>
                <button onClick={() => onDelete(amenity)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', cursor: 'pointer', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 50%)', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'} onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.trash />
                </button>
            </div>
        </div>
    );
};

// ─── KPI ─────────────────────────────────────────────────────────────────────

const Kpi = ({ label, value, sub, accent, iconBg, iconColor, icon }) => (
    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
        <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.65rem', backgroundColor: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
        <div>
            <div style={{ fontSize: '1.55rem', fontWeight: '900', color: accent, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'hsl(220 25% 22%)', marginTop: '0.1rem' }}>{label}</div>
            {sub && <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 55%)', marginTop: '0.05rem' }}>{sub}</div>}
        </div>
    </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

const AmenitiesIndex = ({}) => {
    const { amenities = [] } = usePage().props;
    const [search,       setSearch]       = useState('');
    const [catFilter,    setCatFilter]    = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode,     setViewMode]     = useState('grid');
    const [modal,        setModal]        = useState(null);
    const [delTarget,    setDelTarget]    = useState(null);
    const [deleting,     setDeleting]     = useState(false);
    const [toast,        setToast]        = useState(null);
    const toastTimer = useRef(null);
    const [refreshing,   refresh]   = useRefresh(['amenities']);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const reload = () => router.reload({ only: ['amenities'] });

    const confirmDelete = () => {
        setDeleting(true);
        router.delete(`/super-admin/amenities/${delTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                // amenities(a => a.filter(x => x.id !== delTarget.id));
                showToast(`"${delTarget.name}" deleted.`);
                setDelTarget(null);
            },
            onError:  () => showToast('Delete failed.', 'error'),
            onFinish: () => setDeleting(false),
        });
    };

    // Derive unique categories
    const categories = useMemo(() => {
        const cats = amenities.map(a => a.category).filter(Boolean);
        return [...new Set(cats)].sort();
    }, [amenities]);

    // Build cat → palette map (stable)
    const catPalMap = useMemo(() => {
        const map = {};
        categories.forEach((c, i) => { map[c] = getCatPalette(c, i); });
        return map;
    }, [categories]);

    const getAmenPalette = (a) => a.category ? (catPalMap[a.category] ?? getCatPalette(a.category, 0)) : getCatPalette(a.name, 0);

    const filtered = useMemo(() => amenities.filter(a => {
        const q = search.toLowerCase();
        const okSearch = !q || (a.name ?? '').toLowerCase().includes(q) || (a.category ?? '').toLowerCase().includes(q) || (a.description ?? '').toLowerCase().includes(q);
        const okCat    = catFilter === 'all' || (a.category ?? 'General') === catFilter || (!a.category && catFilter === 'General');
        const okStatus = statusFilter === 'all' || (statusFilter === 'active' && (a.is_active ?? true)) || (statusFilter === 'inactive' && !(a.is_active ?? true));
        return okSearch && okCat && okStatus;
    }), [amenities, search, catFilter, statusFilter]);

    const activeCount   = amenities.filter(a => a.is_active ?? true).length;
    const totalListings = amenities.reduce((s, a) => s + (a.listings_count ?? 0), 0);

    return (
        <>
        <Head>
            <title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
        </Head>
            <Toast toast={toast} />

            {modal && (
                <AmenityModal
                    mode={modal.mode}
                    initial={modal.amenity ?? null}
                    categories={categories}
                    onClose={() => setModal(null)}
                    onSaved={reload}
                    showToast={showToast}
                />
            )}

            {delTarget && (
                <DeleteModal
                    amenity={delTarget}
                    catPal={getAmenPalette(delTarget)}
                    onConfirm={confirmDelete}
                    onClose={() => setDelTarget(null)}
                    processing={deleting}
                />
            )}

            <div>
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.22rem', letterSpacing: '-0.02em' }}>Amenities</h1>
                        <p style={{ fontSize: '0.82rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                            {amenities.length} amenit{amenities.length !== 1 ? 'ies' : 'y'} · {activeCount} active · {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.65rem', flexShrink: 0 }}>
                        <button onClick={refresh} disabled={refreshing}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 28%)', fontWeight: '600', fontSize: '0.83rem', cursor: refreshing ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => { if (!refreshing) e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'; }}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                            {refreshing ? <><Icons.spinner /> Refreshing…</> : <><Icons.refresh /> Refresh</>}
                        </button>
                        <button onClick={() => setModal({ mode: 'create' })}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.625rem 1.2rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 25% 15%)', color: 'white', fontWeight: '700', fontSize: '0.875rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'}>
                            <Icons.plus /> New Amenity
                        </button>
                    </div>
                </div>

                {/* ── KPI strip ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <Kpi label="Total Amenities" value={amenities.length}            sub="All amenities"       accent="hsl(220 25% 15%)"  iconBg="hsl(220 20% 93%)"   iconColor="hsl(220 25% 30%)" icon={<Icons.star />} />
                    <Kpi label="Active"          value={activeCount}                 sub="Selectable"          accent="hsl(152 55% 35%)"  iconBg="hsl(152 55% 92%)"  iconColor="hsl(152 55% 35%)" icon={<Icons.check />} />
                    <Kpi label="Categories"      value={categories.length}           sub="Unique groups"       accent="hsl(270 55% 42%)"  iconBg="hsl(270 60% 95%)"  iconColor="hsl(270 55% 42%)" icon={<Icons.grid />} />
                    <Kpi label="Listing Uses"    value={totalListings.toLocaleString()} sub="Total references" accent="hsl(214 80% 46%)"  iconBg="hsl(214 100% 95%)" iconColor="hsl(214 80% 46%)" icon={<Icons.listings />} />
                </div>

                {/* ── Toolbar ── */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '0.875rem 1.1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
                    {/* Top row: search + status + view */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
                            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)', pointerEvents: 'none', display: 'flex' }}><Icons.search /></span>
                            <input type="text" placeholder="Search amenities…" value={search} onChange={e => setSearch(e.target.value)}
                                style={{ width: '100%', padding: '0.52rem 0.75rem 0.52rem 2.25rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.55rem', fontSize: '0.855rem', color: 'hsl(220 25% 18%)', backgroundColor: 'hsl(220 15% 98.5%)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
                                onFocus={e => e.target.style.borderColor = 'hsl(220 60% 60%)'}
                                onBlur={e => e.target.style.borderColor = 'hsl(220 15% 88%)'} />
                        </div>

                        <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                            {[['all', 'All'], ['active', 'Active'], ['inactive', 'Inactive']].map(([v, l]) => {
                                const a = statusFilter === v;
                                return <button key={v} onClick={() => setStatusFilter(v)} style={{ padding: '0.38rem 0.75rem', borderRadius: '999px', border: `1.5px solid ${a ? 'hsl(220 25% 20%)' : 'hsl(220 15% 88%)'}`, fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', backgroundColor: a ? 'hsl(220 25% 15%)' : 'transparent', color: a ? 'white' : 'hsl(220 15% 45%)' }}>{l}</button>;
                            })}
                        </div>

                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.2rem', backgroundColor: 'hsl(220 15% 96%)', borderRadius: '0.5rem', padding: '0.2rem', flexShrink: 0 }}>
                            {[['grid', Icons.grid], ['list', Icons.list]].map(([v, Icon]) => (
                                <button key={v} onClick={() => setViewMode(v)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '1.75rem', borderRadius: '0.35rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', backgroundColor: viewMode === v ? 'white' : 'transparent', color: viewMode === v ? 'hsl(220 25% 18%)' : 'hsl(220 15% 55%)', boxShadow: viewMode === v ? '0 1px 3px hsl(220 20% 15% / 0.1)' : 'none' }}>
                                    <Icon />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category pills row */}
                    {categories.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <button onClick={() => setCatFilter('all')} style={{ padding: '0.35rem 0.7rem', borderRadius: '999px', border: `1.5px solid ${catFilter === 'all' ? 'hsl(220 25% 20%)' : 'hsl(220 15% 88%)'}`, fontSize: '0.73rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', backgroundColor: catFilter === 'all' ? 'hsl(220 25% 15%)' : 'transparent', color: catFilter === 'all' ? 'white' : 'hsl(220 15% 45%)' }}>
                                All categories
                            </button>
                            {categories.map((cat, i) => {
                                const pal  = getCatPalette(cat, i);
                                const active = catFilter === cat;
                                const count = amenities.filter(a => (a.category ?? 'General') === cat || (!a.category && cat === 'General')).length;
                                return (
                                    <button key={cat} onClick={() => setCatFilter(cat)}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.7rem', borderRadius: '999px', border: `1.5px solid ${active ? pal.dot : 'hsl(220 15% 88%)'}`, fontSize: '0.73rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', backgroundColor: active ? pal.bg : 'transparent', color: active ? pal.color : 'hsl(220 15% 45%)' }}>
                                        {cat}
                                        <span style={{ fontSize: '0.65rem', opacity: 0.7, fontWeight: '600' }}>{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Content ── */}
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px dashed hsl(220 15% 86%)' }}>
                        <div style={{ fontSize: '2.75rem', marginBottom: '0.875rem' }}>✨</div>
                        <p style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: '700', color: 'hsl(220 25% 22%)' }}>{search ? 'No amenities match' : 'No amenities yet'}</p>
                        <p style={{ margin: '0 0 1.5rem', fontSize: '0.82rem', color: 'hsl(220 15% 55%)' }}>{search ? 'Try a different search or filter.' : 'Add your first amenity to start tagging listings.'}</p>
                        {!search && <button onClick={() => setModal({ mode: 'create' })} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.625rem 1.25rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 25% 15%)', color: 'white', fontWeight: '700', fontSize: '0.875rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}><Icons.plus /> Add First Amenity</button>}
                    </div>

                ) : viewMode === 'grid' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                        {filtered.map((a, i) => (
                            <AmenityCard key={a.id} amenity={a} catPal={getAmenPalette(a)} index={i}
                                onEdit={am => setModal({ mode: 'edit', amenity: am })}
                                onDelete={am => setDelTarget(am)} />
                        ))}
                    </div>

                ) : (
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2.25rem 1fr 10rem 7rem 6rem auto', alignItems: 'center', gap: '1rem', padding: '0.6rem 1.25rem', backgroundColor: 'hsl(220 15% 97.5%)', borderBottom: '1px solid hsl(220 15% 92%)', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>
                            <div />
                            <div>Name</div>
                            <div>Category</div>
                            <div style={{ textAlign: 'right' }}>Listings</div>
                            <div>Status</div>
                            <div>Actions</div>
                        </div>
                        {filtered.map((a, i) => (
                            <AmenityRow key={a.id} amenity={a} catPal={getAmenPalette(a)} index={i}
                                onEdit={am => setModal({ mode: 'edit', amenity: am })}
                                onDelete={am => setDelTarget(am)} />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes amenSpin    { to { transform: rotate(360deg); } }
                @keyframes amenSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes amenModalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes amenCardIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
                @keyframes amenRowIn   { from { opacity:0; transform:translateX(-4px); } to { opacity:1; transform:translateX(0); } }
            `}</style>
        </>
    );
};

AmenitiesIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default AmenitiesIndex;