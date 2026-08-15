import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/common/Logo";
import { MapPin, Clock, ShieldCheck } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Brand Info */}
        <div className="space-y-3">
          <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
            <Logo variant="light" size="md" />
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed">
            {t("footer.description")}
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-md">
            <ShieldCheck className="h-3.5 w-3.5" /> Authorized Jan Seva Kendra
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">{t("footer.quickLinks")}</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition-colors">{t("nav.home")}</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white transition-colors">{t("nav.services")}</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">{t("nav.about")}</Link>
            </li>
          </ul>
        </div>

        {/* Center Address & Hours */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">{t("footer.contactInfo")}</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li className="flex items-start space-x-2.5">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>{t("about.address")}</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>{t("about.timingDetails")}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>{t("footer.copyright")}</p>
        <p className="font-mono text-slate-600">New Ashok Nagar • Delhi 110096</p>
      </div>
    </footer>
  );
}

export default Footer;
