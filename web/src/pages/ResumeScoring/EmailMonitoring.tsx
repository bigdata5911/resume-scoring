import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface EmailConfig {
  id: string;
  email_address: string;
  smtp_host: string;
  smtp_port: number;
  is_active: boolean;
  created_at: string;
}

interface EmailResponse {
  id: string;
  recipient_email: string;
  subject: string;
  status: string;
  sent_at?: string;
  created_at: string;
}

export default function EmailMonitoring() {
  const [emailConfigs, setEmailConfigs] = useState<EmailConfig[]>([]);
  const [emailResponses, setEmailResponses] = useState<EmailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("configs");

  useEffect(() => {
    const fetchEmailData = async () => {
      try {
        // Fetch email configurations
        const configResponse = await fetch("http://localhost:8000/api/email-configs/");
        if (configResponse.ok) {
          const configData = await configResponse.json();
          setEmailConfigs(configData);
        }

        // Fetch email responses
        const responseResponse = await fetch("http://localhost:8000/api/email-responses/");
        if (responseResponse.ok) {
          const responseData = await responseResponse.json();
          setEmailResponses(responseData);
        }
      } catch (error) {
        console.error("Error fetching email data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmailData();
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
          Email Monitoring
        </h2>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-opacity-90">
          <Icon icon="mdi:plus" />
          Add Email Config
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-stroke dark:border-strokedark">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("configs")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "configs"
                ? "border-primary text-primary"
                : "border-transparent text-meta-3 hover:text-black dark:hover:text-white"
            }`}
          >
            Email Configurations
          </button>
          <button
            onClick={() => setActiveTab("responses")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "responses"
                ? "border-primary text-primary"
                : "border-transparent text-meta-3 hover:text-black dark:hover:text-white"
            }`}
          >
            Email Responses
          </button>
        </div>
      </div>

      {/* Email Configurations Tab */}
      {activeTab === "configs" && (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Email Address
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    SMTP Host
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Port
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Status
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Created
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {emailConfigs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-meta-3">
                      No email configurations found
                    </td>
                  </tr>
                ) : (
                  emailConfigs.map((config) => (
                    <tr key={config.id} className="border-b border-[#eee] dark:border-strokedark">
                      <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
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
                          <span className="font-medium text-black dark:text-white">
                            {config.email_address}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-4">
                        <p className="text-black dark:text-white">{config.smtp_host}</p>
                      </td>
                      <td className="py-5 px-4">
                        <p className="text-black dark:text-white">{config.smtp_port}</p>
                      </td>
                      <td className="py-5 px-4">
                        <span
                          className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
                            config.is_active
                              ? "bg-success/10 text-success"
                              : "bg-danger/10 text-danger"
                          }`}
                        >
                          {config.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-5 px-4">
                        <p className="text-sm text-meta-3">{formatDate(config.created_at)}</p>
                      </td>
                      <td className="py-5 px-4">
                        <div className="flex items-center space-x-3.5">
                          <button className="hover:text-primary">
                            <Icon icon="mdi:test-tube" width={20} height={20} />
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
        </div>
      )}

      {/* Email Responses Tab */}
      {activeTab === "responses" && (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Recipient
                  </th>
                  <th className="min-w-[300px] py-4 px-4 font-medium text-black dark:text-white">
                    Subject
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Status
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Sent At
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Created
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {emailResponses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-meta-3">
                      No email responses found
                    </td>
                  </tr>
                ) : (
                  emailResponses.map((response) => (
                    <tr key={response.id} className="border-b border-[#eee] dark:border-strokedark">
                      <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <p className="font-medium text-black dark:text-white">
                          {response.recipient_email}
                        </p>
                      </td>
                      <td className="py-5 px-4">
                        <p className="text-black dark:text-white truncate max-w-xs">
                          {response.subject}
                        </p>
                      </td>
                      <td className="py-5 px-4">
                        <span
                          className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${getStatusColor(
                            response.status
                          )}`}
                        >
                          {response.status}
                        </span>
                      </td>
                      <td className="py-5 px-4">
                        {response.sent_at ? (
                          <p className="text-sm text-meta-3">{formatDate(response.sent_at)}</p>
                        ) : (
                          <span className="text-meta-3">-</span>
                        )}
                      </td>
                      <td className="py-5 px-4">
                        <p className="text-sm text-meta-3">{formatDate(response.created_at)}</p>
                      </td>
                      <td className="py-5 px-4">
                        <div className="flex items-center space-x-3.5">
                          <button className="hover:text-primary">
                            <Icon icon="mdi:eye" width={20} height={20} />
                          </button>
                          <button className="hover:text-warning">
                            <Icon icon="mdi:refresh" width={20} height={20} />
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
        </div>
      )}

      {/* Email Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {emailConfigs.length}
              </h4>
              <p className="text-sm font-medium">Email Configs</p>
            </div>
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-primary">
              <Icon icon="mdi:email" className="text-white" width={24} height={24} />
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {emailResponses.length}
              </h4>
              <p className="text-sm font-medium">Total Emails</p>
            </div>
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-success">
              <Icon icon="mdi:email-outline" className="text-white" width={24} height={24} />
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {emailResponses.filter(r => r.status === "sent").length}
              </h4>
              <p className="text-sm font-medium">Sent Successfully</p>
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
                {emailResponses.filter(r => r.status === "failed").length}
              </h4>
              <p className="text-sm font-medium">Failed</p>
            </div>
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-danger">
              <Icon icon="mdi:close-circle" className="text-white" width={24} height={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 