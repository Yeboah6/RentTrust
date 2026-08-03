import Header from '../../Components/Layouts/Header';
import Footer from '../../Components/Layouts/Footer';
import { Link, Head } from '@inertiajs/react';

// ── Shared mosaic hero ────────────────────────────────────────────────────────
const MosaicHero = ({ badge, title, highlight, sub, tint = 'hsl(174 62% 22%)' }) => (
    <div style={{ position:'relative', overflow:'hidden', minHeight:'360px', display:'flex', alignItems:'center' }}>
        <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg,${tint} 0%,hsl(174 55% 32%) 60%,hsl(174 45% 38%) 100%)`, zIndex:0 }} />
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'56%', zIndex:1,
            display:'grid', gridTemplateColumns:'repeat(3,1fr)', gridTemplateRows:'repeat(3,1fr)', gap:'4px' }}>
            <div style={{ gridRow:'1/3', overflow:'hidden', background:'hsl(174 25% 22%)' }}>
                <img src="/images/download 2.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} />
            </div>
            <div style={{ overflow:'hidden', background:'hsl(200 30% 18%)' }}>
                <img src="/images/download 1.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} />
            </div>
            <div style={{ overflow:'hidden', background:'hsl(174 35% 16%)' }}>
                <img src="/images/download 2.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} />
            </div>
            <div style={{ gridColumn:'2/4', overflow:'hidden', background:'hsl(30 25% 18%)' }}>
                <img src="/images/download 1.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} />
            </div>
            <div style={{ overflow:'hidden', background:'hsl(220 30% 16%)' }}>
                <img src="/images/download 3.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} />
            </div>
            <div style={{ overflow:'hidden', background:'hsl(174 20% 14%)' }}>
                <img src="/images/download 5.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} />
            </div>
            <div style={{ overflow:'hidden', background:'hsl(15 25% 16%)' }}>
                <img src="/images/download 4.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} />
            </div>
        </div>
        <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', opacity:0.06,
            backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize:'28px 28px' }} />
        <div style={{ position:'absolute', right:'-4rem', top:'-4rem', width:'20rem', height:'20rem', borderRadius:'50%',
            background:'radial-gradient(circle,hsl(174 62% 50% / 0.2) 0%,transparent 70%)', zIndex:2, pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:0, zIndex:2,
            background:'linear-gradient(to right,hsl(174 60% 22% / 0.98) 0%,hsl(174 58% 22% / 0.88) 38%,hsl(174 55% 22% / 0.45) 70%,hsl(174 55% 22% / 0.15) 100%)' }} />
        <div style={{ position:'relative', zIndex:3, padding:'clamp(2.5rem,7vw,4.5rem) clamp(1rem,4vw,2.5rem)', maxWidth:'560px' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'5px 14px', borderRadius:'999px',
                background:'rgba(255,255,255,0.14)', border:'1px solid rgba(255,255,255,0.22)', color:'rgba(255,255,255,0.9)',
                fontSize:'13px', fontWeight:'600', marginBottom:'1.25rem' }}>
                <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'hsl(152 70% 60%)',
                    animation:'pulse 2s ease infinite', flexShrink:0 }} />
                {badge}
            </div>
            <h1 style={{ color:'white', fontSize:'clamp(2rem,5vw,3.25rem)', fontWeight:'800', lineHeight:'1.1',
                marginBottom:'1rem', letterSpacing:'-0.02em' }}>
                {title}<br />
                {highlight && <span style={{ color:'hsl(40 90% 70%)' }}>{highlight}</span>}
            </h1>
            <p style={{ color:'rgba(255,255,255,0.72)', fontSize:'clamp(0.9rem,2.2vw,1.1rem)', lineHeight:'1.6', maxWidth:'420px' }}>
                {sub}
            </p>
        </div>
    </div>
);

// ── Shared card ────────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
    <div style={{ backgroundColor:'white', borderRadius:'1.25rem', border:'1px solid hsl(40 20% 88%)',
        padding:'clamp(1.5rem,4vw,2.5rem)', boxShadow:'0 4px 32px hsl(200 25% 15% / 0.07)', ...style }}>
        {children}
    </div>
);

const SmallCard = ({ children, style = {} }) => (
    <div style={{ backgroundColor:'white', borderRadius:'1.25rem', border:'1px solid hsl(40 20% 88%)',
        padding:'1.5rem', boxShadow:'0 4px 32px hsl(200 25% 15% / 0.06)', ...style }}>
        {children}
    </div>
);

const SectionTitle = ({ children, sub }) => (
    <div style={{ marginBottom:'1.5rem' }}>
        <h2 style={{ fontSize:'clamp(1.25rem,3vw,1.5rem)', fontWeight:'700', color:'hsl(200 25% 15%)', marginBottom:'0.375rem' }}>{children}</h2>
        {sub && <p style={{ color:'hsl(200 15% 50%)', fontSize:'0.9rem' }}>{sub}</p>}
    </div>
);

const FaqItem = ({ q, a }) => (
    <div style={{ borderBottom:'1px solid hsl(40 20% 88%)', padding:'1rem 0' }}>
        <p style={{ fontWeight:'600', fontSize:'0.875rem', color:'hsl(200 25% 20%)', marginBottom:'0.375rem' }}>{q}</p>
        <p style={{ fontSize:'0.8125rem', color:'hsl(200 15% 50%)', lineHeight:'1.55' }}>{a}</p>
    </div>
);

const TealCTA = () => (
    <div style={{ borderRadius:'1.25rem', background:'linear-gradient(135deg,hsl(174 62% 22%) 0%,hsl(174 50% 32%) 100%)', padding:'1.5rem', color:'white' }}>
        <p style={{ fontWeight:'700', fontSize:'1rem', marginBottom:'0.375rem' }}>Ready to rent safely?</p>
        <p style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.7)', marginBottom:'1rem' }}>Browse verified listings and connect with trusted agents.</p>
        <Link href="/rent" style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'0.5rem 1.1rem',
            borderRadius:'0.5rem', backgroundColor:'hsl(38 92% 50%)', color:'hsl(200 25% 10%)', fontSize:'0.8125rem',
            fontWeight:'700', textDecoration:'none' }}>
            Browse Listings →
        </Link>
    </div>
);

// ── Shared base CSS ─────────────────────────────────────────────────────────────
const BASE_STYLE = `
* { font-family:'Plus Jakarta Sans',system-ui,sans-serif; box-sizing:border-box; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
@keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
.sp-hero { animation:fadeUp 0.6s ease both; }
.sp-main { animation:fadeUp 0.6s ease 0.1s both; }
.sp-side { animation:fadeUp 0.6s ease 0.2s both; }
.sp-step { transition:transform 0.2s,box-shadow 0.2s,border-color 0.2s; }
.sp-step:hover { transform:translateY(-3px); box-shadow:0 12px 40px hsl(200 25% 15% / 0.09); border-color:hsl(174 62% 32% / 0.3) !important; }
@media(max-width:768px){.sp-grid{flex-direction:column!important}}
`;

// ══════════════════════════════════════════════════════════════════════════════
// GUIDE PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function GuidePage() {
    const steps = [
        { n:'01', color:'hsl(174 62% 32%)', bg:'hsl(174 62% 32% / 0.1)',
          title:'Set a realistic budget',
          body:'Include rent, advance payment, utility bills, agent fees and transport. Know your limits before browsing.',
          tips:['List your must-haves vs nice-to-haves','Compare multiple neighbourhoods','Check current market rents'] },
        { n:'02', color:'hsl(38 85% 42%)', bg:'hsl(38 92% 50% / 0.1)',
          title:'Verify the listing first',
          body:'Not every listing is real. Use RentTrust verification badges and confirm the property exists before committing.',
          tips:['Ask for the exact address and photos','Cross-check on the map','Call the agent before visiting'] },
        { n:'03', color:'hsl(152 55% 35%)', bg:'hsl(152 60% 40% / 0.1)',
          title:'Inspect the property in person',
          body:"Never pay money until you've seen the house. Confirm the landlord can legally rent it.",
          tips:['Bring a friend or family member','Check water, electricity and security','Verify rooms match the photos'] },
        { n:'04', color:'hsl(220 55% 48%)', bg:'hsl(220 55% 48% / 0.1)',
          title:'Agree on terms in writing',
          body:'Get a written tenancy agreement and receipt for every payment. Clarify advance rent, notice period and utilities.',
          tips:['Write down exact rent and schedule','Keep copies of all receipts','Refuse verbal-only agreements'] },
    ];

    return (
        <>
        <Head>
            {/* Primary SEO */}
            <title>Renting Guide | How to Rent Safely in Ghana | RentTrustGh</title>

            <meta
                name="description"
                content="Learn how to rent safely in Ghana with RentTrustGh's practical guide. Discover how to verify listings, inspect properties, avoid rental scams, negotiate rent, and sign secure tenancy agreements."
            />

            <meta
                name="keywords"
                content="renting guide Ghana, how to rent a house in Ghana, apartment rental tips Ghana, avoid rental scams Ghana, tenant guide Ghana, RentTrustGh"
            />

            <meta name="robots" content="index,follow" />

            {/* Canonical */}
            <link
                rel="canonical"
                href="https://renttrustgh.com/guide"
            />

            {/* Open Graph */}
            <meta property="og:type" content="article" />
            <meta property="og:site_name" content="RentTrustGh" />
            <meta property="og:locale" content="en_GH" />

            <meta
                property="og:title"
                content="Renting Guide | Rent Safely in Ghana"
            />

            <meta
                property="og:description"
                content="A step-by-step guide to finding, verifying, inspecting, and renting property safely anywhere in Ghana."
            />

            <meta
                property="og:url"
                content="https://renttrustgh.com/guide"
            />

            <meta
                property="og:image"
                content="https://renttrustgh.com/images/seo/guide-og.jpg"
            />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />

            <meta
                name="twitter:title"
                content="Renting Guide | RentTrustGh"
            />

            <meta
                name="twitter:description"
                content="Everything you need to know before renting a house or apartment in Ghana."
            />

            <meta
                name="twitter:image"
                content="https://renttrustgh.com/images/seo/guide-og.jpg"
            />

            {/* Guide Article Schema */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Article",
                    headline: "Renting Guide | How to Rent Safely in Ghana",
                    description:
                        "A practical guide that helps tenants find, verify, inspect, and rent property safely across Ghana.",
                    image: "https://renttrustgh.com/images/seo/guide-og.jpg",
                    author: {
                        "@type": "Organization",
                        name: "RentTrustGh"
                    },
                    publisher: {
                        "@type": "Organization",
                        name: "RentTrustGh",
                        logo: {
                            "@type": "ImageObject",
                            url: "https://renttrustgh.com/images/rent-trust.jpg"
                        }
                    },
                    mainEntityOfPage: {
                        "@type": "WebPage",
                        "@id": "https://renttrustgh.com/guide"
                    }
                })}
            </script>
            
            {/* FAQ Schema */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    mainEntity: [
                        {
                            "@type": "Question",
                            name: "How do I verify an agent?",
                            acceptedAnswer: {
                                "@type": "Answer",
                                text: "Check for the verified badge on their RentTrustGh profile and review their ratings before making any payment."
                            }
                        },
                        {
                            "@type": "Question",
                            name: "What rent advance is normal in Ghana?",
                            acceptedAnswer: {
                                "@type": "Answer",
                                text: "Advance rent varies depending on the property and agreement, but you should always understand the terms before signing a tenancy agreement."
                            }
                        },
                        {
                            "@type": "Question",
                            name: "Should I inspect a property before paying?",
                            acceptedAnswer: {
                                "@type": "Answer",
                                text: "Yes. Always inspect the property, confirm the landlord or agent's authority, and avoid paying before verifying the property."
                            }
                        }
                    ]
                })}
            </script>
            
            {/* Breadcrumb Schema */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        {
                            "@type": "ListItem",
                            position: 1,
                            name: "Home",
                            item: "https://renttrustgh.com"
                        },
                        {
                            "@type": "ListItem",
                            position: 2,
                            name: "Renting Guide",
                            item: "https://renttrustgh.com/guide"
                        }
                    ]
                })}
            </script>
        </Head>
            <style>{BASE_STYLE}</style>
            <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', backgroundColor:'hsl(40 33% 98%)' }}>
                <Header />
                <main style={{ flex:1 }}>
                    <MosaicHero
                        badge="Renting Guide"
                        title="A practical guide to rent"
                        highlight="safely in Ghana."
                        sub="Four steps to compare prices, verify listings, inspect properties and sign agreements with confidence."
                    />
                    <div style={{ maxWidth:'1080px', margin:'0 auto', padding:'clamp(2rem,6vw,4rem) clamp(0.75rem,3vw,1rem)' }}>
                        <div className="sp-grid" style={{ display:'flex', gap:'clamp(1.5rem,4vw,3rem)', alignItems:'flex-start' }}>

                            {/* ── Left ── */}
                            <div className="sp-main" style={{ flex:'1 1 0', display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                                <Card>
                                    <SectionTitle sub="Follow these steps to protect yourself every time you rent.">How to rent safely</SectionTitle>
                                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1rem' }}>
                                        {steps.map(s => (
                                            <div key={s.n} className="sp-step" style={{ border:'1px solid hsl(40 20% 88%)', borderRadius:'1rem', padding:'1.25rem', background:'white' }}>
                                                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.875rem' }}>
                                                    <div style={{ width:40, height:40, borderRadius:'0.625rem', background:s.bg, color:s.color,
                                                        display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.875rem', fontWeight:900, flexShrink:0 }}>{s.n}</div>
                                                    <h3 style={{ fontSize:'0.9375rem', fontWeight:700, color:s.color, margin:0 }}>{s.title}</h3>
                                                </div>
                                                <p style={{ fontSize:'0.8375rem', color:'hsl(200 15% 42%)', lineHeight:1.65, marginBottom:'0.75rem' }}>{s.body}</p>
                                                <ul style={{ margin:0, paddingLeft:'1.1rem' }}>
                                                    {s.tips.map(t => <li key={t} style={{ fontSize:'0.8125rem', color:'hsl(200 15% 45%)', marginBottom:'0.35rem', lineHeight:1.5 }}>{t}</li>)}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                {/* Checklist callout */}
                                <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start', padding:'1.25rem 1.5rem', borderRadius:'1rem',
                                    background:'hsl(174 62% 32% / 0.07)', border:'1px solid hsl(174 62% 32% / 0.18)' }}>
                                    <div style={{ fontSize:'1.5rem', flexShrink:0 }}>✓</div>
                                    <div>
                                        <div style={{ fontWeight:700, fontSize:'0.9375rem', color:'hsl(174 62% 22%)', marginBottom:4 }}>Quick checklist</div>
                                        <p style={{ color:'hsl(200 15% 40%)', fontSize:'0.875rem', lineHeight:1.65 }}>
                                            Budget clearly · Verify the listing · Inspect in person · Confirm landlord identity · Sign a written agreement. RentTrust is here to help every step of the way.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ── Right ── */}
                            <div className="sp-side" style={{ flex:'0 0 clamp(260px,30%,320px)', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                                <SmallCard>
                                    <h3 style={{ fontSize:'1rem', fontWeight:'700', color:'hsl(200 25% 15%)', marginBottom:'0.25rem' }}>Why this matters</h3>
                                    <p style={{ fontSize:'0.8375rem', color:'hsl(200 15% 50%)', marginBottom:'1.25rem' }}>Common mistakes Ghanaian tenants make.</p>
                                    {[
                                        { icon:'⚠', t:'Paying before viewing', d:'Never send money without seeing the property first.' },
                                        { icon:'📄', t:'No written agreement', d:'Always insist on a signed tenancy agreement.' },
                                        { icon:'🔍', t:'Skipping verification', d:'Check agent credentials before committing.' },
                                        { icon:'💰', t:'Overpaying advance', d:'Know the market rate before agreeing to terms.' },
                                    ].map(r => (
                                        <div key={r.t} style={{ display:'flex', gap:'0.75rem', padding:'0.875rem 0', borderBottom:'1px solid hsl(40 20% 92%)' }}>
                                            <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{r.icon}</span>
                                            <div>
                                                <div style={{ fontWeight:700, fontSize:'0.8125rem', color:'hsl(200 25% 18%)', marginBottom:2 }}>{r.t}</div>
                                                <div style={{ fontSize:'0.775rem', color:'hsl(200 15% 52%)', lineHeight:1.5 }}>{r.d}</div>
                                            </div>
                                        </div>
                                    ))}
                                </SmallCard>

                                <SmallCard>
                                    <h3 style={{ fontSize:'1rem', fontWeight:'700', color:'hsl(200 25% 15%)', marginBottom:'1rem' }}>Common questions</h3>
                                    {[
                                        { q:'How do I verify an agent?', a:'Check for the verified badge on their profile and read tenant reviews.' },
                                        { q:'What advance is normal?', a:'Typically 2–6 months in Ghana. Anything above 6 is unusual.' },
                                        { q:'Can I negotiate rent?', a:'Yes. Most landlords expect some negotiation, especially on longer leases.' },
                                    ].map(({q,a}) => <FaqItem key={q} q={q} a={a} />)}
                                </SmallCard>

                                <TealCTA />
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}