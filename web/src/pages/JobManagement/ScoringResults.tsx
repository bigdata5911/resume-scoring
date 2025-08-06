import React, { useState, useEffect } from 'react';
import PageMeta from '../../components/common/PageMeta';
import { jobApi, ScoringResult } from '../../services';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ScoringResults() {
  const [scoringResults, setScoringResults] = useState<ScoringResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScoringResults();
  }, []);

  const fetchScoringResults = async () => {
    try {
      setLoading(true);
      const data = await jobApi.getScoringResults();
      setScoringResults(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch scoring results');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'highly_recommended':
        return 'bg-success text-success';
      case 'recommended':
        return 'bg-info text-info';
      case 'consider':
        return 'bg-warning text-warning';
      case 'not_recommended':
        return 'bg-danger text-danger';
      default:
        return 'bg-gray-500 text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Scoring Results | Resume Scoring System"
        description="View scoring results for resume submissions"
      />
      
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-bold text-black dark:text-white">
            Scoring Results
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            {error}
          </div>
        )}

        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Total Score
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Job Match
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Experience
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Education
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Recommendation
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {scoringResults.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                      No scoring results found
                    </td>
                  </tr>
                ) : (
                  scoringResults.map((result) => (
                    <tr key={result.id} className="border-b border-[#eee] dark:border-strokedark">
                      <td className="py-5 px-4">
                        <div className="flex items-center">
                          <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                            <div 
                              className="h-2 bg-brand-500 rounded-full" 
                              style={{ width: `${result.total_score}%` }}
                            ></div>
                          </div>
                          <span className="text-black dark:text-white font-medium">
                            {result.total_score}%
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-4">
                        <p className="text-black dark:text-white">
                          {result.job_match_score}/30
                        </p>
                      </td>
                      <td className="py-5 px-4">
                        <p className="text-black dark:text-white">
                          {result.experience_score}/25
                        </p>
                      </td>
                      <td className="py-5 px-4">
                        <p className="text-black dark:text-white">
                          {result.education_score}/15
                        </p>
                      </td>
                      <td className="py-5 px-4">
                        <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getRecommendationColor(result.recommendation)}`}>
                          {result.recommendation.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-5 px-4">
                        <p className="text-black dark:text-white">
                          {new Date(result.created_at).toLocaleDateString()}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
} 