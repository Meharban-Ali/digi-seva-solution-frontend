import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { Logo } from "@/components/common/Logo";
import { Menu, X } from "lucide-react";
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
  ];

  return (
    <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `transition-colors py-1 relative ${
                  isActive
                    ? "text-primary font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                    : "text-slate-600 hover:text-primary"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions & Language Switcher */}
        <div className="flex items-center space-x-3">
          <LanguageToggle />

          {/* Mobile Menu Toggle Button with smooth Framer Motion icon transition */}
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

      {/* Mobile Drawer Menu with smooth Framer Motion slide & fade animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-b bg-white px-4 pt-2 pb-4 space-y-1.5 shadow-lg overflow-hidden"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-primary/10 text-primary font-bold" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
