import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  getAdminAppointments,
  getAdminTodayAppointments,
  updateAdminAppointmentStatus,
} from "@/features/appointment/appointmentApi";
import { AppointmentResponse } from "@/types/appointment.types";
import { PageResponse } from "@/types/api";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { getDiagnosticErrorMessage } from "@/lib/errorUtils";
import { CustomerDocumentStatusDto } from "@/types/customer.types";
import { updateAdminAppointmentDocumentStatus } from "@/api/customerPortalApi";
import { apiClient } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  CalendarDays,
  Eye,
  X,
  Clock,
  CheckCircle2,
  CheckCircle,
  XCircle,
  User,
  FileText,
  Tag,
  ExternalLink,
  FileCheck,
} from "lucide-react";

export function AdminAppointmentsPage() {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [isTodayOnly, setIsTodayOnly] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageResponse<AppointmentResponse> | null>(null);
  const [todayList, setTodayList] = useState<AppointmentResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponse | null>(null);
  const [docsList, setDocsList] = useState<CustomerDocumentStatusDto[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);

  useEffect(() => {
    if (selectedAppointment) {
      setIsLoadingDocs(true);
      apiClient
        .get(`/api/admin/appointments/${selectedAppointment.id}/documents`)
        .then((res) => {
          setDocsList(res.data.data || []);
        })
        .catch(() => setDocsList([]))
        .finally(() => setIsLoadingDocs(false));
    } else {
      setDocsList([]);
    }
  }, [selectedAppointment]);

  const handleToggleDocStatus = async (checklistItemId: number, currentStatus: boolean) => {
    if (!selectedAppointment) return;
    try {
      const updatedDocs = await updateAdminAppointmentDocumentStatus(selectedAppointment.id, {
        checklistItemId,
        isReceived: !currentStatus,
      });
      setDocsList(updatedDocs);
      toast.success("Document verification status updated!");
    } catch (err) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to update document status"));
    }
  };

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isTodayOnly) {
        const result = await getAdminTodayAppointments();
        setTodayList(result);
        setData(null);
      } else {
        const result = await getAdminAppointments(selectedStatus, page, 20);
        setData(result);
        setTodayList(null);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedStatus, isTodayOnly, page]);

  const handleStatusChange = async (
    id: number,
    newStatus: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
  ) => {
    setUpdatingId(id);
    try {
      await updateAdminAppointmentStatus(id, newStatus);
      toast.success("Appointment status updated successfully!");
      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      fetchAppointments();
    } catch (err) {
      toast.error(getDiagnosticErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  const maskPhone = (phoneStr: string) => {
    if (!phoneStr || phoneStr.length < 10) return phoneStr;
    return `${phoneStr.slice(0, 2)}******${phoneStr.slice(8)}`;
  };

  const formatTime12h = (timeStr: string) => {
    if (!timeStr) return "";
    const clean = timeStr.trim();
    if (clean.toUpperCase().includes("AM") || clean.toUpperCase().includes("PM")) {
      return clean;
    }
    const parts = clean.split(":");
    if (parts.length < 2) return clean;
    let hour = parseInt(parts[0], 10);
    const minute = parts[1].substring(0, 2);
    if (isNaN(hour)) return clean;

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;

    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const getStatusBadge = (statusStr: string) => {
    switch (statusStr?.toUpperCase()) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "CANCELLED":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "PENDING":
      default:
        return "bg-amber-100 text-amber-800 border-amber-300";
    }
  };

  const displayItems = isTodayOnly ? todayList || [] : data?.content || [];

  // Quick stats derived from currently loaded display items
  const stats = {
    total: displayItems.length,
    pending: displayItems.filter((i) => i.status?.toUpperCase() === "PENDING").length,
    confirmed: displayItems.filter((i) => i.status?.toUpperCase() === "CONFIRMED").length,
    completed: displayItems.filter((i) => i.status?.toUpperCase() === "COMPLETED").length,
    cancelled: displayItems.filter((i) => i.status?.toUpperCase() === "CANCELLED").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-orange-50 text-accent-dark border border-orange-200 px-3 py-1 rounded-full text-xs font-bold mb-1">
            <Calendar className="h-3.5 w-3.5 text-accent" />
            <span>Customer Appointments Desk</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {t("adminAppointments.title", "Appointment Management")}
          </h1>
          <p className="text-xs text-slate-500">
            {t("adminAppointments.subtitle", "View, filter, and manage citizen online booking appointments.")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isTodayOnly ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setIsTodayOnly(!isTodayOnly);
              setPage(0);
            }}
            className={`text-xs font-bold ${
              isTodayOnly ? "bg-accent text-white" : "border-slate-300 text-slate-700"
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5 mr-1" />
            <span>{t("adminAppointments.todaysBookings", "Today's Bookings")}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchAppointments}
            disabled={isLoading}
            className="text-xs font-bold border-slate-300 text-slate-700"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Improvement 4: Quick Stats Header Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 bg-slate-200 text-slate-700 rounded-lg shrink-0">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
              {isTodayOnly ? t("adminAppointments.todaysBookings", "Today's Bookings") : t("adminAppointments.totalBookings", "Total Bookings")}
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
              {t("adminAppointments.pending", "Pending")}
            </span>
            <span className="text-lg font-black text-amber-900 font-mono">
              {stats.pending}
            </span>
          </div>
        </div>

        <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg shrink-0">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-blue-700 block uppercase tracking-wider">
              {t("adminAppointments.confirmed", "Confirmed")}
            </span>
            <span className="text-lg font-black text-blue-900 font-mono">
              {stats.confirmed}
            </span>
          </div>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
            <CheckCircle className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-700 block uppercase tracking-wider">
              {t("adminAppointments.completed", "Completed")}
            </span>
            <span className="text-lg font-black text-emerald-900 font-mono">
              {stats.completed}
            </span>
          </div>
        </div>

        <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs col-span-2 sm:col-span-1">
          <div className="p-2.5 bg-rose-100 text-rose-700 rounded-lg shrink-0">
            <XCircle className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-rose-700 block uppercase tracking-wider">
              {t("adminAppointments.cancelled", "Cancelled")}
            </span>
            <span className="text-lg font-black text-rose-900 font-mono">
              {stats.cancelled}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      {!isTodayOnly && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>Status:</span>
          </span>
          {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setSelectedStatus(status);
                setPage(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                selectedStatus === status
                  ? "bg-[#0B2046] text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}

      {/* Content State */}
      {isLoading ? (
        <SkeletonLoader count={4} type="table" />
      ) : error ? (
        <ErrorAlert message={getDiagnosticErrorMessage(error)} onRetry={fetchAppointments} />
      ) : displayItems.length === 0 ? (
        /* Improvement 5: Better Empty State */
        <EmptyState
          title={t("adminAppointments.emptyTitle", "No Appointments Found")}
          description={
            isTodayOnly
              ? t("adminAppointments.emptyDescToday", "No appointments scheduled for today.")
              : selectedStatus !== "ALL"
              ? t("adminAppointments.emptyDescStatus", {
                  status: selectedStatus,
                  defaultValue: `No ${selectedStatus} appointments found matching the current filter.`,
                })
              : t("adminAppointments.emptyDescDefault", "No customer appointments found matching the filter criteria.")
          }
          icon={Calendar}
        />
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">ID & Date</th>
                    <th className="p-3.5 whitespace-nowrap">Slot Time</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Phone & Email</th>
                    <th className="p-3.5">Service</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {displayItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* ID & Date */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-slate-900">#APP-{item.id}</span>
                          <span className="block text-[11px] text-slate-500 font-mono">
                            {item.appointmentDate}
                          </span>
                        </div>
                      </td>

                      {/* Slot Time */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap inline-block">
                          {formatTime12h(item.appointmentTime)}
                        </span>
                      </td>

                      {/* Customer (Improvement 1: Notes preview removed) */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center shrink-0 text-xs border border-slate-200">
                            {item.name ? item.name.charAt(0).toUpperCase() : "C"}
                          </div>
                          <span className="font-bold text-slate-900 block">{item.name}</span>
                        </div>
                      </td>

                      {/* Phone & Email (Masked phone in table) */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 font-mono text-slate-700">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span>{maskPhone(item.phone)}</span>
                          </div>
                          {item.email && (
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate max-w-[160px]">
                              <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                              <span className="truncate">{item.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Service */}
                      <td className="p-3.5">
                        <span className="text-xs text-slate-700 font-semibold">
                          {item.serviceName || "General Inquiry"}
                        </span>
                      </td>

                      {/* Status (Improvement 3: Color-coded badge ONLY) */}
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border font-mono ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Actions (Improvement 1: View Details button with Eye icon) */}
                      <td className="p-3.5 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAppointment(item)}
                          className="h-8 px-2.5 text-xs font-bold border-slate-300 hover:border-accent hover:text-accent"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1 text-slate-500" />
                          <span>{t("adminAppointments.viewDetails", "View Details")}</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {!isTodayOnly && data && data.totalPages > 1 && (
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

      {/* Improvement 1 & 3: View Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    #APP-{selectedAppointment.id}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black border font-mono ${getStatusBadge(
                      selectedAppointment.status
                    )}`}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>
                <h3 className="text-lg font-black tracking-tight">
                  {t("adminAppointments.modalTitle", "Appointment Details")}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Customer Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 text-accent font-black flex items-center justify-center shrink-0 border border-accent/20 text-base">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {t("adminAppointments.customerName", "Customer Name")}
                    </span>
                    <span className="text-base font-black text-slate-900 block">
                      {selectedAppointment.name}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80 text-xs">
                  {/* Phone (UN-MASKED) */}
                  <div>
                    <span className="text-slate-500 font-medium block mb-0.5">
                      {t("adminAppointments.phone", "Phone Number")}
                    </span>
                    <a
                      href={`tel:${selectedAppointment.phone}`}
                      className="font-mono font-bold text-slate-900 hover:text-accent flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
                    >
                      <Phone className="h-3.5 w-3.5 text-accent" />
                      <span>{selectedAppointment.phone}</span>
                      <ExternalLink className="h-3 w-3 text-slate-400 ml-auto" />
                    </a>
                  </div>

                  {/* Email */}
                  <div>
                    <span className="text-slate-500 font-medium block mb-0.5">
                      {t("adminAppointments.email", "Email Address")}
                    </span>
                    {selectedAppointment.email ? (
                      <a
                        href={`mailto:${selectedAppointment.email}`}
                        className="font-medium text-slate-900 hover:text-accent flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs truncate"
                      >
                        <Mail className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span className="truncate">{selectedAppointment.email}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 italic block py-1.5">
                        {t("adminAppointments.notProvided", "Not provided")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Service & Time Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Tag className="h-3 w-3 text-slate-400" />
                    <span>{t("adminAppointments.service", "Service Requested")}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-900 block">
                    {selectedAppointment.serviceName || "General Inquiry"}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    <span>{t("adminAppointments.dateTime", "Date & Time")}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-900 block font-mono">
                    {selectedAppointment.appointmentDate}
                  </span>
                  <span className="text-[11px] font-semibold text-accent block font-mono mt-0.5">
                    {formatTime12h(selectedAppointment.appointmentTime)}
                  </span>
                </div>
              </div>

              {/* Full Notes / Special Request */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  <span>{t("adminAppointments.notes", "Special Request / Notes")}</span>
                </span>
                {selectedAppointment.notes && selectedAppointment.notes.trim() ? (
                  <p className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-wrap leading-relaxed font-medium">
                    {selectedAppointment.notes}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    {t("adminAppointments.noNotes", "No notes or special request provided by customer.")}
                  </p>
                )}
              </div>

              {/* Document Verification Section */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-primary" />
                    Required Document Verification Checklist
                  </span>
                  {docsList.length > 0 && (
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {docsList.filter((d) => d.isReceived).length} / {docsList.length} Verified
                    </span>
                  )}
                </div>

                {isLoadingDocs ? (
                  <p className="text-xs text-slate-400 italic">Checking document requirements...</p>
                ) : docsList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-white p-3 rounded-lg border border-slate-200">
                    No specific document checklist defined for this service category.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {docsList.map((doc) => (
                      <label
                        key={doc.checklistItemId}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          doc.isReceived
                            ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
                            : "bg-white border-slate-200 text-slate-800 hover:bg-slate-100/60"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={doc.isReceived}
                          onChange={() => handleToggleDocStatus(doc.checklistItemId, doc.isReceived)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary shrink-0"
                        />
                        <div className="text-xs">
                          <span className="font-bold block">{doc.itemEn}</span>
                          <span className="text-[11px] text-slate-500 font-medium block">{doc.itemHi}</span>
                          <span className="text-[10px] font-semibold block mt-0.5">
                            {doc.isReceived ? "✓ Marked as Received & Verified" : "⏳ Pending Customer Submission"}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Created At Timestamp */}
              {selectedAppointment.createdAt && (
                <div className="text-[11px] text-slate-500 font-mono text-right">
                  {t("adminAppointments.createdAt", "Booking Created At")}:{" "}
                  <span className="font-bold text-slate-700">
                    {new Date(selectedAppointment.createdAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Modal Footer with Status Dropdown */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-700 shrink-0">
                  {t("adminAppointments.updateStatus", "Update Status")}:
                </span>
                <select
                  disabled={updatingId === selectedAppointment.id}
                  value={selectedAppointment.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedAppointment.id,
                      e.target.value as "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
                    )
                  }
                  className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white font-bold text-slate-800 focus:outline-none focus:border-accent w-full sm:w-auto cursor-pointer"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAppointment(null)}
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

export default AdminAppointmentsPage;
