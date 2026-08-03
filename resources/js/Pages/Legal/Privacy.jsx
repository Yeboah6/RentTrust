import Header from '../../Components/Layouts/Header';
import Footer from '../../Components/Layouts/Footer';
import { Link, Head } from '@inertiajs/react';

const MosaicHero = ({ badge, title, highlight, sub }) => (
    <div style={{ position:'relative', overflow:'hidden', minHeight:'360px', display:'flex', alignItems:'center' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,hsl(152 60% 18%) 0%,hsl(152 50% 26%) 60%,hsl(152 44% 32%) 100%)', zIndex:0 }} />
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'56%', zIndex:1,
            display:'grid', gridTemplateColumns:'repeat(3,1fr)', gridTemplateRows:'repeat(3,1fr)', gap:'4px' }}>
            <div style={{ gridRow:'1/3', overflow:'hidden', background:'hsl(152 25% 18%)' }}><img src="/images/download 2.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(152 30% 14%)' }}><img src="/images/download 1.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(152 35% 12%)' }}><img src="/images/download 3.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} /></div>
            <div style={{ gridColumn:'2/4', overflow:'hidden', background:'hsl(152 28% 16%)' }}><img src="/images/download 4.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(152 22% 14%)' }}><img src="/images/download 5.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(152 18% 12%)' }}><img src="/images/download 1.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(152 15% 14%)' }}><img src="/images/download 2.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }} /></div>
        </div>
        <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', opacity:0.06, backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize:'28px 28px' }} />
        <div style={{ position:'absolute', inset:0, zIndex:2, background:'linear-gradient(to right,hsl(152 60% 18% / 0.98) 0%,hsl(152 55% 18% / 0.88) 38%,hsl(152 50% 18% / 0.45) 70%,hsl(152 50% 18% / 0.15) 100%)' }} />
        <div style={{ position:'relative', zIndex:3, padding:'clamp(2.5rem,7vw,4.5rem) clamp(1rem,4vw,2.5rem)', maxWidth:'560px' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'5px 14px', borderRadius:'999px', background:'rgba(255,255,255,0.14)', border:'1px solid rgba(255,255,255,0.22)', color:'rgba(255,255,255,0.9)', fontSize:'13px', fontWeight:'600', marginBottom:'1.25rem' }}>
                <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'hsl(152 70% 60%)', animation:'pulse 2s ease infinite', flexShrink:0 }} />{badge}
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
@media(max-width:768px){.sp-grid{flex-direction:column!important}}
`;

export default function PrivacyPage() {
    const sections = [
        { icon:'📋', title:'What we collect', accent:'hsl(174 62% 28%)',
          items:['Name, email, and phone number when you register','Listing information you submit as an agent','Device and browser data for security','Messages sent through our platform'] },
        { icon:'⚙', title:'How we use your data', accent:'hsl(174 62% 28%)',
          items:['Deliver and improve the RentTrustGh service','Verify agent and listing accuracy','Send relevant notifications and updates','Detect and prevent fraud or abuse'] },
        { icon:'🤝', title:'Sharing and disclosure', accent:'hsl(174 62% 28%)',
          items:['Trusted service providers under strict agreements','Authorities only when required by law','No advertising networks or data brokers','No selling of personal information — ever'] },
        { icon:'⭐', title:'Your rights', accent:'hsl(174 62% 28%)',
          items:['Request a copy of your personal data','Correct any inaccurate information','Delete your account and associated data','Withdraw consent at any time'] },
        { icon:'🍪', title:'Cookies', accent:'hsl(174 62% 28%)',
          items:['Essential session and authentication cookies','Analytics to improve site performance','No third-party advertising cookies','You can manage cookies in your browser'] },
        { icon:'🔒', title:'Data security', accent:'hsl(174 62% 28%)',
          items:['HTTPS encryption on all pages','Regular security audits and reviews','Strict access controls for our team','Data stored securely with backup protection'] },
    ];

    return (
        <>
        <Head>
            <title>Privacy Policy | How RentTrustGh Protects Your Data</title>
            
            {/* Primary Meta */}
            <meta
                name="description"
                content="Read the RentTrustGh Privacy Policy to understand what information we collect, how we use it, how we protect your data, and the privacy rights available to users in Ghana."
            />
        
            <meta
                name="keywords"
                content="RentTrustGh privacy policy, data protection Ghana, property platform privacy, tenant data privacy, landlord data privacy, personal information Ghana, RentTrustGh data security"
            />
        
            <meta
                name="robots"
                content="index,follow,max-image-preview:large"
            />
        
            <meta
                name="googlebot"
                content="index,follow"
            />
        
            {/* Canonical */}
            <link
                rel="canonical"
                href="https://renttrustgh.com/privacy"
            />
        
            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="RentTrustGh" />
            <meta property="og:locale" content="en_GH" />
            
            <meta
                property="og:title"
                content="Privacy Policy | RentTrustGh"
            />
        
            <meta
                property="og:description"
                content="Learn how RentTrustGh collects, uses, stores, and protects personal information while providing property marketplace services across Ghana."
            />
        
            <meta
                property="og:url"
                content="https://renttrustgh.com/privacy"
            />
        
            <meta
                property="og:image"
                content="https://renttrustgh.com/images/seo/privacy-og.jpg"
            />
        
            {/* Twitter */}
            <meta
                name="twitter:card"
                content="summary_large_image"
            />
        
            <meta
                name="twitter:title"
                content="Privacy Policy | RentTrustGh"
            />
        
            <meta
                name="twitter:description"
                content="Understand how RentTrustGh handles personal information and protects the privacy of tenants, agents, landlords, and visitors."
            />
        
            <meta
                name="twitter:image"
                content="https://renttrustgh.com/images/seo/privacy-og.jpg"
            />
        
            {/* Privacy Policy Schema */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    name: "RentTrustGh Privacy Policy",
                    url: "https://renttrustgh.com/privacy",
                    description:
                        "The RentTrustGh Privacy Policy explains how personal information is collected, used, shared, stored, and protected.",
                    dateModified: "2026-04-01",
                    isPartOf: {
                        "@type": "WebSite",
                        name: "RentTrustGh",
                        url: "https://renttrustgh.com"
                    },
                    publisher: {
                        "@type": "Organization",
                        name: "RentTrustGh",
                        url: "https://renttrustgh.com",
                        logo: {
                            "@type": "ImageObject",
                            url: "https://renttrustgh.com/images/rent-trust.png"
                        }
                    },
                    about: [
                        {
                            "@type": "Thing",
                            name: "Privacy"
                        },
                        {
                            "@type": "Thing",
                            name: "Personal Data Protection"
                        },
                        {
                            "@type": "Thing",
                            name: "User Data Security"
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
                            name: "Privacy Policy",
                            item: "https://renttrustgh.com/privacy"
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
                        badge="Privacy Policy"
                        title="How we collect, use"
                        highlight="and protect your data."
                        sub="We only use the information required to keep listings accurate, protect users, and improve the RentTrustGh experience."
                    />
                    <div style={{ maxWidth:'1080px', margin:'0 auto', padding:'clamp(2rem,6vw,4rem) clamp(0.75rem,3vw,1rem)' }}>
                        <div className="sp-grid" style={{ display:'flex', gap:'clamp(1.5rem,4vw,3rem)', alignItems:'flex-start' }}>

                            {/* ── Left ── */}
                            <div className="sp-main" style={{ flex:'1 1 0', display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                                <Card>
                                    <div style={{ marginBottom:'1.5rem' }}>
                                        <h2 style={{ fontSize:'clamp(1.25rem,3vw,1.5rem)', fontWeight:'700', color:'hsl(200 25% 15%)', marginBottom:'0.375rem' }}>Our privacy commitments</h2>
                                        <p style={{ color:'hsl(200 15% 50%)', fontSize:'0.9rem' }}>We respect your privacy. Here's exactly how we handle your data.</p>
                                    </div>
                                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1rem' }}>
                                        {sections.map(s => (
                                            <div key={s.title} style={{ border:'1px solid hsl(40 20% 88%)', borderRadius:'1rem', padding:'1.25rem', background:'white' }}>
                                                <div style={{ display:'flex', alignItems:'center', gap:'0.625rem', marginBottom:'0.875rem' }}>
                                                    <span style={{ fontSize:'1.25rem' }}>{s.icon}</span>
                                                    <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'hsl(200 25% 15%)', margin:0 }}>{s.title}</h3>
                                                </div>
                                                <ul style={{ margin:0, paddingLeft:'1.1rem' }}>
                                                    {s.items.map(i => <li key={i} style={{ fontSize:'0.8125rem', color:'hsl(200 15% 45%)', marginBottom:'0.35rem', lineHeight:1.55 }}>{i}</li>)}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start', padding:'1.25rem 1.5rem', borderRadius:'1rem',
                                    background:'hsl(174 62% 32% / 0.07)', border:'1px solid hsl(174 62% 32% / 0.18)' }}>
                                    <span style={{ fontSize:'1.25rem', flexShrink:0 }}>📬</span>
                                    <div>
                                        <div style={{ fontWeight:700, fontSize:'0.9375rem', color:'hsl(174 62% 22%)', marginBottom:4 }}>Questions about your privacy?</div>
                                        <p style={{ color:'hsl(200 15% 40%)', fontSize:'0.875rem', lineHeight:1.65 }}>
                                            If you have questions or want to update your information, contact our support team and we'll respond as quickly as possible. Last updated: April 2026.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ── Right ── */}
                            <div className="sp-side" style={{ flex:'0 0 clamp(260px,30%,320px)', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                                <SmallCard>
                                    <h3 style={{ fontSize:'1rem', fontWeight:'700', color:'hsl(200 25% 15%)', marginBottom:'0.25rem' }}>Our promise to you</h3>
                                    <p style={{ fontSize:'0.8375rem', color:'hsl(200 15% 50%)', marginBottom:'1.25rem' }}>What we will never do with your data.</p>
                                    {[
                                        { icon:'✕', t:'No selling your data', d:'We never sell personal information to third parties.' },
                                        { icon:'✕', t:'No advertising tracking', d:'We use no advertising cookies or tracking pixels.' },
                                        { icon:'✕', t:'No sharing without consent', d:'Your data is only shared when legally required.' },
                                        { icon:'✕', t:'No spam', d:'We only contact you about your account or listings.' },
                                    ].map(r => (
                                        <div key={r.t} style={{ display:'flex', gap:'0.75rem', padding:'0.875rem 0', borderBottom:'1px solid hsl(40 20% 92%)' }}>
                                            <span style={{ color:'hsl(0 65% 50%)', fontWeight:900, fontSize:'0.875rem', flexShrink:0, marginTop:2 }}>{r.icon}</span>
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
                                        { q:'Can I delete my account?', a:'Yes. Contact support and we will delete your account and all associated data within 7 days.' },
                                        { q:'Who can see my contact info?', a:'Only verified agents you enquire with and our internal team can see your contact details.' },
                                        { q:'How long do you keep data?', a:'We retain your data for as long as your account is active, plus a 90-day grace period.' },
                                    ].map(({q,a}) => <FaqItem key={q} q={q} a={a} />)}
                                </SmallCard>

                                <div style={{ borderRadius:'1.25rem', background:'linear-gradient(135deg,hsl(174 62% 22%) 0%,hsl(174 50% 32%) 100%)', padding:'1.5rem', color:'white' }}>
                                    <p style={{ fontWeight:'700', fontSize:'1rem', marginBottom:'0.375rem' }}>Have a privacy concern?</p>
                                    <p style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.7)', marginBottom:'1rem' }}>Our team responds to all privacy requests within 48 hours.</p>
                                    <Link href="/contact" style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'0.5rem 1.1rem', borderRadius:'0.5rem', backgroundColor:'hsl(38 92% 50%)', color:'hsl(200 25% 10%)', fontSize:'0.8125rem', fontWeight:'700', textDecoration:'none' }}>
                                        Contact Us →
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