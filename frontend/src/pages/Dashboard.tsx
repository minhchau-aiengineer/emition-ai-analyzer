import { useEffect, useState } from 'react';
import { EmotionChart } from '../components/EmotionChart';
import { EmotionTimeline } from '../components/EmotionTimeline';
import { EmotionSummaryCard } from '../components/EmotionSummaryCard';
import { Analysis, AnalysisSummary, EmotionResult } from '../types/emotions';

// No backend available — generate mock data for Dashboard display
function generateMockData(): { analysis: Analysis; summary: AnalysisSummary; results: EmotionResult[] } {
  const emotions = ['happy', 'sad', 'angry', 'surprised', 'neutral', 'fearful', 'disgusted'];
  const id = crypto.randomUUID();
  const now = new Date();

  // Generate emotion results
  const results: EmotionResult[] = [];
  const emotionCounts: Record<string, number> = {};

  for (let i = 0; i < 20; i++) {
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;

    results.push({
      id: crypto.randomUUID(),
      analysis_id: id,
      timestamp: i * 0.5,
      emotion_type: emotion as any,
      confidence: 0.6 + Math.random() * 0.35,
      detection_type: Math.random() > 0.5 ? 'facial' : 'vocal',
      face_count: Math.floor(Math.random() * 3) + 1,
      created_at: new Date(now.getTime() - (20 - i) * 500).toISOString(),
    });
  }

  // Calculate emotion distribution
  const total = results.length;
  const distribution: Record<string, number> = {};
  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    distribution[emotion] = (count / total) * 100;
  });

  const dominantEmotion = Object.entries(emotionCounts).reduce((a, b) =>
    (a[1] > b[1] ? a : b))[0] as any;

  const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;

  const analysis: Analysis = {
    id,
    file_name: 'mock_analysis.mp4',
    file_type: 'video/mp4',
    file_url: '',
    status: 'completed',
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  const summary: AnalysisSummary = {
    id: crypto.randomUUID(),
    analysis_id: id,
    dominant_emotion: dominantEmotion,
    emotion_distribution: distribution,
    average_confidence: avgConfidence,
    total_frames_analyzed: results.length,
    duration: results[results.length - 1]?.timestamp || 0,
    created_at: now.toISOString(),
  };

  return { analysis, summary, results };
}

export default function Dashboard() {
  const [mockData, setMockData] = useState<{
    analysis: Analysis;
    summary: AnalysisSummary;
    results: EmotionResult[];
  } | null>(null);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setMockData(generateMockData());
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  if (!mockData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const { summary, results } = mockData;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analysis Results</h2>
        <button
          onClick={() => setMockData(generateMockData())}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          New Analysis
        </button>
      </div>

      <EmotionSummaryCard summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Emotion Distribution</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('pie')}
                className={`px-3 py-1 rounded text-sm ${chartType === 'pie' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
              >
                Pie
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 rounded text-sm ${chartType === 'bar' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
              >
                Bar
              </button>
            </div>
          </div>
          <EmotionChart
            emotionDistribution={summary.emotion_distribution}
            chartType={chartType}
          />
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
          <h3 className="text-xl font-bold mb-4">Emotion Timeline</h3>
          <EmotionTimeline emotionResults={results} />
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
        <h3 className="text-xl font-bold mb-4">Detection Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">Time</th>
                <th className="text-left py-3 px-4">Emotion</th>
                <th className="text-left py-3 px-4">Confidence</th>
                <th className="text-left py-3 px-4">Type</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 10).map((result) => (
                <tr key={result.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="py-3 px-4">{result.timestamp.toFixed(1)}s</td>
                  <td className="py-3 px-4 capitalize">{result.emotion_type}</td>
                  <td className="py-3 px-4">{(result.confidence * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4 capitalize">{result.detection_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
