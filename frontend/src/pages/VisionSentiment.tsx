// import React, { useEffect, useRef, useState } from "react";
// import { ModelScore } from "../types/model";

// // ---------------- Design tokens ----------------
// const tokens = {
//     card: "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl",
//     title: "text-2xl md:text-3xl font-semibold tracking-tight text-sky-200",
//     btn: {
//         primary:
//             "px-4 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-medium shadow-lg shadow-sky-900/20",
//         ghost:
//             "px-4 h-11 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-100 border border-white/10",
//         tab:
//             "px-4 h-10 rounded-xl font-medium border border-white/10 data-[active=true]:bg-sky-500/20 data-[active=true]:text-sky-200 hover:bg-white/5 text-slate-200",
//         icon:
//             "inline-flex items-center gap-2 px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200",
//     },
// };

// function cn(...c: Array<any>) { return c.filter(Boolean).join(" "); }

// // ---------------- Helpers ----------------
// function drawBoxes(ctx: CanvasRenderingContext2D, boxes: Array<{ x: number, y: number, w: number, h: number }>, scale = 1) {
//     ctx.save();
//     ctx.strokeStyle = "#22d3ee"; // sky-400
//     ctx.lineWidth = 2;
//     boxes.forEach(b => {
//         ctx.strokeRect(b.x * scale, b.y * scale, b.w * scale, b.h * scale);
//     });
//     ctx.restore();
// }

// // ---------------- Image Preview with boxes ----------------
// const ImagePreview: React.FC<{
//     file: File | null;
//     snapshot: string | null;
//     boxes: Array<{ id: number, x: number, y: number, w: number, h: number }>;
//     activeId: number | null;
//     onPick?: (id: number) => void;
// }> = ({ file, snapshot, boxes, activeId, onPick }) => {
//     const canvasRef = useRef<HTMLCanvasElement | null>(null);
//     const [img, setImg] = useState<HTMLImageElement | null>(null);
//     const sourceUrl = snapshot || (file ? URL.createObjectURL(file) : null);

//     useEffect(() => {
//         if (!sourceUrl) { setImg(null); return; }
//         const i = new Image();
//         i.onload = () => setImg(i);
//         i.src = sourceUrl;
//         return () => { if (file) URL.revokeObjectURL(sourceUrl); };
//     }, [sourceUrl, file]);

//     useEffect(() => {
//         const canvas = canvasRef.current; if (!canvas || !img) return;
//         const dpr = window.devicePixelRatio || 1;
//         const maxW = 720; // responsive cap
//         const ratio = Math.min(1, maxW / img.width);
//         const w = Math.round(img.width * ratio);
//         const h = Math.round(img.height * ratio);
//         canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + "px"; canvas.style.height = h + "px";
//         const ctx = canvas.getContext('2d');
//         if (!ctx) return;
//         ctx.scale(dpr, dpr);
//         ctx.drawImage(img, 0, 0, w, h);
//         // draw boxes
//         if (boxes?.length) {
//             drawBoxes(ctx, boxes.map((b) => ({ ...b })), ratio);
//             // active box highlight
//             const act = boxes.find(b => b.id === activeId);
//             if (act) {
//                 ctx.save();
//                 ctx.strokeStyle = "#a78bfa"; // violet-400
//                 ctx.lineWidth = 3;
//                 ctx.strokeRect(act.x * ratio, act.y * ratio, act.w * ratio, act.h * ratio);
//                 ctx.restore();
//             }
//         }
//     }, [img, boxes, activeId]);

//     const downloadImage = () => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;

//         // Create a temporary link
//         const link = document.createElement('a');
//         link.download = 'vision-sentiment-capture.png';
//         link.href = canvas.toDataURL('image/png');
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     return (
//         <div className="space-y-3">
//             <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 flex justify-center">
//                 <canvas ref={canvasRef} />
//             </div>
//             {sourceUrl && (
//                 <div className="flex justify-end">
//                     <button className={tokens.btn.icon} onClick={downloadImage}>
//                         Download Image
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// // ---------------- Camera Capture ----------------
// const CameraCapture: React.FC<{
//     onShot: (blob: Blob) => void;
// }> = ({ onShot }) => {
//     const videoRef = useRef<HTMLVideoElement | null>(null);
//     const [ready, setReady] = useState(false);
//     const [stream, setStream] = useState<MediaStream | null>(null);

//     const startCamera = async () => {
//         try {
//             const s = await navigator.mediaDevices.getUserMedia({ video: true });
//             setStream(s);
//             if (videoRef.current) {
//                 videoRef.current.srcObject = s;
//                 videoRef.current.onloadedmetadata = () => setReady(true);
//             }
//         } catch (e) {
//             setReady(false);
//         }
//     };

//     const stopCamera = () => {
//         if (stream) {
//             stream.getTracks().forEach(track => track.stop());
//             setStream(null);
//             setReady(false);
//             if (videoRef.current) {
//                 videoRef.current.srcObject = null;
//             }
//         }
//     };

//     useEffect(() => {
//         startCamera();
//         return () => {
//             stopCamera();
//         };
//     }, []);

//     const takeShot = () => {
//         const v = videoRef.current; if (!v) return;
//         const canvas = document.createElement('canvas');
//         const w = v.videoWidth; const h = v.videoHeight;
//         canvas.width = w; canvas.height = h;
//         const ctx = canvas.getContext('2d');
//         if (!ctx) return;
//         ctx.drawImage(v, 0, 0);
//         canvas.toBlob((blob) => blob && onShot(blob), 'image/jpeg', 0.92);
//     };

//     return (
//         <div className="space-y-3">
//             <div className="overflow-hidden rounded-xl border border-white/10">
//                 <video ref={videoRef} autoPlay playsInline className="w-full max-h-[360px] object-contain bg-slate-900" />
//             </div>
//             <div className="flex gap-3">
//                 {stream ? (
//                     <>
//                         <button className={tokens.btn.primary} disabled={!ready} onClick={takeShot}>Snapshot</button>
//                         <button className={tokens.btn.ghost} onClick={stopCamera}>Turn Off Camera</button>
//                     </>
//                 ) : (
//                     <button className={tokens.btn.primary} onClick={startCamera}>Turn On Camera</button>
//                 )}
//                 <div className="text-sm text-slate-400">Căn mặt ở trung tâm khung hình, ánh sáng đều.</div>
//             </div>
//         </div>
//     );
// };

// // ---------------- Result Card ----------------
// const ResultCard: React.FC<{
//     label?: string;
//     confidence?: number;
//     topK?: Array<{ label: string; score: number }>;
//     latencyMs?: number;
// }> = ({ label, confidence, topK, latencyMs }) => {
//     const confPct = Math.round((confidence ?? 0) * 100);
//     const tone = label === 'Happy' ? 'text-emerald-300' : label === 'Angry' ? 'text-rose-300' : 'text-slate-300';
//     return (
//         <div className={cn(tokens.card, 'p-5 md:p-6')}>
//             <div className="flex items-center justify-between">
//                 <div>
//                     <div className="text-sm uppercase tracking-widest text-slate-400">Vision Sentiment</div>
//                     <div className={cn('mt-1 text-2xl font-semibold', tone)}>{label ?? '—'}</div>
//                 </div>
//                 {typeof latencyMs === 'number' && (
//                     <div className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-slate-900/40 text-slate-300">{latencyMs} ms</div>
//                 )}
//             </div>
//             <div className="mt-4">
//                 <div className="text-xs text-slate-400 mb-1">Confidence</div>
//                 <div className="h-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
//                     <div className="h-full" style={{ width: `${confPct}%`, background: 'linear-gradient(90deg,#22d3ee,#6366f1)' }} />
//                 </div>
//                 <div className="mt-1 text-xs text-slate-400">{confPct}%</div>
//             </div>
//             {topK?.length ? (
//                 <div className="mt-5">
//                     <div className="text-xs text-slate-400 mb-2">Top‑K Emotions</div>
//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                         {topK.map((e, i) => (
//                             <div key={i} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
//                                 <span className="text-slate-200">{e.label}</span>
//                                 <span className="text-slate-400 text-sm">{Math.round(e.score * 100)}%</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             ) : null}
//             <div className="mt-5 text-[13px] text-slate-400">Fair‑Use: chỉ dự đoán cảm xúc khuôn mặt, không suy luận thuộc tính nhạy cảm.</div>
//         </div>
//     );
// };

// // ---------------- Thumbnails of faces ----------------
// const FaceStrip: React.FC<{
//     boxes: Array<{ id: number, x: number, y: number, w: number, h: number }>;
//     activeId: number | null;
//     onPick: (id: number) => void;
// }> = ({ boxes, activeId, onPick }) => (
//     <div className="flex gap-2 overflow-x-auto py-2">
//         {boxes?.map((b) => (
//             <button
//                 key={b.id}
//                 onClick={() => onPick(b.id)}
//                 className={cn('min-w-[84px] h-[84px] rounded-xl border', activeId === b.id ? 'border-sky-400 ring-2 ring-sky-500/40' : 'border-white/10')}
//                 title={`Face ${b.id}`}
//             >
//                 <div className="w-full h-full bg-slate-700/40 flex items-center justify-center text-slate-300 text-sm">#{b.id}</div>
//             </button>
//         ))}
//     </div>
// );

// // ---------------- Main Page ----------------
// const VisionSentimentPage: React.FC = () => {
//     const [key, setKey] = useState(Date.now());
//     const [tab, setTab] = useState<'upload' | 'camera'>('upload');
//     const [file, setFile] = useState<File | null>(null);
//     const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

//     const [boxes, setBoxes] = useState<Array<{ id: number, x: number, y: number, w: number, h: number }>>([]);
//     const [activeId, setActiveId] = useState<number | null>(null);

//     const [loading, setLoading] = useState(false);
//     const [result, setResult] = useState<{ label: string; confidence: number; topK: { label: string; score: number }[]; latency: number } | null>(null);
//     const [notice, setNotice] = useState<string | null>(null);

//     // mock face detection on client (placeholder). Replace with real API call.
//     const detectFaces = async (blobOrFile: Blob) => {
//         setNotice(null);
//         // Simulate 1–3 faces with random boxes
//         await new Promise(r => setTimeout(r, 350));
//         const faces = Math.max(1, Math.round(Math.random() * 2) + 1);
//         const arr = Array.from({ length: faces }).map((_, i) => ({ id: i + 1, x: 80 + i * 120, y: 60 + (i % 2) * 50, w: 120, h: 120 }));
//         setBoxes(arr);
//         setActiveId(arr[0]?.id ?? null);
//     };

//     const handleSnapshot = (blob: Blob) => {
//         if (snapshotUrl) URL.revokeObjectURL(snapshotUrl);
//         const url = URL.createObjectURL(blob);
//         setSnapshotUrl(url);
//         setFile(null);
//         detectFaces(blob);
//     };

//     const handleFile = (f: File) => {
//         setFile(f); if (snapshotUrl) { URL.revokeObjectURL(snapshotUrl); setSnapshotUrl(null); }
//         detectFaces(f);
//     };

//     const analyze = async () => {
//         if (!file && !snapshotUrl) return;
//         setLoading(true); setResult(null);
//         const start = performance.now();
//         await new Promise(r => setTimeout(r, 650));
//         const latency = Math.round(performance.now() - start);
//         const topK = [{ label: 'Happy', score: 0.61 }, { label: 'Neutral', score: 0.22 }, { label: 'Surprised', score: 0.09 }];
//         setResult({ label: 'Happy', confidence: 0.78, topK, latency });
//         setLoading(false);
//     };

//     const clearAll = () => {
//         setFile(null);
//         if (snapshotUrl) URL.revokeObjectURL(snapshotUrl);
//         setSnapshotUrl(null);
//         setBoxes([]); setActiveId(null);
//         setResult(null); setNotice(null);
//     };

//     return (
//         <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
//             <div className="flex items-center justify-between mb-6">
//                 <h1 className={tokens.title}>Vision Sentiment</h1>
//                 <button
//                     className={cn(tokens.btn.icon, "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-400/30")}
//                     onClick={() => {
//                         clearAll();
//                         setTab('upload');
//                         setKey(Date.now()); // Force re-mount component
//                     }}
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
//                         <path d="M12 5v14M5 12h14" />
//                     </svg>
//                     New Analysis
//                 </button>
//             </div>

//             {/* Input Card */}
//             <div key={key} className={cn(tokens.card, 'p-5 md:p-6')}>
//                 <div className="flex gap-2 mb-4">
//                     <button className={tokens.btn.tab} data-active={tab === 'upload'} onClick={() => setTab('upload')}>Upload Image</button>
//                     <button className={tokens.btn.tab} data-active={tab === 'camera'} onClick={() => setTab('camera')}>Camera Capture</button>
//                 </div>

//                 {tab === 'upload' && (
//                     <div className="space-y-4">
//                         <label className="block">
//                             <div className="w-full border-2 border-dashed border-sky-500/40 hover:border-sky-400/70 transition-colors rounded-2xl bg-slate-900/40 p-6 text-center cursor-pointer">
//                                 <div className="text-sky-200 font-medium">Drop image here or click to browse</div>
//                                 <div className="mt-1 text-sm text-slate-400">PNG, JPG, JPEG, BMP, TIFF • up to 25MB</div>
//                                 <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
//                             </div>
//                         </label>
//                         {file && (
//                             <div className="text-sm text-slate-300">Selected: {file.name}</div>
//                         )}
//                     </div>
//                 )}

//                 {tab === 'camera' && (
//                     <CameraCapture onShot={handleSnapshot} />
//                 )}

//                 {/* Preview with boxes */}
//                 <div className="mt-6">
//                     <div className="text-sm text-slate-400 mb-2">Preview</div>
//                     <ImagePreview file={file} snapshot={snapshotUrl} boxes={boxes} activeId={activeId} />
//                     {!!boxes.length && (
//                         <div className="mt-3">
//                             <div className="text-sm text-slate-400 mb-2">Detected faces</div>
//                             <FaceStrip boxes={boxes} activeId={activeId} onPick={setActiveId} />
//                         </div>
//                     )}
//                 </div>

//                 {/* Preprocess */}
//                 <div className="mt-6">
//                     <div className="text-sm text-slate-300 font-medium mb-2">Preprocess</div>
//                     <ul className="text-sm text-slate-400 grid gap-1">
//                         <li>✓ Face detection → draw bounding boxes</li>
//                         <li>✓ Grayscale + resize 224×224 preview</li>
//                     </ul>
//                     {!boxes.length && (
//                         <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200 text-sm">
//                             Không phát hiện khuôn mặt? Hãy tăng ánh sáng, nhìn thẳng, bỏ vật che khuôn mặt.
//                         </div>
//                     )}
//                 </div>

//                 {/* Actions */}
//                 <div className="mt-6 flex gap-3">
//                     <button className={tokens.btn.primary} onClick={analyze} disabled={loading || (!file && !snapshotUrl)}>
//                         {loading ? 'Analyzing…' : 'Analyze'}
//                     </button>
//                     <button className={tokens.btn.ghost} onClick={clearAll}>Clear</button>
//                 </div>
//             </div>

//             {/* Result */}
//             {result && (
//                 <div className="mt-6">
//                     <ResultCard label={result.label} confidence={result.confidence} topK={result.topK} latencyMs={result.latency} />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default VisionSentimentPage;



import React, { useEffect, useMemo, useRef, useState } from "react";

/* =============== tiny utils =============== */
const cx = (...a: Array<string | false | null | undefined>) =>
  a.filter(Boolean).join(" ");

/* =============== design tokens =============== */
const tokens = {
  card:
    "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl transition-shadow duration-300 hover:shadow-sky-900/20 hover:shadow-xl animate-[fadeIn_.42s_ease] will-change-transform",
  btn: {
    primary:
      "inline-flex items-center gap-2 px-4 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-fuchsia-500 hover:from-sky-400 hover:to-fuchsia-400 text-white font-medium shadow-lg shadow-sky-900/20 disabled:opacity-60 disabled:pointer-events-none",
    ghost:
      "px-4 h-14 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-100 border border-white/10",
    subtle:
      "px-3 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 disabled:opacity-60",
    tab:
      "px-4 h-10 rounded-xl font-medium border border-white/10 data-[active=true]:bg-sky-500/20 data-[active=true]:text-sky-200 hover:bg-white/5 text-slate-200",
    icon:
      "inline-flex items-center gap-2 px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200",
  },
};

/* =============== keyframes (đồng bộ với Audio/Text) =============== */
const KEYFRAMES = `
@keyframes moveX{0%{background-position:0% 0%}100%{background-position:300% 0%}}
@keyframes floatDot{0%{transform:translateY(0)}50%{transform:translateY(-8px)}100%{transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes runLine{0%{left:-35%}100%{left:100%}}
`;

/* =============== Animated Header =============== */
type AnimatedHeaderProps = {
  title?: string;
  subtitle?: string;
  badges?: string[];
  bgColors?: [string, string, string, string];
  lineColors?: [string, string, string];
};
const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  title = "Vision Sentiment",
  subtitle = "Nền tảng phân tích cảm xúc khuôn mặt (mở rộng Audio, Text).",
  badges = ["Glow UI", "Realtime-ready"],
  bgColors = ["#0ea5e9", "#4f46e5", "#8b5cf6", "#4f46e5"],
  lineColors = ["#22d3ee", "#a855f7", "#22d3ee"],
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-white/10 mb-8">
    <style>{KEYFRAMES}</style>
    {/* moving gradient bg */}
    <div
      className="absolute inset-0 opacity-75"
      style={{
        background: `linear-gradient(90deg,${bgColors[0]},${bgColors[1]},${bgColors[2]},${bgColors[3]},${bgColors[0]})`,
        backgroundSize: "300% 100%",
        animation: "moveX 16s linear infinite",
      }}
    />
    {/* dark veil */}
    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />
    {/* floating dots */}
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/30"
          style={{
            left: `${(i * 57) % 100}%`,
            top: `${(i * 37) % 100}%`,
            opacity: 0.35,
            animation: `floatDot ${6 + (i % 5)}s ease-in-out ${i * 0.25}s infinite`,
          }}
        />
      ))}
    </div>
    {/* content */}
    <div className="relative px-6 py-7 md:px-10 md:py-9">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 grid place-items-center text-sky-300">
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <path
              d="M2 12c0-1.1.9-2 2-2h2l2-3 4 10 2-3h6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-sky-50">
            {title}
          </h1>
          <p className="text-slate-200/85">{subtitle}</p>
        </div>
        <div className="ml-auto hidden md:flex items-center gap-2">
          {badges.map((b) => (
            <span
              key={b}
              className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-slate-100"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
    {/* moving stripe bottom */}
    <div className="relative h-[3px] rounded-b-2xl overflow-hidden">
      <div
        className="absolute top-0 h-[3px] w-[35%] rounded-full"
        style={{
          background: `linear-gradient(90deg,${lineColors[0]},${lineColors[1]},${lineColors[2]})`,
          animation: "runLine 8s linear infinite",
        }}
      />
    </div>
  </div>
);

/* =============== helpers =============== */
const formatBytes = (b: number) => {
  if (!b) return "0 B";
  const k = 1024;
  const u = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return `${(b / Math.pow(k, i)).toFixed(2)} ${u[i]}`;
};

/* =============== Preview (boxes + pan/zoom nhẹ) =============== */
type Box = { id: number; x: number; y: number; w: number; h: number };
const drawBoxes = (ctx: CanvasRenderingContext2D, boxes: Box[], scale = 1) => {
  ctx.save();
  boxes.forEach((b) => {
    ctx.strokeStyle = "rgba(56,189,248,.85)"; // sky-400
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(b.x * scale, b.y * scale, b.w * scale, b.h * scale);
  });
  ctx.restore();
};

const ImagePreview: React.FC<{
  sourceUrl?: string | null;
  boxes: Box[];
  activeId: number | null;
}> = ({ sourceUrl, boxes, activeId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!sourceUrl) {
      setImg(null);
      return;
    }
    const i = new Image();
    i.onload = () => setImg(i);
    i.src = sourceUrl;
  }, [sourceUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const maxW = 880;
    const ratio = Math.min(1, maxW / img.width);
    const w = Math.round(img.width * ratio);
    const h = Math.round(img.height * ratio);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "rgba(15,23,42,.6)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.drawImage(img, 0, 0, w, h);

    // boxes
    drawBoxes(ctx, boxes, ratio);

    // active highlight
    const act = boxes.find((b) => b.id === activeId);
    if (act) {
      ctx.save();
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(168,85,247,.9)"; // violet
      ctx.lineWidth = 3;
      ctx.strokeRect(act.x * ratio, act.y * ratio, act.w * ratio, act.h * ratio);
      ctx.restore();
    }
  }, [img, boxes, activeId]);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 min-h-[280px] grid place-items-center">
      <canvas ref={canvasRef} />
    </div>
  );
};

/* =============== Donut Gauge =============== */
const Donut: React.FC<{ pct: number; size?: number }> = ({ pct, size = 190 }) => {
  const r = 70;
  const C = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, pct));
  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg viewBox="0 0 200 200" className="w-full h-full rotate-[-90deg]">
        <defs>
          <linearGradient id="gauge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle
          cx="100"
          cy="100"
          r={r}
          stroke="rgba(255,255,255,.14)"
          strokeWidth="18"
          fill="none"
        />
        <circle
          cx="100"
          cy="100"
          r={r}
          stroke="url(#gauge)"
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: C,
            strokeDashoffset: C * (1 - p / 100),
            transition: "stroke-dashoffset .8s cubic-bezier(.2,.9,.2,1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-4xl font-extrabold text-sky-200">{p}%</div>
          <div className="text-xs text-slate-400">confidence</div>
        </div>
      </div>
    </div>
  );
};

/* =============== Modal Detail =============== */
const DetailModal: React.FC<{
  open: boolean;
  onClose: () => void;
  row?: ResultRow | null;
}> = ({ open, onClose, row }) => {
  if (!open || !row) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-[fadeIn_.25s_ease]"
      onClick={onClose}
    >
      <div
        className={cx(tokens.card, "w-[min(960px,92vw)] mx-auto mt-16 p-6 md:p-7")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <h3 className="text-2xl font-bold text-sky-200">Analysis detail</h3>
          <button
            className="w-12 h-8 grid place-items-center rounded-lg bg-white/10 hover:bg-white/20"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-7">
          <div className="space-y-2">
            <div className="text-sm text-slate-400">Source</div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-slate-200">
              {row.source}
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-400">
              <span>
                <b>Label:</b>{" "}
                <span
                  className={cx(
                    row.label === "Happy"
                      ? "text-emerald-300"
                      : row.label === "Angry"
                      ? "text-rose-300"
                      : "text-slate-300"
                  )}
                >
                  {row.label}
                </span>
              </span>
              <span>
                <b>Confidence:</b> {Math.round(row.confidence * 100)}%
              </span>
              <span>
                <b>Latency:</b> {row.latency} ms
              </span>
            </div>
          </div>

          <div className="grid place-items-center">
            <Donut pct={Math.round(row.confidence * 100)} />
          </div>
        </div>

        {/* top-k */}
        {row.topK?.length ? (
          <div className="mt-6">
            <div className="text-xs text-slate-400 mb-2">Top-K Emotions</div>
            <div className="grid grid-cols-3 gap-3">
              {row.topK.map((k) => (
                <div
                  key={k.label}
                  className="rounded-xl bg-white/5 border border-white/10 p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-200">{k.label}</span>
                    <span className="text-slate-400 text-sm">
                      {Math.round(k.score * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded bg-slate-700/60 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-fuchsia-400"
                      style={{
                        width: `${Math.min(100, Math.max(0, k.score * 100))}%`,
                        transition: "width .6s cubic-bezier(.2,.9,.2,1)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

/* =============== Types =============== */
type ResultRow = {
  id: string;
  source: string;
  label: string;
  confidence: number;
  latency: number;
  topK: { label: string; score: number }[];
  ts: number;
};

/* =============== Main Page =============== */
export default function VisionSentimentPage(): React.ReactElement {
  /* shared input state */
  const [tab, setTab] = useState<"upload" | "camera">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const sourceUrl = snapshotUrl || (file ? URL.createObjectURL(file) : null);

  /* boxes + picked face */
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  /* result (current) */
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState<ResultRow | null>(null);

  /* results table */
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q) return rows;
    const s = q.toLowerCase();
    return rows.filter(
      (r) =>
        r.source.toLowerCase().includes(s) ||
        r.label.toLowerCase().includes(s) ||
        String(Math.round(r.confidence * 100)).includes(s)
    );
  }, [q, rows]);

  /* modal */
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ResultRow | null>(null);

  /* camera */
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [camReady, setCamReady] = useState(false);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.onloadedmetadata = () => setCamReady(true);
      }
    } catch {
      setCamReady(false);
    }
  };
  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCamReady(false);
    if (videoRef.current) videoRef.current.srcObject = null;
  };
  useEffect(() => {
    if (tab === "camera") startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const takeSnapshot = () => {
    const v = videoRef.current;
    if (!v) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0);
    const url = c.toDataURL("image/jpeg", 0.92);
    if (snapshotUrl) URL.revokeObjectURL(snapshotUrl);
    setSnapshotUrl(url);
    setFile(null);
    runFaceDetection(url, "Camera snapshot");
  };

  /* common pipeline: run face detection -> enable analyze */
  const runFaceDetection = async (url: string, _sourceReadable?: string) => {
    // mock on client — thay bằng API của bạn khi sẵn sàng
    await new Promise((r) => setTimeout(r, 350));
    const faces = Math.max(1, Math.round(Math.random() * 1) + 1);
    const arr: Box[] = Array.from({ length: faces }).map((_, i) => ({
      id: i + 1,
      x: 60 + i * 120,
      y: 60 + (i % 2) * 70,
      w: 140,
      h: 140,
    }));
    setBoxes(arr);
    setActiveId(arr[0]?.id ?? null);
  };

  const onFilePicked = (f: File) => {
    if (snapshotUrl) URL.revokeObjectURL(snapshotUrl);
    setSnapshotUrl(null);
    setFile(f);
    runFaceDetection(URL.createObjectURL(f), `${f.name} • ${formatBytes(f.size)}`);
  };

  /* analyze */
  const analyze = async () => {
    if (!sourceUrl) return;
    setLoading(true);
    const start = performance.now();

    // TODO: gọi API thật; phần dưới mock kết quả
    await new Promise((r) => setTimeout(r, 650));
    const latency = Math.round(performance.now() - start);
    const topK = [
      { label: "Happy", score: 0.61 },
      { label: "Neutral", score: 0.22 },
      { label: "Surprised", score: 0.09 },
    ];
    const row: ResultRow = {
      id: String(Date.now()),
      source:
        tab === "camera"
          ? "Camera snapshot"
          : file
          ? `${file.name} • ${formatBytes(file.size)}`
          : "Image",
      label: "Happy",
      confidence: 0.78,
      latency,
      topK,
      ts: Date.now(),
    };
    setCurrent(row);
    setRows((p) => [row, ...p]);
    setLoading(false);
  };

  const clearAllInputs = () => {
    if (snapshotUrl) URL.revokeObjectURL(snapshotUrl);
    setSnapshotUrl(null);
    setFile(null);
    setBoxes([]);
    setActiveId(null);
    setCurrent(null);
  };

  /* table actions */
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ results: rows }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vision_sentiment_results.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const exportCSV = () => {
    const header = ["index", "source", "label", "confidence", "latency", "time"];
    const body = rows.map((r, i) => [
      String(i + 1),
      r.source.replace(/"/g, '""'),
      r.label,
      String(Math.round(r.confidence * 100) + "%"),
      String(r.latency),
      new Date(r.ts).toLocaleString(),
    ]);
    const csv =
      [header, ...body]
        .map((line) => line.map((c) => `"${c}"`).join(","))
        .join("\n") + "\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vision_sentiment_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <AnimatedHeader />

      {/* ====== 4 PANELS (2x2), kích thước đồng đều & rộng hơn ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Upload / Camera */}
        <div className={cx(tokens.card, "p-6 min-h-[340px]")}>
          <div className="flex gap-2 mb-4">
            <button
              className={tokens.btn.tab}
              data-active={tab === "upload"}
              onClick={() => setTab("upload")}
            >
              Upload Image
            </button>
            <button
              className={tokens.btn.tab}
              data-active={tab === "camera"}
              onClick={() => setTab("camera")}
            >
              Camera Capture
            </button>
            <div className="ml-auto">
              <button className={tokens.btn.icon} onClick={clearAllInputs}>
                Clear
              </button>
            </div>
          </div>

          {tab === "upload" ? (
            <label className="block">
              <div className="w-full border-2 border-dashed border-sky-500/40 hover:border-sky-400/70 transition-colors rounded-2xl bg-slate-900/40 p-6 text-center cursor-pointer">
                <div className="text-sky-200 font-medium">
                  Drop image here or click to browse
                </div>
                <div className="mt-1 text-sm text-slate-400">
                  PNG, JPG, JPEG, BMP, TIFF • up to 25MB
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFilePicked(f);
                  }}
                />
              </div>
              {file && (
                <div className="mt-3 text-sm text-slate-300">
                  Selected: {file.name} • {formatBytes(file.size)}
                </div>
              )}
            </label>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-white/10">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-h-[260px] object-contain bg-slate-900"
                />
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button
                  className={tokens.btn.primary}
                  disabled={!camReady}
                  onClick={takeSnapshot}
                >
                  Snapshot
                </button>
                {stream ? (
                  <button className={tokens.btn.ghost} onClick={stopCamera}>
                    Turn Off Camera
                  </button>
                ) : (
                  <button className={tokens.btn.ghost} onClick={startCamera}>
                    Turn On Camera
                  </button>
                )}
                <div className="text-sm text-slate-400">
                  Căn mặt ở trung tâm khung hình, ánh sáng đều.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Panel 2: Preview */}
        <div className={cx(tokens.card, "p-6 min-h-[340px]")}>
          <div className="text-sm text-slate-400 mb-2">Preview</div>
          {sourceUrl ? (
            <ImagePreview
              sourceUrl={sourceUrl}
              boxes={boxes}
              activeId={activeId}
            />
          ) : (
            <div className="rounded-xl border border-white/10 bg-slate-900/40 min-h-[280px] grid place-items-center text-slate-400">
              Preview will appear here after you upload or take a snapshot.
            </div>
          )}
        </div>

        {/* Panel 3: Faces + Preprocess + Actions */}
        <div className={cx(tokens.card, "p-6 min-h-[340px]")}>
          <div className="text-slate-200 font-semibold mb-2">
            Detected faces
          </div>
          {boxes.length ? (
            <div className="flex gap-2 overflow-x-auto py-2">
              {boxes.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setActiveId(b.id)}
                  className={cx(
                    "min-w-[88px] h-[88px] rounded-xl border transition-colors",
                    activeId === b.id
                      ? "border-sky-400 ring-2 ring-sky-500/40"
                      : "border-white/10"
                  )}
                >
                  <div className="w-full h-full bg-slate-700/40 flex items-center justify-center text-slate-300 text-sm">
                    #{b.id}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-slate-400">No faces yet — upload or take a snapshot.</div>
          )}

          <div className="mt-6">
            <div className="text-sm text-slate-300 font-medium mb-2">Preprocess</div>
            <ul className="text-sm text-slate-400 grid gap-1">
              <li>✓ Face detection → draw bounding boxes</li>
              <li>✓ Grayscale + resize 224×224 preview</li>
            </ul>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              className={tokens.btn.primary}
              onClick={analyze}
              disabled={loading || !sourceUrl}
            >
              {loading ? "Analyzing…" : "Analyze"}
            </button>
            <button className={tokens.btn.ghost} onClick={clearAllInputs}>
              Clear
            </button>
          </div>
        </div>

        {/* Panel 4: Current Result (gauge + bars) */}
        <div className={cx(tokens.card, "p-6 min-h-[340px]")}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-sm uppercase tracking-widest text-slate-400">
                VISION SENTIMENT
              </div>
              <div
                className={cx(
                  "mt-1 text-3xl font-extrabold",
                  current?.label === "Happy"
                    ? "text-emerald-300"
                    : current?.label === "Angry"
                    ? "text-rose-300"
                    : "text-slate-200"
                )}
              >
                {current?.label ?? "—"}
              </div>
            </div>
            <div className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-slate-900/40 text-slate-300">
              {current?.latency ?? 0} ms
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Donut pct={Math.round((current?.confidence ?? 0) * 100)} />
            <div>
              <div className="text-xs text-slate-400 mb-2">Top-K Emotions</div>
              <div className="grid gap-2">
                {(current?.topK ?? []).map((t) => (
                  <div
                    key={t.label}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-200">{t.label}</span>
                      <span className="text-slate-400 text-sm">
                        {Math.round(t.score * 100)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-700/60 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-fuchsia-400"
                        style={{
                          width: `${Math.round(t.score * 100)}%`,
                          transition:
                            "width .6s cubic-bezier(.2,.9,.2,1)"
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {!current && (
                <div className="text-slate-400 text-sm mt-4">
                  Fair-Use: facial expression only — no sensitive attribute inference.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ====== RESULTS TABLE + search + 3 buttons bên phải ====== */}
      <div className="mt-8">
        {/* <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-sky-200">Analysis Results</h3>

          <div className="flex items-center gap-3 w-full max-w-xl">
            <div className="relative flex-1">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 rounded-xl bg-slate-900/60 border border-white/10 h-11 text-slate-200 focus:ring-2 focus:ring-sky-500/40 outline-none"
              />
              <svg
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <button className={tokens.btn.subtle} onClick={() => setRows([])}>
              Clear all
            </button>
            <button className={tokens.btn.subtle} onClick={exportJSON} disabled={!rows.length}>
              Export JSON
            </button>
            <button className={tokens.btn.subtle} onClick={exportCSV} disabled={!rows.length}>
              Export CSV
            </button>
          </div>
        </div> */}
        {/* Header + Toolbar */}
        <h3 className="text-xl font-bold text-sky-200 mb-3">Analysis Results</h3>
            <div className="flex items-center gap-3 mb-3">
            {/* SEARCH: full width */}
            <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
                className="flex-1 rounded-xl bg-slate-900/60 border border-white/10 px-3 h-10 text-slate-200 focus:ring-2 focus:ring-sky-500/40 outline-none"
            />
            {/* BUTTONS: bên phải */}
            <div className="flex items-center gap-2 shrink-0">
                <button className={tokens.btn.subtle} onClick={() => setRows([])}>
                    Clear all
                </button>
                <button className={tokens.btn.subtle} onClick={exportJSON} disabled={!rows.length}>
                    Export JSON
                </button>
                <button className={tokens.btn.subtle} onClick={exportCSV} disabled={!rows.length}>
                    Export CSV
                </button>
            </div>
        </div>


        <div className={cx(tokens.card, "overflow-hidden")}>
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-slate-300">
              <tr>
                <th className="text-left px-3 py-2 font-medium w-[60px]">#</th>
                <th className="text-left px-3 py-2 font-medium">Source</th>
                <th className="text-left px-3 py-2 font-medium">Label</th>
                <th className="text-left px-3 py-2 font-medium">Confidence</th>
                <th className="text-left px-3 py-2 font-medium">Latency</th>
                <th className="text-left px-3 py-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    No results yet.
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr
                    key={r.id}
                    onClick={() => {
                      setSelectedRow(r);
                      setOpen(true);
                    }}
                    className="hover:bg-white/5 cursor-pointer"
                    title="Click for detail"
                  >
                    <td className="px-3 py-2">{rows.indexOf(r) + 1}</td>
                    <td className="px-3 py-2 truncate max-w-[520px]" title={r.source}>
                      {r.source}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          r.label === "Happy"
                            ? "text-emerald-300"
                            : r.label === "Angry"
                            ? "text-rose-300"
                            : "text-slate-300"
                        }
                      >
                        {r.label}
                      </span>
                    </td>
                    <td className="px-3 py-2">{Math.round(r.confidence * 100)}%</td>
                    <td className="px-3 py-2">{r.latency} ms</td>
                    <td className="px-3 py-2">
                      {new Date(r.ts).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* modal detail */}
      <DetailModal open={open} onClose={() => setOpen(false)} row={selectedRow} />
    </div>
  );
}
