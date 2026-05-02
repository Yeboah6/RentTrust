import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Header from '../Components/Layouts/Header';
import Footer from '../Components/Layouts/Footer';

export default function ContactPage() {
    const { props } = usePage();
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(null);
    const [focused, setFocused] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        axios.post(route('contact.send'), form)
            .then(() => {
                setSuccess("Thank you for reaching out! We'll get back to you within 24 hours.");
                setForm({ name: '', email: '', phone: '', subject: '', message: '' });
                setErrors({});
                setSubmitting(false);
            })
            .catch(err => {
                if (err.response?.data?.errors) setErrors(err.response.data.errors);
                setSubmitting(false);
            });
    };

    const inputStyle = (field) => ({
        width: '100%',
        padding: '0.875rem 1rem',
        borderRadius: '0.5rem',
        border: `1.5px solid ${errors[field] ? 'hsl(0 72% 51%)' : focused === field ? 'hsl(174 62% 32%)' : 'hsl(40 20% 85%)'}`,
        backgroundColor: focused === field ? 'white' : 'hsl(40 30% 98%)',
        fontSize: '0.9375rem',
        color: 'hsl(200 25% 15%)',
        outline: 'none',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
        boxShadow: focused === field ? '0 0 0 3px hsl(174 62% 32% / 0.1)' : 'none',
    });

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: '600',
        fontSize: '0.8125rem',
        color: 'hsl(200 25% 20%)',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
    };

    const contactDetails = [
        {
            icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            label: 'Office',
            value: 'Dome Pillar II, Accra, Ghana',
        },
        {
            icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            label: 'Phone',
            value: '+233 57 676 0647',
        },
        {
            icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            label: 'Email',
            value: 'renttrust2026@gmail.com',
        },
        {
            icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            label: 'Hours',
            value: 'Mon – Fri, 8am – 6pm GMT',
        },
    ];

    const subjects = [
        'General Enquiry',
        'Property Listing',
        'Verification Request',
        'Account Support',
        'Partnership',
        'Other',
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

                * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; box-sizing: border-box; }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.92); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .contact-hero { animation: fadeIn 0.6s ease both; }
                .contact-card { animation: fadeUp 0.6s ease 0.1s both; }
                .contact-info { animation: fadeUp 0.6s ease 0.2s both; }
                .success-msg  { animation: scaleIn 0.4s ease both; }

                .contact-detail-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 1rem;
                    border-radius: 0.75rem;
                    transition: background 0.2s;
                    cursor: default;
                }
                .contact-detail-item:hover {
                    background: hsl(174 62% 32% / 0.06);
                }

                .submit-btn {
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.15s, box-shadow 0.15s;
                }
                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px hsl(174 62% 32% / 0.35);
                }
                .submit-btn:active:not(:disabled) {
                    transform: scale(0.98);
                }
                .submit-btn::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
                    pointer-events: none;
                }

                .spinner {
                    width: 1.125rem;
                    height: 1.125rem;
                    border: 2px solid rgba(255,255,255,0.35);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                    display: inline-block;
                    margin-right: 0.5rem;
                    vertical-align: middle;
                }

                .faq-item {
                    border-bottom: 1px solid hsl(40 20% 88%);
                    padding: 1rem 0;
                }
                .faq-item:last-child { border-bottom: none; }

                select option { background: white; }

                @media (max-width: 768px) {
                    .contact-grid { flex-direction: column !important; }
                    .hero-pattern { display: none !important; }
                }
            `}</style>

            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'hsl(40 33% 98%)' }}>
                <Header />

                <main style={{ flex: 1 }}>

                    {/* ── Hero Banner ── */}
                    {/* ── Hero Banner — mosaic background ── */}
                    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '360px', display: 'flex', alignItems: 'center' }}>

                        {/* Base gradient */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, hsl(174 62% 22%) 0%, hsl(174 55% 32%) 60%, hsl(174 45% 38%) 100%)', zIndex: 0 }} />

                        {/* Property mosaic — right 52% */}
                        <div style={{
                            position: 'absolute', right: 0, top: 0, bottom: 0, width: '56%', zIndex: 1,
                            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                            gridTemplateRows: 'repeat(3, 1fr)', gap: '4px',
                          }}>
                            {/* Tall cell spanning 2 rows */}
                            <div style={{ gridRow: '1 / 3', background: 'hsl(174 25% 22%)', overflow: 'hidden' }}>
                              <img src="/images/download 2.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                            </div>
                            <div style={{ background: 'hsl(200 30% 18%)', overflow: 'hidden' }}>
                              <img src="/images/download 1.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                            </div>
                            <div style={{ background: 'hsl(174 35% 16%)', overflow: 'hidden' }}>
                              <img src="/images/download 2.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                            </div>
                            {/* Wide cell spanning 2 columns */}
                            <div style={{ gridColumn: '2 / 4', background: 'hsl(30 25% 18%)', overflow: 'hidden' }}>
                              <img src="/images/download 1.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                            </div>
                            <div style={{ background: 'hsl(220 30% 16%)', overflow: 'hidden' }}>
                              <img src="/images/download 3.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                            </div>
                            <div style={{ background: 'hsl(174 20% 14%)', overflow: 'hidden' }}>
                              <img src="/images/download 5.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                            </div>
                            <div style={{ background: 'hsl(15 25% 16%)', overflow: 'hidden' }}>
                              <img src="/images/download 4.jfif" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                            </div>
                          </div>
                        
                        {/* Dot grid overlay */}
                        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.06, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                        
                        {/* Glow accent */}
                        <div style={{ position: 'absolute', right: '-4rem', top: '-4rem', width: '20rem', height: '20rem', borderRadius: '50%', background: 'radial-gradient(circle, hsl(174 62% 50% / 0.2) 0%, transparent 70%)', zIndex: 2, pointerEvents: 'none' }} />
                        
                        {/* Gradient fade — content side */}
                        <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to right, hsl(174 60% 22% / 0.98) 0%, hsl(174 58% 22% / 0.88) 38%, hsl(174 55% 22% / 0.45) 70%, hsl(174 55% 22% / 0.15) 100%)' }} />
                        
                        {/* Content */}
                        <div style={{ position: 'relative', zIndex: 3, padding: 'clamp(2.5rem, 7vw, 4.5rem) clamp(1rem, 4vw, 2.5rem)', maxWidth: '560px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: '600', marginBottom: '1.25rem' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'hsl(152 70% 60%)', animation: 'pulse 2s ease infinite', flexShrink: 0 }} />
                                We typically respond within 24 hours
                            </div>
                            <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                                Let's talk about<br />
                                <span style={{ color: 'hsl(40 90% 70%)' }}>your property.</span>
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)', lineHeight: '1.6', maxWidth: '420px' }}>
                                Whether you're listing a property, need help with verification, or just have a question — we're here for you.
                            </p>
                        </div>
                    </div>

                    {/* ── Main Content ── */}
                    <div className="container mx-auto" style={{
                        maxWidth: '1080px',
                        padding: 'clamp(2rem, 6vw, 4rem) clamp(0.75rem, 3vw, 1rem)',
                    }}>
                        <div className="contact-grid" style={{ display: 'flex', gap: 'clamp(1.5rem, 4vw, 3rem)', alignItems: 'flex-start' }}>

                            {/* ── Form Card ── */}
                            <div className="contact-card" style={{
                                flex: '1 1 0',
                                backgroundColor: 'white',
                                borderRadius: '1.25rem',
                                border: '1px solid hsl(40 20% 88%)',
                                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                                boxShadow: '0 4px 32px hsl(200 25% 15% / 0.07)',
                            }}>
                                <h2 style={{
                                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                                    fontWeight: '700',
                                    color: 'hsl(200 25% 15%)',
                                    marginBottom: '0.375rem',
                                }}>Send us a message</h2>
                                <p style={{ color: 'hsl(200 15% 50%)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                                    Fill in the form and our team will be in touch shortly.
                                </p>

                                {success && (
                                    <div className="success-msg" style={{
                                        marginBottom: '1.5rem',
                                        padding: '1rem 1.25rem',
                                        borderRadius: '0.75rem',
                                        background: 'hsl(152 60% 40% / 0.08)',
                                        border: '1px solid hsl(152 60% 40% / 0.2)',
                                        color: 'hsl(152 55% 30%)',
                                        display: 'flex',
                                        gap: '0.75rem',
                                        alignItems: 'flex-start',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                    }}>
                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ flexShrink: 0, marginTop: '0.05rem' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {success}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {/* Name + Email row */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                                        <div>
                                            <label htmlFor="name" style={labelStyle}>Full Name *</label>
                                            <input
                                                id="name" name="name" value={form.name}
                                                onChange={handleChange}
                                                onFocus={() => setFocused('name')}
                                                onBlur={() => setFocused(null)}
                                                placeholder="John Mensah"
                                                style={inputStyle('name')}
                                            />
                                            {errors.name && <p style={{ color: 'hsl(0 72% 51%)', fontSize: '0.8rem', marginTop: '0.375rem' }}>{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="email" style={labelStyle}>Email Address *</label>
                                            <input
                                                id="email" name="email" type="email" value={form.email}
                                                onChange={handleChange}
                                                onFocus={() => setFocused('email')}
                                                onBlur={() => setFocused(null)}
                                                placeholder="john@example.com"
                                                style={inputStyle('email')}
                                            />
                                            {errors.email && <p style={{ color: 'hsl(0 72% 51%)', fontSize: '0.8rem', marginTop: '0.375rem' }}>{errors.email}</p>}
                                        </div>
                                    </div>

                                    {/* Phone + Subject row */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                                        <div>
                                            <label htmlFor="phone" style={labelStyle}>Phone Number</label>
                                            <input
                                                id="phone" name="phone" type="tel" value={form.phone}
                                                onChange={handleChange}
                                                onFocus={() => setFocused('phone')}
                                                onBlur={() => setFocused(null)}
                                                placeholder="+233 ..."
                                                style={inputStyle('phone')}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="subject" style={labelStyle}>Subject *</label>
                                            <select
                                                id="subject" name="subject" value={form.subject}
                                                onChange={handleChange}
                                                onFocus={() => setFocused('subject')}
                                                onBlur={() => setFocused(null)}
                                                style={{ ...inputStyle('subject'), appearance: 'none', cursor: 'pointer' }}
                                            >
                                                <option value="">Select a topic…</option>
                                                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            {errors.subject && <p style={{ color: 'hsl(0 72% 51%)', fontSize: '0.8rem', marginTop: '0.375rem' }}>{errors.subject}</p>}
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="message" style={labelStyle}>Message *</label>
                                        <textarea
                                            id="message" name="message" value={form.message}
                                            onChange={handleChange}
                                            onFocus={() => setFocused('message')}
                                            onBlur={() => setFocused(null)}
                                            rows={6}
                                            placeholder="Tell us how we can help you…"
                                            style={{ ...inputStyle('message'), resize: 'vertical', minHeight: '130px' }}
                                        />
                                        {errors.message && <p style={{ color: 'hsl(0 72% 51%)', fontSize: '0.8rem', marginTop: '0.375rem' }}>{errors.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="submit-btn"
                                        style={{
                                            padding: '0.9375rem 2rem',
                                            background: submitting
                                                ? 'hsl(174 40% 50%)'
                                                : 'linear-gradient(135deg, hsl(174 62% 28%) 0%, hsl(174 55% 36%) 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.625rem',
                                            fontSize: '0.9375rem',
                                            fontWeight: '700',
                                            cursor: submitting ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            letterSpacing: '0.01em',
                                            width: '100%',
                                        }}
                                    >
                                        {submitting ? (
                                            <><span className="spinner" />Sending…</>
                                        ) : (
                                            <>
                                                Send Message
                                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </>
                                        )}
                                    </button>

                                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'hsl(200 15% 55%)' }}>
                                        We respect your privacy and will never share your information.
                                    </p>
                                </form>
                            </div>

                            {/* ── Right Column ── */}
                            <div className="contact-info" style={{
                                flex: '0 0 clamp(260px, 30%, 320px)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                            }}>
                                {/* Contact Details */}
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '1.25rem',
                                    border: '1px solid hsl(40 20% 88%)',
                                    padding: '1.5rem',
                                    boxShadow: '0 4px 32px hsl(200 25% 15% / 0.06)',
                                }}>
                                    <h3 style={{
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        color: 'hsl(200 25% 15%)',
                                        marginBottom: '0.25rem',
                                    }}>Get in touch</h3>
                                    <p style={{ fontSize: '0.8375rem', color: 'hsl(200 15% 50%)', marginBottom: '1.25rem' }}>
                                        Prefer to reach us directly?
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        {contactDetails.map(({ icon, label, value }) => (
                                            <div key={label} className="contact-detail-item">
                                                <div style={{
                                                    width: '2.25rem', height: '2.25rem',
                                                    borderRadius: '0.5rem',
                                                    backgroundColor: 'hsl(174 62% 32% / 0.1)',
                                                    color: 'hsl(174 62% 32%)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}>
                                                    {icon}
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(200 15% 50%)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.125rem' }}>{label}</p>
                                                    <p style={{ fontSize: '0.875rem', color: 'hsl(200 25% 20%)', fontWeight: '500' }}>{value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* FAQ */}
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '1.25rem',
                                    border: '1px solid hsl(40 20% 88%)',
                                    padding: '1.5rem',
                                    boxShadow: '0 4px 32px hsl(200 25% 15% / 0.06)',
                                }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'hsl(200 25% 15%)', marginBottom: '1rem' }}>
                                        Common questions
                                    </h3>
                                    {[
                                        { q: 'How do I list a property?', a: 'Sign up as an agent and use the dashboard to add your first listing.' },
                                        { q: 'How long does verification take?', a: 'Typically 1–2 business days after documents are submitted.' },
                                        { q: 'Is RentTrust free to use?', a: 'Basic listings are free. Pro plans unlock unlimited listings and analytics.' },
                                    ].map(({ q, a }) => (
                                        <div key={q} className="faq-item">
                                            <p style={{ fontWeight: '600', fontSize: '0.875rem', color: 'hsl(200 25% 20%)', marginBottom: '0.375rem' }}>{q}</p>
                                            <p style={{ fontSize: '0.8125rem', color: 'hsl(200 15% 50%)', lineHeight: '1.55' }}>{a}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Social / CTA */}
                                <div style={{
                                    borderRadius: '1.25rem',
                                    background: 'linear-gradient(135deg, hsl(174 62% 22%) 0%, hsl(174 50% 32%) 100%)',
                                    padding: '1.5rem',
                                    color: 'white',
                                }}>
                                    <p style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.375rem' }}>Follow us</p>
                                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
                                        Stay updated on new listings and tips.
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.625rem' }}>
                                        {['Instagram'].map(s => (
                                            <a key={s} href="https://www.instagram.com/renttrustgh" style={{
                                                padding: '0.4rem 0.75rem',
                                                borderRadius: '0.375rem',
                                                backgroundColor: 'rgba(255,255,255,0.15)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                color: 'white',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                textDecoration: 'none',
                                                transition: 'background 0.2s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                                            >
                                                {s}
                                            </a>
                                        ))}
                                    </div>
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