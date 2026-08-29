import { useState } from "react";
import { toast } from "sonner";
import {
  useAdminProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "@/hooks/useProjects";
import { Project, ProjectRequest } from "@/types/project";
import { MediaPickerModal } from "@/components/media/MediaPickerModal";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { getDiagnosticErrorMessage } from "@/lib/errorUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit2,
  Trash2,
  FolderKanban,
  Image as ImageIcon,
  AlertCircle,
  X,
  Star,
  ExternalLink,
  Tag,
} from "lucide-react";

export function AdminProjectsPage() {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data: projectsPage, isLoading, isError, error, refetch } = useAdminProjects(page, pageSize);

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  // Modal & Media State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Form State
  const [activeTab, setActiveTab] = useState<"EN" | "HI">("EN");
  const [titleEn, setTitleEn] = useState("");
  const [titleHi, setTitleHi] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionHi, setDescriptionHi] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [categoryTag, setCategoryTag] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const openCreateModal = () => {
    setEditingProject(null);
    setTitleEn("");
    setTitleHi("");
    setDescriptionEn("");
    setDescriptionHi("");
    setImageUrl("");
    setProjectUrl("");
    setCategoryTag("Web Application");
    setDisplayOrder(0);
    setIsActive(true);
    setIsFeatured(false);
    setActiveTab("EN");
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setTitleEn(project.titleEn || "");
    setTitleHi(project.titleHi || "");
    setDescriptionEn(project.descriptionEn || "");
    setDescriptionHi(project.descriptionHi || "");
    setImageUrl(project.imageUrl || "");
    setProjectUrl(project.projectUrl || "");
    setCategoryTag(project.categoryTag || "");
    setDisplayOrder(project.displayOrder || 0);
    setIsActive(project.isActive);
    setIsFeatured(project.isFeatured);
    setActiveTab("EN");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim()) {
      toast.error("English Title is required");
      return;
    }

    const payload: ProjectRequest = {
      titleEn: titleEn.trim(),
      titleHi: titleHi.trim() || undefined,
      descriptionEn: descriptionEn.trim() || undefined,
      descriptionHi: descriptionHi.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      projectUrl: projectUrl.trim() || undefined,
      categoryTag: categoryTag.trim() || undefined,
      displayOrder: Number(displayOrder) || 0,
      isActive,
      isFeatured,
    };

    try {
      if (editingProject) {
        await updateMutation.mutateAsync({ id: editingProject.id, data: payload });
        toast.success("Project updated successfully!");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Project created successfully!");
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to save project"));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Project deleted successfully");
      setDeleteTarget(null);
    } catch (err: unknown) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to delete project"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderKanban className="w-7 h-7 text-indigo-600" />
            Projects / Portfolio Showcase
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage client portfolio items, case studies, and web/app showcases displayed on the public site.
          </p>
        </div>
        <Button onClick={openCreateModal} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
          <Plus className="w-4 h-4 mr-2" />
          Add Portfolio Project
        </Button>
      </div>

      {/* Content State */}
      {isLoading ? (
        <SkeletonLoader count={4} />
      ) : isError ? (
        <ErrorAlert error={error} onRetry={() => refetch()} />
      ) : !projectsPage || projectsPage.content.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No Portfolio Projects Added Yet"
          description="Click 'Add Portfolio Project' to showcase completed client apps, websites, and systems."
          actionLabel="Add Portfolio Project"
          onAction={openCreateModal}
        />
      ) : (
        <>
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectsPage.content.map((project) => (
              <Card key={project.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="relative h-44 bg-slate-100 overflow-hidden rounded-t-xl">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.titleEn}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                      <ImageIcon className="w-12 h-12 stroke-1" />
                    </div>
                  )}
                  {/* Category Tag Badge */}
                  {project.categoryTag && (
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 border border-indigo-500/30">
                      <Tag className="w-3 h-3" />
                      {project.categoryTag}
                    </div>
                  )}
                  {/* Status Badges */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {project.isFeatured && (
                      <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Star className="w-3 h-3 fill-white" /> Featured
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        project.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {project.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900">{project.titleEn}</CardTitle>
                      {project.titleHi && <p className="text-xs text-slate-500 font-medium">{project.titleHi}</p>}
                    </div>
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded border">
                      Order: {project.displayOrder}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between pt-0 space-y-4">
                  <p className="text-xs text-slate-600 line-clamp-3">
                    {project.descriptionEn || "No description provided."}
                  </p>

                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 truncate"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      {project.projectUrl}
                    </a>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(project)}
                      className="text-slate-700 border-slate-300 hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget(project)}
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {projectsPage.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-xs text-slate-600">
                Page {(projectsPage.pageNo ?? 0) + 1} of {projectsPage.totalPages} ({projectsPage.totalElements} total items)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={projectsPage.first}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={projectsPage.last}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 space-y-6 my-8 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProject ? "Edit Portfolio Project" : "Add Portfolio Project"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Language Switcher Tabs */}
              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab("EN")}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
                    activeTab === "EN"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  English Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("HI")}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
                    activeTab === "HI"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Hindi Details (हिंदी)
                </button>
              </div>

              {activeTab === "EN" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Project Title (English) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="e.g. Government E-District Online Portal"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Project Description (English)
                    </label>
                    <textarea
                      rows={3}
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      placeholder="Brief description of the work completed..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Project Title (Hindi - हिंदी)
                    </label>
                    <input
                      type="text"
                      value={titleHi}
                      onChange={(e) => setTitleHi(e.target.value)}
                      placeholder="उदा. सरकारी ई-डिस्ट्रिक्ट पोर्टल"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Project Description (Hindi - हिंदी)
                    </label>
                    <textarea
                      rows={3}
                      value={descriptionHi}
                      onChange={(e) => setDescriptionHi(e.target.value)}
                      placeholder="परियोजना का विवरण..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                    />
                  </div>
                </div>
              )}

              {/* Shared Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category Tag / Type
                  </label>
                  <input
                    type="text"
                    value={categoryTag}
                    onChange={(e) => setCategoryTag(e.target.value)}
                    placeholder="e.g. Web Application, E-Commerce, Mobile App"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    External Link / Case Study URL
                  </label>
                  <input
                    type="url"
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Image Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Project Image / Banner URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/..."
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="text-xs border-slate-300 shrink-0"
                  >
                    <ImageIcon className="w-4 h-4 mr-1 text-slate-500" />
                    Select Image
                  </Button>
                </div>
                {imageUrl && (
                  <div className="mt-2 h-20 w-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    Active (Visible Publicly)
                  </label>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    Featured on Homepage
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingProject
                    ? "Save Changes"
                    : "Create Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cloudinary Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelectUrl={(url: string) => {
          setImageUrl(url);
          setIsMediaPickerOpen(false);
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold">Delete Portfolio Project?</h3>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete <strong className="text-slate-900">{deleteTarget.titleEn}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Project"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
