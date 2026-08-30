import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useContent } from "@/hooks/useContent";
import { useServices } from "@/hooks/useServices";
import { stripHtml } from "@/lib/htmlUtils";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ProjectsShowcase } from "@/components/home/ProjectsShowcase";
import { VideoSection } from "@/components/home/VideoSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SeoHead } from "@/components/common/SeoHead";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Clock,
  Code,
  ChevronRight,
  FileText,
  Cpu,
  MapPin,
  PhoneCall,
  Laptop,
  Sparkles,
  Search,
  FileCheck,
  Award,
  Building2,
  Landmark,
} from "lucide-react";

export function HomePage() {
  const { t } = useTranslation();
  const { data: banners } = useContent("HOME_BANNER");
  const { data: allServices, isLoading: isServicesLoading } = useServices();

  const heroBanner = banners && banners.length > 0 ? banners[0] : null;

  // Filter Citizen / CSC Government Services (excluding IT category ID 19 / java-it-services)
  const citizenServices = (allServices || [])
    .filter((s) => s.categoryId !== 19 && s.categorySlug !== "java-it-services")
    .slice(0, 8);

  // Filter IT / Software Services for dedicated Homepage Section 6
  const itServices = (allServices || []).filter(
    (s) =>
      s.categoryId === 19 ||
      s.categorySlug === "java-it-services" ||
      s.name.toLowerCase().includes("development") ||
      s.name.toLowerCase().includes("software")
  );

  const totalServicesCount = allServices ? allServices.length : 16;

  // Helper to dynamically render price or enquire badge for Quick Services Panel
  const renderQuickServiceBadge = (keyword: string) => {
    if (!allServices || allServices.length === 0) {
      return (
        <span className="text-xs font-semibold text-slate-500 group-hover:text-accent-dark shrink-0 flex items-center gap-1 transition-colors">
          <span>{t("common.enquire", "Enquire")}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      );
    }
    const found = allServices.find((s) => s.name.toLowerCase().includes(keyword.toLowerCase()));
    if (found && found.price != null && Number(found.price) > 0) {
      return (
        <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 shrink-0 font-mono">
          ₹{found.price}
        </span>
      );
    }
    return (
      <span className="text-xs font-semibold text-slate-500 group-hover:text-accent-dark shrink-0 flex items-center gap-1 transition-colors">
        <span>{t("common.enquire", "Enquire")}</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    );
  };

  return (
    <div className="space-y-12 pb-12 bg-slate-50/50">
      <SeoHead
        title="Digi Seva Solution - Aadhaar, PAN & Government Services in New Ashok Nagar, Delhi"
        description="Digi Seva Solution is your trusted Jan Seva Kendra (CSC Center) in New Ashok Nagar, Delhi. Services: Aadhaar update, PAN card, AEPS banking, RTO, income certificate, ITR filing, GST registration, Axis Bank & SBI account opening, web development, app development, Java software development."
        path="/"
      />

      {/* 1. Institutional Light Hero Section (csc.gov.in / e-District Light Portal Style) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Official Heading & Details */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-200 bg-white">
            <div className="inline-flex items-center gap-2 bg-orange-50 text-accent-dark border border-orange-200 px-3.5 py-1.5 rounded-full text-xs font-extrabold w-fit">
              <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
              <span>{t("hero.authorizedBadge", "Authorized Jan Seva Kendra • CSC Portal")}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-slate-900">
              {heroBanner ? heroBanner.title : t("hero.defaultTitle")}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              {heroBanner ? stripHtml(heroBanner.body) : t("hero.defaultSubtitle")}
            </p>

            {/* Dynamic Service Count Highlight */}
            <div className="inline-flex items-center gap-2 bg-slate-100/90 text-slate-800 border border-slate-200 px-3.5 py-1.5 rounded-md text-xs font-extrabold w-fit">
              <Sparkles className="h-4 w-4 text-accent shrink-0" />
              <span>
                {allServices && allServices.length > 0
                  ? t("hero.servicesAvailable", { count: allServices.length })
                  : t("hero.servicesAvailableFallback", "13+ Government & Digital Services Available")}
              </span>
            </div>

            <div className="pt-1 flex flex-col sm:flex-row items-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto font-bold bg-accent hover:bg-accent-dark text-white shadow-md">
                <Link to="/services">
                  <span>{t("common.viewAllServices")}</span>
                  <ArrowRight className="h-4 w-4 ml-2 text-white" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold transition-colors"
              >
                <Link to="/contact#map">
                  <MapPin className="h-4 w-4 mr-2 text-accent" />
                  <span>{t("hero.findUsOnMap", "Find Us on Map")}</span>
                </Link>
              </Button>
            </div>

            {/* Partners & Authorizations Strip */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                {t("hero.partnersTitle", "Partners & Authorizations")}
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-slate-800">
                <div className="px-2 py-0.5 bg-slate-50 border border-slate-200/90 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-2xs whitespace-nowrap">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>{t("hero.partners.uidai", "UIDAI Authorized")}</span>
                </div>
                <div className="px-2 py-0.5 bg-slate-50 border border-slate-200/90 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-2xs whitespace-nowrap">
                  <Building2 className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  <span>{t("hero.partners.axisBank", "Axis Bank BC Partner")}</span>
                </div>
                <div className="px-2 py-0.5 bg-slate-50 border border-slate-200/90 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-2xs whitespace-nowrap">
                  <Landmark className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>{t("hero.partners.sbiBank", "SBI BC Partner")}</span>
                </div>
                <div className="px-2 py-0.5 bg-slate-50 border border-slate-200/90 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-2xs whitespace-nowrap">
                  <Award className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>{t("hero.partners.cscSpv", "CSC-SPV Registered")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Grounded Light Quick Citizen Services Panel */}
          <div className="lg:col-span-5 bg-slate-50/80 p-5 sm:p-6 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-accent" />
                Quick Services Access
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                CENTER ACTIVE
              </span>
            </div>

            <div className="space-y-1.5">
              <Link to="/services" className="p-2.5 px-3 bg-white hover:bg-orange-50/50 rounded-xl border border-slate-200 transition-all flex items-center justify-between group shadow-2xs">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-accent-dark transition-colors">Aadhaar Card Update & Correction</h4>
                  <p className="text-[11px] text-slate-500">Address, Mobile No., Biometric Update</p>
                </div>
                {renderQuickServiceBadge("aadhaar")}
              </Link>

              <Link to="/services" className="p-2.5 px-3 bg-white hover:bg-orange-50/50 rounded-xl border border-slate-200 transition-all flex items-center justify-between group shadow-2xs">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-accent-dark transition-colors">PAN Card Application & Correction</h4>
                  <p className="text-[11px] text-slate-500">New NSDL/UTI PAN Card Request</p>
                </div>
                {renderQuickServiceBadge("pan")}
              </Link>

              <Link to="/services" className="p-2.5 px-3 bg-white hover:bg-orange-50/50 rounded-xl border border-slate-200 transition-all flex items-center justify-between group shadow-2xs">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-accent-dark transition-colors">RTO Driving License Services</h4>
                  <p className="text-[11px] text-slate-500">Learner License & Slot Booking</p>
                </div>
                {renderQuickServiceBadge("driving")}
              </Link>

              <Link to="/services" className="p-2.5 px-3 bg-white hover:bg-orange-50/50 rounded-xl border border-slate-200 transition-all flex items-center justify-between group shadow-2xs">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-accent-dark transition-colors">Income, Caste & Residence Cert.</h4>
                  <p className="text-[11px] text-slate-500">e-District Delhi Portal Online Submission</p>
                </div>
                {renderQuickServiceBadge("income")}
              </Link>

              <Link to="/services" className="p-2.5 px-3 bg-white hover:bg-orange-50/50 rounded-xl border border-slate-200 transition-all flex items-center justify-between group shadow-2xs">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-accent-dark transition-colors">Voter ID Card Application</h4>
                  <p className="text-[11px] text-slate-500">NVSP Portal New Registration & Correction</p>
                </div>
                {renderQuickServiceBadge("voter")}
              </Link>

              <Link to="/services" className="p-2.5 px-3 bg-white hover:bg-orange-50/50 rounded-xl border border-slate-200 transition-all flex items-center justify-between group shadow-2xs">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-accent-dark transition-colors">AEPS Cash Withdrawal & Banking</h4>
                  <p className="text-[11px] text-slate-500">Aadhaar ATM, Balance & Account Opening</p>
                </div>
                {renderQuickServiceBadge("banking")}
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Biometric Machine Verified</span>
              <Link to="/services" className="text-accent-dark hover:underline font-bold flex items-center gap-1">
                View All {totalServicesCount} Services <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Real Service Verification Standards Strip */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-3 p-2">
            <ShieldCheck className="h-5 w-5 text-slate-900 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Authorized CSC Center</h4>
              <p className="text-[11px] text-slate-600">Official Government Services</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2 border-t sm:border-t-0 sm:border-l border-slate-100">
            <Zap className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Same-Day Processing</h4>
              <p className="text-[11px] text-slate-600">Fast application dispatch</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2 border-t lg:border-t-0 lg:border-l border-slate-100">
            <Globe className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Bilingual Assistance</h4>
              <p className="text-[11px] text-slate-600">Hindi & English support</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2 border-t lg:border-t-0 lg:border-l border-slate-100">
            <Clock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Open 7 Days a Week</h4>
              <p className="text-[11px] text-slate-600">7:00 AM – 12:00 AM Daily</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "How It Works" 5-Step Animated Process Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-2 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 bg-orange-50 text-accent-dark border border-orange-200 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>{t("howItWorks.badge")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t("howItWorks.title")}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t("howItWorks.subtitle")}
          </p>
        </motion.div>

        {/* 5-Step Process Container with connecting sequence line */}
        <div className="relative">
          {/* Desktop horizontal connecting sequence line */}
          <div className="hidden md:block absolute top-1/2 left-8 right-8 h-0.5 bg-slate-200 -z-10 -translate-y-8"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="h-full"
            >
              <Card className="h-full border-slate-200 shadow-2xs hover:shadow-md transition-all bg-white relative overflow-hidden group flex flex-col justify-between">
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-orange-50 text-accent-dark border border-orange-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Globe className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-black text-accent-dark bg-orange-100/80 px-2.5 py-0.5 rounded-full font-mono">01</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {t("howItWorks.step1Title")}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t("howItWorks.step1Desc")}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="h-full"
            >
              <Card className="h-full border-slate-200 shadow-2xs hover:shadow-md transition-all bg-white relative overflow-hidden group flex flex-col justify-between">
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Search className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-black text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full font-mono">02</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {t("howItWorks.step2Title")}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t("howItWorks.step2Desc")}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.19 }}
              className="h-full"
            >
              <Card className="h-full border-slate-200 shadow-2xs hover:shadow-md transition-all bg-white relative overflow-hidden group flex flex-col justify-between">
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <PhoneCall className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-black text-indigo-900 bg-indigo-100/80 px-2.5 py-0.5 rounded-full font-mono">03</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {t("howItWorks.step3Title")}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t("howItWorks.step3Desc")}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.26 }}
              className="h-full"
            >
              <Card className="h-full border-slate-200 shadow-2xs hover:shadow-md transition-all bg-white relative overflow-hidden group flex flex-col justify-between">
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-black text-emerald-900 bg-emerald-100/80 px-2.5 py-0.5 rounded-full font-mono">04</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {t("howItWorks.step4Title")}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t("howItWorks.step4Desc")}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Step 5 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.33 }}
              className="h-full"
            >
              <Card className="h-full border-slate-200 shadow-2xs hover:shadow-md transition-all bg-white relative overflow-hidden group flex flex-col justify-between">
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Award className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-black text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full font-mono">05</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {t("howItWorks.step5Title")}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t("howItWorks.step5Desc")}
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Citizen & Government Services Grid (Section 5) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
              JAN SEVA KENDRA CATALOG
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Government & Citizen Services
            </h2>
          </div>
          <Button asChild variant="outline" size="sm" className="font-bold text-xs shrink-0 border-slate-300 text-slate-800 hover:bg-slate-100">
            <Link to="/services">
              <span>View All Catalog ({totalServicesCount})</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        {isServicesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-48 bg-slate-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {citizenServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* 5.5. "See Our Services in Action" Video Showcase Section */}
      <VideoSection />

      {/* 6. Dedicated Light IT & Software Development Showcase (Section 6) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-2">
        <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-orange-50 text-accent-dark border border-orange-200 px-3 py-1 rounded-full text-xs font-bold">
                <Code className="h-3.5 w-3.5 text-accent" />
                <span>BUSINESS IT & SOFTWARE SOLUTIONS</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Software & Web Development Services
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Custom web applications, mobile apps, and business software tools built for business clients.
              </p>
            </div>

            <Button asChild size="sm" className="bg-accent hover:bg-accent-dark text-white font-bold shrink-0">
              <Link to="/contact">
                <span>Request IT Consultation</span>
                <ArrowRight className="h-4 w-4 ml-1.5 text-white" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {itServices.length > 0 ? (
              itServices.map((service) => (
                <div key={service.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs">
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-lg bg-orange-50 text-accent-dark border border-orange-200 flex items-center justify-center">
                      {service.name.toLowerCase().includes("web") ? (
                        <Globe className="h-5 w-5" />
                      ) : service.name.toLowerCase().includes("app") ? (
                        <Laptop className="h-5 w-5" />
                      ) : (
                        <Cpu className="h-5 w-5" />
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{service.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {service.description || "Professional software development and consulting services."}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-bold">{service.price && Number(service.price) > 0 ? `₹${service.price}` : "Contact for Pricing"}</span>
                    <Link to={`/services/${service.id}`} className="text-accent-dark hover:underline font-bold flex items-center gap-1">
                      Details <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Fallback IT Service Card 1: Web Development */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs">
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-lg bg-orange-50 text-accent-dark border border-orange-200 flex items-center justify-center">
                      <Globe className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">Web Development</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Responsive websites, landing pages, e-commerce stores, and custom Web portals for local & enterprise businesses.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-bold">Contact for Pricing</span>
                    <Link to="/contact" className="text-accent-dark hover:underline font-bold flex items-center gap-1">
                      Enquire <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                {/* Fallback IT Service Card 2: App Development */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs">
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-lg bg-orange-50 text-accent-dark border border-orange-200 flex items-center justify-center">
                      <Laptop className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">App Development</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Android and iOS mobile app development, cross-platform Flutter/React Native solutions with API integration.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-bold">Contact for Pricing</span>
                    <Link to="/contact" className="text-accent-dark hover:underline font-bold flex items-center gap-1">
                      Enquire <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                {/* Fallback IT Service Card 3: Custom Software Solutions */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs">
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-lg bg-orange-50 text-accent-dark border border-orange-200 flex items-center justify-center">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">Custom Software Solutions</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Business automation tools, internal CRM/ERP management systems, database software, and tailored IT consulting.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-bold">Contact for Pricing</span>
                    <Link to="/contact" className="text-accent-dark hover:underline font-bold flex items-center gap-1">
                      Enquire <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 7. Portfolio & Client Projects Showcase (Section 7) */}
      <ProjectsShowcase />
    </div>
  );
}

export default HomePage;
