import React, { useState, useRef, useMemo } from 'react';
import { router } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = ({ d, size = '1rem', sw = 1.75 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const Icons = {
    search:  () => <Ico d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    plus:    () => <Ico d="M12 4v16m8-8H4" size="0.95rem" />,
    edit:    () => <Ico d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" size="0.85rem" />,
    trash:   () => <Ico d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" size="0.85rem" />,
    x:       () => <Ico d="M6 18L18 6M6 6l12 12" size="0.9rem" />,
    check:   () => <Ico d="M5 13l4 4L19 7" size="0.85rem" />,
    chevron: (dir = 'down') => <Ico d="M19 9l-7 7-7-7" size="0.8rem" sw={2.2} />,
    alert:   () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size="1rem" />,
    globe:   () => <Ico d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size="1.3rem" sw={1.5} />,
    pin:     () => <Ico d={["M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z","M15 11a3 3 0 11-6 0 3 3 0 016 0z"]} size="1.3rem" sw={1.5} />,
    city:    () => <Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" size="1.3rem" sw={1.5} />,
    map:     () => <Ico d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" size="1.3rem" sw={1.5} />,
    district:() => <Ico d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" size="1.3rem" sw={1.5} />,
    listings:() => <Ico d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" size="0.85rem" />,
    spinner: () => (
        <svg style={{ width: '1rem', height: '1rem', animation: 'locSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CFG = {
    country:  { label: 'Country',  bg: 'hsl(214 100% 95%)', color: 'hsl(214 80% 42%)',  dot: 'hsl(214 80% 52%)',  icon: Icons.globe,    order: 0 },
    region:   { label: 'Region',   bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 30%)',  dot: 'hsl(152 60% 42%)',  icon: Icons.map,      order: 1 },
    state:    { label: 'State',    bg: 'hsl(152 60% 93%)',  color: 'hsl(152 60% 30%)',  dot: 'hsl(152 60% 42%)',  icon: Icons.map,      order: 1 },
    city:     { label: 'City',     bg: 'hsl(40 90% 93%)',   color: 'hsl(40 80% 33%)',   dot: 'hsl(40 80% 48%)',   icon: Icons.city,     order: 2 },
    district: { label: 'District', bg: 'hsl(270 60% 95%)',  color: 'hsl(270 60% 40%)',  dot: 'hsl(270 60% 52%)',  icon: Icons.district, order: 3 },
    area:     { label: 'Area',     bg: 'hsl(340 70% 94%)',  color: 'hsl(340 70% 40%)',  dot: 'hsl(340 70% 52%)',  icon: Icons.pin,      order: 4 },
    neighborhood: { label: 'Neighborhood', bg: 'hsl(16 90% 94%)', color: 'hsl(16 80% 36%)', dot: 'hsl(16 80% 50%)', icon: Icons.pin, order: 4 },
};

const getCfg = (type) => TYPE_CFG[(type ?? '').toLowerCase()] ?? { label: type ?? '—', bg: 'hsl(220 15% 93%)', color: 'hsl(220 15% 42%)', dot: 'hsl(220 15% 58%)', icon: Icons.pin, order: 5 };

const LOCATION_TYPES = ['country', 'region', 'state', 'city', 'district', 'area', 'neighborhood'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return v; }
};

// Build tree from flat list
const buildTree = (locs) => {
    const map = {};
    locs.forEach(l => { map[l.id] = { ...l, children: [] }; });
    const roots = [];
    locs.forEach(l => {
        if (l.parent_id && map[l.parent_id]) map[l.parent_id].children.push(map[l.id]);
        else roots.push(map[l.id]);
    });
    return roots;
};

// Flatten tree for display
const flattenTree = (nodes, depth = 0, result = []) => {
    nodes.forEach(n => {
        result.push({ ...n, depth });
        if (n._open && n.children?.length) flattenTree(n.children, depth + 1, result);
    });
    return result;
};

// ─── Atoms ────────────────────────────────────────────────────────────────────

const iStyle = (f, err) => ({
    width: '100%', padding: '0.6rem 0.875rem',
    border: `1.5px solid ${err ? 'hsl(0 65% 60%)' : f ? 'hsl(220 60% 55%)' : 'hsl(220 15% 88%)'}`,
    borderRadius: '0.55rem', fontSize: '0.875rem', color: 'hsl(220 25% 16%)', backgroundColor: 'white',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    boxShadow: f && !err ? '0 0 0 3px hsl(220 60% 55% / 0.1)' : err ? '0 0 0 3px hsl(0 65% 55% / 0.09)' : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
});

const LField = ({ label, required, error, hint, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {label && <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'hsl(220 25% 22%)', letterSpacing: '0.01em' }}>
            {label}{required && <span style={{ color: 'hsl(0 65% 52%)', marginLeft: '0.2rem' }}>*</span>}
        </label>}
        {children}
        {error && <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(0 65% 48%)', fontWeight: '600' }}>{error}</p>}
        {hint && !error && <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(220 15% 55%)' }}>{hint}</p>}
    </div>
);

const LInput = ({ error, ...props }) => {
    const [f, setF] = useState(false);
    return <input {...props} onFocus={() => setF(true)} onBlur={() => setF(false)} style={iStyle(f, !!error)} />;
};

const LSelect = ({ error, children, ...props }) => {
    const [f, setF] = useState(false);
    return <select {...props} onFocus={() => setF(true)} onBlur={() => setF(false)} style={{ ...iStyle(f, !!error), appearance: 'none', cursor: 'pointer' }}>{children}</select>;
};

const LToggle = ({ value, onChange, label, sub }) => (
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
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'locSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {toast.type === 'error' ? <Icons.x /> : <Icons.check />}
        {toast.msg}
    </div>
) : null;

// ─── TypeBadge ────────────────────────────────────────────────────────────────

const TypeBadge = ({ type }) => {
    const cfg = getCfg(type);
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.55rem', borderRadius: '999px', fontSize: '0.63rem', fontWeight: '800', letterSpacing: '0.06em', backgroundColor: cfg.bg, color: cfg.color, whiteSpace: 'nowrap' }}>
            <span style={{ width: '0.35rem', height: '0.35rem', borderRadius: '50%', backgroundColor: cfg.dot, flexShrink: 0 }} />
            {cfg.label.toUpperCase()}
        </span>
    );
};

// ─── Location modal ───────────────────────────────────────────────────────────

const LocationModal = ({ mode, initial, allLocations, onClose, onSaved, showToast }) => {
    const isEdit = mode === 'edit';
    const [form, setForm] = useState({
        name:        initial?.name        ?? '',
        slug:        initial?.slug        ?? '',
        type:        initial?.type        ?? 'city',
        parent_id:   initial?.parent_id   ?? '',
        country_code:initial?.country_code ?? '',
        is_active:   initial?.is_active   ?? true,
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [autoSlug, setAutoSlug] = useState(!isEdit);

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
    const toSlug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const handleName = v => { set('name', v); if (autoSlug) set('slug', toSlug(v)); };

    const parentOptions = allLocations.filter(l => !isEdit || l.id !== initial?.id);

    const cfg = getCfg(form.type);
    const TypeIcon = cfg.icon;

    const handleSubmit = e => {
        e.preventDefault();
        if (!form.name.trim()) { setErrors({ name: 'Name is required.' }); return; }
        setProcessing(true);
        const url    = isEdit ? `/super-admin/locations/${initial.id}` : '/super-admin/locations';
        const method = isEdit ? 'put' : 'post';
        router[method](url, { ...form, parent_id: form.parent_id || null }, {
            preserveScroll: true,
            onSuccess: () => { showToast(isEdit ? 'Location updated.' : 'Location created.'); onSaved(); onClose(); },
            onError:   errs => { setErrors(errs); showToast('Please fix the errors.', 'error'); setProcessing(false); },
            onFinish:  () => setProcessing(false),
        });
    };

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.6)', backdropFilter: 'blur(5px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '520px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.15rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.32)', animation: 'locModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>

                {/* Dark header */}
                <div style={{ background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))', padding: '1.4rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.07) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                            <div style={{ width: '2.8rem', height: '2.8rem', borderRadius: '0.75rem', backgroundColor: form.name ? cfg.color : 'hsl(220 25% 30%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.25s', border: '2px solid hsl(220 30% 30%)', boxShadow: '0 2px 12px hsl(220 28% 6% / 0.4)', flexShrink: 0 }}>
                                <TypeIcon />
                            </div>
                            <div>
                                <h2 style={{ margin: '0 0 0.18rem', fontSize: '1rem', fontWeight: '800', color: 'white' }}>{isEdit ? 'Edit Location' : 'New Location'}</h2>
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

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                            <LField label="Location Name" required error={errors.name}>
                                <LInput value={form.name} onChange={e => handleName(e.target.value)} placeholder="e.g. Accra, Greater Accra…" error={errors.name} autoFocus />
                            </LField>
                            <LField label="Type" required>
                                <LSelect value={form.type} onChange={e => set('type', e.target.value)}>
                                    {LOCATION_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                                </LSelect>
                            </LField>
                        </div>

                        <LField label="URL Slug" error={errors.slug} hint="Auto-generated from name">
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    <LInput value={form.slug} onChange={e => { setAutoSlug(false); set('slug', e.target.value); }} placeholder="accra" error={errors.slug} />
                                </div>
                                {!autoSlug && (
                                    <button type="button" onClick={() => { set('slug', toSlug(form.name)); setAutoSlug(true); }}
                                        style={{ padding: '0.6rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(214 80% 88%)', backgroundColor: 'hsl(214 100% 97%)', color: 'hsl(214 80% 46%)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', flexShrink: 0 }}>
                                        Auto
                                    </button>
                                )}
                            </div>
                        </LField>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                            <LField label="Parent Location" hint="Leave blank for top-level">
                                <LSelect value={form.parent_id} onChange={e => set('parent_id', e.target.value)}>
                                    <option value="">— None (top-level) —</option>
                                    {parentOptions.map(l => <option key={l.id} value={l.id}>{l.name} ({l.type})</option>)}
                                </LSelect>
                            </LField>
                            <LField label="Country Code" hint="ISO 2-letter e.g. GH, NG, US">
                                <LInput value={form.country_code} onChange={e => set('country_code', e.target.value.toUpperCase().slice(0, 2))} placeholder="GH" maxLength={2} />
                            </LField>
                        </div>

                        <LToggle value={form.is_active} onChange={v => set('is_active', v)} label="Active" sub="Make this location available for listings" />
                    </div>

                    <div style={{ padding: '1rem 1.75rem 1.5rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', gap: '0.65rem' }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.6rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 32%)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                        <button type="submit" disabled={processing}
                            style={{ flex: 2, padding: '0.6rem', borderRadius: '0.6rem', border: 'none', backgroundColor: processing ? 'hsl(220 25% 40%)' : 'hsl(220 25% 15%)', color: 'white', fontSize: '0.875rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => { if (!processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'; }}
                            onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'; }}>
                            {processing ? <><Icons.spinner />{isEdit ? 'Saving…' : 'Creating…'}</> : isEdit ? <><Icons.check /> Save Changes</> : <><Icons.plus /> Create Location</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Delete modal ─────────────────────────────────────────────────────────────

const DeleteModal = ({ loc, onConfirm, onClose, processing }) => {
    const cfg = getCfg(loc.type);
    const TypeIcon = cfg.icon;
    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.65)', backdropFilter: 'blur(5px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '400px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.15rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.32)', animation: 'locModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ height: '4px', background: 'linear-gradient(90deg, hsl(0 65% 52%), hsl(0 75% 62%))' }} />
                <div style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
                        <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.75rem', backgroundColor: 'hsl(0 70% 94%)', color: 'hsl(0 65% 48%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icons.trash /></div>
                        <div>
                            <h3 style={{ margin: '0 0 0.12rem', fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>Delete Location</h3>
                            <p style={{ margin: 0, fontSize: '0.73rem', color: 'hsl(220 15% 50%)' }}>This cannot be undone</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.875rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 15% 97%)', border: '1px solid hsl(220 15% 91%)', marginBottom: '1rem' }}>
                        <div style={{ width: '2.2rem', height: '2.2rem', borderRadius: '0.55rem', backgroundColor: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><TypeIcon /></div>
                        <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'hsl(220 25% 15%)' }}>{loc.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 52%)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <TypeBadge type={loc.type} />
                                {loc.children?.length > 0 && <span>· {loc.children.length} sub-location{loc.children.length !== 1 ? 's' : ''}</span>}
                            </div>
                        </div>
                    </div>

                    {loc.children?.length > 0 && (
                        <div style={{ padding: '0.65rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(40 90% 96%)', border: '1px solid hsl(40 80% 85%)', fontSize: '0.76rem', color: 'hsl(36 75% 35%)', marginBottom: '1rem', lineHeight: 1.5, display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <span style={{ flexShrink: 0, marginTop: '0.05rem', display: 'flex' }}><Icons.alert /></span>
                            <span><strong>{loc.children.length} child location{loc.children.length !== 1 ? 's' : ''}</strong> will also be removed or unlinked.</span>
                        </div>
                    )}

                    <p style={{ fontSize: '0.8rem', color: 'hsl(220 15% 38%)', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
                        Permanently remove <strong>"{loc.name}"</strong>?
                    </p>

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

// ─── KPI card ─────────────────────────────────────────────────────────────────

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

// ─── Tree row ─────────────────────────────────────────────────────────────────

const TreeRow = ({ node, onToggle, onEdit, onDelete, isLast, index }) => {
    const [hov, setHov] = useState(false);
    const cfg = getCfg(node.type);
    const TypeIcon = cfg.icon;
    const hasChildren = node.children?.length > 0;
    const depth = node.depth ?? 0;

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ display: 'grid', gridTemplateColumns: '1fr 9rem 7rem 9rem auto', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1.25rem', borderBottom: '1px solid hsl(220 15% 95%)', backgroundColor: hov ? 'hsl(220 20% 98.5%)' : 'white', transition: 'background-color 0.12s', animation: `locRowIn 0.3s ease ${Math.min(index, 20) * 0.025}s both` }}>

            {/* Name + indent + expand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: `${depth * 1.5}rem` }}>
                {/* Expand / leaf toggle */}
                {hasChildren ? (
                    <button onClick={() => onToggle(node.id)}
                        style={{ width: '1.4rem', height: '1.4rem', borderRadius: '0.3rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s', color: 'hsl(220 25% 35%)' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'hsl(220 15% 95%)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; }}>
                        <svg style={{ width: '0.7rem', height: '0.7rem', transform: node._open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                ) : (
                    <span style={{ width: '1.4rem', height: '1.4rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {depth > 0 && <span style={{ width: '0.35rem', height: '0.35rem', borderRadius: '50%', backgroundColor: 'hsl(220 15% 78%)', flexShrink: 0 }} />}
                    </span>
                )}

                {/* Type icon */}
                <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TypeIcon />
                </div>

                {/* Name */}
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: depth === 0 ? '800' : '600', color: 'hsl(220 25% 14%)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.name}</div>
                    {node.slug && <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: cfg.color, backgroundColor: cfg.bg, padding: '0.08rem 0.35rem', borderRadius: '0.25rem', fontWeight: '600' }}>/{node.slug}</span>}
                </div>
            </div>

            {/* Type badge */}
            <div><TypeBadge type={node.type} /></div>

            {/* Children count */}
            <div>
                {hasChildren ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: '600', color: 'hsl(220 25% 30%)' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: '800' }}>{node.children.length}</span>
                        <span style={{ fontSize: '0.68rem', color: 'hsl(220 15% 55%)', fontWeight: '600' }}>sub</span>
                    </span>
                ) : (
                    <span style={{ fontSize: '0.72rem', color: 'hsl(220 15% 62%)', fontStyle: 'italic' }}>—</span>
                )}
            </div>

            {/* Status + listings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', padding: '0.18rem 0.5rem', borderRadius: '999px', fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.07em', backgroundColor: (node.is_active ?? true) ? 'hsl(152 55% 92%)' : 'hsl(220 15% 92%)', color: (node.is_active ?? true) ? 'hsl(152 55% 27%)' : 'hsl(220 15% 42%)', width: 'fit-content' }}>
                    <span style={{ width: '0.33rem', height: '0.33rem', borderRadius: '50%', backgroundColor: (node.is_active ?? true) ? 'hsl(152 55% 40%)' : 'hsl(220 15% 55%)', flexShrink: 0 }} />
                    {(node.is_active ?? true) ? 'ACTIVE' : 'OFF'}
                </span>
                {node.listings_count > 0 && (
                    <span style={{ fontSize: '0.68rem', color: 'hsl(220 15% 52%)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Icons.listings />{node.listings_count?.toLocaleString()} listing{node.listings_count !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button onClick={() => onEdit(node)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.65rem', borderRadius: '0.45rem', border: 'none', cursor: 'pointer', backgroundColor: cfg.bg, color: cfg.color, fontSize: '0.75rem', fontWeight: '700', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'} onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.edit /> Edit
                </button>
                <button onClick={() => onDelete(node)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', cursor: 'pointer', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 50%)', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'} onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.trash />
                </button>
            </div>
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const LocationsIndex = ({ locations: initial = [] }) => {
    const [locations,    setLocations]    = useState(initial);
    const [openIds,      setOpenIds]      = useState(new Set());
    const [search,       setSearch]       = useState('');
    const [typeFilter,   setTypeFilter]   = useState('all');
    const [modal,        setModal]        = useState(null);
    const [delTarget,    setDelTarget]    = useState(null);
    const [deleting,     setDeleting]     = useState(false);
    const [toast,        setToast]        = useState(null);
    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const reload = () => router.reload({ only: ['locations'] });

    const toggleOpen = (id) => setOpenIds(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

    const expandAll   = () => setOpenIds(new Set(locations.filter(l => locations.some(c => c.parent_id === l.id)).map(l => l.id)));
    const collapseAll = () => setOpenIds(new Set());

    const confirmDelete = () => {
        setDeleting(true);
        router.delete(`/super-admin/locations/${delTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setLocations(ls => ls.filter(l => l.id !== delTarget.id && l.parent_id !== delTarget.id));
                showToast(`"${delTarget.name}" deleted.`);
                setDelTarget(null);
            },
            onError:  () => showToast('Delete failed.', 'error'),
            onFinish: () => setDeleting(false),
        });
    };

    // Build display rows: if searching/filtering → flat filtered list; else → tree
    const displayRows = useMemo(() => {
        const isFiltering = search.trim() || typeFilter !== 'all';
        if (isFiltering) {
            const q = search.toLowerCase();
            return locations
                .filter(l => {
                    const okSearch = !q || (l.name ?? '').toLowerCase().includes(q) || (l.slug ?? '').toLowerCase().includes(q) || (l.type ?? '').toLowerCase().includes(q);
                    const okType   = typeFilter === 'all' || (l.type ?? '').toLowerCase() === typeFilter;
                    return okSearch && okType;
                })
                .map(l => ({ ...l, depth: 0, children: locations.filter(c => c.parent_id === l.id), _open: false }));
        }
        // Tree mode
        const tagged = locations.map(l => ({ ...l, _open: openIds.has(l.id), children: [] }));
        const tree   = buildTree(tagged);
        return flattenTree(tree);
    }, [locations, openIds, search, typeFilter]);

    // KPI counts
    const byType = Object.fromEntries(LOCATION_TYPES.map(t => [t, locations.filter(l => (l.type ?? '').toLowerCase() === t).length]));
    const activeCount = locations.filter(l => l.is_active ?? true).length;
    const totalListings = locations.reduce((s, l) => s + (l.listings_count ?? 0), 0);

    const typeCounts = LOCATION_TYPES.filter(t => (byType[t] ?? 0) > 0);

    return (
        <>
            <Toast toast={toast} />

            {modal && (
                <LocationModal
                    mode={modal.mode}
                    initial={modal.loc ?? null}
                    allLocations={locations}
                    onClose={() => setModal(null)}
                    onSaved={reload}
                    showToast={showToast}
                />
            )}

            {delTarget && (
                <DeleteModal
                    loc={delTarget}
                    onConfirm={confirmDelete}
                    onClose={() => setDelTarget(null)}
                    processing={deleting}
                />
            )}

            <div>
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.22rem', letterSpacing: '-0.02em' }}>Locations</h1>
                        <p style={{ fontSize: '0.82rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                            {locations.length} location{locations.length !== 1 ? 's' : ''} · {activeCount} active · {totalListings.toLocaleString()} total listings
                        </p>
                    </div>
                    <button onClick={() => setModal({ mode: 'create' })}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.625rem 1.2rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 25% 15%)', color: 'white', fontWeight: '700', fontSize: '0.875rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'}>
                        <Icons.plus /> Add Location
                    </button>
                </div>

                {/* ── KPI strip ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <Kpi label="Total Locations" value={locations.length}              sub="All records"        accent="hsl(220 25% 15%)"  iconBg="hsl(220 20% 93%)" iconColor="hsl(220 25% 30%)" icon={<Icons.pin />} />
                    <Kpi label="Active"          value={activeCount}                   sub="Visible to users"   accent="hsl(152 55% 35%)"  iconBg="hsl(152 55% 92%)" iconColor="hsl(152 55% 35%)" icon={<Icons.check />} />
                    <Kpi label="Countries"       value={byType.country ?? 0}           sub="Top-level"          accent="hsl(214 80% 46%)"  iconBg="hsl(214 100% 95%)" iconColor="hsl(214 80% 46%)" icon={<Icons.globe />} />
                    <Kpi label="Cities"          value={(byType.city ?? 0)}            sub="+ districts & areas" accent="hsl(40 80% 38%)"  iconBg="hsl(40 90% 93%)" iconColor="hsl(40 80% 38%)" icon={<Icons.city />} />
                </div>

                {/* ── Toolbar ── */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '0.875rem 1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>

                    {/* Search */}
                    <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
                        <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)', pointerEvents: 'none', display: 'flex' }}><Icons.search /></span>
                        <input type="text" placeholder="Search locations…" value={search} onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '0.52rem 0.75rem 0.52rem 2.25rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.55rem', fontSize: '0.855rem', color: 'hsl(220 25% 18%)', backgroundColor: 'hsl(220 15% 98.5%)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
                            onFocus={e => e.target.style.borderColor = 'hsl(220 60% 60%)'}
                            onBlur={e => e.target.style.borderColor = 'hsl(220 15% 88%)'} />
                    </div>

                    {/* Type filter pills */}
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {[['all', 'All'], ...typeCounts.map(t => [t, getCfg(t).label])].map(([v, l]) => {
                            const active = typeFilter === v;
                            const cfg2 = v === 'all' ? null : getCfg(v);
                            return (
                                <button key={v} onClick={() => setTypeFilter(v)}
                                    style={{ padding: '0.38rem 0.75rem', borderRadius: '999px', border: `1.5px solid ${active ? (cfg2?.dot ?? 'hsl(220 25% 20%)') : 'hsl(220 15% 88%)'}`, fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', backgroundColor: active ? (cfg2?.bg ?? 'hsl(220 25% 15%)') : 'transparent', color: active ? (cfg2?.color ?? 'white') : 'hsl(220 15% 45%)' }}>
                                    {l}
                                    {v !== 'all' && <span style={{ marginLeft: '0.3rem', fontSize: '0.65rem', opacity: 0.7 }}>{byType[v] ?? 0}</span>}
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        {!search && typeFilter === 'all' && (
                            <>
                                <button onClick={expandAll}   style={{ padding: '0.38rem 0.7rem', borderRadius: '0.45rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 15% 44%)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Expand all</button>
                                <button onClick={collapseAll} style={{ padding: '0.38rem 0.7rem', borderRadius: '0.45rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 15% 44%)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Collapse all</button>
                            </>
                        )}
                        {(search || typeFilter !== 'all') && <span style={{ fontSize: '0.75rem', color: 'hsl(220 15% 52%)', alignSelf: 'center' }}>{displayRows.length} result{displayRows.length !== 1 ? 's' : ''}</span>}
                    </div>
                </div>

                {/* ── Tree table ── */}
                {displayRows.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px dashed hsl(220 15% 86%)' }}>
                        <div style={{ fontSize: '2.75rem', marginBottom: '0.875rem' }}>🗺️</div>
                        <p style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: '700', color: 'hsl(220 25% 22%)' }}>{search ? 'No locations match' : 'No locations yet'}</p>
                        <p style={{ margin: '0 0 1.5rem', fontSize: '0.82rem', color: 'hsl(220 15% 55%)' }}>{search ? 'Adjust your search or filter.' : 'Add your first location to get started.'}</p>
                        {!search && <button onClick={() => setModal({ mode: 'create' })} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.625rem 1.25rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 25% 15%)', color: 'white', fontWeight: '700', fontSize: '0.875rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}><Icons.plus /> Add First Location</button>}
                    </div>
                ) : (
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>
                        {/* Table header */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 9rem 7rem 9rem auto', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1.25rem', backgroundColor: 'hsl(220 15% 97.5%)', borderBottom: '1px solid hsl(220 15% 92%)', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>
                            <div>Name</div>
                            <div>Type</div>
                            <div>Sub-locations</div>
                            <div>Status</div>
                            <div>Actions</div>
                        </div>
                        {displayRows.map((node, i) => (
                            <TreeRow key={`${node.id}-${node.depth}`} node={node} index={i}
                                onToggle={toggleOpen}
                                onEdit={loc => setModal({ mode: 'edit', loc })}
                                onDelete={loc => setDelTarget(loc)} />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes locSpin    { to { transform: rotate(360deg); } }
                @keyframes locSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes locModalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes locRowIn   { from { opacity:0; transform:translateX(-4px); } to { opacity:1; transform:translateX(0); } }
            `}</style>
        </>
    );
};

LocationsIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default LocationsIndex;