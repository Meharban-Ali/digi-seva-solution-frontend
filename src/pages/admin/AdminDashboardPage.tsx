import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/features/auth/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Layers, FileText, Image, Inbox, KeyRound } from "lucide-react";
import { AnalyticsDashboard } from "@/components/admin/analytics/AnalyticsDashboard";

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-slate-950 via-[#0B2046] to-slate-900 text-white shadow-md border-slate-800 overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" /> Partner Control Panel • Active JWT Session
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t("adminDashboard.welcome")}, {user?.fullName || "Admin Partner"}!
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            {t("adminDashboard.overviewSubtitle")}
          </p>
        </CardContent>
      </Card>

      {/* Auth Status & Account Notice */}
      <Card className="border-emerald-200 bg-emerald-50/50 shadow-xs">
        <CardContent className="p-5 flex items-start gap-3">
          <KeyRound className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-emerald-950">{t("adminDashboard.seededNoticeTitle")}</h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {t("adminDashboard.seededNoticeBody")} Logged-in Account: <code className="bg-emerald-100 font-mono px-1 py-0.5 rounded text-emerald-900">{user?.email}</code>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Module Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-slate-200 shadow-xs bg-white hover:border-orange-300 transition-colors">
          <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-bold text-slate-900">Services</CardTitle>
            <div className="bg-orange-50 text-accent-dark border border-orange-200 p-2 rounded-lg">
              <Layers className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-1">
            <p className="text-xs text-slate-500 font-medium">Bilingual Catalog CRUD</p>
            <span className="inline-block text-[10px] font-bold text-accent-dark bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
              Active Management
            </span>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white hover:border-primary/40 transition-colors">
          <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-bold text-slate-900">Content Blocks</CardTitle>
            <div className="bg-indigo-50 text-indigo-600 border border-indigo-200/60 p-2 rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-1">
            <p className="text-xs text-slate-500 font-medium">Draft & Publish Manager</p>
            <span className="inline-block text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
              Active Management
            </span>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white hover:border-primary/40 transition-colors">
          <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-bold text-slate-900">Media Library</CardTitle>
            <div className="bg-amber-50 text-accent-gold-dark border border-amber-200/60 p-2 rounded-lg">
              <Image className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-1">
            <p className="text-xs text-slate-500 font-medium">Cloudinary Image/Media</p>
            <span className="inline-block text-[10px] font-bold text-accent-gold-dark bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              Active Management
            </span>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white hover:border-primary/40 transition-colors">
          <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-bold text-slate-900">Customer Enquiries</CardTitle>
            <div className="bg-emerald-50 text-emerald-600 border border-emerald-200/60 p-2 rounded-lg">
              <Inbox className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-1">
            <p className="text-xs text-slate-500 font-medium">Status & Lifecycle Tracker</p>
            <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Active Management
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Analytics & System Insights Dashboard */}
      <AnalyticsDashboard />
    </div>
  );
}

export default AdminDashboardPage;
