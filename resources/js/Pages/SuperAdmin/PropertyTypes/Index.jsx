import React, { useState, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
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
    plus:     () => <Ico d="M12 4v16m8-8H4" size="1rem" />,
    edit:     () => <Ico d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" size="0.85rem" />,
    trash:    () => <Ico d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" size="0.85rem" />,
    x:        () => <Ico d="M6 18L18 6M6 6l12 12" size="0.9rem" />,
    check:    () => <Ico d="M5 13l4 4L19 7" size="0.85rem" />,
    refresh:  () => <Ico d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" size="0.9rem" />,
    alert:    () => <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size="1rem" />,
    grid:     () => <Ico d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" size="0.9rem" />,
    list:     () => <Ico d="M4 6h16M4 10h16M4 14h16M4 18h16" size="0.9rem" />,
    home:     () => <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" size="1.35rem" sw={1.5} />,
    building: () => <Ico d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" size="1.35rem" sw={1.5} />,
    office:   () => <Ico d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" size="1.35rem" sw={1.5} />,
    land:     () => <Ico d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" size="1.35rem" sw={1.5} />,
    villa:    () => <Ico d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" size="1.35rem" sw={1.5} />,
    shop:     () => <Ico d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" size="1.35rem" sw={1.5} />,
    listings: () => <Ico d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" size="0.85rem" />,
    eye:      () => <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} size="0.85rem" />,
    spinner:  () => (
        <svg style={{ width: '1rem', height: '1rem', animation: 'typesSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Icon + palette config ────────────────────────────────────────────────────

const resolveIcon = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('house') || n.includes('home') || n.includes('resid') || n.includes('bungalow')) return Icons.home;
    if (n.includes('apart') || n.includes('flat') || n.includes('condo') || n.includes('studio'))   return Icons.building;
    if (n.includes('office') || n.includes('commercial') || n.includes('workspace'))                return Icons.office;
    if (n.includes('land') || n.includes('plot') || n.includes('farm') || n.includes('agric'))      return Icons.land;
    if (n.includes('villa') || n.includes('mansion') || n.includes('estate') || n.includes('town')) return Icons.villa;
    if (n.includes('shop') || n.includes('retail') || n.includes('store') || n.includes('market'))  return Icons.shop;
    return Icons.building;
};

const PALETTES = [
    { hue: 214, label: 'Blue',   accent: 'hsl(214 80% 50%)',  bg: 'hsl(214 100% 95%)', soft: 'hsl(214 80% 90%)',  text: 'hsl(214 80% 35%)' },
    { hue: 152, label: 'Green',  accent: 'hsl(152 58% 38%)',  bg: 'hsl(152 55% 93%)',  soft: 'hsl(152 55% 86%)',  text: 'hsl(152 55% 26%)' },
    { hue: 340, label: 'Rose',   accent: 'hsl(340 70% 50%)',  bg: 'hsl(340 70% 95%)',  soft: 'hsl(340 65% 88%)',  text: 'hsl(340 65% 34%)' },
    { hue: 270, label: 'Purple', accent: 'hsl(270 58% 52%)',  bg: 'hsl(270 60% 95%)',  soft: 'hsl(270 55% 88%)',  text: 'hsl(270 55% 35%)' },
    { hue: 36,  label: 'Amber',  accent: 'hsl(36 88% 45%)',   bg: 'hsl(36 95% 93%)',   soft: 'hsl(36 85% 86%)',   text: 'hsl(36 78% 28%)' },
    { hue: 190, label: 'Teal',   accent: 'hsl(190 68% 38%)',  bg: 'hsl(190 65% 93%)',  soft: 'hsl(190 60% 85%)',  text: 'hsl(190 60% 26%)' },
    { hue: 16,  label: 'Orange', accent: 'hsl(16 82% 50%)',   bg: 'hsl(16 90% 94%)',   soft: 'hsl(16 80% 87%)',   text: 'hsl(16 75% 32%)' },
    { hue: 248, label: 'Indigo', accent: 'hsl(248 62% 52%)',  bg: 'hsl(248 65% 95%)',  soft: 'hsl(248 55% 88%)',  text: 'hsl(248 58% 36%)' },
];

const getPalette = (type, i) => {
    const seed = (type?.name ?? '').split('').reduce((a, c) => a + c.charCodeAt(0), i);
    return PALETTES[seed % PALETTES.length];
};

// ─── Atoms ────────────────────────────────────────────────────────────────────

const iStyle = (focused, err) => ({
    width: '100%', padding: '0.6rem 0.875rem',
    border: `1.5px solid ${err ? 'hsl(0 65% 60%)' : focused ? 'hsl(220 60% 55%)' : 'hsl(220 15% 88%)'}`,
    borderRadius: '0.55rem', fontSize: '0.875rem', color: 'hsl(220 25% 16%)',
    backgroundColor: 'white', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    boxShadow: focused && !err ? '0 0 0 3px hsl(220 60% 55% / 0.1)' : err ? '0 0 0 3px hsl(0 65% 55% / 0.09)' : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
});

const TField = ({ label, required, error, hint, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {label && <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'hsl(220 25% 22%)', letterSpacing: '0.01em' }}>
            {label}{required && <span style={{ color: 'hsl(0 65% 52%)', marginLeft: '0.2rem' }}>*</span>}
        </label>}
        {children}
        {error && <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(0 65% 48%)', fontWeight: '600' }}>{error}</p>}
        {hint && !error && <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(220 15% 55%)' }}>{hint}</p>}
    </div>
);

const TInput = ({ error, ...props }) => {
    const [f, setF] = useState(false);
    return <input {...props} onFocus={() => setF(true)} onBlur={() => setF(false)} style={iStyle(f, !!error)} />;
};

const TTextarea = ({ rows = 3, ...props }) => {
    const [f, setF] = useState(false);
    return <textarea {...props} rows={rows} onFocus={() => setF(true)} onBlur={() => setF(false)} style={{ ...iStyle(f, false), resize: 'vertical' }} />;
};

const TToggle = ({ value, onChange, label, sub }) => (
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
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 200, padding: '0.85rem 1.25rem', borderRadius: '0.75rem', backgroundColor: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: '600', fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'typesSlideIn 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {toast.type === 'error' ? <Icons.x /> : <Icons.check />}
        {toast.msg}
    </div>
) : null;

// ─── Type form modal ──────────────────────────────────────────────────────────

const TypeModal = ({ mode, initial, onClose, onSaved, showToast }) => {
    const isEdit = mode === 'edit';
    const [form, setForm] = useState({
        name:        initial?.name        ?? '',
        slug:        initial?.slug        ?? '',
        description: initial?.description ?? '',
        is_active:   initial?.is_active   ?? true,
    });
    const [errors,     setErrors]     = useState({});
    const [processing, setProcessing] = useState(false);
    const [autoSlug,   setAutoSlug]   = useState(!isEdit);

    const set   = (k, v) => setForm(p => ({ ...p, [k]: v }));
    const toSlug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const handleName = v => { set('name', v); if (autoSlug) set('slug', toSlug(v)); };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required.';
        if (!form.slug.trim()) e.slug = 'Slug is required.';
        else if (!/^[a-z0-9-]+$/.test(form.slug)) e.slug = 'Lowercase letters, numbers and hyphens only.';
        return e;
    };

    const handleSubmit = e => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setProcessing(true);
        const url    = isEdit ? `/super-admin/property-types/${initial.id}` : '/super-admin/property-types';
        const method = isEdit ? 'put' : 'post';
        router[method](url, form, {
            preserveScroll: true,
            onSuccess: () => { showToast(isEdit ? 'Type updated.' : 'Type created.'); onSaved(); onClose(); },
            onError:   errs2 => { setErrors(errs2); showToast('Please fix the errors.', 'error'); setProcessing(false); },
            onFinish:  () => setProcessing(false),
        });
    };

    // Live preview palette
    const seed = form.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const pal  = PALETTES[seed % PALETTES.length];
    const TypeIcon = resolveIcon(form.name);

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.6)', backdropFilter: 'blur(5px)' }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '520px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.15rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.32)', animation: 'typesModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>

                {/* Dark header with live preview avatar */}
                <div style={{ background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))', padding: '1.4rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.07) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                            {/* Live icon preview */}
                            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.875rem', backgroundColor: form.name ? pal.accent : 'hsl(220 25% 30%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.3s', border: '2px solid hsl(220 30% 30%)', boxShadow: '0 2px 12px hsl(220 28% 6% / 0.4)', flexShrink: 0 }}>
                                <TypeIcon />
                            </div>
                            <div>
                                <h2 style={{ margin: '0 0 0.18rem', fontSize: '1rem', fontWeight: '800', color: 'white' }}>
                                    {isEdit ? 'Edit Property Type' : 'New Property Type'}
                                </h2>
                                <p style={{ margin: 0, fontSize: '0.73rem', color: 'hsl(220 20% 58%)' }}>
                                    {form.name || (isEdit ? `Editing "${initial.name}"` : 'Name it to see a preview')}
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

                        <TField label="Type Name" required error={errors.name}>
                            <TInput value={form.name} onChange={e => handleName(e.target.value)} placeholder="e.g. Detached House, Studio Apartment…" error={errors.name} autoFocus />
                        </TField>

                        <TField label="URL Slug" required error={errors.slug} hint="Used in URLs — auto-generated from name">
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    <TInput value={form.slug} onChange={e => { setAutoSlug(false); set('slug', e.target.value); }} placeholder="detached-house" error={errors.slug} />
                                </div>
                                {!autoSlug && (
                                    <button type="button" onClick={() => { set('slug', toSlug(form.name)); setAutoSlug(true); }}
                                        style={{ padding: '0.6rem 0.875rem', borderRadius: '0.55rem', border: '1px solid hsl(214 80% 88%)', backgroundColor: 'hsl(214 100% 97%)', color: 'hsl(214 80% 46%)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', flexShrink: 0 }}>
                                        Auto
                                    </button>
                                )}
                            </div>
                        </TField>

                        <TField label="Description" hint="Short summary shown on listing forms">
                            <TTextarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description of this property type…" rows={2} />
                        </TField>

                        <TToggle value={form.is_active} onChange={v => set('is_active', v)} label="Active" sub="Make this type visible and selectable for listings" />
                    </div>

                    <div style={{ padding: '1rem 1.75rem 1.5rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', gap: '0.65rem' }}>
                        <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.6rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 32%)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                        <button type="submit" disabled={processing}
                            style={{ flex: 2, padding: '0.6rem', borderRadius: '0.6rem', border: 'none', backgroundColor: processing ? 'hsl(220 25% 40%)' : 'hsl(220 25% 15%)', color: 'white', fontSize: '0.875rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit', transition: 'background-color 0.15s' }}
                            onMouseEnter={e => { if (!processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'; }}
                            onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'; }}>
                            {processing ? <><Icons.spinner />{isEdit ? 'Saving…' : 'Creating…'}</> : isEdit ? <><Icons.check /> Save Changes</> : <><Icons.plus /> Create Type</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Delete modal ─────────────────────────────────────────────────────────────

const DeleteModal = ({ type, palette, onConfirm, onClose, processing }) => (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(222 28% 8% / 0.65)', backdropFilter: 'blur(5px)' }}>
        <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '400px', margin: '1rem', backgroundColor: 'white', borderRadius: '1.15rem', overflow: 'hidden', boxShadow: '0 40px 100px hsl(220 28% 6% / 0.32)', animation: 'typesModalIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
            <div style={{ height: '4px', background: 'linear-gradient(90deg, hsl(0 65% 52%), hsl(0 75% 62%))' }} />
            <div style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
                    <div style={{ width: '2.6rem', height: '2.6rem', borderRadius: '0.75rem', backgroundColor: 'hsl(0 70% 94%)', color: 'hsl(0 65% 48%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icons.trash /></div>
                    <div>
                        <h3 style={{ margin: '0 0 0.12rem', fontSize: '1rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>Delete Property Type</h3>
                        <p style={{ margin: 0, fontSize: '0.73rem', color: 'hsl(220 15% 50%)' }}>This action is permanent and cannot be undone</p>
                    </div>
                </div>

                {/* Preview row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.875rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 15% 97%)', border: '1px solid hsl(220 15% 91%)', marginBottom: '1rem' }}>
                    <div style={{ width: '2.2rem', height: '2.2rem', borderRadius: '0.55rem', backgroundColor: palette.bg, color: palette.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {React.createElement(resolveIcon(type.name))}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'hsl(220 25% 15%)' }}>{type.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 52%)' }}>
                            {(type.listings_count ?? 0).toLocaleString()} listing{type.listings_count !== 1 ? 's' : ''}
                            {type.slug && <> · <span style={{ fontFamily: 'monospace' }}>/{type.slug}</span></>}
                        </div>
                    </div>
                </div>

                {(type.listings_count ?? 0) > 0 && (
                    <div style={{ padding: '0.65rem 0.875rem', borderRadius: '0.5rem', backgroundColor: 'hsl(40 90% 96%)', border: '1px solid hsl(40 80% 85%)', fontSize: '0.76rem', color: 'hsl(36 75% 35%)', marginBottom: '1rem', lineHeight: 1.5, display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <span style={{ flexShrink: 0, marginTop: '0.05rem', display: 'flex' }}><Icons.alert /></span>
                        <span><strong>{type.listings_count} listing{type.listings_count !== 1 ? 's' : ''}</strong> are using this type. They won't be deleted, but will have no valid type assigned.</span>
                    </div>
                )}

                <p style={{ fontSize: '0.8rem', color: 'hsl(220 15% 38%)', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
                    Permanently remove <strong>"{type.name}"</strong> from your platform?
                </p>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.6rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 30%)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                    <button onClick={onConfirm} disabled={processing}
                        style={{ flex: 2, padding: '0.625rem', borderRadius: '0.6rem', border: 'none', backgroundColor: processing ? 'hsl(0 50% 60%)' : 'hsl(0 65% 50%)', color: 'white', fontSize: '0.85rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontFamily: 'inherit' }}>
                        {processing ? <><Icons.spinner /> Deleting…</> : <><Icons.trash /> Delete Type</>}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// ─── Grid card ────────────────────────────────────────────────────────────────

const TypeCard = ({ type, palette, index, onEdit, onDelete }) => {
    const [hov, setHov] = useState(false);
    const TypeIcon = resolveIcon(type.name);
    const isActive = type.is_active ?? true;

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ backgroundColor: 'white', border: `1.5px solid ${hov ? palette.accent : 'hsl(220 15% 91%)'}`, borderRadius: '1rem', overflow: 'hidden', transition: 'all 0.22s ease', transform: hov ? 'translateY(-3px)' : 'translateY(0)', boxShadow: hov ? `0 16px 40px hsl(${palette.hue} 40% 18% / 0.12)` : '0 1px 4px hsl(220 20% 15% / 0.05)', display: 'flex', flexDirection: 'column', animation: `typesCardIn 0.35s ease ${index * 0.04}s both` }}>

            {/* Gradient accent bar */}
            <div style={{ height: '3px', background: `linear-gradient(90deg, ${palette.accent}, hsl(${palette.hue + 35} 65% 60%))` }} />

            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', backgroundColor: palette.bg, color: palette.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'transform 0.22s', transform: hov ? 'scale(1.08)' : 'scale(1)' }}>
                            <TypeIcon />
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'hsl(220 25% 13%)', margin: '0 0 0.2rem', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '12rem' }}>{type.name}</h3>
                            {type.slug && (
                                <span style={{ fontFamily: 'monospace', fontSize: '0.67rem', color: palette.text, backgroundColor: palette.bg, padding: '0.1rem 0.38rem', borderRadius: '0.28rem', fontWeight: '600', display: 'inline-block' }}>/{type.slug}</span>
                            )}
                        </div>
                    </div>

                    {/* Status badge */}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.6rem', fontWeight: '800', letterSpacing: '0.07em', flexShrink: 0, backgroundColor: isActive ? 'hsl(152 55% 92%)' : 'hsl(220 15% 92%)', color: isActive ? 'hsl(152 55% 27%)' : 'hsl(220 15% 42%)' }}>
                        <span style={{ width: '0.33rem', height: '0.33rem', borderRadius: '50%', backgroundColor: isActive ? 'hsl(152 55% 40%)' : 'hsl(220 15% 55%)', flexShrink: 0 }} />
                        {isActive ? 'ACTIVE' : 'OFF'}
                    </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.78rem', color: type.description ? 'hsl(220 15% 50%)' : 'hsl(220 15% 68%)', margin: 0, lineHeight: 1.55, fontStyle: type.description ? 'normal' : 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.3rem' }}>
                    {type.description || 'No description added.'}
                </p>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 0.7rem', borderRadius: '0.55rem', backgroundColor: palette.bg }}>
                        <span style={{ color: palette.accent, display: 'flex' }}><Icons.listings /></span>
                        <div>
                            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'hsl(220 25% 13%)', lineHeight: 1 }}>{(type.listings_count ?? 0).toLocaleString()}</div>
                            <div style={{ fontSize: '0.58rem', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(220 15% 54%)', marginTop: '0.06rem' }}>Total</div>
                        </div>
                    </div>
                    {type.active_listings_count !== undefined && (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 0.7rem', borderRadius: '0.55rem', backgroundColor: 'hsl(220 15% 97%)' }}>
                            <span style={{ color: 'hsl(152 55% 38%)', display: 'flex' }}><Icons.eye /></span>
                            <div>
                                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'hsl(220 25% 13%)', lineHeight: 1 }}>{(type.active_listings_count ?? 0).toLocaleString()}</div>
                                <div style={{ fontSize: '0.58rem', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(220 15% 54%)', marginTop: '0.06rem' }}>Active</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions footer */}
            <div style={{ padding: '0.7rem 1.1rem', borderTop: '1px solid hsl(220 15% 95%)', display: 'flex', gap: '0.45rem' }}>
                <button onClick={() => onEdit(type)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.46rem 0', borderRadius: '0.5rem', fontSize: '0.78rem', fontWeight: '700', backgroundColor: palette.bg, color: palette.text, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.edit /> Edit
                </button>
                <button onClick={() => onDelete(type)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.46rem 0.7rem', borderRadius: '0.5rem', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 50%)', border: 'none', cursor: 'pointer', transition: 'filter 0.15s', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.trash />
                </button>
            </div>
        </div>
    );
};

// ─── List row ─────────────────────────────────────────────────────────────────

const TypeRow = ({ type, palette, index, onEdit, onDelete }) => {
    const [hov, setHov] = useState(false);
    const TypeIcon = resolveIcon(type.name);
    const isActive = type.is_active ?? true;

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ display: 'grid', gridTemplateColumns: '2.25rem 1fr 6rem 5.5rem 6.5rem auto', alignItems: 'center', gap: '1rem', padding: '0.875rem 1.25rem', borderBottom: '1px solid hsl(220 15% 95%)', backgroundColor: hov ? 'hsl(220 20% 98.5%)' : 'white', transition: 'background-color 0.12s', animation: `typesCardIn 0.3s ease ${index * 0.03}s both` }}>

            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.6rem', backgroundColor: palette.bg, color: palette.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <TypeIcon />
            </div>

            <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'hsl(220 25% 14%)', marginBottom: '0.18rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{type.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    {type.slug && <span style={{ fontFamily: 'monospace', fontSize: '0.67rem', color: palette.text, backgroundColor: palette.bg, padding: '0.1rem 0.38rem', borderRadius: '0.28rem', fontWeight: '600' }}>/{type.slug}</span>}
                    {type.description && <span style={{ fontSize: '0.72rem', color: 'hsl(220 15% 55%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{type.description}</span>}
                </div>
            </div>

            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'hsl(220 25% 14%)' }}>{(type.listings_count ?? 0).toLocaleString()}</div>
                <div style={{ fontSize: '0.63rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'hsl(220 15% 56%)' }}>listings</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', backgroundColor: palette.accent, flexShrink: 0 }} />
                <span style={{ fontSize: '0.7rem', color: 'hsl(220 15% 52%)', fontWeight: '500' }}>{palette.label}</span>
            </div>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', padding: '0.22rem 0.55rem', borderRadius: '999px', fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.07em', backgroundColor: isActive ? 'hsl(152 55% 92%)' : 'hsl(220 15% 92%)', color: isActive ? 'hsl(152 55% 27%)' : 'hsl(220 15% 42%)', whiteSpace: 'nowrap' }}>
                <span style={{ width: '0.33rem', height: '0.33rem', borderRadius: '50%', backgroundColor: isActive ? 'hsl(152 55% 40%)' : 'hsl(220 15% 55%)' }} />
                {isActive ? 'ACTIVE' : 'INACTIVE'}
            </span>

            <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button onClick={() => onEdit(type)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.38rem 0.65rem', borderRadius: '0.45rem', border: 'none', cursor: 'pointer', backgroundColor: palette.bg, color: palette.text, fontSize: '0.75rem', fontWeight: '700', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'} onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.edit /> Edit
                </button>
                <button onClick={() => onDelete(type)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.38rem 0.5rem', borderRadius: '0.45rem', border: 'none', cursor: 'pointer', backgroundColor: 'hsl(0 65% 96%)', color: 'hsl(0 65% 50%)', fontFamily: 'inherit', transition: 'filter 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'} onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                    <Icons.trash />
                </button>
            </div>
        </div>
    );
};

// ─── KPI card ─────────────────────────────────────────────────────────────────

const Kpi = ({ label, value, sub, accent = 'hsl(220 25% 15%)', iconBg, iconColor, icon }) => (
    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>
        {icon && (
            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.65rem', backgroundColor: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {icon}
            </div>
        )}
        <div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: accent, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'hsl(220 25% 22%)', marginTop: '0.1rem' }}>{label}</div>
            {sub && <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 55%)', marginTop: '0.05rem' }}>{sub}</div>}
        </div>
    </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

const TypesIndex = ({}) => {
    const { types = [] } = usePage().props;
    const [search,       setSearch]       = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode,     setViewMode]     = useState('grid');
    const [modal,        setModal]        = useState(null);
    const [delTarget,    setDelTarget]    = useState(null);
    const [deleting,     setDeleting]     = useState(false);
    const [toast,        setToast]        = useState(null);
    const [refreshing,   refresh]   = useRefresh(['types']);
    const toastTimer = useRef(null);

    const showToast = (msg, type = 'success') => {
        clearTimeout(toastTimer.current);
        setToast({ msg, type });
        toastTimer.current = setTimeout(() => setToast(null), 3500);
    };

    const reload = () => router.reload({ only: ['types'] });

    const confirmDelete = () => {
        setDeleting(true);
        router.delete(`/super-admin/property-types/${delTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setTypes(t => t.filter(x => x.id !== delTarget.id));
                showToast(`"${delTarget.name}" deleted.`);
                setDelTarget(null);
            },
            onError:  () => showToast('Delete failed. Please try again.', 'error'),
            onFinish: () => setDeleting(false),
        });
    };

    const filtered = types.filter(t => {
        const q = search.toLowerCase();
        const ok = !q || (t.name ?? '').toLowerCase().includes(q)
                      || (t.slug ?? '').toLowerCase().includes(q)
                      || (t.description ?? '').toLowerCase().includes(q);
        const st = statusFilter === 'all'
            || (statusFilter === 'active'   && (t.is_active ?? true))
            || (statusFilter === 'inactive' && !(t.is_active ?? true));
        return ok && st;
    });

    const activeCount    = types.filter(t => t.is_active ?? true).length;
    const totalListings  = types.reduce((s, t) => s + (t.listings_count ?? 0), 0);

    return (
        <>
            <Toast toast={toast} />

            {modal && (
                <TypeModal
                    mode={modal.mode}
                    initial={modal.type ?? null}
                    onClose={() => setModal(null)}
                    onSaved={reload}
                    showToast={showToast}
                />
            )}

            {delTarget && (
                <DeleteModal
                    type={delTarget}
                    palette={getPalette(delTarget, 0)}
                    onConfirm={confirmDelete}
                    onClose={() => setDelTarget(null)}
                    processing={deleting}
                />
            )}

            <div>
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.22rem', letterSpacing: '-0.02em' }}>Property Types</h1>
                        <p style={{ fontSize: '0.82rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                            {types.length} type{types.length !== 1 ? 's' : ''} · {activeCount} active · {totalListings.toLocaleString()} total listings
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
                            <Icons.plus /> New Type
                        </button>
                    </div>
                </div>

                {/* ── KPI strip ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <Kpi label="Total Types"    value={types.length}                    sub="All categories"        accent="hsl(220 25% 15%)"  iconBg="hsl(220 20% 93%)" iconColor="hsl(220 25% 30%)" icon={<Icons.grid />} />
                    <Kpi label="Active"         value={activeCount}                     sub="Visible to users"      accent="hsl(152 55% 35%)"  iconBg="hsl(152 55% 92%)" iconColor="hsl(152 55% 35%)" icon={<Icons.check />} />
                    <Kpi label="Inactive"       value={types.length - activeCount}      sub="Hidden from listings"  accent="hsl(220 15% 44%)"  iconBg="hsl(220 15% 93%)" iconColor="hsl(220 15% 44%)" icon={<Icons.x />} />
                    <Kpi label="Total Listings" value={totalListings.toLocaleString()}  sub="Across all types"      accent="hsl(214 80% 46%)"  iconBg="hsl(214 100% 95%)" iconColor="hsl(214 80% 46%)" icon={<Icons.listings />} />
                </div>

                {/* ── Toolbar ── */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '0.875rem', padding: '0.875rem 1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap', boxShadow: '0 1px 3px hsl(220 20% 15% / 0.04)' }}>

                    {/* Search */}
                    <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 0 }}>
                        <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 15% 55%)', pointerEvents: 'none', display: 'flex' }}><Icons.search /></span>
                        <input type="text" placeholder="Search types…" value={search} onChange={e => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '0.52rem 0.75rem 0.52rem 2.25rem', border: '1px solid hsl(220 15% 88%)', borderRadius: '0.55rem', fontSize: '0.855rem', color: 'hsl(220 25% 18%)', backgroundColor: 'hsl(220 15% 98.5%)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
                            onFocus={e => e.target.style.borderColor = 'hsl(220 60% 60%)'}
                            onBlur={e => e.target.style.borderColor = 'hsl(220 15% 88%)'} />
                    </div>

                    {/* Status pills */}
                    <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                        {[['all', 'All'], ['active', 'Active'], ['inactive', 'Inactive']].map(([v, l]) => {
                            const active = statusFilter === v;
                            return (
                                <button key={v} onClick={() => setStatusFilter(v)}
                                    style={{ padding: '0.42rem 0.875rem', borderRadius: '999px', border: `1.5px solid ${active ? 'hsl(220 25% 20%)' : 'hsl(220 15% 88%)'}`, fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', backgroundColor: active ? 'hsl(220 25% 15%)' : 'transparent', color: active ? 'white' : 'hsl(220 15% 45%)' }}>
                                    {l}
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ width: '1px', height: '1.5rem', backgroundColor: 'hsl(220 15% 90%)', flexShrink: 0 }} />

                    {/* View toggle */}
                    <div style={{ display: 'flex', gap: '0.2rem', backgroundColor: 'hsl(220 15% 96%)', borderRadius: '0.5rem', padding: '0.2rem', flexShrink: 0 }}>
                        {[['grid', Icons.grid], ['list', Icons.list]].map(([v, Icon]) => (
                            <button key={v} onClick={() => setViewMode(v)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '1.75rem', borderRadius: '0.35rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', backgroundColor: viewMode === v ? 'white' : 'transparent', color: viewMode === v ? 'hsl(220 25% 18%)' : 'hsl(220 15% 55%)', boxShadow: viewMode === v ? '0 1px 3px hsl(220 20% 15% / 0.1)' : 'none' }}>
                                <Icon />
                            </button>
                        ))}
                    </div>

                    {(search || statusFilter !== 'all') && (
                        <span style={{ fontSize: '0.75rem', color: 'hsl(220 15% 52%)', whiteSpace: 'nowrap' }}>
                            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {/* ── Content ── */}
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px dashed hsl(220 15% 86%)' }}>
                        <div style={{ fontSize: '2.75rem', marginBottom: '0.875rem' }}>🏠</div>
                        <p style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: '700', color: 'hsl(220 25% 22%)' }}>
                            {search ? 'No types match your search' : 'No property types yet'}
                        </p>
                        <p style={{ margin: '0 0 1.5rem', fontSize: '0.82rem', color: 'hsl(220 15% 55%)' }}>
                            {search ? 'Try adjusting your search or filter.' : 'Create your first property type to start categorising listings.'}
                        </p>
                        {!search && (
                            <button onClick={() => setModal({ mode: 'create' })}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.625rem 1.25rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 25% 15%)', color: 'white', fontWeight: '700', fontSize: '0.875rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                                <Icons.plus /> Create First Type
                            </button>
                        )}
                    </div>

                ) : viewMode === 'grid' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {filtered.map((type, i) => (
                            <TypeCard key={type.id} type={type} palette={getPalette(type, i)} index={i}
                                onEdit={t => setModal({ mode: 'edit', type: t })}
                                onDelete={t => setDelTarget(t)} />
                        ))}
                    </div>

                ) : (
                    <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2.25rem 1fr 6rem 5.5rem 6.5rem auto', alignItems: 'center', gap: '1rem', padding: '0.6rem 1.25rem', backgroundColor: 'hsl(220 15% 97.5%)', borderBottom: '1px solid hsl(220 15% 92%)', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'hsl(220 15% 48%)' }}>
                            <div />
                            <div>Name & Slug</div>
                            <div style={{ textAlign: 'right' }}>Listings</div>
                            <div>Color</div>
                            <div>Status</div>
                            <div>Actions</div>
                        </div>
                        {filtered.map((type, i) => (
                            <TypeRow key={type.id} type={type} palette={getPalette(type, i)} index={i}
                                onEdit={t => setModal({ mode: 'edit', type: t })}
                                onDelete={t => setDelTarget(t)} />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes typesSpin    { to { transform: rotate(360deg); } }
                @keyframes typesSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes typesModalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes typesCardIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
            `}</style>
        </>
    );
};

TypesIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default TypesIndex;