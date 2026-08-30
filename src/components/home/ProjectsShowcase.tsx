import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useProjects } from "@/hooks/useProjects";
import { ArrowRight, Briefcase } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/imageUtils";
import { TitleHighlight } from "@/components/common/TitleHighlight";

// Helper to determine specific category badges for projects
const getCategoryBadge = (categoryTag?: string, title?: string) => {
  const text = `${categoryTag || ""} ${title || ""}`.toLowerCase();
  if (text.includes("travel") || text.includes("booking")) {
    return { label: "🌐 Web App", className: "bg-blue-600/90 text-white border border-blue-400/30" };
  }
  if (text.includes("blood") || text.includes("donor") || text.includes("ai") || text.includes("social")) {
    return { label: "❤️ Social Impact", className: "bg-rose-600/90 text-white border border-rose-400/30" };
  }
  if (text.includes("commerce") || text.includes("e-commerce") || text.includes("shop")) {
    return { label: "🛒 E-Commerce", className: "bg-emerald-600/90 text-white border border-emerald-400/30" };
  }
  return { label: categoryTag || "🌐 Web App", className: "bg-slate-900/80 text-white border border-slate-700/40" };
};

// Helper to determine tech stack tags for projects
const getTechStack = (title?: string, categoryTag?: string): string[] => {
  const text = `${title || ""} ${categoryTag || ""}`.toLowerCase();
  if (text.includes("travel") || text.includes("booking")) {
    return ["React", "Spring Boot", "MySQL"];
  }
  if (text.includes("blood") || text.includes("donor")) {
    return ["React", "FastAPI", "PostgreSQL"];
  }
  if (text.includes("commerce") || text.includes("e-commerce") || text.includes("shop")) {
    return ["React", "Spring Boot", "Redis"];
  }
  return ["React", "TypeScript", "Tailwind CSS"];
};

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
          <div className="inline-flex items-center gap-2 bg-orange-50 text-accent-dark border border-orange-200 px-3.5 py-1 rounded-full text-xs font-bold shadow-2xs">
            <Briefcase className="w-3.5 h-3.5 text-accent" />
            <span>{t("projects.badge")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t("projects.title")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            {t("projects.subtitle")}
          </p>
        </div>

        {/* Projects Grid (3-column desktop, equal height, 24px gap) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project, idx) => {
            const title = isHi ? project.titleHi || project.titleEn : project.titleEn;
            const description = isHi
              ? project.descriptionHi || project.descriptionEn
              : project.descriptionEn;

            const categoryBadge = getCategoryBadge(project.categoryTag, project.titleEn);
            const techStack = getTechStack(project.titleEn, project.categoryTag);

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group shadow-md h-full"
              >
                {/* 1. Image Area (Top, fixed 220px height) */}
                <div className="relative h-[220px] bg-slate-100 overflow-hidden shrink-0">
                  {project.imageUrl ? (
                    <img
                      src={getOptimizedImageUrl(project.imageUrl, 600)}
                      alt={title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <Briefcase className="w-10 h-10 stroke-1" />
                    </div>
                  )}

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent pointer-events-none" />

                  {/* Specific Category Badge Overlay (Top Left) */}
                  <div className={`absolute top-3 left-3 text-xs font-extrabold px-3 py-1 rounded-full shadow-xs backdrop-blur-xs ${categoryBadge.className}`}>
                    {categoryBadge.label}
                  </div>
                </div>

                {/* 2. Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-white">
                  <div className="space-y-2.5">
                    <h3 className="text-lg font-extrabold text-[#0B2046] group-hover:text-accent-dark transition-colors line-clamp-1 py-0.5">
                      <TitleHighlight>{title}</TitleHighlight>
                    </h3>
                    {description && (
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* 3. Card Footer Divider & Link */}
                  <div className="pt-4 border-t border-slate-100 mt-auto flex items-center justify-between">
                    <Link
                      to="/contact?service=portfolio"
                      className="text-accent-dark hover:text-accent font-extrabold text-xs flex items-center gap-1.5 transition-colors group/link"
                    >
                      <span>{t("projects.viewProjectDetails", "View Project Details")}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProjectsShowcase;
