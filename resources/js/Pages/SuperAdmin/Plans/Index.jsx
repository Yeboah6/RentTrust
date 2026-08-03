import React, { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import CreatePlan from './CreatePlan';
import PlanEdit from './PlanEdit';

const CheckIcon = () => (
    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
);

const EditIcon = () => (
    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const TrashIcon = () => (
    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const PlusIcon = () => (
    <svg style={{ width: '1.125rem', height: '1.125rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const UsersIcon = () => (
    <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

// Colour palette cycling for plan accents
const planPalette = [
    { accent: 'hsl(214 80% 50%)', accentBg: 'hsl(214 100% 96%)', accentMuted: 'hsl(214 60% 70%)' },
    { accent: 'hsl(152 60% 38%)', accentBg: 'hsl(152 60% 94%)', accentMuted: 'hsl(152 45% 60%)' },
    { accent: 'hsl(40 85% 45%)',  accentBg: 'hsl(40 90% 94%)',  accentMuted: 'hsl(40 70% 62%)' },
    { accent: 'hsl(270 60% 52%)', accentBg: 'hsl(270 60% 96%)', accentMuted: 'hsl(270 45% 68%)' },
    { accent: 'hsl(340 70% 50%)', accentBg: 'hsl(340 70% 95%)', accentMuted: 'hsl(340 55% 65%)' },
    { accent: 'hsl(200 70% 42%)', accentBg: 'hsl(200 70% 94%)', accentMuted: 'hsl(200 55% 62%)' },
];

const StatusBadge = ({ active }) => (
    <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        fontSize: '0.7rem',
        fontWeight: '600',
        letterSpacing: '0.06em',
        padding: '0.2rem 0.6rem',
        borderRadius: '999px',
        backgroundColor: active ? 'hsl(152 60% 93%)' : 'hsl(0 0% 93%)',
        color: active ? 'hsl(152 60% 32%)' : 'hsl(0 0% 45%)',
    }}>
        <span style={{
            width: '0.4rem', height: '0.4rem', borderRadius: '50%',
            backgroundColor: active ? 'hsl(152 60% 38%)' : 'hsl(0 0% 60%)',
            display: 'inline-block',
        }} />
        {active ? 'ACTIVE' : 'INACTIVE'}
    </span>
);

const PlanCard = ({ plan, palette, index, onEditClick }) => {
    const [hovered, setHovered] = useState(false);
    const features = Array.isArray(plan.features) ? plan.features : [];

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                backgroundColor: 'white',
                border: `1px solid ${hovered ? palette.accentMuted : 'hsl(220 15% 90%)'}`,
                borderRadius: '1rem',
                overflow: 'hidden',
                transition: 'all 0.25s ease',
                transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: hovered
                    ? `0 16px 32px hsl(200 25% 15% / 0.1), 0 0 0 1px ${palette.accentMuted}`
                    : '0 1px 4px hsl(200 20% 15% / 0.06)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Accent bar */}
            <div style={{ height: '4px', backgroundColor: palette.accent }} />

            {/* Header */}
            <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid hsl(220 15% 95%)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                            <span style={{
                                fontSize: '0.625rem', fontWeight: '700', letterSpacing: '0.1em',
                                color: palette.accent, backgroundColor: palette.accentBg,
                                padding: '0.15rem 0.5rem', borderRadius: '0.25rem',
                            }}>
                                PLAN #{index + 1}
                            </span>
                            <StatusBadge active={plan.is_active ?? true} />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'hsl(220 25% 15%)', margin: 0 }}>
                            {plan.name}
                        </h2>
                        {plan.description && (
                            <p style={{ fontSize: '0.8rem', color: 'hsl(220 15% 50%)', marginTop: '0.3rem', marginBottom: 0 }}>
                                {plan.description}
                            </p>
                        )}
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: palette.accent, lineHeight: 1 }}>
                            {plan.price}
                        </div>
                        {plan.listing_limit && (
                            <div style={{ fontSize: '0.7rem', color: 'hsl(220 15% 55%)', marginTop: '0.25rem' }}>
                                / {plan.listing_limit} listings
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div style={{
                display: 'flex', gap: 0,
                borderBottom: features.length ? '1px solid hsl(220 15% 95%)' : 'none',
            }}>
                {[
                    { label: 'Listings', value: plan.listing_limit ?? '∞', icon: <UsersIcon /> },
                    { label: 'Rental Listings', value: plan.rental_limit ?? '∞' },
                    { label: 'Sale Listings', value: plan.sale_limit ?? '∞' },
                ].map((stat, i, arr) => (
                    <div key={i} style={{
                        flex: 1, padding: '0.9rem 1rem', textAlign: 'center',
                        borderRight: i < arr.length - 1 ? '1px solid hsl(220 15% 95%)' : 'none',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: 'hsl(220 25% 20%)', fontWeight: '700', fontSize: '1rem' }}>
                            {stat.icon}
                            {stat.value}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'hsl(220 15% 55%)', marginTop: '0.2rem', letterSpacing: '0.04em' }}>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Features */}
            {features.length > 0 && (
                <div style={{ padding: '1rem 1.5rem', flex: 1 }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {features.map((feature, fi) => (
                            <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'hsl(220 15% 35%)' }}>
                                <span style={{ color: palette.accent, flexShrink: 0 }}><CheckIcon /></span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Actions */}
            <div style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid hsl(220 15% 95%)',
                display: 'flex',
                gap: '0.5rem',
                marginTop: 'auto',
            }}>
                <button
                    onClick={() => onEditClick?.(plan)}
                    style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: '600',
                        backgroundColor: palette.accentBg, color: palette.accent,
                        border: 'none', cursor: 'pointer', transition: 'filter 0.15s', fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.93)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                >
                    <EditIcon /> Edit
                </button>
                <Link
                    href={`/super-admin/plans/${plan.id}`}
                    method="delete"
                    as="button"
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: '600',
                        backgroundColor: 'hsl(0 70% 96%)', color: 'hsl(0 70% 50%)',
                        border: 'none', cursor: 'pointer', transition: 'filter 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.93)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                >
                    <TrashIcon />
                </Link>
            </div>
        </div>
    );
};

const PlansIndex = ({ plans = [] }) => {
    const [showCreate, setShowCreate] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    return (
        <>
        <Head>
            <title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
        </Head>
        <div>
            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'hsl(220 25% 15%)', margin: '0 0 0.2rem' }}>
                        Plans
                    </h1>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                        {plans.length} plan{plans.length !== 1 ? 's' : ''} configured
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowCreate(true)}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.6rem 1.25rem', borderRadius: '0.6rem',
                        backgroundColor: 'hsl(220 25% 15%)', color: 'white',
                        fontWeight: '600', fontSize: '0.875rem', textDecoration: 'none',
                        transition: 'background-color 0.15s',
                        border: 'none', cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 22%)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'hsl(220 25% 15%)'}
                >
                    <PlusIcon /> New Plan
                </button>
            </div>

        {/* Cards grid */}
        {plans.length === 0 ? (
            <div style={{
                textAlign: 'center', padding: '4rem 2rem',
                backgroundColor: 'white', borderRadius: '1rem',
                border: '1px dashed hsl(220 15% 85%)',
                color: 'hsl(220 15% 55%)', fontSize: '0.9rem',
            }}>
                No plans yet. Create your first plan to get started.
            </div>
        ) : (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.25rem',
            }}>
                {plans.map((plan, i) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        palette={planPalette[i % planPalette.length]}
                        index={i}
                        onEditClick={setEditingPlan}
                    />
                ))}
            </div>
        )}

        {/* Create modal */}
        {showCreate && (
            <div
                style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'hsl(222 28% 8% / 0.6)', backdropFilter: 'blur(5px)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    overflow: 'auto',
                }}
                onClick={() => setShowCreate(false)}
            >
                <div
                    style={{ width: '90%', maxWidth: '900px', maxHeight: '90vh', overflow: 'auto', margin: '1rem auto' }}
                    onClick={e => e.stopPropagation()}
                >
                    <CreatePlan inline onClose={() => setShowCreate(false)} />
                </div>
            </div>
        )}

        {/* Edit modal */}
        {editingPlan && (
            <div
                style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'hsl(222 28% 8% / 0.6)', backdropFilter: 'blur(5px)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    overflow: 'auto',
                }}
                onClick={() => setEditingPlan(null)}
            >
                <div
                    style={{ width: '90%', maxWidth: '1000px', maxHeight: '90vh', overflow: 'auto', margin: '1rem auto' }}
                    onClick={e => e.stopPropagation()}
                >
                    <PlanEdit plan={editingPlan} inline onClose={() => setEditingPlan(null)} />
                </div>
            </div>
        )}
    </div>
    </>
    );
};

PlansIndex.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default PlansIndex;