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
  file_size: number;
}

export default function ResumeSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/resume-submissions/");
        if (response.ok) {
          const data = await response.json();
          setSubmissions(data);
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch = 
      submission.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.candidate_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.job_title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
          Resume Submissions
        </h2>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-opacity-90">
          <Icon icon="mdi:plus" />
          Add Submission
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search submissions..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-stroke bg-white px-4 py-2 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div className="text-sm text-meta-3">
          {filteredSubmissions.length} of {submissions.length} submissions
        </div>
      </div>

      {/* Submissions Table */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Candidate
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Job Title
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Score
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  File
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Date
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-meta-3">
                    No submissions found
                  </td>
                </tr>
              ) : (
                paginatedSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-b border-[#eee] dark:border-strokedark">
                    <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <div>
                        <h5 className="font-medium text-black dark:text-white">
                          {submission.candidate_name}
                        </h5>
                        <p className="text-sm text-meta-3">{submission.candidate_email}</p>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-black dark:text-white">{submission.job_title}</p>
                    </td>
                    <td className="py-5 px-4">
                      <span
                        className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${getStatusColor(
                          submission.status
                        )}`}
                      >
                        {submission.status}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      {submission.score ? (
                        <span className={`font-medium ${getScoreColor(submission.score)}`}>
                          {submission.score}%
                        </span>
                      ) : (
                        <span className="text-meta-3">-</span>
                      )}
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-2">
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
                        <span className="text-sm text-meta-3">
                          {formatFileSize(submission.file_size)}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-sm text-meta-3">{formatDate(submission.created_at)}</p>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center space-x-3.5">
                        <button className="hover:text-primary">
                          <Icon icon="mdi:eye" width={20} height={20} />
                        </button>
                        <button className="hover:text-primary">
                          <Icon icon="mdi:pencil" width={20} height={20} />
                        </button>
                        <button className="hover:text-danger">
                          <Icon icon="mdi:delete" width={20} height={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-stroke py-4 px-4 dark:border-strokedark">
            <div className="text-sm text-meta-3">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredSubmissions.length)} of{" "}
              {filteredSubmissions.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-lg border border-stroke px-3 py-2 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 dark:border-strokedark dark:text-white dark:hover:bg-boxdark-2"
              >
                <Icon icon="mdi:chevron-left" />
                Previous
              </button>
              <span className="px-3 py-2 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-lg border border-stroke px-3 py-2 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 dark:border-strokedark dark:text-white dark:hover:bg-boxdark-2"
              >
                Next
                <Icon icon="mdi:chevron-right" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 