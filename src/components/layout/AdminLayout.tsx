import { useState } from "react";
import { Outlet, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/features/auth/authStore";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { LogoIcon } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Layers,
  FolderTree,
  FolderKanban,
  FileText,
  Image,
  Inbox,
  LogOut,
  Menu,
  X,
  UserCheck,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function AdminLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success(t("adminAuth.logoutSuccess"));
    navigate("/admin/login");
  };

  const navItems = [
    { path: "/admin/dashboard", label: t("adminNav.dashboard"), icon: LayoutDashboard },
    { path: "/admin/categories", label: t("adminNav.categories"), icon: FolderTree },
    { path: "/admin/services", label: t("adminNav.services"), icon: Layers },
    { path: "/admin/projects", label: "Projects", icon: FolderKanban },
    { path: "/admin/content", label: t("adminNav.content"), icon: FileText },
    { path: "/admin/media", label: t("adminNav.media"), icon: Image },
    { path: "/admin/enquiries", label: t("adminNav.enquiries"), icon: Inbox },
    { path: "/admin/profile", label: t("adminNav.profile"), icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation Panel (Regal Midnight Navy) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0B2046] text-slate-200 flex flex-col justify-between border-r border-blue-900/60 transition-transform duration-200 ease-in-out ${
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
                <span className="text-[11px] text-slate-300 font-medium">Digi Seva Solution</span>
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
                        ? "bg-accent text-white font-bold shadow-xs"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
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
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 space-y-3">
          <Link
            to="/admin/profile"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors group"
          >
            <div className="bg-slate-800 group-hover:bg-primary p-2 rounded-full text-slate-300 group-hover:text-white transition-colors">
              <UserCheck className="h-4 w-4" />
            </div>
            <div className="truncate text-xs">
              <p className="font-bold text-white truncate">{user?.fullName || "Admin Partner"}</p>
              <p className="text-slate-400 truncate font-mono">{user?.email}</p>
            </div>
          </Link>
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
            {/* Header Admin Profile Link */}
            <Link
              to="/admin/profile"
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-orange-50/80 hover:bg-orange-100/60 transition-colors border border-orange-200/80 text-slate-800"
              title="View & manage account profile"
            >
              <div className="h-7 w-7 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs shadow-2xs shrink-0 overflow-hidden">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={user?.fullName || "Admin Profile"} className="w-full h-full object-cover" />
                ) : (
                  user?.fullName?.charAt(0) || "A"
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="font-bold text-slate-800 text-xs truncate max-w-[130px]">
                  {user?.fullName || "Partner Admin"}
                </span>
                <span className="text-[10px] text-slate-500 font-mono truncate max-w-[130px]">
                  {user?.email}
                </span>
              </div>
            </Link>

            <LanguageToggle />

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 flex items-center gap-1.5 font-bold"
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
