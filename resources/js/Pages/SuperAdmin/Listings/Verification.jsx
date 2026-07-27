import { useState, useEffect, useCallback, useRef } from "react";
import { router, Link, usePage, Head } from "@inertiajs/react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";

// ─── Shared styles injected once ─────────────────────────────────────────────

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');

  .lv-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
  .lv-wrap { font-family: 'DM Sans', sans-serif; background: #0a0908; min-height: 100vh; padding: 2rem; }

  /* ── page header ── */
  .lv-page-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem; color: #f5f0e8; line-height: 1.15; letter-spacing: -0.01em;
  }
  .lv-page-sub {
    font-size: 0.8rem; color: rgba(245,240,232,0.35);
    font-weight: 300; letter-spacing: 0.05em; text-transform: uppercase; margin-top: 0.3rem;
  }

  /* ── KPI strip ── */
  .lv-kpi {
    display: inline-flex; align-items: center; gap: 0.875rem;
    padding: 0.75rem 1.25rem;
    background: rgba(232,160,32,0.07);
    border: 1px solid rgba(232,160,32,0.2);
    border-radius: 2px;
    margin-bottom: 1.5rem;
  }
  .lv-kpi-icon {
    width: 2.25rem; height: 2.25rem; border-radius: 2px;
    background: rgba(232,160,32,0.12); color: #e8a020;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; flex-shrink: 0;
  }
  .lv-kpi-val {
    font-family: 'DM Serif Display', serif;
    font-size: 1.75rem; color: #e8a020; line-height: 1;
  }
  .lv-kpi-label { font-size: 0.72rem; color: rgba(245,240,232,0.45); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 0.15rem; }

  /* ── filter bar ── */
  .lv-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
  .lv-filter-btn {
    padding: 0.35rem 0.875rem;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 2px;
    background: rgba(255,255,255,0.03);
    color: rgba(245,240,232,0.45);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase;
    cursor: pointer; transition: all 0.15s;
  }
  .lv-filter-btn:hover { border-color: rgba(232,160,32,0.3); color: rgba(245,240,232,0.75); background: rgba(232,160,32,0.04); }
  .lv-filter-btn.active { background: #e8a020; border-color: #e8a020; color: #0a0908; font-weight: 700; }

  /* ── card ── */
  .lv-card {
    background: #0f0e0c;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 2px;
    overflow: hidden;
    transition: border-color 0.2s, opacity 0.2s;
    margin-bottom: 0.75rem;
  }
  .lv-card:hover { border-color: rgba(232,160,32,0.22); }
  .lv-card.updating { opacity: 0.6; pointer-events: none; }

  .lv-card-stripe { height: 3px; background: linear-gradient(90deg,#e8a020 0%,#f0c060 50%,#e8a020 100%); }

  /* ── card header ── */
  .lv-card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.875rem 1.125rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    cursor: pointer; gap: 1rem; user-select: none;
  }
  .lv-card-header:hover { background: rgba(255,255,255,0.015); }

  /* ── avatar ── */
  .lv-avatar {
    width: 2.75rem; height: 2.75rem; border-radius: 2px; flex-shrink: 0;
    background: rgba(232,160,32,0.1); color: #e8a020;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Serif Display', serif; font-size: 1.1rem;
    overflow: hidden;
  }
  .lv-avatar img { width: 100%; height: 100%; object-fit: cover; }

  /* ── badges ── */
  .lv-badge {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.2rem 0.6rem; border-radius: 2px;
    font-size: 0.62rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
    white-space: nowrap;
  }
  .lv-badge-dot { width: 0.32rem; height: 0.32rem; border-radius: 50%; flex-shrink: 0; }

  .lv-badge.pending  { background: rgba(232,160,32,0.12); color: #e8a020; }
  .lv-badge.pending .lv-badge-dot { background: #e8a020; }
  .lv-badge.approved { background: rgba(74,175,100,0.12); color: #4caf65; }
  .lv-badge.approved .lv-badge-dot { background: #4caf65; }
  .lv-badge.rejected { background: rgba(220,60,60,0.12); color: #e05050; }
  .lv-badge.rejected .lv-badge-dot { background: #e05050; }

  .lv-type-badge {
    display: inline-flex; align-items: center; gap: 0.25rem;
    padding: 0.15rem 0.5rem; border-radius: 2px;
    font-size: 0.58rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
    border: 1px solid;
  }
  .lv-type-sale  { color: rgba(74,175,100,0.85);  border-color: rgba(74,175,100,0.2);  background: rgba(74,175,100,0.07); }
  .lv-type-rent  { color: rgba(100,160,232,0.85);  border-color: rgba(100,160,232,0.2); background: rgba(100,160,232,0.07); }
  .lv-type-short { color: rgba(180,130,232,0.85); border-color: rgba(180,130,232,0.2); background: rgba(180,130,232,0.07); }
  .lv-type-lease { color: rgba(232,160,32,0.85);  border-color: rgba(232,160,32,0.2);  background: rgba(232,160,32,0.07); }

  /* ── meta grid ── */
  .lv-meta-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(150px,1fr));
    gap: 1rem; padding: 0.875rem 1.125rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .lv-meta-label {
    font-size: 0.63rem; font-weight: 700; color: rgba(245,240,232,0.35);
    text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 0.25rem;
  }
  .lv-meta-val { font-size: 0.825rem; font-weight: 500; color: #f5f0e8; }

  /* ── expandable details ── */
  .lv-details {
    padding: 1rem 1.125rem 1.25rem;
    border-top: 1px solid rgba(255,255,255,0.05);
    animation: lvSlideOpen 0.25s ease-out;
    display: flex; flex-direction: column; gap: 1.125rem;
  }
  @keyframes lvSlideOpen {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── divider ── */
  .lv-divider { height: 1px; background: rgba(255,255,255,0.06); }

  /* ── label ── */
  .lv-label {
    font-size: 0.6875rem; font-weight: 500;
    color: rgba(245,240,232,0.4);
    letter-spacing: 0.08em; text-transform: uppercase;
    display: block; margin-bottom: 0.5rem;
  }

  /* ── textarea / input ── */
  .lv-textarea {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 2px;
    padding: 0.65rem 0.75rem;
    font-size: 0.8125rem; color: #f5f0e8;
    font-family: 'DM Sans', sans-serif; font-weight: 300;
    outline: none; resize: vertical; min-height: 72px; line-height: 1.6;
    transition: border-color 0.15s;
  }
  .lv-textarea::placeholder { color: rgba(245,240,232,0.2); }
  .lv-textarea:focus { border-color: rgba(232,160,32,0.5); background: rgba(232,160,32,0.03); }
  .lv-textarea.err { border-color: rgba(220,60,60,0.5); }

  /* ── admin panel ── */
  .lv-admin-panel {
    background: rgba(232,160,32,0.04);
    border: 1px solid rgba(232,160,32,0.18);
    border-radius: 2px;
    padding: 1rem 1.125rem;
    display: flex; flex-direction: column; gap: 0.875rem;
  }
  .lv-admin-title {
    font-size: 0.7rem; font-weight: 700; color: rgba(232,160,32,0.7);
    text-transform: uppercase; letter-spacing: 0.07em;
  }

  /* ── action row ── */
  .lv-action-row { display: flex; gap: 0.625rem; flex-wrap: wrap; }

  /* ── buttons ── */
  .lv-btn-approve {
    flex: 2; padding: 0.65rem 1rem;
    background: #4caf65; border: none; border-radius: 2px;
    font-family: 'DM Sans', sans-serif; font-size: 0.8125rem; font-weight: 500;
    color: #0a0908; letter-spacing: 0.04em; text-transform: uppercase;
    cursor: pointer; transition: background 0.15s, opacity 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 0.4rem;
  }
  .lv-btn-approve:hover:not(:disabled) { background: #5bc272; }
  .lv-btn-approve:disabled { opacity: 0.45; cursor: not-allowed; }

  .lv-btn-reject {
    flex: 2; padding: 0.65rem 1rem;
    background: rgba(220,60,60,0.12); border: 1px solid rgba(220,60,60,0.3); border-radius: 2px;
    font-family: 'DM Sans', sans-serif; font-size: 0.8125rem; font-weight: 500;
    color: #e05050; letter-spacing: 0.04em; text-transform: uppercase;
    cursor: pointer; transition: all 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 0.4rem;
  }
  .lv-btn-reject:hover:not(:disabled) { background: rgba(220,60,60,0.2); }
  .lv-btn-reject:disabled { opacity: 0.45; cursor: not-allowed; }

  .lv-btn-view {
    flex: 1; padding: 0.65rem 0.875rem;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 2px;
    font-family: 'DM Sans', sans-serif; font-size: 0.8125rem; font-weight: 400;
    color: rgba(245,240,232,0.55); letter-spacing: 0.04em; text-transform: uppercase;
    cursor: pointer; transition: all 0.15s; text-decoration: none;
    display: flex; align-items: center; justify-content: center; gap: 0.4rem;
  }
  .lv-btn-view:hover:not(:disabled) { background: rgba(255,255,255,0.08); color: #f5f0e8; }

  /* ── review history block ── */
  .lv-history-panel {
    background: rgba(74,175,100,0.04);
    border: 1px solid rgba(74,175,100,0.18);
    border-radius: 2px;
    padding: 1rem 1.125rem;
  }
  .lv-history-title { font-size: 0.7rem; font-weight: 700; color: rgba(74,175,100,0.7); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 0.75rem; }
  .lv-history-note { background: rgba(255,255,255,0.03); border-left: 2px solid rgba(232,160,32,0.4); padding: 0.6rem 0.75rem; border-radius: 0 2px 2px 0; font-size: 0.8125rem; color: rgba(245,240,232,0.7); line-height: 1.5; }
  .lv-history-reject { background: rgba(220,60,60,0.07); border-left: 2px solid rgba(220,60,60,0.4); padding: 0.6rem 0.75rem; border-radius: 0 2px 2px 0; font-size: 0.8125rem; color: rgba(245,240,232,0.7); line-height: 1.5; margin-top: 0.5rem; }

  /* ── document section ── */
  .lv-doc-section { margin-bottom: 1rem; }
  .lv-doc-section-title { 
    font-size: 0.75rem; 
    font-weight: 600; 
    color: rgba(245,240,232,0.4); 
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .lv-doc-empty { 
    font-size: 0.875rem; 
    color: rgba(245,240,232,0.3); 
    font-style: italic; 
  }
  .lv-doc-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .lv-doc-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: rgba(232,160,32,0.08);
    border: 1px solid rgba(232,160,32,0.15);
    border-radius: 0.375rem;
    text-decoration: none;
    color: rgba(232,160,32,0.85);
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
  }
  .lv-doc-link:hover { background: rgba(232,160,32,0.15); border-color: rgba(232,160,32,0.25); }

  /* ── empty state ── */
  .lv-empty {
    text-align: center; padding: 3.5rem 1rem;
    border: 1px dashed rgba(255,255,255,0.1); border-radius: 2px;
    color: rgba(245,240,232,0.35);
  }
  .lv-empty-title { font-family: 'DM Serif Display', serif; font-size: 1.25rem; color: rgba(245,240,232,0.55); margin: 0.75rem 0 0.4rem; }
  .lv-empty-sub { font-size: 0.8rem; font-weight: 300; }

  /* ── chevron ── */
  .lv-chevron { transition: transform 0.2s; color: rgba(245,240,232,0.3); }
  .lv-chevron.open { transform: rotate(180deg); }

  /* ── pagination ── */
  .lv-pager { display: flex; align-items: center; gap: 0.3rem; }
  .lv-pager-info { font-size: 0.72rem; color: rgba(245,240,232,0.3); }
  .lv-page-btn {
    display: flex; align-items: center; justify-content: center;
    min-width: 1.875rem; height: 1.875rem; padding: 0 0.35rem;
    border-radius: 2px; border: 1px solid rgba(255,255,255,0.09);
    background: rgba(255,255,255,0.03); color: rgba(245,240,232,0.5);
    font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 500;
    cursor: pointer; transition: all 0.15s;
  }
  .lv-page-btn:hover:not(:disabled) { border-color: rgba(232,160,32,0.35); color: #e8a020; }
  .lv-page-btn.active { background: #e8a020; border-color: #e8a020; color: #0a0908; font-weight: 700; }
  .lv-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  /* ── toast ── */
  .lv-toast {
    position: fixed; top: 1.25rem; right: 1.25rem;
    padding: 0.875rem 1.125rem; border-radius: 2px;
    z-index: 9999; max-width: 300px; border-left: 3px solid;
    animation: lvSlideIn 0.25s ease-out;
  }
  .lv-toast.success { background: #0f1a10; border-color: #4caf65; }
  .lv-toast.error   { background: #1a0f0f; border-color: #e05050; }
  .lv-toast.warning { background: #1a1608; border-color: #e8a020; }
  .lv-toast-title { font-size: 0.8125rem; font-weight: 500; color: #f5f0e8; }
  .lv-toast-desc  { font-size: 0.75rem; color: rgba(245,240,232,0.5); margin-top: 0.15rem; }
  @keyframes lvSlideIn { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  /* ── confirm modal ── */
  .lv-overlay {
    position: fixed; inset: 0;
    background: rgba(10,8,5,0.8); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    z-index: 9000; padding: 1rem;
  }
  .lv-modal {
    background: #0f0e0c; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 2px; width: 100%; max-width: 420px;
    animation: lvModalIn 0.22s cubic-bezier(0.16,1,0.3,1);
    overflow: hidden;
  }
  @keyframes lvModalIn { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
  .lv-modal-body { padding: 1.5rem; }
  .lv-modal-title { font-family: 'DM Serif Display', serif; font-size: 1.25rem; color: #f5f0e8; margin-bottom: 0.25rem; }
  .lv-modal-sub { font-size: 0.78rem; color: rgba(245,240,232,0.4); font-weight: 300; margin-bottom: 1.125rem; }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtDate = (v) => {
  if (!v) return "—";
  try { return new Date(v).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return v; }
};

const fmtPrice = (v, currency = "GH₵") => {
  if (!v && v !== 0) return "—";
  const n = Number(v);
  if (n >= 1_000_000) return `${currency}${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${currency}${(n / 1_000).toFixed(0)}K`;
  return `${currency}${n.toLocaleString()}`;
};

/**
 * Validate and sanitize URLs to prevent malicious links
 */
const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const resolveImages = (raw) => {
  if (!raw) return [];
  const arr = typeof raw === "string" ? (() => { try { return JSON.parse(raw); } catch { return []; } })() : raw;
  return (Array.isArray(arr) ? arr : []).map((img) => {
    if (!img || typeof img !== "string") return null;
    if (img.startsWith("http")) return img;
    if (img.includes("/")) return `/storage/${img}`;
    return `/storage/rental_images/${img}`;
  }).filter(Boolean);
};

const basename = (path) => {
  if (!path) return "";
  const parts = path.split(/[/\\]/);
  return parts[parts.length - 1] || "";
};

const parseDocumentArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value); } catch { return []; }
};

const normalizeDocs = (docs) =>
  parseDocumentArray(docs)
    .map((doc) => {
      if (!doc || typeof doc !== "object") return null;
      const url = doc.url || (doc.path ? `/storage/${doc.path}` : null);
      return {
        original_name: doc.original_name || doc.filename || basename(doc.path || ""),
        url: url && isValidUrl(url) ? url : null,
      };
    })
    .filter(doc => doc && doc.url);

const normalise = (v) => {
  const rental = v.rental;
  return {
    ...v,
    _id: rental?.id ?? v.id,
    verification_request_id: v.verification_request_id || v.id,
    title: rental?.title ?? "Untitled",
    status_key: (v.status ?? "pending").toLowerCase(),
    listing_type: (rental?.purpose ?? "sale").toLowerCase(),
    property_type: rental?.property_type ?? "",
    price: rental?.sale_price ?? rental?.rent_min ?? 0,
    currency: "GH₵",
    location: [rental?.area, rental?.city].filter(Boolean).join(", ") || "—",
    agent_name: v.agent?.name ?? rental?.agent_name ?? "—",
    agent_id: v.agent?.id ?? null,
    views: rental?.views_count ?? 0,
    inquiries: rental?.inquiries_count ?? 0,
    images: resolveImages(rental?.images),
    bedrooms: rental?.bedrooms ?? null,
    bathrooms: rental?.bathrooms ?? null,
    created_at: v.created_at ?? "",
    reviewed_at: v.reviewed_at ?? null,
    admin_notes: v.admin_notes ?? "",
    rejection_reason: v.rejection_reason ?? "",
    additional_notes: v.additional_notes ?? "",
    proof_documents: normalizeDocs(v.proof_documents),
    ownership_documents: normalizeDocs(v.ownership_documents),
    license_documents: normalizeDocs(v.license_documents),
    utility_bills: normalizeDocs(v.utility_bills),
  };
};

const typeClass = (t) => {
  if (t === "rent") return "lv-type-rent";
  if (t === "short") return "lv-type-short";
  if (t === "lease") return "lv-type-lease";
  return "lv-type-sale";
};

const typeLabel = (t) => {
  if (t === "rent") return "For Rent";
  if (t === "short") return "Short Let";
  if (t === "lease") return "Lease";
  return "For Sale";
};

// ─── Icons ───────────────────────────────────────────────────────────────────

const Chevron = ({ open }) => (
  <svg className={`lv-chevron${open ? " open" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const CheckIco = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const XIco = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const EyeIco = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const Download = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
  </svg>
);

const ShieldIco = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

const Toast = ({ toast }) =>
  toast ? (
    <div className={`lv-toast ${toast.type}`}>
      <div className="lv-toast-title">{toast.title}</div>
      {toast.desc && <div className="lv-toast-desc">{toast.desc}</div>}
    </div>
  ) : null;

/**
 * Document section component with proper structure
 */
const DocumentSection = ({ title, documents }) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="lv-doc-section">
        <p className="lv-doc-section-title">{title}</p>
        <p className="lv-doc-empty">No documents provided</p>
      </div>
    );
  }

  return (
    <div className="lv-doc-section">
      <p className="lv-doc-section-title">{title}</p>
      <div className="lv-doc-list">
        {documents.map((doc, idx) => (
          <a
            key={idx}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="lv-doc-link"
          >
            <Download style={{ height: '0.875rem', width: '0.875rem' }} />
            {doc.original_name || `Document ${idx + 1}`}
          </a>
        ))}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => (
  <span className={`lv-badge ${status}`}>
    <span className="lv-badge-dot" />
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

const Pagination = ({ page, total, onChange }) => {
  if (total <= 1) return null;
  const pages = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  return (
    <div className="lv-pager">
      <button className="lv-page-btn" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
      {pages.map((p, i) =>
        p === "…"
          ? <span key={`e${i}`} style={{ fontSize: "0.8rem", color: "rgba(245,240,232,0.3)", padding: "0 0.2rem" }}>…</span>
          : <button key={p} className={`lv-page-btn${p === page ? " active" : ""}`} onClick={() => onChange(p)}>{p}</button>
      )}
      <button className="lv-page-btn" disabled={page === total} onClick={() => onChange(page + 1)}>›</button>
    </div>
  );
};

// ─── Confirm Modal ────────────────────────────────────────────────────────────

const ConfirmModal = ({ modal, onConfirm, onClose, processing }) => {
  const isReject = modal.action === "reject";
  const accentColor = isReject ? "#e05050" : "#4caf65";
  const stripeColor = isReject
    ? "linear-gradient(90deg,#e05050,#e05050aa)"
    : "linear-gradient(90deg,#4caf65,#4caf65aa)";

  return (
    <div 
      className="lv-overlay" 
      onClick={() => onClose(null)}
      role="presentation"
      aria-hidden="true"
    >
      <div 
        className="lv-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <div style={{ height: "3px", background: stripeColor }} />
        <div className="lv-modal-body">
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", marginBottom: "1.125rem" }}>
            <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "2px", background: isReject ? "rgba(220,60,60,0.1)" : "rgba(74,175,100,0.1)", color: accentColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {isReject ? <XIco /> : <CheckIco />}
            </div>
            <div>
              <div id="modal-title" className="lv-modal-title">
                {isReject ? "Reject verification" : "Approve verification"}
              </div>
              <div className="lv-modal-sub">
                {isReject ? "This will reject the verification request and notify the agent." : "This will approve the verification request and make the listing verified."}
              </div>
            </div>
          </div>

          {isReject && (
            <div style={{ marginBottom: "1.125rem" }}>
              <label className="lv-label">Rejection reason <span style={{ opacity: 0.4 }}>(optional)</span></label>
              <textarea
                className="lv-textarea"
                value={modal.reason || ""}
                onChange={(e) => onClose({ ...modal, reason: e.target.value }, true)}
                placeholder="Provide feedback to help the agent improve…"
                rows={3}
              />
            </div>
          )}

          <div className="lv-action-row">
            {isReject ? (
              <button className="lv-btn-reject" onClick={onConfirm} disabled={processing}>
                <XIco /> {processing ? "Rejecting…" : "Reject verification"}
              </button>
            ) : (
              <button className="lv-btn-approve" onClick={onConfirm} disabled={processing}>
                <CheckIco /> {processing ? "Approving…" : "Approve verification"}
              </button>
            )}
            <button className="lv-btn-view" onClick={() => onClose(null)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Listing Card ─────────────────────────────────────────────────────────────

const ListingCard = ({ listing: raw, onAction }) => {
  const l = normalise(raw);
  const [open, setOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const initials = l.title.charAt(0).toUpperCase();

  return (
    <div className={`lv-card${isUpdating ? " updating" : ""}`}>
      <div className="lv-card-stripe" />

      {/* Header — click to expand */}
      <div className="lv-card-header" onClick={() => setOpen((o) => !o)}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flex: 1, minWidth: 0 }}>
          <div className="lv-avatar">
            {l.images[0] ? <img src={l.images[0]} alt="" /> : initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "0.875rem", fontWeight: "500", color: "#f5f0e8", marginBottom: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {l.title}
            </div>
            <div style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.4)" }}>
              Agent — {l.agent_name}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}>
          <span className={`lv-type-badge ${typeClass(l.listing_type)}`}>{typeLabel(l.listing_type)}</span>
          <StatusBadge status={l.status_key} />
          <Chevron open={open} />
        </div>
      </div>

      {/* Summary meta */}
      <div className="lv-meta-grid">
        <div>
          <div className="lv-meta-label">Price</div>
          <div className="lv-meta-val" style={{ color: "#e8a020", fontFamily: "'DM Serif Display', serif", fontSize: "1rem" }}>
            {fmtPrice(l.price, l.currency)}
          </div>
        </div>
        <div>
          <div className="lv-meta-label">Location</div>
          <div className="lv-meta-val">{l.location}</div>
        </div>
        <div>
          <div className="lv-meta-label">Rooms</div>
          <div className="lv-meta-val">{[l.bedrooms && `${l.bedrooms} bed`, l.bathrooms && `${l.bathrooms} bath`].filter(Boolean).join(" · ") || "—"}</div>
        </div>
        <div>
          <div className="lv-meta-label">Submitted</div>
          <div className="lv-meta-val">{fmtDate(l.created_at)}</div>
        </div>
        <div>
          <div className="lv-meta-label">Engagement</div>
          <div className="lv-meta-val">{(l.views ?? 0).toLocaleString()} views · {l.inquiries ?? 0} inq.</div>
        </div>
      </div>

      {/* Expandable details */}
      {open && (
        <div className="lv-details">
          {/* Admin review — pending only */}
          {l.status_key === "pending" && (
            <div className="lv-admin-panel">
              <div className="lv-admin-title">Admin review</div>

              <div>
                <label className="lv-label">Notes <span style={{ opacity: 0.4 }}>(optional)</span></label>
                <textarea
                  className="lv-textarea"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Add internal notes about this listing…"
                  rows={2}
                />
              </div>

              <div className="lv-action-row">
                <button 
                  className="lv-btn-approve" 
                  onClick={() => {
                    setIsUpdating(true);
                    onAction(l, "approve", adminNote, () => setIsUpdating(false));
                  }}
                  disabled={isUpdating}
                >
                  <CheckIco /> Approve
                </button>
                <button 
                  className="lv-btn-reject" 
                  onClick={() => {
                    setIsUpdating(true);
                    onAction(l, "reject", adminNote, () => setIsUpdating(false));
                  }}
                  disabled={isUpdating}
                >
                  <XIco /> Reject
                </button>
                <Link href={`/super-admin/listings/${l._id}`} className="lv-btn-view">
                  <EyeIco /> View
                </Link>
              </div>
            </div>
          )}

          {/* Review history — already reviewed */}
          {l.reviewed_at && (
            <div className="lv-history-panel">
              <div className="lv-history-title">Review history</div>
              <div style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.5)", marginBottom: "0.625rem" }}>
                Reviewed on {fmtDate(l.reviewed_at)}
              </div>
              {l.admin_notes && (
                <div className="lv-history-note">{l.admin_notes}</div>
              )}
              {l.rejection_reason && (
                <>
                  <div className="lv-meta-label" style={{ marginTop: "0.625rem", marginBottom: "0.3rem" }}>Rejection reason</div>
                  <div className="lv-history-reject">{l.rejection_reason}</div>
                </>
              )}
              {!l.admin_notes && !l.rejection_reason && (
                <div style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.3)", fontStyle: "italic" }}>No notes recorded.</div>
              )}
            </div>
          )}

          {l.additional_notes && (
            <div style={{ marginBottom: '1.25rem', padding: '1rem', borderRadius: '0.375rem', backgroundColor: 'rgba(232,160,32,0.08)', borderLeft: '3px solid rgba(232,160,32,0.4)' }}>
              <p className="lv-doc-section-title">Agent's Additional Notes</p>
              <p style={{ fontSize: '0.875rem', color: 'rgba(245,240,232,0.7)', margin: 0, lineHeight: 1.6 }}>
                {l.additional_notes}
              </p>
            </div>
          )}

          {/* Unified document section with proper empty state */}
          {(() => {
            const allDocs = [
              ...l.proof_documents,
              ...l.ownership_documents,
              ...l.license_documents,
              ...l.utility_bills
            ];
            
            return (
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(245,240,232,0.4)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Uploaded Documents
                </p>
                {allDocs.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.3)', fontStyle: 'italic' }}>
                    No documents provided
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <DocumentSection title="Proof Documents" documents={l.proof_documents} />
                    <DocumentSection title="Ownership Documents" documents={l.ownership_documents} />
                    <DocumentSection title="License Documents" documents={l.license_documents} />
                    <DocumentSection title="Utility Bills" documents={l.utility_bills} />
                  </div>
                )}
              </div>
            );
          })()}

          {/* View link when approved/rejected and no history panel */}
          {l.status_key !== "pending" && !l.reviewed_at && (
            <Link href={`/super-admin/listings/${l._id}`} className="lv-btn-view" style={{ alignSelf: "flex-start" }}>
              <EyeIco /> View listing
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ListingsVerification({ listings, metrics, filter: initialFilter }) {
  const { url } = usePage().props;
  const [toast, setToast]         = useState(null);
  const [modal, setModal]         = useState(null);
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter]       = useState(() => {
    if (initialFilter) return initialFilter;
    if (typeof window === 'undefined') return 'all';
    const queryFilter = new URL(window.location.href).searchParams.get('filter');
    return queryFilter || 'all';
  });
  const toastTimerRef = useRef(null);

  /**
   * Show toast notification with automatic cleanup
   */
  const showToast = useCallback((title, desc, type = "success") => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ title, desc, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 4000);
  }, []);

  /**
   * Cleanup timer on unmount
   */
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleAction = (listing, action, adminNote, onFinish) => {
    setModal({ listing, action, adminNote, reason: "", onFinish });
  };

  const handleModalUpdate = (updatedModal, isUpdate) => {
    if (isUpdate) { setModal(updatedModal); return; }
    setModal(null);
  };

  /**
   * Confirm action with guard against double-submission
   */
  const confirmAction = useCallback(() => {
    if (processing) return; // Guard against double-click
    
    const { listing, action, adminNote, reason, onFinish } = modal;
    setProcessing(true);
    
    const routes = {
      approve: `/super-admin/listings/verification/${listing.verification_request_id}/approve`,
      reject:  `/super-admin/listings/verification/${listing.verification_request_id}/reject`,
    };
    
    const data = action === "reject"
      ? { rejection_reason: reason, admin_notes: adminNote }
      : { admin_notes: adminNote };

    router.post(routes[action], data, {
      preserveScroll: true,
      onSuccess: () => {
        showToast(
          `Verification ${action}d`,
          `"${listing.title}" has been ${action}d successfully.`
        );
        setModal(null);
        if (onFinish) onFinish();
        router.reload({ only: ["listings", "metrics"] });
      },
      onError: (errors) => {
        const errorMsg = errors.message || errors.current_status 
          ? `This listing was already reviewed. Please refresh.`
          : "Please try again.";
        showToast("Action failed", errorMsg, "error");
        if (onFinish) onFinish();
      },
      onFinish: () => setProcessing(false),
    });
  }, [modal, processing, showToast]);

  const allListings = listings.data.map(normalise);
  const filtered = filter === "all" ? allListings : allListings.filter((l) => l.status_key === filter);

  return (
    <>
    <Head>
      <title>RentTrustGh</title>
    </Head>
      <style>{GLOBAL_CSS}</style>

      <div className="lv-wrap">
        {/* Page header */}
        <div style={{ marginBottom: "1.75rem" }}>
          <div className="lv-page-title">Listing Verification</div>
          <div className="lv-page-sub">Review and approve pending listings before they go live</div>
        </div>

        {/* KPI */}
        <div className="lv-kpi">
          <div className="lv-kpi-icon"><ShieldIco /></div>
          <div>
            <div className="lv-kpi-val">{(metrics?.pending ?? 0).toLocaleString()}</div>
            <div className="lv-kpi-label">Pending listings</div>
          </div>
        </div>

        {/* Filter bar — now preserves state in URL */}
        <div className="lv-filters">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              className={`lv-filter-btn${filter === s ? " active" : ""}`}
              onClick={() => {
                setFilter(s);
                router.visit(`/super-admin/listings/verification?filter=${s}`);
              }}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="lv-empty">
            <ShieldIco />
            <div className="lv-empty-title">No listings found</div>
            <div className="lv-empty-sub">
              {filter === "all" ? "No listing submissions yet." : `No ${filter} listings to display.`}
            </div>
          </div>
        ) : (
          <div>
            {filtered.map((l) => (
              <ListingCard key={l._id} listing={l} onAction={handleAction} />
            ))}
          </div>
        )}

        {/* Pagination footer */}
        {listings.last_page > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="lv-pager-info">
              Page {listings.current_page} of {listings.last_page} · {listings.total.toLocaleString()} listing{listings.total !== 1 ? "s" : ""}
            </span>
            <Pagination
              page={listings.current_page}
              total={listings.last_page}
              onChange={(p) => router.visit(`/super-admin/listings/verification?page=${p}&filter=${filter}`)}
            />
          </div>
        )}
      </div>

      {/* Toast */}
      <Toast toast={toast} />

      {/* Confirm modal */}
      {modal && (
        <ConfirmModal
          modal={modal}
          onConfirm={confirmAction}
          onClose={handleModalUpdate}
          processing={processing}
        />
      )}
    </>
  );
}

ListingsVerification.layout = (page) => <SuperAdminLayout>{page}</SuperAdminLayout>;