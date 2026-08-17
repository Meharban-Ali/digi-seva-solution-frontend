import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useServiceDetail } from "@/hooks/useServices";
import { stripHtml } from "@/lib/htmlUtils";
import { SeoHead } from "@/components/common/SeoHead";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Globe, FileText, CheckCircle, AlertTriangle } from "lucide-react";

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [imgError, setImgError] = useState(false);

  const { data: service, isLoading, isError } = useServiceDetail(id);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
        <div className="h-8 w-32 bg-slate-200 animate-pulse rounded"></div>
        <div className="h-64 bg-slate-200 animate-pulse rounded-xl"></div>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <SeoHead
          title="Service Not Found - Digi Seva Solution"
          description="The requested service could not be found."
          path={`/services/${id || ""}`}
        />
        <Card className="border-amber-200 bg-amber-50/50 p-8 shadow-sm">
          <CardContent className="space-y-4 pt-6">
            <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-900">{t("common.serviceNotFoundTitle")}</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {t("common.serviceNotFoundDesc")}
            </p>
            <Button asChild variant="default" className="mt-4 bg-primary hover:bg-primary-light">
              <Link to="/services">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("common.backToServices")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isVisitRequired = service.category === "VISIT_REQUIRED";
  const hasValidImage = service.imageUrl && service.imageUrl.trim() !== "" && !imgError;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <SeoHead
        title={`${service.name} - Digi Seva Solution`}
        description={
          service.description
            ? stripHtml(service.description).slice(0, 155)
            : "Official government service assistance at Digi Seva Solution in New Ashok Nagar, Delhi."
        }
        path={`/services/${service.id}`}
        ogImage={hasValidImage ? service.imageUrl : undefined}
      />

      {/* Back Button */}
      <div>
        <Button asChild variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
          <Link to="/services">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.backToServices")}
          </Link>
        </Button>
      </div>

      {/* Main Service Card */}
      <Card className="shadow-md border-slate-200 overflow-hidden">
        {/* Optional Service Hero Image Banner */}
        {hasValidImage && (
          <div className="relative w-full max-h-72 aspect-[21/9] bg-slate-100 overflow-hidden border-b border-slate-200">
            <img
              src={service.imageUrl}
              alt={service.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          </div>
        )}

        <CardHeader className="bg-slate-950 text-white space-y-3 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {isVisitRequired ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-slate-950 bg-accent-gold px-3 py-1 rounded-full shadow-xs">
                <MapPin className="h-3.5 w-3.5" />
                {t("categories.visitRequired")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-white bg-primary px-3 py-1 rounded-full shadow-xs">
                <Globe className="h-3.5 w-3.5" />
                {t("categories.online")}
              </span>
            )}

            {service.price ? (
              <span className="text-xl font-extrabold text-emerald-400 bg-emerald-950/90 border border-emerald-800 px-3.5 py-1 rounded-lg">
                ₹{service.price}
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-300 bg-slate-800 px-3 py-1 rounded-md">
                {t("services.free")}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {service.name}
          </h1>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Service Overview
            </h3>
            <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {service.description}
            </p>
          </div>

          <div className="border-t border-slate-200 pt-6 space-y-3">
            <h4 className="text-sm font-bold text-slate-900">Assurance & Guidelines</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Verified Application Submission at Official Rates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Direct In-Person Support at New Ashok Nagar Center</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 flex justify-end">
            <Button asChild size="lg" className="w-full sm:w-auto font-bold bg-primary hover:bg-primary-light text-white">
              <Link to={`/contact?service=${encodeURIComponent(service.name)}`}>
                Enquire for {service.name}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ServiceDetailPage;
