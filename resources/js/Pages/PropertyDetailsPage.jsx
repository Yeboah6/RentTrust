import { useState, useEffect } from "react";
import Header from '../Components/Layouts/Header';
import Footer from '../Components/Layouts/Footer';
import { Link, usePage, useForm } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReportListingDialog from "../Components/Modules/ReportListingDialog";
import ReviewForm from "../Components/Modules/ReviewForm";
import AgentProfileModal from '../Components/Modules/AgentProfileModal';

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = ({ d, size = 20, sw = 1.8, fill = 'none' }) => (
    <svg width={size} height={size} fill={fill} viewBox="0 0 24 24" stroke="currentColor" style={{ flexShrink: 0 }}>
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const IC = {
    pin:     ['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z','M15 11a3 3 0 11-6 0 3 3 0 016 0z'],
    bed:     'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    bath:    'M4 12H20M4 12a8 8 0 0016 0M4 12a8 8 0 0116 0M12 4v8',
    cal:     'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    shield:  'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    alert:   'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    user:    'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    star:    'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    flag:    'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9',
    msg:     'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    check:   'M5 13l4 4L19 7',
    x:       'M6 18L18 6M6 6l12 12',
    arrow:   'M14 5l7 7m0 0l-7 7m7-7H3',
    money:   'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt  = (n) => `GH₵${Number(n || 0).toLocaleString()}`;
const hue  = (s = '') => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

const Stars = ({ rating = 0, size = 14 }) => (
    <div style={{ display: 'flex', gap: 2 }}>
        {[1,2,3,4,5].map(i => (
            <svg key={i} width={size} height={size} viewBox="0 0 24 24"
                fill={i <= Math.floor(rating) ? 'hsl(38 92% 50%)' : 'none'}
                stroke={i <= Math.floor(rating) ? 'hsl(38 92% 50%)' : 'hsl(220 15% 72%)'}
                strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ))}
    </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PropertyDetailsPage({ rental, reviews }) {
    const { auth } = usePage().props;

    const [imgIdx,         setImgIdx]         = useState(0);
    const [showReport,     setShowReport]      = useState(false);
    const [showReview,     setShowReview]      = useState(false);
    const [showAgent,      setShowAgent]       = useState(false);
    const [showInquiry,    setShowInquiry]     = useState(false);
    const [toast,          setToast]           = useState(null);
    const [activeTab,      setActiveTab]       = useState('description');

    const { data: inqData, setData: setInqData, post: postInq, processing: inqLoading, reset: resetInq, errors: inqErrors } = useForm({ type: 'form', message: '' });

    const images   = rental.images ?? [];
    const amenities = typeof rental.amenities === 'string' ? JSON.parse(rental.amenities || '[]') : (rental.amenities ?? []);
    const advance   = rental.advance_duration ?? rental.advance_months ?? 0;
    const agentFee  = (rental.rent_max ?? 0) * ((rental.user?.fee ?? 0) / 100);
    const upfront   = (rental.rent_max ?? 0) * advance;
    const total     = upfront + agentFee;

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const authRedirect = (fn) => {
        if (!auth?.agent && !auth?.super && !auth?.tenant) {
            window.location.href = '/sign-up';
        } else {
            fn();
        }
    };

    useEffect(() => {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (token) {
            fetch(`/api/listings/${rental.id}/track-view`, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': token },
            }).catch(() => {});
        }
    }, [rental.id]);

    const handleInquiry = (e) => {
        e.preventDefault();
        if (!inqData.message.trim()) return;
        postInq(`/api/listings/${rental.id}/track-inquiry`, {
            onSuccess: () => { setShowInquiry(false); resetInq(); showToast('Inquiry sent successfully!'); },
            onError:   () => showToast('Failed to send inquiry.', 'error'),
        });
    };

    const TABS = [
        { key: 'description', label: 'Description' },
        { key: 'amenities',   label: `Amenities (${amenities.length})` },
        { key: 'reviews',     label: `Reviews (${reviews?.length ?? 0})` },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                *, *::before, *::after { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; box-sizing: border-box; margin: 0; padding: 0; }

                @keyframes pdSlideUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes pdFadeIn    { from{opacity:0} to{opacity:1} }
                @keyframes pdSlideIn   { from{transform:translateX(100%)} to{transform:translateX(0)} }
                @keyframes pdModalIn   { from{opacity:0;transform:scale(0.96)translateY(10px)} to{opacity:1;transform:scale(1)translateY(0)} }
                @keyframes pdSpin      { to{transform:rotate(360deg)} }

                .pd-card { background:white; border:1px solid hsl(40 20% 88%); border-radius:1rem; overflow:hidden; }
                .pd-btn-ghost {
                    display:inline-flex; align-items:center; justify-content:center; gap:0.5rem;
                    padding:0.65rem 1.1rem; border-radius:0.625rem; font-size:0.875rem; font-weight:600;
                    cursor:pointer; font-family:inherit; transition:all 0.18s; border:1.5px solid hsl(40 20% 88%);
                    background:white; color:hsl(174 62% 32%);
                }
                .pd-btn-ghost:hover { border-color:hsl(174 62% 32%); background:hsl(174 62% 32% / 0.05); }
                .pd-btn-solid {
                    display:inline-flex; align-items:center; justify-content:center; gap:0.5rem;
                    padding:0.75rem 1.25rem; border-radius:0.625rem; font-size:0.9rem; font-weight:700;
                    cursor:pointer; font-family:inherit; transition:all 0.18s; border:none;
                    background:linear-gradient(135deg,hsl(174 62% 28%),hsl(174 55% 36%)); color:white; width:100%;
                }
                .pd-btn-solid:hover { filter:brightness(1.08); transform:translateY(-1px); }
                .pd-btn-solid:disabled { opacity:0.55; cursor:not-allowed; transform:none; }
                .pd-btn-danger {
                    display:inline-flex; align-items:center; justify-content:center; gap:0.5rem;
                    padding:0.65rem 1.1rem; border-radius:0.625rem; font-size:0.875rem; font-weight:600;
                    cursor:pointer; font-family:inherit; transition:all 0.18s;
                    border:1.5px solid hsl(0 72% 51% / 0.4); background:hsl(0 72% 51% / 0.05); color:hsl(0 65% 44%);
                    width:100%;
                }
                .pd-btn-danger:hover { border-color:hsl(0 72% 51%); background:hsl(0 72% 51% / 0.09); }

                .pd-tab { padding:0.7rem 1rem; font-size:0.85rem; font-weight:600; border:none; background:none; cursor:pointer; font-family:inherit; border-bottom:2px solid transparent; color:hsl(200 15% 52%); transition:all 0.18s; white-space:nowrap; }
                .pd-tab.active { color:hsl(174 62% 28%); border-bottom-color:hsl(174 62% 32%); }
                .pd-tab:hover:not(.active) { color:hsl(200 25% 22%); }

                .pd-pill { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:999px; font-size:0.72rem; font-weight:700; letter-spacing:0.04em; }

                .pd-amenity { padding:5px 12px; border-radius:999px; font-size:0.8rem; background:hsl(174 62% 32% / 0.08); color:hsl(174 62% 22%); border:1px solid hsl(174 62% 32% / 0.18); }

                .pd-review-chip { padding:3px 10px; border-radius:999px; font-size:0.7rem; font-weight:700; background:hsl(152 60% 95%); color:hsl(152 55% 30%); border:1px solid hsl(152 60% 82%); }

                .pd-overlay { position:fixed;inset:0;z-index:60;background:rgba(0,0,0,0.52);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:1rem; }
                .pd-modal   { background:white;border-radius:1.25rem;width:100%;max-width:480px;max-height:88vh;overflow:auto;animation:pdModalIn 0.22s cubic-bezier(0.16,1,0.3,1); }

                .pd-spinner { width:1rem;height:1rem;border:2px solid rgba(255,255,255,0.35);border-top-color:white;border-radius:50%;animation:pdSpin 0.7s linear infinite; }

                .pd-img-btn { position:absolute;top:50%;transform:translateY(-50%);width:2.5rem;height:2.5rem;border-radius:50%;border:none;background:rgba(255,255,255,0.92);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.18);z-index:5;transition:all 0.18s; }
                .pd-img-btn:hover { background:white;transform:translateY(-50%) scale(1.08); }

                @media(max-width:1023px) { .pd-layout { flex-direction:column !important; } .pd-sidebar { width:100% !important; } }
                @media(max-width:640px)  { .pd-hero { height:13rem !important; } }
            `}</style>

            <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'hsl(40 33% 98%)' }}>
                <Header />

                <main style={{ flex: 1 }}>

                    {/* ── HERO IMAGE CAROUSEL ──────────────────────────────── */}
                    <div className="pd-hero" style={{ position: 'relative', height: '22rem', background: 'hsl(174 62% 18%)', overflow: 'hidden' }}>
                        {images.length > 0 ? (
                            <img
                                key={imgIdx}
                                src={`/storage/rental_images/${images[imgIdx]}`}
                                alt={`Property image ${imgIdx + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'pdFadeIn 0.3s ease', objectPosition: 'center' }}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(174 30% 22%)' }}>
                                <Ico d={IC.pin} size={48} sw={1.4} />
                            </div>
                        )}

                        {/* Dark gradient bottom */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, hsl(200 25% 8% / 0.72) 0%, transparent 50%)', pointerEvents: 'none' }} />

                        {/* Carousel nav */}
                        {images.length > 1 && (
                            <>
                                <button className="pd-img-btn" style={{ left: '0.75rem' }} onClick={e => { e.stopPropagation(); setImgIdx(p => p === 0 ? images.length - 1 : p - 1); }}>
                                    <ChevronLeft size={18} color="#374151" />
                                </button>
                                <button className="pd-img-btn" style={{ right: '0.75rem' }} onClick={e => { e.stopPropagation(); setImgIdx(p => p === images.length - 1 ? 0 : p + 1); }}>
                                    <ChevronRight size={18} color="#374151" />
                                </button>
                                {/* Dots */}
                                <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px', zIndex: 5 }}>
                                    {images.map((_, i) => (
                                        <button key={i} onClick={() => setImgIdx(i)}
                                            style={{ width: i === imgIdx ? 22 : 8, height: 8, borderRadius: 999, border: 'none', background: i === imgIdx ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.25s', padding: 0 }} />
                                    ))}
                                </div>
                                {/* Counter */}
                                <div style={{ position: 'absolute', top: '0.875rem', right: '0.875rem', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.72rem', fontWeight: '700', padding: '3px 10px', borderRadius: 6, zIndex: 5 }}>
                                    {imgIdx + 1} / {images.length}
                                </div>
                            </>
                        )}

                        {/* Verified badge */}
                        {rental.is_verified && (
                            <div style={{ position: 'absolute', top: '0.875rem', left: '0.875rem', zIndex: 5 }}>
                                <span className="pd-pill" style={{ background: 'hsl(152 60% 38%)', color: 'white' }}>
                                    <Ico d={IC.shield} size={12} sw={2} /> Verified
                                </span>
                            </div>
                        )}

                        {/* Title overlay */}
                        <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem', zIndex: 5 }}>
                            <h1 style={{ color: 'white', fontSize: 'clamp(1.25rem,4vw,1.75rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.35)' }}>
                                {rental.title || 'Property Listing'}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.82)', fontSize: '0.875rem', marginTop: 4 }}>
                                <Ico d={IC.pin} size={14} sw={2} />
                                {[rental.area, rental.city].filter(Boolean).join(', ')}
                            </div>
                        </div>
                    </div>

                    {/* ── PAGE BODY ─────────────────────────────────────────── */}
                    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(1.25rem,4vw,2rem) clamp(0.75rem,3vw,1.5rem)' }}>
                        <div className="pd-layout" style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start' }}>

                            {/* ═══ MAIN COLUMN ════════════════════════════════ */}
                            <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                                {/* Price + key facts strip */}
                                <div className="pd-card" style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                                        <div>
                                            <div style={{ fontSize: 'clamp(1.5rem,5vw,2rem)', fontWeight: 900, color: 'hsl(174 62% 28%)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                                                {fmt(rental.rent_min)} – {fmt(rental.rent_max)}
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: 'hsl(200 15% 52%)', marginTop: 4, fontWeight: 600 }}>per month</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {rental.purpose && (
                                                <span className="pd-pill" style={{ background: 'hsl(174 62% 32% / 0.1)', color: 'hsl(174 62% 24%)', border: '1px solid hsl(174 62% 32% / 0.2)', textTransform: 'capitalize' }}>
                                                    {rental.purpose}
                                                </span>
                                            )}
                                            {rental.property_type && (
                                                <span className="pd-pill" style={{ background: 'hsl(40 30% 94%)', color: 'hsl(200 25% 28%)', border: '1px solid hsl(40 20% 86%)' }}>
                                                    {rental.property_type}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1.1rem', paddingTop: '1.1rem', borderTop: '1px solid hsl(40 20% 92%)' }}>
                                        {[
                                            { icon: IC.bed,  label: `${rental.bedrooms ?? '—'} Bedrooms` },
                                            { icon: IC.bath, label: `${rental.bathrooms ?? '—'} Bathrooms` },
                                            { icon: IC.cal,  label: `${advance} month${advance !== 1 ? 's' : ''} advance` },
                                        ].map(f => (
                                            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'hsl(200 25% 28%)', fontSize: '0.875rem', fontWeight: 600 }}>
                                                <span style={{ color: 'hsl(174 62% 36%)', display: 'flex' }}><Ico d={f.icon} size={16} sw={2} /></span>
                                                {f.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Warning strip */}
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.875rem 1.1rem', borderRadius: '0.75rem', background: 'hsl(38 92% 50% / 0.1)', border: '1px solid hsl(38 92% 50% / 0.25)' }}>
                                    <span style={{ color: 'hsl(38 75% 38%)', display: 'flex', flexShrink: 0, marginTop: 1 }}><Ico d={IC.alert} size={18} sw={1.8} /></span>
                                    <p style={{ fontSize: '0.8375rem', color: 'hsl(200 25% 20%)', fontWeight: 500, lineHeight: 1.55 }}>
                                        Always inspect the property in person before making any payment. Never pay without seeing it first.
                                    </p>
                                </div>

                                {/* Tab content card */}
                                <div className="pd-card">
                                    {/* Tab bar */}
                                    <div style={{ display: 'flex', borderBottom: '1px solid hsl(40 20% 90%)', padding: '0 0.5rem', overflowX: 'auto' }}>
                                        {TABS.map(t => (
                                            <button key={t.key} className={`pd-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div style={{ padding: '1.5rem' }}>
                                        {/* Description tab */}
                                        {activeTab === 'description' && (
                                            <p style={{ color: 'hsl(200 15% 40%)', lineHeight: 1.75, fontSize: '0.9375rem' }}>
                                                {rental.description || 'No description has been provided for this property.'}
                                            </p>
                                        )}

                                        {/* Amenities tab */}
                                        {activeTab === 'amenities' && (
                                            amenities.length > 0 ? (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    {amenities.map((a, i) => (
                                                        <span key={i} className="pd-amenity">
                                                            ✓ {a}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p style={{ color: 'hsl(200 15% 55%)', fontSize: '0.875rem' }}>No amenities listed for this property.</p>
                                            )
                                        )}

                                        {/* Reviews tab */}
                                        {activeTab === 'reviews' && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                                                {reviews?.length > 0 ? reviews.map((r, i) => {
                                                    const h = hue(r.full_name ?? 'U');
                                                    return (
                                                        <div key={i} style={{ padding: '1rem', borderRadius: '0.75rem', background: 'hsl(40 30% 97%)', border: '1px solid hsl(40 20% 90%)' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                                                    <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: `hsl(${h} 50% 88%)`, color: `hsl(${h} 50% 28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 800, flexShrink: 0 }}>
                                                                        {(r.full_name ?? 'U').charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'hsl(200 25% 18%)' }}>{r.full_name || 'Anonymous'}</div>
                                                                        <div style={{ fontSize: '0.7rem', color: 'hsl(200 15% 55%)' }}>{r.created_at ? new Date(r.created_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</div>
                                                                    </div>
                                                                </div>
                                                                <Stars rating={r.overall_rating} />
                                                            </div>
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.65rem' }}>
                                                                {r.landlord_responsive          === 1 && <span className="pd-review-chip">Responsive Landlord</span>}
                                                                {r.property_matched_description === 1 && <span className="pd-review-chip">Accurate Description</span>}
                                                                {r.fair_pricing                 === 1 && <span className="pd-review-chip">Fair Pricing</span>}
                                                                {r.good_communication           === 1 && <span className="pd-review-chip">Good Communication</span>}
                                                            </div>
                                                            {r.comments && <p style={{ fontSize: '0.8375rem', color: 'hsl(200 15% 42%)', lineHeight: 1.65 }}>{r.comments}</p>}
                                                            {r.response && (
                                                                <div style={{ marginTop: '0.875rem', padding: '0.75rem', background: 'white', borderRadius: '0.5rem', borderLeft: '3px solid hsl(174 62% 36%)' }}>
                                                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'hsl(174 62% 28%)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                                        Response · {r.response_person || 'Agent'}
                                                                    </div>
                                                                    <p style={{ fontSize: '0.8125rem', color: 'hsl(200 15% 44%)', lineHeight: 1.6 }}>{r.response}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }) : (
                                                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                                                        <p style={{ color: 'hsl(200 15% 52%)', fontSize: '0.875rem' }}>No reviews yet. Be the first to review this property.</p>
                                                        <button className="pd-btn-ghost" style={{ marginTop: '1rem' }} onClick={() => authRedirect(() => setShowReview(true))}>
                                                            Write a Review
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ═══ SIDEBAR ════════════════════════════════════ */}
                            <div className="pd-sidebar" style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1.1rem', position: 'sticky', top: '1.25rem' }}>

                                {/* Upfront cost card */}
                                <div className="pd-card">
                                    <div style={{ padding: '1.1rem 1.25rem', borderBottom: '1px solid hsl(40 20% 90%)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ color: 'hsl(174 62% 32%)', display: 'flex' }}><Ico d={IC.money} size={16} sw={1.8} /></span>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'hsl(200 25% 15%)' }}>Upfront Cost Estimate</h3>
                                    </div>
                                    <div style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {[
                                            { label: `${advance} month${advance !== 1 ? 's' : ''} advance`, value: fmt(upfront) },
                                            { label: `Agent fee (${rental.user?.fee ?? 0}%)`, value: fmt(agentFee) },
                                        ].map(row => (
                                            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                                                <span style={{ color: 'hsl(200 15% 52%)' }}>{row.label}</span>
                                                <span style={{ fontWeight: 600, color: 'hsl(200 25% 22%)' }}>{row.value}</span>
                                            </div>
                                        ))}
                                        <div style={{ height: 1, background: 'hsl(40 20% 90%)', margin: '0.25rem 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
                                            <span style={{ fontWeight: 700, color: 'hsl(200 25% 18%)' }}>Estimated Total</span>
                                            <span style={{ fontWeight: 800, color: 'hsl(174 62% 28%)' }}>{fmt(total)}</span>
                                        </div>
                                        <p style={{ fontSize: '0.7rem', color: 'hsl(200 15% 58%)', marginTop: 2 }}>Estimate only. Confirm with the agent.</p>
                                    </div>
                                </div>

                                {/* Primary CTA */}
                                <button className="pd-btn-solid" onClick={() => authRedirect(() => setShowInquiry(true))}>
                                    <Ico d={IC.msg} size={16} sw={2} /> Send Inquiry
                                </button>

                                {/* Agent card */}
                                {rental.user && (
                                    <div className="pd-card">
                                        <div style={{ padding: '1.1rem 1.25rem', borderBottom: '1px solid hsl(40 20% 90%)' }}>
                                            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'hsl(200 25% 15%)' }}>Listed by</h3>
                                        </div>
                                        <div style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: `hsl(${hue(rental.user.name ?? 'A')} 50% 88%)`, color: `hsl(${hue(rental.user.name ?? 'A')} 50% 28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, flexShrink: 0 }}>
                                                    {(rental.user.name ?? 'A').charAt(0).toUpperCase()}
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', fontWeight: 700, color: 'hsl(200 25% 15%)' }}>
                                                        {rental.user.name}
                                                        {rental.user.verification_status === 'verified' && (
                                                            <span style={{ color: 'hsl(152 60% 40%)', display: 'flex', flexShrink: 0 }}><Ico d={IC.shield} size={13} sw={2} /></span>
                                                        )}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'hsl(200 15% 52%)', marginTop: 1 }}>
                                                        {rental.user.company || 'Independent Agent'}
                                                    </div>
                                                </div>
                                            </div>
                                            {rental.user.average_rating > 0 && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Stars rating={rental.user.average_rating} size={13} />
                                                    <span style={{ fontSize: '0.75rem', color: 'hsl(200 15% 52%)' }}>
                                                        {rental.user.average_rating?.toFixed(1)} ({rental.user.total_reviews ?? 0} reviews)
                                                    </span>
                                                </div>
                                            )}
                                            <button className="pd-btn-ghost" style={{ width: '100%' }} onClick={() => setShowAgent(true)}>
                                                View Profile
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Secondary actions */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <button className="pd-btn-ghost" style={{ width: '100%' }} onClick={() => authRedirect(() => setShowReview(true))}>
                                        <Ico d={IC.msg} size={15} sw={2} /> Write a Review
                                    </button>
                                    <button className="pd-btn-danger" onClick={() => authRedirect(() => setShowReport(true))}>
                                        <Ico d={IC.flag} size={15} sw={2} /> Report Listing
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />

                {/* ── MODALS ───────────────────────────────────────────────── */}

                {/* Agent profile */}
                <AgentProfileModal agent={rental.user} rentalId={rental.id} isOpen={showAgent} onClose={() => setShowAgent(false)} auth={auth} />

                {/* Report */}
                {showReport && (
                    <div className="pd-overlay" onClick={() => setShowReport(false)}>
                        <div className="pd-modal" onClick={e => e.stopPropagation()}>
                            <ReportListingDialog setShowAddListingModal={setShowReport} rental={rental} auth={auth} />
                        </div>
                    </div>
                )}

                {/* Review */}
                {showReview && (
                    <div className="pd-overlay" onClick={() => setShowReview(false)}>
                        <div className="pd-modal" onClick={e => e.stopPropagation()}>
                            <ReviewForm setShowAddReviewForm={setShowReview} rental={rental} auth={auth} />
                        </div>
                    </div>
                )}

                {/* Inquiry */}
                {showInquiry && (
                    <div className="pd-overlay" onClick={() => setShowInquiry(false)}>
                        <div className="pd-modal" onClick={e => e.stopPropagation()}>
                            <div style={{ padding: '1.75rem' }}>
                                {/* Modal header */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'hsl(200 25% 14%)' }}>Send an Inquiry</h2>
                                        <p style={{ fontSize: '0.8rem', color: 'hsl(200 15% 52%)', marginTop: 2 }}>
                                            Your message will be sent to the listing agent.
                                        </p>
                                    </div>
                                    <button onClick={() => setShowInquiry(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(200 15% 52%)', display: 'flex', padding: 4 }}>
                                        <Ico d={IC.x} size={18} sw={2} />
                                    </button>
                                </div>

                                {/* Listing reference */}
                                <div style={{ padding: '0.75rem', borderRadius: '0.625rem', background: 'hsl(174 62% 32% / 0.06)', border: '1px solid hsl(174 62% 32% / 0.18)', marginBottom: '1.1rem' }}>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'hsl(174 62% 28%)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Regarding</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'hsl(200 25% 18%)' }}>{rental.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'hsl(200 15% 52%)', marginTop: 2 }}>{[rental.area, rental.city].filter(Boolean).join(', ')}</div>
                                </div>

                                <form onSubmit={handleInquiry}>
                                    <textarea
                                        value={inqData.message}
                                        onChange={e => setInqData('message', e.target.value)}
                                        placeholder="Hi, I'm interested in this property. Could you provide more details about availability and viewing times?"
                                        rows={5}
                                        style={{ width: '100%', padding: '0.75rem', border: '1.5px solid hsl(40 20% 86%)', borderRadius: '0.625rem', resize: 'vertical', fontSize: '0.875rem', color: 'hsl(200 25% 18%)', outline: 'none', fontFamily: 'inherit', lineHeight: 1.6, transition: 'border-color 0.15s' }}
                                        onFocus={e => e.target.style.borderColor = 'hsl(174 62% 32%)'}
                                        onBlur={e => e.target.style.borderColor = 'hsl(40 20% 86%)'}
                                    />
                                    {inqErrors.message && <p style={{ color: 'hsl(0 65% 50%)', fontSize: '0.75rem', marginTop: 4 }}>{inqErrors.message}</p>}

                                    <div style={{ display: 'flex', gap: '0.625rem', marginTop: '1rem' }}>
                                        <button type="button" onClick={() => setShowInquiry(false)}
                                            style={{ flex: 1, padding: '0.7rem', borderRadius: '0.625rem', border: '1.5px solid hsl(40 20% 86%)', background: 'white', color: 'hsl(200 25% 35%)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit' }}>
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={inqLoading || !inqData.message.trim()}
                                            className="pd-btn-solid" style={{ flex: 2 }}>
                                            {inqLoading ? <><span className="pd-spinner" /> Sending…</> : <><Ico d={IC.arrow} size={14} sw={2.2} /> Send Inquiry</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toast */}
                {toast && (
                    <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 100, padding: '0.875rem 1.25rem', borderRadius: '0.75rem', background: toast.type === 'error' ? 'hsl(0 65% 50%)' : 'hsl(152 55% 37%)', color: 'white', fontWeight: 600, fontSize: '0.875rem', boxShadow: '0 8px 28px hsl(220 25% 8% / 0.22)', animation: 'pdSlideIn 0.25s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Ico d={toast.type === 'error' ? IC.x : IC.check} size={16} sw={2.2} />
                        {toast.msg}
                    </div>
                )}
            </div>
        </>
    );
}