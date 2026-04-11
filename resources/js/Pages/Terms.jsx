// import Header from '../Components/Layouts/Header';
// import Footer from '../Components/Layouts/Footer';

// export default function TermsPage() {
//     return (
//         <>
//             <style>{`
//                 @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

//                 * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; box-sizing: border-box; }
//                 .page-shell { min-height: 100vh; display: flex; flex-direction: column; background: hsl(40 33% 98%); }
//                 .page-hero { position: relative; overflow: hidden; min-height: 320px; display: flex; align-items: center; background: linear-gradient(135deg, hsl(200 24% 28%) 0%, hsl(200 18% 24%) 40%, hsl(200 14% 20%) 100%); color: white; }
//                 .hero-inner { width: min(1100px, 100%); margin: 0 auto; padding: clamp(2rem, 5vw, 4rem); display: grid; gap: 1rem; }
//                 .hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.22); padding: 0.6rem 1rem; border-radius: 999px; font-weight: 600; font-size: 0.875rem; }
//                 .hero-title { font-size: clamp(2rem, 5vw, 3.25rem); line-height: 1.05; font-weight: 800; max-width: 9ch; }
//                 .hero-copy { max-width: 42rem; color: rgba(255,255,255,0.9); font-size: clamp(1rem, 2.2vw, 1.125rem); line-height: 1.75; }
//                 .page-content { width: min(1100px, 100%); margin: 0 auto; padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem); }
//                 .term-card { background: white; border: 1px solid hsl(40 20% 88%); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 16px 48px hsl(200 15% 20% / 0.06); margin-bottom: 1.25rem; }
//                 .term-card h2 { margin: 0 0 0.75rem; font-size: 1.1rem; color: hsl(200 25% 15%); }
//                 .term-card p, .term-card ul { margin: 0; color: hsl(200 15% 45%); line-height: 1.75; font-size: 0.96rem; }
//                 .term-card ul { margin-top: 0.75rem; padding-left: 1.2rem; }
//                 .term-card li { margin-bottom: 0.65rem; }
//                 .note { margin-top: 1rem; padding: 1rem; border-radius: 1rem; background: hsl(40 90% 90%); color: hsl(200 25% 15%); border: 1px solid hsl(40 20% 88%); }
//             `}</style>

//             <div className="page-shell">
//                 <Header />
//                 <main style={{ flex: 1 }}>
//                     <section className="page-hero">
//                         <div className="hero-inner">
//                             <span className="hero-badge">Terms of Service</span>
//                             <h1 className="hero-title">How RentTrust works and what you agree to.</h1>
//                             <p className="hero-copy">These terms explain your rights, responsibilities and the rules for using RentTrust to browse, list, verify and report rental properties.</p>
//                         </div>
//                     </section>

//                     <section className="page-content">
//                         <div className="term-card">
//                             <h2>Using the platform</h2>
//                             <p>RentTrust is a property listing marketplace. You may browse, search and contact agents, but you must act responsibly and provide accurate information.</p>
//                         </div>
//                         <div className="term-card">
//                             <h2>Listing accuracy</h2>
//                             <p>Agents and landlords must provide truthful details. If a listing is false or misleading, you should report it immediately so we can remove it.</p>
//                         </div>
//                         <div className="term-card">
//                             <h2>Responsible behaviour</h2>
//                             <p>Do not harass other users, post fraudulent information, or misrepresent yourself. Any abusive or illegal activity may lead to account suspension.</p>
//                         </div>
//                         <div className="term-card">
//                             <h2>Payments and fees</h2>
//                             <p>RentTrust does not process rental payments directly. You are responsible for all payments agreed with the landlord or agent outside the platform.</p>
//                         </div>
//                         <div className="term-card note">
//                             <p>By continuing to use RentTrust, you confirm that you understand these terms and agree to follow the rules that keep the marketplace safe for everyone.</p>
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

export default function TermsPage() {
    const terms = [
        { title:'Using the platform',     body:'RentTrust is a property listing marketplace. You may browse, search and contact agents, but you must act responsibly and provide accurate information at all times.', items:['Do not create false accounts or listings','Treat all users with respect','Do not scrape or copy our content without permission'] },
        { title:'Listing accuracy',        body:'Agents and landlords must provide truthful details. If a listing is false or misleading, report it immediately so we can remove it.', items:['Photos must match the actual property','Prices must reflect what is charged','Location must be correct and verifiable'] },
        { title:'Responsible behaviour',   body:'Do not harass other users, post fraudulent information, or misrepresent yourself. Any abusive or illegal activity may lead to account suspension.', items:['No threats or harassment','No impersonation of agents or landlords','No illegal listing content'] },
        { title:'Payments and fees',       body:'RentTrust does not process rental payments directly. You are responsible for all payments agreed with the landlord or agent outside the platform.', items:['Always get a receipt for payments made','Confirm payment terms in writing','RentTrust is not liable for off-platform transactions'] },
        { title:'Intellectual property',   body:'All content on RentTrust, including logos, text, and design, is owned by RentTrust and may not be reused without written permission.', items:['Do not copy or reproduce our content','Do not use our brand without permission','User-submitted content remains your own'] },
        { title:'Changes to these terms',  body:'We may update these terms from time to time. Continued use of the platform after changes are published means you accept the new terms.', items:['Changes are announced on the platform','Major changes are communicated by email','Last updated: April 2026'] },
    ];
 
    return (
        <>
            <style>{BASE_CSS}</style>
            <div className="sp-shell">
                <Header />
                <main style={{ flex:1 }}>
                    <div className="sp-hero" style={{ background:'linear-gradient(135deg,hsl(200 28% 14%),hsl(200 22% 22%))' }}>
                        <HeroMosaic tint="hsl(200 28% 14% / 0.98)" />
                        <div className="sp-hero-inner">
                            <div className="sp-badge"><span className="sp-pulse" style={{ background:'hsl(200 70% 62%)' }} />Terms of Service</div>
                            <h1 className="sp-h1">How RentTrust works and what you agree to.</h1>
                            <p className="sp-sub">These terms explain your rights, responsibilities and the rules for using RentTrust to browse, list, verify and report rental properties.</p>
                        </div>
                    </div>
 
                    <div className="sp-content">
                        <div className="sp-grid-2" style={{ marginBottom:'1.5rem' }}>
                            {terms.map((t, i) => (
                                <div key={t.title} className="sp-card">
                                    <div style={{ display:'flex', alignItems:'center', gap:'0.625rem', marginBottom:'0.625rem' }}>
                                        <span style={{ width:24, height:24, borderRadius:'50%', background:'hsl(200 28% 18%)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:800, flexShrink:0 }}>{String(i+1).padStart(2,'0')}</span>
                                        <h3 style={{ fontSize:'0.9375rem', fontWeight:700, color:'hsl(200 25% 15%)', margin:0 }}>{t.title}</h3>
                                    </div>
                                    <p className="sp-card-p">{t.body}</p>
                                    <ul>{t.items.map(item => <li key={item}>{item}</li>)}</ul>
                                </div>
                            ))}
                        </div>
 
                        <div className="sp-callout">
                            <div style={{ fontWeight:700, fontSize:'0.9375rem', color:'hsl(174 62% 22%)', marginBottom:4 }}>By using RentTrust, you agree to these terms.</div>
                            <p style={{ color:'hsl(200 15% 40%)', fontSize:'0.875rem', lineHeight:1.65 }}>If you disagree with any part of these terms, please stop using the platform and contact our support team. We are happy to answer any questions about our policies.</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}