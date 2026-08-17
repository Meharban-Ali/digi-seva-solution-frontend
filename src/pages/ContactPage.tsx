import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, EnquiryFormData } from "@/schemas/enquirySchema";
import { useSubmitEnquiry } from "@/hooks/useSubmitEnquiry";
import { useServices } from "@/hooks/useServices";
import { getDiagnosticErrorMessage } from "@/lib/errorUtils";
import { GoogleMapEmbed } from "@/components/common/GoogleMapEmbed";
import { SeoHead } from "@/components/common/SeoHead";
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
  const [searchParams] = useSearchParams();
  const initialServiceQuery = searchParams.get("service");

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
      message: initialServiceQuery ? `Inquiry regarding: ${initialServiceQuery}` : "",
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
      <SeoHead
        title="Contact Us - Digi Seva Solution | New Ashok Nagar, Delhi"
        description="Get in touch with Digi Seva Solution in New Ashok Nagar, Delhi. Send an online enquiry or connect directly via WhatsApp."
        path="/contact"
      />
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-accent-gold/15 text-accent-gold-dark border border-amber-300/40 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 text-accent-gold-dark" /> Jan Seva Kendra Helpdesk
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
        <Card className="lg:col-span-7 shadow-md border-slate-200 overflow-hidden">
          <CardHeader className="border-b bg-slate-950 text-white p-6">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Send className="h-5 w-5 text-accent-gold" />
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
                  className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary ${
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
                  className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary ${
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
                  className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary ${
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
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>

              <Button
                type="submit"
                disabled={submitEnquiryMutation.isPending}
                className="w-full font-bold bg-primary hover:bg-primary-light text-white mt-2 shadow-md"
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

        {/* Side Cards: Direct WhatsApp CTA & Operational Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct WhatsApp Callout Card */}
          <Card className="border-[#25D366]/40 bg-emerald-950 text-white shadow-lg overflow-hidden relative">
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#25D366]/10 rounded-full blur-2xl pointer-events-none"></div>
            <CardHeader className="p-6 pb-3 space-y-1">
              <div className="flex items-center space-x-2 text-[#25D366]">
                <WhatsAppIcon className="h-6 w-6" />
                <span className="font-extrabold text-sm uppercase tracking-wider">Instant Assistance</span>
              </div>
              <CardTitle className="text-xl font-black text-white">Chat Directly on WhatsApp</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect directly with our operating partners in New Ashok Nagar for instant document inquiry and application guidance.
              </p>
              <Button
                asChild
                className="w-full font-bold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 shadow-md flex items-center justify-center gap-2"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="h-5 w-5 fill-slate-950" />
                  <span>Start WhatsApp Chat</span>
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Operational Info Card */}
          <Card className="border-slate-200 bg-white shadow-sm space-y-4 p-6">
            <div className="flex items-start space-x-3">
              <div className="bg-amber-50 text-accent-gold-dark border border-amber-200 p-2.5 rounded-lg shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Center Location</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t("about.address")}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-start space-x-3">
              <div className="bg-blue-50 text-primary border border-blue-200 p-2.5 rounded-lg shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{t("about.timingTitle")}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t("about.timingDetails")}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{t("about.timingSubnote")}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-start space-x-3">
              <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-2.5 rounded-lg shrink-0">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Direct Phone & WhatsApp</h4>
                <p className="text-xs text-slate-600 mt-1 font-mono">{whatsappNumber}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Embedded Google Map Section */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          {t("contact.mapTitle")}
        </h2>
        <GoogleMapEmbed height="350px" />
      </section>
    </div>
  );
}

export default ContactPage;
