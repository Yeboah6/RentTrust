// import Header from '../Components/Layouts/Header';
// import Footer from '../Components/Layouts/Footer';

// export default function GuidePage() {
//     return (
//         <>
//             <style>{`
//                 @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

//                 * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; box-sizing: border-box; }

//                 .page-shell { min-height: 100vh; display: flex; flex-direction: column; background: hsl(40 33% 98%); }
//                 .page-hero { position: relative; overflow: hidden; min-height: 320px; display: flex; align-items: center; background: linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 58% 34%) 42%, hsl(174 52% 24%) 100%); color: white; }
//                 .hero-inner { width: min(1100px, 100%); margin: 0 auto; padding: clamp(2rem, 5vw, 4rem); display: grid; gap: 1rem; }
//                 .hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.22); padding: 0.6rem 1rem; border-radius: 999px; font-weight: 600; font-size: 0.875rem; }
//                 .hero-title { font-size: clamp(2rem, 5vw, 3.25rem); line-height: 1.05; font-weight: 800; max-width: 9ch; }
//                 .hero-copy { max-width: 42rem; color: rgba(255,255,255,0.9); font-size: clamp(1rem, 2.2vw, 1.125rem); line-height: 1.75; }

//                 .page-content { width: min(1100px, 100%); margin: 0 auto; padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem); }
//                 .section-grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(2, minmax(0, 1fr)); }
//                 .section-card { background: white; border: 1px solid hsl(40 20% 88%); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 16px 48px hsl(200 15% 20% / 0.06); }
//                 .section-card h2 { margin: 0 0 0.75rem; font-size: 1.1rem; color: hsl(200 25% 15%); }
//                 .section-card p, .section-card ul { margin: 0; color: hsl(200 15% 45%); font-size: 0.95rem; line-height: 1.7; }
//                 .section-card ul { margin-top: 0.75rem; padding-left: 1.2rem; }
//                 .section-card li { margin-bottom: 0.55rem; }
//                 .callout { margin-top: 2rem; padding: 1.5rem; border-radius: 1rem; background: hsl(174 62% 32% / 0.08); border: 1px solid hsl(174 62% 32% / 0.12); }
//                 .callout h3 { margin: 0 0 0.75rem; font-size: 1.05rem; color: hsl(174 62% 22%); }
//                 .callout p { margin: 0; color: hsl(200 15% 38%); }

//                 @media (max-width: 768px) {
//                     .page-hero { min-height: 260px; }
//                     .section-grid { grid-template-columns: 1fr; }
//                 }
//             `}</style>

//             <div className="page-shell">
//                 <Header />
//                 <main style={{ flex: 1 }}>
//                     <section className="page-hero">
//                         <div className="hero-inner">
//                             <span className="hero-badge">Renting Guide</span>
//                             <h1 className="hero-title">A practical guide to rent safely in Ghana.</h1>
//                             <p className="hero-copy">Use these steps to compare prices, verify listings, inspect properties and sign agreements with confidence. This is your roadmap for a safer rental journey.</p>
//                         </div>
//                     </section>

//                     <section className="page-content">
//                         <div className="section-grid">
//                             <div className="section-card">
//                                 <h2>Start with a realistic budget</h2>
//                                 <p>Know how much you can afford before you browse. Include rent, advance payment, utility bills, agent fees and transport to the property.</p>
//                                 <ul>
//                                     <li>List your must-haves and nice-to-haves.</li>
//                                     <li>Compare multiple neighbourhoods to avoid overpaying.</li>
//                                     <li>Check current market rents for similar homes.</li>
//                                 </ul>
//                             </div>

//                             <div className="section-card">
//                                 <h2>Verify the listing first</h2>
//                                 <p>Not every listing is real. Use RentTrust verification badges, ask for address details, and confirm the property exists before committing.</p>
//                                 <ul>
//                                     <li>Ask for exact address and property photos.</li>
//                                     <li>Cross-check the listing on the map.</li>
//                                     <li>Contact the agent or landlord by phone before visiting.</li>
//                                 </ul>
//                             </div>

//                             <div className="section-card">
//                                 <h2>Inspect the property in person</h2>
//                                 <p>Never pay money until you have seen the house or apartment. Inspect the condition, confirm the landlord can legally rent it, and note repairs.</p>
//                                 <ul>
//                                     <li>Bring a friend or family member for extra safety.</li>
//                                     <li>Check water, electricity and security features.</li>
//                                     <li>Verify that the rooms match the listing photos.</li>
//                                 </ul>
//                             </div>

//                             <div className="section-card">
//                                 <h2>Agree on terms in writing</h2>
//                                 <p>Get a written tenancy agreement and receipt for every payment. Clarify advance rent, notice period, repairs and utilities before you move in.</p>
//                                 <ul>
//                                     <li>Write down the exact rent, payment schedule and duration.</li>
//                                     <li>Keep copies of all messages, receipts and documents.</li>
//                                     <li>Refuse verbal-only agreements or pressure to pay quickly.</li>
//                                 </ul>
//                             </div>
//                         </div>

//                         <div className="callout">
//                             <h3>Quick renting checklist</h3>
//                             <p>Budget clearly, verify the listing, inspect in person, confirm landlord identity and sign a clear agreement. RentTrust is here to help you make safe choices.</p>
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

export default function GuidePage() {
    const steps = [
        {
            n: '01',
            color: 'hsl(174 62% 32%)',
            bg: 'hsl(174 62% 32% / 0.1)',
            title: 'Set a realistic budget',
            body: 'Know how much you can afford before you browse. Include rent, advance payment, utility bills, agent fees and transport.',
            tips: ['List your must-haves and nice-to-haves.','Compare multiple neighbourhoods to avoid overpaying.','Check current market rents for similar homes.'],
        },
        {
            n: '02',
            color: 'hsl(38 85% 42%)',
            bg: 'hsl(38 92% 50% / 0.1)',
            title: 'Verify the listing first',
            body: 'Not every listing is real. Use RentTrust verification badges, ask for address details, and confirm the property exists before committing.',
            tips: ['Ask for exact address and property photos.','Cross-check the listing on the map.','Contact the agent or landlord by phone before visiting.'],
        },
        {
            n: '03',
            color: 'hsl(152 55% 35%)',
            bg: 'hsl(152 60% 40% / 0.1)',
            title: 'Inspect the property in person',
            body: "Never pay money until you've seen the house or apartment. Inspect the condition and confirm the landlord can legally rent it.",
            tips: ['Bring a friend or family member for safety.','Check water, electricity and security features.','Verify rooms match the listing photos.'],
        },
        {
            n: '04',
            color: 'hsl(220 55% 48%)',
            bg: 'hsl(220 55% 48% / 0.1)',
            title: 'Agree on terms in writing',
            body: 'Get a written tenancy agreement and receipt for every payment. Clarify advance rent, notice period, repairs and utilities before you move in.',
            tips: ['Write down exact rent, schedule and duration.','Keep copies of all messages, receipts and documents.','Refuse verbal-only agreements or pressure to pay quickly.'],
        },
    ];
 
    return (
        <>
            <style>{BASE_CSS}</style>
            <div className="sp-shell">
                <Header />
                <main style={{ flex:1 }}>
                    <div className="sp-hero" style={{ background:'linear-gradient(135deg,hsl(174 62% 18%),hsl(174 55% 26%))' }}>
                        <HeroMosaic tint="hsl(174 62% 20% / 0.98)" />
                        <div className="sp-hero-inner">
                            <div className="sp-badge"><span className="sp-pulse" style={{ background:'hsl(152 70% 58%)' }} />Renting Guide</div>
                            <h1 className="sp-h1">A practical guide to rent safely in Ghana.</h1>
                            <p className="sp-sub">Four steps to compare prices, verify listings, inspect properties and sign agreements with confidence.</p>
                        </div>
                    </div>
 
                    <div className="sp-content">
                        <div className="sp-grid-2" style={{ marginBottom:'1.5rem' }}>
                            {steps.map(s => (
                                <div key={s.n} className="sp-card">
                                    <div style={{ display:'flex', alignItems:'flex-start', gap:'0.875rem' }}>
                                        <div className="sp-icon" style={{ background:s.bg, color:s.color, fontSize:'1rem', fontWeight:900 }}>{s.n}</div>
                                        <div>
                                            <h3 className="sp-card-h" style={{ color:s.color }}>{s.title}</h3>
                                            <p className="sp-card-p">{s.body}</p>
                                            <ul>{s.tips.map(t => <li key={t}>{t}</li>)}</ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
 
                        <div className="sp-callout" style={{ display:'flex', alignItems:'flex-start', gap:'1rem' }}>
                            <div style={{ width:40, height:40, borderRadius:'0.625rem', background:'hsl(174 62% 32% / 0.12)', color:'hsl(174 62% 28%)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div>
                                <div style={{ fontWeight:700, fontSize:'0.9375rem', color:'hsl(174 62% 22%)', marginBottom:4 }}>Quick checklist</div>
                                <p style={{ color:'hsl(200 15% 40%)', fontSize:'0.875rem', lineHeight:1.65 }}>Budget clearly · Verify the listing · Inspect in person · Confirm landlord identity · Sign a written agreement. RentTrust is here to help you make safe choices every step of the way.</p>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}