// src/pages/AudioSentiment.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";

const RECORD_TIME_LIMIT = 60_000; // 60s

const tokens = {
  card: "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl",
  title: "text-2xl md:text-3xl font-semibold tracking-tight text-sky-200",
  subtle: "text-slate-300/80",
  btn: {
    primary:
      "px-4 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-medium shadow-lg shadow-sky-900/20",
    ghost:
      "px-4 h-11 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-100 border border-white/10",
    tab:
      "px-4 h-10 rounded-xl font-medium border border-white/10 data-[active=true]:bg-sky-500/20 data-[active=true]:text-sky-200 hover:bg-white/5 text-slate-200",
    icon:
      "inline-flex items-center gap-2 px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200",
  },
};

function classNames(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/* ================= Waveform ================= */
const WaveformCanvas: React.FC<{ audioBuffer?: AudioBuffer; height?: number }> = ({
  audioBuffer,
  height = 96,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = height * dpr;
    canvas.width = width;
    canvas.height = h;

    // bg placeholder
    ctx.clearRect(0, 0, width, h);
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, "#0ea5e9");
    grad.addColorStop(1, "#6366f1");
    ctx.fillStyle = grad;

    if (!audioBuffer) {
      ctx.globalAlpha = 0.2;
      for (let i = 0; i < width; i += 8) {
        const barH = (Math.sin(i * 0.01) * 0.5 + 0.5) * (h * 0.35);
        const y = h / 2 - barH / 2;
        ctx.fillRect(i, y, 5, barH);
      }
      ctx.globalAlpha = 1;
      return;
    }

    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j] || 0;
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      const yMax = (1 + max) * (h / 2);
      const yMin = (1 + min) * (h / 2);
      ctx.fillRect(i, yMin, 1, Math.max(1, yMax - yMin));
    }
  }, [audioBuffer, height]);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/40">
      <canvas ref={canvasRef} className="w-full" style={{ height }} />
    </div>
  );
};

/* ================= VU Meter ================= */
const VUMeter: React.FC<{ level: number }> = ({ level }) => (
  <div className="h-3 w-full rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
    <div
      className="h-full transition-[width] duration-75"
      style={{
        width: `${Math.min(100, Math.max(3, level * 100))}%`,
        background: "linear-gradient(90deg,#0ea5e9,#6366f1)",
      }}
    />
  </div>
);

/* ================= Result Card ================= */
const ResultCard: React.FC<{
  label?: string;
  confidence?: number;
  emotionTopK?: Array<{ label: string; score: number }>;
  latencyMs?: number;
}> = ({ label, confidence, emotionTopK, latencyMs }) => {
  const confPct = Math.round((confidence ?? 0) * 100);
  const color =
    label === "Positive"
      ? "text-emerald-300"
      : label === "Negative"
      ? "text-rose-300"
      : "text-slate-300";
  return (
    <div className={classNames(tokens.card, "p-5 md:p-6")}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm uppercase tracking-widest text-slate-400">
            Audio Sentiment
          </div>
          <div className={classNames("mt-1 text-2xl font-semibold", color)}>
            {label ?? "—"}
          </div>
        </div>
        {typeof latencyMs === "number" && (
          <div className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-slate-900/40 text-slate-300">
            {latencyMs} ms
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="text-xs text-slate-400 mb-1">Confidence</div>
        <div className="h-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
          <div
            className="h-full"
            style={{ width: `${confPct}%`, background: "linear-gradient(90deg,#22d3ee,#6366f1)" }}
          />
        </div>
        <div className="mt-1 text-xs text-slate-400">{confPct}%</div>
      </div>

      {emotionTopK && emotionTopK.length > 0 && (
        <div className="mt-5">
          <div className="text-xs text-slate-400 mb-2">Top-K Emotions</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {emotionTopK.map((e, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
              >
                <span className="text-slate-200">{e.label}</span>
                <span className="text-slate-400 text-sm">
                  {Math.round(e.score * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 text-[13px] text-slate-400">
        Mapping: Happy/Surprised → Positive · Neutral → Neutral · Angry/Sad/Fearful/Disgusted → Negative
      </div>
    </div>
  );
};

/* ================= Main Page ================= */
export default function AudioSentiment() {
  const [tab, setTab] = useState<"upload" | "record">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | undefined>();

  const [level, setLevel] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    label: string;
    confidence: number;
    topK: Array<{ label: string; score: number }>;
    latency: number;
  } | null>(null);
  const [quality, setQuality] = useState<{ rms?: number; snr?: number }>({});

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const recordingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load audio buffer for waveform
  useEffect(() => {
    const target = blob || file;
    if (!target) return;

    const url = URL.createObjectURL(target);
    setAudioUrl(url);

    (async () => {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuf = await target.arrayBuffer();
      try {
        const decoded = await ctx.decodeAudioData(arrayBuf);
        setAudioBuffer(decoded);
        const ch = decoded.getChannelData(0);
        const rms = Math.sqrt(ch.reduce((s, v) => s + v * v, 0) / ch.length);
        setQuality({ rms });
      } catch {
        setAudioBuffer(undefined);
      }
    })();

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [blob, file]);

  // Record flow
  const startRecording = async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Trình duyệt không hỗ trợ ghi âm.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      source.connect(analyser);

      recordedChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => recordedChunksRef.current.push(e.data);
      mr.onstop = () => {
        const b = new Blob(recordedChunksRef.current, { type: "audio/webm" });
        setBlob(b);
        setIsRecording(false);
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start();
      setIsRecording(true);

      // live VU loop
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / buf.length);
        setLevel(Math.min(1, rms * 4));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();

      // auto stop after 60s
      recordingTimeoutRef.current = setTimeout(() => {
        if (isRecording) {
          stopRecording();
          setError("Recording reached 60 second limit");
        }
      }, RECORD_TIME_LIMIT);
    } catch {
      setError("Không thể truy cập micro.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (recordingTimeoutRef.current != null) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
  };

  const clearAll = () => {
    setBlob(null);
    setFile(null);
    setAudioUrl(null);
    setAudioBuffer(undefined);
    setResult(null);
    setError(null);
    setLevel(0);
  };

  // Analyze
  const analyze = async () => {
    const data = blob || file;
    if (!data) {
      setError("Chưa có audio để phân tích.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("file", data);
      const start = performance.now();
      const res = await fetch("/api/analyze/audio", { method: "POST", body: fd });
      const latency = Math.round(performance.now() - start);

      if (!res.ok) throw new Error("Analyze failed");

      const json = await res.json();
      setResult({
        label: json.label ?? "Neutral",
        confidence: json.confidence ?? 0.5,
        topK: json.topK ?? [],
        latency,
      });
    } catch {
      setError("Kết nối gián đoạn. Thử lại?");
    } finally {
      setLoading(false);
    }
  };

  const qualityWarnings = useMemo(() => {
    const arr: string[] = [];
    if (quality.rms !== undefined && quality.rms < 0.015) {
      arr.push("Âm lượng thấp. Hãy nói gần micro hơn hoặc tăng gain.");
    }
    return arr;
  }, [quality]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className={tokens.title}>Audio Sentiment</h1>
        <button className={tokens.btn.icon} onClick={clearAll} title="Clear">
          <span>Clear</span>
        </button>
      </div>

      {/* Input Card */}
      <div className={classNames(tokens.card, "p-5 md:p-6")}>
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            className={classNames(tokens.btn.tab)}
            data-active={tab === "upload"}
            onClick={() => setTab("upload")}
          >
            Upload
          </button>
          <button
            className={classNames(tokens.btn.tab)}
            data-active={tab === "record"}
            onClick={() => setTab("record")}
          >
            Record
          </button>
        </div>

        {/* Upload */}
        {tab === "upload" && (
          <div className="space-y-4">
            <label className="block">
              <div className="w-full border-2 border-dashed border-sky-500/40 hover:border-sky-400/70 transition-colors rounded-2xl bg-slate-900/40 p-6 text-center cursor-pointer">
                <div className="text-sky-200 font-medium">
                  Drop audio here or click to browse
                </div>
                <div className="mt-1 text-sm text-slate-400">
                  WAV, MP3, M4A, FLAC • up to 50MB
                </div>
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      if (f.size > 50 * 1024 * 1024) {
                        setError("File quá lớn (max 50MB).");
                        return;
                      }
                      setFile(f);
                      setError(null);
                    }
                  }}
                />
              </div>
            </label>
            {file && (
              <div className="text-sm text-slate-300">
                Selected: {file.name} · {formatBytes(file.size)}
              </div>
            )}
          </div>
        )}

        {/* Record */}
        {tab === "record" && (
          <div className="space-y-4">
            <div className="text-sm text-slate-400 mb-2">
              Record tối đa 60 giây. Nhấn Stop hoặc sẽ tự dừng sau 60s.
            </div>
            <div className="flex items-center gap-4">
              <button
                className={classNames(tokens.btn.primary, isRecording && "opacity-70 pointer-events-none")}
                onClick={startRecording}
                disabled={isRecording}
                title="Record up to 60s"
              >
                {isRecording ? "Recording…" : "Start Recording (60s)"}
              </button>
              {isRecording && (
                <button className={tokens.btn.ghost} onClick={stopRecording}>
                  Stop
                </button>
              )}
            </div>
            <VUMeter level={level} />
            <div className={tokens.subtle}>Live mic level</div>
          </div>
        )}

        {/* Waveform / Preview */}
        <div className="mt-6 space-y-3">
          <div className="text-sm text-slate-400">Preview</div>
          <WaveformCanvas audioBuffer={audioBuffer} />
          {audioUrl && <audio controls src={audioUrl ?? undefined} className="w-full mt-2" />}
        </div>

        {/* Preprocess */}
        <div className="mt-6">
          <div className="text-sm text-slate-300 font-medium mb-2">Preprocess</div>
          <ul className="text-sm text-slate-400 grid gap-1">
            <li>✓ Resample 16kHz mono (client/server will resample if needed)</li>
            <li>✓ VAD (trim silence)</li>
            <li>✓ Normalize gain (informative)</li>
          </ul>
          {qualityWarnings.length > 0 && (
            <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200 text-sm">
              {qualityWarnings.map((q, i) => (
                <div key={i}>• {q}</div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            className={tokens.btn.primary}
            onClick={analyze}
            disabled={loading || (!file && !blob)}
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>
          <button className={tokens.btn.ghost} onClick={clearAll}>
            Clear
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-400/20 text-rose-200 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6">
          <ResultCard
            label={result.label}
            confidence={result.confidence}
            emotionTopK={result.topK}
            latencyMs={result.latency}
          />
        </div>
      )}

      {/* Footer tips */}
      <div className="mt-6 text-sm text-slate-400">
        Tips: Ghi trong phòng yên tĩnh · Tránh echo mạnh · Giữ micro cách miệng 10–15cm.
      </div>
    </div>
  );
}
