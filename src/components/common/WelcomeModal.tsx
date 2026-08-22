import { useState, useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { stripHtml } from "@/lib/htmlUtils";
import { Sparkles, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function WelcomeModal() {
  const { data: popupBlocks, isLoading } = useContent("WELCOME_POPUP");

  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(100);

  // Active published block from public content API
  const activeBlock = (popupBlocks && popupBlocks.length > 0) ? popupBlocks[0] : null;

  useEffect(() => {
    if (activeBlock && !isLoading) {
      const isDismissed = sessionStorage.getItem(`dismissed_welcome_popup_${activeBlock.id}`) === "true";
      if (!isDismissed) {
        // Delay opening slightly for a smooth entrance
        const timer = setTimeout(() => setIsOpen(true), 600);
        return () => clearTimeout(timer);
      }
    }
  }, [activeBlock, isLoading]);

  // Auto-dismiss countdown timer (admin-configurable via activeBlock.displayOrder, default 15s)
  useEffect(() => {
    if (!isOpen) return;

    const durationSeconds =
      activeBlock && activeBlock.displayOrder && activeBlock.displayOrder > 0
        ? activeBlock.displayOrder
        : 15;
    const duration = durationSeconds * 1000;
    const intervalTime = 50; // update progress every 50ms
    const step = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(interval);
          handleClose();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isOpen, activeBlock]);

  const handleClose = () => {
    setIsOpen(false);
    if (activeBlock) {
      sessionStorage.setItem(`dismissed_welcome_popup_${activeBlock.id}`, "true");
    }
  };

  if (!isOpen || !activeBlock) {
    return null;
  }

  const cleanBodyText = stripHtml(activeBlock.body || "");

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 relative overflow-hidden flex flex-col space-y-4"
        >
          {/* Top Animated Auto-Dismiss Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Modal Header */}
          <div className="flex items-start justify-between gap-3 pt-1">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Jan Seva Kendra • Notice</span>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Close welcome notice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Title & Body */}
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {activeBlock.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {cleanBodyText}
            </p>
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <Button
              onClick={handleClose}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2 px-5 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Got It / Continue</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default WelcomeModal;
