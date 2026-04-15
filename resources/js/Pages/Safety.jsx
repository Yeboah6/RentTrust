import Header from '../Components/Layouts/Header';
import Footer from '../Components/Layouts/Footer';
import { Link } from '@inertiajs/react';

const MosaicHero = ({ badge, title, highlight, sub }) => (
    <div style={{ position:'relative', overflow:'hidden', minHeight:'360px', display:'flex', alignItems:'center' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,hsl(38 85% 28%) 0%,hsl(38 75% 36%) 60%,hsl(38 65% 42%) 100%)', zIndex:0 }} />
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'56%', zIndex:1,
            display:'grid', gridTemplateColumns:'repeat(3,1fr)', gridTemplateRows:'repeat(3,1fr)', gap:'4px' }}>
            <div style={{ gridRow:'1/3', overflow:'hidden', background:'hsl(38 25% 18%)' }}><img src="/images/download 2.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(38 30% 14%)' }}><img src="/images/download 1.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(38 35% 12%)' }}><img src="/images/download 3.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ gridColumn:'2/4', overflow:'hidden', background:'hsl(38 28% 16%)' }}><img src="/images/download 4.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(38 22% 14%)' }}><img src="/images/download 5.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(38 18% 12%)' }}><img src="/images/download 1.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
            <div style={{ overflow:'hidden', background:'hsl(38 15% 14%)' }}><img src="/images/download 2.jfif" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.72 }} /></div>
        </div>
        <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', opacity:0.06, backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize:'28px 28px' }} />
        <div style={{ position:'absolute', inset:0, zIndex:2, background:'linear-gradient(to right,hsl(38 85% 28% / 0.98) 0%,hsl(38 80% 28% / 0.88) 38%,hsl(38 75% 28% / 0.45) 70%,hsl(38 75% 28% / 0.15) 100%)' }} />
        <div style={{ position:'relative', zIndex:3, padding:'clamp(2.5rem,7vw,4.5rem) clamp(1rem,4vw,2.5rem)', maxWidth:'560px' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'5px 14px', borderRadius:'999px', background:'rgba(255,255,255,0.14)', border:'1px solid rgba(255,255,255,0.22)', color:'rgba(255,255,255,0.9)', fontSize:'13px', fontWeight:'600', marginBottom:'1.25rem' }}>
                <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'hsl(38 92% 65%)', animation:'pulse 2s ease infinite', flexShrink:0 }} />{badge}
            </div>
            <h1 style={{ color:'white', fontSize:'clamp(2rem,5vw,3.25rem)', fontWeight:'800', lineHeight:'1.1', marginBottom:'1rem', letterSpacing:'-0.02em' }}>
                {title}<br />{highlight && <span style={{ color:'hsl(174 62% 70%)' }}>{highlight}</span>}
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
.tip-card { background:white; border:1px solid hsl(40 20% 88%); border-radius:1rem; padding:1.25rem; transition:transform 0.2s,box-shadow 0.2s; }
.tip-card:hover { transform:translateY(-3px); box-shadow:0 10px 32px hsl(200 25% 15% / 0.09); }
@media(max-width:768px){.sp-grid{flex-direction:column!important}}
`;

export default function SafetyPage() {
    const tips = [
        { icon:'🔍', color:'hsl(174 62% 30%)', bg:'hsl(174 62% 32% / 0.1)', title:'Verify the listing', body:"Confirm the property exists and matches photos before visiting. Ask for the exact address and review the agent's profile and reviews." },
        { icon:'🏠', color:'hsl(152 55% 32%)', bg:'hsl(152 60% 40% / 0.1)', title:'Meet at the property', body:'Always visit the home in person. Never trust listings that insist on online payment before a viewing has taken place.' },
        { icon:'💰', color:'hsl(38 85% 38%)', bg:'hsl(38 92% 50% / 0.1)', title:'Keep money secure', body:'Pay only after inspection and with a signed receipt. Avoid handing cash without proper documentation.' },
        { icon:'📄', color:'hsl(220 55% 44%)', bg:'hsl(220 55% 48% / 0.1)', title:'Read the agreement', body:'Check the rent amount, notice period, who is responsible for repairs, and which utilities are included before signing.' },
        { icon:'⭐', color:'hsl(174 62% 30%)', bg:'hsl(174 62% 32% / 0.1)', title:'Trust verified agents', body:'Use agents with verified status and positive reviews. If you notice inconsistencies or pressure, walk away immediately.' },
        { icon:'🚩', color:'hsl(0 55% 40%)',   bg:'hsl(0 65% 50% / 0.08)', title:'Report what looks wrong', body:'See something suspicious? Report the listing and share evidence so we can take action fast and protect other users.' },
    ];

    const redFlags = [
        'Asked to pay before viewing the property',
        'Agent refuses to provide the exact address',
        'Price is far below market rate',
        'Pressure to pay immediately or lose the property',
        'Listing photos look stock or mismatched',
        'No written tenancy agreement offered',
    ];

    return (
        <>
            <style>{BASE_STYLE}</style>
            <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', backgroundColor:'hsl(40 33% 98%)' }}>
                <Header />
                <main style={{ flex:1 }}>
                    <MosaicHero
                        badge="Safety Tips"
                        title="Keep your rental search"
                        highlight="safe and secure."
                        sub="Built for every tenant in Ghana. Verify listings, protect your money, and report suspicious activity quickly."
                    />
                    <div style={{ maxWidth:'1080px', margin:'0 auto', padding:'clamp(2rem,6vw,4rem) clamp(0.75rem,3vw,1rem)' }}>
                        <div className="sp-grid" style={{ display:'flex', gap:'clamp(1.5rem,4vw,3rem)', alignItems:'flex-start' }}>

                            {/* ── Left ── */}
                            <div className="sp-main" style={{ flex:'1 1 0', display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                                <Card>
                                    <div style={{ marginBottom:'1.5rem' }}>
                                        <h2 style={{ fontSize:'clamp(1.25rem,3vw,1.5rem)', fontWeight:'700', color:'hsl(200 25% 15%)', marginBottom:'0.375rem' }}>Six rules for safe renting</h2>
                                        <p style={{ color:'hsl(200 15% 50%)', fontSize:'0.9rem' }}>Follow these every time you search for a property in Ghana.</p>
                                    </div>
                                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))', gap:'1rem' }}>
                                        {tips.map(t => (
                                            <div key={t.title} className="tip-card">
                                                <div style={{ width:40, height:40, borderRadius:'0.625rem', background:t.bg, color:t.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', marginBottom:'0.875rem' }}>{t.icon}</div>
                                                <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:t.color, marginBottom:'0.5rem' }}>{t.title}</h3>
                                                <p style={{ fontSize:'0.8125rem', color:'hsl(200 15% 45%)', lineHeight:1.65 }}>{t.body}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                {/* Red flags */}
                                <Card style={{ padding:'1.5rem' }}>
                                    <h3 style={{ fontSize:'1rem', fontWeight:700, color:'hsl(0 55% 36%)', marginBottom:'1rem' }}>🚨 Red flags — walk away if you see these</h3>
                                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'0.5rem' }}>
                                        {redFlags.map(r => (
                                            <div key={r} style={{ display:'flex', alignItems:'flex-start', gap:'0.5rem', padding:'0.625rem 0.75rem', borderRadius:'0.625rem', background:'hsl(0 65% 50% / 0.06)', border:'1px solid hsl(0 65% 50% / 0.14)' }}>
                                                <span style={{ color:'hsl(0 65% 44%)', flexShrink:0, fontWeight:900, fontSize:'0.875rem' }}>✕</span>
                                                <span style={{ fontSize:'0.8125rem', color:'hsl(200 15% 35%)', lineHeight:1.5 }}>{r}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start', padding:'1.25rem 1.5rem', borderRadius:'1rem', background:'hsl(174 62% 32% / 0.07)', border:'1px solid hsl(174 62% 32% / 0.18)' }}>
                                    <span style={{ fontSize:'1.25rem', flexShrink:0 }}>✅</span>
                                    <div>
                                        <div style={{ fontWeight:700, fontSize:'0.9375rem', color:'hsl(174 62% 22%)', marginBottom:4 }}>Safety checklist</div>
                                        <p style={{ color:'hsl(200 15% 40%)', fontSize:'0.875rem', lineHeight:1.65 }}>
                                            Take photos · Save all receipts · Verify landlord identity · Never pay more than the agreed advance · Always sign a written agreement · Report anything suspicious immediately.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ── Right ── */}
                            <div className="sp-side" style={{ flex:'0 0 clamp(260px,30%,320px)', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                                <SmallCard>
                                    <h3 style={{ fontSize:'1rem', fontWeight:'700', color:'hsl(200 25% 15%)', marginBottom:'0.25rem' }}>Quick safety score</h3>
                                    <p style={{ fontSize:'0.8375rem', color:'hsl(200 15% 50%)', marginBottom:'1.25rem' }}>A safe listing should have all of these.</p>
                                    {[
                                        { icon:'✓', t:'Verified agent badge', col:'hsl(152 55% 35%)' },
                                        { icon:'✓', t:'Exact address provided', col:'hsl(152 55% 35%)' },
                                        { icon:'✓', t:'Tenant reviews visible', col:'hsl(152 55% 35%)' },
                                        { icon:'✓', t:'Photos match description', col:'hsl(152 55% 35%)' },
                                        { icon:'✓', t:'Price matches market rate', col:'hsl(152 55% 35%)' },
                                        { icon:'✓', t:'Written agreement available', col:'hsl(152 55% 35%)' },
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
                                        { q:'What is a reasonable advance?', a:'Typically 2–6 months in Ghana. Anything above that is unusual and worth questioning.' },
                                        { q:'Can I bring a lawyer to sign?', a:'Absolutely. You have every right to have a legal advisor review your tenancy agreement.' },
                                        { q:'What if the landlord refuses a receipt?', a:"Do not pay. A landlord who won't give receipts is a major red flag." },
                                    ].map(({q,a}) => <FaqItem key={q} q={q} a={a} />)}
                                </SmallCard>

                                <div style={{ borderRadius:'1.25rem', background:'linear-gradient(135deg,hsl(174 62% 22%) 0%,hsl(174 50% 32%) 100%)', padding:'1.5rem', color:'white' }}>
                                    <p style={{ fontWeight:'700', fontSize:'1rem', marginBottom:'0.375rem' }}>Browse safe listings</p>
                                    <p style={{ fontSize:'0.8125rem', color:'rgba(255,255,255,0.7)', marginBottom:'1rem' }}>Every listing on RentTrust is verified before going live.</p>
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