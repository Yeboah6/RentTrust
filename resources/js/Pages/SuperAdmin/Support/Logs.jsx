import React, { useState, useRef, useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ── Icons ─────────────────────────────────────────────────────────────────────

const SearchIcon = () => (
    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const DownloadIcon = () => (
    <svg style={{ width: '0.9rem', height: '0.9rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const RefreshIcon = ({ spinning }) => (
    <svg style={{ width: '0.9rem', height: '0.9rem', animation: spinning ? 'spin 1s linear infinite' : 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const CopyIcon = () => (
    <svg style={{ width: '0.9rem', height: '0.9rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
    </svg>
);

const ChevronIcon = ({ dir = 'down' }) => (
    <svg style={{ width: '0.875rem', height: '0.875rem', transform: dir === 'up' ? 'rotate(180deg)' : 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const TrashIcon = () => (
    <svg style={{ width: '0.9rem', height: '0.9rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

// ── Log level config ──────────────────────────────────────────────────────────

const levelConfig = {
    emergency: { color: '#ff4455', bg: 'rgba(255,68,85,0.15)',  label: 'EMERGENCY', short: 'EMRG' },
    alert:     { color: '#ff6b35', bg: 'rgba(255,107,53,0.15)', label: 'ALERT',     short: 'ALRT' },
    critical:  { color: '#ff4455', bg: 'rgba(255,68,85,0.12)',  label: 'CRITICAL',  short: 'CRIT' },
    error:     { color: '#ff6b6b', bg: 'rgba(255,107,107,0.12)',label: 'ERROR',     short: 'ERR ' },
    warning:   { color: '#ffd93d', bg: 'rgba(255,217,61,0.12)', label: 'WARNING',   short: 'WARN' },
    notice:    { color: '#6bcfff', bg: 'rgba(107,207,255,0.1)', label: 'NOTICE',    short: 'NOTE' },
    info:      { color: '#74c7ec', bg: 'rgba(116,199,236,0.1)', label: 'INFO',      short: 'INFO' },
    debug:     { color: '#a6e3a1', bg: 'rgba(166,227,161,0.1)', label: 'DEBUG',     short: 'DBUG' },
};

// ── Parse a raw log line ──────────────────────────────────────────────────────

const parseLogLine = (line, index) => {
    if (!line || !line.trim()) return null;

    // Laravel-style: [2024-01-15 10:23:45] local.ERROR: message {"context":...}
    const laravelMatch = line.match(
        /^\[(\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)\]\s+(?:\w+\.)?(EMERGENCY|ALERT|CRITICAL|ERROR|WARNING|NOTICE|INFO|DEBUG):\s+(.+?)(?:\s+(\{.*\}|\[.*\]))?\s*$/i
    );
    if (laravelMatch) {
        const [, timestamp, level, message, context] = laravelMatch;
        return { id: index, raw: line, timestamp, level: level.toLowerCase(), message, context: context ?? null };
    }

    // Syslog-style: Jan 15 10:23:45 host app[1234]: message
    const syslogMatch = line.match(/^(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+\S+\s+\S+:\s+(.+)$/);
    if (syslogMatch) {
        const [, timestamp, message] = syslogMatch;
        const level = /error/i.test(message) ? 'error' : /warn/i.test(message) ? 'warning' : /debug/i.test(message) ? 'debug' : 'info';
        return { id: index, raw: line, timestamp, level, message, context: null };
    }

    // Fallback: sniff level from line content
    const lowerLine = line.toLowerCase();
    const level =
        lowerLine.includes('emergency') ? 'emergency' :
        lowerLine.includes('critical')  ? 'critical' :
        lowerLine.includes('alert')     ? 'alert' :
        lowerLine.includes('error')     ? 'error' :
        lowerLine.includes('warning') || lowerLine.includes('warn') ? 'warning' :
        lowerLine.includes('notice')    ? 'notice' :
        lowerLine.includes('debug')     ? 'debug' : 'info';

    return { id: index, raw: line, timestamp: null, level, message: line.trim(), context: null };
};

// ── Level badge ───────────────────────────────────────────────────────────────

const LevelBadge = ({ level, compact = false }) => {
    const cfg = levelConfig[level] ?? levelConfig.info;
    return (
        <span style={{
            display: 'inline-block', fontFamily: 'monospace',
            fontSize: compact ? '0.62rem' : '0.65rem',
            fontWeight: '700', letterSpacing: '0.05em',
            padding: compact ? '0.1rem 0.35rem' : '0.15rem 0.45rem',
            borderRadius: '0.25rem',
            backgroundColor: cfg.bg, color: cfg.color,
            border: `1px solid ${cfg.color}33`,
            whiteSpace: 'nowrap',
        }}>
            {compact ? cfg.short : cfg.label}
        </span>
    );
};

// ── Log line component ────────────────────────────────────────────────────────

const LogLine = ({ entry, isSelected, onClick, highlight }) => {
    const cfg = levelConfig[entry.level] ?? levelConfig.info;

    const highlightText = (text) => {
        if (!highlight || !text) return text;
        const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === highlight.toLowerCase()
                ? <mark key={i} style={{ backgroundColor: 'hsl(45 90% 55%)', color: '#1a1a2e', borderRadius: '2px', padding: '0 1px' }}>{part}</mark>
                : part
        );
    };

    return (
        <div
            onClick={onClick}
            style={{
                display: 'grid',
                gridTemplateColumns: '4.5rem 5.5rem 1fr',
                gap: '0',
                padding: '0.3rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
                backgroundColor: isSelected ? 'rgba(255,255,255,0.07)' : 'transparent',
                transition: 'background-color 0.1s',
                borderLeft: isSelected ? `2px solid ${cfg.color}` : '2px solid transparent',
            }}
            onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; }}
            onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
            {/* Level */}
            <div style={{ padding: '0 0.5rem', display: 'flex', alignItems: 'flex-start', paddingTop: '0.05rem' }}>
                <LevelBadge level={entry.level} compact />
            </div>

            {/* Timestamp */}
            <div style={{ fontFamily: 'monospace', fontSize: '0.67rem', color: 'rgba(255,255,255,0.35)', paddingTop: '0.1rem', paddingRight: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {entry.timestamp
                    ? entry.timestamp.replace(/^\d{4}-\d{2}-\d{2}[T ]/, '').replace(/\.\d+/, '').replace(/Z$/, '')
                    : '—'}
            </div>

            {/* Message */}
            <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: cfg.color, lineHeight: 1.5, paddingRight: '0.75rem', wordBreak: 'break-word' }}>
                {highlightText(entry.message)}
                {entry.context && (
                    <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: '0.5rem', fontSize: '0.65rem' }}>{entry.context}</span>
                )}
            </div>
        </div>
    );
};

// ── Stat chip ─────────────────────────────────────────────────────────────────

const StatChip = ({ level, count, active, onClick }) => {
    const cfg = levelConfig[level] ?? levelConfig.info;
    return (
        <button
            onClick={onClick}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.3rem 0.7rem', borderRadius: '999px', border: 'none', cursor: 'pointer',
                backgroundColor: active ? cfg.bg : 'rgba(255,255,255,0.06)',
                color: active ? cfg.color : 'rgba(255,255,255,0.45)',
                fontSize: '0.72rem', fontWeight: '700', transition: 'all 0.15s',
                outline: active ? `1px solid ${cfg.color}44` : 'none',
            }}
        >
            <span style={{ width: '0.45rem', height: '0.45rem', borderRadius: '50%', backgroundColor: cfg.color, flexShrink: 0 }} />
            {cfg.label}
            <span style={{ opacity: 0.7 }}>{count}</span>
        </button>
    );
};

// ── Main ──────────────────────────────────────────────────────────────────────

const LEVELS = ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'];

const Logs = ({ logs = [] }) => {
    const [search, setSearch]           = useState('');
    const [activeLevel, setActiveLevel] = useState(null);
    const [selectedId, setSelectedId]   = useState(null);
    const [wrapLines, setWrapLines]     = useState(true);
    const [autoScroll, setAutoScroll]   = useState(true);
    const [refreshing, setRefreshing]   = useState(false);
    const [copied, setCopied]           = useState(false);
    const scrollRef = useRef(null);

    // Parse all log lines
    const parsed = useMemo(() => {
        const lines = Array.isArray(logs) ? logs : [logs];
        return lines
            .flatMap(l => typeof l === 'string' ? l.split('\n') : [String(l)])
            .map((line, i) => parseLogLine(line, i))
            .filter(Boolean);
    }, [logs]);

    // Level counts
    const levelCounts = useMemo(() =>
        LEVELS.reduce((acc, l) => ({ ...acc, [l]: parsed.filter(e => e.level === l).length }), {}),
        [parsed]
    );

    // Filtered entries
    const filtered = useMemo(() => {
        return parsed.filter(entry => {
            const matchLevel  = !activeLevel || entry.level === activeLevel;
            const matchSearch = !search || entry.raw.toLowerCase().includes(search.toLowerCase());
            return matchLevel && matchSearch;
        });
    }, [parsed, activeLevel, search]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (autoScroll && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [filtered, autoScroll]);

    const handleRefresh = () => {
        setRefreshing(true);
        router.reload({ only: ['logs'], onFinish: () => setRefreshing(false) });
    };

    const handleDownload = () => {
        const blob = new Blob([parsed.map(e => e.raw).join('\n')], { type: 'text/plain' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a'); a.href = url; a.download = 'system.log'; a.click();
        URL.revokeObjectURL(url);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(filtered.map(e => e.raw).join('\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const selectedEntry = parsed.find(e => e.id === selectedId);

    return (
        <div>
            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'hsl(220 25% 15%)', margin: '0 0 0.2rem' }}>System Logs</h1>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(220 15% 50%)', margin: 0 }}>
                        {parsed.length.toLocaleString()} entries &middot; {filtered.length.toLocaleString()} shown
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={handleRefresh} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 30%)', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}>
                        <RefreshIcon spinning={refreshing} /> Refresh
                    </button>
                    <button onClick={handleDownload} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', borderRadius: '0.5rem', border: '1px solid hsl(220 15% 88%)', backgroundColor: 'white', color: 'hsl(220 25% 30%)', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}>
                        <DownloadIcon /> Download
                    </button>
                </div>
            </div>

            {/* Terminal container */}
            <div style={{ borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid hsl(220 15% 20%)', boxShadow: '0 8px 32px hsl(220 25% 5% / 0.3)' }}>

                {/* Terminal title bar */}
                <div style={{ backgroundColor: 'hsl(220 18% 14%)', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid hsl(220 15% 20%)' }}>
                    <span style={{ width: '0.7rem', height: '0.7rem', borderRadius: '50%', backgroundColor: '#ff5f57' }} />
                    <span style={{ width: '0.7rem', height: '0.7rem', borderRadius: '50%', backgroundColor: '#febc2e' }} />
                    <span style={{ width: '0.7rem', height: '0.7rem', borderRadius: '50%', backgroundColor: '#28c840' }} />
                    <span style={{ flex: 1, textAlign: 'center', fontSize: '0.72rem', fontWeight: '600', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>
                        storage/logs/laravel.log
                    </span>
                    <button onClick={handleCopy} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'monospace' }}>
                        <CopyIcon /> {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>

                {/* Toolbar inside terminal */}
                <div style={{ backgroundColor: 'hsl(220 18% 12%)', padding: '0.6rem 0.75rem', borderBottom: '1px solid hsl(220 15% 18%)', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {/* Search */}
                    <div style={{ position: 'relative', minWidth: '180px' }}>
                        <span style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }}>
                            <SearchIcon />
                        </span>
                        <input
                            type="text"
                            placeholder="Filter logs…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                padding: '0.35rem 0.6rem 0.35rem 2rem',
                                backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '0.4rem', color: 'rgba(255,255,255,0.8)',
                                fontSize: '0.78rem', outline: 'none', width: '100%', boxSizing: 'border-box',
                                fontFamily: 'monospace',
                            }}
                        />
                    </div>

                    {/* Level chips — only show levels that have entries */}
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {LEVELS.filter(l => levelCounts[l] > 0).map(l => (
                            <StatChip
                                key={l} level={l} count={levelCounts[l]}
                                active={activeLevel === l}
                                onClick={() => setActiveLevel(prev => prev === l ? null : l)}
                            />
                        ))}
                        {activeLevel && (
                            <button onClick={() => setActiveLevel(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', padding: '0 0.3rem' }}>
                                ✕ clear
                            </button>
                        )}
                    </div>

                    {/* Options */}
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={wrapLines} onChange={e => setWrapLines(e.target.checked)} style={{ accentColor: '#74c7ec' }} />
                            Wrap
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={autoScroll} onChange={e => setAutoScroll(e.target.checked)} style={{ accentColor: '#74c7ec' }} />
                            Auto-scroll
                        </label>
                    </div>
                </div>

                {/* Log lines */}
                <div
                    ref={scrollRef}
                    style={{
                        backgroundColor: 'hsl(220 20% 10%)',
                        maxHeight: selectedEntry ? '380px' : '560px',
                        overflowY: 'auto',
                        padding: '0.4rem 0',
                        transition: 'max-height 0.25s ease',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(255,255,255,0.15) transparent',
                    }}
                >
                    {filtered.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                            No log entries match your filters.
                        </div>
                    ) : (
                        filtered.map(entry => (
                            <LogLine
                                key={entry.id}
                                entry={entry}
                                isSelected={selectedId === entry.id}
                                onClick={() => setSelectedId(prev => prev === entry.id ? null : entry.id)}
                                highlight={search}
                            />
                        ))
                    )}
                </div>

                {/* Selected entry detail panel */}
                {selectedEntry && (
                    <div style={{ backgroundColor: 'hsl(220 20% 8%)', borderTop: '1px solid hsl(220 15% 20%)', padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <LevelBadge level={selectedEntry.level} />
                                {selectedEntry.timestamp && (
                                    <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>
                                        {selectedEntry.timestamp}
                                    </span>
                                )}
                            </div>
                            <button onClick={() => setSelectedId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: '0.2rem' }}>
                                ✕
                            </button>
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: (levelConfig[selectedEntry.level] ?? levelConfig.info).color, lineHeight: 1.6, wordBreak: 'break-word', whiteSpace: wrapLines ? 'pre-wrap' : 'pre', overflowX: 'auto' }}>
                            {selectedEntry.message}
                        </div>
                        {selectedEntry.context && (
                            <div style={{ marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                {(() => { try { return JSON.stringify(JSON.parse(selectedEntry.context), null, 2); } catch { return selectedEntry.context; } })()}
                            </div>
                        )}
                        <div style={{ marginTop: '0.6rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.22)' }}>
                            {selectedEntry.raw}
                        </div>
                    </div>
                )}

                {/* Status bar */}
                <div style={{ backgroundColor: 'hsl(220 18% 13%)', padding: '0.35rem 1rem', borderTop: '1px solid hsl(220 15% 18%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
                        {filtered.length} / {parsed.length} lines
                        {activeLevel && ` · filtered: ${activeLevel}`}
                        {search && ` · search: "${search}"`}
                    </span>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {['error', 'warning'].map(l => levelCounts[l] > 0 && (
                            <span key={l} style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: (levelConfig[l] ?? levelConfig.info).color }}>
                                {levelCounts[l]} {l}s
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.22); }
            `}</style>
        </div>
    );
};

Logs.layout = page => <SuperAdminLayout>{page}</SuperAdminLayout>;
export default Logs;