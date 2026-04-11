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

export default function PrivacyPage() {
    const sections = [
        {
            title: 'Information we collect',
            body: 'We collect details you provide when you register, list a property or contact support. This includes your name, email, phone number, and listing details.',
            items: ['Account details (name, email, phone)','Listing information you submit','Device and browser data for security','Messages sent through our platform'],
        },
        {
            title: 'How we use your data',
            body: 'We use collected data to verify listings, improve search results, send notifications, and respond to your requests.',
            items: ['Deliver and improve the RentTrust service','Verify agent and listing accuracy','Send relevant notifications and updates','Detect and prevent fraud'],
        },
        {
            title: 'Sharing and disclosure',
            body: 'We do not sell your personal information. We may share your data with service providers only to deliver the RentTrust service.',
            items: ['Trusted service providers under strict agreements','Authorities when required by law','No advertising networks or data brokers'],
        },
        {
            title: 'Your rights',
            body: 'You have the right to access, correct, or delete your personal data at any time by contacting our support team.',
            items: ['Request a copy of your data','Correct inaccurate information','Delete your account and associated data','Withdraw consent at any time'],
        },
        {
            title: 'Cookies and tracking',
            body: 'We use essential cookies to keep you signed in and remember preferences. We do not use third-party advertising cookies.',
            items: ['Session and authentication cookies','Analytics to improve site performance','No advertising or tracking cookies'],
        },
        {
            title: 'Data security',
            body: 'We use industry-standard encryption and security practices to protect your data from unauthorised access.',
            items: ['HTTPS encryption on all pages','Regular security audits','Strict access controls for our team'],
        },
    ];
 
    return (
        <>
            <style>{BASE_CSS}</style>
            <div className="sp-shell">
                <Header />
                <main style={{ flex:1 }}>
                    <div className="sp-hero" style={{ background:'linear-gradient(135deg,hsl(152 60% 16%),hsl(152 52% 24%))' }}>
                        <HeroMosaic tint="hsl(152 60% 16% / 0.98)" />
                        <div className="sp-hero-inner">
                            <div className="sp-badge"><span className="sp-pulse" style={{ background:'hsl(152 70% 58%)' }} />Privacy Policy</div>
                            <h1 className="sp-h1">How we collect, use and protect your data.</h1>
                            <p className="sp-sub">We only use the information required to keep listings accurate, protect users, and improve the RentTrust experience.</p>
                        </div>
                    </div>
 
                    <div className="sp-content">
                        <div className="sp-grid-2" style={{ marginBottom:'1.5rem' }}>
                            {sections.map(s => (
                                <div key={s.title} className="sp-card">
                                    <h3 className="sp-card-h" style={{ color:'hsl(152 55% 28%)' }}>{s.title}</h3>
                                    <p className="sp-card-p">{s.body}</p>
                                    <ul>{s.items.map(i => <li key={i}>{i}</li>)}</ul>
                                </div>
                            ))}
                        </div>
 
                        <div className="sp-callout">
                            <div style={{ fontWeight:700, fontSize:'0.9375rem', color:'hsl(174 62% 22%)', marginBottom:6 }}>Questions about your privacy?</div>
                            <p style={{ color:'hsl(200 15% 40%)', fontSize:'0.875rem', lineHeight:1.65 }}>If you have questions about your privacy or want to update your information, contact our support team and we will respond as quickly as possible. Last updated: April 2026.</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}