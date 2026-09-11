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
import { PhoneCall, Filter, Clock, CheckCircle2, XCircle, RefreshCw, User, Phone } from "lucide-react";

export function AdminCallbacksPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageResponse<CallbackResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

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
      fetchCallbacks();
    } catch (err) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to update callback status"));
    } finally {
      setUpdatingId(null);
    }
  };

  const maskPhone = (phone: string) => {
    if (!phone) return "";
    const clean = phone.trim();
    if (clean.length === 10) {
      return `${clean.slice(0, 4)}***${clean.slice(7)}`;
    }
    if (clean.length > 5) {
      return `${clean.slice(0, 3)}***${clean.slice(-2)}`;
    }
    return clean;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="h-3.5 w-3.5 text-amber-600" /> Pending
          </span>
        );
      case "CALLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Called
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="h-3.5 w-3.5 text-slate-500" /> Cancelled
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6 selection:bg-accent selection:text-white">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <PhoneCall className="h-7 w-7 text-primary shrink-0" />
            Callback Requests Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View visitor callback requests, preferred timings, and update follow-up statuses.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchCallbacks}
          disabled={isLoading}
          className="w-fit font-bold border-slate-300 flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-4">
        <Filter className="h-4 w-4 text-slate-500 shrink-0" />
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Filter Status:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {["ALL", "PENDING", "CALLED", "CANCELLED"].map((statusKey) => (
            <Button
              key={statusKey}
              variant={selectedStatus === statusKey ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedStatus(statusKey);
                setPage(0);
              }}
              className={`text-xs font-bold ${
                selectedStatus === statusKey
                  ? "bg-primary hover:bg-primary-dark text-white"
                  : "bg-white text-slate-700 border-slate-300"
              }`}
            >
              {statusKey === "ALL" ? "All Requests" : statusKey}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <SkeletonLoader count={5} />
      ) : error ? (
        <ErrorAlert error={error} onRetry={fetchCallbacks} />
      ) : !data || data.content.length === 0 ? (
        <EmptyState
          title="No Callback Requests"
          description="There are currently no callback requests matching your filter criteria."
          icon={PhoneCall}
        />
      ) : (
        <div className="space-y-4">
          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-3.5">ID & Date</th>
                    <th className="px-5 py-3.5">Applicant Name</th>
                    <th className="px-5 py-3.5">Phone Number</th>
                    <th className="px-5 py-3.5">Preferred Timing</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.content.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-mono text-xs font-bold text-slate-900">#{req.id}</div>
                        <div className="text-[11px] text-slate-500">
                          {new Date(req.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </div>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            <User className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-slate-900 text-sm">{req.name}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md w-fit">
                          <Phone className="h-3.5 w-3.5 text-slate-500" />
                          <span>{maskPhone(req.phone)}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-accent" />
                          <span>{req.preferredTime || "Any Time"}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {getStatusBadge(req.status)}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <select
                          value={req.status}
                          disabled={updatingId === req.id}
                          onChange={(e) =>
                            handleStatusChange(
                              req.id,
                              e.target.value as "PENDING" | "CALLED" | "CANCELLED"
                            )
                          }
                          className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer disabled:opacity-50"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CALLED">CALLED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
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
    </div>
  );
}

export default AdminCallbacksPage;
