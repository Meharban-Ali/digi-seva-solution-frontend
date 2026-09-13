import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function AppointmentCtaBanner() {
  const { t } = useTranslation();

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0B2046] via-[#102a5c] to-[#0B2046] rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-blue-900/60">
        {/* Ambient glow accent */}
        <div className="absolute top-0 right-0 w-80 h-full bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 border border-orange-400/30 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <Calendar className="h-3.5 w-3.5 text-accent" />
              <span>{t("appointment.ctaBadge", "ONLINE BOOKING")}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t("appointment.ctaTitle", "Visiting Our Center?")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t(
                "appointment.ctaSubtitle",
                "Book your appointment online to skip waiting lines and enjoy priority processing."
              )}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-300 pt-1 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Next 7 Days Slots</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-orange-400" />
                <span>7:00 AM – 12:00 AM Daily</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Instant Confirmation</span>
              </span>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent-dark text-white font-black shadow-md px-6 text-sm shrink-0 w-full sm:w-auto"
            >
              <Link to="/book-appointment">
                <span>{t("appointment.ctaButton", "Book Appointment Now →")}</span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AppointmentCtaBanner;
