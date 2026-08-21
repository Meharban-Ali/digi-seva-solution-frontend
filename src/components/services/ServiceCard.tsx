import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ServiceResponse } from "@/types/service.types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, MapPin, CheckCircle2, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { getOptimizedImageUrl } from "@/lib/imageUtils";

interface ServiceCardProps {
  service: ServiceResponse;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { t } = useTranslation();
  const [imgError, setImgError] = useState(false);

  const isVisitRequired = service.deliveryMode === "VISIT_REQUIRED";
  const hasValidImage = service.imageUrl && service.imageUrl.trim() !== "" && !imgError;
  const optimizedImgUrl = getOptimizedImageUrl(service.imageUrl, 600);

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="h-full flex flex-col justify-between hover:shadow-xl transition-all duration-300 border-slate-200/90 bg-white group overflow-hidden hover:border-primary/40">
        {/* Service Image Banner / Header */}
        <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden border-b border-slate-100 flex items-center justify-center">
          {hasValidImage ? (
            <img
              key={service.imageUrl || service.id}
              src={optimizedImgUrl}
              alt={service.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center gap-1.5 p-4 text-center">
              <FileText className="h-8 w-8 text-primary-light" />
              <span className="text-[11px] font-bold text-slate-300 tracking-wide uppercase">Jan Seva Kendra</span>
            </div>
          )}

          {/* Single Delivery Mode Badge */}
          <div className="absolute top-2.5 left-2.5">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
                isVisitRequired
                  ? "bg-amber-400 text-slate-950 border border-amber-500/40"
                  : "bg-slate-900 text-white border border-slate-700"
              }`}
            >
              {isVisitRequired ? (
                <>
                  <MapPin className="h-3 w-3 text-slate-950" />
                  {t("categories.visitRequired")}
                </>
              ) : (
                <>
                  <Globe className="h-3 w-3 text-blue-400" />
                  {t("categories.online")}
                </>
              )}
            </span>
          </div>

          {service.isActive && (
            <div className="absolute top-2.5 right-2.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 shadow-2xs">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                Active
              </span>
            </div>
          )}
        </div>

        <CardHeader className="p-5 pb-3 space-y-2">
          <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
            {service.name}
          </CardTitle>

          <CardDescription className="text-xs text-slate-600 line-clamp-2 leading-relaxed min-h-[2.25rem]">
            {service.description || "Official CSC service process and application support."}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 pt-0 mt-auto space-y-4">
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {t("services.priceLabel")}
              </span>
              <p className="text-base font-extrabold text-slate-900 leading-none mt-0.5">
                {service.price ? `₹${service.price}` : t("services.free")}
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs font-bold border-slate-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all"
            >
              <Link
                to={`/services/${service.id}`}
                className="flex items-center gap-1.5"
                aria-label={`View details for ${service.name}`}
              >
                <span>{t("common.viewMore")}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ServiceCard;
