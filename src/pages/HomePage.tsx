import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useContent } from "@/hooks/useContent";
import { useServices } from "@/hooks/useServices";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, FileCheck, Zap, HeartHandshake, MapPin } from "lucide-react";

export function HomePage() {
  const { t } = useTranslation();
  const { data: banners } = useContent("HOME_BANNER");
  const { data: services, isLoading: isServicesLoading } = useServices();

  const heroBanner = banners && banners.length > 0 ? banners[0] : null;
  const featuredServices = services ? services.slice(0, 4) : [];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-5xl mx-auto relative z-10 space-y-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            <span>Jan Seva Kendra • New Ashok Nagar, Delhi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white max-w-3xl">
            {heroBanner ? heroBanner.title : t("hero.defaultTitle")}
          </h1>

          <p className="text-base sm:text-xl text-blue-100/90 max-w-2xl font-light leading-relaxed">
            {heroBanner ? heroBanner.body : t("hero.defaultSubtitle")}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto font-bold bg-primary hover:bg-primary/90 text-white shadow-lg">
              <Link to="/services">
                <span>{t("common.viewAllServices")}</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 hover:text-white">
              <Link to="/about">
                <span>{t("nav.about")}</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Business Services Section */}
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

      {/* Business Highlights & Partner Assurance Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 space-y-3">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-lg w-fit">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Fast Digital Processing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Direct online processing for PAN Card, Passport, Bill Payments, and official registrations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 space-y-3">
              <div className="bg-amber-50 text-amber-600 p-3 rounded-lg w-fit">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Convenient Location</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Located conveniently in New Ashok Nagar, Delhi 110096 for easy in-person assistance.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 space-y-3">
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg w-fit">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Transparent Standard Rates</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Clear government fees with zero hidden charges and full receipt accounting.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
