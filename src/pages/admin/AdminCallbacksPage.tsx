import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAdminCallbacks, updateAdminCallbackStatus } from "@/features/callback/callbackApi";
import { CallbackResponse } from "@/types/callback.types";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { getDiagnosticErrorMessage } from "@/lib/errorUtils";
import { PageResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  PhoneCall,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  User,
  Phone,
  Eye,
  X,
  ExternalLink,
  Calendar,
} from "lucide-react";

export function AdminCallbacksPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageResponse<CallbackResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedCallback, setSelectedCallback] = useState<CallbackResponse | null>(null);

  const fetchCallbacks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAdminCallbacks(selectedStatus, page, 10);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCallbacks();
  }, [selectedStatus, page]);

  const handleStatusChange = async (id: number, newStatus: "PENDING" | "CALLED" | "CANCELLED") => {
    setUpdatingId(id);
    try {
      const updated = await updateAdminCallbackStatus(id, newStatus);
      toast.success(`Callback status updated to ${updated.status}`);
      if (selectedCallback && selectedCallback.id === id) {
        setSelectedCallback((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      fetchCallbacks();
    } catch (err) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to update callback status"));
    } finally {
      setUpdatingId(null);
    }
  };

  const maskPhone = (phoneStr: string) => {
    if (!phoneStr) return "";
    const clean = phoneStr.trim();
    if (clean.length < 10) return clean;
    return `${clean.slice(0, 2)}*****${clean.slice(-2)}`;
  };

  const getStatusBadge = (statusStr: string) => {
    switch (statusStr?.toUpperCase()) {
      case "CALLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> CALLED
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 font-mono">
            <XCircle className="h-3.5 w-3.5 text-rose-600" /> CANCELLED
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 font-mono">
            <Clock className="h-3.5 w-3.5 text-amber-600" /> PENDING
          </span>
        );
    }
  };

  const displayItems = data?.content || [];

  // Quick Stats derived from existing fetched data
  const stats = {
    total: displayItems.length,
    pending: displayItems.filter((i) => i.status?.toUpperCase() === "PENDING").length,
    called: displayItems.filter((i) => i.status?.toUpperCase() === "CALLED").length,
    cancelled: displayItems.filter((i) => i.status?.toUpperCase() === "CANCELLED").length,
  };

  return (
    <div className="space-y-6 selection:bg-accent selection:text-white">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-orange-50 text-accent-dark border border-orange-200 px-3 py-1 rounded-full text-xs font-bold mb-1">
            <PhoneCall className="h-3.5 w-3.5 text-accent" />
            <span>Citizen Assistance Desk</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            Callback Requests Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            View visitor callback requests, preferred timings, and update follow-up statuses.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchCallbacks}
          disabled={isLoading}
          className="w-fit text-xs font-bold border-slate-300 text-slate-700 flex items-center gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Requirement 3: Quick Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 bg-slate-200 text-slate-700 rounded-lg shrink-0">
            <PhoneCall className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
              Total Requests
            </span>
            <span className="text-lg font-black text-slate-900 font-mono">
              {stats.total}
            </span>
          </div>
        </div>

        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 bg-amber-100 text-amber-700 rounded-lg shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-700 block uppercase tracking-wider">
              Pending
            </span>
            <span className="text-lg font-black text-amber-900 font-mono">
              {stats.pending}
            </span>
          </div>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-700 block uppercase tracking-wider">
              Called
            </span>
            <span className="text-lg font-black text-emerald-900 font-mono">
              {stats.called}
            </span>
          </div>
        </div>

        <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 bg-rose-100 text-rose-700 rounded-lg shrink-0">
            <XCircle className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-rose-700 block uppercase tracking-wider">
              Cancelled
            </span>
            <span className="text-lg font-black text-rose-900 font-mono">
              {stats.cancelled}
            </span>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center space-x-2 pb-1 overflow-x-auto">
        <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
          Filter Status:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {["ALL", "PENDING", "CALLED", "CANCELLED"].map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => {
                setSelectedStatus(statusKey);
                setPage(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                selectedStatus === statusKey
                  ? "bg-[#0B2046] text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {statusKey === "ALL" ? "All Requests" : statusKey}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <SkeletonLoader count={5} />
      ) : error ? (
        <ErrorAlert message={getDiagnosticErrorMessage(error)} onRetry={fetchCallbacks} />
      ) : !data || data.content.length === 0 ? (
        /* Requirement 5: Empty State */
        <EmptyState
          title="No Callback Requests"
          description={
            selectedStatus !== "ALL"
              ? `No ${selectedStatus} callback requests found matching the current filter.`
              : "There are currently no callback requests recorded."
          }
          icon={PhoneCall}
        />
      ) : (
        <div className="space-y-4">
          {/* Table Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 whitespace-nowrap">ID & Date</th>
                    <th className="p-3.5">Applicant Name</th>
                    <th className="p-3.5">Phone Number</th>
                    <th className="p-3.5">Preferred Timing</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {data.content.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* ID & Date */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-900">#{req.id}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {new Date(req.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </div>
                      </td>

                      {/* Applicant Name */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center shrink-0 text-xs border border-slate-200">
                            {req.name ? req.name.charAt(0).toUpperCase() : "C"}
                          </div>
                          <span className="font-bold text-slate-900">{req.name}</span>
                        </div>
                      </td>

                      {/* Phone (Requirement 4: 75*****91) */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 w-fit">
                          <Phone className="h-3 w-3 text-slate-500" />
                          <span>{maskPhone(req.phone)}</span>
                        </div>
                      </td>

                      {/* Preferred Timing */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-accent" />
                          <span>{req.preferredTime || "Any Time"}</span>
                        </div>
                      </td>

                      {/* Status Badge (Requirement 1: No inline dropdown) */}
                      <td className="p-3.5 whitespace-nowrap">
                        {getStatusBadge(req.status)}
                      </td>

                      {/* Actions (Requirement 2: View Details button) */}
                      <td className="p-3.5 whitespace-nowrap text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCallback(req)}
                          className="h-8 px-2.5 text-xs font-bold border-slate-300 hover:border-accent hover:text-accent"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1 text-slate-500" />
                          <span>View Details</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {data.totalPages > 1 && (
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

      {/* Requirement 2: View Details Modal */}
      {selectedCallback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    #CALLBACK-{selectedCallback.id}
                  </span>
                  {getStatusBadge(selectedCallback.status)}
                </div>
                <h3 className="text-lg font-black tracking-tight">
                  Callback Request Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedCallback(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Applicant Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 text-accent font-black flex items-center justify-center shrink-0 border border-accent/20 text-base">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Applicant Name
                    </span>
                    <span className="text-base font-black text-slate-900 block">
                      {selectedCallback.name}
                    </span>
                  </div>
                </div>

                {/* Complete / Unmasked Phone Number */}
                <div className="pt-2 border-t border-slate-200/80 text-xs">
                  <span className="text-slate-500 font-medium block mb-0.5">
                    Complete Phone Number (Click to Call)
                  </span>
                  <a
                    href={`tel:${selectedCallback.phone}`}
                    className="font-mono font-bold text-slate-900 hover:text-accent flex items-center gap-1.5 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs text-sm"
                  >
                    <Phone className="h-4 w-4 text-accent" />
                    <span>{selectedCallback.phone}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400 ml-auto" />
                  </a>
                </div>
              </div>

              {/* Preferred Timing & Creation Timestamp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>Preferred Timing</span>
                  </span>
                  <span className="text-xs font-bold text-slate-900 block">
                    {selectedCallback.preferredTime || "Any Time"}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    <span>Created At</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900 block">
                    {new Date(selectedCallback.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer with Status Dropdown */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-700 shrink-0">
                  Update Status:
                </span>
                <select
                  disabled={updatingId === selectedCallback.id}
                  value={selectedCallback.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedCallback.id,
                      e.target.value as "PENDING" | "CALLED" | "CANCELLED"
                    )
                  }
                  className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white font-bold text-slate-800 focus:outline-none focus:border-accent w-full sm:w-auto cursor-pointer disabled:opacity-50"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CALLED">CALLED (Mark as Contacted)</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCallback(null)}
                className="text-xs font-bold border-slate-300 w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCallbacksPage;
