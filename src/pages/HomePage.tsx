import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useContent } from "@/hooks/useContent";
import { useServices } from "@/hooks/useServices";
import { stripHtml } from "@/lib/htmlUtils";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Zap,
  Globe,
  Clock,
  Code,
  Smartphone,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Star,
} from "lucide-react";

export function HomePage() {
  const { t } = useTranslation();
  const { data: banners } = useContent("HOME_BANNER");
  const { data: services, isLoading: isServicesLoading } = useServices();

  const heroBanner = banners && banners.length > 0 ? banners[0] : null;
  const featuredServices = services ? services.slice(0, 4) : [];
  const totalServicesCount = services ? services.length : 15;

  return (
    <div className="space-y-12 pb-12">
      {/* 1. Refined Hero Banner Section (Deep Royal Indigo & Gold Accents) */}
      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white py-14 sm:py-20 px-4 sm:px-6 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hero Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 bg-accent-gold/15 text-amber-300 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-xs">
              <ShieldCheck className="h-4 w-4 text-accent-gold shrink-0" />
              <span>Jan Seva Kendra • New Ashok Nagar, Delhi</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white max-w-2xl">
              {heroBanner ? heroBanner.title : t("hero.defaultTitle")}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              {heroBanner ? stripHtml(heroBanner.body) : t("hero.defaultSubtitle")}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5">
              <Button asChild size="lg" className="w-full sm:w-auto font-bold bg-primary hover:bg-primary-light text-white shadow-lg shadow-blue-950/40">
                <Link to="/services">
                  <span>{t("common.viewAllServices")}</span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold backdrop-blur-xs transition-colors"
              >
                <Link to="/about">
                  <span>{t("nav.about")}</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Hero Visual Artwork Graphic (Desktop) */}
          <div className="lg:col-span-5 hidden lg:flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 opacity-30 blur-lg"></div>
              <div className="relative bg-slate-900/90 border border-slate-700/80 backdrop-blur-md rounded-2xl p-6 text-white shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      Center Operational
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-accent-gold text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>Official CSC</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center gap-3">
                    <div className="bg-primary/20 text-primary-light p-2 rounded-lg">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Authorized CSC Portal</h4>
                      <p className="text-[11px] text-slate-400">Aadhaar, PAN & Government Registrations</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center gap-3">
                    <div className="bg-amber-500/20 text-accent-gold p-2 rounded-lg">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Transparent Fees</h4>
                      <p className="text-[11px] text-slate-400">Government standard rates with receipts</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center gap-3">
                    <div className="bg-indigo-500/20 text-indigo-400 p-2 rounded-lg">
                      <Code className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Digital & App Solutions</h4>
                      <p className="text-[11px] text-slate-400">Custom web development & software apps</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Delhi CSC Reg.</span>
                  <span className="text-emerald-400 font-bold">Open Daily 7AM–12AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. "Why Choose Us" Trust Strip (Refined Colors) */}
      <section className="bg-slate-950 border-b border-slate-800 text-slate-200 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-accent-gold uppercase tracking-widest">
              {t("trust.badge")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Point 1: Authorized CSC */}
            <div className="flex items-start gap-3.5 bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="bg-primary/20 text-primary-light p-2.5 rounded-lg shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">{t("trust.item1Title")}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{t("trust.item1Desc")}</p>
              </div>
            </div>

            {/* Point 2: Fast & Reliable */}
            <div className="flex items-start gap-3.5 bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="bg-amber-500/20 text-accent-gold p-2.5 rounded-lg shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">{t("trust.item2Title")}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{t("trust.item2Desc")}</p>
              </div>
            </div>

            {/* Point 3: Bilingual Support */}
            <div className="flex items-start gap-3.5 bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="bg-emerald-500/20 text-emerald-400 p-2.5 rounded-lg shrink-0">
                <Globe className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">{t("trust.item3Title")}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{t("trust.item3Desc")}</p>
              </div>
            </div>

            {/* Point 4: Open 7 Days */}
            <div className="flex items-start gap-3.5 bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="bg-indigo-500/20 text-indigo-400 p-2.5 rounded-lg shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">{t("trust.item4Title")}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{t("trust.item4Desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Real Data Stats Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-slate-100">
          <div className="p-2 space-y-1">
            <p className="text-3xl font-black text-primary">{totalServicesCount}+</p>
            <p className="text-xs text-slate-600 font-semibold">{t("stats.servicesCount")}</p>
          </div>
          <div className="p-2 space-y-1">
            <p className="text-3xl font-black text-slate-900">2</p>
            <p className="text-xs text-slate-600 font-semibold">{t("stats.partnersCount")}</p>
          </div>
          <div className="p-2 space-y-1">
            <p className="text-3xl font-black text-indigo-600">7 Days</p>
            <p className="text-xs text-slate-600 font-semibold">{t("stats.daysCount")}</p>
          </div>
          <div className="p-2 space-y-1">
            <p className="text-3xl font-black text-emerald-600">100%</p>
            <p className="text-xs text-slate-600 font-semibold">{t("stats.transparencyCount")}</p>
          </div>
        </div>
      </section>

      {/* 4. Featured Business Services Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t("services.title")}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {t("services.subtitle")}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0 border-slate-300">
            <Link to="/services">
              <span>{t("common.viewAllServices")}</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Loading Skeletons */}
        {isServicesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : featuredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <Card className="bg-slate-100/70 border-dashed text-center py-10">
            <CardContent className="space-y-2">
              <FileCheck className="h-10 w-10 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">{t("common.noServicesFound")}</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* 5. Distinct "Web & App Development" / Digital Solutions Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden space-y-8">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>

          {/* Header */}
          <div className="space-y-3 max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>{t("digitalDev.badge")}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {t("digitalDev.title")}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              {t("digitalDev.subtitle")}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-indigo-500/40 transition-colors">
              <div className="bg-indigo-500/20 text-indigo-400 p-3 rounded-xl w-fit">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-white text-base">{t("digitalDev.webTitle")}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t("digitalDev.webDesc")}
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-indigo-500/40 transition-colors">
              <div className="bg-emerald-500/20 text-emerald-400 p-3 rounded-xl w-fit">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-white text-base">{t("digitalDev.appTitle")}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t("digitalDev.appDesc")}
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-indigo-500/40 transition-colors">
              <div className="bg-amber-500/20 text-amber-400 p-3 rounded-xl w-fit">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-white text-base">{t("digitalDev.setupTitle")}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t("digitalDev.setupDesc")}
              </p>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80 relative z-10">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Direct consultation with operating partner software engineers</span>
            </div>
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg"
            >
              <Link to="/contact?service=Web+%26+App+Development">
                <span>{t("digitalDev.ctaButton")}</span>
                <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
