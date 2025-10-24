import React, { useEffect, useRef, useState } from "react";

type ModelScore = {
  label: string;
  score: number; // confidence 0..1
  polarity?: number; // -1..1
  topK?: { label: string; score: number }[];
};

export default function TextSentiment() {
  const [text, setText] = useState("");
  const [isBatch, setIsBatch] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ModelScore[] | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const CHAR_LIMIT = 5000;
  const LINE_LIMIT = 200;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function normalizeInput(raw: string) {
    return raw.replace(/\r\n?/g, "\n").trim().replace(/[\t ]+/g, " ");
  }

  function parseBatchLines(s: string) {
    const lines = s.replace(/\r\n?/g, "\n").split("\n").map((l) => l.trim()).filter(Boolean);
    return lines.slice(0, LINE_LIMIT);
  }

  function validate() {
    const normalized = normalizeInput(text);
    if (normalized.length === 0) {
      setError(null);
      return false;
    }
    if (normalized.length > CHAR_LIMIT) {
      setError("Nội dung quá dài (tối đa 5000 ký tự).");
      return false;
    }
    if (isBatch) {
      const lines = parseBatchLines(normalized);
      if (lines.length === 0) {
        setError("Không có dòng hợp lệ trong batch.");
        return false;
      }
      if (lines.length > LINE_LIMIT) {
        setError(`Quá nhiều dòng trong batch (tối đa ${LINE_LIMIT}).`);
        return false;
      }
    }
    setError(null);
    return true;
  }

  async function analyze() {
    if (!validate()) return;
    setIsRunning(true);
    setResults(null);
    setLatencyMs(null);
    setError(null);

    const normalized = normalizeInput(text);
    const body = { text: normalized, batch: isBatch };
    const started = performance.now();
    try {
      const res = await fetch("/api/analyze/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const ended = performance.now();
      setLatencyMs(Math.round(ended - started));
      if (!res.ok) {
        if (res.status >= 400 && res.status < 500) {
          setError("Yêu cầu không hợp lệ hoặc nội dung quá dài.");
        } else {
          setError("Hệ thống bận, thử lại sau.");
        }
        setIsRunning(false);
        return;
      }
      const json = await res.json();
      const scores: ModelScore[] = json.scores ?? [];
      setResults(scores);
      try { console.log("telemetry", { evt: "text.result", latency_ms: json.latency_ms ?? Math.round(ended - started), isBatch, batchSize: isBatch ? parseBatchLines(normalized).length : 1 }); } catch {}
    } catch (e) {
      setError("Kết nối gián đoạn. Thử lại?");
    } finally {
      setIsRunning(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      analyze();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      analyze();
    }
    if (e.key === "Escape") {
      if (text.length > 0) {
        if (confirm("Clear text?")) setText("");
      }
    }
  }

  function clear() {
    setText("");
    setResults(null);
    setError(null);
  }

  function fillSamples() {
    const samples = [
      "Tôi rất hài lòng với dịch vụ này!",
      "This product is okay, not the best.",
      "I hate how slow the app is."
    ];
    setText(samples.join("\n"));
    setIsBatch(true);
  }

  const charCount = text.length;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Text Sentiment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="font-medium mb-2">Text Input</h2>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Nhập văn bản hoặc dán bình luận/tweet..."
            className="w-full min-h-[120px] bg-gray-900 resize-none p-3 rounded text-sm"
            aria-label="Text input"
          />
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={isBatch} onChange={(e) => setIsBatch(e.target.checked)} />
                <span>Batch by line</span>
              </label>
              <button className="underline text-blue-400 text-xs" title="3 sample texts" onClick={fillSamples}>Sample</button>
            </div>
            <div>{charCount}/{CHAR_LIMIT}</div>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="px-3 py-2 bg-blue-600 rounded text-white" onClick={analyze} disabled={isRunning}>Analyze</button>
            <button className="px-3 py-2 bg-gray-700 rounded" onClick={clear}>Clear</button>
            <div className="text-xs text-gray-400 ml-auto">Hỗ trợ tiếng Việt & Anh. Kết quả tốt hơn với câu có dấu.</div>
          </div>
          {error && <div className="mt-2 text-sm text-red-400">{error}</div>}
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="font-medium mb-2">Kết quả</h2>
          {isRunning && <div className="text-sm text-gray-300">Đang phân tích...</div>}
          {!isRunning && !results && (
            <div className="text-center py-8 text-gray-400">
              <div className="mb-3">Không có kết quả</div>
              <button className="px-3 py-2 bg-gray-700 rounded" onClick={fillSamples}>Sample</button>
            </div>
          )}

          {results && !isBatch && results[0] && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className={`px-3 py-1 rounded ${results[0].label.toLowerCase().includes('pos') ? 'bg-blue-600' : results[0].label.toLowerCase().includes('neg') ? 'bg-red-600' : 'bg-gray-600'} text-white`}>{results[0].label}</div>
                <div className="text-xs text-gray-400">Polarity: {results[0].polarity?.toFixed(2) ?? '0.00'}</div>
              </div>
              <div className="w-full bg-gray-700 h-3 rounded overflow-hidden">
                <div style={{ width: `${Math.round((results[0].score ?? 0) * 100)}%` }} className="h-full bg-blue-500" />
              </div>
              <div className="text-xs text-gray-400">Latency: {latencyMs ? `${latencyMs} ms` : '—'} • Model: TextBlob v0.17</div>
            </div>
          )}

          {results && isBatch && (
            <div className="mt-2">
              <div className="overflow-auto max-h-72">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-400 text-xs">
                    <tr>
                      <th className="pr-2">#</th>
                      <th>Text</th>
                      <th>Label</th>
                      <th>Polarity</th>
                      <th>Conf.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i} className="border-t border-gray-800">
                        <td className="pr-2 text-gray-400">{i+1}</td>
                        <td>{/* client may not have per-line text stored here; keep blank or implement mapping if needed */}</td>
                        <td><span className={`px-2 py-1 rounded text-xs ${r.label.toLowerCase().includes('pos') ? 'bg-blue-600' : r.label.toLowerCase().includes('neg') ? 'bg-red-600' : 'bg-gray-600'} text-white`}>{r.label}</span></td>
                        <td className="text-xs text-gray-400">{(r.polarity ?? 0).toFixed(2)}</td>
                        <td className="text-xs text-gray-400">{(r.score ?? 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 flex gap-2">
                <button className="px-3 py-1 bg-gray-700 rounded">Export CSV</button>
                <button className="px-3 py-1 bg-gray-700 rounded">Export JSON</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}