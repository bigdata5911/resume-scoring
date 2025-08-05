import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface Metric {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
  color: string;
}

export default function ResumeMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      title: "Total Submissions",
      value: "0",
      change: "0%",
      changeType: "neutral",
      icon: "mdi:file-document-multiple",
      color: "bg-primary",
    },
    {
      title: "Processing Queue",
      value: "0",
      change: "0%",
      changeType: "neutral",
      icon: "mdi:clock-outline",
      color: "bg-warning",
    },
    {
      title: "Average Score",
      value: "0%",
      change: "0%",
      changeType: "neutral",
      icon: "mdi:chart-line",
      color: "bg-success",
    },
    {
      title: "Email Responses",
      value: "0",
      change: "0%",
      changeType: "neutral",
      icon: "mdi:email-outline",
      color: "bg-info",
    },
  ]);

  useEffect(() => {
    // Fetch metrics from API
    const fetchMetrics = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/dashboard/metrics");
        if (response.ok) {
          const data = await response.json();
          setMetrics([
            {
              title: "Total Submissions",
              value: data.totalSubmissions?.toString() || "0",
              change: `${data.submissionsChange || 0}%`,
              changeType: (data.submissionsChange || 0) >= 0 ? "positive" : "negative",
              icon: "mdi:file-document-multiple",
              color: "bg-primary",
            },
            {
              title: "Processing Queue",
              value: data.processingQueue?.toString() || "0",
              change: `${data.queueChange || 0}%`,
              changeType: (data.queueChange || 0) >= 0 ? "positive" : "negative",
              icon: "mdi:clock-outline",
              color: "bg-warning",
            },
            {
              title: "Average Score",
              value: `${data.averageScore || 0}%`,
              change: `${data.scoreChange || 0}%`,
              changeType: (data.scoreChange || 0) >= 0 ? "positive" : "negative",
              icon: "mdi:chart-line",
              color: "bg-success",
            },
            {
              title: "Email Responses",
              value: data.emailResponses?.toString() || "0",
              change: `${data.emailChange || 0}%`,
              changeType: (data.emailChange || 0) >= 0 ? "positive" : "negative",
              icon: "mdi:email-outline",
              color: "bg-info",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="flex flex-col gap-4.5 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {metric.value}
              </h4>
              <p className="text-sm font-medium">{metric.title}</p>
            </div>
            <div
              className={`flex h-11.5 w-11.5 items-center justify-center rounded-full ${metric.color}`}
            >
              <Icon icon={metric.icon} className="text-white" width={24} height={24} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                metric.changeType === "positive"
                  ? "text-success"
                  : metric.changeType === "negative"
                  ? "text-danger"
                  : "text-meta-3"
              }`}
            >
              {metric.changeType === "positive" && <Icon icon="mdi:trending-up" />}
              {metric.changeType === "negative" && <Icon icon="mdi:trending-down" />}
              {metric.changeType === "neutral" && <Icon icon="mdi:minus" />}
              {metric.change}
            </span>
            <span className="text-xs text-meta-3">vs last month</span>
          </div>
        </div>
      ))}
    </div>
  );
} 