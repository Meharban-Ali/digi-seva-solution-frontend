import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAnalytics } from "@/features/analytics/useAnalytics";
import { MetricCard } from "./MetricCard";
import { ServicesByCategoryChart } from "./ServicesByCategoryChart";
import { EnquiriesByStatusChart } from "./EnquiriesByStatusChart";
import { ContentBySectionChart } from "./ContentBySectionChart";
import { RecentEnquiriesFeed } from "./RecentEnquiriesFeed";
import { Button } from "@/components/ui/button";
import {
  Layers,
  FileText,
  Image,
  Inbox,
  Sparkles,
  HelpCircle,
  RefreshCw,
  BarChart2,
} from "lucide-react";
import { toast } from "sonner";

export function AnalyticsDashboard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch, dataUpdatedAt } = useAnalytics();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [minutesAgo, setMinutesAgo] = useState(0);

  // Update "Last updated: Xm ago" ticker
  useEffect(() => {
    const updateTimeAgo = () => {
      if (dataUpdatedAt) {
        const diffMs = Date.now() - dataUpdatedAt;
        const mins = Math.floor(diffMs / 60000);
        setMinutesAgo(mins);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [dataUpdatedAt]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Analytics data refreshed.");
    } catch {
      toast.error("Failed to refresh analytics data.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 pt-4 border-t border-slate-200/80">
      {/* Analytics Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-5 w-5 text-primary shrink-0" />
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              {t("analytics.title", "Analytics & System Insights")}
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {t("analytics.subtitle", "Real-time summary metrics, catalog distribution, and customer activity")}
          </p>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-center">
          <span className="text-xs text-slate-500 font-mono">
            {t("analytics.lastUpdated", {
              time: minutesAgo === 0 ? t("analytics.justNow", "Just now") : t("analytics.minutesAgo", { count: minutesAgo, defaultValue: `${minutesAgo}m ago` }),
            })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="text-xs font-bold flex items-center gap-1.5 border-slate-300 hover:bg-slate-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            <span>{t("analytics.refresh", "Refresh Data")}</span>
          </Button>
        </div>
      </div>

      {/* Section 1: Summary KPI Metrics Row (6 cards grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title={t("analytics.totalServices", "Total Services")}
          value={data?.totalServices}
          icon={Layers}
          isLoading={isLoading}
          isError={isError}
          accentColor="navy"
        />
        <MetricCard
          title={t("analytics.publishedContent", "Published Content")}
          value={data?.publishedContent}
          subtitle={`/ ${data?.totalContent || 0}`}
          icon={FileText}
          isLoading={isLoading}
          isError={isError}
          accentColor="indigo"
        />
        <MetricCard
          title={t("analytics.mediaAssets", "Total Media Assets")}
          value={data?.totalMedia}
          icon={Image}
          isLoading={isLoading}
          isError={isError}
          accentColor="gold"
        />
        <MetricCard
          title={t("analytics.newEnquiries", "New Enquiries")}
          value={data?.newEnquiries}
          icon={Inbox}
          isLoading={isLoading}
          isError={isError}
          accentColor="rose"
        />
        <MetricCard
          title={t("analytics.totalEnquiries", "Total Enquiries")}
          value={data?.totalEnquiries}
          icon={HelpCircle}
          isLoading={isLoading}
          isError={isError}
          accentColor="emerald"
        />
        <MetricCard
          title={t("analytics.featuredServices", "Featured Services")}
          value={data?.featuredServices}
          icon={Sparkles}
          isLoading={isLoading}
          isError={isError}
          accentColor="gold"
        />
      </div>

      {/* Section 2: Charts Row (3 Columns desktop / 1 Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ServicesByCategoryChart data={data?.servicesByCategory} isLoading={isLoading} />
        <EnquiriesByStatusChart data={data?.enquiriesByStatus} isLoading={isLoading} />
        <ContentBySectionChart data={data?.contentBySection} isLoading={isLoading} />
      </div>

      {/* Section 3: Recent Activity Feed (Full Width) */}
      <RecentEnquiriesFeed enquiries={data?.recentEnquiries} isLoading={isLoading} />
    </div>
  );
}

export default AnalyticsDashboard;
