import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface SystemStatus {
  component: string;
  status: "healthy" | "warning" | "error" | "offline";
  responseTime?: number;
  lastCheck: string;
  message?: string;
}

export default function SystemHealthCard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([
    {
      component: "API Server",
      status: "offline",
      lastCheck: new Date().toISOString(),
    },
    {
      component: "Database",
      status: "offline",
      lastCheck: new Date().toISOString(),
    },
    {
      component: "Redis",
      status: "offline",
      lastCheck: new Date().toISOString(),
    },
    {
      component: "Email Service",
      status: "offline",
      lastCheck: new Date().toISOString(),
    },
  ]);

  useEffect(() => {
    const checkSystemHealth = async () => {
      const newStatus: SystemStatus[] = [];

      // Check API Server
      try {
        const startTime = Date.now();
        const response = await fetch("http://localhost:8000/health");
        const responseTime = Date.now() - startTime;
        
        newStatus.push({
          component: "API Server",
          status: response.ok ? "healthy" : "error",
          responseTime,
          lastCheck: new Date().toISOString(),
          message: response.ok ? "API is responding" : "API is not responding",
        });
      } catch (error) {
        newStatus.push({
          component: "API Server",
          status: "offline",
          lastCheck: new Date().toISOString(),
          message: "Cannot connect to API server",
        });
      }

      // Check Database (via API)
      try {
        const startTime = Date.now();
        const response = await fetch("http://localhost:8000/api/health/database");
        const responseTime = Date.now() - startTime;
        
        newStatus.push({
          component: "Database",
          status: response.ok ? "healthy" : "error",
          responseTime,
          lastCheck: new Date().toISOString(),
          message: response.ok ? "Database is connected" : "Database connection failed",
        });
      } catch (error) {
        newStatus.push({
          component: "Database",
          status: "offline",
          lastCheck: new Date().toISOString(),
          message: "Cannot check database status",
        });
      }

      // Check Redis (via API)
      try {
        const startTime = Date.now();
        const response = await fetch("http://localhost:8000/api/health/redis");
        const responseTime = Date.now() - startTime;
        
        newStatus.push({
          component: "Redis",
          status: response.ok ? "healthy" : "error",
          responseTime,
          lastCheck: new Date().toISOString(),
          message: response.ok ? "Redis is connected" : "Redis connection failed",
        });
      } catch (error) {
        newStatus.push({
          component: "Redis",
          status: "offline",
          lastCheck: new Date().toISOString(),
          message: "Cannot check Redis status",
        });
      }

      // Check Email Service (via API)
      try {
        const startTime = Date.now();
        const response = await fetch("http://localhost:8000/api/health/email");
        const responseTime = Date.now() - startTime;
        
        newStatus.push({
          component: "Email Service",
          status: response.ok ? "healthy" : "warning",
          responseTime,
          lastCheck: new Date().toISOString(),
          message: response.ok ? "Email service is ready" : "Email service has issues",
        });
      } catch (error) {
        newStatus.push({
          component: "Email Service",
          status: "offline",
          lastCheck: new Date().toISOString(),
          message: "Cannot check email service status",
        });
      }

      setSystemStatus(newStatus);
    };

    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-success";
      case "warning":
        return "text-warning";
      case "error":
        return "text-danger";
      case "offline":
        return "text-meta-3";
      default:
        return "text-meta-3";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return "mdi:check-circle";
      case "warning":
        return "mdi:alert-circle";
      case "error":
        return "mdi:close-circle";
      case "offline":
        return "mdi:circle-outline";
      default:
        return "mdi:circle-outline";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-success/10";
      case "warning":
        return "bg-warning/10";
      case "error":
        return "bg-danger/10";
      case "offline":
        return "bg-meta-3/10";
      default:
        return "bg-meta-3/10";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const overallStatus = systemStatus.every((s) => s.status === "healthy")
    ? "healthy"
    : systemStatus.some((s) => s.status === "error" || s.status === "offline")
    ? "error"
    : "warning";

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex items-center justify-between">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          System Health
        </h4>
        <div className="flex items-center gap-2">
          <div
            className={`flex h-3 w-3 rounded-full ${getStatusBg(overallStatus)}`}
          ></div>
          <span className={`text-sm font-medium ${getStatusColor(overallStatus)}`}>
            {overallStatus === "healthy" && "All Systems Operational"}
            {overallStatus === "warning" && "Some Issues Detected"}
            {overallStatus === "error" && "Critical Issues"}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {systemStatus.map((status, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-boxdark-2"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${getStatusBg(
                  status.status
                )}`}
              >
                <Icon
                  icon={getStatusIcon(status.status)}
                  className={getStatusColor(status.status)}
                  width={20}
                  height={20}
                />
              </div>
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {status.component}
                </h5>
                <p className="text-xs text-meta-3">{status.message}</p>
              </div>
            </div>

            <div className="text-right">
              {status.responseTime && (
                <p className="text-xs text-meta-3">
                  {status.responseTime}ms
                </p>
              )}
              <p className="text-xs text-meta-3">
                {formatDate(status.lastCheck)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex items-center justify-between">
        <button className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          <Icon icon="mdi:refresh" />
          Refresh Status
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          View Logs
          <Icon icon="mdi:arrow-right" />
        </button>
      </div>
    </div>
  );
} 