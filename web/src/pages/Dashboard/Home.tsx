import { useAuth } from "../../context/AuthContext";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <>
      <PageMeta
        title="Dashboard | Resume Scoring System"
        description="Resume Scoring System Dashboard"
      />
      
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-bold text-black dark:text-white">
            Dashboard
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Welcome Card */}
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="16"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.618762 8.37502C0.414388 8.13128 0.414388 7.86876 0.618762 7.62502C0.825012 7.38128 4.19376 0.884402 11 0.884402C17.8063 0.884402 21.175 7.38128 21.3813 7.62502C21.5856 7.86876 21.5856 8.13128 21.3813 8.37502C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.70313 8.00002C3.66876 9.98128 6.03126 13.1156 11 13.1156C15.9688 13.1156 18.3313 9.98128 19.2969 8.00002C18.3313 6.01876 15.9688 2.8844 11 2.8844C6.03126 2.8844 3.66876 6.01876 2.70313 8.00002Z"
                  fill=""
                />
                <path
                  d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
                  fill=""
                />
              </svg>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  Welcome back!
                </h4>
                <p className="text-sm font-medium text-black dark:text-white">
                  {user ? `${user.first_name} ${user.last_name}` : "User"}
                </p>
                <p className="text-xs text-meta-3 dark:text-meta-3">
                  {user ? user.email : "user@example.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Role Card */}
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="16"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.618762 8.37502C0.414388 8.13128 0.414388 7.86876 0.618762 7.62502C0.825012 7.38128 4.19376 0.884402 11 0.884402C17.8063 0.884402 21.175 7.38128 21.3813 7.62502C21.5856 7.86876 21.5856 8.13128 21.3813 8.37502C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.70313 8.00002C3.66876 9.98128 6.03126 13.1156 11 13.1156C15.9688 13.1156 18.3313 9.98128 19.2969 8.00002C18.3313 6.01876 15.9688 2.8844 11 2.8844C6.03126 2.8844 3.66876 6.01876 2.70313 8.00002Z"
                  fill=""
                />
                <path
                  d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
                  fill=""
                />
              </svg>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  Role
                </h4>
                <p className="text-sm font-medium text-black dark:text-white capitalize">
                  {user ? user.role : "User"}
                </p>
              </div>
            </div>
          </div>

          {/* Test Login Card */}
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="16"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.618762 8.37502C0.414388 8.13128 0.414388 7.86876 0.618762 7.62502C0.825012 7.38128 4.19376 0.884402 11 0.884402C17.8063 0.884402 21.175 7.38128 21.3813 7.62502C21.5856 7.86876 21.5856 8.13128 21.3813 8.37502C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.70313 8.00002C3.66876 9.98128 6.03126 13.1156 11 13.1156C15.9688 13.1156 18.3313 9.98128 19.2969 8.00002C18.3313 6.01876 15.9688 2.8844 11 2.8844C6.03126 2.8844 3.66876 6.01876 2.70313 8.00002Z"
                  fill=""
                />
                <path
                  d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
                  fill=""
                />
              </svg>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  Test Credentials
                </h4>
                <p className="text-xs text-meta-3 dark:text-meta-3">
                  admin@company.com
                </p>
                <p className="text-xs text-meta-3 dark:text-meta-3">
                  password: password123
                </p>
              </div>
            </div>
          </div>

          {/* Logout Card */}
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="16"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.618762 8.37502C0.414388 8.13128 0.414388 7.86876 0.618762 7.62502C0.825012 7.38128 4.19376 0.884402 11 0.884402C17.8063 0.884402 21.175 7.38128 21.3813 7.62502C21.5856 7.86876 21.5856 8.13128 21.3813 8.37502C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.70313 8.00002C3.66876 9.98128 6.03126 13.1156 11 13.1156C15.9688 13.1156 18.3313 9.98128 19.2969 8.00002C18.3313 6.01876 15.9688 2.8844 11 2.8844C6.03126 2.8844 3.66876 6.01876 2.70313 8.00002Z"
                  fill=""
                />
                <path
                  d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
                  fill=""
                />
              </svg>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  Actions
                </h4>
                <button
                  onClick={logout}
                  className="mt-2 rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
