import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Youtube, Bell, ShieldCheck, Landmark, CreditCard, Globe, Car, FileCheck } from "lucide-react";

export function VideoSection() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  // Gentle water-like bobbing float animations for each service card
  const floatLeftTop = shouldReduceMotion
    ? {}
    : {
        y: [-5, 5, -5],
        transition: { duration: 4.8, repeat: Infinity, ease: "easeInOut" as const },
      };

  const floatLeftMid = shouldReduceMotion
    ? {}
    : {
        y: [4, -5, 4],
        transition: { duration: 5.6, delay: 0.7, repeat: Infinity, ease: "easeInOut" as const },
      };

  const floatLeftBottom = shouldReduceMotion
    ? {}
    : {
        y: [-6, 4, -6],
        transition: { duration: 6.2, delay: 1.4, repeat: Infinity, ease: "easeInOut" as const },
      };

  const floatRightTop = shouldReduceMotion
    ? {}
    : {
        y: [5, -4, 5],
        transition: { duration: 5.2, delay: 0.3, repeat: Infinity, ease: "easeInOut" as const },
      };

  const floatRightMid = shouldReduceMotion
    ? {}
    : {
        y: [-4, 6, -4],
        transition: { duration: 5.8, delay: 1.0, repeat: Infinity, ease: "easeInOut" as const },
      };

  const floatRightBottom = shouldReduceMotion
    ? {}
    : {
        y: [4, -6, 4],
        transition: { duration: 6.5, delay: 1.6, repeat: Infinity, ease: "easeInOut" as const },
      };

  const glowPulse = shouldReduceMotion
    ? {}
    : {
        scale: [1, 1.08, 1],
        opacity: [0.2, 0.35, 0.2],
        transition: { duration: 7, repeat: Infinity, ease: "easeInOut" as const },
      };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 relative overflow-hidden py-2">
      {/* Ambient background glow orbs for side empty spaces */}
      <motion.div
        animate={glowPulse}
        className="hidden md:block absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-400/20 blur-3xl pointer-events-none -z-20"
      />
      <motion.div
        animate={glowPulse}
        className="hidden md:block absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none -z-20"
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

        {/* Video Area Container with Side Decorative Badges & Water-like Connectors */}
        <div className="relative flex items-center justify-center min-h-[480px]">
          {/* FLOWING WATER-LIKE SVG CONNECTOR PATHS */}
          <svg
            className="hidden md:block absolute inset-0 w-full h-full pointer-events-none -z-10"
            viewBox="0 0 1000 500"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="water-flow-left" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F95700" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="water-flow-right" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.8" />
              </linearGradient>

              <filter id="water-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Left Connector Path: Top Card -> Mid Card -> Bottom Card -> Curves toward Video */}
            <path
              d="M 120,45 C 170,140 145,210 165,260 C 185,310 140,410 210,435 C 280,450 330,390 370,300"
              fill="none"
              stroke="rgba(249, 87, 0, 0.2)"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            <motion.path
              d="M 120,45 C 170,140 145,210 165,260 C 185,310 140,410 210,435 C 280,450 330,390 370,300"
              fill="none"
              stroke="url(#water-flow-left)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="40 160"
              filter="url(#water-glow)"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      strokeDashoffset: [400, 0],
                    }
              }
              transition={
                shouldReduceMotion
                  ? {}
                  : {
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "linear",
                    }
              }
            />

            {/* Right Connector Path: Top Card -> Mid Card -> Bottom Card -> Curves toward Video */}
            <path
              d="M 880,45 C 830,140 855,210 835,260 C 815,310 860,410 790,435 C 720,450 670,390 630,300"
              fill="none"
              stroke="rgba(99, 102, 241, 0.2)"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            <motion.path
              d="M 880,45 C 830,140 855,210 835,260 C 815,310 860,410 790,435 C 720,450 670,390 630,300"
              fill="none"
              stroke="url(#water-flow-right)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="40 160"
              filter="url(#water-glow)"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      strokeDashoffset: [400, 0],
                    }
              }
              transition={
                shouldReduceMotion
                  ? {}
                  : {
                      duration: 4.8,
                      repeat: Infinity,
                      ease: "linear",
                    }
              }
            />
          </svg>

          {/* LEFT SIDE DECORATIVE BADGES (Desktop/Tablet only) */}
          <div className="hidden md:flex flex-col justify-between absolute left-0 lg:left-6 xl:left-10 top-2 bottom-12 pointer-events-none z-0 space-y-4">
            <motion.div
              animate={floatLeftTop}
              className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xs border border-orange-200/90 shadow-xs rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 pointer-events-auto transition-shadow hover:shadow-md"
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
              animate={floatLeftMid}
              className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xs border border-amber-200/90 shadow-xs rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 pointer-events-auto transition-shadow hover:shadow-md ml-3"
            >
              <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <Car className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-slate-900 leading-tight">RTO & Driving Licence</div>
                <div className="text-[10px] text-slate-500 font-medium">Vehicle Registration & DL</div>
              </div>
            </motion.div>

            <motion.div
              animate={floatLeftBottom}
              className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xs border border-blue-200/90 shadow-xs rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 pointer-events-auto transition-shadow hover:shadow-md"
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
                  src="https://www.youtube-nocookie.com/embed/qfDpzuWCM2s"
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
                href="https://youtube.com/shorts/qfDpzuWCM2s"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-dark hover:text-accent font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Youtube className="h-4 w-4 text-red-600 shrink-0" />
                <span>{t("video.watchOnYoutube", "▶ Watch on YouTube")}</span>
              </a>

              <a
                href="https://youtube.com/shorts/qfDpzuWCM2s"
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
          <div className="hidden md:flex flex-col justify-between absolute right-0 lg:right-6 xl:right-10 top-2 bottom-12 pointer-events-none z-0 space-y-4">
            <motion.div
              animate={floatRightTop}
              className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xs border border-emerald-200/90 shadow-xs rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 pointer-events-auto transition-shadow hover:shadow-md"
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
              animate={floatRightMid}
              className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xs border border-purple-200/90 shadow-xs rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 pointer-events-auto transition-shadow hover:shadow-md mr-3"
            >
              <div className="h-7 w-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
                <FileCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-slate-900 leading-tight">Voter ID & Certificates</div>
                <div className="text-[10px] text-slate-500 font-medium">Income, Caste & Birth</div>
              </div>
            </motion.div>

            <motion.div
              animate={floatRightBottom}
              className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xs border border-indigo-200/90 shadow-xs rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 pointer-events-auto transition-shadow hover:shadow-md"
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
