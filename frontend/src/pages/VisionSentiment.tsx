import React, { useEffect, useRef, useState } from "react";
import { ModelScore } from "../types/model";

// ---------------- Design tokens ----------------
const tokens = {
    card: "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl",
    title: "text-2xl md:text-3xl font-semibold tracking-tight text-sky-200",
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

function cn(...c: Array<any>) { return c.filter(Boolean).join(" "); }

// ---------------- Helpers ----------------
function drawBoxes(ctx: CanvasRenderingContext2D, boxes: Array<{ x: number, y: number, w: number, h: number }>, scale = 1) {
    ctx.save();
    ctx.strokeStyle = "#22d3ee"; // sky-400
    ctx.lineWidth = 2;
    boxes.forEach(b => {
        ctx.strokeRect(b.x * scale, b.y * scale, b.w * scale, b.h * scale);
    });
    ctx.restore();
}

// ---------------- Image Preview with boxes ----------------
const ImagePreview: React.FC<{
    file: File | null;
    snapshot: string | null;
    boxes: Array<{ id: number, x: number, y: number, w: number, h: number }>;
    activeId: number | null;
    onPick?: (id: number) => void;
}> = ({ file, snapshot, boxes, activeId, onPick }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const sourceUrl = snapshot || (file ? URL.createObjectURL(file) : null);

    useEffect(() => {
        if (!sourceUrl) { setImg(null); return; }
        const i = new Image();
        i.onload = () => setImg(i);
        i.src = sourceUrl;
        return () => { if (file) URL.revokeObjectURL(sourceUrl); };
    }, [sourceUrl, file]);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas || !img) return;
        const dpr = window.devicePixelRatio || 1;
        const maxW = 720; // responsive cap
        const ratio = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + "px"; canvas.style.height = h + "px";
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.scale(dpr, dpr);
        ctx.drawImage(img, 0, 0, w, h);
        // draw boxes
        if (boxes?.length) {
            drawBoxes(ctx, boxes.map((b) => ({ ...b })), ratio);
            // active box highlight
            const act = boxes.find(b => b.id === activeId);
            if (act) {
                ctx.save();
                ctx.strokeStyle = "#a78bfa"; // violet-400
                ctx.lineWidth = 3;
                ctx.strokeRect(act.x * ratio, act.y * ratio, act.w * ratio, act.h * ratio);
                ctx.restore();
            }
        }
    }, [img, boxes, activeId]);

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Create a temporary link
        const link = document.createElement('a');
        link.download = 'vision-sentiment-capture.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-3">
            <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 flex justify-center">
                <canvas ref={canvasRef} />
            </div>
            {sourceUrl && (
                <div className="flex justify-end">
                    <button className={tokens.btn.icon} onClick={downloadImage}>
                        Download Image
                    </button>
                </div>
            )}
        </div>
    );
};

// ---------------- Camera Capture ----------------
const CameraCapture: React.FC<{
    onShot: (blob: Blob) => void;
}> = ({ onShot }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [ready, setReady] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(s);
            if (videoRef.current) {
                videoRef.current.srcObject = s;
                videoRef.current.onloadedmetadata = () => setReady(true);
            }
        } catch (e) {
            setReady(false);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setReady(false);
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const takeShot = () => {
        const v = videoRef.current; if (!v) return;
        const canvas = document.createElement('canvas');
        const w = v.videoWidth; const h = v.videoHeight;
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(v, 0, 0);
        canvas.toBlob((blob) => blob && onShot(blob), 'image/jpeg', 0.92);
    };

    return (
        <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-white/10">
                <video ref={videoRef} autoPlay playsInline className="w-full max-h-[360px] object-contain bg-slate-900" />
            </div>
            <div className="flex gap-3">
                {stream ? (
                    <>
                        <button className={tokens.btn.primary} disabled={!ready} onClick={takeShot}>Snapshot</button>
                        <button className={tokens.btn.ghost} onClick={stopCamera}>Turn Off Camera</button>
                    </>
                ) : (
                    <button className={tokens.btn.primary} onClick={startCamera}>Turn On Camera</button>
                )}
                <div className="text-sm text-slate-400">Căn mặt ở trung tâm khung hình, ánh sáng đều.</div>
            </div>
        </div>
    );
};

// ---------------- Result Card ----------------
const ResultCard: React.FC<{
    label?: string;
    confidence?: number;
    topK?: Array<{ label: string; score: number }>;
    latencyMs?: number;
}> = ({ label, confidence, topK, latencyMs }) => {
    const confPct = Math.round((confidence ?? 0) * 100);
    const tone = label === 'Happy' ? 'text-emerald-300' : label === 'Angry' ? 'text-rose-300' : 'text-slate-300';
    return (
        <div className={cn(tokens.card, 'p-5 md:p-6')}>
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm uppercase tracking-widest text-slate-400">Vision Sentiment</div>
                    <div className={cn('mt-1 text-2xl font-semibold', tone)}>{label ?? '—'}</div>
                </div>
                {typeof latencyMs === 'number' && (
                    <div className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-slate-900/40 text-slate-300">{latencyMs} ms</div>
                )}
            </div>
            <div className="mt-4">
                <div className="text-xs text-slate-400 mb-1">Confidence</div>
                <div className="h-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
                    <div className="h-full" style={{ width: `${confPct}%`, background: 'linear-gradient(90deg,#22d3ee,#6366f1)' }} />
                </div>
                <div className="mt-1 text-xs text-slate-400">{confPct}%</div>
            </div>
            {topK?.length ? (
                <div className="mt-5">
                    <div className="text-xs text-slate-400 mb-2">Top‑K Emotions</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {topK.map((e, i) => (
                            <div key={i} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                <span className="text-slate-200">{e.label}</span>
                                <span className="text-slate-400 text-sm">{Math.round(e.score * 100)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
            <div className="mt-5 text-[13px] text-slate-400">Fair‑Use: chỉ dự đoán cảm xúc khuôn mặt, không suy luận thuộc tính nhạy cảm.</div>
        </div>
    );
};

// ---------------- Thumbnails of faces ----------------
const FaceStrip: React.FC<{
    boxes: Array<{ id: number, x: number, y: number, w: number, h: number }>;
    activeId: number | null;
    onPick: (id: number) => void;
}> = ({ boxes, activeId, onPick }) => (
    <div className="flex gap-2 overflow-x-auto py-2">
        {boxes?.map((b) => (
            <button
                key={b.id}
                onClick={() => onPick(b.id)}
                className={cn('min-w-[84px] h-[84px] rounded-xl border', activeId === b.id ? 'border-sky-400 ring-2 ring-sky-500/40' : 'border-white/10')}
                title={`Face ${b.id}`}
            >
                <div className="w-full h-full bg-slate-700/40 flex items-center justify-center text-slate-300 text-sm">#{b.id}</div>
            </button>
        ))}
    </div>
);

// ---------------- Main Page ----------------
const VisionSentimentPage: React.FC = () => {
    const [key, setKey] = useState(Date.now());
    const [tab, setTab] = useState<'upload' | 'camera'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

    const [boxes, setBoxes] = useState<Array<{ id: number, x: number, y: number, w: number, h: number }>>([]);
    const [activeId, setActiveId] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ label: string; confidence: number; topK: { label: string; score: number }[]; latency: number } | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    // mock face detection on client (placeholder). Replace with real API call.
    const detectFaces = async (blobOrFile: Blob) => {
        setNotice(null);
        // Simulate 1–3 faces with random boxes
        await new Promise(r => setTimeout(r, 350));
        const faces = Math.max(1, Math.round(Math.random() * 2) + 1);
        const arr = Array.from({ length: faces }).map((_, i) => ({ id: i + 1, x: 80 + i * 120, y: 60 + (i % 2) * 50, w: 120, h: 120 }));
        setBoxes(arr);
        setActiveId(arr[0]?.id ?? null);
    };

    const handleSnapshot = (blob: Blob) => {
        if (snapshotUrl) URL.revokeObjectURL(snapshotUrl);
        const url = URL.createObjectURL(blob);
        setSnapshotUrl(url);
        setFile(null);
        detectFaces(blob);
    };

    const handleFile = (f: File) => {
        setFile(f); if (snapshotUrl) { URL.revokeObjectURL(snapshotUrl); setSnapshotUrl(null); }
        detectFaces(f);
    };

    const analyze = async () => {
        if (!file && !snapshotUrl) return;
        setLoading(true); setResult(null);
        const start = performance.now();
        await new Promise(r => setTimeout(r, 650));
        const latency = Math.round(performance.now() - start);
        const topK = [{ label: 'Happy', score: 0.61 }, { label: 'Neutral', score: 0.22 }, { label: 'Surprised', score: 0.09 }];
        setResult({ label: 'Happy', confidence: 0.78, topK, latency });
        setLoading(false);
    };

    const clearAll = () => {
        setFile(null);
        if (snapshotUrl) URL.revokeObjectURL(snapshotUrl);
        setSnapshotUrl(null);
        setBoxes([]); setActiveId(null);
        setResult(null); setNotice(null);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className={tokens.title}>Vision Sentiment</h1>
                <button
                    className={cn(tokens.btn.icon, "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-400/30")}
                    onClick={() => {
                        clearAll();
                        setTab('upload');
                        setKey(Date.now()); // Force re-mount component
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    New Analysis
                </button>
            </div>

            {/* Input Card */}
            <div key={key} className={cn(tokens.card, 'p-5 md:p-6')}>
                <div className="flex gap-2 mb-4">
                    <button className={tokens.btn.tab} data-active={tab === 'upload'} onClick={() => setTab('upload')}>Upload Image</button>
                    <button className={tokens.btn.tab} data-active={tab === 'camera'} onClick={() => setTab('camera')}>Camera Capture</button>
                </div>

                {tab === 'upload' && (
                    <div className="space-y-4">
                        <label className="block">
                            <div className="w-full border-2 border-dashed border-sky-500/40 hover:border-sky-400/70 transition-colors rounded-2xl bg-slate-900/40 p-6 text-center cursor-pointer">
                                <div className="text-sky-200 font-medium">Drop image here or click to browse</div>
                                <div className="mt-1 text-sm text-slate-400">PNG, JPG, JPEG, BMP, TIFF • up to 25MB</div>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                            </div>
                        </label>
                        {file && (
                            <div className="text-sm text-slate-300">Selected: {file.name}</div>
                        )}
                    </div>
                )}

                {tab === 'camera' && (
                    <CameraCapture onShot={handleSnapshot} />
                )}

                {/* Preview with boxes */}
                <div className="mt-6">
                    <div className="text-sm text-slate-400 mb-2">Preview</div>
                    <ImagePreview file={file} snapshot={snapshotUrl} boxes={boxes} activeId={activeId} />
                    {!!boxes.length && (
                        <div className="mt-3">
                            <div className="text-sm text-slate-400 mb-2">Detected faces</div>
                            <FaceStrip boxes={boxes} activeId={activeId} onPick={setActiveId} />
                        </div>
                    )}
                </div>

                {/* Preprocess */}
                <div className="mt-6">
                    <div className="text-sm text-slate-300 font-medium mb-2">Preprocess</div>
                    <ul className="text-sm text-slate-400 grid gap-1">
                        <li>✓ Face detection → draw bounding boxes</li>
                        <li>✓ Grayscale + resize 224×224 preview</li>
                    </ul>
                    {!boxes.length && (
                        <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200 text-sm">
                            Không phát hiện khuôn mặt? Hãy tăng ánh sáng, nhìn thẳng, bỏ vật che khuôn mặt.
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                    <button className={tokens.btn.primary} onClick={analyze} disabled={loading || (!file && !snapshotUrl)}>
                        {loading ? 'Analyzing…' : 'Analyze'}
                    </button>
                    <button className={tokens.btn.ghost} onClick={clearAll}>Clear</button>
                </div>
            </div>

            {/* Result */}
            {result && (
                <div className="mt-6">
                    <ResultCard label={result.label} confidence={result.confidence} topK={result.topK} latencyMs={result.latency} />
                </div>
            )}
        </div>
    );
};

export default VisionSentimentPage;

