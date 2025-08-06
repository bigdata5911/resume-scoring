import React, { useState, useEffect } from 'react';
import PageMeta from '../../components/common/PageMeta';
import { jobApi, ResumeSubmission } from '../../services';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ResumeSubmissions() {
  const [resumeSubmissions, setResumeSubmissions] = useState<ResumeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResumeSubmissions();
  }, []);

  const fetchResumeSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching resume submissions...');
      const data = await jobApi.getResumeSubmissions();
      console.log('Resume submissions data:', data);
      setResumeSubmissions(data);
    } catch (err: any) {
      console.error('Error fetching resume submissions:', err);
      setError(err.message || 'Failed to fetch resume submissions');
    } finally {
      setLoading(false);
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
        title="Resume Submissions | Resume Scoring System"
        description="Manage resume submissions for scoring"
      />
      
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-bold text-black dark:text-white">
            Resume Submissions
          </h2>
          <button className="inline-flex items-center justify-center rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            Upload Resume
          </button>
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
                    Candidate
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Position
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Status
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {resumeSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                      No resume submissions found
                    </td>
                  </tr>
                ) : (
                  resumeSubmissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-[#eee] dark:border-strokedark">
                      <td className="py-5 px-4">
                        <h5 className="font-medium text-black dark:text-white">
                          {submission.candidate_name || 'Unknown'}
                        </h5>
                        <p className="text-sm text-meta-3 dark:text-meta-3">
                          {submission.candidate_email}
                        </p>
                      </td>
                      <td className="py-5 px-4">
                        <p className="text-black dark:text-white">
                          {submission.position_applied || 'Not specified'}
                        </p>
                      </td>
                      <td className="py-5 px-4">
                        <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                          submission.status === 'completed' 
                            ? 'bg-success text-success' 
                            : submission.status === 'pending'
                            ? 'bg-warning text-warning'
                            : 'bg-danger text-danger'
                        }`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className="py-5 px-4">
                        <p className="text-black dark:text-white">
                          {new Date(submission.created_at).toLocaleDateString()}
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