import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface ScoringData {
  score_range: string;
  count: number;
  percentage: number;
}

interface ScoreTrend {
  date: string;
  average_score: number;
  total_submissions: number;
}

export default function ScoringStatisticsChart() {
  const [scoringData, setScoringData] = useState<ScoringData[]>([]);
  const [scoreTrends, setScoreTrends] = useState<ScoreTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScoringData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/dashboard/scoring-stats");
        if (response.ok) {
          const data = await response.json();
          setScoringData(data.distribution || []);
          setScoreTrends(data.trends || []);
        } else {
          // Mock data for demonstration
          const mockScoringData: ScoringData[] = [
            { score_range: "90-100", count: 15, percentage: 15 },
            { score_range: "80-89", count: 25, percentage: 25 },
            { score_range: "70-79", count: 30, percentage: 30 },
            { score_range: "60-69", count: 20, percentage: 20 },
            { score_range: "0-59", count: 10, percentage: 10 },
          ];
          const mockTrends: ScoreTrend[] = [
            { date: "2024-01-01", average_score: 78.5, total_submissions: 12 },
            { date: "2024-01-02", average_score: 82.3, total_submissions: 18 },
            { date: "2024-01-03", average_score: 79.8, total_submissions: 15 },
            { date: "2024-01-04", average_score: 85.2, total_submissions: 22 },
            { date: "2024-01-05", average_score: 81.7, total_submissions: 19 },
            { date: "2024-01-06", average_score: 83.9, total_submissions: 25 },
            { date: "2024-01-07", average_score: 87.1, total_submissions: 28 },
          ];
          setScoringData(mockScoringData);
          setScoreTrends(mockTrends);
        }
      } catch (error) {
        console.error("Error fetching scoring data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScoringData();
  }, []);

  const getScoreColor = (scoreRange: string) => {
    const score = parseInt(scoreRange.split("-")[0]);
    if (score >= 90) return "bg-success";
    if (score >= 80) return "bg-primary";
    if (score >= 70) return "bg-warning";
    if (score >= 60) return "bg-orange-500";
    return "bg-danger";
  };

  const averageScore = scoreTrends.length > 0 
    ? (scoreTrends.reduce((sum, item) => sum + item.average_score, 0) / scoreTrends.length).toFixed(1)
    : "0";

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex items-center justify-between">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Scoring Statistics
          </h4>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex items-center justify-between">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Scoring Statistics
        </h4>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Icon icon="mdi:chart-line" className="text-primary" />
            <span className="text-xs text-meta-3">Avg Score: {averageScore}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <div>
          <h5 className="mb-4 text-sm font-medium text-black dark:text-white">Score Distribution</h5>
          <div className="space-y-3">
            {scoringData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-black dark:text-white">{item.score_range}%</span>
                  <span className="text-meta-3">{item.count} resumes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div
                    className={`h-3 rounded-full ${getScoreColor(item.score_range)}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-meta-3">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Trends */}
        <div>
          <h5 className="mb-4 text-sm font-medium text-black dark:text-white">Score Trends</h5>
          <div className="space-y-3">
            {scoreTrends.slice(-7).map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-stroke bg-gray-50 dark:border-strokedark dark:bg-boxdark-2">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Icon icon="mdi:chart-line" className="text-primary" width={16} height={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black dark:text-white">
                      {new Date(trend.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-meta-3">{trend.total_submissions} submissions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-black dark:text-white">
                    {trend.average_score.toFixed(1)}%
                  </p>
                  <p className="text-xs text-meta-3">avg score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-lg border border-stroke bg-gray-50 dark:border-strokedark dark:bg-boxdark-2">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-success/10 mx-auto mb-2">
            <Icon icon="mdi:star" className="text-success" width={20} height={20} />
          </div>
          <h5 className="text-lg font-bold text-black dark:text-white">
            {scoringData.filter(item => parseInt(item.score_range.split("-")[0]) >= 80).reduce((sum, item) => sum + item.count, 0)}
          </h5>
          <p className="text-xs text-meta-3">High Scores (80%+)</p>
        </div>
        <div className="text-center p-4 rounded-lg border border-stroke bg-gray-50 dark:border-strokedark dark:bg-boxdark-2">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-warning/10 mx-auto mb-2">
            <Icon icon="mdi:chart-line" className="text-warning" width={20} height={20} />
          </div>
          <h5 className="text-lg font-bold text-black dark:text-white">{averageScore}%</h5>
          <p className="text-xs text-meta-3">Average Score</p>
        </div>
        <div className="text-center p-4 rounded-lg border border-stroke bg-gray-50 dark:border-strokedark dark:bg-boxdark-2">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mx-auto mb-2">
            <Icon icon="mdi:file-document-multiple" className="text-primary" width={20} height={20} />
          </div>
          <h5 className="text-lg font-bold text-black dark:text-white">
            {scoringData.reduce((sum, item) => sum + item.count, 0)}
          </h5>
          <p className="text-xs text-meta-3">Total Scored</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex items-center justify-between">
        <button className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          <Icon icon="mdi:chart-bar" />
          Detailed Analysis
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          Export Data
          <Icon icon="mdi:download" />
        </button>
      </div>
    </div>
  );
} 