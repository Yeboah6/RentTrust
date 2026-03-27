import { Link } from '@inertiajs/react';
import Header from '../Components/Layouts/Header';
import Footer from '../Components/Layouts/Footer';

export default function AboutPage() {

    const values = [
        {
            icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: 'Transparency First',
            body: 'We show real prices and honest tenant reviews. No hidden fees, no inflated listings. What you see is what you get.',
        },
        {
            icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            title: 'Verified Listings',
            body: 'Every listing goes through our verification process. We confirm properties exist before they go live on the platform.',
        },
        {
            icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: 'Community Driven',
            body: 'Tenants leave reviews. Landlords respond. Agents build reputations. Trust is earned publicly, not promised privately.',
        },
        {
            icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            title: 'People Over Profit',
            body: "We're building for everyday Ghanaians. Affordable to list, free to browse, and always on the side of the tenant.",
        },
    ];

    const stats = [
        { value: '10,000+', label: 'Properties Listed',   sub: 'Across Ghana' },
        { value: '200+',    label: 'Verified Agents',     sub: 'And growing' },
        { value: '50+',     label: 'Areas Covered',       sub: 'Nationwide' },
        { value: '4.8★',    label: 'Platform Rating',     sub: 'From our users' },
    ];

    const team = [
        { initials: 'KM', name: 'Kwame Mensah',   role: 'Co-Founder & CEO',     hue: 174, bio: 'Former real estate broker who spent years watching tenants get scammed. Built RentTrust to fix that.' },
        { initials: 'AA', name: 'Abena Asante',   role: 'Co-Founder & CTO',     hue: 220, bio: 'Software engineer passionate about using tech to solve housing problems across West Africa.' },
        { initials: 'EO', name: 'Emeka Okonkwo', role: 'Head of Verification',  hue: 38,  bio: 'Runs the team that physically inspects and verifies every property before it goes live.' },
        { initials: 'AF', name: 'Ama Frimpong',  role: 'Community Manager',     hue: 152, bio: 'Ensures tenants and landlords have a voice. Manages reviews, disputes, and agent accountability.' },
    ];

    const milestones = [
        { year: '2023', label: 'Founded',  detail: 'RentTrust was born in Accra after our founders experienced firsthand how broken the rental market was for everyday Ghanaians.' },
        { year: '2024', label: 'Launched', detail: 'Public launch with 500 verified listings across Accra and Tema. Our first 1,000 tenants joined within the first month.' },
        { year: '2025', label: 'Expanded', detail: 'Grew to Kumasi, Takoradi, and Tamale. Crossed 5,000 active listings and onboarded 100 verified agents.' },
        { year: '2026', label: 'Today',    detail: 'Over 10,000 properties listed nationwide. Building better tools to make renting and selling property fair for all.' },
    ];

    const promises = [
        { icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, title: 'No fake listings',     body: 'Every property confirmed before going live.' },
        { icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>, title: 'Real reviews only',    body: 'Reviews from verified tenants who actually stayed.' },
        { icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, title: 'Accurate locations',   body: 'Properties mapped to their real address.' },
        { icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'No hidden charges',   body: 'Always free to browse and enquire.' },
        { icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, title: 'Fair market prices',  body: 'We publish real data so you know a fair price.' },
        { icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M5 13l4 4L19 7" /></svg>, title: 'Accountable agents',  body: 'Agent profiles show ratings and response times.' },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

                *, *::before, *::after {
                    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                    box-sizing: border-box;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50%      { opacity: 0.5; }
                }

                .about-hero   { animation: fadeIn 0.6s ease both; }
                .about-main   { animation: fadeUp 0.6s ease 0.1s both; }
                .about-side   { animation: fadeUp 0.6s ease 0.2s both; }

                .value-card {
                    background: white;
                    border: 1px solid hsl(40 20% 88%);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
                }
                .value-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 40px hsl(200 25% 15% / 0.09);
                    border-color: hsl(174 62% 32% / 0.3);
                }

                .team-card {
                    background: white;
                    border: 1px solid hsl(40 20% 88%);
                    border-radius: 1.25rem;
                    padding: 1.75rem 1.5rem;
                    text-align: center;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .team-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 36px hsl(200 25% 15% / 0.08);
                }

                .promise-item {
                    display: flex;
                    gap: 0.875rem;
                    align-items: flex-start;
                    padding: 1rem 1.1rem;
                    background: white;
                    border: 1px solid hsl(40 20% 88%);
                    border-radius: 0.875rem;
                    transition: border-color 0.2s;
                }
                .promise-item:hover {
                    border-color: hsl(174 62% 32% / 0.3);
                }

                .stat-box {
                    text-align: center;
                    padding: 1.25rem 1rem;
                    background: white;
                    border: 1px solid hsl(40 20% 88%);
                    border-radius: 0.875rem;
                    transition: transform 0.2s;
                }
                .stat-box:hover { transform: translateY(-3px); }

                .timeline-dot {
                    width: 13px;
                    height: 13px;
                    border-radius: 50%;
                    background: hsl(174 62% 38%);
                    border: 3px solid white;
                    box-shadow: 0 0 0 3px hsl(174 62% 38% / 0.35);
                    flex-shrink: 0;
                    margin-top: 4px;
                }

                .faq-item {
                    border-bottom: 1px solid hsl(40 20% 88%);
                    padding: 1rem 0;
                }
                .faq-item:last-child { border-bottom: none; }

                @media (max-width: 768px) {
                    .about-grid   { flex-direction: column !important; }
                    .mosaic-right { display: none !important; }
                    .hero-content { max-width: 100% !important; }
                    .cols-2       { grid-template-columns: 1fr !important; }
                    .cols-4       { grid-template-columns: repeat(2, 1fr) !important; }
                }
            `}</style>

            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
                <Header />

                <main style={{ flex: 1 }}>

                    {/* ══ HERO ══════════════════════════════════════════════════════ */}
                    <div className="about-hero" style={{ position: 'relative', overflow: 'hidden', minHeight: 360, display: 'flex', alignItems: 'center' }}>

                        {/* Base */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, hsl(174 62% 22%) 0%, hsl(174 55% 32%) 60%, hsl(174 45% 38%) 100%)', zIndex: 0 }} />

                        {/* Mosaic — right 56% */}
                        <div className="mosaic-right" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '56%', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(3,1fr)', gap: 4 }}>
                            <div style={{ gridRow: '1/3', background: 'hsl(174 25% 22%)', overflow: 'hidden' }}>
                                <img src="/images/download 2.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                            </div>
                            <div style={{ background: 'hsl(200 30% 18%)', overflow: 'hidden' }}>
                                <img src="/images/download 1.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                            </div>
                            <div style={{ background: 'hsl(174 35% 16%)', overflow: 'hidden' }}>
                                <img src="/images/download 2.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                            </div>
                            <div style={{ gridColumn: '2/4', background: 'hsl(30 25% 18%)', overflow: 'hidden' }}>
                                <img src="/images/download 1.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                            </div>
                            <div style={{ background: 'hsl(220 30% 16%)', overflow: 'hidden' }}>
                                <img src="/images/download 3.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                            </div>
                            <div style={{ background: 'hsl(174 20% 14%)', overflow: 'hidden' }}>
                                <img src="/images/download 5.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                            </div>
                            <div style={{ background: 'hsl(15 25% 16%)', overflow: 'hidden' }}>
                                <img src="/images/download 4.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                            </div>
                        </div>

                        {/* Dot grid */}
                        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.06, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                        {/* Glow */}
                        <div style={{ position: 'absolute', right: '-4rem', top: '-4rem', width: '20rem', height: '20rem', borderRadius: '50%', background: 'radial-gradient(circle, hsl(174 62% 50% / 0.2) 0%, transparent 70%)', zIndex: 2, pointerEvents: 'none' }} />
                        {/* Fade */}
                        <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to right, hsl(174 60% 22% / 0.98) 0%, hsl(174 58% 22% / 0.88) 38%, hsl(174 55% 22% / 0.45) 70%, hsl(174 55% 22% / 0.15) 100%)' }} />

                        {/* Content */}
                        <div className="hero-content" style={{ position: 'relative', zIndex: 3, padding: 'clamp(2.5rem,7vw,4.5rem) clamp(1rem,4vw,2.5rem)', maxWidth: 560 }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600, marginBottom: '1.25rem' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'hsl(152 70% 60%)', animation: 'pulse 2s ease infinite', flexShrink: 0 }} />
                                Our mission &amp; story
                            </div>
                            <h1 style={{ color: 'white', fontSize: 'clamp(2rem,5vw,3.25rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                                Renting in Ghana<br />
                                <span style={{ color: 'hsl(40 90% 70%)' }}>should be safer.</span>
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(0.9rem,2.2vw,1.1rem)', lineHeight: 1.6, maxWidth: 420 }}>
                                RentTrust was built to end rental scams, inflated prices, and unverified listings. We're always on the side of tenants.
                            </p>
                        </div>
                    </div>

                    {/* ══ MAIN CONTENT ══════════════════════════════════════════════ */}
                    <div className="container mx-auto" style={{ maxWidth: 1080, padding: 'clamp(2rem,6vw,4rem) clamp(0.75rem,3vw,1rem)' }}>
                        <div className="about-grid" style={{ display: 'flex', gap: 'clamp(1.5rem,4vw,3rem)', alignItems: 'flex-start' }}>

                            {/* ── LEFT COLUMN ── */}
                            <div className="about-main" style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                                {/* Mission card */}
                                <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', border: '1px solid hsl(40 20% 88%)', padding: 'clamp(1.5rem,4vw,2.5rem)', boxShadow: '0 4px 32px hsl(200 25% 15% / 0.07)' }}>
                                    <h2 style={{ fontSize: 'clamp(1.25rem,3vw,1.5rem)', fontWeight: 700, color: 'hsl(200 25% 15%)', marginBottom: '0.375rem' }}>
                                        Who we are
                                    </h2>
                                    <p style={{ color: 'hsl(200 15% 50%)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                        A small team with a big mission.
                                    </p>
                                    <p style={{ color: 'hsl(200 15% 38%)', lineHeight: 1.75, fontSize: '0.9375rem', marginBottom: '1rem' }}>
                                        Too many Ghanaians have lost their savings to rental fraud. Fake listings, ghost landlords, and inflated advance payments are not a fact of life — they're a problem we can fix. RentTrust is the platform that fights back.
                                    </p>
                                    <p style={{ color: 'hsl(200 15% 38%)', lineHeight: 1.75, fontSize: '0.9375rem' }}>
                                        We verify agents, confirm listings exist, publish real tenant reviews, and show actual market prices. No pay-to-rank, no hidden ads, no favouritism.
                                    </p>
                                </div>

                                {/* Values */}
                                <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', border: '1px solid hsl(40 20% 88%)', padding: 'clamp(1.5rem,4vw,2.5rem)', boxShadow: '0 4px 32px hsl(200 25% 15% / 0.07)' }}>
                                    <h2 style={{ fontSize: 'clamp(1.125rem,2.5vw,1.375rem)', fontWeight: 700, color: 'hsl(200 25% 15%)', marginBottom: '0.375rem' }}>
                                        What we stand for
                                    </h2>
                                    <p style={{ color: 'hsl(200 15% 50%)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                        Our four core principles guide every decision we make.
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '1rem' }}>
                                        {values.map(v => (
                                            <div key={v.title} className="value-card">
                                                <div style={{ width: 40, height: 40, borderRadius: '0.625rem', backgroundColor: 'hsl(174 62% 32% / 0.1)', color: 'hsl(174 62% 32%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.875rem' }}>
                                                    {v.icon}
                                                </div>
                                                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'hsl(200 25% 15%)', marginBottom: '0.375rem' }}>{v.title}</h3>
                                                <p style={{ fontSize: '0.8125rem', color: 'hsl(200 15% 50%)', lineHeight: 1.65 }}>{v.body}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Timeline */}
                                {/* <div style={{ background: 'linear-gradient(135deg, hsl(174 62% 20%) 0%, hsl(174 52% 28%) 100%)', borderRadius: '1.25rem', padding: 'clamp(1.5rem,4vw,2.5rem)', position: 'relative', overflow: 'hidden' }}>
                                    // {/* Dot overlay *
                                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <h2 style={{ fontSize: 'clamp(1.125rem,2.5vw,1.375rem)', fontWeight: 700, color: 'white', marginBottom: '0.375rem' }}>
                                            Our journey
                                        </h2>
                                        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                                            From a frustrating personal experience to a platform trusted by thousands.
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                            {milestones.map((m, i) => (
                                                <div key={m.year} style={{ display: 'flex', gap: '1.25rem' }}>
                                                    {/* Left: year 
                                                    <div style={{ flexShrink: 0, width: 52, paddingTop: 3 }}>
                                                        <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 5, background: i === milestones.length - 1 ? 'hsl(38 92% 50%)' : 'rgba(255,255,255,0.14)', color: i === milestones.length - 1 ? 'hsl(200 25% 12%)' : 'white', fontSize: 12, fontWeight: 700 }}>{m.year}</span>
                                                    </div>
                                                    {/* Centre: dot + line 
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        <div className="timeline-dot" />
                                                        {i < milestones.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 32, background: 'rgba(255,255,255,0.18)', marginTop: 5 }} />}
                                                    </div>
                                                    {/* Right: text 
                                                    <div style={{ paddingBottom: i < milestones.length - 1 ? '1.25rem' : 0 }}>
                                                        <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>{m.label}</div>
                                                        <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.62)', lineHeight: 1.65 }}>{m.detail}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div> */}

                                {/* Team */}
                                <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', border: '1px solid hsl(40 20% 88%)', padding: 'clamp(1.5rem,4vw,2.5rem)', boxShadow: '0 4px 32px hsl(200 25% 15% / 0.07)' }}>
                                    <h2 style={{ fontSize: 'clamp(1.125rem,2.5vw,1.375rem)', fontWeight: 700, color: 'hsl(200 25% 15%)', marginBottom: '0.375rem' }}>
                                        Meet the team
                                    </h2>
                                    <p style={{ color: 'hsl(200 15% 50%)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                        Small team. Big mission.
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(195px,1fr))', gap: '1rem' }}>
                                        {team.map(p => (
                                            <div key={p.name} className="team-card">
                                                <div style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: `hsl(${p.hue} 50% 88%)`, color: `hsl(${p.hue} 50% 28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, margin: '0 auto 0.875rem' }}>{p.initials}</div>
                                                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'hsl(200 25% 15%)', marginBottom: 2 }}>{p.name}</div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(174 62% 32%)', marginBottom: '0.625rem', letterSpacing: '0.02em' }}>{p.role}</div>
                                                <p style={{ fontSize: '0.8rem', color: 'hsl(200 15% 50%)', lineHeight: 1.6 }}>{p.bio}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ── RIGHT COLUMN ── */}
                            <div className="about-side" style={{ flex: '0 0 clamp(260px,30%,320px)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                                {/* Stats */}
                                <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', border: '1px solid hsl(40 20% 88%)', padding: '1.5rem', boxShadow: '0 4px 32px hsl(200 25% 15% / 0.06)' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'hsl(200 25% 15%)', marginBottom: '0.25rem' }}>By the numbers</h3>
                                    <p style={{ fontSize: '0.8375rem', color: 'hsl(200 15% 50%)', marginBottom: '1.25rem' }}>Our platform at a glance.</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        {stats.map(s => (
                                            <div key={s.label} className="stat-box">
                                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'hsl(174 62% 32%)', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
                                                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: 'hsl(200 25% 22%)', marginTop: 4 }}>{s.label}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'hsl(200 15% 55%)', marginTop: 2 }}>{s.sub}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Our promises */}
                                <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', border: '1px solid hsl(40 20% 88%)', padding: '1.5rem', boxShadow: '0 4px 32px hsl(200 25% 15% / 0.06)' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'hsl(200 25% 15%)', marginBottom: '0.25rem' }}>Our promises</h3>
                                    <p style={{ fontSize: '0.8375rem', color: 'hsl(200 15% 50%)', marginBottom: '1.25rem' }}>What you can always count on.</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {promises.map(p => (
                                            <div key={p.title} className="promise-item">
                                                <div style={{ width: 34, height: 34, borderRadius: '0.5rem', backgroundColor: 'hsl(174 62% 32% / 0.1)', color: 'hsl(174 62% 32%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{p.icon}</div>
                                                <div>
                                                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'hsl(200 25% 18%)', marginBottom: 2 }}>{p.title}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'hsl(200 15% 52%)', lineHeight: 1.5 }}>{p.body}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* FAQ */}
                                <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', border: '1px solid hsl(40 20% 88%)', padding: '1.5rem', boxShadow: '0 4px 32px hsl(200 25% 15% / 0.06)' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'hsl(200 25% 15%)', marginBottom: '1rem' }}>Common questions</h3>
                                    {[
                                        { q: 'Is RentTrust free to use?',         a: 'Free to browse and enquire. Pro plans unlock unlimited listings and analytics for agents.' },
                                        { q: 'How do you verify listings?',       a: 'Our team physically confirms each property before it goes live on the platform.' },
                                        { q: 'How do I list a property?',         a: 'Sign up as an agent and use your dashboard to add your first listing in minutes.' },
                                        { q: 'What if I spot a fake listing?',    a: 'Use the Report button on any listing and our team will investigate within 24 hours.' },
                                    ].map(({ q, a }) => (
                                        <div key={q} className="faq-item">
                                            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'hsl(200 25% 20%)', marginBottom: '0.375rem' }}>{q}</p>
                                            <p style={{ fontSize: '0.8125rem', color: 'hsl(200 15% 50%)', lineHeight: 1.55 }}>{a}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA card */}
                                <div style={{ borderRadius: '1.25rem', background: 'linear-gradient(135deg, hsl(174 62% 22%) 0%, hsl(174 50% 32%) 100%)', padding: '1.5rem', color: 'white' }}>
                                    <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.375rem' }}>Ready to find a home?</p>
                                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
                                        Browse thousands of verified listings and connect with trusted agents.
                                    </p>
                                    {/* <Link href="/rent/listings"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.625rem 1.25rem', borderRadius: '0.5rem', backgroundColor: 'hsl(38 92% 50%)', color: 'hsl(200 25% 10%)', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', transition: 'opacity 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                                        Browse Listings
                                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                    <Link href="/rent/listings"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.625rem 1.25rem', borderRadius: '0.5rem', backgroundColor: 'hsl(38 92% 50%)', color: 'hsl(200 25% 10%)', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', transition: 'opacity 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                                        Browse Listings
                                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link> */}
                                    <Link href="/contact"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.625rem 1.25rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)', color: 'white', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', marginLeft: '0.5rem', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}>
                                        Contact Us
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}