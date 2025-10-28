import React, { useMemo, useState } from "react";
// Using lightweight DOM animations instead of framer-motion to avoid extra dependency

// =================== Design tokens ===================
const tokens = {
  card: "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl",
  title: "text-2xl md:text-3xl font-semibold tracking-tight text-sky-200",
  btn: {
    primary:
      "px-4 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-medium shadow-lg shadow-sky-900/20",
    ghost:
      "px-4 h-11 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-100 border border-white/10",
    subtle:
      "px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10",
  },
};
const cn = (...c: any[]) => c.filter(Boolean).join(" ");

// =================== Fancy gradient border ===================
const GlowCard: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="relative">
    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-sky-500/40 via-indigo-500/40 to-fuchsia-500/40 blur opacity-60 animate-pulse [animation-duration:5s]" />
    <div className={cn(tokens.card, "relative p-5 md:p-6")}>{children}</div>
  </div>
);

// =================== Types ===================
type Highlight = { start: number; end: number; weight?: number };
type TopK = { label: string; score: number };
type Result = { label: string; polarity: number; topK: TopK[]; latency: number; input: string; highlights?: Highlight[] };
type BatchRow = { text: string; label: string; polarity: number; confidence: number };

// ----------------- Sentiment Meter (gauge) -----------------
const Meter: React.FC<{ polarity?: number }> = ({ polarity = 0 }) => {
  const pct = Math.round(((polarity + 1) / 2) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full rotate-[-90deg]">
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,.08)" strokeWidth="12" fill="none" />
          <circle
            cx="60" cy="60" r="50" stroke="url(#g)" strokeWidth="12" fill="none" strokeLinecap="round"
            style={{
              strokeDasharray: 314.1592653589793,
              strokeDashoffset: 314.1592653589793 * (1 - pct / 100),
              transition: 'stroke-dashoffset 0.7s cubic-bezier(.2,.9,.2,1)'
            }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-sky-200">{pct}%</div>
            <div className="text-xs text-slate-400">polarity</div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="text-xs text-slate-400 mb-1">Meter</div>
        <div className="h-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-400 via-sky-400 to-emerald-400"
            style={{ width: `${pct}%`, transition: 'width 0.6s cubic-bezier(.2,.9,.2,1)' }}
          />
        </div>
        <div className="mt-1 text-xs text-slate-400">-1 (negative) → +1 (positive)</div>
      </div>
    </div>
  );
};

// ----------------- Highlighted text explanation -----------------
const ExplainText: React.FC<{ text?: string; highlights?: Highlight[] }> = ({ text, highlights }) => {
  if (!text) return null;
  const parts: Array<{ type: 'plain' | 'hl'; content: string; weight?: number }> = [];
  let last = 0;
  const hs = [...(highlights || [])].sort((a, b) => a.start - b.start);
  hs.forEach((h) => {
    if (h.start > last) parts.push({ type: 'plain', content: text.slice(last, h.start) });
    parts.push({ type: 'hl', content: text.slice(h.start, h.end), weight: h.weight });
    last = h.end;
  });
  if (last < text.length) parts.push({ type: 'plain', content: text.slice(last) });

  return (
    <p className="leading-relaxed">
      {parts.map((p, i) => (
        <span key={i} className={p.type === 'hl' ? 'px-1 rounded-md bg-sky-500/10 text-sky-200' : ''}>
          {p.content}
        </span>
      ))}
    </p>
  );
};

// ----------------- Result Card -----------------
const ResultCard: React.FC<{ result: Result | null; onRerun?: (text: string) => void }> = ({ result, onRerun }) => {
  if (!result) return (
    <div className={cn(tokens.card, 'p-6 grid place-items-center text-slate-400')}>Không có kết quả <button className={tokens.btn.subtle + ' ml-3'}>Sample</button></div>
  );
  const color = result.label === 'Positive' ? 'text-emerald-300' : result.label === 'Negative' ? 'text-rose-300' : 'text-slate-300';
  return (
    <GlowCard>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm uppercase tracking-widest text-slate-400">Text Sentiment</div>
          <div className={cn('mt-1 text-2xl font-semibold', color)} style={{ transition: 'transform .32s ease, opacity .32s ease', transform: 'translateY(0)', opacity: 1 }}>{result.label}</div>
        </div>
        <div className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-slate-900/40 text-slate-300">{result.latency} ms</div>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <Meter polarity={result.polarity} />
        <div>
          <div className="text-xs text-slate-400 mb-2">Top‑K</div>
          <div className="grid grid-cols-2 gap-2">
            {result.topK.map((k, i) => (
              <div key={i} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-slate-200">{k.label}</span>
                <span className="text-slate-400 text-sm">{Math.round(k.score * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-xs text-slate-400 mb-2">Giải thích nhanh</div>
        <ExplainText text={result.input} highlights={result.highlights} />
      </div>
      {onRerun && (
        <div className="mt-4 flex justify-end">
          <button className={tokens.btn.subtle} onClick={() => onRerun(result.input)}>Re-run this line</button>
        </div>
      )}
    </GlowCard>
  );
};

// ----------------- Batch Table -----------------
const BatchTable: React.FC<{ rows?: (BatchRow & { id: string; ts: number })[]; onRowClick?: (id: string) => void; selectedId?: string | null; onDeleteRow?: (id: string) => void }> = ({ rows = [], onRowClick, selectedId, onDeleteRow }) => {
  return (
    <div className={cn(tokens.card, 'overflow-hidden')}>
      <table className="w-full text-sm">
        <thead className="bg-white/5 border-b border-white/10 text-slate-300">
          <tr>
            <th className="text-left px-3 py-2 font-medium">#</th>
            <th className="text-left px-3 py-2 font-medium">Văn bản</th>
            <th className="text-left px-3 py-2 font-medium">Nhãn</th>
            <th className="text-left px-3 py-2 font-medium">Polarity</th>
            <th className="text-left px-3 py-2 font-medium">Confidence</th>
            <th className="text-left px-3 py-2 font-medium"> </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-6 text-center text-slate-400">No batch results yet.</td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={r.id} onClick={() => onRowClick?.(r.id)} className={cn('hover:bg-white/5 cursor-pointer', selectedId === r.id && 'bg-sky-700/10')}>
                <td className="px-3 py-2 text-slate-300">{i + 1}</td>
                <td className="px-3 py-2 text-slate-200 truncate max-w-[460px]" title={r.text}>{r.text}</td>
                <td className="px-3 py-2"><span className={r.label === 'Positive' ? 'text-emerald-300' : r.label === 'Negative' ? 'text-rose-300' : 'text-slate-300'}>{r.label}</span></td>
                <td className="px-3 py-2 text-slate-300">{r.polarity.toFixed(2)}</td>
                <td className="px-3 py-2 text-slate-300">{Math.round((r as any).confidence * 100)}%</td>
                <td className="px-3 py-2 text-slate-300">
                  <button className="text-sm text-rose-400 hover:text-rose-300" onClick={(e) => { e.stopPropagation(); onDeleteRow?.(r.id); }}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// ----------------- Main Page -----------------
export default function TextSentimentPage(): React.ReactElement {
  const [text, setText] = useState("");
  const [isBatch, setIsBatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  // persistent history of all batch rows across analyzes
  const [historyRows, setHistoryRows] = useState<(BatchRow & { id: string; ts: number })[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [filterQ, setFilterQ] = useState<string>("");

  const chars = text.length;
  const over = chars > 5000;

  const sample = () => {
    setText("Dịch vụ rất tuyệt! Nhân viên thân thiện và mình sẽ quay lại nữa.");
  };

  const warn = useMemo(() => {
    const arr: string[] = [];
    if (over) arr.push("Vượt quá 5.000 ký tự.");
    if (text && !/[ăâđêôơưáàảãạ]/i.test(text) && /[a-zA-Z]/.test(text) && !/\p{Extended_Pictographic}/u.test(text)) {
      arr.push("Văn bản không dấu có thể giảm độ chính xác.");
    }
    return arr;
  }, [text, over]);

  const analyze = async () => {
    if (!text || over) return;
    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 650)); // mock latency

    if (!isBatch) {
      const polarity = 0.62;
      const topK = [{ label: 'Positive', score: 0.82 }, { label: 'Neutral', score: 0.14 }, { label: 'Negative', score: 0.04 }];
      const highlights: Highlight[] = [{ start: 11, end: 21, weight: 0.7 }, { start: 34, end: 43, weight: 0.5 }];
      setResult({ label: 'Positive', /*confidence: undefined,*/ polarity, topK, latency: 312, input: text, highlights });
      setSelectedRowIndex(null);
    } else {
      const lines = text.split(/\n+/).map(s => s.trim()).filter(Boolean).slice(0, 200);
      const ts = Date.now();
      const newRows = lines.map((t, i) => ({ id: `${ts}-${i}`, ts, text: t, label: i % 5 === 0 ? 'Negative' : 'Positive', polarity: i % 5 === 0 ? -0.3 : 0.6, confidence: i % 5 === 0 ? 0.65 : 0.86 }));
      setHistoryRows((prev) => {
        const priorLen = prev.length;
        const out = [...prev, ...newRows];
        // select the first of the newly appended rows
        setSelectedRowIndex(priorLen);
        return out;
      });
    }
    setLoading(false);
  };

  // analyze single text directly (used for rerun of one line)
  const analyzeTextDirect = async (inputText: string) => {
    if (!inputText || inputText.length > 5000) return;
    setLoading(true);
    setResult(null);
    // simulate latency
    await new Promise((r) => setTimeout(r, 500));
    const polarity = Math.random() * 0.6 - 0.1; // small mock
    const topK = [{ label: 'Positive', score: 0.7 }, { label: 'Neutral', score: 0.2 }, { label: 'Negative', score: 0.1 }];
    const res = { label: polarity > 0 ? 'Positive' : 'Negative', polarity, topK, latency: 120, input: inputText, highlights: [] };
    setResult(res);
    // also append to historyRows so single rerun is preserved
    const id = `${Date.now()}-single`;
    setHistoryRows((prev) => [...prev, { id, ts: Date.now(), text: inputText, label: res.label, polarity: res.polarity, confidence: Math.round((res.topK?.[0]?.score ?? 0) * 100) / 100 } as any]);
    setLoading(false);
  };

  // clear only the text input (preserve results/table)
  const clearText = () => { setText(""); };

  // Export functions for batch (history)
  const exportJSON = () => {
    const data = { rows: historyRows };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text_sentiment_batch.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (!historyRows.length) return;
    const header = ['index', 'text', 'label', 'polarity', 'confidence'];
    const rows = historyRows.map((r, i) => [String(i + 1), (r.text || '').replace(/"/g, '""'), r.label, String(r.polarity), String((r as any).confidence ?? '')]);
    const csv = [header.join(','), ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text_sentiment_batch.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Demo runner: fill sample lines and run analyze
  const runDemo = () => {
    const demo = [
      'Dịch vụ rất tuyệt! Nhân viên thân thiện và mình sẽ quay lại nữa.',
      'Với cấu trúc như này thì phải làm sao đạt được độ chính xác cao nhất có thể',
      'tôi đang rất bực, đừng làm tôi buồn!'
    ].join('\n');
    setText(demo);
    setIsBatch(true);
    // give state a tick before analyze
    setTimeout(() => analyze(), 120);
  };

  const clearAllResults = () => {
    setHistoryRows([]);
    setSelectedRowIndex(null);
  };

  const filteredRows = historyRows.filter(r => {
    if (!filterQ) return true;
    const q = filterQ.toLowerCase();
    return r.text.toLowerCase().includes(q) || r.label.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className={tokens.title}>Text Sentiment</h1>
        <div className="text-sm text-slate-400">Hỗ trợ tiếng Việt & Anh</div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <GlowCard>
          <div className="text-slate-200 font-semibold mb-2">Text Input</div>
          <div className="relative">
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập văn bản hoặc dán bình luận/tweet…"
              className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3 text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
            <div className="absolute bottom-2 right-3 text-xs text-slate-400">{chars}/5000</div>
          </div>

          <div className="mt-3 flex items-center gap-4">
            <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
              <input type="checkbox" className="accent-sky-500" checked={isBatch} onChange={(e) => setIsBatch(e.target.checked)} />
              Batch by line
            </label>
            <div className="flex items-center gap-2">
              <button className={tokens.btn.subtle} onClick={sample}>Sample</button>
              <button className={tokens.btn.ghost} onClick={runDemo}>Demo</button>
            </div>
          </div>

          {warn.length > 0 && (
            <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200 text-sm">
              {warn.map((w, i) => (<div key={i}>• {w}</div>))}
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <button className={tokens.btn.primary} onClick={analyze} disabled={loading || !text || over}>{loading ? 'Analyzing…' : 'Analyze'}</button>
            <button className={tokens.btn.ghost} onClick={clearText}>Clear text</button>
          </div>
        </GlowCard>

        {/* Result */}
        <div>
          {loading ? (
            <div className={cn(tokens.card, 'p-6')}>
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-white/5 rounded w-1/3" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
                <div className="h-40 bg-white/5 rounded" />
              </div>
            </div>
          ) : (
            <ResultCard
              result={selectedRowIndex != null && historyRows[selectedRowIndex] ? {
                label: historyRows[selectedRowIndex].label,
                polarity: historyRows[selectedRowIndex].polarity,
                topK: [{ label: historyRows[selectedRowIndex].label, score: (historyRows[selectedRowIndex] as any).confidence ?? 0 }],
                latency: 0,
                input: historyRows[selectedRowIndex].text,
                highlights: [],
              } : result}
              onRerun={(txt) => analyzeTextDirect(txt)}
            />
          )}
        </div>
      </div>

      {/* Batch Table */}
      <div className="mt-6">
        <div className="flex items-center gap-3 mb-3">
          <input value={filterQ} onChange={(e) => setFilterQ(e.target.value)} placeholder="Search text or label…" className="flex-1 rounded-xl bg-slate-900/60 border border-white/10 px-3 py-2 text-slate-200" />
          <button className={tokens.btn.subtle} onClick={clearAllResults}>Clear all results</button>
          <button className={tokens.btn.ghost} onClick={exportJSON} disabled={!historyRows.length}>Export JSON</button>
          <button className={tokens.btn.ghost} onClick={exportCSV} disabled={!historyRows.length}>Export CSV</button>
        </div>

        <BatchTable rows={filteredRows} onRowClick={(id) => setSelectedRowIndex(historyRows.findIndex(r => r.id === id))} selectedId={selectedRowIndex != null ? historyRows[selectedRowIndex]?.id ?? null : null} onDeleteRow={(id) => { setHistoryRows(prev => prev.filter(r => r.id !== id)); if (selectedRowIndex != null && historyRows[selectedRowIndex]?.id === id) setSelectedRowIndex(null); }} />
      </div>
    </div>
  );
}