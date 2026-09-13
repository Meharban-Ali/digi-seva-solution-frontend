import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  publishTestimonial,
  unpublishTestimonial,
} from "@/features/testimonial/testimonialApi";
import { TestimonialResponse, TestimonialRequest } from "@/types/testimonial.types";
import { PageResponse } from "@/types/api";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { getDiagnosticErrorMessage } from "@/lib/errorUtils";
import { Button } from "@/components/ui/button";
import {
  MessageSquareQuote,
  Plus,
  Star,
  RefreshCw,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  X,
  User,
  Tag,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

export function ManageTestimonials() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageResponse<TestimonialResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [customerName, setCustomerName] = useState("");
  const [customerInitial, setCustomerInitial] = useState("");
  const [reviewEn, setReviewEn] = useState("");
  const [reviewHi, setReviewHi] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [rating, setRating] = useState(5);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  // Delete confirmation modal state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAdminTestimonials(page, 10);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [page]);

  const openCreateModal = () => {
    setEditingItem(null);
    setCustomerName("");
    setCustomerInitial("");
    setReviewEn("");
    setReviewHi("");
    setServiceName("");
    setRating(5);
    setDisplayOrder(0);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: TestimonialResponse) => {
    setEditingItem(item);
    setCustomerName(item.customerName || "");
    setCustomerInitial(item.customerInitial || "");
    setReviewEn(item.reviewEn || "");
    setReviewHi(item.reviewHi || "");
    setServiceName(item.serviceName || "");
    setRating(item.rating || 5);
    setDisplayOrder(item.displayOrder || 0);
    setIsPublished(item.isPublished ?? true);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      toast.error("Customer name is required");
      return;
    }
    if (!reviewEn.trim()) {
      toast.error("English review is required");
      return;
    }

    setSubmitting(true);
    const payload: TestimonialRequest = {
      customerName: customerName.trim(),
      customerInitial: customerInitial.trim() ? customerInitial.trim().substring(0, 1).toUpperCase() : undefined,
      reviewEn: reviewEn.trim(),
      reviewHi: reviewHi.trim() ? reviewHi.trim() : undefined,
      serviceName: serviceName.trim() ? serviceName.trim() : undefined,
      rating,
      displayOrder,
      isPublished,
    };

    try {
      if (editingItem) {
        await updateTestimonial(editingItem.id, payload);
        toast.success("Testimonial updated successfully!");
      } else {
        await createTestimonial(payload);
        toast.success("Testimonial created successfully!");
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to save testimonial"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (item: TestimonialResponse) => {
    setActionLoadingId(item.id);
    try {
      if (item.isPublished) {
        await unpublishTestimonial(item.id);
        toast.success("Testimonial unpublished (moved to draft)");
      } else {
        await publishTestimonial(item.id);
        toast.success("Testimonial published to homepage!");
      }
      fetchTestimonials();
    } catch (err) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to update publish status"));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    setActionLoadingId(id);
    try {
      await deleteTestimonial(id);
      toast.success("Testimonial deleted successfully!");
      setDeletingId(null);
      fetchTestimonials();
    } catch (err) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to delete testimonial"));
    } finally {
      setActionLoadingId(null);
    }
  };

  const displayItems = data?.content || [];

  return (
    <div className="space-y-6 selection:bg-accent selection:text-white">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-orange-50 text-accent-dark border border-orange-200 px-3 py-1 rounded-full text-xs font-bold mb-1">
            <MessageSquareQuote className="h-3.5 w-3.5 text-accent" />
            <span>Social Proof Desk</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            Customer Testimonials Management
          </h1>
          <p className="text-xs text-slate-500">
            Manage customer feedback, ratings, bilingual reviews, and homepage publishing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTestimonials}
            disabled={isLoading}
            className="text-xs font-bold border-slate-300 text-slate-700 flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            onClick={openCreateModal}
            size="sm"
            className="bg-accent hover:bg-accent-dark text-white font-black text-xs shadow-md flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>{t("testimonials.addNew", "Add Testimonial")}</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <SkeletonLoader count={4} type="table" />
      ) : error ? (
        <ErrorAlert message={getDiagnosticErrorMessage(error)} onRetry={fetchTestimonials} />
      ) : displayItems.length === 0 ? (
        <EmptyState
          title="No Testimonials Found"
          description="Click 'Add Testimonial' to create your first customer review."
          icon={MessageSquareQuote}
        />
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Order</th>
                    <th className="p-3.5">Customer Name</th>
                    <th className="p-3.5">Rating</th>
                    <th className="p-3.5">Review Snippet</th>
                    <th className="p-3.5">Service</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {displayItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Display Order */}
                      <td className="p-3.5 font-mono font-bold text-slate-700">
                        #{item.displayOrder}
                      </td>

                      {/* Customer Name & Initial */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-[#0B2046] text-white font-black flex items-center justify-center shrink-0 text-xs border border-slate-200 shadow-2xs">
                            {item.customerInitial || item.customerName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-900">{item.customerName}</span>
                        </div>
                      </td>

                      {/* Rating Stars */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                star <= item.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-200 fill-slate-100"
                              }`}
                            />
                          ))}
                        </div>
                      </td>

                      {/* Review Snippet */}
                      <td className="p-3.5 max-w-xs">
                        <p className="text-slate-700 line-clamp-2 italic font-normal">
                          "{item.reviewEn}"
                        </p>
                        {item.reviewHi && (
                          <span className="text-[10px] text-slate-400 line-clamp-1 block mt-0.5 font-normal">
                            HI: {item.reviewHi}
                          </span>
                        )}
                      </td>

                      {/* Service Name */}
                      <td className="p-3.5 font-semibold text-slate-700">
                        {item.serviceName || <span className="text-slate-400 italic">General</span>}
                      </td>

                      {/* Published Status Badge */}
                      <td className="p-3.5">
                        {item.isPublished ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> PUBLISHED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-300 font-mono">
                            <XCircle className="h-3 w-3 text-slate-500" /> DRAFT
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={actionLoadingId === item.id}
                            onClick={() => handleTogglePublish(item)}
                            className="h-8 px-2 text-xs font-bold border-slate-300"
                            title={item.isPublished ? "Unpublish to draft" : "Publish to homepage"}
                          >
                            {item.isPublished ? (
                              <EyeOff className="h-3.5 w-3.5 text-slate-500" />
                            ) : (
                              <Eye className="h-3.5 w-3.5 text-emerald-600" />
                            )}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(item)}
                            className="h-8 px-2 text-xs font-bold border-slate-300 hover:border-accent hover:text-accent"
                            title="Edit testimonial"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingId(item.id)}
                            className="h-8 px-2 text-xs font-bold border-rose-200 hover:bg-rose-50 text-rose-600"
                            title="Delete testimonial"
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
          </div>

          {/* Pagination Controls */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-medium">
                Page {data.pageNo + 1} of {data.totalPages} ({data.totalElements} total)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.first}
                  onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                  className="text-xs font-bold border-slate-300"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={data.last}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="text-xs font-bold border-slate-300"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Testimonial Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <h3 className="text-lg font-black tracking-tight">
                  {editingItem ? "Edit Testimonial" : "Add New Testimonial"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 overflow-y-auto">
              {/* Customer Name & Initial */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Initial (1 Char)
                  </label>
                  <input
                    type="text"
                    maxLength={1}
                    value={customerInitial}
                    onChange={(e) => setCustomerInitial(e.target.value.toUpperCase())}
                    placeholder="R"
                    className="w-full px-3 py-2 text-xs font-mono font-bold uppercase text-center bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-slate-900"
                  />
                </div>
              </div>

              {/* Clickable Star Rating Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Star Rating (1 - 5 Stars) *
                </label>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-300 w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-125 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-300 fill-slate-100"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-extrabold text-slate-700 ml-2 font-mono">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Review Text English */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Review (English) *</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {reviewEn.length}/500
                  </span>
                </div>
                <textarea
                  required
                  maxLength={500}
                  rows={3}
                  value={reviewEn}
                  onChange={(e) => setReviewEn(e.target.value)}
                  placeholder="Enter customer feedback in English..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-900"
                />
              </div>

              {/* Review Text Hindi */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Review (Hindi / हिन्दी)</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {reviewHi.length}/500
                  </span>
                </div>
                <textarea
                  maxLength={500}
                  rows={3}
                  value={reviewHi}
                  onChange={(e) => setReviewHi(e.target.value)}
                  placeholder="हिंदी समीक्षा (वैकल्पिक)..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-900"
                />
              </div>

              {/* Service Name & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5 text-slate-400" />
                    Service Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="e.g. Aadhaar Card Update"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent font-medium text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-slate-900"
                  />
                </div>
              </div>

              {/* Published Checkbox */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 rounded text-accent focus:ring-accent accent-accent cursor-pointer"
                />
                <label htmlFor="isPublished" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Publish to Homepage immediately
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-bold border-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  size="sm"
                  className="bg-accent hover:bg-accent-dark text-white font-extrabold text-xs shadow-md"
                >
                  {submitting ? "Saving..." : editingItem ? "Update Testimonial" : "Create Testimonial"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 space-y-4 text-center">
            <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-600 font-bold flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">Delete Testimonial?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete this testimonial? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingId(null)}
                className="text-xs font-bold border-slate-300"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleDelete(deletingId)}
                disabled={actionLoadingId === deletingId}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                {actionLoadingId === deletingId ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageTestimonials;
