import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface Submission {
  id: string;
  candidate_name: string;
  candidate_email: string;
  job_title: string;
  status: string;
  score?: number;
  created_at: string;
  file_type: string;
}

export default function RecentSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/resume-submissions/");
        if (response.ok) {
          const data = await response.json();
          setSubmissions(data.slice(0, 10)); // Show last 10 submissions
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
    const interval = setInterval(fetchSubmissions, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-success";
      case "processing":
        return "text-warning";
      case "pending":
        return "text-meta-3";
      case "failed":
        return "text-danger";
      default:
        return "text-meta-3";
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "text-meta-3";
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-danger";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex items-center justify-between">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Recent Submissions
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
          Recent Submissions
        </h4>
        <button className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          View All
          <Icon icon="mdi:arrow-right" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {submissions.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-meta-3">
            <Icon icon="mdi:file-document-outline" className="mr-2" />
            No submissions yet
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between rounded-lg border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-boxdark-2"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon
                      icon={
                        submission.file_type === "pdf"
                          ? "mdi:file-pdf-box"
                          : "mdi:file-word-box"
                      }
                      className="text-primary"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div>
                    <h5 className="font-medium text-black dark:text-white">
                      {submission.candidate_name}
                    </h5>
                    <p className="text-sm text-meta-3">{submission.candidate_email}</p>
                    <p className="text-xs text-meta-3">{submission.job_title}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {submission.score && (
                    <div className="text-right">
                      <span
                        className={`text-sm font-medium ${getScoreColor(submission.score)}`}
                      >
                        {submission.score}%
                      </span>
                    </div>
                  )}
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                        submission.status
                      )}`}
                    >
                      {submission.status}
                    </span>
                    <p className="text-xs text-meta-3 mt-1">
                      {formatDate(submission.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 