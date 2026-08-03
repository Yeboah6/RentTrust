import Header from '../../Components/Layouts/Header';
import Footer from '../../Components/Layouts/Footer';
import { Link, Head } from '@inertiajs/react';

const MosaicHero = ({ badge, title, highlight, sub }) => (
    <div style={{ position:'relative', overflow:'hidden', minHeight:'360px', display:'flex', alignItems:'center' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,hsl(0 60% 22%) 0%,hsl(0 52% 30%) 60%,hsl(0 45% 36%) 100%)', zIndex:0 }} />
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'56%', zIndex:1,
            display:'grid', gridTemplateColumns:'repeat(3,1fr)', gridTemplateRows:'repeat(3,1fr)', gap:'4px' }}>
            <div style={{ gridRow:'1/3', overflow:'hidden', background:'hsl(0 25% 18%)' }}><img src="/images/download 2.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(0 30% 14%)' }}><img src="/images/download 1.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(0 35% 12%)' }}><img src="/images/download 3.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ gridColumn:'2/4', overflow:'hidden', background:'hsl(0 28% 16%)' }}><img src="/images/download 4.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(0 22% 14%)' }}><img src="/images/download 5.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(0 18% 12%)' }}><img src="/images/download 1.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(0 15% 14%)' }}><img src="/images/download 2.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
        </div>
        <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', opacity:0.06, backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize:'28px 28px' }} />
        <div style={{ position:'absolute', inset:0, zIndex:2, background:'linear-gradient(to right,hsl(0 60% 22% / 0.98) 0%,hsl(0 55% 22% / 0.88) 38%,hsl(0 50% 22% / 0.45) 70%,hsl(0 50% 22% / 0.15) 100%)' }} />
        <div style={{ position:'relative', zIndex:3, padding:'clamp(2.5rem,7vw,4.5rem) clamp(1rem,4vw,2.5rem)', maxWidth:'560px' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'5px 14px', borderRadius:'999px', background:'rgba(255,255,255,0.14)', border:'1px solid rgba(255,255,255,0.22)', color:'rgba(255,255,255,0.9)', fontSize:'13px', fontWeight:'600', marginBottom:'1.25rem' }}>
                <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'hsl(0 72% 65%)', animation:'pulse 2s ease infinite', flexShrink:0 }} />{badge}
            </div>
            <h1 style={{ color:'white', fontSize:'clamp(2rem,5vw,3.25rem)', fontWeight:'800', lineHeight:'1.1', marginBottom:'1rem', letterSpacing:'-0.02em' }}>
                {title}<br />{highlight && <span style={{ color:'hsl(40 90% 70%)' }}>{highlight}</span>}
            </h1>
            <p style={{ color:'rgba(255,255,255,0.72)', fontSize:'clamp(0.9rem,2.2vw,1.1rem)', lineHeight:'1.6', maxWidth:'420px' }}>{sub}</p>
        </div>
    </div>
);

const Card = ({ children, style={} }) => (
    <div style={{ backgroundColor:'white', borderRadius:'1.25rem', border:'1px solid hsl(40 20% 88%)', padding:'clamp(1.5rem,4vw,2.5rem)', boxShadow:'0 4px 32px hsl(200 25% 15% / 0.07)', ...style }}>{children}</div>
);
const SmallCard = ({ children, style={} }) => (
    <div style={{ backgroundColor:'white', borderRadius:'1.25rem', border:'1px solid hsl(40 20% 88%)', padding:'1.5rem', boxShadow:'0 4px 32px hsl(200 25% 15% / 0.06)', ...style }}>{children}</div>
);
const FaqItem = ({ q, a }) => (
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
.report-type { border:1px solid hsl(40 20% 88%); border-radius:0.875rem; padding:1rem; background:white; display:flex; gap:0.75rem; align-items:flex-start; transition:border-color 0.2s; }
.report-type:hover { border-color:hsl(0 65% 50% / 0.3); }
@media(max-width:768px){.sp-grid{flex-direction:column!important}}
`;

export default function ReportPage() {
    const types = [
        { icon:'👻', label:'Fake listing', detail:"Property doesn't exist or photos are stolen from elsewhere." },
        { icon:'💰', label:'Inflated pricing', detail:'Listed price is significantly above fair market rate.' },
        { icon:'🖼', label:'Misleading photos', detail:"Photos don't match the actual property condition." },
        { icon:'🤥', label:'Fraudulent agent', detail:'Agent identity is false, unverifiable, or impersonating someone.' },
        { icon:'📍', label:'Wrong location', detail:'Address or map pin is incorrect or misleading.' },
        { icon:'⚠', label:'Unsafe conditions', detail:'Property poses a health or safety risk not disclosed in the listing.' },
    ];

    return (
        <>
        <Head>
            <title>Report Suspicious Listings & Fraud | RentTrustGh</title>

            {/* Primary Meta */}
            <meta
                name="description"
                content="Report fake property listings, fraudulent agents, misleading advertisements, scams, and unsafe rental experiences on RentTrustGh. Help us keep Ghana's property marketplace safe."
            />

            <meta
                name="keywords"
                content="Report property scam Ghana, fake property listings, report landlord Ghana, report agent Ghana, rental fraud Ghana, report suspicious listing, RentTrustGh report, Ghana property safety"
            />

            <meta
                name="robots"
                content="index,follow,max-image-preview:large"
            />

            {/* Canonical */}
            <link rel="canonical" href={window.location.href} />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="RentTrustGh" />
            <meta property="og:locale" content="en_GH" />

            <meta
                property="og:title"
                content="Report Suspicious Listings | RentTrustGh"
            />

            <meta
                property="og:description"
                content="Help protect Ghana's property community by reporting fake listings, fraudulent agents, misleading information, or unsafe rental experiences."
            />

            <meta
                property="og:url"
                content={window.location.href}
            />

            <meta
                property="og:image"
                content="/images/seo/report-og.jpg"
            />

            {/* Twitter */}
            <meta
                name="twitter:card"
                content="summary_large_image"
            />

            <meta
                name="twitter:title"
                content="Report Suspicious Listings | RentTrustGh"
            />

            <meta
                name="twitter:description"
                content="Report fake listings, scams, and unsafe rental experiences to help make RentTrustGh safer for everyone."
            />

            <meta
                name="twitter:image"
                content="/images/seo/report-og.jpg"
            />

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Report Suspicious Listings",
                        "description": "Report fake property listings, fraudulent agents, scams, and unsafe rental experiences on RentTrustGh.",
                        "url": window.location.href,
                        "isPartOf": {
                            "@type": "WebSite",
                            "name": "RentTrustGh",
                            "url": "https://renttrustgh.com"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "RentTrustGh",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://renttrustgh.com/images/rent-trust.jpg"
                            }
                        },
                        "about": {
                            "@type": "Thing",
                            "name": "Property Fraud Reporting"
                        }
                    })
                }}
            />
        </Head>
            <style>{BASE_STYLE}</style>
            <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', backgroundColor:'hsl(40 33% 98%)' }}>
                <Header />
                <main style={{ flex:1 }}>
                    <MosaicHero
                        badge="Report Issue"
                        title="Report suspicious listings"
                        highlight="or unsafe experiences."
                        sub="If something doesn't look right, tell us. The more detail you provide, the faster we can investigate and protect other users."
                    />
                    <div style={{ maxWidth:'1080px', margin:'0 auto', padding:'clamp(2rem,6vw,4rem) clamp(0.75rem,3vw,1rem)' }}>
                        <div className="sp-grid" style={{ display:'flex', gap:'clamp(1.5rem,4vw,3rem)', alignItems:'flex-start' }}>

                            {/* ── Left ── */}
                            <div className="sp-main" style={{ flex:'1 1 0', display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                                <Card>
                                    <div style={{ marginBottom:'1.5rem' }}>
                                        <h2 style={{ fontSize:'clamp(1.25rem,3vw,1.5rem)', fontWeight:'700', color:'hsl(200 25% 15%)', marginBottom:'0.375rem' }}>What you can report</h2>
                                        <p style={{ color:'hsl(200 15% 50%)', fontSize:'0.9rem' }}>Use the Report button on any listing, or contact us directly.</p>
                                    </div>
                                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'0.875rem' }}>
                                        {types.map(t => (
                                            <div key={t.label} className="report-type">
                                                <span style={{ fontSize:'1.25rem', flexShrink:0, marginTop:1 }}>{t.icon}</span>
                                                <div>
                                                    <div style={{ fontWeight:700, fontSize:'0.875rem', color:'hsl(200 25% 18%)', marginBottom:3 }}>{t.label}</div>
                                                    <div style={{ fontSize:'0.775rem', color:'hsl(200 15% 52%)', lineHeight:1.55 }}>{t.detail}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1rem' }}>
                                    <Card style={{ padding:'1.5rem' }}>
                                        <h3 style={{ fontSize:'1rem', fontWeight:700, color:'hsl(0 55% 36%)', marginBottom:'0.625rem' }}>What to include</h3>
                                        <p style={{ fontSize:'0.8375rem', color:'hsl(200 15% 45%)', lineHeight:1.65, marginBottom:'0.75rem' }}>Provide as much detail as possible so our team can act quickly.</p>
                                        <ul style={{ margin:0, paddingLeft:'1.1rem' }}>
                                            {['Link to the listing or listing ID','Agent name and phone number','Property address and location','Any conversations or receipts','Screenshots or photos if available'].map(i => (
                                                <li key={i} style={{ fontSize:'0.8125rem', color:'hsl(200 15% 42%)', marginBottom:'0.35rem', lineHeight:1.5 }}>{i}</li>
                                            ))}
                                        </ul>
                                    </Card>
                                    <Card style={{ padding:'1.5rem' }}>
                                        <h3 style={{ fontSize:'1rem', fontWeight:700, color:'hsl(0 55% 36%)', marginBottom:'0.625rem' }}>What happens next</h3>
                                        <p style={{ fontSize:'0.8375rem', color:'hsl(200 15% 45%)', lineHeight:1.65, marginBottom:'0.75rem' }}>Our team acts on every report.</p>
                                        <ul style={{ margin:0, paddingLeft:'1.1rem' }}>
                                            {['Review the case within 24 hours','Reach out for clarification if needed','Remove or flag dangerous listings','Block repeat offenders','Update you on the outcome'].map(i => (
                                                <li key={i} style={{ fontSize:'0.8125rem', color:'hsl(200 15% 42%)', marginBottom:'0.35rem', lineHeight:1.5 }}>{i}</li>
                                            ))}
                                        </ul>
                                    </Card>
                                </div>

                                <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start', padding:'1.25rem 1.5rem', borderRadius:'1rem', background:'hsl(0 65% 50% / 0.07)', border:'1px solid hsl(0 65% 50% / 0.2)' }}>
                                    <span style={{ fontSize:'1.25rem', flexShrink:0 }}>🚨</span>
                                    <div>
                                        <div style={{ fontWeight:700, fontSize:'0.9rem', color:'hsl(0 55% 36%)', marginBottom:4 }}>Suspected fraud or money lost?</div>
                                        <p style={{ color:'hsl(200 15% 40%)', fontSize:'0.875rem', lineHeight:1.65 }}>
                                            We do not accept payment requests through the report form. If you have paid money and suspect fraud, <Link href="/contact" style={{ color:'hsl(174 62% 30%)', fontWeight:600 }}>contact our support team immediately</Link>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ── Right ── */}
                            <div className="sp-side" style={{ flex:'0 0 clamp(260px,30%,320px)', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                                <SmallCard>
                                    <h3 style={{ fontSize:'1rem', fontWeight:'700', color:'hsl(200 25% 15%)', marginBottom:'0.25rem' }}>Red flags to watch for</h3>
                                    <p style={{ fontSize:'0.8375rem', color:'hsl(200 15% 50%)', marginBottom:'1.25rem' }}>These are signs of a suspicious listing.</p>
                                    {[
                                        { icon:'✕', t:'Asked to pay before viewing', col:'hsl(0 65% 50%)' },
                                        { icon:'✕', t:'Agent refuses to give address', col:'hsl(0 65% 50%)' },
                                        { icon:'✕', t:'Price far below market rate', col:'hsl(0 65% 50%)' },
                                        { icon:'✕', t:'Pressure to pay immediately', col:'hsl(0 65% 50%)' },
                                        { icon:'✕', t:'Stock or mismatched photos', col:'hsl(0 65% 50%)' },
                                        { icon:'✕', t:'No written agreement offered', col:'hsl(0 65% 50%)' },
                                    ].map(r => (
                                        <div key={r.t} style={{ display:'flex', gap:'0.625rem', alignItems:'center', padding:'0.625rem 0', borderBottom:'1px solid hsl(40 20% 92%)' }}>
                                            <span style={{ color:r.col, fontWeight:900, fontSize:'0.875rem', flexShrink:0 }}>{r.icon}</span>
                                            <span style={{ fontSize:'0.8125rem', color:'hsl(200 25% 22%)', fontWeight:500 }}>{r.t}</span>
                                        </div>
                                    ))}
                                </SmallCard>

                                <SmallCard>
                                    <h3 style={{ fontSize:'1rem', fontWeight:'700', color:'hsl(200 25% 15%)', marginBottom:'1rem' }}>Common questions</h3>
                                    {[
                                        { q:'Is my report anonymous?', a:'Reports are handled confidentially. Your identity is not shared with the reported party.' },
                                        { q:'How long does a review take?', a:'Our team reviews all reports within 24 hours, often faster for urgent cases.' },
                                        { q:'What if my report is wrong?', a:"No action is taken without investigation. If a listing is clean, we'll let you know." },
                                    ].map(({q,a}) => <FaqItem key={q} q={q} a={a} />)}
                                </SmallCard>

                                <div style={{ borderRadius:'1.25rem', background:'linear-gradient(135deg,hsl(174 62% 22%) 0%,hsl(174 50% 32%) 100%)', padding:'1.5rem', color:'white' }}>
                                    <p style={{ fontWeight:'700', fontSize:'1rem', marginBottom:'0.375rem' }}>See something suspicious?</p>
                                    <p style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.7)', marginBottom:'1rem' }}>Use the Report button on any listing page to flag it immediately.</p>
                                    <Link href="/contact" style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'0.5rem 1.1rem', borderRadius:'0.5rem', backgroundColor:'hsl(38 92% 50%)', color:'hsl(200 25% 10%)', fontSize:'0.8125rem', fontWeight:'700', textDecoration:'none' }}>
                                        Contact Support →
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