import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { Logo } from "@/components/common/Logo";
import { Menu, X, Clock, PhoneCall, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: t("nav.home") },
    { path: "/services", label: t("nav.services") },
    { path: "/about", label: t("nav.about") },
    { path: "/contact", label: t("nav.contact") },
    { path: "/faq", label: t("nav.faq") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-md shadow-slate-900/5 transition-all">
      {/* 1. Main Navigation Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="hover:opacity-95 transition-opacity flex items-center">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links with Sliding Underline Indicator */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `transition-colors duration-200 py-1 relative ${
                  isActive ? "text-accent-dark font-bold" : "text-slate-700 hover:text-accent-dark"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-indicator"
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-accent rounded-full shadow-2xs"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Actions & Language Switcher */}
        <div className="flex items-center space-x-3">
          <div className="hover:scale-[1.03] transition-transform duration-200">
            <LanguageToggle />
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileMenuOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: mobileMenuOpen ? -90 : 90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: mobileMenuOpen ? 90 : -90, scale: 0.8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {mobileMenuOpen ? <X className="h-5 w-5 text-slate-800" /> : <Menu className="h-5 w-5" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1.5 shadow-lg overflow-hidden"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-orange-50 text-accent-dark font-bold" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Official Government CSC Center Info Strip (Brand Navy Background) */}
      <div className="bg-[#0B2046] text-white border-t border-blue-900/60 text-[11px] py-2 px-4 sm:px-6 relative overflow-hidden shadow-xs">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-12 w-40 h-full bg-orange-500/10 rounded-full blur-xl pointer-events-none motion-reduce:hidden" />

        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 font-medium relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="bg-accent text-white font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs border border-orange-400/40 hover:scale-[1.03] transition-transform duration-200">
              <ShieldCheck className="h-3 w-3 text-white shrink-0" />
              <span>Govt. CSC Center</span>
            </span>
            <span className="text-slate-200 hidden sm:inline font-medium tracking-tight">
              VLE Center • District East Delhi • New Ashok Nagar 110096
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-200 font-medium">
              <motion.span
                animate={{ rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="inline-block motion-reduce:animate-none"
              >
                <Clock className="h-3.5 w-3.5 text-orange-400 shrink-0" />
              </motion.span>
              <span>Open Daily: 7:00 AM – 12:00 AM</span>
            </span>

            <a
              href="tel:7900867261"
              className="flex items-center gap-1.5 text-orange-400 hover:text-white font-bold transition-colors group"
            >
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="inline-block motion-reduce:animate-none"
              >
                <PhoneCall className="h-3.5 w-3.5 shrink-0 group-hover:rotate-12 transition-transform duration-200" />
              </motion.span>
              <span>Helpdesk: +91 7900867261</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
