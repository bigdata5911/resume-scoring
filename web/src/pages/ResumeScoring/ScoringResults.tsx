import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface ScoringResult {
  id: string;
  candidate_name: string;
  job_title: string;
  overall_score: number;
  technical_score: number;
  experience_score: number;
  education_score: number;
  skills_score: number;
  communication_score: number;
  recommendation: string;
  created_at: string;
  strengths?: string;
  weaknesses?: string;
  red_flags?: string;
}

export default function ScoringResults() {
  const [scoringResults, setScoringResults] = useState<ScoringResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [recommendationFilter, setRecommendationFilter] = useState("all");

  useEffect(() => {
    const fetchScoringResults = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/scoring-results/");
        if (response.ok) {
          const data = await response.json();
          setScoringResults(data);
        }
      } catch (error) {
        console.error("Error fetching scoring results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScoringResults();
  }, []);

  const filteredResults = scoringResults.filter((result) => {
    const matchesSearch = 
      result.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.job_title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesScore = scoreFilter === "all" || 
      (scoreFilter === "high" && result.overall_score >= 80) ||
      (scoreFilter === "medium" && result.overall_score >= 60 && result.overall_score < 80) ||
      (scoreFilter === "low" && result.overall_score < 60);
    
    const matchesRecommendation = recommendationFilter === "all" || 
      result.recommendation.toLowerCase().includes(recommendationFilter.toLowerCase());
    
    return matchesSearch && matchesScore && matchesRecommendation;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-danger";
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case "strongly recommend":
        return "bg-success/10 text-success";
      case "recommend":
        return "bg-primary/10 text-primary";
      case "consider":
        return "bg-warning/10 text-warning";
      case "not recommend":
        return "bg-danger/10 text-danger";
      default:
        return "bg-meta-3/10 text-meta-3";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const averageScore = scoringResults.length > 0 
    ? (scoringResults.reduce((sum, result) => sum + result.overall_score, 0) / scoringResults.length).toFixed(1)
    : "0";

  if (loading) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Scoring Results
        </h2>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-opacity-90">
          <Icon icon="mdi:download" />
          Export Results
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-white px-4 py-2 pl-10 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
            />
            <Icon
              icon="mdi:magnify"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-meta-3"
              width={20}
              height={20}
            />
          </div>
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            className="rounded-lg border border-stroke bg-white px-4 py-2 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
          >
            <option value="all">All Scores</option>
            <option value="high">High (80%+)</option>
            <option value="medium">Medium (60-79%)</option>
            <option value="low">Low (&lt;60%)</option>
          </select>
          <select
            value={recommendationFilter}
            onChange={(e) => setRecommendationFilter(e.target.value)}
            className="rounded-lg border border-stroke bg-white px-4 py-2 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
          >
            <option value="all">All Recommendations</option>
            <option value="strongly recommend">Strongly Recommend</option>
            <option value="recommend">Recommend</option>
            <option value="consider">Consider</option>
            <option value="not recommend">Not Recommend</option>
          </select>
        </div>
        <div className="text-sm text-meta-3">
          {filteredResults.length} of {scoringResults.length} results
        </div>
      </div>

      {/* Scoring Results */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-meta-3">
            <Icon icon="mdi:chart-line" className="mr-2" />
            No scoring results found
          </div>
        ) : (
          filteredResults.map((result) => (
            <div
              key={result.id}
              className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
                    {result.candidate_name}
                  </h3>
                  <p className="text-sm text-meta-3 mb-2">{result.job_title}</p>
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-bold ${getScoreColor(result.overall_score)}`}>
                      {result.overall_score}%
                    </span>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getRecommendationColor(
                        result.recommendation
                      )}`}
                    >
                      {result.recommendation}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-meta-3">{formatDate(result.created_at)}</p>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-xs text-meta-3 mb-1">Technical</p>
                  <p className={`font-medium ${getScoreColor(result.technical_score)}`}>
                    {result.technical_score}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-meta-3 mb-1">Experience</p>
                  <p className={`font-medium ${getScoreColor(result.experience_score)}`}>
                    {result.experience_score}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-meta-3 mb-1">Education</p>
                  <p className={`font-medium ${getScoreColor(result.education_score)}`}>
                    {result.education_score}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-meta-3 mb-1">Skills</p>
                  <p className={`font-medium ${getScoreColor(result.skills_score)}`}>
                    {result.skills_score}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-meta-3 mb-1">Communication</p>
                  <p className={`font-medium ${getScoreColor(result.communication_score)}`}>
                    {result.communication_score}%
                  </p>
                </div>
              </div>

              {/* Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {result.strengths && (
                  <div>
                    <p className="text-xs font-medium text-success mb-2">Strengths</p>
                    <p className="text-sm text-black dark:text-white">{result.strengths}</p>
                  </div>
                )}
                {result.weaknesses && (
                  <div>
                    <p className="text-xs font-medium text-warning mb-2">Areas for Improvement</p>
                    <p className="text-sm text-black dark:text-white">{result.weaknesses}</p>
                  </div>
                )}
                {result.red_flags && (
                  <div>
                    <p className="text-xs font-medium text-danger mb-2">Red Flags</p>
                    <p className="text-sm text-black dark:text-white">{result.red_flags}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-stroke dark:border-strokedark">
                <div className="flex items-center space-x-2">
                  <button className="hover:text-primary">
                    <Icon icon="mdi:eye" width={16} height={16} />
                  </button>
                  <button className="hover:text-primary">
                    <Icon icon="mdi:email" width={16} height={16} />
                  </button>
                  <button className="hover:text-primary">
                    <Icon icon="mdi:download" width={16} height={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {scoringResults.length}
              </h4>
              <p className="text-sm font-medium">Total Results</p>
            </div>
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-primary">
              <Icon icon="mdi:chart-line" className="text-white" width={24} height={24} />
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {averageScore}%
              </h4>
              <p className="text-sm font-medium">Average Score</p>
            </div>
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-success">
              <Icon icon="mdi:star" className="text-white" width={24} height={24} />
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {scoringResults.filter(r => r.overall_score >= 80).length}
              </h4>
              <p className="text-sm font-medium">High Scores</p>
            </div>
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-success">
              <Icon icon="mdi:check-circle" className="text-white" width={24} height={24} />
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {scoringResults.filter(r => r.recommendation.toLowerCase().includes("strongly recommend")).length}
              </h4>
              <p className="text-sm font-medium">Strongly Recommended</p>
            </div>
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-info">
              <Icon icon="mdi:thumb-up" className="text-white" width={24} height={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 