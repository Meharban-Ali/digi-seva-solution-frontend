import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { stripHtml } from "@/lib/htmlUtils";
import { Sparkles, Megaphone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function OfferBannerStrip() {
  const { data: offerBlocks } = useContent("OFFER");
  const { data: announcementBlocks } = useContent("ANNOUNCEMENT");
  const [dismissed, setDismissed] = useState(false);

  // Combine and sort published OFFER and ANNOUNCEMENT blocks by displayOrder
  const allBannerBlocks = [
    ...(offerBlocks || []),
    ...(announcementBlocks || []),
  ].sort((a, b) => a.displayOrder - b.displayOrder);

  const activeBlock = allBannerBlocks.length > 0 ? allBannerBlocks[0] : null;

  // Check sessionStorage for dismissal of the active block ID
  useEffect(() => {
    if (activeBlock) {
      const isDismissed = sessionStorage.getItem(`dismissed_banner_${activeBlock.id}`) === "true";
      setDismissed(isDismissed);
    } else {
      setDismissed(false);
    }
  }, [activeBlock]);

  if (!activeBlock || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    if (activeBlock) {
      sessionStorage.setItem(`dismissed_banner_${activeBlock.id}`, "true");
    }
  };

  const isOffer = activeBlock.section === "OFFER";
  const cleanBodyText = stripHtml(activeBlock.body);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#0B2046] text-white border-b border-blue-900/60 text-xs font-semibold relative z-50 overflow-hidden shadow-xs"
      >
        {/* Subtle Ambient Radial Lighting Glows */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 w-48 h-20 bg-orange-500/10 rounded-full blur-2xl pointer-events-none motion-reduce:hidden" />

        <div className="max-w-6xl mx-auto px-4 py-2 sm:px-6 flex items-center justify-between gap-2.5 sm:gap-3 relative z-10">
          {/* Static Left Group: Badge & Heading Title */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 border-r border-blue-800/80 pr-2.5 sm:pr-3">
            <span className="inline-flex items-center gap-1.5 bg-accent text-white font-black px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider shrink-0 shadow-sm border border-orange-400/40 hover:scale-[1.03] transition-transform duration-200">
              <motion.span
                animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                className="inline-block motion-reduce:animate-none"
              >
                {isOffer ? <Sparkles className="h-3 w-3 text-white" /> : <Megaphone className="h-3 w-3 text-white" />}
              </motion.span>
              <span>{isOffer ? "Special Offer" : "Announcement"}</span>
            </span>

            <span className="font-extrabold text-white text-xs sm:text-sm tracking-tight whitespace-nowrap">
              {activeBlock.title}
            </span>
          </div>

          {/* Horizontally Scrolling Marquee/Ticker Area for Body Text */}
          {cleanBodyText ? (
            <div className="overflow-hidden flex-1 min-w-0 relative flex items-center h-5 select-none">
              <motion.div
                key={`${activeBlock.id}-${cleanBodyText}`}
                className="whitespace-nowrap inline-block text-xs sm:text-sm font-normal text-slate-200"
                initial={{ x: "100%" }}
                animate={{ x: "-100%" }}
                transition={{
                  repeat: Infinity,
                  ease: "linear",
                  duration: Math.max(16, cleanBodyText.length * 0.22),
                }}
              >
                {cleanBodyText}
              </motion.div>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 focus:outline-none z-20"
            aria-label="Dismiss offer banner"
            title="Dismiss notification strip"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default OfferBannerStrip;
