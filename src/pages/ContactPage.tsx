import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, EnquiryFormData } from "@/schemas/enquirySchema";
import { useSubmitEnquiry } from "@/hooks/useSubmitEnquiry";
import { useServices } from "@/hooks/useServices";
import { getDiagnosticErrorMessage } from "@/lib/errorUtils";
import { GoogleMapEmbed } from "@/components/common/GoogleMapEmbed";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Send,
  MapPin,
  Clock,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

import { WhatsAppIcon } from "@/components/common/WhatsAppButton";

export function ContactPage() {
  const { t } = useTranslation();
  const [successSubmitted, setSuccessSubmitted] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  const { data: services } = useServices();
  const submitEnquiryMutation = useSubmitEnquiry();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      serviceId: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<EnquiryFormData> = (formData) => {
    setSuccessSubmitted(false);
    setRateLimitError(null);

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email ? formData.email : undefined,
      serviceId: formData.serviceId && formData.serviceId !== "" ? Number(formData.serviceId) : undefined,
      message: formData.message ? formData.message : undefined,
    };

    submitEnquiryMutation.mutate(payload, {
      onSuccess: () => {
        setSuccessSubmitted(true);
        reset();
      },
      onError: (err) => {
        if (err.response?.status === 429) {
          const backendMsg = err.response.data?.message || t("contact.rateLimitTitle");
          setRateLimitError(backendMsg);
        }
      },
    });
  };

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919999999999";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    t("contact.whatsappDefaultMsg")
  )}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4" /> Jan Seva Kendra Helpdesk
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t("contact.title")}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {t("contact.subtitle")}
        </p>
      </div>

      {/* Main Grid: Enquiry Form & Contact Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Enquiry Form (7 Columns on large screen) */}
        <Card className="lg:col-span-7 shadow-md border-slate-200">
          <CardHeader className="border-b bg-slate-900 text-white p-6">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              {t("contact.formTitle")}
            </CardTitle>
            <CardDescription className="text-slate-300 text-xs">
              Fill in your details below and our partners in New Ashok Nagar will respond promptly.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Success Alert Banner */}
            {successSubmitted && (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-3 animate-in fade-in">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-emerald-900">{t("contact.successTitle")}</h4>
                  <p className="text-xs text-emerald-700">{t("contact.successDesc")}</p>
                </div>
              </div>
            )}

            {/* HTTP 429 Rate Limit Error Alert Banner */}
            {rateLimitError && (
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-300 flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-amber-900">{t("contact.rateLimitTitle")} (HTTP 429)</h4>
                  <p className="text-xs text-amber-800">{rateLimitError}</p>
                </div>
              </div>
            )}

            {/* General Mutation Error Banner */}
            {submitEnquiryMutation.isError && !rateLimitError && (
              <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-700 font-medium">
                  {getDiagnosticErrorMessage(submitEnquiryMutation.error, t("common.error"))}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t("contact.nameLabel")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder={t("contact.namePlaceholder")}
                  className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.name ? "border-rose-500" : "border-slate-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-rose-600 font-medium">{t(errors.name.message as string)}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t("contact.phoneLabel")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  placeholder={t("contact.phonePlaceholder")}
                  className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.phone ? "border-rose-500" : "border-slate-300"
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-rose-600 font-medium">{t(errors.phone.message as string)}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t("contact.emailLabel")}
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder={t("contact.emailPlaceholder")}
                  className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.email ? "border-rose-500" : "border-slate-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-rose-600 font-medium">{t(errors.email.message as string)}</p>
                )}
              </div>

              {/* Service Dropdown Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t("contact.serviceLabel")}
                </label>
                <select
                  {...register("serviceId")}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">{t("contact.selectServicePlaceholder")}</option>
                  {services &&
                    services.map((s) => (
                      <option key={s.id} value={String(s.id)}>
                        {s.name} ({s.category === "VISIT_REQUIRED" ? t("categories.visitRequired") : t("categories.online")})
                      </option>
                    ))}
                </select>
              </div>

              {/* Message Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t("contact.messageLabel")}
                </label>
                <textarea
                  rows={4}
                  {...register("message")}
                  placeholder={t("contact.messagePlaceholder")}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitEnquiryMutation.isPending}
                className="w-full font-bold bg-primary hover:bg-primary/90 text-white"
              >
                {submitEnquiryMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    {t("contact.submitting")}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" />
                    {t("contact.submitButton")}
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info & WhatsApp Shortcut (5 Columns on large screen) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct WhatsApp CTA Card */}
          <Card className="bg-emerald-900 text-white border-emerald-800 shadow-md">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-[#25D366]/20 p-2.5 rounded-lg text-[#25D366]">
                  <WhatsAppIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Instant WhatsApp Chat</h3>
                  <p className="text-xs text-emerald-200">Connect directly with center owners</p>
                </div>
              </div>
              <p className="text-sm text-emerald-100 leading-relaxed">
                Need urgent document guidance or service inquiry? Send us a message on WhatsApp for fast response.
              </p>
              <Button asChild className="w-full font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md border-0">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  <WhatsAppIcon className="h-4 w-4" />
                  Chat on WhatsApp Now
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Business Details Card */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Center Location</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{t("about.address")}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 border-t pt-3">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Working Hours</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{t("about.timingDetails")}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 border-t pt-3">
                <PhoneCall className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Direct Phone Inquiry</h4>
                  <p className="text-xs font-mono text-slate-700 mt-0.5">+{whatsappNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Google Maps Embed Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          {t("contact.mapTitle")}
        </h3>
        <GoogleMapEmbed />
      </div>
    </div>
  );
}

export default ContactPage;
