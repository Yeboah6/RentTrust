import React, { useState, useRef, useCallback } from 'react';
import { Link, useForm, Head } from '@inertiajs/react';
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
    plus:    () => <Ico d="M12 4v16m8-8H4" />,
    check:   () => <Ico d="M5 13l4 4L19 7" size="0.82rem" />,
    x:       () => <Ico d="M6 18L18 6M6 6l12 12" />,
    home:    () => <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" size="1.15rem" />,
    tag:     () => <Ico d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />,
    pin:     () => <Ico d={["M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z","M15 11a3 3 0 11-6 0 3 3 0 016 0z"]} />,
    currency:() => <Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size="1.1rem" />,
    image:   () => <Ico d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" size="1.5rem" />,
    upload:  () => <Ico d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" size="1.5rem" />,
    trash2:  () => <Ico d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" size="0.8rem" />,
    star:    () => <Ico d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" size="0.75rem" />,
    warn:    () => <Ico d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" size="0.78rem" sw={2} />,
    spinner: () => (
        <svg style={{ width: '1rem', height: '1rem', animation: 'lcSpin 0.75s linear infinite', flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.85 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

// ─── Config ───────────────────────────────────────────────────────────────────

const LISTING_TYPES = [
    { value: 'sale',  label: 'For Sale',  sub: 'Outright purchase' },
    { value: 'rent',  label: 'For Rent',  sub: 'Monthly / yearly' },
    { value: 'short', label: 'Short Let', sub: 'Days / weeks' },
    { value: 'lease', label: 'Lease',     sub: 'Long-term lease' },
];

const CURRENCIES = [
    { value: 'GH₵', label: 'GH₵ GHS' },
    { value: '$',   label: '$ USD' },
    { value: '£',   label: '£ GBP' },
    { value: '€',   label: '€ EUR' },
    { value: '₦',   label: '₦ NGN' },
];

const INITIAL_STATUSES = ['approved', 'pending', 'draft'];

// ─── Validation ───────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s\-().]{6,}$/;

/**
 * Returns a flat object of field → error message.
 * Only fields with actual problems are included.
 */
function validate(data) {
    const errs = {};

    // Title
    if (!data.title.trim()) {
        errs.title = 'Listing title is required.';
    } else if (data.title.trim().length < 5) {
        errs.title = 'Title must be at least 5 characters.';
    } else if (data.title.trim().length > 150) {
        errs.title = 'Title must be 150 characters or fewer.';
    }

    // Description
    if (data.description.trim().length > 0 && data.description.trim().length < 20) {
        errs.description = 'Description should be at least 20 characters if provided.';
    }

    // Pricing
    if (data.purpose === 'sale') {
        if (!data.salePrice) {
            errs.salePrice = 'Sale price is required.';
        } else if (isNaN(Number(data.salePrice)) || Number(data.salePrice) <= 0) {
            errs.salePrice = 'Enter a valid price greater than 0.';
        }
    } else {
        if (!data.rentMin) {
            errs.rentMin = 'Minimum rent is required.';
        } else if (isNaN(Number(data.rentMin)) || Number(data.rentMin) <= 0) {
            errs.rentMin = 'Enter a valid amount greater than 0.';
        }
        if (!data.rentMax) {
            errs.rentMax = 'Maximum rent is required.';
        } else if (isNaN(Number(data.rentMax)) || Number(data.rentMax) <= 0) {
            errs.rentMax = 'Enter a valid amount greater than 0.';
        }
        if (data.rentMin && data.rentMax && Number(data.rentMax) < Number(data.rentMin)) {
            errs.rentMax = 'Max rent must be greater than or equal to min rent.';
        }
    }

    // Location
    if (!data.city) {
        errs.city = 'Please select a region.';
    }
    if (!data.area.trim()) {
        errs.area = 'Area / neighbourhood is required.';
    }

    // Specs
    if (data.bedrooms !== '' && (isNaN(Number(data.bedrooms)) || Number(data.bedrooms) < 0 || !Number.isInteger(Number(data.bedrooms)))) {
        errs.bedrooms = 'Enter a valid whole number of bedrooms.';
    }
    if (data.bathrooms !== '' && (isNaN(Number(data.bathrooms)) || Number(data.bathrooms) < 0 || !Number.isInteger(Number(data.bathrooms)))) {
        errs.bathrooms = 'Enter a valid whole number of bathrooms.';
    }

    // Images
    if (data.images.length === 0) {
        errs.images = 'Please upload at least one photo.';
    }

    // Contact
    if (data.agentPhone && !PHONE_RE.test(data.agentPhone)) {
        errs.agentPhone = 'Enter a valid phone number.';
    }
    if (data.agentEmail && !EMAIL_RE.test(data.agentEmail)) {
        errs.agentEmail = 'Enter a valid email address.';
    }

    return errs;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const avatarHue = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

// ─── Field atoms ──────────────────────────────────────────────────────────────

const inputStyle = (focused, hasError) => ({
    width: '100%',
    padding: '0.6rem 0.875rem',
    border: `1.5px solid ${hasError ? 'hsl(0 65% 60%)' : focused ? 'hsl(220 60% 55%)' : 'hsl(220 15% 88%)'}`,
    borderRadius: '0.6rem',
    fontSize: '0.875rem',
    color: 'hsl(220 25% 16%)',
    backgroundColor: hasError ? 'hsl(0 65% 99.5%)' : 'white',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    boxShadow: focused && !hasError ? '0 0 0 3px hsl(220 60% 55% / 0.11)' : hasError ? '0 0 0 3px hsl(0 65% 55% / 0.1)' : 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s, background-color 0.15s',
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
        {error && (
            <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(0 65% 44%)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.28rem', animation: 'errIn 0.18s ease' }}>
                <span style={{ flexShrink: 0, display: 'flex', color: 'hsl(0 65% 50%)' }}><Icons.warn /></span>
                {error}
            </p>
        )}
    </div>
);

const FInput = ({ hasError, onBlur, ...props }) => {
    const [f, setF] = useState(false);
    return (
        <input
            {...props}
            onFocus={() => setF(true)}
            onBlur={(e) => { setF(false); onBlur?.(e); }}
            style={inputStyle(f, hasError)}
        />
    );
};

const FTextarea = ({ rows = 4, hasError, onBlur, ...props }) => {
    const [f, setF] = useState(false);
    return (
        <textarea
            {...props}
            rows={rows}
            onFocus={() => setF(true)}
            onBlur={(e) => { setF(false); onBlur?.(e); }}
            style={{ ...inputStyle(f, hasError), resize: 'vertical' }}
        />
    );
};

const FSelect = ({ hasError, onBlur, children, ...props }) => {
    const [f, setF] = useState(false);
    return (
        <select
            {...props}
            onFocus={() => setF(true)}
            onBlur={(e) => { setF(false); onBlur?.(e); }}
            style={{ ...inputStyle(f, hasError), cursor: 'pointer', appearance: 'none' }}
        >
            {children}
        </select>
    );
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

// ─── Error summary banner ─────────────────────────────────────────────────────

const ErrorBanner = ({ errors }) => {
    const keys = Object.keys(errors);
    if (!keys.length) return null;
    return (
        <div style={{ padding: '0.875rem 1rem', borderRadius: '0.75rem', backgroundColor: 'hsl(0 65% 98%)', border: '1.5px solid hsl(0 65% 86%)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', animation: 'errIn 0.2s ease' }}>
            <span style={{ color: 'hsl(0 65% 50%)', flexShrink: 0, marginTop: '0.05rem', display: 'flex' }}><Icons.warn /></span>
            <div>
                <p style={{ margin: '0 0 0.3rem', fontSize: '0.8rem', fontWeight: '800', color: 'hsl(0 55% 34%)' }}>
                    Please fix {keys.length} error{keys.length > 1 ? 's' : ''} before submitting
                </p>
                <ul style={{ margin: 0, paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.18rem' }}>
                    {keys.map(k => (
                        <li key={k} style={{ fontSize: '0.72rem', color: 'hsl(0 50% 40%)', lineHeight: 1.4 }}>{errors[k]}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// ─── Image upload ─────────────────────────────────────────────────────────────

const MAX_IMAGES = 10;
const ACCEPTED   = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const ImageUpload = ({ images, onChange, error }) => {
    const inputRef  = useRef(null);
    const [dragOver, setDragOver] = useState(false);

    const addFiles = useCallback((files) => {
        const valid = [...files]
            .filter(f => ACCEPTED.includes(f.type))
            .slice(0, MAX_IMAGES - images.length);
        if (!valid.length) return;
        onChange([...images, ...valid]);
    }, [images, onChange]);

    const onInputChange = (e) => {
        addFiles(e.target.files);
        e.target.value = '';
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        addFiles(e.dataTransfer.files);
    };

    const remove = (index) => onChange(images.filter((_, i) => i !== index));

    const setPrimary = (index) => {
        if (index === 0) return;
        const next = [...images];
        const [item] = next.splice(index, 1);
        next.unshift(item);
        onChange(next);
    };

    const preview = (file) => URL.createObjectURL(file);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Drop zone */}
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                style={{
                    border: `2px dashed ${error ? 'hsl(0 65% 60%)' : dragOver ? 'hsl(220 60% 55%)' : 'hsl(220 15% 82%)'}`,
                    borderRadius: '0.75rem',
                    backgroundColor: dragOver ? 'hsl(214 100% 98%)' : error ? 'hsl(0 65% 99%)' : 'hsl(220 15% 98.5%)',
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    cursor: images.length >= MAX_IMAGES ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: images.length >= MAX_IMAGES ? 0.55 : 1,
                }}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED.join(',')}
                    multiple
                    style={{ display: 'none' }}
                    onChange={onInputChange}
                    disabled={images.length >= MAX_IMAGES}
                />
                <div style={{ color: dragOver ? 'hsl(220 60% 52%)' : error ? 'hsl(0 65% 58%)' : 'hsl(220 15% 55%)', display: 'flex', justifyContent: 'center', marginBottom: '0.65rem' }}>
                    <Icons.upload />
                </div>
                <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', fontWeight: '700', color: error ? 'hsl(0 55% 38%)' : 'hsl(220 25% 22%)' }}>
                    {dragOver ? 'Drop images here' : 'Click to upload or drag & drop'}
                </p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'hsl(220 15% 55%)' }}>
                    JPG, PNG, WebP or GIF · Max {MAX_IMAGES} images · {images.length}/{MAX_IMAGES} added
                </p>
            </div>

            {error && (
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(0 65% 44%)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.28rem', animation: 'errIn 0.18s ease' }}>
                    <span style={{ flexShrink: 0, display: 'flex', color: 'hsl(0 65% 50%)' }}><Icons.warn /></span>
                    {error}
                </p>
            )}

            {/* Previews */}
            {images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(7rem, 1fr))', gap: '0.65rem' }}>
                    {images.map((file, i) => (
                        <div key={i} style={{ position: 'relative', borderRadius: '0.6rem', overflow: 'hidden', aspectRatio: '4/3', backgroundColor: 'hsl(220 15% 92%)', border: i === 0 ? '2px solid hsl(152 55% 42%)' : '1.5px solid hsl(220 15% 88%)', boxShadow: i === 0 ? '0 0 0 3px hsl(152 55% 42% / 0.15)' : 'none' }}>
                            <img src={preview(file)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            {i === 0 && (
                                <div style={{ position: 'absolute', top: '0.3rem', left: '0.3rem', backgroundColor: 'hsl(152 55% 37%)', color: 'white', fontSize: '0.55rem', fontWeight: '800', letterSpacing: '0.05em', padding: '0.15rem 0.4rem', borderRadius: '0.3rem' }}>
                                    COVER
                                </div>
                            )}
                            <div className="img-overlay" style={{ position: 'absolute', inset: 0, backgroundColor: 'hsl(220 25% 8% / 0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', opacity: 0, transition: 'opacity 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                                {i !== 0 && (
                                    <button type="button" title="Set as cover" onClick={e => { e.stopPropagation(); setPrimary(i); }}
                                        style={{ width: '1.75rem', height: '1.75rem', borderRadius: '50%', border: 'none', backgroundColor: 'hsl(40 80% 55%)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icons.star />
                                    </button>
                                )}
                                <button type="button" title="Remove" onClick={e => { e.stopPropagation(); remove(i); }}
                                    style={{ width: '1.75rem', height: '1.75rem', borderRadius: '50%', border: 'none', backgroundColor: 'hsl(0 65% 50%)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icons.trash2 />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {images.length > 0 && (
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(220 15% 55%)' }}>
                    Hover an image to set it as cover (⭐) or remove it (🗑). The first image is the cover photo.
                </p>
            )}
        </div>
    );
};

// ─── Live preview card ────────────────────────────────────────────────────────

const PreviewCard = ({ data }) => {
    const isSale  = data.purpose === 'sale';
    const typeLabel = LISTING_TYPES.find(t => t.value === data.purpose)?.label ?? 'Listing';
    const hue     = avatarHue(data.title || 'L');
    const fmtP    = (v) => {
        const n = Number(v);
        if (!v || !n) return '—';
        if (n >= 1_000_000) return `${data.currency}${(n/1_000_000).toFixed(2)}M`;
        if (n >= 1_000)     return `${data.currency}${n.toLocaleString()}`;
        return `${data.currency}${n}`;
    };

    return (
        <div style={{ backgroundColor: 'white', border: '1.5px solid hsl(220 15% 88%)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 20px hsl(220 25% 12% / 0.08)' }}>
            <div style={{ height: '4px', background: `linear-gradient(90deg, hsl(${hue} 55% 48%), hsl(${(hue+40)%360} 55% 55%))` }} />
            <div style={{ height: '7rem', backgroundColor: `hsl(${hue} 30% 92%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `hsl(${hue} 40% 52%)`, overflow: 'hidden', position: 'relative' }}>
                {data.images?.[0]
                    ? <img src={URL.createObjectURL(data.images[0])} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <Icons.home />
                }
                {data.images?.length > 1 && (
                    <div style={{ position: 'absolute', bottom: '0.4rem', right: '0.4rem', backgroundColor: 'hsl(220 25% 8% / 0.65)', color: 'white', fontSize: '0.62rem', fontWeight: '700', padding: '0.18rem 0.45rem', borderRadius: '999px', backdropFilter: 'blur(4px)' }}>
                        +{data.images.length - 1} more
                    </div>
                )}
            </div>
            <div style={{ padding: '0.875rem' }}>
                <p style={{ margin: '0 0 0.3rem', fontSize: '0.875rem', fontWeight: '800', color: 'hsl(220 25% 14%)', lineHeight: 1.3 }}>
                    {data.title || <span style={{ color: 'hsl(220 15% 60%)', fontWeight: '400', fontStyle: 'italic' }}>Listing title…</span>}
                </p>
                {(data.city || data.area) && (
                    <p style={{ margin: '0 0 0.6rem', fontSize: '0.72rem', color: 'hsl(220 15% 52%)' }}>
                        📍 {[data.area, data.city].filter(Boolean).join(', ')}
                    </p>
                )}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.06em', padding: '0.15rem 0.45rem', borderRadius: '999px', backgroundColor: 'hsl(214 100% 95%)', color: 'hsl(214 80% 40%)' }}>
                        {typeLabel.toUpperCase()}
                    </span>
                    {data.property_type && (
                        <span style={{ fontSize: '0.62rem', fontWeight: '700', letterSpacing: '0.05em', padding: '0.15rem 0.45rem', borderRadius: '999px', backgroundColor: 'hsl(220 15% 93%)', color: 'hsl(220 15% 40%)', textTransform: 'uppercase' }}>
                            {data.property_type}
                        </span>
                    )}
                </div>
                <div style={{ borderTop: '1px solid hsl(220 15% 94%)', paddingTop: '0.65rem' }}>
                    {isSale ? (
                        <div style={{ fontSize: '1.15rem', fontWeight: '900', color: `hsl(${hue} 55% 40%)` }}>
                            {fmtP(data.salePrice)}
                        </div>
                    ) : (
                        <div>
                            <div style={{ fontSize: '1.15rem', fontWeight: '900', color: `hsl(${hue} 55% 40%)` }}>
                                {data.rentMin && data.rentMax && data.rentMin !== data.rentMax
                                    ? `${fmtP(data.rentMin)} – ${fmtP(data.rentMax)}`
                                    : fmtP(data.rentMin)
                                }
                            </div>
                            {data.advanceDuration && (
                                <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 52%)', marginTop: '0.1rem' }}>
                                    {data.advanceDuration} month{data.advanceDuration !== '1' ? 's' : ''} advance
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {(data.bedrooms || data.bathrooms || data.area_sqft) && (
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.55rem', paddingTop: '0.55rem', borderTop: '1px solid hsl(220 15% 94%)' }}>
                        {data.bedrooms  && <span style={{ fontSize: '0.7rem', color: 'hsl(220 15% 45%)', fontWeight: '600' }}>🛏 {data.bedrooms} bd</span>}
                        {data.bathrooms && <span style={{ fontSize: '0.7rem', color: 'hsl(220 15% 45%)', fontWeight: '600' }}>🚿 {data.bathrooms} ba</span>}
                        {data.area_sqft && <span style={{ fontSize: '0.7rem', color: 'hsl(220 15% 45%)', fontWeight: '600' }}>📐 {data.area_sqft} sqft</span>}
                    </div>
                )}
                {(data.is_featured || data.is_verified) && (
                    <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.55rem', flexWrap: 'wrap' }}>
                        {data.is_featured && <span style={{ fontSize: '0.6rem', fontWeight: '800', backgroundColor: 'hsl(40 90% 93%)', color: 'hsl(40 80% 30%)', padding: '0.1rem 0.4rem', borderRadius: '0.3rem' }}>⭐ FEATURED</span>}
                        {data.is_verified && <span style={{ fontSize: '0.6rem', fontWeight: '800', backgroundColor: 'hsl(214 100% 95%)', color: 'hsl(214 80% 38%)', padding: '0.1rem 0.4rem', borderRadius: '0.3rem' }}>✓ VERIFIED</span>}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const ListingCreate = ({ agents = [], property_types = [], amenities: amenityList = [], regions = [] }) => {
    const AmenityNames = amenityList.map(a => a?.name);

    const { data, setData, post, processing, errors: serverErrors } = useForm({
        title:           '',
        description:     '',
        purpose:         'rent',
        propertyType:    '',
        salePrice:       '',
        rentMin:         '',
        rentMax:         '',
        advanceDuration: '',
        city:            '',
        area:            '',
        address:         '',
        bedrooms:        '',
        bathrooms:       '',
        is_featured:     false,
        is_verified:     false,
        status:          'pending',
        amenities:       [],
        images:          [],
        agent_id:        '',
        agentName:       '',
        agentPhone:      '',
        agentEmail:      '',
    });

    // ── Client-side validation state ──────────────────────────────────────────
    const [touched, setTouched]       = useState({});
    const [clientErrors, setClientErrors] = useState({});
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const errors = { ...clientErrors, ...serverErrors };

    const visibleErrors = Object.fromEntries(
        Object.entries(errors).filter(([k]) => submitAttempted || touched[k])
    );

    const touch = (field) => setTouched(prev => ({ ...prev, [field]: true }));

    const revalidate = (nextData) => {
        setClientErrors(validate(nextData || data));
    };

    const handleChange = (field, value) => {
        const nextData = { ...data, [field]: value };
        setData(field, value);
        revalidate(nextData);
    };

    const handleBlur = (field) => {
        touch(field);
        revalidate();
    };

    const isSale = data.purpose === 'sale';

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitAttempted(true);
        const errs = validate(data);
        setClientErrors(errs);
        if (Object.keys(errs).length > 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        post('/super-admin/listings', {
            forceFormData: true,
            onError: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        });
    };

    const handleAmenityToggle = (amenity) => {
        const next = data.amenities.includes(amenity)
            ? data.amenities.filter(a => a !== amenity)
            : [...data.amenities, amenity];
        handleChange('amenities', next);
    };

    // Live header values
    const hue      = avatarHue(data.title || 'L');
    const initials = data.title ? data.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : null;

    return (
        <>
        <Head>
            <title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
        </Head>
        
        <div>
            {/* ── Page header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/super-admin/listings"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.75rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 35%)', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', transition: 'background-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                        <Icons.back /> Back
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'hsl(220 25% 12%)', margin: '0 0 0.15rem', letterSpacing: '-0.02em' }}>New Listing</h1>
                        <p style={{ fontSize: '0.8rem', color: 'hsl(220 15% 50%)', margin: 0 }}>Add a new property listing to the platform</p>
                    </div>
                </div>
            </div>

            {/* ── Two-column layout ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>

                {/* ═══ LEFT: form ═══════════════════════════════════════════ */}
                <div style={{ backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 1px 4px hsl(220 20% 15% / 0.05)' }}>

                    {/* Dark gradient header */}
                    <div style={{ background: 'linear-gradient(135deg, hsl(222 30% 14%), hsl(220 28% 20%))', padding: '1.5rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(hsl(220 30% 50% / 0.07) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.875rem', backgroundColor: initials ? `hsl(${hue} 50% 50%)` : 'hsl(220 25% 30%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: initials ? '0.9rem' : '1.1rem', fontWeight: '800', transition: 'background-color 0.3s', border: '2px solid hsl(220 30% 30%)', boxShadow: '0 2px 12px hsl(220 28% 6% / 0.4)', flexShrink: 0 }}>
                                {initials ?? <Icons.home />}
                            </div>
                            <div>
                                <h2 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: '800', color: 'white', letterSpacing: '-0.01em' }}>
                                    {data.title || 'New Property Listing'}
                                </h2>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(220 20% 62%)' }}>
                                    {(data.city || data.area)
                                        ? `📍 ${[data.area, data.city].filter(Boolean).join(', ')}`
                                        : LISTING_TYPES.find(t => t.value === data.purpose)?.label ?? 'Set details below'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

                            {/* ── Error summary (shown after submit attempt) ── */}
                            {submitAttempted && <ErrorBanner errors={visibleErrors} />}

                            {/* ── Basic info ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Basic Information</SectionLabel>
                                <FField label="Listing Title" required error={visibleErrors.title}>
                                    <FInput
                                        value={data.title}
                                        onChange={e => handleChange('title', e.target.value)}
                                        onBlur={() => handleBlur('title')}
                                        placeholder="e.g. Spacious 3-Bed Apartment in East Legon"
                                        hasError={!!visibleErrors.title}
                                    />
                                </FField>
                                <FField label="Description" error={visibleErrors.description}>
                                    <FTextarea
                                        value={data.description}
                                        onChange={e => handleChange('description', e.target.value)}
                                        onBlur={() => handleBlur('description')}
                                        placeholder="Describe the property in detail…"
                                        rows={5}
                                        hasError={!!visibleErrors.description}
                                    />
                                </FField>
                            </div>

                            {/* ── Classification ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Classification</SectionLabel>

                                <FField label="Listing Purpose" required error={visibleErrors.purpose}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                        {LISTING_TYPES.map(t => {
                                            const active = data.purpose === t.value;
                                            return (
                                                <button type="button" key={t.value}
                                                    onClick={() => { handleChange('purpose', t.value); touch('purpose'); }}
                                                    style={{ padding: '0.65rem 0.4rem', borderRadius: '0.65rem', border: `1.5px solid ${active ? 'hsl(220 60% 55%)' : 'hsl(220 15% 88%)'}`, backgroundColor: active ? 'hsl(214 100% 97%)' : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', fontFamily: 'inherit', boxShadow: active ? '0 0 0 3px hsl(220 60% 55% / 0.11)' : 'none' }}>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: active ? 'hsl(214 80% 44%)' : 'hsl(220 25% 22%)', marginBottom: '0.15rem' }}>{t.label}</div>
                                                    <div style={{ fontSize: '0.62rem', color: active ? 'hsl(214 80% 56%)' : 'hsl(220 15% 55%)' }}>{t.sub}</div>
                                                    {active && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.3rem', color: 'hsl(214 80% 48%)' }}><Icons.check /></div>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </FField>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                    <FField label="Property Type" error={visibleErrors.propertyType}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                            {property_types.map(pt => {
                                                const selected = data.propertyType === pt.slug;
                                                return (
                                                    <button type="button" key={pt.id}
                                                        onClick={() => { handleChange('propertyType', selected ? '' : pt.slug); touch('propertyType'); }}
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.32rem 0.7rem', borderRadius: '999px', border: `1.5px solid ${selected ? 'hsl(220 60% 55%)' : 'hsl(220 15% 86%)'}`, backgroundColor: selected ? 'hsl(214 100% 97%)' : 'white', color: selected ? 'hsl(214 80% 44%)' : 'hsl(220 15% 42%)', fontSize: '0.76rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', boxShadow: selected ? '0 0 0 3px hsl(220 60% 55% / 0.11)' : 'none' }}>
                                                        {pt.icon && <span>{pt.icon}</span>}
                                                        {pt.name}
                                                        {selected && <Icons.check />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {data.propertyType && (
                                            <p style={{ margin: '0.3rem 0 0', fontSize: '0.7rem', color: 'hsl(220 15% 55%)' }}>
                                                Selected: <strong>{property_types.find(pt => pt.slug === data.propertyType)?.name}</strong>
                                                <button type="button" onClick={() => handleChange('propertyType', '')}
                                                    style={{ marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(220 15% 55%)', fontSize: '0.7rem', fontFamily: 'inherit' }}>
                                                    ✕ clear
                                                </button>
                                            </p>
                                        )}
                                    </FField>

                                    <FField label="Initial Status" error={visibleErrors.status}>
                                        <FSelect
                                            value={data.status}
                                            onChange={e => handleChange('status', e.target.value)}
                                            onBlur={() => handleBlur('status')}
                                        >
                                            {INITIAL_STATUSES.map(s => (
                                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                            ))}
                                        </FSelect>
                                    </FField>
                                </div>

                                {agents.length > 0 && (
                                    <FField label="Assign to Agent" hint="Optional — can be assigned later">
                                        <FSelect
                                            value={data.agent_id}
                                            onChange={e => {
                                                const agent = agents.find(a => String(a.id) === e.target.value);
                                                const next = {
                                                    ...data,
                                                    agent_id:   agent?.id    ?? '',
                                                    agentName:  agent?.name  ?? '',
                                                    agentPhone: agent?.phone ?? '',
                                                    agentEmail: agent?.email ?? '',
                                                };
                                                setData(next);
                                                revalidate(next);
                                            }}
                                            onBlur={() => handleBlur('agent_id')}
                                        >
                                            <option value="">Unassigned</option>
                                            {agents.map(a => (
                                                <option key={a.id} value={a.id}>
                                                    {a.name}{a.agency ? ` — ${a.agency}` : ''}
                                                </option>
                                            ))}
                                        </FSelect>
                                    </FField>
                                )}
                            </div>

                            {/* ── Pricing ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Pricing</SectionLabel>

                                {isSale ? (
                                    <FField label="Sale Price" required error={visibleErrors.salePrice}>
                                        <FInput
                                            type="number"
                                            value={data.salePrice}
                                            onChange={e => handleChange('salePrice', e.target.value)}
                                            onBlur={() => handleBlur('salePrice')}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            hasError={!!visibleErrors.salePrice}
                                        />
                                    </FField>
                                ) : (
                                    <>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                            <FField label="Min Rent / month" required error={visibleErrors.rentMin}>
                                                <FInput
                                                    type="number"
                                                    value={data.rentMin}
                                                    onChange={e => handleChange('rentMin', e.target.value)}
                                                    onBlur={() => handleBlur('rentMin')}
                                                    placeholder="0.00"
                                                    min="0"
                                                    step="0.01"
                                                    hasError={!!visibleErrors.rentMin}
                                                />
                                            </FField>
                                            <FField label="Max Rent / month" required error={visibleErrors.rentMax}>
                                                <FInput
                                                    type="number"
                                                    value={data.rentMax}
                                                    onChange={e => handleChange('rentMax', e.target.value)}
                                                    onBlur={() => handleBlur('rentMax')}
                                                    placeholder="0.00"
                                                    min="0"
                                                    step="0.01"
                                                    hasError={!!visibleErrors.rentMax}
                                                />
                                            </FField>
                                        </div>
                                        <FField label="Advance Duration (years)" hint="How many years rent is required upfront" error={visibleErrors.advanceDuration}>
                                            <FSelect
                                                value={data.advanceDuration}
                                                onChange={e => handleChange('advanceDuration', e.target.value)}
                                                onBlur={() => handleBlur('advanceDuration')}
                                            >
                                                <option value="">Select…</option>
                                                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} year{n > 1 ? 's' : ''}</option>)}
                                            </FSelect>
                                        </FField>
                                    </>
                                )}
                            </div>

                            {/* ── Location ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Location</SectionLabel>

                                <FField label="Region" required error={visibleErrors.city}>
                                    <FSelect
                                        value={data.city}
                                        onChange={e => { handleChange('city', e.target.value); handleChange('area', ''); }}
                                        onBlur={() => handleBlur('city')}
                                        hasError={!!visibleErrors.city}
                                    >
                                        <option value="">Select region…</option>
                                        {regions.map(r => (
                                            <option key={r.id} value={r.name}>{r.name}</option>
                                        ))}
                                    </FSelect>
                                </FField>

                                {data.city && (() => {
                                    const selectedRegion = regions.find(r => r.name === data.city);
                                    const areas = selectedRegion?.children ?? [];
                                    return areas.length > 0 ? (
                                        <FField label="Area / Neighbourhood" required error={visibleErrors.area}>
                                            <FSelect
                                                value={data.area}
                                                onChange={e => handleChange('area', e.target.value)}
                                                onBlur={() => handleBlur('area')}
                                                hasError={!!visibleErrors.area}
                                            >
                                                <option value="">Select area…</option>
                                                {areas.map(a => (
                                                    <option key={a.id} value={a.name}>{a.name}</option>
                                                ))}
                                            </FSelect>
                                        </FField>
                                    ) : (
                                        <FField label="Area / Neighbourhood" required error={visibleErrors.area}>
                                            <FInput
                                                value={data.area}
                                                onChange={e => handleChange('area', e.target.value)}
                                                onBlur={() => handleBlur('area')}
                                                placeholder="e.g. East Legon"
                                                hasError={!!visibleErrors.area}
                                            />
                                        </FField>
                                    );
                                })()}

                                {!data.city && (
                                    <FField label="Area / Neighbourhood" required error={visibleErrors.area}>
                                        <FInput
                                            value={data.area}
                                            onChange={e => handleChange('area', e.target.value)}
                                            onBlur={() => handleBlur('area')}
                                            placeholder="Select a region first, or type an area"
                                            hasError={!!visibleErrors.area}
                                        />
                                    </FField>
                                )}

                                <FField label="Full Address" error={visibleErrors.address} hint="Optional — shown to verified leads only">
                                    <FInput
                                        value={data.address}
                                        onChange={e => handleChange('address', e.target.value)}
                                        onBlur={() => handleBlur('address')}
                                        placeholder="House number, street, area…"
                                        hasError={!!visibleErrors.address}
                                    />
                                </FField>
                            </div>

                            {/* ── Property specs ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Property Specs</SectionLabel>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                    <FField label="Bedrooms" error={visibleErrors.bedrooms}>
                                        <FInput
                                            type="number"
                                            value={data.bedrooms}
                                            onChange={e => handleChange('bedrooms', e.target.value)}
                                            onBlur={() => handleBlur('bedrooms')}
                                            placeholder="—"
                                            min="0"
                                            hasError={!!visibleErrors.bedrooms}
                                        />
                                    </FField>
                                    <FField label="Bathrooms" error={visibleErrors.bathrooms}>
                                        <FInput
                                            type="number"
                                            value={data.bathrooms}
                                            onChange={e => handleChange('bathrooms', e.target.value)}
                                            onBlur={() => handleBlur('bathrooms')}
                                            placeholder="—"
                                            min="0"
                                            hasError={!!visibleErrors.bathrooms}
                                        />
                                    </FField>
                                </div>
                            </div>

                            {/* ── Images ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Photos</SectionLabel>
                                <ImageUpload
                                    images={data.images}
                                    onChange={files => {
                                        handleChange('images', files);
                                        touch('images');
                                    }}
                                    error={visibleErrors.images}
                                />
                            </div>

                            {/* ── Visibility ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Visibility & Trust</SectionLabel>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                                    <Toggle value={data.is_featured} onChange={v => handleChange('is_featured', v)} label="Featured Listing" sub="Shown in featured sections and highlighted in search" />
                                    <Toggle value={data.is_verified} onChange={v => handleChange('is_verified', v)} label="Verified Listing" sub="Shows the verified badge — confirms property details are accurate" />
                                </div>
                            </div>

                            {/* ── Amenities ── */}
                            {AmenityNames.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <SectionLabel>Amenities</SectionLabel>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                        {AmenityNames.map(amenity => {
                                            const selected = data.amenities.includes(amenity);
                                            return (
                                                <button type="button" key={amenity} onClick={() => handleAmenityToggle(amenity)}
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.32rem 0.7rem', borderRadius: '999px', border: `1.5px solid ${selected ? 'hsl(152 55% 50%)' : 'hsl(220 15% 86%)'}`, backgroundColor: selected ? 'hsl(152 55% 94%)' : 'white', color: selected ? 'hsl(152 55% 28%)' : 'hsl(220 15% 42%)', fontSize: '0.76rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                                                    {selected && <Icons.check />}
                                                    {amenity}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(220 15% 55%)' }}>{data.amenities.length} selected</p>
                                </div>
                            )}

                            {/* ── Contact info ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <SectionLabel>Contact Information</SectionLabel>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(220 15% 52%)', lineHeight: 1.55 }}>
                                    Shown to interested tenants and buyers.
                                </p>

                                <FField label="Contact Name" error={visibleErrors.agentName} hint="Agent or landlord name shown on the listing">
                                    <FInput
                                        value={data.agentName}
                                        onChange={e => handleChange('agentName', e.target.value)}
                                        onBlur={() => handleBlur('agentName')}
                                        placeholder="e.g. Kwame Mensah"
                                        hasError={!!visibleErrors.agentName}
                                    />
                                </FField>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                    <FField label="Phone Number" error={visibleErrors.agentPhone}>
                                        <FInput
                                            type="tel"
                                            value={data.agentPhone}
                                            onChange={e => handleChange('agentPhone', e.target.value)}
                                            onBlur={() => handleBlur('agentPhone')}
                                            placeholder="+233 xx xxx xxxx"
                                            hasError={!!visibleErrors.agentPhone}
                                        />
                                    </FField>
                                    <FField label="Email Address" error={visibleErrors.agentEmail}>
                                        <FInput
                                            type="email"
                                            value={data.agentEmail}
                                            onChange={e => handleChange('agentEmail', e.target.value)}
                                            onBlur={() => handleBlur('agentEmail')}
                                            placeholder="contact@agency.com"
                                            hasError={!!visibleErrors.agentEmail}
                                        />
                                    </FField>
                                </div>

                                {(data.agentName || data.agentPhone || data.agentEmail) && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem', borderRadius: '0.65rem', backgroundColor: 'hsl(220 15% 97.5%)', border: '1px solid hsl(220 15% 91%)' }}>
                                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: `hsl(${avatarHue(data.agentName || 'A')} 50% 88%)`, color: `hsl(${avatarHue(data.agentName || 'A')} 50% 28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: '800', flexShrink: 0 }}>
                                            {data.agentName ? data.agentName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : '?'}
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            {data.agentName && <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'hsl(220 25% 14%)', marginBottom: '0.2rem' }}>{data.agentName}</div>}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.12rem' }}>
                                                {data.agentPhone && <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 48%)' }}>📞 {data.agentPhone}</div>}
                                                {data.agentEmail && <div style={{ fontSize: '0.72rem', color: 'hsl(220 15% 48%)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>✉ {data.agentEmail}</div>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Footer ── */}
                        <div style={{ padding: '1rem 1.75rem 1.5rem', borderTop: '1px solid hsl(220 15% 93%)', display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                            <Link href="/super-admin/listings"
                                style={{ flex: 1, padding: '0.65rem', borderRadius: '0.65rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', fontSize: '0.875rem', fontWeight: '600', color: 'hsl(220 25% 30%)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 15% 96%)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                                Cancel
                            </Link>
                            <button type="submit" disabled={processing}
                                style={{ flex: 2, padding: '0.65rem', borderRadius: '0.65rem', border: 'none', backgroundColor: processing ? 'hsl(220 15% 70%)' : 'hsl(220 25% 15%)', color: processing ? 'hsl(220 15% 45%)' : 'white', fontSize: '0.875rem', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'all 0.2s' }}
                                onMouseEnter={e => { if (!processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'; }}
                                onMouseLeave={e => { if (!processing) e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'; }}>
                                {processing ? <><Icons.spinner /> Creating…</> : <><Icons.plus /> Create Listing</>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ═══ RIGHT: sticky preview ════════════════════════════════ */}
                <div style={{ position: 'sticky', top: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'hsl(220 15% 50%)' }}>Live Preview</p>

                    <PreviewCard data={data} />

                    <div style={{ backgroundColor: 'hsl(214 100% 98%)', border: '1px solid hsl(214 80% 90%)', borderRadius: '0.75rem', padding: '1rem' }}>
                        <p style={{ margin: '0 0 0.6rem', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'hsl(214 80% 46%)' }}>Tips</p>
                        {[
                            'Set status to "Pending" if the listing needs agent approval first.',
                            'Verified listings get higher trust scores and better search placement.',
                            'Rentals need both min and max rent for price range display.',
                            'Leave agent unassigned — the agent can claim it later.',
                        ].map((tip, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: i > 0 ? '0.5rem' : 0 }}>
                                <span style={{ color: 'hsl(214 80% 52%)', flexShrink: 0, marginTop: '0.05rem', display: 'flex' }}><Icons.check /></span>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'hsl(214 50% 35%)', lineHeight: 1.5 }}>{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes lcSpin   { to { transform: rotate(360deg); } }
                @keyframes lcFadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
                @keyframes errIn    { from { opacity:0; transform:translateY(-3px); } to { opacity:1; transform:translateY(0); } }
                .img-overlay { opacity: 0 !important; }
                .img-overlay:hover { opacity: 1 !important; }
            `}</style>
        </div>
        </>
    );
};

ListingCreate.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default ListingCreate;