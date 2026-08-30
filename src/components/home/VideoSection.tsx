import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Youtube, Bell, ShieldCheck, Landmark, CreditCard, Globe } from "lucide-react";

export function VideoSection() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  // Floating animation variants with reduced-motion fallback
  const floatLeftTop = shouldReduceMotion
    ? {}
    : {
        y: [0, -8, 0],
        transition: { duration: 5.5, repeat: Infinity, ease: "easeInOut" as const },
      };

  const floatLeftBottom = shouldReduceMotion
    ? {}
    : {
        y: [0, -10, 0],
        transition: { duration: 6.2, delay: 0.8, repeat: Infinity, ease: "easeInOut" as const },
      };

  const floatRightTop = shouldReduceMotion
    ? {}
    : {
        y: [0, -9, 0],
        transition: { duration: 6.8, delay: 0.4, repeat: Infinity, ease: "easeInOut" as const },
      };

  const floatRightBottom = shouldReduceMotion
    ? {}
    : {
        y: [0, -7, 0],
        transition: { duration: 5.2, delay: 1.2, repeat: Infinity, ease: "easeInOut" as const },
      };

  const glowPulse = shouldReduceMotion
    ? {}
    : {
        scale: [1, 1.08, 1],
        opacity: [0.2, 0.3, 0.2],
        transition: { duration: 7, repeat: Infinity, ease: "easeInOut" as const },
      };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 relative overflow-hidden py-2">
      {/* Ambient background glow orbs for side empty spaces */}
      <motion.div
        animate={glowPulse}
        className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-400/20 blur-3xl pointer-events-none -z-10"
      />
      <motion.div
        animate={glowPulse}
        className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none -z-10"
      />

      <div className="space-y-6">
        {/* Section Heading & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-2 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 bg-orange-50 text-accent-dark border border-orange-200 px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <Play className="h-3.5 w-3.5 text-accent fill-accent" />
            <span>{t("video.badge", "Video Showcase")}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t("video.title", "See Our Services in Action")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t("video.subtitle", "Watch how we help citizens with government services, banking, and digital solutions")}
          </p>
        </motion.div>

        {/* Video Area Container with Side Decorative Badges */}
        <div className="relative flex items-center justify-center">
          {/* LEFT SIDE DECORATIVE BADGES (Desktop/Tablet only) */}
          <div className="hidden md:flex flex-col justify-around absolute left-2 lg:left-12 top-0 bottom-0 pointer-events-none z-0 space-y-8">
            <motion.div
              animate={floatLeftTop}
              className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xs border border-orange-200/90 shadow-sm rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 pointer-events-auto transition-shadow hover:shadow-md"
            >
              <div className="h-7 w-7 rounded-lg bg-orange-50 text-accent-dark flex items-center justify-center shrink-0 border border-orange-200">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-slate-900 leading-tight">Aadhaar & Govt. Cards</div>
                <div className="text-[10px] text-slate-500 font-medium">Official Jan Seva Kendra</div>
              </div>
            </motion.div>

            <motion.div
              animate={floatLeftBottom}
              className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xs border border-blue-200/90 shadow-sm rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 pointer-events-auto transition-shadow hover:shadow-md ml-4"
            >
              <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
                <Landmark className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-slate-900 leading-tight">Banking & Money Transfer</div>
                <div className="text-[10px] text-slate-500 font-medium">Axis & SBI BC Partner</div>
              </div>
            </motion.div>
          </div>

          {/* CENTER VIDEO CONTAINER (Strictly Maintained Core Sizing) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-3 z-10"
          >
            <div className="max-w-[240px] sm:max-w-[260px] md:max-w-[280px] mx-auto w-full">
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-xl border border-slate-200/90 bg-slate-950">
                <iframe
                  src="https://www.youtube.com/embed/dCQC0wocvzg"
                  title="Digi Seva Solution Services"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: "none" }}
                  className="w-full h-full rounded-2xl"
                />
              </div>
            </div>

            {/* Action Link Elements Below Video (Side by side on the same line) */}
            <div className="flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-center pt-1">
              <a
                href="https://youtube.com/shorts/dCQC0wocvzg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-dark hover:text-accent font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Youtube className="h-4 w-4 text-red-600 shrink-0" />
                <span>{t("video.watchOnYoutube", "▶ Watch on YouTube")}</span>
              </a>

              <a
                href="https://youtube.com/shorts/dCQC0wocvzg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-dark hover:text-accent font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Bell className="h-3.5 w-3.5 text-accent shrink-0" />
                <span>{t("video.subscribeUpdates", "📱 Subscribe for Updates")}</span>
              </a>
            </div>
          </motion.div>

          {/* RIGHT SIDE DECORATIVE BADGES (Desktop/Tablet only) */}
          <div className="hidden md:flex flex-col justify-around absolute right-2 lg:right-12 top-0 bottom-0 pointer-events-none z-0 space-y-8">
            <motion.div
              animate={floatRightTop}
              className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xs border border-emerald-200/90 shadow-sm rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 pointer-events-auto transition-shadow hover:shadow-md"
            >
              <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-slate-900 leading-tight">PAN & Tax Processing</div>
                <div className="text-[10px] text-slate-500 font-medium">Fast 3-Day Turnaround</div>
              </div>
            </motion.div>

            <motion.div
              animate={floatRightBottom}
              className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xs border border-indigo-200/90 shadow-sm rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 pointer-events-auto transition-shadow hover:shadow-md mr-4"
            >
              <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-200">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-slate-900 leading-tight">Web & IT Development</div>
                <div className="text-[10px] text-slate-500 font-medium">Custom Business Portals</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VideoSection;
