import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface ProcessingData {
  date: string;
  submissions: number;
  processed: number;
  failed: number;
}

export default function ResumeProcessingChart() {
  const [processingData, setProcessingData] = useState<ProcessingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProcessingData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/dashboard/processing-stats");
        if (response.ok) {
          const data = await response.json();
          setProcessingData(data);
        } else {
          // Mock data for demonstration
          const mockData: ProcessingData[] = [
            { date: "2024-01-01", submissions: 15, processed: 12, failed: 3 },
            { date: "2024-01-02", submissions: 22, processed: 20, failed: 2 },
            { date: "2024-01-03", submissions: 18, processed: 17, failed: 1 },
            { date: "2024-01-04", submissions: 25, processed: 23, failed: 2 },
            { date: "2024-01-05", submissions: 30, processed: 28, failed: 2 },
            { date: "2024-01-06", submissions: 28, processed: 26, failed: 2 },
            { date: "2024-01-07", submissions: 35, processed: 32, failed: 3 },
          ];
          setProcessingData(mockData);
        }
      } catch (error) {
        console.error("Error fetching processing data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessingData();
  }, []);

  const totalSubmissions = processingData.reduce((sum, item) => sum + item.submissions, 0);
  const totalProcessed = processingData.reduce((sum, item) => sum + item.processed, 0);
  const totalFailed = processingData.reduce((sum, item) => sum + item.failed, 0);
  const successRate = totalSubmissions > 0 ? ((totalProcessed / totalSubmissions) * 100).toFixed(1) : "0";

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex items-center justify-between">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Resume Processing
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
          Resume Processing
        </h4>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-success"></div>
            <span className="text-xs text-meta-3">Success Rate: {successRate}%</span>
          </div>
        </div>
      </div>

      {/* Processing Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mx-auto mb-2">
            <Icon icon="mdi:file-document-multiple" className="text-primary" width={24} height={24} />
          </div>
          <h5 className="text-lg font-bold text-black dark:text-white">{totalSubmissions}</h5>
          <p className="text-xs text-meta-3">Total Submissions</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-success/10 mx-auto mb-2">
            <Icon icon="mdi:check-circle" className="text-success" width={24} height={24} />
          </div>
          <h5 className="text-lg font-bold text-black dark:text-white">{totalProcessed}</h5>
          <p className="text-xs text-meta-3">Processed</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-danger/10 mx-auto mb-2">
            <Icon icon="mdi:close-circle" className="text-danger" width={24} height={24} />
          </div>
          <h5 className="text-lg font-bold text-black dark:text-white">{totalFailed}</h5>
          <p className="text-xs text-meta-3">Failed</p>
        </div>
      </div>

      {/* Processing Chart */}
      <div className="space-y-4">
        <h5 className="text-sm font-medium text-black dark:text-white">Daily Processing</h5>
        <div className="space-y-3">
          {processingData.slice(-7).map((item, index) => {
            const successRate = item.submissions > 0 ? (item.processed / item.submissions) * 100 : 0;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-meta-3">{new Date(item.date).toLocaleDateString()}</span>
                  <span className="text-meta-3">{item.submissions} submissions</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-success h-2 rounded-full"
                    style={{ width: `${successRate}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-success">{item.processed} processed</span>
                  <span className="text-danger">{item.failed} failed</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex items-center justify-between">
        <button className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          <Icon icon="mdi:chart-line" />
          View Detailed Stats
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          Export Report
          <Icon icon="mdi:download" />
        </button>
      </div>
    </div>
  );
} 