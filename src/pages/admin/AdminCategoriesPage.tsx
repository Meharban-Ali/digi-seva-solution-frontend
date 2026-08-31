import { useState } from "react";
import {
  useAdminCategories,
  useCreateAdminCategory,
  useUpdateAdminCategory,
  useDeleteAdminCategory,
} from "@/features/adminCategories/adminCategoriesApi";
import { CategoryResponse, CategoryRequest } from "@/types/category.types";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { getDiagnosticErrorMessage } from "@/lib/errorUtils";
import { Button } from "@/components/ui/button";
import {
  FolderTree,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api";
import { renderCategoryIcon, AVAILABLE_CATEGORY_ICONS as AVAILABLE_ICONS } from "@/components/categories/CategoryIcon";

export function AdminCategoriesPage() {
  const { data: categories, isLoading, isError, error, refetch } = useAdminCategories();

  const createMutation = useCreateAdminCategory();
  const updateMutation = useUpdateAdminCategory();
  const deleteMutation = useDeleteAdminCategory();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);

  // Form State
  const [nameEn, setNameEn] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("Folder");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);

  // Delete Safety Dialog State
  const [deleteTarget, setDeleteTarget] = useState<CategoryResponse | null>(null);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setNameEn("");
    setNameHi("");
    setSlug("");
    setIcon("Folder");
    setDisplayOrder((categories?.length || 0) + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: CategoryResponse) => {
    setEditingCategory(category);
    setNameEn(category.nameEn);
    setNameHi(category.nameHi);
    setSlug(category.slug);
    setIcon(category.icon || "Folder");
    setDisplayOrder(category.displayOrder);
    setIsActive(category.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim() || !nameHi.trim()) {
      toast.error("Both English and Hindi category names are required.");
      return;
    }

    const payload: CategoryRequest = {
      nameEn: nameEn.trim(),
      nameHi: nameHi.trim(),
      slug: slug.trim() || undefined,
      icon,
      displayOrder,
      isActive,
    };

    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory.id, data: payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            toast.success("Category updated successfully!");
          },
          onError: (err: unknown) => {
            toast.error(getDiagnosticErrorMessage(err, "Failed to update category"));
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success("Category created successfully!");
        },
        onError: (err: unknown) => {
          toast.error(getDiagnosticErrorMessage(err, "Failed to create category"));
        },
      });
    }
  };

  const handleToggleActive = (category: CategoryResponse) => {
    updateMutation.mutate(
      {
        id: category.id,
        data: {
          nameEn: category.nameEn,
          nameHi: category.nameHi,
          slug: category.slug,
          icon: category.icon,
          displayOrder: category.displayOrder,
          isActive: !category.isActive,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            `Category ${!category.isActive ? "activated" : "deactivated"} successfully!`
          );
        },
      }
    );
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        toast.success("Category deleted successfully!");
      },
      onError: (err: unknown) => {
        const apiError = err as AxiosError<ApiResponse<null>>;
        toast.error(apiError.response?.data?.message || "Cannot delete category");
      },
    });
  };

  const activeCount = categories?.filter((c) => c.isActive).length || 0;

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FolderTree className="h-6 w-6 text-primary" />
            <span>Category Management</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Organize services under top-level business categories with bilingual titles and icons.
          </p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="bg-primary hover:bg-primary-dark text-white font-extrabold shadow-sm flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Categories</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{categories?.length || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Categories</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Services Grouped</p>
          <p className="text-2xl font-black text-primary mt-1">
            {categories?.reduce((sum, c) => sum + (c.serviceCount || 0), 0) || 0}
          </p>
        </div>
      </div>

      {/* Main Content View */}
      {isLoading ? (
        <SkeletonLoader count={5} />
      ) : isError ? (
        <ErrorAlert error={error} onRetry={() => refetch()} />
      ) : !categories || categories.length === 0 ? (
        <EmptyState
          title="No Categories Found"
          description="Create your first service category to begin grouping Jan Seva Kendra services."
          icon={FolderTree}
          actionLabel="Add Category"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Category Name (EN / HI)</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Services</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-500">
                      #{category.displayOrder}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {renderCategoryIcon(category.icon, "h-5 w-5")}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{category.nameEn}</p>
                          <p className="text-slate-500 font-medium text-xs">{category.nameHi}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 font-extrabold px-2.5 py-0.5 rounded-full text-xs">
                        <Layers className="h-3 w-3" />
                        {category.serviceCount || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(category)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                          category.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {category.isActive ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5 text-slate-400" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditModal(category)}
                          className="h-8 w-8 p-0 text-slate-600 hover:text-primary hover:bg-slate-100"
                          title="Edit Category"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(category)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete Category"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden divide-y divide-slate-100">
            {categories.map((category) => (
              <div key={category.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      {renderCategoryIcon(category.icon, "h-4 w-4")}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{category.nameEn}</h3>
                      <p className="text-xs text-slate-500">{category.nameHi}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">#{category.displayOrder}</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <code className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {category.slug}
                  </code>
                  <span className="font-extrabold text-slate-600">
                    {category.serviceCount || 0} service(s)
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleToggleActive(category)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      category.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </button>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(category)}>
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget(category)}
                      className="text-red-600 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-primary" />
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold px-2"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* English Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Government Services"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Hindi Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Category Name (Hindi) *
                </label>
                <input
                  type="text"
                  required
                  value={nameHi}
                  onChange={(e) => setNameHi(e.target.value)}
                  placeholder="e.g. सरकारी सेवाएं"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  URL Slug (Unique)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. government-services (leave blank to auto-generate)"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Icon Selector Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Visual Icon
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = icon === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setIcon(item.name)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs transition-all ${
                          isSelected
                            ? "bg-primary text-white border-primary shadow-xs scale-105"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <IconComp className="h-4 w-4 mb-1" />
                        <span className="text-[9px] font-mono truncate w-full text-center">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Display Order & Active */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1 flex flex-col justify-end">
                  <label className="inline-flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="h-4 w-4 rounded text-primary focus:ring-primary border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Category</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="font-bold border-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-primary hover:bg-primary-dark text-white font-extrabold"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation & Safety Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl ${deleteTarget.serviceCount > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {deleteTarget.serviceCount > 0 ? "Cannot Delete Category" : "Delete Category?"}
                </h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {deleteTarget.serviceCount > 0 ? (
                    <>
                      <strong>{deleteTarget.serviceCount} service(s)</strong> are currently assigned to{" "}
                      <strong>"{deleteTarget.nameEn}"</strong>. You must reassign or remove those services before this category can be deleted.
                    </>
                  ) : (
                    <>
                      Are you sure you want to delete category <strong>"{deleteTarget.nameEn}"</strong>? This action cannot be undone.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setDeleteTarget(null)} className="font-bold">
                {deleteTarget.serviceCount > 0 ? "Understand & Close" : "Cancel"}
              </Button>
              {deleteTarget.serviceCount === 0 && (
                <Button
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
