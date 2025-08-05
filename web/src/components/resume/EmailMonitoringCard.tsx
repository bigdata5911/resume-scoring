import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface EmailActivity {
  id: string;
  recipient_email: string;
  subject: string;
  status: string;
  sent_at?: string;
  created_at: string;
}

interface EmailConfig {
  id: string;
  email_address: string;
  smtp_host: string;
  is_active: boolean;
}

export default function EmailMonitoringCard() {
  const [emailConfigs, setEmailConfigs] = useState<EmailConfig[]>([]);
  const [recentEmails, setRecentEmails] = useState<EmailActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmailData = async () => {
      try {
        // Fetch email configurations
        const configResponse = await fetch("http://localhost:8000/api/email-configs/");
        if (configResponse.ok) {
          const configData = await configResponse.json();
          setEmailConfigs(configData);
        }

        // Fetch recent email activities
        const emailResponse = await fetch("http://localhost:8000/api/email-responses/");
        if (emailResponse.ok) {
          const emailData = await emailResponse.json();
          setRecentEmails(emailData.slice(0, 5)); // Show last 5 emails
        }
      } catch (error) {
        console.error("Error fetching email data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmailData();
    const interval = setInterval(fetchEmailData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
        return "text-success";
      case "pending":
        return "text-warning";
      case "failed":
        return "text-danger";
      default:
        return "text-meta-3";
    }
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
            Email Monitoring
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
          Email Monitoring
        </h4>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-success"></div>
            <span className="text-xs text-meta-3">Active</span>
          </div>
        </div>
      </div>

      {/* Email Configurations */}
      <div className="mb-6">
        <h5 className="mb-3 text-sm font-medium text-black dark:text-white">
          Email Configurations
        </h5>
        <div className="space-y-2">
          {emailConfigs.length === 0 ? (
            <div className="flex items-center justify-center py-4 text-meta-3">
              <Icon icon="mdi:email-outline" className="mr-2" />
              No email configurations
            </div>
          ) : (
            emailConfigs.map((config) => (
              <div
                key={config.id}
                className="flex items-center justify-between rounded-lg border border-stroke bg-gray-50 p-3 dark:border-strokedark dark:bg-boxdark-2"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      config.is_active ? "bg-success/10" : "bg-danger/10"
                    }`}
                  >
                    <Icon
                      icon="mdi:email"
                      className={config.is_active ? "text-success" : "text-danger"}
                      width={16}
                      height={16}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black dark:text-white">
                      {config.email_address}
                    </p>
                    <p className="text-xs text-meta-3">{config.smtp_host}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    config.is_active ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                  }`}
                >
                  {config.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Email Activities */}
      <div>
        <h5 className="mb-3 text-sm font-medium text-black dark:text-white">
          Recent Email Activities
        </h5>
        <div className="space-y-2">
          {recentEmails.length === 0 ? (
            <div className="flex items-center justify-center py-4 text-meta-3">
              <Icon icon="mdi:email-outline" className="mr-2" />
              No recent emails
            </div>
          ) : (
            recentEmails.map((email) => (
              <div
                key={email.id}
                className="flex items-center justify-between rounded-lg border border-stroke bg-gray-50 p-3 dark:border-strokedark dark:bg-boxdark-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black dark:text-white truncate">
                    {email.subject}
                  </p>
                  <p className="text-xs text-meta-3 truncate">{email.recipient_email}</p>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                      email.status
                    )}`}
                  >
                    {email.status}
                  </span>
                  <span className="text-xs text-meta-3">
                    {formatDate(email.created_at)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex items-center justify-between">
        <button className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          <Icon icon="mdi:plus" />
          Add Email Config
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          View All Emails
          <Icon icon="mdi:arrow-right" />
        </button>
      </div>
    </div>
  );
} 