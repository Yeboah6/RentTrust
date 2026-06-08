import { useState, useMemo } from "react";
import { router } from "@inertiajs/react";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";

// ─── Design tokens (mirrors Reports page) ─────────────────────────────────────
const T = {
    bg:        "hsl(220 20% 97.5%)",
    surface:   "white",
    border:    "hsl(220 15% 91%)",
    borderSub: "hsl(220 15% 94%)",
    headBg:    "hsl(220 15% 98.5%)",
    text:      "hsl(220 25% 12%)",
    textSub:   "hsl(220 15% 50%)",
    textDim:   "hsl(220 15% 68%)",
    blue:      "hsl(214 80% 50%)",
    blueDim:   "hsl(214 100% 95%)",
    green:     "hsl(152 55% 33%)",
    greenDim:  "hsl(152 55% 92%)",
    amber:     "hsl(40 80% 36%)",
    amberDim:  "hsl(40 90% 93%)",
    purple:    "hsl(270 55% 40%)",
    purpleDim: "hsl(270 60% 95%)",
    teal:      "hsl(200 65% 36%)",
    tealDim:   "hsl(200 60% 93%)",
    red:       "hsl(0 65% 44%)",
    redDim:    "hsl(0 65% 95%)",
    sky:       "hsl(199 80% 40%)",
    skyDim:    "hsl(199 100% 94%)",
};

const CHART_COLORS = [
    "hsl(214 80% 50%)", "hsl(152 55% 38%)", "hsl(40 80% 44%)",
    "hsl(270 55% 48%)", "hsl(200 65% 40%)", "hsl(0 65% 48%)",
    "hsl(199 80% 45%)", "hsl(24 80% 48%)",
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = "1rem", sw = 1.8 }) => (
    <svg style={{ width: size, height: size, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {(Array.isArray(d) ? d : [d]).map((p, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={sw} d={p} />
        ))}
    </svg>
);

const I = {
    download: <Ico d={["M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"]} />,
    home:     <Ico d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    users:    <Ico d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    eye:      <Ico d={["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"]} />,
    chat:     <Ico d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />,
    trending: <Ico d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    check:    <Ico d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    star:     <Ico d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
    warn:     <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt      = (n) => Number(n || 0).toLocaleString("en-GH");
const fmtC     = (n) => `GH\u20B5${fmt(n)}`;
const pct      = (a, b) => (b > 0 ? ((a / b) * 100).toFixed(1) : "0.0");
const cap      = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "\u2014";
const fmtMonth = (m) => {
    if (!m) return "";
    const [y, mo] = m.split("-");
    return new Date(Number(y), Number(mo) - 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
};

// ─── CSV Download ──────────────────────────────────────────────────────────────
const downloadCSV = (a) => {
    const rows = [];
    const push = (...args) => rows.push(args.join(","));

    rows.push(`# RentTrustGH Analytics Export — ${a.from ?? "All time"} to ${a.to ?? "now"}`);
    rows.push("");

    if (a.monthly_revenue?.length) {
        rows.push("# Monthly Revenue");
        push("Month", "Revenue (GH\u20B5)", "Transactions");
        a.monthly_revenue.forEach(r => push(r.month, r.revenue, r.transactions));
        rows.push("");
    }
    if (a.provider_split?.length) {
        rows.push("# Revenue by Provider");
        push("Provider", "Total (GH\u20B5)", "Count");
        a.provider_split.forEach(p => push(p.provider, p.total, p.count));
        rows.push("");
    }
    if (a.listing_stats) {
        rows.push("# Listing Stats");
        push("Metric", "Value");
        Object.entries(a.listing_stats).forEach(([k, v]) => push(k, v));
        rows.push("");
    }
    if (a.user_growth?.length) {
        rows.push("# User Growth");
        push("Month", "New Users");
        a.user_growth.forEach(u => push(u.month, u.count));
        rows.push("");
    }
    if (a.views_over_time?.length) {
        rows.push("# Views Over Time");
        push("Month", "Views", "Unique Viewers");
        a.views_over_time.forEach(v => push(v.month, v.views, v.unique_viewers));
        rows.push("");
    }
    if (a.inquiries_by_type?.length) {
        rows.push("# Inquiries by Channel");
        push("Channel", "Count");
        a.inquiries_by_type.forEach(i => push(i.type, i.count));
        rows.push("");
    }

    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics_${a.from ?? "all"}_${a.to ?? "now"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};

// ─── Primitive components ─────────────────────────────────────────────────────
const Card = ({ children, style: s }) => (
    <div style={{ backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: "0.875rem", overflow: "hidden", boxShadow: "0 1px 3px hsl(220 20% 15% / 0.04)", ...s }}>
        {children}
    </div>
);

const CardHead = ({ title, sub, accent = T.blue }) => (
    <div style={{ padding: "0.875rem 1.25rem", borderBottom: `1px solid ${T.borderSub}`, backgroundColor: T.headBg, display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div style={{ width: 3, height: "1.1rem", borderRadius: 999, backgroundColor: accent, flexShrink: 0 }} />
        <div>
            <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.03em", color: T.text }}>{title}</p>
            {sub && <p style={{ margin: "0.1rem 0 0", fontSize: "0.68rem", color: T.textSub }}>{sub}</p>}
        </div>
    </div>
);

const SectionHead = ({ title, accent = T.blue }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.875rem" }}>
        <div style={{ width: 3, height: "1.2rem", borderRadius: 999, backgroundColor: accent, flexShrink: 0 }} />
        <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 900, color: T.text, letterSpacing: "-0.01em" }}>{title}</h2>
    </div>
);

const Empty = ({ msg = "No data for this period", emoji = "📊" }) => (
    <div style={{ padding: "2.5rem", textAlign: "center", color: T.textDim }}>
        <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{emoji}</div>
        <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600 }}>{msg}</p>
    </div>
);

const Kpi = ({ label, value, sub, accent, iconBg, iconColor, icon, bar }) => (
    <div style={{ backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: "0.875rem", overflow: "hidden", boxShadow: "0 1px 3px hsl(220 20% 15% / 0.04)", display: "flex", flexDirection: "column" }}>
        {bar && <div style={{ height: 3, background: `linear-gradient(90deg, ${bar}, ${bar}55)` }} />}
        <div style={{ padding: "1.1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.875rem", flex: 1 }}>
            <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.65rem", backgroundColor: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {icon}
            </div>
            <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "1.45rem", fontWeight: 900, color: accent, lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</div>
                <div style={{ fontSize: "0.76rem", fontWeight: 700, color: T.text, marginTop: "0.12rem" }}>{label}</div>
                {sub && <div style={{ fontSize: "0.67rem", color: T.textSub, marginTop: "0.05rem" }}>{sub}</div>}
            </div>
        </div>
    </div>
);

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────
const BarChart = ({ data = [], color = T.blue, valueFormat = fmt, height = 160 }) => {
    const [hov, setHov] = useState(null);
    if (!data.length) return <Empty />;
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <svg viewBox={`0 0 ${data.length * 50} ${height + 32}`} style={{ width: "100%", overflow: "visible" }}>
            {[0.25, 0.5, 0.75, 1].map(f => (
                <line key={f} x1="0" y1={height - f * height} x2={data.length * 50} y2={height - f * height}
                    stroke="hsl(220 15% 91%)" strokeWidth="0.5" />
            ))}
            {data.map((item, i) => {
                const barH = Math.max((item.value / max) * height, 2);
                const x = i * 50 + 5, bw = 40, isH = hov === i;
                return (
                    <g key={i} style={{ cursor: "pointer" }} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
                        <rect x={x} y={height - barH} width={bw} height={barH} rx="3"
                            fill={isH ? color : `${color}55`} style={{ transition: "fill 0.15s" }} />
                        {isH && (
                            <text x={x + bw / 2} y={height - barH - 6} textAnchor="middle" fontSize="7.5" fontWeight="800" fill={color}>
                                {valueFormat(item.value)}
                            </text>
                        )}
                        <text x={x + bw / 2} y={height + 15} textAnchor="middle" fontSize="7.5" fill="hsl(220 15% 52%)">{item.label}</text>
                    </g>
                );
            })}
        </svg>
    );
};

// ─── SVG Donut Chart ──────────────────────────────────────────────────────────
const DonutChart = ({ data = [], centerLabel = "Total" }) => {
    const [hov, setHov] = useState(null);
    if (!data.length) return <Empty />;
    const total = data.reduce((s, d) => s + d.value, 0);
    const R = 78, CX = 100, CY = 100, SW = 26;
    const polar = deg => {
        const r = ((deg - 90) * Math.PI) / 180;
        return { x: CX + R * Math.cos(r), y: CY + R * Math.sin(r) };
    };
    let angle = 0;
    const slices = data.map((item, i) => {
        const sweep = total > 0 ? (item.value / total) * 360 : 360 / data.length;
        const start = angle, end = angle + sweep; angle = end;
        const s = polar(start + 0.5), e = polar(end - 0.5);
        const d = `M ${s.x} ${s.y} A ${R} ${R} 0 ${sweep > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
        return { ...item, d, i, pct: pct(item.value, total), color: item.color || CHART_COLORS[i % CHART_COLORS.length] };
    });
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <svg width="200" height="200" viewBox="0 0 200 200" style={{ flexShrink: 0 }}>
                {slices.map(s => (
                    <path key={s.i} d={s.d} fill="none" stroke={s.color}
                        strokeWidth={hov === s.i ? SW + 5 : SW} strokeLinecap="round"
                        style={{ cursor: "pointer", transition: "stroke-width 0.15s" }}
                        onMouseEnter={() => setHov(s.i)} onMouseLeave={() => setHov(null)} />
                ))}
                <circle cx={CX} cy={CY} r={R - SW / 2 - 3} fill="white" />
                {hov !== null ? (
                    <>
                        <text x={CX} y={CY - 5} textAnchor="middle" fontSize="11" fontWeight="900" fill="hsl(220 25% 14%)">{fmt(slices[hov]?.value)}</text>
                        <text x={CX} y={CY + 10} textAnchor="middle" fontSize="9" fill="hsl(220 15% 52%)">{slices[hov]?.pct}%</text>
                    </>
                ) : (
                    <>
                        <text x={CX} y={CY - 5} textAnchor="middle" fontSize="13" fontWeight="900" fill="hsl(220 25% 14%)">{fmt(total)}</text>
                        <text x={CX} y={CY + 10} textAnchor="middle" fontSize="9" fill="hsl(220 15% 52%)">{centerLabel}</text>
                    </>
                )}
            </svg>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", flex: 1, minWidth: 100 }}>
                {slices.map(s => (
                    <div key={s.i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "default" }}
                        onMouseEnter={() => setHov(s.i)} onMouseLeave={() => setHov(null)}>
                        <span style={{ width: 9, height: 9, borderRadius: 2, backgroundColor: s.color, flexShrink: 0 }} />
                        <div>
                            <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: hov === s.i ? 700 : 500, color: hov === s.i ? T.text : T.textSub, transition: "all 0.12s" }}>{s.label}</p>
                            <p style={{ margin: 0, fontSize: "0.68rem", color: T.textDim }}>{s.pct}%</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Horizontal bar ───────────────────────────────────────────────────────────
const HBar = ({ data = [], valueFormat = fmt }) => {
    if (!data.length) return <Empty />;
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {data.map((item, i) => (
                <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: T.text }}>{item.label}</span>
                        <span style={{ fontSize: "0.78rem", fontWeight: 800, color: CHART_COLORS[i % CHART_COLORS.length] }}>{valueFormat(item.value)}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 999, backgroundColor: "hsl(220 15% 93%)", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 999, backgroundColor: CHART_COLORS[i % CHART_COLORS.length], width: `${(item.value / max) * 100}%`, opacity: 0.75, transition: "width 0.4s ease" }} />
                    </div>
                </div>
            ))}
        </div>
    );
};

// ─── Range filter ──────────────────────────────────────────────────────────────
const RANGES = [
    { value: "7d", label: "7D" }, { value: "30d", label: "30D" },
    { value: "3m", label: "3M" }, { value: "6m",  label: "6M" },
    { value: "12m",label: "12M"},{ value: "all", label: "All" },
];

const RangeFilter = ({ current, onChange }) => (
    <div style={{ display: "flex", gap: "0.3rem" }}>
        {RANGES.map(r => {
            const active = current === r.value;
            return (
                <button key={r.value} onClick={() => onChange(r.value)} style={{
                    padding: "0.3rem 0.7rem", borderRadius: 999, fontSize: "0.75rem", fontWeight: 700,
                    border: `1px solid ${active ? T.blue : T.border}`,
                    backgroundColor: active ? T.blue : T.surface,
                    color: active ? "white" : T.textSub,
                    cursor: "pointer", transition: "all 0.12s", fontFamily: "inherit",
                }}>
                    {r.label}
                </button>
            );
        })}
    </div>
);

// ─── Tab bar ──────────────────────────────────────────────────────────────────
const TABS = ["Overview", "Revenue", "Listings", "Users", "Engagement"];

const TabBar = ({ active, onChange }) => (
    <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, marginBottom: "1.5rem" }}>
        {TABS.map(t => {
            const isA = active === t;
            return (
                <button key={t} onClick={() => onChange(t)} style={{
                    padding: "0.65rem 1.1rem", background: "none", border: "none",
                    borderBottom: `2px solid ${isA ? T.blue : "transparent"}`,
                    color: isA ? T.blue : T.textSub, fontSize: "0.82rem",
                    fontWeight: isA ? 800 : 500, cursor: "pointer",
                    transition: "all 0.12s", marginBottom: -1, fontFamily: "inherit",
                }}>
                    {t}
                </button>
            );
        })}
    </div>
);

// ─── Download button ──────────────────────────────────────────────────────────
const DownloadBtn = ({ onClick }) => {
    const [loading, setLoading] = useState(false);
    const handle = () => {
        setLoading(true);
        setTimeout(() => { onClick(); setLoading(false); }, 300);
    };
    return (
        <button onClick={handle} style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            padding: "0.45rem 1rem", borderRadius: "0.55rem",
            border: `1px solid ${T.border}`, backgroundColor: T.surface,
            color: T.text, fontSize: "0.8rem", fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
            boxShadow: "0 1px 2px hsl(220 20% 15% / 0.05)",
        }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.color = T.blue; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}
        >
            {I.download}
            {loading ? "Exporting\u2026" : "Export CSV"}
        </button>
    );
};

const SampleBanner = () => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", backgroundColor: "hsl(40 80% 97%)", border: "1px solid hsl(40 80% 85%)", borderRadius: "0.625rem", padding: "0.75rem 1rem", marginBottom: "1.5rem", color: T.amber }}>
        {I.warn}
        <p style={{ margin: 0, fontSize: "0.8rem" }}>
            <strong>Sample data</strong> — no real records found for this period. Charts will update automatically once activity begins.
        </p>
    </div>
);

const TwoCol = ({ children, style: s }) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", ...s }}>{children}</div>
);

const AutoGrid = ({ min = 200, children, style: s }) => (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: "0.875rem", ...s }}>
        {children}
    </div>
);

// ─── Demo data ────────────────────────────────────────────────────────────────
const DEMO = {
    monthly_revenue: [
        { month: "2024-08", revenue: 22500, transactions: 145 },
        { month: "2024-09", revenue: 24300, transactions: 162 },
        { month: "2024-10", revenue: 25800, transactions: 178 },
        { month: "2024-11", revenue: 27200, transactions: 191 },
        { month: "2024-12", revenue: 26900, transactions: 185 },
        { month: "2025-01", revenue: 28900, transactions: 204 },
    ],
    provider_split: [
        { provider: "paystack", total: 145600, count: 890 },
        { provider: "flutterwave", total: 89200, count: 610 },
    ],
    status_breakdown: {
        success:  { count: 1247, total: 234700 },
        failed:   { count: 183, total: 0 },
        pending:  { count: 42, total: 0 },
        refunded: { count: 28, total: 5200 },
    },
    total_revenue: 284500, avg_payment: 188,
    subscription_summary: { active: 234, cancelled: 45, expired: 18, pending: 12 },
    monthly_new_subs: [
        { month: "2024-08", count: 34 }, { month: "2024-09", count: 41 },
        { month: "2024-10", count: 38 }, { month: "2024-11", count: 52 },
        { month: "2024-12", count: 48 }, { month: "2025-01", count: 61 },
    ],
    user_growth: [
        { month: "2024-08", count: 120 }, { month: "2024-09", count: 145 },
        { month: "2024-10", count: 162 }, { month: "2024-11", count: 189 },
        { month: "2024-12", count: 201 }, { month: "2025-01", count: 238 },
    ],
    users_by_role: [
        { role: "tenant", count: 820 }, { role: "agent", count: 145 }, { role: "admin", count: 12 },
    ],
    users_by_package: [
        { package: "free", count: 680 }, { package: "basic", count: 210 },
        { package: "pro", count: 75 },   { package: "premium", count: 12 },
    ],
    total_users: 977, new_users_period: 238,
    listing_stats: { total: 1284, active: 876, pending: 124, featured: 48, boosted: 32, sold: 89, rented: 287 },
    listings_by_type: [
        { property_type: "Apartment", count: 534 }, { property_type: "House", count: 312 },
        { property_type: "Studio", count: 198 },    { property_type: "Townhouse", count: 145 },
        { property_type: "Office", count: 67 },     { property_type: "Shop", count: 28 },
    ],
    listings_by_city: [
        { city: "Accra", count: 612 },     { city: "Kumasi", count: 234 },
        { city: "Takoradi", count: 145 },  { city: "Tema", count: 132 },
        { city: "Cape Coast", count: 89 }, { city: "Tamale", count: 72 },
    ],
    listings_by_purpose: [{ purpose: "rent", count: 1195 }, { purpose: "sale", count: 89 }],
    listing_growth: [
        { month: "2024-08", count: 89 }, { month: "2024-09", count: 112 },
        { month: "2024-10", count: 134 },{ month: "2024-11", count: 145 },
        { month: "2024-12", count: 128 },{ month: "2025-01", count: 167 },
    ],
    total_views: 28450, unique_viewers: 12890,
    views_over_time: [
        { month: "2024-08", views: 3200, unique_viewers: 1450 },
        { month: "2024-09", views: 4100, unique_viewers: 1890 },
        { month: "2024-10", views: 5200, unique_viewers: 2340 },
        { month: "2024-11", views: 4800, unique_viewers: 2180 },
        { month: "2024-12", views: 5600, unique_viewers: 2520 },
        { month: "2025-01", views: 5550, unique_viewers: 2510 },
    ],
    top_listings: [
        { title: "3-Bed Apt in East Legon", city: "Accra",  property_type: "Apartment", views: 1245, unique_views: 892 },
        { title: "Modern Studio in Osu",    city: "Accra",  property_type: "Studio",    views: 987,  unique_views: 743 },
        { title: "4-Bed House in Adum",     city: "Kumasi", property_type: "House",     views: 876,  unique_views: 654 },
        { title: "2-Bed Flat in Ridge",     city: "Accra",  property_type: "Apartment", views: 765,  unique_views: 589 },
        { title: "Office Space in Labone",  city: "Accra",  property_type: "Office",    views: 654,  unique_views: 498 },
    ],
    inquiries_summary: { total: 3420, from_users: 2180, from_guests: 1240 },
    inquiries_by_type: [
        { type: "whatsapp", count: 1890 }, { type: "phone", count: 980 }, { type: "form", count: 550 },
    ],
    inquiries_over_time: [
        { month: "2024-08", count: 420 }, { month: "2024-09", count: 512 },
        { month: "2024-10", count: 634 }, { month: "2024-11", count: 589 },
        { month: "2024-12", count: 612 }, { month: "2025-01", count: 653 },
    ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const AdminAnalytics = ({ analytics: raw }) => {
    const [tab,   setTab]   = useState("Overview");
    const [range, setRange] = useState(raw?.range ?? "6m");

    const a = useMemo(() => {
        const d = raw ?? {};
        const isDemo = !d.monthly_revenue?.length && !(d.listing_stats?.total) && !d.total_users && !d.total_views;
        return isDemo ? { ...DEMO, _demo: true } : { ...d, _demo: false };
    }, [raw]);

    const handleRange = (r) => {
        setRange(r);
        router.get(window.location.pathname, { range: r }, { preserveState: true, replace: true });
    };

    // Derived chart datasets
    const mrrData    = (a.monthly_revenue    ?? []).map(m => ({ label: fmtMonth(m.month), value: +m.revenue }));
    const subsData   = (a.monthly_new_subs   ?? []).map(m => ({ label: fmtMonth(m.month), value: +m.count }));
    const userGrowth = (a.user_growth        ?? []).map(m => ({ label: fmtMonth(m.month), value: +m.count }));
    const listGrowth = (a.listing_growth     ?? []).map(m => ({ label: fmtMonth(m.month), value: +m.count }));
    const viewsOT    = (a.views_over_time    ?? []).map(m => ({ label: fmtMonth(m.month), value: +m.views }));
    const inqOT      = (a.inquiries_over_time?? []).map(m => ({ label: fmtMonth(m.month), value: +m.count }));

    const providerDonut = (a.provider_split ?? []).map((p, i) => ({ label: cap(p.provider), value: +p.total, color: CHART_COLORS[i] }));

    const sbKeys = Object.keys(a.status_breakdown ?? {});
    const outcomeDonut = sbKeys.map(k => ({
        label: cap(k),
        value: +(a.status_breakdown[k]?.count ?? a.status_breakdown[k] ?? 0),
        color: k === "success" ? T.green : k === "failed" ? T.red : k === "refunded" ? T.purple : T.amber,
    }));

    const subStatusDonut = Object.entries(a.subscription_summary ?? {}).map(([k, v]) => ({
        label: cap(k), value: +v,
        color: k === "active" ? T.green : k === "cancelled" ? T.red : k === "expired" ? T.amber : T.teal,
    }));

    const roleDonut    = (a.users_by_role    ?? []).map((r, i) => ({ label: cap(r.role),    value: +r.count, color: CHART_COLORS[i] }));
    const pkgDonut     = (a.users_by_package ?? []).map((p, i) => ({ label: cap(p.package), value: +p.count, color: CHART_COLORS[i] }));
    const purposeDonut = (a.listings_by_purpose ?? []).map((p, i) => ({ label: cap(p.purpose), value: +p.count, color: [T.blue, T.green][i] || CHART_COLORS[i] }));
    const typeHBar     = (a.listings_by_type ?? []).map(t => ({ label: t.property_type, value: +t.count }));
    const cityHBar     = (a.listings_by_city ?? []).map(c => ({ label: c.city, value: +c.count }));
    const inqTypeHBar  = (a.inquiries_by_type ?? []).map(t => ({ label: cap(t.type), value: +t.count }));

    const ls = a.listing_stats ?? {};
    const is = a.inquiries_summary ?? {};
    const ss = a.subscription_summary ?? {};

    const totalPmts   = outcomeDonut.reduce((s, d) => s + d.value, 0);
    const successPmts = +(a.status_breakdown?.success?.count ?? a.status_breakdown?.success ?? 0);
    const successRate = pct(successPmts, totalPmts);

    const mb = "1.75rem";

    return (
        <>
            {/* Page header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: T.text, margin: "0 0 0.22rem", letterSpacing: "-0.02em" }}>Analytics</h1>
                    <p style={{ fontSize: "0.82rem", color: T.textSub, margin: 0 }}>
                        {raw?.from && raw?.to ? `${raw.from} — ${raw.to}` : "All time \u00B7 Real-time platform insights"}
                    </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <RangeFilter current={range} onChange={handleRange} />
                    <div style={{ width: 1, height: "1.5rem", backgroundColor: T.border }} />
                    <DownloadBtn onClick={() => downloadCSV(a)} />
                </div>
            </div>

            {/* Accent bar */}
            <div style={{ height: 4, borderRadius: 999, background: "linear-gradient(90deg, hsl(214 80% 50%), hsl(152 55% 42%), hsl(40 80% 48%))", marginBottom: "1.5rem", opacity: 0.45 }} />

            {a._demo && <SampleBanner />}

            <TabBar active={tab} onChange={setTab} />

            {/* ═══ OVERVIEW ═══════════════════════════════════════════════════ */}
            {tab === "Overview" && (
                <>
                    <div style={{ marginBottom: mb }}>
                        <SectionHead title="Overview" accent={T.blue} />
                        <AutoGrid min={185}>
                            <Kpi label="Total Listings"  value={fmt(ls.total)}         sub={`${fmt(ls.active)} active`}               accent="hsl(220 25% 15%)" iconBg={T.blueDim}   iconColor={T.blue}   icon={I.home}    bar={T.blue} />
                            <Kpi label="Total Users"     value={fmt(a.total_users)}     sub={`+${fmt(a.new_users_period)} this period`} accent={T.blue}           iconBg={T.blueDim}   iconColor={T.blue}   icon={I.users}   bar={T.blue} />
                            <Kpi label="Total Views"     value={fmt(a.total_views)}     sub={`${fmt(a.unique_viewers)} unique`}         accent={T.purple}         iconBg={T.purpleDim} iconColor={T.purple} icon={I.eye}     bar={T.purple} />
                            <Kpi label="Total Inquiries" value={fmt(is.total)}          sub={`${fmt(is.from_users)} from users`}        accent={T.teal}           iconBg={T.tealDim}   iconColor={T.teal}   icon={I.chat}    bar={T.teal} />
                            <Kpi label="Total Revenue"   value={fmtC(a.total_revenue)}  sub={`Avg ${fmtC(a.avg_payment)} / pmt`}        accent={T.green}          iconBg={T.greenDim}  iconColor={T.green}  icon={I.trending}bar={T.green} />
                            <Kpi label="Success Rate"    value={`${successRate}%`}      sub={`${fmt(successPmts)} successful`}          accent={T.green}          iconBg={T.greenDim}  iconColor={T.green}  icon={I.check}   bar={T.green} />
                            <Kpi label="Active Subs"     value={fmt(ss.active ?? 0)}    sub={`${fmt(ss.cancelled ?? 0)} cancelled`}     accent={T.sky}            iconBg={T.skyDim}    iconColor={T.sky}    icon={I.star}    bar={T.sky} />
                            <Kpi label="Featured"        value={fmt(ls.featured ?? 0)}  sub={`${fmt(ls.boosted ?? 0)} boosted`}         accent={T.amber}          iconBg={T.amberDim}  iconColor={T.amber}  icon={I.star}    bar={T.amber} />
                        </AutoGrid>
                    </div>
                    <TwoCol style={{ marginBottom: mb }}>
                        <Card>
                            <CardHead title="Monthly Revenue (GH\u20B5)" accent={T.blue} />
                            <div style={{ padding: "1.25rem" }}><BarChart data={mrrData} color={T.blue} valueFormat={fmtC} /></div>
                        </Card>
                        <Card>
                            <CardHead title="Payment Outcomes" accent={T.green} />
                            <div style={{ padding: "1.25rem" }}><DonutChart data={outcomeDonut} centerLabel="Payments" /></div>
                        </Card>
                        <Card>
                            <CardHead title="New Listings Per Month" accent={T.teal} />
                            <div style={{ padding: "1.25rem" }}><BarChart data={listGrowth} color="hsl(200 65% 40%)" valueFormat={fmt} /></div>
                        </Card>
                        <Card>
                            <CardHead title="Inquiry Channels" accent={T.purple} />
                            <div style={{ padding: "1.25rem" }}><DonutChart data={inqTypeHBar.map((d, i) => ({ ...d, color: CHART_COLORS[i] }))} centerLabel="Inquiries" /></div>
                        </Card>
                    </TwoCol>
                </>
            )}

            {/* ═══ REVENUE ════════════════════════════════════════════════════ */}
            {tab === "Revenue" && (
                <>
                    <div style={{ marginBottom: mb }}>
                        <SectionHead title="Revenue Summary" accent={T.blue} />
                        <AutoGrid min={195}>
                            <Kpi label="Total Revenue"   value={fmtC(a.total_revenue)} accent={T.green} iconBg={T.greenDim}  iconColor={T.green}  icon={I.trending} bar={T.green} />
                            <Kpi label="Avg per Payment" value={fmtC(a.avg_payment)}   accent={T.blue}  iconBg={T.blueDim}   iconColor={T.blue}   icon={I.trending} bar={T.blue} />
                            <Kpi label="Successful Pmts" value={fmt(successPmts)} sub={`${successRate}% rate`} accent={T.green} iconBg={T.greenDim} iconColor={T.green} icon={I.check} bar={T.green} />
                            <Kpi label="Active Subs" value={fmt(ss.active ?? 0)} sub={`${fmt(ss.cancelled ?? 0)} cancelled`} accent={T.sky} iconBg={T.skyDim} iconColor={T.sky} icon={I.star} bar={T.sky} />
                        </AutoGrid>
                    </div>
                    <div style={{ marginBottom: mb }}>
                        <SectionHead title="Revenue Trends" accent={T.blue} />
                        <TwoCol>
                            <Card>
                                <CardHead title="Monthly Recurring Revenue" accent={T.blue} />
                                <div style={{ padding: "1.25rem" }}><BarChart data={mrrData} color={T.blue} valueFormat={fmtC} /></div>
                            </Card>
                            <Card>
                                <CardHead title="New Subscriptions Per Month" accent={T.purple} />
                                <div style={{ padding: "1.25rem" }}><BarChart data={subsData} color={T.purple} valueFormat={fmt} /></div>
                            </Card>
                        </TwoCol>
                    </div>
                    <div style={{ marginBottom: mb }}>
                        <SectionHead title="Payment Breakdown" accent={T.green} />
                        <TwoCol>
                            <Card>
                                <CardHead title="Revenue by Provider" accent={T.blue} />
                                <div style={{ padding: "1.25rem" }}><DonutChart data={providerDonut} centerLabel="Revenue" /></div>
                            </Card>
                            <Card>
                                <CardHead title="Payment Status" accent={T.green} />
                                <div style={{ padding: "1.25rem" }}><DonutChart data={outcomeDonut} centerLabel="Payments" /></div>
                            </Card>
                            <Card>
                                <CardHead title="Subscription Status" accent={T.teal} />
                                <div style={{ padding: "1.25rem" }}><DonutChart data={subStatusDonut} centerLabel="Subs" /></div>
                            </Card>
                        </TwoCol>
                    </div>
                </>
            )}

            {/* ═══ LISTINGS ═══════════════════════════════════════════════════ */}
            {tab === "Listings" && (
                <>
                    <div style={{ marginBottom: mb }}>
                        <SectionHead title="Listing Summary" accent={T.teal} />
                        <AutoGrid min={180}>
                            <Kpi label="Total Listings" value={fmt(ls.total)}           accent="hsl(220 25% 15%)" iconBg={T.blueDim}   iconColor={T.blue}   icon={I.home}  bar={T.blue} />
                            <Kpi label="Active"         value={fmt(ls.active)}  sub={`${pct(ls.active, ls.total)}% of total`} accent={T.green} iconBg={T.greenDim} iconColor={T.green} icon={I.check} bar={T.green} />
                            <Kpi label="Pending Review" value={fmt(ls.pending)}           accent={T.amber}          iconBg={T.amberDim}  iconColor={T.amber}  icon={I.warn}  bar={T.amber} />
                            <Kpi label="Featured"       value={fmt(ls.featured ?? 0)} sub={`${fmt(ls.boosted ?? 0)} boosted`} accent={T.amber} iconBg={T.amberDim} iconColor={T.amber} icon={I.star} bar={T.amber} />
                            <Kpi label="Rented Out"     value={fmt(ls.rented ?? 0)}       accent={T.purple}         iconBg={T.purpleDim} iconColor={T.purple} icon={I.home}  bar={T.purple} />
                            <Kpi label="Sold"           value={fmt(ls.sold ?? 0)}           accent={T.sky}            iconBg={T.skyDim}    iconColor={T.sky}    icon={I.check} bar={T.sky} />
                        </AutoGrid>
                    </div>
                    <div style={{ marginBottom: mb }}>
                        <SectionHead title="Listing Growth" accent={T.teal} />
                        <TwoCol>
                            <Card>
                                <CardHead title="New Listings Per Month" accent={T.teal} />
                                <div style={{ padding: "1.25rem" }}><BarChart data={listGrowth} color="hsl(200 65% 40%)" valueFormat={fmt} /></div>
                            </Card>
                            <Card>
                                <CardHead title="By Purpose" accent={T.blue} />
                                <div style={{ padding: "1.25rem" }}><DonutChart data={purposeDonut} centerLabel="Listings" /></div>
                            </Card>
                        </TwoCol>
                    </div>
                    <div style={{ marginBottom: mb }}>
                        <SectionHead title="Distribution" accent={T.purple} />
                        <TwoCol>
                            <Card>
                                <CardHead title="By Property Type" accent={T.blue} />
                                <div style={{ padding: "1.25rem" }}><HBar data={typeHBar} /></div>
                            </Card>
                            <Card>
                                <CardHead title="By City" accent={T.purple} />
                                <div style={{ padding: "1.25rem" }}><HBar data={cityHBar} /></div>
                            </Card>
                        </TwoCol>
                    </div>
                </>
            )}

            {/* ═══ USERS ══════════════════════════════════════════════════════ */}
            {tab === "Users" && (
                <>
                    <div style={{ marginBottom: mb }}>
                        <SectionHead title="User Summary" accent={T.blue} />
                        <AutoGrid min={195}>
                            <Kpi label="Total Users"    value={fmt(a.total_users)}      accent={T.blue}   iconBg={T.blueDim}   iconColor={T.blue}   icon={I.users} bar={T.blue} />
                            <Kpi label="New This Period" value={fmt(a.new_users_period)} accent={T.green}  iconBg={T.greenDim}  iconColor={T.green}  icon={I.users} bar={T.green} />
                            <Kpi label="Agents"  value={fmt((a.users_by_role ?? []).find(r => r.role === "agent")?.count ?? 0)}  accent={T.purple} iconBg={T.purpleDim} iconColor={T.purple} icon={I.users} bar={T.purple} />
                            <Kpi label="Tenants" value={fmt((a.users_by_role ?? []).find(r => r.role === "tenant")?.count ?? 0)} accent={T.teal}   iconBg={T.tealDim}   iconColor={T.teal}   icon={I.users} bar={T.teal} />
                        </AutoGrid>
                    </div>
                    <TwoCol style={{ marginBottom: mb }}>
                        <Card>
                            <CardHead title="New Users Per Month" accent={T.blue} />
                            <div style={{ padding: "1.25rem" }}><BarChart data={userGrowth} color={T.blue} valueFormat={fmt} /></div>
                        </Card>
                        <Card>
                            <CardHead title="Users by Role" accent={T.purple} />
                            <div style={{ padding: "1.25rem" }}><DonutChart data={roleDonut} centerLabel="Users" /></div>
                        </Card>
                        <Card>
                            <CardHead title="Users by Package" accent={T.amber} />
                            <div style={{ padding: "1.25rem" }}><DonutChart data={pkgDonut} centerLabel="Users" /></div>
                        </Card>
                    </TwoCol>
                </>
            )}

            {/* ═══ ENGAGEMENT ═════════════════════════════════════════════════ */}
            {tab === "Engagement" && (
                <>
                    <div style={{ marginBottom: mb }}>
                        <SectionHead title="Engagement Summary" accent={T.purple} />
                        <AutoGrid min={195}>
                            <Kpi label="Total Views"     value={fmt(a.total_views)}    accent={T.purple} iconBg={T.purpleDim} iconColor={T.purple} icon={I.eye}  bar={T.purple} />
                            <Kpi label="Unique Viewers"  value={fmt(a.unique_viewers)} sub={`${pct(a.unique_viewers, a.total_views)}% unique`} accent={T.blue} iconBg={T.blueDim} iconColor={T.blue} icon={I.eye} bar={T.blue} />
                            <Kpi label="Total Inquiries" value={fmt(is.total)}          accent={T.teal}   iconBg={T.tealDim}   iconColor={T.teal}   icon={I.chat} bar={T.teal} />
                            <Kpi label="From Registered" value={fmt(is.from_users)} sub={`${fmt(is.from_guests)} guests`} accent={T.green} iconBg={T.greenDim} iconColor={T.green} icon={I.users} bar={T.green} />
                        </AutoGrid>
                    </div>
                    <div style={{ marginBottom: mb }}>
                        <SectionHead title="Trends" accent={T.purple} />
                        <TwoCol>
                            <Card>
                                <CardHead title="Monthly Listing Views" accent={T.purple} />
                                <div style={{ padding: "1.25rem" }}><BarChart data={viewsOT} color={T.purple} valueFormat={fmt} /></div>
                            </Card>
                            <Card>
                                <CardHead title="Monthly Inquiries" accent={T.teal} />
                                <div style={{ padding: "1.25rem" }}><BarChart data={inqOT} color="hsl(200 65% 40%)" valueFormat={fmt} /></div>
                            </Card>
                        </TwoCol>
                    </div>
                    <div style={{ marginBottom: mb }}>
                        <SectionHead title="Inquiry Breakdown" accent={T.teal} />
                        <TwoCol>
                            <Card>
                                <CardHead title="By Channel" accent={T.blue} />
                                <div style={{ padding: "1.25rem" }}><DonutChart data={inqTypeHBar.map((d, i) => ({ ...d, color: CHART_COLORS[i] }))} centerLabel="Inquiries" /></div>
                            </Card>
                            <Card>
                                <CardHead title="Channel Comparison" accent={T.purple} />
                                <div style={{ padding: "1.25rem" }}><HBar data={inqTypeHBar} /></div>
                            </Card>
                        </TwoCol>
                    </div>

                    {(a.top_listings ?? []).length > 0 && (
                        <div style={{ marginBottom: mb }}>
                            <SectionHead title="Top Performing Listings" accent={T.blue} />
                            <Card>
                                <CardHead title="Most Viewed Listings" accent={T.blue} />
                                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 6rem 8rem 5rem 6rem", gap: "0.75rem", padding: "0.55rem 1.25rem", backgroundColor: T.headBg, borderBottom: `1px solid ${T.border}` }}>
                                    {["Listing", "Type", "City", "Views", "Unique"].map(h => (
                                        <div key={h} style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase", color: T.textSub }}>{h}</div>
                                    ))}
                                </div>
                                {(a.top_listings ?? []).map((l, i) => (
                                    <div key={i}
                                        style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 6rem 8rem 5rem 6rem", gap: "0.75rem", padding: "0.65rem 1.25rem", borderBottom: `1px solid ${T.borderSub}`, transition: "background 0.1s" }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = T.headBg}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</div>
                                        <div><span style={{ display: "inline-flex", padding: "0.15rem 0.5rem", borderRadius: 999, fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.06em", backgroundColor: T.blueDim, color: T.blue }}>{l.property_type}</span></div>
                                        <div style={{ fontSize: "0.78rem", color: T.textSub }}>{l.city}</div>
                                        <div style={{ fontSize: "0.88rem", fontWeight: 900, color: T.blue }}>{fmt(l.views)}</div>
                                        <div style={{ fontSize: "0.88rem", fontWeight: 900, color: T.teal }}>{fmt(l.unique_views)}</div>
                                    </div>
                                ))}
                            </Card>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

AdminAnalytics.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default AdminAnalytics;