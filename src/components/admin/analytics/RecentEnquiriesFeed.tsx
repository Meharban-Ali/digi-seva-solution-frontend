import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AdminEnquiryResponse, EnquiryStatus } from "@/types/adminEnquiry.types";
import { Inbox, ArrowRight, User, Phone, Clock, MessageSquare } from "lucide-react";

interface RecentEnquiriesFeedProps {
  enquiries?: AdminEnquiryResponse[];
  isLoading?: boolean;
}

export function maskPhoneNumber(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length >= 10) {
    const first5 = cleaned.slice(0, 5);
    const last2 = cleaned.slice(-2);
    return `${first5}***${last2}`;
  }
  return phone;
}

export function formatTimeAgo(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

const statusBadgeMap: Record<EnquiryStatus, { label: string; style: string }> = {
  NEW: {
    label: "Pending (New)",
    style: "bg-amber-50 text-amber-900 border-amber-300 font-bold",
  },
  CONTACTED: {
    label: "Contacted",
    style: "bg-indigo-50 text-indigo-900 border-indigo-200 font-bold",
  },
  RESOLVED: {
    label: "Resolved",
    style: "bg-emerald-50 text-emerald-900 border-emerald-300 font-bold",
  },
};

export function RecentEnquiriesFeed({ enquiries = [], isLoading }: RecentEnquiriesFeedProps) {
  const { t } = useTranslation();

  return (
    <Card className="border border-slate-200/80 shadow-xs bg-white rounded-xl hover:shadow-md transition-shadow">
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0 border-b border-slate-100">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Inbox className="h-4 w-4 text-[#0B2046]" />
          {t("analytics.recentActivity", "Recent Customer Enquiries")}
        </CardTitle>
        <Link
          to="/admin/enquiries"
          className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5"
        >
          {t("analytics.viewAllEnquiries", "View All Enquiries")}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-5">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-slate-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 space-y-1">
            <p className="font-semibold">{t("analytics.noRecentEnquiries", "No customer enquiries recorded yet.")}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {enquiries.map((enquiry) => {
              const badge = statusBadgeMap[enquiry.status] || {
                label: enquiry.status,
                style: "bg-slate-100 text-slate-800 border-slate-200",
              };

              return (
                <div
                  key={enquiry.id}
                  className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-50/80 p-2 rounded-lg transition-colors"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5 truncate">
                        <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {enquiry.name}
                      </span>
                      <span className="text-xs font-mono text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-500 shrink-0" />
                        {maskPhoneNumber(enquiry.phone)}
                      </span>
                    </div>

                    {enquiry.message && (
                      <p className="text-xs text-slate-600 line-clamp-1 flex items-center gap-1">
                        <MessageSquare className="h-3 w-3 text-slate-400 shrink-0" />
                        {enquiry.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {formatTimeAgo(enquiry.createdAt)}
                    </span>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full border ${badge.style}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentEnquiriesFeed;
