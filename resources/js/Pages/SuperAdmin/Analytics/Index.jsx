import { useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg:        "hsl(220 20% 97.5%)",
  surface:   "white",
  border:    "hsl(220 15% 91%)",
  borderSub: "hsl(220 15% 94%)",
  headBg:    "hsl(220 15% 98.5%)",
  text:      "hsl(220 25% 12%)",
  textSub:   "hsl(220 15% 50%)",
  textDim:   "hsl(220 15% 68%)",
  chart1:    "hsl(214 80% 50%)",
  chart2:    "hsl(162 63% 41%)",
  chart3:    "hsl(142 55% 38%)",
  chart4:    "hsl(40 82% 47%)",
  chart5:    "hsl(0 65% 48%)",
  chart6:    "hsl(270 55% 50%)",
};

const PALETTE = [T.chart1, T.chart2, T.chart3, T.chart4, T.chart5, T.chart6];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt    = (n) => Number(n || 0).toLocaleString("en-GH");
const fmtC   = (n) => `GH\u20B5${fmt(n)}`;
const fmtK   = (n) => n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "K" : String(n || 0);
const pct    = (a, b) => b > 0 ? ((a / b) * 100).toFixed(1) : "0.0";
const cap    = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
const fmtMonth = (m) => {
  if (!m) return "";
  const [y, mo] = m.split("-");
  return new Date(Number(y), Number(mo) - 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
};

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────
const BarChart = ({ data, color = T.chart1, valueFormat = fmt, height = 160 }) => {
  const [hov, setHov] = useState(null);
  if (!data || !data.length) return (
    <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: T.textDim, fontSize: 13 }}>No data</div>
  );
  const max = Math.max(...data.map(d => d.value), 1);
  const W = data.length * 52;
  return (
    <svg viewBox={`0 0 ${W} ${height + 34}`} style={{ width: "100%", overflow: "visible", display: "block" }}>
      {[0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} x1={0} y1={height - f * height} x2={W} y2={height - f * height}
          stroke={T.border} strokeWidth={0.5} />
      ))}
      {data.map((item, i) => {
        const barH = Math.max((item.value / max) * height, 3);
        const x = i * 52 + 6; const bw = 40; const isH = hov === i;
        return (
          <g key={i} style={{ cursor: "default" }}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
            <rect x={x} y={height - barH} width={bw} height={barH} rx={4}
              fill={isH ? color : color + "66"} style={{ transition: "fill 0.15s" }} />
            {isH && (
              <text x={x + bw / 2} y={height - barH - 7} textAnchor="middle"
                fontSize={8} fontWeight={700} fill={color}>{valueFormat(item.value)}</text>
            )}
            <text x={x + bw / 2} y={height + 16} textAnchor="middle" fontSize={9} fill={T.textSub}>{item.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── SVG Donut Chart ──────────────────────────────────────────────────────────
const DonutChart = ({ data, centerLabel = "Total" }) => {
  const [hov, setHov] = useState(null);
  if (!data || !data.length) return null;
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 72; const CX = 92; const CY = 92; const SW = 24;
  const polar = deg => {
    const r = ((deg - 90) * Math.PI) / 180;
    return { x: CX + R * Math.cos(r), y: CY + R * Math.sin(r) };
  };
  let angle = 0;
  const slices = data.map((item, i) => {
    const sweep = total > 0 ? (item.value / total) * 360 : 360 / data.length;
    const start = angle; const end = angle + sweep; angle = end;
    const s = polar(start + 0.6); const e = polar(end - 0.6);
    const d = `M ${s.x} ${s.y} A ${R} ${R} 0 ${sweep > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
    return { ...item, d, i, pct: pct(item.value, total), color: item.color || PALETTE[i % PALETTE.length] };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <svg width={184} height={184} viewBox="0 0 184 184" style={{ flexShrink: 0 }}>
        {slices.map(s => (
          <path key={s.i} d={s.d} fill="none" stroke={s.color}
            strokeWidth={hov === s.i ? SW + 5 : SW} strokeLinecap="round"
            style={{ cursor: "pointer", transition: "stroke-width 0.15s" }}
            onMouseEnter={() => setHov(s.i)} onMouseLeave={() => setHov(null)} />
        ))}
        <circle cx={CX} cy={CY} r={R - SW / 2 - 3} fill="white" />
        {hov !== null ? (
          <>
            <text x={CX} y={CY - 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={T.text}>{fmt(slices[hov].value)}</text>
            <text x={CX} y={CY + 11} textAnchor="middle" fontSize={9} fill={T.textSub}>{slices[hov].pct}%</text>
          </>
        ) : (
          <>
            <text x={CX} y={CY - 4} textAnchor="middle" fontSize={13} fontWeight={700} fill={T.text}>{fmt(total)}</text>
            <text x={CX} y={CY + 11} textAnchor="middle" fontSize={9} fill={T.textSub}>{centerLabel}</text>
          </>
        )}
      </svg>
      <div style={{ flex: 1, minWidth: 110, display: "flex", flexDirection: "column", gap: 7 }}>
        {slices.map(s => (
          <div key={s.i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "default" }}
            onMouseEnter={() => setHov(s.i)} onMouseLeave={() => setHov(null)}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, backgroundColor: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: hov === s.i ? T.text : T.textSub, fontWeight: hov === s.i ? 600 : 400, transition: "all 0.12s" }}>{s.label}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Horizontal rank bars ─────────────────────────────────────────────────────
const RankBars = ({ data, valueFormat = fmt }) => {
  const max = Math.max(...(data || []).map(d => d.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {(data || []).map((item, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: T.textSub, fontWeight: 500 }}>{item.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: PALETTE[i % PALETTE.length] }}>{valueFormat(item.value)}</span>
          </div>
          <div style={{ height: 5, borderRadius: 999, backgroundColor: T.borderSub, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 999, backgroundColor: PALETTE[i % PALETTE.length], width: `${(item.value / max) * 100}%`, opacity: 0.78, transition: "width 0.45s ease" }} />
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, accent, iconBg, iconColor, icon, bar, trend }) => (
  <div style={{ backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px hsl(220 20% 15% / 0.04)", display: "flex", flexDirection: "column" }}>
    {bar && <div style={{ height: 3, background: `linear-gradient(90deg, ${bar}, ${bar}55)` }} />}
    <div style={{ padding: "1rem 1.1rem", flex: 1 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
        <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon}
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: accent || T.text, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ margin: "4px 0 0", fontSize: 11, color: T.textSub }}>{sub}</p>}
      {trend !== undefined && (
        <p style={{ margin: "5px 0 0", fontSize: 11, fontWeight: 600, color: trend >= 0 ? T.chart3 : T.chart5, display: "flex", alignItems: "center", gap: 3 }}>
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% MoM
        </p>
      )}
    </div>
  </div>
);

// ─── Chart card ───────────────────────────────────────────────────────────────
const ChartCard = ({ title, children }) => (
  <div style={{ backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "1.1rem", boxShadow: "0 1px 3px hsl(220 20% 15% / 0.04)" }}>
    <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 600, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</p>
    {children}
  </div>
);

// ─── Section heading ──────────────────────────────────────────────────────────
const SH = ({ children, accent = T.chart1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "1.5rem 0 0.75rem" }}>
    <div style={{ width: 3, height: 14, borderRadius: 999, backgroundColor: accent, flexShrink: 0 }} />
    <h2 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: T.text, textTransform: "uppercase", letterSpacing: "0.09em" }}>{children}</h2>
  </div>
);

// ─── Grids ────────────────────────────────────────────────────────────────────
const KpiGrid = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 10, marginBottom: "1.25rem" }}>{children}</div>
);
const ChartGrid = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12, marginBottom: "1.25rem" }}>{children}</div>
);

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = "1rem", sw = 1.8 }) => (
  <svg style={{ width: size, height: size }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {(Array.isArray(d) ? d : [d]).map((p, i) => (
      <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
    ))}
  </svg>
);
const I = {
  trending: <Ico d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
  users:    <Ico d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
  home:     <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  eye:      <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} />,
  chat:     <Ico d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />,
  check:    <Ico d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  star:     <Ico d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
  clock:    <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  key:      <Ico d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />,
  briefcase:<Ico d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  warn:     <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
  download: <Ico d={["M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"]} />,
};

// ─── Download CSV ─────────────────────────────────────────────────────────────
const downloadCSV = (D) => {
  const rows = [`# RentTrustGH Analytics — ${D.from} to ${D.to}\n`];
  rows.push("# Monthly Revenue\nMonth,Revenue,Transactions");
  (D.monthly_revenue || []).forEach(r => rows.push(`${r.month},${r.revenue},${r.transactions}`));
  rows.push("\n# User Growth\nMonth,New Users");
  (D.user_growth || []).forEach(r => rows.push(`${r.month},${r.count}`));
  rows.push("\n# Views Over Time\nMonth,Views,Unique");
  (D.views_over_time || []).forEach(r => rows.push(`${r.month},${r.views},${r.unique_viewers}`));
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url;
  a.download = `analytics_${D.from}_${D.to}.csv`.replace(/ /g, "_");
  a.click(); URL.revokeObjectURL(url);
};

// ─── Range filter ─────────────────────────────────────────────────────────────
const RANGES = ["7D","30D","3M","6M","12M","All"];

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = ["Overview","Revenue","Listings","Users","Engagement"];

// ─── Top listings table ───────────────────────────────────────────────────────
const TopTable = ({ data }) => (
  <div style={{ backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px hsl(220 20% 15% / 0.04)" }}>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 7rem 7rem 5rem 6rem", gap: "0.75rem", padding: "0.55rem 1.1rem", backgroundColor: T.headBg, borderBottom: `1px solid ${T.border}` }}>
      {["Listing","City","Type","Views","Unique"].map(h => (
        <div key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: T.textSub }}>{h}</div>
      ))}
    </div>
    {(data || []).map((l, i) => (
      <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 7rem 7rem 5rem 6rem", gap: "0.75rem", padding: "0.6rem 1.1rem", borderBottom: i < data.length - 1 ? `1px solid ${T.borderSub}` : "none", transition: "background 0.1s" }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = T.headBg}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</div>
        <div style={{ fontSize: 12, color: T.textSub }}>{l.city}</div>
        <div>
          <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", backgroundColor: "hsl(214 100% 95%)", color: "hsl(214 80% 42%)" }}>{l.property_type}</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.chart1 }}>{fmt(l.views)}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.chart2 }}>{fmt(l.unique_views)}</div>
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════
export default function AnalyticsDashboard() {
  const { analytics: D } = usePage().props;

  const [tab,   setTab]   = useState("Overview");
  const [range, setRange] = useState(D.range || "6M");

  // ── Range change → Inertia reload ──────────────────────────────────────────
  const handleRangeChange = (r) => {
    setRange(r);
    window.location.href = `?range=${r}`;
  };

  // ── Derived chart data (mapped from real props) ─────────────────────────────
  const mrrData    = (D.monthly_revenue   || []).map(m => ({ label: fmtMonth(m.month), value: m.revenue }));
  const subsData   = (D.monthly_new_subs  || []).map(m => ({ label: fmtMonth(m.month), value: m.count }));
  const userGrowth = (D.user_growth       || []).map(m => ({ label: fmtMonth(m.month), value: m.count }));
  const listGrowth = (D.listing_growth    || []).map(m => ({ label: fmtMonth(m.month), value: m.count }));
  const viewsOT    = (D.views_over_time   || []).map(m => ({ label: fmtMonth(m.month), value: m.views }));
  const inqOT      = (D.inquiries_over_time || []).map(m => ({ label: fmtMonth(m.month), value: m.count }));

  const providerDonut = (D.provider_split || []).map((p, i) => ({
    label: cap(p.provider), value: p.total, color: PALETTE[i],
  }));

  const sb = D.status_breakdown || {};
  const outcomeDonut = Object.entries(sb).map(([k, v]) => ({
    label: cap(k), value: v.count,
    color: k === "success" ? T.chart3 : k === "failed" ? T.chart5 : k === "refunded" ? T.chart6 : T.chart4,
  }));

  const ss = D.subscription_summary || {};
  const subStatusDonut = Object.entries(ss).map(([k, v]) => ({
    label: cap(k), value: v,
    color: k === "active" ? T.chart3 : k === "cancelled" ? T.chart5 : k === "expired" ? T.chart4 : T.chart2,
  }));

  const roleDonut = (D.users_by_role    || []).map((r, i) => ({ label: cap(r.role),    value: r.count, color: PALETTE[i] }));
  const pkgDonut  = (D.users_by_package || []).map((p, i) => ({ label: cap(p.package), value: p.count, color: PALETTE[i] }));

  const purposeDonut = (D.listings_by_purpose || []).map((p, i) => ({
    label: cap(p.purpose), value: p.count, color: [T.chart1, T.chart2][i],
  }));

  const typeHBar    = (D.listings_by_type || []).map(t => ({ label: t.property_type, value: t.count }));
  const cityHBar    = (D.listings_by_city || []).map(c => ({ label: c.city,          value: c.count }));
  const inqTypeHBar = (D.inquiries_by_type || []).map(t => ({ label: cap(t.type),    value: t.count }));
  const inqTypeDonut= inqTypeHBar.map((d, i) => ({ ...d, color: PALETTE[i] }));

  const ls = D.listing_stats     || {};
  const is = D.inquiries_summary || {};

  const totalPmts   = outcomeDonut.reduce((s, d) => s + d.value, 0);
  const successPmts = sb.success?.count || 0;
  const successRate = pct(successPmts, totalPmts);

  // ── Styles ──────────────────────────────────────────────────────────────────
  const s = {
    page: { minHeight: "100vh", backgroundColor: T.bg, fontFamily: "system-ui, -apple-system, sans-serif", color: T.text },
    inner: { maxWidth: 1200, margin: "0 auto", padding: "1.5rem 1.25rem" },
    tabBtn: (active) => ({
      padding: "0.6rem 1rem", background: "none", border: "none",
      borderBottom: `2px solid ${active ? T.chart1 : "transparent"}`,
      color: active ? T.chart1 : T.textSub, fontSize: 13,
      fontWeight: active ? 700 : 500, cursor: "pointer",
      transition: "all 0.12s", marginBottom: -1, fontFamily: "inherit",
    }),
    rangeBtn: (active) => ({
      padding: "0.28rem 0.7rem", borderRadius: 999, fontSize: 12, fontWeight: 600,
      border: `1px solid ${active ? T.chart1 : T.border}`,
      backgroundColor: active ? T.chart1 : T.surface,
      color: active ? "white" : T.textSub, cursor: "pointer",
      transition: "all 0.12s", fontFamily: "inherit",
    }),
    dlBtn: {
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "0.4rem 0.9rem", borderRadius: 8,
      border: `1px solid ${T.border}`, backgroundColor: T.surface,
      color: T.text, fontSize: 12, fontWeight: 600, cursor: "pointer",
      fontFamily: "inherit", transition: "all 0.15s",
    },
  };

  return (
    <>
    <Head>
        <title>RentTrustGh</title>
    </Head>
    <div style={s.page}>
      <div style={s.inner}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.02em" }}>Analytics</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: T.textSub }}>{D.from} &rarr; {D.to} &middot; RentTrustGH platform</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 4 }}>
              {RANGES.map(r => (
                <button key={r} style={s.rangeBtn(range === r)} onClick={() => handleRangeChange(r.replace("All","ALL"))}>{r}</button>
              ))}
            </div>
            <div style={{ width: 1, height: 22, backgroundColor: T.border }} />
            <button
              style={s.dlBtn}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.chart1; e.currentTarget.style.color = T.chart1; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}
              onClick={() => downloadCSV(D)}
            >
              {I.download} Export CSV
            </button>
          </div>
        </div>

        {/* Accent bar */}
        <div style={{ height: 3, borderRadius: 999, background: `linear-gradient(90deg, ${T.chart1}, ${T.chart2}, ${T.chart4})`, marginBottom: "1.25rem", opacity: 0.5 }} />

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, marginBottom: "1.5rem" }}>
          {TABS.map(t => (
            <button key={t} style={s.tabBtn(tab === t)} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {/* ═══ OVERVIEW ═══════════════════════════════════════════════════════ */}
        {tab === "Overview" && (
          <>
            <KpiGrid>
              <StatCard label="Total Revenue"   value={fmtC(D.total_revenue)}    sub={`Avg ${fmtC(D.avg_payment)} / pmt`}           accent={T.chart3} iconBg="hsl(142 55% 93%)" iconColor={T.chart3} icon={I.trending} bar={T.chart3} />
              <StatCard label="Total Users"     value={fmt(D.total_users)}        sub={`+${fmt(D.new_users_period)} this period`}    accent={T.chart1} iconBg="hsl(214 100% 95%)" iconColor={T.chart1} icon={I.users}   bar={T.chart1} />
              <StatCard label="Active Listings" value={fmt(ls.active)}            sub={`${fmt(ls.total)} total`}                     accent="hsl(200 65% 36%)" iconBg="hsl(200 60% 93%)" iconColor="hsl(200 65% 36%)" icon={I.home} bar="hsl(200 65% 36%)" />
              <StatCard label="Total Views"     value={fmtK(D.total_views)}       sub={`${fmtK(D.unique_viewers)} unique`}           accent={T.chart6} iconBg="hsl(270 60% 95%)" iconColor={T.chart6} icon={I.eye}     bar={T.chart6} />
              <StatCard label="Active Subs"     value={fmt(ss.active)}            sub={`${fmt(ss.cancelled)} cancelled`}             accent={T.chart1} iconBg="hsl(214 100% 95%)" iconColor={T.chart1} icon={I.check}  bar={T.chart1} />
              <StatCard label="Success Rate"    value={`${successRate}%`}         sub={`${fmt(successPmts)} successful`}             accent={T.chart3} iconBg="hsl(142 55% 93%)" iconColor={T.chart3} icon={I.check}  bar={T.chart3} />
              <StatCard label="Inquiries"       value={fmtK(is.total)}            sub={`${fmt(is.from_users)} registered`}           accent={T.chart4} iconBg="hsl(40 90% 93%)" iconColor={T.chart4} icon={I.chat}    bar={T.chart4} />
              <StatCard label="Featured"        value={fmt(ls.featured)}          sub={`${fmt(ls.boosted)} boosted`}                 accent={T.chart4} iconBg="hsl(40 90% 93%)" iconColor={T.chart4} icon={I.star}    bar={T.chart4} />
            </KpiGrid>
            <ChartGrid>
              <ChartCard title="Monthly Revenue (GH₵)"><BarChart data={mrrData} color={T.chart1} valueFormat={fmtC} /></ChartCard>
              <ChartCard title="Payment Outcomes"><DonutChart data={outcomeDonut} centerLabel="Payments" /></ChartCard>
              <ChartCard title="New Listings / Month"><BarChart data={listGrowth} color={T.chart2} /></ChartCard>
              <ChartCard title="Inquiry Channels"><DonutChart data={inqTypeDonut} centerLabel="Inquiries" /></ChartCard>
            </ChartGrid>
          </>
        )}

        {/* ═══ REVENUE ════════════════════════════════════════════════════════ */}
        {tab === "Revenue" && (
          <>
            <KpiGrid>
              <StatCard label="Total Revenue"   value={fmtC(D.total_revenue)}  accent={T.chart3} iconBg="hsl(142 55% 93%)" iconColor={T.chart3} icon={I.trending} bar={T.chart3} />
              <StatCard label="Avg per Payment" value={fmtC(D.avg_payment)}    accent={T.chart1} iconBg="hsl(214 100% 95%)" iconColor={T.chart1} icon={I.trending} bar={T.chart1} />
              <StatCard label="Successful Pmts" value={fmt(successPmts)} sub={`${successRate}% rate`} accent={T.chart3} iconBg="hsl(142 55% 93%)" iconColor={T.chart3} icon={I.check} bar={T.chart3} />
              <StatCard label="Active Subs"     value={fmt(ss.active)} sub={`${fmt(ss.cancelled)} cancelled`} accent={T.chart1} iconBg="hsl(214 100% 95%)" iconColor={T.chart1} icon={I.star} bar={T.chart1} />
            </KpiGrid>
            <SH>Revenue Trends</SH>
            <ChartGrid>
              <ChartCard title="Monthly Recurring Revenue"><BarChart data={mrrData} color={T.chart1} valueFormat={fmtC} /></ChartCard>
              <ChartCard title="New Subscriptions / Month"><BarChart data={subsData} color={T.chart6} /></ChartCard>
            </ChartGrid>
            <SH>Payment Breakdown</SH>
            <ChartGrid>
              <ChartCard title="Revenue by Provider"><DonutChart data={providerDonut} centerLabel="Revenue" /></ChartCard>
              <ChartCard title="Payment Status"><DonutChart data={outcomeDonut} centerLabel="Payments" /></ChartCard>
              <ChartCard title="Subscription Status"><DonutChart data={subStatusDonut} centerLabel="Subs" /></ChartCard>
            </ChartGrid>
          </>
        )}

        {/* ═══ LISTINGS ═══════════════════════════════════════════════════════ */}
        {tab === "Listings" && (
          <>
            <KpiGrid>
              <StatCard label="Total"       value={fmt(ls.total)}                                                    accent={T.chart1}         iconBg="hsl(214 100% 95%)" iconColor={T.chart1}            icon={I.home}      bar={T.chart1} />
              <StatCard label="Active"      value={fmt(ls.active)}  sub={`${pct(ls.active, ls.total)}% of total`}   accent={T.chart3}         iconBg="hsl(142 55% 93%)" iconColor={T.chart3}             icon={I.check}     bar={T.chart3} />
              <StatCard label="Pending"     value={fmt(ls.pending)}                                                  accent={T.chart4}         iconBg="hsl(40 90% 93%)"  iconColor={T.chart4}             icon={I.warn}      bar={T.chart4} />
              <StatCard label="Featured"    value={fmt(ls.featured)} sub={`${fmt(ls.boosted)} boosted`}              accent={T.chart4}         iconBg="hsl(40 90% 93%)"  iconColor={T.chart4}             icon={I.star}      bar={T.chart4} />
              <StatCard label="Rented Out"  value={fmt(ls.rented)}                                                   accent={T.chart6}         iconBg="hsl(270 60% 95%)" iconColor={T.chart6}             icon={I.key}       bar={T.chart6} />
              <StatCard label="Sold"        value={fmt(ls.sold)}                                                     accent="hsl(200 65% 36%)" iconBg="hsl(200 60% 93%)" iconColor="hsl(200 65% 36%)"    icon={I.briefcase} bar="hsl(200 65% 36%)" />
            </KpiGrid>
            <SH>Growth</SH>
            <ChartGrid>
              <ChartCard title="New Listings / Month"><BarChart data={listGrowth} color={T.chart2} /></ChartCard>
              <ChartCard title="By Purpose"><DonutChart data={purposeDonut} centerLabel="Listings" /></ChartCard>
            </ChartGrid>
            <SH>Distribution</SH>
            <ChartGrid>
              <ChartCard title="By Property Type"><RankBars data={typeHBar} /></ChartCard>
              <ChartCard title="By City"><RankBars data={cityHBar} /></ChartCard>
            </ChartGrid>
          </>
        )}

        {/* ═══ USERS ══════════════════════════════════════════════════════════ */}
        {tab === "Users" && (
          <>
            <KpiGrid>
              <StatCard label="Total Users"     value={fmt(D.total_users)}         accent={T.chart1}         iconBg="hsl(214 100% 95%)" iconColor={T.chart1}         icon={I.users} bar={T.chart1} />
              <StatCard label="New This Period"  value={fmt(D.new_users_period)}    accent={T.chart3}         iconBg="hsl(142 55% 93%)" iconColor={T.chart3}          icon={I.users} bar={T.chart3} />
              <StatCard label="Agents"           value={fmt((D.users_by_role || []).find(r => r.role === "agent")?.count  ?? 0)} accent="hsl(200 65% 36%)" iconBg="hsl(200 60% 93%)" iconColor="hsl(200 65% 36%)" icon={I.users} bar="hsl(200 65% 36%)" />
              <StatCard label="Tenants"          value={fmt((D.users_by_role || []).find(r => r.role === "tenant")?.count ?? 0)} accent={T.chart6}         iconBg="hsl(270 60% 95%)" iconColor={T.chart6}         icon={I.users} bar={T.chart6} />
            </KpiGrid>
            <SH>Growth</SH>
            <ChartGrid>
              <ChartCard title="New Users / Month"><BarChart data={userGrowth} color={T.chart1} /></ChartCard>
              <ChartCard title="Users by Role"><DonutChart data={roleDonut} centerLabel="Users" /></ChartCard>
              <ChartCard title="Users by Package"><DonutChart data={pkgDonut} centerLabel="Users" /></ChartCard>
            </ChartGrid>
          </>
        )}

        {/* ═══ ENGAGEMENT ═════════════════════════════════════════════════════ */}
        {tab === "Engagement" && (
          <>
            <KpiGrid>
              <StatCard label="Total Views"     value={fmtK(D.total_views)}    accent={T.chart6} iconBg="hsl(270 60% 95%)" iconColor={T.chart6} icon={I.eye}   bar={T.chart6} />
              <StatCard label="Unique Viewers"  value={fmtK(D.unique_viewers)} sub={`${pct(D.unique_viewers, D.total_views)}% unique`} accent={T.chart1} iconBg="hsl(214 100% 95%)" iconColor={T.chart1} icon={I.eye} bar={T.chart1} />
              <StatCard label="Inquiries"       value={fmtK(is.total)}         accent={T.chart4} iconBg="hsl(40 90% 93%)"  iconColor={T.chart4} icon={I.chat}  bar={T.chart4} />
              <StatCard label="From Registered" value={fmt(is.from_users)} sub={`${fmt(is.from_guests)} guests`} accent={T.chart3} iconBg="hsl(142 55% 93%)" iconColor={T.chart3} icon={I.users} bar={T.chart3} />
            </KpiGrid>
            <SH>Views &amp; Inquiries Over Time</SH>
            <ChartGrid>
              <ChartCard title="Monthly Views"><BarChart data={viewsOT} color={T.chart6} /></ChartCard>
              <ChartCard title="Monthly Inquiries"><BarChart data={inqOT} color={T.chart4} /></ChartCard>
            </ChartGrid>
            <SH>Inquiry Breakdown</SH>
            <ChartGrid>
              <ChartCard title="By Channel"><DonutChart data={inqTypeDonut} centerLabel="Inquiries" /></ChartCard>
              <ChartCard title="Channel Comparison"><RankBars data={inqTypeHBar} /></ChartCard>
            </ChartGrid>
            <SH>Top Performing Listings</SH>
            <TopTable data={D.top_listings} />
          </>
        )}

      </div>
    </div>
    </>
  );
}

AnalyticsDashboard.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;