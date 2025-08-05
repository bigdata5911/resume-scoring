import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface JobDescription {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  location: string;
  salary_range: string;
  is_active: boolean;
  created_at: string;
  keywords?: string[];
}

export default function JobDescriptions() {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchJobDescriptions = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/job-descriptions/");
        if (response.ok) {
          const data = await response.json();
          setJobDescriptions(data);
        }
      } catch (error) {
        console.error("Error fetching job descriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDescriptions();
  }, []);

  const filteredJobs = jobDescriptions.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || job.is_active === (statusFilter === "active");
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
          Job Descriptions
        </h2>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-opacity-90">
          <Icon icon="mdi:plus" />
          Add Job Description
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="text-sm text-meta-3">
          {filteredJobs.length} of {jobDescriptions.length} jobs
        </div>
      </div>

      {/* Job Descriptions Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-8 text-meta-3">
            <Icon icon="mdi:briefcase-outline" className="mr-2" />
            No job descriptions found
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-meta-3 mb-2">{job.company}</p>
                  <div className="flex items-center gap-2 text-xs text-meta-3">
                    <Icon icon="mdi:map-marker" />
                    <span>{job.location}</span>
                    {job.salary_range && (
                      <>
                        <span>•</span>
                        <span>{job.salary_range}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      job.is_active
                        ? "bg-success/10 text-success"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {job.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-black dark:text-white line-clamp-3">
                  {job.description}
                </p>
              </div>

              {job.keywords && job.keywords.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-meta-3 mb-2">Keywords:</p>
                  <div className="flex flex-wrap gap-1">
                    {job.keywords.slice(0, 5).map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                      >
                        {keyword}
                      </span>
                    ))}
                    {job.keywords.length > 5 && (
                      <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs text-meta-3">
                        +{job.keywords.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-meta-3">
                  Created {formatDate(job.created_at)}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="hover:text-primary">
                    <Icon icon="mdi:eye" width={16} height={16} />
                  </button>
                  <button className="hover:text-primary">
                    <Icon icon="mdi:pencil" width={16} height={16} />
                  </button>
                  <button className="hover:text-danger">
                    <Icon icon="mdi:delete" width={16} height={16} />
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
                {jobDescriptions.length}
              </h4>
              <p className="text-sm font-medium">Total Jobs</p>
            </div>
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-primary">
              <Icon icon="mdi:briefcase" className="text-white" width={24} height={24} />
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {jobDescriptions.filter(job => job.is_active).length}
              </h4>
              <p className="text-sm font-medium">Active Jobs</p>
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
                {jobDescriptions.filter(job => !job.is_active).length}
              </h4>
              <p className="text-sm font-medium">Inactive Jobs</p>
            </div>
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-warning">
              <Icon icon="mdi:pause-circle" className="text-white" width={24} height={24} />
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {jobDescriptions.filter(job => job.keywords && job.keywords.length > 0).length}
              </h4>
              <p className="text-sm font-medium">With Keywords</p>
            </div>
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-info">
              <Icon icon="mdi:tag" className="text-white" width={24} height={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 