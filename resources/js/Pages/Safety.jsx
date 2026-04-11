// import Header from '../Components/Layouts/Header';
// import Footer from '../Components/Layouts/Footer';

// export default function SafetyPage() {
//     return (
//         <>
//             <style>{`
//                 @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

//                 * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; box-sizing: border-box; }
//                 .page-shell { min-height: 100vh; display: flex; flex-direction: column; background: hsl(40 33% 98%); }
//                 .page-hero { position: relative; overflow: hidden; min-height: 320px; display: flex; align-items: center; background: linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(38 82% 45%) 42%, hsl(38 70% 35%) 100%); color: white; }
//                 .hero-inner { width: min(1100px, 100%); margin: 0 auto; padding: clamp(2rem, 5vw, 4rem); display: grid; gap: 1rem; }
//                 .hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.22); padding: 0.6rem 1rem; border-radius: 999px; font-weight: 600; font-size: 0.875rem; }
//                 .hero-title { font-size: clamp(2rem, 5vw, 3.25rem); line-height: 1.05; font-weight: 800; max-width: 9ch; }
//                 .hero-copy { max-width: 42rem; color: rgba(255,255,255,0.9); font-size: clamp(1rem, 2.2vw, 1.125rem); line-height: 1.75; }
//                 .page-content { width: min(1100px, 100%); margin: 0 auto; padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem); }
//                 .tip-grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(3, minmax(0, 1fr)); }
//                 .tip-card { background: white; border: 1px solid hsl(40 20% 88%); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 16px 48px hsl(200 15% 20% / 0.06); }
//                 .tip-card h2 { margin: 0 0 0.75rem; font-size: 1.05rem; color: hsl(38 92% 50%); }
//                 .tip-card p { margin: 0; color: hsl(200 15% 45%); font-size: 0.95rem; line-height: 1.7; }
//                 .tip-card ul { margin: 0.75rem 0 0; padding-left: 1.2rem; }
//                 .tip-card li { margin-bottom: 0.55rem; }
//                 .section-secondary { margin-top: 2rem; display: grid; gap: 1rem; }
//                 .section-secondary h3 { margin: 0 0 0.75rem; font-size: 1.05rem; color: hsl(200 25% 15%); }
//                 .section-secondary p { margin: 0; color: hsl(200 15% 45%); line-height: 1.7; }
//                 .highlight { background: hsl(174 62% 32% / 0.08); border: 1px solid hsl(174 62% 32% / 0.15); border-radius: 1rem; padding: 1.25rem; }
//                 @media (max-width: 900px) { .tip-grid { grid-template-columns: 1fr; } }
//             `}</style>

//             <div className="page-shell">
//                 <Header />
//                 <main style={{ flex: 1 }}>
//                     <section className="page-hero">
//                         <div className="hero-inner">
//                             <span className="hero-badge">Safety Tips</span>
//                             <h1 className="hero-title">Keep your rental search safe and secure.</h1>
//                             <p className="hero-copy">These tips are built for every tenant in Ghana. Verify listings, protect your money, and report suspicious activity quickly.</p>
//                         </div>
//                     </section>

//                     <section className="page-content">
//                         <div className="tip-grid">
//                             <div className="tip-card">
//                                 <h2>Verify the listing</h2>
//                                 <p>Confirm the property exists and matches the photos before you travel or pay. Ask for the exact address and review the agent's profile.</p>
//                             </div>
//                             <div className="tip-card">
//                                 <h2>Meet at the property</h2>
//                                 <p>Always visit the home in person. Do not trust listings that insist on online payment before a viewing.</p>
//                             </div>
//                             <div className="tip-card">
//                                 <h2>Keep money secure</h2>
//                                 <p>Pay only after inspection and with a signed receipt. Avoid handing cash to strangers without documentation.</p>
//                             </div>
//                             <div className="tip-card">
//                                 <h2>Inspect the agreement</h2>
//                                 <p>Check the rent amount, notice period, repairs responsibility, and who is responsible for utilities.</p>
//                             </div>
//                             <div className="tip-card">
//                                 <h2>Trust verified agents</h2>
//                                 <p>Use agents with verified status and good reviews. If you notice inconsistencies, walk away.</p>
//                             </div>
//                             <div className="tip-card">
//                                 <h2>Report what’s wrong</h2>
//                                 <p>See something suspicious? Report the listing and share evidence so we can take action fast.</p>
//                             </div>
//                         </div>

//                         <div className="section-secondary highlight">
//                             <h3>Safety checklist</h3>
//                             <p>Take photos, save receipts, verify landlords, and never pay more than the agreed advance. A safe rental begins with good habits.</p>
//                         </div>
//                     </section>
//                 </main>
//                 <Footer />
//             </div>
//         </>
//     );
// }

import Header from '../Components/Layouts/Header';
import Footer from '../Components/Layouts/Footer';
import { Link } from '@inertiajs/react';
 
/* ── shared hero mosaic (same images, tinted per page) ── */
const HeroMosaic = ({ tint = 'hsl(174 62% 22% / 0.98)' }) => (
    <>
        <div style={{ position:'absolute',right:0,top:0,bottom:0,width:'56%',zIndex:1,
            display:'grid',gridTemplateColumns:'repeat(3,1fr)',gridTemplateRows:'repeat(3,1fr)',gap:4 }}>
            <div style={{ gridRow:'1/3',overflow:'hidden',background:'hsl(174 25% 22%)' }}>
                <img src="/images/download 2.jfif" alt="" style={{ width:'100%',height:'100%',objectFit:'cover',opacity:0.72 }} />
            </div>
            <div style={{ overflow:'hidden',background:'hsl(200 30% 18%)' }}>
                <img src="/images/download 1.jfif" alt="" style={{ width:'100%',height:'100%',objectFit:'cover',opacity:0.72 }} />
            </div>
            <div style={{ overflow:'hidden',background:'hsl(174 35% 16%)' }}>
                <img src="/images/download 3.jfif" alt="" style={{ width:'100%',height:'100%',objectFit:'cover',opacity:0.72 }} />
            </div>
            <div style={{ gridColumn:'2/4',overflow:'hidden',background:'hsl(30 25% 18%)' }}>
                <img src="/images/download 4.jfif" alt="" style={{ width:'100%',height:'100%',objectFit:'cover',opacity:0.72 }} />
            </div>
            <div style={{ overflow:'hidden',background:'hsl(220 30% 16%)' }}>
                <img src="/images/download 5.jfif" alt="" style={{ width:'100%',height:'100%',objectFit:'cover',opacity:0.72 }} />
            </div>
            <div style={{ overflow:'hidden',background:'hsl(174 20% 14%)' }}>
                <img src="/images/download 1.jfif" alt="" style={{ width:'100%',height:'100%',objectFit:'cover',opacity:0.72 }} />
            </div>
            <div style={{ overflow:'hidden',background:'hsl(15 25% 16%)' }}>
                <img src="/images/download 2.jfif" alt="" style={{ width:'100%',height:'100%',objectFit:'cover',opacity:0.72 }} />
            </div>
        </div>
        <div style={{ position:'absolute',inset:0,zIndex:2,pointerEvents:'none',opacity:0.06,
            backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)',backgroundSize:'28px 28px' }} />
        <div style={{ position:'absolute',right:'-4rem',top:'-4rem',width:'20rem',height:'20rem',
            borderRadius:'50%',background:'radial-gradient(circle,rgba(255,255,255,0.14) 0%,transparent 70%)',
            zIndex:2,pointerEvents:'none' }} />
        <div style={{ position:'absolute',inset:0,zIndex:2,
            background:`linear-gradient(to right,${tint} 0%,${tint.replace('0.98','0.88')} 36%,${tint.replace('0.98','0.42')} 68%,${tint.replace('0.98','0.1')} 100%)` }} />
    </>
);
 
/* ── shared CSS injected once per page ── */
const BASE_CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
    *,*::before,*::after { font-family:'Plus Jakarta Sans',system-ui,sans-serif; box-sizing:border-box; margin:0; padding:0; }
    @keyframes spFadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spFadeIn { from{opacity:0} to{opacity:1} }
    @keyframes spPulse  { 0%,100%{opacity:1} 50%{opacity:0.45} }
    .sp-shell  { min-height:100vh; display:flex; flex-direction:column; background:hsl(40 33% 98%); }
    .sp-hero   { position:relative; overflow:hidden; min-height:360px; display:flex; align-items:center; animation:spFadeIn 0.6s ease both; }
    .sp-content{ width:min(1100px,100%); margin:0 auto; padding:clamp(2rem,5vw,4rem) clamp(1rem,4vw,2rem); animation:spFadeUp 0.6s ease 0.1s both; }
    .sp-badge  { display:inline-flex; align-items:center; gap:6px; padding:5px 14px; border-radius:999px;
                 background:rgba(255,255,255,0.14); border:1px solid rgba(255,255,255,0.22);
                 color:rgba(255,255,255,0.9); font-size:13px; font-weight:600; margin-bottom:1.25rem; }
    .sp-pulse  { width:7px; height:7px; border-radius:50%; flex-shrink:0; animation:spPulse 2s ease infinite; }
    .sp-h1     { font-size:clamp(2rem,5vw,3.25rem); font-weight:800; color:white; line-height:1.1;
                 letter-spacing:-0.02em; margin-bottom:1rem; }
    .sp-sub    { color:rgba(255,255,255,0.72); font-size:clamp(0.9rem,2.2vw,1.1rem); line-height:1.65; max-width:440px; }
    .sp-hero-inner { position:relative; z-index:3; padding:clamp(2.5rem,7vw,4.5rem) clamp(1rem,4vw,2.5rem); max-width:560px; }
    .sp-card   { background:white; border:1px solid hsl(40 20% 88%); border-radius:1rem; padding:1.5rem;
                 box-shadow:0 4px 32px hsl(200 25% 15% / 0.07); }
    .sp-card-h { font-size:1rem; font-weight:700; color:hsl(200 25% 15%); margin-bottom:0.5rem; }
    .sp-card-p { color:hsl(200 15% 45%); font-size:0.875rem; line-height:1.7; }
    .sp-card ul{ margin:0.625rem 0 0; padding-left:1.1rem; }
    .sp-card li{ margin-bottom:0.5rem; color:hsl(200 15% 42%); font-size:0.875rem; line-height:1.6; }
    .sp-icon   { width:40px; height:40px; border-radius:0.625rem; display:flex; align-items:center;
                 justify-content:center; flex-shrink:0; margin-bottom:0.875rem; }
    .sp-callout{ padding:1.25rem 1.5rem; border-radius:1rem; background:hsl(174 62% 32% / 0.07);
                 border:1px solid hsl(174 62% 32% / 0.18); }
    .sp-grid-2 { display:grid; grid-template-columns:repeat(2,1fr); gap:1.1rem; }
    .sp-grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:1.1rem; }
    .sp-grid-1 { display:grid; grid-template-columns:1fr; gap:1.1rem; }
    @media(max-width:768px) { .sp-grid-2,.sp-grid-3 { grid-template-columns:1fr !important; } }
`;

export default function SafetyPage() {
    const tips = [
        { icon:'🔍', color:'hsl(38 85% 42%)', bg:'hsl(38 92% 50% / 0.1)', title:'Verify the listing',     body:'Confirm the property exists and matches the photos before you travel. Ask for the exact address and check the agent\'s profile and reviews.' },
        { icon:'🏠', color:'hsl(174 62% 30%)', bg:'hsl(174 62% 32% / 0.1)', title:'Meet at the property',   body:'Always visit the home in person. Do not trust listings that insist on online payment before a viewing has taken place.' },
        { icon:'💰', color:'hsl(152 55% 32%)', bg:'hsl(152 60% 40% / 0.1)', title:'Keep money secure',      body:'Pay only after inspection and with a signed receipt. Avoid handing cash to strangers without proper documentation.' },
        { icon:'📄', color:'hsl(220 55% 44%)', bg:'hsl(220 55% 48% / 0.1)', title:'Read the agreement',     body:'Check the rent amount, notice period, who is responsible for repairs, and which utilities are included before signing.' },
        { icon:'⭐', color:'hsl(174 62% 30%)', bg:'hsl(174 62% 32% / 0.1)', title:'Trust verified agents',  body:'Use agents with verified status and positive reviews. If you notice inconsistencies or pressure tactics, walk away.' },
        { icon:'🚩', color:'hsl(0 55% 40%)',   bg:'hsl(0 65% 50% / 0.08)', title:'Report what looks wrong', body:'See something suspicious? Report the listing and share evidence so we can take action fast and protect other users.' },
    ];
 
    const redFlags = [
        'Asked to pay before viewing the property',
        'Agent refuses to provide exact address',
        'Price is far below market rate',
        'Pressure to pay immediately or lose the property',
        'Listing photos look stock or mismatched',
        'No written tenancy agreement offered',
    ];
 
    return (
        <>
            <style>{BASE_CSS}</style>
            <div className="sp-shell">
                <Header />
                <main style={{ flex:1 }}>
                    <div className="sp-hero" style={{ background:'linear-gradient(135deg,hsl(38 85% 30%),hsl(38 75% 40%))' }}>
                        <HeroMosaic tint="hsl(38 85% 28% / 0.98)" />
                        <div className="sp-hero-inner">
                            <div className="sp-badge"><span className="sp-pulse" style={{ background:'hsl(38 92% 60%)' }} />Safety Tips</div>
                            <h1 className="sp-h1">Keep your rental search safe and secure.</h1>
                            <p className="sp-sub">Built for every tenant in Ghana. Verify listings, protect your money, and report suspicious activity quickly.</p>
                        </div>
                    </div>
 
                    <div className="sp-content">
                        <div className="sp-grid-3" style={{ marginBottom:'1.5rem' }}>
                            {tips.map(t => (
                                <div key={t.title} className="sp-card">
                                    <div className="sp-icon" style={{ background:t.bg, color:t.color, fontSize:'1.2rem' }}>{t.icon}</div>
                                    <h3 className="sp-card-h" style={{ color:t.color }}>{t.title}</h3>
                                    <p className="sp-card-p">{t.body}</p>
                                </div>
                            ))}
                        </div>
 
                        {/* Red flags */}
                        <div className="sp-card" style={{ marginBottom:'1.5rem' }}>
                            <h3 style={{ fontSize:'1rem', fontWeight:700, color:'hsl(0 55% 36%)', marginBottom:'1rem' }}>🚨 Red flags to watch for</h3>
                            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'0.5rem' }}>
                                {redFlags.map(r => (
                                    <div key={r} style={{ display:'flex', alignItems:'flex-start', gap:'0.5rem', padding:'0.625rem 0.75rem', borderRadius:'0.625rem', background:'hsl(0 65% 50% / 0.06)', border:'1px solid hsl(0 65% 50% / 0.14)' }}>
                                        <span style={{ color:'hsl(0 65% 44%)', flexShrink:0, marginTop:1 }}>✕</span>
                                        <span style={{ fontSize:'0.8125rem', color:'hsl(200 15% 35%)', lineHeight:1.5 }}>{r}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
 
                        <div className="sp-callout" style={{ display:'flex', gap:'1rem', alignItems:'flex-start' }}>
                            <div style={{ fontSize:'1.25rem', flexShrink:0 }}>✅</div>
                            <div>
                                <div style={{ fontWeight:700, fontSize:'0.9375rem', color:'hsl(174 62% 22%)', marginBottom:4 }}>Safety checklist</div>
                                <p style={{ color:'hsl(200 15% 40%)', fontSize:'0.875rem', lineHeight:1.65 }}>Take photos · Save all receipts · Verify landlord identity · Never pay more than the agreed advance · Always sign a written agreement · Report anything suspicious immediately.</p>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}