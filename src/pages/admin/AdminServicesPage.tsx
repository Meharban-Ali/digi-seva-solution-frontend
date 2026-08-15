import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  useAdminServicesPage,
  useCreateAdminService,
  useUpdateAdminService,
  useDeleteAdminService,
} from "@/hooks/useAdminServices";
import { AdminServiceResponse, AdminServiceRequest } from "@/types/adminService.types";
import { ServiceCategory } from "@/types/service.types";
import { MediaPickerModal } from "@/components/media/MediaPickerModal";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit2,
  Trash2,
  Layers,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Globe,
  MapPin,
} from "lucide-react";

export function AdminServicesPage() {
  const [page, setPage] = useState(0);
  const { data: servicesPage, isLoading, isError, error, refetch } = useAdminServicesPage(page, 10);

  const createMutation = useCreateAdminService();
  const updateMutation = useUpdateAdminService();
  const deleteMutation = useDeleteAdminService();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdminServiceResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminServiceResponse | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Form State
  const [activeTab, setActiveTab] = useState<"EN" | "HI">("EN");
  const [nameEn, setNameEn] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionHi, setDescriptionHi] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("ONLINE");
  const [price, setPrice] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);

  const handleOpenCreateModal = () => {
    setEditingService(null);
    setNameEn("");
    setNameHi("");
    setDescriptionEn("");
    setDescriptionHi("");
    setCategory("ONLINE");
    setPrice("");
    setImageUrl("");
    setDisplayOrder(0);
    setIsActive(true);
    setActiveTab("EN");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: AdminServiceResponse) => {
    setEditingService(service);
    setNameEn(service.nameEn || service.name || "");
    setNameHi(service.nameHi || service.name || "");
    setDescriptionEn(service.descriptionEn || service.description || "");
    setDescriptionHi(service.descriptionHi || service.description || "");
    setCategory(service.category);
    setPrice(service.price !== undefined && service.price !== null ? String(service.price) : "");
    setImageUrl(service.imageUrl || "");
    setDisplayOrder(service.displayOrder || 0);
    setIsActive(service.isActive);
    setActiveTab("EN");
    setIsModalOpen(true);
  };

  const { t } = useTranslation();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: AdminServiceRequest = {
      nameEn: nameEn.trim(),
      nameHi: nameHi.trim(),
      descriptionEn: descriptionEn.trim() || undefined,
      descriptionHi: descriptionHi.trim() || undefined,
      category,
      price: price ? Number(price) : undefined,
      imageUrl: imageUrl.trim() || undefined,
      displayOrder,
      isActive,
    };

    if (editingService) {
      updateMutation.mutate(
        { id: editingService.id, data: payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            toast.success(t("adminServices.updatedSuccess"));
          },
          onError: (err: unknown) => {
            const errorObj = err as { response?: { data?: { message?: string } } };
            toast.error(errorObj?.response?.data?.message || t("adminServices.actionError"));
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success(t("adminServices.createdSuccess"));
        },
        onError: (err: unknown) => {
          const errorObj = err as { response?: { data?: { message?: string } } };
          toast.error(errorObj?.response?.data?.message || t("adminServices.actionError"));
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          setDeleteTarget(null);
          toast.success(t("adminServices.deletedSuccess"));
        },
        onError: (err: unknown) => {
          const errorObj = err as { response?: { data?: { message?: string } } };
          toast.error(errorObj?.response?.data?.message || t("adminServices.actionError"));
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Service Catalog Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, update, and manage bilingual CSC government and online services.
          </p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="font-bold bg-primary hover:bg-primary/90 text-white flex items-center gap-2 self-start sm:self-auto"
          aria-label="Add new service to catalog"
        >
          <Plus className="h-4 w-4" />
          Add New Service
        </Button>
      </div>

      {/* Services Data Card Container */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 bg-slate-50 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            All Registered Services ({servicesPage?.totalElements || 0})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <SkeletonLoader count={5} type="table" />
          ) : isError ? (
            <div className="p-4">
              <ErrorAlert
                message={error instanceof Error ? error.message : "Failed to load services"}
                onRetry={refetch}
              />
            </div>
          ) : servicesPage && servicesPage.content.length > 0 ? (
            <>
              {/* Desktop Table View (Hidden on mobile) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Service Name (EN / HI)</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {servicesPage.content.map((service: AdminServiceResponse) => (
                      <tr key={service.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-500">
                          #{service.displayOrder}
                        </td>
                        <td className="px-4 py-3 space-y-0.5">
                          <p className="font-bold text-slate-900 text-sm">
                            {service.nameEn || service.name}
                          </p>
                          <p className="text-slate-500 font-medium text-xs">
                            {service.nameHi || service.name}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          {service.category === "ONLINE" ? (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-semibold text-[10px]">
                              <Globe className="h-3 w-3" /> Online Service
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-semibold text-[10px]">
                              <MapPin className="h-3 w-3" /> Visit Required
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {service.price ? `₹${service.price}` : "Free / Standard"}
                        </td>
                        <td className="px-4 py-3">
                          {service.isActive ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 font-bold text-[11px]">
                              <XCircle className="h-3.5 w-3.5 text-slate-400" /> Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEditModal(service)}
                              className="h-7 px-2 text-xs font-semibold"
                              aria-label={`Edit ${service.name}`}
                            >
                              <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteTarget(service)}
                              className="h-7 px-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border-rose-200"
                              aria-label={`Deactivate ${service.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View (Visible only on <640px) */}
              <div className="block sm:hidden divide-y divide-slate-100">
                {servicesPage.content.map((service: AdminServiceResponse) => (
                  <div key={service.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">
                          #{service.displayOrder}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{service.nameEn || service.name}</h4>
                        <p className="text-xs text-slate-500">{service.nameHi || service.name}</p>
                      </div>
                      {service.isActive ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          Active
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-semibold text-slate-700">
                        {service.price ? `₹${service.price}` : "Free / Standard"}
                      </span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono">
                        {service.category}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditModal(service)}
                        className="flex-1 text-xs font-semibold h-8"
                      >
                        <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteTarget(service)}
                        className="h-8 text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="No services registered yet"
              description="Click Add New Service to create your first bilingual service item."
              icon={Layers}
              actionLabel="Add Service"
              onAction={handleOpenCreateModal}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {servicesPage && servicesPage.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <span className="text-xs text-slate-500">
            Page {servicesPage.pageNo + 1} of {servicesPage.totalPages} ({servicesPage.totalElements} services)
          </span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={servicesPage.first}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={servicesPage.last}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <h3 className="font-bold text-base">
                {editingService ? "Edit Service" : "Create New Service"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
              {/* Bilingual Tab Switcher */}
              <div className="flex border-b border-slate-200 space-x-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("EN")}
                  className={`pb-2 text-xs font-bold transition-colors ${
                    activeTab === "EN"
                      ? "border-b-2 border-primary text-primary"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  English Content (EN) *
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("HI")}
                  className={`pb-2 text-xs font-bold transition-colors ${
                    activeTab === "HI"
                      ? "border-b-2 border-primary text-primary"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Hindi Content (हिंदी) *
                </button>
              </div>

              {/* Tab Content Fields */}
              {activeTab === "EN" ? (
                <div className="space-y-3 animate-in fade-in">
                  <div className="space-y-1">
                    <label htmlFor="nameEnInput" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Service Name (English) *
                    </label>
                    <input
                      id="nameEnInput"
                      type="text"
                      required
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      placeholder="e.g. PAN Card Application"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="descEnInput" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Description (English)
                    </label>
                    <textarea
                      id="descEnInput"
                      rows={3}
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      placeholder="Enter English description details..."
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in">
                  <div className="space-y-1">
                    <label htmlFor="nameHiInput" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      सेवा का नाम (हिंदी) *
                    </label>
                    <input
                      id="nameHiInput"
                      type="text"
                      required
                      value={nameHi}
                      onChange={(e) => setNameHi(e.target.value)}
                      placeholder="उदा. पैन कार्ड आवेदन"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="descHiInput" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      विवरण (हिंदी)
                    </label>
                    <textarea
                      id="descHiInput"
                      rows={3}
                      value={descriptionHi}
                      onChange={(e) => setDescriptionHi(e.target.value)}
                      placeholder="हिंदी विवरण की जानकारी लिखें..."
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Shared Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                {/* Category Dropdown */}
                <div className="space-y-1">
                  <label htmlFor="categorySelect" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Category *
                  </label>
                  <select
                    id="categorySelect"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ONLINE">Online Service</option>
                    <option value="VISIT_REQUIRED">Visit Required</option>
                  </select>
                </div>

                {/* Price Input */}
                <div className="space-y-1">
                  <label htmlFor="priceInput" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Service Fee (₹)
                  </label>
                  <input
                    id="priceInput"
                    type="number"
                    min="0"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Leave empty for Free"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Display Order */}
                <div className="space-y-1">
                  <label htmlFor="orderInput" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Display Order
                  </label>
                  <input
                    id="orderInput"
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Active Toggle */}
                <div className="space-y-1 flex flex-col justify-end">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Active Status
                  </label>
                  <label className="inline-flex items-center cursor-pointer gap-2">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary relative"></div>
                    <span className="text-xs font-semibold text-slate-700">
                      {isActive ? "Visible Publicly" : "Hidden / Inactive"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Image URL & Media Picker */}
              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <label htmlFor="imgUrlInput" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Service Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    id="imgUrlInput"
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/..."
                    className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Pick from Library
                  </Button>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="font-bold bg-primary hover:bg-primary/90 text-white"
                >
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Service"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center space-x-3 text-rose-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="font-bold text-lg text-slate-900">Deactivate Service</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to deactivate <strong className="text-slate-900">{deleteTarget.name}</strong>? This service will no longer appear in the public catalog.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold"
                disabled={deleteMutation.isPending}
                onClick={handleDeleteConfirm}
              >
                {deleteMutation.isPending ? "Deactivating..." : "Deactivate Service"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelectUrl={(url) => setImageUrl(url)}
        currentUrl={imageUrl}
      />
    </div>
  );
}

export default AdminServicesPage;
