import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAnalytics } from "@/features/analytics/useAnalytics";
import { getAdminCustomerStats } from "@/api/adminCustomerApi";
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
  Users,
} from "lucide-react";
import { toast } from "sonner";

export function AnalyticsDashboard() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch, dataUpdatedAt } = useAnalytics();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [minutesAgo, setMinutesAgo] = useState(0);
  const [totalCustomersCount, setTotalCustomersCount] = useState<number | undefined>(undefined);

  const fetchCustomerCount = async () => {
    try {
      const stats = await getAdminCustomerStats();
      setTotalCustomersCount(stats.totalCustomers);
    } catch {
      // Graceful fallback
    }
  };

  useEffect(() => {
    fetchCustomerCount();
  }, []);

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
      await Promise.all([refetch(), fetchCustomerCount()]);
      toast.success("Analytics data refreshed.");
    } catch {
      toast.error("Failed to refresh analytics data.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 pt-4 border-t border-slate-200/80 bg-slate-50/70 p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      {/* Lightweight Scoped CSS Animations */}
      <style>{`
        @keyframes dashCardEntrance {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-dash-card-entrance {
          animation: dashCardEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .animate-dash-chart-1 {
          animation: dashCardEntrance 0.55s cubic-bezier(0.16, 1, 0.3, 1) 640ms both;
        }

        .animate-dash-chart-2 {
          animation: dashCardEntrance 0.55s cubic-bezier(0.16, 1, 0.3, 1) 720ms both;
        }

        .animate-dash-chart-3 {
          animation: dashCardEntrance 0.55s cubic-bezier(0.16, 1, 0.3, 1) 800ms both;
        }

        .animate-dash-feed {
          animation: dashCardEntrance 0.55s cubic-bezier(0.16, 1, 0.3, 1) 880ms both;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-dash-card-entrance,
          .animate-dash-chart-1,
          .animate-dash-chart-2,
          .animate-dash-chart-3,
          .animate-dash-feed {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Analytics Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-5 w-5 text-[#0B2046] shrink-0" />
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              {t("analytics.title", "Analytics & System Insights")}
            </h3>
          </div>
          <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-[#0B2046] rounded-full w-28 mt-1" />
          <p className="text-xs text-slate-500 font-medium pt-1">
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
            className="text-xs font-bold flex items-center gap-1.5 border-slate-300 hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#0B2046]" : ""}`} />
            <span>{isRefreshing ? t("analytics.refreshing", "Refreshing...") : t("analytics.refresh", "Refresh Data")}</span>
          </Button>
        </div>
      </div>

      {/* Section 1: Brand Token Derived 7 KPI Metric Cards */}
      <div className="space-y-4">
        {/* Row 1A: Primary Highlight KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            title={t("analytics.totalServices", "Total Services")}
            value={data?.totalServices}
            icon={Layers}
            isLoading={isLoading}
            isError={isError}
            accentColor="navy"
            isPrimary={true}
            animationDelay={100}
          />
          <MetricCard
            title={t("analytics.newEnquiries", "New Enquiries")}
            value={data?.newEnquiries}
            icon={Inbox}
            isLoading={isLoading}
            isError={isError}
            accentColor="orange"
            isPrimary={true}
            animationDelay={180}
          />
          <MetricCard
            title={t("customer.totalCustomers", "Registered Customers")}
            value={totalCustomersCount}
            icon={Users}
            isLoading={isLoading}
            isError={isError}
            accentColor="navy-slate"
            isPrimary={true}
            animationDelay={260}
          />
        </div>

        {/* Row 1B: Secondary Operational Metrics (4-card grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title={t("analytics.publishedContent", "Published Content")}
            value={data?.publishedContent}
            subtitle={`/ ${data?.totalContent || 0}`}
            icon={FileText}
            isLoading={isLoading}
            isError={isError}
            accentColor="navy-indigo"
            animationDelay={340}
          />
          <MetricCard
            title={t("analytics.mediaAssets", "Total Media Assets")}
            value={data?.totalMedia}
            icon={Image}
            isLoading={isLoading}
            isError={isError}
            accentColor="slate-dark"
            animationDelay={420}
          />
          <MetricCard
            title={t("analytics.totalEnquiries", "Total Enquiries")}
            value={data?.totalEnquiries}
            icon={HelpCircle}
            isLoading={isLoading}
            isError={isError}
            accentColor="warm-slate"
            animationDelay={500}
          />
          <MetricCard
            title={t("analytics.featuredServices", "Featured Services")}
            value={data?.featuredServices}
            icon={Sparkles}
            isLoading={isLoading}
            isError={isError}
            accentColor="amber"
            animationDelay={580}
          />
        </div>
      </div>

      {/* Section 2: Staggered Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="animate-dash-chart-1">
          <ServicesByCategoryChart data={data?.servicesByCategory} isLoading={isLoading} />
        </div>
        <div className="animate-dash-chart-2">
          <EnquiriesByStatusChart data={data?.enquiriesByStatus} isLoading={isLoading} />
        </div>
        <div className="animate-dash-chart-3">
          <ContentBySectionChart data={data?.contentBySection} isLoading={isLoading} />
        </div>
      </div>

      {/* Section 3: Staggered Recent Activity Feed (Full Width) */}
      <div className="animate-dash-feed">
        <RecentEnquiriesFeed enquiries={data?.recentEnquiries} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
