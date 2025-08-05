import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface AuditLog {
  id: string;
  user_email?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details?: any;
  ip_address?: string;
  created_at: string;
}

export default function SystemLogs() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/audit-logs/");
        if (response.ok) {
          const data = await response.json();
          setAuditLogs(data);
        }
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.user_email && log.user_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.resource_type && log.resource_type.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAction = actionFilter === "all" || log.action.toLowerCase().includes(actionFilter.toLowerCase());
    
    const matchesTime = timeFilter === "all" || 
      (timeFilter === "today" && isToday(new Date(log.created_at))) ||
      (timeFilter === "week" && isThisWeek(new Date(log.created_at))) ||
      (timeFilter === "month" && isThisMonth(new Date(log.created_at)));
    
    return matchesSearch && matchesAction && matchesTime;
  });

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isThisWeek = (date: Date) => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo;
  };

  const isThisMonth = (date: Date) => {
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  const getActionColor = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes("create") || actionLower.includes("add")) return "text-success";
    if (actionLower.includes("update") || actionLower.includes("edit")) return "text-warning";
    if (actionLower.includes("delete") || actionLower.includes("remove")) return "text-danger";
    if (actionLower.includes("login") || actionLower.includes("auth")) return "text-primary";
    return "text-meta-3";
  };

  const getActionIcon = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes("create") || actionLower.includes("add")) return "mdi:plus-circle";
    if (actionLower.includes("update") || actionLower.includes("edit")) return "mdi:pencil-circle";
    if (actionLower.includes("delete") || actionLower.includes("remove")) return "mdi:delete-circle";
    if (actionLower.includes("login") || actionLower.includes("auth")) return "mdi:login";
    if (actionLower.includes("upload")) return "mdi:upload";
    if (actionLower.includes("download")) return "mdi:download";
    if (actionLower.includes("email")) return "mdi:email";
    return "mdi:information";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
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
          System Logs
        </h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-stroke px-4 py-2 text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-boxdark-2">
            <Icon icon="mdi:refresh" />
            Refresh
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-opacity-90">
            <Icon icon="mdi:download" />
            Export Logs
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search logs..."
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
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-lg border border-stroke bg-white px-4 py-2 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
          >
            <option value="all">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
            <option value="upload">Upload</option>
            <option value="email">Email</option>
          </select>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="rounded-lg border border-stroke bg-white px-4 py-2 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        <div className="text-sm text-meta-3">
          {filteredLogs.length} of {auditLogs.length} logs
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Time
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  User
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Action
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Resource
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  IP Address
                </th>
                <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-meta-3">
                    No logs found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-[#eee] dark:border-strokedark">
                    <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <p className="text-sm text-meta-3">{formatDate(log.created_at)}</p>
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-sm text-black dark:text-white">
                        {log.user_email || "System"}
                      </p>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon={getActionIcon(log.action)}
                          className={getActionColor(log.action)}
                          width={16}
                          height={16}
                        />
                        <span className={`text-sm font-medium ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      {log.resource_type ? (
                        <div>
                          <p className="text-sm text-black dark:text-white capitalize">
                            {log.resource_type}
                          </p>
                          {log.resource_id && (
                            <p className="text-xs text-meta-3">{log.resource_id}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-meta-3">-</span>
                      )}
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-sm text-meta-3">{log.ip_address || "-"}</p>
                    </td>
                    <td className="py-5 px-4">
                      {log.details ? (
                        <div className="max-w-xs">
                          <p className="text-sm text-black dark:text-white truncate">
                            {typeof log.details === "string" 
                              ? log.details 
                              : JSON.stringify(log.details)
                            }
                          </p>
                        </div>
                      ) : (
                        <span className="text-meta-3">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {auditLogs.length}
              </h4>
              <p className="text-sm font-medium">Total Logs</p>
            </div>
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-primary">
              <Icon icon="mdi:file-document" className="text-white" width={24} height={24} />
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {auditLogs.filter(log => log.action.toLowerCase().includes("login")).length}
              </h4>
              <p className="text-sm font-medium">Login Events</p>
            </div>
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-success">
              <Icon icon="mdi:login" className="text-white" width={24} height={24} />
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {auditLogs.filter(log => log.action.toLowerCase().includes("upload")).length}
              </h4>
              <p className="text-sm font-medium">Upload Events</p>
            </div>
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-warning">
              <Icon icon="mdi:upload" className="text-white" width={24} height={24} />
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {auditLogs.filter(log => log.action.toLowerCase().includes("delete")).length}
              </h4>
              <p className="text-sm font-medium">Delete Events</p>
            </div>
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-danger">
              <Icon icon="mdi:delete" className="text-white" width={24} height={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 