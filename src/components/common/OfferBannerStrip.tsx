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

  // Graceful empty state: render nothing if no published content block or if dismissed by user
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
        className="bg-blue-700 text-white border-b border-blue-600/80 text-xs font-semibold relative z-50 overflow-hidden shadow-xs"
      >
        {/* Subtle Ambient Radial Lighting Glows */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 w-48 h-20 bg-blue-500/15 rounded-full blur-2xl pointer-events-none motion-reduce:hidden" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-20 bg-amber-500/10 rounded-full blur-2xl pointer-events-none motion-reduce:hidden" />

        <div className="max-w-6xl mx-auto px-4 py-2 sm:px-6 flex items-center justify-between gap-3 relative z-10">
          {/* Announcement / Offer Tag & Clean Plain Text Copy */}
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider shrink-0 shadow-sm border border-amber-300/40 hover:scale-[1.03] transition-transform duration-200">
              <motion.span
                animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                className="inline-block motion-reduce:animate-none"
              >
                {isOffer ? <Sparkles className="h-3 w-3 text-slate-950" /> : <Megaphone className="h-3 w-3 text-slate-950" />}
              </motion.span>
              <span>{isOffer ? "Special Offer" : "Announcement"}</span>
            </span>

            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="truncate text-xs sm:text-sm font-semibold text-slate-100 leading-tight"
            >
              <span className="font-extrabold text-white tracking-tight">{activeBlock.title}</span>
              {cleanBodyText && (
                <span className="hidden sm:inline font-normal text-slate-300 ml-2.5 border-l border-blue-800/80 pl-2.5">
                  {cleanBodyText}
                </span>
              )}
            </motion.div>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 focus:outline-none"
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
