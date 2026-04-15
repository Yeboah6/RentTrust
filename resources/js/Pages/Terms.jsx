import Header from '../Components/Layouts/Header';
import Footer from '../Components/Layouts/Footer';
import { Link } from '@inertiajs/react';

const MosaicHero = ({ badge, title, highlight, sub }) => (
    <div style={{ position:'relative', overflow:'hidden', minHeight:'360px', display:'flex', alignItems:'center' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,hsl(200 28% 14%) 0%,hsl(200 22% 22%) 60%,hsl(200 18% 28%) 100%)', zIndex:0 }} />
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'56%', zIndex:1,
            display:'grid', gridTemplateColumns:'repeat(3,1fr)', gridTemplateRows:'repeat(3,1fr)', gap:'4px' }}>
            <div style={{ gridRow:'1/3', overflow:'hidden', background:'hsl(200 25% 14%)' }}><img src="/images/download 2.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(200 30% 12%)' }}><img src="/images/download 1.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(200 35% 10%)' }}><img src="/images/download 3.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ gridColumn:'2/4', overflow:'hidden', background:'hsl(200 28% 12%)' }}><img src="/images/download 4.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(200 22% 10%)' }}><img src="/images/download 5.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(200 18% 10%)' }}><img src="/images/download 1.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(200 15% 12%)' }}><img src="/images/download 2.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
        </div>
        <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', opacity:0.06, backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize:'28px 28px' }} />
        <div style={{ position:'absolute', inset:0, zIndex:2, background:'linear-gradient(to right,hsl(200 28% 14% / 0.98) 0%,hsl(200 25% 14% / 0.88) 38%,hsl(200 22% 14% / 0.45) 70%,hsl(200 22% 14% / 0.15) 100%)' }} />
        <div style={{ position:'relative', zIndex:3, padding:'clamp(2.5rem,7vw,4.5rem) clamp(1rem,4vw,2.5rem)', maxWidth:'560px' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'5px 14px', borderRadius:'999px', background:'rgba(255,255,255,0.14)', border:'1px solid rgba(255,255,255,0.22)', color:'rgba(255,255,255,0.9)', fontSize:'13px', fontWeight:'600', marginBottom:'1.25rem' }}>
                <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'hsl(200 70% 62%)', animation:'pulse 2s ease infinite', flexShrink:0 }} />{badge}
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
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
* { font-family:'Plus Jakarta Sans',system-ui,sans-serif; box-sizing:border-box; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
@keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
.sp-main { animation:fadeUp 0.6s ease 0.1s both; }
.sp-side { animation:fadeUp 0.6s ease 0.2s both; }
@media(max-width:768px){.sp-grid{flex-direction:column!important}}
`;

export default function TermsPage() {
    const terms = [
        { n:'01', title:'Using the platform', body:'RentTrust is a property listing marketplace. You may browse, search and contact agents, but you must act responsibly and provide accurate information at all times.',
          items:['No creating false accounts or listings','Treat all users with respect','No scraping or copying our content'] },
        { n:'02', title:'Listing accuracy', body:'Agents and landlords must provide truthful details. If a listing is false or misleading, report it immediately so we can remove it.',
          items:['Photos must match the actual property','Prices must reflect what is charged','Location must be correct and verifiable'] },
        { n:'03', title:'Responsible behaviour', body:'Do not harass other users, post fraudulent information, or misrepresent yourself. Abusive or illegal activity may lead to account suspension.',
          items:['No threats or harassment','No impersonation of agents or landlords','No illegal listing content'] },
        { n:'04', title:'Payments and fees', body:'RentTrust does not process rental payments directly. You are responsible for all payments agreed with the landlord or agent outside the platform.',
          items:['Always get a receipt for payments made','Confirm payment terms in writing','RentTrust is not liable for off-platform transactions'] },
        { n:'05', title:'Intellectual property', body:'All content on RentTrust, including logos, text, and design, is owned by RentTrust and may not be reused without written permission.',
          items:['Do not copy or reproduce our content','Do not use our brand without permission','User-submitted content remains your own'] },
        { n:'06', title:'Changes to these terms', body:'We may update these terms from time to time. Continued use of the platform after changes means you accept the new terms.',
          items:['Changes are announced on the platform','Major changes are communicated by email','Last updated: April 2026'] },
    ];

    return (
        <>
            <style>{BASE_STYLE}</style>
            <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', backgroundColor:'hsl(40 33% 98%)' }}>
                <Header />
                <main style={{ flex:1 }}>
                    <MosaicHero
                        badge="Terms of Service"
                        title="How RentTrust works"
                        highlight="and what you agree to."
                        sub="These terms explain your rights, responsibilities and the rules for using RentTrust to browse, list, verify and report rental properties."
                    />
                    <div style={{ maxWidth:'1080px', margin:'0 auto', padding:'clamp(2rem,6vw,4rem) clamp(0.75rem,3vw,1rem)' }}>
                        <div className="sp-grid" style={{ display:'flex', gap:'clamp(1.5rem,4vw,3rem)', alignItems:'flex-start' }}>

                            {/* ── Left ── */}
                            <div className="sp-main" style={{ flex:'1 1 0', display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                                <Card>
                                    <div style={{ marginBottom:'1.5rem' }}>
                                        <h2 style={{ fontSize:'clamp(1.25rem,3vw,1.5rem)', fontWeight:'700', color:'hsl(200 25% 15%)', marginBottom:'0.375rem' }}>Terms of Service</h2>
                                        <p style={{ color:'hsl(200 15% 50%)', fontSize:'0.9rem' }}>By using RentTrust you agree to the following terms. Please read them carefully.</p>
                                    </div>
                                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1rem' }}>
                                        {terms.map(t => (
                                            <div key={t.n} style={{ border:'1px solid hsl(40 20% 88%)', borderRadius:'1rem', padding:'1.25rem', background:'white' }}>
                                                <div style={{ display:'flex', alignItems:'center', gap:'0.625rem', marginBottom:'0.875rem' }}>
                                                    <span style={{ width:28, height:28, borderRadius:'50%', background:'hsl(200 28% 18%)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:800, flexShrink:0 }}>{t.n}</span>
                                                    <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'hsl(200 25% 15%)', margin:0 }}>{t.title}</h3>
                                                </div>
                                                <p style={{ fontSize:'0.8125rem', color:'hsl(200 15% 42%)', lineHeight:1.65, marginBottom:'0.75rem' }}>{t.body}</p>
                                                <ul style={{ margin:0, paddingLeft:'1.1rem' }}>
                                                    {t.items.map(i => <li key={i} style={{ fontSize:'0.775rem', color:'hsl(200 15% 48%)', marginBottom:'0.3rem', lineHeight:1.5 }}>{i}</li>)}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start', padding:'1.25rem 1.5rem', borderRadius:'1rem', background:'hsl(174 62% 32% / 0.07)', border:'1px solid hsl(174 62% 32% / 0.18)' }}>
                                    <span style={{ fontSize:'1.25rem', flexShrink:0 }}>⚖</span>
                                    <div>
                                        <div style={{ fontWeight:700, fontSize:'0.9375rem', color:'hsl(174 62% 22%)', marginBottom:4 }}>By using RentTrust, you agree to these terms.</div>
                                        <p style={{ color:'hsl(200 15% 40%)', fontSize:'0.875rem', lineHeight:1.65 }}>
                                            If you disagree with any part of these terms, please stop using the platform and <Link href="/contact" style={{ color:'hsl(174 62% 30%)', fontWeight:600 }}>contact our support team</Link>. We're happy to answer any questions about our policies.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ── Right ── */}
                            <div className="sp-side" style={{ flex:'0 0 clamp(260px,30%,320px)', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                                <SmallCard>
                                    <h3 style={{ fontSize:'1rem', fontWeight:'700', color:'hsl(200 25% 15%)', marginBottom:'0.25rem' }}>Your key rights</h3>
                                    <p style={{ fontSize:'0.8375rem', color:'hsl(200 15% 50%)', marginBottom:'1.25rem' }}>As a RentTrust user, you are always entitled to:</p>
                                    {[
                                        { icon:'✓', t:'Browse listings for free', col:'hsl(152 55% 35%)' },
                                        { icon:'✓', t:'Read all agent reviews', col:'hsl(152 55% 35%)' },
                                        { icon:'✓', t:'Report any suspicious listing', col:'hsl(152 55% 35%)' },
                                        { icon:'✓', t:'Request deletion of your data', col:'hsl(152 55% 35%)' },
                                        { icon:'✓', t:'Appeal any account decision', col:'hsl(152 55% 35%)' },
                                    ].map(r => (
                                        <div key={r.t} style={{ display:'flex', gap:'0.625rem', alignItems:'center', padding:'0.625rem 0', borderBottom:'1px solid hsl(40 20% 92%)' }}>
                                            <span style={{ color:r.col, fontWeight:900, fontSize:'0.875rem', flexShrink:0 }}>{r.icon}</span>
                                            <span style={{ fontSize:'0.8375rem', color:'hsl(200 25% 22%)', fontWeight:500 }}>{r.t}</span>
                                        </div>
                                    ))}
                                </SmallCard>

                                <SmallCard>
                                    <h3 style={{ fontSize:'1rem', fontWeight:'700', color:'hsl(200 25% 15%)', marginBottom:'1rem' }}>Common questions</h3>
                                    {[
                                        { q:'Can I use RentTrust content?', a:'Personal and non-commercial use is fine. Reproducing or redistributing our content commercially requires written permission.' },
                                        { q:'What happens if I break the rules?', a:'We may suspend or permanently remove accounts that violate our terms, with or without prior notice.' },
                                        { q:'How are disputes handled?', a:"Disputes between tenants and landlords are handled outside of RentTrust. We're here to help facilitate, not adjudicate." },
                                    ].map(({q,a}) => <FaqItem key={q} q={q} a={a} />)}
                                </SmallCard>

                                <div style={{ borderRadius:'1.25rem', background:'linear-gradient(135deg,hsl(174 62% 22%) 0%,hsl(174 50% 32%) 100%)', padding:'1.5rem', color:'white' }}>
                                    <p style={{ fontWeight:'700', fontSize:'1rem', marginBottom:'0.375rem' }}>Questions about our terms?</p>
                                    <p style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.7)', marginBottom:'1rem' }}>Our team is happy to explain any part of our Terms of Service.</p>
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