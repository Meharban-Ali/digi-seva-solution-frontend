import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useProjects } from "@/hooks/useProjects";
import { ExternalLink, Tag, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProjectsShowcase() {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === "hi";
  const { data: projects, isLoading } = useProjects();

  // Filter featured projects or active projects
  const activeProjects = (projects || []).filter((p) => p.isActive);
  const displayProjects =
    activeProjects.filter((p) => p.isFeatured).length > 0
      ? activeProjects.filter((p) => p.isFeatured)
      : activeProjects;

  // Zero Hardcoded Projects: If no projects exist in database or currently loading, return null gracefully
  if (isLoading || !displayProjects || displayProjects.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 bg-slate-50 text-slate-900 border-t border-slate-200/80 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200/80 px-3.5 py-1 rounded-full text-xs font-bold shadow-2xs">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{t("projects.badge")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t("projects.title")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            {t("projects.subtitle")}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayProjects.map((project, idx) => {
            const title = isHi ? project.titleHi || project.titleEn : project.titleEn;
            const description = isHi
              ? project.descriptionHi || project.descriptionEn
              : project.descriptionEn;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:border-blue-300 hover:shadow-md transition-all duration-300 group shadow-xs"
              >
                {/* Thumbnail Container */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <Briefcase className="w-10 h-10 stroke-1" />
                    </div>
                  )}

                  {/* Category Tag Badge */}
                  {project.categoryTag && (
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-xs">
                      <Tag className="w-3 h-3 text-blue-300" />
                      {project.categoryTag}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                      {title}
                    </h3>
                    {description && (
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>

                  {/* External Project Link Button */}
                  {project.projectUrl && (
                    <div className="pt-3 border-t border-slate-100">
                      <Button
                        asChild
                        size="sm"
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>{t("projects.viewProject")}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
