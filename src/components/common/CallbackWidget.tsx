import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, X, CheckCircle2, AlertCircle, Clock, User, Phone, Sparkles } from "lucide-react";
import { submitCallbackRequest } from "@/features/callback/callbackApi";
import { getDiagnosticErrorMessage } from "@/lib/errorUtils";

const phoneRegex = /^[6-9]\d{9}$|^$|^\+?[1-9]\d{1,14}$/;

const callbackSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  phone: z.string().trim().regex(phoneRegex, "Enter a valid 10-digit mobile number"),
  preferredTime: z.string().optional(),
});

type CallbackFormData = z.infer<typeof callbackSchema>;

export function CallbackWidget() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CallbackFormData>({
    resolver: zodResolver(callbackSchema),
    defaultValues: {
      name: "",
      phone: "",
      preferredTime: "Any Time",
    },
  });

  const onSubmit = async (data: CallbackFormData) => {
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await submitCallbackRequest({
        name: data.name,
        phone: data.phone,
        preferredTime: data.preferredTime,
      });
      const msg = t("callback.success", "We'll call you back soon!");
      setSuccessMsg(msg);
      reset();

      // Auto close after 3.5 seconds
      setTimeout(() => {
        setIsOpen(false);
        setSuccessMsg(null);
      }, 3500);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const resp = (err as { response?: { status?: number } }).response;
        if (resp?.status === 429) {
          setErrorMsg(t("callback.tooManyRequests", "Too many requests, please try after some time."));
          setSubmitting(false);
          return;
        }
      }
      setErrorMsg(getDiagnosticErrorMessage(err, "Failed to submit callback request"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed left-4 bottom-20 sm:bottom-6 z-40 selection:bg-accent selection:text-white">
      {/* Expanded Form Popup Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-accent text-white shadow-md shadow-accent/20">
                  <PhoneCall className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
                    {t("callback.formTitle", "Request a Callback")}
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  </h4>
                  <p className="text-[11px] text-slate-400">Leave details & we will reach you!</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Close form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {successMsg ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in fade-in">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-emerald-900">{successMsg}</p>
                  <p className="text-xs text-emerald-700">Our representative will call your number shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
                      <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Name Field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <User className="h-3 w-3 text-slate-400" />
                      {t("callback.name", "Your Name")} *
                    </label>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder={t("callback.namePlaceholder", "Enter your full name")}
                      className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.name ? "border-rose-500" : "border-slate-300"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-rose-500 font-medium">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-slate-400" />
                      {t("callback.phone", "Phone Number")} *
                    </label>
                    <input
                      type="tel"
                      maxLength={15}
                      {...register("phone")}
                      placeholder={t("callback.phonePlaceholder", "Enter 10-digit mobile number")}
                      className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.phone ? "border-rose-500" : "border-slate-300"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-rose-500 font-medium">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Preferred Time Dropdown */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {t("callback.preferredTime", "Preferred Time")}
                    </label>
                    <select
                      {...register("preferredTime")}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 font-medium"
                    >
                      <option value="Any Time">{t("callback.anyTime", "Any Time")}</option>
                      <option value="Morning (7AM - 12PM)">{t("callback.morning", "Morning (7AM - 12PM)")}</option>
                      <option value="Afternoon (12PM - 5PM)">{t("callback.afternoon", "Afternoon (12PM - 5PM)")}</option>
                      <option value="Evening (5PM - 12AM)">{t("callback.evening", "Evening (5PM - 12AM)")}</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-dark text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {submitting ? (
                      <>
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>{t("callback.submitting", "Requesting...")}</span>
                      </>
                    ) : (
                      <>
                        <PhoneCall className="h-3.5 w-3.5" />
                        <span>{t("callback.submit", "Request Callback")}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-primary text-white shadow-xl hover:bg-primary-dark border border-white/20 transition-all cursor-pointer group"
        aria-label="Toggle Call Me Back Form"
      >
        <div className="p-1 rounded-full bg-accent text-white group-hover:rotate-12 transition-transform">
          <PhoneCall className="h-4 w-4" />
        </div>
        <span className="text-xs font-extrabold tracking-wide pr-1">
          {t("callback.buttonText", "Call Me Back")}
        </span>
      </motion.button>
    </div>
  );
}

export default CallbackWidget;
