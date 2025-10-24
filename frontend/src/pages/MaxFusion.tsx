import React, { useEffect, useRef, useState } from "react";

type ModelScore = { label: string; score: number; modality?: string };
type TimelineItem = { t: number; text?: ModelScore; audio?: ModelScore; vision?: ModelScore; fused?: ModelScore };

// design tokens similar to other pages
const tokens = {
    card: "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl p-6",
    title: "text-2xl md:text-3xl font-semibold tracking-tight text-sky-200",
    btn: {
        primary: "px-4 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-medium",
        ghost: "px-4 h-11 rounded-xl bg-slate-700/50 text-slate-100 border border-white/10",
    },
};

const cn = (...c: any[]) => c.filter(Boolean).join(" ");

// Small UI pieces used below
const Step = ({ idx, text, active, done }: { idx: number; text: string; active: boolean; done: boolean }) => (
    <div className="flex items-start gap-3">
        <div className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center text-sm border",
            done ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-200" : active ? "bg-sky-500/20 border-sky-400/40 text-sky-200" : "bg-white/5 border-white/10 text-slate-300"
        )}>{done ? "✓" : idx}</div>
        <div className={cn("text-slate-300", active && "text-sky-200", done && "text-emerald-200")}>{text}</div>
    </div>
);

const PipelineSteps = ({ stage }: { stage: number }) => {
    const labels = [
        "Extract frames (fps=5) & face‑crop",
        "Extract audio & preprocess",
        "ASR → transcript",
        "Inference: vision / audio / text",
        "Fusion → overall",
    ];
    return (
        <div className={tokens.card}>
            <h2 className="text-lg font-semibold text-sky-100 mb-4">Pipeline</h2>
            <div className="grid gap-3">
                {labels.map((t, i) => (
                    <Step key={i} idx={i + 1} text={t} active={stage === i} done={stage > i} />
                ))}
            </div>
        </div>
    );
};

const ModalityCard = ({ title, label, confidence }: { title: string; label?: string; confidence?: number }) => (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="text-slate-400 text-sm">{title}</div>
        <div className="text-xl font-semibold text-sky-200 mt-1">{label ?? "—"}</div>
        <div className="h-2 mt-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500" style={{ width: `${Math.round((confidence ?? 0) * 100)}%` }} />
        </div>
        <div className="text-xs text-slate-400 mt-1">{Math.round((confidence ?? 0) * 100)}%</div>
    </div>
);

const ResultPanel = ({ timeline, overall, textProg, audioProg, visionProg, overallProg }: { timeline: TimelineItem[]; overall: ModelScore | null; textProg?: number; audioProg?: number; visionProg?: number; overallProg?: number }) => {
    // derive a simple last-known per-modality summary from timeline
    const last = timeline.length ? timeline[timeline.length - 1] : null;
    const tProg = typeof textProg === 'number' ? textProg : Math.round((last?.text?.score ?? 0) * 100);
    const aProg = typeof audioProg === 'number' ? audioProg : Math.round((last?.audio?.score ?? 0) * 100);
    const vProg = typeof visionProg === 'number' ? visionProg : Math.round((last?.vision?.score ?? 0) * 100);
    const oProg = typeof overallProg === 'number' ? overallProg : Math.round((overall?.score ?? 0) * 100);
    return (
        <div className={tokens.card}>
            <h2 className="text-lg font-semibold text-sky-100 mb-4">Results</h2>
            <div className="grid md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-slate-400 text-sm">Text</div>
                    <div className="text-xl font-semibold text-sky-200 mt-1">{last?.text?.label ?? "—"}</div>
                    <div className="mt-2 h-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-[width] duration-500" style={{ width: `${tProg}%` }} />
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{Math.round(tProg)}%</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-slate-400 text-sm">Audio</div>
                    <div className="text-xl font-semibold text-sky-200 mt-1">{last?.audio?.label ?? "—"}</div>
                    <div className="mt-2 h-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-[width] duration-500" style={{ width: `${aProg}%` }} />
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{Math.round(aProg)}%</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-slate-400 text-sm">Vision</div>
                    <div className="text-xl font-semibold text-sky-200 mt-1">{last?.vision?.label ?? "—"}</div>
                    <div className="mt-2 h-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-[width] duration-500" style={{ width: `${vProg}%` }} />
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{Math.round(vProg)}%</div>
                </div>
            </div>
            <div className="mt-5">
                <div className="text-slate-400 text-sm">Fusion (overall)</div>
                <div className="text-2xl font-semibold text-emerald-300 mt-1">{overall?.label ?? "—"}</div>
                <div className="h-2 mt-2 rounded-full bg-slate-700/60 border border-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-[width] duration-500" style={{ width: `${oProg}%` }} />
                </div>
                <div className="text-xs text-slate-400 mt-1">{Math.round(oProg)}%</div>
            </div>
        </div>
    );
};


export default function MaxFusion() {
    const [tab, setTab] = useState<"upload" | "record">("upload");
    const [file, setFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [stage, setStage] = useState<number>(-1); // pipeline stage -1 idle, 0..4 running
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [overall, setOverall] = useState<ModelScore | null>(null);
    const [transcript, setTranscript] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    // animated progress bars for modalities
    const [textProg, setTextProg] = useState<number>(0);
    const [audioProg, setAudioProg] = useState<number>(0);
    const [visionProg, setVisionProg] = useState<number>(0);
    const [overallProg, setOverallProg] = useState<number>(0);
    const progressRef = useRef<any>(null);

    useEffect(() => {
        return () => {
            if (videoUrl) URL.revokeObjectURL(videoUrl);
            // stop any camera tracks if recording
            try {
                const s = videoRef.current?.srcObject as MediaStream | undefined;
                if (s) s.getTracks().forEach((t) => t.stop());
            } catch (e) { }
        };
    }, [videoUrl]);

    // auto play when videoUrl or stream assigned
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        try {
            // if live stream assigned, mute and play for autoplay
            if (v.srcObject) {
                v.muted = true;
                v.play().catch(() => { });
            } else if (videoUrl) {
                // for loaded file, ensure it can play
                v.muted = false;
                v.play().catch(() => { });
            }
        } catch (e) { }
    }, [videoUrl]);

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0] ?? null;
        if (!f) return;
        if (f.size > 50 * 1024 * 1024) {
            setError("File quá lớn (max 50MB).");
            return;
        }
        setFile(f);
        if (videoUrl) URL.revokeObjectURL(videoUrl);
        setVideoUrl(URL.createObjectURL(f));
        setError(null);
    }

    async function startRecording() {
        setError(null);
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError("Trình duyệt không hỗ trợ camera.");
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { width: 640, height: 480 } });
            if (videoRef.current) videoRef.current.srcObject = stream;
            const mr = new MediaRecorder(stream);
            recordedChunksRef.current = [];
            mr.ondataavailable = (ev) => {
                if (ev.data.size > 0) recordedChunksRef.current.push(ev.data);
            };
            mr.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
                const f = new File([blob], "recording.webm", { type: blob.type });
                setFile(f);
                if (videoUrl) URL.revokeObjectURL(videoUrl);
                setVideoUrl(URL.createObjectURL(blob));
                setIsRecording(false);
            };
            mediaRecorderRef.current = mr;
            mr.start();
            setIsRecording(true);
            setTimeout(() => {
                if (mr.state === "recording") mr.stop();
            }, 5000);
        } catch (e) {
            setError("Không thể truy cập camera/micro.");
        }
    }

    function stopRecording() {
        const mr = mediaRecorderRef.current;
        if (mr && mr.state === "recording") mr.stop();
        setIsRecording(false);
        try {
            const s = videoRef.current?.srcObject as MediaStream | undefined;
            if (s) s.getTracks().forEach((t) => t.stop());
        } catch (e) { }
    }

    async function analyze() {
        if (!file) {
            setError("Chưa có video để phân tích.");
            return;
        }
        setIsRunning(true);
        setError(null);
        setTimeline([]);
        setOverall(null);
        setStage(0);
        setTextProg(0); setAudioProg(0); setVisionProg(0); setOverallProg(0);
        try {
            // start a simulated progress animation while waiting for backend
            progressRef.current = setInterval(() => {
                setTextProg((p) => Math.min(95, p + Math.random() * 6));
                setAudioProg((p) => Math.min(95, p + Math.random() * 5));
                setVisionProg((p) => Math.min(95, p + Math.random() * 4));
                setOverallProg((p) => Math.min(95, p + Math.random() * 3));
            }, 300);

            // advance pipeline stages visually
            for (let s = 0; s < 5; s++) {
                setStage(s);
                // wait a bit per stage but allow fetch to run in parallel
                await new Promise((r) => setTimeout(r, 600 + Math.random() * 600));
            }

            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/analyze/video", { method: "POST", body: fd });
            if (!res.ok) {
                setError("Lỗi khi phân tích video.");
                setIsRunning(false);
                clearInterval(progressRef.current);
                setStage(-1);
                return;
            }
            const json = await res.json();
            // fill timeline and overall
            setTimeline(json.timeline ?? []);
            setOverall(json.overall ?? null);
            setTranscript(json.transcript ?? null);
            // set progress to final confidences with smooth animation
            const finalText = (json.overall?.by_modality?.text ?? json.timeline?.[json.timeline.length - 1]?.text?.score) ?? (json.timeline?.[0]?.text?.score ?? 0);
            const finalAudio = (json.overall?.by_modality?.audio ?? json.timeline?.[json.timeline.length - 1]?.audio?.score) ?? (json.timeline?.[0]?.audio?.score ?? 0);
            const finalVision = (json.overall?.by_modality?.vision ?? json.timeline?.[json.timeline.length - 1]?.vision?.score) ?? (json.timeline?.[0]?.vision?.score ?? 0);
            const finalOverall = (json.overall?.score ?? 0);
            // animate to final
            let t = 0;
            const anim = setInterval(() => {
                t += 1;
                setTextProg((p) => Math.min(100, p + (finalText * 100 - p) * 0.25 || 1));
                setAudioProg((p) => Math.min(100, p + (finalAudio * 100 - p) * 0.25 || 1));
                setVisionProg((p) => Math.min(100, p + (finalVision * 100 - p) * 0.25 || 1));
                setOverallProg((p) => Math.min(100, p + (finalOverall * 100 - p) * 0.25 || 1));
                if (t > 30) { clearInterval(anim); }
            }, 120);
        } catch (e) {
            setError("Kết nối gián đoạn.");
        } finally {
            clearInterval(progressRef.current);
            setStage(5);
            setIsRunning(false);
        }
    }

    // Demo mode: simulate a successful analysis locally without backend
    const runDemo = async () => {
        setIsRunning(true);
        setError(null);
        setTimeline([]);
        setOverall(null);
        setStage(0);
        setTextProg(0); setAudioProg(0); setVisionProg(0); setOverallProg(0);

        // simulate pipeline steps
        for (let s = 0; s < 5; s++) {
            setStage(s);
            await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
        }

        // mock final results
        const mockTimeline: TimelineItem[] = Array.from({ length: 12 }, (_, i) => ({
            t: i,
            text: { label: i % 3 === 0 ? 'Positive' : 'Neutral', score: 0.4 + 0.6 * Math.abs(Math.sin(i / 3)) },
            audio: { label: i % 4 === 0 ? 'Neutral' : 'Neutral', score: 0.3 + 0.5 * Math.abs(Math.cos(i / 4)) },
            vision: { label: i % 2 === 0 ? 'Happy' : 'Neutral', score: 0.45 + 0.45 * Math.abs(Math.sin(i / 2)) },
            fused: { label: i % 2 === 0 ? 'Happy' : 'Neutral', score: 0.5 + 0.35 * Math.abs(Math.sin(i / 2)) },
        }));

        const mockOverall: ModelScore = { label: 'Happy (Overall)', score: 0.78 };
        const mockTranscript = 'Demo transcript: Hello world, this is a demo.';

        // animate progress to mock final confidences
        setTimeline(mockTimeline);
        setOverall(mockOverall);
        setTranscript(mockTranscript);

        const finalText = Math.round((mockTimeline[mockTimeline.length - 1].text?.score ?? 0) * 100);
        const finalAudio = Math.round((mockTimeline[mockTimeline.length - 1].audio?.score ?? 0) * 100);
        const finalVision = Math.round((mockTimeline[mockTimeline.length - 1].vision?.score ?? 0) * 100);
        const finalOverall = Math.round((mockOverall.score ?? 0) * 100);

        let step = 0;
        const anim = setInterval(() => {
            step += 1;
            setTextProg((p) => Math.min(finalText, p + Math.max(1, (finalText - p) * 0.25)));
            setAudioProg((p) => Math.min(finalAudio, p + Math.max(1, (finalAudio - p) * 0.2)));
            setVisionProg((p) => Math.min(finalVision, p + Math.max(1, (finalVision - p) * 0.2)));
            setOverallProg((p) => Math.min(finalOverall, p + Math.max(1, (finalOverall - p) * 0.22)));
            if (step > 30) {
                clearInterval(anim);
                setStage(5);
                setIsRunning(false);
            }
        }, 120);
    };

    const clearAll = () => {
        if (videoUrl) URL.revokeObjectURL(videoUrl);
        setVideoUrl(null);
        setFile(null);
        setTimeline([]);
        setOverall(null);
        setTranscript(null);
        setError(null);
        setIsRecording(false);
        try {
            const s = videoRef.current?.srcObject as MediaStream | undefined;
            if (s) s.getTracks().forEach((t) => t.stop());
        } catch (e) { }
    };

    const exportJSON = () => {
        const data = { timeline, overall, transcript };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "maxfusion_results.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportCSV = () => {
        const header = ["t", "text_label", "text_score", "audio_label", "audio_score", "vision_label", "vision_score", "fused_label", "fused_score"];
        const rows = timeline.map((it) => [
            it.t,
            it.text?.label ?? "",
            (it.text?.score ?? ""),
            it.audio?.label ?? "",
            (it.audio?.score ?? ""),
            it.vision?.label ?? "",
            (it.vision?.score ?? ""),
            it.fused?.label ?? "",
            (it.fused?.score ?? "")
        ]);
        const csv = [header.join(","), ...rows.map(r => r.map(v => String(v).replace(/"/g, '""')).map(v => `"${v}"`).join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "maxfusion_timeline.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className={tokens.title}>Max Fusion (Video)</h1>
                <div className="flex items-center gap-2">
                    <button className={tokens.btn.ghost} onClick={clearAll}>Clear</button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className={tokens.card}>
                    <div className="flex gap-2 mb-4">
                        <button className={cn("px-4 h-10 rounded-xl", tab === 'upload' ? "bg-sky-500/20 text-sky-200" : "bg-white/5")} onClick={() => setTab('upload')}>Upload Video</button>
                        <button className={cn("px-4 h-10 rounded-xl", tab === 'record' ? "bg-sky-500/20 text-sky-200" : "bg-white/5")} onClick={() => setTab('record')}>Record Video</button>
                    </div>

                    {tab === 'upload' && (
                        <div className="space-y-4">
                            <label className="block">
                                <div className="w-full border-2 border-dashed border-slate-700/40 hover:border-sky-500/30 transition-colors rounded-2xl bg-slate-900/40 p-6 text-center cursor-pointer">
                                    <div className="text-sky-200 font-medium">Drop video here or click to browse</div>
                                    <div className="mt-1 text-sm text-slate-400">MP4, MOV, WEBM • up to 50MB</div>
                                    <input type="file" accept="video/*" className="hidden" onChange={onFileChange} />
                                </div>
                            </label>
                            {videoUrl && <div className="overflow-hidden rounded-xl border border-white/10"><video src={videoUrl} controls className="w-full max-h-[360px] bg-slate-900" ref={videoRef} /></div>}
                        </div>
                    )}

                    {tab === 'record' && (
                        <div>
                            <div className="flex gap-2 items-center">
                                {!isRecording ? (
                                    <button className={tokens.btn.primary} onClick={startRecording}>Record (5s)</button>
                                ) : (
                                    <button className={tokens.btn.ghost} onClick={stopRecording}>Stop</button>
                                )}
                            </div>
                            {videoUrl && <div className="overflow-hidden rounded-xl border border-white/10 mt-3"><video src={videoUrl} controls className="w-full max-h-[360px] bg-slate-900" ref={videoRef} /></div>}
                        </div>
                    )}

                    <div className="mt-6 flex gap-3 items-center">
                        <button className={tokens.btn.primary} onClick={analyze} disabled={isRunning || !file}>{isRunning ? 'Analyzing…' : 'Analyze'}</button>
                        <button className={tokens.btn.ghost} onClick={runDemo} disabled={isRunning} title="Run a local demo without calling the backend">Demo</button>
                        <button className={tokens.btn.ghost} onClick={clearAll}>Clear</button>
                    </div>

                    {error && <div className="mt-2 text-rose-400">{error}</div>}
                    {isRunning && <div className="mt-2 text-slate-300">Đang phân tích video...</div>}

                    {overall && (
                        <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                            <div className="text-slate-300 font-medium">Overall</div>
                            <div className="mt-2 flex items-center justify-between">
                                <div className="text-lg text-emerald-300">{overall.label}</div>
                                <div className="text-xs text-slate-400">{(overall.score ?? 0).toFixed(2)}</div>
                            </div>
                            {transcript && <div className="mt-2 text-sm text-slate-400">Transcript: <button className="underline" onClick={() => navigator.clipboard.writeText(transcript || "")}>Copy</button></div>}
                        </div>
                    )}
                </div>

                <PipelineSteps stage={stage} />

                <ResultPanel timeline={timeline} overall={overall} textProg={textProg} audioProg={audioProg} visionProg={visionProg} overallProg={overallProg} />
            </div>

            {timeline.length > 0 && (
                <div className="mt-6">
                    <div className={tokens.card}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="font-medium text-sky-200">Timeline</div>
                            <div className="flex gap-2">
                                <button className={tokens.btn.ghost} onClick={exportJSON}>Export JSON</button>
                                <button className={tokens.btn.ghost} onClick={exportCSV}>Export CSV</button>
                            </div>
                        </div>
                        <div className="mt-2 grid grid-cols-1 gap-2 max-h-56 overflow-auto">
                            {timeline.map((t, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-900/40 border border-white/5">
                                    <div className="text-xs text-slate-400">{t.t}s</div>
                                    <div className="flex gap-4 items-center">
                                        <div className="text-sm">{t.fused?.label ?? '-'}</div>
                                        <div className="text-xs text-slate-400">{(t.fused?.score ?? 0).toFixed(2)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
