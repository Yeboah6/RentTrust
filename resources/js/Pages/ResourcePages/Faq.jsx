import Header from '../../Components/Layouts/Header';
import Footer from '../../Components/Layouts/Footer';
import { Link, Head } from '@inertiajs/react';

const MosaicHero = ({ badge, title, highlight, sub }) => (
    <div style={{ position:'relative', overflow:'hidden', minHeight:'360px', display:'flex', alignItems:'center' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,hsl(220 35% 18%) 0%,hsl(220 28% 26%) 60%,hsl(220 22% 32%) 100%)', zIndex:0 }} />
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'56%', zIndex:1,
            display:'grid', gridTemplateColumns:'repeat(3,1fr)', gridTemplateRows:'repeat(3,1fr)', gap:'4px' }}>
            <div style={{ gridRow:'1/3', overflow:'hidden', background:'hsl(220 25% 16%)' }}><img src="/images/download 2.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(220 30% 14%)' }}><img src="/images/download 1.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(220 35% 12%)' }}><img src="/images/download 3.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} /></div>
            <div style={{ gridColumn:'2/4', overflow:'hidden', background:'hsl(220 28% 14%)' }}><img src="/images/download 4.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(220 22% 12%)' }}><img src="/images/download 5.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(220 18% 10%)' }}><img src="/images/download 1.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(220 15% 12%)' }}><img src="/images/download 2.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} /></div>
        </div>
        <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', opacity:0.06, backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize:'28px 28px' }} />
        <div style={{ position:'absolute', inset:0, zIndex:2, background:'linear-gradient(to right,hsl(220 35% 18% / 0.98) 0%,hsl(220 32% 18% / 0.88) 38%,hsl(220 28% 18% / 0.45) 70%,hsl(220 28% 18% / 0.15) 100%)' }} />
        <div style={{ position:'relative', zIndex:3, padding:'clamp(2.5rem,7vw,4.5rem) clamp(1rem,4vw,2.5rem)', maxWidth:'560px' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'5px 14px', borderRadius:'999px', background:'rgba(255,255,255,0.14)', border:'1px solid rgba(255,255,255,0.22)', color:'rgba(255,255,255,0.9)', fontSize:'13px', fontWeight:'600', marginBottom:'1.25rem' }}>
                <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'hsl(38 92% 60%)', animation:'pulse 2s ease infinite', flexShrink:0 }} />{badge}
            </div>
            <h1 style={{ color:'white', fontSize:'clamp(2rem,5vw,3.25rem)', fontWeight:'800', lineHeight:'1.1', marginBottom:'1rem', letterSpacing:'-0.02em' }}>
                {title}<br />{highlight && <span style={{ color:'hsl(40 90% 70%)' }}>{highlight}</span>}
            </h1>
            <p style={{ color:'rgba(255,255,255,0.72)', fontSize:'clamp(0.9rem,2.2vw,1.1rem)', lineHeight:'1.6', maxWidth:'420px' }}>{sub}</p>
        </div>
    </div>
);

const SmallCard = ({ children, style={} }) => (
    <div style={{ backgroundColor:'white', borderRadius:'1.25rem', border:'1px solid hsl(40 20% 88%)', padding:'1.5rem', boxShadow:'0 4px 32px hsl(200 25% 15% / 0.06)', ...style }}>{children}</div>
);
const FaqItemSide = ({ q, a }) => (
    <div style={{ borderBottom:'1px solid hsl(40 20% 88%)', padding:'1rem 0' }}>
        <p style={{ fontWeight:'600', fontSize:'0.875rem', color:'hsl(200 25% 20%)', marginBottom:'0.375rem' }}>{q}</p>
        <p style={{ fontSize:'0.8125rem', color:'hsl(200 15% 50%)', lineHeight:'1.55' }}>{a}</p>
    </div>
);

const BASE_STYLE = `
* { font-family:'Plus Jakarta Sans',system-ui,sans-serif; box-sizing:border-box; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
@keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
.sp-main { animation:fadeUp 0.6s ease 0.1s both; }
.sp-side { animation:fadeUp 0.6s ease 0.2s both; }
.faq-card { background:white; border:1px solid hsl(40 20% 88%); border-radius:1rem; padding:1.25rem 1.5rem; transition:border-color 0.2s,box-shadow 0.2s; }
.faq-card:hover { border-color:hsl(174 62% 32% / 0.35); box-shadow:0 8px 28px hsl(200 25% 15% / 0.08); }
@media(max-width:768px){.sp-grid{flex-direction:column!important}}
`;

export default function FaqPage() {
    const faqs = [
        { icon:'🛡', q:'How do I know a listing is verified?', a:'Verified listings on RentTrustGh are reviewed for accuracy and identity. Look for the green verification badge and always ask for the exact address before committing.' },
        { icon:'🚩', q:'What if I suspect a fake or duplicate listing?', a:"Use the Report button on the listing page. We investigate every report and remove listings that don't meet our standards within 24 hours." },
        { icon:'💳', q:'Can I pay rent through RentTrustGh?', a:'RentTrustGh is a listing platform, not a payment processor. Always pay only after inspection and with a signed receipt from the landlord or agent.' },
        { icon:'📄', q:'What should I do before signing a tenancy agreement?', a:'Read every clause carefully. Confirm the rent, advance payment, notice period, and agreement duration. Never sign under pressure.' },
        { icon:'📣', q:'How do I report a problem with a listing or agent?', a:'Use our Report Issue page or contact support. Provide the listing ID, agent details, and any messages or receipts so our team can act fast.' },
        { icon:'🏠', q:'Can I list my property as an agent?', a:'Yes. Agents can create listings after registering and selecting a plan. Contact support if you need help with onboarding.' },
        { icon:'⏱', q:'How long does verification take?', a:'Most listings are reviewed within 1–2 business days after all required documents and photos are submitted.' },
        { icon:'⚠', q:"What happens if a landlord doesn't return my deposit?", a:'Document everything in writing before you move in. If there is a dispute, report it to us and we can flag the profile accordingly.' },
    ];

    return (
        <>
        <Head>
            <title>Frequently Asked Questions (FAQ) | RentTrustGh</title>
            
            {/* Primary Meta */}
            <meta
                name="description"
                content="Find answers to frequently asked questions about renting, verified property listings, landlords, agents, tenant safety, and RentTrustGh's services across Ghana."
            />
        
            <meta
                name="keywords"
                content="RentTrustGh FAQ, Ghana property FAQ, rental questions Ghana, tenant questions, landlord questions, verified property listings, Ghana real estate help, rental safety Ghana"
            />
        
            <meta name="robots" content="index,follow,max-image-preview:large" />
            
            {/* Canonical */}
            <link rel="canonical" href={window.location.href} />
            
            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="RentTrustGh" />
            <meta property="og:locale" content="en_GH" />
            
            <meta
                property="og:title"
                content="Frequently Asked Questions | RentTrustGh"
            />
        
            <meta
                property="og:description"
                content="Get answers to common questions about renting safely, verified listings, landlords, agents, and RentTrustGh."
            />
        
            <meta property="og:url" content={window.location.href} />
            
            <meta
                property="og:image"
                content="/images/seo/faq-og.jpg"
            />
        
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            
            <meta
                name="twitter:title"
                content="Frequently Asked Questions | RentTrustGh"
            />
        
            <meta
                name="twitter:description"
                content="Learn how RentTrustGh helps tenants find verified properties and rent safely across Ghana."
            />
        
            <meta
                name="twitter:image"
                content="/images/seo/faq-og.jpg"
            />
        
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "How do I know a listing is verified?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Verified listings on RentTrustGh are reviewed for accuracy and identity before they are published."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What if I suspect a fake listing?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Use the Report button on the listing page. Our team investigates every report and removes listings that violate our policies."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Can I pay rent through RentTrustGh?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "No. RentTrustGh is a property marketplace. Always inspect a property and obtain a receipt before making any payment."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How long does property verification take?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Most listings are verified within one to two business days after all required documents have been submitted."
                                }
                            }
                        ]
                    })
                }}
            />
        </Head>
            <style>{BASE_STYLE}</style>
            <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', backgroundColor:'hsl(40 33% 98%)' }}>
                <Header />
                <main style={{ flex:1 }}>
                    <MosaicHero
                        badge="FAQs"
                        title="Frequently asked"
                        highlight="questions."
                        sub="Common questions answered clearly so you can make safer decisions, avoid scams, and understand how RentTrustGh protects you."
                    />
                    <div style={{ maxWidth:'1080px', margin:'0 auto', padding:'clamp(2rem,6vw,4rem) clamp(0.75rem,3vw,1rem)' }}>
                        <div className="sp-grid" style={{ display:'flex', gap:'clamp(1.5rem,4vw,3rem)', alignItems:'flex-start' }}>

                            {/* ── Left ── */}
                            <div className="sp-main" style={{ flex:'1 1 0', display:'flex', flexDirection:'column', gap:'1.1rem' }}>
                                {faqs.map(f => (
                                    <div key={f.q} className="faq-card">
                                        <div style={{ display:'flex', gap:'0.875rem' }}>
                                            <span style={{ fontSize:'1.25rem', flexShrink:0, marginTop:1 }}>{f.icon}</span>
                                            <div>
                                                <h3 style={{ fontSize:'0.9375rem', fontWeight:700, color:'hsl(200 25% 15%)', marginBottom:'0.375rem' }}>{f.q}</h3>
                                                <p style={{ fontSize:'0.8375rem', color:'hsl(200 15% 45%)', lineHeight:1.65 }}>{f.a}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start', padding:'1.25rem 1.5rem', borderRadius:'1rem', background:'hsl(174 62% 32% / 0.07)', border:'1px solid hsl(174 62% 32% / 0.18)' }}>
                                    <span style={{ fontSize:'1.5rem', flexShrink:0 }}>💬</span>
                                    <div>
                                        <div style={{ fontWeight:700, fontSize:'0.9375rem', color:'hsl(174 62% 22%)', marginBottom:4 }}>Still have a question?</div>
                                        <p style={{ color:'hsl(200 15% 40%)', fontSize:'0.875rem', lineHeight:1.65 }}>
                                            If you can't find your answer here, visit our <Link href="/contact" style={{ color:'hsl(174 62% 30%)', fontWeight:600 }}>Contact page</Link> or submit a report. We're here to support every tenant in Ghana.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ── Right ── */}
                            <div className="sp-side" style={{ flex:'0 0 clamp(260px,30%,320px)', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                                <SmallCard>
                                    <h3 style={{ fontSize:'1rem', fontWeight:'700', color:'hsl(200 25% 15%)', marginBottom:'0.25rem' }}>Quick safety tips</h3>
                                    <p style={{ fontSize:'0.8375rem', color:'hsl(200 15% 50%)', marginBottom:'1.25rem' }}>Things every tenant should know.</p>
                                    {[
                                        { icon:'✓', t:'Always inspect before paying', col:'hsl(152 55% 35%)' },
                                        { icon:'✓', t:'Get everything in writing', col:'hsl(152 55% 35%)' },
                                        { icon:'✓', t:'Verify agent identity first', col:'hsl(152 55% 35%)' },
                                        { icon:'✓', t:'Never pay cash without a receipt', col:'hsl(152 55% 35%)' },
                                        { icon:'✓', t:'Report suspicious activity', col:'hsl(152 55% 35%)' },
                                    ].map(r => (
                                        <div key={r.t} style={{ display:'flex', gap:'0.625rem', alignItems:'center', padding:'0.625rem 0', borderBottom:'1px solid hsl(40 20% 92%)' }}>
                                            <span style={{ color:r.col, fontWeight:900, fontSize:'0.875rem', flexShrink:0 }}>{r.icon}</span>
                                            <span style={{ fontSize:'0.8375rem', color:'hsl(200 25% 22%)', fontWeight:500 }}>{r.t}</span>
                                        </div>
                                    ))}
                                </SmallCard>

                                <SmallCard>
                                    <h3 style={{ fontSize:'1rem', fontWeight:'700', color:'hsl(200 25% 15%)', marginBottom:'1rem' }}>About our platform</h3>
                                    {[
                                        { q:'Is RentTrustGh free to use?', a:'Free to browse and enquire. Pro plans unlock unlimited listings for agents.' },
                                        { q:'How do you verify listings?', a:'Our team physically confirms each property before it goes live on the platform.' },
                                        { q:'What areas do you cover?', a:"At the moment we're covering areas in Accra." },
                                    ].map(({q,a}) => <FaqItemSide key={q} q={q} a={a} />)}
                                </SmallCard>

                                <div style={{ borderRadius:'1.25rem', background:'linear-gradient(135deg,hsl(174 62% 22%) 0%,hsl(174 50% 32%) 100%)', padding:'1.5rem', color:'white' }}>
                                    <p style={{ fontWeight:'700', fontSize:'1rem', marginBottom:'0.375rem' }}>Find your next home</p>
                                    <p style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.7)', marginBottom:'1rem' }}>Browse thousands of verified listings across Ghana.</p>
                                    <Link href="/rent" style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'0.5rem 1.1rem', borderRadius:'0.5rem', backgroundColor:'hsl(38 92% 50%)', color:'hsl(200 25% 10%)', fontSize:'0.8125rem', fontWeight:'700', textDecoration:'none' }}>
                                        Browse Listings →
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