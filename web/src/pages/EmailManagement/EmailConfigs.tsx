import React, { useState, useEffect } from 'react';
import PageMeta from '../../components/common/PageMeta';
import { emailApi, EmailConfig } from '../../services';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function EmailConfigs() {
  const [emailConfigs, setEmailConfigs] = useState<EmailConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmailConfigs();
  }, []);

  const fetchEmailConfigs = async () => {
    try {
      setLoading(true);
      const data = await emailApi.getEmailConfigs();
      setEmailConfigs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch email configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this email configuration?')) {
      try {
        await emailApi.deleteEmailConfig(id);
        setEmailConfigs(prev => prev.filter(config => config.id !== id));
      } catch (err: any) {
        setError(err.message || 'Failed to delete email configuration');
      }
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
        title="Email Configurations | Resume Scoring System"
        description="Manage email configurations for resume processing"
      />
      
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-bold text-black dark:text-white">
            Email Configurations
          </h2>
          <button className="inline-flex items-center justify-center rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
            Add New Configuration
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
                    Email Address
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Provider
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Status
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
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
                    <td colSpan={5} className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                      No email configurations found
                    </td>
                  </tr>
                ) : (
                  emailConfigs.map((config) => (
                    <tr key={config.id} className="border-b border-[#eee] dark:border-strokedark">
                      <td className="py-5 px-4">
                        <p className="text-black dark:text-white font-medium">
                          {config.email_address}
                        </p>
                      </td>
                      <td className="py-5 px-4">
                        <p className="text-black dark:text-white capitalize">
                          {config.email_provider}
                        </p>
                      </td>
                      <td className="py-5 px-4">
                        <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                          config.is_active 
                            ? 'bg-success text-success' 
                            : 'bg-danger text-danger'
                        }`}>
                          {config.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-5 px-4">
                        <p className="text-black dark:text-white">
                          {new Date(config.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-5 px-4">
                        <div className="flex items-center space-x-3.5">
                          <button className="hover:text-primary" title="Edit">
                            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.4941 11.9531 17.2129 11.6719 16.8754 11.6719Z" fill=""/>
                              <path d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.18438 13.7257 7.79063 13.4726 7.53752C13.2195 7.28438 12.8257 7.28438 12.5726 7.53752L9.64762 10.4063V2.1094C9.64762 1.77188 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74375 8.35387 2.1094V10.4063L5.42812 7.53752C5.175 7.28438 4.78125 7.28438 4.52812 7.53752C4.275 7.79063 4.275 8.18438 4.52812 8.43752L8.55074 12.3469Z" fill=""/>
                            </svg>
                          </button>
                          <button 
                            className="hover:text-danger" 
                            title="Delete"
                            onClick={() => handleDelete(config.id)}
                          >
                            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.4125L4.95039 6.2719H13.0785L12.6566 15.4125C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z" fill=""/>
                              <path d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z" fill=""/>
                              <path d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.6033 10.2657V13.3313C10.6033 13.6688 10.8846 13.9782 11.2502 13.9782C11.5877 13.9782 11.8971 13.6969 11.8971 13.3313V10.2657C11.8971 9.90004 11.5877 9.64692 11.2502 9.67504Z" fill=""/>
                              <path d="M6.7502 9.67504C6.38458 9.70317 6.10333 9.95629 6.10333 10.3219V13.3313C6.10333 13.6688 6.38458 13.9782 6.7502 13.9782C7.0877 13.9782 7.39708 13.6969 7.39708 13.3313V10.3219C7.39708 9.95629 7.0877 9.70317 6.7502 9.67504Z" fill=""/>
                            </svg>
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
      </div>
    </>
  );
} 