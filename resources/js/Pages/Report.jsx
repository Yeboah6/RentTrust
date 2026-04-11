// import Header from '../Components/Layouts/Header';
// import Footer from '../Components/Layouts/Footer';

// export default function ReportPage() {
//     return (
//         <>
//             <style>{`
//                 @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

//                 * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; box-sizing: border-box; }
//                 .page-shell { min-height: 100vh; display: flex; flex-direction: column; background: hsl(40 33% 98%); }
//                 .page-hero { position: relative; overflow: hidden; min-height: 320px; display: flex; align-items: center; background: linear-gradient(135deg, hsl(15 70% 50%) 0%, hsl(15 60% 42%) 42%, hsl(15 50% 36%) 100%); color: white; }
//                 .hero-inner { width: min(1100px, 100%); margin: 0 auto; padding: clamp(2rem, 5vw, 4rem); display: grid; gap: 1rem; }
//                 .hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.22); padding: 0.6rem 1rem; border-radius: 999px; font-weight: 600; font-size: 0.875rem; }
//                 .hero-title { font-size: clamp(2rem, 5vw, 3.25rem); line-height: 1.05; font-weight: 800; max-width: 9ch; }
//                 .hero-copy { max-width: 42rem; color: rgba(255,255,255,0.9); font-size: clamp(1rem, 2.2vw, 1.125rem); line-height: 1.75; }
//                 .page-content { width: min(1100px, 100%); margin: 0 auto; padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem); }
//                 .report-card { background: white; border: 1px solid hsl(40 20% 88%); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 16px 48px hsl(200 15% 20% / 0.06); margin-bottom: 1.25rem; }
//                 .report-card h2 { margin: 0 0 0.75rem; font-size: 1.1rem; color: hsl(15 70% 38%); }
//                 .report-card p, .report-card ul { margin: 0; color: hsl(200 15% 45%); line-height: 1.75; font-size: 0.96rem; }
//                 .report-card ul { margin-top: 0.75rem; padding-left: 1.2rem; }
//                 .report-card li { margin-bottom: 0.65rem; }
//                 .note { background: hsl(174 62% 32% / 0.08); border: 1px solid hsl(174 62% 32% / 0.12); padding: 1.25rem; border-radius: 1rem; }
//             `}</style>

//             <div className="page-shell">
//                 <Header />
//                 <main style={{ flex: 1 }}>
//                     <section className="page-hero">
//                         <div className="hero-inner">
//                             <span className="hero-badge">Report Issue</span>
//                             <h1 className="hero-title">Report suspicious listings or unsafe rental experiences.</h1>
//                             <p className="hero-copy">If something does not look right, tell us. The more detail you provide, the faster we can investigate and protect other users.</p>
//                         </div>
//                     </section>

//                     <section className="page-content">
//                         <div className="report-card">
//                             <h2>What you can report</h2>
//                             <ul>
//                                 <li>Fake or duplicated listings.</li>
//                                 <li>Incorrect pricing or misleading photos.</li>
//                                 <li>Suspicious agents or landlords.</li>
//                                 <li>Unsafe or fraudulent rental requests.</li>
//                             </ul>
//                         </div>
//                         <div className="report-card">
//                             <h2>How to report</h2>
//                             <p>Send as much information as possible, including listing links, agent name, phone number, property address, and any conversations or receipts.</p>
//                         </div>
//                         <div className="report-card note">
//                             <p>We do not accept payment requests through the report form. If you have paid money and suspect fraud, contact our support team immediately.</p>
//                         </div>
//                         <div className="report-card">
//                             <h2>Next steps</h2>
//                             <p>After you report, our team will review the case, reach out for clarification if needed, and remove or block dangerous listings when verified.</p>
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

export default function ReportPage() {
    const types = [
        { icon:'👻', label:'Fake listing',      detail:'Property doesn\'t exist or photos are stolen.' },
        { icon:'💰', label:'Inflated pricing',  detail:'Listed price is significantly above market rate.' },
        { icon:'🖼',  label:'Misleading photos', detail:'Photos don\'t match the actual property.' },
        { icon:'🤥',  label:'Fraudulent agent',  detail:'Agent identity is false or unverifiable.' },
        { icon:'📍', label:'Wrong location',    detail:'Address or map pin is incorrect.' },
        { icon:'⚠',  label:'Unsafe conditions', detail:'Property poses a risk to health or safety.' },
    ];
 
    return (
        <>
            <style>{BASE_CSS}</style>
            <div className="sp-shell">
                <Header />
                <main style={{ flex:1 }}>
                    <div className="sp-hero" style={{ background:'linear-gradient(135deg,hsl(0 60% 22%),hsl(0 52% 30%))' }}>
                        <HeroMosaic tint="hsl(0 60% 22% / 0.98)" />
                        <div className="sp-hero-inner">
                            <div className="sp-badge"><span className="sp-pulse" style={{ background:'hsl(0 72% 65%)' }} />Report Issue</div>
                            <h1 className="sp-h1">Report suspicious listings or unsafe experiences.</h1>
                            <p className="sp-sub">If something doesn't look right, tell us. The more detail you provide, the faster we can investigate and protect other users.</p>
                        </div>
                    </div>
 
                    <div className="sp-content">
                        {/* What you can report */}
                        <div style={{ marginBottom:'1.5rem' }}>
                            <h2 style={{ fontSize:'1.1rem', fontWeight:700, color:'hsl(200 25% 15%)', marginBottom:'1rem' }}>What you can report</h2>
                            <div className="sp-grid-3">
                                {types.map(t => (
                                    <div key={t.label} className="sp-card" style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
                                        <div style={{ fontSize:'1.25rem', flexShrink:0, marginTop:1 }}>{t.icon}</div>
                                        <div>
                                            <div style={{ fontWeight:700, fontSize:'0.875rem', color:'hsl(200 25% 18%)', marginBottom:3 }}>{t.label}</div>
                                            <div style={{ fontSize:'0.8rem', color:'hsl(200 15% 52%)', lineHeight:1.55 }}>{t.detail}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
 
                        {/* How to report */}
                        <div className="sp-grid-2" style={{ marginBottom:'1.5rem' }}>
                            <div className="sp-card">
                                <h3 className="sp-card-h" style={{ color:'hsl(0 55% 36%)' }}>What to include</h3>
                                <p className="sp-card-p">Send as much information as possible so our team can act quickly.</p>
                                <ul>
                                    <li>Link to the listing or listing ID</li>
                                    <li>Agent name and phone number</li>
                                    <li>Property address</li>
                                    <li>Any conversations or receipts</li>
                                    <li>Photos or screenshots if available</li>
                                </ul>
                            </div>
                            <div className="sp-card">
                                <h3 className="sp-card-h" style={{ color:'hsl(0 55% 36%)' }}>What happens next</h3>
                                <p className="sp-card-p">After you report, our team will take the following steps:</p>
                                <ul>
                                    <li>Review the case within 24 hours</li>
                                    <li>Reach out for clarification if needed</li>
                                    <li>Remove or flag dangerous listings</li>
                                    <li>Block repeat offenders from the platform</li>
                                    <li>Update you on the outcome</li>
                                </ul>
                            </div>
                        </div>
 
                        <div style={{ padding:'1.25rem 1.5rem', borderRadius:'1rem', background:'hsl(0 65% 50% / 0.07)', border:'1px solid hsl(0 65% 50% / 0.2)', display:'flex', gap:'0.875rem', alignItems:'flex-start' }}>
                            <div style={{ fontSize:'1.25rem', flexShrink:0 }}>🚨</div>
                            <div>
                                <div style={{ fontWeight:700, fontSize:'0.9rem', color:'hsl(0 55% 36%)', marginBottom:4 }}>Suspected fraud or money lost?</div>
                                <p style={{ color:'hsl(200 15% 40%)', fontSize:'0.875rem', lineHeight:1.65 }}>We do not accept payment requests through the report form. If you have paid money and suspect fraud, contact our support team immediately via the <Link href="/contact" style={{ color:'hsl(174 62% 30%)', fontWeight:600 }}>Contact page</Link>.</p>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}