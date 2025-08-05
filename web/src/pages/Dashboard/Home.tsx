import ResumeMetrics from "../../components/resume/ResumeMetrics";
import ResumeProcessingChart from "../../components/resume/ResumeProcessingChart";
import ScoringStatisticsChart from "../../components/resume/ScoringStatisticsChart";
import RecentSubmissions from "../../components/resume/RecentSubmissions";
import EmailMonitoringCard from "../../components/resume/EmailMonitoringCard";
import SystemHealthCard from "../../components/resume/SystemHealthCard";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Resume Scoring Dashboard | Admin Panel"
        description="Comprehensive dashboard for monitoring resume scoring system performance and analytics"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <ResumeMetrics />

          <ResumeProcessingChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <SystemHealthCard />
        </div>

        <div className="col-span-12">
          <ScoringStatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <EmailMonitoringCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentSubmissions />
        </div>
      </div>
    </>
  );
}
