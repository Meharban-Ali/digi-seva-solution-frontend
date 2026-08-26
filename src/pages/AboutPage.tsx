import { useTranslation } from "react-i18next";
import { useContent } from "@/hooks/useContent";
import { SeoHead } from "@/components/common/SeoHead";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Clock, Users, ShieldCheck, CheckCircle } from "lucide-react";

export function AboutPage() {
  const { t } = useTranslation();
  const { data: aboutBlocks, isLoading } = useContent("ABOUT_US");

  const aboutContent = aboutBlocks && aboutBlocks.length > 0 ? aboutBlocks[0] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <SeoHead
        title="About Us - Jan Seva Kendra Digi Seva Solution New Ashok Nagar, Delhi"
        description="About Digi Seva Solution - Authorized Common Service Center (Jan Seva Kendra) at Block D, Masjid Wali Gali, New Ashok Nagar, Delhi 110096. Providing Aadhaar, PAN card, banking, RTO, and IT software development services."
        path="/about"
      />
      {/* Page Title Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-orange-50 text-accent-dark border border-orange-200 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
          <Building2 className="h-4 w-4 text-accent" /> Jan Seva Kendra • New Ashok Nagar
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t("about.title")}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {t("about.subtitle")}
        </p>
      </div>

      {/* Main Mission & API Content Section */}
      <Card className="shadow-md border-slate-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-950 via-[#0B2046] to-slate-900 text-white p-6 sm:p-8 space-y-2">
          <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-white">
            <ShieldCheck className="h-6 w-6 text-accent" />
            {aboutContent ? aboutContent.title : t("about.missionTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-6">
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded w-4/6"></div>
            </div>
          ) : aboutContent ? (
            <div
              className="prose prose-slate max-w-none text-base text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(aboutContent.body) }}
            />
          ) : (
            <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {t("about.missionBody")}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-6">
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">2 Operating Partners</h4>
                <p className="text-xs text-slate-600 mt-0.5">Personalized citizen assistance and fast turnaround.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Government Compliant</h4>
                <p className="text-xs text-slate-600 mt-0.5">Strict adherence to official CSC government standards.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location & Operational Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center space-x-3 text-slate-900 font-bold text-lg">
              <div className="bg-orange-50 text-accent-dark border border-orange-200 p-2 rounded-lg">
                <MapPin className="h-5 w-5" />
              </div>
              <h3>{t("about.locationTitle")}</h3>
            </div>
            <p className="text-sm text-slate-600 font-medium">
              {t("about.address")}
            </p>
            <p className="text-xs text-slate-500">
              Conveniently accessible near Vivo Showroom and Masjid Wali Gali in New Ashok Nagar.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center space-x-3 text-slate-900 font-bold text-lg">
              <div className="bg-orange-50 text-accent-dark border border-orange-200 p-2 rounded-lg">
                <Clock className="h-5 w-5" />
              </div>
              <h3>{t("about.timingTitle")}</h3>
            </div>
            <p className="text-sm text-slate-600 font-medium">
              {t("about.timingDetails")}
            </p>
            <p className="text-xs text-slate-500">
              {t("about.timingSubnote")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AboutPage;
