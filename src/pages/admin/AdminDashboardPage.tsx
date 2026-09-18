import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/features/auth/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Layers, FileText, Image, Inbox, KeyRound, Sparkles } from "lucide-react";
import { AnalyticsDashboard } from "@/components/admin/analytics/AnalyticsDashboard";

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Lightweight Scoped CSS Animations */}
      <style>{`
        @keyframes dashFadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dashAmbientGlow {
          0%, 100% {
            transform: scale(1) translate(0, 0);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.1) translate(-10px, 10px);
            opacity: 0.95;
          }
        }

        @keyframes dashKeyBounceOnce {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.22) rotate(-14deg); }
          50% { transform: scale(0.92) rotate(8deg); }
          75% { transform: scale(1.06) rotate(-3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        @keyframes dashPulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .animate-dash-step-1 {
          animation: dashFadeSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0ms both;
        }
        .animate-dash-step-2 {
          animation: dashFadeSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) 120ms both;
        }
        .animate-dash-card-1 {
          animation: dashFadeSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) 220ms both;
        }
        .animate-dash-card-2 {
          animation: dashFadeSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) 310ms both;
        }
        .animate-dash-card-3 {
          animation: dashFadeSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) 400ms both;
        }
        .animate-dash-card-4 {
          animation: dashFadeSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) 490ms both;
        }
        .animate-dash-analytics {
          animation: dashFadeSlideIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) 580ms both;
        }

        .dash-ambient-glow {
          animation: dashAmbientGlow 10s ease-in-out infinite;
        }

        .dash-key-bounce {
          animation: dashKeyBounceOnce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 350ms 1 both;
        }

        .dash-pulse-dot {
          animation: dashPulseDot 2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-dash-step-1,
          .animate-dash-step-2,
          .animate-dash-card-1,
          .animate-dash-card-2,
          .animate-dash-card-3,
          .animate-dash-card-4,
          .animate-dash-analytics {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .dash-ambient-glow,
          .dash-key-bounce,
          .dash-pulse-dot {
            animation: none !important;
          }
        }
      `}</style>

      {/* Welcome Banner */}
      <Card className="animate-dash-step-1 relative overflow-hidden bg-gradient-to-r from-slate-950 via-[#0B2046] to-slate-900 text-white shadow-lg border-slate-800/80 rounded-xl">
        {/* Subtle Ambient Moving Glow Background */}
        <div 
          className="dash-ambient-glow absolute -right-20 -top-20 w-96 h-96 rounded-full bg-gradient-to-br from-orange-500/20 via-indigo-500/15 to-transparent blur-3xl pointer-events-none" 
          aria-hidden="true"
        />
        <div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(249,87,0,0.12),transparent_60%)] pointer-events-none" 
          aria-hidden="true"
        />

        <CardContent className="relative z-10 p-6 sm:p-8 space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-semibold backdrop-blur-xs shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="dash-pulse-dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Partner Control Panel • Active JWT Session</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2 flex-wrap">
            <span>{t("adminDashboard.welcome")},</span>
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200 bg-clip-text text-transparent">
              {user?.fullName || "Admin Partner"}!
            </span>
          </h1>

          <p className="text-sm text-slate-300/90 max-w-2xl leading-relaxed font-normal">
            {t("adminDashboard.overviewSubtitle")}
          </p>
        </CardContent>
      </Card>

      {/* Auth Status & Account Notice */}
      <Card className="animate-dash-step-2 relative overflow-hidden border-emerald-200/80 bg-gradient-to-r from-emerald-50/90 via-emerald-50/60 to-teal-50/70 shadow-xs rounded-xl transition-all duration-300 hover:border-emerald-300">
        <CardContent className="p-5 flex items-start gap-3.5">
          <div className="dash-key-bounce bg-emerald-100/90 border border-emerald-200/90 p-2.5 rounded-lg text-emerald-700 shrink-0 shadow-xs mt-0.5">
            <KeyRound className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-emerald-950">{t("adminDashboard.seededNoticeTitle")}</h4>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-200/60 border border-emerald-300/60 px-2 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3" /> Verified
              </span>
            </div>
            <p className="text-xs text-emerald-800/90 leading-relaxed">
              {t("adminDashboard.seededNoticeBody")} Logged-in Account:{" "}
              <code className="bg-emerald-100 font-mono px-1.5 py-0.5 rounded text-emerald-900 border border-emerald-200/80 font-semibold">
                {user?.email}
              </code>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Module Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Services Card */}
        <Card className="animate-dash-card-1 group relative overflow-hidden border-slate-200/80 shadow-xs bg-white hover:border-orange-400/80 hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 rounded-xl cursor-pointer">
          <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 transition-all duration-300" />
          <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-bold text-slate-900 group-hover:text-accent-dark transition-colors">
              Services
            </CardTitle>
            <div className="bg-orange-50 text-accent-dark border border-orange-200/80 p-2.5 rounded-xl group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all duration-300 shadow-xs group-hover:scale-105">
              <Layers className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-2">
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Bilingual Catalog CRUD</p>
            <span className="inline-block text-[10px] font-bold text-accent-dark bg-orange-50 border border-orange-200/80 px-2 py-0.5 rounded-md group-hover:bg-orange-100/90 transition-colors">
              Active Management
            </span>
          </CardContent>
        </Card>

        {/* Content Blocks Card */}
        <Card className="animate-dash-card-2 group relative overflow-hidden border-slate-200/80 shadow-xs bg-white hover:border-indigo-400/80 hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 rounded-xl cursor-pointer">
          <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-blue-500 transition-all duration-300" />
          <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Content Blocks
            </CardTitle>
            <div className="bg-indigo-50 text-indigo-600 border border-indigo-200/80 p-2.5 rounded-xl group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300 shadow-xs group-hover:scale-105">
              <FileText className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-2">
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Draft & Publish Manager</p>
            <span className="inline-block text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md group-hover:bg-indigo-100/90 transition-colors">
              Active Management
            </span>
          </CardContent>
        </Card>

        {/* Media Library Card */}
        <Card className="animate-dash-card-3 group relative overflow-hidden border-slate-200/80 shadow-xs bg-white hover:border-amber-400/80 hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 rounded-xl cursor-pointer">
          <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-orange-500 transition-all duration-300" />
          <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
              Media Library
            </CardTitle>
            <div className="bg-amber-50 text-amber-700 border border-amber-200/80 p-2.5 rounded-xl group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-all duration-300 shadow-xs group-hover:scale-105">
              <Image className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-2">
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Cloudinary Image/Media</p>
            <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md group-hover:bg-amber-100/90 transition-colors">
              Active Management
            </span>
          </CardContent>
        </Card>

        {/* Customer Enquiries Card */}
        <Card className="animate-dash-card-4 group relative overflow-hidden border-slate-200/80 shadow-xs bg-white hover:border-emerald-400/80 hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 rounded-xl cursor-pointer">
          <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-500 transition-all duration-300" />
          <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Customer Enquiries
            </CardTitle>
            <div className="bg-emerald-50 text-emerald-600 border border-emerald-200/80 p-2.5 rounded-xl group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300 shadow-xs group-hover:scale-105">
              <Inbox className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-2">
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Status & Lifecycle Tracker</p>
            <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md group-hover:bg-emerald-100/90 transition-colors">
              Active Management
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Analytics & System Insights Dashboard */}
      <div className="animate-dash-analytics">
        <AnalyticsDashboard />
      </div>
    </div>
  );
}

export default AdminDashboardPage;
