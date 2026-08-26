import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useServices } from "@/hooks/useServices";
import { useCategories } from "@/hooks/useCategories";
import { DeliveryMode } from "@/types/service.types";
import { ServiceCard } from "@/components/services/ServiceCard";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/common/SeoHead";
import { renderCategoryIcon } from "@/components/categories/CategoryIcon";
import { FileSearch, Layers, Globe, MapPin, Search, X, FolderTree } from "lucide-react";

export function ServicesPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query parameters for persistent category and delivery mode filtering
  const categorySlugParam = searchParams.get("category") || "";
  const modeParam = (searchParams.get("mode") as DeliveryMode) || undefined;

  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState<DeliveryMode | undefined>(modeParam);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { data: services, isLoading: isServicesLoading, isError, error, refetch } = useServices(selectedDeliveryMode);

  // Category selection handler that synchronizes with URL query parameters
  const handleSelectCategory = (slug?: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set("category", slug);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const handleSelectDeliveryMode = (mode?: DeliveryMode) => {
    setSelectedDeliveryMode(mode);
    const newParams = new URLSearchParams(searchParams);
    if (mode) {
      newParams.set("mode", mode);
    } else {
      newParams.delete("mode");
    }
    setSearchParams(newParams);
  };

  // Client-side real-time combined filtering across Category + Delivery Mode + Text Query
  const filteredServices = useMemo(() => {
    if (!services) return [];

    return services.filter((s) => {
      // 1. Category Filter
      if (categorySlugParam) {
        if (!s.categorySlug || s.categorySlug !== categorySlugParam) {
          return false;
        }
      }

      // 2. Delivery Mode Filter (handled by API + double checked)
      if (selectedDeliveryMode && s.deliveryMode !== selectedDeliveryMode) {
        return false;
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesDesc = s.description && s.description.toLowerCase().includes(query);
        const matchesCat = s.categoryName && s.categoryName.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) {
          return false;
        }
      }

      return true;
    });
  }, [services, categorySlugParam, selectedDeliveryMode, searchQuery]);

  const activeCategoryObj = useMemo(() => {
    if (!categorySlugParam || !categories) return null;
    return categories.find((c) => c.slug === categorySlugParam);
  }, [categorySlugParam, categories]);

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setSelectedDeliveryMode(undefined);
    setSearchQuery("");
  };

  const isLoading = isServicesLoading || isCategoriesLoading;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <SeoHead
        title={activeCategoryObj ? `${activeCategoryObj.name} - Jan Seva Kendra Services | Digi Seva Solution` : "Government & Citizen Services Catalog - Digi Seva Solution New Ashok Nagar"}
        description="Browse government & citizen services at Digi Seva Solution Jan Seva Kendra New Ashok Nagar Delhi: Aadhaar correction, PAN card, AEPS money transfer, RTO driving licence, GST, ITR, SBI & Axis Bank account opening, and IT software development."
        path="/services"
      />
      {/* Header Banner */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <span>{t("services.title")}</span>
          {activeCategoryObj && (
            <span className="text-sm bg-primary/10 text-primary font-bold px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1.5">
              {renderCategoryIcon(activeCategoryObj.icon, "h-4 w-4")}
              {activeCategoryObj.name}
            </span>
          )}
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          {t("services.subtitle")}
        </p>
      </div>

      {/* Category Filter Chips Carousel / Grid Bar */}
      {categories && categories.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FolderTree className="h-3.5 w-3.5 text-primary" />
              <span>Browse by Category ({categories.length})</span>
            </h2>
            {categorySlugParam && (
              <button
                onClick={() => handleSelectCategory(undefined)}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Clear Category
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {/* All Categories Chip */}
            <button
              onClick={() => handleSelectCategory(undefined)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                !categorySlugParam
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>All Categories</span>
            </button>

            {/* Seeded Category Chips */}
            {categories.map((cat) => {
              const isSelected = categorySlugParam === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.slug)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {renderCategoryIcon(cat.icon, "h-3.5 w-3.5")}
                  <span>{cat.name || cat.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Controls Bar: Search Input + Delivery Mode Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-t border-b border-slate-200 py-4">
        {/* Delivery Mode Tabs Switcher */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedDeliveryMode === undefined ? "default" : "outline"}
            size="sm"
            onClick={() => handleSelectDeliveryMode(undefined)}
            className={`flex items-center gap-2 font-bold ${
              selectedDeliveryMode === undefined
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
            }`}
            aria-label="Filter all delivery modes"
          >
            <Layers className="h-4 w-4" />
            <span>{t("services.allTab")}</span>
          </Button>

          <Button
            variant={selectedDeliveryMode === "ONLINE" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSelectDeliveryMode("ONLINE")}
            className={`flex items-center gap-2 font-bold ${
              selectedDeliveryMode === "ONLINE"
                ? "bg-primary hover:bg-primary-light text-white shadow-xs"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
            }`}
            aria-label="Filter online services"
          >
            <Globe className="h-4 w-4 text-emerald-600" />
            <span>{t("services.onlineTab")}</span>
          </Button>

          <Button
            variant={selectedDeliveryMode === "VISIT_REQUIRED" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSelectDeliveryMode("VISIT_REQUIRED")}
            className={`flex items-center gap-2 font-bold ${
              selectedDeliveryMode === "VISIT_REQUIRED"
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
          description={
            categorySlugParam
              ? `No services currently listed under "${activeCategoryObj?.name || categorySlugParam}". Try selecting another category or clearing filters.`
              : "No services match your active filter criteria."
          }
          icon={FileSearch}
          actionLabel={(categorySlugParam || selectedDeliveryMode || searchQuery) ? "Clear All Filters" : undefined}
          onAction={clearAllFilters}
        />
      )}
    </div>
  );
}
