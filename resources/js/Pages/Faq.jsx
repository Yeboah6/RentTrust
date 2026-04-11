// import Header from '../Components/Layouts/Header';
// import Footer from '../Components/Layouts/Footer';

// export default function FaqPage() {
//     const faqs = [
//         {
//             question: 'How do I know a listing is verified?',
//             answer: 'Verified listings on RentTrust are reviewed for accuracy and identity. Always check for the verification badge and ask for the exact address before you commit.'
//         },
//         {
//             question: 'What if I suspect a fake or duplicate listing?',
//             answer: 'Report the listing immediately on our platform. We investigate every report and remove listings that do not follow our standards.'
//         },
//         {
//             question: 'Can I pay rent through RentTrust?',
//             answer: 'RentTrust is a listing platform, not a payment processor. Always pay only after inspection and with a signed receipt from the landlord or agent.'
//         },
//         {
//             question: 'What should I do before signing a tenancy agreement?',
//             answer: 'Read every clause carefully. Confirm the rent, advance payment, notice period, and agreement duration before adding your signature.'
//         },
//         {
//             question: 'How do I report a problem with a listing or agent?',
//             answer: 'Use our Report Issue page or contact support. Provide details, listing ID, and any messages so our team can act fast.'
//         },
//         {
//             question: 'Can I list my property as an agent?',
//             answer: 'Yes, agents can create listings after registering and selecting a plan. Contact support if you need help with onboarding.'
//         }
//     ];

//     return (
//         <>
//             <style>{`
//                 @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

//                 * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; box-sizing: border-box; }
//                 .page-shell { min-height: 100vh; display: flex; flex-direction: column; background: hsl(40 33% 98%); }
//                 .page-hero { position: relative; overflow: hidden; min-height: 320px; display: flex; align-items: center; background: linear-gradient(135deg, hsl(220 30% 41%) 0%, hsl(220 24% 39%) 40%, hsl(220 18% 34%) 100%); color: white; }
//                 .hero-inner { width: min(1100px, 100%); margin: 0 auto; padding: clamp(2rem, 5vw, 4rem); display: grid; gap: 1rem; }
//                 .hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.22); padding: 0.6rem 1rem; border-radius: 999px; font-weight: 600; font-size: 0.875rem; }
//                 .hero-title { font-size: clamp(2rem, 5vw, 3.25rem); line-height: 1.05; font-weight: 800; max-width: 9ch; }
//                 .hero-copy { max-width: 42rem; color: rgba(255,255,255,0.9); font-size: clamp(1rem, 2.2vw, 1.125rem); line-height: 1.75; }
//                 .page-content { width: min(1100px, 100%); margin: 0 auto; padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem); }
//                 .faq-list { display: grid; gap: 1rem; }
//                 .faq-item { background: white; border: 1px solid hsl(40 20% 88%); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 16px 40px hsl(200 15% 20% / 0.06); }
//                 .faq-item h2 { margin: 0 0 0.75rem; font-size: 1.05rem; color: hsl(220 30% 16%); }
//                 .faq-item p { margin: 0; color: hsl(200 15% 45%); line-height: 1.8; }
//                 .info-card { margin-top: 2rem; padding: 1.5rem; border-radius: 1rem; background: hsl(174 62% 32% / 0.1); border: 1px solid hsl(174 62% 32% / 0.12); }
//                 .info-card h3 { margin: 0 0 0.75rem; font-size: 1.05rem; color: hsl(174 62% 32%); }
//                 .info-card p { margin: 0; color: hsl(200 15% 45%); line-height: 1.7; }
//             `}</style>

//             <div className="page-shell">
//                 <Header />
//                 <main style={{ flex: 1 }}>
//                     <section className="page-hero">
//                         <div className="hero-inner">
//                             <span className="hero-badge">FAQs</span>
//                             <h1 className="hero-title">Frequently asked questions about renting and listings.</h1>
//                             <p className="hero-copy">Common questions answered clearly so you can make safer decisions, avoid scams, and understand how RentTrust protects you.</p>
//                         </div>
//                     </section>
//                     <section className="page-content">
//                         <div className="faq-list">
//                             {faqs.map((faq) => (
//                                 <div key={faq.question} className="faq-item">
//                                     <h2>{faq.question}</h2>
//                                     <p>{faq.answer}</p>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="info-card">
//                             <h3>Need more help?</h3>
//                             <p>If you cannot find your answer here, visit our Contact page or submit a report from the Report Issue page. We are here to support every tenant in Ghana.</p>
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

export default function FaqPage() {
    const faqs = [
        { q:'How do I know a listing is verified?', a:'Verified listings on RentTrust are reviewed for accuracy and identity. Always check for the green verification badge and ask for the exact address before you commit.', icon:'🛡' },
        { q:'What if I suspect a fake or duplicate listing?', a:'Report the listing immediately using the Report button on the listing page. We investigate every report and remove listings that don\'t follow our standards.', icon:'🚩' },
        { q:'Can I pay rent through RentTrust?', a:'RentTrust is a listing platform, not a payment processor. Always pay only after inspection and with a signed receipt from the landlord or agent.', icon:'💳' },
        { q:'What should I do before signing a tenancy agreement?', a:'Read every clause carefully. Confirm the rent, advance payment, notice period, and agreement duration before signing anything.', icon:'📄' },
        { q:'How do I report a problem with a listing or agent?', a:'Use our Report Issue page or contact support. Provide details, listing ID, and any messages so our team can act fast.', icon:'📣' },
        { q:'Can I list my property as an agent?', a:'Yes. Agents can create listings after registering and selecting a plan. Contact support if you need help with onboarding.', icon:'🏠' },
        { q:'How long does verification take?', a:'Most listings are reviewed within 1–2 business days after all required documents and photos are submitted.', icon:'⏱' },
        { q:'What happens if a landlord doesn\'t return my deposit?', a:'Document everything in writing before you move in. If there\'s a dispute, report it to us and we can flag the landlord\'s profile accordingly.', icon:'⚠' },
    ];
 
    return (
        <>
            <style>{BASE_CSS}</style>
            <div className="sp-shell">
                <Header />
                <main style={{ flex:1 }}>
                    <div className="sp-hero" style={{ background:'linear-gradient(135deg,hsl(220 35% 16%),hsl(220 28% 24%))' }}>
                        <HeroMosaic tint="hsl(220 35% 16% / 0.98)" />
                        <div className="sp-hero-inner">
                            <div className="sp-badge"><span className="sp-pulse" style={{ background:'hsl(38 92% 60%)' }} />FAQs</div>
                            <h1 className="sp-h1">Frequently asked questions.</h1>
                            <p className="sp-sub">Common questions answered clearly so you can make safer decisions, avoid scams, and understand how RentTrust protects you.</p>
                        </div>
                    </div>
 
                    <div className="sp-content">
                        <div className="sp-grid-2" style={{ marginBottom:'1.5rem' }}>
                            {faqs.map(f => (
                                <div key={f.q} className="sp-card" style={{ display:'flex', gap:'0.875rem' }}>
                                    <div style={{ fontSize:'1.25rem', flexShrink:0, marginTop:2, lineHeight:1 }}>{f.icon}</div>
                                    <div>
                                        <h3 className="sp-card-h">{f.q}</h3>
                                        <p className="sp-card-p">{f.a}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
 
                        <div className="sp-callout" style={{ display:'flex', alignItems:'flex-start', gap:'1rem' }}>
                            <div style={{ fontSize:'1.5rem', flexShrink:0 }}>💬</div>
                            <div>
                                <div style={{ fontWeight:700, fontSize:'0.9375rem', color:'hsl(174 62% 22%)', marginBottom:4 }}>Still have a question?</div>
                                <p style={{ color:'hsl(200 15% 40%)', fontSize:'0.875rem', lineHeight:1.65 }}>If you can't find your answer here, visit our <Link href="/contact" style={{ color:'hsl(174 62% 30%)', fontWeight:600 }}>Contact page</Link> or submit a report from the Report Issue page. We're here to support every tenant in Ghana.</p>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}