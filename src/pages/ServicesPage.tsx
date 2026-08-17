import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useServices } from "@/hooks/useServices";
import { ServiceCategory } from "@/types/service.types";
import { ServiceCard } from "@/components/services/ServiceCard";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/common/SeoHead";
import { FileSearch, Layers, Globe, MapPin, Search, X } from "lucide-react";

export function ServicesPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: services, isLoading, isError, error, refetch } = useServices(selectedCategory);

  // Client-side real-time text search filtering on the fetched list
  const filteredServices = useMemo(() => {
    if (!services) return [];
    if (!searchQuery.trim()) return services;

    const query = searchQuery.toLowerCase().trim();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        (s.description && s.description.toLowerCase().includes(query))
    );
  }, [services, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <SeoHead
        title="Our Services - Digi Seva Solution"
        description="Explore government certificate applications, Aadhaar updates, PAN card applications, utility bill payments, and digital web development services."
        path="/services"
      />
      {/* Header Banner */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {t("services.title")}
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          {t("services.subtitle")}
        </p>
      </div>

      {/* Controls Bar: Search Input + Category Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        {/* Category Tabs Switcher */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === undefined ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(undefined)}
            className={`flex items-center gap-2 font-bold ${
              selectedCategory === undefined
                ? "bg-primary hover:bg-primary-light text-white shadow-xs"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
            }`}
            aria-label="Filter all services"
          >
            <Layers className="h-4 w-4" />
            <span>{t("services.allTab")}</span>
          </Button>

          <Button
            variant={selectedCategory === "ONLINE" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("ONLINE")}
            className={`flex items-center gap-2 font-bold ${
              selectedCategory === "ONLINE"
                ? "bg-primary hover:bg-primary-light text-white shadow-xs"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
            }`}
            aria-label="Filter online services"
          >
            <Globe className="h-4 w-4 text-emerald-600" />
            <span>{t("services.onlineTab")}</span>
          </Button>

          <Button
            variant={selectedCategory === "VISIT_REQUIRED" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("VISIT_REQUIRED")}
            className={`flex items-center gap-2 font-bold ${
              selectedCategory === "VISIT_REQUIRED"
                ? "bg-primary hover:bg-primary-light text-white shadow-xs"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
            }`}
            aria-label="Filter visit required services"
          >
            <MapPin className="h-4 w-4 text-accent-gold-dark" />
            <span>{t("services.visitTab")}</span>
          </Button>
        </div>

        {/* Real-time Search Input Box */}
        <div className="relative w-full md:w-72">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("services.searchPlaceholder")}
            aria-label="Search services"
            className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              title="Clear search"
              aria-label="Clear search query"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Services Grid Content */}
      {isLoading ? (
        <SkeletonLoader count={6} type="card" />
      ) : isError ? (
        <ErrorAlert
          message={error instanceof Error ? error.message : "Failed to load services"}
          onRetry={refetch}
        />
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={t("common.noServicesFound")}
          icon={FileSearch}
          actionLabel={(selectedCategory || searchQuery) ? "Clear Search & Filters" : undefined}
          onAction={() => {
            setSelectedCategory(undefined);
            setSearchQuery("");
          }}
        />
      )}
    </div>
  );
}

export default ServicesPage;
