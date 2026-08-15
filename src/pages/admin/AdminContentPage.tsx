import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  useAdminContentPage,
  useCreateAdminContent,
  useUpdateAdminContent,
  usePublishAdminContent,
  useUnpublishAdminContent,
  useDeleteAdminContent,
} from "@/hooks/useAdminContent";
import { AdminContentResponse, AdminContentRequest, ContentSection } from "@/types/adminContent.types";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  Eye,
  CheckCircle2,
  X,
  AlertCircle,
  Filter,
} from "lucide-react";

export function AdminContentPage() {
  const [selectedSection, setSelectedSection] = useState<ContentSection | undefined>(undefined);
  const [page, setPage] = useState(0);

  const { data: contentPage, isLoading, isError, error, refetch } = useAdminContentPage(selectedSection, page, 10);

  const createMutation = useCreateAdminContent();
  const updateMutation = useUpdateAdminContent();
  const publishMutation = usePublishAdminContent();
  const unpublishMutation = useUnpublishAdminContent();
  const deleteMutation = useDeleteAdminContent();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<AdminContentResponse | null>(null);
  const [previewContent, setPreviewContent] = useState<AdminContentResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminContentResponse | null>(null);

  // Form State
  const [activeTab, setActiveTab] = useState<"EN" | "HI">("EN");
  const [section, setSection] = useState<ContentSection>("HOME_BANNER");
  const [titleEn, setTitleEn] = useState("");
  const [titleHi, setTitleHi] = useState("");
  const [bodyEn, setBodyEn] = useState("");
  const [bodyHi, setBodyHi] = useState("");

  const handleOpenCreateModal = () => {
    setEditingContent(null);
    setSection("HOME_BANNER");
    setTitleEn("");
    setTitleHi("");
    setBodyEn("");
    setBodyHi("");
    setActiveTab("EN");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: AdminContentResponse) => {
    setEditingContent(item);
    setSection(item.section);
    setTitleEn(item.titleEn || item.title || "");
    setTitleHi(item.titleHi || item.title || "");
    setBodyEn(item.bodyEn || item.body || "");
    setBodyHi(item.bodyHi || item.body || "");
    setActiveTab("EN");
    setIsModalOpen(true);
  };

  const { t } = useTranslation();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: AdminContentRequest = {
      section,
      titleEn: titleEn.trim(),
      titleHi: titleHi.trim(),
      bodyEn: bodyEn.trim(),
      bodyHi: bodyHi.trim(),
    };

    if (editingContent) {
      updateMutation.mutate(
        { id: editingContent.id, data: payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            toast.success(t("adminContent.updatedSuccess"));
          },
          onError: (err: unknown) => {
            const errorObj = err as { response?: { data?: { message?: string } } };
            toast.error(errorObj?.response?.data?.message || t("adminContent.actionError"));
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success(t("adminContent.createdSuccess"));
        },
        onError: (err: unknown) => {
          const errorObj = err as { response?: { data?: { message?: string } } };
          toast.error(errorObj?.response?.data?.message || t("adminContent.actionError"));
        },
      });
    }
  };

  const handleTogglePublish = (item: AdminContentResponse) => {
    if (item.status === "PUBLISHED") {
      unpublishMutation.mutate(item.id, {
        onSuccess: () => toast.success(t("adminContent.statusSuccess")),
        onError: (err: unknown) => {
          const errorObj = err as { response?: { data?: { message?: string } } };
          toast.error(errorObj?.response?.data?.message || t("adminContent.actionError"));
        },
      });
    } else {
      publishMutation.mutate(item.id, {
        onSuccess: () => toast.success(t("adminContent.statusSuccess")),
        onError: (err: unknown) => {
          const errorObj = err as { response?: { data?: { message?: string } } };
          toast.error(errorObj?.response?.data?.message || t("adminContent.actionError"));
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          setDeleteTarget(null);
          toast.success(t("adminContent.deletedSuccess"));
        },
        onError: (err: unknown) => {
          const errorObj = err as { response?: { data?: { message?: string } } };
          toast.error(errorObj?.response?.data?.message || t("adminContent.actionError"));
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
            Content Blocks Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, edit, and publish bilingual website banners, announcements, and pages.
          </p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="font-bold bg-primary hover:bg-primary/90 text-white flex items-center gap-2 self-start sm:self-auto"
          aria-label="Create new content block"
        >
          <Plus className="h-4 w-4" />
          Create Content Block
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-4">
        <Filter className="h-4 w-4 text-slate-500" />
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Filter Section:
        </span>
        <div className="flex flex-wrap gap-1.5">
          <Button
            variant={selectedSection === undefined ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedSection(undefined);
              setPage(0);
            }}
            className="text-xs font-semibold py-1 px-3 h-8"
          >
            All Sections
          </Button>
          <Button
            variant={selectedSection === "HOME_BANNER" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedSection("HOME_BANNER");
              setPage(0);
            }}
            className="text-xs font-semibold py-1 px-3 h-8"
          >
            Home Banner
          </Button>
          <Button
            variant={selectedSection === "ABOUT_US" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedSection("ABOUT_US");
              setPage(0);
            }}
            className="text-xs font-semibold py-1 px-3 h-8"
          >
            About Us
          </Button>
          <Button
            variant={selectedSection === "ANNOUNCEMENT" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedSection("ANNOUNCEMENT");
              setPage(0);
            }}
            className="text-xs font-semibold py-1 px-3 h-8"
          >
            Announcement
          </Button>
          <Button
            variant={selectedSection === "OFFER" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedSection("OFFER");
              setPage(0);
            }}
            className="text-xs font-semibold py-1 px-3 h-8"
          >
            Offer
          </Button>
        </div>
      </div>

      {/* Content Blocks List Grid */}
      {isLoading ? (
        <SkeletonLoader count={4} type="card" />
      ) : isError ? (
        <ErrorAlert
          message={error instanceof Error ? error.message : "Failed to load content blocks"}
          onRetry={refetch}
        />
      ) : contentPage && contentPage.content.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contentPage.content.map((item: AdminContentResponse) => (
              <Card key={item.id} className="border-slate-200 shadow-xs bg-white flex flex-col justify-between">
                <CardHeader className="p-4 border-b border-slate-100 bg-slate-50 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                      {item.section}
                    </span>
                    {item.status === "PUBLISHED" ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Published
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-300 px-2 py-0.5 rounded">
                        Draft
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewContent(item)}
                      className="h-7 px-2 text-[11px] font-semibold"
                      aria-label={`Preview ${item.title}`}
                      title="Preview content"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base">
                      {item.titleEn || item.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {item.titleHi || item.title}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <Button
                      variant={item.status === "PUBLISHED" ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleTogglePublish(item)}
                      disabled={publishMutation.isPending || unpublishMutation.isPending}
                      className={`text-xs font-semibold h-7 ${
                        item.status === "PUBLISHED" ? "text-amber-700 border-amber-300 hover:bg-amber-50" : "bg-emerald-600 hover:bg-emerald-500 text-white"
                      }`}
                      aria-label={`Toggle publish status for ${item.title}`}
                    >
                      {item.status === "PUBLISHED" ? "Unpublish Block" : "Publish Live"}
                    </Button>

                    <div className="flex items-center space-x-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditModal(item)}
                        className="h-7 px-2 text-xs font-semibold"
                        aria-label={`Edit content ${item.title}`}
                      >
                        <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteTarget(item)}
                        className="h-7 px-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border-rose-200"
                        aria-label={`Delete content ${item.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {contentPage.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <span className="text-xs text-slate-500">
                Page {contentPage.pageNo + 1} of {contentPage.totalPages} ({contentPage.totalElements} items)
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={contentPage.first}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={contentPage.last}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="No content blocks found"
          description="Create a new home banner, announcement, or about us block."
          icon={FileText}
          actionLabel="Create Content Block"
          onAction={handleOpenCreateModal}
        />
      )}

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <h3 className="font-bold text-base">
                {editingContent ? "Edit Content Block" : "Create Content Block"}
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
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Section Selector */}
              <div className="space-y-1">
                <label htmlFor="sectionSelect" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Section *
                </label>
                <select
                  id="sectionSelect"
                  value={section}
                  onChange={(e) => setSection(e.target.value as ContentSection)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="HOME_BANNER">HOME_BANNER</option>
                  <option value="ABOUT_US">ABOUT_US</option>
                  <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                  <option value="OFFER">OFFER</option>
                </select>
              </div>

              {/* Bilingual Tab Switcher */}
              <div className="flex border-b border-slate-200 space-x-4 pt-2">
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
                    <label htmlFor="titleEnInput" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Title (English) *
                    </label>
                    <input
                      id="titleEnInput"
                      type="text"
                      required
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="e.g. Authorized Jan Seva Kendra Services"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Body (English Rich Text) *
                    </label>
                    <RichTextEditor value={bodyEn} onChange={(html) => setBodyEn(html)} />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in">
                  <div className="space-y-1">
                    <label htmlFor="titleHiInput" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      शीर्षक (हिंदी) *
                    </label>
                    <input
                      id="titleHiInput"
                      type="text"
                      required
                      value={titleHi}
                      onChange={(e) => setTitleHi(e.target.value)}
                      placeholder="उदा. अधिकृत जन सेवा केंद्र सेवाएं"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      विवरण (हिंदी रिच टेक्स्ट) *
                    </label>
                    <RichTextEditor value={bodyHi} onChange={(html) => setBodyHi(html)} />
                  </div>
                </div>
              )}

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
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Content Block"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal Dialog */}
      {previewContent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" /> Live Preview: {previewContent.section}
              </h3>
              <button
                onClick={() => setPreviewContent(null)}
                className="text-slate-400 hover:text-white"
                aria-label="Close preview modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="border-b pb-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase">English Preview</h4>
                <h2 className="text-xl font-bold text-slate-900">{previewContent.titleEn || previewContent.title}</h2>
                <div
                  className="prose prose-sm max-w-none text-slate-700 mt-2"
                  dangerouslySetInnerHTML={{ __html: previewContent.bodyEn || previewContent.body || "" }}
                />
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Hindi Preview (हिंदी)</h4>
                <h2 className="text-xl font-bold text-slate-900">{previewContent.titleHi || previewContent.title}</h2>
                <div
                  className="prose prose-sm max-w-none text-slate-700 mt-2"
                  dangerouslySetInnerHTML={{ __html: previewContent.bodyHi || previewContent.body || "" }}
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <Button size="sm" onClick={() => setPreviewContent(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center space-x-3 text-rose-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="font-bold text-lg text-slate-900">Delete Content Block</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-900">{deleteTarget.title}</strong>? This action cannot be undone.
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
                {deleteMutation.isPending ? "Deleting..." : "Permanently Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminContentPage;
