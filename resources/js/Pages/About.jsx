import { Link } from '@inertiajs/react';
import Header from '../Components/Layouts/Header';
import Footer from '../Components/Layouts/Footer';

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const Icon = ({ d, size = 24, stroke = 1.6, fill = 'none' }) => (
    <svg width={size} height={size} fill={fill} viewBox="0 0 24 24" stroke="currentColor">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={stroke} d={p} />
        ))}
    </svg>
);

const Icons = {
    shield:  'd="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"',
    eye:     ['M15 12a3 3 0 11-6 0 3 3 0 016 0z', 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'],
    users:   'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    star:    'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    check:   'M5 13l4 4L19 7',
    map:     ['M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'],
    home:    'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    arrow:   'M14 5l7 7m0 0l-7 7m7-7H3',
    heart:   'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
};

// ─── Constants ────────────────────────────────────────────────────────────────

const TEAL   = 'hsl(174 62% 32%)';
const TEAL_L = 'hsl(174 62% 38%)';
const GOLD   = 'hsl(38 92% 50%)';
const DARK   = 'hsl(200 25% 12%)';
const MID    = 'hsl(200 15% 45%)';
const BG     = 'hsl(40 33% 98%)';
const WHITE  = '#ffffff';
const BORDER = 'hsl(40 20% 88%)';

// ─── Small atoms ─────────────────────────────────────────────────────────────

const Pill = ({ children, color = TEAL }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 999, backgroundColor: `${color}18`, border: `1px solid ${color}30`, color, fontSize: 13, fontWeight: 600, letterSpacing: '0.02em' }}>
        {children}
    </span>
);

const SectionHeading = ({ eyebrow, title, sub, center = false, light = false }) => (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: '3rem' }}>
        {eyebrow && <Pill color={light ? GOLD : TEAL}>{eyebrow}</Pill>}
        <h2 style={{ margin: '0.75rem 0 0.75rem', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: light ? WHITE : DARK, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            {title}
        </h2>
        {sub && <p style={{ fontSize: '1.0625rem', color: light ? 'rgba(255,255,255,0.7)' : MID, lineHeight: 1.65, maxWidth: center ? 560 : 'none', margin: center ? '0 auto' : 0 }}>{sub}</p>}
    </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
    const values = [
        { icon: Icons.shield, title: 'Transparency First', body: 'We show real prices and honest reviews. No hidden fees, no inflated listings. What you see is what you get.' },
        { icon: Icons.eye,    title: 'Verified Listings',  body: 'Every listing goes through our verification process. We physically confirm properties exist before they go live.' },
        { icon: Icons.users,  title: 'Community Driven',   body: 'Tenants leave reviews. Landlords respond. Agents build reputations. Trust is earned publicly, not promised privately.' },
        { icon: Icons.heart,  title: 'People Over Profit', body: 'We\'re building for everyday Ghanaians. Affordable to list, free to browse, and always on your side.' },
    ];

    const stats = [
        { value: '10,000+', label: 'Properties Listed',  sub: 'Across Ghana' },
        { value: '200+',    label: 'Verified Agents',    sub: 'And growing' },
        { value: '50+',     label: 'Areas Covered',      sub: 'Nationwide' },
        { value: '4.8★',    label: 'Platform Rating',    sub: 'From our users' },
    ];

    const team = [
        { initials: 'KM', name: 'Kwame Mensah',    role: 'Co-Founder & CEO',     hue: 174, bio: 'Former real estate broker who spent years watching tenants get scammed. Built RentTrust to fix that.' },
        { initials: 'AA', name: 'Abena Asante',    role: 'Co-Founder & CTO',     hue: 220, bio: 'Software engineer passionate about using tech to solve housing problems across West Africa.' },
        { initials: 'EO', name: 'Emeka Okonkwo',  role: 'Head of Verification', hue: 38,  bio: 'Runs the team that physically inspects and verifies every property before it goes live.' },
        { initials: 'AF', name: 'Ama Frimpong',   role: 'Community Manager',    hue: 152, bio: 'Ensures tenants and landlords have a voice. Manages reviews, disputes, and agent accountability.' },
    ];

    const milestones = [
        { year: '2023', label: 'Founded', detail: 'RentTrust was born in Accra after our founders experienced firsthand how broken the rental market was.' },
        { year: '2024', label: 'Launched', detail: 'Public launch with 500 verified listings across Accra and Tema. First 1,000 tenants joined in the first month.' },
        { year: '2025', label: 'Expanded', detail: 'Expanded to Kumasi, Takoradi, and Tamale. Crossed 5,000 active listings and 100 verified agents.' },
        { year: '2026', label: 'Today',    detail: 'Over 10,000 properties listed nationwide. Building tools to make renting and selling property easier for all Ghanaians.' },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

                @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
                @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
                @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
                @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

                .about-hero     { animation: fadeIn 0.7s ease both; }
                .about-fadeup   { animation: fadeUp 0.6s ease both; }

                .value-card {
                    background: white;
                    border: 1px solid ${BORDER};
                    border-radius: 1.25rem;
                    padding: 1.75rem;
                    transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
                }
                .value-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 16px 48px hsl(200 25% 15% / 0.1);
                    border-color: ${TEAL}40;
                }

                .team-card {
                    background: white;
                    border: 1px solid ${BORDER};
                    border-radius: 1.25rem;
                    padding: 2rem 1.75rem;
                    text-align: center;
                    transition: transform 0.22s, box-shadow 0.22s;
                }
                .team-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 40px hsl(200 25% 15% / 0.09);
                }

                .stat-item {
                    text-align: center;
                    padding: 1.5rem;
                    border-radius: 1rem;
                    background: white;
                    border: 1px solid ${BORDER};
                    transition: transform 0.2s;
                }
                .stat-item:hover { transform: translateY(-3px); }

                .timeline-dot {
                    width: 14px; height: 14px;
                    border-radius: 50%;
                    background: ${TEAL};
                    border: 3px solid white;
                    box-shadow: 0 0 0 3px ${TEAL}40;
                    flex-shrink: 0;
                    margin-top: 4px;
                }

                @media (max-width: 768px) {
                    .about-grid-2  { grid-template-columns: 1fr !important; }
                    .about-grid-4  { grid-template-columns: repeat(2, 1fr) !important; }
                    .mosaic-right  { display: none !important; }
                    .hero-content  { max-width: 100% !important; }
                    .timeline-row  { flex-direction: column !important; gap: 0.5rem !important; }
                }
            `}</style>

            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: BG }}>
                <Header />

                <main style={{ flex: 1 }}>

                    {/* ══════════════════════════════════════════════════
                        HERO — mosaic background, same as contact/home
                    ══════════════════════════════════════════════════ */}
                    <section className="about-hero" style={{ position: 'relative', overflow: 'hidden', minHeight: 420, display: 'flex', alignItems: 'center' }}>

                        {/* Base gradient */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, hsl(174 62% 20%) 0%, hsl(174 52% 28%) 55%, hsl(174 44% 35%) 100%)', zIndex: 0 }} />

                        {/* Mosaic grid — right 52% */}
                        <div className="mosaic-right" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '52%', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(2,1fr)', gap: 3 }}>
                            {/* Tall cell */}
                            <div style={{ gridRow: '1/3', overflow: 'hidden', background: 'hsl(174 28% 18%)' }}>
                                <svg viewBox="0 0 180 340" style={{ width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg">
                                    <rect width="180" height="340" fill="hsl(174 25% 20%)"/>
                                    <rect x="15" y="30" width="150" height="100" rx="4" fill="hsl(174 22% 27%)"/>
                                    <polygon points="15,30 90,5 165,30" fill="hsl(38 45% 38% / 0.65)"/>
                                    <rect x="30" y="50" width="50" height="35" rx="2" fill="hsl(38 55% 50% / 0.45)"/>
                                    <rect x="100" y="50" width="50" height="35" rx="2" fill="hsl(38 55% 50% / 0.45)"/>
                                    <rect x="60" y="95" width="60" height="35" rx="2" fill="hsl(174 28% 32%)"/>
                                    <rect x="15" y="148" width="150" height="80" rx="3" fill="hsl(174 22% 22%)"/>
                                    <rect x="30" y="163" width="35" height="28" rx="1" fill="hsl(38 50% 45% / 0.38)"/>
                                    <rect x="115" y="163" width="35" height="28" rx="1" fill="hsl(38 50% 45% / 0.38)"/>
                                    <rect x="55" y="163" width="70" height="45" rx="1" fill="hsl(174 25% 28%)"/>
                                    <rect x="20" y="244" width="140" height="70" rx="3" fill="hsl(174 20% 20%)"/>
                                    <rect x="35" y="258" width="40" height="30" rx="1" fill="hsl(38 50% 42% / 0.32)"/>
                                    <rect x="105" y="258" width="40" height="30" rx="1" fill="hsl(38 50% 42% / 0.32)"/>
                                    <rect x="55" y="292" width="70" height="10" rx="2" fill="hsl(174 25% 30%)"/>
                                </svg>
                            </div>
                            {[
                                { bg: 'hsl(200 32% 16%)', accent: 'hsl(38 58% 52%)' },
                                { bg: 'hsl(30 28% 15%)',  accent: 'hsl(38 45% 40%)' },
                                { bg: 'hsl(220 32% 14%)', accent: 'hsl(38 48% 46%)' },
                                { bg: 'hsl(174 20% 13%)', accent: 'hsl(152 38% 36%)' },
                                { bg: 'hsl(15 26% 14%)',  accent: 'hsl(38 52% 44%)' },
                            ].map((c, i) => (
                                <div key={i} style={{ overflow: 'hidden', background: c.bg }}>
                                    <svg viewBox="0 0 180 165" style={{ width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg">
                                        <rect width="180" height="165" fill={c.bg}/>
                                        <rect x="12" y="12" width="156" height="141" rx="4" fill={`${c.bg.replace(')', '')} / 1.2`}/>
                                        <circle cx={60 + (i % 3) * 30} cy="55" r="22" fill={`${c.accent} / 0.45`}/>
                                        <rect x="20" y="90" width="140" height="8" rx="2" fill={`${c.accent} / 0.25`}/>
                                        <rect x="35" y="106" width="110" height="5" rx="1" fill={`${c.accent} / 0.18`}/>
                                        <rect x="20" y="24" width="55" height="30" rx="2" fill={`${c.accent} / 0.2`}/>
                                        <rect x="105" y="24" width="55" height="30" rx="2" fill={`${c.accent} / 0.2`}/>
                                    </svg>
                                </div>
                            ))}
                        </div>

                        {/* Dot grid */}
                        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.06, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                        {/* Fade overlay */}
                        <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to right, hsl(174 60% 18% / 0.98) 0%, hsl(174 58% 18% / 0.88) 36%, hsl(174 55% 18% / 0.42) 68%, hsl(174 55% 18% / 0.12) 100%)' }} />

                        {/* Content */}
                        <div className="hero-content" style={{ position: 'relative', zIndex: 3, padding: 'clamp(2.5rem,7vw,5rem) clamp(1rem,4vw,2.5rem)', maxWidth: 560 }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600, marginBottom: '1.25rem' }}>
                                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'hsl(152 70% 58%)', animation: 'pulse 2s ease infinite', flexShrink: 0 }} />
                                Our mission & story
                            </div>
                            <h1 style={{ fontSize: 'clamp(2rem,5.5vw,3.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                                Renting in Ghana<br />
                                <span style={{ color: 'hsl(38 92% 62%)' }}>should be safer.</span>
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(0.95rem,2.2vw,1.1rem)', lineHeight: 1.65, maxWidth: 420 }}>
                                RentTrust was built to end rental scams, inflated prices, and unverified listings. We're on the side of tenants — always.
                            </p>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════════
                        MISSION STRIP
                    ══════════════════════════════════════════════════ */}
                    <section style={{ backgroundColor: WHITE, borderBottom: `1px solid ${BORDER}` }}>
                        <div style={{ maxWidth: 1080, margin: '0 auto', padding: 'clamp(2.5rem,6vw,4rem) clamp(1rem,4vw,2rem)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem,5vw,4rem)', alignItems: 'center' }} className="about-grid-2">
                            <div className="about-fadeup" style={{ animationDelay: '0.05s' }}>
                                <Pill>Our Mission</Pill>
                                <h2 style={{ margin: '0.75rem 0', fontSize: 'clamp(1.5rem,3.5vw,2.25rem)', fontWeight: 800, color: DARK, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                                    Making property rental transparent, safe, and fair for every Ghanaian.
                                </h2>
                                <p style={{ color: MID, lineHeight: 1.7, fontSize: '1rem', marginBottom: '1.25rem' }}>
                                    Too many Ghanaians have lost their savings to rental fraud. Fake listings, ghost landlords, and inflated advance payments are not a fact of life — they're a problem we can fix. RentTrust is the platform that fights back.
                                </p>
                                <p style={{ color: MID, lineHeight: 1.7, fontSize: '1rem' }}>
                                    We verify agents, confirm listings exist, publish real tenant reviews, and show actual market prices. No pay-to-rank, no hidden ads, no favouritism.
                                </p>
                            </div>
                            <div className="about-fadeup" style={{ animationDelay: '0.15s', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                                {stats.map((s, i) => (
                                    <div key={i} className="stat-item" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                                        <div style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 900, color: TEAL, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
                                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: DARK, marginTop: 4 }}>{s.label}</div>
                                        <div style={{ fontSize: '0.75rem', color: MID, marginTop: 2 }}>{s.sub}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════════
                        VALUES
                    ══════════════════════════════════════════════════ */}
                    <section style={{ backgroundColor: BG, padding: 'clamp(3rem,7vw,5rem) clamp(1rem,4vw,2rem)' }}>
                        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
                            <SectionHeading center eyebrow="What We Stand For" title="Our core values" sub="Everything we build is guided by these principles. We don't compromise on them." />
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '1.25rem' }}>
                                {values.map((v, i) => (
                                    <div key={i} className="value-card" style={{ animationDelay: `${i * 0.08}s` }}>
                                        <div style={{ width: 48, height: 48, borderRadius: '0.75rem', backgroundColor: `${TEAL}14`, color: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>
                                            <Icon d={v.icon} size={22} stroke={1.7} />
                                        </div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: DARK, marginBottom: '0.5rem' }}>{v.title}</h3>
                                        <p style={{ fontSize: '0.875rem', color: MID, lineHeight: 1.65 }}>{v.body}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════════
                        STORY / TIMELINE — dark section
                    ══════════════════════════════════════════════════ */}
                    <section style={{ background: 'linear-gradient(135deg, hsl(174 62% 16%) 0%, hsl(174 55% 22%) 100%)', padding: 'clamp(3rem,7vw,5rem) clamp(1rem,4vw,2rem)', position: 'relative', overflow: 'hidden' }}>
                        {/* Dot pattern */}
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                        <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                            <SectionHeading light center eyebrow="Our Journey" title="How we got here" sub="From a frustrating personal experience to a platform trusted by thousands." />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 700, margin: '0 auto' }}>
                                {milestones.map((m, i) => (
                                    <div key={i} className="timeline-row" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                        {/* Year badge */}
                                        <div style={{ flexShrink: 0, width: 72, textAlign: 'right' }}>
                                            <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 6, background: i === milestones.length - 1 ? GOLD : 'rgba(255,255,255,0.12)', color: i === milestones.length - 1 ? 'hsl(200 25% 12%)' : 'white', fontSize: 13, fontWeight: 700 }}>{m.year}</span>
                                        </div>
                                        {/* Line + dot */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                                            <div className="timeline-dot" />
                                            {i < milestones.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 40, background: 'rgba(255,255,255,0.15)', marginTop: 6 }} />}
                                        </div>
                                        {/* Content */}
                                        <div style={{ paddingBottom: i < milestones.length - 1 ? '1rem' : 0 }}>
                                            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '0.375rem' }}>{m.label}</div>
                                            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }}>{m.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════════
                        TEAM
                    ══════════════════════════════════════════════════ */}
                    <section style={{ backgroundColor: WHITE, padding: 'clamp(3rem,7vw,5rem) clamp(1rem,4vw,2rem)', borderTop: `1px solid ${BORDER}` }}>
                        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
                            <SectionHeading center eyebrow="The People" title="Who's behind RentTrust" sub="A small, dedicated team with a big mission." />
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px,1fr))', gap: '1.25rem' }}>
                                {team.map((p, i) => (
                                    <div key={i} className="team-card">
                                        {/* Avatar */}
                                        <div style={{ width: 68, height: 68, borderRadius: '50%', backgroundColor: `hsl(${p.hue} 50% 88%)`, color: `hsl(${p.hue} 50% 28%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', fontWeight: 800, margin: '0 auto 1rem' }}>
                                            {p.initials}
                                        </div>
                                        <div style={{ fontSize: '1rem', fontWeight: 700, color: DARK, marginBottom: 2 }}>{p.name}</div>
                                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: TEAL, marginBottom: '0.75rem', letterSpacing: '0.02em' }}>{p.role}</div>
                                        <p style={{ fontSize: '0.8125rem', color: MID, lineHeight: 1.6 }}>{p.bio}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════════
                        PROMISE STRIP
                    ══════════════════════════════════════════════════ */}
                    <section style={{ backgroundColor: BG, borderTop: `1px solid ${BORDER}`, padding: 'clamp(2.5rem,6vw,4rem) clamp(1rem,4vw,2rem)' }}>
                        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
                            {[
                                { icon: Icons.shield, title: 'No fake listings',       body: 'Every property is confirmed before it goes live.' },
                                { icon: Icons.star,   title: 'Real reviews only',       body: 'Reviews come from verified tenants who actually stayed.' },
                                { icon: Icons.map,    title: 'Accurate locations',      body: 'Properties are mapped to their real address.' },
                                { icon: Icons.check,  title: 'No hidden charges',       body: 'We never charge tenants to browse or enquire.' },
                                { icon: Icons.home,   title: 'Fair market prices',      body: 'We publish actual market data so you know if a price is fair.' },
                                { icon: Icons.users,  title: 'Accountable agents',      body: 'Agent profiles include ratings, reviews, and response times.' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', padding: '1.1rem 1.25rem', backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: '0.875rem' }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '0.5rem', backgroundColor: `${TEAL}12`, color: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon d={item.icon} size={18} stroke={1.8} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: DARK, marginBottom: 3 }}>{item.title}</div>
                                        <div style={{ fontSize: '0.78rem', color: MID, lineHeight: 1.55 }}>{item.body}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════════
                        CTA
                    ══════════════════════════════════════════════════ */}
                    <section style={{ background: 'linear-gradient(135deg, hsl(174 62% 20%) 0%, hsl(174 52% 28%) 100%)', padding: 'clamp(3rem,7vw,5rem) clamp(1rem,4vw,2rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto' }}>
                            <div style={{ width: 56, height: 56, borderRadius: '1rem', backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <Icon d={Icons.home} size={26} stroke={1.6} />
                            </div>
                            <h2 style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 800, color: 'white', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                                Ready to find your next home?
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.0625rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                                Browse thousands of verified listings, read honest reviews, and connect with trusted agents — all in one place.
                            </p>
                            <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link href="/rent" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.875rem 1.75rem', borderRadius: '0.75rem', background: GOLD, color: 'hsl(200 25% 10%)', fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none', transition: 'opacity 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                                    Browse Listings <Icon d={Icons.arrow} size={16} stroke={2.2} />
                                </Link>
                                <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.875rem 1.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)', color: 'white', fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none', transition: 'background 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}>
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}