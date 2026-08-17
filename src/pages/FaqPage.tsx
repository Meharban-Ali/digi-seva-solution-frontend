import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useContent } from "@/hooks/useContent";
import { stripHtml } from "@/lib/htmlUtils";
import { SeoHead } from "@/components/common/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Search,
  ChevronDown,
  MessageSquare,
  Sparkles,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WhatsAppIcon } from "@/components/common/WhatsAppButton";

export function FaqPage() {
  const { t } = useTranslation();
  const { data: faqBlocks, isLoading, isError, refetch } = useContent("FAQ");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919999999999";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    t("contact.whatsappDefaultMsg")
  )}`;

  // Filter published FAQs by search query if typed
  const filteredFaqs = (faqBlocks || [])
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const plainBody = stripHtml(item.body).toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        plainBody.includes(q)
      );
    });

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <SeoHead
        title="Frequently Asked Questions - Digi Seva Solution"
        description="Find answers to common questions about Aadhaar updates, PAN processing times, center operating hours, and online vs in-person services."
        path="/faq"
      />
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-accent-gold/15 text-accent-gold-dark border border-amber-300/40 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
          <HelpCircle className="h-4 w-4 text-accent-gold-dark" /> Citizen Helpdesk & Guidance
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t("faq.title")}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {t("faq.subtitle")}
        </p>
      </div>

      {/* Search Input Bar */}
      {faqBlocks && faqBlocks.length > 0 && (
        <div className="relative max-w-xl mx-auto">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("faq.searchPlaceholder")}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-slate-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <Card className="border-rose-200 bg-rose-50/50 p-6 text-center">
            <CardContent className="space-y-3 pt-2">
              <p className="text-sm text-rose-700 font-medium">Failed to load FAQs.</p>
              <Button size="sm" onClick={() => refetch()} variant="outline">
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : !faqBlocks || faqBlocks.length === 0 ? (
          /* Graceful Empty State when no FAQs published */
          <Card className="border-amber-200 bg-amber-50/40 p-8 text-center shadow-xs">
            <CardContent className="space-y-3 pt-4 max-w-md mx-auto">
              <Sparkles className="h-10 w-10 text-amber-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">{t("faq.emptyTitle")}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t("faq.emptyDesc")}
              </p>
              <Button asChild size="sm" className="bg-primary text-white font-bold mt-2">
                <Link to="/contact">
                  <span>{t("faq.askQuestionBtn")}</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : filteredFaqs.length === 0 ? (
          /* Filtered search 0 results */
          <div className="text-center py-10 space-y-2 bg-white rounded-xl border border-slate-200 p-6">
            <Inbox className="h-8 w-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700">{t("faq.noSearchResults")}</p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-primary hover:underline"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          /* Accordion Expandable List */
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.id}
                  className={`border rounded-xl bg-white overflow-hidden transition-all duration-200 ${
                    isOpen ? "border-primary/60 shadow-md ring-1 ring-primary/20" : "border-slate-200 hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center shrink-0">
                        Q{index + 1}
                      </span>
                      <span>{faq.title}</span>
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed pl-14">
                          <div
                            className="prose prose-slate max-w-none text-slate-700"
                            dangerouslySetInnerHTML={{ __html: faq.body }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Still Have Questions CTA Banner */}
      <Card className="bg-slate-950 text-white shadow-lg border-slate-800 overflow-hidden">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <MessageSquare className="h-5 w-5 text-accent-gold" />
              {t("faq.contactPromptTitle")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              {t("faq.contactPromptSub")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <Button asChild className="font-bold bg-primary hover:bg-primary-light text-white shadow-md">
              <Link to="/contact">
                <span>{t("faq.askQuestionBtn")}</span>
              </Link>
            </Button>
            <Button
              asChild
              className="font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 shadow-md flex items-center justify-center gap-2"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-4 w-4 fill-slate-950" />
                <span>WhatsApp Chat</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FaqPage;
