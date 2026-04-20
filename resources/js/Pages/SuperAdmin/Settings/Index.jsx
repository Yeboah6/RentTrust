import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ── Icons ─────────────────────────────────────────────────────────────────────

const SaveIcon = () => (
    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 3H5a2 2 0 00-2 2v4l2 2 2-2V5h2V3zM17 3l4 4-4 4V7h-2a4 4 0 00-4 4v1" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 7h4M7 5v4" />
    </svg>
);

const CheckIcon = () => (
    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
);

const GlobeIcon = () => (
    <svg style={{ width: '1.1rem', height: '1.1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CurrencyIcon = () => (
    <svg style={{ width: '1.1rem', height: '1.1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const MailIcon = () => (
    <svg style={{ width: '1.1rem', height: '1.1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const ListingIcon = () => (
    <svg style={{ width: '1.1rem', height: '1.1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const ShieldIcon = () => (
    <svg style={{ width: '1.1rem', height: '1.1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const BellIcon = () => (
    <svg style={{ width: '1.1rem', height: '1.1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

// ── Section config ─────────────────────────────────────────────────────────────

const SECTIONS = [
    { key: 'general',       label: 'General',       Icon: GlobeIcon,    color: 'hsl(214 80% 48%)', bg: 'hsl(214 100% 95%)' },
    { key: 'billing',       label: 'Billing',       Icon: CurrencyIcon, color: 'hsl(152 60% 35%)', bg: 'hsl(152 60% 93%)' },
    { key: 'email',         label: 'Email',         Icon: MailIcon,     color: 'hsl(40 80% 40%)',  bg: 'hsl(40 90% 93%)'  },
    { key: 'listings',      label: 'Listings',      Icon: ListingIcon,  color: 'hsl(270 60% 48%)', bg: 'hsl(270 60% 95%)' },
    { key: 'security',      label: 'Security',      Icon: ShieldIcon,   color: 'hsl(340 70% 48%)', bg: 'hsl(340 70% 94%)' },
    { key: 'notifications', label: 'Notifications', Icon: BellIcon,     color: 'hsl(200 65% 38%)', bg: 'hsl(200 70% 93%)' },
];

const SECTION_GROUPINGS = {
    general: ['platform_name', 'support_email', 'support_phone', 'default_currency', 'default_language'],
    listings: ['guest_inquiry_enabled', 'listing_approval_required', 'maintenance_mode'],
};

// ── Field components ──────────────────────────────────────────────────────────

const fieldStyle = {
    width: '100%', padding: '0.55rem 0.8rem',
    border: '1px solid hsl(220 15% 88%)', borderRadius: '0.5rem',
    fontSize: '0.85rem', color: 'hsl(220 25% 20%)',
    backgroundColor: 'white', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
};

const FieldRow = ({ label, hint, children }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.5rem', alignItems: 'start', padding: '1rem 0', borderBottom: '1px solid hsl(220 15% 95%)' }}>
        <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'hsl(220 25% 20%)', marginBottom: '0.2rem' }}>{label}</div>
            {hint && <div style={{ fontSize: '0.75rem', color: 'hsl(220 15% 55%)', lineHeight: 1.4 }}>{hint}</div>}
        </div>
        <div>{children}</div>
    </div>
);

const TextField = ({ value, onChange, placeholder, type = 'text' }) => {
    const [focused, setFocused] = useState(false);
    return (
        <input
            type={type}
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ ...fieldStyle, borderColor: focused ? 'hsl(214 80% 55%)' : 'hsl(220 15% 88%)', boxShadow: focused ? '0 0 0 3px hsl(214 80% 55% / 0.12)' : 'none' }}
        />
    );
};

const TextareaField = ({ value, onChange, placeholder, rows = 3 }) => {
    const [focused, setFocused] = useState(false);
    return (
        <textarea
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ ...fieldStyle, resize: 'vertical', borderColor: focused ? 'hsl(214 80% 55%)' : 'hsl(220 15% 88%)', boxShadow: focused ? '0 0 0 3px hsl(214 80% 55% / 0.12)' : 'none' }}
        />
    );
};

const SelectField = ({ value, onChange, options }) => {
    const [focused, setFocused] = useState(false);
    return (
        <select
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ ...fieldStyle, cursor: 'pointer', borderColor: focused ? 'hsl(214 80% 55%)' : 'hsl(220 15% 88%)', boxShadow: focused ? '0 0 0 3px hsl(214 80% 55% / 0.12)' : 'none' }}
        >
            {options.map(o => (
                <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
            ))}
        </select>
    );
};

const Toggle = ({ checked, onChange, label, description }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
            {label && <div style={{ fontSize: '0.85rem', fontWeight: '500', color: 'hsl(220 25% 20%)' }}>{label}</div>}
            {description && <div style={{ fontSize: '0.75rem', color: 'hsl(220 15% 55%)', marginTop: '0.1rem' }}>{description}</div>}
        </div>
        <button
            onClick={() => onChange(!checked)}
            style={{
                width: '2.75rem', height: '1.5rem', borderRadius: '999px', border: 'none',
                cursor: 'pointer', flexShrink: 0, position: 'relative',
                backgroundColor: checked ? 'hsl(152 60% 38%)' : 'hsl(220 15% 80%)',
                transition: 'background-color 0.2s',
            }}
        >
            <span style={{
                position: 'absolute', top: '0.15rem',
                left: checked ? 'calc(100% - 1.2rem)' : '0.15rem',
                width: '1.2rem', height: '1.2rem', borderRadius: '50%',
                backgroundColor: 'white', transition: 'left 0.2s',
                boxShadow: '0 1px 3px hsl(220 25% 15% / 0.25)',
            }} />
        </button>
    </div>
);

// Infer the best field type from a key name
const inferFieldType = (key) => {
    const k = key.toLowerCase();
    if (k.includes('email')) return 'email';
    if (k.includes('url') || k.includes('link') || k.includes('webhook')) return 'url';
    if (k.includes('phone')) return 'tel';
    if (k.includes('port')) return 'number';
    if (typeof false === typeof key) return 'toggle'; // placeholder
    return 'text';
};

// ── Generic setting renderer ──────────────────────────────────────────────────

const SettingField = ({ settingKey, value, onChange }) => {
    const label = settingKey
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());

    if (typeof value === 'boolean') {
        return (
            <FieldRow label={label}>
                <Toggle checked={value} onChange={onChange} />
            </FieldRow>
        );
    }

    if (typeof value === 'number') {
        return (
            <FieldRow label={label}>
                <TextField value={String(value)} onChange={v => onChange(Number(v))} type="number" />
            </FieldRow>
        );
    }

    if (typeof value === 'string' && value.length > 80) {
        return (
            <FieldRow label={label}>
                <TextareaField value={value} onChange={onChange} />
            </FieldRow>
        );
    }

    const type = inferFieldType(settingKey);
    return (
        <FieldRow label={label}>
            <TextField value={value} onChange={onChange} type={type} />
        </FieldRow>
    );
};

// ── Section panel ─────────────────────────────────────────────────────────────

const SectionPanel = ({ section, data, onChange, onSave, saving, saved }) => {
    const { label, Icon, color, bg } = section;
    const keys = Object.keys(data ?? {});

    return (
        <div style={{
            backgroundColor: 'white', border: '1px solid hsl(220 15% 91%)',
            borderRadius: '0.875rem', overflow: 'hidden',
            boxShadow: '0 1px 3px hsl(220 20% 15% / 0.05)',
        }}>
            {/* Section header */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid hsl(220 15% 93%)',
                backgroundColor: 'hsl(220 15% 98.5%)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '2.1rem', height: '2.1rem', borderRadius: '0.6rem', backgroundColor: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'hsl(220 25% 15%)', margin: 0 }}>
                            {label} Settings
                        </h2>
                        <p style={{ fontSize: '0.72rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                            {keys.length} configuration{keys.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onSave}
                    disabled={saving}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                        fontSize: '0.78rem', fontWeight: '600',
                        backgroundColor: saved ? 'hsl(152 60% 38%)' : color,
                        color: 'white', transition: 'all 0.2s', opacity: saving ? 0.7 : 1,
                    }}
                >
                    {saved ? <><CheckIcon /> Saved</> : saving ? 'Saving…' : <><SaveIcon /> Save</>}
                </button>
            </div>

            {/* Fields */}
            <div style={{ padding: '0 1.5rem' }}>
                {keys.length === 0 ? (
                    <p style={{ padding: '1.5rem 0', color: 'hsl(220 15% 55%)', fontSize: '0.85rem' }}>No settings in this section.</p>
                ) : (
                    keys.map(key => (
                        <SettingField
                            key={key}
                            settingKey={key}
                            value={data[key]}
                            onChange={val => onChange(key, val)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

// ── Main ──────────────────────────────────────────────────────────────────────

const SettingsIndex = ({ settings = {} }) => {
    // Build initial state: group by known sections, rest goes to 'general'
    const sectionKeys = SECTIONS.map(s => s.key);

    const initialData = () => {
        // If settings is already grouped by section keys, use as-is
        const isGrouped = sectionKeys.some(k => settings[k] !== undefined && typeof settings[k] === 'object');
        if (isGrouped) return { ...settings };

        // Otherwise group settings by their defined sections
        const grouped = {};
        sectionKeys.forEach(section => {
            grouped[section] = {};
        });

        Object.entries(settings).forEach(([key, value]) => {
            let assigned = false;
            for (const [section, keys] of Object.entries(SECTION_GROUPINGS)) {
                if (keys.includes(key)) {
                    grouped[section][key] = value;
                    assigned = true;
                    break;
                }
            }
            if (!assigned) {
                grouped.general[key] = value;
            }
        });

        return grouped;
    };

    const [data, setData] = useState(initialData);
    const [saving, setSaving] = useState({});
    const [saved, setSaved]   = useState({});

    const handleChange = (section, key, value) => {
        setData(prev => ({
            ...prev,
            [section]: { ...(prev[section] ?? {}), [key]: value },
        }));
        setSaved(prev => ({ ...prev, [section]: false }));
    };

    const handleSave = async (sectionKey) => {
        setSaving(prev => ({ ...prev, [sectionKey]: true }));
        try {
            await router.post('/super-admin/settings', {
                ...data[sectionKey],
                _method: 'POST',
            });
            setSaved(prev => ({ ...prev, [sectionKey]: true }));
            setTimeout(() => setSaved(prev => ({ ...prev, [sectionKey]: false })), 2500);
        } catch (error) {
            console.error('Settings save failed', error);
        } finally {
            setSaving(prev => ({ ...prev, [sectionKey]: false }));
        }
    };

    // Determine which sections have data
    const activeSections = SECTIONS.filter(s => data[s.key] && Object.keys(data[s.key]).length > 0);
    // Also show 'general' as fallback if nothing is grouped
    const displaySections = activeSections.length > 0 ? activeSections : [SECTIONS[0]];

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '1.75rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'hsl(220 25% 15%)', margin: '0 0 0.2rem' }}>
                    Platform Settings
                </h1>
                <p style={{ fontSize: '0.875rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                    {displaySections.length} section{displaySections.length !== 1 ? 's' : ''} &middot; changes are saved per section
                </p>
            </div>

            {/* Section nav pills (if multiple sections) */}
            {displaySections.length > 1 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {displaySections.map(({ key, label, Icon, color, bg }) => (
                        <a
                            key={key}
                            href={`#settings-${key}`}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.4rem 0.9rem', borderRadius: '999px', textDecoration: 'none',
                                fontSize: '0.78rem', fontWeight: '600',
                                backgroundColor: bg, color,
                                border: `1px solid ${color}33`,
                            }}
                        >
                            <Icon />
                            {label}
                        </a>
                    ))}
                </div>
            )}

            {/* Panels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {displaySections.map(section => (
                    <div key={section.key} id={`settings-${section.key}`}>
                        <SectionPanel
                            section={section}
                            data={data[section.key] ?? {}}
                            onChange={(key, val) => handleChange(section.key, key, val)}
                            onSave={() => handleSave(section.key)}
                            saving={!!saving[section.key]}
                            saved={!!saved[section.key]}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

SettingsIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default SettingsIndex;