import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPublicTestimonials } from "@/features/testimonial/testimonialApi";
import { TestimonialResponse } from "@/types/testimonial.types";
import { motion } from "framer-motion";
import { Star, Quote, Sparkles, CheckCircle2 } from "lucide-react";

export function TestimonialsSection() {
  const { t, i18n } = useTranslation();
  const [testimonials, setTestimonials] = useState<TestimonialResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const data = await getPublicTestimonials();
        setTestimonials(data || []);
      } catch {
        setTestimonials([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  if (!isLoading && testimonials.length === 0) {
    return null;
  }

  const isHindi = i18n.language === "hi";

  return (
    <section className="bg-slate-50/80 py-12 border-y border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-2 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 bg-orange-50 text-accent-dark border border-orange-200 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>{t("testimonials.verifiedCustomer", "Verified Customer Feedback")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t("testimonials.sectionTitle", "What Our Customers Say")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t("testimonials.subtitle", "Real experiences from citizens we've served.")}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-slate-200/70 animate-pulse rounded-2xl border border-slate-200"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((item, index) => {
              const reviewText =
                isHindi && item.reviewHi && item.reviewHi.trim()
                  ? item.reviewHi
                  : item.reviewEn;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="h-full"
                >
                  <div className="h-full bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between relative overflow-hidden">
                    {/* Subtle quote accent background icon */}
                    <Quote className="absolute right-4 top-4 h-12 w-12 text-slate-100/90 -rotate-12 pointer-events-none group-hover:text-orange-50 transition-colors" />

                    <div className="space-y-3.5 relative z-10">
                      {/* Star Rating Display */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= item.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200 fill-slate-100"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Review Content */}
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed italic">
                        "{reviewText}"
                      </p>
                    </div>

                    {/* Customer Info Footer */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        {/* Avatar Initial */}
                        <div className="h-9 w-9 rounded-full bg-[#0B2046] text-white font-black flex items-center justify-center shrink-0 border border-slate-200 text-sm shadow-2xs">
                          {item.customerInitial || item.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                            {item.customerName}
                          </h4>
                          {item.serviceName && (
                            <span className="text-[11px] font-semibold text-slate-500 block truncate max-w-[170px]">
                              {item.serviceName}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>{t("testimonials.verifiedCustomer", "Verified")}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default TestimonialsSection;
