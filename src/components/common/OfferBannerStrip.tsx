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
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="bg-accent-gold text-slate-950 border-b border-amber-600/30 text-xs font-bold relative z-40 overflow-hidden shadow-2xs"
      >
        <div className="max-w-6xl mx-auto px-4 py-2 sm:px-6 flex items-center justify-between gap-3">
          {/* Announcement / Offer Tag & Clean Plain Text Copy */}
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            <span className="inline-flex items-center gap-1 bg-slate-950 text-amber-300 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0 shadow-2xs">
              {isOffer ? <Sparkles className="h-3 w-3 text-accent-gold" /> : <Megaphone className="h-3 w-3 text-accent-gold" />}
              {isOffer ? "Special Offer" : "Announcement"}
            </span>

            <div className="truncate text-xs sm:text-sm font-bold text-slate-950 leading-tight">
              <span className="font-black">{activeBlock.title}</span>
              {cleanBodyText && (
                <span className="hidden sm:inline font-semibold text-slate-900 ml-2 border-l border-slate-950/20 pl-2">
                  {cleanBodyText}
                </span>
              )}
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="p-1 rounded-md text-slate-950 hover:bg-slate-950/10 transition-colors shrink-0 focus:outline-none"
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
