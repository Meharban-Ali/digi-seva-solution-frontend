import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/features/auth/authStore";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Layers,
  FileText,
  Image,
  Inbox,
  LogOut,
  UserCheck,
  Menu,
  X,
} from "lucide-react";
import { LogoIcon } from "@/components/common/Logo";

export function AdminLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success(t("adminAuth.logoutSuccess"));
    navigate("/admin/login");
  };

  const navItems = [
    { path: "/admin/dashboard", label: t("adminNav.dashboard"), icon: LayoutDashboard },
    { path: "/admin/services", label: t("adminNav.services"), icon: Layers },
    { path: "/admin/content", label: t("adminNav.content"), icon: FileText },
    { path: "/admin/media", label: t("adminNav.media"), icon: Image },
    { path: "/admin/enquiries", label: t("adminNav.enquiries"), icon: Inbox },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation Panel */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Header Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <LogoIcon className="h-7 w-7 shrink-0" />
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-base leading-none">Partner Portal</span>
                <span className="text-[11px] text-slate-400 font-medium">Digi Seva Solution</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
              aria-label="Close sidebar menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-white font-bold shadow-xs"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Profile Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-800 p-2 rounded-full text-slate-300">
              <UserCheck className="h-4 w-4" />
            </div>
            <div className="truncate text-xs">
              <p className="font-bold text-white truncate">{user?.fullName || "Admin Partner"}</p>
              <p className="text-slate-400 truncate font-mono">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
              aria-label="Open sidebar navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-base font-bold text-slate-800 hidden sm:block">
              Jan Seva Kendra Control Panel
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <LanguageToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 flex items-center gap-1.5"
              aria-label="Log out of partner control panel"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t("adminAuth.logout")}</span>
            </Button>
          </div>
        </header>

        {/* Dynamic Page Workspace */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
