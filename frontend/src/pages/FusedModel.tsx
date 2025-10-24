import React, { useState } from "react";

// ----- Utility -----
const cn = (...c: any[]) => c.filter(Boolean).join(" ");

const tokens = {
    card: "rounded-2xl bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xl p-6",
    title: "text-2xl md:text-3xl font-semibold tracking-tight text-sky-200",
    btn: {
        primary:
            "px-4 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-medium shadow-lg shadow-sky-900/20",
        ghost:
            "px-4 h-11 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-100 border border-white/10",
        icon:
            "inline-flex items-center gap-2 px-3 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200",
    },
};

const ResultCard = ({ result }: { result: any }) => {
    if (!result) return null;

    const getEmotionIcon = (label: string) => {
        switch (label.toLowerCase()) {
            case 'happy':
            case 'positive':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                        <line x1="9" y1="9" x2="9.01" y2="9" />
                        <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                );
            case 'neutral':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="8" y1="15" x2="16" y2="15" />
                        <line x1="9" y1="9" x2="9.01" y2="9" />
                        <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                );
            case 'sad':
            case 'negative':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 15s1.5 -2 4 -2 4 2 4 2" />
                        <line x1="9" y1="9" x2="9.01" y2="9" />
                        <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                );
            default:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="9" y1="9" x2="9.01" y2="9" />
                        <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                );
        }
    };

    const getEmotionColor = (label: string) => {
        switch (label.toLowerCase()) {
            case 'happy':
            case 'positive':
                return 'text-emerald-300';
            case 'neutral':
                return 'text-sky-300';
            case 'sad':
            case 'negative':
                return 'text-rose-300';
            default:
                return 'text-violet-300';
        }
    };

    return (
        <div className={cn(tokens.card, "mt-6")}>
            <div className="text-sm uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M7 14.25c2 2.25 4 2.25 6 0" />
                    <path d="M7 9h.01" />
                    <path d="M17 9h.01" />
                </svg>
                Fusion Results
            </div>

            <div className="mt-3 grid md:grid-cols-2 gap-4">
                {Object.entries(result.modalities).map(([mod, val]: any) => (
                    <div key={mod} className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-sky-500/30 transition-colors">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-sm capitalize">{mod}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-400 border border-white/5">
                                {Math.round(val.confidence * 100)}%
                            </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            {getEmotionIcon(val.label)}
                            <span className={cn("text-xl font-semibold", getEmotionColor(val.label))}>{val.label}</span>
                        </div>
                        <div className="mt-2 h-1.5 rounded-full bg-slate-950/50 border border-white/5 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500" style={{ width: `${Math.round(val.confidence * 100)}%` }} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="text-slate-400 text-sm mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    Fused Result
                </div>
                <div className="mt-2 flex items-center gap-3">
                    {getEmotionIcon(result.fusion.label)}
                    <span className={cn("text-2xl font-semibold", getEmotionColor(result.fusion.label))}>{result.fusion.label}</span>
                    <span className="text-sm px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-300 border border-white/5 ml-auto">
                        {Math.round(result.fusion.confidence * 100)}% confidence
                    </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-950/50 border border-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-sky-400" style={{ width: `${Math.round(result.fusion.confidence * 100)}%` }} />
                </div>
            </div>
        </div>
    );
};

const FusionSettings = ({
    strategy,
    setStrategy,
    weights,
    setWeights,
    temperature,
    setTemperature,
    result
}: {
    strategy: string;
    setStrategy: (s: string) => void;
    weights: number[];
    setWeights: (w: number[]) => void;
    temperature: number;
    setTemperature: (t: number) => void;
    result: any;
}) => {
    return (
        <div className={tokens.card}>
            <h2 className="text-lg font-semibold text-sky-100 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
                Fusion Settings
            </h2>
            <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
                    <div className="text-sm text-slate-300 mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
                            <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7-7H4a2 2 0 0 0-2 2v17Z" />
                            <path d="M15 8V1" />
                        </svg>
                        Strategy
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {['Weighted', 'Stacking', 'Rule-based'].map(s => (
                            <label key={s} className={cn(
                                "flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer transition-colors text-sm border whitespace-nowrap",
                                strategy === s
                                    ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                                    : "border-white/5 hover:border-white/10 text-slate-400 hover:text-slate-300"
                            )}>
                                <input
                                    type="radio"
                                    name="strategy"
                                    checked={strategy === s}
                                    onChange={() => {
                                        setStrategy(s);
                                        // Reset weights based on strategy
                                        if (s === 'Weighted') {
                                            setWeights([0.33, 0.33, 0.34]);
                                        } else if (s === 'Stacking') {
                                            setWeights([0.5, 0.3, 0.2]);
                                        } else {
                                            setWeights([0.4, 0.4, 0.2]);
                                        }
                                    }}
                                    className="hidden"
                                />
                                <span>{s}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
                    <div className="text-sm text-slate-300 mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                        </svg>
                        Weights
                    </div>
                    {['Text', 'Audio', 'Vision'].map((mod, i) => (
                        <div key={mod} className="flex items-center gap-3 mb-3 bg-slate-950/30 p-3 rounded-lg border border-white/5">
                            <span className="w-16 text-slate-300 text-sm font-medium">{mod}</span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={weights[i]}
                                onChange={(e) => {
                                    const newW = [...weights];
                                    newW[i] = parseFloat(e.target.value);
                                    setWeights(newW);
                                }}
                                className="flex-1 accent-sky-500"
                            />
                            <span className="text-slate-300 text-sm w-12 text-right tabular-nums">{weights[i].toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="flex gap-2 mt-4">
                        <button
                            className={cn(tokens.btn.ghost, "text-sm px-3 h-9 whitespace-nowrap")}
                            onClick={() => {
                                // Normalize weights to sum to 1
                                const sum = weights.reduce((a: number, b: number) => a + b, 0);
                                if (sum === 0) return;
                                const normalizedWeights = weights.map((w: number) => Number((w / sum).toFixed(2)));
                                // Ensure exact sum of 1 by adjusting last weight
                                const currentSum = normalizedWeights.reduce((a: number, b: number) => a + b, 0);
                                if (currentSum !== 1) {
                                    normalizedWeights[normalizedWeights.length - 1] = Number((normalizedWeights[normalizedWeights.length - 1] + (1 - currentSum)).toFixed(2));
                                }
                                setWeights(normalizedWeights);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                <path d="M3.29 7 12 12l8.71-5" />
                                <path d="M12 22V12" />
                            </svg>
                            Normalize (sum=1)
                        </button>
                        <button
                            className={cn(tokens.btn.ghost, "text-sm px-3 h-9 whitespace-nowrap")}
                            onClick={() => {
                                // Set weights based on the confidence scores of each modality
                                const confidenceScores = {
                                    text: result?.modalities?.text?.confidence || 0.33,
                                    audio: result?.modalities?.audio?.confidence || 0.33,
                                    vision: result?.modalities?.vision?.confidence || 0.34
                                } as const;

                                const total = Object.values(confidenceScores).reduce((a: number, b: number) => a + b, 0);
                                const newWeights = [
                                    Number((confidenceScores.text / total).toFixed(2)),
                                    Number((confidenceScores.audio / total).toFixed(2)),
                                    Number((confidenceScores.vision / total).toFixed(2))
                                ];

                                // Ensure sum is exactly 1
                                const weightSum = newWeights.reduce((a: number, b: number) => a + b, 0);
                                if (weightSum !== 1) {
                                    newWeights[newWeights.length - 1] = Number((newWeights[newWeights.length - 1] + (1 - weightSum)).toFixed(2));
                                }

                                setWeights(newWeights);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                            </svg>
                            Auto from confidence
                        </button>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
                    <div className="text-sm text-slate-300 mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
                            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                        </svg>
                        Temperature
                    </div>
                    <div className="flex gap-3 items-center">
                        <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            className="w-24 bg-slate-950/50 border border-white/5 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                        />
                        <span className="text-sm text-slate-400">Higher = more random</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputHub = ({ text, setText, audioFile, setAudioFile, imageFile, setImageFile }: any) => {
    return (
        <div className={tokens.card}>
            <h2 className="text-lg font-semibold text-sky-100 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24" />
                    <path d="M21 3v4h-4" />
                </svg>
                Input Hub
            </h2>
            <div className="grid gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-sky-500/30 transition-colors group">
                    <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
                            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 1 1 2.5 8.242" />
                            <path d="M12 12v9" />
                            <path d="m8 17 4 4 4-4" />
                        </svg>
                        Text Analysis
                    </div>
                    <textarea
                        placeholder="Paste text or use existing..."
                        className="w-full rounded-lg bg-slate-950/50 border border-white/5 px-3 py-2.5 text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/40 placeholder:text-slate-600"
                        rows={3}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-sky-500/30 transition-colors group">
                    <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
                            <path d="M12 2v20" />
                            <rect x="4" y="6" width="16" height="16" rx="2" />
                            <path d="M8 18v-7" />
                            <path d="M12 18v-3" />
                            <path d="M16 18v-5" />
                        </svg>
                        Audio Input
                    </div>
                    <label className="block w-full rounded-lg border-2 border-dashed border-slate-700/60 hover:border-sky-500/30 transition-colors p-4 text-center cursor-pointer group-hover:bg-slate-950/30">
                        <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} className="hidden" />
                        <div className="text-slate-400 text-sm">Drop audio file or click to browse</div>
                        {audioFile && (
                            <div className="mt-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm inline-flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                                    <circle cx="17" cy="7" r="5" />
                                </svg>
                                {audioFile.name}
                            </div>
                        )}
                    </label>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-sky-500/30 transition-colors group">
                    <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
                            <path d="M15 8h.01" />
                            <rect width="16" height="16" x="4" y="4" rx="3" />
                            <path d="M4 15l4-4a3 5 0 0 1 3 0l5 5" />
                            <path d="M14 14l1-1a3 5 0 0 1 3 0l2 2" />
                        </svg>
                        Vision Input
                    </div>
                    <label className="block w-full rounded-lg border-2 border-dashed border-slate-700/60 hover:border-sky-500/30 transition-colors p-4 text-center cursor-pointer group-hover:bg-slate-950/30">
                        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
                        <div className="text-slate-400 text-sm">Drop image or click to browse</div>
                        {imageFile && (
                            <div className="mt-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm inline-flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 8h.01" />
                                    <rect width="16" height="16" x="4" y="4" rx="3" />
                                </svg>
                                {imageFile.name}
                            </div>
                        )}
                    </label>
                </div>
            </div>
        </div>
    );
};

interface ModalityResult {
    confidence: number;
    label: string;
}

interface FusionResult {
    modalities: {
        text?: ModalityResult;
        audio?: ModalityResult;
        vision?: ModalityResult;
    };
    fusion: ModalityResult;
}

export default function FusedModelPage() {
    const [text, setText] = useState<string>("");
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [strategy, setStrategy] = useState<string>('Weighted');
    const [weights, setWeights] = useState<number[]>([0.33, 0.33, 0.34]);
    const [temperature, setTemperature] = useState<number>(1.0);

    const [result, setResult] = useState<FusionResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const runFusion = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 600));
        setResult({
            modalities: {
                text: { label: 'Positive', confidence: 0.7 },
                audio: { label: 'Neutral', confidence: 0.6 },
                vision: { label: 'Happy', confidence: 0.8 },
            },
            fusion: { label: 'Happy (Overall)', confidence: 0.85 },
        });
        setLoading(false);
    };

    const clearAll = () => {
        // Reset all state to initial values
        setText("");
        setAudioFile(null);
        setImageFile(null);
        setStrategy('Weighted');
        setWeights([0.33, 0.33, 0.34]);
        setTemperature(1.0);
        setResult(null);
        setLoading(false);

        // Reload the page to clear any cached data
        window.location.reload();
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className={tokens.title}>Fusion Model</h1>
                <button
                    className="text-sm text-slate-400 hover:text-slate-300 flex items-center gap-1"
                    onClick={clearAll}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12h18" />
                        <path d="M12 3v18" />
                    </svg>
                    Reset All
                </button>
            </div>

            {/* Top Grid - Input Hub and Fusion Settings */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Left Column - Input Hub */}
                <InputHub
                    text={text}
                    setText={setText}
                    audioFile={audioFile}
                    setAudioFile={setAudioFile}
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                />

                {/* Right Column - Fusion Settings */}
                <FusionSettings
                    strategy={strategy}
                    setStrategy={setStrategy}
                    weights={weights}
                    setWeights={setWeights}
                    temperature={temperature}
                    setTemperature={setTemperature}
                    result={result || { modalities: {}, fusion: { confidence: 0, label: '' } }}
                />
            </div>

            {/* Bottom Section - Results Card */}
            <div className={tokens.card}>
                <h2 className="text-lg font-semibold text-sky-100 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="M7 14.25c2 2.25 4 2.25 6 0" />
                        <path d="M7 9h.01" />
                        <path d="M17 9h.01" />
                    </svg>
                    Results
                </h2>

                <div className="space-y-4">
                    <button
                        className={cn(
                            tokens.btn.primary,
                            "w-full flex items-center justify-center gap-2",
                            loading && "bg-gradient-to-r from-sky-500/50 to-indigo-500/50"
                        )}
                        onClick={runFusion}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                                Running Fusion...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                Run Fusion
                            </>
                        )}
                    </button>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5">
                        <div className="text-sm text-slate-300 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                            Tips
                        </div>
                        <ul className="mt-2 space-y-1 text-sm text-slate-400">
                            <li>• Choose one or more input modalities</li>
                            <li>• Adjust fusion weights as needed</li>
                            <li>• Higher temperature = more random</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Results Card */}
            {result && <ResultCard result={result} />}
        </div>
    );
}
