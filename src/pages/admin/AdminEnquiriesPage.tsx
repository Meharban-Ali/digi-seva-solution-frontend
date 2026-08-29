import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAdminEnquiriesPage, useUpdateAdminEnquiryStatus } from "@/hooks/useAdminEnquiries";
import { AdminEnquiryResponse, EnquiryStatus } from "@/types/adminEnquiry.types";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { getDiagnosticErrorMessage } from "@/lib/errorUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Inbox,
  Eye,
  MessageSquare,
  PhoneCall,
  Mail,
  Clock,
  Filter,
  X,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export function AdminEnquiriesPage() {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<EnquiryStatus | undefined>(undefined);
  const [page, setPage] = useState(0);

  const { data: enquiriesPage, isLoading, isError, error, refetch } = useAdminEnquiriesPage(
    selectedStatus,
    page,
    10
  );
  const updateStatusMutation = useUpdateAdminEnquiryStatus();

  // Modal State
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdminEnquiryResponse | null>(null);

  const handleStatusChange = (id: number, newStatus: EnquiryStatus) => {
    updateStatusMutation.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => toast.success(t("adminEnquiries.statusSuccess")),
        onError: (err: unknown) => {
          toast.error(getDiagnosticErrorMessage(err, t("adminEnquiries.actionError")));
        },
      }
    );
  };

  // Helper for status display labels
  const getStatusLabel = (status: EnquiryStatus) => {
    switch (status) {
      case "NEW":
        return t("adminEnquiries.statusPendingNew");
      case "CONTACTED":
        return t("adminEnquiries.statusPendingContacted");
      case "RESOLVED":
        return t("adminEnquiries.statusResolved");
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Customer Enquiries Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Track citizen service enquiries, contact applicants, and manage follow-up lifecycles.
        </p>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-4">
        <Filter className="h-4 w-4 text-slate-500" />
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Filter Status:
        </span>
        <div className="flex flex-wrap gap-1.5">
          <Button
            variant={selectedStatus === undefined ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedStatus(undefined);
              setPage(0);
            }}
            className={`text-xs font-semibold py-1 px-3 h-8 ${
              selectedStatus === undefined ? "bg-primary text-white font-bold" : ""
            }`}
          >
            {t("adminEnquiries.filterAll")}
          </Button>

          <Button
            variant={selectedStatus === "NEW" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedStatus("NEW");
              setPage(0);
            }}
            className={`text-xs font-semibold py-1 px-3 h-8 flex items-center gap-1 ${
              selectedStatus === "NEW"
                ? "bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold border-amber-400"
                : "text-amber-800 border-amber-300 bg-amber-50/60"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-950" />
            {t("adminEnquiries.filterPendingNew")}
          </Button>

          <Button
            variant={selectedStatus === "CONTACTED" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedStatus("CONTACTED");
              setPage(0);
            }}
            className={`text-xs font-semibold py-1 px-3 h-8 ${
              selectedStatus === "CONTACTED"
                ? "bg-accent text-white font-extrabold"
                : "text-accent-dark border-orange-300 bg-orange-50"
            }`}
          >
            {t("adminEnquiries.filterPendingContacted")}
          </Button>

          <Button
            variant={selectedStatus === "RESOLVED" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedStatus("RESOLVED");
              setPage(0);
            }}
            className={`text-xs font-semibold py-1 px-3 h-8 ${
              selectedStatus === "RESOLVED"
                ? "bg-emerald-600 text-white font-extrabold"
                : "text-emerald-800 border-emerald-300 bg-emerald-50/60"
            }`}
          >
            {t("adminEnquiries.filterResolved")}
          </Button>
        </div>
      </div>

      {/* Enquiries Data Table Card */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 bg-slate-50 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Inbox className="h-5 w-5 text-primary" />
            Customer Requests ({enquiriesPage?.totalElements || 0})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <SkeletonLoader count={5} type="table" />
          ) : isError ? (
            <div className="p-4">
              <ErrorAlert
                error={error}
                onRetry={() => refetch()}
              />
            </div>
          ) : enquiriesPage && enquiriesPage.content.length > 0 ? (
            <>
              {/* Desktop Table View (Hidden on mobile) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Customer Name</th>
                      <th className="px-4 py-3">Contact Details</th>
                      <th className="px-4 py-3">Status Lifecycle</th>
                      <th className="px-4 py-3">Submitted On</th>
                      <th className="px-4 py-3 text-right">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enquiriesPage.content.map((enquiry: AdminEnquiryResponse) => {
                      const isNew = enquiry.status === "NEW";
                      return (
                        <tr
                          key={enquiry.id}
                          className={`transition-colors ${
                            isNew ? "bg-amber-50/60 hover:bg-amber-50" : "hover:bg-slate-50/80"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              {isNew && (
                                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                              )}
                              <p className="font-bold text-slate-900 text-sm">{enquiry.name}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 space-y-0.5 font-mono text-[11px] text-slate-600">
                            <div className="flex items-center space-x-1">
                              <PhoneCall className="h-3 w-3 text-slate-400" />
                              <span>{enquiry.phone}</span>
                            </div>
                            {enquiry.email && (
                              <div className="flex items-center space-x-1 text-slate-400">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">{enquiry.email}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={enquiry.status}
                              onChange={(e) =>
                                handleStatusChange(enquiry.id, e.target.value as EnquiryStatus)
                              }
                              disabled={updateStatusMutation.isPending}
                              aria-label={`Change status for ${enquiry.name}`}
                              className={`px-2.5 py-1 text-[11px] font-extrabold rounded border shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer ${
                                enquiry.status === "NEW"
                                  ? "bg-amber-100 text-amber-900 border-amber-300"
                                  : enquiry.status === "CONTACTED"
                                  ? "bg-orange-100 text-accent-dark border-orange-300"
                                  : "bg-emerald-100 text-emerald-900 border-emerald-300"
                              }`}
                            >
                              <option value="NEW">{t("adminEnquiries.statusPendingNew")}</option>
                              <option value="CONTACTED">{t("adminEnquiries.statusPendingContacted")}</option>
                              <option value="RESOLVED">{t("adminEnquiries.statusResolved")}</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                            {new Date(enquiry.createdAt).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedEnquiry(enquiry)}
                              className="h-7 px-2.5 text-xs font-semibold"
                              aria-label={`View message from ${enquiry.name}`}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" /> View Message
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View (Visible only on <640px) */}
              <div className="block sm:hidden divide-y divide-slate-100">
                {enquiriesPage.content.map((enquiry: AdminEnquiryResponse) => {
                  const isNew = enquiry.status === "NEW";
                  return (
                    <div
                      key={enquiry.id}
                      className={`p-4 space-y-3 ${isNew ? "bg-amber-50/60" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{enquiry.name}</p>
                          <p className="text-xs font-mono text-slate-600 flex items-center gap-1 mt-0.5">
                            <PhoneCall className="h-3 w-3 text-slate-400" />
                            {enquiry.phone}
                          </p>
                        </div>
                        {isNew ? (
                          <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> {t("adminEnquiries.statusPendingNew")}
                          </span>
                        ) : enquiry.status === "CONTACTED" ? (
                          <span className="bg-orange-100 text-accent-dark text-[10px] font-bold px-2 py-0.5 rounded">
                            {t("adminEnquiries.statusPendingContacted")}
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-emerald-700" /> {t("adminEnquiries.statusResolved")}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <select
                          value={enquiry.status}
                          onChange={(e) =>
                            handleStatusChange(enquiry.id, e.target.value as EnquiryStatus)
                          }
                          disabled={updateStatusMutation.isPending}
                          aria-label={`Change status for ${enquiry.name}`}
                          className="px-2 py-1 text-xs font-bold rounded border bg-white shadow-2xs"
                        >
                          <option value="NEW">{t("adminEnquiries.statusPendingNew")}</option>
                          <option value="CONTACTED">{t("adminEnquiries.statusPendingContacted")}</option>
                          <option value="RESOLVED">{t("adminEnquiries.statusResolved")}</option>
                        </select>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="h-8 text-xs font-semibold"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> View Message
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <EmptyState
              title="No customer enquiries found"
              description="New inquiries submitted by citizens via the website contact form will appear here."
              icon={Inbox}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {enquiriesPage && enquiriesPage.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <span className="text-xs text-slate-500">
            Page {enquiriesPage.pageNo + 1} of {enquiriesPage.totalPages} ({enquiriesPage.totalElements} enquiries)
          </span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={enquiriesPage.first}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={enquiriesPage.last}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal Dialog */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <h3 className="font-bold text-base flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> Enquiry Details
              </h3>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-white"
                aria-label="Close detail modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Customer Name
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Phone Number
                  </span>
                  <p className="font-bold text-slate-900 font-mono text-sm">{selectedEnquiry.phone}</p>
                </div>
              </div>

              {selectedEnquiry.email && (
                <div className="border-b pb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Email Address
                  </span>
                  <p className="font-medium text-slate-800 text-xs font-mono">{selectedEnquiry.email}</p>
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Customer Message / Inquiry Note
                </span>
                <div className="mt-1.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed min-h-[80px]">
                  {selectedEnquiry.message || "No specific message provided."}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Submitted: {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </span>
                <span className="font-bold text-slate-700">Status: {getStatusLabel(selectedEnquiry.status)}</span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <Button size="sm" onClick={() => setSelectedEnquiry(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEnquiriesPage;
